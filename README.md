# Бот для автоматической проверки статуса визы на сайте vfsvisaservicesrussia.com

Работает на Node.js. Запускает headless браузер с помощью Puppeteer, который автоматически вводит данные в форму на сайте vfsvisaservicesrussia.com и проверяет статус визы. Обход капчи делается с помощью сервиса ruCaptcha (платный сервис). При изменении статуса визы отправляет уведомление в Telegram через вашего бота.

Стоимость оплаты работы рукапчи: примерно 90-160 рублей за 1000 капч. То есть, если вы делаете 12 запросов в сутки (каждые 2 часа), то вам необходимо внести на баланс рукапчи около 30 рублей за 15 дней работы бота. Если рассмотрание затянется до 45 дней, то рукапча съест от 45 до 80 рублей. Рекомендую положить 100 рублей, включить бота и забыть.

> [!IMPORTANT]
> Я ищу работу! Если вы заинтересованы в моем найме, посетите [cv.hloth.dev](https://cv.hloth.dev), чтобы просмотреть мои резюме и CV.

## Установка

1. Установите Node.js и npm
2. Скачайте исходники бота и распакуйте в любую папку
3. Откройте консоль и перейдите в папку с ботом, введите команду `npm install`, дождитесь установки зависимостей
4. Скомпилируйте проект командой `npm run build`
5. Внесите данные в файл `.env` в соответствии с инструкцией ниже или по шаблону файла `.example.env`
6. Запустите бота в фоновом (detached) режиме. Например с помощью [pm2](https://pm2.keymetrics.io/): `pm2 start "npm start" --name vfsbot`

## Файл .env

Этот шаг обязателен, потому что без него бот не сможет делать запросы к апи рукапчи для обхода reCaptchaV2 и отсылать уведомления в Телеграм. Также здесь настраиваются ваш Reference Number и Last Name.

Пример .env:
```
RUCAPTCHA_API_KEY=6Lc6BAAAAAAAAChqRbQZcn_yyyyyyyyyyyyyyyyy
TELEGRAM_BOT_API_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
TELEGRAM_USER_ID=1234567890
REFNO=FRA/DME/151123/0010/0
LASTNAME=Tiktokarev
```

- RUCAPTCHA_API_KEY — Токен [rucaptcha](https://rucaptcha.com/)
- TELEGRAM_BOT_API_TOKEN — Токен телеграм-бота, через который вам будут присылаться уведомления о статусе
- TELEGRAM_USER_ID — Ваш ID в телеграме, чтобы бот мог отправлять вам уведомления. Узнать свой ID можно у бота @userinfobot
- REFNO — Ваш Reference Number, должен быть указан на чеке на договоре
- LASTNAME — Ваша фамилия как в заграннике
