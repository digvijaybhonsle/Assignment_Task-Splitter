// backend/src/utils/parseCsv.js

import path from 'path';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';

/**
 * Parse and validate an uploaded CSV/XLSX buffer.
 *
 * @param {Buffer} fileBuffer  The raw file buffer from multer
 * @param {string} filename    The original filename (to detect extension)
 * @returns {Array<Object>}    Array of records: { firstName, phone, notes }
 * @throws {Error}             If unsupported format or validation fails
 */
export function parseAndValidate(fileBuffer, filename) {
  const ext = path.extname(filename).toLowerCase();

  // 1) Raw parse into JS objects
  let rawRecords;
  if (ext === '.csv') {
    rawRecords = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } else if (ext === '.xls' || ext === '.xlsx') {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rawRecords = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  } else {
    throw new Error('Unsupported file format. Please upload CSV, XLS, or XLSX.');
  }

  // 2) Normalize and validate each row
  const records = rawRecords.map((row, idx) => {
    // pull out header variants
    const firstName = row.firstName  ?? row.FirstName  ?? row.firstname  ?? row.FIRSTNAME  ?? '';
    const phone     = row.phone      ?? row.Phone      ?? row.PHONE      ?? '';
    const notes     = row.notes      ?? row.Notes      ?? row.NOTES      ?? '';

    // Validate presence
    if (typeof firstName !== 'string' || firstName.trim() === '') {
      throw new Error(`Missing or empty "firstName" value in row ${idx + 1}`);
    }
    const phoneStr = String(phone).trim();
    if (!/^\+?\d+$/.test(phoneStr)) {
      throw new Error(`Invalid "phone" in row ${idx + 1}: must be numeric (and may start with +)`);
    }

    return {
      firstName: firstName.trim(),
      phone: phoneStr,
      notes:     String(notes).trim(),
    };
  });

  return records;
}
