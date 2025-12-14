import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('sweets')
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  // PUBLIC
  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  // PUBLIC (keep search BEFORE :id)
  @Get('search')
  search(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.sweetsService.search({
      name,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  // PUBLIC
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetsService.findOne(id);
  }

  // AUTH REQUIRED
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.create(createSweetDto);
  }

  // AUTH REQUIRED
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(id, updateSweetDto);
  }

  // ADMIN ONLY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }
}




