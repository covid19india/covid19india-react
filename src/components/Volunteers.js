import Footer from './Footer';

// import {API_DOMAIN} from '../constants';
import {fetcher} from '../utils/commonFunctions';

import classnames from 'classnames';
import {useMemo, useEffect} from 'react';
import {
  ExternalLink,
  GitHub,
  Instagram,
  Linkedin,
  Twitter,
} from 'react-feather';
import {Helmet} from 'react-helmet';
import useSWR from 'swr';

const PLACEHOLDER_IMG =
  'https://images.assetsdelivery.com/compings_v2/apoev/apoev1901/apoev190100061.jpg';

function Member({
  className,
  name,
  bio,
  link,
  image = PLACEHOLDER_IMG,
  socials = {},
}) {
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
    <div className={classnames('Member', className)}>
      <a href={link} target="_blank" rel="noopener noreferrer"></a>
      <img src={image} />
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
    </div>
  );
}

// TODO: Animations, lazy-loading and content loader
function Volunteers() {
  // const {data} = useSWR(`${API_DOMAIN}/volunteers/metadata.json`, fetcher, {
  const {data} = useSWR(
    `http://localhost:8080/volunteers/metadata.json`,
    fetcher,
    {
      suspense: true,
    }
  );

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
          <div className="description">
            PLACEHOLDER: We would like to thank the hundreds of volunteers who,
            for the last 18 months, collected and published the most complete
            data about COVID-19 in India.
          </div>
        </div>
        <div className="members">
          {data.map((member, index) => (
            <Member key={index} {...member} />
          ))}
          <div className="last">
            <Member className={'first'} />
            <Member className={'second'} />
            <Member className={'third'} bio="And many more..." />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Volunteers;
