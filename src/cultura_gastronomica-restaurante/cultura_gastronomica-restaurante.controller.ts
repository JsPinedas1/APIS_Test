import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from 'src/restaurante/restaurante.dto/restaurante.dto';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';

@Controller('culturas_gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRestauranteController {
    constructor(private readonly culturaGastronomicaRestauranteService: CulturaGastronomicaRestauranteService){}

    @Post(':culturaGastronomicaId/restaurantes/:restauranteId')
    async addRestauranteCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturaGastronomicaRestauranteService.addRestauranteCulturaGastronomica(culturaGastronomicaId, restauranteId);
    }

    @Get(':culturaGastronomicaId/restaurantes/:restauranteId')
    async findRestauranteByCulturaGastronomicaIdRestauranteId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaGastronomicaRestauranteService.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomicaId, restauranteId);
    }

    @Get(':culturaGastronomicaId/restaurantes')
    async findRestaurantesByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.culturaGastronomicaRestauranteService.findRestaurantesByCulturaGastronomicaId(culturaGastronomicaId);
    }

    @Put(':culturaGastronomicaId/restaurantes')
    async associateRestaurantesCulturaGastronomica(@Body() restaurantesDto: RestauranteDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
        return await this.culturaGastronomicaRestauranteService.associateRestaurantesCulturaGastronomica(culturaGastronomicaId, restaurantes);
    }

    @Delete(':culturaGastronomicaId/restaurantes/:restauranteId')
    @HttpCode(204)
    async deleteRestauranteCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaGastronomicaRestauranteService.deleteRestauranteCulturaGastronomica(culturaGastronomicaId, restauranteId);
    }
}
