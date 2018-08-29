/**
 * 圆形布局
 * @author can.yang
 */
import Base from './base';
import is from './is';
class Circle extends Base {
  /**
   * 是否避免重叠
   * @type  {boolean}
   */
  clockwise = true;
  /**
   * 起始角度
   * @type  {boolean}
   */
  startAngle = 3 / 2 * Math.PI;

  constructor(options, simulation) {
    super(options, simulation);
    if (!is.nil(options.clockwise)) {
      this.clockwise = options.clockwise;
    }
    if (!is.nil(options.startAngle)) {
      this.startAngle = options.startAngle;
    }
    if (!is.nil(options.sort)) {
      this.sort = options.sort;
    }
    if (!is.nil(options.center)) {
      this.center = options.center;
    }
  }

  execute({beforeExecute = () => {}}) {
    const { nodes, links } = this.simulation;
    let radius;
    if (nodes.length <= 1) {
      radius = 0;
    } else {
      radius = Math.min(this.width, this.height) / 2;
    }
    const center = this.center ? this.center : {
      x: this.width / 2,
      y: this.height / 2
    };
    const angleStep = 2 * Math.PI / nodes.length;
    this.sort && nodes.sort(this.sort);
    beforeExecute && beforeExecute(nodes);
    nodes.forEach((node, i) => {
      const theta = this.startAngle + i * angleStep * (this.clockwise ? 1 : -1);
      const rx = radius * Math.cos(theta);
      const ry = radius * Math.sin(theta);
      node.fx = node.x = center.x + rx;
      node.fy = node.y = center.y + ry;
    })
  }

}

export default Circle;