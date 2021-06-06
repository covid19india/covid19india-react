import Tippy from '@tippyjs/react';
import {useCallback} from 'react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

function Tooltip({children, message}) {
  const handleClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <Tippy
      className="Tooltip"
      content={
        <p
          className="message"
          dangerouslySetInnerHTML={{
            __html: message.replace(/\n/g, '<br/><br/>'),
          }}
        ></p>
      }
      arrow={false}
      animation="shift-away"
      touch="hold"
    >
      <div onClick={handleClick.bind(this)}>{children}</div>
    </Tippy>
  );
}

export default Tooltip;
