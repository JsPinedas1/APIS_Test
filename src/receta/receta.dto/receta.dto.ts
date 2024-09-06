import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RecetaDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly foto: string;

    @IsString()
    @IsNotEmpty()
    readonly preparacion: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    readonly video: string;
}
