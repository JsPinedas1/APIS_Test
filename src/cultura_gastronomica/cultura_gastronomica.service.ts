import { Injectable } from '@nestjs/common';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity/cultura_gastronomica.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class CulturaGastronomicaService {

    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ){}

    async findAll(): Promise<CulturaGastronomicaEntity[]> {
        return await this.culturaGastronomicaRepository.find({ relations: ["restaurantes", "paises", "productos", "recetas"] });
    }

    async findOne(id_cultura_gastronomica: string): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"] } );
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
   
        return culturaGastronomica;
    }

    async create(culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }

    async update(id_cultura_gastronomica: string, culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        const persistedCulturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id_cultura_gastronomica}});
        if (!persistedCulturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
        
        return await this.culturaGastronomicaRepository.save({...persistedCulturaGastronomica, ...culturaGastronomica});
    }

    async delete(id_cultura_gastronomica: string) {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id_cultura_gastronomica}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
     
        await this.culturaGastronomicaRepository.remove(culturaGastronomica);
    }
}
