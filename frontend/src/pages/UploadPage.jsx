// import { FileUp, Sparkles, TextCursorInput } from "lucide-react";
// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ProgressBar } from "../components/ProgressBar.jsx";
// import { Spinner } from "../components/Spinner.jsx";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import { analyzeOffer } from "../lib/api.js";
// import { supabase } from "../lib/supabaseClient.js";
// import { extractPdfText } from "../utils/extractPdfText.js";

// function excerpt(text, n = 140) {
//   const t = (text || "").replace(/\s+/g, " ").trim();
//   if (t.length <= n) return t;
//   return t.slice(0, n - 1) + "…";
// }

// export function UploadPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("pdf"); // 'pdf' | 'text'
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState("");
//   const [extracting, setExtracting] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [error, setError] = useState("");
//   const [previewScore, setPreviewScore] = useState(null);

//   // /const canAnalyze = useMemo(() => (text || '').trim().length >= 60, [text])

//   const canAnalyze = useMemo(() => {
//     const cleaned = (text || "").replace(/\s+/g, " ").trim();
//     return cleaned.length >= 60;
//   }, [text]);

//   async function onPickFile(e) {
//     setError("");
//     setPreviewScore(null);
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFile(f);

//     if (!/pdf$/i.test(f.name)) {
//       setError("Please upload a PDF file.");
//       return;
//     }

//     try {
//       setExtracting(true);
//       const extracted = await extractPdfText(f);
//       setText(extracted);
//     } catch (err) {
//       setError(err?.message || "Failed to extract text from PDF.");
//     } finally {
//       setExtracting(false);
//     }
//   }

//   async function onAnalyze() {
//     setError("");
//     setPreviewScore(null);
//     const cleaned = (text || "").trim();

//     if (cleaned.length < 60) {
//       setError("Please provide a bit more text (at least ~60 characters).");
//       return;
//     }

//     setAnalyzing(true);
//     try {
//       const result = await analyzeOffer({ text: cleaned });
//       setPreviewScore(result.scamPercent);

//       const payload = {
//         user_id: user.id,
//         input_type: mode,
//         input_excerpt: excerpt(cleaned),
//         offer_text: cleaned.slice(0, 50000),
//         scam_score: result.scamPercent,
//         hf_model: result.model,
//         labels: result.labels,
//         red_flags: result.redFlags,
//         explanation: result.explanation,
//         raw_response: result.raw,
//       };

//       const { data, error: insErr } = await supabase
//         .from("analyses")
//         .insert(payload)
//         .select("id")
//         .single();

//       if (insErr) throw new Error(insErr.message);
//       navigate(`/results/${data.id}`);
//     } catch (err) {
//       setError(err?.message || "Analysis failed.");
//     } finally {
//       setAnalyzing(false);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-semibold tracking-tight text-white">
//             Analyze a job offer
//           </h2>
//           <p className="mt-1 text-sm text-slate-300">
//             Upload an offer letter PDF or paste text. We’ll score scam
//             probability and highlight red flags.
//           </p>
//         </div>
//       </div>

//       <div className="rounded-3xl bg-white/5 p-2 ring-1 ring-white/10">
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => setMode("pdf")}
//             className={[
//               "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
//               mode === "pdf"
//                 ? "bg-white/10 text-white ring-1 ring-white/15"
//                 : "text-slate-300 hover:bg-white/5 hover:text-white",
//             ].join(" ")}
//           >
//             <FileUp className="h-4 w-4" />
//             Upload PDF
//           </button>
//           <button
//             onClick={() => setMode("text")}
//             className={[
//               "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
//               mode === "text"
//                 ? "bg-white/10 text-white ring-1 ring-white/15"
//                 : "text-slate-300 hover:bg-white/5 hover:text-white",
//             ].join(" ")}
//           >
//             <TextCursorInput className="h-4 w-4" />
//             Paste text
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
//         <div className="lg:col-span-3 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
//           {mode === "pdf" ? (
//             <div>
//               <div className="text-sm font-semibold text-white">
//                 Offer letter PDF
//               </div>
//               <div className="mt-1 text-xs text-slate-400">
//                 We’ll extract text locally in your browser.
//               </div>

