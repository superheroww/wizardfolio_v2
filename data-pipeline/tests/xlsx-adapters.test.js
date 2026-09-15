'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const jpmorgan = require('../adapters/jpmorgan');
const stateStreet = require('../adapters/state-street');
const { parseXlsx } = require('../lib/xlsx');

function zip(entries) {
  const locals = [];
  const central = [];
  let offset = 0;
  for (const [name, text] of Object.entries(entries)) {
    const fileName = Buffer.from(name);
    const source = Buffer.from(text);
    const data = zlib.deflateRawSync(source);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(data.length, 18); local.writeUInt32LE(source.length, 22); local.writeUInt16LE(fileName.length, 26);
    locals.push(local, fileName, data);
    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0); entry.writeUInt16LE(20, 4); entry.writeUInt16LE(20, 6); entry.writeUInt16LE(8, 10);
    entry.writeUInt32LE(data.length, 20); entry.writeUInt32LE(source.length, 24); entry.writeUInt16LE(fileName.length, 28); entry.writeUInt32LE(offset, 42);
    central.push(entry, fileName);
    offset += local.length + fileName.length + data.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(Object.keys(entries).length, 8); end.writeUInt16LE(Object.keys(entries).length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

function xlsx(rows) {
  const strings = [];
  const index = value => {
    let found = strings.indexOf(value);
    if (found < 0) { found = strings.length; strings.push(value); }
    return found;
  };
  const letters = column => String.fromCharCode(65 + column);
  const sheetRows = rows.map((row, rowIndex) => `<row>${row.map((value, column) => {
    if (value === null || value === undefined) return '';
    const reference = `${letters(column)}${rowIndex + 1}`;
    return typeof value === 'number' ? `<c r="${reference}"><v>${value}</v></c>` : `<c r="${reference}" t="s"><v>${index(value)}</v></c>`;
  }).join('')}</row>`).join('');
  const shared = strings.map(value => `<si><t>${value.replace(/&/g, '&amp;')}</t></si>`).join('');
  return zip({
    'xl/sharedStrings.xml': `<sst>${shared}</sst>`,
    'xl/worksheets/sheet1.xml': `<worksheet><sheetData>${sheetRows}</sheetData></worksheet>`
  });
}

test('dependency-free XLSX reader resolves shared strings and numbers', () => {
  assert.deepEqual(parseXlsx(xlsx([['Ticker', 'Weight'], ['ABC', 42.5]])), [['Ticker', 'Weight'], ['ABC', 42.5]]);
});

test('State Street adapter parses its official holdings workbook', () => {
  const payload = xlsx([
    ['Fund Name:', 'Test Fund'], ['Ticker Symbol:', 'SPY'], ['Holdings:', 'As of 14-Sep-2026'], [],
    ['Name', 'Ticker', 'Identifier', 'SEDOL', 'Weight', 'Sector', 'Shares Held', 'Local Currency'],
    ['ACME', 'ACME', '123456789', '1234567', 100, 'Technology', 10, 'USD']
  ]);
  const result = stateStreet.parse(payload, { symbol: 'SPY', ticker: 'SPY', country: 'US', currency: 'USD' });
  assert.equal(result.holdingsDate, '2026-09-14');
  assert.equal(result.reportedCoverage, 100);
  assert.equal(result.holdings[0].cusip, '123456789');
});

test('JPMorgan adapter parses its official holdings workbook', () => {
  const payload = xlsx([
    ['Holdings', 'Test Fund', null, null, null, null, null, 'As of Date: 09/14/2026'], [],
    ['Ticker', 'Security Description', 'Security Type', 'Method', 'Shares/Par', 'Market Value (USD)', 'Country', 'Currency', 'Sector', 'Industry', 'Coupon', 'Maturity Date', 'Effective Date', 'Contract Size', 'Strike Price', '% of Market Value', '% of Net Assets'],
    ['ACME', 'ACME COMMON', 'DOMESTIC COMMON STOCK', 'Physical', '10', 1000, 'United States', 'USD', 'Technology', 'Software', 0, '', '', '', 0, '100%', '100%']
  ]);
  const result = jpmorgan.parse(payload, { symbol: 'JEPI', ticker: 'JEPI', country: 'US', currency: 'USD', cusip: '46641Q332' });
  assert.equal(result.holdingsDate, '2026-09-14');
  assert.equal(result.reportedCoverage, 100);
  assert.match(result.holdings[0].sourceId, /JPMORGAN/);
});
