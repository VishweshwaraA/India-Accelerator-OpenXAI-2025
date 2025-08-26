'use client'

import { useState } from 'react'

interface MoodResult {
  mood: string
  emoji: string
  confidence: string
}

export default function SocialNetwork() {
  const [activeTab, setActiveTab] = useState('caption')
  const [loading, setLoading] = useState(false)
  
  // Caption Generator states
  const [imageDescription, setImageDescription] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [captionCopied, setCaptionCopied] = useState(false)
  
  // Mood Checker states
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null)
  
  // Hashtag Suggestor states
  const [keywords, setKeywords] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagsCopied, setHashtagsCopied] = useState(false)

  const generateCaption = async () => {
    if (!imageDescription.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDescription })
      })
      
      const data = await response.json()
      if (data.caption) {
        setGeneratedCaption(data.caption)
      }
    } catch (error) {
      console.error('Error generating caption:', error)
    }
    setLoading(false)
  }

  const checkMood = async () => {
    if (!textToAnalyze.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/mood-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      })
      
      const data = await response.json()
      if (data.mood) {
        setMoodResult(data)
      }
    } catch (error) {
      console.error('Error checking mood:', error)
    }
    setLoading(false)
  }

  const suggestHashtags = async () => {
    if (!keywords.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/hashtag-suggestor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      })
      
      const data = await response.json()
      if (data.hashtags) {
        setHashtags(data.hashtags)
      }
    } catch (error) {
      console.error('Error suggesting hashtags:', error)
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'caption') {
        setCaptionCopied(true)
        setTimeout(() => setCaptionCopied(false), 2000)
      } else {
        setHashtagsCopied(true)
        setTimeout(() => setHashtagsCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEwMCwxMDAsMTIwLDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300 mb-3">SOCIALFLOW</h1>
          <p className="text-blue-100 text-lg">Next-Gen AI Tools for Social Media</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-1.5 flex space-x-1 border border-gray-700/50 shadow-2xl">
            {[
              { id: 'caption', label: '📸 Caption', desc: 'Generate Captions', gradient: 'instagram-gradient' },
              { id: 'mood', label: '😊 Mood', desc: 'Check Sentiment', gradient: 'twitter-gradient' },
              { id: 'hashtags', label: '#️⃣ Hashtags', desc: 'Suggest Tags', gradient: 'social-gradient' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-8 py-4 rounded-lg transition-all duration-300 overflow-hidden group ${
                  activeTab === tab.id
                    ? `${tab.gradient} text-white shadow-lg`
                    : 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-lg font-medium">{tab.label}</span>
                  <span className="text-xs mt-1 opacity-80">{tab.desc}</span>
                </div>
                {activeTab === tab.id && (
                  <span className="absolute -bottom-1 left-1/2 w-1/2 h-0.5 bg-white rounded-full transform -translate-x-1/2"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
          {/* Caption Generator Tab */}
          {activeTab === 'caption' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-400/30">
                <h2 className="text-2xl font-bold text-white mb-4">📸 Caption Generator</h2>
                <p className="text-white/80 mb-6">Describe your image and get an Instagram-ready caption!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Describe your image... (e.g., 'Sunset at the beach with friends')"
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={generateCaption}
                    disabled={loading || !imageDescription.trim()}
                    className="w-full px-6 py-3 instagram-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Generating Caption...' : 'Generate Caption ✨'}
                  </button>

                  {generatedCaption && (
                    <div className="bg-white/20 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-white">Your Caption:</h3>
                      <p className="text-white/90 text-lg leading-relaxed">{generatedCaption}</p>
                      <button
                        onClick={() => copyToClipboard(generatedCaption, 'caption')}
                        className={`copy-button px-4 py-2 rounded-lg font-medium ${
                          captionCopied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {captionCopied ? 'Copied! ✓' : 'Copy Caption 📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mood Checker Tab */}
          {activeTab === 'mood' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-400/30">
                <h2 className="text-2xl font-bold text-white mb-4">😊 Mood Checker</h2>
                <p className="text-white/80 mb-6">Paste any text to analyze its emotional sentiment!</p>
                
                <div className="space-y-4">
                  <textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Paste a tweet, comment, or any text here..."
                    className="w-full h-32 p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 resize-none"
                  />
                  
                  <button
                    onClick={checkMood}
                    disabled={loading || !textToAnalyze.trim()}
                    className="w-full px-6 py-3 twitter-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Analyzing Mood...' : 'Check Mood 🔍'}
                  </button>

                  {moodResult && (
                    <div className="bg-white/20 rounded-lg p-6 text-center space-y-4">
                      <div className="mood-indicator text-6xl">{moodResult.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white capitalize">{moodResult.mood}</h3>
                        <p className="text-white/80">Detected sentiment with {moodResult.confidence} confidence</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hashtag Suggestor Tab */}
          {activeTab === 'hashtags' && (
            <div className="tab-content">
              <div className="social-card rounded-2xl p-8 backdrop-blur-lg border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-400/30">
                <h2 className="text-2xl font-bold text-white mb-4">#️⃣ Hashtag Suggestor</h2>
                <p className="text-white/80 mb-6">Enter keywords and get trending hashtags for your post!</p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords... (e.g., 'travel photography nature')"
                    className="w-full p-4 rounded-lg border-0 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && suggestHashtags()}
                  />
                  
                  <button
                    onClick={suggestHashtags}
                    disabled={loading || !keywords.trim()}
                    className="w-full px-6 py-3 social-gradient text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {loading ? 'Finding Hashtags...' : 'Suggest Hashtags 🏷️'}
                  </button>

                  {hashtags.length > 0 && (
                    <div className="bg-white/20 rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold text-white">Suggested Hashtags:</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((hashtag, index) => (
                          <span key={index} className="hashtag-tag">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(hashtags.join(' '), 'hashtags')}
                        className={`copy-button px-4 py-2 rounded-lg font-medium ${
                          hashtagsCopied ? 'copied' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {hashtagsCopied ? 'Copied! ✓' : 'Copy All Hashtags 📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-blue-100/60 text-sm">
            Perfect for Instagram, Twitter, TikTok, and all your social platforms! 🚀
          </p>
          <div className="mt-4 text-xs text-gray-500">
            <p> 2023 SocialFlow AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}