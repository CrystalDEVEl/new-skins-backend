import { Module } from '@nestjs/common';
import { SkinService } from './skin.service';
import { SkinController } from './skin.controller';

@Module({
  controllers: [SkinController],
  providers: [SkinService],
})
export class SkinModule {}
