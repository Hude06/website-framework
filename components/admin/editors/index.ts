import type { ComponentType } from 'react';
import type { Block } from '../../../lib/types';
import { HeadingEditor } from './HeadingEditor';
import { TextEditor } from './TextEditor';
import { ImageEditor } from './ImageEditor';
import { ButtonEditor } from './ButtonEditor';
import { HeroEditor } from './HeroEditor';
import { SectionEditor } from './SectionEditor';
import { GridEditor } from './GridEditor';
import { TwoColumnEditor } from './TwoColumnEditor';
import { QuoteEditor } from './QuoteEditor';
import { FormEditor } from './FormEditor';

export interface EditorProps<T extends Block = Block> {
  block: T;
  onChange: (next: T) => void;
}

/* Generic editor signature for the registry. Specific editors are typed to their
   own block kind; the dispatcher narrows by `block.type` at call time. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EditorComponent = ComponentType<EditorProps<any>>;
export type EditorRegistry = Record<string, EditorComponent>;

export const frameworkEditors: EditorRegistry = {
  heading: HeadingEditor as EditorComponent,
  text: TextEditor as EditorComponent,
  image: ImageEditor as EditorComponent,
  button: ButtonEditor as EditorComponent,
  hero: HeroEditor as EditorComponent,
  section: SectionEditor as EditorComponent,
  grid: GridEditor as EditorComponent,
  'two-column': TwoColumnEditor as EditorComponent,
  quote: QuoteEditor as EditorComponent,
  form: FormEditor as EditorComponent,
};
