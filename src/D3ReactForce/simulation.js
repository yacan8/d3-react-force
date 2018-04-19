import * as d3 from 'd3';

export default class Simulation {
  nodes = [];
  links = [];
  nodesMap = {};
  translate = [0, 0];
  scale = 1;

  constructor(options, component) {
    this.component = component;
    const simulation = d3.forceSimulation();
    this.simulation = simulation;
    this.setSimulationLayout(options);
    this.initDrag();
    this.initZoom();
  }

  setSimulationLayout({velocityDecay, nodeIdKey, linkDistance, collideRadius, collideStrength, chargeStrength, forceX, forceY}) {
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
    }

    if (chargeStrength) {
      this.simulation.force("charge", d3.forceManyBody().strength(chargeStrength));
    }
    this.simulation.force('x', d3.forceX())
    this.simulation.force('y', d3.forceY())
    // if (forceX) {
    //   simulation.force('x', d3.forceX())
    // }
    // if (forceY) {
    //   simulation.force('y', d3.forceY())
    // }
  }

  initNodes(nodes) {
    const { nodeIdKey, width, height } = this.component.props;
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

  iniLinks(links) {
    const { nodeIdKey } = this.component.props;
    const newLinks = []
    links.forEach(link => {
      newLinks.push({
        source: this.nodesMap[link.source],
        target: this.nodesMap[link.target]
      })
    })
    this.links = newLinks;
  }


  setNodesLinks(nodes, links, alpha = 0.5) {
    this.initNodes(nodes);
    this.iniLinks(links);
    this.simulation.nodes(this.nodes).force('link').links(this.links);
    const _alpha = this.simulation.alpha() + alpha;
    this.simulation.alpha(alpha > 1 ? 1 : alpha).restart();
  }

  initDrag() {
    const drag = d3.drag()
      .on('start', (d) => {
        if (!d3.event.active) {
          this.simulation.alphaTarget(0.3).restart();
        }
      })
      .on('drag', d => {
        d.fx = d.x = d3.event.x;
        d.fy = d.y = d3.event.y;
        // d3.select(this.component.nodes[node[this.component.props.nodeIdKey]]).attr('transform', () => `translate(${node.x},${node.y})`);
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

  initZoom() {
    const zoom = d3.zoom()
      // .scaleExtent([0.2, 4])
      .on('start', () => {

      })
      .on('zoom', () => {
        const transform = d3.event.transform;
        this.setTransform([transform.x, transform.y], transform.k);
        d3.select(this.component.outg).attr('transform', `translate(${this.translate})scale(${this.scale})`)
      })
      .on('end', () => {
        // if (eventGraph.scale > 0.4) {
        //   eventGraph.isTextHide = false;
        // } else {
        //   eventGraph.isTextHide = true;
        // }
        // if (d3.event.shiftKey || d3.event.sourceEvent && d3.event.sourceEvent.shiftKey || shiftKey) {
          // const svg = d3.select(this.component.svg);
          // zoom.transform(svg, d3.zoomIdentity.translate(this.translate[0], this.translate[1]).scale(this.scale));
        // }
      })
      this.zoom = zoom
  }

  adaption() {
    const offset = this.component.outg.getBBox();
    const { width, height } = this.component.props;
    let factor = 1, translateX = 0, translateY = 0;
    if (offset.width > width || offset.height > height) {
      if (offset.width / width > offset.height / height) {
        factor = (width - 20) / offset.width;
      } else {
        factor = (height - 20) / offset.height;
      }
    }
    let minX = offset.x * this.scale + this.translate[0]
    let minY = offset.y * this.scale + this.translate[1]
    const outgWidth = offset.width * this.scale;
    const outgHeight = offset.height * this.scale;
    const outgCenter = [minX + outgWidth / 2, minY + outgHeight / 2];
    const _translate = [width / 2 - outgCenter[0], height / 2 - outgCenter[1]];
    translateX = this.translate[0] + _translate[0];
    translateY = this.translate[1] + _translate[1];
    const svg = d3.select(this.component.svg);
    this.zoom.transform(svg, d3.zoomIdentity.translate(translateX, translateY).scale(factor));
    this.translate = [translateX, translateY];
    this.scale = factor;
    d3.select(this.component.outg).attr('transform', `translate(${this.translate})scale(${this.scale})`)
  }




}
