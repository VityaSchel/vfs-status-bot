import { checkTask, createTask } from '@/rucaptcha.js'
import puppeteer from 'puppeteer'

export async function requestStatus(refNo: string, lastName: string): Promise<{ ok: true, status: string } | { ok: false, errors?: string[] }> {
  console.log('Opening headless browser')
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto('https://www.vfsvisaservicesrussia.com/Global-PassportTracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/APnFmGO26yoncx/v5lsUb/wVhluA+MrsaR4qhJ36RK6ZG/y8XwPOv0Ny6+XCzHVqubg3u/6HzzMamE9AHR4Qk0=')
  await page.setViewport({ width: 1080, height: 1024 })
  console.log('Navigated to VFS check form status page')

  await page.type('input[name="RefNo"]', refNo)
  await page.type('input[name="LastName"]', lastName)

  const rucaptchaTaskID = await createTask()
  console.log('Created task for ruCaptcha. ID: ' + rucaptchaTaskID)
  const createdAt = Date.now() 

  console.log('Waiting 10 seconds before asking for solution')
  await new Promise(resolve => setTimeout(resolve, 10000))

  let attempts = 0
  const MaxTimeout = 15 * 60 * 1000 - 1000
  let captchaSolution = ''
  while (Date.now() < createdAt + MaxTimeout) {
    attempts++
    console.log(`Attempt #${attempts} to get solution for captcha`)
    const status = await checkTask(rucaptchaTaskID)
    if(status.status === 'processing') {
      console.log('Captcha is still processing, waiting 4 seconds before asking again')
      await new Promise(resolve => setTimeout(resolve, 4000))
    } else {
      captchaSolution = status.solution
      console.log('Solution for captcha found!', captchaSolution)
      break
    }
  }
  if(!captchaSolution) {
    console.log('Aborting because captcha solution was not found in 15 minutes')
    return { ok: false, errors: ['[VFS-STATUS-BOT] Captcha solution was not found in 15 minutes'] }
  }

  const pageReloaded = new Promise<void>(resolve => {
    page.once('load', () => resolve())
  })

  await page.type('textarea[id="g-recaptcha-response"]', captchaSolution)
  
  console.log('Submitting the form')
  const submitButton = await page.waitForSelector('input[type="submit"]', { visible: true })
  if (!submitButton) {
    return { ok: false, errors: ['[VFS-STATUS-BOT] Submit button not found'] }
  }
  submitButton.click()

  await pageReloaded

  const validationErrors = await page.$$('.validation-summary-errors li')
  if (validationErrors.length) {
    const errors = await Promise.all(
      validationErrors.map(async el => await el.evaluate(el => el.textContent.trim() as string))
    )
    return { ok: false, errors }
  }

  const statusEl = await page.$('.form-group ~ .form-group ~ .form-group + .clearfix + div + div')
  if (!statusEl) {
    return { ok: false, errors: ['[VFS-STATUS-BOT] Status element not found'] }
  }
  const status = await statusEl?.evaluate(el => el.textContent.trim() as string)

  await browser.close()

  return { ok: true, status }
}