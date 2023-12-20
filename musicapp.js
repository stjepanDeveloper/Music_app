import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const LAST_FM_API_KEY = '9e64f58be70be67ee6a63c70956be8f2';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));

app.get('/', async (req, res) => {
    try {
        // Call Last.fm API to get top tracks
        const topTracksResponse = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'chart.getTopTracks',
                api_key: LAST_FM_API_KEY,
                format: 'json',
            },
        });

        // Call Last.fm API to get top artists
        const topArtistsResponse = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'chart.getTopArtists',
                api_key: LAST_FM_API_KEY,
                format: 'json',
            },
        });

        res.render('home', {
            topTracks: topTracksResponse.data.tracks.track,
            topArtists: topArtistsResponse.data.artists.artist,
        });
    } catch (error) {
        console.error('Error fetching data from Last.fm API:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/radio', (req, res) => {
    res.render('radio'); // Assuming you have a radio.ejs file in your views folder
});


// Define the route for /tags
app.get('/tags', async (req, res) => {
    try {
        // Call Last.fm API to get top tags
        const topTagsResponse = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'chart.getTopTags',
                api_key: LAST_FM_API_KEY, // Replace with your actual Last.fm API key
                format: 'json',
            },
        });

        res.render('tags', {
            topTags: topTagsResponse.data.tags.tag,
        });
    } catch (error) {
        console.error('Error fetching data from Last.fm API:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});