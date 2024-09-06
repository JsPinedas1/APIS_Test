import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaService } from './receta.service';

import { faker } from '@faker-js/faker';
import { RecetaEntity } from './receta.entity/receta.entity';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
        foto: faker.image.url(),
        preparacion: faker.lorem.paragraph(2),
        video: faker.internet.url(),
      });
      recetasList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne should return a receta by id', async () => {
    const storedreceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedreceta.id_receta);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedreceta.nombre);
    expect(receta.descripcion).toEqual(storedreceta.descripcion);
    expect(receta.foto).toEqual(storedreceta.foto);
    expect(receta.preparacion).toEqual(storedreceta.preparacion);
    expect(receta.video).toEqual(storedreceta.video);
  });

  it('findOne should throw an exception for an invalid receta', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encuentra una receta con ese id',
    );
  });

  it('create should return a new receta', async () => {
    const receta: RecetaEntity = {
      id_receta: faker.string.uuid(),
      nombre: faker.lorem.words(3),
      descripcion: faker.lorem.sentence(10),
      foto: faker.image.url(),
      preparacion: faker.lorem.paragraph(2),
      video: faker.internet.url(),
      culturaGastronomica: Object.assign(new CulturaGastronomicaEntity(), {
        nombre: faker.lorem.words(3),
        descripcion: faker.lorem.sentence(10),
      }),
    };

    const newreceta: RecetaEntity = await service.create(receta);
    expect(newreceta).not.toBeNull();

    const storedreceta: RecetaEntity = await repository.findOne({
      where: { id_receta: newreceta.id_receta },
    });
    expect(storedreceta).not.toBeNull();
    expect(storedreceta.nombre).toEqual(newreceta.nombre);
    expect(storedreceta.descripcion).toEqual(newreceta.descripcion);
    expect(storedreceta.foto).toEqual(newreceta.foto);
    expect(storedreceta.preparacion).toEqual(newreceta.preparacion);
    expect(storedreceta.video).toEqual(newreceta.video);
  });

  it('update should modify a receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = 'Nuevo nombre';
    receta.descripcion = 'Nueva descripcion';

    const updatedreceta: RecetaEntity = await service.update(
      receta.id_receta,
      receta,
    );
    expect(updatedreceta).not.toBeNull();

    const storedreceta: RecetaEntity = await repository.findOne({
      where: { id_receta: receta.id_receta },
    });
    expect(storedreceta).not.toBeNull();
    expect(storedreceta.nombre).toEqual(receta.nombre);
    expect(storedreceta.descripcion).toEqual(receta.descripcion);
  });

  it('update should throw an exception for an invalid receta', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta,
      nombre: 'nuevo nombre',
      descripcion: 'nueva descripcion',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'No se encuentra una receta con ese id',
    );
  });

  it('delete should remove a receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id_receta);

    const deletedreceta: RecetaEntity = await repository.findOne({
      where: { id_receta: receta.id_receta },
    });
    expect(deletedreceta).toBeNull();
  });

  it('delete should throw an exception for an invalid receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id_receta);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encuentra una receta con ese id',
    );
  });
});
