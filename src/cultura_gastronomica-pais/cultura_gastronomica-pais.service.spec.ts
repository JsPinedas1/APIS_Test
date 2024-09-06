import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaPaisService } from './cultura_gastronomica-pais.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Repository } from 'typeorm';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';

describe('CulturaGastronomicaPaisService', () => {
  let service: CulturaGastronomicaPaisService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let paisesList : PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaPaisService],
    }).compile();

    service = module.get<CulturaGastronomicaPaisService>(CulturaGastronomicaPaisService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaGastronomicaRepository.clear();
 
    paisesList = [];
    for(let i = 0; i < 5; i++){
        const pais: PaisEntity = await paisRepository.save({
          nombre: faker.location.country(),
          codigo: faker.location.countryCode({variant: 'alpha-3'})
        })
        paisesList.push(pais);
    }
 
    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      recetas: [ Object.assign(new RecetaEntity(), {}) ],
      paises: paisesList,
      productos: [ Object.assign(new ProductoEntity(), {}) ],
      restaurantes: [ Object.assign(new RestauranteEntity(), {}) ]
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPaisCulturaGastronomica debe crear un pais a una cultura gastronomica', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10)
    });
 
    const result: CulturaGastronomicaEntity = await service.addPaisCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, nuevoPais.id_pais);
   
    expect(result.paises.length).toBe(1);
    expect(result.paises[0]).not.toBeNull();
    expect(result.paises[0].nombre).toBe(nuevoPais.nombre);
    expect(result.paises[0].codigo).toBe(nuevoPais.codigo);
  });

  it('addPaisCulturaGastronomica debe lanzar una excepcion para un pais invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10)
    });
 
    await expect(() => service.addPaisCulturaGastronomica(nuevaCulturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el país con el id provisto.");
  });

  it('addPaisCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    await expect(() => service.addPaisCulturaGastronomica("0", nuevoPais.id_pais)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findPaisByCulturaGastronomicaIdPaisId debe retornar un pais por cultura gastronomica', async () => {
    const pais: PaisEntity = paisesList[0];
    const paisAlmacenado: PaisEntity = await service.findPaisByCulturaGastronomicaIdPaisId(culturaGastronomica.id_cultura_gastronomica, pais.id_pais)
    expect(paisAlmacenado).not.toBeNull();
    expect(paisAlmacenado.nombre).toBe(pais.nombre);
    expect(paisAlmacenado.codigo).toBe(pais.codigo);
  });

  it('findPaisByCulturaGastronomicaIdPaisId debe lanzar una excepcion para un pais invalido', async () => {
    await expect(()=> service.findPaisByCulturaGastronomicaIdPaisId(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el país con el id provisto.");
  });

  it('findPaisByCulturaGastronomicaIdPaisId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(()=> service.findPaisByCulturaGastronomicaIdPaisId("0", pais.id_pais)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('findPaisByCulturaGastronomicaIdPaisId debe lanzar una excepcion para un pais no asociado a la cultura gastronomica', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    await expect(()=> service.findPaisByCulturaGastronomicaIdPaisId(culturaGastronomica.id_cultura_gastronomica, nuevoPais.id_pais)).rejects.toHaveProperty("message", "El pais con el id dado no esta asociado a la cultura gastronomica.");
  });

  it('findPaisesByCulturaGastronomicaId debe retornar paises por cultura gastronomica', async ()=>{
    const paises: PaisEntity[] = await service.findPaisesByCulturaGastronomicaId(culturaGastronomica.id_cultura_gastronomica);
    expect(paises.length).toBe(5);
  });

  it('findPaisesByCulturaGastronomicaId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(()=> service.findPaisesByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id dado.");
  });

  it('associatePaisesCulturaGastronomica debe actualizar lista de paises para una cultura gastronomica', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    const culturaGastronomicaActualizada: CulturaGastronomicaEntity = await service.associatePaisesCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [nuevoPais]);
    expect(culturaGastronomicaActualizada.paises.length).toBe(1);
 
    expect(culturaGastronomicaActualizada.paises[0].nombre).toBe(nuevoPais.nombre);
    expect(culturaGastronomicaActualizada.paises[0].codigo).toBe(nuevoPais.codigo);
  });

  it('associatePaisesCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    await expect(()=> service.associatePaisesCulturaGastronomica("0", [nuevoPais])).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('associatePaisesCulturaGastronomica debe lanzar una excepcion para un pais invalido', async () => {
    const nuevoPais: PaisEntity = paisesList[0];
    nuevoPais.id_pais = "0";
 
    await expect(()=> service.associatePaisesCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, [nuevoPais])).rejects.toHaveProperty("message", "No fue encontrado el pais con el id dado.");
  });

  it('deletePaisCulturaGastronomica debe eliminar un pais de una cultura gastronomica', async () => {
    const pais: PaisEntity = paisesList[0];
   
    await service.deletePaisCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, pais.id_pais);
 
    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id_cultura_gastronomica: culturaGastronomica.id_cultura_gastronomica}, relations: ["restaurantes", "paises", "productos", "recetas"]});
    const paisBorrado: PaisEntity = culturaGastronomicaAlmacenada.paises.find(p => p.id_pais === pais.id_pais);
 
    expect(paisBorrado).toBeUndefined();
  });

  it('deletePaisCulturaGastronomica debe lanzar una excepcion para un pais invalido', async () => {
    await expect(()=> service.deletePaisCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, "0")).rejects.toHaveProperty("message", "No fue encontrado el país con el id provisto.");
  });

  it('deletePaisCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(()=> service.deletePaisCulturaGastronomica("0", pais.id_pais)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronómica con el id provisto.");
  });

  it('deletePaisCulturaGastronomica debe lanzar una excepcion para un pais no asociado a una cultura gastronomica', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({variant: 'alpha-3'})
    });
 
    await expect(()=> service.deletePaisCulturaGastronomica(culturaGastronomica.id_cultura_gastronomica, nuevoPais.id_pais)).rejects.toHaveProperty("message", "El pais con el id dado no esta asociado a la cultura gastronomica.");
  });
});

