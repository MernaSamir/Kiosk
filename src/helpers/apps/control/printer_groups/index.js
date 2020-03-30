const printer_groups = {
    name: "Printer Groups",
    path: '/printer-groups',
    reduxName: 'settings__printer_group',
    tableList: {
        reduxName: 'settings__printer_group',
        filter: {
            key: 'Filter',
            params: {
                'location': 'licensing__location.active'
            }
        }
    },
    layouts: [

        {
            layoutName: "Basic Information",
            type: 'Layout_2',
            main: true,
            reduxName: 'settings__printer_group',
            extra_data: {
                key: 'mapParams',
                params: {
                    location: 'licensing__location.active'
                }
            },
            fields: [
                { label: "Name", type: 'text', name: "name", placeholder: 'Name' },
                { label: "Alter Name", type: 'text', name: "alter_name", placeholder: 'Alter Name' },
                {
                    label:"Display Type",type:"select",name:"_type",options:[{id:"packing", name: "Packing"}, {id:"receipt", name: "Receipt"},{id:"kitchen", name: "Kitchen"}]
                },
                {
                    label: "Display Name",
                    type: 'Radiobtn',
                    name: "show",
                    options: [
                        { label: 'Name', value: 'n' },
                        { label: 'Altername', value: 'a' }
                    ]
                },
                {
                    label: "Language",
                    type: 'select',
                    reduxName: 'dropdowns__lang',
                    name: 'lang',
                    child: true
                },
                {
                    name: 'printers',
                    label: "Printers",
                    type: 'tree_select',
                    multiple: true,
                    tree: {
                        reduxName: 'settings__printer',
                    },
                },
                {
                    label: "Modes",
                    type: 'tree_select',
                    name: "mode",
                    mode: 'multiple',
                    tree: {
                        reduxName: 'settings__mode',
                       
                    },
                },
                {
                    label: "Zones",
                    type: 'tree_select',
                    name: "zones",
                    mode: 'multiple',
                    tree: {
                        reduxName: 'dinin__zones',
                       
                    },
                },
            ]
        },

    ]
}

export default printer_groups