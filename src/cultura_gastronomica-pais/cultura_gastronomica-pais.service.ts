import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaPaisService {
  constructor(
      @InjectRepository(CulturaGastronomicaEntity)
      private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
      @InjectRepository(PaisEntity)
      private readonly paisRepository: Repository<PaisEntity>
  ) {}

  async addPaisCulturaGastronomica(id_cultura_gastronomica: string, id_pais: string): Promise<CulturaGastronomicaEntity> {
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id_pais: id_pais}});
      if (!pais)
        throw new BusinessLogicException("No fue encontrado el país con el id provisto.", BusinessError.NOT_FOUND);
    
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]})
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
  
      culturaGastronomica.paises = [...culturaGastronomica.paises, pais];
      return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findPaisByCulturaGastronomicaIdPaisId(id_cultura_gastronomica: string, id_pais: string): Promise<PaisEntity> {
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id_pais: id_pais}});
      if (!pais)
        throw new BusinessLogicException("No fue encontrado el país con el id provisto.", BusinessError.NOT_FOUND)
      
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomicaPais: PaisEntity = culturaGastronomica.paises.find(p => p.id_pais === pais.id_pais);
  
      if (!culturaGastronomicaPais)
        throw new BusinessLogicException("El pais con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)
  
      return culturaGastronomicaPais;
  }

  async findPaisesByCulturaGastronomicaId(id_cultura_gastronomica: string): Promise<PaisEntity[]> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id dado.", BusinessError.NOT_FOUND)
      
      return culturaGastronomica.paises;
  }

  async associatePaisesCulturaGastronomica(id_cultura_gastronomica: string, paises: PaisEntity[]): Promise<CulturaGastronomicaEntity> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
  
      for (let i = 0; i < paises.length; i++) {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id_pais: paises[i].id_pais}});
        if (!pais)
          throw new BusinessLogicException("No fue encontrado el pais con el id dado.", BusinessError.NOT_FOUND)
      }
  
      culturaGastronomica.paises = paises;
      return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deletePaisCulturaGastronomica(id_cultura_gastronomica: string, id_pais: string){
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id_pais}});
      if (!pais)
        throw new BusinessLogicException("No fue encontrado el país con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomicaPais: PaisEntity = culturaGastronomica.paises.find(p => p.id_pais === pais.id_pais);
      if (!culturaGastronomicaPais)
          throw new BusinessLogicException("El pais con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)

      culturaGastronomica.paises = culturaGastronomica.paises.filter(p => p.id_pais !== id_pais);
      await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
