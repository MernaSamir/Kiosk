import React, { Component } from 'react'
import './style.css'
import FormControls from 'form_control'


export class Photo_Color extends Component {
    state = {
    }


    renderForm = (callType) => {
        const { group, onChange, values } = this.props
        return (group || []).map((d, index) => {
            if (d.type == callType) {
                return <td key={index} style={{ margin: this.props.direction == "column" ? '5% 0' : undefined }}>
                    <FormControls
                        {...d}
                        value={values ? values[d.name] : ''}
                        onChange={onChange}

                    />
                </td>
            }
        })

    }


    render() {

        return (
            <div className="PC_main">

                <div className="cameraBox">
                    {this.renderForm('photo')}
                </div>

                <div className="PC_flexBox">
                    {this.renderForm('color')}
                    {this.renderForm('note')}
                </div>

            </div>
        )
    }
}

export default Photo_Color