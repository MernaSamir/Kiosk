import summary from './summary'
import add_new from './add_new'
import doc from './doc'

const waste_order = {
    name: "Waste Order (WO)",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default waste_order;