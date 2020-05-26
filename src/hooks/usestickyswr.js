import produce from 'immer';
import {useState} from 'react';
import {useUpdateEffect} from 'react-use';
import useSWR from 'swr';

export function useStickySWR(key, fetcher, swrOptions, ...args) {
  const [options, setOptions] = useState(swrOptions);

  const {data, isValidating, error, ...rest} = useSWR(
    key,
    fetcher,
    options,
    ...args
  );

  useUpdateEffect(() => {
    setOptions(
      produce(options, (draftOptions) => {
        draftOptions.initialData = data;
      })
    );
  }, [data]);

  return {
    ...rest,
    isValidating,
    error,
    data,
  };
}

export default useStickySWR;
