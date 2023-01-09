import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(bodyParser.raw({type:'application/octet-stream', limit:'20mb'}));
  app.use(cookieParser());
  app.set("trust proxy", true);

  await fs.promises.mkdir("./data/uploads/_temp", { recursive: true });

  app.setGlobalPrefix("api");
  await app.listen(8080);
}
bootstrap();
