export function $partial(func, ...bindArgs) {
  return function(...args) {
    return func.apply(this, bindArgs.concat(args));
  }
}
