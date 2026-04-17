import config from '../../config/env';
import ApiError from '../../utils/apiError';
import { ParseJobDescriptionInput, ParsedJobData } from './ai.types';

const extractJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    // Fixed: Using jsonMatch[0] safely
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
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

  if (config.githubToken) {
    console.log("Using GitHub Models...");
    return parseWithGitHub(input.jobDescription);
  }

  if (config.openRouterApiKey) {
    return parseWithOpenRouter(input.jobDescription);
  }

  return parseLocally(input.jobDescription.toLowerCase());
};

const parseWithGitHub = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    // FIXED URL: GitHub Models ka sahi endpoint ye hai
    const response = await fetch('https://azure.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.githubToken.trim()}`,
      },
      body: JSON.stringify({
        model: 'meta-llama-3.1-8b-instruct', 
        messages: [
          {
            role: 'system',
            content: `Extract data into JSON. Company name ONLY (e.g. Google). Return ONLY JSON.`
          },
          { role: 'user', content: jobDescription }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("GitHub API Error Details:", err);
      return parseLocally(jobDescription);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = extractJSON(content || '');

    return parsed ? validateAndNormalizeParsedData(parsed) : parseLocally(jobDescription);
  } catch (error) {
    console.error("GitHub Fetch Failed:", error);
    return parseLocally(jobDescription);
  }
};

const parseWithOpenRouter = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    // FIXED URL: OpenRouter ka sahi endpoint ye hai
    const response = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it',
        messages: [{ role: 'system', content: 'Extract job data to JSON.' }, { role: 'user', content: jobDescription }],
        temperature: 0.1,
      }),
    });

    if (!response.ok) return parseLocally(jobDescription);
    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = extractJSON(content || '');
    return parsed ? validateAndNormalizeParsedData(parsed) : parseLocally(jobDescription);
  } catch (error) {
    return parseLocally(jobDescription);
  }
};

const parseLocally = (text: string): ParsedJobData => {
  return {
    company: 'Not detected',
    role: 'Manual Entry Required',
    requiredSkills: [],
    niceToHaveSkills: [],
    seniority: 'Mid',
    location: 'Not specified',
    resumeSuggestions: ['AI parse failed, check manually.']
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
    resumeSuggestions: Array.isArray(data.resumeSuggestions) ? data.resumeSuggestions : ['Update your resume points.']
  };
};
