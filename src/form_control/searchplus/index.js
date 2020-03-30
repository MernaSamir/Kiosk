import React, { Component } from 'react'
import { Input } from 'antd'
import { withTranslation } from 'react-i18next';

export class SearchPlus extends Component {
    render() {
        const { placeholder, t } = this.props

        return (


                <Input className='searchclass' placeholder={t(placeholder)} style={{width:'100%', padding:'1%' , height:'100%'}}/>
        )
    }
}

export default withTranslation()(SearchPlus);