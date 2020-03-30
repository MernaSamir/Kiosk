import React, { Component } from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { get, map} from 'lodash';
import { get_object_index } from 'helpers/functions/array_to_object';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters'
import Calculator from 'components/down_calculator';

class Favorites extends Component {

    renderCalc=()=>{
    const{setMain,appendPath,active_action  } = this.props
    if(active_action =='calculator')
        return <Calculator setMain={setMain} append_path={appendPath} />
    }

    

    onSelect = (index, ev) => {
        const { setMain } = this.props;
        const ele = ev.target.getBoundingClientRect()
        setMain('popup', { position: { left: ele.x || ele.right, top: ele.y || ele.bottom }, index })
    }

    addToBill = (active, ev) => {
        const { setMain, list } = this.props;
        setMain('items__sales_items', { active })
        if (this.onSelect) {
            const index = get_object_index(list, active)
            this.onSelect(index, ev)
        }
    }


    renderItems = () => {
        const {filters, pageNum, lang} = this.props
        const list = applyFilters({
            key:'Search',
            path:'items__sales_items',
            params:{
                name: filters
            }
        })
        return map(list, (d, key) => (
            <button type="button" className={classes.subcat_btn}
                onClick={this.addToBill.bind(this, d.id)}>
                {get(d, lang.show)}
            </button>
        )).slice((pageNum - 1) * 25, pageNum * 25)
    }
    render() {
        return (
            <>
                <div className={classes.subcat}>
                    {this.renderItems()}
                </div>
                   {this.renderCalc()}
                   </>
           
        )
    }
}

const mapStateToProps = (state) => ({
    data: get(state.items__favorite.data, state.items__favorite.active, {}),
    pageNum: state.page.active,
    filters: get(state,'main.search','' ),
    active_action: state.actions.active,
    lang: get(state.dropdowns__lang.data, state.dropdowns__lang.active,  {show: 'name'})
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)