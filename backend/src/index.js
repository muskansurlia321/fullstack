// require("dotenv").config();

// const cors = require("cors");
// const express = require("express");
// const { z } = require("zod");
// const {
//   FLAG_PATTERNS,
//   findFirstIndex,
//   snippetAround,
//   uniqueByTitle,
// } = require("./redFlags.js");

// const PORT = Number(process.env.PORT || 5174);
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// const HF_API_TOKEN = process.env.HF_API_TOKEN || "";
// const HF_MODEL = process.env.HF_MODEL || "facebook/bart-large-mnli";

// const app = express();
// app.use(express.json({ limit: "1mb" }));
// app.use(
//   cors({
//     origin: FRONTEND_ORIGIN,
//     credentials: false,
//   }),
// );

// app.get("/health", (_req, res) => {
//   res.json({ ok: true });
// });

// function detectRedFlags(text) {
//   const flags = [];
//   for (const p of FLAG_PATTERNS) {
//     const idx = findFirstIndex(p.re, text);
//     if (idx >= 0) {
//       flags.push({ title: p.title, snippet: snippetAround(text, idx) });
//     }
//   }
//   return uniqueByTitle(flags).slice(0, 10);
// }

// function buildExplanation({ scamPercent, redFlagsCount }) {
//   if (scamPercent >= 80) {
//     return `This offer looks highly suspicious (${scamPercent.toFixed(
//       1,
//     )}% scam probability). ${redFlagsCount ? `We found ${redFlagsCount} common red-flag pattern(s) in the text.` : "The language resembles known scam patterns."} Always verify the recruiter and company through official channels.`;
//   }
//   if (scamPercent >= 50) {
//     return `This offer shows some suspicious signals (${scamPercent.toFixed(
//       1,
//     )}% scam probability). ${redFlagsCount ? `We matched ${redFlagsCount} red-flag pattern(s).` : "Consider double-checking details like domain/email legitimacy, interview process, and payment requests."}`;
//   }
//   return `This offer looks more likely legitimate (${scamPercent.toFixed(
//     1,
//   )}% scam probability). ${redFlagsCount ? `However, we still matched ${redFlagsCount} red-flag pattern(s), so verify carefully.` : "Still verify company identity and avoid sharing sensitive info until you confirm authenticity."}`;
// }

// function adjustWithRedFlags(baseProb, redFlags) {
//   let penalty = 0;

//   for (const flag of redFlags) {
//     switch (flag.title) {
//       case "Upfront payment or fees":
//         penalty += 0.25;
//         break;
//       case "Gift cards / crypto / wire transfer":
//         penalty += 0.3;
//         break;
//       case "No interview / instant hire":
//         penalty += 0.2;
//         break;
//       case "Urgency / pressure tactics":
//         penalty += 0.15;
//         break;
//       case "Off-platform communication":
//         penalty += 0.15;
//         break;
//       case "Personal / financial info request":
//         penalty += 0.3;
//         break;
//       default:
//         penalty += 0.1;
//     }
//   }

//   return Math.min(1, baseProb + penalty);
// }

// async function callHuggingFaceZeroShot({ model, text }) {
//   const endpoint = `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(
//     model,
//   )}`;

//   const payload = {
//     inputs: text,
//     parameters: {
//       candidate_labels: [
//         "job scam",
//         "employment fraud",
//         "fake job offer",
//         "legitimate job offer",
//         "real internship offer",
//       ],
//       hypothesis_template: "This job offer is {}.",
//     },
//   };

//   async function doRequest() {
//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });
//     const data = await res.json().catch(() => ({}));
//     return { res, data };
//   }

//   let { res, data } = await doRequest();

//   // HF free inference can cold-start models and return 503 with an estimated wait time.
//   if (!res.ok && res.status === 503 && Number.isFinite(data?.estimated_time)) {
//     const ms = Math.min(
//       15000,
//       Math.max(500, Math.ceil(data.estimated_time * 1000) + 500),
//     );
//     await new Promise((r) => setTimeout(r, ms));
//     ({ res, data } = await doRequest());
//   }

