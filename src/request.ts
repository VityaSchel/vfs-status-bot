import puppeteer from 'puppeteer'

export async function requestStatus(refNo: string, lastName: string): Promise<{ ok: true, status: string } | { ok: false, errors?: string[] }> {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://www.vfsvisaservicesrussia.com/Global-PassportTracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/APnFmGO26yoncx/v5lsUb/wVhluA+MrsaR4qhJ36RK6ZG/y8XwPOv0Ny6+XCzHVqubg3u/6HzzMamE9AHR4Qk0=')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  await page.type('input[name="RefNo"]', refNo)
  await page.type('input[name="LastName"]', lastName)

  const verificationToken = await page.waitForSelector('input[name="__RequestVerificationToken"]')
  console.log('Vertification Token:', await verificationToken?.evaluate(el => el.getAttribute('value')))

  for (let i = 0; i < 10; i++) {
    console.log(10 - i, 'seconds left')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const pageReloaded = new Promise<void>(resolve => {
    page.once('load', () => resolve())
  })

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