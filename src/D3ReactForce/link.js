import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {

  getLink = () => {
    const { addRef, link, parentComponment } = this.props;
    const { getLink } = parentComponment.props;
    if (typeof getLink === 'function') {
      return getLink(link, addRef);
    } else if (typeof getLink === 'object'){
      const stroke = typeof getLink.stroke === 'function' ? getLink.stroke(link) : getLink.stroke;
      const strokeWidth = typeof getLink.strokeWidth === 'function' ? getLink.strokeWidth(link) : getLink.strokeWidth;
      return <line
        ref={child => {
          this._link = child;
          addRef(child)
        }}
        {...getLink}
        stroke={stroke || '#333'}
        strokeWidth={strokeWidth || 1}
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
      />
    }
  }

  render() {
    const { addRef, link } = this.props;
    return this.getLink()
  }
}
