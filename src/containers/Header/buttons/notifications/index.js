import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapDispatchToProps from 'helpers/actions/main'
import style from './../style.less'
import { get, isEqual, map, flatten, values, reverse } from 'lodash'
import { Badge, Popover, List} from 'antd'
import applyFilters from 'helpers/functions/filters'

export class notification extends Component {
    constructor(props){
        super(props)
        this.unseen = 0
        this.notifications = <div> </div>
    }

    setNotificationApps = () => {
        const {notifi_db, notifi_apps, appendPath, redux_notifications, current_user} = this.props
        let new_notifi_apps = flatten(map(notifi_db, val => get(val, "app_name",[])))
        if(!isEqual(new_notifi_apps, notifi_apps)){
            appendPath("notification_apps", "data",{ apps:new_notifi_apps } )
        }

        this.unseen = values(redux_notifications).filter(v => !get(v,`notifi_data.seen.${current_user}`)).length
    }

    renderNotifications = () => {
        const {redux_notifications} = this.props
        const data_source = reverse(values(redux_notifications))
        this.notifications =  
            <List
                bordered
                dataSource={data_source}
                renderItem={item => {
                    const {notifi_data:{msg, seen}} = item
                    let color = seen ? 'white' : '#F1FCFF'
                    return (<List.Item style={{backgroundColor: color}} onClick={( ) => this.notifiClicked(item)}>
                        <label> {msg} </label>
                    </List.Item>
                )}}
            />

    }

    notifiClicked = (item) => {
        const {current_user} = this.props
        let {notifi_data} = item
        let gunDB = applyFilters({path:'guns.hq'})
        const key = get(item,"id")
        if(!get(notifi_data,`seen.${current_user}`) && gunDB) {
            const app = get(notifi_data,'app_name')
            const app_data = {[key]: JSON.stringify({...item, notifi_data:{...notifi_data, seen:{...notifi_data.seen, [current_user]: true}}})}
            gunDB.get("notifications").put({[app] : app_data}, (lol) => {
            }) 
        }
        if(notifi_data.url){
            this.props.history.push(`${notifi_data.url}/${key}`)
        }
    }


  render() {
    this.setNotificationApps()
    this.renderNotifications()
    return (
        <Badge count={this.unseen} className={style.badge}>
            <Popover placement="bottom" content={this.notifications} trigger="click">    
                <FontAwesomeIcon className={style.notify} icon ='bell' />
            </Popover>
        </Badge>
    )
  }
}

const mapStateToProps = (state) => ({
    notifi_db : get(state, 'settings__notifications.data'),
    notifi_apps: get(state, 'notification_apps.data.apps'),
    redux_notifications: get(state, 'redux_notifications.data',{}),
    current_user: get(state, 'main.current.id')
})


const wrapper = connect(mapStateToProps, mapDispatchToProps)(notification)
export default withRouter(wrapper)