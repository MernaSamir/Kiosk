import setup from './setup'
import transactions from './transactions'
import consolidations from './consolidations'
import audits from './audits'
import inbox from './inbox'
import manufacturing from './manufacturing'
import vendorInvoice from './vendor_invoice'
import recieving from './recieving'
import recieve_open from './recieving/recieve_open'
const Stock = {
    name:'Stock',
    iconName:'Stock',
    data: {
        setup,
        consolidations,
        audits,
        inbox,
        manufacturing,
        transactions,
        vendorInvoice,
        recieving,
        recieve_open
    }
    
}

export default Stock;