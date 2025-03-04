import express, { Request, Response } from 'express';
import validator from 'validator';
import { nanoid } from 'nanoid';
import connectDB from './db';
import Url from './url.model';
import cors from 'cors';

const app = express();
const port = 3001;

connectDB();

app.use(express.json());
app.use(cors());

app.post('/shorten', async (req: Request, res: Response) => {

  const { longUrl } = req.body;
  if (!longUrl || !validator.isURL(longUrl)) {
    return res.status(400).json({ error: 'Invalid long URL' });
  }

  try {

    const cleanLongUrl = longUrl.trim();

    const existingUrl = await Url.findOne({
      longUrl: cleanLongUrl
    })
    if (existingUrl) {
      return res.status(400).json({ error: 'The url already exists' });
    }

    const shortId = nanoid(10);

    const newUrl = new Url({
      shortId,
      longUrl: cleanLongUrl
    });

    await newUrl.save();

    const shortUrl = `http://localhost:${port}/${shortId}`;
    res.json({ shortUrl });

  } catch (error) {
    console.error('Error saving URL to database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.get('/healthcheck', async (req: Request, res: Response) => {

  return res.status(200).json({ message: "welcome" });

});

app.get('/:shortId', async (req: Request, res: Response) => {

  const { shortId } = req.params;

  try {

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(url.longUrl);

  } catch (error) {
    console.error('Error fetching URL from database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
