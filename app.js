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

app.listen(3000, () => {
    console.log('http://localhost:3000')
})