import React from 'react';
import * as d3 from 'd3';

export default class Link extends React.Component {
  // click = e => {
  //   let { graphStore, eventGraph, link } = this.props;
  //   d3.event.stopPropagation();
  // }


  componentDidMount() {
    const { link } = this.props;
    this._link.__data__ = link;
    // d3.select(this.linkG).selectAll('.event').on('mouseover', d => {
    //   self.setHighLight(self.props);
    // }).on('mouseout', d => {
    //   self.setUnHighLight(self.props);
    // }).on('click', d => {
    //   self.click();
    // })
  }

  getLink = () => {
    const { addRef, link, parentComponment } = this.props;
    const { getLink } = parentComponment.props;
    if (getLink) {
      return getLink(link);
    }
    return <line
      ref={child => {
        this._link = child;
        addRef(child)
      }}
      style={{
        stroke: '#ccc',
        strokeWidth: 1
      }}
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
    />
  }

  render() {
    const { addRef, link } = this.props;
    return (
      <g>
        {this.getLink()}
      </g>
    )
  }
}
