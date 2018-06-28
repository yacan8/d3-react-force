import React from 'react';
import { renderToString } from 'react-dom/server';
import D3ReactForce from './D3ReactForce';
import data from './mock/data1.json';
// import dataLarge from './mock/data2.json';
import { getData } from './getData';
const { nodes, links } = data;

// const { nodes, links } = getData(dataLarge[0].nodes.slice(0), dataLarge[0].edges.slice(0), 400);
// const { nodes } = dataLarge[0];
// const links = dataLarge[0].edges;

// const { nodes, links } = {nodes: dataLarge[0].nodes.slice(0), links: dataLarge[0].edges.map(item => {
//   return {
//     source: item.srcId,
//     target: item.targetId
//   }
// })};
const { Simulation } = D3ReactForce;
let index = 1;
const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NGZhYmFkYi1hZmViLTRkMjQtOTNjNy1jZWZhM2ZhOTVjZTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDg2QjJCMTYxM0ZCMTFFNjg1MTI4QjAyNzhEQzUzMkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDg2QjJCMTUxM0ZCMTFFNjg1MTI4QjAyNzhEQzUzMkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjM2M2FkOWItNDg4Mi00N2FhLTk5ZjUtYWI4ODk4MjFiOGJkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc0ZmFiYWRiLWFmZWItNGQyNC05M2M3LWNlZmEzZmE5NWNlNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi/GS1QAAAD/UExURfn5+WZmZtXV1VFRUYCAgDo6OoyMjKmpqWVlZbW1tenp6Ts7O4GBgfv7+1NTU6CgoI6Ojl1dXWFhYTg4OGhoaPX19cbGxlBQUFtbW5GRkevr62dnZ7y8vIuLi7i4uPz8/KqqqmBgYKioqOHh4Wtrazc3N25ubre3t+Tk5NTU1DQ0NDw8PEBAQFRUVGlpaYqKik1NTWJiYjk5Oaurq5WVlZubm5+fn15eXru7u5mZmWNjY1VVVZeXl9nZ2a2trWRkZD8/P+3t7f39/XFxcY2Njfb29kdHR0lJSaGhocfHxz09Pezs7EFBQYODgzU1NbS0tE9PT/Pz8zMzM////////45unaAAAABVdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCwoQfPAAABaklEQVR42uzX107DMBQG4MMIpSTppOy9995773nS938WkGhCnfMb2TUSF/S/cpV8qpecY6rCRKngt8hAaj0ZUsjJmAJOFlRwsrOqJjuqcrK2dZrs7bemBmyiqREb61/A6pOToF0k6J+UmqSdYZjpHqEl3mG+yoxl1Gze5bgMsfrHh7yFRlkpsxi2xGuM52gF4tRLOb5vRSm+iBmXuMSanAGc7l4fl1pQlnyx2BL3asY8xQa4jR8h7gQ4krjLEEdN3MT/CVcg7jbDc6Mkc7Fugnd1x9CDxOIwKPKG79XydBO3PJ8XjU6SAdixU7Nj6D2hB7dDP0wYOHrrlir4HClpl6oK8Xnc3Gf2wvjHIMQp/cbXSbtweazdJPBbleM82iOhj7Gqt5mfX7NfmR2pNbL5ZV4w+D6H45pNsodxquMThdWOdIaP5jVlxR9WQ25FnFv56Fa4upXMbsW64zXB7YLieDVyvJRZXAc/BBgATEJGRWGfpZ4AAAAASUVORK5CYII=";
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
    this.velocityDecay = 0.05;
    this.linkDistance = 70;
    this.collideRadius = 10;
    this.collideStrength = 0.05;
    this.chargeStrength = -1500;
    this.count = 400;
    // this.alphaDecay = 0.005;
    // this.alphaMin = 0.1;
    //
    // this.simulation = new Simulation({
    //   velocityDecay: this.velocityDecay,
    //   linkDistance: this.linkDistance,
    //   collideRadius: this.collideRadius,
    //   collideStrength: this.collideStrength,
    //   chargeStrength: this.chargeStrength,
    //   width: document.documentElement.clientWidth,
    //   height: document.documentElement.clientHeight,
    //   nodeIdKey: 'nodeId',
    //   XYCenter: true,
    //   alphaDecay: this.alphaDecay,
    //   alphaMin: this.alphaMin
    // })
    // this.nodes = nodes;
    // this.links = links;
    // this.simulation.setNodesLinks(this.nodes, this.links);
    // let tick = 0;
    // this.simulation.tick({
    //   tick: () => {
    //     tick++;
    //     console.log(tick);
    //   },
    //   end: (alpha) => {
    //     console.log('end');
    //     this.setState({
    //       svg: renderToString(<D3ReactForce nodes={this.nodes} links={this.links} nodeIdKey="nodeId" staticLayout={true}/>)
    //     })
    //   }
    // })
  }

  componentDidMount() {
    window.onresize = () => {
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
        <button onClick={this.onClick}>
          添加一个节点
        </button>
        <button onClick={() => { this.D3ReactForce.adaption() }}>
          居中
        </button>
        <button onClick={() => {
            this.setState({
              img: this.D3ReactForce.saveImg()
            })
        }}>
          保存图片
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
          // sourceKey="srcId"
          // targetKey="targetId"
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
          getLink={{
            stroke: () => '#859731',
            strokeWidth: () => 1,
          }}
          // getNode={(node) => {
          //   return <g transform="translate(-15, -15)">
          //     <image xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={img} width="30" height="30"></image>
          //   </g>
          // }}
        />
    	</div>

    </div>);
  }
}
