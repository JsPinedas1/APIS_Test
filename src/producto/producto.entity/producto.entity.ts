import { CulturaGastronomicaEntity } from "src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity";
import { Categoria } from "src/shared/enums/categoria";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductoEntity {
    @PrimaryGeneratedColumn('uuid')
    id_producto: string;
    
    @Column()
    nombre: string;
    @Column()
    descripcion: string;
    @Column()
    historia: string;
    @Column()
    categoria: string;

    @ManyToMany(
      () => CulturaGastronomicaEntity,
      (culturaGastronomica) => culturaGastronomica.productos,
    )
    culturasGastronomicas: CulturaGastronomicaEntity[];
}
