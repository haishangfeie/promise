var promisesAplusTests = require("promises-aplus-tests")
const Promise = require('./MyPromise')

Promise.deferred = function () {
  let deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

promisesAplusTests(Promise, function (err) {
  if (err) {
    console.log('测试出现错误', err)
  } else {
    console.log('测试通过')
  }
})