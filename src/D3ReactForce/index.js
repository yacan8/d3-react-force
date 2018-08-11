import React from 'react';
import * as d3 from 'd3';
import Simulation from './simulation';
import Node from './node';
import Link from './link';
import Layout from './layout';
import _ from 'lodash';
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

const duration = 500;

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
    nodeClick: noop,
    nodeDbClick: noop,
    nodeMouseover: noop,
    nodeMouseout: noop,
    linkClick: noop,
    linkMouseover: noop,
    linkMouseout: noop,
    tick: noop,
    end: noop
  }

  constructor(props) {
    super(props);
    const { nodes, links, staticLayout } = props;
    this.nodesDom = {};
    this.linksDom = {};
    this.hoverLinksDom = {};
    this.force = new Simulation(props);
    this.force.setNodesLinks(nodes, links);
    this.state = {
      init: false
    }
  }

  tick = (alpha) => {
    const { nodeIdKey, tick, staticLayout, end } = this.props;
    const { force } = this;
    const { nodes, links } = this.force;
    if (tick) {
      tick(alpha, {
        nodes,
        links,
        nodesDom: this.nodesDom,
        linksDom: this.linksDom
      })
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

        d3.select(this.hoverLinksDom[`${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`])
          .attr('x1', () => force.nodesMap[link.source[nodeIdKey]].x)
          .attr('y1', () => force.nodesMap[link.source[nodeIdKey]].y)
          .attr('x2', () => force.nodesMap[link.target[nodeIdKey]].x)
          .attr('y2', () => force.nodesMap[link.target[nodeIdKey]].y);
      })
    }
  }

  zoomTo = (transform) => {
    this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(transform.translate[0], transform.translate[1]).scale(transform.scale));
  }

  componentDidMount() {
    if (!this.props.staticLayout) {
      const { dragEvent = {}, zoomEvent = {}, scaleExtent } = this.props;
      this.force.initZoom({
        start: zoomEvent.start,
        isZoom: zoomEvent.isZoom,
        zoom: (transform) => {
          d3.select(this.outg).attr('transform', `translate(${transform.translate})scale(${transform.scale})`)
          zoomEvent.zoom && zoomEvent.zoom(transform);
        },
        end: zoomEvent.end
      }, scaleExtent);
      d3.select(this.svg).call(this.force.zoom).on('dblclick.zoom', null);
      this.force.initDrag(dragEvent);
    }
    this.force.tick({
      tick: this.tick,
      end: this.props.end
    });
    this.setState({ init: true });  // 解决初始化有nodes时 node先渲染，取不到this.drap问题
  }

  free = () => {
    this.force.nodes.forEach(node => {
      node.fx = node.fy = null;
    })
    this.force.simulation.alpha(1).restart();
  }

  addLayout = (layout, _options = {}) => {
    const _Layout = Layout[layout];
    if (_Layout) {
      const { width, height } = this.props;
      const options = Object.assign({ width, height }, _options);
      this[`${layout}Layout`] = new _Layout(options, this.force);
      return {
        execute: this.executeLayout.bind(this, layout)
      }
    } else {
      throw new Error(`Can not find the layout of ${layout}`);
    }
  }

  executeLayout = (layout, event = {}) => {
    const _layout = this[`${layout}Layout`];
    if (_layout) {
      this.forceEndTick();
      setTimeout(() => { // 解决tick直接更新dom的x、y问题
        _layout.execute(event);
        this.transformPosition();
        this.adaption(true);
      }, 100)
    }
  }

  // 居中
  adaption = (animation = false) => {
    const padding = 20;
    const { width, height } = this.props;
    const { nodes } = this.force;
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    if (nodes.length) {
      minX = _.minBy(nodes, 'x').x
      minY = _.minBy(nodes, 'y').y
      maxX = _.maxBy(nodes, 'x').x
      maxY = _.maxBy(nodes, 'y').y
    }
    const offset = {
      width: maxX - minX,
      height: maxY - minY,
      x: minX,
      y: minY
    };
    let factor = 1, translateX = 0, translateY = 0;
    if (offset.width > width || offset.height > height) {
      if (offset.width / width > offset.height / height) {
        factor = (width - padding) / offset.width;
      } else {
        factor = (height - padding) / offset.height;
      }
    }
    translateX = width / 2 - minX * factor - offset.width / 2 * factor;
    translateY = height / 2 - minY * factor - offset.height / 2 * factor;
    if (animation) {
      d3.select(this.outg).transition().duration(duration).attr('transform', `translate(${[translateX, translateY]})scale(${factor})`)
      let timer = setTimeout(() => {
        this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(translateX, translateY).scale(factor));
      }, duration);
    } else {
      this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(translateX, translateY).scale(factor));
    }
  }

  transform = (translate, scale, animation) => {
    if (!translate && !scale) {
      return {
        translate: this.force.translate,
        scale: this.force.scale
      }
    } else {
      if (animation) {
        d3.select(this.outg).transition().duration(duration).attr('transform', `translate(${translate})scale(${scale})`)
        setTimeout(() => {
          this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(...translate).scale(scale));
        }, duration);
      } else {
        this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(...translate).scale(scale));
      }
    }
  }

  zoom = (_scale) => {
    const { translate, scale } = this.force;
    this.force.zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(...translate).scale(_scale * scale));
  }

  transformPosition = () => {
    const { force, props } = this;
    const { nodeIdKey } = props;
    const { nodes, links } = force;
    nodes.forEach(node => {
      d3.select(this.nodesDom[node[nodeIdKey]]).transition().duration(duration).attr('transform', () => `translate(${node.x},${node.y})`);
    })
    links.forEach(link => {
      d3.select(this.linksDom[`${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`])
        .transition().duration(duration)
        .attr('x1', () => force.nodesMap[link.source[nodeIdKey]].x)
        .attr('y1', () => force.nodesMap[link.source[nodeIdKey]].y)
        .attr('x2', () => force.nodesMap[link.target[nodeIdKey]].x)
        .attr('y2', () => force.nodesMap[link.target[nodeIdKey]].y);
    })
  }

  forceEndTick = () => {
    const alphaTarget = this.force.simulation.alphaTarget();
    this.force.simulation.alphaTarget(alphaTarget).alpha(alphaTarget);
  }

  componentWillReceiveProps(nextProps) {
    const { nodes, links } = nextProps;
    this.force.setSimulationLayout(nextProps);
    this.force.setNodesLinks(nodes, links);
  }

  getStaticLayoutTransform = () => {
    const { nodes, width, padding } = this.props;
    const nodesX = nodes.map(node => node.x);
    const nodesY = nodes.map(node => node.y);
    const minX = Math.min(...nodesX), minY = Math.min(...nodesY), maxX = Math.max(...nodesX), maxY = Math.max(...nodesY);
    const graphWidth = maxX - minX, graphHeight = maxY - minY;
    const scale = width > graphWidth ? 1 : width / graphWidth;
    const translateX = scale * minX, translateY = scale * minY;
    return {
      width: graphWidth * scale + 2 * padding,
      height: graphHeight * scale + 2 * padding,
      translate: [-translateX + padding, -translateY + padding],
      scale: scale,
      graphWidth,
      graphHeight
    }
  }

  render() {
    let { width, height, nodeIdKey, staticLayout, svgProps, outgProps } = this.props;
    let { translate, scale, nodes, links, drag } = this.force;
    let staticLayoutTransform = {};
    if (staticLayout) {
      const getStaticLayoutTransform = this.getStaticLayoutTransform();
      width = getStaticLayoutTransform.width;
      height = getStaticLayoutTransform.height;
      translate = getStaticLayoutTransform.translate;
      scale = getStaticLayoutTransform.scale;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ref={svg => this.svg = svg} width={width} height={height} {...svgProps}>
      <g ref={outg => this.outg = outg} transform={`translate(${translate})scale(${scale})`} {...outgProps}>
        {
          this.state.init || staticLayout ? [
            <g key="nodes">
              {
                links.map((link, i) => {
                  const _key_ = `${link.source[nodeIdKey]}_${link.target[nodeIdKey]}`
                  return <Link key={_key_} parentComponment={this} addRef={c => {
                    this.linksDom[_key_] = c;
                  }} addHoverRef={c => {
                    this.hoverLinksDom[_key_] = c;
                  }} link={link} />
                })
              }
            </g>,
            <g key="links">
              {
                nodes.map((node, i) => {
                  const _key_ = node[nodeIdKey];
                  return <Node key={_key_} parentComponment={this} addRef={c => {
                    this.nodesDom[_key_] = c
                  }} node={node} />
                })
              }
            </g>
          ] : null
        }
        {this.props.children}
      </g>
    </svg>
  }
}

D3ReactForce.Simulation = Simulation;
D3ReactForce.Node = Node;
D3ReactForce.Link = Link;
export default D3ReactForce;