//               <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-6 text-center hover:bg-slate-950/40">
//                 <input
//                   className="hidden"
//                   type="file"
//                   accept="application/pdf"
//                   onChange={onPickFile}
//                 />
//                 <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
//                   <FileUp className="h-5 w-5 text-slate-200" />
//                 </div>
//                 <div className="mt-3 text-sm text-slate-200">
//                   {file ? file.name : "Click to choose a PDF"}
//                 </div>
//                 <div className="mt-1 text-xs text-slate-400">
//                   PDF only • best results with selectable text
//                 </div>
//               </label>

//               {extracting ? (
//                 <Spinner label="Extracting text from PDF…" />
//               ) : null}
//             </div>
//           ) : (
//             <div>
//               <div className="text-sm font-semibold text-white">Offer text</div>
//               <div className="mt-1 text-xs text-slate-400">
//                 Paste the job offer message, email, or letter content.
//               </div>
//             </div>
//           )}

//           <div className="mt-5">
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-semibold text-white">
//                 Text to analyze
//               </div>
//               <div className="text-xs text-slate-400">
//                 {(text || "").length} chars
//               </div>
//             </div>
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               rows={12}
//               placeholder="Paste the job offer here, or upload a PDF above…"
//               className="mt-2 w-full resize-y rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
//             />
//           </div>

//           {error ? (
//             <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
//               {error}
//             </div>
//           ) : null}

//           <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <button
//               onClick={onAnalyze}
//               disabled={analyzing || extracting || !canAnalyze}
//               className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/10 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <Sparkles className="h-4 w-4" />
//               {analyzing ? "Analyzing…" : "Analyze with AI"}
//             </button>

//             <div className="text-xs text-slate-400">
//               Tip: include pay, company name, interview process, and any links.
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-2 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
//           <div className="text-sm font-semibold text-white">
//             What you’ll get
//           </div>
//           <div className="mt-1 text-xs text-slate-400">
//             A probability score + human-readable red flags.
//           </div>

//           <div className="mt-5 space-y-4">
//             <div className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
//               <div className="text-xs font-medium text-slate-300">
//                 Scam probability
//               </div>
//               <div className="mt-3">
//                 <ProgressBar value={previewScore ?? 0} />
//               </div>
//               <div className="mt-2 text-xs text-slate-400">
//                 {previewScore == null
//                   ? "Run analysis to see a score."
//                   : "Saved to your history automatically."}
//               </div>
//             </div>

//             <div className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
//               <div className="text-xs font-medium text-slate-300">
//                 Checks included
//               </div>
//               <ul className="mt-3 space-y-2 text-sm text-slate-200">
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
//                   Suspicious payment requests and upfront fees
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
//                   Urgency / pressure tactics and “act now” language
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
//                   Unusual hiring process (no interview, off-platform)
//                 </li>
//               </ul>
//               <div className="mt-3 text-xs text-slate-400">
//                 Powered by Hugging Face’s free inference API.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { FileUp, Sparkles, TextCursorInput } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { analyzeOffer } from "../lib/api.js";
import { supabase } from "../lib/supabaseClient.js";
import { extractPdfText } from "../utils/extractPdfText.js";

function excerpt(text, n = 140) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1) + "…";
}

