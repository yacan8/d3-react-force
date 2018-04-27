import _ from 'lodash';

export function getData(nodes, links, size) {
  const nodesMap = {};
  const linksSourceMap = {};
  const linksTargetMap = {};
  _.forEach(nodes, node => {
    nodesMap[node.nodeId] = node;
  })
  _.forEach(links, link => {
    if (linksSourceMap[link.srcId]) {
      linksSourceMap[link.srcId].push(link)
    } else {
      linksSourceMap[link.srcId] = [link];
    }
    if (linksTargetMap[link.srcId]) {
      linksTargetMap[link.srcId].push(link)
    } else {
      linksTargetMap[link.srcId] = [link];
    }
  })
  const nodesResult = {};
  const linksResult = {};
  const randomIndex = Math.floor(Math.random() * 10);
  nodesResult[nodes[randomIndex].nodeId] = nodes[randomIndex];

  function getLink() {
    _.forEach(Object.keys(nodesResult), nodeId => {
      linksTargetMap[nodeId] && linksTargetMap[nodeId].forEach(link => {
        if (!linksResult[`${link.targetId}_${link.srcId}`] && !linksResult[`${link.srcId}_${link.targetId}`]) {
          linksResult[`${link.targetId}_${link.srcId}`] = link;
        }
      })
      linksSourceMap[nodeId] && linksSourceMap[nodeId].forEach(link => {
        if (!linksResult[`${link.targetId}_${link.srcId}`] && !linksResult[`${link.srcId}_${link.targetId}`]) {
          linksResult[`${link.targetId}_${link.srcId}`] = link;
        }
      })
    })
  }

  function getNode() {
    const length = Object.keys(nodesResult).length;
    _.forEach(Object.keys(linksResult), linkKey => {
      const [ srcId, targetId ] = linkKey.split('_');
      if (!nodesResult[srcId]) {
        nodesResult[srcId] = nodesMap[srcId];
      }
      if (!nodesResult[targetId]) {
        nodesResult[targetId] = nodesMap[targetId];
      }
    })
    const _length = Object.keys(nodesResult).length;
    if (_length === length) {
      // for(let i = 0; i < length; i++) {
      //   if (!nodesResult[nodes[i].nodeId]) {
      //     nodesResult[nodes[i].nodeId] = nodes[i];
      //     break;
      //   }
      // }
      return false;
    }
  }
  while (Object.keys(nodesResult).length < size) {
    getLink();
    const _null = getNode();
    if (_null === false) break;
  }
  return {
    nodes: Object.values(nodesResult),
    links: Object.values(linksResult)
  }
}
