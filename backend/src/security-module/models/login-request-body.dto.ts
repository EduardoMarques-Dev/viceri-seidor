import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  /**
   * The email address associated with the user.
   * @example 'user@example.com'
   */
  @ApiProperty({
    description: 'The email address associated with the user.',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  /**
   * The password for the user's account.
   * @example 'Password123!'
   */
  @ApiProperty({
    description: "The password for the user's account.",
    example: 'Password123',
  })
  @IsString()
  password: string;
}
