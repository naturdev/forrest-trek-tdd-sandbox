export function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function slugify(s) {
  return s
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .join('-');
}
