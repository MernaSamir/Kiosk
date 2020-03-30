export default (station)=> ({
    orders__business_days: {
        filter: {
            location: station.location,
            end_time__isnull: false
        },
        keys: {
            start: {key: 'created_at__gte'},
            end: {key: 'created_at__lte'},
        }
    },
    orders__shifts: {
        filter: {
            date__location: station.location,
            date__end_time__isnull: false
        },
        keys: {
            start: {key: 'date__created_at__gte'},
            end: {key: 'date__created_at__lte'},
            shift: {key: 'shift_num'}
        }
    },
    orders__main: {
        filter: {
            shift__date__location: station.location,
            shift__date__end_time__isnull: false
        },
        keys: {
            start: {key: 'shift__date__created_at__gte'},
            end: {key: 'shift__date__created_at__lte'},
            shift: {key: 'shift__shift_num'},
            station: {key: "station"},
            cashier: {key: "cashier"},
            waiter: {key: 'serve'}
        }
    },
    orders__details: {
        filter: {
            order__shift__date__location: station.location,
            order__shift__date__end_time__isnull: false
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt: {
        filter: {
            order__shift__date__location: station.location,
            order__shift__date__end_time__isnull: false
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__payment: {
        filter: {
            order__shift__date__location: station.location,
            order__shift__date__end_time__isnull: false
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt_items: {
        filter: {
            receipt__order__shift__date__location: station.location,
            receipt__order__shift__date__end_time__isnull: false
        },
        keys: {
            start: {key: 'receipt__order__shift__date__created_at__gte'},
            end: {key: 'receipt__order__shift__date__created_at__lte'},
            station: {key: "receipt__order__station"},
            shift: {key: 'receipt__order__shift__shift_num'},
            cashier: {key: "receipt__order__cashier"},
            waiter: {key: 'receipt__order__serve'}
        }
    },
    geographies__area: {},
    geographies__street: {},
    licensing__location: {}
})