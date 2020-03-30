import manufacture_order from "./man_order";
import manufacture_order_cwh from "./man_order_cwh";
// import manufacture_submit from "./man_submit";
// import cmp from './consolidated_mp'
import bo from './butcher_order'
const manufacturing = {
    name: 'Manufacturing',
    data: {
       manufacture_order,
       manufacture_order_cwh,
    //    manufacture_submit,
        bo
    }
}

export default manufacturing;
