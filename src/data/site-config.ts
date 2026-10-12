import avatar from '../assets/images/avatar.jpg';
import hero from '../assets/images/hero.jpg';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://xykong.xyz',
    title: 'yeqkalx',
    subtitle: '',
    description: '',
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Think Space',
            href: '/think-space'
        },
        {
            text: 'Tags',
            href: '/tags'
        },
    ],
    footerNavLinks: [
        {
            text: '',
            href: ''
        },
    ],
    socialLinks: [],
    hero: {
        title: '',
        text: "",
        actions: [
            {
                text: 'About me',
                href: '/about'
            }
        ]
    },
    giscus: {
        enabled: true,
        repo: 'yeqkalx/blog',
        repoId: 'R_kgDOVFqG6w',
        category: 'Announcements',
        categoryId: 'DIC_kwDOVFqG684DH_xk',
        mapping: 'pathname',
        strict: false,
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: 'bottom',
        lang: 'zh-CN'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
