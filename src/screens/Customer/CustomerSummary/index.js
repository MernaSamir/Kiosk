import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardCollapse from './components/Card-Collapse'
import OrderDetails from './components/Order-Details';
import { withRouter } from 'react-router'
import { map, get, groupBy } from 'lodash';
import { multiRequest } from 'helpers';
import SummeryHeader from './components/header';
import mapDispatchToProps from "helpers/actions/main"
import classes from './styles.less';
import Paging from 'helpers/components/paging'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';

class CustomerSummery_ extends Component {
    constructor(props) {
        super(props);
        this.getCustomerInfo()
    }

    cards = [
        {
            name: "Basic Information",
            meta: {
                basicFields: {
                    'Customer Code': { show: 'customer_code' },
                    'Customer Group': { data: 'group', show: "name" }
                },
                extendedFields: {
                    'Job Title': { show: "job_title" },
                    'Organisation': { show: "organization_name" },
                }
            }
        },
        {
            name: "Contact Information",
            meta: {
                basicFields: {
                    'Mobile': { show: "contact", data: 'contacts.mp', list: "list" },
                    'Home': { show: "contact", data: 'contacts.hp', list: "list" },
                },
                extendedFields: {
                    'Work Phone': { show: "contact", data: 'contacts.wp', list: "list" },
                    'Email': { show: "contact", data: 'contacts.em', list: "list" }

                }
            }
        },
        {
            name: "Extra Information",
            meta: {
                basicFields: {
                    'Birthday': { show: 'birthday', list: "date" },
                    'Anniversary': { show: 'anniversary', list: "date" }
                },
                extendedFields: { 'Family members': { show: "name", data: "family", list: "list" } }
            }
        }
    ]
    restCards = [
        {
            name: "Address",
            meta: {
                basicFields: {
                    " ": { classDiv: classes.addr, data: "addresses[0]", show: 'nick_name', alter: '' },

                    '': {
                        show: "address", data: "addresses", list: "page",
                    },
                    "page": {
                        type: Paging,
                    },
                    "add New": { type: "button", onClick: 'AddNew', class: classes.button, title: 'Edit Addresses' },

                },
                extendedFields: {}
            }
        },
        {
            name: "History Summary",
            meta: {
                basicFields: {
                    'Customer Since': { show: "created_at", list: "date" },
                    'Number of Receipts': { show: 'orders' }
                },
                extendedFields: {
                    'Value of Orders': { show: 'tot_orders' }
                    , 'Avg Receipt Value': { show: 'avg_orders' }
                }
            }
        },
    ]
    getCustomerInfo() {
        const { selectedCustomer } = this.props
        multiRequest({
            parties__customer: {},
            parties__contact_type: {},
            parties__customer_contacts: {},
            parties__family_members: {},
            parties__customer_group: {},
            payment__credit_groups: {},
            orders__main: {
                filter: { customer: selectedCustomer.id }
            },
            orders__details: {
                filter: { order__customer: selectedCustomer.id }
            },
            orders__receipt: {
                filter: { order__customer: selectedCustomer.id }
            },
        })
        // }
    }

    renderColapses() {
        const { selectedCustomer: customer, group, contacts, addresses, family } = this.datas;
        return map(this.cards, (d) => (<CardCollapse {...d} data={{ group, customer, contacts, addresses, family }} style={{ width: '100%', margin: '0% 0% 4% 0%' }}
        />))
    }
    renderRestColapses() {
        const { selectedCustomer: customer, group, contacts, addresses, family } = this.datas;

        return map(this.restCards, (d) =>
            (<CardCollapse data={{ group, customer, contacts, addresses, family }} {...d} style={{ width: '100%', margin: '0% 0% 4% 0%' }}
            />))
    }

    getDatas() {
        const { selectedCustomer } = this.props;
        const contacts = applyFilters({ key: 'Filter', path: 'parties__customer_contacts', params: { customer: selectedCustomer.id } });
        this.datas = {
            selectedCustomer,
            group: applyFilters({ key: 'Find', path: 'parties__customer_group', params: { id: selectedCustomer.discount_group } }),
            contacts: groupBy(contacts, '_type'),
            addresses: applyFilters({ key: 'Filter', path: 'parties__address', params: { customer: selectedCustomer.id } }),
            family: applyFilters({ key: 'Filter', path: 'parties__family_members', params: { customer: selectedCustomer.id } }),
        }
    }
    open_suggestion = () => {
        const { setMain } = this.props
        setMain('popup', {
            popup: {
                type: 'AddNote',
                width: '70%', visable: true,
                childProps: {
                    onClick: this.addSuggest,
                    title: 'Add Suggestion',
                    sub: "Suggestion"
                }
            }
        })
    }

    addSuggest = (suggest) => {
        const { setMain, selectedCustomer } = this.props
        const sugge = { customer: selectedCustomer.id, name: suggest }
        setMain('parties__suggestions', {
            item: {
                ...sugge, action: 'add',
                onSuccess: this.Saved.bind(this)

            }
        })
    }
    Saved() {
        const popup = {
            type: 'Save', visable: true, width: "50%",
            childProps: {
                msg: "Suggestion Saved",

            }
        }
        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }
    open_Complaint = () => {
        const { setMain, selectedCustomer } = this.props
        const popup = {
            type: 'AddWithSelect', visable: true, width: "50%",
            childProps: {
                title: 'Add New Complaint',
                name1: "Complaint",
                name2: "complaint_category",
                l1: "Complaint",
                l2: "Complaint Category",
                app: 'dropdowns__complaint_categories',
                appSaved: 'dropdowns__complaints',
                msg: 'The Complaint Saved Successfully',
                customer: selectedCustomer
            }
        }
        setMain('popup', { popup })
    }

    render() {
        const { selectedCustomer, t } = this.props;
        this.getDatas()
        return (
            <div className={classes.container}>
                <div className={classes.card}>
                    <SummeryHeader customer={selectedCustomer} />
                    <div className={classes.info}>
                        <div className={classes.infogrid}>
                            {this.renderColapses()}
                        </div>
                        <div className={classes.infogrid}>
                            {this.renderRestColapses()}
                            <div className={classes.btns}>
                                <button type="button" onClick={this.open_suggestion}>
                                    {t('Suggestions')}
                                </button>
                                <button type="button" onClick={this.open_Complaint}>
                                    {t("Complaints")}
                                </button>
                            </div>
                        </div>
                        <div className={classes.infogrid}>
                            <OrderDetails CurrentCustomer={selectedCustomer} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        selectedCustomer: get(state.parties__customer.data, state.parties__customer.active, {}),
        addresses: state.parties__address.data,
    }

}
const CustomerSummery = connect(mapStateToProps, mapDispatchToProps)(CustomerSummery_)
export default withTranslation()(withRouter(CustomerSummery))
