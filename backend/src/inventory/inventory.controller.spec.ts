import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockInventoryService = {
    purchase: jest.fn(),
    restock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('purchase', () => {
    it('should purchase a sweet', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInventoryService.purchase.mockResolvedValue(sweet);

      const result = await controller.purchase('sweet-id');

      expect(service.purchase).toHaveBeenCalledWith('sweet-id');
      expect(result).toEqual(sweet);
    });
  });

  describe('restock', () => {
    it('should restock a sweet', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInventoryService.restock.mockResolvedValue(sweet);

      const result = await controller.restock('sweet-id', { amount: 10 });

      expect(service.restock).toHaveBeenCalledWith('sweet-id', 10);
      expect(result).toEqual(sweet);
    });
  });
});

