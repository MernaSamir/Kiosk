import summary from './summery'
import add_new from './new_order'
import doc from './doc'

const man_submit = {
    name: "Manufacture Submit order (MSO)",
    last: true,
    sub:[
        summary,
        add_new,
        doc
    ]
}

export default man_submit;