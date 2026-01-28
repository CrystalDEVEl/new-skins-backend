import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
} from "@nestjs/common";
import { SkinService } from "./skin.service";
import type { FilterSkinDto } from "./dto/filter.dto";

@Controller("skins")
export class SkinController {
  constructor(private readonly skinService: SkinService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() filters: FilterSkinDto) {
    return this.skinService.findAll(filters);
  }

  @Get(":id")
  @HttpCode(200)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.skinService.findOne(id);
  }
}
