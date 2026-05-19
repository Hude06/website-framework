import type { Block, FrameworkBlock } from '../../lib/types';
import type { GalleryEntry } from './BlockGallery';

/** Distributive Omit so each union member's `id` is removed individually,
   instead of collapsing the discriminated union. */
type WithoutId<T> = T extends { id: unknown } ? Omit<T, 'id'> : never;

export interface BlockManifest {
  type: FrameworkBlock['type'];
  label: string;
  description: string;
  /** Defaults are sans `id` — admin assigns ids when inserting. */
  defaults: WithoutId<FrameworkBlock>;
}

export const frameworkManifests: BlockManifest[] = [
  {
    type: 'heading',
    label: 'Heading',
    description: 'A title or section heading.',
    defaults: { type: 'heading', text: 'New heading', level: 2 },
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Paragraphs of body copy.',
    defaults: { type: 'text', body: 'New paragraph. Type your content here.' },
  },
  {
    type: 'image',
    label: 'Image',
    description: 'A standalone image with optional caption.',
    defaults: { type: 'image', src: '', alt: 'Describe the image', width: 'default' },
  },
  {
    type: 'button',
    label: 'Button',
    description: 'A call-to-action button or link.',
    defaults: { type: 'button', label: 'Click me', href: '/', variant: 'primary', size: 'md', align: 'left' },
  },
  {
    type: 'hero',
    label: 'Hero',
    description: 'A big intro section with title, subtitle, and buttons.',
    defaults: {
      type: 'hero',
      title: 'A great headline',
      subtitle: 'A short subtitle explaining what this site is about.',
      buttons: [{ label: 'Get started', href: '/', variant: 'primary' }],
      align: 'left',
    },
  },
  {
    type: 'section',
    label: 'Section',
    description: 'A visual band with background, heading, and body.',
    defaults: {
      type: 'section',
      heading: 'Section heading',
      body: 'A short paragraph describing this section.',
      background: 'muted',
      padding: 'md',
    },
  },
  {
    type: 'grid',
    label: 'Grid',
    description: 'A multi-column grid of items with title, body, and optional image.',
    defaults: {
      type: 'grid',
      heading: 'Features',
      columns: 3,
      items: [
        { title: 'First', body: 'Describe the first item.' },
        { title: 'Second', body: 'Describe the second item.' },
        { title: 'Third', body: 'Describe the third item.' },
      ],
    },
  },
  {
    type: 'two-column',
    label: 'Two columns',
    description: 'A side-by-side layout with two content blocks.',
    defaults: {
      type: 'two-column',
      ratio: '50-50',
      left: { title: 'Left side', body: 'Content for the left column.' },
      right: { title: 'Right side', body: 'Content for the right column.' },
    },
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'A pull quote or testimonial with author and role.',
    defaults: {
      type: 'quote',
      quote: 'A memorable quote from someone interesting.',
      author: 'Author Name',
      role: 'Role or company',
    },
  },
  {
    type: 'form',
    label: 'Form',
    description: 'A contact or signup form with configurable fields.',
    defaults: {
      type: 'form',
      heading: 'Get in touch',
      submitLabel: 'Send',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true },
      ],
    },
  },
];

/** Gallery-ready entries derived from the manifests. Consumers append their own
   `clientTemplates` to form the final list passed to <BlockGallery />. */
export const frameworkGalleryEntries: GalleryEntry[] = frameworkManifests.map((m) => ({
  type: m.type,
  label: m.label,
  description: m.description,
  create: (id: string) => ({ id, ...m.defaults }) as Block,
}));
