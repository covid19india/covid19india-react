import Tippy from '@tippyjs/react';
import {useCallback} from 'react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

function Tooltip({children, message, hold = false, childProps = {}}) {
  const handleClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <Tippy
      className="Tooltip"
      content={
        typeof message === 'string' ? (
          <p
            className="message"
            dangerouslySetInnerHTML={{
              __html: message
                .trim()
                .split('\n')
                .map((text) => `<div>${text}</div>`)
                .join(''),
            }}
          ></p>
        ) : (
          message
        )
      }
      arrow={false}
      animation="shift-away"
      touch={hold ? ['hold', 300] : true}
    >
      <div onClick={handleClick} {...childProps}>
        {children}
      </div>
    </Tippy>
  );
}

export default Tooltip;
