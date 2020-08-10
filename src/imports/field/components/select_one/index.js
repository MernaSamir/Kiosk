import React, { Component } from 'react'
import InputComponent from 'helpers/components/input.js'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get, map, find, includes, reject, isEmpty, some, isArray } from 'lodash'
import classes from './style.less'

class SelectOne extends InputComponent {
    handelChange = (value, name) => {
        const { field } = this.props;
        field.onChange({
            target: {
                name: field.optionsname,
                value
            }
        })
    }
    renderTitle = () => {
        const { title } = this.props
        return title && <div className={classes.title}>
            <p>{`${title}`}</p>
        </div>
    }

    renderChoices = () => {
        const { options, classNameBtn } = this.props
        return <div className={classes.choices}>
            {map(options, (o, key) =>
                (
                    <button type='button' key={key} className={`${this.renderClassName(o)} ${classNameBtn}`}
                        onClick={this.onSelect.bind(this, o)}>
                        {this.renderBtnName(o)}
                        {/* {this.ifAvtive(o)} */}
                        {this.check(o)}

                    </button>
                ))
            }
        </div >
    }
    onSelect = (row) => {
        const { redux, setMain, t, field, form } = this.props
        console.log("cliiiiick on", this.props, row)
        setMain(redux, { active: row.id })
        row &&  field.onChange({
            target: {
                name: field.name,
                value: row.id,
            }
        })

    }
    check = (row) => {
        
        const { active } = this.props
        if (active == row.id)
        {
            return <div className={classes.check}>
                <FontAwesomeIcon icon="check" />
            </div>
        }
    }

    getName = (elment) => {
        const { redux } = this.props
        if (redux == 'items__prices') {
            const size = applyFilters({
                key: 'Find',
                path: 'dropdowns__units_of_measure',
                params: {
                    id: elment.sales_unit
                }
            })
            return size
        }
        // else if (redux == 'orders__details') {
        //     const item = applyFilters({
        //         key: 'chain',
        //         selectors: {
        //             items__modifier_items: 'modifier_items',
        //             items__prices: 'item',
        //             items__sales_items: 'sales_item',
        //         }
        //     }, elment)
        //     return item
        // }
        // else if (redux == 'items__combo_alters') {
        //     const alter = applyFilters({ path: `items__sales_items.data.${elment.sales_item}` })
        //     return alter
        // }
    }

    renderBtnName = (elment) => {
        const { redux } = this.props
        if (redux == 'items__prices') {
            const size = this.getName(elment)
            return `${size.name} (£${elment.price})`
        }
        // else if (redux == 'orders__details') {
        //     const item = this.getName(elment)
        //     return elment.price > 0 ?
        //         `${item.name} (+ £${elment.price})`
        //         : item.name
        // }
        // else if (redux == 'items__combo_alters') {
        //     // const alter = this.getName(elment)
        //     const selector =  elment.item?'item':'alter_item'
        //     const alter = applyFilters({
        //         key:"chain",
        //         selectors:{
        //             items__prices: selector,
        //             items__sales_items: 'sales_item',
        //         }
        //     }, elment)
        //     return `${get(alter, 'name', '')} (£${get(elment, 'price_variance', '')})`
        // }
        return elment.name
    }

    renderClassName = (row) => {
        const { active, single, elment, details, parent = {}, field } = this.props

        // const modItem = applyFilters({
        //     path: `items__modifier_items.data.${row.modifier_items}`
        // })
        // const combo = applyFilters({
        //     key: 'Find',
        //     path: get(elment, 'path', ''),
        //     params: {
        //         [get(elment, 'priceRec', '')]: row.id
        //     }
        // })
        // const item = applyFilters({
        //     key: 'chain',
        //     selectors: {
        //         items__modifier_items: 'modifier_items',
        //         items__prices: 'item',
        //     }
        // }, row)
        const foundValues = field.value == row.id
        //const found = find(details, d => (d.item == item.id && d.parent == parent.id)) 
        const found = find(field.value, { id:active?active: row.id })
        const values = field.value || []
        // if (active == row.id)
        if( found || foundValues)
        // || foundInSingle || found || foundValues 

        // ||get(combo, 'id', null) === get(get(elment, 'active', {}), 'id', '')
        {
            return classes.active
        }
        return ''
    }

    // active = (row) => {
    //     const { setMain, redux, field, t, handleChange, onClick, setAll } = this.props
    //     if (t == 'Size' || t == 'Doneness') {
    //         // field.onChange({
    //         //     target: {
    //         //         name: field.name,
    //         //         value: row.id,
    //         //     }
    //         // })
    //         console.log(field, "ffffffffff")
    //         if (onClick) {
    //             onClick()
    //         }
    //         console.log(row, "roooooooooo")
    //         setMain(redux, { active: row.id })
    //     }
    //     // else if (t == 'Alter') {

    //     //     if (row.alter_item) {
    //     //         // const alter = applyFilters({
    //     //         //     key: 'Find',
    //     //         //     path: 'items__combo_alters',
    //     //         //     params: {
    //     //         //         alter_item: row.id
    //     //         //     }
    //     //         // })
    //     //         // setMain(redux, { active: alter.id })
    //     //         setMain(redux, { active: row.id })
    //     //         setMain('items__combo', { active: '' })
    //     //     }
    //     //     else if (row.item) {

    //     //         setMain('items__combo', { active: row.id })
    //     //         setMain(redux, { active: '' })
    //     //     }

