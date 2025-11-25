import React from 'react';
import { Resource } from '../types';
import { Icons } from '../constants';

const RESOURCES: Resource[] = [
  {
    id: 'crisis-1',
    title: '全国心理危机干预热线',
    description: '24小时免费热线，提供紧急心理支持。',
    type: 'hotline',
    phone: '400-161-9995'
  },
  {
    id: 'crisis-2',
    title: '青少年公共服务热线',
    description: '专门针对青少年的心理咨询与法律帮助。',
    type: 'hotline',
    phone: '12355'
  },
  {
    id: 'med-1',
    title: '3分钟呼吸练习',
    description: '通过简单的呼吸引导，快速缓解急性焦虑。吸气4秒，屏息7秒，呼气8秒。',
    type: 'audio',
    duration: '3 min'
  },
  {
    id: 'art-1',
    title: '了解认知行为疗法 (CBT)',
    description: '我们的想法如何影响我们的情绪？了解识别负面思维模式的基础知识。',
    type: 'article',
    link: '#'
  },
  {
    id: 'med-2',
    title: '睡前身体扫描',
    description: '帮助你在睡前放松全身肌肉，改善睡眠质量。',
    type: 'audio',
    duration: '10 min'
  }
];

const ResourceLibrary: React.FC = () => {
  return (
    <div className="bg-sage-50 h-full overflow-y-auto pb-24 px-4 pt-6 no-scrollbar">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">探索资源</h2>

      {/* Crisis Card */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                <Icons.Alert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-rose-800">紧急求助</h3>
        </div>
        <p className="text-sm text-rose-700 mb-4 leading-relaxed">
            如果你感到非常痛苦，或者有伤害自己的念头，请不要独自承受。这里有人愿意倾听。
        </p>
        <div className="space-y-2">
            {RESOURCES.filter(r => r.type === 'hotline').map(r => (
                <a 
                    key={r.id}
                    href={`tel:${r.phone}`}
                    className="flex items-center justify-between bg-white rounded-xl p-3 border border-rose-100 shadow-sm active:scale-95 transition-transform"
                >
                    <span className="font-medium text-rose-700">{r.title}</span>
                    <span className="font-bold text-rose-600">{r.phone}</span>
                </a>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-700 mb-3">冥想与放松</h3>
        <div className="space-y-3">
            {RESOURCES.filter(r => r.type === 'audio').map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                            <span className="text-lg">🎧</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{r.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{r.description}</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md whitespace-nowrap">{r.duration}</span>
                </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-700 mb-3">心理阅读</h3>
        <div className="space-y-3">
            {RESOURCES.filter(r => r.type === 'article').map(r => (
                <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Icons.Book className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{r.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;