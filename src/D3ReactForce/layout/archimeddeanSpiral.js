
/**
 * @fileOverview 阿基米德螺线布局
 * https://zh.wikipedia.org/wiki/%E9%98%BF%E5%9F%BA%E7%B1%B3%E5%BE%B7%E8%9E%BA%E7%BA%BF
 * @author can.yang@tongdun.cn
 */
import Base from './base';

class ArchimeddeanSpiral extends Base {
  constructor(options, simulation) {
    super(options, simulation);
    Object.assign(this, {
      /**
       * 宽
       * @type  {number}
       */
      width: null,

      /**
       * 高
       * @type  {number}
       */
      height: null,

      /**
       * 图中心
       * @type  {object}
       */
      center: null,

      /**
       * 参数 a
       * @type  {number}
       */
      a: 20,

      /**
       * 参数 b
       * @type  {number}
       */
      b: 15,

      /**
       * 最大角度
       * @type  {number}
       */
      maxAngle: 12 * Math.PI
    }, options);
  }
  // 执行布局
  execute({
    beforeExecute = () => {},
  }) {
    const { nodes } = this.simulation;
    const { a, b, maxAngle } = this;
    const width = this.width;
    const height = this.height;
    const center = this.center ? this.center : {
      x: width / 2,
      y: height / 2
    };
    const l = nodes.length;
    const angleStep = maxAngle / l;
    const getAngle = i => {
      return i * angleStep;
    };
    const getRadius = angle => {
      return a + b * angle;
    };
    this.sort && nodes.sort(this.sort);
    this.simulation.nodes = nodes;
    beforeExecute && beforeExecute(nodes);
    nodes.forEach((node, i) => {
      const angle = getAngle(i);
      const radius = getRadius(angle);
      node.fx = node.x = center.x + radius * Math.cos(angle);
      node.fy = node.y = center.y + radius * Math.sin(angle);
    });
  }
}
export default ArchimeddeanSpiral;