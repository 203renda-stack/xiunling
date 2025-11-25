import React, { useState, useEffect } from 'react';
import { MoodLog } from '../types';
import { MOODS, Icons } from '../constants';
import { analyzeMoodEntry } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTracker: React.FC = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('xinling_moods');
    if (saved) {
      setMoodLogs(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('xinling_moods', JSON.stringify(moodLogs));
  }, [moodLogs]);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    let aiFeedback = '';
    
    if (note.trim().length > 5) {
        aiFeedback = await analyzeMoodEntry(note);
    }

    const newLog: MoodLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      score: selectedMood,
      note,
      aiAnalysis: aiFeedback
    };

    setMoodLogs(prev => [newLog, ...prev]);
    setSelectedMood(null);
    setNote('');
    setIsSubmitting(false);
    setShowForm(false);
  };

  const chartData = moodLogs
    .slice()
    .reverse()
    .slice(-7) // Last 7 entries
    .map(log => ({
      date: new Date(log.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
      score: log.score
    }));

  return (
    <div className="flex flex-col h-full bg-sage-50 overflow-y-auto pb-20 no-scrollbar">
      <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">情绪日记</h2>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 text-sm font-medium text-sage-600 bg-sage-50 px-3 py-1.5 rounded-full"
            >
                <Icons.Plus className="w-4 h-4" /> 记录心情
            </button>
        </div>

        {/* Chart Area */}
        <div className="h-48 w-full bg-white">
            {chartData.length > 1 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis domain={[1, 5]} hide />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                   />
                   <Line 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#5e826c" 
                     strokeWidth={3} 
                     dot={{ fill: '#5e826c', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                     activeDot={{ r: 6 }} 
                   />
                 </LineChart>
               </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm bg-sage-50 rounded-xl border border-dashed border-sage-200">
                    记录更多数据以查看趋势
                </div>
            )}
        </div>
      </div>

      {/* Input Form Modal-like inline */}
      {showForm && (
        <div className="mx-4 mb-6 bg-white p-5 rounded-2xl shadow-sm animate-slide-up border border-sage-100">
          <h3 className="text-sm font-semibold text-slate-600 mb-4">此刻感觉如何？</h3>
          <div className="flex justify-between mb-6 px-2">
            {MOODS.map((m) => (
              <button
                key={m.score}
                onClick={() => setSelectedMood(m.score)}
                className={`flex flex-col items-center gap-1 transition-transform ${selectedMood === m.score ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <span className="text-3xl filter drop-shadow-sm">{m.emoji}</span>
                <span className={`text-xs ${selectedMood === m.score ? 'text-sage-700 font-bold' : 'text-slate-400'}`}>{m.label}</span>
              </button>
            ))}
          </div>
          
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="写下你的想法 (可选)..."
            className="w-full bg-slate-50 border-0 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-sage-400 mb-4 resize-none h-24"
          />

          <div className="flex gap-3">
             <button 
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50"
             >
                取消
             </button>
             <button
                onClick={handleSubmit}
                disabled={!selectedMood || isSubmitting}
                className="flex-1 bg-sage-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-sage-700 disabled:bg-slate-200 disabled:cursor-not-allowed shadow-sm shadow-sage-200"
            >
                {isSubmitting ? '分析中...' : '保存'}
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="px-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-wider mb-2">历史记录</h3>
        {moodLogs.map((log) => {
           const mood = MOODS.find(m => m.score === log.score);
           return (
            <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{mood?.emoji}</span>
                        <div>
                            <span className="text-sm font-semibold text-slate-700 block">{mood?.label}</span>
                            <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'})}</span>
                        </div>
                    </div>
                </div>
                {log.note && (
                    <p className="text-sm text-slate-600 mt-2 bg-sage-50/50 p-2 rounded-lg">{log.note}</p>
                )}
                {log.aiAnalysis && (
                    <div className="mt-3 flex gap-2 items-start">
                         <span className="text-xs bg-sage-100 text-sage-700 px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">AI</span>
                         <p className="text-xs text-sage-600 italic leading-relaxed">{log.aiAnalysis}</p>
                    </div>
                )}
            </div>
           )
        })}
        {moodLogs.length === 0 && !showForm && (
            <div className="text-center py-10 text-slate-400">
                <p>还没有记录哦，开始记录第一篇日记吧！</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;