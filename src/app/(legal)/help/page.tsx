import React from 'react';
import { PlayCircle, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function HowToGuide() {
  return (
    <div className="min-h-screen bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-900 bg-opacity-30 border border-indigo-700 rounded-full">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">Quick Start Guide</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            How to Use
          </h1>
          <p className="text-xl text-gray-400">DNA Cloner • Ghostwriter AI</p>
        </div>

        <div className="space-y-8">
          
          {/* STEP 1 */}
          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-2xl border border-gray-800">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-xl border border-gray-700">
                  1
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Select Source Video</h3>
                
                <div className="bg-black bg-opacity-40 p-5 rounded-xl border border-gray-800 mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-900 bg-opacity-30 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-base text-white mb-1">
                        Paste a YouTube URL featuring the speaker you want to clone.
                      </p>
                      <p className="text-sm text-gray-500">
                        The AI will analyze their speaking style and tone.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-400 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                      🚫 No Music Streams
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                      ⏱️ Under 15 mins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-indigo-950 bg-opacity-30 p-6 rounded-2xl border border-indigo-900">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-2xl font-bold text-white">The DNA Process</h3>
                  <span className="text-xs font-bold bg-indigo-900 bg-opacity-50 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-700 uppercase">
                    Required
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* Sub-step A */}
                  <div className="pl-6 border-l-2 border-indigo-800">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-400"></div>
                      
                      <h4 className="text-lg font-bold text-white mb-2">A. Extract DNA</h4>
                      <p className="text-base text-gray-300 mb-3">
                        Click "Extract DNA". The AI analyzes ideas and context from the video.
                      </p>
                      
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 bg-green-900 bg-opacity-30 px-4 py-2 rounded-lg border border-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Wait for checkmark</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sub-step B */}
                  <div className="pl-6 border-l-2 border-indigo-800">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-400"></div>
                      
                      <h4 className="text-lg font-bold text-white mb-2">B. Apply Style</h4>
                      <p className="text-base text-gray-300 mb-4">
                        You <span className="font-bold text-indigo-300 underline">must</span> select a voice from the library.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-lg">👤</span>
                            <strong className="text-white font-bold text-base">Original Speaker</strong>
                          </div>
                          <span className="text-sm text-gray-400">Mimics their exact tone.</span>
                        </div>
                        
                        <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-lg">🚀</span>
                            <strong className="text-white font-bold text-base">Founder Persona</strong>
                          </div>
                          <span className="text-sm text-gray-400">Applies a viral style.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-2xl border border-gray-800">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-xl border border-gray-700">
                  3
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Generate & Refine</h3>
                
                <p className="text-base text-gray-300 mb-5">
                  Click <span className="font-bold text-white bg-indigo-900 bg-opacity-40 px-2 py-1 rounded border border-indigo-700">Ghostwrite</span> to generate content. Takes 10-30 seconds.
                </p>
                
                <div className="bg-indigo-950 bg-opacity-40 border border-indigo-800 p-5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-white font-bold">Pro Tip</strong>
                        <span className="text-xs text-indigo-400 bg-indigo-900 bg-opacity-40 px-2 py-0.5 rounded border border-indigo-700">Formatting</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Use the editor to break text into short 1-2 sentence paragraphs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TROUBLESHOOTING */}
        <div className="mt-16 pt-10 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-900 bg-opacity-30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h4 className="text-white font-bold text-xl">Troubleshooting</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-800">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">⏱️</span>
                <span className="text-white font-semibold">Video Too Long</span>
              </div>
              <span className="text-sm text-gray-400">Must be under 15 minutes (Free).</span>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-800">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">❌</span>
                <span className="text-white font-semibold">Processing Failed</span>
              </div>
              <span className="text-sm text-gray-400">No captions or age restricted.</span>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-5 rounded-lg border border-gray-800">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="text-white font-semibold">Rate Limit</span>
              </div>
              <span className="text-sm text-gray-400">Wait 60s between clicks.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
