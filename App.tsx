import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import ResourceLibrary from './components/ResourceLibrary';
import NavBar from './components/NavBar';
import { View } from './types';
import { DISCLAIMER_TEXT } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has seen disclaimer
    const seen = localStorage.getItem('xinling_disclaimer_seen');
    if (!seen) {
      setShowDisclaimer(true);
    }
  }, []);

  const acceptDisclaimer = () => {
    localStorage.setItem('xinling_disclaimer_seen', 'true');
    setShowDisclaimer(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'mood':
        return <MoodTracker />;
      case 'resources':
        return <ResourceLibrary />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-sage-50 text-slate-800 font-sans overflow-hidden flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative w-full max-w-lg mx-auto bg-white sm:shadow-xl sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:overflow-hidden border-slate-100">
        {renderView()}
        
        {/* Navigation is absolutely positioned inside the container for mobile feel on desktop */}
        <NavBar currentView={currentView} setView={setCurrentView} />
      </main>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center text-2xl mb-4 text-sage-600">
               👋
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">欢迎来到 心灵 (XinLing)</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {DISCLAIMER_TEXT}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={acceptDisclaimer}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm shadow-sage-200"
              >
                我明白了
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">
              您的聊天数据仅存储在本地设备上。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;