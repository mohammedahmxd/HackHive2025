export const SCHOOL_KEYS = {
  'Toronto Metropolitan University': 'tmu',
  'Ontario Tech University': 'ontariotech',
};

export function getSchoolKey(universityName) {
  return SCHOOL_KEYS[universityName] || null;
}
