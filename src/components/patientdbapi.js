import axios from 'axios';

const fetchPatients = async () => {
  return axios
    .get('https://api.covid19india.org/raw_data.json')
    .then((res) => {
      return {
        result: res.data.raw_data.reverse(),
      };
    })
    .catch((err) => {
      return {
        result: [],
        err,
      };
    });
};

const wrapPromise = (promise) => {
  let status = 'pending';
  let result = '';

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }

      return result;
    },
  };
};

export const createResource = () => {
  return {
    patients: wrapPromise(fetchPatients()),
  };
};
