export type ImageInput = {
    src: ImageMetadata | string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: ImageInput;
    actions?: Link[];
};

export type SubscribeForm = {
    action: string;
    emailFieldName?: string;
    hiddenFields?: { name: string; value: string }[];
    honeypotFieldName?: string;
};

export type Subscribe = {
    enabled?: boolean;
    title?: string;
    text?: string;
    form?: SubscribeForm;
};

/** Comment widget, rendered by `src/components/Giscus.astro`. */
export type Giscus = {
    enabled?: boolean;
    /** GitHub repo that hosts the discussions, e.g. `user/repo`. */
    repo: string;
    /** `data-repo-id` from giscus.app. */
    repoId: string;
    /** Discussion category name, e.g. `Announcements`. */
    category: string;
    /** `data-category-id` from giscus.app. */
    categoryId: string;
    /** Heading shown above the widget. Omit to use `Comments`. */
    title?: string;
    mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    strict?: boolean;
    reactionsEnabled?: boolean;
    emitMetadata?: boolean;
    inputPosition?: 'top' | 'bottom';
    lang?: string;
};

export type SiteConfig = {
    website: string;
    avatar?: ImageInput;
    title: string;
    subtitle?: string;
    description: string;
    image?: ImageInput;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    giscus?: Giscus;
    postsPerPage?: number;
    projectsPerPage?: number;
};
