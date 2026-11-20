import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { arrangePhotos } from '../src/app/components/project-files/about/usePaperLayout.ts';
import { activities, credentials, degree, memoryPhotos } from '../src/app/components/project-files/about/aboutAssets.ts';

test('all preview images exist and have reserved image dimensions', async () => {
  const manifest = JSON.parse(await readFile(new URL('../src/app/data/imagePreviews.json', import.meta.url), 'utf8'));
  for (const [source, preview] of Object.entries(manifest)) {
    assert.ok(preview.width > 0 && preview.height > 0, source);
    assert.match(preview.src, /^images\/previews\/[a-f0-9]{16}\.webp$/);
    assert.ok((await stat(new URL(`../public/${source}`, import.meta.url))).size > 0);
    assert.ok((await stat(new URL(`../public/${preview.src}`, import.meta.url))).size > 0);
  }
});

test('every About me photo and certificate uses a generated preview', async () => {
  const manifest = JSON.parse(await readFile(new URL('../src/app/data/imagePreviews.json', import.meta.url), 'utf8'));
  for (const image of [degree, ...credentials, ...activities, ...memoryPhotos]) {
    assert.ok(manifest[image.source], image.source);
  }
});

test('photos avoid an occupied paper and remain on a narrow board', () => {
  const paper = { left: 0, top: 0, right: 300, bottom: 400 };
  const photos = arrangePhotos([paper], 360, 1000, 5);
  assert.ok(photos.length > 0);
  for (const photo of photos) {
    assert.ok(photo.top >= paper.bottom);
    assert.ok(photo.left >= 0 && photo.left + photo.width <= 360);
    assert.ok(photo.top + photo.width * .76 <= 1000);
  }
});

test('a completely covered board has no decorative photos', () => {
  assert.deepEqual(arrangePhotos([{ left: 0, top: 0, right: 900, bottom: 1200 }], 900, 1200, 15), []);
});

test('resizing never requests more photos than the available images', () => {
  for (const width of [320, 600, 900, 1300]) {
    const photos = arrangePhotos([], width, 1400, 3);
    assert.equal(photos.length, 3);
    assert.deepEqual(photos, arrangePhotos([], width, 1400, 3));
  }
});
