import SITE_URL from "../config";

export function sortByDate(a, b) {
  return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export function ImageUrl(url) {
  
  return SITE_URL + url
  
}