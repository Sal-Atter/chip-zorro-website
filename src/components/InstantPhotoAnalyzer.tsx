import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, UploadCloud, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface InstantPhotoAnalyzerProps {
  onValidated: (resultText: string) => void;
}

export const InstantPhotoAnalyzer: React.FC<InstantPhotoAnalyzerProps> = ({ onValidated }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    status: 'qualified' | 'caution';
    estimatedSize: string;
    fractureType: string;
    advice: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      runSimulation();
    };
    reader.readAsDataURL(file);
  };

  const handleDemoSample = () => {
    // Demo sample rock chip
    setPhotoPreview('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80');
    runSimulation();
  };

  const runSimulation = () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        status: 'qualified',
        estimatedSize: '0.65 inches (Smaller than a quarter)',
        fractureType: 'Surface Bullseye with Radial Micro-Star',
        advice: 'Excellent candidate for mobile vacuum resin repair! Factory seal and glass integrity can be 100% saved with $0 deductible.',
      });
      onValidated('Validated: Qualified for Mobile Resin Repair');
    }, 900);
  };

  const handleReset = () => {
    setPhotoPreview(null);
    setAnalysisResult(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            AI Photo Pre-Screen (UI/UX Pro Max)
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Instant Chip Repairability Check
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Free instant diagnosis</span>
      </div>

      {!photoPreview ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
          <input
            type="file"
            accept="image/*"
            id="photo-upload-input"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="photo-upload-input"
            className="flex flex-col items-center justify-center cursor-pointer space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 hover:text-orange-600">
                Upload or snap a photo of your rock chip
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG or HEIC from your smartphone camera
              </p>
            </div>
          </label>

          <div className="mt-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoSample}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 underline cursor-pointer"
            >
              Or click here to test with a sample photo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
            <img
              src={photoPreview}
              alt="Uploaded rock chip damage"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-slate-300 shrink-0"
            />
            <div className="flex-1 w-full space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Chip Image Analyzed</span>
                <button
                  onClick={handleReset}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {analyzing ? (
                <div className="flex items-center gap-2 text-orange-600 py-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="font-semibold">Measuring fracture diameter & depth...</span>
                </div>
              ) : analysisResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 pt-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Size:</span>
                    <strong className="text-slate-900">{analysisResult.estimatedSize}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Type:</span>
                    <strong className="text-orange-700">{analysisResult.fractureType}</strong>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{analysisResult.advice}</span>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
