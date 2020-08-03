import React, {useState, useEffect, useCallback, useRef} from 'react';
import ReactDOM from 'react-dom';
import '../styles/tooltip.scss';
import {animated, useSpring, config} from 'react-spring';

const Tooltip = ({children, postfix = 'tooltip'}) => {
  const root = document.getElementById('root');
  const tooltipRoot = document.getElementById('tooltip-root');
  const tooltipRef = useRef();
  const [message, setMessage] = useState('');
  const [spring, set] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.95)',
    config: {...config.wobbly, tension: 150, clamp: true},
  }));

  const handleMouseMove = useCallback((event) => {
    if (tooltipRef.current) {
      getTopPosition(event);
      getLeftPosition(event);
    }
  }, []);

  const handleMouseEnter = useCallback(
    (event) => {
      setMessage(event.target.dataset[postfix]);
      document.addEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
      set({opacity: 1, transform: 'scale(1)'});
    },
    [handleMouseMove, postfix, set]
  );

  const handleMouseLeave = useCallback(
    (event) => {
      document.removeEventListener('mousemove', handleMouseMove);
      set({opacity: 0, transform: 'scale(0.95)'});
    },
    [handleMouseMove, set]
  );

  useEffect(() => {
    root.addEventListener(
      'mouseover',
      (event) => {
        if (event.target.dataset[postfix]) {
          event.target.addEventListener('mouseenter', handleMouseEnter, {
            passive: true,
          });

          event.target.addEventListener('mouseleave', handleMouseLeave, {
            passive: true,
          });
        }
      },
      {passive: true}
    );
  }, [handleMouseEnter, handleMouseLeave, postfix, root]);

  const getTopPosition = (event) => {
    const top = event.pageY - tooltipRef.current.clientHeight;
    const right = event.pageX + tooltipRef.current.clientWidth;
    const left = event.pageX - tooltipRef.current.clientWidth;

    if (top < 0 || right > window.innerWidth || left < 0) {
      tooltipRef.current.style.top =
        event.pageY - tooltipRef.current.clientHeight / 2 + 'px';
    } else {
      tooltipRef.current.style.top =
        event.pageY - tooltipRef.current.clientHeight - 25 + 'px';
    }
  };

  const getLeftPosition = (event) => {
    const left = event.pageX - tooltipRef.current.clientWidth;
    const right = event.pageX + tooltipRef.current.clientWidth;

    if (left < 0) {
      tooltipRef.current.style.left =
        event.pageX + tooltipRef.current.clientWidth / 2 + 'px';
    } else if (right > window.innerWidth) {
      tooltipRef.current.style.left =
        event.pageX - tooltipRef.current.clientWidth - 25 + 'px';
    } else {
      tooltipRef.current.style.left =
        event.pageX - tooltipRef.current.clientWidth / 2 + 'px';
    }
  };

  const tooltip = (
    <animated.div className="tooltip" style={spring} ref={tooltipRef}>
      {children ? (
        React.cloneElement(children, {message: message})
      ) : (
        <h6 className="default">{message}</h6>
      )}
    </animated.div>
  );

  return ReactDOM.createPortal(tooltip, tooltipRoot);
};

export default Tooltip;
