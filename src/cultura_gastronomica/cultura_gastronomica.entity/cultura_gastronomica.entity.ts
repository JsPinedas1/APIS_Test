import { PaisEntity } from "src/pais/pais.entity/pais.entity";
import { ProductoEntity } from "src/producto/producto.entity/producto.entity";
import { RecetaEntity } from "src/receta/receta.entity/receta.entity";
import { RestauranteEntity } from "src/restaurante/restaurante.entity/restaurante.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CulturaGastronomicaEntity {
    @PrimaryGeneratedColumn('uuid')
    id_cultura_gastronomica: string;

    @Column()
    nombre: string;
    @Column()
    descripcion: string;

    @ManyToMany(() => RestauranteEntity, restaurante => restaurante.culturasGastronomicas)
    @JoinTable()
    restaurantes: RestauranteEntity[];

    @ManyToMany(() => PaisEntity, pais => pais.culturasGastronomicas)
    @JoinTable()
    paises: PaisEntity[];

    @ManyToMany(() => ProductoEntity, producto => producto.culturasGastronomicas)
    @JoinTable()
    productos: ProductoEntity[];

    @OneToMany(() => RecetaEntity, receta => receta.culturaGastronomica)
    @JoinTable()
    recetas: RecetaEntity[];
}
