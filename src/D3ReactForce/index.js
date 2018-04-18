import React from 'react';
import * as d3 from 'd3';
import Simulation from './simulation';
import Node from './node';
import Link from './link';
import _ from 'lodash';

export default class D3ReactForce extends React.Component {
  static defaultProps = {
    width: 1200,
    height: 800,
    nodeIdKey: 'id',
    forceOption: {
      velocityDecay: 0.5,
      linkDistance: 100,
      collideRadius: 30,
      collideStrength: 0.1,
      chargeStrength: -10
    }
  }

  constructor(props) {
    super(props);
    const { nodes, links, forceOption, nodeIdKey, width, height } = props;
    this.nodesDom = {};
    this.linksDom = {};
    this.force = new Simulation({...forceOption}, this);
    this.force.setNodesLinks(nodes, links);
  }

  tick = () => {
    const { nodes, links, nodeIdKey, tick } = this.props;
    const { force } = this;
    this.force.simulation.on('tick', () => {
      nodes.forEach(node => {
        d3.select(this.nodesDom[node[nodeIdKey]]).attr('transform', () => `translate(${node.x},${node.y})`);
      })
      links.forEach(link => {
        d3.select(this.linksDom[`${link.source}_${link.target}`])
          .attr('x1', () => force.nodesMap[link.source].x)
          .attr('y1', () => force.nodesMap[link.source].y)
          .attr('x2', () => force.nodesMap[link.target].x)
          .attr('y2', () => force.nodesMap[link.target].y);
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

  render() {
    const { width, height, nodes, links, nodeIdKey } = this.props;
    const { translate, scale } = this.force;
    return <div>
      <svg ref={svg => this.svg = svg} width={width} height={height}>
        <g ref={outg => this.outg = outg} transform={`translate(${translate})scale(${scale})`}>
          <g ref={nodes => this.nodeWarp = nodes}>
            {
              links.map((link, i) => {
                return <Link key={i} parentComponment={this} addRef={c => {
                  this.linksDom[`${link.source}_${link.target}`] = c;
                }} link={link}/>
              })
            }
          </g>

          <g ref={links => this.linkWarp = links}>
            {
              nodes.map((node, i) => {
                return <Node key={i} parentComponment={this} addRef={c => {
                  this.nodesDom[node[nodeIdKey]] = c
                }} node={node}/>
              })
            }
          </g>
        </g>
      </svg>
    </div>
  }
}
