import Telegram from 'node-telegram-bot-api'

const telegramApiToken = process.env.TELEGRAM_BOT_API_TOKEN
if(!telegramApiToken) {
  throw new Error('TELEGRAM_BOT_API_TOKEN not found in .env')
}
const ownerId = Number(process.env.TELEGRAM_USER_ID)
if (!Number.isSafeInteger(ownerId)) {
  throw new Error('TELEGRAM_USER_ID is invalid or not found in .env')
}

const bot = new Telegram(telegramApiToken, { polling: false })
export async function sendStatus(status: string) {
  await bot.sendMessage(ownerId, status)
}