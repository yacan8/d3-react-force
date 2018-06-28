class Base {
  /**
   * Simulation ../simulation.js
   * @type {Simulation}
   */
  simulation = null;

  /**
   * 宽度
   * @type  {number}
   */
  width = null;
  /**
   * 高度
   * @type  {number}
   */
  height = null;

  constructor(options, simulation) {
    this.simulation = simulation;
    if (options.width) {
      this.width = options.width;
    }
    if (options.height) {
      this.height = options.height;
    }
  }
}
export default Base;