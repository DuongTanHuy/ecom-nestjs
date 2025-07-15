import { Exclude, Type } from 'class-transformer'
import { IsEmail, IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/validator.decorator'

export class LoginBodyDTO {
  @IsEmail()
  email: string

  @IsString()
  @Length(6, 20, {
    message: 'Password must be from 6 to 20 characters'
  })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial?: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDto extends LoginBodyDTO {
  @IsString()
  name: string

  @IsString()
  @Match('password')
  confirm_password: string
}

export class RegisterResDTO {
  id: number
  email: string
  name: string
  avatar: string
  bio: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string

  // @Expose()
  // get emailName() {
  //   return this.email + this.name
  // }

  constructor(partial?: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}

// Neu muon su dung SerializeOptions trong khi transform response data ma khong bi loi do SerializeOptions khong xu ly nested duoc

class RegisterData {
  id: number
  email: string
  name: string
  avatar: string
  bio: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string

  constructor(partial?: Partial<RegisterData>) {
    Object.assign(this, partial)
  }
}

class SuccessResDTO {
  status: string
  data: RegisterData

  constructor(partial?: Partial<SuccessResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterResNestedDTO extends SuccessResDTO {
  @Type(() => RegisterData)
  declare data: RegisterData

  constructor(partial?: Partial<RegisterResNestedDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}

export class LogoutResDTO {
  @IsString()
  message: string

  constructor(partial?: Partial<LogoutResDTO>) {
    Object.assign(this, partial)
  }
}
