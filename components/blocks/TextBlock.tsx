import { Container, Stack, Text } from '../../lib/ui';
import type { TextBlock as TextBlockType } from '../../lib/types';
import block from './Block.module.css';

export function TextBlock({ block: b }: { block: TextBlockType }) {
  const paragraphs = b.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={block['block-tight']}>
      <Container width="default">
        <Stack gap={4}>
          {paragraphs.map((p, i) => (
            <Text key={i} size={b.size} tone={b.tone} weight={b.weight} align={b.align}>
              {p}
            </Text>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
