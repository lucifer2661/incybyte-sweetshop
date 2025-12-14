import { Test, TestingModule } from '@nestjs/testing';
import { SweetsService } from './sweets.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SweetsService', () => {
  let service: SweetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SweetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SweetsService>(SweetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sweet', async () => {
      const createSweetDto = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
      };

      const createdSweet = {
        id: 'sweet-id',
        ...createSweetDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.create.mockResolvedValue(createdSweet);

      const result = await service.create(createSweetDto);

      expect(mockPrismaService.sweet.create).toHaveBeenCalledWith({
        data: createSweetDto,
      });
      expect(result).toEqual(createdSweet);
    });

    it('should throw error if price is negative', async () => {
      const createSweetDto = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: -5.99,
        quantity: 10,
      };

      await expect(service.create(createSweetDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if quantity is negative', async () => {
      const createSweetDto = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: -10,
      };

      await expect(service.create(createSweetDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all sweets', async () => {
      const sweets = [
        {
          id: 'sweet-1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'sweet-2',
          name: 'Candy',
          category: 'Hard Candy',
          price: 2.99,
          quantity: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.findAll();

      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
      expect(result).toEqual(sweets);
    });
  });

  describe('search', () => {
    it('should search sweets by name', async () => {
      const searchParams = { name: 'Chocolate' };
      const sweets = [
        {
          id: 'sweet-1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.search(searchParams);

      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Chocolate', mode: 'insensitive' },
        },
      });
      expect(result).toEqual(sweets);
    });

    it('should search sweets with multiple filters', async () => {
      const searchParams = {
        name: 'Chocolate',
        category: 'Chocolate',
        minPrice: 1,
        maxPrice: 10,
      };

      const sweets = [
        {
          id: 'sweet-1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(sweets);

      const result = await service.search(searchParams);

      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Chocolate', mode: 'insensitive' },
          category: { contains: 'Chocolate', mode: 'insensitive' },
          price: { gte: 1, lte: 10 },
        },
      });
      expect(result).toEqual(sweets);
    });
  });

  describe('findOne', () => {
    it('should return a sweet by id', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);

      const result = await service.findOne('sweet-id');

      expect(mockPrismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: 'sweet-id' },
      });
      expect(result).toEqual(sweet);
    });

    it('should throw error if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sweet', async () => {
      const updateSweetDto = {
        name: 'Updated Chocolate Bar',
        price: 6.99,
      };

      const updatedSweet = {
        id: 'sweet-id',
        name: 'Updated Chocolate Bar',
        category: 'Chocolate',
        price: 6.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue({
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockPrismaService.sweet.update.mockResolvedValue(updatedSweet);

      const result = await service.update('sweet-id', updateSweetDto);

      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: 'sweet-id' },
        data: updateSweetDto,
      });
      expect(result).toEqual(updatedSweet);
    });

    it('should throw error if price is negative', async () => {
      const updateSweetDto = { price: -5.99 };

      mockPrismaService.sweet.findUnique.mockResolvedValue({
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.update('sweet-id', updateSweetDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a sweet', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(sweet);
      mockPrismaService.sweet.delete.mockResolvedValue(sweet);

      const result = await service.remove('sweet-id');

      expect(mockPrismaService.sweet.delete).toHaveBeenCalledWith({
        where: { id: 'sweet-id' },
      });
      expect(result).toEqual(sweet);
    });

    it('should throw error if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});

