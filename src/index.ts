import { requestStatus } from './request.js'

await requestStatus('', 'Shchelochkov')
  .then((result) => {
    console.log(result)
    process.exit(0)
  })