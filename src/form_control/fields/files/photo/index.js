import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.less'
import axios from 'axios'
import Image from 'components/show/image'
const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
}
export class photo extends Component {

    onChangeFile(event) {
        const { field } = this.props;
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];

        const url = '/api/v1/items/sales-items/upload/';
        const formData = new window.FormData();
        formData.append('file', file)

        return axios.post(url, formData, config).then(({ data }) => {
            field.onChange({ target: { name: field.name, value: data.url } })
        })
    }
    render() {
        const { field, width } = this.props
        return (
            <button className={style.button}
                onClick={() => { this.upload.click() }}
                style={{ width: width ? width : undefined }}>
                {
                    field.value != null ?
                        <Image src={field.value} />
                        :
                        <FontAwesomeIcon icon='camera' size='5x' color='#b7b7b7' className={style.camera} />
                }



                <input type="file" id="file"
                    ref={(ref) => this.upload = ref}
                    style={{ display: "none" }}
                    onChange={this.onChangeFile.bind(this)} />
            </button>
        )
    }
}
export default photo
