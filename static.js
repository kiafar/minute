import { copyFile } from 'copy-file';

copyFile(
  'node_modules/tinymce/skins/ui/oxide-dark/content.min.css',
  'public/css/tinymce/content.min.css',
);
copyFile(
  'node_modules/tinymce/skins/ui/oxide-dark/skin.min.css',
  'public/css/tinymce/skin.min.css',
);
copyFile(
  'node_modules/tinymce/skins/content/dark/content.min.css',
  'public/css/tinymce/container-content.min.css',
);
