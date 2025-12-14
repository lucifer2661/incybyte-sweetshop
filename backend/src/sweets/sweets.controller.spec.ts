import { Test, TestingModule } from '@nestjs/testing';
import { SweetsController } from './sweets.controller';
import { SweetsService } from './sweets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('SweetsController', () => {
  let controller: SweetsController;
  let service: SweetsService;

  const mockSweetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SweetsController],
      providers: [
        {
          provide: SweetsService,
          useValue: mockSweetsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SweetsController>(SweetsController);
    service = module.get<SweetsService>(SweetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a sweet', async () => {
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

      mockSweetsService.create.mockResolvedValue(createdSweet);

      const result = await controller.create(createSweetDto);

      expect(service.create).toHaveBeenCalledWith(createSweetDto);
      expect(result).toEqual(createdSweet);
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
      ];

      mockSweetsService.findAll.mockResolvedValue(sweets);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(sweets);
    });
  });

  describe('search', () => {
    it('should search sweets', async () => {
      const query = {
        name: 'Chocolate',
        category: 'Chocolate',
        minPrice: '1',
        maxPrice: '10',
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

      mockSweetsService.search.mockResolvedValue(sweets);

      const result = await controller.search(query);

      expect(service.search).toHaveBeenCalledWith({
        name: 'Chocolate',
        category: 'Chocolate',
        minPrice: 1,
        maxPrice: 10,
      });
      expect(result).toEqual(sweets);
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

      mockSweetsService.update.mockResolvedValue(updatedSweet);

      const result = await controller.update('sweet-id', updateSweetDto);

      expect(service.update).toHaveBeenCalledWith('sweet-id', updateSweetDto);
      expect(result).toEqual(updatedSweet);
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

      mockSweetsService.remove.mockResolvedValue(sweet);

      const result = await controller.remove('sweet-id');

      expect(service.remove).toHaveBeenCalledWith('sweet-id');
      expect(result).toEqual(sweet);
    });
  });
});

