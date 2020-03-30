import React, {Component} from 'react'
//import { Icon } from "antd"
// import Red_Square_Button from 'components/Red_Square_Button/index'
import {withRouter} from 'react-router-dom'
import { get, pickBy } from 'lodash'
import Form from 'helpers/wrap/form';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './styles.less'
import applyPermissions from 'helpers/permissions';
import applyFilters from 'helpers/functions/filters';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import {message} from 'antd';
import moment from 'moment'
let fetch = false
class TablePopup extends Component {
    constructor(props){
        super(props);
        this.fields = {
            serve: {
                type: "SelectBox",
                app: {
                    name: "auths__user",
                    params: {
                        is_waiter: true
                    }
                },
                className: classes.select,
                permissions: {
                    user: {
                        not_match_val: {
                            key: 'is_waiter',
                            val: true
                        }
                    }
                }
            },
            guests_num: {
                type: "Label",
                label: "Number Of Guests",
                validates: {
                    required: true,
                    minNumber: props.initialValues.guests_num
                },
                 className: classes.label
            },
            guests_num_pad: {
                type: "Calc",
                target: "guests_num",
                num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'D'],
                clear: ['C'],
                remove: ['D'],
                className:classes.Calc
               
            }
        }
    }
    renderFields=()=>{
        const {User} = this.props;
        return Render(pickBy(this.fields, applyPermissions(User, 'permissions.user')) )
    }
    
    static onSubmit(props, values){
        if(fetch){
            return null
        }
        const { table, setAll, business_day } = props;
        const onSuccess = this.orderSuccess.bind(this, props);
        const dis = []
        // if(values.guests_num == 1){
        //     console.log('iaaam herererer in ppopup')
        //     dis.push(
        //         {type: 'set_main', app: 'orders__details', data: {item:{seat_num:1}}}
        //     )
        // }
        // else{
        //     dis.push(
        //         {type: 'set_main', app: 'orders__details', data: {item:{seat_num:0}}}
        //     )
        // }
        if(table.active) {
            dis.push({
              type: 'set_main', 
              app: 'orders__main', 
              data: {
                  item: {
                      action: 'update',
                      ...values,
                      onSuccess
                  }
                }
            })
        } else {
            if(moment().diff(moment(business_day.created_at), 'day') == 0){
                const data = applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active',
                        sub_mode: props.zone.sub_mode
                    }
                })
                fetch = true
                dis.push({
                    type: 'set_main',
                    app: 'orders__main',
                    data: {
                      item: {
                        ...data,
                        ...values,
                        onSuccess,
                        start_time: new Date(),
                        action: 'add'
                      }
                    }
                })
            }else{
                message.warning('You Cannot Order in this business day please end Day First')
            }
        }
        setAll(dis)
    }
    static orderSuccess(props, order, values){
        const {table,history} = props;
        fetch = false
        // console.log('----------',values)
        history.push('/home')
        return [
            {type: 'set_main_popup', data: { popup: {} }},
            {type: 'set_path_dinin__tables', path: `data.${table.id}.active`, data: order.id}
        ]
    }
    render() {
        const {table} = this.props;
        return (
            <div>
                 <div className="popup-title">
                     <span className={classes.title}>{table.name}</span>
                 </div>
                 <div className={classes.fields}>

                {this.renderFields()}
                 </div>
                <div className={classes.last}>
                    <button  type="button" onClick={this.props.onCancel}>Cancel</button>
                    <button type="submit" >Ok</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
        table: get(state.dinin__tables, `data.${state.dinin__tables.active}`, {}),
        get order() {return get(state.orders__main.data, this.table.active, {})},
        zone: get(state.dinin__zones.data, state.dinin__zones.active, {}),
        User: state.main.current,
        get initialValues(){
            return {
                id: this.order.id,
                guests_num: get(this.order, 'guests_num', 0),
                table: this.table.id,
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form(TablePopup)));
