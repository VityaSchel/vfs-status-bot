export async function createTask(): Promise<number> {
  if (!process.env.RUCAPTCHA_API_KEY) {
    throw new Error('RUCAPTCHA_API_KEY not found in .env')
  }

  const task = await fetch('https://api.rucaptcha.com/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'clientKey': process.env.RUCAPTCHA_API_KEY,
      'task': {
        'type': 'RecaptchaV2TaskProxyless',
        'websiteURL': 'https://www.vfsvisaservicesrussia.com/Global-PassportTracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/APnFmGO26yoncx/v5lsUb/wVhluA+MrsaR4qhJ36RK6ZG/y8XwPOv0Ny6+XCzHVqubg3u/6HzzMamE9AHR4Qk0=',
        'websiteKey': '6Ld-Kg8UAAAAAK6U2Ur94LX8-Agew_jk1pQ3meJ1',
        'isInvisible': false
      },
      'softId': '3898'
    })
  })
  if (task.status !== 200) {
    console.error(await task.text())
    throw new Error('Could not create task for ruCaptcha')
  }

  const response = await task.json() as { errorId: number, taskId: number }
  if (response.errorId !== 0) {
    console.error(response)
    throw new Error('Error while creating task for ruCaptcha')
  }

  return response.taskId
}

export async function checkTask(taskId: number): Promise<{ status: 'ready', solution: string } | { status: 'processing' }> {
  if (!process.env.RUCAPTCHA_API_KEY) {
    throw new Error('RUCAPTCHA_API_KEY not found in .env')
  }

  const task = await fetch('https://api.rucaptcha.com/getTaskResult', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'clientKey': process.env.RUCAPTCHA_API_KEY,
      'taskId': taskId
    })
  })
  if (task.status !== 200) {
    console.error(await task.text())
    throw new Error('Could not check task with ruCaptcha API')
  }

  const response = await task.json() as { errorId: 0, status: 'ready', solution: { gRecaptchaResponse: string } } | { errorId: 0, status: 'processing' } | { errorId: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16, errorCode: string, errorDescription: string }
  if (response.errorId !== 0) {
    console.error(response)
    throw new Error('Error while creating task for ruCaptcha')
  }

  if (response.status === 'ready') {
    return { status: 'ready', solution: response.solution.gRecaptchaResponse }
  } else {
    return { status: 'processing' }
  }
}