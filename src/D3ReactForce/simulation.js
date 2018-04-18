import * as d3 from 'd3';

export default class Simulation {
  nodes = [];
  links = [];
  nodesMap = {};
  translate = [0, 0];
  scale = 1;

  constructor({velocityDecay, nodeIdKey, linkDistance, collideRadius, collideStrength, chargeStrength, forceX, forceY}, component) {
    this.component = component;
    const simulation = d3.forceSimulation();
    if (velocityDecay) {
      simulation.velocityDecay(velocityDecay)
    }

    const forceLink = d3.forceLink();
    if (nodeIdKey) {
      forceLink.id(d => d[nodeIdKey]);
    }
    if (linkDistance) {
      forceLink.distance(linkDistance);
    }
    simulation.force('link', forceLink);

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
      simulation.force('collide', forceCollide);
    }

    if (chargeStrength) {
      simulation.force("charge", d3.forceManyBody().strength(chargeStrength));
    }

    if (forceX) {
      simulation.force('x', d3.forceX())
    }
    if (forceY) {
      simulation.force('y', d3.forceY())
    }
    this.simulation = simulation;
    this.initDrag();
    this.initZoom();
    // this.setNodesLinks(nodes, links);
  }

  initNodes(nodes) {
    const { nodeIdKey, width, height } = this.component.props;
    nodes.forEach(node => {
      if (!this.nodesMap[node[nodeIdKey]]) {
        node.x = node.x || width / 2;
        node.y = node.y || height / 2;
        this.nodesMap[node[nodeIdKey]] = node;
        this.nodes.push(node);
      }
    })
  }

  iniLinks(links) {
    const { nodeIdKey } = this.component.props;
    links.forEach(link => {
      if (!(_.find(this.links, _link => _link.target[nodeIdKey] == link.target && _link.source[nodeIdKey] === link.source || _link.target[nodeIdKey] == link.source && _link.source[nodeIdKey] === link.target))) {
        this.links.push({
          source: this.nodesMap[link.source],
          target: this.nodesMap[link.target]
        })
      }
    })
  }


  setNodesLinks(nodes, links, alpha = 0.2) {
    this.initNodes(nodes);
    this.iniLinks(links);
    this.simulation.nodes(this.nodes).force('link').links(this.links);
    const _alpha = this.simulation.alpha();
    this.simulation.alpha(_alpha + alpha).restart();
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
        console.log(transform.k);
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


}
