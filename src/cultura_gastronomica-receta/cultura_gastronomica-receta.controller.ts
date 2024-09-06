import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { plainToInstance } from 'class-transformer';
import { RecetaDto } from 'src/receta/receta.dto/receta.dto';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';

@Controller('culturas_gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRecetaController {
  constructor(
    private readonly culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService,
  ) {}

  @Post(':culturaGastronomicaId/recetas/:recetaId')
  async addRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.addRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @Get(':culturaGastronomicaId/recetas/:recetaId')
  async findRecetaByCulturaGastronomicaIdRecetaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.findRecetaByCulturaGastronomicaIdRecetaId(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @Get(':culturaGastronomicaId/recetas')
  async findRecetasByCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.findRecetasByCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @Put(':culturaGastronomicaId/recetas')
  async associateRecetasCulturaGastronomica(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaGastronomicaRecetaService.associateRecetasCulturaGastronomica(
      culturaGastronomicaId,
      recetas,
    );
  }

  @Delete(':culturaGastronomicaId/recetas/:recetaId')
  @HttpCode(204)
  async deleteRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.deleteRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }
}
