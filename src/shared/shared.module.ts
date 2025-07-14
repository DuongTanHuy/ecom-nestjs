import { Global, Module } from '@nestjs/common'
import { SharedService } from './services/shared.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'

const sharedService = [SharedService, PrismaService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: sharedService,
  exports: sharedService
})
export class SharedModule {}
