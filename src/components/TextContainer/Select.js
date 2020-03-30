import React, { Component } from 'react';
class select extends Component {
    renderOptions = () => {
        const { data } = this.props
        return (data || []).map((d) => (
            <option key={d.key} value={d.value}>{d.key}</option>
        ))
    }
    render() {
        const { style, title } = this.props
        return (
            <div className="txtInputContainer"   style={{ ...style }}  >
                <p className="title"> {title}</p>
                <select className="txtInputSelect"    >
                    {this.renderOptions()}
                </select>
            </div>
        );
    }
}
export default select;