import React from 'react';
import * as d3 from 'd3';

export default class Node extends React.Component {

  componentWillReceiveProps(nextProps) {
    this._node.__data__ = nextProps.node; // 解决导入操作记录时候因为图上节点已存在引用变化的问题
  }


  initEvent = props => {
    const { node, parentComponment } = props;
    this._node.__data__ = node;
    const nodeDom = d3.select(this._node)
    .on('click', d => {
      const event = d3.event;
      event.stopPropagation();
      const { nodeClick, nodeDbClick } = parentComponment.props;
      if (d._clickid) {
        clearTimeout(d._clickid);
        d._clickid = null;
        if (nodeClick) {
          nodeClick(d, event);
        }
        if (nodeDbClick) {
          nodeDbClick(d, event);
        }
      } else {
        d._clickid = setTimeout(() => {
          if (nodeClick) {
            nodeClick(d, event);
          }
          d._clickid = null;
        }, 300);
      }
    })
    .on('mouseover', node => {
      const { nodeMouseover } = parentComponment.props;
      nodeMouseover && nodeMouseover(node, d3.event);
    })
    .on('mouseout', node => {
      const { nodeMouseout } = parentComponment.props;
      nodeMouseout && nodeMouseout(node, d3.event);
    })
    .call(parentComponment.force.drag)
    .on('mouseover.force', null)
    .on('mouseout.force', null);
  }

  componentDidMount() {
    this.initEvent(this.props);
  }

  getNode = () => {
    const { node, parentComponment } = this.props;
    const { nodeElement } = parentComponment.props;
    if (nodeElement) {
      if (typeof nodeElement === 'function') {
        return nodeElement(node)
      } else if (React.isValidElement(nodeElement)) {
        return React.cloneElement(nodeElement, {node: node});
      } else {
        throw new Error('prop nodeElement isValid');
        return null;
      }
    }
    return <circle cx="0" cy="0" r="10" strokeWidth="1" stroke="#4098e2" fill="#fff" />
  }

  render() {
    const { node, addRef, parentComponment } = this.props;
    const { nodeIdKey, width, height, nodeProps } = parentComponment.props;
    return (
      <g ref={child => {
          this._node = child;
          addRef(child);
        }}
        {...nodeProps}
        transform={`translate(${node.x || width / 2},${node.y || height / 2})`}
      >
        <g id={node[nodeIdKey]}>
          {this.getNode()}
        </g>
      </g>
    );
  }
}
