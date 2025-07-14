import { Module } from '@nestjs/common'

import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { PostsModule } from 'src/routes/posts/posts.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [SharedModule, PostsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
