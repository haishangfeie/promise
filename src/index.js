const Promise = require('./MyPromise')
const p = new Promise((resolve, reject) => {
  setInterval(() => {
    resolve(100)
  }, 100)
})
  .then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(200)
      }, 1000)
    })
  }, (reason) => {
    console.log('第一次reason', reason)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Promise((resolve, reject) => {
          reject('一个错误')
        }))
      }, 1000)
    })
  })
  .then((data) => {
    console.log('第二次成功', data)
  }, (reason) => {
    console.log('第二次失败', reason)
  })

