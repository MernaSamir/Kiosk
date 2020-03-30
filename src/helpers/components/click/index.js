import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class wrap extends Component {

  constructor(props) {
    super(props)
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const { select_class } = this.props
    if (select_class) {
      this.wrapperRef = document.querySelector(select_class);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }
  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event) => {
    // console.log(this.wrapperRef.children)
    // const domEle
    const { select_class } = this.props
    if (!this.wrapperRef && select_class) {
      this.wrapperRef = document.querySelector(select_class);
    }
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      const { onClick = this.props.setAll } = this.props
      onClick(this.props.reset)
    }
  }

  render() {
    return <div ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

export default connect(null, mapDispatchToProps)(wrap)