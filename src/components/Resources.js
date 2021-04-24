import {fetcher} from '../utils/commonFunctions';

import {LinkExternalIcon} from '@primer/octicons-react';
import {useMemo} from 'react';
import useSWR from 'swr';

const Resources = () => {
  const {data} = useSWR(
    'https://api.covid19india.org/crowdsourced_resources_links.json',
    fetcher
  );

  const resources = useMemo(() => {
    if (!data) return [];
    else return data.crowdsourcd_resources_links;
  }, [data]);

  console.log(resources);

  return (
    <div className="Resources">
      <h1 className="heading">Resources</h1>

      <div className="banner">
        The links below are of independent and governmental aggregators who are
        providing resources to those in need. A lot of this is dynamically
        changing and might get outdated soon.
      </div>

      <div className="resources">
        {resources
          .filter((resource) => resource.shoulddisplay === 'Yes')
          .map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              target="_noblank"
              className="resource"
            >
              <div className="title">
                {resource.description || 'Independent Aggregator'}
              </div>
              <div className="link">{resource.link}</div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default Resources;
