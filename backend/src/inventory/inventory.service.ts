import { Injectable, BadRequestException } from '@nestjs/common';
import { SweetsService } from '../sweets/sweets.service';

@Injectable()
export class InventoryService {
  constructor(private sweetsService: SweetsService) {}

  async purchase(sweetId: string) {
    const sweet = await this.sweetsService.findOne(sweetId);

    if (sweet.quantity === 0) {
      throw new BadRequestException('Cannot purchase: sweet is out of stock');
    }

    return this.sweetsService.update(sweetId, {
      quantity: sweet.quantity - 1,
    });
  }

  async restock(sweetId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Restock amount must be positive');
    }

    const sweet = await this.sweetsService.findOne(sweetId);

    return this.sweetsService.update(sweetId, {
      quantity: sweet.quantity + amount,
    });
  }
}

