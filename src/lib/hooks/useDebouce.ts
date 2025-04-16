import {useEffect, useState} from 'react';

const useDebounce = (val: string, delay: number) => {
  const [value, setValue] = useState(val);
  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(val);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [val]);

  return value;
};

export default useDebounce;
