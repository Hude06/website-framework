'use client';

import { AdminPanel } from '@/components/admin/AdminPanel';
import { frameworkEditors } from '@/components/admin/editors';
import { frameworkGalleryEntries } from '@/components/admin/manifests';
import { clientEditors } from '@client/editor-registry';
import { clientTemplates } from '@client/gallery';

const editorRegistry = { ...frameworkEditors, ...clientEditors };
const galleryEntries = [...frameworkGalleryEntries, ...clientTemplates];

export default function AdminPage() {
  return <AdminPanel editorRegistry={editorRegistry} galleryEntries={galleryEntries} />;
}
