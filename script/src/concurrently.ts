import { log } from '@ph/common-utils'

export async function concurrently<T, R>(iter: Iterable<T>, action: (unit: T, index: number, self: T[]) => Promise<R>, limit = Infinity): Promise<R[]> {
  const items = Array.from(iter)
  if (limit < 0) {
    limit = Infinity
    log.info('limit < 0 = true and then it don\'t work.')
  }
  if (limit === Infinity || limit >= items.length) {
    return Promise.all(items.map(action))
  }

  const workingPromises: Promise<number>[] = []
  const result: Promise<R>[] = []

  for (let i = 0; i < limit; i++) {
    const promise = action(items[i], i, items)
    const thenPromise = promise.then(() => i)
    workingPromises.push(thenPromise)
    result.push(promise)
  }

  for (let i = limit; i < items.length; i++) {
    const index = await Promise.race(workingPromises)
    const promise = action(items[i], i, items)
    workingPromises[index] = promise.then(() => index)
    result.push(promise)
  }

  return Promise.all(result)
}
