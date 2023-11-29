import { getCookies } from '@/get-cookies.js'
import './env.js'
import * as cheerio from 'cheerio'
import cookie from 'cookie'

const headers = new Headers({
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'ru',
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
})

const cookies = await getCookies()
Object.entries(cookies).forEach(([key, value]) => {
  headers.append('set-cookie', cookie.serialize(key, value))
})

const formPage = await fetch('https://www.vfsvisaservicesrussia.com/Global-PassportTracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/APnFmGO26yoncx/v5lsUb/wVhluA+MrsaR4qhJ36RK6ZG/y8XwPOv0Ny6+XCzHVqubg3u/6HzzMamE9AHR4Qk0=', {
  'headers': headers,
  'referrerPolicy': 'strict-origin-when-cross-origin',
  'body': null,
  'method': 'GET',
  'mode': 'cors',
  'credentials': 'include'
})
const formPageHTML = await formPage.text()
const responseHeaders = Array.from(formPage.headers.entries())
console.log(formPageHTML)
console.log(responseHeaders)

const dom = cheerio.load(formPageHTML)
const verificationToken = dom('input[name="__RequestVerificationToken"]').val()
console.log('token', verificationToken)
console.log('cookies', responseHeaders.filter(([key]) => key === 'set-cookie'))