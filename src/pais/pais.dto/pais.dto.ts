import { IsString, IsNotEmpty } from "class-validator";

export class PaisDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly codigo: string;
}
