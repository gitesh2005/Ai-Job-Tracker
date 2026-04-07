import config from '../../config/env';
import ApiError from '../../utils/apiError';
import { ParseJobDescriptionInput, ParsedJobData } from './ai.types';

const COMMON_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
  'node.js', 'express', 'django', 'flask', 'spring', 'sql', 'mongodb',
  'postgresql', 'mysql', 'redis', 'graphql', 'rest', 'api', 'docker',
  'kubernetes', 'aws', 'gcp', 'azure', 'git', 'CI/CD', 'agile', 'scrum',
  'html', 'css', 'sass', 'less', 'jquery', 'bootstrap', 'tailwind',
  'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
  'machine learning', 'data science', 'analytics', 'tableau', 'power bi',
  'excel', 'statistics', 'deep learning', 'tensorflow', 'pytorch', 'nlp',
];

const SENIORITY_LEVELS = ['intern', 'junior', 'mid', 'senior', 'lead', 'principal', 'staff', 'manager', 'director'];

export const parseJobDescription = async (
  input: ParseJobDescriptionInput
): Promise<ParsedJobData> => {
  if (!input.jobDescription || input.jobDescription.trim().length === 0) {
    throw new ApiError(400, 'Job description is required');
  }

  if (config.openRouterApiKey) {
    return parseWithOpenRouter(input.jobDescription);
  }

  if (config.openAiApiKey) {
    return parseWithOpenAI(input.jobDescription);
  }

  return parseLocally(input.jobDescription.toLowerCase());
};

const parseLocally = (text: string): ParsedJobData => {
  const foundRequiredSkills: string[] = [];
  const foundNiceToHaveSkills: string[] = [];

  for (const skill of COMMON_SKILLS) {
    if (text.includes(skill.toLowerCase())) {
      if (foundRequiredSkills.length < 5) {
        foundRequiredSkills.push(skill);
      } else if (foundNiceToHaveSkills.length < 5) {
        foundNiceToHaveSkills.push(skill);
      }
    }
  }

  let seniority = 'Mid';
  for (const level of SENIORITY_LEVELS) {
    if (text.includes(level)) {
      const capitalized = level.charAt(0).toUpperCase() + level.slice(1);
      seniority = capitalized;
      break;
    }
  }

  let location = 'Not specified';
  const locationPatterns = [
    /remote/i,
    /san francisco/i,
    /new york/i,
    /seattle/i,
    /austin/i,
    /boston/i,
    /chicago/i,
    /los angeles/i,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      location = match[0];
      break;
    }
  }

  let company = 'Not specified';
  let role = 'Not specified';

  const atPattern = /at\s+([A-Z][a-zA-Z\s]+)/i;
  const atMatch = text.match(atPattern);
  if (atMatch) {
    company = atMatch[1].trim();
  }

  const rolePatterns = [
    /(?:senior|principal|lead|staff)?\s*(?:full[- ]?stack|front[- ]?end|back[- ]?end|software|data|backend|frontend|devops|cloud|ml|ai)?\s*engineer/i,
    /(?:senior|principal|lead|staff)?\s*developer/i,
    /software\s*engineer/i,
    /full\s*stack\s*developer/i,
    /data\s*scientist/i,
    /product\s*manager/i,
  ];

  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match) {
      role = match[0].trim();
      break;
    }
  }

  return {
    company,
    role,
    requiredSkills: foundRequiredSkills,
    niceToHaveSkills: foundNiceToHaveSkills,
    seniority,
    location,
  };
};

const parseWithOpenRouter = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openRouterApiKey}`,
        'HTTP-Referer': config.clientUrl,
        'X-Title': 'AI Job Tracker',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: `You are a job description parser. Parse the following job description and extract structured information. 
Return ONLY a valid JSON object with this exact structure:
{
  "company": "company name or 'Not specified'",
  "role": "job title or 'Not specified'",
  "requiredSkills": ["skill1", "skill2", ...],
  "niceToHaveSkills": ["skill1", "skill2", ...],
  "seniority": "Intern/Junior/Mid/Senior/Lead/Principal/Staff/Manager/Director or 'Mid'",
  "location": "city name or 'Remote' or 'Not specified'"
}
Do not include any additional text or explanation.`
          },
          {
            role: 'user',
            content: jobDescription
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      return parseLocally(jobDescription.toLowerCase());
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return parseLocally(jobDescription.toLowerCase());
    }

    try {
      const parsed = JSON.parse(content);
      return {
        company: parsed.company || 'Not specified',
        role: parsed.role || 'Not specified',
        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
        niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
        seniority: parsed.seniority || 'Mid',
        location: parsed.location || 'Not specified',
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return parseLocally(jobDescription.toLowerCase());
    }
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    return parseLocally(jobDescription.toLowerCase());
  }
};

const parseWithOpenAI = async (jobDescription: string): Promise<ParsedJobData> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a job description parser. Parse the following job description and extract structured information. 
Return ONLY a valid JSON object with this exact structure:
{
  "company": "company name or 'Not specified'",
  "role": "job title or 'Not specified'",
  "requiredSkills": ["skill1", "skill2", ...],
  "niceToHaveSkills": ["skill1", "skill2", ...],
  "seniority": "Intern/Junior/Mid/Senior/Lead/Principal/Staff/Manager/Director or 'Mid'",
  "location": "city name or 'Remote' or 'Not specified'"
}
Do not include any additional text or explanation.`
          },
          {
            role: 'user',
            content: jobDescription
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return parseLocally(jobDescription.toLowerCase());
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return parseLocally(jobDescription.toLowerCase());
    }

    try {
      const parsed = JSON.parse(content);
      return {
        company: parsed.company || 'Not specified',
        role: parsed.role || 'Not specified',
        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
        niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
        seniority: parsed.seniority || 'Mid',
        location: parsed.location || 'Not specified',
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return parseLocally(jobDescription.toLowerCase());
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    return parseLocally(jobDescription.toLowerCase());
  }
};