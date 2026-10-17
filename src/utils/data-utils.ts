import { type CollectionEntry, getCollection } from 'astro:content';
import { slugify } from './common-utils';

/** A post from either writing collection — blog and Think Space share one schema. */
export type PostEntry = CollectionEntry<'blog'> | CollectionEntry<'thinkSpace'>;

/** A post paired with the URL prefix its detail page lives under. */
export type TaggedPost = { post: PostEntry; basePath: '/blog' | '/think-space' };

/**
 * Every entry of both writing collections, paired with its route prefix.
 *
 * Lives here rather than in a page's frontmatter because Astro pulls
 * `getStaticPaths` into its own chunk: helpers declared in the page itself are not
 * bundled for it, but module imports are.
 */
export async function getAllTaggedPosts(): Promise<TaggedPost[]> {
    return [
        ...(await getCollection('blog')).map((post) => ({ post, basePath: '/blog' as const })),
        ...(await getCollection('thinkSpace')).map((post) => ({ post, basePath: '/think-space' as const }))
    ];
}

export function sortItemsByDateDesc(itemA: PostEntry | CollectionEntry<'projects'>, itemB: PostEntry | CollectionEntry<'projects'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

/**
 * All distinct tags across the given posts.
 *
 * Tag pages are generated from this list, so it has to see every collection that
 * renders tags in `PostMeta` — otherwise posts from the other collection have tag
 * links pointing at archives that were never built.
 */
export function getAllTags(posts: TaggedPost[]) {
    const tags: string[] = [...new Set(posts.flatMap(({ post }) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => ({ name: tag, id: slugify(tag) }))
        .filter((tag) => tag.id !== '')
        .filter((tag, index, all) => all.findIndex((candidate) => candidate.id === tag.id) === index);
}

export function getPostsByTag(posts: TaggedPost[], tagId: string) {
    return posts.filter(({ post }) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagId));
}
