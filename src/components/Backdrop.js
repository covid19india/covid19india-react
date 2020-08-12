import '../styles/backdrop.scss';

import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

const Backdrop = () => {
  const rootRef = useRef();
  const backdropRootRef = useRef();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    backdropRootRef.current = document.getElementById('backdrop-root');
    rootRef.current = document.getElementById('root');
    setMounted(true);
  }, []);

  const backdrop = <div className="backdrop"></div>;

  return mounted
    ? ReactDOM.createPortal(backdrop, backdropRootRef.current)
    : null;
};

export default Backdrop;
