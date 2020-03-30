import summary from './summary'
import add_new from './add_new'

const consolidated_to = {
    name: "Consolidated PO (CPO)",
    last: true,
    sub:[
        summary,
        add_new
    ]
}

export default consolidated_to;