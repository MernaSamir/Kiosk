export default (station)=>({
    "settings__printer_group": {
        "filter": {
            "active": true,
            "location": station.location
        }
    },
    "items__item_printers": {
        printer_group__location: station.location
    },
    "settings__display_types": {},
    "settings__printer": {
        "printergroup__location": station.location
    },    
})