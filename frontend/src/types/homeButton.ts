export type HomeButtonTargetType = 'CHAPTER' | 'ROUTE'

export interface HomeButton {
  id: number
  label: string
  orderNumber: number
  targetType: HomeButtonTargetType
  chapterId: number | null
  route: string | null
  isActive: boolean
}
