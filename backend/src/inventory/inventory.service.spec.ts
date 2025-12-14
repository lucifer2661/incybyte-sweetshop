import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { SweetsService } from '../sweets/sweets.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let sweetsService: SweetsService;
  let prisma: PrismaService;

  const mockSweetsService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockPrismaService = {
    sweet: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: SweetsService,
          useValue: mockSweetsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    sweetsService = module.get<SweetsService>(SweetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSweet = {
        ...sweet,
        quantity: 9,
      };

      mockSweetsService.findOne.mockResolvedValue(sweet);
      mockSweetsService.update.mockResolvedValue(updatedSweet);

      const result = await service.purchase('sweet-id');

      expect(mockSweetsService.findOne).toHaveBeenCalledWith('sweet-id');
      expect(mockSweetsService.update).toHaveBeenCalledWith('sweet-id', {
        quantity: 9,
      });
      expect(result).toEqual(updatedSweet);
    });

    it('should throw error if sweet not found', async () => {
      mockSweetsService.findOne.mockRejectedValue(
        new NotFoundException('Sweet not found'),
      );

      await expect(service.purchase('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw error if quantity is zero', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSweetsService.findOne.mockResolvedValue(sweet);

      await expect(service.purchase('sweet-id')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockSweetsService.update).not.toHaveBeenCalled();
    });
  });

  describe('restock', () => {
    it('should restock a sweet and increase quantity', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSweet = {
        ...sweet,
        quantity: 20,
      };

      mockSweetsService.findOne.mockResolvedValue(sweet);
      mockSweetsService.update.mockResolvedValue(updatedSweet);

      const result = await service.restock('sweet-id', 10);

      expect(mockSweetsService.findOne).toHaveBeenCalledWith('sweet-id');
      expect(mockSweetsService.update).toHaveBeenCalledWith('sweet-id', {
        quantity: 20,
      });
      expect(result).toEqual(updatedSweet);
    });

    it('should throw error if sweet not found', async () => {
      mockSweetsService.findOne.mockRejectedValue(
        new NotFoundException('Sweet not found'),
      );

      await expect(service.restock('non-existent-id', 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error if restock amount is negative', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSweetsService.findOne.mockResolvedValue(sweet);

      await expect(service.restock('sweet-id', -5)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockSweetsService.update).not.toHaveBeenCalled();
    });
  });
});

