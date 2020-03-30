export const stock__items = {
    reduxName: 'stock__items',
    match: 'category',
    extra_show: {
        path: 'dropdowns__units_of_measure',
        key: 'ShowBUOM',
        select: 'recipe_unit_default',
        show: 'symbol',
    }
}

export const stock__categories = {
    reduxName: 'stock__categories',
    match: 'menu',
}

export const stock__menus = {
    reduxName: 'stock__menus'
}

export const stock__item_variants = {
    reduxName: 'stock__item_variants',
    match: 'item',
    extra_show: {
        key: 'UOMConvert',
        path: 'dropdowns__units_of_measure',
        show: 'symbol',
    }
}