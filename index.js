const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
const cors = require('cors')
app.use(cors())


async function run() {
    try {
        await client.connect();
        const database = client.db("sample_mflix");
        const movies = database.collection("movies");
        // Query for a movie that has the title 'The Room'
        const query = { title: "The Room" };
        const options = {
            // sort matched documents in descending order by rating
            sort: { "imdb.rating": -1 },
            // Include only the `title` and `imdb` fields in the returned document
            projection: { _id: 0, title: 1, imdb: 1 },
        };
        const movie = await movies.findOne(query, options);
        // since this method returns the matched document, not a cursor, print it directly
        console.log(movie);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})