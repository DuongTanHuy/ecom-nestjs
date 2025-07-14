import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDto,
  RegisterResDTO
} from 'src/routes/auth/dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseInterceptors(ClassSerializerInterceptor) -> khai bao global o app.module
  // @SerializeOptions({ type: RegisterResNestedDTO }) // -> khi su dung interceptor de transform data tra ve thi dung decorator nay khong co tac dung (khong xu ly nested duoc interceptor da chuyen response data chuyen vao key data)
  @Post('register')
  async register(@Body() registerBodyDto: RegisterBodyDto) {
    const result = await this.authService.register(registerBodyDto)

    // return result

    return new RegisterResDTO(result) // -> co the dung SerializeOptions decorator
  }

  @Post('login')
  async login(@Body() loginBodyDto: LoginBodyDTO) {
    const result = await this.authService.login(loginBodyDto)

    return new LoginResDTO(result)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    const result = await this.authService.refreshToken(body.refreshToken)

    return new RefreshTokenResDTO(result)
  }
}
