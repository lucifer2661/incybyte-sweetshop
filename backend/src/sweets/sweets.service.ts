import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSweetDto: CreateSweetDto) {
    if (createSweetDto.price <= 0) {
      throw new BadRequestException('Price must be positive');
    }

    if (createSweetDto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    return this.prisma.sweet.create({
      data: createSweetDto,
    });
  }

  async findAll() {
    return this.prisma.sweet.findMany();
  }

  async search(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const where: any = {};

    if (params.name) {
      where.name = { contains: params.name, mode: 'insensitive' };
    }

    if (params.category) {
      where.category = { contains: params.category, mode: 'insensitive' };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) {
        where.price.gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        where.price.lte = params.maxPrice;
      }
    }

    return this.prisma.sweet.findMany({ where });
  }

  async findOne(id: string) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${id} not found`);
    }

    return sweet;
  }

  async update(id: string, updateSweetDto: UpdateSweetDto) {
    await this.findOne(id);

    if (updateSweetDto.price !== undefined && updateSweetDto.price <= 0) {
      throw new BadRequestException('Price must be positive');
    }

    if (updateSweetDto.quantity !== undefined && updateSweetDto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    return this.prisma.sweet.update({
      where: { id },
      data: updateSweetDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.sweet.delete({
      where: { id },
    });
  }
}

