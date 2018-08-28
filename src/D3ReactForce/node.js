import React from 'react';
import * as d3 from 'd3';

export default class Node extends React.Component {

  nodeDom = {}

  componentWillReceiveProps(nextProps) {
    this.nodeDom._node.__data__ = nextProps.node; // 解决导入操作记录时候因为图上节点已存在引用变化的问题
  }

  initEvent = props => {
    const { node, parentComponent } = props;
    this.nodeDom._node.__data__ = node;
    d3.select(this.nodeDom._node)
    .on('click', d => {
      const event = d3.event;
      event.stopPropagation();
      const { nodeClick, nodeDbClick } = parentComponent.props;
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
      const { nodeMouseover } = parentComponent.props;
      nodeMouseover && nodeMouseover(node, d3.event);
    })
    .on('mouseout', node => {
      const { nodeMouseout } = parentComponent.props;
      nodeMouseout && nodeMouseout(node, d3.event);
    })
    .call(parentComponent.force.drag)
    .on('mouseover.force', null)
    .on('mouseout.force', null);
  }

  componentDidMount() {
    this.initEvent(this.props);
  }

  getNode = () => {
    const { node, parentComponent } = this.props;
    const { nodeElement } = parentComponent.props;
    if (nodeElement) {
      if (typeof nodeElement === 'function') {
        return nodeElement(node)
      } else if (React.isValidElement(nodeElement)) {
        return React.cloneElement(nodeElement, {node: node});
      } else {
        throw new Error('prop nodeElement isValid');
      }
    }
    return <circle cx="0" cy="0" r="10" strokeWidth="1" stroke="#4098e2" fill="#fff" />
  }

  render() {
    const { node, addRef, parentComponent } = this.props;
    const { nodeIdKey, width, height, nodeProps } = parentComponent.props;
    return (
      <g ref={child => {
          this.nodeDom._node = child;
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
