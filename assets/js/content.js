/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3   · SERVICES & BOOKING ·
   ------------------------------------------------------------
   Every word on this website lives here, as an { ar, en } pair, plus the
   data that drives the services, team, packages, testimonials and FAQ.

   The default copy is written for a barbershop or salon, the largest
   segment. It retargets to a CLINIC, a GYM, a SPA or a STUDIO by editing
   this file alone — the page structure, the CSS and the engine do not
   change. Swap the service categories, the team roles and the packages,
   and the site is a different business.

   Booking is a WhatsApp deep link, not a calendar: that is what small
   businesses here actually use, and every such link resolves from
   contact.whatsapp below.

   After editing this file run:  node tools/sync-static.js
   ============================================================ */

window.SITE = {

  /* ---- Identity ---------------------------------------------------- */
  brand: {
    primary:   { ar: 'اسم النشاط', en: 'Business Name' },
    secondary: 'STUDIO',
    currency:  { ar: 'ر.س', en: 'SAR' }
  },

  /* ---- Contact — every link on the site resolves from here ---------- */
  contact: {
    addressLines: {
      ar: ['المدينة – اسم الحي', 'اسم الشارع'],
      en: ['City – District', 'Street name']
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
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '١٠:٠٠ ص – ١٠:٠٠ م', en: '10:00 AM – 10:00 PM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '١٠:٠٠ ص – ١٠:٠٠ م', en: '10:00 AM – 10:00 PM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '١٠:٠٠ ص – ١٠:٠٠ م', en: '10:00 AM – 10:00 PM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '١٠:٠٠ ص – ١٠:٠٠ م', en: '10:00 AM – 10:00 PM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '١٠:٠٠ ص – ١٢:٠٠ م', en: '10:00 AM – 12:00 AM' } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: '٢:٠٠ م – ١٢:٠٠ م',  en: '2:00 PM – 12:00 AM'  } },
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '١٠:٠٠ ص – ١٠:٠٠ م', en: '10:00 AM – 10:00 PM' } }
  ],

  /* ---- Services -----------------------------------------------------
     Categories render in array order. `featured: true` lifts a service
     onto the home page strip (first three win). `duration` is optional
     and simply disappears from the row when absent. */
  services: [
    {
      id: 'hair',
      name: { ar: 'الشعر', en: 'Hair' },
      note: { ar: 'بالحجز أو بالدور', en: 'By appointment or walk-in' },
      items: [
        { price: '60', duration: { ar: '٣٠ دقيقة', en: '30 min' }, featured: true,
          name: { ar: 'قص شعر', en: 'Haircut' },
          desc: { ar: 'قص وغسيل وتصفيف، مع استشارة قصيرة قبل البداية.',
                  en: 'Cut, wash and style, with a short consultation first.' } },
        { price: '90', duration: { ar: '٤٥ دقيقة', en: '45 min' },
          name: { ar: 'قص وتصفيف', en: 'Cut & Style' },
          desc: { ar: 'قص كامل مع تصفيف للمناسبات.', en: 'A full cut finished for an occasion.' } },
        { price: '150', duration: { ar: '٩٠ دقيقة', en: '90 min' },
          name: { ar: 'صبغة', en: 'Colour' },
          desc: { ar: 'لون كامل أو خصلات. اختبار حساسية قبل الموعد بيوم.',
                  en: 'Full colour or highlights. Patch test the day before.' } },
        { price: '45', duration: { ar: '٢٠ دقيقة', en: '20 min' },
          name: { ar: 'تصفيف فقط', en: 'Styling Only' },
          desc: { ar: 'غسيل وتجفيف وتصفيف، بدون قص.', en: 'Wash, dry and style — no cut.' } }
      ]
    },
    {
      id: 'beard',
      name: { ar: 'اللحية', en: 'Beard' },
      note: { ar: 'مناشف ساخنة وزيوت طبيعية', en: 'Hot towels and natural oils' },
      items: [
        { price: '40', duration: { ar: '٢٠ دقيقة', en: '20 min' }, featured: true,
          name: { ar: 'تحديد اللحية', en: 'Beard Trim' },
          desc: { ar: 'تحديد وتشذيب، مع منشفة ساخنة.', en: 'Shaped and tidied, with a hot towel.' } },
        { price: '70', duration: { ar: '٤٠ دقيقة', en: '40 min' },
          name: { ar: 'حلاقة تقليدية', en: 'Traditional Shave' },
          desc: { ar: 'موسى مستقيم، منشفتان ساخنتان، وبلسم بعد الحلاقة.',
                  en: 'Straight razor, two hot towels, and an after-shave balm.' } }
      ]
    },
    {
      id: 'care',
      name: { ar: 'العناية', en: 'Care' },
      note: { ar: 'احجز مع خدمة أخرى ووفّر', en: 'Book alongside another service and save' },
      items: [
        { price: '120', duration: { ar: '٤٥ دقيقة', en: '45 min' }, featured: true,
          name: { ar: 'تنظيف بشرة', en: 'Facial' },
          desc: { ar: 'تنظيف عميق وترطيب، مناسب لكل أنواع البشرة.',
                  en: 'Deep clean and hydrate — suits every skin type.' } },
        { price: '80', duration: { ar: '٣٠ دقيقة', en: '30 min' },
          name: { ar: 'مساج فروة الرأس', en: 'Scalp Massage' },
          desc: { ar: 'زيوت دافئة وضغط خفيف، للاسترخاء.', en: 'Warm oils and light pressure.' } },
        { price: '55', duration: { ar: '٢٥ دقيقة', en: '25 min' },
          name: { ar: 'عناية باليدين', en: 'Hand Care' },
          desc: { ar: 'تنظيف وتقليم وترطيب.', en: 'Clean, trim and moisturise.' } }
      ]
    }
  ],

  /* ---- The people ---------------------------------------------------
     Add `image: 'assets/photos/name.jpg'` to any entry and the branded
     placeholder is replaced by a real photograph. See BRAND.md. */
  team: [
    { name: { ar: 'الاسم الأول', en: 'First Name' },
      role: { ar: 'مدير الفرع', en: 'Manager' },
      bio:  { ar: 'خمسة عشر عامًا في المهنة، ويعرف اسم كل زبون.',
              en: 'Fifteen years in the trade, and knows every regular by name.' } },
    { name: { ar: 'الاسم الثاني', en: 'Second Name' },
      role: { ar: 'أخصائي قص', en: 'Senior Stylist' },
      bio:  { ar: 'متخصص في القصّات الكلاسيكية والتحديد الدقيق.',
              en: 'Classic cuts and precise shaping.' } },
    { name: { ar: 'الاسم الثالث', en: 'Third Name' },
      role: { ar: 'أخصائي لون', en: 'Colour Specialist' },
      bio:  { ar: 'يقرأ درجة الشعر قبل أن يلمس الصبغة.',
              en: 'Reads the hair before touching the colour.' } },
    { name: { ar: 'الاسم الرابع', en: 'Fourth Name' },
      role: { ar: 'العناية بالبشرة', en: 'Skin Therapist' },
      bio:  { ar: 'يفضّل الخطوات البسيطة على الخلطات المعقّدة.',
              en: 'Prefers simple routines to complicated ones.' } }
  ],

  /* ---- Packages ------------------------------------------------------
     `includes` is an { ar: [...], en: [...] } pair of lines. */
  packages: [
    { price: '250',
      name: { ar: 'الباقة الشهرية', en: 'Monthly' },
      desc: { ar: 'زيارتان في الشهر بسعر أقل من المفرد.', en: 'Two visits a month for less than singles.' },
      includes: { ar: ['قصّتان في الشهر', 'تحديد لحية مجاني', 'حجز بالأولوية'],
                  en: ['Two cuts a month', 'Free beard trim', 'Priority booking'] } },
    { price: '420', featured: true,
      name: { ar: 'الباقة الفصلية', en: 'Seasonal' },
      desc: { ar: 'ثلاثة أشهر، وأفضل قيمة لدينا.', en: 'Three months — our best value.' },
      includes: { ar: ['ست قصّات', 'تحديد لحية مع كل زيارة', 'تنظيف بشرة مرة واحدة', 'حجز بالأولوية'],
                  en: ['Six cuts', 'Beard trim every visit', 'One facial', 'Priority booking'] } },
    { price: '700',
      name: { ar: 'باقة العريس', en: 'Groom' },
      desc: { ar: 'تحضير كامل قبل المناسبة، لك ولمرافقك.', en: 'Full preparation before the day, for you and a guest.' },
      includes: { ar: ['جلسة تجريبية', 'قص وتصفيف يوم المناسبة', 'حلاقة تقليدية', 'تنظيف بشرة', 'ضيف واحد مجانًا'],
                  en: ['Trial session', 'Cut and style on the day', 'Traditional shave', 'Facial', 'One guest free'] } }
  ],

  /* ---- Social proof ---------------------------------------------------- */
  testimonials: [
    { name: { ar: 'زبون دائم', en: 'A regular' },
      text: { ar: '«أول مكان أخرج منه وأنا مرتاح من الشكل ومن الجلسة نفسها.»',
              en: '“The first place I leave happy with the cut and with the hour itself.”' } },
    { name: { ar: 'زبون جديد', en: 'A first visit' },
      text: { ar: '«حجزت عبر واتساب خلال دقيقة، ودخلت في وقتي بالضبط.»',
              en: '“Booked on WhatsApp in a minute, and was seen exactly on time.”' } },
    { name: { ar: 'من الحي', en: 'From the neighbourhood' },
      text: { ar: '«نظيف، هادئ، ويحترمون الموعد. صار المكان الثابت لنا.»',
              en: '“Clean, calm, and they respect the appointment. It is our regular now.”' } }
  ],

  /* ---- FAQ — rendered as <details>, so it opens without JavaScript ------ */
  faq: [
    { q: { ar: 'هل أحتاج حجزًا مسبقًا؟', en: 'Do I need to book ahead?' },
      a: { ar: 'نستقبل بالدور عند توفر مكان، لكن الحجز يضمن وقتك — خاصة في المساء ونهاية الأسبوع.',
           en: 'We take walk-ins when there is room, but booking guarantees your slot — especially evenings and weekends.' } },
    { q: { ar: 'كيف أحجز؟', en: 'How do I book?' },
      a: { ar: 'أرسل لنا رسالة على واتساب بالخدمة والوقت المناسب، ونؤكد لك خلال دقائق.',
           en: 'Message us on WhatsApp with the service and a time that suits you; we confirm within minutes.' } },
    { q: { ar: 'ماذا لو تأخرت أو أردت الإلغاء؟', en: 'What if I am late or need to cancel?' },
      a: { ar: 'أخبرنا قبل ساعة على الأقل ونعيد جدولة الموعد بلا رسوم. التأخر أكثر من خمس عشرة دقيقة قد يعني تقصير الجلسة.',
           en: 'Tell us at least an hour ahead and we reschedule at no charge. More than fifteen minutes late may mean a shorter session.' } },
    { q: { ar: 'ما طرق الدفع المقبولة؟', en: 'How can I pay?' },
      a: { ar: 'مدى، آبل باي، والبطاقات الائتمانية، والنقد.', en: 'Mada, Apple Pay, credit cards and cash.' } },
    { q: { ar: 'هل الأسعار شاملة الضريبة؟', en: 'Do prices include VAT?' },
      a: { ar: 'نعم، كل الأسعار المعروضة شاملة ضريبة القيمة المضافة.', en: 'Yes — every price shown includes VAT.' } }
  ],

  /* ==========================================================
     TRANSLATIONS — addressed from markup as data-i18n="nav.home"
     ========================================================== */
  t: {
    nav: {
      home:     { ar: 'الرئيسية', en: 'Home'     },
      services: { ar: 'الخدمات',  en: 'Services' },
      team:     { ar: 'فريقنا',   en: 'Team'     },
      story:    { ar: 'قصتنا',    en: 'Story'    },
      book:     { ar: 'احجز',     en: 'Book'     }
    },

    common: {
      skip:        { ar: 'تخطَّ إلى المحتوى',  en: 'Skip to content' },
      langSwitch:  { ar: 'English',            en: 'العربية' },
      langLabel:   { ar: 'تغيير اللغة',        en: 'Change language' },
      navLabel:    { ar: 'التنقل الرئيسي',     en: 'Main navigation' },
      openMenu:    { ar: 'فتح القائمة',        en: 'Open menu' },
      call:        { ar: 'اتصل بنا',           en: 'Call us' },
      viewServices:{ ar: 'تصفّح الخدمات',      en: 'See the services' },
      directions:  { ar: 'الاتجاهات',          en: 'Get directions' },
      book:        { ar: 'احجز عبر واتساب',    en: 'Book on WhatsApp' },
      instagram:   { ar: 'إنستقرام',           en: 'Instagram' },
      backHome:    { ar: 'العودة للرئيسية',    en: 'Back to home' },
      noscript:    { ar: 'فعّل الجافاسكربت لعرض الخدمات والباقات كاملة.', en: 'Enable JavaScript to see the full services and packages.' }
    },

    hero: {
      title:   { ar: 'خدمة تستحق الموعد', en: 'Worth booking the time for' },
      tagline: { ar: 'فريق يعرف ما يفعل، مكان هادئ، ومواعيد تُحترم. احجز في دقيقة عبر واتساب.',
                 en: 'A team who know their craft, a calm room, and appointments that are kept. Book in a minute on WhatsApp.' },
      meta1:   { ar: 'المدينة – اسم الحي', en: 'City – District' },
      meta2:   { ar: 'يوميًا من ١٠ صباحًا', en: 'Daily from 10 AM' }
    },

    home: {
      introEyebrow:   { ar: 'من نحن', en: 'Who we are' },
      introTitle:     { ar: 'وقتك محجوز لك وحدك', en: 'Your time is held for you alone' },
      introText:      { ar: 'نحجز لكل موعد وقتًا كاملًا، فلا أحد ينتظر ولا أحد يُستعجل. تدخل في وقتك، وتخرج راضيًا.',
                        en: 'Every appointment gets its full hour, so nobody waits and nobody is rushed. You are seen on time, and you leave happy.' },
      featuredEyebrow:{ ar: 'الخدمات',  en: 'Services' },
      featuredTitle:  { ar: 'الأكثر طلبًا', en: 'Most booked' },
      galleryEyebrow: { ar: 'المكان',   en: 'The room' },
      galleryTitle:   { ar: 'مساحة نظيفة وهادئة', en: 'Clean, quiet, and yours for the hour' },
      praiseTitle:    { ar: 'ماذا يقول زبائننا', en: 'What people say' },
      visitTitle:     { ar: 'احجز موعدك', en: 'Book your appointment' },
      visitText:      { ar: 'أرسل لنا الخدمة والوقت المناسب على واتساب، ونؤكد لك خلال دقائق.',
                        en: 'Send us the service and a time on WhatsApp, and we confirm within minutes.' }
    },

    servicesPage: {
      eyebrow: { ar: 'الأسعار والمدة', en: 'Prices & duration' },
      title:   { ar: 'الخدمات', en: 'Services' },
      lede:    { ar: 'كل خدمة بمدتها وسعرها. المدة تقريبية، ونأخذ وقتنا حين يحتاج العمل ذلك.',
                 en: 'Every service with its length and price. Times are a guide — we take longer when the work needs it.' },
      note:    { ar: 'الأسعار شاملة ضريبة القيمة المضافة.', en: 'All prices include VAT.' },
      packagesTitle: { ar: 'الباقات', en: 'Packages' },
      packagesLede:  { ar: 'تزورنا بانتظام؟ الباقة أوفر، وتحجز لك الأولوية.',
                       en: 'Coming regularly? A package costs less and books you priority.' }
    },

    team: {
      eyebrow: { ar: 'من سيخدمك', en: 'Who you will meet' },
      title:   { ar: 'فريقنا', en: 'Our Team' },
      lede:    { ar: 'وجوه ثابتة تعرفك وتعرف ما تحب. اطلب من تريد عند الحجز.',
                 en: 'The same faces every visit, who learn what you like. Ask for anyone by name when you book.' }
    },

    story: {
      eyebrow:     { ar: 'عنّا', en: 'About us' },
      title:       { ar: 'قصتنا', en: 'Our Story' },
      lede:        { ar: 'بدأنا بفكرة واحدة: مكان يحترم وقتك ويتقن عمله.',
                     en: 'We started with one idea: a place that respects your time and knows its craft.' },
      bodyTitle:   { ar: 'كيف بدأ كل شيء', en: 'How it began' },
      bodyText:    { ar: 'فتحنا بكرسي واحد وموعد واحد في اليوم. توسّع المكان، وبقيت القاعدة نفسها: موعد واحد في كل وقت، وعناية كاملة به.',
                     en: 'We opened with one chair and one appointment a day. The room grew; the rule did not: one appointment at a time, and all of our attention on it.' },
      valuesTitle: { ar: 'ما نلتزم به', en: 'What we hold to' },
      v1Title:     { ar: 'الوقت',    en: 'Time' },
      v1Text:      { ar: 'موعدك يبدأ في وقته. إن تأخرنا، نعتذر ونعوّضك.', en: 'Your appointment starts on time. If we run late, we make it up to you.' },
      v2Title:     { ar: 'النظافة',  en: 'Hygiene' },
      v2Text:      { ar: 'أدوات معقّمة لكل زبون، ومناشف تُستخدم مرة واحدة.', en: 'Sterilised tools for every client, and towels used once.' },
      v3Title:     { ar: 'الصراحة',  en: 'Straight talk' },
      v3Text:      { ar: 'نقول لك ما يناسبك، لا ما يزيد الفاتورة.', en: 'We tell you what suits you, not what raises the bill.' },
      quote:       { ar: '«الموعد أمانة، والوقت جزء من الخدمة.»', en: '“An appointment is a promise, and time is part of the service.”' },
      quoteCite:   { ar: 'من فريق العمل', en: 'From the team' }
    },

    book: {
      eyebrow:      { ar: 'الحجز والموقع', en: 'Booking & location' },
      title:        { ar: 'احجز موعدك', en: 'Book an Appointment' },
      lede:         { ar: 'الحجز عبر واتساب أسرع طريقة. أخبرنا بالخدمة والوقت، ونؤكد لك خلال دقائق.',
                      en: 'WhatsApp is the fastest way. Tell us the service and a time, and we confirm within minutes.' },
      howTitle:     { ar: 'كيف يتم الحجز', en: 'How booking works' },
      s1Title:      { ar: '١ · أرسل رسالة', en: '1 · Message us' },
      s1Text:       { ar: 'اذكر الخدمة، واليوم، والوقت الذي يناسبك.', en: 'Name the service, the day, and a time that suits you.' },
      s2Title:      { ar: '٢ · نؤكد لك',   en: '2 · We confirm' },
      s2Text:       { ar: 'نرد خلال دقائق بالتأكيد أو بأقرب وقت متاح.', en: 'We reply within minutes, confirming or offering the nearest slot.' },
      s3Title:      { ar: '٣ · تعال في وقتك', en: '3 · Arrive on time' },
      s3Text:       { ar: 'احضر قبل خمس دقائق، ولا حاجة للانتظار.', en: 'Come five minutes early — there is no waiting.' },
      addressTitle: { ar: 'العنوان',     en: 'Address' },
      hoursTitle:   { ar: 'أوقات العمل', en: 'Opening Hours' },
      contactTitle: { ar: 'تواصل معنا',  en: 'Get in touch' },
      parkingTitle: { ar: 'المواقف',     en: 'Parking' },
      parkingText:  { ar: 'مواقف مجانية أمام المحل وعلى الشارع الجانبي.', en: 'Free parking in front and on the side street.' },
      faqTitle:     { ar: 'أسئلة شائعة', en: 'Common questions' }
    },

    footer: {
      tagline:      { ar: 'خدمة تستحق الموعد.', en: 'Worth booking the time for.' },
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
      hero:      { ar: 'داخل المكان: كراسي ومرايا وإضاءة هادئة', en: 'Inside: chairs, mirrors and soft light' },
      room:      { ar: 'زاوية الانتظار',           en: 'The waiting corner' },
      counter:   { ar: 'محطة العمل والأدوات',      en: 'A work station and its tools' },
      cup:       { ar: 'تفاصيل من الجلسة',         en: 'A detail from the session' },
      team:      { ar: 'أحد أفراد الفريق',         en: 'A member of the team' },
      merch:     { ar: 'منتجات العناية',           en: 'Care products' },
      storefront:{ ar: 'واجهة المحل من الخارج',    en: 'The storefront' },
      map:       { ar: 'الموقع على الخريطة',       en: 'The location on the map' }
    }
  }
};
