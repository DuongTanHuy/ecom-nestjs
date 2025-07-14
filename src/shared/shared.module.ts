import { Global, Module } from '@nestjs/common'
import { SharedService } from './services/shared.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const sharedService = [SharedService, PrismaService]

@Global()
@Module({
  providers: sharedService,
  exports: sharedService
})
export class SharedModule {}
