'use server';
/**
 * @fileOverview AI flow for analyzing qualitative voice evaluation feedback.
 * 
 * - analyzeFeedback - Clusters user responses into normalized themes (Pros/Cons).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeFeedbackInputSchema = z.object({
  responses: z.array(z.string()).describe('A list of qualitative user responses about an audio recording.'),
});

const AnalysisThemeSchema = z.object({
  theme: z.string().describe('A normalized broad product-level label for the feedback theme.'),
  response_indexes: z.array(z.number()).describe('Indexes of the responses that belong to this theme.'),
});

const AnalyzeFeedbackOutputSchema = z.object({
  pros: z.array(AnalysisThemeSchema),
  cons: z.array(AnalysisThemeSchema),
});

export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

const analyzePrompt = ai.definePrompt({
  name: 'analyzeFeedbackPrompt',
  input: { schema: AnalyzeFeedbackInputSchema },
  output: { schema: AnalyzeFeedbackOutputSchema },
  prompt: `You are an expert in analyzing user feedback for voice evaluation systems.

You are given a list of qualitative user responses about a single audio recording.

Your task is to identify common themes and separate them into Strengths (Pros) and Improvement Areas (Cons).

STRATEGIC CONSOLIDATION RULES:
1. Merge similar feedback into broad, actionable product-level themes. Do not create separate themes for minor wording differences.
2. Use specific executive-friendly categories:
   - "Human-likeness" (natural voice, sounds human, natural conversation)
   - "Clarity" (clear pronunciation, diction, easy to understand)
   - "Pacing and pauses" (natural pauses, cadence, timing)
   - "Emotional expressiveness" (empathetic tone, warmth, appropriate emotion)
   - "Robotic / monotone delivery" (metallic tone, flat voice, monotone)
   - "Conversational handling" (response logic, flow, fillers)

3. Avoid fragmented, low-signal themes. Optimize for actionable synthesis.

Input:
Responses:
{{#each responses}}
[{{@index}}] {{{this}}}
{{/each}}`,
});

export async function analyzeFeedbackBatch(responses: string[]): Promise<AnalyzeFeedbackOutput> {
  const { output } = await analyzePrompt({ responses });
  if (!output) throw new Error('Failed to generate analysis');
  return output;
}
