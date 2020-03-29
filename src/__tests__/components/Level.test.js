import React from 'react';
import {render} from '@testing-library/react';
import Level from '../../components/level';

const states = [
  {
    active: '1010',
    confirmed: '1127',
    deaths: '27',
    state: 'Total',
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

const deltas = {
  confirmeddelta: '10',
  deceaseddelta: '3',
  recovereddelta: '5',
};

test('Level renders total state data', () => {
  const {container} = render(<Level data={states} deltas={deltas} />);

  expect(container).toHaveTextContent(
    'Confirmed[+10]86 Active 80Recovered[+5]7 Deceased[+3]4'
  );
});
