import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import envConfig from 'src/shared/config'
import { LoggerInterceptor } from 'src/shared/interceptor/logger.interceptor'
import { TransformInterceptor } from 'src/shared/interceptor/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new LoggerInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tu dong loai bo cac field khong co decorator
      forbidNonWhitelisted: true, // Bao loi neu data truyen len co field khong duoc decorator
      transform: true, // Tu dong chuyen hoa du lieu (body) sang kieu duoc khai bao trong dto
      transformOptions: {
        enableImplicitConversion: true // Tu dong chuyen kieu du lieu sang kieu duoc decorator trong dto
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((validationError) => ({
            filed: validationError.property,
            error: Object.values(
              validationError.constraints as {
                [type: string]: string
              }
            ).join(', ')
          }))
        )
      }
    })
  )
  await app.listen(envConfig.POST ?? 4000)
}

bootstrap()
