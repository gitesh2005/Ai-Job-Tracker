import { useState } from 'react';

interface ResumeSuggestionsProps {
  suggestions?: string[];
}

export default function ResumeSuggestions({ suggestions = [] }: ResumeSuggestionsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            No resume suggestions available yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50/50 to-purple-50/50 rounded-xl p-5 border border-primary-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-gray-900">Resume Suggestions</h4>
      </div>
      <div className="space-y-2.5">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="group flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-gray-600 text-sm flex-1 leading-relaxed">{suggestion}</span>
            <button
              onClick={() => handleCopy(suggestion, index)}
              className="shrink-0 p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Copy to clipboard"
            >
              {copiedIndex === index ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}