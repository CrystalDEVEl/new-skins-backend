import { NestFactory } from "@nestjs/core";

import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");

  const port = process.env.PORT ?? 3000;

  await app.listen(port).then(() => {
    console.log("SERVER RUNS AT PORT " + port);
  });
}
bootstrap();
