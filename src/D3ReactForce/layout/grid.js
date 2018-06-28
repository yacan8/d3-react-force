/**
 * @fileOverview 栅格布局
 * @author can.yang@tongdun.cn
 */
import Base from './base';

class Grid extends Base {
  constructor(options, simulation) {
    super(options, simulation);
    Object.assign(this, {
      row: 10,
      col: 10,
      width: null,
      height: null
    }, options);
  }
  // 执行布局
  execute() {
    const { nodes } = this.simulation;
    const width = this.width;
    const height = this.height
    const center = this.center ? this.center : {
      x: width / 2,
      y: height / 2
    };
    const row = this.row;
    const col = this.col;
    this.sort && nodes.sort(this.sort);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.fx = node.x = (center.x - width / 2) + i % row / row * width;
      node.fy = node.y = (center.y - height / 2) + parseInt(i / col) / col * height;
    }
  }
}

export default Grid;