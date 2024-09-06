export enum Categoria {
    CONDIMENTOS,
    GRANOS,
    PROTEINAS,
    LACTEOS,
    HARINAS,
    CARBOHIDRATOS,
    VEGETALES,
    BEBIDAS,
    LICORES,
    ACEITES
}

export function listCategories() {
    return [
        Categoria.CONDIMENTOS,
        Categoria.GRANOS,
        Categoria.PROTEINAS,
        Categoria.LACTEOS,
        Categoria.HARINAS,
        Categoria.CARBOHIDRATOS,
        Categoria.VEGETALES,
        Categoria.BEBIDAS,
        Categoria.LICORES,
        Categoria.ACEITES
    ]
}