import React, { Component } from 'react'
import style from './style.less'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

export class button_path_ extends Component {

    handleClick = () => {
        const { push_url, history } = this.props
        if(push_url){
            return history.push('/app' + push_url)
        }
        return history.goBack();
    }

    render() {
        const { label = undefined, t } = this.props
        return (
            <div className={style.container}>
                <button className={style.new_button} onClick={this.handleClick}>
                    {t(label)}
                </button>
            </div>
        )
    }
}
export const wrapper = withTranslation()(button_path_)
export const button_path = withRouter(wrapper)
export default button_path