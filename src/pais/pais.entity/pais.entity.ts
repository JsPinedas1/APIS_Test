import { CulturaGastronomicaEntity } from "src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity";
import { RestauranteEntity } from "src/restaurante/restaurante.entity/restaurante.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaisEntity {
    @PrimaryGeneratedColumn('uuid')
    id_pais: string;

    @Column()
    nombre: string;
    @Column()
    codigo: string;

    @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.paises)
    culturasGastronomicas: CulturaGastronomicaEntity[];

    @ManyToMany(() => RestauranteEntity, restaurante => restaurante.paises)
    
    @JoinTable()
    restaurantes: RestauranteEntity[];
}
