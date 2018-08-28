import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {

  linkDom = {};

  componentWillReceiveProps(nextProps) {
    this.linkDom._link.__data__ = nextProps.link;
  }

  componentDidMount() {
    const _self = this;
    let { link, parentComponent } = this.props;
    _self.linkDom._link.__data__ = link;
    const { linkClick, linkMouseover, linkMouseout, hasHoverLink } = parentComponent.props;
    d3.select(hasHoverLink ? this.linkDom._hover_link : this.linkDom._link).on('click', () => {
      linkClick(_self.props.link, d3.event, _self)
    }).on('mouseover', () => {
      linkMouseover(_self.props.link, d3.event, _self)
    }).on('mouseout', () => {
      linkMouseout(_self.props.link, d3.event, _self)
    })
  }

  getBaseProps = () => {
    const { link } = this.props;
    const baseProps = {
      link: link,
      x1: link.source.x,
      y1: link.source.y,
      x2: link.target.x,
      y2: link.target.y,
    };
    return baseProps;
  }

  getObjectProps = object => {
    const { link } = this.props;
    const arrts = {};
    Object.keys(object || {}).forEach(attr => {
      arrts[attr] = typeof object[attr] === 'function' ? object[attr](link) : object[attr];
    });
    return arrts;
  }

  getLinkJsx = () => {
    const { addRef, parentComponent } = this.props
    const { linkElement } = parentComponent.props;
    const baseProps = this.getBaseProps();
    const linkProps = {
      ref: child => {
        this.linkDom._link = child;
        addRef(child)
      },
      ...baseProps
    }
    if (typeof linkElement === 'function') {
      return React.cloneElement(linkElement(link), linkProps);
    } else if (React.isValidElement(linkElement)){
      return React.cloneElement(linkElement, linkProps)
    } else if (typeof linkElement === 'object' || !linkElement) {
      const linkAttrs = this.getObjectProps(linkElement);
      return <line
        stroke="#333"
        strokeWidth="1"
        {...linkAttrs}
        {...linkProps}
      />
    } else {
      throw new Error('prop linkElement isValid');
    }
  }
  

  getHoverLink = () => {
    const { parentComponent, addHoverRef } = this.props;
    const baseProps = this.getBaseProps();
    const { hoverLink = {} } = parentComponent.props;
    const hoverLinkAttrs = this.getObjectProps(hoverLink);
    return <line
      ref={child => {
        this._link = child;
        this.linkDom._hover_link = child;
        addHoverRef(child)
      }}
      stroke="#fff"
      strokeWidth="4"
      opacity="0"
      {...hoverLinkAttrs}
      {...baseProps}
    />
  }

  render() {
    const { hasHoverLink } = this.props;
    return <React.Fragment>
      {this.getLinkJsx()}
      {
        !!hasHoverLink && this.getHoverLink()
      }
    </React.Fragment>
  }
}
