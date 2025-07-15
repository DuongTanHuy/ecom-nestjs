export class PostModel {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  authorId: number

  constructor(partial?: Partial<PostModel>) {
    Object.assign(this, partial)
  }
}
