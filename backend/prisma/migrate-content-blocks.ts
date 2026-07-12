import { PrismaClient } from '@prisma/client'

// Converts legacy content_section configs (contents: string[] + a single
// section-wide sideImage) to the current shape (contents: { text, image? }[]).
// Safe to run multiple times: pages already in the new shape are skipped.

const prisma = new PrismaClient()

async function main() {
  const pages = await prisma.chapterPage.findMany({ where: { type: 'content_section' } })

  let migrated = 0
  let skipped = 0

  for (const page of pages) {
    const config = JSON.parse(page.config) as Record<string, unknown>
    const contents = config.contents

    if (!Array.isArray(contents) || contents.length === 0 || !contents.some((block) => typeof block === 'string')) {
      skipped++
      continue
    }

    const sideImage = typeof config.sideImage === 'string' ? config.sideImage : undefined
    const migratedContents = contents.map((block) =>
      typeof block === 'string' ? (sideImage ? { text: block, image: sideImage } : { text: block }) : block
    )

    const { sideImage: _legacySideImage, ...rest } = config
    const newConfig = { ...rest, contents: migratedContents }

    await prisma.chapterPage.update({
      where: { id: page.id },
      data: { config: JSON.stringify(newConfig) },
    })

    console.log(
      `Migrated page ${page.id} (chapter ${page.chapterId}, order ${page.orderNumber}): ${migratedContents.length} block(s)`
    )
    migrated++
  }

  console.log(`\nDone. Migrated ${migrated} page(s), skipped ${skipped} page(s) already in the current format.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