export function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("pdf"); // 'pdf' | 'text'
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [previewScore, setPreviewScore] = useState(null);

  // ✅ Enable analyze only when we actually have enough extracted text
  const canAnalyze = useMemo(() => {
    const cleaned = (text || "").replace(/\s+/g, " ").trim();
    return cleaned.length >= 60;
  }, [text]);

  async function onPickFile(e) {
    setError("");
    setPreviewScore(null);

    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    if (!/pdf$/i.test(f.name)) {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setExtracting(true);

      const extracted = await extractPdfText(f);
      const cleaned = (extracted || "").replace(/\s+/g, " ").trim();

      // 🚨 IMPORTANT FIX
      if (!cleaned) {
        setText("");
        setError(
          "This PDF appears to be scanned or image-based. Please paste the text manually or upload a selectable-text PDF.",
        );
        return;
      }

      setText(cleaned);
    } catch (err) {
      setText("");
      setError(err?.message || "Failed to extract text from PDF.");
    } finally {
      setExtracting(false);
    }
  }

  async function onAnalyze() {
    setError("");
    setPreviewScore(null);

    const cleaned = (text || "").trim();

    if (cleaned.length < 60) {
      setError("Please provide a bit more text (at least ~60 characters).");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeOffer({ text: cleaned });
      setPreviewScore(result.scamPercent);

      const payload = {
        user_id: user.id,
        input_type: mode,
        input_excerpt: excerpt(cleaned),
        offer_text: cleaned.slice(0, 50000),
        scam_score: result.scamPercent,
        hf_model: result.model,
        labels: result.labels,
        red_flags: result.redFlags,
        explanation: result.explanation,
        raw_response: result.raw,
      };

      const { data, error: insErr } = await supabase
        .from("analyses")
        .insert(payload)
        .select("id")
        .single();

      if (insErr) throw new Error(insErr.message);

      navigate(`/results/${data.id}`);
    } catch (err) {
      setError(err?.message || "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Analyze a job offer
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Upload an offer letter PDF or paste text. We’ll score scam
            probability and highlight red flags.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white/5 p-2 ring-1 ring-white/10">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("pdf")}
            className={[
              "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              mode === "pdf"
                ? "bg-white/10 text-white ring-1 ring-white/15"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            <FileUp className="h-4 w-4" />
            Upload PDF
          </button>

          <button
            onClick={() => setMode("text")}
            className={[
              "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              mode === "text"
                ? "bg-white/10 text-white ring-1 ring-white/15"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            <TextCursorInput className="h-4 w-4" />
            Paste text
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          {mode === "pdf" ? (
            <div>
              <div className="text-sm font-semibold text-white">
                Offer letter PDF
              </div>
              <div className="mt-1 text-xs text-slate-400">
                We’ll extract text locally in your browser.
              </div>

              <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-4 py-6 text-center hover:bg-slate-950/40">
                <input
                  className="hidden"
                  type="file"
                  accept="application/pdf"
                  onChange={onPickFile}
                />
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <FileUp className="h-5 w-5 text-slate-200" />
                </div>
                <div className="mt-3 text-sm text-slate-200">
                  {file ? file.name : "Click to choose a PDF"}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  PDF only • best results with selectable text
                </div>
              </label>

              {extracting ? (
                <Spinner label="Extracting text from PDF…" />
              ) : null}
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-white">Offer text</div>
              <div className="mt-1 text-xs text-slate-400">
                Paste the job offer message, email, or letter content.
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                Text to analyze
              </div>
              <div className="text-xs text-slate-400">
                {(text || "").length} chars
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              placeholder="Paste the job offer here, or upload a PDF above…"
              className="mt-2 w-full resize-y rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-white ring-1 ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-500/20">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onAnalyze}
              disabled={analyzing || extracting || !canAnalyze}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/10 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {analyzing ? "Analyzing…" : "Analyze with AI"}
            </button>

            <div className="text-xs text-slate-400">
              Tip: include pay, company name, interview process, and any links.
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">
            What you’ll get
          </div>
          <div className="mt-1 text-xs text-slate-400">
            A probability score + human-readable red flags.
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
              <div className="text-xs font-medium text-slate-300">
                Scam probability
              </div>
              <div className="mt-3">
                <ProgressBar value={previewScore ?? 0} />
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {previewScore == null
                  ? "Run analysis to see a score."
                  : "Saved to your history automatically."}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-white/10">
              <div className="text-xs font-medium text-slate-300">
                Checks included
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Suspicious payment requests and upfront fees
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                  Urgency / pressure tactics and “act now” language
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Unusual hiring process (no interview, off-platform)
                </li>
              </ul>
              <div className="mt-3 text-xs text-slate-400">
                Powered by Hugging Face’s free inference API.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
