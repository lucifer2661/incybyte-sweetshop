import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { SweetsModule } from '../sweets/sweets.module';

@Module({
  imports: [SweetsModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

