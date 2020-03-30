import pr from './pr'
import to from './to.js'
import po from './po'
const start_balance = {
    name: 'Inbox',
    path: '/stock-inbox',
    reduxName: 'stock__balance',
    hide_actions: true,
    fetch: ['parties__vendor'],
    tabs: [
        { name: 'Product Requisitions', key: 'pr', value: 'pr' },
        { name: 'Transfer Orders', key: 'to', value: 'to' },
        { name: 'Purchase Orders', key: 'po', value: 'po' },
        { name: 'Return Orders', key: 'reo', value: 'reo' }
    ],
    layouts: [
        pr,
        to,
        po
    ]
}

export default start_balance
