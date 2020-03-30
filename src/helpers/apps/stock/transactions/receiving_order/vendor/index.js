import summary from './summary'
import add_new from './add_new'
import doc from './doc';
const inter_store = {
    name: "Vendor (RO)",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default inter_store;