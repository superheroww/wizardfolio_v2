'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

async function ensureDirectory(directory) {
  await fs.mkdir(directory, { recursive: true });
}

async function writeJson(file, value) {
  await ensureDirectory(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function checksum(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

module.exports = { checksum, ensureDirectory, readJson, writeJson };
