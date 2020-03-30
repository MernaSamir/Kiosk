import React, { Component } from 'react'
import classes from './style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Back from 'components/Back_Button'
class Header extends Component {
    buttonField=()=> {
          return Render([{
            name: "_type",
            type: 'selectButtons',
            className: classes.inputButton,
            selectFirst: true,
            // validates: {
            //     required: true
            // },
            options: [
                { id: 'CR', name: 'Creditor' },
                { id: 'DE', name: 'Debit' },
              ],
        }])
    }
    render() {
         const {t} = this.props
        return (
                <div className={classes.header}>
                 <Back></Back>
                <p>{t('Cash Settlement')}</p>
                    {this.buttonField()}
                </div>
                        )
    }
}
export default Header