//   if (!res.ok) {
//     const details =
//       data?.error ||
//       data?.message ||
//       `Hugging Face request failed (${res.status})`;
//     const err = new Error(details);
//     err.status = res.status;
//     err.raw = data;
//     throw err;
//   }

//   return data;
// }

// app.post("/api/analyze", async (req, res) => {
//   try {
//     if (!HF_API_TOKEN) {
//       return res.status(500).json({
//         error:
//           "Server misconfigured: set HF_API_TOKEN in backend/.env to call Hugging Face.",
//       });
//     }

//     const schema = z.object({
//       text: z.string().min(60).max(50000),
//       model: z.string().min(3).max(200).optional(),
//     });

//     const parsed = schema.safeParse(req.body);
//     if (!parsed.success) {
//       return res
//         .status(400)
//         .json({ error: "Invalid input.", issues: parsed.error.issues });
//     }

//     const text = parsed.data.text.trim();
//     const model = (parsed.data.model || HF_MODEL).trim();

//     const redFlags = detectRedFlags(text);
//     const raw = await callHuggingFaceZeroShot({ model, text });

//     const labels = Array.isArray(raw?.labels)
//       ? raw.labels.map((label, i) => ({
//           label,
//           score: Number(raw?.scores?.[i] ?? 0),
//         }))
//       : [];

//     const scamObj = labels.find(
//       (l) =>
//         String(l.label).toLowerCase().includes("scam") ||
//         String(l.label).toLowerCase().includes("fraud") ||
//         String(l.label).toLowerCase().includes("fake"),
//     );

//     const baseProbability = scamObj
//       ? Math.max(0, Math.min(1, scamObj.score))
//       : 0;

//     const scamProbability = adjustWithRedFlags(baseProbability, redFlags);

//     const scamPercent = scamProbability * 100;

//     const explanation = buildExplanation({
//       scamPercent,
//       redFlagsCount: redFlags.length,
//     });

//     return res.json({
//       model,
//       scamProbability,
//       scamPercent,
//       labels,
//       explanation,
//       redFlags,
//       raw,
//     });
//   } catch (err) {
//     const status =
//       err?.status && Number.isFinite(err.status) ? err.status : 500;
//     return res.status(status).json({
//       error: err?.message || "Server error.",
//     });
//   }
// });

// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`TrustHire backend listening on http://localhost:${PORT}`);
// });

require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { z } = require("zod");
const {
  FLAG_PATTERNS,
  findFirstIndex,
  snippetAround,
  uniqueByTitle,
} = require("./redFlags.js");

const PORT = Number(process.env.PORT || 5174);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const HF_API_TOKEN = process.env.HF_API_TOKEN || "";

// ✅ Faster model (fix 504 issue)
const HF_MODEL = process.env.HF_MODEL || "valhalla/distilbart-mnli-12-1";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: false,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

function detectRedFlags(text) {
  const flags = [];
  for (const p of FLAG_PATTERNS) {
    const idx = findFirstIndex(p.re, text);
    if (idx >= 0) {
      flags.push({ title: p.title, snippet: snippetAround(text, idx) });
    }
  }
  return uniqueByTitle(flags).slice(0, 10);
}

function buildExplanation({ scamPercent, redFlagsCount }) {
  if (scamPercent >= 80) {
    return `This offer looks highly suspicious (${scamPercent.toFixed(
      1,
    )}% scam probability). ${
      redFlagsCount
        ? `We found ${redFlagsCount} common red-flag pattern(s) in the text.`
        : "The language resembles known scam patterns."
    } Always verify the recruiter and company through official channels.`;
  }
  if (scamPercent >= 50) {
    return `This offer shows some suspicious signals (${scamPercent.toFixed(
      1,
    )}% scam probability). ${
      redFlagsCount
        ? `We matched ${redFlagsCount} red-flag pattern(s).`
        : "Consider double-checking details like domain/email legitimacy, interview process, and payment requests."
    }`;
  }
  return `This offer looks more likely legitimate (${scamPercent.toFixed(
    1,
  )}% scam probability). ${
    redFlagsCount
      ? `However, we still matched ${redFlagsCount} red-flag pattern(s), so verify carefully.`
      : "Still verify company identity and avoid sharing sensitive info until you confirm authenticity."
  }`;
}

