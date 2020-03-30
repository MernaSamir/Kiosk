import add_new_table from './add_new_table'
import summary_table from './summary_table'


const consolidated_to_summary = {
    name: "Consolidated TO (CTO)",
    path: '/consolidated-to',
    tabs: [
        { name: 'CTO ', key: 'cto', value: 'cto' },
        { name: 'Summary', key: 'summary', value: 'summary' },
    ],
    // disabledKey: '_type',
    fetch: [ "stock__consolidations", 'stock__consolidations_detail',
        "stock__balance","dropdowns__units_of_measure", 'parties__vendor_by_stock_items',
        "dropdowns__ratio"],
    layouts: {
        ...add_new_table,
        ...summary_table,
    },
}

export default consolidated_to_summary;