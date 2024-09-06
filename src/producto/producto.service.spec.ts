/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity/producto.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { listCategories } from 'src/shared/enums/categoria';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const index: number = Math.floor(Math.random() * listCategories().length);

      const producto: ProductoEntity = await repository.save({
        nombre: faker.lorem.words(5),
        descripcion: faker.lorem.sentence(10),
        historia: faker.lorem.sentence(10),
        categoria: listCategories()[index].toString()
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne debe retornar un producto por id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(
      storedProducto.id_producto,
    );
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.descripcion).toEqual(storedProducto.descripcion);
    expect(producto.historia).toEqual(storedProducto.historia);
    expect(producto.categoria).toEqual(storedProducto.categoria);
  });

  it('findOne debe lanzar una excepcion para un producto invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encuentra un producto con ese id',
    );
  });

  it('create debe crear un nuevo producto', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const producto: ProductoEntity = {
      id_producto: faker.string.uuid(),
      nombre: faker.lorem.words(5),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(10),
      categoria: listCategories()[index].toString(),
      culturasGastronomicas: [
        Object.assign(new CulturaGastronomicaEntity(), {}),
      ],
    };
    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id_producto: newProducto.id_producto}});
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.descripcion).toEqual(newProducto.descripcion);
    expect(storedProducto.historia).toEqual(newProducto.historia);
    expect(storedProducto.categoria).toEqual(newProducto.categoria);
  });

  it('update debe actualizar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'Nuevo nombre';
    producto.descripcion = 'Nueva descripcion';
    const updatedProducto: ProductoEntity = await service.update(producto.id_producto, producto);
    expect(updatedProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({where: {id_producto: producto.id_producto}});
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.descripcion).toEqual(producto.descripcion);
  });

  it('update debe lanzar una excepcion para un producto invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'Nuevo nombre',
      descripcion: 'Nueva descripcion',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty('message', 'No se encuentra un producto con ese id');
  });

  it('delete debe eliminar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id_producto);
    const deletedProducto: ProductoEntity = await repository.findOne({where: {id_producto: producto.id_producto}});
    expect(deletedProducto).toBeNull();
  });

  it('delete debe lanzar una excepcion para un producto invalido', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', 'No se encuentra un producto con ese id');
  });
});
