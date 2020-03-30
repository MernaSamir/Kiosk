import summary from './summary'
import add_new from './new'
import doc from './document'
const inter_store = {
    name: "Stores",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default inter_store;