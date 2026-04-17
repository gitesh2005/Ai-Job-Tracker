import config from '../../config/env';
import ApiError from '../../utils/apiError';
import { ParseJobDescriptionInput, ParsedJobData } from './ai.types';

// AI ke response se JSON nikalne ke liye helper
const extractJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    // Fixed TS2345: added .toString() or index check
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

  // GITHUB TOKEN PRIORITY
  if (config.githubToken) {
    return parseWithGitHub(input.jobDescription);
  }

  // OPENROUTER BACKUP
  if (config.openRouterApiKey) {
    return parseWithOpenRouter(input.jobDescription);
  }

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

    if (!response.ok) return parseLocally(jobDescription);

    const data: any = await response.json(); // Fixed TS18046: added :any type
    const content = data.choices?.[0]?.message?.content;
    const parsed = extractJSON(content || '');

    return parsed ? validateAndNormalizeParsedData(parsed) : parseLocally(jobDescription);
  } catch (error) {
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
        messages: [{ role: 'system', content: 'Extract job data to JSON.' }, { role: 'user', content: jobDescription }],
        temperature: 0.1,
      }),
    });

    if (!response.ok) return parseLocally(jobDescription);
    const data: any = await response.json(); // Fixed TS18046: added :any type
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
