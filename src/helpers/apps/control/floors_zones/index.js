const floors_zones = {
    name: "Floors & Zones",
    path: '/floors-zones',
    reduxName: 'dinin__floors',
    tableList: {
        reduxName: 'dinin__floors',
        filter: {
            key: 'Filter',
            params: {
                'location': 'licensing__location.active'
            }
        }
    },
    layouts: [

        {
            layoutName: "Floor",
            type: 'Layout_2',
            main: true,
            reduxName: 'dinin__floors',
            extra_data: {
                key: 'mapParams',
                params: {
                    location: 'licensing__location.active'
                }
            },
            fields: [
                { label: "Name", type: 'text', name: "name", placeholder: 'Name' },
                { label: "Alter Name", type: 'text', name: "alter_name", placeholder: 'Alter Name' },
            ]
        },

        {
            layoutName: "Zones",
            type: 'Layout_1',
            reduxName: 'dinin__zones',
            init: {
                key: 'List',
                select: { floor_id: 'dinin__floors.active' }
            },
            list: true,
            link: { floor_id: 'dinin__floors.id' },
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'dinin__zones',
                    add_new_item: true,
                    table_columns: [
                        { head: "Name", type: 'text', name: "name" },
                        { head: "Altername", type: 'text', name: "alter_name" },
                        { head: "Order", type: 'select', name: "sub_mode", reduxName: 'settings__sub_mode' }
                    ]
                },

            ]
        }
    ]
}

export default floors_zones