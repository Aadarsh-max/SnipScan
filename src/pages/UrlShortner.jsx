import React, { useState } from "react";
import axios from "axios";

const UrlShortner = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortData, setShortData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "https://url-shortner-backend-pi.vercel.app";

  const isValidUrl = (url) => {
    try {
      const validUrl = new URL(url);
      return ["http:", "https:"].includes(validUrl.protocol);
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!originalUrl.trim()) return;

    if (!isValidUrl(originalUrl.trim())) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      setShortData(null);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/short`, {
        originalUrl: originalUrl.trim(),
      });

      setShortData({
        shortUrl: res.data.myUrl,
        qrCodeImg: res.data.qrCodeImg,
      });
    } catch (err) {
      console.error("Failed to shorten URL:", err);
      setShortData(null);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getShortCode = (url) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch {
      return url;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md border">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🔗 SnipScan
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Paste a valid URL to shorten it.
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <div className="text-red-600 text-sm mb-3 text-left">{error}</div>
        )}

        <button
          onClick={handleShorten}
          disabled={!originalUrl.trim() || loading}
          className={`w-full flex items-center justify-center gap-2 ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2.5 rounded-md font-medium transition-all cursor-pointer`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {shortData && shortData.shortUrl && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
            <div className="text-gray-600 mb-2 text-sm">
              Your shortened URL:
            </div>
            <div className="flex items-center gap-2 mb-3 justify-center">
              <a
                href={shortData.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 underline text-sm cursor-pointer"
              >
                {getShortCode(shortData.shortUrl)}
              </a>

              <button
                onClick={() => copyToClipboard(shortData.shortUrl)}
                className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                📋 Copy
              </button>
            </div>

            <div className="text-sm text-gray-500 break-all mb-2">
              Full URL:{" "}
              <a
                href={shortData.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline cursor-pointer"
              >
                {shortData.shortUrl}
              </a>
            </div>

            {shortData.qrCodeImg && (
              <div className="mt-4 flex justify-center">
                <img
                  src={shortData.qrCodeImg}
                  alt="QR Code"
                  className="w-32 h-32 border border-gray-200 p-1 rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortner;
