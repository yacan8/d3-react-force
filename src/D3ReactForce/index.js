import React from 'react';
import * as d3 from 'd3';
import Simulation from './simulation';
import Node from './node';
import Link from './link';
import {
  WIDTH,
  HEIGHT,
  NODE_ID_KEY,
  VELOCITY_DECAY,
  LINK_DISTANCE,
  COLLIDE_RADIUS,
  COLLIDE_STRENGTH,
  CHARGE_STRENGTH,
  XY_CENTER,
  noop
} from './default';

class D3ReactForce extends React.Component {
  static defaultProps = {
    nodes: [],
    links: [],
    width: WIDTH,
    height: HEIGHT,
    nodeIdKey: NODE_ID_KEY,
    velocityDecay: VELOCITY_DECAY,
    linkDistance: LINK_DISTANCE,
    collideRadius: COLLIDE_RADIUS,
    collideStrength: COLLIDE_STRENGTH,
    chargeStrength: CHARGE_STRENGTH,
    staticLayout: false,
    XYCenter: XY_CENTER,
    tick: noop,
    end: noop
  }

  constructor(props) {
    super(props);
    const { nodes, links, staticLayout } = props;
    this.nodesDom = {};
    this.linksDom = {};
    this.force = new Simulation(props);
    this.force.setNodesLinks(nodes, links);
  }

  tick = (alpha) => {
    const { nodeIdKey, tick, staticLayout, end } = this.props;
    const { force } = this;
    const { nodes, links } = this.force;
    if (tick) {
      tick(alpha)
    }
    if (!staticLayout) {
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
    }
  }

  componentWillMount() {
    this.force.initDrag();
  }

  componentDidMount() {
    if (!this.props.staticLayout) {
      this.force.initZoom({
        zoom: (transform) => {
          d3.select(this.outg).attr('transform', `translate(${transform.translate})scale(${transform.scale})`)
        }
      });
      d3.select(this.svg).call(this.force.zoom)
    }
    this.force.tick({
      tick: this.tick,
      end: this.props.end
    });
  }

  componentWillReceiveProps(nextProps) {
    const { nodes, links } = nextProps;
    this.force.setSimulationLayout(nextProps);
    this.force.setNodesLinks(nodes, links);
  }
  // 居中
  adaption() {
    const offset = this.outg.getBBox();
    const { width, height } = this.props;
    const { translate, scale } = this.force;
    let factor = 1, translateX = 0, translateY = 0;
    if (offset.width > width || offset.height > height) {
      if (offset.width / width > offset.height / height) {
        factor = (width - 20) / offset.width;
      } else {
        factor = (height - 20) / offset.height;
      }
    }
    let minX = offset.x * scale + translate[0]
    let minY = offset.y * scale + translate[1]
    const outgWidth = offset.width * scale;
    const outgHeight = offset.height * scale;
    const outgCenter = [minX + outgWidth / 2, minY + outgHeight / 2];
    const _translate = [width / 2 - outgCenter[0], height / 2 - outgCenter[1]];
    translateX = translate[0] + _translate[0];
    translateY = translate[1] + _translate[1];
    const svg = d3.select(this.svg);
    if (translateX && translateY && factor) {
      this.force.zoom.transform(svg, d3.zoomIdentity.translate(translateX, translateY).scale(factor));
      this.force.setTransform([translateX, translateY], factor)
      d3.select(this.outg).attr('transform', `translate(${this.force.translate})scale(${this.force.scale})`)
    }
  }

  getStaticLayoutTransform = () => {
    const { nodes, width } = this.props;
    const nodesX = nodes.map(node => node.x);
    const nodesY = nodes.map(node => node.y);
    const minX = Math.min(...nodesX), minY = Math.min(...nodesY), maxX = Math.max(...nodesX), maxY = Math.max(...nodesY);
    const graphWidth = maxX - minX, graphHeight = maxY - minY;
    const scale = width > graphWidth ? 1 : width / graphWidth;
    const translateX = scale * minX, translateY = scale * minY;
    return {
      width: graphWidth * scale,
      height: graphHeight * scale,
      translate: [-translateX, -translateY],
      scale: scale,
      graphWidth,
      graphHeight
    }
  }

  render() {
    let { width, height, nodeIdKey, staticLayout } = this.props;
    let { translate, scale, nodes, links } = this.force;
    let staticLayoutTransform = {};
    if (staticLayout) {
      const getStaticLayoutTransform = this.getStaticLayoutTransform();
      // width = getStaticLayoutTransform.width;
      height = getStaticLayoutTransform.height;
      translate = getStaticLayoutTransform.translate;
      scale = getStaticLayoutTransform.scale;
    }
    return <div>
      <svg ref={svg => this.svg = svg} width={width} height={height} style={{padding: 50}}>
        <g ref={outg => this.outg = outg} transform={`translate(${translate})scale(${scale})`}>
          <g>
            {
              links.map((link, i) => {
                const _key_ = `${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`
                return <Link key={_key_} parentComponment={this} addRef={c => {
                  this.linksDom[_key_] = c;
                }} link={link}/>
              })
            }
          </g>
          <g>
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
        {this.props.children}
      </svg>
    </div>
  }
}

D3ReactForce.Simulation = Simulation;
D3ReactForce.Node = Node;
D3ReactForce.Link = Link;
export default D3ReactForce;
