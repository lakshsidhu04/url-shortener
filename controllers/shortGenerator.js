const shortid = require('shortid');
const Url = require('../models/url');

async function handleUrlShorten(req, res) {
    if (!req.body.redirectUrl) {
        return res.status(400).json({ message: 'Invalid URL' });
    }

    const { redirectUrl } = req.body;
    const shortId = '_' + shortid.generate(); // Prefix shortId to avoid conflicts

    try {
        const urlExists = await Url.findOne({ redirectUrl });
        if (urlExists) {
            console.log('URL already exists:', urlExists);
            return res.json(urlExists);
        }
        const newUrl = await Url.create({ redirectUrl, shortId, visitHistory: [] });
        console.log('New URL created:', newUrl);
        res.json(newUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { handleUrlShorten };
