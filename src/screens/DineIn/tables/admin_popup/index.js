import React, {Component} from 'react'
import { Icon } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get, pick ,filter} from 'lodash';
import applyFilter from 'helpers/permissions'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main';
import {connect} from 'react-redux';
import ClickOutSide from 'helpers/components/click';

class Popup extends Component {
    actions = {

        edit: {
            title: 'Edit Table',
            icon: ['far', 'edit'] ,
            click: 'editTable',
            permissions: {

            }
        },
        close: {
            title: 'Close Table',
            item_component: <Icon className={classes.btnIcon} type={"lock"} /> ,
            click: 'closeTable',
            permissions: {
                table: {
                    check_not_props :['closed', 'active'],
                }
            }
        },
        open: {
            title: 'Open Table',
            item_component: <Icon className={classes.btnIcon} type={"unlock"} /> ,
            click: 'closeTable',
            permissions: {
                table: {
                    check :'closed',

                }
            }
        },
        delete: {
            title: 'Delete Table',
            icon: ['far', 'trash-alt'] ,
            click: 'deleteTable',
            permissions: {
                table: {
                    check_equal:{key:'order_count',value:0}
                }
            }
        }



    }
    editTable = ()=>{
        const {setAll} = this.props
        const popup = {type:'EditTableAdmin', visable:true, width:'70%' }
        setAll([
            {type: 'set_main', app: 'popup', data: {popup}},
            {type: 'set_main', app: 'dinin__tables', data: {popup:{}}},
        ])
    }
    takeAction = (action, ev) => {
        get(this, action.click, () => { })()
    }

    deleteTable = () => {
        const { setMain,  active } = this.props
        setMain('dinin__tables', { item: { id: active.id, action: 'delete' }, popup:{},active:''})
    }
    closeTable = () => {
        const { setMain,  active } = this.props
        setMain('dinin__tables', { item: { id: active.id, closed: !active.closed, action: 'update' }, popup:{}, active:''})
    }
    hidePopup=()=>{
        const {setMain} = this.props
        setMain('dinin__tables', {popup:''})
    }

    returnOptions = () => {
        const { active, popup = {}, t} = this.props
        return filter((this.actions), popup.show == 'show' && applyFilter( active, "permissions.table")).map((action, index) => (
            <button  key={index} onClick={this.takeAction.bind(this, action)}>
                {action.item_component || <FontAwesomeIcon className={classes.btnIcon} icon={action.icon} />}
                <div >{t(action.title)}</div>
            </button>
        ))}
    
    render() {
        const {popup, t} = this.props
        const options = this.returnOptions()
        return (
            Boolean(options.length) &&  <ClickOutSide onClick={this.hidePopup}><div className={classes.adminPopup} style={{...pick(popup, ['top', 'left','bottom','right'])}} >
                    <span >{t('Table Options')}</span>
                {this.returnOptions()}
            </div>
            </ClickOutSide>
        )
    }
}
const mapStateToProps =(state)=>({
    popup: get(state.dinin__tables, 'popup', {}),
    active: get(state.dinin__tables.data, state.dinin__tables.active),
})

export default connect(mapStateToProps, mapDispatchToProps)(Popup)
