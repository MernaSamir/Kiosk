import React, { Component } from 'react'
import style from './style.less'
import { connect } from 'react-redux'
import { get, map, indexOf } from 'lodash';


class Nav_Location extends Component {

  renderLocation = () => {
    const { location } = this.props
    return map(location, (d, i) => {
      if (indexOf(location, d) != location.length - 1) {
        return d.split('_').join(' ') + ' > '
      } else { return <span className={style.NavLocation_fontBigger} key={i}>{d}</span> }
    })

  }
  render() {
    return (
      <div className={style.NavLocation_font}>
        {this.renderLocation()}
        {/* <div className={style.NavLocation_line}></div> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: get(state, 'apps.Nav_location', []),
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Nav_Location)
