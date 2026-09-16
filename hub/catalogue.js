/* ============================================================
   CATALOGUE — the one list of what exists.

   Read by four things, so they can never drift apart:
     · index.html                  renders the template cards from it
     · .github/pages/assemble.sh   publishes the templates it names
     · tools/start-project.sh      validates the template you ask for
     · web-clients tools/server.js reads it straight off templates/main

   It stays under hub/ rather than moving to the root: four separate
   readers, two of them in another repository, already point here.

   Same shape as content.js in the templates: a plain global, no fetch,
   works from file://.

   ── TEMPLATES are published. CLIENTS are not. ──────────────────
   A template entry has `branch` and `dest`: assemble.sh copies that
   branch into the public site at that path.

   A client entry has NEITHER, on purpose. Client work lives in the
   private web-clients repo and is never copied into the public
   site. tools/check-hub.js FAILS THE BUILD if a client ever gains a
   `dest`, so this cannot be undone by accident.

   The public website never renders the client list at all — it has no
   markup for it. What keeps client work private is that it lives in a
   private repo and no client HTML is ever published here; the entries
   below exist so the owner's dashboard in that repo can list them.
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
      fits: { ar: 'مقاهي · مطاعم · مخابز', en: 'Cafés · restaurants · bakeries' },
      pages: [
        { file: 'index.html',      ar: 'الرئيسية',    en: 'Home' },
        { file: 'menu.html',       ar: 'المنيو',      en: 'Menu' },
        { file: 'story.html',      ar: 'قصتنا',       en: 'Story' },
        { file: 'shop.html',       ar: 'المتجر',      en: 'Shop' },
        { file: 'visit.html',      ar: 'زورونا',      en: 'Visit' }
      ],
      holds: [
        { key: 'menu',          ar: 'منيو بأقسام وأسعار',              en: 'A menu in sections, with prices' },
        { key: 'beans',         ar: 'حبوب بالمنشأ والمعالجة وملاحظات التذوق', en: 'Beans with origin, process and tasting notes' },
        { key: 'merch',         ar: 'منتجات بأسعارها',                 en: 'Merch with prices' }
      ]
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
      fits: { ar: 'صالونات · حلاقة · عيادات · نوادي', en: 'Salons · barbers · clinics · gyms' },
      pages: [
        { file: 'index.html',      ar: 'الرئيسية',    en: 'Home' },
        { file: 'services.html',   ar: 'الخدمات',     en: 'Services' },
        { file: 'team.html',       ar: 'فريقنا',      en: 'Team' },
        { file: 'story.html',      ar: 'قصتنا',       en: 'Story' },
        { file: 'book.html',       ar: 'احجز',        en: 'Book' }
      ],
      holds: [
        { key: 'services',      ar: 'خدمات بمدة وسعر',                 en: 'Services with a duration and a price' },
        { key: 'team',          ar: 'فريق العمل',                      en: 'The people who do the work' },
        { key: 'packages',      ar: 'باقات بما تشمله',                 en: 'Packages, with what each one includes' },
        { key: 'testimonials',  ar: 'آراء العملاء',                    en: 'Customer quotes' },
        { key: 'faq',           ar: 'أسئلة شائعة',                     en: 'An FAQ' }
      ]
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
      fits: { ar: 'عطور · عبايات · هدايا · ورود', en: 'Perfume · abayas · gifts · florists' },
      pages: [
        { file: 'index.html',      ar: 'الرئيسية',    en: 'Home' },
        { file: 'shop.html',       ar: 'المتجر',      en: 'Shop' },
        { file: 'collections.html', ar: 'التشكيلات',   en: 'Collections' },
        { file: 'story.html',      ar: 'قصتنا',       en: 'Story' },
        { file: 'visit.html',      ar: 'زورونا',      en: 'Visit' }
      ],
      holds: [
        { key: 'catalog',       ar: 'كتالوج بالأحجام والأسعار',        en: 'A catalogue with sizes and prices' },
        { key: 'collections',   ar: 'تشكيلات مختارة',                  en: 'Curated collections' },
        { key: 'faq',           ar: 'أسئلة شائعة',                     en: 'An FAQ' }
      ]
    },
    {
      id: 'contracting',
      branch: 'template-contracting',
      dest: 'contracting',
      number: '04',
      accent: '#9c2b21',
      name: { ar: 'المقاولات والتشطيب', en: 'Contracting & Finishing' },
      desc: {
        ar: 'مشاريع بصور قبل وبعد يسحبها الزائر بنفسه، وتخصصات، وخطوات العمل، وطلب عرض سعر عبر واتساب.',
        en: 'Projects the visitor drags between before and after, the trades on offer, how a job runs, and a quote requested over WhatsApp.'
      },
      fits: { ar: 'مقاولات · تشطيب · ترميم · واجهات', en: 'Contractors · finishing · restoration · facades' },
      pages: [
        { file: 'index.html',    ar: 'الرئيسية',      en: 'Home'     },
        { file: 'projects.html', ar: 'أعمالنا',       en: 'Projects' },
        { file: 'services.html', ar: 'خدماتنا',       en: 'Services' },
        { file: 'story.html',    ar: 'من نحن',        en: 'About'    },
        { file: 'quote.html',    ar: 'اطلب عرض سعر',  en: 'Get a quote' }
      ],
      holds: [
        { key: 'projects', ar: 'مشاريع بصور قبل وبعد',      en: 'Projects with before/after photographs' },
        { key: 'trades',   ar: 'تخصصات التنفيذ',            en: 'The trades on offer' },
        { key: 'process',  ar: 'خطوات العمل الأربع',        en: 'The four steps of a job' },
        { key: 'faq',      ar: 'أسئلة شائعة',               en: 'An FAQ' }
      ]
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
      repo: 'https://github.com/Mishooooo0/web-clients/tree/rahwah',
      liveUrl: null
    },
    {
      id: 'llabate',
      from: 'cafe',
      accent: '#3e5c6e',
      status: 'building',
      name: { ar: 'لابيت', en: 'Llabate' },
      location: { ar: 'السعودية', en: 'Saudi Arabia' },
      note: {
        ar: 'الهوية والمنيو وأوقات العمل وصورتان من حسابهم. ينقص رقم الجوال والعنوان.',
        en: 'Identity, menu, hours and two photographs from their own account. Phone and address still outstanding.'
      },
      repo: 'https://github.com/Mishooooo0/web-clients/tree/llabate',
      liveUrl: null
    }
  ]
};
