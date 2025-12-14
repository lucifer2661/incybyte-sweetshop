import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post(':id/purchase')
  purchase(@Param('id') id: string) {
    return this.inventoryService.purchase(id);
  }

  @Post(':id/restock')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  restock(@Param('id') id: string, @Body() restockDto: RestockDto) {
    return this.inventoryService.restock(id, restockDto.amount);
  }
}

