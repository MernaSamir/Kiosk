import summary from './summery'
import add_new from './new_order'
import doc from './doc'

const man_order = {
    name: " Consolidated MP (CMP) ",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default man_order;