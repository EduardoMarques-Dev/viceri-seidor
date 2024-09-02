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
 * Data Transfer Object (DTO) for a user.
 */
export class UserDto implements GenericDto {
  /**
   * A tag that marks that the class is a DTO.
   * This property is hidden from Swagger documentation.
   */
  @ApiHideProperty()
  @Exclude()
  isDto: boolean;

  /**
   * The unique identifier for the user (UUID format).
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  @ApiProperty({
    description: 'The unique identifier for the user (UUID format).',
    example: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
  })
  @IsString()
  @IsOptional()
  id: string;

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
   * The email address of the user.
   * @example 'user@example.com'
   */
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  /**
   * The password for the user's account.
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
    description: `The password for the user's account. Password requirements: Minimum of 4 characters, maximum of 20 characters, at least one special character, one uppercase letter, one lowercase letter, and no spaces allowed.`,
    example: 'Password123!',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(
    /^(?:(?!\s).)*((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?:(?!\s).)*$/,
    {
      message:
        'Password requirements: At least 4 characters, up to 20 characters, one special character, one uppercase letter, one lowercase letter, and no spaces are allowed.',
    },
  )
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
