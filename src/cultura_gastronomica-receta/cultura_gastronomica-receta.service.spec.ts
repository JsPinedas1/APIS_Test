import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Repository } from 'typeorm';
import { RecetaEntity } from 'src/receta/receta.entity/receta.entity';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from 'src/producto/producto.entity/producto.entity';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from 'src/pais/pais.entity/pais.entity';

describe('CulturaGastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRecetaService],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(
      CulturaGastronomicaRecetaService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaGastronomicaRepository.clear();

    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
        foto: faker.image.url(),
        preparacion: faker.lorem.paragraph(2),
        video: faker.internet.url(),
      });
      recetasList.push(receta);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      paises: [Object.assign(new PaisEntity(), {})],
      recetas: recetasList,
      productos: [Object.assign(new ProductoEntity(), {})],
      restaurantes: [Object.assign(new RestauranteEntity(), {})],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaCulturaGastronomica debe crear un receta a una cultura gastronomica', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
    });

    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
      });

    const result: CulturaGastronomicaEntity =
      await service.addRecetaCulturaGastronomica(
        nuevaCulturaGastronomica.id_cultura_gastronomica,
        nuevaReceta.id_receta,
      );

    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(nuevaReceta.nombre);
    expect(result.recetas[0].descripcion).toBe(nuevaReceta.descripcion);
  });

  it('addRecetaCulturaGastronomica debe lanzar una excepcion para un receta invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
      });

    await expect(() =>
      service.addRecetaCulturaGastronomica(
        nuevaCulturaGastronomica.id_cultura_gastronomica,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrado la receta con el id provisto.',
    );
  });

  it('addRecetaCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.addRecetaCulturaGastronomica('0', nuevaReceta.id_receta),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrada la cultura gastronomica con el id provisto.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe retornar un receta por cultura gastronomica', async () => {
    const receta: RecetaEntity = recetasList[0];
    const recetaAlmacenado: RecetaEntity =
      await service.findRecetaByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id_cultura_gastronomica,
        receta.id_receta,
      );
    expect(recetaAlmacenado).not.toBeNull();
    expect(recetaAlmacenado.nombre).toBe(receta.nombre);
    expect(recetaAlmacenado.descripcion).toBe(receta.descripcion);
    expect(recetaAlmacenado.foto).toBe(receta.foto);
    expect(recetaAlmacenado.preparacion).toBe(receta.preparacion);
    expect(recetaAlmacenado.video).toBe(receta.video);
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe lanzar una excepcion para un receta invalido', async () => {
    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id_cultura_gastronomica,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrado la receta con el id provisto.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId('0', receta.id_receta),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrada la cultura gastronomica con el id provisto.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe lanzar una excepcion para un receta no asociado a la cultura gastronomica', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id_cultura_gastronomica,
        nuevaReceta.id_receta,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id dado no esta asociado a la cultura gastronomica.',
    );
  });

  it('findRecetaByCulturaGastronomicaId debe retornar recetas por cultura gastronomica', async () => {
    const recetas: RecetaEntity[] =
      await service.findRecetasByCulturaGastronomicaId(
        culturaGastronomica.id_cultura_gastronomica,
      );
    expect(recetas.length).toBe(5);
  });

  it('findRecetaByCulturaGastronomicaId debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    await expect(() =>
      service.findRecetasByCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrada la cultura gastronómica con el id dado.',
    );
  });

  it('associateRecetaCulturaGastronomica debe actualizar lista de recetas para una cultura gastronomica', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country(),
      codigo: faker.location.countryCode({ variant: 'alpha-3' }),
      descripcion: faker.word.words(),
      foto: faker.internet.url(),
      preparacion: faker.word.words(),
      video: faker.internet.url()
    });

    const culturaGastronomicaActualizada: CulturaGastronomicaEntity =
      await service.associateRecetasCulturaGastronomica(
        culturaGastronomica.id_cultura_gastronomica,
        [nuevaReceta],
      );
    expect(culturaGastronomicaActualizada.recetas.length).toBe(1);

    expect(culturaGastronomicaActualizada.recetas[0].nombre).toBe(
      nuevaReceta.nombre,
    );
    expect(culturaGastronomicaActualizada.recetas[0].descripcion).toBe(
      nuevaReceta.descripcion,
    );
    expect(culturaGastronomicaActualizada.recetas[0].foto).toBe(
      nuevaReceta.foto,
    );
    expect(culturaGastronomicaActualizada.recetas[0].preparacion).toBe(
      nuevaReceta.preparacion,
    );
    expect(culturaGastronomicaActualizada.recetas[0].video).toBe(
      nuevaReceta.video,
    );
  });

  it('associateRecetaCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.associateRecetasCulturaGastronomica('0', [nuevaReceta]),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrada la cultura gastronómica con el id provisto.',
    );
  });

  it('associateRecetaCulturaGastronomica debe lanzar una excepcion para un receta invalido', async () => {
    const nuevaReceta: RecetaEntity = recetasList[0];
    nuevaReceta.id_receta = '0';

    await expect(() =>
      service.associateRecetasCulturaGastronomica(
        culturaGastronomica.id_cultura_gastronomica,
        [nuevaReceta],
      ),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrado la receta con el id dado.',
    );
  });

  it('deleteRecetaCulturaGastronomica debe eliminar un receta de una cultura gastronomica', async () => {
    const receta: RecetaEntity = recetasList[0];

    await service.deleteRecetaCulturaGastronomica(
      culturaGastronomica.id_cultura_gastronomica,
      receta.id_receta,
    );

    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.findOne({
        where: {
          id_cultura_gastronomica: culturaGastronomica.id_cultura_gastronomica,
        },
        relations: ['restaurantes', 'paises', 'productos', 'recetas'],
      });
    const recetaBorrado: RecetaEntity =
      culturaGastronomicaAlmacenada.recetas.find(
        (p) => p.id_receta === receta.id_receta,
      );

    expect(recetaBorrado).toBeUndefined();
  });

  it('deleteRecetaCulturaGastronomica debe lanzar una excepcion para un receta invalida', async () => {
    await expect(() =>
      service.deleteRecetaCulturaGastronomica(
        culturaGastronomica.id_cultura_gastronomica,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrado la receta con el id provisto.',
    );
  });

  it('deleteRecetaCulturaGastronomica debe lanzar una excepcion para una cultura gastronomica invalida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.deleteRecetaCulturaGastronomica('0', receta.id_receta),
    ).rejects.toHaveProperty(
      'message',
      'No fue encontrada la cultura gastronómica con el id provisto.',
    );
  });

  it('deleteRecetaCulturaGastronomica debe lanzar una excepcion para un receta no asociado a una cultura gastronomica', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.deleteRecetaCulturaGastronomica(
        culturaGastronomica.id_cultura_gastronomica,
        nuevaReceta.id_receta,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id dado no esta asociado a la cultura gastronomica.',
    );
  });
});
