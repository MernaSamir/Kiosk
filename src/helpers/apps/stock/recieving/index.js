import recieving_tables from './recieving_tables'
import new_transfer_order from './transfer_order/add_new'
import new_purchase_order from './purchase_order/add_new'
import summary_add from './summary/add_new'
import summary_doc from './summary/doc'

const recieving = {
    name: "Recieving",
    last: true,
    sub:[
        recieving_tables,
        new_transfer_order,
        new_purchase_order,
        summary_add,
        summary_doc
    ]
}

export default recieving;