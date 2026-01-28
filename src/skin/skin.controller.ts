import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  NotFoundException,
  HttpStatus,
} from "@nestjs/common";
import { SkinService } from "./skin.service";
import type { FilterSkinDto } from "./dto/filter.dto";

@Controller("skins")
export class SkinController {
  constructor(private readonly skinService: SkinService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: FilterSkinDto) {
    return this.skinService.findAll(filters);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const skin = await this.skinService.findOne(id);

    if (!skin) {
      throw new NotFoundException(`Скин с ID ${id} не найден`);
    }

    return skin;
  }
}
