import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection, type ImageFunction } from 'astro:content';

/** True for YAML keys written with no value (`alt:`), which parse to `null`. */
const isBlank = (value: unknown) => value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/**
 * YAML turns a key with no value (`alt:`) into `null`, and `.optional()` only
 * accepts `undefined` — not `null`. Without this, leaving any optional field
 * blank fails the whole collection and breaks the build. Treat `null` and
 * blank strings as "not set" so optional keys can simply be left empty.
 */
const emptyAsUnset = <T extends z.ZodType>(schema: T): z.ZodType<z.output<T> | undefined, unknown> => z.preprocess((value) => (isBlank(value) ? undefined : value), schema.optional());

/** Required date: blank or unparseable values fail with a readable message. */
const requiredDate = (field: string): z.ZodType<Date, unknown> =>
    z.preprocess((value) => (isBlank(value) ? 'invalid' : typeof value === 'string' ? new Date(value) : value), z.date({ error: `${field} 必须是合法日期，例如 'Nov 1 2026' 或 '2026-11-01'` }));

/** Optional date: blank means "not set", but a real typo still fails. */
const optionalDate = (field: string): z.ZodType<Date | undefined, unknown> =>
    z.preprocess((value) => (isBlank(value) ? undefined : typeof value === 'string' ? new Date(value) : value), z.date({ error: `${field} 必须是合法日期，例如 'Nov 1 2026' 或 '2026-11-01'` }).optional());

const imageSchema = (image: ImageFunction) =>
    z.object({
        src: image(),
        alt: emptyAsUnset(z.string())
    });

/**
 * Optional image block. A blank `src` — the `src: ''` left behind by a fresh
 * frontmatter template — must mean "no image": handing it to `image()` throws
 * `ImageNotFound` while the collection is parsed, which takes down every page
 * that touches the collection instead of just this post.
 */
const optionalImage = (image: ImageFunction) =>
    z.preprocess(
        (value) => (isBlank(value) || (typeof value === 'object' && isBlank((value as { src?: unknown }).src)) ? undefined : value),
        imageSchema(image).optional()
    );

const seoSchema = (image: ImageFunction) =>
    z.object({
        title: emptyAsUnset(z.string().min(5).max(120)),
        description: emptyAsUnset(z.string().min(15).max(160)),
        image: optionalImage(image),
        pageType: z.enum(['website', 'article']).optional()
    });

const postSchema = (image: ImageFunction) =>
    z.object({
        title: z.string(),
        excerpt: emptyAsUnset(z.string()),
        publishDate: requiredDate('publishDate'),
        updatedDate: optionalDate('updatedDate'),
        isFeatured: emptyAsUnset(z.boolean().default(false)),
        tags: emptyAsUnset(z.array(z.string()).default([])),
        seo: seoSchema(image).optional()
    });

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: ({ image }) => postSchema(image)
});

const thinkSpace = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/think-space' }),
    schema: ({ image }) => postSchema(image)
});

const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            seo: seoSchema(image).optional()
        })
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: emptyAsUnset(z.string()),
            publishDate: requiredDate('publishDate'),
            isFeatured: emptyAsUnset(z.boolean().default(false)),
            seo: seoSchema(image).optional()
        })
});

export const collections = { blog, thinkSpace, pages, projects };
