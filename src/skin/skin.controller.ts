import { Controller, Get, Query } from '@nestjs/common';
import { SkinService } from './skin.service';
import type { FilterSkinDto } from './dto/filter-skin.dto';

@Controller('skin')
export class SkinController {
  constructor(private readonly skinService: SkinService) { }
  
  @Get()
  async findAll(@Query() filters: FilterSkinDto) {
    return this.skinService.findAll(filters)
  }
}
