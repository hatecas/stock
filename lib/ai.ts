import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

/**
 * OS 레벨 env 변수가 .env.local을 override 하는 문제 회피.
 * 이 프로젝트에서는 .env.local의 값을 "우선"으로 사용.
 */
let _envLocal: Record<string, string> | null = null;
function envLocal(key: string): string | undefined {
  if (_envLocal === null) {
    try {
      const content = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
      _envLocal = {};
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m) _envLocal[m[1]] = m[2].replace(/^['"]|['"]$/g, "").trim();
      }
    } catch {
      _envLocal = {};
    }
  }
  return _envLocal[key] ?? process.env[key];
}

/**
 * AI 분석 엔진 — Claude + Gemini 독립 호출.
 * 결과는 동일한 스키마로 반환되어 DB에 저장됩니다.
 */

export type AnalysisResult = {
  score: number;
  verdict: "강력매수" | "매수" | "중립" | "매도";
  summary: string;
  pros: string[];
  cons: string[];
  outlook: string;
};

const CLAUDE_MODEL = "claude-sonnet-4-5";
const GEMINI_MODEL = "gemini-2.5-flash";

function buildPrompt(ticker: string): string {
  return `당신은 한국 시장에 정통한 주식 애널리스트입니다. 종목 "${ticker}"를 한국 개인투자자 관점에서 분석해 주세요.

반드시 아래 JSON 형식으로만 응답하세요. 설명문/코드블록 펜스 없이 순수 JSON만 반환하세요.

{
  "score": 0~100 사이의 정수 (현재 투자 매력도, 100이 가장 좋음),
  "verdict": "강력매수" 또는 "매수" 또는 "중립" 또는 "매도" 중 하나,
  "summary": "한두 문장 핵심 요약 (최대 90자)",
  "pros": ["장점1", "장점2", "장점3"],
  "cons": ["단점1", "단점2", "단점3"],
  "outlook": "중장기 유망도에 대한 한 문장 의견"
}`;
}

function parseJson(raw: string): AnalysisResult {
  // ```json ... ``` 같은 펜스 제거
  const fenced = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  const text = (fenced ? fenced[1] : raw).trim();

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("AI response is not JSON: " + text.slice(0, 120));

  const json = text.slice(first, last + 1);
  const parsed = JSON.parse(json);

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  const verdict = (["강력매수", "매수", "중립", "매도"].includes(parsed.verdict)
    ? parsed.verdict
    : "중립") as AnalysisResult["verdict"];

  return {
    score,
    verdict,
    summary: String(parsed.summary ?? "").slice(0, 200),
    pros: Array.isArray(parsed.pros) ? parsed.pros.slice(0, 5).map(String) : [],
    cons: Array.isArray(parsed.cons) ? parsed.cons.slice(0, 5).map(String) : [],
    outlook: String(parsed.outlook ?? "").slice(0, 240),
  };
}

/* ---------- Claude ---------- */

function getAnthropic() {
  return new Anthropic({ apiKey: envLocal("ANTHROPIC_API_KEY") });
}

export async function analyzeWithClaude(ticker: string): Promise<AnalysisResult> {
  const msg = await getAnthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: buildPrompt(ticker) }],
  });
  const text = msg.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("\n");
  return parseJson(text);
}

/* ---------- Gemini ---------- */

export async function analyzeWithGemini(ticker: string): Promise<AnalysisResult> {
  const apiKey = envLocal("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(ticker) }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
    cache: "no-store",
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini API ${resp.status}: ${err.slice(0, 200)}`);
  }
  const data = await resp.json();
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
  return parseJson(text);
}

export const MODELS = { claude: CLAUDE_MODEL, gemini: GEMINI_MODEL };
