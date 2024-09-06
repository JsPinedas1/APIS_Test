import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity/receta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class RecetaService {
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ){}

    async findAll(): Promise<RecetaEntity[]> {
        return await this.recetaRepository.find({ relations: ["culturaGastronomica"] });
    }

    async findOne(id_receta: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id_receta}, relations: ["culturaGastronomica"] } );
        if (!receta)
          throw new BusinessLogicException("No se encuentra una receta con ese id", BusinessError.NOT_FOUND);
   
        return receta;
    }

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(id_receta: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({where:{id_receta}});
        if (!persistedReceta)
          throw new BusinessLogicException("No se encuentra una receta con ese id", BusinessError.NOT_FOUND);
        
        return await this.recetaRepository.save({...persistedReceta, ...receta});
    }

    async delete(id_receta: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where:{id_receta}});
        if (!receta)
          throw new BusinessLogicException("No se encuentra una receta con ese id", BusinessError.NOT_FOUND);
     
        await this.recetaRepository.remove(receta);
    }


}
