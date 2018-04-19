import React from 'react';
import * as d3 from 'd3';
import Simulation from './simulation';
import Node from './node';
import Link from './link';
import _ from 'lodash';

export default class D3ReactForce extends React.Component {
  static defaultProps = {
    nodes: [],
    links: [],
    width: 1500,
    height: 800,
    nodeIdKey: 'id',
    velocityDecay: 0.1,
    linkDistance: 50,
    collideRadius: 20,
    collideStrength: 0.5,
    chargeStrength: -150
  }

  constructor(props) {
    super(props);
    const { nodes, links, nodeIdKey, width, height, ...forceOption } = props;
    this.nodesDom = {};
    this.linksDom = {};
    this.force = new Simulation({...forceOption}, this);
    this.force.setNodesLinks(nodes, links);
  }

  tick = () => {
    const { nodeIdKey, tick } = this.props;
    const { force } = this;
    force.simulation.on('tick', () => {
      const { nodes, links } = this.force;
      nodes.forEach(node => {
        d3.select(this.nodesDom[node[nodeIdKey]]).attr('transform', () => `translate(${node.x},${node.y})`);
      })
      links.forEach(link => {
        d3.select(this.linksDom[`${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`])
          .attr('x1', () => force.nodesMap[link.source[nodeIdKey]].x)
          .attr('y1', () => force.nodesMap[link.source[nodeIdKey]].y)
          .attr('x2', () => force.nodesMap[link.target[nodeIdKey]].x)
          .attr('y2', () => force.nodesMap[link.target[nodeIdKey]].y);
      })
      if (tick) {
        tick(this.force.alpha())
      }
    })
  }

  componentDidMount() {
    this.tick();
    d3.select(this.svg).call(this.force.zoom)
  }

  componentWillReceiveProps(nextProps) {
    const { nodes, links, nodeIdKey, width, height, ...forceOption } = nextProps;
    this.force.setSimulationLayout(forceOption);
    this.force.setNodesLinks(nodes, links);
  }

  render() {
    const { width, height, nodeIdKey } = this.props;
    const { translate, scale, nodes, links } = this.force;
    return <div>
      <svg ref={svg => this.svg = svg} width={width} height={height}>
        <g ref={outg => this.outg = outg} transform={`translate(${translate})scale(${scale})`}>
          <g ref={l => this.linkWarp = l}>
            {
              links.map((link, i) => {
                const _key_ = `${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`
                return <Link key={_key_} parentComponment={this} addRef={c => {
                  this.linksDom[_key_] = c;
                }} link={link}/>
              })
            }
          </g>
          <g ref={nodes => this.nodeWarp = nodes}>
            {
              nodes.map((node, i) => {
                const _key_ = node[nodeIdKey];
                return <Node key={_key_} parentComponment={this} addRef={c => {
                  this.nodesDom[_key_] = c
                }} node={node}/>
              })
            }
          </g>
        </g>
      </svg>
    </div>
  }
}
