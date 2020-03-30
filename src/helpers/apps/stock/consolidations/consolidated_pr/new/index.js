// import FieldsBuild from 'helpers/fields'
import cwh from './cwh'
const add_new = {
    name: "Add New Inter",
    back: true,
    path: '/consolidated_pr',
    reduxName: 'stock__consolidations',
    fetch: ["stock__product_requisition_detail",
        "stock__balance", 'dropdowns__units_of_measure', "dropdowns__units_of_measure",
        "dropdowns__ratio"],
    layouts: {
        ...cwh,
    }
}

export default add_new;