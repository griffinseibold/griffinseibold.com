// Everything personal on the site lives here, so updating it never means
// hunting through components.

export const site = {
  name: 'Griffin Seibold',
  title: 'Software Engineer',
  description:
    "Things I've built, including infrastructure, platforms, and applications.",
  url: 'https://griffinseibold.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/griffinseibold/',
    github: 'https://github.com/griffinseibold',
  },
  // Leave empty to hide the email link.
  email: '',
};

// Projects without a write-up page; they link straight to GitHub. Ones with a
// screenshot get a large card on the homepage, the rest a small one.
export type Project = {
  name: string;
  description: string;
  stack: string[];
  href: string;
  image?: { src: ImageMetadata; alt: string };
};

export const otherProjects: Project[] = [
  {
    name: 'hello-crud',
    description:
      'A small Flask API I use to exercise the Homelab platform end to end, with its own tests, container build, Helm chart, and tag-driven releases.',
    stack: ['Python', 'Flask', 'Helm', 'GitHub Actions'],
    href: 'https://github.com/griffinseibold/hello-crud',
  },
];
