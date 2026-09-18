import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  HeartPulse, 
  Activity, 
  Sparkles, 
  Baby, 
  ShieldCheck,
  CheckCircle2,
  X,
  Stethoscope,
  Share2
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

export const BlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalPost, setActiveModalPost] = useState<BlogPost | null>(null);

  // Sync modal with query param ?post=slug
  useEffect(() => {
    const postSlug = searchParams.get('post');
    if (postSlug) {
      const match = BLOG_POSTS.find(p => p.slug === postSlug || p.id === postSlug);
      if (match) {
        setActiveModalPost(match);
      }
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setActiveModalPost(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('post');
    setSearchParams(newParams, { replace: true });
  };

  const handleOpenPost = (post: BlogPost) => {
    setActiveModalPost(post);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('post', post.slug);
    setSearchParams(newParams);
  };

  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-2xs mb-3">
            <BookOpen className="w-4 h-4 text-[#00897b]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Doctor-Verified Health Insights
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            CarePlus <span className="text-[#00897b]">Health Journal</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Evidence-based medical articles, preventive wellness guides, and treatment insights curated by our senior faculty physicians.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search health articles, conditions..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00897b] focus:border-transparent shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#00897b] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured / Recent Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/85 backdrop-blur-md text-white border border-white/20 uppercase tracking-wide">
                    {post.category}
                  </span>
                  <span className="text-[10px] bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-[#00897b]" />
                    {post.readTime}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-400" />
                    {post.date}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 
                    onClick={() => handleOpenPost(post)}
                    className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#00897b] transition-colors mb-2 cursor-pointer font-heading"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-teal-50 text-[#00897b] flex items-center justify-center font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <strong className="block text-slate-900 font-bold leading-tight text-[11px]">{post.author}</strong>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{post.authorRole}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenPost(post)}
                    className="px-3 py-1.5 bg-teal-50 text-[#00897b] hover:bg-[#00897b] hover:text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Doctor Consultation Callout */}
        <div className="bg-gradient-to-r from-[#004d40] to-[#00796b] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Need Personal Medical Guidance?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 font-heading">
              Consult With Our Senior Specialists
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Skip waiting lines with priority online OPD booking. Instant appointment confirmation and digital WhatsApp prescription records.
            </p>
          </div>
          <Link
            to="/book"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-[#00897b] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Book Specialist Consultation
          </Link>
        </div>

      </div>

      {/* Full Article Modal Reader */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Image Header */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={activeModalPost.image}
                alt={activeModalPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#00897b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeModalPost.category}
                  </span>
                  <span className="text-[11px] text-teal-200 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {activeModalPost.readTime}
                  </span>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                    &bull; {activeModalPost.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug font-heading">
                  {activeModalPost.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Doctor Byline Card */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  {activeModalPost.authorAvatar ? (
                    <img
                      src={activeModalPost.authorAvatar}
                      alt={activeModalPost.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#e6f7f5] text-[#00897b] flex items-center justify-center font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{activeModalPost.author}</h4>
                    <p className="text-[11px] text-slate-500">{activeModalPost.authorRole}</p>
                  </div>
                </div>

                <Link
                  to="/book"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  Book OPD
                </Link>
              </div>

              {/* Summary Callout */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs sm:text-sm text-teal-950 font-medium leading-relaxed">
                <strong>Executive Summary:</strong> {activeModalPost.summary}
              </div>

              {/* Full Article Content Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeModalPost.content.map((para, idx) => (
                  <p key={idx} className="text-justify sm:text-left">
                    {para}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400">Filed Under:</span>
                {activeModalPost.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                CarePlus Hospital &bull; Medical Knowledge Center
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to="/book"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Consult Doctor</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
