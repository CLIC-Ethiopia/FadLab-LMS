
import React, { useState } from 'react';
import { Lightbulb, Cpu, PenTool, Calculator, Rocket, Briefcase, Globe, ExternalLink, Quote, BrainCircuit } from 'lucide-react';

const SteamIE: React.FC = () => {
  const [activeWord, setActiveWord] = useState<string>('Science');

  const acronyms = [
    {
      letter: 'S',
      word: 'Science',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-blue-500',
      desc: 'Understanding the natural world through observation and experiment.',
      detail: 'In the context of STEAM-IE, Science provides the foundational knowledge of how the physical world operates. It emphasizes inquiry-based learning and the scientific method to gather evidence and test hypotheses.'
    },
    {
      letter: 'T',
      word: 'Technology',
      icon: <Cpu className="w-6 h-6" />,
      color: 'bg-indigo-500',
      desc: 'Tools, systems, and methods used to solve problems.',
      detail: 'Focuses on the application of scientific knowledge for practical purposes. This includes mastery of digital tools, IoT (Internet of Things), AI, and software development to drive industrial transformation.'
    },
    {
      letter: 'E',
      word: 'Engineering',
      icon: <BrainCircuit className="w-6 h-6" />,
      color: 'bg-orange-500',
      desc: 'The design, building, and use of engines, machines, and structures.',
      detail: 'Engineering connects abstract scientific principles to concrete solutions. It involves the rigorous design process, prototyping, and systems thinking required for mechanization and industrialization.'
    },
    {
      letter: 'A',
      word: 'Arts',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-pink-500',
      desc: 'Creative expression and human-centric design.',
      detail: 'The "A" integrates design thinking, aesthetics, and creativity. It ensures that technical solutions are user-friendly, culturally relevant, and visually appealing, fostering innovation through diverse perspectives.'
    },
    {
      letter: 'M',
      word: 'Mathematics',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-teal-500',
      desc: 'The language of logic, structure, space, and change.',
      detail: 'Mathematics provides the analytical tools for modeling systems, analyzing data, and optimizing processes. It is the backbone of algorithmic thinking essential for the AI era.'
    },
    {
      letter: 'I',
      word: 'Innovation',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-yellow-500',
      desc: 'The process of creating value by applying novel solutions.',
      detail: 'Innovation in STEAM-IE moves beyond invention; it is about practical implementation. It encourages students to think outside the box to solve local challenges using global technologies.'
    },
    {
      letter: 'E',
      word: 'Entrepreneurship',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-green-600',
      desc: 'Building sustainable business models around innovations.',
      detail: 'The ultimate goal of STEAM-IE. It equips learners with the business acumen to turn technical projects into viable enterprises, driving economic growth and job creation.'
    }
  ];

  const activeItem = acronyms.find(a => a.word === activeWord) || acronyms[0];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4">
            <Rocket className="w-4 h-4 text-yellow-400" />
            <span>The FadLab Methodology</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">STEAM-IE</span>?
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            The application of applied interdisciplinary training in <strong className="text-white">Science, Technology, Engineering, Arts, and Mathematics</strong> specifically designed for <strong className="text-white">Innovation and Entrepreneurship</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Acronym */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Navigation */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {acronyms.map((item) => (
            <button
              key={item.word}
              onClick={() => setActiveWord(item.word)}
              className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border text-left
                ${activeWord === item.word 
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md scale-105' 
                  : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:rotate-3 ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <span className={`block font-bold text-lg ${activeWord === item.word ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.word}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="lg:col-span-7">
          <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col justify-center relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${activeItem.color} opacity-10 rounded-bl-full transition-colors duration-500`}></div>
            
            <div className="relative z-10 animate-fade-in" key={activeWord}>
              <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-400 dark:from-white dark:to-slate-600 mb-4 block`}>
                {activeItem.letter}
              </span>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{activeItem.word}</h2>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-6">
                {activeItem.desc}
              </p>
              <div className="h-1 w-20 bg-slate-200 dark:bg-slate-700 rounded-full mb-6">
                <div className={`h-full rounded-full ${activeItem.color} w-1/2`}></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeItem.detail}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prof Fad Attribution */}
      <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
              <img 
                src="https://ui-avatars.com/api/?name=Prof+Fad&background=0D8ABC&color=fff&size=256" 
                alt="Prof. Frehun A. Demissie" 
                className="relative w-48 h-48 rounded-full border-4 border-white dark:border-slate-700 shadow-xl object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
                 <Quote className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">The Visionary Behind STEAM-IE</h3>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-6">Prof. Frehun A. Demissie ("Prof. Fad")</p>
            
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              This unique curriculum is the result of <strong className="text-slate-900 dark:text-white">20 years of dedicated research</strong>. Prof. Fad has meticulously designed this framework to address the specific challenges of developing nations.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The methodology focuses on <strong className="text-slate-900 dark:text-white">mechanization, industrialization, and digital transformation</strong> in the era of Artificial Intelligence (AI) and the Internet of Things (IoT). It aims to bridge the gap between theoretical education and practical, wealth-creating industrial application.
            </p>
          </div>
        </div>
      </div>

      {/* Web Resources */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Further Reading & Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="https://en.unesco.org/themes/education-sustainable-development/stem" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">UNESCO</div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">STEM Education for Global Development</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
              Explore how interdisciplinary science education contributes to sustainable development goals and innovation.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Read Source <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          <a href="https://www.weforum.org/agenda/2023/01/davos23-skills-education-technology/" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">World Economic Forum</div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">The Future of Jobs: AI & Tech</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
              Insights into how digital transformation, AI, and IoT are reshaping the skills required for the workforce of the future.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Read Source <ExternalLink className="w-3 h-3" />
            </div>
          </a>

          <a href="https://clicafrica.org/" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">CLIC Africa</div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Official CLIC Hub</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
              The central hub for Creative Learning in Communities, featuring projects, news, and the broader impact of the STEAM-IE curriculum.
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Read Source <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};

export default SteamIE;
