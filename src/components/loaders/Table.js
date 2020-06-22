import React from 'react';
import ContentLoader from 'react-content-loader';

const TableLoader = () => {
  const windowWidth = window.innerWidth;
  const width = windowWidth > 769 ? 448 : windowWidth;
  const height = 135;

  return (
    <div className="TableLoader">
      <ContentLoader
        viewBox={`0 0 ${width} ${height}`}
        height={height}
        width={width}
        speed={2}
        animate={false}
      >
        <rect x="0" y="0" rx="3" ry="3" width={width} height="40" />
        <rect x="0" y="45" rx="3" ry="3" width={width} height="40" />
        <rect x="0" y="90" rx="3" ry="3" width={width} height="40" />
      </ContentLoader>
    </div>
  );
};

export default TableLoader;
