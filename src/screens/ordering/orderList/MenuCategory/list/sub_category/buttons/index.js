import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main';
import { map, get, find, sortBy, isEmpty, findIndex, keys, isEqual } from 'lodash'
import Calculator from 'components/down_calculator';
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import Performance from 'helpers/components/performance'
import { pos_settings } from 'config/defaults'
import BasicComponent from 'helpers/components/basic'
import uuid from 'uuid/v4'

class ButtonsComponent extends Component {

    constructor(props) {
        super(props);
        // this.compare = {
        //     field: {
        //         compare: ['activeAction'],
        //         action: this.saving
        //     }
        // }
        if (!isEmpty(props.settings__filter))
            this.saving()
    }

    state = {
        loaded: false,
        first: '',
        second: '',
        done: false,
    }

    checkApp = () => {
        const { app } = this.props
        if (app == 'items__sales_items') {
            return 'sort_item'
        }
        else {
            return 'sort_sub_cat'
        }
    }

    saving = () => {
        this.renderApp(this.checkApp())
    }

    renderApp = (sort) => {
        const { settings__filter, setAll } = this.props
        const list = this.getList();
        const savingItemList = map(list, l => {
            const index = findIndex(list, { id: l.id })
            return {
                id: get(
                    applyFilters({
                        key: 'Find', path: 'items__sorting',
                        params: {
                            [sort]: l.id,
                            station: get(settings__filter, 'station', ''),
                            mode: get(settings__filter, 'mode', ''),
                        }
                    }),
                    'id', uuid()),
                station: get(settings__filter, 'station', ''),
                mode: get(settings__filter, 'mode', ''),
                [sort]: l.id,
                index: index,
            }
        })
        // console.log("Saving ", savingItemList)
        setAll([
            {
                type: 'set_main_items__sorting',
                data: {
                    item: {
                        data: savingItemList,
                        action: "bulkEdit",
                    }
                }
            }
        ])
    }

    renderFunctions = (active, item, index, prices, ev) => {
        const { activeAction = {} } = this.props
        if (activeAction == "star") {
            // return this.addToFavorite(active, ev)
        }
        else if (activeAction == "info") {
            return this.getInfo(item, prices)
        }
        else if (activeAction == "move") {
            return this.getClicks(active)
        }
        return this.selectType(active, index, ev)
    }

    getClicks = (click) => {
        const sort = this.checkApp()
        if (isEmpty(this.state.first)) {
            this.setState({
                first: click
            })
        }
        else {
            this.setState({
                second: click,
                done: true
            }, () => {
                this.updating(this.state.first, this.state.second, sort)
            })
        }
    }

    updating = (first, second, sort) => {
        const { setAll, sorting_data } = this.props
        const fRec = find(sorting_data, { [sort]: first })
        const sRec = find(sorting_data, { [sort]: second })
        // console.log(" -> ", fRec, " - ", sRec)
        let data = [
            {
                ...fRec,
                index: sRec.index
            },
            {
                ...sRec,
                index: fRec.index
            }
        ]
        // console.log("data ", data)
        setAll([
            {
                type: 'set_main_items__sorting',
                data: {
                    item: {
                        data: data,
                        action: "bulkEdit",
                    }
                }
            }
        ])
    }

    getPrices(item) {
        const prices = applyFilters({
            key: "Filter",
            path: 'items__prices',
            params: { sales_item: item.id, active: true }
        })
        return prices
    }

    getInfo = (item, price) => {
        const { setMain, base_sales_cat } = this.props;
        setMain('popup', {
            popup: {
                type: 'ItemInfo', width: "60%",
                childProps: { item: item, category: base_sales_cat.name, price: price }
            }
        })
    }

    selectType(active, index, ev) {
        const { setAll, app, onSelect } = this.props;

        setAll([
            { type: "set_main", app, data: { active } },
            { type: "set_main", app: 'popup', data: { active: '' } },

        ])
        if (onSelect) {
            onSelect(index, ev)
        }
    }

    renderClass = () => {
        const { height } = this.props
        if (height > '78%') {
            return classes.subcat_btn
        }
        return { height: '18%' }
    }

    renderStyle = (d) => {
        const { itemsColor = {} } = this.props;
        const item = find(itemsColor, { item: d.id }) || {}
        return item.color
    }

    renderFillIcon = (d, key) => {
        const { option } = this.props;
        if (option) {
            return <FontAwesomeIcon icon="fill" className={classes.icon}
                style={{ color: this.renderStyle(d) }}
                onClick={this.renderFunctions.bind(this, d.id, d, key)} />
        }
        return <></>
    }

    renderFontSize = () => {
        const { settings } = this.props;
        let size = get(settings, 'fontSize', 1)
        return `${size}em`
    }

