const express = require('express')
const path = require('path')

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
    }
    catch {
        res.status(500).json({
            error: 'Failed to fetch player data'
        })
    }
})

app.get('/player/:username', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/player.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT)