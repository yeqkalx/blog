/** Payload text from its Markdown/MDX body for statistics. */
function stripMarkdown(body: string): string {
    return (
        body
            // fenced code blocks (their content shouldn't inflate the count)
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/~~~[\s\S]*?~~~/g, ' ')
            // images and links keep only their label
            .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            // inline code, HTML tags, emphasis markers, heading hashes
            .replace(/`[^`]*`/g, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/^\s{0,3}#{1,6}\s+/gm, '')
            .replace(/[*_~>|]/g, ' ')
            .trim()
    );
}

/**
 * Count CJK characters individually and Latin-script words by whitespace, so the
 * figure stays meaningful for the mixed Chinese/English posts on this site.
 */
export function getTextStats(body: string): { words: number; minutes: number } {
    const text = stripMarkdown(body);

    const cjk = text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/g)?.length ?? 0;
    const latin = text.replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]/g, ' ').match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)?.length ?? 0;

    const words = cjk + latin;
    // ~400 CJK characters or ~200 Latin words per minute
    const minutes = Math.max(1, Math.round(cjk / 400 + latin / 200)) || 1;

    return { words, minutes };
}
