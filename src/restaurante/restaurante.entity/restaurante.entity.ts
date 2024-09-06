/* eslint-disable prettier/prettier */

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { CulturaGastronomicaEntity } from "src/cultura_gastronomica/cultura_gastronomica.entity/cultura_gastronomica.entity";
import { PaisEntity } from "src/pais/pais.entity/pais.entity";

@Entity()
export class RestauranteEntity {
    @PrimaryGeneratedColumn("uuid")
    id_restaurante: string;

    @Column()
    nombre: string;

    @Column()
    ciudad: string;

    @Column()
    estrellas_michelin: string;

    @Column()
    fecha: string;
    
    @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.restaurantes)
    culturasGastronomicas: CulturaGastronomicaEntity[];

    @ManyToMany(() => PaisEntity, pais => pais.restaurantes)
    paises: PaisEntity[];
}
