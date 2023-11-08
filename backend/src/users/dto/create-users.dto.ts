import {
  IsString,
  IsInt,
  IsDate,
  ValidateIf,
  Length
} from 'class-validator';

export class users {
  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsInt()
  userId: number;

  @IsString()
  @Length(1, 20)
  username: string;

  @IsString()
  avatar: string;

  @IsString()
  password: string;

  @IsString()
  hashedSaltedPassword: string;

  //chat need to be added
}

export class UserModify {
  @ValidateIf(
    (dto) =>
      !dto.avatar || (dto.username && dto.avatar),
  )
  @IsString()
  @Length(1, 20)
  username?: string;

  @ValidateIf(
    (dto) =>
      !dto.username ||
      (dto.username && dto.avatar),
  )
  @IsString()
  avatar?: string;
}
