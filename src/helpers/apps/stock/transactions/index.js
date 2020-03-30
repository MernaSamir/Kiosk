import product_requisition from './product_requisition'
import receiving_order from './receiving_order'
import transfer_orrder from './transfer_order'
import purchase_order from './purchase_order'
import return_order from './return_order'
import waste_order from './waste_order'

const transactions = {
    name:'Transactions',
    data: {
        product_requisition,
        receiving_order,
        transfer_orrder,
        purchase_order,
        return_order,
        waste_order
    }
    
}

export default transactions;