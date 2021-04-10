import {formatDate, getIndiaDateISO} from '../utils/commonFunctions';

import {useKeenSlider} from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useKeyPressEvent} from 'react-use';

function TimelineWheel({date, setDate, dates, setIsTimelineMode}) {
  const wheelSize = 8;
  const slidesPerView = 1;
  const slideDegree = 360 / wheelSize;
  const [sliderState, setSliderState] = useState(null);

  const hideTimeline = () => {
    setTimeout(() => {
      setIsTimelineMode(false);
    }, 500);
  };

  const [sliderRef, slider] = useKeenSlider({
    vertical: false,
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

  const getDate = useCallback(
    (index) => {
      if (dates[index] === getIndiaDateISO()) return 'Today';
      return formatDate(dates[index], 'dd MMM');
    },
    [dates]
  );

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
      const classname = i === sliderState.absoluteSlide ? 'current' : '';
      const slide = sliderState.absoluteSlide + Math.round(distance);
      const value = getDate(slide);
      values.push({classname, style, value});
    }
    return values;
  }, [sliderState, radius, dates.length, getDate]);

  useKeyPressEvent('ArrowLeft', () => {
    if (slider) slider.next();
  });

  useKeyPressEvent('ArrowRight', () => {
    if (sliderState.absoluteSlide === 0) {
      hideTimeline();
    } else if (slider) {
      slider.prev();
    }
  });

  useKeyPressEvent('Escape', () => {
    if (slider) {
      slider.moveToSlide(0);
      hideTimeline();
    }
  });

  return (
    <div className={'TimelineWheel'}>
      <div className={'wheel'} ref={sliderRef}>
        <div className="wheel__inner">
          <div className="wheel__slides">
            {slideValues.map(({classname, style, value}, idx) => (
              <div
                className={`wheel__slide ${classname}`}
                style={style}
                key={idx}
              >
                <h5>{value}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TimelineWheel);
