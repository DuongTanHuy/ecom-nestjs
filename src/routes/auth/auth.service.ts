import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { LoginBodyDTO, LogoutBodyDTO, RegisterBodyDto } from 'src/routes/auth/dto/auth.dto'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { PrismaService } from 'src/shared/services/prisma.service'
import { SharedService } from 'src/shared/services/shared.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly sharedService: SharedService,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}

  async signTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload)
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: decodedRefreshToken.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000)
      }
    })

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken
        }
      })

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })

      return this.signTokens({ userId })
    } catch (error) {
      console.log(error)
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is not exist and may be published!')
      }
      throw new UnauthorizedException('Refresh token is invalid!')
    }
  }

  async register({ name, email, password }: RegisterBodyDto) {
    try {
      const hashedPassword = await this.sharedService.hash(password)
      const newUser = await this.prismaService.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      return newUser
    } catch (error) {
      console.log(error)
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exist!')
      }
    }
  }

  async login({ email, password }: LoginBodyDTO) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (!userExist) {
      throw new UnauthorizedException('Account is not exist!')
    }

    const isPasswordMatch = await this.sharedService.compare(password, userExist.password)

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException({
        field: 'password',
        error: 'Password is invalid!'
      })
    }

    const tokens = await this.signTokens({ userId: userExist.id })

    return tokens
  }

  async logout({ refreshToken }: LogoutBodyDTO) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })

      return {
        message: 'Logout successfully'
      }
    } catch (error) {
      console.log(error)
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token is not exist and may be published!')
      }
      throw new UnauthorizedException('Refresh token is invalid!')
    }
  }
}
