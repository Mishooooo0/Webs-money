/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3        · CONTRACTING & FINISHING ·
   ------------------------------------------------------------
   Everything the site says, in one file. The HTML carries the Arabic
   statically so the site reads with JavaScript off; this file is the
   source that static copy is generated FROM. After editing, run:

       node tools/sync-static.js

   ── What this template is shaped for ────────────────────────
   A مقاولات وتشطيب business: someone who strips a space back and
   finishes it. That makes its data different from the other templates —
   a café has a menu, a salon has services with a duration, but a
   contractor has PAIRS. The before and the after of the same room is
   the entire pitch, so `projects` is built around it and the site's one
   real interaction is dragging between them.

   ── ⚠ What must never be invented here ──────────────────────
   Years in business, number of projects completed, licence and CR
   numbers, insurance cover, warranty length. Every one of them is a
   claim a customer may rely on and a regulator may check, and every one
   of them is trivially fabricated by whoever fills this file in. They
   ship as conspicuous blanks. See BRAND.md.
   ============================================================ */

window.SITE = {

  brand: {
    /* Shown in the header and footer wordmark. */
    primary:   { ar: 'اسم المؤسسة', en: 'Company Name' },
    secondary: 'CONTRACTING',          // wide-tracked Latin line, one script only
    currency:  { ar: 'ر.س', en: 'SAR' }
  },

  /* ---- Contact — every link on the site resolves from here ---------- */
  contact: {
    addressLines: {
      ar: ['اسم الحي', 'المدينة'],
      en: ['District name', 'City']
    },
    phone:      '——— أضف الرقم ———',
    phoneHref:  '',                    // tel:+9665……  — fill before launch
    phoneLabel: { ar: 'اتصل بنا', en: 'Call us' },
    email:      '——— أضف البريد ———',
    emailHref:  '',                    // mailto:…     — fill before launch
    whatsapp:   '',                    // https://wa.me/9665……
    instagram:  '',
    instagramHandle: '@example',
    maps:       ''                     // Google Maps pin
  },

  /* ---- Office hours. Not site hours — a crew starts earlier. -------- */
  hours: [
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '٨ صباحًا – ٥ مساءً', en: '8:00 AM – 5:00 PM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '٨ صباحًا – ٥ مساءً', en: '8:00 AM – 5:00 PM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '٨ صباحًا – ٥ مساءً', en: '8:00 AM – 5:00 PM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '٨ صباحًا – ٥ مساءً', en: '8:00 AM – 5:00 PM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '٨ صباحًا – ٣ عصرًا', en: '8:00 AM – 3:00 PM' } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: 'مغلق',              en: 'Closed'           } },
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '٩ صباحًا – ٤ عصرًا', en: '9:00 AM – 4:00 PM' } }
  ],

  /* ---- Projects — the before/after pairs ----------------------------
     `before` and `after` are image paths under assets/photos/. Leave a
     pair null and the engine draws its branded placeholder at the right
     aspect ratio, so the layout is identical with or without the
     photographs. Both images of a pair MUST be the same aspect ratio or
     the drag handle will not line up.

     `featured: true` puts a project on the home page. Keep it to one. */
  projects: [
    {
      id: 'majlis',
      featured: true,
      before: null,
      after:  null,
      name: { ar: 'مجلس في فيلا خاصة', en: 'Majlis in a private villa' },
      type: { ar: 'تشطيب كامل',        en: 'Full finish' },
      area: { ar: 'اسم الحي',          en: 'District name' },
      span: { ar: 'سبعة أسابيع',       en: 'Seven weeks' },
      desc: {
        ar: 'جدران على العظم، وكهرباء ظاهرة، وأرضية إسمنت. سُحبت التمديدات من جديد، وصُبّت الأرضية ولُمّعت، ونُفّذ جبس السقف بزخرفة نجدية مثلثة.',
        en: 'Bare block walls, surface conduit, a cement floor. The runs were pulled again, the floor poured and polished, and the ceiling worked in gypsum with a triangular Najdi motif.'
      }
    },
    {
      id: 'kitchen',
      featured: false,
      before: null,
      after:  null,
      name: { ar: 'مطبخ بعد إزالة القديم', en: 'Kitchen, after the old one came out' },
      type: { ar: 'ترميم وتجديد',           en: 'Renovation' },
      area: { ar: 'اسم الحي',               en: 'District name' },
      span: { ar: 'أربعة أسابيع',           en: 'Four weeks' },
      desc: {
        ar: 'أُزيلت الخزائن القديمة ومعها السباكة المتهالكة. عُزل الجدار خلف الحوض، ورُكّب رخام على الأسطح، وخزائن مطفية بمقابض نحاسية.',
        en: 'The old units came out and the tired plumbing with them. The wall behind the sink was sealed, stone laid on the worktops, matte cabinetry hung on brass handles.'
      }
    },
    {
      id: 'facade',
      featured: false,
      before: null,
      after:  null,
      name: { ar: 'واجهة محل تجاري', en: 'A shopfront' },
      type: { ar: 'واجهات',           en: 'Facades' },
      area: { ar: 'اسم الحي',         en: 'District name' },
      span: { ar: 'أسبوعان',          en: 'Two weeks' },
      desc: {
        ar: 'واجهة قديمة بطبقات دهان متراكمة. كُشطت حتى الطين، وأُعيد اللياسة بلون الحجر، ورُكّبت إضاءة مخفية خلف الحرف.',
        en: 'An old front under layers of paint. Scraped back to the clay, re-rendered in a stone tone, with the lettering lit from behind.'
      }
    }
  ],

  /* ---- Trades — what the business actually does ---------------------
     Six is the shape the grid is built for. Fewer reflows cleanly;
     more starts a fourth row on a phone. */
  trades: [
    { id: 'finish',   name: { ar: 'تشطيب كامل',   en: 'Full finishing' },
      desc: { ar: 'من العظم إلى التسليم، بعقد واحد وجهة واحدة مسؤولة.',
              en: 'From bare structure to handover, on one contract with one party answerable for it.' } },
    { id: 'restore',  name: { ar: 'ترميم وتجديد', en: 'Restoration' },
      desc: { ar: 'إصلاح ما تلف وإبقاء ما يستحق البقاء.',
              en: 'Repairing what has failed and keeping what is worth keeping.' } },
    { id: 'gypsum',   name: { ar: 'جبس وأسقف',    en: 'Gypsum and ceilings' },
      desc: { ar: 'أسقف مستوية أو بزخرفة، وإضاءة مخفية داخلها.',
              en: 'Flat or worked ceilings, with the lighting buried inside them.' } },
    { id: 'electric', name: { ar: 'كهرباء',       en: 'Electrical' },
      desc: { ar: 'تمديدات جديدة ولوحات وتوزيع إنارة.',
              en: 'New runs, boards, and the lighting laid out to suit the room.' } },
    { id: 'plumbing', name: { ar: 'سباكة وعزل',   en: 'Plumbing and sealing' },
      desc: { ar: 'مواسير وصرف وعزل للحمامات والمطابخ.',
              en: 'Pipework, drainage, and sealing for bathrooms and kitchens.' } },
    { id: 'paint',    name: { ar: 'دهان وأرضيات', en: 'Paint and floors' },
      desc: { ar: 'دهانات ولياسة وأرضيات بأنواعها.',
              en: 'Paint, render, and floors of every kind.' } }
  ],

  /* ---- How the job runs. Four steps, because it really is four. ----- */
  process: [
    { id: 'visit',  name: { ar: 'معاينة',      en: 'We come and look' },
      desc: { ar: 'نزور الموقع ونقيس ونسمع ما تريده قبل أن نكتب رقمًا.',
              en: 'We visit, measure, and hear what you want before writing a number.' } },
    { id: 'quote',  name: { ar: 'عرض سعر',     en: 'A written quote' },
      desc: { ar: 'عرض مكتوب ببنود واضحة: ما يشمله وما لا يشمله.',
              en: 'Itemised in writing: what it covers, and what it does not.' } },
    { id: 'build',  name: { ar: 'تنفيذ',       en: 'The work' },
      desc: { ar: 'جدول متفق عليه، وصور تصلك مع تقدّم العمل.',
              en: 'An agreed schedule, with photographs reaching you as it moves.' } },
    { id: 'handover', name: { ar: 'تسليم',     en: 'Handover' },
      desc: { ar: 'جولة أخيرة معك، ولا يُقفل الملف قبل أن ترضى عنه.',
              en: 'A last walk-through together. The file does not close until you are happy with it.' } }
  ],

  /* ---- Questions people actually ask a contractor ------------------- */
  faq: [
    { q: { ar: 'كم تستغرق المعاينة؟', en: 'How long does the site visit take?' },
      a: { ar: 'زيارة واحدة تكفي غالبًا، ونعود بعرض السعر خلال أيام.',
           en: 'One visit is usually enough, and the quote follows within a few days.' } },
    { q: { ar: 'هل العرض ملزم؟', en: 'Is the quote binding?' },
      a: { ar: 'العرض المكتوب بسعره وبنوده ثابت. أي إضافة خارج البنود تُسعَّر وتُعتمد منك قبل تنفيذها.',
           en: 'The written quote holds at its price and its terms. Anything outside them is priced and approved by you before it is done.' } },
    { q: { ar: 'هل تعملون على مراحل؟', en: 'Will you work in stages?' },
      a: { ar: 'نعم. كثير من البيوت تُنفَّذ دورًا بعد دور حتى يبقى السكن ممكنًا.',
           en: 'Yes. Many homes are done floor by floor so the place stays liveable.' } },
    { q: { ar: 'من يتابع العمل يوميًا؟', en: 'Who is on site day to day?' },
      a: { ar: 'مشرف واحد مسؤول عن مشروعك، ورقمه معك من أول يوم.',
           en: 'One supervisor is answerable for your job, and you have their number from day one.' } }
  ],

  /* ================================================================
     t — every string of UI copy. Nothing below is data; it is the
     words the page itself says.
     ================================================================ */
  t: {
    nav: {
      home:     { ar: 'الرئيسية', en: 'Home'     },
      projects: { ar: 'أعمالنا',  en: 'Projects' },
      services: { ar: 'خدماتنا',  en: 'Services' },
      story:    { ar: 'من نحن',   en: 'About'    },
      quote:    { ar: 'اطلب عرض سعر', en: 'Get a quote' }
    },

    common: {
      skip:        { ar: 'تخطَّ إلى المحتوى',  en: 'Skip to content' },
      langSwitch:  { ar: 'English',            en: 'العربية' },
      langLabel:   { ar: 'تغيير اللغة',        en: 'Change language' },
      navLabel:    { ar: 'التنقل الرئيسي',     en: 'Main navigation' },
      openMenu:    { ar: 'افتح القائمة',       en: 'Open menu' },
      backHome:    { ar: 'إلى الرئيسية',       en: 'Back to home' },
      closeMenu:   { ar: 'أغلق القائمة',       en: 'Close menu' },
      before:      { ar: 'قبل',                en: 'Before' },
      after:       { ar: 'بعد',                en: 'After' },
      dragHint:    { ar: 'اسحب للمقارنة',      en: 'Drag to compare' },
      sliderLabel: { ar: 'مقارنة قبل وبعد',    en: 'Before and after comparison' },
      noscript:    { ar: 'فعّل الجافاسكربت لعرض الأعمال والمقارنات.',
                     en: 'Enable JavaScript to see the projects and their comparisons.' }
    },

    hero: {
      eyebrow: { ar: 'مقاولات وتشطيب', en: 'Contracting & finishing' },
      title:   { ar: 'نسلّمك المكان وقد صار كما أردته',
                 en: 'We hand the place back the way you wanted it' },
      lede:    { ar: 'نأخذ المساحة على العظم أو على قِدمها، ونخرج منها بعمل مكتمل — بجدول متفق عليه وعرض سعر مكتوب قبل أن نبدأ.',
                 en: 'We take a space bare or tired and leave it finished — on an agreed schedule, against a written quote, before a tool is lifted.' },
      ctaQuote:    { ar: 'اطلب عرض سعر', en: 'Get a quote' },
      ctaProjects: { ar: 'شاهد أعمالنا', en: 'See our work' }
    },

    home: {
      tradesEyebrow: { ar: 'ما ننفّذه', en: 'What we do' },
      tradesTitle:   { ar: 'ستة تخصصات، وجهة واحدة مسؤولة',
                       en: 'Six trades, one party answerable' },
      tradesLede:    { ar: 'العمل كله من عندنا، فلا تطارد أنت المقاول والكهربائي والسبّاك.',
                       en: 'All of it in one place, so you are not the one chasing the builder, the electrician and the plumber.' },

      featuredEyebrow: { ar: 'من أعمالنا', en: 'From our work' },
      featuredTitle:   { ar: 'اسحب الخط وشِف الفرق', en: 'Drag the line and see the difference' },

      processEyebrow: { ar: 'كيف نشتغل', en: 'How we work' },
      processTitle:   { ar: 'أربع خطوات، معروفة من البداية',
                        en: 'Four steps, known from the start' },

      quoteEyebrow: { ar: 'ابدأ', en: 'Start' },
      quoteTitle:   { ar: 'احكِ لنا عن المكان', en: 'Tell us about the place' },
      quoteLede:    { ar: 'أرسل نوع العمل والموقع ومساحته تقريبًا، ونرتّب معاينة.',
                      en: 'Send the kind of work, the location and a rough area, and we will arrange a visit.' }
    },

    projectsPage: {
      eyebrow: { ar: 'أعمالنا', en: 'Our work' },
      title:   { ar: 'قبل وبعد', en: 'Before and after' },
      lede:    { ar: 'كل مشروع هنا بصورته قبل العمل وبعده، من الزاوية نفسها. اسحب الخط بينهما.',
                 en: 'Every project here is shown before and after, from the same corner of the room. Drag the line between them.' },
      empty:   { ar: 'لم تُضف أعمال بعد.', en: 'No projects added yet.' }
    },

    servicesPage: {
      eyebrow: { ar: 'خدماتنا', en: 'Services' },
      title:   { ar: 'ما الذي ننفّذه بالضبط', en: 'Exactly what we take on' },
      lede:    { ar: 'إن لم تجد ما تبحث عنه، اسأل — أغلب ما لا يُذكر هنا ننفّذه أو نعرف من ينفّذه.',
                 en: 'If what you need is not listed, ask — most of what is missing we either do, or know who does.' },
      faqTitle: { ar: 'أسئلة شائعة', en: 'Common questions' }
    },

    story: {
      eyebrow: { ar: 'من نحن', en: 'About us' },
      title:   { ar: 'من نحن', en: 'Who we are' },
      /* ⚠ Placeholder. Replace with the real account of this business —
         and see BRAND.md before adding years, counts or credentials. */
      body:    { ar: '——— اكتب هنا قصة المؤسسة: متى بدأت، ومن يقف خلفها، وما الذي يميّز طريقتها في العمل. ———',
                 en: '——— Write the business’s own account here: when it started, who is behind it, and what is different about the way it works. ———' }
    },

    quotePage: {
      eyebrow: { ar: 'عرض سعر', en: 'A quote' },
      title:   { ar: 'اطلب عرض سعر', en: 'Request a quote' },
      lede:    { ar: 'لا يوجد نموذج طويل. أرسل رسالة واحدة فيها ما تحتاجه، ونرد عليك بموعد معاينة.',
                 en: 'There is no long form. Send one message with what you need and we will come back with a time to visit.' },
      needTitle: { ar: 'ما الذي يفيدنا معرفته', en: 'What helps us' },
      needList: {
        ar: ['نوع العمل: تشطيب، ترميم، أو بند واحد', 'الموقع والحي', 'المساحة تقريبًا', 'متى تريد البدء'],
        en: ['The kind of work: a full finish, a restoration, or one trade', 'The location and district', 'A rough area', 'When you want to start']
      },
      hoursTitle: { ar: 'أوقات المكتب', en: 'Office hours' }
    },

    footer: {
      tagline:      { ar: 'نسلّمك المكان وقد صار كما أردته.',
                      en: 'We hand the place back the way you wanted it.' },
      exploreTitle: { ar: 'تصفّح',       en: 'Explore'  },
      visitTitle:   { ar: 'تواصل',       en: 'Reach us' },
      followTitle:  { ar: 'تابعنا',      en: 'Follow'   },
      rights:       { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' }
    },

    notfound: {
      title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
      text:  { ar: 'الرابط الذي فتحته لا يؤدي إلى صفحة. جرّب الرئيسية.',
               en: 'That link does not lead anywhere. Try the home page.' }
    },

    alt: {
      hero:    { ar: 'مجلس بعد التشطيب، ضوء العصر داخل منه', en: 'A finished majlis with late afternoon light in it' },
      before:  { ar: 'المكان قبل العمل', en: 'The space before the work' },
      after:   { ar: 'المكان بعد العمل',  en: 'The space after the work' },
      trade:   { ar: 'تفصيل من العمل',    en: 'A detail of the work' }
    }
  }
};
