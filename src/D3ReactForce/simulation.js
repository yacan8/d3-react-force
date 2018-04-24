import * as d3 from 'd3';
import { WIDTH, HEIGHT, NODE_ID_KEY, noop } from './default';

export default class Simulation {
  width = WIDTH;
  height = HEIGHT;
  nodeIdKey = NODE_ID_KEY;
  nodes = [];
  links = [];
  nodesMap = {};
  translate = [0, 0];
  scale = 1;

  constructor(options) {
    const simulation = d3.forceSimulation();
    this.simulation = simulation;
    this.setSimulationLayout(options);
  }

  setSimulationLayout({velocityDecay, nodeIdKey, linkDistance, collideRadius, collideStrength, chargeStrength, XYCenter, width, height}) {
    this.width = width;
    this.height = height;
    this.nodeIdKey = nodeIdKey;
    if (velocityDecay) {
      this.simulation.velocityDecay(velocityDecay)
    }

    const forceLink = d3.forceLink();
    if (nodeIdKey) {
      forceLink.id(d => d[nodeIdKey]);
    }
    if (linkDistance) {
      forceLink.distance(linkDistance);
    }
    this.simulation.force('link', forceLink);

    if (collideRadius || colideStrength) {
      const forceCollide = d3.forceCollide();
      if (collideRadius) {
        forceCollide.radius(typeof collideRadius === 'function' ? (d) => {
          return collideRadius(d);
        } : collideRadius);
      }
      if (collideStrength) {
        forceCollide.strength(collideStrength);
      }
      this.simulation.force('collide', forceCollide);
    } else {
      this.simulation.force('collide', null);
    }

    if (chargeStrength) {
      this.simulation.force("charge", d3.forceManyBody().strength(chargeStrength));
    }
    console.log(XYCenter);
    if (XYCenter) {
      this.simulation.force('x', d3.forceX(XYCenter && XYCenter.x || undefined))
      this.simulation.force('y', d3.forceY(XYCenter && XYCenter.y || undefined))
    }
  }

  tick = (event) => {
    this.simulation.on('tick', () => {
      event.tick && event.tick(this.simulation.alpha())
    })
    .on('end', () => {
      event.end && event.end(this.simulation.alpha())
    })
  }

  initNodes(nodes) {
    const { nodeIdKey, width, height } = this;
    const nodesMap = {};
    const newNodes = [];
    nodes.forEach(node => {
      node.x = node.x || width / 2;
      node.y = node.y || height / 2;
      if (!this.nodesMap[node[nodeIdKey]]) {
        nodesMap[node[nodeIdKey]] = node;
        newNodes.push(node);
      } else {
        nodesMap[node[nodeIdKey]] = this.nodesMap[node[nodeIdKey]];
        newNodes.push(this.nodesMap[node[nodeIdKey]]);
      }
    })
    this.nodesMap = nodesMap;
    this.nodes = newNodes;
  }

  initLinks(links) {
    const { nodeIdKey } = this;
    const newLinks = []
    links.forEach(link => {
      let sourceKey = link.source, targetKey = link.target;
      if (typeof link.source === 'object') {
        sourceKey = link.source[nodeIdKey];
      }
      if (typeof link.target === 'object') {
        targetKey = link.target[nodeIdKey];
      }
      newLinks.push({
        source: this.nodesMap[sourceKey],
        target: this.nodesMap[targetKey]
      })
    })
    this.links = newLinks;
  }


  setNodesLinks(nodes, links, alpha = 0.5) {
    this.initNodes(nodes);
    this.initLinks(links);
    this.simulation.nodes(this.nodes).force('link').links(this.links);
    const _alpha = this.simulation.alpha() + alpha;
    this.simulation.alpha(alpha > 1 ? 1 : alpha).restart();
  }

  initDrag() {
    const drag = d3.drag()
      .on('start', (d) => {
        if (!d3.event.active) {
          this.simulation.alphaTarget(0.5).restart();
        }
        console.log('drag');
      })
      .on('drag', d => {
        d.fx = d.x = d3.event.x;
        d.fy = d.y = d3.event.y;
      })
      .on('end', d => {
        if (!d3.event.active) {
          this.simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });
    this.drag = drag;
  }

  setTransform(transform, scale) {
    this.translate = transform;
    this.scale = scale;
  }

  initZoom(event, scaleExtent) {
    const zoom = d3.zoom()
      .on('start', (d) => {
        event.start && event.start(d);
      })
      .on('zoom', () => {
        const transform = d3.event.transform;
        const translate = [transform.x, transform.y], scale = transform.k;
        this.setTransform(translate, scale);
        event.zoom && event.zoom({translate, scale});
      })
      .on('end', (d) => {
        event.end && event.end(d);
      })
      if (scaleExtent) {
        zoom.scaleExtent(scaleExtent)
      }
      this.zoom = zoom
  }

}
