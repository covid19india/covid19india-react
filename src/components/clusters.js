import axios from 'axios';
// import * as d3 from 'd3';
import ForceGraph2D from 'react-force-graph-2d';
import React, {useEffect, useRef, useState} from 'react';

function Clusters({stateCode}) {
  const [fetched, setFetched] = useState(false);
  const [stateRawData, setStateRawData] = useState([]);
  const [networkData, setNetworkData] = useState([]);

  function prepareNetworkData(data) {
    // Parse data
    let contractedStr = data.reduce(
      (acc, v) => acc + v.contractedfromwhichpatientsuspected + ', ',
      ''
    );
    contractedStr = contractedStr.replace(/\s+/g, '');
    const sources = new Set(contractedStr.match(/[^,]+/g));

    // Prepare nodes and links
    const nodes = [];
    const nodesSet = new Set();
    const links = [];
    data.forEach((d) => {
      const contractedStr = d.contractedfromwhichpatientsuspected.replace(
        /\s+/g,
        ''
      );
      const contracted = contractedStr.match(/[^,]+/g);
      if (contracted) {
        const pid = 'P' + d.patientnumber;
        nodesSet.add(pid);
        nodes.push({
          id: pid,
          group: sources.has(pid) ? 'source' : 'target',
          raw: d,
        });
        contracted.forEach((p) => {
          links.push({
            source: p,
            target: pid,
          });
        });
      }
    });

    // Add missing nodes
    links.forEach((d) => {
      if (!nodesSet.has(d.source)) {
        nodes.push({
          id: d.source,
          group: 'source',
          raw: d.source,
        });
        nodesSet.add(d.source);
      }
    });
    return {
      nodes: nodes,
      links: links,
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        const rawDataResponse = await axios.get(
          'https://api.covid19india.org/raw_data.json'
        );
        setStateRawData(
          rawDataResponse.data.raw_data.filter((d) => d.statecode === stateCode)
        );
        setFetched(true);
      } catch (err) {
        console.log(err);
      }
    }
    if (!fetched) {
      getData();
    }
  }, [fetched, stateCode]);

  useEffect(() => {
    setNetworkData(prepareNetworkData(stateRawData));
  }, [stateRawData]);

  const NetworkGraph = () => {
    const fgRef = useRef();

    // useEffect(() => {
    // const fg = fgRef.current;
    // Deactivate existing forces
    // fg.d3Force('center', null);
    // fg.d3Force('charge', -10);

    // // Add collision and bounding box forces
    // fg.d3Force('collide', d3.forceCollide(4));
    // fg.d3Force('box', () => {
    //   const SQUARE_HALF_SIDE = N * 2;

    //   nodes.forEach(node => {
    //     const x = node.x || 0, y = node.y || 0;

    //     // bounce on box walls
    //     if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
    //     if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
    //   });
    // });
    // }, []);

    const width = document.getElementById('clusters').offsetWidth;

    return (
      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={width}
        graphData={networkData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticleColor={() => 'red'}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={(link) =>
          link.source.id[0] === 'P' ? 2 : 0
        }
      />
    );
  };

  return <div id="clusters">{fetched ? <NetworkGraph /> : ''}</div>;
}

export default Clusters;
