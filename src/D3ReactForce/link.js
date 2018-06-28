import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {

  componentDidMount() {
    let { link, parentComponment } = this.props;
    const self = this;
    this._link.__data__ = link;
    const { linkClick, linkMouseover, linkMouseout } = parentComponment.props;
    d3.select(this._hover_link).on('click', () => {
      linkClick(link, d3.event, this)
    }).on('mouseover', () => {
      linkMouseover(link, d3.event, this)
    }).on('mouseout', () => {
      linkMouseout(link, d3.event, this)
    })
  }
  

  getLink = () => {
    const { addRef, link, parentComponment, addHoverRef } = this.props;
    const { getLink = {}, hoverLink = {} } = parentComponment.props;
    if (typeof getLink === 'function') {
      return getLink(link, addRef);
    } else {
      const linkAttrs = {};
      const hoverLinkAttrs = {}
      Object.keys(getLink).forEach(attr => {
        linkAttrs[attr] = typeof getLink[attr] === 'function' ? getLink[attr](link) : getLink[attr];
      });
      Object.keys(hoverLink).forEach(attr => {
        hoverLinkAttrs[attr] = typeof hoverLink[attr] === 'function' ? hoverLink[attr](link) : hoverLink[attr];
      });
      return [
        <line
          key="link"
          ref={child => {
            this._link = child;
            addRef(child)
          }}
          {...getLink}
          stroke="#333"
          strokeWidth="1"
          {...linkAttrs}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
        />,
        <line
          key="hover"
          ref={child => {
            this._hover_link = child;
            addHoverRef(child)
          }}
          stroke="#fff"
          strokeWidth="4"
          opacity="0"
          {...hoverLinkAttrs}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
        />,
      ]
    }
  }

  render() {
    const { addRef, link, addHoverRef } = this.props;
    return this.getLink()
  }
}
