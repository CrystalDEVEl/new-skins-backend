import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsString({ message: "Имя должно быть строкой" })
  @MinLength(3, { message: "Имя должно содержать минимум 3 символа" })
  @MaxLength(20, { message: "Имя должно содержать максимум 20 символов" })
  name: string;

  @IsEmail({}, { message: "Некорректный email адрес" })
  email: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @MinLength(6, { message: "Пароль должен содержать минимум 6 символов" })
  @MaxLength(100, { message: "Пароль должен содержать максимум 100 символов" })
  password: string;

  @IsOptional()
  @IsString({ message: "Аватар должен быть строкой" })
  avatar?: string;
}
