export async function inSequence(promises: Promise<any>[]) {
  const result = []
  for (let promise of promises) {
    result.push(await promise)
  }
  return result
}
