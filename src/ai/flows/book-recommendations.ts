// src/ai/flows/book-recommendations.ts
'use server';

/**
 * @fileOverview A book recommendation AI agent.
 *
 * - getBookRecommendations - A function that handles the book recommendation process.
 * - BookRecommendationsInput - The input type for the getBookRecommendations function.
 * - BookRecommendationsOutput - The return type for the getBookRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookRecommendationsInputSchema = z.object({
  readingHistory: z
    .string()
    .describe("A list of books the user has read, separated by commas."),
});
export type BookRecommendationsInput = z.infer<typeof BookRecommendationsInputSchema>;

const BookRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe("A list of book recommendations based on the user's reading history."),
});
export type BookRecommendationsOutput = z.infer<typeof BookRecommendationsOutputSchema>;

export async function getBookRecommendations(input: BookRecommendationsInput): Promise<BookRecommendationsOutput> {
  return bookRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookRecommendationsPrompt',
  input: {schema: BookRecommendationsInputSchema},
  output: {schema: BookRecommendationsOutputSchema},
  prompt: `You are a book recommendation expert.

  Based on the user's reading history, provide a list of book recommendations that the user might enjoy.

  Reading History: {{{readingHistory}}}
  Recommendations:`,
});

const bookRecommendationsFlow = ai.defineFlow(
  {
    name: 'bookRecommendationsFlow',
    inputSchema: BookRecommendationsInputSchema,
    outputSchema: BookRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
