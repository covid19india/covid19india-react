import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

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

  useEffect(() => {
    if (!fetched) return;
    ReactDOM.render(
      <ForceGraph2D graphData={networkData} nodeLabel="id" />,
      document.getElementById('clusters')
    );
  }, [fetched, networkData]);

  return <div id="clusters"></div>;
}

export default Clusters;
