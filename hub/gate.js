/* ============================================================
   GATE — the client shelf's passphrase prompt.

   ⚠ READ THIS BEFORE TRUSTING IT WITH ANYTHING.

   This is NOT access control. This file is served to every visitor of a
   public site. The hash below is readable in devtools, the comparison
   runs in the visitor's own browser, and the whole thing is bypassed by
   editing the DOM. Treat it as a doormat, not a lock.

   What actually keeps client work private is that there is nothing here
   to unlock:

     · No client site is ever copied into the published folder.
       assemble.sh publishes templates only, and tools/check-hub.js fails
       the build if a client entry ever gains a `dest`.
     · The client cards hold a name, a status and a link. The work itself
       is in the private web-money-clients repo, where GitHub enforces
       access — someone without it gets a 404 from GitHub, not from us.

   So the gate is doing a reasonable job: keeping a client list out of
   casual view on a public page. It is not doing, and cannot do, more.

   To change the passphrase:  node tools/set-hub-password.js "new one"
   ============================================================ */

(function () {
  'use strict';

  /* SHA-256 of the passphrase. Hashed so the word itself is not sitting
     in plain text in a public repo — which is obfuscation, not secrecy. */
  var HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // "password"
  var REMEMBER_KEY = 'hub.gate';

  async function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function remembered() {
    try { return sessionStorage.getItem(REMEMBER_KEY) === HASH; }
    catch (err) { return false; }   /* private mode, blocked storage */
  }

  function remember() {
    try { sessionStorage.setItem(REMEMBER_KEY, HASH); } catch (err) { /* not fatal */ }
  }

  window.HubGate = {
    /* Unlocked for this tab only — deliberately not localStorage, so a
       shared machine does not stay open on the client list. */
    isOpen: remembered,
    remember: remember,

    check: async function (attempt) {
      /* crypto.subtle needs a secure context. On plain http:// beyond
         localhost it is undefined; say so rather than throwing. */
      if (!window.crypto || !crypto.subtle) return null;
      return (await sha256(String(attempt).trim().toLowerCase())) === HASH;
    }
  };
})();
