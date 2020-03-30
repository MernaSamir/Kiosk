import transfer_order from './transfer_order'
import purchase_order from './purchase_order'
import summary from './summary'

const recieving_tables = {
    name: "Recieving",
    path: '/recieving',
    tabs: [
        { name: 'PO', key: 'po', value: 'po' },
        { name: 'TO', key: 'to', value: 'to' },
        { name: 'Summary', key: 'summary', value: 'summary' },
    ],
    // disabledKey: '_type',
    fetch: [ "stock__transaction_tr", 'stock__transaction_tr_detail','stock__purchase_orders',
        "stock__purchase_orders_detail", "parties__vendor","stock__transaction_ro_detail",
        "stock__balance","dropdowns__units_of_measure", 'parties__vendor_by_stock_items',
        "dropdowns__ratio"],
    layouts: {
        ...purchase_order,
        ...transfer_order,
        ...summary,
    },
}

export default recieving_tables;