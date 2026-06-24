// Predefined tag colors
export const TAG_COLORS = {
  work: { bg: '#B6CAEC', text: '#131214' },
  personal: { bg: '#F7B7DA', text: '#131214' },
  urgent: { bg: '#FF6B6B', text: '#FFFFFF' },
  important: { bg: '#F6D76A', text: '#131214' },
  idea: { bg: '#C9E4C5', text: '#131214' },
  project: { bg: '#A8D8EA', text: '#131214' },
  learning: { bg: '#D4A5FF', text: '#131214' },
  health: { bg: '#FFB7B2', text: '#131214' },
  finance: { bg: '#B5EAD7', text: '#131214' },
  home: { bg: '#FFDAC1', text: '#131214' },
};

export const getTagColor = (tag) => {
  return TAG_COLORS[tag] || { bg: '#E5E5E5', text: '#131214' };
};

// Predefined tag suggestions
export const SUGGESTED_TAGS = Object.keys(TAG_COLORS);