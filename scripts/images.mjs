// Builds responsive WebP images and a transparent logo from the originals.
// Originals in "pfu picture" and "Logo" are never modified.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'pfu picture')
const outDir = path.join(root, 'public', 'img')
const map = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'image-map.json'), 'utf8'))

fs.mkdirSync(outDir, { recursive: true })

// The photos were renamed 01.jpg ... 58.jpg; file_mapping.json links each back to its original Facebook name.
const renamed = {}
const mappingPath = path.join(root, 'file_mapping.json')
if (fs.existsSync(mappingPath)) {
  const rows = JSON.parse(fs.readFileSync(mappingPath, 'utf8').replace(/^﻿/, ''))
  for (const r of rows) renamed[r.newName] = r.originalName
}

const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png)$/i.test(f))
let done = 0
const missing = new Set(Object.keys(map))

for (const file of files) {
  const id = (renamed[file] ?? file).split('_')[0]
  const name = map[id]
  if (!name) continue
  missing.delete(id)
  const input = path.join(srcDir, file)
  for (const [suffix, width] of [['-sm', 560], ['-lg', 1200]]) {
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${name}${suffix}.webp`))
  }
  done++
}
console.log(`images: ${done} processed`)
if (missing.size) console.warn('not found in folder:', [...missing].join(', '))

// Logo: remove the white background by flood-filling from the edges, so thorns
// that sit inside the periwinkle outline stay white.
const logoDir = path.join(root, 'Logo')
const logoFile = fs.readdirSync(logoDir).find((f) => /\.(png|jpe?g)$/i.test(f))
if (logoFile) {
  const { data, info } = await sharp(path.join(logoDir, logoFile))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const isBg = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235
  const seen = new Uint8Array(w * h)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const p = y * w + x
    if (seen[p]) return
    if (!isBg(p * 4)) return
    seen[p] = 1
    stack.push(p)
  }
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
  while (stack.length) {
    const p = stack.pop()
    const x = p % w
    const y = (p - x) / w
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1)
  }
  let minX = w, minY = h, maxX = 0, maxY = 0
  for (let p = 0; p < w * h; p++) {
    if (seen[p]) {
      data[p * 4 + 3] = 0
    } else {
      const x = p % w
      const y = (p - x) / w
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  const pad = 12
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({
      left: Math.max(0, minX - pad),
      top: Math.max(0, minY - pad),
      width: Math.min(w, maxX - minX + 1 + pad * 2),
      height: Math.min(h, maxY - minY + 1 + pad * 2),
    })
    .resize({ width: 1400, withoutEnlargement: true })
    .png()
    .toFile(path.join(root, 'public', 'logo.png'))
  console.log('logo: transparent version written to public/logo.png')
}
