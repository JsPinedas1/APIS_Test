import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaRestauranteService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>
    ) {}
  
    async addRestauranteCulturaGastronomica(id_cultura_gastronomica: string, id_restaurante: string): Promise<CulturaGastronomicaEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id_restaurante}});
        if (!restaurante)
          throw new BusinessLogicException("No fue encontrado el restaurante con el id provisto.", BusinessError.NOT_FOUND);
      
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]})
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
    
        culturaGastronomica.restaurantes = [...culturaGastronomica.restaurantes, restaurante];
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }
  
    async findRestauranteByCulturaGastronomicaIdRestauranteId(id_cultura_gastronomica: string, id_restaurante: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id_restaurante}});
        if (!restaurante)
          throw new BusinessLogicException("No fue encontrado el restaurante con el id provisto.", BusinessError.NOT_FOUND)
        
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND)
    
        const culturaGastronomicaRestaurante: RestauranteEntity = culturaGastronomica.restaurantes.find(r => r.id_restaurante === restaurante.id_restaurante);
    
        if (!culturaGastronomicaRestaurante)
          throw new BusinessLogicException("El restaurante con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)
    
        return culturaGastronomicaRestaurante;
    }
  
    async findRestaurantesByCulturaGastronomicaId(id_cultura_gastronomica: string): Promise<RestauranteEntity[]> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id dado.", BusinessError.NOT_FOUND)
        
        return culturaGastronomica.restaurantes;
    }
  
    async associateRestaurantesCulturaGastronomica(id_cultura_gastronomica: string, restaurantes: RestauranteEntity[]): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < restaurantes.length; i++) {
          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id_restaurante: restaurantes[i].id_restaurante}});
          if (!restaurante)
            throw new BusinessLogicException("No fue encontrado el restaurante con el id dado.", BusinessError.NOT_FOUND)
        }
    
        culturaGastronomica.restaurantes = restaurantes;
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }
  
    async deleteRestauranteCulturaGastronomica(id_cultura_gastronomica: string, id_restaurante: string){
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id_restaurante}});
        if (!restaurante)
          throw new BusinessLogicException("No fue encontrado el restaurante con el id provisto.", BusinessError.NOT_FOUND)
    
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
    
        const culturaGastronomicaRestaurante: RestauranteEntity = culturaGastronomica.restaurantes.find(r => r.id_restaurante === restaurante.id_restaurante);
        if (!culturaGastronomicaRestaurante)
            throw new BusinessLogicException("El restaurante con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)
  
        culturaGastronomica.restaurantes = culturaGastronomica.restaurantes.filter(r => r.id_restaurante !== id_restaurante);
        await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }
}
