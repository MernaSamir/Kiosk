import applyFilters from "helpers/functions/filters";

export const getInfo = (l, selector) => {

    const item = applyFilters({
        key: 'chain',
        selectors: {
            'items__prices': selector,
            'items__sales_items': 'sales_item'
        },
    }, l)
    const size = applyFilters({
        key: 'chain',
        selectors: {
            'items__prices': selector,
            'dropdowns__units_of_measure': 'sales_unit'
        },
    }, l)
    return { name: item.name, size: size.name }
}