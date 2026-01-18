export interface FilterSkinDto {
  weapon?: string;
  condition?: string;
  priceFrom?: number;
  priceTo?: number;
  isStatTrak?: 'Y' | 'N';
  isAvailable?: 'Y' | 'N';
  name?: string;
}
