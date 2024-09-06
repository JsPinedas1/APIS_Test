import { IsString, IsNotEmpty } from "class-validator";

export class RestauranteDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly ciudad: string;

    @IsString()
    @IsNotEmpty()
    readonly estrellas_michelin: string;

    @IsString()
    @IsNotEmpty()
    readonly fecha: string;
}
