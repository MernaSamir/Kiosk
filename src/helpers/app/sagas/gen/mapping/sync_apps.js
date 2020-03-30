
//tabels that are synced to gun
//gun_db prop is the name of the set to add to in gun
//func prop is the name fo the function to be applied before adding to gun
//gun_sync prop is checked before adding these tables to db (it is used in create and update)
export const sync_apps = {
    "orders__main": { 
        gun_db: "cc", 
        func:"filterOrders", 
        gun_sync: true 
    },
    "orders__details": { 
        gun_db: "cc", 
        func: "filterDetails",
        func_params:{
            app_name:"orders__main", 
            key:"order"
        }, 
        gun_sync: true  
    },
    "orders__receipt": { 
        gun_db: "cc", 
        func: "filterDetails",
        func_params:{
            app_name:"orders__main", 
            key:"order"
        }, 
        gun_sync: true 
    },
    "orders__receipt_items": { 
        gun_db: "cc", 
        func: "filterDetails",
        func_params:{
            app_name:"orders__receipt", 
            key:"receipt"
        }, 
        gun_sync: true 
    },
    "orders__payment": { 
        gun_db: "cc",
        func: "filterDetails",
        func_params:{
            app_name:"orders__main", 
            key:"order"
        }, 
        gun_sync: true 
    },
    "orders__discount": { 
        gun_db: "cc",
        func: "filterDetails",
        func_params:{
            app_name:"orders__main", 
            key:"order"
        }, 
        gun_sync: true 
    },
    "orders__business_days": {},
    "orders__shifts": {},
    "parties__customer": { gun_db: "global"},
    'parties__address': { gun_db: "global"},
    'parties__customer_contacts': { gun_db: "global"},
    "parties__family_members": {gun_db: "global"},
    'parties__reservation': {},
    "stock__transaction_ro" : {gun_db: "tr"},
    "stock__transaction_ro_detail" : {gun_db: "tr"},
    "stock__transaction_tr":{gun_db: "tr"},
    "stock__transaction_tr_detail":{gun_db: "tr"},
    "stock__purchase_orders":{gun_db: "tr"},
    "stock__purchase_orders_detail":{gun_db: "tr"}
}

//to_gun : names of tables to be synced to gun
//check_update: names of tables to check their update before adding to gun
export const sync_stock_apps = {
    to_gun : {
        "stock__balance":{gun_db: "st"},
        "stock__balance_trans":{gun_db: "st"},
        "stock__weight_price":{gun_db: "st"},
    },
    check_update : {
        "stock__transaction_ro_detail":{},
        "stock__transaction_tr_detail":{},
        "stock__purchase_orders_detail":{}
    }

}
export default sync_apps