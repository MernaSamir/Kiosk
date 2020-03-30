import React, { Component } from 'react';
import * as Components from './components';
import {get} from 'lodash';
class Header extends Component {
    static propTypes = {
        
    };

    constructor(props) {
        super(props);
        const type = props.header;
        this.HeaderComponent = get(Components, type, Components.Main);

    }

    render() {
        const {HeaderComponent} = this;
        return (
            <HeaderComponent {...this.props}> </HeaderComponent>
        );
    }
}

export default Header;
