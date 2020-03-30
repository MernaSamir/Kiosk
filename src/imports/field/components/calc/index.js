import React, { Component } from 'react';
import {get, map, includes } from 'lodash'
import RedSquareButton from 'components/Red_Square_Button';
import classes from './style.less';
import {connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class Calc extends Component {
    state={
        firstTime :''
    }
    componentDidMount() {
      this.setState({firstTime:1})
    }
    
    onChange(value){
        const {field, target} = this.props;
        field.onChange({
            target: {
                name: target|| field.name,
                value
            }
        })
    }
    handelInput = (value) => {
        this.setState({firstTime:0})
        const { target, form={}, clear, remove, field } = this.props
        const f_value = String( get(form.values, target, field.value));
        if (includes(String(f_value), '.') && value == '.') {
            return
        }
        else {
            if (includes(clear, value)) {
               this.onChange("");
            }
            else if(remove.includes(value)){
                this.onChange(f_value.slice(0, -1))
            }
            else {
                if(this.state.firstTime){
                    this.onChange(String(value))
                }
                else{
                    this.onChange([f_value, String(value)].filter(d => d).join(""))
                }

            }
        }

    }
    
    rendercal = () => {
        const {num, width="5rem", data={}} = this.props;
        return map(num,(d, key) => {
            return <RedSquareButton
                key={key}
                width= {data.width||width}
                margin="0 auto"
                name={d}
                onClick={this.handelInput.bind(this, d)}
            />
        })
    }
    render() {
        const {className} = this.props
        return <div className={className}>
            <div className={classes.calc} >
            {this.rendercal()}
        </div>
        </div>
    }
}

export default connect(null, mapDispatchToProps)( Calc)
