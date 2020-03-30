import { Component } from 'react';
import {isEqual, pick, map} from 'lodash'
export default class BasicComponent extends Component {

    componentDidMount(){
        map(this.props.compare, (setting)=>{
            return setting.action(this.props);
        })
    }

    compare(newProps, settings) {
        const original = this.props;
        if(!isEqual(pick(newProps, settings.compare), pick(original, settings.compare))){
            settings.action(newProps)
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        map(this.props.compare, (setting)=>{
            return this.compare(nextProps, setting);
        })
        return !isEqual({props: this.props}, {props: nextProps})
    }

    render() {
        return (
            this.props.children
        );
    }
}