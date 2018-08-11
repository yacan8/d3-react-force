import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {

  componentWillReceiveProps(nextProps) {
    this._link.__data__ = nextProps.link;
  }

  componentDidMount() {
    const _self = this;
    let { link, parentComponment } = _self.props;
    _self._link.__data__ = link;
    const { linkClick, linkMouseover, linkMouseout } = parentComponment.props;
    d3.select(this._hover_link).on('click', () => {
      linkClick(_self.props.link, d3.event, _self)
    }).on('mouseover', () => {
      linkMouseover(_self.props.link, d3.event, _self)
    }).on('mouseout', () => {
      linkMouseout(_self.props.link, d3.event, _self)
    })
  }
  

  getLink = () => {
    const { addRef, link, parentComponment, addHoverRef } = this.props;
    const { linkElement, hoverLink = {} } = parentComponment.props;
    let linkDom;
    if (typeof linkElement === 'function') {
      linkDom = React.cloneElement(linkElement(link), {
        ref: child => {
          this._link = child;
          addRef(child)
        },
        key: "link",
        link: link,
        x1: link.source.x,
        y1: link.source.y,
        x2: link.target.x,
        y2: link.target.y
      });
    } else if (React.isValidElement(linkElement)){
      linkDom = React.cloneElement(linkElement, {
        addRef: child => {
          this._link = child;
          addRef(child)
        },
        key: "link",
        link: link,
        x1: link.source.x,
        y1: link.source.y,
        x2: link.target.x,
        y2: link.target.y
      })
    } else if (typeof linkElement === 'object' || !linkElement) {
      const linkAttrs = {};
      Object.keys(linkElement || {}).forEach(attr => {
        linkAttrs[attr] = typeof linkElement[attr] === 'function' ? linkElement[attr](link) : linkElement[attr];
      });
      linkDom = <line
        key="link"
        ref={child => {
          this._link = child;
          addRef(child)
        }}
        stroke="#333"
        strokeWidth="1"
        {...linkAttrs}
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
      />
    } else {
      throw new Error('prop linkElement isValid');
    }
    const hoverLinkAttrs = {}
    Object.keys(hoverLink).forEach(attr => {
      hoverLinkAttrs[attr] = typeof hoverLink[attr] === 'function' ? hoverLink[attr](link) : hoverLink[attr];
    });
    return [
      linkDom,
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

  render() {
    const { addRef, link, addHoverRef } = this.props;
    return this.getLink()
  }
}
