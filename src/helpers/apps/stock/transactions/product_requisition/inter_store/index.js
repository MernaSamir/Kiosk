import summary from './summary'
import add_new from './add_new'
import doc from './document'

const inter_store = {
    name: "Product Requisition",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default inter_store;