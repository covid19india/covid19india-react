import {fetcher} from '../utils/commonFunctions';

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
        The objective of this page is to help people gain access to vital
        resources by sharing information only. However, we request the
        beneficiaries to use their discretion and verify the leads on their own
        before taking any action. If you find inaccurate information or any lead
        engaging in illegal practices, kindly inform us at
        hello@covid19india.org. We will take it down as soon as possible. We
        will not be responsible for the actions you take using the information
        on this page. We are just mediating information and are no way
        responsible for what is being shared. Please avoid sharing and
        contacting black market resources. We strongly encourage to AVOID black
        market.
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
