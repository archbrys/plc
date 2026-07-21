export const CHAPTER_GROUPS: { value: string; label: string }[] = [{ value: 'LABORATORY', label: 'Laboratory' }]

export function chapterGroupLabel(value: string): string {
  return CHAPTER_GROUPS.find((group) => group.value === value)?.label ?? value
}
