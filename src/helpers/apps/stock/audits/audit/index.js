import summary from './summary'
import add_new from './add_new'
import audit_doc from './doc'

const stock_count = {
    name: "Audits",
    last: true,
    sub:[
        summary,
        add_new,
        audit_doc
    ]
}

export default stock_count;