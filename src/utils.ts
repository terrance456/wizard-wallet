export function debounce<T extends unknown[]>(fn: (...args: T) => void, seconds: number = 300) {
  let timerId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), seconds);
  };
}
