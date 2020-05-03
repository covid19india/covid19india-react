import Row from '../../components/row';

import {mount} from 'enzyme';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

const state = {
  active: '1',
  confirmed: '11',
  deaths: '0',
  deltaconfirmed: '0',
  deltadeaths: '0',
  deltarecovered: '0',
  lastupdatedtime: '30/03/2020 11:27:27',
  recovered: '10',
  state: 'Andaman and Nicobar Islands',
  statecode: 'AN',
};

const districts = {
  'South Andaman': {confirmed: 5, lastupdatedtime: '', delta: {confirmed: 0}},
  'North and Middle Andaman': {
    confirmed: 1,
    lastupdatedtime: '',
    delta: {confirmed: 0},
  },
  Unknown: {confirmed: 5, lastupdatedtime: '', delta: {confirmed: 0}},
};

const zones = [
  {
    district: 'Nicobars',
    districtcode: 'AN_Nicobars',
    lastupdated: '01/05/2020',
    source:
      'https://www.facebook.com/airnewsalerts/photos/a.262571017217636/1710062729135117/?type=3&theater',
    state: 'Andaman and Nicobar Islands',
    statecode: 'AN',
    zone: 'Green',
  },
  {
    district: 'North and Middle Andaman',
    districtcode: 'AN_North and Middle Andaman',
    lastupdated: '01/05/2020',
    source:
      'https://www.facebook.com/airnewsalerts/photos/a.262571017217636/1710062729135117/?type=3&theater',
    state: 'Andaman and Nicobar Islands',
    statecode: 'AN',
    zone: 'Green',
  },
  {
    district: 'South Andaman',
    districtcode: 'AN_South Andaman',
    lastupdated: '01/05/2020',
    source:
      'https://www.facebook.com/airnewsalerts/photos/a.262571017217636/1710062729135117/?type=3&theater',
    state: 'Andaman and Nicobar Islands',
    statecode: 'AN',
    zone: 'Red',
  },
];

describe('Row component', () => {
  const RealDate = Date;
  const handleReveal = jest.fn();

  const wrapper = mount(
    <MemoryRouter>
      <table>
        <tbody>
          <Row
            state={state}
            districts={districts}
            index={1}
            total={false}
            reveal={true}
            zones={zones}
            handleReveal={handleReveal}
          />
        </tbody>
      </table>
    </MemoryRouter>
  );

  beforeAll(() => {
    const mockedDate = new Date('2020-04-13T17:11:38.158Z');
    global.Date = class extends Date {
      constructor(date) {
        if (date) return new RealDate(date); // because Row component is using new Date()
        return mockedDate;
      }
    };
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test('State/UT details', () => {
    const stateSelector = wrapper.find('tr.state');
    const cells = stateSelector.find('td');

    const stateName = cells.at(0).text();
    const confirmed = cells.at(1).text();
    const active = cells.at(2).text();
    const recovered = cells.at(3).text();
    const deaths = cells.at(4).text();

    expect(stateSelector).toHaveLength(1);
    expect(cells).toHaveLength(5);
    expect(stateName).toContain(state.state);
    expect(confirmed).toEqual('11');
    expect(active).toEqual('1');
    expect(recovered).toEqual('10');
    expect(deaths).toEqual('0');
  });

  test('Districts and the confirmed cases', () => {
    const stateRow = wrapper.find('tr.state');
    expect(stateRow).toHaveLength(1);

    stateRow.simulate('click');

    const districtsSelector = wrapper.find('tr.district');
    const stateLastUpdate = wrapper.find('tr.state-last-update');

    expect(districtsSelector).toHaveLength(3);
    expect(stateLastUpdate.text()).toMatch(/14 days ago/i);

    districtsSelector.forEach((e, index) => {
      const cells = e.find('td');
      const district = cells.at(0).childAt(0).text();
      const confirmedNumber = cells.at(1).text();

      expect(districts[district]).not.toBeUndefined();
      expect(districts[district]['confirmed']).toEqual(
        parseInt(confirmedNumber)
      );
    });
  });
});
