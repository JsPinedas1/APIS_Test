import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisService } from './pais.service';
import { PaisDto } from './pais.dto/pais.dto';
import { PaisEntity } from './pais.entity/pais.entity';

@Controller('paises')
export class PaisController {

    constructor(private readonly paisService: PaisService) {}

    @Post()
    async create(@Body() paisDto: PaisDto) {
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return await this.paisService.create(pais);
    }
}
