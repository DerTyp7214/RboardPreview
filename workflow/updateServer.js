import 'dotenv/config'

import fetch from 'node-fetch'

const baseUrl = process.PUBLIC_URL
const url = `${baseUrl}/update/${process.SECRET_KEY}`

const run = async () => {
    await fetch(url).then(body => body.text()).then(console.log).catch(console.log)

    await new Promise(async (resolve, reject) => {
        let alive = false
        let stopChecking = false
        const check = async () => {
            await fetch(`${baseUrl}/status`).then(body => body.json()).then(json => alive = !!json.alive)
            await new Promise(res => setTimeout(res, 500))
            if (!stopChecking) await check()
            else reject()
        }
        setTimeout(() => {
            stopChecking = true
        }, 1000 * 60)
        await check().then(resolve)
    }).then(() => console.log('Updated.')).catch(() => console.log('Error.'))
}

run().then(() => console.log('Done.'))