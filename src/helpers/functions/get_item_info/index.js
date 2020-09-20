import applyFilters from "helpers/functions/filters";

export const getInfo = (l, selector) => {
console.log(l,"llllllllll")
    const item = applyFilters({
        key: 'chain',
        selectors: {
            'items__prices': selector,
            'items__sales_items': 'sales_item'
        },
    }, l)
    console.log(item,"otttttttttttttttt")

    const size = applyFilters({
        key: 'chain',
        selectors: {
            'items__prices': selector,
            'dropdowns__units_of_measure': 'sales_unit'
        },
    }, l)
    console.log(size,"ssssssssss")

    return { name: item.name, size: size.name }
}