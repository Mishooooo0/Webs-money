/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3   · TEMPLATE 01 · CAFÉ & RESTAURANT ·
   ------------------------------------------------------------
   Every word on this website lives here, as an { ar, en } pair, plus
   the data that drives the menu and shop grids.

   To re-dress the site for a new client you change THIS file,
   assets/css/tokens.css, and the five SVGs in assets/brand/.

   Adding a drink is one entry in menu[].items — never HTML.
   Keys under t.* are addressed from markup as data-i18n="nav.home".
   ============================================================ */

window.SITE = {

  /* ---- Identity ---------------------------------------------------- */
  brand: {
    /* Shown in the header and footer wordmark. */
    primary:   { ar: 'اسم المقهى', en: 'Café Name' },
    secondary: 'CAFE NAME',            // wide-tracked Latin line, one script only
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
     `key` matches JS getDay() names so today's row can be highlighted. */
  hours: [
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '٧:٠٠ ص – ١:٠٠ ص',  en: '7:00 AM – 1:00 AM'  } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: '١:٠٠ م – ١:٠٠ ص',  en: '1:00 PM – 1:00 AM'  } },
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } }
  ],

  /* ---- Menu ---------------------------------------------------------
     Categories render in array order on menu.html. `featured: true`
     lifts an item onto the home page strip (first three win). */
  menu: [
    {
      id: 'hot',
      name: { ar: 'مشروبات ساخنة', en: 'Hot' },
      note: { ar: 'تُحضَّر عند الطلب', en: 'Made to order' },
      items: [
        { price: '12', featured: true,
          name: { ar: 'إسبريسو', en: 'Espresso' },
          desc: { ar: 'جرعة مركزة من خلطتنا الموسمية.', en: 'A concentrated shot of our seasonal blend.' } },
        { price: '16',
          name: { ar: 'فلات وايت', en: 'Flat White' },
          desc: { ar: 'حليب مخملي وطبقة كريما رقيقة.', en: 'Velvet milk over a thin crema.' } },
        { price: '17', featured: true,
          name: { ar: 'لاتيه', en: 'Latte' },
          desc: { ar: 'الأكثر طلبًا، هادئ ومتوازن.', en: 'The house regular — calm and balanced.' } },
        { price: '18',
          name: { ar: 'قهوة مقطرة V60', en: 'V60 Pour Over' },
          desc: { ar: 'حبّة مفردة تتغير كل موسم.', en: 'A single origin that changes each season.' } }
      ]
    },
    {
      id: 'cold',
      name: { ar: 'مشروبات باردة', en: 'Cold' },
      note: { ar: 'مع ثلج مصنوع من الماء المفلتر', en: 'Served over filtered ice' },
      items: [
        { price: '18', featured: true,
          name: { ar: 'آيس لاتيه', en: 'Iced Latte' },
          desc: { ar: 'إسبريسو مزدوج على حليب بارد.', en: 'A double shot over cold milk.' } },
        { price: '19',
          name: { ar: 'كولد برو', en: 'Cold Brew' },
          desc: { ar: 'منقوع ١٦ ساعة، خفيف وحلو.', en: 'Steeped 16 hours — light and sweet.' } },
        { price: '20',
          name: { ar: 'مشروب الموسم', en: 'Seasonal Cooler' },
          desc: { ar: 'فاكهة طازجة، يتغير كل شهر.', en: 'Fresh fruit, changes monthly.' } }
      ]
    },
    {
      id: 'sweets',
      name: { ar: 'الحلويات', en: 'Sweets' },
      note: { ar: 'تُخبز يوميًا', en: 'Baked daily' },
      items: [
        { price: '15',
          name: { ar: 'كوكيز', en: 'Cookie' },
          desc: { ar: 'طري من الداخل، مقرمش من الحواف.', en: 'Soft centre, crisp edge.' } },
        { price: '22',
          name: { ar: 'تشيز كيك', en: 'Cheesecake' },
          desc: { ar: 'قاعدة بسكوت وقشدة خفيفة.', en: 'Biscuit base, light cream.' } },
        { price: '18',
          name: { ar: 'كرواسون', en: 'Croissant' },
          desc: { ar: 'زبدة حقيقية، ٧٢ ساعة تخمير.', en: 'Real butter, 72-hour ferment.' } }
      ]
    }
  ],

  /* ---- Retail bags --------------------------------------------------- */
  beans: [
    { price: '75', weight: '250g',
      name:    { ar: 'الحبّة الأولى', en: 'House Origin' },
      origin:  { ar: 'كولومبيا',      en: 'Colombia' },
      process: { ar: 'مغسولة',        en: 'Washed' },
      notes:   { ar: 'كراميل، تفاح، كاكاو', en: 'Caramel, apple, cocoa' } },
    { price: '85', weight: '250g',
      name:    { ar: 'الحبّة الموسمية', en: 'Seasonal Lot' },
      origin:  { ar: 'إثيوبيا',         en: 'Ethiopia' },
      process: { ar: 'طبيعية',          en: 'Natural' },
      notes:   { ar: 'توت، ياسمين، خوخ', en: 'Berry, jasmine, peach' } },
    { price: '95', weight: '250g',
      name:    { ar: 'الحبّة المحدودة', en: 'Limited Lot' },
      origin:  { ar: 'كولومبيا',        en: 'Colombia' },
      process: { ar: 'لا هوائية',       en: 'Anaerobic' },
      notes:   { ar: 'عنب، كمثرى، رمان', en: 'Grape, pear, pomegranate' } }
  ],

  /* ---- Merch ----------------------------------------------------------- */
  merch: [
    { price: '180', name: { ar: 'هودي',        en: 'Hoodie' },     desc: { ar: 'قطن ثقيل بشعار مطرز.', en: 'Heavy cotton, embroidered mark.' } },
    { price: '95',  name: { ar: 'تيشيرت',      en: 'T-Shirt' },    desc: { ar: 'قطن ممشط، قصّة واسعة.', en: 'Combed cotton, relaxed cut.' } },
    { price: '70',  name: { ar: 'كاب',         en: 'Cap' },        desc: { ar: 'مقاس واحد يناسب الجميع.', en: 'One size fits all.' } },
    { price: '45',  name: { ar: 'كوب فخّاري',  en: 'Clay Cup' },   desc: { ar: 'مصنوع يدويًا ومختوم بشعارنا.', en: 'Hand-thrown and stamped.' } }
  ],

  /* ==========================================================
     TRANSLATIONS — addressed from markup as data-i18n="nav.home"
     ========================================================== */
  t: {
    nav: {
      home:  { ar: 'الرئيسية', en: 'Home'  },
      menu:  { ar: 'المنيو',   en: 'Menu'  },
      story: { ar: 'قصتنا',    en: 'Story' },
      shop:  { ar: 'المتجر',   en: 'Shop'  },
      visit: { ar: 'زورونا',   en: 'Visit' }
    },

    common: {
      skip:        { ar: 'تخطَّ إلى المحتوى',  en: 'Skip to content' },
      langSwitch:  { ar: 'English',            en: 'العربية' },
      langLabel:   { ar: 'تغيير اللغة',        en: 'Change language' },
      navLabel:    { ar: 'التنقل الرئيسي',     en: 'Main navigation' },
      comingSoon:  { ar: 'القائمة قيد التحديث. تواصل معنا لمعرفة المتوفر اليوم.', en: 'The list is being updated. Message us for what is available today.' },
      openMenu:    { ar: 'فتح القائمة',        en: 'Open menu' },
      call:        { ar: 'اتصل بنا',           en: 'Call us' },
      viewMenu:    { ar: 'تصفّح المنيو',       en: 'View the menu' },
      directions:  { ar: 'الاتجاهات',          en: 'Get directions' },
      order:       { ar: 'اطلب عبر واتساب',    en: 'Order on WhatsApp' },
      instagram:   { ar: 'إنستقرام',           en: 'Instagram' },
      backHome:    { ar: 'العودة للرئيسية',    en: 'Back to home' },
      noscript:    { ar: 'فعّل الجافاسكربت لعرض المنيو والمتجر كاملين.', en: 'Enable JavaScript to see the full menu and shop.' }
    },

    hero: {
      title:   { ar: 'مكان يرحّب بك', en: 'A place that welcomes you' },
      tagline: { ar: 'قهوة مختصة، حلويات تُخبز يوميًا، ومساحة هادئة تجلس فيها بلا استعجال.',
                 en: 'Specialty coffee, sweets baked daily, and a quiet room to sit in without hurrying.' },
      meta1:   { ar: 'المدينة – اسم الحي', en: 'City – District' },
      meta2:   { ar: 'يوميًا من ٧ صباحًا',  en: 'Daily from 7 AM' }
    },

    home: {
      introEyebrow:  { ar: 'من نحن',   en: 'Who we are' },
      introTitle:    { ar: 'نبدأ من الحبّة، وننتهي عندك', en: 'It starts with the bean and ends with you' },
      introText:     { ar: 'نختار حبّاتنا موسمًا بعد موسم، ونحمّصها على دفعات صغيرة. كل فنجان يُحضَّر عند الطلب، لأن القهوة الجيدة لا تنتظر.',
                       en: 'We choose our beans season by season and roast them in small batches. Every cup is made to order, because good coffee does not wait.' },
      featuredEyebrow:{ ar: 'المفضّلة', en: 'Favourites' },
      featuredTitle: { ar: 'ما يطلبه الناس أكثر', en: 'What people order most' },
      galleryEyebrow:{ ar: 'المكان',   en: 'The room' },
      galleryTitle:  { ar: 'تفاصيل صغيرة، صُنعت بحب', en: 'Small details, made with care' },
      visitTitle:    { ar: 'تعال وقابلنا', en: 'Come and find us' },
      visitText:     { ar: 'الباب مفتوح من الصباح الباكر حتى آخر الليل. لا تحتاج حجزًا، فقط تعال.',
                       en: 'The door is open from early morning until late. No booking needed — just come.' }
    },

    menuPage: {
      eyebrow: { ar: 'المشروبات والحلويات', en: 'Drinks & Sweets' },
      title: { ar: 'المنيو',  en: 'The Menu' },
      lede:  { ar: 'قائمة تتغير مع الموسم. اسأل الباريستا عن حبّة اليوم.',
               en: 'A list that moves with the season. Ask the barista about today’s bean.' },
      note:  { ar: 'الأسعار شاملة ضريبة القيمة المضافة.', en: 'All prices include VAT.' }
    },

    story: {
      eyebrow:    { ar: 'عن المقهى', en: 'About the café' },
      title:      { ar: 'قصتنا',  en: 'Our Story' },
      lede:       { ar: 'بدأنا بفكرة واحدة: مكان يشبه البيت، وقهوة تستحق الجلسة.',
                    en: 'We started with one idea: a room that feels like home, and coffee worth sitting down for.' },
      bodyTitle:  { ar: 'كيف بدأ كل شيء', en: 'How it began' },
      bodyText:   { ar: 'فتحنا الباب بطاولة واحدة وآلة إسبريسو. اليوم توسّعت المساحة، لكن الفكرة لم تتغير: نُحسن الاستقبال، ونُتقن الفنجان.',
                    en: 'We opened with one table and an espresso machine. The room has grown since, but the idea has not: welcome people well, and get the cup right.' },
      valuesTitle:{ ar: 'ما نؤمن به', en: 'What we believe' },
      v1Title:    { ar: 'الحبّة أولًا',  en: 'The bean first' },
      v1Text:     { ar: 'نشتري بشفافية ونحمّص على دفعات صغيرة.', en: 'Sourced transparently, roasted in small batches.' },
      v2Title:    { ar: 'الضيافة',      en: 'Hospitality' },
      v2Text:     { ar: 'نعرف الأسماء، ونتذكّر الطلبات.', en: 'We learn names and remember orders.' },
      v3Title:    { ar: 'المكان',       en: 'The room' },
      v3Text:     { ar: 'ضوء طبيعي، نباتات، ومساحة تسع الجميع.', en: 'Natural light, plants, and room for everyone.' },
      friendsTitle:{ ar: 'أصدقاؤنا',    en: 'Our friends' },
      friendsText:{ ar: 'نتعاون مع محمّصين ومزارعين وصنّاع محليين. أسماؤهم على الرف، لا في الظل.',
                    en: 'We work with roasters, growers and local makers. Their names sit on the shelf, not in the shadows.' },
      quote:      { ar: '«القهوة عذر جيد للجلوس معًا.»', en: '“Coffee is a good excuse to sit together.”' },
      quoteCite:  { ar: 'من فريق المقهى', en: 'From the team' }
    },

    shop: {
      eyebrow:    { ar: 'خذها معك', en: 'Take it home' },
      title:      { ar: 'المتجر', en: 'The Shop' },
      lede:       { ar: 'خذ شيئًا من المقهى إلى بيتك.', en: 'Take a piece of the café home with you.' },
      beansTitle: { ar: 'حبوب القهوة', en: 'Coffee Beans' },
      merchTitle: { ar: 'منتجاتنا',    en: 'Merch' },
      orderNote:  { ar: 'للطلب أرسل لنا رسالة على واتساب أو مرّ علينا في الفرع.',
                    en: 'To order, message us on WhatsApp or drop by the shop.' },
      origin:     { ar: 'المصدر',   en: 'Origin' },
      process:    { ar: 'المعالجة', en: 'Process' },
      notes:      { ar: 'النكهات',  en: 'Notes' }
    },

    visit: {
      eyebrow:      { ar: 'الموقع وأوقات العمل', en: 'Location & hours' },
      title:        { ar: 'زورونا', en: 'Visit Us' },
      lede:         { ar: 'نحن هنا كل يوم. تعال وحدك أو مع من تحب.',
                      en: 'We are here every day. Come alone or bring someone.' },
      addressTitle: { ar: 'العنوان',      en: 'Address' },
      hoursTitle:   { ar: 'أوقات العمل',  en: 'Opening Hours' },
      contactTitle: { ar: 'تواصل معنا',   en: 'Get in touch' },
      parkingTitle: { ar: 'المواقف',      en: 'Parking' },
      parkingText:  { ar: 'مواقف مجانية أمام الفرع وعلى الشارع الجانبي.',
                      en: 'Free parking in front of the shop and on the side street.' }
    },

    footer: {
      tagline:      { ar: 'مكان يرحّب بك.', en: 'A place that welcomes you.' },
      exploreTitle: { ar: 'تصفّح',   en: 'Explore' },
      visitTitle:   { ar: 'زورونا',  en: 'Visit'   },
      followTitle:  { ar: 'تابعنا',  en: 'Follow'  },
      rights:       { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' }
    },

    notfound: {
      title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
      text:  { ar: 'ربما تغيّر الرابط أو حُذفت الصفحة. لنعد بك إلى البداية.',
               en: 'The link may have changed or the page was removed. Let’s get you back.' }
    },

    /* Alt text for the image slots. Update these when real photos land. */
    alt: {
      hero:     { ar: 'واجهة المقهى من الداخل', en: 'Inside the café' },
      room:     { ar: 'زاوية الجلوس',           en: 'A corner of the seating area' },
      counter:  { ar: 'الباريستا خلف الطاولة',  en: 'The barista at the counter' },
      cup:      { ar: 'فنجان قهوة على الطاولة', en: 'A cup of coffee on the table' },
      sweets:   { ar: 'حلويات المقهى',          en: 'Sweets from the café' },
      beans:    { ar: 'كيس حبوب قهوة',          en: 'A bag of coffee beans' },
      merch:    { ar: 'منتجات المقهى',          en: 'Café merchandise' },
      storefront:{ ar: 'واجهة المقهى من الخارج', en: 'The café storefront' },
      map:      { ar: 'موقع المقهى على الخريطة', en: 'The café location on the map' }
    }
  }
};
