'use strict';

const zlib = require('node:zlib');

function decodeXml(value) {
  return String(value || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function zipEntry(buffer, wantedName) {
  const endMinimum = Math.max(0, buffer.length - 65557);
  let end = buffer.length - 22;
  while (end >= endMinimum && buffer.readUInt32LE(end) !== 0x06054b50) end -= 1;
  if (end < endMinimum) throw new Error('XLSX ZIP directory was not found');
  let offset = buffer.readUInt32LE(end + 16);
  const entries = buffer.readUInt16LE(end + 10);
  for (let index = 0; index < entries; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error('Invalid XLSX ZIP directory');
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    if (name === wantedName) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(start, start + compressedSize);
      if (method === 0) return compressed.toString('utf8');
      if (method === 8) return zlib.inflateRawSync(compressed).toString('utf8');
      throw new Error(`Unsupported XLSX ZIP compression method ${method}`);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return null;
}

function columnIndex(reference) {
  const letters = String(reference || '').match(/^[A-Z]+/)?.[0] || '';
  return [...letters].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function parseXlsx(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const sharedXml = zipEntry(buffer, 'xl/sharedStrings.xml') || '';
  const shared = Array.from(sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g), match =>
    decodeXml(Array.from(match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g), value => value[1]).join('')));
  const sheet = zipEntry(buffer, 'xl/worksheets/sheet1.xml');
  if (!sheet) throw new Error('XLSX first worksheet was not found');
  return Array.from(sheet.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g), rowMatch => {
    const row = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attributes = cellMatch[1];
      const index = columnIndex(attributes.match(/\br="([A-Z]+\d+)"/)?.[1]);
      const raw = cellMatch[2].match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const type = attributes.match(/\bt="([^"]+)"/)?.[1];
      if (raw === undefined || index < 0) continue;
      row[index] = type === 's' ? shared[Number(raw)] : type === 'str' ? decodeXml(raw) : Number(raw);
    }
    return row;
  });
}

module.exports = { columnIndex, decodeXml, parseXlsx, zipEntry };
