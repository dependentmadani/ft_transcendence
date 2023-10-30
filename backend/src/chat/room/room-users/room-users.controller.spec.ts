import { Test, TestingModule } from '@nestjs/testing';
import { RoomUsersController } from './room-users.controller';

describe('RoomUsersController', () => {
  let controller: RoomUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomUsersController],
    }).compile();

    controller = module.get<RoomUsersController>(RoomUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
