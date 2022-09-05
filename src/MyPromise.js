const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
class MyPromise {
  constructor (executor) {
    this.status = PENDING
    this.value = null
    this.reason = null

    this.resolveCallbacks = []
    this.rejectCallbacks = []

    executor(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve (value) {
    if (this.status === PENDING) {
      this.value = value
      this.status = RESOLVED
      this.resolveCallbacks.forEach(onFul => {
        onFul()
      })
    }
  }
  reject (reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      this.rejectCallbacks.forEach(onRejected => {
        onRejected()
      })
    }
  }
  then (onFul, onRejected) {

    onFul = typeof onFul === 'function' ? onFul : p => p
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {
      throw reason
    }
    const promise2 = new MyPromise((resolve, reject) => {
      const resolveFn = () => {
        setTimeout(() => {
          try {
            const x = onFul(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      const rejectFn = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      switch (this.status) {
        case PENDING:
          this.resolveCallbacks.push(resolveFn)
          this.rejectCallbacks.push(rejectFn)
          break
        case RESOLVED: {
          resolveFn()
          break
        }
        case REJECTED: {
          rejectFn()
          break
        }

        default:
          break
      }
    })
    return promise2
  }
}

function resolvePromise (value, promise, resolve, reject) {
  if (value === promise) {
    throw new TypeError('Chaining cycle detected for promise')
  }

  if (value && (typeof value === 'object' || typeof value === 'function')) {
    let called = false
    try {
      const then = value.then

      if (typeof then === 'function') {
        return then.call(value, (data) => {
          if(called) {
            return
          }
          called = true
          return resolvePromise(data, promise, resolve, reject)
        }, (reason) => {
          if(called) {
            return
          }
          called = true
          return reject(reason)
        })
      }
      return resolve(value)
    } catch (error) {
      if(called) {
        return
      }
      called = true
      return reject(error)
    }
  }
  resolve(value)
}

module.exports = MyPromise