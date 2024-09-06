import { Body, Controller, Post } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity/producto.entity';
import { ProductoDto } from './producto.dto/producto.dto';
import { plainToInstance } from 'class-transformer';

@Controller('productos')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    @Post()
    async create(@Body() productoDto: ProductoDto) {
        const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return await this.productoService.create(producto);
    }
}
