import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsController } from 'src/posts/posts.controller'
import { PostsService } from 'src/posts/posts.service'

@Module({
  imports: [],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService]
})
export class AppModule {}
