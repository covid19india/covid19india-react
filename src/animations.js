/*
 * Navbar
 */

export const SLIDE_IN = {
  position: 'absolute',
  transform: 'translate3d(-20rem, 0, 0)',
  height: '100vh',
  zIndex: -1,
};

export const SLIDE_OUT = {
  position: 'absolute',
  transform: 'translate3d(10rem, 0, 0)',
};

export const SLIDE_IN_MOBILE = {
  opacity: 1,
  position: 'absolute',
  height: '100vh',
  top: 64,
  zIndex: 999,
};

export const SLIDE_OUT_MOBILE = {
  opacity: 1,
  position: 'absolute',
  height: '100vh',
  top: 64,
  zIndex: 999,
};

/*
 * Tooltip
 */

export const TOOLTIP_FADE_IN = {
  opacity: 1,
  transform: 'translate3d(0, 0px, 0)',
  zIndex: 999,
  position: 'absolute',
  pointerEvents: 'none',
};

export const TOOLTIP_FADE_OUT = {
  opacity: 0,
  transform: 'translate3d(0, 2px, 0)',
  zIndex: 999,
  position: 'absolute',
  pointerEvents: 'none',
};

/*
 * Language Switcher
 */

export const ENTER_IN = {
  opacity: 1,
  marginTop: '7.5rem',
  marginBottom: '30rem',
};

export const ENTER_OUT = {
  opacity: 0,
  height: '0rem',
  marginTop: '0rem',
  marginBottom: '0rem',
};

/*
 * Table
 */

export const TABLE_FADE_IN = {
  opacity: 1,
  transform: 'translate3d(0, 0px, 0)',
  height: 200,
};

export const TABLE_FADE_OUT = {
  opacity: 0,
  transform: 'translate3d(0, 2px, 0)',
  height: 0,
};
