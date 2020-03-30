import React,{Component} from 'react'
import classes from './style.less';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
class SearchOrder extends Component {
    static onSubmit(props, values) {
     const {setMain, onCancel} = props
     setMain('orders__main',{filters:values.searchInput})
     onCancel()
    }
    renderField = () => {
        return Render([{
            type: "TextBox",
            name: 'searchInput',
            label: 'search:',
            placeHolder: 'Enter Order Number Or Receipt Invoice',
            className: classes.inputField,
        }])
    }
    render() {
        const {onCancel} = this.props
        return (
            <div className={classes.pop_search_container}>
                <div className={classes.inputs}>
                    {this.renderField()}
                </div>
                <div className={classes.saveBtns}>
                    <button onClick={onCancel}>Cancel</button>
                    <button type='submit'>Search</button>
                </div>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)( Form(SearchOrder) )
