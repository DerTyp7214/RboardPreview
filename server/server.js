import 'dotenv/config'

import puppeteer from 'puppeteer'
import express from 'express'
import path from 'path'
import fs from 'fs'
import JSZip from 'jszip'
import {metadata, styleSheetMd, styleSheetMdBorder} from '../src/variables.js'

const app = express()

const buildPath = 'build'
const serverPath = 'server'

const secretKey = process.env.SECRET_KEY

const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16)
    let G = parseInt(color.substring(3, 5), 16)
    let B = parseInt(color.substring(5, 7), 16)

    R = parseInt(String(R * (100 + percent) / 100))
    G = parseInt(String(G * (100 + percent) / 100))
    B = parseInt(String(B * (100 + percent) / 100))

    R = (R < 255) ? R : 255
    G = (G < 255) ? G : 255
    B = (B < 255) ? B : 255

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16))
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16))
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16))

    return "#" + RR + GG + BB
}

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

const generatePreview = async (browser, query, options) => {
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
    }, query)
    await page.waitForSelector('.keyboard_body')
    const element = await page.$('.keyboard_body')
    return await element.screenshot(options)
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

        res.set('Content-Type', 'image/png')
        res.send(await generatePreview(browser, req.query))
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

    app.get('/get', async (req, res) => {

        const {
            mainBg,
            keyBg,
            keyColor,
            secondKeyBg,
            accentBg,
            themeName,
            author
        } = Object.assign({themeName: metadata.id, author: 'DerTyp7214'}, req.query)

        const escapedThemeName = themeName.replace(new RegExp(' ', 'g'), '_')

        const png = await generatePreview(browser, req.query, {
            type: 'png',
            encoding: 'base64'
        }).then(base64 => base64.replace('data:image/png;base64,', ''))

        const themeZip = new JSZip()

        const variables = [
            `@def web_color_bg #${mainBg};`,
            `@def web_color_label #${keyColor};`,
            `@def web_color_accent #${accentBg};`,
            `@def web_color_accent_pressed ${shadeColor(`#${accentBg}`, 5)};`,
            `@def web_color_key_bg #${keyBg};`,
            `@def web_color_key_bg_pressed #${secondKeyBg};`,
            `@def web_color_secondary_key_bg #${secondKeyBg};`,
            `@def web_color_secondary_key_bg_pressed ${shadeColor(`#${secondKeyBg}`, 5)};`
        ]

        themeZip.file('metadata.json', JSON.stringify(metadata, null, 2))
        themeZip.file('style_sheet_md2.css', styleSheetMd)
        themeZip.file('style_sheet_md2_border.css', styleSheetMdBorder)
        themeZip.file('variables.css', variables.join('\n'))

        const packZip = new JSZip()

        const colors = [
            ntc.name(`#${mainBg}`)[0],
            ntc.name(`#${keyColor}`)[0],
            ntc.name(`#${accentBg}`)[0],
            ntc.name(`#${keyBg}`)[0],
            ntc.name(`#${secondKeyBg}`)[0]
        ].filter(color => color != null)

        packZip.file('pack.meta', `name=${themeName}\nauthor=${author}${colors.length ? `\ntags=${colors.join(',')}` : ''}`)
        packZip.file(`${escapedThemeName}.zip`, await themeZip.generateAsync({type: 'base64'}), {base64: true})
        packZip.file(escapedThemeName, png, {base64: true})

        res.setHeader('Content-disposition', `attachment; filename=${themeName}.pack`)
        res.setHeader('Content-type', 'application/pack')
        packZip.generateNodeStream({type: 'nodebuffer'}).pipe(res)
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