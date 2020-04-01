import {
  getStatesAndDistrictsFromAPI,
  getStatesAndDistrictsFromMaps,
} from '../testUtils/index';

import staticStatesAndDistrictsFromAPI from '../testUtils/data/statesAndDistrictsFromAPI.json';
import staticStatesAndDistrictsFromMaps from '../testUtils/data/statesAndDistrictsFromMaps.json';

describe('Compare the map and the API', () => {
  describe('dynamic data', () => {
    test('for any discrepancies', async () => {
      const statesAndDistrictsFromAPI = await getStatesAndDistrictsFromAPI();
      const statesAndDistrictsFromMaps = await getStatesAndDistrictsFromMaps();

      Object.keys(statesAndDistrictsFromAPI).forEach((state) => {
        const expected = statesAndDistrictsFromAPI[state]
          .sort()
          .filter((e) => e !== 'Unknown');
        const received = statesAndDistrictsFromMaps[state].sort();

        expect(expected).toEqual(expect.arrayContaining(received));
      });
    });
  });

  describe('from stored response for any discrepancies', () => {
    const states = Object.keys(staticStatesAndDistrictsFromAPI);
    states.forEach((state) => {
      test(`${state}`, async () => {
        const expectedState = staticStatesAndDistrictsFromMaps[state]?.sort();
        const receivedState = staticStatesAndDistrictsFromAPI[state]?.sort();

        expect(expectedState).not.toBe(undefined);

        const expected = expectedState.filter((e) => e !== 'Unknown').sort();
        const received = receivedState.filter((e) => e !== 'Unknown').sort();

        expect(expected).toContain(...received);
      });
    });
  });
});
