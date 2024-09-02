import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { PriorityType, StatusType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { GenericDto } from '../../../../generic-module/crud/model/dto/generic.dto';

/**
 * Data Transfer Object (DTO) of a task.
 */
export class TaskDto implements GenericDto {
  /**
   * A tag that marks that the class is a DTO.
   * This property is hidden from Swagger documentation.
   */
  @ApiHideProperty()
  @Exclude()
  isDto: boolean;

  /**
   * The unique identifier for the task (UUID format).
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  @ApiProperty({
    description: 'The unique identifier for the task (UUID format)',
    example: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
  })
  @IsString()
  @IsOptional()
  id: string;

  /**
   * The unique identifier of the task user.
   * @example '3f68087e-42dd-491b-b68f-87bb773ae5d1'
   */
  @ApiProperty({
    description: 'The unique identifier of the task user',
    example: '3f68087e-42dd-491b-b68f-87bb773ae5d1',
  })
  @IsString()
  @IsOptional()
  user_id: string;

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

  /**
   * The status of the task.
   * @example StatusType.PENDENT
   */
  @ApiProperty({
    description: 'The priority of the task',
    example: StatusType.PENDENT,
    enum: StatusType,
  })
  @IsEnum(StatusType)
  status: StatusType;
}
