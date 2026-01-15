
import React, { useState, useEffect } from 'react';
import { SocialPost } from '../types';
import { sheetService } from '../services/sheetService';
import { ExternalLink, ThumbsUp, MessageCircle, Share2, Facebook, Filter, Loader2, Megaphone, Users } from 'lucide-react';

const SocialHub: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'FadLab' | 'CLIC Ethiopia'>('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await sheetService.getSocialPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load social posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeFilter === 'All' ? posts : posts.filter(p => p.source === activeFilter);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Facebook className="w-5 h-5 text-blue-200" />
            <span className="uppercase tracking-widest text-xs font-bold text-blue-200">Community & News</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">The Social Hub</h1>
          <p className="text-blue-100 max-w-lg">
            Connect with the FadLab Micro Campus. Stay updated with project announcements from FadLab and community stories from CLIC Ethiopia.
          </p>
        </div>

        <div className="flex gap-3 relative z-10">
           <a 
             href="https://facebook.com/fadlab" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-xl transition-all text-sm font-medium"
           >
             <Megaphone className="w-4 h-4" />
             Visit FadLab
           </a>
           <a 
             href="https://facebook.com/clicethiopia" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all text-sm font-bold shadow-md"
           >
             <Users className="w-4 h-4" />
             Join CLIC
           </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
        <button 
          onClick={() => setActiveFilter('All')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
            ${activeFilter === 'All' 
              ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Filter className="w-4 h-4" />
          All Posts
        </button>
        <button 
          onClick={() => setActiveFilter('FadLab')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
            ${activeFilter === 'FadLab' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800'}`}
        >
          <Megaphone className="w-4 h-4" />
          FadLab News
        </button>
        <button 
          onClick={() => setActiveFilter('CLIC Ethiopia')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
            ${activeFilter === 'CLIC Ethiopia' 
              ? 'bg-yellow-500 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-yellow-50 dark:hover:bg-slate-800'}`}
        >
          <Users className="w-4 h-4" />
          CLIC Community
        </button>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Syncing with Facebook...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <img src={post.authorAvatar} alt={post.source} className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-700" />
                       <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                         <Facebook className="w-2.5 h-2.5 text-white" />
                       </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {post.source}
                        {post.source === 'FadLab' && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Official</span>}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{post.timestamp}</p>
                    </div>
                  </div>
                  <a href={post.sourceUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Content */}
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optional Image */}
              {post.image && (
                <div className="w-full h-64 md:h-80 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img src={post.image} alt="Post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Interactions Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                 <div className="flex gap-6 px-2">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <Share2 className="w-4 h-4" />
                      <span className="font-medium">{post.shares}</span>
                    </div>
                 </div>
                 <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors">
                    View on Facebook
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialHub;
