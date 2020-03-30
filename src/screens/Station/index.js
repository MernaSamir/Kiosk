import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Logo from '../../assets/images/Logo Topbar@3x.png'
import Pic1 from '../../assets/images/001-shopping-bag (1)@3x.png'
import Pic2 from '../../assets/images/002-cocktail@3x.png'
import Pic3 from '../../assets/images/003-serving-dish@3x.png'
// import './style.css'

export class Station extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <div className="Station_main">
            <img src={Logo} className="Station_Logo" />
            <div className="Station_Text">Choose your Station:</div>
            <div className="Station_flexbox">
              <div className="Station_flex"><img src={Pic1} className="Station_pic" /> Station One</div>
              <div className="Station_flex"><img src={Pic2} className="Station_pic" /> Station Two</div>
              <div className="Station_flex"><img src={Pic3} className="Station_pic" /> Station Three</div>
            </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Station)
