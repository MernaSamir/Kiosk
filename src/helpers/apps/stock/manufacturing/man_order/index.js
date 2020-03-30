import summary from './summary'
import add_new from './new_order'
import doc from './doc'

const man_order = {
    name: "Manufacture Order (MO)",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default man_order;