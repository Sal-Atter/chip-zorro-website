import React, { useState } from 'react';
import { Star, ShieldCheck, Plus, Check } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New review form
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [vehicle, setVehicle] = useState('');
  const [serviceCategory, setServiceCategory] = useState<CustomerReview['serviceCategory']>('Bullseye Chip');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [savedReplacementCost, setSavedReplacementCost] = useState(950);
  const [technicianMentioned, setTechnicianMentioned] = useState('Marcus "Zorro" Vance');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.serviceCategory.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment || !title) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author,
      location: location || 'Metro Area',
      rating,
      date: 'Just now',
      vehicle: vehicle || 'Standard Vehicle',
      serviceCategory,
      title,
      comment,
      savedReplacementCost,
      verifiedRepair: true,
      technicianMentioned,
    };

    onAddReview(newRev);
    setShowAddModal(false);
    setAuthor('');
    setLocation('');
    setVehicle('');
    setTitle('');
    setComment('');
    setToastMessage('Thank you! Your verified Chip Zorro review has been published.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section id="reviews-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              Verified Client Experiences
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Reviews · Windshields Saved by Chip Zorro
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Read how our mobile resin injection saved motorists hundreds of dollars and kept their factory windshields and camera seals intact.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-start gap-4 sm:gap-6 shrink-0 w-full md:w-auto">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">4.99</div>
              <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">720+ Factory Windshields Saved</div>
            </div>

            <div className="hidden sm:block h-10 w-px bg-slate-200" />

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 p-1 bg-slate-100 rounded-lg max-w-fit">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'bullseye', label: 'Bullseye Chip' },
            { id: 'starburst', label: 'Starburst Break' },
            { id: 'crack', label: 'Short Crack Fix' },
            { id: 'mobile', label: 'Mobile Driveway' },
            { id: 'insurance', label: 'Insurance $0 Deductible' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-orange-700">{rev.serviceCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rev.date}</span>
                  </div>
                  {rev.savedReplacementCost > 0 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
                      Saved ~${rev.savedReplacementCost}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{rev.author}</span>
                  {rev.verifiedRepair && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Repair</span>
                    </span>
                  )}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {rev.vehicle} · {rev.location}
                </div>
                {rev.technicianMentioned && (
                  <div className="text-[11px] text-orange-700 font-medium">
                    Serviced by: {rev.technicianMentioned}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Write Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Review Chip Zorro Service</h3>
                  <p className="text-xs text-slate-500">Share how we saved your factory windshield</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Michael Rossi"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City / Neighborhood</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Westlake, OR"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vehicle</label>
                    <input
                      type="text"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      placeholder="e.g. 2024 Subaru Outback"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value as CustomerReview['serviceCategory'])}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                    >
                      <option value="Bullseye Chip">Bullseye Chip</option>
                      <option value="Starburst Break">Starburst Break</option>
                      <option value="Short Crack Fix">Short Crack Fix</option>
                      <option value="Mobile Driveway Service">Mobile Driveway Service</option>
                      <option value="Insurance $0 Deductible">Insurance $0 Deductible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">
                      {rating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Avoided a $1,200 replacement! 20 minute driveway fix."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Review</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the chip repair went, how clear the glass looks, technician punctuality..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
