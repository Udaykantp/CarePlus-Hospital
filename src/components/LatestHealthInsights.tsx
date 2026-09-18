import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  User, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Stethoscope,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal';

interface LatestHealthInsightsProps {
  onOpenScheduler?: (prefill?: { doctorId?: string; departmentId?: string }) => void;
  maxPosts?: number;
}

export const LatestHealthInsights: React.FC<LatestHealthInsightsProps> = ({
  onOpenScheduler,
  maxPosts = 3
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract distinct categories from blog posts
  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = (selectedCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(p => p.category === selectedCategory)
  ).slice(0, maxPosts);

  return (
    <section 
      id="latest-health-insights" 
      className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-2xs mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#00897b]" />
              <span className="text-xs font-bold tracking-wide uppercase">
                Doctor-Verified Medical Articles
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-heading leading-tight">
              Latest <span className="text-[#00897b]">Health Insights</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
              Evidence-based medical advisories, preventive wellness strategies, and clinical discoveries written by our senior specialist doctors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              id="view-all-insights-btn"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center gap-2 group whitespace-nowrap cursor-pointer"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4 text-[#00897b] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00897b] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Snippets Grid with Scroll Reveal */}
        <ScrollRevealGroup staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <ScrollRevealItem key={post.id} className="h-full">
              <article 
                id={`insight-card-${post.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill and Read Time */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 text-[#00897b]" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Date overlay */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      {post.date}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2.5">
                    <Link
                      to={`/blog?post=${post.slug}`}
                      className="block group/link"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover/link:text-[#00897b] transition-colors font-heading line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt Snippet */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author Card & CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-[#00897b] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900 truncate leading-tight">
                          {post.author}
                        </span>
                        <span className="block text-[10px] text-slate-500 truncate">
                          {post.authorRole}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/blog?post=${post.slug}`}
                      id={`read-article-btn-${post.id}`}
                      className="px-3 py-1.5 bg-[#e6f7f5] hover:bg-[#00897b] text-[#00897b] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 group/btn flex-shrink-0 shadow-2xs"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>

        {/* Bottom Banner Linking to Full Knowledge Base */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#00897b] flex items-center justify-center flex-shrink-0 border border-teal-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Have specific medical queries about any of these conditions?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our consultant doctors provide personalized OPD consultations and digital telemedicine reviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/blog"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
            >
              Browse All Topics
            </Link>
            <button
              type="button"
              onClick={() => {
                if (onOpenScheduler) onOpenScheduler();
              }}
              className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Consult Doctor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
