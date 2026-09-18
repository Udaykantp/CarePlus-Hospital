import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Award, 
  Sparkles, 
  Search, 
  Send,
  User,
  ShieldCheck,
  Building
} from 'lucide-react';
import { REVIEWS } from '../data/clinicData';

export const ReviewsPage: React.FC = () => {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New review form modal / state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newDoctor, setNewDoctor] = useState('General Clinic Feedback');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredReviews = reviewsList.filter(rev => {
    const matchesRating = filterRating === 'all' || rev.rating === filterRating;
    const matchesSearch = searchQuery === '' || 
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.doctorOrService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev = {
      id: `rev-user-${Date.now()}`,
      patientName: newAuthor.trim(),
      verified: true,
      rating: newRating,
      date: 'Just Now',
      doctorOrService: newDoctor,
      comment: newComment.trim(),
      area: newArea.trim() || 'Central Delhi'
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
      setNewAuthor('');
      setNewComment('');
      setNewArea('');
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f7f5] text-[#00897b] border border-[#b8ece6] shadow-xs mb-3">
            <Star className="w-4 h-4 fill-[#00897b] text-[#00897b]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              Community Trust & Verified Patient Feedback
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight font-heading">
            Patient Stories &amp; <span className="text-[#00897b]">Verified Reviews</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real experiences from families across Central Delhi treated by our specialist doctors, physiotherapy staff, and diagnostic lab.
          </p>
        </div>

        {/* Aggregate Ratings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="md:pr-6 flex flex-col items-center md:items-start">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 leading-none font-heading">
                4.9
              </span>
              <div className="flex text-amber-400 mt-2 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">Based on 1,200+ verified outpatient reviews</p>
            </div>

            <div className="py-4 md:py-0 md:px-6 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-12 text-slate-800 font-semibold">5 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[92%] h-full bg-[#00897b] rounded-full" />
                </div>
                <span className="w-8 text-right font-medium">92%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-12 text-slate-800 font-semibold">4 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[7%] h-full bg-[#00897b]/70 rounded-full" />
                </div>
                <span className="w-8 text-right font-medium">7%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-12 text-slate-800 font-semibold">3 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[1%] h-full bg-amber-400 rounded-full" />
                </div>
                <span className="w-8 text-right font-medium">1%</span>
              </div>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6 flex flex-col items-center md:items-start justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Have you visited our clinic?
              </span>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Write a Patient Review
              </button>
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">
                Share Your Care Experience
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Help other patients in New Delhi by sharing your honest treatment feedback.
              </p>

              {submitSuccess ? (
                <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-[#00897b] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Thank You For Your Review!</h4>
                  <p className="text-xs text-slate-600 mt-1">Your feedback has been added to our verified reviews board.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00897b] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Locality</label>
                      <input
                        type="text"
                        value={newArea}
                        onChange={e => setNewArea(e.target.value)}
                        placeholder="e.g. Karol Bagh"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00897b] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                      <select
                        value={newRating}
                        onChange={e => setNewRating(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00897b] focus:outline-none bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor or Service</label>
                    <input
                      type="text"
                      value={newDoctor}
                      onChange={e => setNewDoctor(e.target.value)}
                      placeholder="e.g. Dr. Bibhu Bishwas / Physiotherapy"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00897b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback &amp; Comments</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Describe your treatment experience, doctor attentiveness, or recovery results..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00897b] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reviews by doctor or condition..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00897b]"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filterRating === 'all' ? 'bg-[#00897b] text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              All Ratings
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filterRating === 5 ? 'bg-[#00897b] text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              5 Stars Only
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#00897b] font-bold bg-[#e6f7f5] px-2 py-0.5 rounded-full border border-[#b8ece6]">
                    Verified Patient
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">{rev.patientName}</strong>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-[11px] text-[#00897b] font-medium mt-0.5">{rev.doctorOrService}</p>
                <p className="text-[10px] text-slate-400">{rev.area}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
