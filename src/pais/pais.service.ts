import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity/pais.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class PaisService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ){}

    async findAll(): Promise<PaisEntity[]> {
        return await this.paisRepository.find({ relations: ["culturasGastronomicas", "restaurantes"] });
    }
    
    async findOne(id: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id_pais: id}, relations: ["culturasGastronomicas", "restaurantes"] } );
        if (!pais)
          throw new BusinessLogicException(`El país con el ID ${id} no fue encontrado`, BusinessError.NOT_FOUND);
    
        return pais;
    }
    
    async create(pais: PaisEntity): Promise<PaisEntity> {
        return await this.paisRepository.save(pais);
    }
    
    async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
        const guardadoPais: PaisEntity = await this.paisRepository.findOne({where:{id_pais: id}});
        if (!guardadoPais)
          throw new BusinessLogicException(`El país con el ID ${id} no fue encontrado`, BusinessError.NOT_FOUND);
          
        return await this.paisRepository.save(pais);
    }
    
    async delete(id: string) {
        const pais: PaisEntity = await this.paisRepository.findOne({where:{id_pais: id}});
        if (!pais)
          throw new BusinessLogicException(`El país con el ID ${id} no fue encontrado`, BusinessError.NOT_FOUND);
     
        await this.paisRepository.remove(pais);
    }
    
}