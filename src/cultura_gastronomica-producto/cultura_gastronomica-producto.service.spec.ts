import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Repository } from 'typeorm';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { listCategories } from 'src/shared/enums/categoria';

describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let productosList : ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaProductoService],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(CulturaGastronomicaProductoService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaGastronomicaRepository.clear();
 
    productosList = [];
    for(let i = 0; i < 5; i++){
      const index: number = Math.floor(Math.random() * listCategories().length);
      
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.word.noun(),
        descripcion: faker.lorem.sentence(10),
        historia: faker.lorem.sentence(200),
        categoria: listCategories()[index].toString()
      })
      productosList.push(producto);
    }
 
    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      recetas: [ Object.assign(new RecetaEntity(), {}) ],
      paises: [ Object.assign(new PaisEntity(), {}) ],
      productos: productosList,
      restaurantes: [ Object.assign(new RestauranteEntity(), {}) ]
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCulturaGastronomica debe crear un producto a una cultura gastronomica', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10)
    });
 
    const result: CulturaGastronomicaEntity = await service.addProductoCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, nuevoProducto.id_producto);
   
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(nuevoProducto.nombre);
    expect(result.productos[0].descripcion).toBe(nuevoProducto.descripcion);
    expect(result.productos[0].historia).toBe(nuevoProducto.historia);
    expect(result.productos[0].categoria).toBe(nuevoProducto.categoria);
  });

  it('addProductoCulturaGastronomica debe lanzar una excepcion para un producto invalido', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    await expect(() => service.addProductoCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el producto con el id provisto.");
  });

  it('addProductoCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    await expect(() => service.addProductoCulturaGastronomica("0", nuevoProducto.id_producto)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findProductoByCulturaGastronomicaIdProductoId debe retornar un producto por cultura gastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    const productoAlmacenado: ProductoEntity = await service.findProductoByCulturaGastronomicaIdProductoId(culturaGastronomica.id_cultura_gastronomica, producto.id_producto)
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toBe(producto.nombre);
    expect(productoAlmacenado.descripcion).toBe(productoAlmacenado.descripcion);
    expect(productoAlmacenado.historia).toBe(productoAlmacenado.historia);
    expect(productoAlmacenado.categoria).toBe(productoAlmacenado.categoria);
  });

  it('findProductoByCulturaGastronomicaIdProductoId debe lanzar una excepcion para un producto invalido', async () => {
    await expect(()=> service.findProductoByCulturaGastronomicaIdProductoId(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el producto con el id provisto.");
  });

  it('findProductoByCulturaGastronomicaIdProductoId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.findProductoByCulturaGastronomicaIdProductoId("0", producto.id_producto)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findProductoByCulturaGastronomicaIdProductoId debe lanzar una excepcion para un producto no asociado a la cultura gastronomica', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    await expect(()=> service.findProductoByCulturaGastronomicaIdProductoId(culturaGastronomica.id_cultura_gastronomica, nuevoProducto.id_producto)).rejects.toHaveProperty("message", "El producto con el id dado no esta asociado a la cultura gastronomica.");
  });

  it('findProductosByCulturaGastronomicaId debe retornar productos por cultura gastronomica', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByCulturaGastronomicaId(culturaGastronomica.id_cultura_gastronomica);
    expect(productos.length).toBe(5);
  });

  it('findProductosByCulturaGastronomicaId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.findProductosByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id dado.");
  });

  it('associateProductosCulturaGastronomica debe actualizar lista de productos para una cultura gastronomica', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    const culturaGastronomicaActualizada: CulturaGastronomicaEntity = await service.associateProductosCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [nuevoProducto]);
    expect(culturaGastronomicaActualizada.productos.length).toBe(1);
 
    expect(culturaGastronomicaActualizada.productos[0].nombre).toBe(nuevoProducto.nombre);
    expect(culturaGastronomicaActualizada.productos[0].descripcion).toBe(nuevoProducto.descripcion);
    expect(culturaGastronomicaActualizada.productos[0].historia).toBe(nuevoProducto.historia);
    expect(culturaGastronomicaActualizada.productos[0].categoria).toBe(nuevoProducto.categoria);
  });

  it('associateProductosCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    await expect(()=> service.associateProductosCulturaGastronomica("0", [nuevoProducto])).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('associateProductosCulturaGastronomica debe lanzar una excepcion para un producto invalido', async () => {
    const nuevoProducto: ProductoEntity = productosList[0];
    nuevoProducto.id_producto = "0";
 
    await expect(()=> service.associateProductosCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [nuevoProducto])).rejects.toHaveProperty("message", "No fue encontrado el producto con el id dado.");
  });

  it('deleteProductoCulturaGastronomica debe eliminar un producto de una cultura gastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
   
    await service.deleteProductoCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, producto.id_producto);
 
    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica: culturaGastronomica.id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
    const productoBorrado: ProductoEntity = culturaGastronomicaAlmacenada.productos.find(p => p.id_producto === producto.id_producto);
 
    expect(productoBorrado).toBeUndefined();
  });

  it('deleteProductoCulturaGastronomica debe lanzar una excepcion para un producto invalido', async () => {
    await expect(()=> service.deleteProductoCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el producto con el id provisto.");
  });

  it('deleteProductoCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteProductoCulturaGastronomica("0", producto.id_producto)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('deleteProductoCulturaGastronomica debe lanzar una excepcion para un producto no asociado a una cultura gastronomica', async () => {
    const index: number = Math.floor(Math.random() * listCategories().length);

    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(10),
      historia: faker.lorem.sentence(200),
      categoria: listCategories()[index].toString()
    });
 
    await expect(()=> service.deleteProductoCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, nuevoProducto.id_producto)).rejects.toHaveProperty("message", "El producto con el id dado no esta asociado a la cultura gastronomica.");
  });
});
