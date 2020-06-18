import React, {useState, useEffect, useCallback} from 'react';
// import {useTranslation} from 'react-i18next';

const DATA_URL = 'https://api.covid19india.org/website_data.json';

function Banner(props) {
  // const {t} = useTranslation();
  const [snippets, setSnippets] = useState([]);
  const [snippet, setSnippet] = useState();

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSnippets(data.factoids || []);
        setSnippet(
          data.factoids[
            Math.floor(Math.random() * (data.factoids.length - 1 - 0) + 0)
          ] || ''
        );
      })
      .catch((err) => {
        console.log(err);
      });
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

  if (window.location.pathname !== '/database') {
    return (
      <div
        onClick={() => snippetChooser(0, snippets.length - 1)}
        className="Banner fadeInUp"
        style={{animationDelay: '0.8s'}}
      >
        <div className="snippet">{snippet ? snippet.banner : ''} &nbsp;</div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Banner;
