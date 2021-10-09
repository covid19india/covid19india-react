import Footer from './Footer';

import {fetcher} from '../utils/commonFunctions';

import {useTransition, animated} from '@react-spring/web';
import classnames from 'classnames';
import {memo, useMemo, useEffect, useState} from 'react';
import ContentLoader from 'react-content-loader';
import {
  ExternalLink,
  GitHub,
  Instagram,
  Linkedin,
  Twitter,
} from 'react-feather';
import {Helmet} from 'react-helmet';
import useSWR from 'swr';

const VOLUNTEERS_DOMAIN = 'https://volunteers.covid19india.org';
const PLACEHOLDER_IMG = 'placeholder.jpg';

function Member({className, style, name, bio, link, image, socials = {}}) {
  const [loaded, setLoaded] = useState(false);

  const socialIcons = useMemo(
    () => ({
      github: <GitHub size={16} />,
      linkedin: <Linkedin size={16} />,
      twitter: <Twitter size={16} />,
      instagram: <Instagram size={16} />,
    }),
    []
  );

  return (
    <animated.div className={classnames('Member', className)} {...{style}}>
      {link && <a href={link} target="_blank" rel="noopener noreferrer"></a>}
      {!loaded && (
        <div className="image">
          <ContentLoader
            backgroundColor="#888"
            foregroundColor="#888"
            backgroundOpacity={0.2}
            foregroundOpacity={0.4}
          >
            <rect x="0" y="0" width="256" height="256" />
          </ContentLoader>
        </div>
      )}
      <img
        className="image"
        src={`${VOLUNTEERS_DOMAIN}/images/${image ? image : PLACEHOLDER_IMG}`}
        alt={name}
        onLoad={setLoaded.bind(this, true)}
        style={{display: loaded ? 'block' : 'none'}}
      />
      <div className="details">
        <h2 className="name">{name}</h2>
        <p className="bio">{bio}</p>
        <div className="socials">
          {Object.entries(socialIcons).map(
            ([social, icon]) =>
              socials[social] && (
                <a
                  key={social}
                  className={classnames('icon', social)}
                  href={socials[social]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              )
          )}
        </div>
      </div>
      {link && (
        <div className="link-external">
          <ExternalLink size={16} />
        </div>
      )}
    </animated.div>
  );
}

// TODO: Lazy-loading and content loader
function Volunteers() {
  const {data} = useSWR(`${VOLUNTEERS_DOMAIN}/data.json`, fetcher, {
    suspense: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const dataAugemented = useMemo(() => [...(data || []), {}], [data]);

  const transition = useTransition(dataAugemented, {
    keys: (item) => item?.name || 'last',
    sort: (a, b) =>
      Object.keys(a).length === 0
        ? 1
        : Object.keys(b).length === 0
        ? -1
        : Math.random() > 0.5
        ? 1
        : -1,
    delay: 200,
    trail: 200 / dataAugemented.length,
    from: {opacity: 0, scale: 0.8},
    enter: {opacity: 1, scale: 1},
    leave: {opacity: 0, scale: 0},
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Volunteers - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="Volunteers">
        <div className="wrapper">
          <div
            className={classnames('description', 'fadeInUp')}
            style={{animationDelay: '0.1s'}}
          >
            We would like to thank the hundreds of volunteers who, for the last
            18 months, extended their time and effort towards collating and
            publishing COVID-19 data for India.
          </div>
        </div>
        <div className="members">
          {transition(
            (style, item) =>
              item &&
              (Object.keys(item).length > 0 ? (
                <Member {...item} {...{style}} />
              ) : (
                <animated.div className="last" {...{style}}>
                  <Member className={'first'} />
                  <Member className={'second'} />
                  <Member className={'third'} bio="And many more..." />
                </animated.div>
              ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default memo(Volunteers);
