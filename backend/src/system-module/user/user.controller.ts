import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ControllerOptions,
  ControllerOptionsBuilder,
} from '../../generic-module/common/builder/controller-options.builder';
import { GenericController } from '../../generic-module/crud/generic.controller';
import { Viceri_IsPublic } from '../../security-module/decorators/is-public.decorator';
import { UserCreateDto } from './model/dto/user-create.dto';
import { UserUpdateDto } from './model/dto/user-update.dto';
import { UserDto } from './model/dto/user.dto';
import { UserModel } from './model/user.model';
import { UserService } from './user.service';
/**
 * Controller responsible for handling operations related to users.
 * This controller extends the `GenericController` to manage user-related CRUD operations.
 */
@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController extends GenericController<UserModel> {
  /**
   * Creates an instance of UserController.
   *
   * @param {UserService} userService - The service responsible for handling user-related operations.
   */
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  /**
   * Retrieves a list of users based on the provided query parameters.
   *
   * @async
   * @returns {Promise<UserDto[]>} A Promise that resolves to an array of UserDto objects.
   */
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of items to return.',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of items to skip.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of users.',
    type: [UserDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @Get()
  async findAll(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('page') page: number,
  ): Promise<UserDto[]> {
    const options: ControllerOptions<UserDto> =
      ControllerOptionsBuilder.returnType(UserDto)
        .take(take)
        .skip(skip)
        .page(page)
        .build();
    return (await this.genericFindMany(options)) as UserDto[];
  }

  /**
   * Retrieves a single user based on the provided unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<UserDto>} A Promise that resolves to a UserDto object.
   */
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user.',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return (await this.genericFindFirst(id, {
      returnType: UserDto,
    })) as UserDto;
  }

  /**
   * Creates a new user.
   *
   * @async
   * @param {UserCreateDto} inputDto - The data transfer object containing user creation details.
   * @returns {Promise<UserDto>} A Promise that resolves to the created UserDto object.
   */
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation failed.',
  })
  @Viceri_IsPublic()
  @Post()
  async create(@Body() inputDto: UserCreateDto): Promise<UserDto> {
    inputDto.roles = inputDto.roles || ['USER']; // Set default role here

    return (await this.genericCreate(inputDto, {
      returnType: UserDto,
    })) as UserDto;
  }

  /**
   * Updates an existing user.
   *
   * @async
   * @param {string} id - The unique identifier of the user to update.
   * @param {UserUpdateDto} model - The data transfer object containing updated user details.
   * @returns {Promise<UserDto>} A Promise that resolves to the updated UserDto object.
   */
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() model: UserUpdateDto,
  ): Promise<UserDto> {
    return (await this.genericUpdate(id, model, {
      returnType: UserDto,
    })) as UserDto;
  }

  /**
   * Deletes a user.
   *
   * @async
   * @param {string} id - The unique identifier of the user to delete.
   * @returns {Promise<void>} A Promise that resolves when the user record is deleted.
   */
  @ApiResponse({
    status: 204,
    description: 'User successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.genericDelete(id);
  }
}
