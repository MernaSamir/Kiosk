import cto_tables from './cto_tables'
import add_new from './add_new'
import summary from './summary'

const consolidated_to = {
    name: "Consolidated TO (CTO)",
    last: true,
    sub:[
        cto_tables,
        add_new,
        summary
    ]
}

export default consolidated_to;