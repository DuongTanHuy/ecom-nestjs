import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { PostModel } from 'src/shared/models/post.model'
import { UserModel } from 'src/shared/models/user.model'

export class GetPostDto extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>

  constructor(partial?: Partial<GetPostDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class CreatePostDto {
  @IsString()
  title: string

  @IsString()
  content: string
}

export class CretePostResDto extends PostModel {
  author: Omit<UserModel, 'password'>

  constructor(partial?: Partial<CretePostResDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
