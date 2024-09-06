import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { ProductoDto } from 'src/producto/producto.dto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';

@Controller('culturas_gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaProductoController {
    constructor(private readonly culturaGastronomicaProductoService: CulturaGastronomicaProductoService){}

    @Post(':culturaGastronomicaId/productos/:productoId')
    async addProductoCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoId') productoId: string){
       return await this.culturaGastronomicaProductoService.addProductoCulturaGastronomica(culturaGastronomicaId, productoId);
    }

    @Get(':culturaGastronomicaId/productos/:productoId')
    async findProductoByCulturaGastronomicaIdProductoId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoId') productoId: string){
        return await this.culturaGastronomicaProductoService.findProductoByCulturaGastronomicaIdProductoId(culturaGastronomicaId, productoId);
    }

    @Get(':culturaGastronomicaId/productos')
    async findProductosByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.culturaGastronomicaProductoService.findProductosByCulturaGastronomicaId(culturaGastronomicaId);
    }

    @Put(':culturaGastronomicaId/productos')
    async associateProductosCulturaGastronomica(@Body() productosDto: ProductoDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaGastronomicaProductoService.associateProductosCulturaGastronomica(culturaGastronomicaId, productos);
    }

    @Delete(':culturaGastronomicaId/productos/:productoId')
    @HttpCode(204)
    async deleteProductoCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoId') productoId: string){
        return await this.culturaGastronomicaProductoService.deleteProductoCulturaGastronomica(culturaGastronomicaId, productoId);
    }
}
