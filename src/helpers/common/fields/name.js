export const name = () => ([{
        label: "Name", type: 'text', value: "name", name: "name",
        validates: { required: true, minLength: 2, maxLength: 40 }
    },
    { label: "Alter Name", type: 'text', value: "name", name: "alter_name" },
])

export const nameWActive = () => ([
    ...name(),
    {
        label: "Active", type: 'checkbox', value: false, name: "active"
    }
])
