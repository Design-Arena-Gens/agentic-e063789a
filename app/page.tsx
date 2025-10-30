'use client';

import { useState } from 'react';

interface BlogPost {
  title: string;
  content: string;
  keywords: string[];
  outline: string[];
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');

  const generateBlog = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setBlogPost(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const data = await response.json();
      setBlogPost(data);
    } catch (err) {
      setError('Failed to generate blog post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!blogPost) return;
    const text = `# ${blogPost.title}\n\n${blogPost.content}`;
    navigator.clipboard.writeText(text);
  };

  const downloadMarkdown = () => {
    if (!blogPost) return;
    const text = `# ${blogPost.title}\n\n${blogPost.content}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blogPost.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Writing Agent
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            AI-powered automation for creating high-quality blog content
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Topic *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Future of Artificial Intelligence"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="conversational">Conversational</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="short">Short (~500 words)</option>
                  <option value="medium">Medium (~1000 words)</option>
                  <option value="long">Long (~1500 words)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords (comma-separated, optional)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., AI, machine learning, automation"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={generateBlog}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Blog Post'}
            </button>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {blogPost && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {blogPost.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Copy
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Download
                </button>
              </div>
            </div>

            {blogPost.keywords.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {blogPost.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {blogPost.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
