import React, { Component } from 'react'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import Items from './items'
import { map, find, head, get } from 'lodash'
import classes from './style.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux'

class Groups extends Component {

    state = {
        page: 1,
        modifier: null
    }
    componentDidMount =()=> {
        const {list, setMain} = this.props
        setMain('items__modifier_group', { active: get(head(list),'id','' )})
    }
    componentDidUpdate=(prevProps)=>{
        const {list, setMain, detail} = this.props
        if(prevProps.detail.id != detail.id){
            setMain('items__modifier_group', { active: get(head(list),'id','' )})
        }
    }
    selectModifier = (active) => {
        const { setMain } = this.props;
        setMain('items__modifier_group', { active })
    }

    getModifiers=()=> {
        const filter = {
            key: 'Filter',
            path: 'items__assign_modifier_items',
            params: {
                active: true
            },
            then: {
                key: 'ListInside',
                compare: 'modifierGroups.active',
                select: 'modifier_group',
                selectors: {
                    modifierItems: 'modifier_items'
                }
            }
        }
        return applyFilters(filter);
    }

    componentWillUnmount() {
        const { setMain } = this.props;
        setMain('items__modifier_group', { active: '' })
    }

    click = (op) => {
        const { page } = this.state
        const list = this.getModifiers()
        const maxPage = Math.ceil((Object.keys(list).length) / 15)
        if (!(page <= 1 && op == -1) && !(page >= maxPage && op == 1)) {
            this.setState({
                page: page + op
            })
        }
    }

    renderPag = () => {
        const { page } = this.state
        const list = this.getModifiers()
        const maxPage = Math.ceil((Object.keys(list).length) / 15)
        return <div className={classes.pag_div}>
            <button type="button" className={classes.pag_btn} onClick={this.click.bind(this, -1)}>
                <FontAwesomeIcon icon="caret-left" className={classes.icon} />
            </button>

            <p>{`${page} of ${maxPage}`} </p>

            <button type="button" className={classes.pag_btn} onClick={this.click.bind(this, 1)}>
                <FontAwesomeIcon icon="caret-right" className={classes.icon} />
            </button>

        </div>
    }

    getMinMax = (modifier) => {
        this.setState({
            modifier: modifier
        })
    }

    renderItems = () => {
        const { list, active, onClick, detail } = this.props;
        const group = find(list, { id: active });

        return <>
            <div className={classes.choose_div}>
            <p className={classes.due}>{`Choose ${group ? group._max : "Items"}`}</p>
            <Items group={group} page={this.state.page} onClick={onClick} detail={detail} />
            </div>

            
        </>
    }

    renderSpanStyle = (d, active) => {
        return <span style={{ color: active == d.id ? '#ffffff' : '#d73f7c' }} >
            {d.name} {d._max > 0 && `(${d.reminder})`}
        </span>
    }

    renderGroups = () => {
        const { list, active } = this.props;
        console.log(list)
        return map(list, (d, key) => (
            <button key={key} className={classes.Mod_btn}
                onClick={this.selectModifier.bind(this, d.id)} >
                <div className={active == d.id && classes.Mod_btn_active}>
                    {this.renderSpanStyle(d, active)}
                </div>
            </button>
        ))
    }

    render() {
        const { active } = this.props
        return (
            <>
                <div className={classes.Mod_modifiersBox}>
                <div className={classes.x}>{this.renderGroups()}</div>
                
                {active && this.renderItems()}
                </div>
            </>
        )
    }
}

const mapStateToProps = (state, props) => ({
    active: state.items__modifier_group.active
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Groups))
