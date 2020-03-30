const attendance_class = {
    name: "Attendance",
    path: '/attendance',
    reduxName: 'employee__attendance',
    layouts: [
        {
            type: 'Layout_1',
            reduxName: 'employee__attendance',
            list: true,
            init: {
                key: 'List',
                select: {},
            },
            fields: [

                {
                    label:'From date',
                    name:'from_hour',
                    type:'datePicker',
                },
                {
                    label: 'To date',
                    name:'to_hour',
                    type:'datePicker',
                },
                {
                    type: 'TableMultiCol',
                    name: "",
                    deps: ["from_hour", "to_hour"],
                    showHeader: true,
                    showSubHeader: false,
                    colKey: 'dates',
                    reduxName: 'parties__customer',
                    cols: {
                        // reduxName:"dates"
                    },
                    data_filter: {
                        dates: {
                            key: 'getDatesInBetween',
                            from_date: 'from_hour',
                            to_date: 'to_hour',
                        }
                    },
                    rows_filter: {
                        parties__customer: {
                            path:'parties__customer' ,
                            key: 'Filter',
                            params: {
                                'is_employee': true
                            }
                        },
                    },
                    mainHeader: {
                        name: 'Employees', head:"Employees", type: ''
                    },
                    fields: [
                        {
                            head: 'From',
                            name: 'from_hour',
                            levels:['parties__customer'],
                            type: 'timePicker',
                        },
                        {
                            head: 'To',
                            name: 'to_hour',
                            levels:['parties__customer'],
                            type: 'timePicker',
                        },

                    ],
                 
                }
            ]
        },
    ]

}

export default attendance_class