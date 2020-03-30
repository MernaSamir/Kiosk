export default [
    {
        id: 'login',
        name: 'Login',
        module: 'access'
    },
    {
        id: 'tw',
        name: "TakeAway",
        module: 'modes'
    },
    {
        id: 'tw',
        name: "TakeAway",
        module: 'modes'
    },
    {
        id: 'di',
        name: "Dine In",
        module: 'modes'
    },
    {
        id: 'dl',
        name: "Delivery / Call Center",
        module: 'modes'
    },
    {
        id: 'ct',
        name: "Catering",
        module: 'modes'
    },
    {
        id: 'ev',
        name: "Events",
        module: 'modes'
    },
    // {
    //     id: 'cancel_last_added',
    //     name: "Cancel Last Item Added",
    //     module: 'cancel'
    // }, {
    //     id: 'cancel_any_except_only',
    //     name: "Cancel Any Item (except if “Only Item” in Order)",
    //     module: 'cancel'
    // }, 
    {
        id: 'cancel_any_item',
        name: "Cancel Any Item",
        module: 'cancel'
    },
    {
        id: 'cancel_order',
        name: "Cancel Order",
        module: 'cancel'
    },
    {
        id: 'discount_item',
        name: "Discount Item",
        module: 'discount'
    },
    {
        id: 'discount_order',
        name: "Discount Order",
        module: 'discount'
    },
    {
        id: 'fast_cash',
        name: 'Fast Cash',
        module: 'payment'
    },
    {
        id: 'pay',
        name: 'Pay',
        module: 'payment'
    },
    {
        id: 'no_print',
        name: 'NO Print',
        module: 'payment'
    },
    {
        id: 'payment_back',
        name: 'Back',
        module: 'payment'
    },
    {
        id: 'split_order',
        name: 'Split Order',
        module: "takeaway"
    },
    {
        id: 'cancel_any_after_pay_except_only',
        name: 'Cancel Any Item After Click Pay (except “Only Item” in Order)',
        module: "takeaway"
    },
    {
        id: 'cancel_any_item_after_pay',
        name: "Cancel Any Item After Click Pay",
        module: "takeaway"
    },
    {
        id: 'cancel_order_after_pay',
        name: 'Cancel Order After Click Pay',
        module: "takeaway"
    },
    // {
    //     id: "void_any_item_except_only",
    //     name: "Void Any Item (except if “Only Item” in Order)",
    //     module: "dinein"
    // }, 
    {
        id: "void_any_item",
        name: 'Void Any Item',
        module: "dinein"
    },
    // {
    //     id: "void_any_item_except_only_after_print",
    //     name: 'Void Any Item after Print (except if “Only Item” in Order)',
    //     module: "dinein"
    // },
    {
        id: "void_any_item_after_print",
        name: 'Void Any Item after Print',
        module: "dinein"
    },
    {
        id: 'print',
        name: "Print",
        module: "dinein"
    },
    {
        id: 'reprint',
        name: "RePrint",
        module: 'dinein'
    },
    // {
    //     id: 'reprint_once_after_edit',
    //     name: "RePrint Once After Edit/Void",
    //     module: 'dinein'
    // }, 
    {
        id: 'add_open_item',
        name: 'Add Open Item',
        module: "dinein"
    },
    {
        id: 'move_item',
        name: "Item Options: Move Item",
        module: "dinein"
    },
    {
        id: "discount_seat",
        name: "Seat Options: Discount Seat",
        module: "dinein"
    },
    {
        id: 'transfer_table',
        name: "Floor Plan: Transfer Table",
        module: 'dinein'
    },
    {
        id: 'combine_table',
        name: "Floor Plan: Combine Table",
        module: "dinein"
    },
    {
        id: "edit_table",
        name: 'Floor Plan: Edit Table',
        module: 'dinein'
    },
    {
        id: 'customer_select',
        name: 'Select',
        module: 'customer'
    },
    {
        id: 'customer_view',
        name: 'View Profile',
        module: 'customer'
    },
    {
        id: 'customer_edit',
        name: "Edit Profile",
        module: 'customer'
    },
    {
        id: 'customer_add',
        name: "Add Profile",
        module: "customer"
    },
    {
        id: 'admin_access',
        name: "Access",
        module: "admin"
    },
    // {
    //     id: 'admin_summary',
    //     name: "View Summary",
    //     module: "admin"
    // },
    {
        id: 'admin_day_shift',
        name: "Day / Shift",
        module: "admin"
    },
    {
        id: 'admin_reports',
        name: "Reports",
        module: "admin"
    },
    {
        id: 'admin_orders',
        name: "Orders",
        module: "admin"
    },
    {
        id: 'admin_refund',
        name: "Order Refund",
        module: "admin"
    },
    {
        id: 'admin_cash_settlement',
        name: "Cash Settlement",
        module: "admin"
    },
    {
        id: 'admin_pays',
        name: "Pay Ins / Payouts",
        module: "admin"
    },
    {
        id: 'admin_change_waiter',
        name: "Change Table Waiters",
        module: "admin"
    },
    {
        id: 'admin_employee',
        name: "Employees",
        module: "admin"
    },
    {
        id: 'admin_pos_settings',
        name: "POS Settings",
        module: "admin"
    },
    {
        id: 'admin_floor_plan',
        name: "Edit FloorPlan",
        module: "admin"
    }
]
