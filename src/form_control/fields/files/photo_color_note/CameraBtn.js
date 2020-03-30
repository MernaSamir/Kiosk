import React, { Component } from 'react'
import form_style from 'styles/form_control.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export class CameraBtn extends Component {

    onChangeFile(event) {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        this.setState({ file }); /// if you want to upload latter
    }
    render() {
        const { height, padding, width, label, sideLabel , size } = this.props
        return (
            <div className='gencon' style={{border:'none'}}>
                {label ? <span className={form_style.text_name}>{label}</span> : undefined}
                {sideLabel ? <div className={form_style.cheakGrid}>
                    <div>{sideLabel}</div>

                    <button
                        className='genbtn'
                        style=
                        {{
                            height: height ? height : '100%',
                            padding: padding ? padding : '3%',
                            width: width ? width : '40%'
                        }}
                        onClick={() => { this.upload.click() }}>

                        <FontAwesomeIcon icon='camera' size={ size ? size : '5x'} color='#b7b7b7' />

                        <input type="file" id="file"
                            ref={(ref) => this.upload = ref}
                            style={{ display: "none" }}
                            onChange={this.onChangeFile.bind(this)} />

                    </button>
                </div> :
                    <button
                        className='genbtn'
                        style=
                        {{
                            height: height ? height : '100%',
                            padding: padding ? padding : '3%',
                            width: width ? width : '40%'
                        }}
                        onClick={() => { this.upload.click() }}>

                        <FontAwesomeIcon icon='camera' size={ size ? size : '5x'} color='#b7b7b7' />

                        <input type="file" id="file"
                            ref={(ref) => this.upload = ref}
                            style={{ display: "none" }}
                            onChange={this.onChangeFile.bind(this)} />

                    </button>}
            </div>
        )
    }
}
export default CameraBtn
