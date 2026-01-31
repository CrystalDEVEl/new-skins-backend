import { IsString, IsOptional, IsNumber, IsIn } from "class-validator";
import { Type } from "class-transformer";

export class FilterSkinDto {
  @IsOptional()
  @IsString()
  weapon?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceTo?: number;

  @IsOptional()
  @IsIn(["Y", "N"])
  isStatTrak?: "Y" | "N";

  @IsOptional()
  @IsIn(["Y", "N"])
  isAvailable?: "Y" | "N";

  @IsOptional()
  @IsString()
  name?: string;
}
