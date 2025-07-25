import { ClassSerializerInterceptor, Module } from '@nestjs/common'

import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { PostsModule } from 'src/routes/posts/posts.module'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [PostsModule, SharedModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