    //     //     // field.onChange({
    //     //     //     target: {
    //     //     //         name: field.name,
    //     //     //         value: row.id,
    //     //     //     }
    //     //     // })
    //     //     const price = row.item||row.alter_item
    //     //     setAll([
    //     //         {type:'set_main', app:'items__combo', data:{comboItem_price:price}},
    //     //     ])
    //     //     handleChange(row)
    //     // }
    //     // else {
    //     //     // this.onChange(row)
    //     //     this.handleChange(row)
    //     // }
    // }

    // onChange = (value) => {
    //     const { setMain, details, field, t, single, parent } = this.props;
    //     const modItem = applyFilters({
    //         path: `items__modifier_items.data.${value.modifier_items}`
    //     })
    //     const newRec = { item: modItem.item, quantity: 1, price: value.price, type: t }
    //     // console.log('Single list ', single)
    //     // console.log('Field ', field)
    //     field.onChange({
    //         target: {
    //             name: [t],
    //             value: value.modifier_items
    //         }
    //     })
    //     let list = [newRec]
    //     // if (!isEmpty(parent)) {
    //     //     list = this.ifEdit(list)
    //     // }
    //     // else {
    //     //     list = this.ifNotEdit(list)
    //     // }
    //     setMain('orders__details', { single_modifiers_formik: list })
    // }


    // handleChange = (value) => {
    //     const { setMain, details, field, t, single, parent, comboItem={} } = this.props;
    //     const modItem = applyFilters({
    //         path: `items__modifier_items.data.${value.modifier_items}`
    //     })
    //     let values = isEmpty(field.value) ? [] : field.value;
    //     let list  = []
    //     const comboItemId = comboItem.item?comboItem.id:comboItem.combo_item
    //     const newRec = { ...modItem, quantity:1, comboItem:comboItemId, parent:parent, price_override:value.price }
    //     // const group_found = find(values, v => (get(v,'modifier_group','') == get(modItem,'modifier_group','')&&v.parent==parent));

    //     // if(group_found){
    //     //     const found = find(values, v => (v.id == modItem.id && v.parent==parent));
    //     //     if(found){
    //     //         list = reject(values, d=>(d.id == found.id&& d.parent==found.parent))

    //     //     }
    //     //     else{
    //     //         list = [...reject(values, d=>d.id == group_found.id),newRec ]

    //     //     }
    //     // }
    //     // else{
    //         list =  [...values, newRec ]
    //     //}
    //     setMain('orders__details', { modifiers_formik: list })
    //     field.onChange({
    //         target: {
    //             name: field.name,
    //             value:list
    //         }
    //     })

    // }

    // ifEdit = (arr) => {
    //     const { setMain, details, field, t, single, parent } = this.props;
    //     let list = [...arr]
    //     if (some(details, d => d.type == t)) {
    //         list = [...list, ...reject(details, { parent: parent.id, type: t })]

    //     }
    //     if (!isEmpty(single)) {
    //         if (some(details, d => d.type == t)) {
    //             list = [...list, ...reject(details, { parent: parent.id, type: t })]
    //         }
    //         if (some(single, s => s.type == t)) {
    //             list = [...list, ...reject(details, { parent: parent.id, type: t })]
    //         }
    //         else {
    //             list = [...list, ...single]
    //         }
    //     }
    //     setMain('orders__details', {
    //         details:
    //             [...reject(details, { parent: parent.id, type: t })]
    //                 .reduce((o, d) => ({ ...o, [d.id]: d }), {})
    //     })
    //     return list
    // }

    // ifNotEdit = (arr) => {
    //     const { setMain, details, field, t, single, parent } = this.props;
    //     let list = [...arr]
    //     if (!isEmpty(single)) {
    //         if (some(single, s => s.type == t)) {
    //             list = [...list,
    //             ...reject(reject(single, l => l.type == t), d => d.parent == parent.id)]
    //         }
    //         else {
    //             list = [...list, ...single]
    //         }
    //     }
    //     return list
    // }

    // ifAvtive = (row) => {
    //     const { active, single, elment, parent, details, field, } = this.props
    //     // const modItem = applyFilters({
    //     //     path: `items__modifier_items.data.${row.modifier_items}`
    //     // })
    //     // const combo = applyFilters({
    //     //     key: 'Find',
    //     //     path: get(elment, 'path', ''),
    //     //     params: {
    //     //         [get(elment, 'priceRec', '')]: row.id
    //     //     }
    //     // })
    //     const item = applyFilters({
    //         key: 'chain',
    //         selectors: {
    //             items__modifier_items: 'modifier_items',
    //             items__prices: 'item',
    //         }
    //     }, row)
    //     // const found = find(details, d => (d.item == item.id && d.parent == parent.id))
    //     const found = find(field.value, { id: row.id })

    //     const values = field.value || []

    //     // const foundInSingle =  isArray(values)&&find(values, s => ((s.id == modItem.id) && (s.parent==parent)))
    //     if (active == row.id)
    //         console.log('hnaaaa')
    //     // ||get(combo, 'id', null) === get(get(elment, 'active', ''), 'id', '')
    //     {
    //         return <div className={classes.check}>
    //             <FontAwesomeIcon icon="check" />
    //         </div>
    //     }
    //     return <></>
    // }

    render() {
        console.log('iam here in render', this.props.field, active)
        const {field, active} = this.props
        if(!isEmpty(active)&&(!field.value || field.value!=active)) {
            field.onChange({
                target: {
                    name: field.name,
                    value: active
                }
            })
        }
        return (
            <div className={`${classes.select_one} `}>
                {/* {this.renderTitle()} */}
                {this.renderChoices()}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    active: get(get(state, props.redux, ''), 'active', ''),
    // single: get(get(state, props.redux, ''), `${props.elment}`, {})
    single: get(get(state, props.redux, ''), `single_modifiers_formik`, [])

})

export default connect(mapStateToProps, mapDispatchToProps)(SelectOne)