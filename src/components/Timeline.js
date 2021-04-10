import {
  formatDate,
  getIndiaDateISO,
  getIndiaDateYesterdayISO,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {useKeenSlider} from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {FastForward, Play as Play, Pause as Pause} from 'react-feather';
import {animated} from 'react-spring';
import {useKeyPressEvent} from 'react-use';

const wheelSize = 20;
const slidesPerView = 1;
const slideDegree = 360 / wheelSize;
const distanceThreshold = 5;
const autoPlayDelay = 2500;
const hideDelay = 500;

function Timeline({style, date, setDate, dates, setIsTimelineMode}) {
  const [sliderState, setSliderState] = useState(null);
  const [play, setPlay] = useState(false);
  const timer = useRef();

  const hideTimeline = () => {
    setTimeout(() => {
      setIsTimelineMode(false);
    }, hideDelay);
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
      if (slide === 0) {
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
    if (slider) setRadius(slider.details().widthOrHeight);
  }, [slider]);

  const formatSlideDate = (date) => {
    if (date === getIndiaDateISO()) return 'Today';
    else if (date === getIndiaDateYesterdayISO()) return 'Yesterday';
    return formatDate(date, 'dd MMM y');
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
    setPlay(false);
    if (slider) {
      slider.moveToSlide(0);
      hideTimeline();
    }
  });

  useKeyPressEvent('Enter', () => {
    setPlay(!play);
  });

  const handleClick = (index) => {
    if (slider) {
      slider.moveToSlide(index);
    }
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

  useEffect(() => {
    timer.current = setInterval(() => {
      if (play && slider) {
        slider.prev();
      }
    }, autoPlayDelay);
    return () => {
      clearInterval(timer.current);
    };
  }, [play, slider]);

  const handleWheel = (event) => {
    if (slider) {
      if (event.deltaX > 0) {
        slider.prev();
      } else if (event.deltaX < 0) {
        slider.next();
      }
    }
  };

  return (
    <div className={'Timeline'}>
      <animated.div className="actions timeline" style={style}>
        <div
          className={classnames('wheel__button', 'top', {active: play})}
          onClick={setPlay.bind(this, !play)}
        >
          {play ? <Pause /> : <Play />}
        </div>
        <div className={'wheel'} ref={sliderRef} onWheel={handleWheel}>
          {Object.keys(timeline).includes(
            dates[sliderState?.absoluteSlide]
          ) && (
            <h5 className="highlight fadeInUp">
              {timeline[dates[sliderState.absoluteSlide]]}
            </h5>
          )}
          <div
            className={'wheel__button left'}
            style={{
              transform: `translateZ(${radius}px)`,
              WebkitTransform: `translateZ(${radius}px)`,
            }}
            onClick={handleClick.bind(this, dates.length - 1)}
          >
            <FastForward />
          </div>
          <div className="wheel__inner">
            <div className="wheel__slides">
              {slideValues.map(({className, style, slide}, idx) => (
                <div className={`wheel__slide`} style={style} key={idx}>
                  <h5 {...{className}} onClick={handleClick.bind(this, slide)}>
                    {formatSlideDate(dates[slide])}
                  </h5>
                </div>
              ))}
            </div>
          </div>
          <div
            className="wheel__button right"
            onClick={handleClick.bind(this, 0)}
          >
            <FastForward />
          </div>
        </div>
      </animated.div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(Timeline, isEqual);
