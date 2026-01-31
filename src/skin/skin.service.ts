import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterSkinDto } from "./dto/filter.dto";
import { SkinCondition } from "../../prisma/generated/prisma/enums";
import { SkinWhereInput } from "prisma/generated/prisma/models";

@Injectable()
export class SkinService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterSkinDto = {}) {
    const where: SkinWhereInput = {};

    if (filters.weapon) {
      where.weapon = {
        equals: filters.weapon,
      };
    }

    if (filters.condition) {
      const conditionValue = filters.condition.toUpperCase();
      if (
        Object.values(SkinCondition).includes(conditionValue as SkinCondition)
      ) {
        where.condition = conditionValue as SkinCondition;
      }
    }

    if (filters.priceFrom !== undefined || filters.priceTo !== undefined) {
      where.price = {};
      if (filters.priceFrom !== undefined) {
        where.price.gte = filters.priceFrom;
      }
      if (filters.priceTo !== undefined) {
        where.price.lte = filters.priceTo;
      }
    }

    if (filters.isStatTrak !== undefined) {
      where.isStatTrak = filters.isStatTrak === "Y";
    }

    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable === "Y";
    }

    if (filters.name) {
      where.name = {
        contains: filters.name,
      };
    }

    return this.prisma.skin.findMany({
      where,
      include: {
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const skin = await this.prisma.skin.findUnique({
      where: {
        id,
      },
      include: {
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!skin) {
      throw new NotFoundException(`Скин с ID ${id} не найден`);
    }

    return skin;
  }
}
