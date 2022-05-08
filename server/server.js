import 'dotenv/config'

import puppeteer from 'puppeteer'
import express from 'express'
import path from 'path'
import fs from 'fs'

const app = express()

const buildPath = 'build'
const serverPath = 'server'

const secretKey = process.env.SECRET_KEY

const buildUrl = (baseUrl, query) => {
    let url = baseUrl

    const {
        mainBg,
        keyBg,
        keyColor,
        secondKeyBg,
        accentBg,
    } = query

    if (!mainBg || !keyBg || !keyColor || !secondKeyBg || !accentBg) return url

    url += `?mainBg=${mainBg}`
    url += `&keyBg=${keyBg}`
    url += `&keyColor=${keyColor}`
    url += `&secondKeyBg=${secondKeyBg}`
    url += `&accentBg=${accentBg}`
    return url
}

const parseHtml = (html, req) => {
    const baseUrl = process.env.PUBLIC_URL ?? `${req.protocol}://${req.headers.host}`

    const {
        themeName,
        author
    } = req.query

    return html
        .replace(new RegExp('{{PUBLIC_URL}}', 'g'), baseUrl)
        .replace(new RegExp('{{IMAGE}}', 'g'), buildUrl(`${baseUrl}/preview`, req.query))
        .replace(new RegExp('{{DESCRIPTION}}', 'g'), `${themeName ?? 'Theme'} by ${author ?? 'DerTyp7214'}`)
}

const analytics = async (req) => {
    const {
        mainBg,
        keyBg,
        keyColor,
        secondKeyBg,
        accentBg,
        themeName,
        author
    } = req.query

    const csvString = `${Date.now()}|${req.get('User-Agent')}|${JSON.stringify({
        mainBg, keyBg, keyColor, secondKeyBg, accentBg, themeName, author
    })}\n`

    fs.appendFileSync(path.join(serverPath, 'stats.csv'), csvString)
}

const run = async () => {
    const browser = await puppeteer.launch()

    const paths = [
        'fonts',
        'icons',
        'images',
        'static',
        'styles',
        'robots.txt',
        'asset-manifest.json',
        'manifest.webmanifest'
    ]

    for (const p of paths) app.use(`/${p}`, express.static(path.join(buildPath, p)))

    app.get('/preview', async (req, res) => {
        analytics(req)

        const page = await browser.newPage()
        await page.setContent(fs.readFileSync(path.join(serverPath, 'keyboard.html'), 'utf8'), {waitUntil: 'networkidle0'})
        await page.on('console', async (msg) => {
            const msgArgs = msg.args()
            for (const arg of msgArgs) console.log(await arg.jsonValue())
        })
        await page.evaluate(query => {
            const {
                mainBg,
                keyBg,
                keyColor,
                secondKeyBg,
                accentBg
            } = query

            const root = document.documentElement

            if (mainBg) root.style.setProperty('--main-bg', `#${mainBg}`)
            if (keyBg) root.style.setProperty('--key-bg', `#${keyBg}`)
            if (keyColor) root.style.setProperty('--key-color', `#${keyColor}`)
            if (secondKeyBg) root.style.setProperty('--second-key-bg', `#${secondKeyBg}`)
            if (accentBg) root.style.setProperty('--accent-bg', `#${accentBg}`)
        }, req.query)
        await page.waitForSelector('.keyboard_body')
        const element = await page.$('.keyboard_body')
        res.set('Content-Type', 'image/png')
        res.send(await element.screenshot())
    })

    app.get('/update/:key', (req, res) => {
        if (req.params.key === secretKey) {
            console.log('Shutting down.')
            res.send('Shutting down.')
            process.exit()
        } else res.sendStatus(401)
    })

    app.get('/status', (req, res) => {
        res.json({status: 'ok', alive: true})
    })

    app.get('/stats', async (req, res) => {
        const csv = []

        const csvString = fs.readFileSync(path.join(serverPath, 'stats.csv'), 'utf-8')

        for (const line of csvString.split('\n'))
            if (line.trim().length > 0) csv.push(line.split('|'))

        res.json(csv)
    })

    app.get('/ugly', (req, res) => {
        const baseUrl = process.env.PUBLIC_URL ?? `${req.protocol}://${req.headers.host}`

        const randomColor = () => (Math.random()*0xFFFFFF<<0).toString(16)

        const mainBg = randomColor()
        const keyBg = randomColor()
        const keyColor = randomColor()
        const secondKeyBg = randomColor()
        const accentBg = randomColor()

        res.redirect(buildUrl(baseUrl, {mainBg, keyBg, keyColor, secondKeyBg, accentBg}))
    })

    app.get('/', (req, res) => {
        if (fs.existsSync(path.join(buildPath, 'index.html'))) {
            analytics(req)

            const html = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf-8')

            res.setHeader('content-type', 'text/html')
            res.send(parseHtml(html, req))
        } else res.sendStatus(404)
    })

    app.listen(process.env.PORT ?? 1234)
}

run().then(() => console.log('Started'))