import React, { Component } from 'react';
import {connect} from 'react-redux';
import { isEmpty } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import {withRouter} from 'react-router-dom';
import classes from './style.less'
import {map} from 'lodash'

class Location extends Component {
    locate = (location)=>{
        const { setMain, order, history} = this.props
        setMain('orders__main', {
            item: {
                action: 'update',
                id: order,
                pick_location: location,
                onSuccess(){
                    history.push('/home')
                    return [{type: 'set_main_popup', data: {popup: {}}}]
                }
            }
        })
    }
    renderButtons() {
        const {list} = this.props;
        if(!isEmpty(list)){
            return <>
                {map(list, (d, i)=>(
                    <button key={i} onClick={this.locate.bind(this, d.id)}>{d.name}</button>
                ))}
            </>
        }
        return <></>
    }
    cancel = () => {
      const { setMain } = this.props
      setMain('popup', { popup: {} })
    }
    render() {
        return <>
            <div className={classes.btnsContanier}>
                {this.renderButtons()}
            </div>
        </>
    }
}
const mapStateToProps = (state)=>({
    order: state.orders__main.active
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Location));
