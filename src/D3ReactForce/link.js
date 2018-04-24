import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {

  getLink = () => {
    const { addRef, link, parentComponment } = this.props;
    const { getLink } = parentComponment.props;
    if (typeof getLink === 'function') {
      return getLink(link, addRef);
    } else {
      return <line
        ref={child => {
          this._link = child;
          addRef(child)
        }}
        stroke="red"
        strokeWidth={1}
        {...getLink}
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
