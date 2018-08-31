import React from 'react';
import { select as d3_select, event as d3_event } from 'd3-selection';

export default class Node extends React.Component {

  componentWillReceiveProps(nextProps) {
    this._node.__data__ = nextProps.node; // 解决导入操作记录时候因为图上节点已存在引用变化的问题
  }

  initEvent = props => {
    const { node, parentComponent } = props;
    this._node.__data__ = node;
    d3_select(this._node)
    .on('click', d => {
      const event = d3_event;
      event.stopPropagation();
      const { nodeClick, nodeDbClick } = parentComponent.props;
      if (d._clickid) {
        clearTimeout(d._clickid);
        d._clickid = null;
        nodeClick.call(this, d, event);
        nodeDbClick.call(this, d, event);
      } else {
        d._clickid = setTimeout(() => {
          nodeClick(d, event);
          d._clickid = null;
        }, 300);
      }
    })
    .on('mouseover', node => {
      const { nodeMouseover } = parentComponent.props;
      nodeMouseover.call(this, node, d3_event);
    })
    .on('mouseout', node => {
      const { nodeMouseout } = parentComponent.props;
      nodeMouseout.call(this, node, d3_event);
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
    return <circle cx="0" cy="0" r="10" strokeWidth="1" stroke="#4098e2" fill="#4098e2" />
  }

  saveRef = child => {
    this._node = child;
    this.props.addRef(child);
  }

  render() {
    const { node, parentComponent } = this.props;
    const { nodeIdKey, width, height, nodeProps } = parentComponent.props;
    return (
      <g ref={this.saveRef}
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
