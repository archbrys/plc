export type HomeButtonTargetType = 'CHAPTER' | 'ROUTE' | 'GROUP'

export interface HomeButton {
  id: number
  label: string
  orderNumber: number
  targetType: HomeButtonTargetType
  chapterId: number | null
  route: string | null
  chapterGroup: string | null
  isActive: boolean
  requiredQuestionSetIds: string[]
  locked: boolean
}
