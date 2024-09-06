import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import {
  BusinessLogicException,
  BusinessError,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaRecetaService {
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  async addRecetaCulturaGastronomica(
    id_cultura_gastronomica: string,
    id_receta: string,
  ): Promise<CulturaGastronomicaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id_receta: id_receta },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No fue encontrado la receta con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id_cultura_gastronomica },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No fue encontrada la cultura gastronomica con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findRecetaByCulturaGastronomicaIdRecetaId(
    id_cultura_gastronomica: string,
    id_receta: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id_receta: id_receta },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No fue encontrado la receta con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id_cultura_gastronomica },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No fue encontrada la cultura gastronomica con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomicaReceta: RecetaEntity =
      culturaGastronomica.recetas.find((p) => p.id_receta === receta.id_receta);

    if (!culturaGastronomicaReceta)
      throw new BusinessLogicException(
        'La receta con el id dado no esta asociado a la cultura gastronomica.',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaGastronomicaReceta;
  }

  async findRecetasByCulturaGastronomicaId(
    id_cultura_gastronomica: string,
  ): Promise<RecetaEntity[]> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id_cultura_gastronomica },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No fue encontrada la cultura gastronómica con el id dado.',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica.recetas;
  }

  async associateRecetasCulturaGastronomica(
    id_cultura_gastronomica: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id_cultura_gastronomica },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No fue encontrada la cultura gastronómica con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id_receta: recetas[i].id_receta },
      });
      if (!receta)
        throw new BusinessLogicException(
          'No fue encontrado la receta con el id dado.',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.recetas = recetas;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteRecetaCulturaGastronomica(
    id_cultura_gastronomica: string,
    id_receta: string,
  ) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id_receta },
    });
    if (!receta)
      throw new BusinessLogicException(
        'No fue encontrado la receta con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id_cultura_gastronomica },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No fue encontrada la cultura gastronómica con el id provisto.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomicaReceta: RecetaEntity =
      culturaGastronomica.recetas.find((p) => p.id_receta === receta.id_receta);
    if (!culturaGastronomicaReceta)
      throw new BusinessLogicException(
        'La receta con el id dado no esta asociado a la cultura gastronomica.',
        BusinessError.PRECONDITION_FAILED,
      );

    culturaGastronomica.recetas = culturaGastronomica.recetas.filter(
      (p) => p.id_receta !== id_receta,
    );
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
