
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecetaEntity {
   @PrimaryGeneratedColumn('uuid')
   id_receta: string;

   @Column()
   nombre: string;
   @Column()
   descripcion: string;
   @Column()
   foto: string;
   @Column()
   preparacion: string;
   @Column()
   video: string;

   @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.recetas)
   culturaGastronomica: CulturaGastronomicaEntity;
}