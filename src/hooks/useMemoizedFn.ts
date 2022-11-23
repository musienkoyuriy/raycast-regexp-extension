import { useRef } from "react";

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

export default function useMemoizedFn<T extends noop>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  const memoizedFn = useRef<PickFunction<T>>();

  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return callbackRef.current.apply(this, args);
    };
  }
  return memoizedFn.current as T;
}
