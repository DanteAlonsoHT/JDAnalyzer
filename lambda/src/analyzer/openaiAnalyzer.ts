import OpenAI from "openai";
import * as dotenv from 'dotenv';
import { parseOpenAIResponse } from "../utils/jsonUtils";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export async function analyzeJobDescription(description: string) {
  const prompt = `
  Analyze the following job description and extract the skills required,
  categorize their importance (High, Medium, Low), and proficiency 
  (Advanced, Intermediate, Novice). Provide the response as a JSON array of objects,
  No aditional text, Only the JSON array of object.
  ${description}
  `;
  
  try {
    const result = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    }, { timeout: 25 * 1000 });

    const skills = result.choices?.[0]?.message?.content;
    if (skills) return parseOpenAIResponse(skills);

    throw new Error('No choices returned from OpenAI');
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw new Error('Failed to analyze job description');
  }
}