    renderDivHeight = () => {
        const { activeAction = {}, height, tmpheight } = this.props;

        if (activeAction == "calculator") {
            return '58%'
        }
        else if (tmpheight) {
            return tmpheight
        }
        return height
    }

    renderCalc = () => {
        const { activeAction = {}, setMain, appendPath } = this.props;
        if (activeAction == "calculator") {
            return <Calculator setMain={setMain} append_path={appendPath} />
        }
        return <></>
    }

    getList() {
        const { app, filter, activeAction } = this.props;
        const sort = this.checkApp()
        this.list = applyFilters({
            key: 'Filter',
            path: app,
            params: filter,
        })

        if (activeAction == 'move') {
            return this.moveAction(this.list, sort)
        }
        else if (activeAction != 'move') {
            return this.default(this.list, sort)
        }
        else
            return this.list;
    }

    moveAction = (list, sort) => {
        const { settings__filter } = this.props
        const contains = map(list, l => {
            let index = get(applyFilters({
                key: 'Find', path: 'items__sorting',
                params: {
                    [sort]: l.id,
                    station: get(settings__filter, 'station', ''),
                    mode: get(settings__filter, 'mode', ''),
                }
            }), 'index', 0)
            return { ...l, index: index }
        })
        return sortBy(contains, 'index');
    }

    default = (list, sort) => {
        const { active_station, active_mode } = this.props
        const contains = map(list, l => {
            let index = get(applyFilters({
                key: 'Find', path: 'items__sorting',
                params: {
                    [sort]: l.id,
                    station: active_station,
                    mode: active_mode
                }
            }), 'index', 0)
            return { ...l, index: index }
        })
        return sortBy(contains, 'index');
    }

    renderClassName = () => {
        const { app } = this.props
        if (app == 'items__base_sales_cat') {
            return classes.subcat
        }
        return classes.subcat_item
    }

    render() {
        const { className, activeItem, prices, lang } = this.props;
        const list = this.getList();
        return (
            // <BasicComponent {...this.props} compare={this.compare}>
            <>
                <div className={this.renderClassName()}
                    style={{ height: this.renderDivHeight() }}>
                    {map(list, (d, key) => {
                        let priceList = [true];
                        if (prices) {
                            priceList = this.getPrices(d);
                        }

                        return <button type="button" className={`${classes.subcat_btn}
                            ${activeItem && get(classes, className)}`}
                            style={{
                                border: `1.5px solid ${this.renderStyle(d)}`
                            }}
                            key={key}
                            onClick={this.renderFunctions.bind(this, d.id, d, key, priceList)}>
                            {this.renderFillIcon(d, key)}
                            <div>
                                <p style={{ fontSize: this.renderFontSize() }} >{get(d, lang.show)}</p>
                            </div>
                        </button>
                    })
                        // .slice((pageNum - 1) * 20, pageNum * 20)
                    }
                </div>
                {this.renderCalc()}
            </>
            // </BasicComponent>
        )
    }
}

const PerButton = Performance(ButtonsComponent, ['pageNum', 'pos_settings', 'custom_menu', 'filter', 'activeAction', 'itemsColor', 'lang', 'sorting_data'])
export const Category = connect((state, props) => ({
    app: 'items__base_sales_cat',
    prices: true,
    custom_menu: get(state.items__custom_menu.data, state.items__custom_menu.active, {}),
    pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    activeAction: state.actions.active,
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active, { show: 'name' }),
    settings__filter: get(state.settings__filter, 'item', {}),
    get settings() {
        return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {})
    },
    sorting_data: get(state.items__sorting, 'data', {}),
    get filter() {
        return this.pos_settings.menuShow == "true" || !(this.pos_settings.menuShow) ?
            { active: true, custom_menu: state.items__custom_menu.active }
            : { active: true }
    },
}), mapDispatchToProps)(PerButton)

export const Items = connect(state => ({
    app: 'items__sales_items',
    prices: true,
    pos_settings: get(state.main, 'pos_settings', {}),
    active_station: get(state.licensing__station, 'active', ''),
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active, { show: 'name' }),
    active_mode: get(state.settings__mode, 'active', ''),
    get settings() {
        return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {})
    },
    filter: { ...state.items__sales_items.filter, base_sales_cat: state.items__base_sales_cat.active, active: true },
    base_sales_cat: get(state.items__base_sales_cat.data, state.items__base_sales_cat.active, {}),
    activeAction: state.actions.active,
    pageNum: state.page.active,
    itemsColor: state.items__item_color.data,
    settings__filter: get(state.settings__filter, 'item', {}),
    sorting_data: get(state.items__sorting, 'data', {}),
}), mapDispatchToProps)(PerButton)

export default PerButton;