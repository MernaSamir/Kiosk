import React, { Component } from 'react'
// import '../style.css';
import Back_Button from 'components/Back_Button'
import { withRouter } from 'react-router-dom'
class Header extends Component {

    backBtn = () => {
        const { field, setMain } = this.props
        setMain('form_actions', { [field.name]: {select: ''} })        
    }

    render() {
        const { name  } = this.props

        return (
            <div>
                <div className="Quantity_Change_top">
                    <div className="Quantity_Change_title">Quantity</div>
                    <Back_Button onClick={this.backBtn} />
                </div>
                <div className="Quantity_Change_due">Items selected: {name} </div>
            </div>
        )
    }
}

export default  withRouter(Header)