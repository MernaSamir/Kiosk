import summary from './summery'
import add_new from './new_order'
import doc from './doc'

const vendor_invoice = {
    name: "Vendor Invoice",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default vendor_invoice;