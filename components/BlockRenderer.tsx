import type { ComponentType } from 'react';
import type { BaseBlock } from '../lib/types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { GridBlock } from './blocks/GridBlock';
import { TwoColumnBlock } from './blocks/TwoColumnBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { FormBlock } from './blocks/FormBlock';

/* The `block: never` typing is intentional. It lets framework, client, and merged
   registries share one Record type — each block component is invariant in its
   own narrow type, and BlockRenderer narrows at runtime via `block.type`. */
export type BlockComponent = ComponentType<{ block: never }>;
export type BlockRegistry = Record<string, BlockComponent>;

/** Framework-provided block render components. Consumers merge with their own
   custom blocks before passing to BlockRenderer. */
export const frameworkBlocks: BlockRegistry = {
  heading: HeadingBlock as BlockComponent,
  text: TextBlock as BlockComponent,
  image: ImageBlock as BlockComponent,
  button: ButtonBlock as BlockComponent,
  hero: HeroBlock as BlockComponent,
  section: SectionBlock as BlockComponent,
  grid: GridBlock as BlockComponent,
  'two-column': TwoColumnBlock as BlockComponent,
  quote: QuoteBlock as BlockComponent,
  form: FormBlock as BlockComponent,
};

export interface BlockRendererProps {
  blocks: BaseBlock[];
  /** Optional registry. Defaults to `frameworkBlocks`.
     Consumers with custom blocks pass `{ ...frameworkBlocks, ...clientBlocks }`. */
  registry?: BlockRegistry;
}

export function BlockRenderer({ blocks, registry = frameworkBlocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = registry[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block as never} />;
      })}
    </>
  );
}
