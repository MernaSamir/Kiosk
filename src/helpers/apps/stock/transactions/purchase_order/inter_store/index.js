import summary from './summary'
import add_new from './add_new'
import po_doc from './doc'
const inter_store = {
    name: "Purchase Order",
    sub:[
        summary,
        add_new,
        po_doc
    ]
}

export default inter_store;