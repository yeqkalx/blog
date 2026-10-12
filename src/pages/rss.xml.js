import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';

export async function GET(context) {
    // Blog and Think Space are separate collections; tag each entry with its
    // URL base so feed links point to the right section.
    const posts = [...(await getCollection('blog')).map((post) => ({ post, basePath: '/blog' })), ...(await getCollection('thinkSpace')).map((post) => ({ post, basePath: '/think-space' }))].sort((a, b) => sortItemsByDateDesc(a.post, b.post));

    return rss({
        title: siteConfig.title,
        description: siteConfig.description,
        site: context.site,
        items: posts.map(({ post, basePath }) => ({
            title: post.data.title,
            description: post.data.excerpt,
            link: `${basePath}/${post.id}/`,
            pubDate: post.data.publishDate
        }))
    });
}
