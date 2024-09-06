/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['culturasGastronomicas']
    });
  }

  async findOne(id_producto: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id_producto },
      relations: ['culturasGastronomicas']
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encuentra un producto con ese id',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoRepository.save(producto);
  }

  async update(
    id_producto: string,
    producto: ProductoEntity,
  ): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id_producto },
        relations: ['culturasGastronomicas']
      });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'No se encuentra un producto con ese id',
        BusinessError.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  async delete(id_producto: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id_producto },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encuentra un producto con ese id',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
