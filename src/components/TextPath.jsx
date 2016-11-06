import React, {Component} from 'react';
import ReactDOM from 'react-dom';

 const TextPath = React.createClass({

  propTypes: {
    xlinkhref: React.PropTypes.string,
    branchtext: React.PropTypes.string
  },

  render() {
    let {xlinkhref, branchtext} = this.props;
    return (
        <text
        font-family="Verdana"
        font-size="42.5"
        text-align="right"
        >
        <textPath xlinkHref={xlinkhref}>
          {branchtext}
        </textPath>
       </text>
    );
  }

});

export default TextPath;