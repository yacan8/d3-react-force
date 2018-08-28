import React from 'react';
import D3ReactForce from './D3ReactForce';
import data from './mock/data.json';
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
      height: document.documentElement.clientHeight,
      svg: '',
      img: ''
    }
    this.center = true;
    this.velocityDecay = 0.2;
    this.linkDistance = 70;
    this.collideRadius = 10;
    this.collideStrength = 0.05;
    this.chargeStrength = -1500;
    this.count = 400;
    this.alphaDecay = 0.005;
  }

  addNode = () => {
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
      chargeStrength,
      center,
      count,
      alphaDecay,
      alphaMin
    } = this;
    return (<div>
      <div style={{
        position: 'fixed',
        width: '300px',
        padding: '30px',
        border: '1px solid yellow',
        background: '#fff',
        right: 0,
        top: 0
      }}>
        <button onClick={() => this.addNode()}>
          添加一个节点
        </button>
        <button onClick={() => { this.D3ReactForce.adaption() }}>
          居中
        </button>
        <button onClick={() => {
          this.D3ReactForce.addLayout('circle', {
            sort: function sort(a, b) {
              return b.degree - a.degree;
            }
          }).execute({
            beforeExecute: () => {
              this.D3ReactForce.forceUpdate();
            }
          })
        }}>
          圆形
        </button>
        <button onClick={() => {
          this.D3ReactForce.addLayout('archimeddeanSpiral', {
            sort: function sort(a, b) {
              return b.degree - a.degree;
            }
          }).execute({
            beforeExecute: () => {
              this.D3ReactForce.forceUpdate();
            }
          })
        }}>
          阿基米德螺旋
        </button>
        
        <button onClick={() => {
          this.D3ReactForce.addLayout('dagre').execute();
        }}>
          分层布局
        </button>

        <button onClick={() => {
          this.D3ReactForce.addLayout('grid', {
            sort: function sort(a, b) {
              return b.degree - a.degree;
            }
          }).execute();
        }}>
          栅格布局
        </button>
        
        <button onClick={() => {
          this.D3ReactForce.free()
        }}>
          释放
        </button>
        <br />
        摩擦系数：<input defaultValue={velocityDecay} onChange={e => this.velocityDecay = e.target.value}/><br />
        连线长度：<input defaultValue={linkDistance} onChange={e => this.linkDistance = e.target.value}/><br />
        碰撞半径：<input defaultValue={collideRadius} onChange={e => this.collideRadius = e.target.value}/><br />
        碰撞强度：<input defaultValue={collideStrength} onChange={e => this.collideStrength = e.target.value}/><br />
        alpha衰减系数：<input defaultValue={alphaDecay} onChange={e => this.alphaDecay = e.target.value}/><br />
        alpha静止值：<input defaultValue={alphaMin} onChange={e => this.alphaMin = e.target.value}/><br />
        作用力：<input defaultValue={chargeStrength} onChange={e => this.chargeStrength = e.target.value}/><br />
        居中：<input defaultChecked={center} type="checkbox" onChange={e => this.center = e.target.checked}/><br />
        <button onClick={() => {this.forceUpdate()}}>确定</button><br />
        节点数: <input defaultValue={count} onChange={e => this.count = Number(e.target.value)}/><br />
        <button onClick={() => {
          const { nodes, links } = getData(dataLarge[0].nodes.slice(0), dataLarge[0].edges.slice(0), this.count);
          this.setState({
            nodes,
            links
          })
        }}>重置节点</button><br />
        节点数：{nodes.length}<br />
        边数量：{links.length}<br />
      </div>
      { this.state.img && <img src={this.state.img}/> }
      <div dangerouslySetInnerHTML={{__html: this.state.svg}}></div>
    	<div style={{overflow: 'hidden', width, height}}>
      	<D3ReactForce
          ref={c => this.D3ReactForce = c}
          nodes={nodes}
          links={links}
          nodeIdKey="nodeId"
          width={width}
          height={height}
          velocityDecay={velocityDecay}
          linkDistance={linkDistance}
          collideRadius={collideRadius}
          collideStrength={collideStrength}
          chargeStrength={chargeStrength}
          alphaDecay={alphaDecay}
          alphaMin={alphaMin}
          XYCenter={center}
          nodeClick={(d) => {
            console.log(d);
          }}
          tick={(alpha) => {
            // // this.D3ReactForce.adaption();
          }}
          end={() => {
            console.log('结束');
          }}
        />
    	</div>

    </div>);
  }
}
