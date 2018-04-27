import React from 'react';
import { renderToString } from 'react-dom/server';
import D3ReactForce from './D3ReactForce';
import dataLarge from './mock/dataLarge.json';
import { getData } from './getData';

const { Simulation } = D3ReactForce;
const Promise = global.Promise;
const console = global.logger;

global.test = function(number) {
  console.info('group graph begin...' +  number);
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const { nodes, links } = getData(dataLarge[0].nodes, dataLarge[0].edges, number);
    // const { nodes, links } = {nodes: dataLarge[7].nodes, links: dataLarge[7].edges};
    console.info(JSON.stringify(nodes));
    const simulation = new Simulation({
      velocityDecay: 0.05,
      linkDistance: 100,
      collideRadius: 10,
      collideStrength: 0.01,
      chargeStrength: -50,
      width: 900,
      nodeIdKey: 'nodeId',
      XYCenter: false
    })
    simulation.setNodesLinks(nodes, links);
    let _alpha = 0, tickCount = 0;
    simulation.tick({
      tick: (alpha) => {
        tickCount++;
        console.info(`tickCount: ${tickCount}`);
        if (Math.abs(alpha - _alpha) < 0.0000000000000001) {
          this.simulation.alpha(0).alphaTarget(0);
        } else {
          _alpha = alpha;
        }
      },
      end: (alpha) => {
        const endTime = new Date().getTime();
        const useTime = new Date(endTime - startTime);
        const svg = renderToString(<D3ReactForce nodes={nodes} width={900} links={links} nodeIdKey="nodeId" staticLayout={true}/>);
        console.info(`ues time ${useTime}`);
        resolve(svg);
      }
    })
  }).catch(e => {
    return e.message;
  })
}
