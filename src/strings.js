export function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(" ");
}
