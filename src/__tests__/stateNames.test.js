import {
  getStatesAndDistrictsFromAPI,
  getStatesAndDistrictsFromMaps,
} from '../testUtils/index';

describe('Compare the map and the API data', () => {
  test('should match', async () => {
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
