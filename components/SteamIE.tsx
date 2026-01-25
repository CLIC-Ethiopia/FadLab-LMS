
import React, { useState } from 'react';
import { 
  Lightbulb, 
  Cpu, 
  PenTool, 
  Calculator, 
  Rocket, 
  Briefcase, 
  Globe, 
  ExternalLink, 
  Quote, 
  BrainCircuit, 
  ChevronRight, 
  Beaker, 
  Factory, 
  ShieldCheck, 
  Award,
  BookOpenCheck,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  History,
  Brain
} from 'lucide-react';

const SteamIE: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const pipeline = [
    {
      letter: 'S',
      word: 'Science',
      phase: 'Phase 1: Exploration',
      icon: <Globe className="w-6 h-6" />,
      color: 'blue',
      hook: 'Discovery is the starting point of every industrial revolution.',
      application: 'We start by understanding the "Why." Science allows us to investigate local natural resources and biological laws to identify potential value. At FadLab, students might study the chemical properties of agricultural waste before deciding how to process it.',
      pipelineContext: 'Science provides the raw curiosity and empirical truth that justifies building anything in the first place.',
      skills: ['Hypothesis Testing', 'Data Literacy', 'Environmental Analysis', 'Material Discovery']
    },
    {
      letter: 'T',
      word: 'Technology',
      phase: 'Phase 2: Creation',
      icon: <Cpu className="w-6 h-6" />,
      color: 'indigo',
      hook: 'Selecting the digital and mechanical leverage to interact with nature.',
      application: 'Technology is our toolbox. Once the science is understood, we select the software, IoT sensors, and AI models required to measure, monitor, and automate. We focus on 4th Industrial Revolution tools that offer exponential efficiency.',
      pipelineContext: 'Technology provides the modern "organs" (sensors/chips) that will eventually animate our machines.',
      skills: ['IoT Protocol Design', 'Software Logic', 'Digital Interfacing', 'Systems Integration']
    },
    {
      letter: 'E',
      word: 'Engineering',
      phase: 'Phase 2: Creation',
      icon: <BrainCircuit className="w-6 h-6" />,
      color: 'orange',
      hook: 'The structural realization of conceptual ideas into physical systems.',
      application: 'Now we build the "Body." Engineering at FadLab is about structural integrity and mechanical movement. Whether it is a 3D-concrete printed wall or a robotic harvester, we move from digital technology to physical hardware.',
      pipelineContext: 'Engineering turns digital logic into physical reality through rapid prototyping and structural mechanics.',
      skills: ['Rapid Prototyping', 'Structural Mechanics', 'Hardware Assembly', 'CAD/CAM Mastery']
    },
    {
      letter: 'A',
      word: 'Arts',
      phase: 'Phase 3: Refinement',
      icon: <PenTool className="w-6 h-6" />,
      color: 'pink',
      hook: 'Humanizing technology for accessibility and cultural resonance.',
      application: 'A machine without Art is a machine without a user. We integrate Design Thinking and Visual Aesthetics to ensure our engineering is culturally appropriate, intuitive, and ethical for the Ethiopian context.',
      pipelineContext: 'The Arts bridge the gap between "it works" and "people want to use it," adding the crucial human-centric layer.',
      skills: ['User-Experience (UX)', 'Industrial Aesthetics', 'Cultural Design', 'Ethics in Tech']
    },
    {
      letter: 'M',
      word: 'Mathematics',
      phase: 'Phase 3: Refinement',
      icon: <Calculator className="w-6 h-6" />,
      color: 'teal',
      hook: 'The precision required for safety, efficiency, and industrial scale.',
      application: 'Math is the language of reliability. We use algorithmic optimization to ensure our designs use the least amount of material for the most strength, and that our systems can scale from one unit to a million.',
      pipelineContext: 'Mathematics provides the verification and optimization that allows a prototype to become a mass-producible product.',
      skills: ['Algorithmic Optimization', 'Statistical Quality Control', 'Structural Calculation', 'Scaling Models']
    },
    {
      letter: 'I',
      word: 'Innovation',
      phase: 'Phase 4: Realization',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'yellow',
      hook: 'Localized adaptation to solve specific developmental bottlenecks.',
      application: 'This is the "FadLab Pivot." We take a refined STEAM product and find a novel, localized way to solve a developmental challenge. Innovation is not just about new tech; it is about new utility for our specific community.',
      pipelineContext: 'Innovation identifies the unique market fit and specialized use-case for the Ethiopian and African industry.',
      skills: ['Problem Re-framing', 'Market Adaptation', 'Novel Utility', 'Value Proposition']
    },
    {
      letter: 'E',
      word: 'Entrepreneurship',
      phase: 'Phase 4: Realization',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'green',
      hook: 'Building the economic engine that sustains the solution.',
      application: 'The finish line is industrial wealth. We equip students with the business acumen to build startups around their innovations, managing supply chains and teams to ensure the project creates jobs and community prosperity.',
      pipelineContext: 'Entrepreneurship is the sustainable "battery" that keeps the innovation alive and growing in the real economy.',
      skills: ['Venture Management', 'Supply Chain Logic', 'Leadership', 'Financial Modeling']
    }
  ];

  const current = pipeline[activeStep];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 text-blue-600 border-blue-200';
      case 'teal': return 'bg-teal-500 text-teal-600 border-teal-200';
      case 'indigo': return 'bg-indigo-500 text-indigo-600 border-indigo-200';
      case 'orange': return 'bg-orange-500 text-orange-600 border-orange-200';
      case 'pink': return 'bg-pink-500 text-pink-600 border-pink-200';
      case 'yellow': return 'bg-yellow-500 text-yellow-600 border-yellow-200';
      case 'green': return 'bg-green-600 text-green-600 border-green-200';
      default: return 'bg-slate-500 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20 max-w-6xl mx-auto">
      
      {/* Hero: Sequential Methodology */}
      <div className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">
          <Target className="w-4 h-4" />
          The Industrial Lifecycle
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">S-T-E-A-M-I-E</span> Sequence
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Successful industrialization follows a logical order. From <span className="font-semibold text-slate-800 dark:text-slate-200">scientific discovery</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">entrepreneurial scale</span>, our methodology mirrors the lifecycle of a real-world project.
        </p>
      </div>

      {/* Horizontal Pipeline Journey */}
      <div className="relative pt-12 pb-8">
        <div className="absolute top-[84px] left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 hidden lg:block rounded-full">
           <div 
             className="h-full bg-indigo-500 transition-all duration-700 rounded-full" 
             style={{ width: `${(activeStep / (pipeline.length - 1)) * 100}%` }}
           ></div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4 relative z-10 overflow-x-auto no-scrollbar pb-4">
          {pipeline.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className="flex flex-col items-center min-w-[120px] group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4
                ${activeStep === idx 
                  ? `${getColorClasses(item.color).split(' ')[0]} text-white border-white dark:border-slate-900 scale-125 shadow-xl shadow-indigo-500/20` 
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-50 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 shadow-sm'
                }`}
              >
                {item.icon}
              </div>
              <span className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors
                ${activeStep === idx ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}
              `}>
                {item.word}
              </span>
              <div className={`w-2 h-2 rounded-full mt-2 transition-all duration-500 ${activeStep === idx ? 'bg-indigo-500 scale-100' : 'bg-transparent scale-0'}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl min-h-[550px] flex flex-col relative overflow-hidden transition-all duration-300">
             {/* Large Watermark Letter */}
             <div className="absolute -top-10 -right-10 text-[18rem] font-black text-slate-50 dark:text-slate-800/20 pointer-events-none select-none leading-none">
                {current.letter}
             </div>

             <div className="relative z-10 space-y-10 animate-fade-in" key={activeStep}>
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white ${getColorClasses(current.color).split(' ')[0]}`}>
                         {current.phase}
                      </span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                     {current.word}
                   </h2>
                   <p className="text-xl font-medium text-slate-600 dark:text-slate-300 mt-4 leading-relaxed italic border-l-4 border-indigo-500 pl-6">
                     "{current.hook}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Beaker className="w-4 h-4" /> Lab Implementation
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {current.application}
                      </p>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Zap className="w-4 h-4" /> Pipeline Perspective
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {current.pipelineContext}
                      </p>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Tanigble Professional Skills</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {current.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                           <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                              <CheckCircle className="w-4 h-4" />
                           </div>
                           <span className="text-slate-700 dark:text-slate-300 font-bold">{skill}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Context Panels */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <div className="bg-indigo-600 text-white rounded-[2rem] p-8 flex-1 flex flex-col justify-between shadow-lg shadow-indigo-500/20">
              <div>
                 <Sparkles className="w-10 h-10 mb-6 text-indigo-200" />
                 <h3 className="text-2xl font-bold mb-4">Why the Sequence?</h3>
                 <p className="text-indigo-100 leading-relaxed mb-4">
                   Traditional STEM often skips <strong>Engineering</strong> or <strong>Innovation</strong>, leading to "theoretical startups" that cannot manufacture locally.
                 </p>
                 <p className="text-indigo-50 text-sm italic">
                   "We respect the order of industrial evolution to build lasting wealth."
                 </p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                 <div className="flex items-center gap-3 text-sm font-bold">
                    <BookOpenCheck className="w-5 h-5" />
                    Project-Based Logic
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Methodology Journey</h3>
              <div className="space-y-2">
                 {pipeline.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveStep(i)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all
                        ${activeStep === i ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                      `}
                    >
                       <span className={`text-sm font-bold ${activeStep === i ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {i + 1}. {p.word}
                       </span>
                       <ChevronRight className={`w-4 h-4 ${activeStep === i ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Meet the Visionary: Prof. Fad Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
         <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 lg:w-2/5 relative">
               <img 
                 src="https://ui-avatars.com/api/?name=Frehun+Demissie&background=0D8ABC&color=fff&size=512" 
                 alt="Prof. Frehun A. Demissie" 
                 className="w-full h-full object-cover aspect-square md:aspect-auto"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:bg-gradient-to-r"></div>
               <div className="absolute bottom-8 left-8 text-white">
                  <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Methodologist & Founder</h4>
                  <p className="text-3xl font-black">Prof. Frehun Adefris</p>
               </div>
            </div>
            
            <div className="p-8 md:p-12 md:w-1/2 lg:w-3/5 space-y-8 flex flex-col justify-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest self-start">
                  <ShieldCheck className="w-4 h-4" />
                  20 Years of Strategic Research
               </div>
               
               <div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">The Vision Behind S-T-E-A-M-I-E</h3>
                  <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                     <p>
                        "My research into the industrial history of developing nations led to a simple truth: scientific capability without <strong>Engineering</strong> is a dream, and engineering without <strong>Innovation</strong> is a replica. We needed a pipeline that moved science through the physical world into the economic world."
                     </p>
                     <p>
                        By enforcing this specific acronym sequence, FadLab ensures that students don't just learn "subjects"—they learn the <strong className="text-slate-900 dark:text-white">Industrial Process</strong>.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focus Area</p>
                     <p className="text-slate-700 dark:text-slate-200 font-bold">Industrial Mechanization</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Thesis</p>
                     <p className="text-slate-700 dark:text-slate-200 font-bold">Wealth via Applied Innovation</p>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100 dark:border-slate-800 italic text-slate-400 flex items-start gap-3">
                  <Quote className="w-8 h-8 text-indigo-200 flex-shrink-0" />
                  <p className="text-sm">
                    "We are building the backbone of the next African economy, one sequential innovation at a time."
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Global Context Resources */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             <Globe className="w-6 h-6 text-indigo-500" />
             Continental Strategic Alignment
           </h3>
           <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-6 hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: CLIC Africa */}
          <a href="https://clicafrica.org/" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ExternalLink className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">CLIC Africa Official</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                 Explore the Creative Learning in Communities roadmap for continental STEAM-IE implementation.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
               Explore Website <ChevronRight className="w-4 h-4" />
            </div>
          </a>

          {/* Card 2: Smart Business Platform (GenAI) */}
          <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full cursor-pointer">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Business Platform</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                 Access our GenAI-powered business idea bank. Translate your STEAM-IE prototypes into viable, scalable market solutions.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
               Launch Idea Bank <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: African Industrial Revolutions */}
          <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full cursor-pointer">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">African Industrial Context</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                 A deep dive into Africa's unique industrial trajectory, focusing on leapfrogging technologies and 4IR frameworks.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
               Explore Timeline <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Future Skills & Demand */}
          <div className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full cursor-pointer">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Future STEAM-IE Demand</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                 Mapping the 2030 skill-sets required to transform the African economy through high-value industrial manufacturing.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
               View Skill Map <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 5: Academic Roadmap */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Academic Roadmap</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                 Detailed breakdown of course sequencing and credit-alignment with national technical standards.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
               View Roadmap <ChevronRight className="w-4 h-4" />
            </div>
          </a>

          {/* Card 6: The Whitepaper */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="group bg-slate-900 p-8 rounded-3xl shadow-xl transition-all hover:-translate-y-2 flex flex-col justify-between h-full">
            <div>
               <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Factory className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-bold text-white mb-3">The Whitepaper</h4>
               <p className="text-sm text-slate-400 leading-relaxed mb-6">
                 Scientific data behind the 20 years of research on why the STEAM-IE sequence works for developing nations.
               </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
               Download PDF <ChevronRight className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};

export default SteamIE;
