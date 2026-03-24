'use server';

/**
 * @fileOverview Server actions for aggregating assessment data and triggering AI analysis via gpt-4o.
 */

export interface RecordingStats {
  recordingId: string;
  averageRating: number;
  selectionPercentage: number;
  totalEvaluators: number;
  feedbacks: string[];
}

export interface ConsolidatedAnalysis {
  pros: { theme: string; count: number }[];
  cons: { theme: string; count: number }[];
  generatedAt: string;
}

interface OpenAIResponse {
  pros: { theme: string; response_indexes: number[] }[];
  cons: { theme: string; response_indexes: number[] }[];
}

/**
 * Implements the batching logic:
 * Batch size = 5
 * Remainder 1 or 2 -> merge into previous batch
 * Remainder 3 or 4 -> separate batch
 */
function createBatches(items: string[]): string[][] {
  const size = 5;
  const batches: string[][] = [];
  
  if (items.length === 0) return [];

  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }

  if (batches.length > 1) {
    const lastBatch = batches[batches.length - 1];
    if (lastBatch.length <= 2) {
      const remainder = batches.pop()!;
      batches[batches.length - 1] = [...batches[batches.length - 1], ...remainder];
    }
  }

  return batches;
}

/**
 * Direct call to OpenAI API using fetch and gpt-4o
 */
async function callOpenAI(responses: string[]): Promise<OpenAIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not found in environment');

  const prompt = `You are an expert in analyzing user feedback for voice evaluation systems.

You are given a list of qualitative user responses about a single audio recording.

Your task is to identify common recurring themes and separate them into Strengths (Pros) and Improvement Areas (Cons).

STRATEGIC CONSOLIDATION RULES (CRITICAL):
1. AGGRESSIVELY merge semantically similar feedback into broad, actionable product-level themes. Do NOT create separate themes for minor wording differences.
2. Use specific executive-friendly categories where possible:
   - "Human-likeness" (Includes: natural voice, sounds human, natural conversation, human-like voice)
   - "Clarity" (Includes: clear pronunciation, clear diction, easy to understand)
   - "Pacing and pauses" (Includes: natural pauses, human-like cadence, proper timing, flow)
   - "Emotional expressiveness" (Includes: empathetic tone, warmth, appropriate emotion, professional yet friendly)
   - "Robotic / monotone delivery" (Includes: metallic tone, flat voice, monotone, monotonous delivery, linear tone)
   - "Conversational handling" (Includes: response logic, fillers like um/ah, conversational flow)

3. Optimization: Focus on ACTIONABLE synthesis that can help improve the system. Avoid literal or narrow labels.
4. If feedback is vague, group it into "General positive sentiment" or "General negative sentiment".

Input:
Responses:
${responses.map((r, i) => `[${i}] ${r}`).join('\n')}

Output Format (STRICT JSON):
{
  "pros": [
    {
      "theme": "Broad Actionable Label",
      "response_indexes": [0, 1, 2]
    }
  ],
  "cons": [
    {
      "theme": "Broad Actionable Label",
      "response_indexes": [3, 4]
    }
  ]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a strategic product analyst. Your goal is to provide concise, consolidated, and actionable insights.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content) as OpenAIResponse;
}

export async function generateInDepthAnalysis(feedbacks: string[]): Promise<ConsolidatedAnalysis> {
  if (feedbacks.length === 0) {
    return { pros: [], cons: [], generatedAt: new Date().toISOString() };
  }

  const batches = createBatches(feedbacks);
  const proThemes: Record<string, number> = {};
  const conThemes: Record<string, number> = {};

  for (const batch of batches) {
    try {
      const result = await callOpenAI(batch);
      
      result.pros.forEach(p => {
        const normalized = p.theme.trim();
        if (normalized) {
           proThemes[normalized] = (proThemes[normalized] || 0) + p.response_indexes.length;
        }
      });
      
      result.cons.forEach(c => {
        const normalized = c.theme.trim();
        if (normalized) {
          conThemes[normalized] = (conThemes[normalized] || 0) + c.response_indexes.length;
        }
      });
    } catch (error) {
      console.error('Error analyzing batch with OpenAI:', error);
    }
  }

  const filterAndSort = (themes: Record<string, number>) => {
    return Object.entries(themes)
      .map(([theme, count]) => ({ theme, count }))
      .filter(item => item.count >= 2) 
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); 
  };

  return {
    pros: filterAndSort(proThemes),
    cons: filterAndSort(conThemes),
    generatedAt: new Date().toISOString(),
  };
}
