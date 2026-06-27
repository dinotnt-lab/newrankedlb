import axios from 'axios'

export default async function handler(req, res) {
    const username = req.query.username

    if (!username) {
        return res.status(400).json({
            error: 'Missing username'
        })
    }

    try {
        const response = await axios.get(
            `https://mcsrranked.com/api/users/${encodeURIComponent(username)}`
        )

        res.status(200).json(response.data)
    }
    catch (err) {
        res.status(err.response?.status || 500).json({
            error: 'Failed to fetch player data'
        })
    }
}