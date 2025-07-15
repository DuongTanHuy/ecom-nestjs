import { Exclude } from 'class-transformer'

export class UserModel {
  id: number
  name: string
  avatar: string
  bio: string
  email: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string

  constructor(partial?: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}
