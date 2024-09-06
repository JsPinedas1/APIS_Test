import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CulturaGastronomicaPaisService } from './cultura_gastronomica-pais.service';
import { plainToInstance } from 'class-transformer';
import { PaisDto } from 'src/pais/pais.dto/pais.dto';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';

@Controller('culturas_gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaPaisController {
    constructor(private readonly culturaGastronomicaPaisService: CulturaGastronomicaPaisService){}

    @Post(':culturaGastronomicaId/paises/:paisId')
    async addPaisCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string){
       return await this.culturaGastronomicaPaisService.addPaisCulturaGastronomica(culturaGastronomicaId, paisId);
    }

    @Get(':culturaGastronomicaId/paises/:paisId')
    async findPaisByCulturaGastronomicaIdPaisId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string){
        return await this.culturaGastronomicaPaisService.findPaisByCulturaGastronomicaIdPaisId(culturaGastronomicaId, paisId);
    }

    @Get(':culturaGastronomicaId/paises')
    async findPaisesByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.culturaGastronomicaPaisService.findPaisesByCulturaGastronomicaId(culturaGastronomicaId);
    }

    @Put(':culturaGastronomicaId/paises')
    async associatePaisesCulturaGastronomica(@Body() paisesDto: PaisDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.culturaGastronomicaPaisService.associatePaisesCulturaGastronomica(culturaGastronomicaId, paises);
    }

    @Delete(':culturaGastronomicaId/paises/:paisId')
    @HttpCode(204)
    async deletePaisCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string){
        return await this.culturaGastronomicaPaisService.deletePaisCulturaGastronomica(culturaGastronomicaId, paisId);
    }
}
