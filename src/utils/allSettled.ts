export interface PromiseResolution<T> {
  status: 'fulfilled';
  value: T;
}

export interface PromiseRejection {
  status: 'rejected';
  reason: Error;
}

export type PromiseResult<T> = PromiseResolution<T> | PromiseRejection;

// @TODO: these types don't actually work.. at all...
const allSettled = <T>(promises: Promise<T>[]): Promise<PromiseResult<T>[]> => {
  let wrappedPromises = promises.map(p =>
    Promise.resolve(p).then(
      val => ({ status: 'fulfilled', value: val }),
      (err: Error) => ({ status: 'rejected', reason: err })
    )
  );

  // @ts-expect-error - typescript isn't smart enough to see the disjoint here
  return Promise.all(wrappedPromises);
};

export default allSettled;
