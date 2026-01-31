import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { SkinModule } from "src/skin/skin.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot(), SkinModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
