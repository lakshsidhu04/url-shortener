const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

const Url = require('./models/url');
const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017/short-url';
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
});

// GET request to retrieve visit history based on shortId
app.get('/visitHistory/:shortId', async (req, res) => {
    const { shortId } = req.params;
    try {
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        res.json({numberofVisits: url.visitHistory.length, visitHistory: url.visitHistory});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    console.log('Short ID:', shortId);

    try {
        // Find URL by shortId
        const url = await Url.findOne({ shortId });
        console.log('Found URL:', url);

        if (!url) {
            console.log('URL not found for shortId:', shortId);
            return res.status(404).json({ message: 'URL not found' });
        }

        // Log visit history
        url.visitHistory.push({ date: new Date() });
        await url.save();

        // If redirect URL is absolute, redirect directly
        if (isAbsoluteUrl(url.redirectUrl)) {
            console.log('Redirecting to absolute URL:', url.redirectUrl);
            return res.redirect(url.redirectUrl);
        }

        // Otherwise, prepend http:// and redirect
        const absoluteUrl = 'http://' + url.redirectUrl;
        console.log('Redirecting to absolute URL:', absoluteUrl);
        return res.redirect(absoluteUrl);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Function to check if a URL is absolute
function isAbsoluteUrl(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}

function isUrl(str) {
    return str.startsWith('http://') || str.startsWith('https://');
}

function formatUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'http://' + url;
    }
    return url;
}


const urlRouter = require('./routes/url');
app.use('/url', urlRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
