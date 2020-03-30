import summary from './summary'
import add_new from './new_order'
import doc from './doc'

const butcher_order = {
    name: "Butcher Order (BO)",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default butcher_order;