function adjustWithRedFlags(baseProb, redFlags) {
  let penalty = 0;

  for (const flag of redFlags) {
    switch (flag.title) {
      case "Upfront payment or fees":
        penalty += 0.25;
        break;
      case "Gift cards / crypto / wire transfer":
        penalty += 0.3;
        break;
      case "No interview / instant hire":
        penalty += 0.2;
        break;
      case "Urgency / pressure tactics":
        penalty += 0.15;
        break;
      case "Off-platform communication":
        penalty += 0.15;
        break;
      case "Personal / financial info request":
        penalty += 0.3;
        break;
      default:
        penalty += 0.1;
    }
  }

  return Math.min(1, baseProb + penalty);
}

// ✅ Retry wrapper
async function retryHF(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return retryHF(fn, retries - 1);
    }
    throw err;
  }
}

async function callHuggingFaceZeroShot({ model, text }) {
  const endpoint = `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(
    model,
  )}`;

  const payload = {
    inputs: text,
    parameters: {
      candidate_labels: [
        "job scam",
        "employment fraud",
        "fake job offer",
        "legitimate job offer",
        "real internship offer",
      ],
      hypothesis_template: "This job offer is {}.",
    },
  };

  async function doRequest() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // ✅ 20 sec timeout

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      // ✅ Handle model loading case
      if (data?.error && data.error.toLowerCase().includes("loading")) {
        throw new Error("Model is loading, please try again in a few seconds");
      }

      return { res, data };
    } finally {
      clearTimeout(timeout);
    }
  }

  let { res, data } = await doRequest();

  // Retry if cold start
  if (!res.ok && res.status === 503 && Number.isFinite(data?.estimated_time)) {
    const ms = Math.min(
      15000,
      Math.max(500, Math.ceil(data.estimated_time * 1000) + 500),
    );
    await new Promise((r) => setTimeout(r, ms));
    ({ res, data } = await doRequest());
  }

  if (!res.ok) {
    const details =
      data?.error ||
      data?.message ||
      `Hugging Face request failed (${res.status})`;
    const err = new Error(details);
    err.status = res.status;
    throw err;
  }

  return data;
}

app.post("/api/analyze", async (req, res) => {
  try {
    if (!HF_API_TOKEN) {
      return res.status(500).json({
        error:
          "Server misconfigured: set HF_API_TOKEN in backend/.env to call Hugging Face.",
      });
    }

    const schema = z.object({
      text: z.string().min(60).max(50000),
      model: z.string().min(3).max(200).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input.",
        issues: parsed.error.issues,
      });
    }

    const text = parsed.data.text.trim();
    const model = (parsed.data.model || HF_MODEL).trim();

    // ✅ Limit text (avoid timeout)
    const trimmedText = text.slice(0, 1000);

    const redFlags = detectRedFlags(text);

    // ✅ Retry wrapper used here
    const raw = await retryHF(() =>
      callHuggingFaceZeroShot({ model, text: trimmedText }),
    );

    const labels = Array.isArray(raw?.labels)
      ? raw.labels.map((label, i) => ({
          label,
          score: Number(raw?.scores?.[i] ?? 0),
        }))
      : [];

    const scamObj = labels.find(
      (l) =>
        String(l.label).toLowerCase().includes("scam") ||
        String(l.label).toLowerCase().includes("fraud") ||
        String(l.label).toLowerCase().includes("fake"),
    );

    const baseProbability = scamObj
      ? Math.max(0, Math.min(1, scamObj.score))
      : 0;

    const scamProbability = adjustWithRedFlags(baseProbability, redFlags);

    const scamPercent = scamProbability * 100;

    const explanation = buildExplanation({
      scamPercent,
      redFlagsCount: redFlags.length,
    });

    return res.json({
      model,
      scamProbability,
      scamPercent,
      labels,
      explanation,
      redFlags,
      raw,
    });
  } catch (err) {
    const status =
      err?.status && Number.isFinite(err.status) ? err.status : 500;

    return res.status(status).json({
      error: err?.message || "Server error.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`TrustHire backend listening on http://localhost:${PORT}`);
});
