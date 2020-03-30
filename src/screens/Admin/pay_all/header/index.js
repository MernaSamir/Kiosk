import React, { Component } from 'react'
import classes from './style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Back from 'components/Back_Button'
class Header extends Component {
    buttonField=()=> {
        const {setActive} = this.props
        return Render([{
            name: "_type",
            type: 'selectButtons',
            className: classes.inputButton,
            selectFirst: true,
            validates: {
                required: true
            },
            options: [
                { id: 'PI', name: 'Pay In' },
                { id: 'PO', name: 'Pay Out' },
              ],
            onClick:setActive


        }])
    }
    setActive = (d) => {
        this.setState({ activeTab: d.name }, () => {
        })
      }
    render() {
         const {t} = this.props
        return (
                <div className={classes.header}>
                 <Back/>
                <p>{t('Pay Ins / Pay Outs')}</p>
                    {this.buttonField()}
                </div>
                        )
    }
}
export default Header
