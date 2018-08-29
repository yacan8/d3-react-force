/**
 * 分层布局
 * https://github.com/dagrejs/dagre/wiki
 * @author can.yang
 */
import Base from './base';
import dagre from 'dagre';
import is from './is';

class Dagre extends Base {
  constructor(options, simulation) {
    super(options, simulation);
    Object.assign(this, {
      rankdir: 'TB',
      align: undefined,
      nodesep: 50,
      edgesep: 10,
      ranksep: 50,
      marginx: 0,
      marginy: 0,
      acyclicer: undefined,
      useEdgeControlPoint: true,
      ranker: 'network-simplex',
      callback: null,
      nodeWidth: 20,
      nodeHeight: 20
    }, options);
  }
  getValue(name) {
    const value = this[name];
    if (is.Function(value)) {
      return value();
    }
    return value;
  }
  // 执行布局
  execute() {
    const { nodes, links, nodeIdKey, sourceKey, targetKey, nodesMap } = this.simulation;
    const nodeMap = {};
    const g = new dagre.graphlib.Graph();
    const useEdgeControlPoint = this.useEdgeControlPoint;
    g.setGraph({
      rankdir: this.getValue('rankdir'),
      align: this.getValue('align'),
      nodesep: this.getValue('nodesep'),
      edgesep: this.getValue('edgesep'),
      ranksep: this.getValue('ranksep'),
      marginx: this.getValue('marginx'),
      marginy: this.getValue('marginy'),
      acyclicer: this.getValue('acyclicer'),
      ranker: this.getValue('ranker')
    });
    g.setDefaultEdgeLabel(function() { return {}; });
    nodes.forEach(node => {
      g.setNode(node[nodeIdKey], { width: this.nodeWidth, height: this.nodeHeight });
      nodeMap[node[nodeIdKey]] = node;
    });
    links.forEach(link => {
      let source = link.source[nodeIdKey], target = link.target[nodeIdKey];
      g.setEdge(source, target);
    });
    dagre.layout(g);
    g.nodes().forEach(v => {
      const node = g.node(v);
      nodeMap[v].fx = nodeMap[v].x = node.x;
      nodeMap[v].fy = nodeMap[v].y = node.y;
    });
    g.edges().forEach((e, i) => {
      const edge = g.edge(e);
      if (useEdgeControlPoint) {
        links[i].controlPoints = edge.points.slice(1, edge.points.length - 1);
      }
    });
  }
}

export default Dagre;