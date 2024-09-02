import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { PriorityType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsString, Length } from 'class-validator';
import { GenericDto } from '../../../../generic-module/crud/model/dto/generic.dto';

/**
 * Data Transfer Object (DTO) for creating a task.
 */
export class TaskCreateDto implements GenericDto {
  /**
   * A tag that marks that the class is a DTO.
   * This property is hidden from Swagger documentation.
   */
  @ApiHideProperty()
  @Exclude()
  isDto: boolean;

  /**
   * The description of the task.
   * @example 'Complete the project A'
   */
  @ApiProperty({
    description: 'The description of the task',
    example: 'Complete the project A',
  })
  @IsString()
  @Length(3)
  description: string;

  /**
   * The priority of the task.
   * @example PriorityType.HIGH
   */
  @ApiProperty({
    description: 'The priority of the task',
    example: PriorityType.HIGH,
    enum: PriorityType,
  })
  @IsEnum(PriorityType)
  priority: PriorityType;
}
