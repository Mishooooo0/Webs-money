/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3      · RETAIL & BOUTIQUE ·
   ------------------------------------------------------------
   Every word on this website lives here, as an { ar, en } pair, plus the
   data that drives the catalogue, the collections and the FAQ.

   The default copy is written for a PERFUME AND OUD HOUSE — the highest
   margin small retail in this market. It retargets to an abaya boutique,
   a gift shop, a florist, a jeweller or an accessories store by editing
   this file alone: swap the catalogue groups, the collections and the
   copy. The pages, the CSS and the engine do not change.

   This template does not take payment. Orders go to WhatsApp, which is
   how most boutiques here already sell — and a real checkout is a
   different product at a different price. Every order link resolves from
   contact.whatsapp below.

   After editing this file run:  node tools/sync-static.js
   ============================================================ */

window.SITE = {

  /* ---- Identity ---------------------------------------------------- */
  brand: {
    primary:   { ar: 'اسم المتجر', en: 'Store Name' },
    secondary: 'MAISON',
    currency:  { ar: 'ر.س', en: 'SAR' }
  },

  /* ---- Contact — every link on the site resolves from here ---------- */
  contact: {
    addressLines: {
      ar: ['المدينة – اسم الحي', 'اسم المركز التجاري'],
      en: ['City – District', 'Mall or street name']
    },
    phone:     '+966500000000',
    phoneHref: 'tel:+966500000000',
    phoneLabel:'+966 50 000 0000',
    email:     'hello@example.com',
    emailHref: 'mailto:hello@example.com',
    whatsapp:  'https://wa.me/966500000000',
    instagram: 'https://instagram.com/',
    instagramHandle: '@example',
    maps:      'https://maps.google.com/'
  },

  /* ---- Opening hours ------------------------------------------------
     `key` matches JS getDay() so today's row highlights itself. */
  hours: [
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '10 صباحًا – 11 ليلًا', en: '10:00 AM – 11:00 PM' } },
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '10 صباحًا – 11 ليلًا', en: '10:00 AM – 11:00 PM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '10 صباحًا – 11 ليلًا', en: '10:00 AM – 11:00 PM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '10 صباحًا – 11 ليلًا', en: '10:00 AM – 11:00 PM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '10 صباحًا – 11 ليلًا', en: '10:00 AM – 11:00 PM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '10 صباحًا – 12 ليلًا', en: '10:00 AM – 12:00 AM' } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: '2 ظهرًا – 12 ليلًا',   en: '2:00 PM – 12:00 AM'  } }
  ],

  /* ---- The catalogue ------------------------------------------------
     Rendered by the generic `catalog` renderer, so groups and items are
     entirely up to you. Each item takes an optional `image`, `tags` and
     `ratio` ('ph--portrait' by default, 'ph--square' for flat-lay shots).
     `featured: true` lifts an item onto the home page (first three win). */
  catalog: [
    {
      id: 'oud',
      name: { ar: 'العود ومشتقاته', en: 'Oud' },
      note: { ar: 'تُقطَّع وتُوزن أمامك', en: 'Cut and weighed in front of you' },
      items: [
        { price: '450', featured: true,
          name: { ar: 'عود كمبودي', en: 'Cambodian Oud' },
          desc: { ar: 'دخان دافئ وحلاوة خشبية تبقى طويلًا.', en: 'Warm smoke over a wood sweetness that lasts.' },
          tags: { ar: ['3 جرام'], en: ['3 g'] } },
        { price: '620',
          name: { ar: 'عود هندي', en: 'Indian Oud' },
          desc: { ar: 'أعمق وأثقل، للمجالس والمناسبات.', en: 'Deeper and heavier — for gatherings.' },
          tags: { ar: ['3 جرام'], en: ['3 g'] } },
        { price: '180',
          name: { ar: 'معمول ورد', en: 'Rose Ma’moul' },
          desc: { ar: 'مخلوط باليد مع دهن الورد الطائفي.', en: 'Hand-blended with Taif rose oil.' },
          tags: { ar: ['50 جرام'], en: ['50 g'] } }
      ]
    },
    {
      id: 'perfume',
      name: { ar: 'العطور', en: 'Perfume' },
      note: { ar: 'جرّبها على البشرة قبل أن تقرر', en: 'Try it on skin before you decide' },
      items: [
        { price: '380', featured: true,
          name: { ar: 'مسك أبيض', en: 'White Musk' },
          desc: { ar: 'نظيف وهادئ، يصلح لكل يوم.', en: 'Clean and quiet — an everyday scent.' },
          tags: { ar: ['100 مل'], en: ['100 ml'] } },
        { price: '520',
          name: { ar: 'ورد وعنبر', en: 'Rose & Amber' },
          desc: { ar: 'ورد في البداية وعنبر في النهاية.', en: 'Rose at the open, amber at the close.' },
          tags: { ar: ['100 مل'], en: ['100 ml'] } },
        { price: '290',
          name: { ar: 'دهن عود مركّز', en: 'Oud Oil' },
          desc: { ar: 'قطرة واحدة تكفي ليوم كامل.', en: 'One drop lasts the day.' },
          tags: { ar: ['3 مل'], en: ['3 ml'] } }
      ]
    },
    {
      id: 'home',
      name: { ar: 'عطور المكان', en: 'Home' },
      items: [
        { price: '210', featured: true,
          name: { ar: 'بخور مبشور', en: 'Bakhoor' },
          desc: { ar: 'يكفي شهرًا من المجالس.', en: 'A month of evenings.' },
          tags: { ar: ['100 جرام'], en: ['100 g'] } },
        { price: '340',
          name: { ar: 'شمعة معطّرة', en: 'Scented Candle' },
          desc: { ar: 'شمع صويا، تحترق أربعين ساعة.', en: 'Soy wax, forty hours.' },
          tags: { ar: ['220 جرام'], en: ['220 g'] } },
        { price: '160',
          name: { ar: 'معطّر فرش', en: 'Linen Mist' },
          desc: { ar: 'للملابس والمفارش.', en: 'For clothes and linen.' },
          tags: { ar: ['250 مل'], en: ['250 ml'] } }
      ]
    }
  ],

  /* ---- Collections — rendered by the generic `cards` renderer -------- */
  collections: [
    { name: { ar: 'تشكيلة الشتاء', en: 'Winter' },
      desc: { ar: 'عود وعنبر وكل ما يثقل قليلًا في البرد.', en: 'Oud, amber, and everything that turns heavier in the cold.' },
      ratio: 'ph--square' },
    { name: { ar: 'الهدايا', en: 'Gifting' },
      desc: { ar: 'علب جاهزة بأحجام مختلفة، تُغلَّف عندنا مجانًا.', en: 'Ready boxes in three sizes, wrapped here at no charge.' },
      ratio: 'ph--square' },
    { name: { ar: 'الجديد', en: 'New In' },
      desc: { ar: 'ما وصل هذا الشهر، قبل أن ينفد.', en: 'What landed this month, before it goes.' },
      ratio: 'ph--square' }
  ],

  /* ---- FAQ — rendered as <details>, so it opens without JavaScript --- */
  faq: [
    { q: { ar: 'هل أقدر أطلب من غير ما أزور المتجر؟', en: 'Can I order without visiting?' },
      a: { ar: 'نعم. أرسل لنا اسم المنتج على واتساب ونرتب لك الدفع والتوصيل.',
           en: 'Yes. Send us the product on WhatsApp and we arrange payment and delivery.' } },
    { q: { ar: 'كم يستغرق التوصيل؟', en: 'How long is delivery?' },
      a: { ar: 'داخل المدينة خلال يوم عمل، وبقية المناطق من يومين إلى أربعة.',
           en: 'Same city within one working day; elsewhere two to four.' } },
    { q: { ar: 'هل تغلّفون الهدايا؟', en: 'Do you gift wrap?' },
      a: { ar: 'نعم، التغليف مجاني ونضيف بطاقة بخط اليد إذا رغبت.',
           en: 'Yes — wrapping is free, and we add a handwritten card if you like.' } },
    { q: { ar: 'هل يمكن الاستبدال أو الإرجاع؟', en: 'Can I exchange or return?' },
      a: { ar: 'خلال سبعة أيام على المنتجات غير المفتوحة، مع الفاتورة.',
           en: 'Within seven days on unopened items, with the receipt.' } },
    { q: { ar: 'هل الأسعار شاملة الضريبة؟', en: 'Do prices include VAT?' },
      a: { ar: 'نعم، كل الأسعار المعروضة شاملة ضريبة القيمة المضافة.', en: 'Yes — every price shown includes VAT.' } }
  ],

  /* ==========================================================
     TRANSLATIONS — addressed from markup as data-i18n="nav.home"
     ========================================================== */
  t: {
    nav: {
      home:        { ar: 'الرئيسية',  en: 'Home'        },
      shop:        { ar: 'المتجر',    en: 'Shop'        },
      collections: { ar: 'التشكيلات', en: 'Collections' },
      story:       { ar: 'قصتنا',     en: 'Story'       },
      visit:       { ar: 'زورونا',    en: 'Visit'       }
    },

    common: {
      skip:        { ar: 'تخطَّ إلى المحتوى',  en: 'Skip to content' },
      langSwitch:  { ar: 'English',            en: 'العربية' },
      langLabel:   { ar: 'تغيير اللغة',        en: 'Change language' },
      navLabel:    { ar: 'التنقل الرئيسي',     en: 'Main navigation' },
      openMenu:    { ar: 'فتح القائمة',        en: 'Open menu' },
      call:        { ar: 'اتصل بنا',           en: 'Call us' },
      viewShop:    { ar: 'تصفّح المتجر',       en: 'Browse the shop' },
      directions:  { ar: 'الاتجاهات',          en: 'Get directions' },
      order:       { ar: 'اطلب عبر واتساب',    en: 'Order on WhatsApp' },
      instagram:   { ar: 'إنستقرام',           en: 'Instagram' },
      backHome:    { ar: 'العودة للرئيسية',    en: 'Back to home' },
      noscript:    { ar: 'فعّل الجافاسكربت لعرض المتجر والتشكيلات كاملة.', en: 'Enable JavaScript to see the full shop and collections.' }
    },

    hero: {
      title:   { ar: 'رائحة تُعرف بها', en: 'A scent they know you by' },
      tagline: { ar: 'عود وعطور تُخلط باليد، وتُوزن أمامك. مفتوح كل يوم، والطلب عبر واتساب.',
                 en: 'Oud and perfume blended by hand and weighed in front of you. Open daily, and orders go through WhatsApp.' },
      meta1:   { ar: 'المدينة – اسم الحي', en: 'City – District' },
      meta2:   { ar: 'نفتح 10 صباحًا',      en: 'Open from 10 AM' }
    },

    home: {
      introEyebrow:   { ar: 'من نحن',  en: 'Who we are' },
      introTitle:     { ar: 'نختار الحبّة قبل أن نخلطها', en: 'We choose the grain before we blend it' },
      introText:      { ar: 'نشتري العود بالقطعة ونخلط العطر على دفعات صغيرة، فما تشتريه اليوم لن يكون مطابقًا لما سبقه — وهذا مقصود.',
                        en: 'We buy oud by the piece and blend perfume in small batches, so what you buy today is not identical to what came before it. That is deliberate.' },
      featuredEyebrow:{ ar: 'المتجر',  en: 'The shop' },
      featuredTitle:  { ar: 'الأكثر طلبًا', en: 'Most asked for' },
      collectionsTitle:{ ar: 'التشكيلات', en: 'Collections' },
      collectionsLede:{ ar: 'مجموعات نرتّبها بأنفسنا، للهدية أو لك.', en: 'Sets we put together ourselves — to give, or to keep.' },
      galleryEyebrow: { ar: 'المتجر',  en: 'The store' },
      galleryTitle:   { ar: 'تعال وشمّ قبل أن تشتري', en: 'Come and smell before you buy' },
      visitTitle:     { ar: 'زورونا في المتجر', en: 'Visit the store' },
      visitText:      { ar: 'التجربة على البشرة تختلف عن الورق. مرّ علينا، أو أرسل لنا على واتساب ونرتب لك التوصيل.',
                        en: 'On skin it is a different scent than on paper. Come by, or message us and we arrange delivery.' }
    },

    shopPage: {
      eyebrow: { ar: 'الأسعار والأحجام', en: 'Prices & sizes' },
      title:   { ar: 'المتجر', en: 'The Shop' },
      lede:    { ar: 'كل منتج بحجمه وسعره. ما لا تجده هنا اسأل عنه — الرف أوسع من الصفحة.',
                 en: 'Every product with its size and price. Ask about anything you do not see — the shelf is wider than the page.' },
      note:    { ar: 'الأسعار شاملة ضريبة القيمة المضافة.', en: 'All prices include VAT.' },
      faqTitle:{ ar: 'أسئلة شائعة', en: 'Common questions' }
    },

    collectionsPage: {
      eyebrow: { ar: 'مجموعات مختارة', en: 'Curated sets' },
      title:   { ar: 'التشكيلات', en: 'Collections' },
      lede:    { ar: 'نرتّب المجموعات بأنفسنا حسب الموسم والمناسبة، ونغلّفها مجانًا.',
                 en: 'We put these together ourselves by season and occasion, and wrap them at no charge.' }
    },

    story: {
      eyebrow:     { ar: 'عن المتجر', en: 'About us' },
      title:       { ar: 'قصتنا', en: 'Our Story' },
      lede:        { ar: 'بدأنا من مجلس العائلة، حيث كان العود يُقطَّع أمام الضيوف لا خلف باب.',
                     en: 'We started in a family sitting room, where the oud was cut in front of guests rather than behind a door.' },
      bodyTitle:   { ar: 'كيف بدأ كل شيء', en: 'How it began' },
      bodyText:    { ar: 'فتحنا بخزانة واحدة وميزان. اليوم توسّع الرف، وبقيت الطريقة نفسها: تشمّ قبل أن تشتري، ونوزن أمامك، ونقول لك بصراحة أيّها يناسبك.',
                     en: 'We opened with one cabinet and a scale. The shelf has grown; the method has not: you smell before you buy, we weigh in front of you, and we tell you plainly which one suits you.' },
      valuesTitle: { ar: 'ما نلتزم به', en: 'What we hold to' },
      v1Title:     { ar: 'المصدر',   en: 'Source' },
      v1Text:      { ar: 'نشتري بأنفسنا ونعرف من أين جاءت كل قطعة.', en: 'We buy in person and know where every piece came from.' },
      v2Title:     { ar: 'الوزن',    en: 'Weight' },
      v2Text:      { ar: 'الميزان أمامك، والسعر بالجرام معلن.', en: 'The scale faces you, and the price per gram is posted.' },
      v3Title:     { ar: 'الصراحة',  en: 'Straight talk' },
      v3Text:      { ar: 'نقول لك ما يناسبك، لا ما يزيد الفاتورة.', en: 'We tell you what suits you, not what raises the bill.' },
      quote:       { ar: '«العطر لا يُشترى بالوصف، يُشترى بالشمّ.»', en: '“Perfume is not bought by description. It is bought by smell.”' },
      quoteCite:   { ar: 'من فريق المتجر', en: 'From the team' }
    },

    visit: {
      eyebrow:      { ar: 'الموقع وأوقات العمل', en: 'Location & hours' },
      title:        { ar: 'زورونا', en: 'Visit Us' },
      lede:         { ar: 'المتجر مفتوح كل يوم. تعال وجرّب على البشرة، ولا تستعجل.',
                      en: 'The store is open every day. Come and try it on skin — take your time.' },
      addressTitle: { ar: 'العنوان',      en: 'Address' },
      hoursTitle:   { ar: 'أوقات العمل',  en: 'Opening Hours' },
      contactTitle: { ar: 'تواصل معنا',   en: 'Get in touch' },
      parkingTitle: { ar: 'المواقف',      en: 'Parking' },
      parkingText:  { ar: 'مواقف المركز التجاري مجانية لأول ثلاث ساعات.',
                      en: 'Mall parking is free for the first three hours.' }
    },

    footer: {
      tagline:      { ar: 'رائحة تُعرف بها.', en: 'A scent they know you by.' },
      exploreTitle: { ar: 'تصفّح',  en: 'Explore' },
      visitTitle:   { ar: 'زورونا', en: 'Visit'   },
      followTitle:  { ar: 'تابعنا', en: 'Follow'  },
      rights:       { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' }
    },

    notfound: {
      title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
      text:  { ar: 'ربما تغيّر الرابط أو حُذفت الصفحة. لنعد بك إلى البداية.',
               en: 'The link may have changed or the page was removed. Let’s get you back.' }
    },

    /* Alt text for the image slots. Update when real photos land. */
    alt: {
      hero:      { ar: 'داخل المتجر: رفوف وزجاجات وإضاءة دافئة', en: 'Inside the store: shelves, bottles and warm light' },
      room:      { ar: 'ركن التجربة',              en: 'The testing corner' },
      counter:   { ar: 'الميزان وطاولة الخلط',     en: 'The scale and the blending table' },
      product:   { ar: 'أحد منتجات المتجر',        en: 'A product from the store' },
      gift:      { ar: 'علبة هدية مغلّفة',         en: 'A wrapped gift box' },
      storefront:{ ar: 'واجهة المتجر من الخارج',   en: 'The storefront' },
      map:       { ar: 'موقع المتجر على الخريطة',  en: 'The store location on the map' }
    }
  }
};
