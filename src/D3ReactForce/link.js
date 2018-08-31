import React from 'react';
import { select as d3_select, event as d3_event } from 'd3-selection';

export default class Link extends React.Component {

  componentWillReceiveProps(nextProps) {
    this._link.__data__ = nextProps.link;
  }

  componentDidMount = () => {
    let { link, parentComponent } = this.props;
    this._link.__data__ = link;
    const { linkClick, linkMouseover, linkMouseout, hasHoverLink } = parentComponent.props;
    d3_select(hasHoverLink ? this._hover_link : this._link).on('click', () => {
      linkClick.call(this, this.props.link, d3_event)
    }).on('mouseover', () => {
      linkMouseover.call(this, this.props.link, d3_event)
    }).on('mouseout', () => {
      linkMouseout.call(this, this.props.link, d3_event)
    })
  }


  saveRef = child => {
    const { addRef } = this.props
    addRef(child);
    this._link = child;
  }

  saveHoverLinkRef = child => {
    const { addHoverRef } = this.props;
    this._hover_link = child;
    addHoverRef(child)
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
      ref: this.saveRef,
      ...baseProps
    }
    if (typeof linkElement === 'function') {
      return React.cloneElement(linkElement(link), linkProps);
    } else if (React.isValidElement(linkElement)){
      const { ref, ...nestProps } = linkProps;
      return React.cloneElement(linkElement, {...nestProps, addRef: this.saveRef})
    } else if (typeof linkElement === 'object' || !linkElement) {
      const linkAttrs = this.getObjectProps(linkElement);
      return <line
        stroke="#999"
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
      ref={this.saveHoverLinkRef}
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
