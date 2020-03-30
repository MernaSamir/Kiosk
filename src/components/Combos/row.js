import React, { Component } from 'react'
import RadioButton from './../Radio-Button/index'

export default class Row extends Component {
    state = {
        radio: false,
    }


    radioclick = () => {
        this.setState({
            radio: !this.state.radio
        })
    }

    componentWillReceiveProps(nextProps){

        if (nextProps.selectall){
            this.setState({radio:true})
        }else{
            this.setState({radio:false})

        }
    }
    render() {
        const { radio } = this.state
        return (

                <tr className="table-row">
                    <td className="table-mark">
                        <RadioButton className="selectall" height="2vh" width="50%" borderColor="1px solid #707070"
                            radioclick={this.radioclick} displayinsqure={radio} />
                    </td>
                    <td className="id"><span style={this.state.radio ? { color: "#474747", fontWeight: "600" } : { color: '#707070' }}>12</span></td>
                    <td className="name"><span style={this.state.radio ? { color: "#474747", fontWeight: "600" } : { color: '#707070' }}>Combo Long Name</span></td>
                </tr>

        )
    }
}
