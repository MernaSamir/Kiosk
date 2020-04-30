import moment from "moment";

const apps = (station) => ({
    "dinin__floors": { "filter": { location: station.location } },
    "dinin__zones": { "filter": { floor_id__location: station.location } },
    "dinin__tables": { "filter": { zone__floor_id__location: station.location } },
    "items__sales_items": {},
    "items__recipe": {},
    'items__recipe_alter': {},
    'stock__items': {},

    "items__combo": {},
    "items__combo_alters": {},
    "items__custom_mix": {},
    "items__custom_mix_group": {},
    "items__item_color": {},
    "dropdowns__units_of_measure": {},
    "dropdowns__doneness": {},
    "dropdowns__courses": {},
    "dropdowns__reasons": {},
    "dropdowns__delivery_group": {},
    "items__prices": {},
    "items__base_sales_cat": {},
    "items__custom_menu": {},
    "items__modifier_items": {},
    "items__modifier_group": {},
    "items__department": {},
    "licensing__store": {},
    "settings__notifications":{},
    "items__assign_modifier_items": {
    },
    // "orders__main": {
    //     "filter": { "end_time__isnull": true, shift__date__location: station.location }
    // },
    // "orders__details": {
    //     "filter": { "order__end_time__isnull": true, order__shift__date__location: station.location }
    // },
    "orders__item_seats": {
        "filter": { "details__order__end_time__isnull": true, details__order__shift__date__location: station.location }
    },
    'orders__recipe_removals': {
        "filter": { "detail__order__end_time__isnull": true, detail__order__shift__date__location: station.location }
    },

    "orders__order_seats": {
        "filter": { "order__end_time__isnull": true, order__shift__date__location: station.location }
    },
    // "orders__receipt": {
    //     "filter": { "order__end_time__isnull": true, order__shift__date__location: station.location }
    // },
    // "orders__receipt_items": {
    //     "filter": { "receipt__order__end_time__isnull": true, details__order__shift__date__location: station.location }
    // },
    "orders__receipt_seats": {
        "filter": { "receipt__order__end_time__isnull": true, receipt__order__shift__date__location: station.location }
    },
    "orders__payment": {
        "filter": { "receipt__order__end_time__isnull": true, order__shift__date__location: station.location }
    },
    "orders__orders_discount": {
        "filter": { "order__end_time__isnull": true, order__shift__date__location: station.location }
    },
    "orders__business_days": { filter: { location: station.location } },
    "financials__reserv_table": { filter: { location: station.location } },
    "orders__shifts": { filter: { date__location: station.location } },
    "settings__mode": {},
    "settings__sub_mode": {},
    "payment__types": {},
    "discount__main": {},
    "auths__user": {
        // "filter": {"serve__shift__end_time__isnull": true}
    },
    'employee__employee_locations': {},
    "parties__reservation": {
        date__gte: moment().format("DD-MM-YYYY")
    },
    "parties__address": {},
    "parties__customer_contacts": {},
    "geographies__area": {},
    "parties__relationships": {},
    "financials__taxes": {},
    "financials__service": {},
    "settings__filter": {},
    geographies__district: {},
    geographies__city: {},
    geographies__country: {},
    geographies__state: {},
    "geographies__street": {},
    "licensing__chain": {},
    "licensing__location": {},
    'licensing__location_type':{},
    "sync__sync": {},
    "sync__synced_location": {},
    "items__price_by_location": { "filter": { "location": station.location } },
    // "employee__employee": {},
    "dropdowns__occasions": {},
    "dropdowns__delivery_service": {
        filter: {
            active: true
        }
    },
    "dropdowns__delivery_service_mode": {},
    // "dropdowns__reasons": {},
    "dropdowns__special_requests": {},
    "financials__minimum_charge": {},
    "discount__campaigns": {
        "filter": {
            "active": true,
            date_to__gte: moment().subtract(1, 'day').format("YYYY-MM-DD")
        }
    },
    "licensing__station": {
        // filter: {
        //     location: station.location
        // }
    },
    parties__title: {},
    parties__customer_orders: {},
    parties__customer: {},
    dropdowns__compaign_rates: {},
    dropdowns__currencies: {},
    settings__chain_customer_receipt: {},
    settings__customer_receipt: {},
    dropdowns__currencies_conversions: {},
    parties__customer_group: {},
    dropdowns__complaint_categories: {},
    dropdowns__lang: {},
    items__sorting: {},
})
export default apps;
