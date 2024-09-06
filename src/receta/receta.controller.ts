import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaDto } from './receta.dto/receta.dto';
import { RecetaEntity } from './receta.entity/receta.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('receta')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
    constructor(private readonly recetaService: RecetaService) {}

    @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':id_receta')
  async findOne(@Param('recetaId') recetaId: string) {
    return await this.recetaService.findOne(recetaId);
  }

  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':id_receta')
  async update(@Param('recetaId') recetaId: string, @Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @Delete(':recetaId')
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
