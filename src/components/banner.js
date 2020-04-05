import React, {useState, useEffect, useCallback} from 'react';
import websitedata from '../data/websitedata';
import axios from 'axios';

function Banner(props) {
  const [snippets, setSnippets] = useState([]);
  const [snippet, setSnippet] = useState();

  useEffect(() => {
    // axios
      // .get('https://api.covid19india.org/website_data.json')
      // .then((response) => {
        setSnippets(websitedata.factoids || []);
        setSnippet(
          websitedata.factoids[
            Math.floor(
              Math.random() * (websitedata.factoids.length - 1 - 0) + 0
            )
          ] || ''
        );
      // })
      // .catch((err) => {
        // console.log(err);
      // });
  }, []);

  const snippetChooser = useCallback(
    (min, max) => {
      const index = Math.random() * (max - min) + min;
      setSnippet(snippets[Math.floor(index)]);
    },
    [snippets]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      snippetChooser(0, snippets.length - 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [snippetChooser, snippets]);

  return (
    <div
      onClick={() => snippetChooser(0, snippets.length - 1)}
      className="Banner fadeInUp"
      style={{animationDelay: '0.2s'}}
    >
      <div className="snippet">{snippet ? snippet.banner : ''} &nbsp;</div>
    </div>
  );
}

export default Banner;
