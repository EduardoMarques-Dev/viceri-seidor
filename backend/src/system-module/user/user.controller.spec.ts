import { Test, TestingModule } from '@nestjs/testing';
import {
  getMockUserCreateDto,
  getMockUserDto,
  getMockUserModel,
  getMockUserUpdateDto,
} from '../../generic-module/testing/mock.service';
import { UserDto } from './model/dto/user.dto';
import { UserModel } from './model/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockUserService = {
      genericFindFirst: jest.fn().mockResolvedValue({
        isPresent: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(getMockUserModel()),
      }),
      genericCreate: jest.fn().mockResolvedValue(getMockUserModel()),
      genericUpdate: jest.fn().mockResolvedValue({
        isPresent: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue(getMockUserModel()),
      }),
      genericDelete: jest.fn().mockResolvedValue(undefined),
      getModelConstructor: jest.fn().mockReturnValue(UserModel),
      PrepareFindAllArgs: jest.fn().mockReturnValue({}),
      prepareFindFirstArgs: jest.fn().mockReturnValue({}),
      convertModelToDomain: jest.fn().mockReturnValue(getMockUserModel()),
      PrepareCreateArgs: jest.fn().mockReturnValue({}),
      genericFindMany: jest.fn().mockResolvedValue([getMockUserModel()]),
      convertToType: jest.fn().mockReturnValue(getMockUserDto()),
      PrepareUpdateArgs: jest.fn().mockReturnValue({
        data: getMockUserUpdateDto(),
        where: { id: 'user123' },
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    service = moduleRef.get<UserService>(UserService);
  });

  it('should return a list of users based on query parameters', async () => {
    const take = 10;
    const skip = 0;
    const page = 1;

    const result = await controller.findAll(take, skip, page);

    expect(service.PrepareFindAllArgs).toHaveBeenCalledWith({
      returnType: UserDto,
      take,
      skip,
    });
    expect(service.genericFindMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(UserDto);
  });

  it('should return a list of users based on query parameters', async () => {
    const take = 10;
    const skip = 0;
    const page = 1;

    const result = await controller.findAll(take, skip, page);

    expect(service.PrepareFindAllArgs).toHaveBeenCalledWith({
      returnType: UserDto,
      take,
      skip,
    });
    expect(service.genericFindMany).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(UserDto);
  });

  it('should return a user by ID', async () => {
    const userId = 'user123';

    const result = await controller.findOne(userId);

    expect(service.prepareFindFirstArgs).toHaveBeenCalledWith(userId);
    expect(service.genericFindFirst).toHaveBeenCalled();
    expect(result).toBeInstanceOf(UserDto);
  });

  it('should create a new user', async () => {
    const userCreateDto = getMockUserCreateDto();

    const result = await controller.create(userCreateDto);

    expect(service.PrepareCreateArgs).toHaveBeenCalled();
    expect(service.genericCreate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(UserDto);
  });

  // caduu
  it('should update a user by ID', async () => {
    const userId = 'user123';
    const userUpdateDto = getMockUserUpdateDto();
    const userModel = new UserModel();

    jest.spyOn(service, 'convertModelToDomain').mockReturnValue(userModel);

    const result = await controller.update(userId, userUpdateDto);

    expect(service.PrepareUpdateArgs).toHaveBeenCalledWith(userModel, userId);
    expect(service.genericUpdate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(UserDto);
  });

  it('should delete a user by ID', async () => {
    const userId = 'user123';

    await controller.delete(userId);

    expect(service.genericDelete).toHaveBeenCalledWith({
      where: { id: 'user123' },
    });
  });
});
