import React from 'react';
import {render} from '@testing-library/react';
import Level from '../../components/level';

const states = [
  {
    deltaconfirmed: '10',
    deltadeaths: '3',
    deltarecovered: '5',
  },
  {
    active: '75',
    confirmed: '83',
    deaths: '3',
    recovered: '5',
    state: 'Karnataka',
  },
  {
    active: '5',
    confirmed: '3',
    deaths: '1',
    recovered: '2',
    state: 'Gujarat',
  },
];

test('Level renders total state data', () => {
  const {container} = render(<Level data={states} />);

  expect(container).toHaveTextContent(
    'Confirmed[+10]86 Active 80Recovered[+5]7 Deceased[+3]4'
  );
});
