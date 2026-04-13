const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface SurveyResponse {
  success: boolean;
  survey_id: number;
}

export async function submitSurvey(token: string, answers: Record<string, unknown>): Promise<SurveyResponse> {
  const res = await fetch(`${AUTH_BASE}/survey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    throw new Error(`Survey API Error: ${res.status}`);
  }
  return res.json();
}

export async function getSurvey(token: string, surveyId: number): Promise<{ success: boolean; answers: Record<string, unknown> }> {
  const res = await fetch(`${AUTH_BASE}/survey/${surveyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Survey API Error: ${res.status}`);
  }
  return res.json();
}

export async function updateSurvey(token: string, surveyId: number, answers: Record<string, unknown>): Promise<SurveyResponse & { changed: boolean }> {
  const res = await fetch(`${AUTH_BASE}/survey/${surveyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    throw new Error(`Survey API Error: ${res.status}`);
  }
  return res.json();
}
