/* ============================================================
   CATALOGUE — the one list of what exists.

   Read by three things, so they can never drift apart:
     · hub/index.html          renders the shelves from it
     · .github/pages/assemble.sh   publishes the templates it names
     · tools/start-project.sh  validates the template you ask for

   Same shape as content.js in the templates: a plain global, no fetch,
   works from file://.

   ── TEMPLATES are published. CLIENTS are not. ──────────────────
   A template entry has `branch` and `dest`: assemble.sh copies that
   branch into the public site at that path.

   A client entry has NEITHER, on purpose. Client work lives in the
   private web-money-clients repo and is never copied into the public
   site. tools/check-hub.js FAILS THE BUILD if a client ever gains a
   `dest`, so this cannot be undone by accident.

   The gate on the client shelf is a convenience, not a lock — see
   hub/gate.js. What actually keeps client work private is that it is in
   a private repo and no client HTML is ever published here.
   ============================================================ */

window.CATALOGUE = {

  /* ---- Products: published to the public site ---------------------- */
  templates: [
    {
      id: 'cafe',
      branch: 'template-cafe',
      dest: 'cafe',
      number: '01',
      accent: '#a6432a',
      name: { ar: 'المقاهي والمطاعم', en: 'Café & Restaurant' },
      desc: {
        ar: 'خمس صفحات: الرئيسية، المنيو، قصتنا، المتجر، زورونا. منيو وحبوب ومنتجات تُبنى من ملف واحد.',
        en: 'Five pages: home, menu, story, shop, visit. Menu, beans and merch all build from one file.'
      },
      fits: { ar: 'مقاهي · مطاعم · مخابز', en: 'Cafés · restaurants · bakeries' }
    },
    {
      id: 'services',
      branch: 'template-services',
      dest: 'services',
      number: '02',
      accent: '#3f6f6a',
      name: { ar: 'الخدمات والحجوزات', en: 'Services & Booking' },
      desc: {
        ar: 'خدمات بمدة وسعر، فريق العمل، باقات، وأسئلة شائعة. الحجز عبر واتساب.',
        en: 'Services with duration and price, team profiles, packages and an FAQ. Booking over WhatsApp.'
      },
      fits: { ar: 'صالونات · حلاقة · عيادات · نوادي', en: 'Salons · barbers · clinics · gyms' }
    },
    {
      id: 'retail',
      branch: 'template-retail',
      dest: 'retail',
      number: '03',
      accent: '#7d5e29',
      name: { ar: 'المتاجر والبوتيكات', en: 'Retail & Boutique' },
      desc: {
        ar: 'كتالوج بالأحجام والأسعار، تشكيلات مختارة، وأسئلة شائعة. الطلب عبر واتساب.',
        en: 'A catalogue with sizes and prices, curated collections and an FAQ. Orders over WhatsApp.'
      },
      fits: { ar: 'عطور · عبايات · هدايا · ورود', en: 'Perfume · abayas · gifts · florists' }
    }
  ],

  /* ---- Client work: NEVER published from here ----------------------
     No `branch`, no `dest`. `repo` points at the private repo; `liveUrl`
     is filled in once the client's own site is actually deployed.
     status: 'building' | 'review' | 'live' | 'paused'                 */
  clients: [
    {
      id: 'rahwah',
      from: 'cafe',
      accent: '#a6432a',
      status: 'building',
      name: { ar: 'رهوة', en: 'Rahwah' },
      location: { ar: 'الرياض – حي الملقا', en: 'Riyadh – Al Malqa' },
      note: {
        ar: 'منيو كامل وأوقات العمل والموقع من المقهى نفسه. ينقص رقم الجوال وقائمة الحلويات.',
        en: 'Full menu, hours and map pin from the café itself. Phone number and sweets menu still outstanding.'
      },
      repo: 'https://github.com/Mishooooo0/web-money-clients/tree/rahwah',
      liveUrl: null
    }
  ]
};
