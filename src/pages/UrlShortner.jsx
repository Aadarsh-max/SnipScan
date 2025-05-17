import React, { useState } from 'react';
import axios from 'axios';

const UrlShortner = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortData, setShortData] = useState(null);

  const API_BASE_URL = 'https://url-shortner-backend-pi.vercel.app';

  const handleShorten = async () => {
    if (!originalUrl.trim()) return;

    const formattedUrl = originalUrl.trim();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/short`, {
        originalUrl: formattedUrl,
      });

      setShortData({
        shortUrl: res.data.myUrl,
        qrCodeImg: res.data.qrCodeImg,
      });
    } catch (err) {
      console.error('Failed to shorten URL:', err);
      setShortData(null);
    }
  };

  const getShortCode = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch {
      return url;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
      <div className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center text-white">
        <h1 className="text-3xl font-bold mb-6">🔗Welcome To SnipScan</h1>

        <input
          type="text"
          placeholder="Enter your long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleShorten}
          disabled={!originalUrl.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          Shorten URL
        </button>

        {shortData && shortData.shortUrl && (
          <div className="mt-8 p-5 border border-gray-700 rounded-xl bg-gray-700">
            <div className="text-gray-300 mb-2 text-sm">Your shortened URL:</div>
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <a
                href={shortData.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors text-sm"
              >
                {getShortCode(shortData.shortUrl)}
              </a>

              <button
                onClick={() => copyToClipboard(shortData.shortUrl)}
                className="bg-gray-600 p-2 rounded-md hover:bg-gray-500"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>

            <div className="text-sm text-gray-400 mb-1 break-all">
              Full URL:{' '}
              <a
                href={shortData.shortUrl}
                className="underline hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortData.shortUrl}
              </a>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Click the URL or scan the QR code to visit the website
            </div>

            {shortData.qrCodeImg && (
              <div className="mt-4 flex justify-center">
                <div className="p-2 border border-gray-600 bg-gray-800 rounded-lg inline-block">
                  <img
                    src={shortData.qrCodeImg}
                    alt="QR Code for shortened URL"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortner;
