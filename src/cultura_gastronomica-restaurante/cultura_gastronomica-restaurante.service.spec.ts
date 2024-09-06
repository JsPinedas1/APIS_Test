import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Repository } from 'typeorm';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';

describe('CulturaGastronomicaRestauranteService', () => {
  let service: CulturaGastronomicaRestauranteService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let restaurantesList : RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRestauranteService],
    }).compile();

    service = module.get<CulturaGastronomicaRestauranteService>(CulturaGastronomicaRestauranteService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaGastronomicaRepository.clear();
 
    restaurantesList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await restauranteRepository.save({
          nombre: faker.company.name(),
          ciudad: faker.location.city(),
          estrellas_michelin: faker.string.numeric(1),
          fecha: faker.date.past().toISOString()
        })
        restaurantesList.push(restaurante);
    }
 
    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      recetas: [ Object.assign(new RecetaEntity(), {}) ],
      paises: [ Object.assign(new PaisEntity(), {}) ],
      productos: [ Object.assign(new ProductoEntity(), {}) ],
      restaurantes: restaurantesList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCulturaGastronomica debe crear un restaurante a una cultura gastronomica', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        estrellas_michelin: faker.string.numeric(1),
        fecha: faker.date.past().toISOString()
    });
 
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10)
    });
 
    const result: CulturaGastronomicaEntity = await service.addRestauranteCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, nuevoRestaurante.id_restaurante);
   
    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(nuevoRestaurante.nombre);
    expect(result.restaurantes[0].ciudad).toBe(nuevoRestaurante.ciudad);
    expect(result.restaurantes[0].estrellas_michelin).toBe(nuevoRestaurante.estrellas_michelin);
    expect(result.restaurantes[0].fecha).toBe(nuevoRestaurante.fecha);
  });

  it('addRestauranteCulturaGastronomica debe lanzar una excepcion para un restaurante invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10)
    });
 
    await expect(() => service.addRestauranteCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el restaurante con el id provisto.");
  });

  it('addRestauranteCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString()
    });
 
    await expect(() => service.addRestauranteCulturaGastronomica("0", nuevoRestaurante.id_restaurante)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findRestauranteByCulturaGastronomicaIdRestauranteId debe retornar un restaurante por cultura gastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const restauranteAlmacenado: RestauranteEntity = await service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id_cultura_gastronomica, restaurante.id_restaurante)
    expect(restauranteAlmacenado).not.toBeNull();
    expect(restauranteAlmacenado.nombre).toBe(restaurante.nombre);
    expect(restauranteAlmacenado.ciudad).toBe(restaurante.ciudad);
    expect(restauranteAlmacenado.estrellas_michelin).toBe(restaurante.estrellas_michelin);
    expect(restauranteAlmacenado.fecha).toBe(restaurante.fecha);
  });

  it('findRestauranteByCulturaGastronomicaIdRestauranteId debe lanzar una excepcion para un restaurante invalido', async () => {
    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el restaurante con el id provisto.");
  });

  it('findRestauranteByCulturaGastronomicaIdRestauranteId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId("0", restaurante.id_restaurante)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findRestauranteByCulturaGastronomicaIdRestauranteId debe lanzar una excepcion para un restaurante no asociado a la cultura gastronomica', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString()
    });
 
    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id_cultura_gastronomica, nuevoRestaurante.id_restaurante)).rejects.toHaveProperty("message", "El restaurante con el id dado no esta asociado a la cultura gastronomica.");
  });

  it('findRestaurantesByCulturaGastronomicaId debe retornar restaurantes por cultura gastronomica', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesByCulturaGastronomicaId(culturaGastronomica.id_cultura_gastronomica);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByCulturaGastronomicaId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.findRestaurantesByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id dado.");
  });

  it('associateRestaurantesCulturaGastronomica debe actualizar lista de restaurantes para una cultura gastronomica', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString()
    });
 
    const culturaGastronomicaActualizada: CulturaGastronomicaEntity = await service.associateRestaurantesCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [nuevoRestaurante]);
    expect(culturaGastronomicaActualizada.restaurantes.length).toBe(1);
    expect(culturaGastronomicaActualizada.restaurantes[0].nombre).toBe(nuevoRestaurante.nombre);
    expect(culturaGastronomicaActualizada.restaurantes[0].ciudad).toBe(nuevoRestaurante.ciudad);
    expect(culturaGastronomicaActualizada.restaurantes[0].estrellas_michelin).toBe(nuevoRestaurante.estrellas_michelin);
    expect(culturaGastronomicaActualizada.restaurantes[0].fecha).toBe(nuevoRestaurante.fecha);
  });

  it('associateRestaurantesCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString()
    });
 
    await expect(()=> service.associateRestaurantesCulturaGastronomica("0", [nuevoRestaurante])).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('associateRestaurantesCulturaGastronomica debe lanzar una excepcion para un restaurante invalido', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.id_restaurante = "0";
 
    await expect(()=> service.associateRestaurantesCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [restaurante])).rejects.toHaveProperty("message", "No fue encontrado el restaurante con el id dado.");
  });

  it('deleteRestauranteCulturaGastronomica debe eliminar un restaurante de una cultura gastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
   
    await service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, restaurante.id_restaurante);
 
    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica: culturaGastronomica.id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
    const restauranteBorrado: RestauranteEntity = culturaGastronomicaAlmacenada.restaurantes.find(r => r.id_restaurante === restaurante.id_restaurante);
 
    expect(restauranteBorrado).toBeUndefined();
  });

  it('deleteRestauranteCulturaGastronomica debe lanzar una excepcion para un restaurante invalido', async () => {
    await expect(()=> service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el restaurante con el id provisto.");
  });

  it('deleteRestauranteCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(()=> service.deleteRestauranteCulturaGastronomica("0", restaurante.id_restaurante)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('deleteRestauranteCulturaGastronomica debe lanzar una excepcion para un restaurante no asociado a una cultura gastronomica', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      estrellas_michelin: faker.string.numeric(1),
      fecha: faker.date.past().toISOString()
    });
 
    await expect(()=> service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, nuevoRestaurante.id_restaurante)).rejects.toHaveProperty("message", "El restaurante con el id dado no esta asociado a la cultura gastronomica.");
  });
});
