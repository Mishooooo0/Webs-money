#!/usr/bin/env node
/* ============================================================
   set-hub-password.js — change the passphrase on the hub's client shelf.

       node tools/set-hub-password.js "the new passphrase"

   Writes its SHA-256 into hub/gate.js. Matching is case-insensitive and
   trims surrounding space, so "Password " and "password" both work.

   ⚠ This is obfuscation, not security. The hash ships to every visitor of
   a public page and the check runs in their browser. It keeps the client
   list out of casual view; it protects nothing. See hub/gate.js.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const phrase = process.argv.slice(2).join(' ');
if (!phrase.trim()) {
  console.error('usage: node tools/set-hub-password.js "the new passphrase"');
  process.exit(1);
}

const normalised = phrase.trim().toLowerCase();
const hash = crypto.createHash('sha256').update(normalised, 'utf8').digest('hex');

const file = path.join(__dirname, '..', 'hub', 'gate.js');
const before = fs.readFileSync(file, 'utf8');

const line = /(var HASH = ')[0-9a-f]{64}('; \/\/ ).*/;
if (!line.test(before)) {
  console.error('set-hub-password: could not find the HASH line in hub/gate.js');
  process.exit(1);
}

/* The trailing comment names the phrase only when it is the shipped default,
   so a real passphrase is never written into a public repo in clear text. */
const isDefault = normalised === 'password';
const after = before.replace(line, `$1${hash}$2${isDefault ? '"password"' : 'set with tools/set-hub-password.js'}`);

fs.writeFileSync(file, after, 'utf8');
console.log(`set-hub-password: hub/gate.js updated (sha256 ${hash.slice(0, 12)}…)`);
if (!isDefault) console.log('The phrase itself was not written to the file.');
