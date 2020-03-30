import React, { Component } from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux';
import { get, map, max, sumBy, find } from 'lodash';
import classes from './styles.less'
import Header from './header';
import Groups from './groups'
import applyFilters from 'helpers/functions/filters';
import Performance from 'helpers/components/performance'
import DoneButton from './done'
import Calculator from 'components/down_calculator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Modifiers extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            No: {
                icon: 'ban',
                onClick: this.no,
                hidden: false,
            },
            Note: {
                icon: 'sticky-note',
                onClick: this.note,
                hidden: false,
            },
            Doneness: {
                icon: 'temperature-high',
                onClick: this.doneness,
                hidden: !(props.Item.has_doneness),
            }
        }
    }

    no = () => {
        const { setMain } = this.props
        setMain('popup', {
            popup: {
                type: 'No', visable: true, width: "50%",
            }
        })
    }

    note = () => {
        const { setMain, detail, itemName } = this.props
        setMain('popup', {
            popup: {
                type: 'AddNote',
                width: '70%', visable: true,
                childProps: {
                    onClick: this.addNote,
                    note: get(detail, 'notes', ''),
                    title: itemName,
                    select:true
                }
            }
        })
    }

    addNote = (note) => {
        const { setMain, detail, } = this.props
        setMain('orders__details', { item: { id: detail.id, action: 'update', notes: note, } }
        )
    }

    doneness = () => {
        const { setMain, itemName } = this.props
        setMain('popup', {
            popup: {
                type: 'Doneness',
                width: '50%', visable: true,
                childProps: {
                    onClick: this.addDonness,
                    title: itemName,
                }
            }
        })
    }

    addDonness = (doneness) => {
        const { setMain, detail, } = this.props
        setMain('orders__details', { item: { id: detail.id, action: 'update', doneness: doneness, } }
        )
    }

    onClick = (index) => {
        const { setCurrentModifier } = this.props
        setCurrentModifier(index)
    }

    goTo = (d) => {
        d.onClick()
    }

    getFilteredGroup() {
        const { detail } = this.props;
        const activedModifier = applyFilters({
            key: 'Filter',
            path: "items__assign_modifier_items",
            params: {
                active: true,
                item: detail.item
            }
        })
        const main_modifiers_items = applyFilters({
            key: 'picking',
            reduxName: "items__modifier_items",
            select: 'modifier_items'
        }, activedModifier)
        const main_modifiers = applyFilters({
            key: 'picking',
            reduxName: "items__modifier_group",
            select: 'modifier_group'
        }, main_modifiers_items)

        const modifiers = applyFilters({
            key: 'Filter',
            path: "orders__details",
            params: {
                parent: detail.id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        }).map(d => {
            const item = find(main_modifiers_items, { item: d.item });
            return {
                ...d,
                free_point: get(item, 'free_point','') || 0
            }
        })
        return map(main_modifiers, (d) => {
            const assigned_modifier_items = applyFilters({
                key: 'ListInside',
                compare: 'id',
                select: 'modifier_group',
                selectors: {
                    items__modifier_items: 'modifier_items'
                },
            }, activedModifier, undefined, { data: d })
            const modifier_items = applyFilters({
                key: 'picking',
                reduxName: "items__modifier_items",
                select: 'modifier_items',
            }, assigned_modifier_items)
            const details_items = applyFilters({
                key: 'Includes',
                pick: 'item',
                select: 'item',
            }, modifiers, undefined, { data: modifier_items })

            return {
                ...d,
                _max: applyFilters({
                    key: 'pickMax',
                    select: '_max'
                }, assigned_modifier_items) || 0,
                _min: applyFilters({
                    key: 'pickMax',
                    select: '_min'
                }, assigned_modifier_items) || 0,
                max_point: applyFilters({
                    key: 'pickMax',
                    select: 'max_free_point'
                }, assigned_modifier_items) || 0,
                ordered: sumBy(details_items, 'quantity'),
                get reminder() {
                    return max([this._min - this.ordered, 0])
                },
                get reject() {
                    return this.ordered < this._min
                },
                max_ordered_points: sumBy(details_items, d => (d.quantity * d.free_point)),
                get add() {
                    return (this._max > this.ordered || this._max == 0)
                }

            }
        })
    }

    renderBtns = () => {
        return <div className={classes.icons}>
            {map(this.buttons, (d, key) => (<button type='button' hidden={d.hidden} onClick={this.goTo.bind(this, d)} key={key}>
                <FontAwesomeIcon icon={d.icon} />
            </button>))}
        </div>
    }

    renderClass = () => {
        const { activeAction } = this.props
        if (activeAction == 'calculator') {
            return classes.Mod_cal
        }
        return classes.container
    }

    renderCalc = () => {
        const { activeAction, appendPath, setMain } = this.props
        if (activeAction == 'calculator') {
            return <Calculator setMain={setMain} append_path={appendPath} />
        }
        return <></>
    }

    render() {
        const { setMain, onClick, detail, back, itemName } = this.props
        this.list = this.getFilteredGroup()
        return (
            <div className={classes.Mod_main}>
                <div className={classes.Mod_frame}>
                    <section className={this.renderClass()}>
                        <Header setMain={setMain} list={this.list} itemName={itemName} />
                        <Groups list={this.list} onClick={onClick} detail={detail} />
                    </section>
                    <div className={classes.btns}>
                        {this.renderBtns()}
                        <DoneButton setMain={setMain} back={back} list={this.list} />
                    </div>
                    {this.renderCalc()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    activeAction: state.actions.active,
    activeOrder: state.orders__details.active,
    detail: props.detail || get(state.orders__details.data, `${state.orders__details.active}`, {}),
    get priceItem() { return get(state.items__prices.data, this.detail.item, '') },
    get itemName() { return get(get(state.items__sales_items.data, this.priceItem.sales_item), 'name', '') },
    get Item() { return get(state.items__sales_items.data, this.priceItem.sales_item, {}) },
    item: get(state.orders__details, 'item.action'),
    activeModifier: get(state.items__modifier_group, `data.${get(state.items__modifier_group, 'active', {})}`, {}),
    price: get(state.items__prices, 'active', false),
})

export default connect(mapStateToProps, mapDispatchToProps)(Performance(Modifiers, ['activeOrder', 'item']))