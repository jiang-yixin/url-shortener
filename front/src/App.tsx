import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
interface ShortenResponse {
  shortUrl: string;
}

const App: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isValidUrl, setValidUrl] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<ShortenResponse>('http://localhost:3001/shorten', { longUrl });
      setShortUrl(response.data.shortUrl);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred');
      } else {
        setError('An unknown error occurred');
      }
      setShortUrl('');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(e.target.value);
    try {
      new URL(longUrl)
    } catch (error) {
      setValidUrl(false);
      return;
    }
    setValidUrl(true);
  }

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={onChange}
          required
        />
        <button type="submit">Shorten URL</button>
      </form>
      {!isValidUrl && <p style={{ color: 'red' }}>Invalid URL</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortUrl && (
        <p>
          Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </p>
      )}
    </div>
  );
};

export default App;