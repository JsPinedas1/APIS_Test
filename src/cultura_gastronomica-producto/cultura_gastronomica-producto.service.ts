import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaProductoService {
  constructor(
      @InjectRepository(CulturaGastronomicaEntity)
      private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
      @InjectRepository(ProductoEntity)
      private readonly productoRepository: Repository<ProductoEntity>
  ) {}

  async addProductoCulturaGastronomica(id_cultura_gastronomica: string, id_producto: string): Promise<CulturaGastronomicaEntity> {
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id_producto: id_producto}});
      if (!producto)
        throw new BusinessLogicException("No fue encontrado el producto con el id provisto.", BusinessError.NOT_FOUND);
    
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]})
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND);
  
      culturaGastronomica.productos = [...culturaGastronomica.productos, producto];
      return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findProductoByCulturaGastronomicaIdProductoId(id_cultura_gastronomica: string, id_producto: string): Promise<ProductoEntity> {
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id_producto: id_producto}});
      if (!producto)
        throw new BusinessLogicException("No fue encontrado el producto con el id provisto.", BusinessError.NOT_FOUND)
      
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronomica con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomicaproducto: ProductoEntity = culturaGastronomica.productos.find(p => p.id_producto === producto.id_producto);
  
      if (!culturaGastronomicaproducto)
        throw new BusinessLogicException("El producto con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)
  
      return culturaGastronomicaproducto;
  }

  async findProductosByCulturaGastronomicaId(id_cultura_gastronomica: string): Promise<ProductoEntity[]> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id dado.", BusinessError.NOT_FOUND)
      
      return culturaGastronomica.productos;
  }

  async associateProductosCulturaGastronomica(id_cultura_gastronomica: string, productos: ProductoEntity[]): Promise<CulturaGastronomicaEntity> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
  
      for (let i = 0; i < productos.length; i++) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id_producto: productos[i].id_producto}});
        if (!producto)
          throw new BusinessLogicException("No fue encontrado el producto con el id dado.", BusinessError.NOT_FOUND)
      }
  
      culturaGastronomica.productos = productos;
      return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteProductoCulturaGastronomica(id_cultura_gastronomica: string, id_producto: string){
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id_producto}});
      if (!producto)
        throw new BusinessLogicException("No fue encontrado el producto con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
      if (!culturaGastronomica)
        throw new BusinessLogicException("No fue encontrada la cultura gastronómica con el id provisto.", BusinessError.NOT_FOUND)
  
      const culturaGastronomicaproducto: ProductoEntity = culturaGastronomica.productos.find(p => p.id_producto === producto.id_producto);
      if (!culturaGastronomicaproducto)
          throw new BusinessLogicException("El producto con el id dado no esta asociado a la cultura gastronomica.", BusinessError.PRECONDITION_FAILED)

      culturaGastronomica.productos = culturaGastronomica.productos.filter(p => p.id_producto !== id_producto);
      await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
