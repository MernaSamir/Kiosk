import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, filter } from 'lodash';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import Search from 'components/search'
class Actions extends Component {

    

    constructor(props) {
        super(props)
        this.buttons = {
            favorite: {
                class: classes.fav_btn,
                icon: "star",
                click: this.activeFavorite,
                key: 'favorite'
            },
            calculator: {
                class: classes.calc_btn,
                icon: "calculator",
                click: this.activeCalculator,
                key: 'calculator'
            },
            card: {
                class: classes.card_btn,
                icon: ["far", "id-card"],
                show: {
                    key: 'checkStationType',
                    not: true,
                    type: 'sma_w'
                },
                click: this.activeStaffMeals,
                key: 'card'
            },
            info: {
                class: classes.info_btn,
                icon: "info",
                click: this.activeInfo,
                key: 'info'
            },
            search: {
                class: classes.search_btn,
                icon: "search",
                click: this.search,
                key: 'search'
            }
        };
    }

    componentDidMount() {
        const { setMain, history } = this.props
        if(history.location.pathname == '/home')
            setMain('actions', { active: '' })
        setMain('items__sales_items', { filter: {} })
    }

    resetActions = () => {
        const { setMain, history } = this.props
        history.push('/home')
        setMain('actions',   { active: '' })
        setMain('items__sales_items', { filter: {} })
    }

    activeFavorite = () => {
        const { history, setMain, activeAction } = this.props
        this.resetActions()
        if (activeAction != 'favorite') {
            setMain('actions', { active: 'favorite' })
            history.push('/home/favorite')
        }
        else {
            setMain('actions', { active: '' })
            history.push('/home')
        }
    }

    activeCalculator = () => {
        const { setMain, activeAction } = this.props
        // this.resetActions()
        if (activeAction != 'calculator' ) {
            setMain('actions', { active: 'calculator' })
        }
        else {
            setMain('actions', { active: '' })
            setMain("orders__details", { active: '' })
        }
    }

    activeStaffMeals = () => {
        const { setMain, activeAction , history } = this.props
        this.resetActions()
        if (activeAction != 'card') {
            setMain('actions', { active: 'card' })
            // history.push('./staff_meal')
            setMain('items__sales_items', { filter: { 'is_staff_meal': true } })
        }
        else {
            setMain('actions', { active: '' })
            setMain('items__sales_items', { filter: {} })
        }
    }

    activeInfo = () => {
        const { setMain, activeAction } = this.props
        this.resetActions()
        if (activeAction != 'info') {
            setMain('actions', { active: 'info' })
        }
        else {
            setMain('actions', { active: '' })
        }
    }
    search=()=>{
        const {setMain, activeAction, history, setAll} = this.props
        if(activeAction != "search" ){
            setMain('actions', { active: 'search' })
            history.push('/home/search')
        }
        else{
            setAll([
                { type: 'set_main', app: 'actions', data: { active:'' } },
                { type: 'set_main', app: 'main', data: { search: '' } },
            ])
            history.push('/home')
        }

    }



    renderActions() {
        const { activeAction } = this.props
        return filter(this.buttons, (d) => (applyFilters(d.show || { key: 'true' }, {}))).map((d, key) => (
            (get(d, "component", <button key={key}
                className={activeAction == d.key ? classes.active_action : d.class}
                onClick={d.click}>
                <FontAwesomeIcon icon={d.icon} />
            </button>))
        ))
    }

    render() {
        const {activeAction} = this.props
        return (
            <div className={classes.container}>
            <div className={classes.icons_div}>
                
                {this.renderActions()}
               
            </div>
             {activeAction=='search'&&<Search className={classes.inputDiv}/>}
             </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeAction: state.actions.active,
    activeItem: state.items__sales_items.active,
    user: get(state, 'main.current', ''),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Actions))