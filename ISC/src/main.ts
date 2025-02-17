import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerService } from './config/swagger/swagger.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  new SwaggerService().init(app);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
