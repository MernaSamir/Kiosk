import React, { Component } from 'react'
import './radioButton.css'

export default class Radiobtn extends Component {
    state = {
        
        borderColor: this.props.borderColor,
    }

    displayinsqure = () => {

       
        this.props.radioclick()

    }

    // selectall = () => {
    //     this.setState({
    //         displayinsqure: !(this.props.displayinsqure),
    //     })
    //     this.props.selectall()
    // }


    render() {
        const { width, height, className, type } = this.props

        return (


                this.props.displayinsqure ?
                    <div className={"back-squre " + className}
                        style={{ width: width, height: height, border: "1px solid #fe534c" }}
                        onClick={() => this.displayinsqure()}>
                        <div className="in-squre"></div>
                        
                    </div>

                    : <div className={"back-squre " + className}
                        style={{ width: width, height: height, border: this.state.borderColor }}
                        onClick={() => this.displayinsqure()}>
                        
                    </div>



        )
    }
}
