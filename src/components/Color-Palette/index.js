import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setItemColor } from 'store/actions/orderList-actions'

import './color-palette.css'

const colors = ['#56ad7e', '#ffa064', '#d1599e', '#6485e0', '#e54460', '#9c52ff', '#707070', '#e3b432', '#000000']

class ColorPalette extends Component {

    changeColor = (color, id) => {
        const { setItemColor } = this.props
        setItemColor(color, id)
    }

    setColor = (color, id) => {
        this.changeColor(color, id)
        this.props.onCancel()
    }

    renderColors = () => {
        const { id } = this.props
        return colors.map((color,index) => {
            return <button key={index} type="button" className="color-btn"
                style={{ backgroundColor: color }} onClick={() => this.setColor(color, id)} >
            </button>
        })
    }

    render() {

        return (
            <div className="color-palette-container">
                <div className="colors-div">

                    {this.renderColors()}

                </div>

            </div>
        )
    }
}


const mapDispatchToProps = {
    setItemColor,
}

export default connect(null, mapDispatchToProps)(ColorPalette)
