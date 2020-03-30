import summary from './summary'
import add_new from './add_new'
import count_doc from './doc'

const stock_count = {
    name: "Stock Count (SC)",
    last: true,
    sub:[
        summary,
        add_new,
        count_doc
    ]
}

export default stock_count;