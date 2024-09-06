import { IsString, IsNotEmpty } from "class-validator";
import { Categoria } from "src/shared/enums/categoria";

export class ProductoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly historia: string;
    
    @IsString()
    @IsNotEmpty()
    readonly categoria: Categoria;
}
