import React from 'react';
import * as d3 from 'd3';

export default class Node extends React.Component {

  componentWillReceiveProps(nextProps) {
    this._node.__data__ = nextProps.node; // 解决导入操作记录时候因为图上节点已存在引用变化的问题
  }

  componentDidMount() {
    const { node, parentComponment } = this.props;
    const { nodeClick } = parentComponment.props;
    this._node.__data__ = node;
    d3.select(this._node)
    .on('click', d => {
      const event = d3.event;
      event.stopPropagation();
      if (nodeClick) {
        nodeClick(node);
      }
    })
    .call(parentComponment.force.drag)
  }

  getNode = () => {
    const { node, parentComponment } = this.props;
    const { getNode } = parentComponment.props;
    if (getNode) {
      return getNode(node)
    }
    return <circle cx="0" cy="0" r="10" strokeWidth="0" fill="#999" />
  }

  render() {
    const { node, addRef, parentComponment } = this.props;
    const { nodeIdKey } = parentComponment;
    return (
      <g ref={child => {
          this._node = child;
          addRef(child);
        }}
        transform={`translate(${node.x || 400},${node.y || 400})`}
      >
        <g id={node[nodeIdKey]}>
          {this.getNode()}
        </g>
      </g>
    );
  }
}
