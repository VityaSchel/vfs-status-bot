import chrome from 'chrome-cookies-secure'

export async function getCookies() {

  const cookies1 = await new Promise<Record<string,string>>(resolve => {
    chrome.getCookies('https://vfsvisaservicesrussia.com', function (err, cookies) {
      resolve(cookies)
    })
  })
  const cookies2 = await new Promise<Record<string,string>>(resolve => {
    chrome.getCookies('https://www.vfsvisaservicesrussia.com', function (err, cookies) {
      resolve(cookies)
    })
  })

  const cookies = Object.assign({}, cookies1, cookies2)
  return cookies
}