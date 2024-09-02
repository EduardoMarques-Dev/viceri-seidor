import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  ArrayNotContains,
  ArrayUnique,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { GenericDto } from '../../../../generic-module/crud/model/dto/generic.dto';
/**
 * Data Transfer Object (DTO) for creating a user.
 */
export class UserCreateDto implements GenericDto {
  /**
   * This property is a tag that marks that the class is a DTO.
   * This property is hidden from Swagger documentation.
   */
  @ApiHideProperty()
  @Exclude()
  isDto: boolean;

  /**
   * The first name of the user.
   * @example 'Harry'
   */
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'Harry',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  /**
   * User's email address.
   * @example 'user@email.com'
   */
  @ApiProperty({
    description: "User's email address.",
    example: 'user@email.com',
  })
  @IsEmail()
  email: string;

  /**
   * User's password.
   *
   * **Password requirements:**
   * - Minimum of 4 characters
   * - Maximum of 20 characters
   * - Must contain at least one special character
   * - Must contain at least one uppercase letter
   * - Must contain at least one lowercase letter
   * - No spaces allowed
   *
   * @example 'Password123!'
   */
  @ApiProperty({
    description: `User's password. Password requirements: Minimum of 4 characters, maximum of 20 characters, at least one special character, one uppercase letter, one lowercase letter, and no spaces allowed.`,
    example: 'Password123!',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])(?!.*\s).{4,20}$/, {
    message:
      'Password requirements: At least 4 characters, up to 20 characters, one special character, one uppercase letter, one lowercase letter, and no spaces are allowed.',
  })
  password: string;

  /**
   * The roles assigned to the user.
   * @example ['USER']

   */
  @ApiProperty({
    description: 'The roles assigned to the user.',
    example: ['USER'],
    isArray: true,
  })
  @IsEnum(RoleType, { each: true })
  @ArrayUnique()
  @ArrayNotContains([RoleType.ADMIN])
  @IsOptional()
  roles: RoleType[];
}
