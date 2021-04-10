import {formatDate, getIndiaDateISO} from '../utils/commonFunctions';

import {CalendarIcon, PlayIcon} from '@primer/octicons-react';
import equal from 'fast-deep-equal';
import {useKeenSlider} from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import {memo, useEffect, useMemo, useState} from 'react';
import {useKeyPressEvent} from 'react-use';

const wheelSize = 8;
const slidesPerView = 1;
const slideDegree = 360 / wheelSize;
const distanceThreshold = 5;

function TimelineWheel({setDate, dates, setIsTimelineMode}) {
  const [sliderState, setSliderState] = useState(null);

  const hideTimeline = () => {
    setTimeout(() => {
      setIsTimelineMode(false);
    }, 500);
  };

  const [sliderRef, slider] = useKeenSlider({
    initial: Math.min(1, dates.length),
    dragSpeed: (val, instance) => {
      const width = instance.details().widthOrHeight;
      return (
        -val *
        (width /
          ((width / 2) * Math.tan(slideDegree * (Math.PI / 180))) /
          slidesPerView)
      );
    },
    move: (s) => {
      setSliderState(s.details());
    },
    afterChange: (s) => {
      const slide = s.details().absoluteSlide;
      if (slide === 0 && s.details().direction === -1) {
        hideTimeline();
      }
      setDate(slide === 0 ? '' : dates[slide]);
    },
    mode: 'free-snap',
    slides: dates.length,
    slidesPerView,
  });

  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (slider) setRadius(slider.details().widthOrHeight / 2);
  }, [slider]);

  const formatSlideDate = (date) => {
    if (date === getIndiaDateISO()) return 'Today';
    return formatDate(date, 'dd MMM');
  };

  const slideValues = useMemo(() => {
    if (!sliderState) return [];
    const values = [];
    for (let i = 0; i < dates.length; i++) {
      const distance = sliderState.positions[i].distance * slidesPerView;
      const rotate =
        Math.abs(distance) > wheelSize / 2
          ? 180
          : distance * (360 / wheelSize) * -1;
      const style = {
        transform: `rotateY(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateY(${rotate}deg) translateZ(${radius}px)`,
      };
      const className = i === sliderState.absoluteSlide ? 'current' : '';
      const slide = sliderState.absoluteSlide + Math.round(distance);
      if (Math.abs(distance) < distanceThreshold)
        values.push({className, style, slide});
    }
    return values;
  }, [sliderState, radius, dates.length]);

  useKeyPressEvent('ArrowLeft', () => {
    if (slider) slider.next();
  });

  useKeyPressEvent('ArrowRight', () => {
    if (sliderState.absoluteSlide === 0) hideTimeline();
    else if (slider) slider.prev();
  });

  useKeyPressEvent('Escape', () => {
    if (slider) {
      slider.moveToSlide(0);
      hideTimeline();
    }
  });

  const handleClick = (index) => {
    if (slider) slider.moveToSlide(index);
  };

  const timeline = {
    '2020-03-25': 'Beginning of Lockdown Phase 1',
    '2020-04-14': 'End of Lockdown Phase 1',
    '2020-04-15': 'Beginning of Lockdown Phase 2',
    '2020-05-03': 'End of Lockdown Phase 2',
    '2020-05-04': 'Beginning of Lockdown Phase 3',
    '2020-05-17': 'End of Lockdown Phase 3',
    '2020-05-18': 'Beginning of Lockdown Phase 4',
    '2020-05-31': 'End of Lockdown Phase 4',
    '2020-06-01': 'Beginning of Lockdown Phase 5',
  };

  return (
    <div className={'TimelineWheel'}>
      <div className={'wheel'} ref={sliderRef}>
        {Object.keys(timeline).includes(dates[sliderState?.absoluteSlide]) && (
          <h5 className="highlight fadeInUp">
            {timeline[dates[sliderState.absoluteSlide]]}
          </h5>
        )}
        <div className="wheel__inner">
          <div
            className="wheel__label left"
            style={{
              transform: `translateZ(${radius}px)`,
              WebkitTransform: `translateZ(${radius}px)`,
            }}
          >
            <PlayIcon />
          </div>
          <div className="wheel__slides">
            {slideValues.map(({className, style, slide}, idx) => (
              <div className={`wheel__slide`} style={style} key={idx}>
                <h5 {...{className}} onClick={handleClick.bind(this, slide)}>
                  {formatSlideDate(dates[slide])}
                </h5>
              </div>
            ))}
          </div>
          <div
            className="wheel__label right"
            style={{
              transform: `translateZ(${radius}px)`,
              WebkitTransform: `translateZ(${radius}px)`,
            }}
          >
            <CalendarIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(TimelineWheel, isEqual);
