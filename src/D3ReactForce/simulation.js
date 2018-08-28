import { forceCenter, forceLink, forceCollide, forceX, forceY, forceManyBody, forceSimulation } from 'd3-force';
import * as d3Zoom from 'd3-zoom';
import * as d3Drag from 'd3-drag';
import { event as d3_event } from 'd3-selection';
import { WIDTH, HEIGHT, NODE_ID_KEY, noop } from './default';

export default class Simulation {
  sourceKey = 'source';
  targetKey = 'target';
  width = WIDTH;
  height = HEIGHT;
  nodeIdKey = NODE_ID_KEY;
  nodes = [];
  links = [];
  nodesMap = {};
  translate = [0, 0];
  scale = 1;

  constructor(options, simulation) {
    const _simulation = simulation || forceSimulation();
    this.simulation = _simulation;
    this.setSimulationLayout(options);
  }

  setSimulationLayout({velocityDecay, nodeIdKey, linkDistance, collideRadius, collideStrength, chargeStrength, alphaDecay, alphaMin, XYCenter, width, height, sourceKey, targetKey}) {
    this.width = width;
    this.height = height;
    this.nodeIdKey = nodeIdKey;
    if (sourceKey) {
      this.sourceKey = sourceKey;
    }
    if (targetKey) {
      this.targetKey = targetKey;
    }
    if (velocityDecay) {
      this.simulation.velocityDecay(velocityDecay)
    }
    if (alphaMin) {
      this.simulation.alphaMin(alphaMin);
    }
    if (alphaDecay) {
      this.simulation.alphaDecay(alphaDecay);
    }
    const _forceLink = forceLink();
    if (nodeIdKey) {
      _forceLink.id(d => d[nodeIdKey]);
    }
    if (linkDistance) {
      _forceLink.distance(linkDistance);
    }
    this.simulation.force('link', _forceLink);
    // this.simulation.force('center', forceCenter());

    if (collideRadius || collideStrength) {
      const _forceCollide = forceCollide();
      if (collideRadius) {
        _forceCollide.radius(typeof collideRadius === 'function' ? (d) => {
          return collideRadius(d);
        } : collideRadius);
      }
      if (collideStrength) {
        _forceCollide.strength(collideStrength);
      }
      this.simulation.force('collide', _forceCollide);
    } else {
      this.simulation.force('collide', null);
    }

    if (chargeStrength) {
      this.simulation.force("charge", forceManyBody().strength(chargeStrength));
    }
    if (XYCenter) {
      this.simulation.force('x', forceX(XYCenter && XYCenter.x || undefined))
      this.simulation.force('y', forceY(XYCenter && XYCenter.y || undefined))
    } else {
      this.simulation.force('x', null);
      this.simulation.force('y', null);
    }
  }

  tick = (event) => {
    this.simulation.on('tick', () => {
      event.tick && event.tick(this.simulation.alpha())
    })
    .on('end', () => {
      event.end && event.end(this.simulation.alpha());
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
    const { nodeIdKey, sourceKey, targetKey } = this;
    const newLinks = [];
    links.forEach(link => {
      let source = link[sourceKey], target = link[targetKey];
      if (typeof source === 'object') {
        source = source[nodeIdKey];
      }
      if (typeof target === 'object') {
        target = target[nodeIdKey];
      }
      const sourcePush = this.nodesMap[source];
      const targetPush = this.nodesMap[target];
      if (sourcePush && targetPush) {
        link.source = sourcePush;
        link.target = targetPush;
        newLinks.push(link);
      }
    })
    this.links = newLinks;
  }


  setNodesLinks(nodes, links, alpha) {
    this.initNodes(nodes);
    this.initLinks(links);
    this.simulation.nodes(this.nodes).force('link').links(this.links);
    if (alpha) {
      this.start(alpha);
    }
  }

  start(alpha) {
    const _alpha = this.simulation.alpha() + alpha;
    this.simulation.alpha(_alpha > 1 ? 1 : alpha).restart();
  }

  initDrag(event = {}) {
    const drag = d3Drag.drag()
      .on('start', (d) => {
        if (event.isDrag && event.isDrag(d) || !event.isDrag) {
          if (!d3_event.active) {
            this.simulation.alphaTarget(0.5).restart();
          }
          event.start && event.start(d);
        }
      })
      .on('drag', d => {
        if (event.isDrag && event.isDrag(d) || !event.isDrag) {
          d.fx = d.x = d3_event.x;
          d.fy = d.y = d3_event.y;
          event.drag && event.drag(d);
        }
      })
      .on('end', d => {
        if (event.isDrag && event.isDrag(d) || !event.isDrag) {
          if (!d3_event.active) {
            this.simulation.alphaTarget(0);
          }
          d.fx = null;
          d.fy = null;
          event.end && event.end(d);
        }
      });
    this.drag = drag;
  }

  setTransform(transform, scale) {
    this.translate = transform;
    this.scale = scale;
  }

  initZoom(event, scaleExtent) {
    const isZoom = event.isZoom || noop;
    const zoom = d3Zoom.zoom()
      .on('start', (d) => {
        event.start && event.start(d);
      })
      .on('zoom', () => {
        if (isZoom(d3_event) !== false) {
          const transform = d3_event.transform;
          const translate = [transform.x, transform.y], scale = transform.k;
          this.setTransform(translate, scale);
          event.zoom && event.zoom({translate, scale});
        }
      })
      .on('end', (d) => {
        event.end && event.end(d);
      })
      if (scaleExtent) {
        zoom.scaleExtent(scaleExtent)
      }
      this.zoom = zoom
  }


  execute = () => {
    const { simulation, nodes } =  this;
    simulation.stop();
    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
      simulation.tick();
    }
  }

}
