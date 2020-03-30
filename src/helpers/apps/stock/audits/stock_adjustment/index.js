import summary from './summary'
import add_new from './add_new'

const stock_adjustment = {
    name: "Stock Adjustment (SA)",
    last: true,
    sub:[
        summary,
        add_new
    ]
}

export default stock_adjustment;