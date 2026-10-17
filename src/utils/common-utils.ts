/**
 * Turn a tag (or any label) into a URL segment.
 *
 * Kept Unicode-aware on purpose: the tags on this site are mostly Chinese, and the
 * old `[^a-z0-9]` filter reduced every one of them to an empty string — so `/tags/关系`
 * collapsed to `/tags/`, no tag page was generated and the links in `PostMeta` went
 * nowhere. Letters and numbers from any script survive, accents fold to their base
 * letter, and every run of other characters becomes a single hyphen.
 */
export function slugify(input?: string) {
    if (!input) return '';

    const slug = input
        .toLowerCase()
        .trim()
        .normalize('NFKD') // split accented letters into base letter + combining mark
        .replace(/[\u0300-\u036f]/g, '') // drop the combining marks
        .replace(/[^\p{L}\p{N}]+/gu, '-') // any run of punctuation, spaces, emoji… -> hyphen
        .replace(/^-+|-+$/g, ''); // no leading or trailing hyphen

    return slug;
}
