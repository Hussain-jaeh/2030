// hooks/usePreviousProps.ts

import { useEffect, useRef } from 'react';

const usePreviousProps = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePreviousProps;
