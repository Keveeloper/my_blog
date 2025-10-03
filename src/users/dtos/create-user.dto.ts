import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateProfileDto } from "./create-profile.dto";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}
