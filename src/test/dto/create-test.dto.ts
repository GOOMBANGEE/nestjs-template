import { IsNotEmpty } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty() // validator
  id: number;
}
