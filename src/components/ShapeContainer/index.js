import React, { Component } from 'react'


export default class ShapeContainer extends Component {

    state = {
        mouse: false
    }
    render() {
        const {label , shape , onClick} = this.props
        let labelHover = null;
        let shapeHover = null;
        if (this.state.mouse) {

            shapeHover = "shape_hover"
            labelHover = "table_label_hover"
        } else {
            labelHover = ""
            shapeHover = ""
        }
        return (
            <div
                className="flex-col"
                onMouseEnter={() => this.setState({ mouse: true })}
                onMouseLeave={() => this.setState({ mouse: false })}
                onClick={()=>onClick(shape)}
                
            >

                <div className={`${shape} ${shapeHover}`}/>
                <div className={"table_label " + labelHover}>{label}</div>

            </div>
        )
    }
}
