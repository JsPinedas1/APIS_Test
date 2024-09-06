import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturasGastronomicasList: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturasGastronomicasList = [];
    for (let i = 0; i < 5; i++) {
        const culturaGastronomica: CulturaGastronomicaEntity = await repository.save({
          nombre: faker.lorem.words(3),
          descripcion: faker.lorem.sentence(10),
          recetas: [ Object.assign(new RecetaEntity(), {
            nombre: faker.lorem.words(3),
            descripcion: faker.lorem.sentence(10),
            foto: faker.image.url(),
            preparacion: faker.lorem.paragraph(2),
            video: faker.internet.url()
          }) ],
          paises: [ Object.assign(new PaisEntity(), {}) ],
          productos: [ Object.assign(new ProductoEntity(), {}) ],
          restaurantes: [ Object.assign(new RestauranteEntity(), {}) ]
        });
        culturasGastronomicasList.push(culturaGastronomica);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las culturas gastronomicas', async () => {
    const culturasGastronomicas: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturasGastronomicas).not.toBeNull();
    expect(culturasGastronomicas).toHaveLength(culturasGastronomicasList.length);
  });

  it('findOne debe retornar una cultura gastronomica por id', async () => {
    const storedCulturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    const cultura_gastronomica = await service.findOne(storedCulturaGastronomica.id_cultura_gastronomica);
    expect(cultura_gastronomica).not.toBeNull();
    expect(cultura_gastronomica.nombre).toEqual(storedCulturaGastronomica.nombre);
    expect(cultura_gastronomica.descripcion).toEqual(storedCulturaGastronomica.descripcion);
  });

  it('findOne debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('create debe crear una nueva cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id_cultura_gastronomica: faker.string.uuid(),
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      recetas: [ Object.assign(new RecetaEntity(), {
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
        foto: faker.image.url(),
        preparacion: faker.lorem.paragraph(2),
        video: faker.internet.url()
      }) ],
      paises: [ Object.assign(new PaisEntity(), {}) ],
      productos: [ Object.assign(new ProductoEntity(), {}) ],
      restaurantes: [ Object.assign(new RestauranteEntity(), {}) ]
    };
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await service.create(culturaGastronomica);

    const almacenadaCulturaGastronomica: CulturaGastronomicaEntity = await repository.findOne({where: {id_cultura_gastronomica: nuevaCulturaGastronomica.id_cultura_gastronomica}});
    expect(almacenadaCulturaGastronomica).not.toBeNull();
    expect(almacenadaCulturaGastronomica.nombre).toEqual(nuevaCulturaGastronomica.nombre);
    expect(almacenadaCulturaGastronomica.descripcion).toEqual(nuevaCulturaGastronomica.descripcion);
  });

  it('update debe modificar una cultura gastronomica', async () => {
    const culturaGastronomicaAActualizar = culturasGastronomicasList[0];
    culturaGastronomicaAActualizar.nombre = "Nuevo nombre";
    culturaGastronomicaAActualizar.descripcion = "Nueva descripcion";

    const actualizadaCulturaGastronomica = await service.update(culturaGastronomicaAActualizar.id_cultura_gastronomica, culturaGastronomicaAActualizar);
    expect(actualizadaCulturaGastronomica).not.toBeNull();

    expect(actualizadaCulturaGastronomica.nombre).toEqual(culturaGastronomicaAActualizar.nombre);
    expect(actualizadaCulturaGastronomica.descripcion).toEqual(culturaGastronomicaAActualizar.descripcion);
  });

  it('update debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const culturaGastronomicaAActualizar = culturasGastronomicasList[1];
    culturaGastronomicaAActualizar.nombre = "Nuevo nombre";
    culturaGastronomicaAActualizar.descripcion = "Nueva descripcion";

    await expect(() => service.update("0", culturaGastronomicaAActualizar)).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });

  it('delete debe eliminar una cultura gastronomica', async () => {
    const culturaGastronomicaAEliminar = culturasGastronomicasList[0];

    await service.delete(culturaGastronomicaAEliminar.id_cultura_gastronomica);

    const culturaGastronomicaEliminada = await repository.findOne({ where: {id_cultura_gastronomica: culturaGastronomicaAEliminar.id_cultura_gastronomica}});
    expect(culturaGastronomicaEliminada).toBeNull();
  });

  it('delete debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No fue encontrada la cultura gastronomica con el id provisto.");
  });
});
