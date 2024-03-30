import { IsNotEmpty, IsString } from 'class-validator';

export class SetupProfileDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
