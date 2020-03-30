import React, { Component } from 'react'
import classes from './styles.less';
import DropDown from 'components/dropdown'
import Back from 'components/Back_Button'

const data = [{id: '/list/customer', name: 'Customer'}, {id: '/list/employee', name:'Empolyee'}]
class HeaderWithBack extends Component {
    state = {
        id:'/list/customer'
    }
    setChoice = (id)=>{
        const {history} = this.props
        this.setState({id})
        history.push(id)
        
    }
    render() {
        const { name, type, authorize=true } = this.props
        return (
            <div className={classes.first}>
                <Back authorize={authorize}></Back>

                {type == "Select" ?
                <DropDown
                data={data}
                btnClass={classes.btn}
                clickedclass={classes.active}
                onChange={this.setChoice}
                value={this.state.id}>
                </DropDown>
               : <p>{name}</p>}

            </div>
        )
    }
}
export default HeaderWithBack

