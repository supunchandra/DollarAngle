export type EditorProfile = {
  id: string;
  name: string;
  role: string;
  shortBio: string;
};

export const editors: Record<string, EditorProfile> = {
  'daniel-brooks': {
    id: 'daniel-brooks',
    name: 'Daniel Brooks',
    role: 'Personal Finance Editor',
    shortBio: 'Daniel Brooks is a DollarAngle editorial byline used for personal finance coverage, including budgeting, saving, debt and everyday financial planning.'
  },
  'michael-carter': {
    id: 'michael-carter',
    name: 'Michael Carter',
    role: 'Investing and Markets Editor',
    shortBio: 'Michael Carter is a DollarAngle editorial byline used for investing, stocks, ETFs, market moves and market-related economic coverage.'
  },
  'ethan-walker': {
    id: 'ethan-walker',
    name: 'Ethan Walker',
    role: 'Current Developments Editor',
    shortBio: 'Ethan Walker is a DollarAngle editorial byline used for timely financial developments, policy changes and fast-moving stories.'
  },
  'olivia-bennett': {
    id: 'olivia-bennett',
    name: 'Olivia Bennett',
    role: 'Money & Relationships Editor',
    shortBio: 'Olivia Bennett is a DollarAngle editorial byline for practical coverage of couples, dating, shared finances, marriage and family money decisions.'
  },
  'ryan-mitchell': {
    id: 'ryan-mitchell',
    name: 'Ryan Mitchell',
    role: 'Features Editor',
    shortBio: 'Ryan Mitchell is a DollarAngle editorial byline used for broader explainers, special features and topics that do not fit one primary beat.'
  }
};

export function resolveEditor(category: string, franchise: string, authorId?: string) {
  if (authorId && editors[authorId]) return editors[authorId];
  if (franchise === 'Daily') return editors['ethan-walker'];
  if (category === 'money-relationships') return editors['olivia-bennett'];
  if (category === 'personal-finance') return editors['daniel-brooks'];
  if (category === 'investing' || category === 'markets') return editors['michael-carter'];
  return editors['ryan-mitchell'];
}
