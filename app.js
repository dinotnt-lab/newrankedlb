import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/player/:username', async (req, res) => {
    const username = req.params.username

    try {
        const response = await fetch(
            `https://mcsrranked.com/api/users/${encodeURIComponent(username)}`
        )

        const data = await response.json()
        res.json(data)
    } catch (e) {
        res.status(500).json({ error: 'failed' })
    }
})

app.get('/player/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/player.html'))
})

app.get('/api/matches/:username', async (req, res) => {
    const username = req.params.username.toLowerCase()

    const cached = matchCache.get(username)

    if (cached && cached.expires > Date.now()) {
        return res.json(cached.data)
    }

    try {
        let matches = []
        let lowest = 2147483646

        while (true) {
            const response = await fetch(
                `https://api.mcsrranked.com/users/${encodeURIComponent(username)}/matches?count=100${lowest ? `&before=${lowest}` : ''}`
            )

            const x = await response.json()
            const data = Array.isArray(x.data) ? x.data : []

            data.forEach(match => {
                if (match.id < lowest) {
                    lowest = match.id
                }
            })

            matches.push(...data)

            if (data.length < 100) {
                break
            }
        }

        matchCache.set(username, {
            data: matches,
            expires: Date.now() + CACHE_TIME
        })
        res.json(matches)
    } catch (e) {
        res.status(500).json({ error: 'failed' })
    }
})

const matchCache = new Map()
const CACHE_TIME = 10 * 60 * 1000 // 5 minutes

setInterval(() => {
    const now = Date.now()

    for (const [username, cached] of matchCache) {
        if (cached.expires <= now) {
            matchCache.delete(username)
            console.log('deleted -> ', username)
            console.log(matchCache)
        }
    }
}, 60 * 1000)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})