import React, { Component } from 'react'
import style from './style.less'
import MainAction from 'helpers/actions/button'
import { withTranslation } from 'react-i18next'


export class button extends Component {
    takeAction = () => {
        const { func, form } = this.props
        MainAction(func, form.values)
    }

    importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }

    render() {
        const { label, t, text ,photo} = this.props
        const images = this.importAll(require.context('../../../../../assets/button', false, /\.(png|jpe?g|svg)$/));

        return (
            <div className={style.main}>
                <p>{t(label)}</p>
                <button onClick={this.takeAction}>
                    {text ? t(text) : undefined}
                    {photo ? <img src={images[photo + '.svg']} /> : undefined}
                </button>
            </div>
        )
    }
}

export default withTranslation()(button)