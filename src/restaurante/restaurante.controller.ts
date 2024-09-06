import { Body, Controller, Post } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity/restaurante.entity';
import { RestauranteDto } from './restaurante.dto/restaurante.dto';
import { plainToInstance } from 'class-transformer';

@Controller('restaurantes')
export class RestauranteController {
    constructor(private readonly restauranteService: RestauranteService) {}

    @Post()
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.create(restaurante);
    }
}
