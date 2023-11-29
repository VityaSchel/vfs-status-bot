import './env.js'
import { requestStatus } from './request.js'
import { sendStatus } from './telegram.js'

const refno = process.env.REFNO
const lastname = process.env.LASTNAME
if(!refno || !lastname) {
  throw new Error('REFNO or LASTNAME not found in .env')
}

const result = await requestStatus(refno, lastname)
if (result.ok) {
  await sendStatus('[VFS-STATUS-BOT] ' + result.status)
} else {
  if (result.errors) {
    await sendStatus(result.errors.join('\n'))
  } else {
    await sendStatus('[VFS-STATUS-BOT] Unknown error while parsing status page')
  }
}
process.exit(0)