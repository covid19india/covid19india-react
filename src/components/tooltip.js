import React, {useState, useEffect, useRef} from 'react';

function Tooltip(props) {
  const [styles, setStyles] = useState({});
  const [visible, setVisibility] = useState(false);

  const wrapper = useRef(null);
  const tooltip = useRef(null);
  const content = useRef(null);
  const arrow = useRef(null);
  const gap = useRef(null);

  const baseStyles = {
    wrapper: {
      position: 'relative',
      display: 'inline-block',
      zIndex: '98',
      color: '#555',
      cursor: 'cursor',
    },
    tooltip: {
      position: 'absolute',
      zIndex: '99',
      minWidth: '200px',
      maxWidth: '420px',
      background: '#000',
      bottom: '100%',
      left: '50%',
      marginBottom: '10px',
      padding: '5px',
      WebkitTransform: 'translateX(-50%)',
      msTransform: 'translateX(-50%)',
      OTransform: 'translateX(-50%)',
      transform: 'translateX(-50%)',
      opacity: 1,
      fontSize: '1rem',
      textAlign: 'center',
      paddingBottom: '0.5rem',
      borderRadius: '5px',
    },
    content: {
      background: '#000',
      color: '#fff',
      display: 'inline',
      fontSize: '.8em',
    },
    arrow: {
      position: 'absolute',
      width: '0',
      height: '0',
      bottom: '-5px',
      left: '50%',
      marginLeft: '-5px',
      borderLeft: 'solid transparent 5px',
      borderRight: 'solid transparent 5px',
      borderTop: 'solid #000 5px',
    },
    gap: {
      position: 'absolute',
      width: '100%',
      height: '20px',
      bottom: '-20px',
    },
  };

  useEffect(() => {
    const mergeStyles = (userStyles) => {
      const newStyles = {};
      Object.keys(baseStyles).forEach((name) => {
        newStyles[name] = Object.assign({}, baseStyles[name], userStyles[name]);
      });
      return newStyles;
    };
    setStyles(mergeStyles(props.styles));
  }, [baseStyles, props.styles]);

  const show = () => setVisibility(true);

  const hide = () => setVisibility(false);

  const handleTouch = () => {
    show();
    assignOutsideTouchHandler();
  };

  const componentNode = useRef(null);
  const assignOutsideTouchHandler = () => {
    const handler = (e) => {
      let currentNode = e.target;
      while (currentNode.parentNode) {
        if (currentNode === componentNode) return;
        currentNode = currentNode.parentNode;
      }
      if (currentNode !== document) return;
      hide();
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('touchstart', handler);
  };

  return (
    <React.Fragment>
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        onTouchStart={handleTouch}
        ref={wrapper}
        style={styles.wrapper}
      >
        {props.children}
        {visible && (
          <div ref={tooltip} style={styles.tooltip}>
            <div ref={content} style={styles.content}>
              {props.content}
            </div>
            <div ref={arrow} style={styles.arrow} />
            <div ref={gap} style={styles.gap} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default React.memo(Tooltip);
