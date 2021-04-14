import ContentLoader from 'react-content-loader';
import {useMeasure} from 'react-use';

const TableLoader = () => {
  let [ref, {width}] = useMeasure();
  const windowWidth = window.innerWidth;

  width = width || (windowWidth > 769 ? 528 : windowWidth);
  if (windowWidth < 769) {
    width -= 30;
  }

  const height = 45;
  const rows = 20;

  return (
    <div ref={ref} className="TableLoader">
      <ContentLoader
        viewBox={`0 0 ${width} ${height * rows}`}
        height={height * rows}
        width={width}
        speed={2}
        animate={false}
      >
        {[...Array(rows).keys()].map((i) => (
          <rect
            key={i}
            x="0"
            y={height * i}
            rx="3"
            ry="3"
            width={width}
            height={height - 5}
          />
        ))}
      </ContentLoader>
    </div>
  );
};

export default TableLoader;
