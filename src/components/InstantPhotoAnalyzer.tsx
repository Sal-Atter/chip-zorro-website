// DRAFT — drop-in replacement for src/components/InstantPhotoAnalyzer.tsx
// Turns the mock (900ms setTimeout always returning "qualified") into a real
// Gemini vision assessment. Requires VITE_GEMINI_API_KEY at build time and
// @google/genai (already in package.json).
//
// Verify at implementation: model id, response.text accessor, responseSchema
// shape in the installed @google/genai v2 SDK.

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ChipAssessment {
  verdict: 'repair' | 'replace' | 'unsure';
  damageType: string;
  estimatedSizeInches: number | null;
  confidence: number; // 0-100
  advice: string;
}

interface InstantPhotoAnalyzerProps {
  onValidated: (resultText: string) => void;
}

const MODEL_ID = 'gemini-2.5-flash'; // verify current flash model id at build time

const ASSESSOR_PROMPT = `You are a windshield damage assessor for Chip Zorro, a mobile windshield CHIP REPAIR company (they repair chips; they do not do full replacements in-house).
Examine the photo of windshield damage and reply with JSON only, no markdown fences:
{
  "verdict": "repair" | "replace" | "unsure",
  "damageType": "short label, e.g. Bullseye, Star break, Combination break, Long crack, Edge crack, Surface pit",
  "estimatedSizeInches": number or null (largest dimension of the damage, best estimate; null if unclear),
  "confidence": 0-100,
  "advice": "1-2 sentence plain-English guidance for the vehicle owner"
}
Rules:
- verdict "repair" when the damage looks like a chip, bullseye, star or combination break roughly quarter-sized (about 1 inch or less) and not touching the very edge of the glass.
- verdict "replace" when you see a crack longer than about 6 inches, damage at the glass edge, large damage directly in the driver's line of sight, or multiple spreading cracks.
- verdict "unsure" when the photo is blurry, too dark, shows no clear damage, or does not appear to be a windshield. Keep confidence low and explain what to re-photograph in advice.
- This is a preliminary remote estimate; the on-site technician makes the final call.`;

// Downscale to max 1024px JPEG so API calls stay fast and cheap.
async function photoToInlineData(file: File): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const maxDim = 1024;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
}

async function assessChip(file: File): Promise<ChipAssessment> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) throw new Error('Analyzer is not configured yet (missing API key).');

  const ai = new GoogleGenAI({ apiKey });
  const { base64, mimeType } = await photoToInlineData(file);

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: [
      { inlineData: { mimeType, data: base64 } },
      { text: ASSESSOR_PROMPT },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          verdict: { type: 'string', enum: ['repair', 'replace', 'unsure'] },
          damageType: { type: 'string' },
          estimatedSizeInches: { type: 'number', nullable: true },
          confidence: { type: 'number' },
          advice: { type: 'string' },
        },
        required: ['verdict', 'damageType', 'confidence', 'advice'],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? '{}') as ChipAssessment;
  if (!parsed.verdict || !parsed.advice) throw new Error('Unrecognized analyzer response.');
  return parsed;
}

const VERDICT_UI: Record<ChipAssessment['verdict'], { label: string; badge: string; icon: React.ReactNode }> = {
  repair: {
    label: 'Qualified for mobile resin repair',
    badge: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
  },
  replace: {
    label: 'Likely needs replacement, not repair',
    badge: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
  },
  unsure: {
    label: 'Could not assess this photo',
    badge: 'bg-slate-100 border-slate-200 text-slate-800',
    icon: <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />,
  },
};

export const InstantPhotoAnalyzer: React.FC<InstantPhotoAnalyzerProps> = ({ onValidated }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ChipAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const runAnalysis = async (file: File) => {
    setAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const assessment = await assessChip(file);
      setResult(assessment);
      const ui = VERDICT_UI[assessment.verdict];
      onValidated(`AI assessment: ${ui.label} — ${assessment.damageType}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
      runAnalysis(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRetry = () => {
    if (pendingFile) runAnalysis(pendingFile);
  };

  const handleReset = () => {
    setPhotoPreview(null);
    setResult(null);
    setError(null);
    setPendingFile(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            AI Photo Pre-Screen
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
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {analyzing ? (
                <div className="flex items-center gap-2 text-orange-600 py-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="font-semibold">AI is examining the damage…</span>
                </div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 pt-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Type:</span>
                    <strong className="text-orange-700">{result.damageType}</strong>
                  </div>
                  {result.estimatedSizeInches != null && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Est. size:</span>
                      <strong className="text-slate-900">
                        ~{result.estimatedSizeInches.toFixed(1)} in
                      </strong>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Confidence:</span>
                    <strong className="text-slate-900">{Math.round(result.confidence)}%</strong>
                  </div>
                  <div className={`p-2.5 border rounded-lg flex items-start gap-2 ${VERDICT_UI[result.verdict].badge}`}>
                    {VERDICT_UI[result.verdict].icon}
                    <span className="text-[11px] leading-relaxed">
                      <strong>{VERDICT_UI[result.verdict].label}.</strong> {result.advice}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Preliminary AI estimate — our technician confirms the final call on arrival.
                  </p>
                </motion.div>
              ) : error ? (
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs font-semibold text-orange-700 hover:text-orange-900 underline cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
