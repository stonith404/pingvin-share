import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import * as fs from "fs";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await fs.promises.mkdir("./data/uploads/_temp", { recursive: true });

  app.setGlobalPrefix("api");
  await app.listen(8080);
}
bootstrap();
