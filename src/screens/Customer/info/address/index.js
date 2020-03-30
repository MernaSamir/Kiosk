import React, { Component } from 'react'
import classes from '../style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Paging from 'helpers/components/paging'
import uuid from 'uuid/v4';
import DropDown from 'components/dropdown'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, indexOf, keys, get, isEmpty } from 'lodash'
import applyFilters from 'helpers/functions/filters'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next';

var controls = ({ id }) => ({
    row1: [

        {
            name: `address.${id}._type`, label: "Type of Address", type: "SelectA", className: classes.Select,
            options: [
                { id: true, name: 'Home' },
                { id: false, name: 'Work' }
            ],
            submitting: false,
            // validates: { required: true, string: "", noSpecialChar: '', maxLength: '20' }

            //  field_name: 'address',
            // className: classes.contacts,
        },
        {
            name: `address.${id}.nick_name`, label: "Nickname", type: 'TextBox',
            submitting: false,
            // validates: { required: true, string: "", noSpecialChar: '', maxLength: '20' }

        },
    ],
    row2:
        [

            {
                name: `address.${id}.house_name`,
                submitting: false,
                label: "House / Building", type: 'TextBox',
            },
            {
                name: `address.${id}.street`,
                submitting: false,
                label: "Street/ Compound", type: 'SelectSearch', className: classes.SelectStreet,

                app: {
                    name: 'geographies__street',
                },
                params: {
                    active: true
                }
            },
            {
                name: `address.${id}.section`, label: "Section", type: 'TextBox',
                submitting: false, className: classes.small
            },
            {
                name: `address.${id}.floor_name`, label: "Floor", type: 'TextBox',
                submitting: false, className: classes.small

            },
            {
                name: `address.${id}.apartment_name`, label: "Apartment", type: 'TextBox',
                submitting: false, className: classes.small

            },
        ],
    row3: [
        {
            name: `address.${id}.area`, label: "Area", type: 'DataDisplay', className: classes.Display,
            show: {
                key: 'chain',
                selectors: {
                    geographies__street: `address.${id}.street`,
                    geographies__area: 'area'
                },
                dispaly: 'name'
            }
            //  validates: { required: true }

        },
        {
            name: `address.${id}.district`, label: "District", type: 'DataDisplay', className: classes.Display,
            show: {
                key: 'chain',
                selectors: {
                    geographies__street: `address.${id}.street`,
                    geographies__area: 'area',
                    geographies__district: 'district'
                },
                dispaly: 'name'
            }
            //  validates: { required: true }

        },
        {
            name: `address.${id}.country`, label: "Country", type: 'DataDisplay', className: classes.Display,
            show: {
                key: 'chain',
                selectors: {
                    geographies__street: `address.${id}.street`,
                    geographies__area: 'area',
                    geographies__district: 'district',
                    geographies__city: 'city',
                    geographies__state: 'state',
                    geographies__country: 'country'
                },
                dispaly: 'name'
            }

            //  validates: { required: true }

        },
        {
            name: `address.${id}.state`, label: "State", type: 'DataDisplay', className: classes.Display,
            show: {
                key: 'chain',
                selectors: {
                    geographies__street: `address.${id}.street`,
                    geographies__area: 'area',
                    geographies__district: 'district',
                    geographies__city: 'city',
                    geographies__state: 'state'
                },
                dispaly: 'name'
            }
        },
        {
            name: `address.${id}.city`, label: "City", type: 'DataDisplay', className: classes.Display,
            show: {
                key: 'chain',
                selectors: {
                    geographies__street: `address.${id}.street`,
                    geographies__area: 'area',
                    geographies__district: 'district',
                    geographies__city: 'city'
                },
                dispaly: 'name'
            }
        },
        // { name: `address.${id}.postal_code`, label: "Postal Code", type: 'TextBox' },
    ],
    row4: [
        {
            name: `address.${id}.delivery_landmark`, label: "Landmark", type: 'TextArea',
            submitting: false,
        },
        {
            submitting: false,
            name: `address.${id}.delivery_notes`, label: "Notes", type: 'TextArea'
        },]

})

