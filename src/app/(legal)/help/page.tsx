import React from 'react';
import { PlayCircle, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function HowToGuide() {
  return (
    <div className="min-h-screen bg-white text-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Quick Start Guide</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            How to Use
          </h1>
          <p className="text-xl text-gray-500">DNA Cloner • Ghostwriter AI</p>
        </div>

        <div className="space-y-8">
          
          {/* STEP 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold text-xl border border-gray-200">
                  1
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Source Video</h3>
                
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-900 mb-1">
                        Paste a YouTube URL featuring the speaker you want to clone.
                      </p>
                      <p className="text-sm text-gray-500">
                        The AI will analyze their speaking style and tone.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      🚫 No Music Streams
                    </span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      ⏱️ Under 15 mins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                  2
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-2xl font-bold text-indigo-900">The DNA Process</h3>
                  <span className="text-xs font-bold bg-white text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200 uppercase shadow-sm">
                    Required
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* Sub-step A */}
                  <div className="pl-6 border-l-2 border-indigo-200">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-50"></div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2">A. Extract DNA</h4>
                      <p className="text-base text-gray-600 mb-3">
                        Click "Extract DNA". The AI analyzes ideas and context from the video.
                      </p>
                      
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4" />
                        <span>Wait for checkmark</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sub-step B */}
                  <div className="pl-6 border-l-2 border-indigo-200">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-50"></div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2">B. Apply Style</h4>
                      <p className="text-base text-gray-600 mb-4">
                        You <span className="font-bold text-indigo-600 underline decoration-indigo-300">must</span> select a voice from the library.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-lg">👤</span>
                            <strong className="text-gray-900 font-bold text-base">Original Speaker</strong>
                          </div>
                          <span className="text-sm text-gray-500">Mimics their exact tone.</span>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-lg">🚀</span>
                            <strong className="text-gray-900 font-bold text-base">Founder Persona</strong>
                          </div>
                          <span className="text-sm text-gray-500">Applies a viral style.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-bold text-xl border border-gray-200">
                  3
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate & Refine</h3>
                
                <p className="text-base text-gray-600 mb-5">
                  Click <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">Ghostwrite</span> to generate content. Takes 10-30 seconds.
                </p>
                
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-indigo-100 shadow-sm">
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-gray-900 font-bold">Pro Tip</strong>
                        <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">Formatting</span>
                      </div>
                      <p className="text-sm text-gray-600">
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
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="text-gray-900 font-bold text-xl">Troubleshooting</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">⏱️</span>
                <span className="text-gray-900 font-semibold">Video Too Long</span>
              </div>
              <span className="text-sm text-gray-500">Must be under 15 minutes (Free).</span>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">❌</span>
                <span className="text-gray-900 font-semibold">Processing Failed</span>
              </div>
              <span className="text-sm text-gray-500">No captions or age restricted.</span>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="text-gray-900 font-semibold">Rate Limit</span>
              </div>
              <span className="text-sm text-gray-500">Wait 60s between clicks.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}