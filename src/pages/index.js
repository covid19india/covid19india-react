import Blog from './Blog';

import {lazy} from 'react';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));
const State = lazy(() => import('./State'));

export default [
  {
    pageLink: '/',
    view: Home,
    displayName: 'Home',
    showInNavbar: true,
  },
  {
    pageLink: '/blog',
    view: Blog,
    displayName: 'Blog',
    showInNavbar: true,
  },
  {
    pageLink: '/about',
    view: About,
    displayName: 'About',
    showInNavbar: true,
  },
  {
    pageLink: '/state/:stateCode',
    view: State,
    displayName: 'State',
    showInNavbar: false,
  },
];
