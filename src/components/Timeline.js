import {
  formatDate,
  getIndiaDateISO,
  getIndiaDateYesterdayISO,
  retry,
} from '../utils/commonFunctions';

import {HeartFillIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {useKeenSlider} from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from 'react';
import ReactDOM from 'react-dom';
import {FastForward, Play as Play, Pause as Pause} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useTransition, animated} from 'react-spring';
import {useClickAway, useKeyPressEvent} from 'react-use';

const Calendar = lazy(() => retry(() => import('./Calendar')));

const wheelSize = 18;
const slidesPerView = 1;
const slideDegree = 360 / wheelSize;
const distanceThreshold = 5;
const autoPlayDelay = 2500;

function Timeline({date, setDate, dates, isTimelineMode, setIsTimelineMode}) {
  const {t} = useTranslation();

  const [sliderState, setSliderState] = useState(null);
  const [play, setPlay] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const timelineRef = useRef();
  const timer = useRef();

  useClickAway(timelineRef, () => {
    setShowCalendar(false);
  });

  const [sliderRef, slider] = useKeenSlider({
    initial: date === '' ? Math.max(0, dates.length - 2) : dates.indexOf(date),
    dragSpeed: (val, instance) => {
      const width = instance.details().widthOrHeight;
      return (
        val *
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
      if (slide === s.details().size - 1) {
        ReactDOM.unstable_batchedUpdates(() => {
          setIsTimelineMode(false);
          setShowCalendar(false);
          setDate('');
        });
      } else {
        setDate(dates[slide]);
      }
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
    if (date === getIndiaDateISO()) return t('Today');
    else if (date === getIndiaDateYesterdayISO()) return t('Yesterday');
    return formatDate(date, 'dd MMM y');
  };

  const slideValues = useMemo(() => {
    if (!sliderState) return [];
    const values = [];
    for (let i = 0; i < sliderState.size; i++) {
      const distance = sliderState.positions[i].distance * slidesPerView;
      const rotate =
        Math.abs(distance) > wheelSize / 2 ? 180 : distance * (360 / wheelSize);
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
  }, [sliderState, radius]);

  useKeyPressEvent('ArrowLeft', () => {
    if (slider) slider.prev();
  });

  useKeyPressEvent('ArrowRight', () => {
    if (slider) slider.next();
  });

  useKeyPressEvent('Escape', () => {
    setPlay(false);
    if (slider) slider.moveToSlide(sliderState.size - 1);
  });

  useKeyPressEvent('Enter', () => {
    setPlay(!play);
  });

  const handleClick = (index) => {
    if (index === sliderState?.absoluteSlide) {
      setShowCalendar(!showCalendar);
    } else if (slider) {
      slider.moveToSlide(index);
    }
  };

  const timeline = {
    '2020-03-25': t('Beginning of Lockdown Phase 1'),
    '2020-04-14': t('End of Lockdown Phase 1'),
    '2020-04-15': t('Beginning of Lockdown Phase 2'),
    '2020-05-03': t('End of Lockdown Phase 2'),
    '2020-05-04': t('Beginning of Lockdown Phase 3'),
    '2020-05-17': t('End of Lockdown Phase 3'),
    '2020-05-18': t('Beginning of Lockdown Phase 4'),
    '2020-05-31': t('End of Lockdown Phase 4'),
    '2020-06-01': t('Beginning of Lockdown Phase 5'),
    '2020-11-20': <HeartFillIcon size={12} />,
  };

  useEffect(() => {
    timer.current = setInterval(() => {
      if (play && slider) {
        slider.next();
      }
    }, autoPlayDelay);
    return () => {
      clearInterval(timer.current);
    };
  }, [play, slider]);

  const handleWheel = (event) => {
    if (slider) {
      if (event.deltaX > 0) {
        slider.next();
      } else if (event.deltaX < 0) {
        slider.prev();
      }
    }
  };

  const transitions = useTransition(showCalendar, {
    from: {
      pointerEvents: 'none',
      paddingTop: 0,
      marginBottom: 0,
      height: 0,
      opacity: 0,
    },
    enter: {
      pointerEvents: 'all',
      paddingTop: 36,
      marginBottom: 400,
      opacity: 1,
    },
    leave: {
      pointerEvents: 'none',
      paddingTop: 0,
      marginBottom: 0,
      height: 0,
      opacity: 0,
    },
    config: {
      mass: 1,
      tension: 100,
      friction: 15,
    },
  });

  return (
    <div className={'Timeline'} ref={timelineRef}>
      <div className="actions timeline fadeInUp" onWheel={handleWheel}>
        <div className={'wheel-buttons'}>
          <div
            className={'wheel-button left'}
            onClick={handleClick.bind(this, 0)}
          >
            <FastForward />
          </div>
          <div
            className={classnames('wheel-button', {active: play})}
            onClick={setPlay.bind(this, !play)}
          >
            {play ? <Pause /> : <Play />}
          </div>
          <div
            className="wheel-button"
            onClick={handleClick.bind(this, dates.length - 1)}
          >
            <FastForward />
          </div>
        </div>
        <div className={'wheel'} ref={sliderRef}>
          <div className="wheel__inner">
            <div className="wheel__slides">
              {slideValues.map(({className, style, slide}) => (
                <div className={`wheel__slide`} style={style} key={slide}>
                  <h5 {...{className}} onClick={handleClick.bind(this, slide)}>
                    {formatSlideDate(dates[slide])}
                  </h5>
                </div>
              ))}
            </div>
          </div>
          {slideValues.map(
            ({slide}) =>
              Object.keys(timeline).includes(dates[slide]) && (
                <h5
                  className={classnames('highlight', {
                    current: slide === sliderState?.absoluteSlide,
                  })}
                  key={slide}
                >
                  {timeline[dates[slide]]}
                </h5>
              )
          )}
        </div>
      </div>
      <Suspense fallback={<div />}>
        {transitions(
          (style, item) =>
            item && (
              <animated.div {...{style}}>
                <Calendar {...{date, dates, slider}} />
              </animated.div>
            )
        )}
      </Suspense>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (!equal(currProps.isTimelineMode, prevProps.isTimelineMode)) {
    return false;
  } else if (!equal(currProps.dates, prevProps.dates)) {
    return false;
  }
  return true;
};

export default memo(Timeline, isEqual);
