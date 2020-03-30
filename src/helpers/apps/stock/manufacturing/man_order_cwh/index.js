import manu_tables from './manufacturing_tables'
import new_man_order from './add_new/new_order'
// import new_purchase_order from './purchase_order/add_new'
// import summary_add from './summary/add_new'
import summary_doc from './summary/doc'

const manufacture = {
    name: "Manufacture Order",
    last: true,
    sub:[
        manu_tables,
        new_man_order,
        summary_doc

    ]
}

export default manufacture;