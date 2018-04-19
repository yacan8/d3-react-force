import React from 'react';
import D3ReactForce from './D3ReactForce';
import data from './data.json';
const { nodes, links } = data;
let index = 1;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    window.app = this;
    this.state = {
      nodes: nodes,
      links: links,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
    this.velocityDecay = 0.1,
    this.linkDistance = 50,
    this.collideRadius = 20,
    this.collideStrength = 0.5,
    this.chargeStrength = -150
  }

  componentDidMount() {
    window.onresiz = () => {
      this.setState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      })
    }
  }

  onClick = e => {
    const { nodes } = this.state;
    nodes.push({
      nodeId: `index${index++}`
    })
    this.setState({
      nodes: nodes.slice(0)
    })
  }

  render() {
    const { nodes, links, width, height } = this.state;
    const {
      velocityDecay,
      linkDistance,
      collideRadius,
      collideStrength,
      chargeStrength
    } = this;
    return (<div>
      <div>
        <button onClick={this.onClick}>
          添加一个节点
        </button>
        <button onClick={() => { this.D3ReactForce.force.adaption() }}>
          居中
        </button>
        <br />
        摩擦系数：<input defaultValue={velocityDecay} onChange={e => this.velocityDecay = e.target.value}/><br />
        连线长度：<input defaultValue={linkDistance} onChange={e => this.linkDistance = e.target.value}/><br />
        碰撞半径：<input defaultValue={collideRadius} onChange={e => this.collideRadius = e.target.value}/><br />
        碰撞强度：<input defaultValue={collideStrength} onChange={e => this.collideStrength = e.target.value}/><br />
        作用力：<input defaultValue={chargeStrength} onChange={e => this.chargeStrength = e.target.value}/><br />
        <button onClick={() => {this.forceUpdate()}}>确定</button>
      </div>
    	<div style={{margin: 20, border: '1px solid #aaa', overflow: 'hidden'}}>
      	<D3ReactForce
          ref={c => this.D3ReactForce = c}
          nodes={nodes} links={links}
          nodeIdKey="nodeId"
          width={width}
          height={height}
          velocityDecay={velocityDecay}
          linkDistance={linkDistance}
          collideRadius={collideRadius}
          collideStrength={collideStrength}
          chargeStrength={chargeStrength}
        />
    	</div>
    </div>);
  }
}