class addressContent extends Component {
    add = {}
    constructor(props) {
        super(props);
        if (isEmpty(get(props, 'values.address', {}))) {
            const id = uuid();
            props.handleChange({
                target: {
                    name: 'address',
                    value: {
                        [id]: { id }
                    }
                }
            })
        }
    }
    state = {
        TypingInput: '',
        page: 1,

    }
    onSave = () => {
        let { values, handleChange } = this.props
        const id = uuid()
        this.setState({
            id
        })
        let valuesLength = keys(get(values, 'address', {})).length
        handleChange({
            target: {
                name: 'address',
                value: { ...values.address, [id]: { id, order: valuesLength } }
            }
        })
        this.setState({
            page: valuesLength + 1
        })
    }
    selectInput = (field) => {
        {
            this.setState({ TypingInput: '' }, () => {
                this.setState({ TypingInput: field.name })
            })
        }
    }
    handelPagination = (delta) => {
        const { page } = this.state
        this.setState({ page: page + delta })
    }
    renderFooter() {
        const { page } = this.state
        const { values } = this.props
        const maxLength = values["address"] ? Math.ceil(Object.keys(values['address']).length / 1) : 1

        return <div className={classes.footerCon}>
            <Paging maxLength={maxLength}
                page={page}
                handelClick={this.handelPagination}
            />
        </div>
    }

    renderfields() {
        const { page } = this.state
        const { values } = this.props
        const addresses = keys(get(values, 'address', {}))
        this.add = addresses
        return map(addresses, id => (<>
            <div className={classes.form}>
                {Render(controls({ id }).row1, { onClick: this.props.selectInput })}
            </div >
            <div className={classes.form}>
                {Render(controls({ id }).row2, { onClick: this.props.selectInput })}
            </div>
            <div className={classes.form}>
                {Render(controls({ id }).row3, { onClick: this.props.selectInput })}
            </div>
            <div className={classes.form}>
                {Render(controls({ id }).row4, { onClick: this.props.selectInput })}
            </div>
            {this.renderFooter()}
        </>
        )).slice(1 * (page - 1), 1 * page)
    }
    setChoice = (id) => {
        this.setState({ page: (indexOf(this.add, id)) + 1 })
    }
    renderDropDown = (list) => {
        if (!isEmpty(list)) {
            return <DropDown
                data={list}
                btnClass={classes.btnss}
                clickedclass={classes.activess}
                onChange={this.setChoice}
                value={get(this.address, this.state.page - 1)}
                show="address"
                only="true"
                fontSize='1rem'

            >
            </DropDown>
        }
        else
            return <></>

    }
    renderCheckBox = () => {

    }
    render() {
        const { height, activeCustomer, t } = this.props
        if (activeCustomer) {
            this.list = applyFilters({
                key: 'Filter',
                path: 'parties__address',
                params: {
                    customer: activeCustomer
                }
            })
            this.address = this.list.map(d => d.id);
        }
        return (
            <>
                <div className={classes.fields} style={{ maxHeight: height }}>
                    <div className={classes.addDiv}>
                        {/* <p className={classes.p}>{t("Address")}</p> */}
                        <div className={classes.end}>
                            {Render([{
                                name: 'default_address',
                                labeling: 'Default Address',
                                type: 'CheckBoxHighlight',
                            }])}
                            <button type='button' className={classes.addNewBtn} onClick={this.onSave}> {t("Add New")}</button>
                        </div>

                    </div>
                    {this.renderDropDown(this.list)}
                    {this.renderfields()}
                </div >

            </>
        )
    }
}
const mapStateToProps = (state, props) => ({
    activeCustomer: get(props, "match.params.id", state.parties__customer.active)
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(addressContent))) 
