import config from '../../config/env';
import ApiError from '../../utils/apiError';
import { ParseJobDescriptionInput, ParsedJobData } from './ai.types';

// AI ke response se JSON nikalne ke liye helper
const extractJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch) : null;
  } catch (e) {
    console.error("JSON Extraction Error:", e);
    return null;
  }
};

export const parseJobDescription = async (
  input: ParseJobDescriptionInput
): Promise<ParsedJobData> => {
  if (!input.jobDescription || input.jobDescription.trim().length === 0) {
    throw new ApiError(400, 'Job description is required');
  }

  // FIRST PRIORITY: GitHub Models (Free with Student Pack)
  if (config.githubToken) {
    console.log("Using GitHub Models Priority...");
    return parseWithGitHub(input.jobDescription);
  }

  // SECOND PRIORITY: OpenRouter (Backup)
  if (config.openRouterApiKey) {
    return parseWithOpenRouter(input.jobDescription);
  }

  // FALLBACK: Local Logic
  return parseLocally(input.jobDescription.toLowerCase());
};

const parseWithGitHub = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    const response = await fetch('https://azure.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.githubToken}`,
      },
      body: JSON.stringify({
        model: 'meta-llama-3.1-8b-instruct', // GitHub free-tier model
        messages: [
          {
            role: 'system',
            content: `You are a professional job data extractor. 
            Extract data and return ONLY a valid JSON object.
            STRICT RULES:
            1. "company": Official name ONLY (e.g. 'Google'). NO taglines or slogans.
            2. "role": Official job title.
            3. "seniority": One of [Intern, Junior, Mid, Senior, Lead, Manager].
            4. "requiredSkills": Array of technical skills.
            Output must be pure JSON.`
          },
          {
            role: 'user',
            content: jobDescription
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("GitHub API Error:", response.statusText);
      return parseLocally(jobDescription);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = extractJSON(content || '');

    return parsed ? validateAndNormalizeParsedData(parsed) : parseLocally(jobDescription);
  } catch (error) {
    console.error("GitHub Call Failed:", error);
    return parseLocally(jobDescription);
  }
};

const parseWithOpenRouter = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    const response = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it',
        messages: [
          { role: 'system', content: 'Extract job info to JSON. Company name ONLY.' },
          { role: 'user', content: jobDescription }
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const parsed = extractJSON(data.choices?.[0]?.message?.content || '');
    return parsed ? validateAndNormalizeParsedData(parsed) : parseLocally(jobDescription);
  } catch (error) {
    return parseLocally(jobDescription);
  }
};

const parseLocally = (text: string): ParsedJobData => {
  return {
    company: 'Not detected',
    role: 'Manual Entry',
    requiredSkills: [],
    niceToHaveSkills: [],
    seniority: 'Mid',
    location: 'Not specified',
    resumeSuggestions: ['Please check the job description manually.']
  };
};

const validateAndNormalizeParsedData = (data: any): ParsedJobData => {
  return {
    company: data.company || 'Not specified',
    role: data.role || 'Not specified',
    requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
    niceToHaveSkills: Array.isArray(data.niceToHaveSkills) ? data.niceToHaveSkills : [],
    seniority: data.seniority || 'Mid',
    location: data.location || 'Not specified',
    resumeSuggestions: Array.isArray(data.resumeSuggestions) ? data.resumeSuggestions : ['Tailor resume.']
  };
};
