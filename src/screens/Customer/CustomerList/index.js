import React, { Component } from 'react'
import Header from './components/header'
import ViewAction from './actions/view-action'
import SelectRow from 'components/select_row'
import EditAction from 'components/edit_action'
import styles from './style.less'
import RenderdropDown from 'helpers/functions/drop_down'
import Table from './components/table'
import { Route } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'

const CustomerApps = {
    "parties__customer": {},
    "parties__title": {},
    "parties__family_members": {},
    "parties__customer_contacts": {},
    "parties__address": {},
    "dropdowns__occasions": {},
    "parties__customer_group": {},
    "payment__credit_groups": {},
    "geographies__area": {},
    "dropdowns__complaint_categories": {}
}

var CustomerTable = (customer, t, assign_customer) => ([
    {
        head: '', class: styles.emptywidth,
        Component: <SelectRow row={customer} onAction={assign_customer} onClick="SetActiveCustomer"
        authorize={applyFilters({key: 'authorize', compare: ['customer_select']})}  />,
        viewClass: styles.emptywidth,
    },

    { head: t('Name'), class: styles.name, view: 'name', },

    {
        head: t('Address'), class: styles.addr,
        Component: <RenderdropDown appName="parties__address" show="address" filter={[customer.id]}
            filterKey='customer' />,

    },

    {
        head: t('Phone'), class: styles.phone,
        Component: <RenderdropDown appName="parties__customer_contacts" show="contact"
            filter={[customer.id]} type='dropDown' filterKey='customer' />,

    },

    {
        head: t('Group'), class: styles.group,
        Component: <RenderdropDown appName="parties__customer_group" show="name"
            filter={[customer.discount_group]} filterKey='id' type='dropDown' />,

    },

    {
        head: t('Loyalty'), class: styles.group, view: ''
        // Component: <button className={styles.normal}>Normal</button>, viewClass: `${styles.phone} `
    },

    {
        head: t('# Orders'), class: styles.group, view: 'orders',
    },

    { head: t('Avg Value'), class: styles.group, view: 'avg_orders', },

    {
        head: t('View'), class: styles.icons,
        Component: <ViewAction className={styles.actions} customer={customer} 
        authorize={!applyFilters({key: 'authorize', compare: ['customer_view']})}/>,
    },

    {
        head: t('Edit'), class: styles.icons,
        Component: <EditAction customer={customer} onClick="EditCustomer"
        authorize={!applyFilters({key: 'authorize', compare: ['customer_edit']})} 
        />,
    },
])

class CustomerList extends Component {
    state = {
    }

    afterFetch = (list) => {
        this.setState({
            page: 1,
            maxlength: Math.ceil(list.length / 10)

        })
    }

    handelPagination = (delta) => {
        const { page } = this.state
        this.setState({ page: page + delta })
    }

    rendering = () => {
        const { match, delivery } = this.props;
        const { page, maxlength } = this.state

        if (!delivery) {
            return <div className={styles.customerList}>
                <Header page={page} handelPagination={this.handelPagination} maxlength={maxlength} />
                <Route path={`${match.url}/customer`}
                    render={() => <Table page={page} AppList={CustomerApps} Table={CustomerTable}
                        afterFetch={this.afterFetch} />} />
            </div>
        }
        return <Table page={this.props.page} AppList={CustomerApps} Table={CustomerTable} />
    }

    render() {
        return (
            this.rendering()
        )
    }
}

export default (CustomerList)