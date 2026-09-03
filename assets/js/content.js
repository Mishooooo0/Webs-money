/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3        · RAHWAH / رهوة ·
   ------------------------------------------------------------
   Every word on this website lives here, as an { ar, en } pair, plus
   the data that drives the menu and shop grids.

   Rahwah is a specialty coffee shop in Al Malqa, Riyadh. The voice is
   taken from the café's own words: «مكان يرحّب بك», «هلا بك في رهوة»,
   «قهوة، تفاصيل صغيرة، وطلبات تصنع بحب».

   ─────────────────────────────────────────────────────────────
   STILL TO CONFIRM WITH THE CAFÉ before this goes live — every one
   of them is a single edit in this file:
     · contact.phone / phoneHref / phoneLabel / whatsapp   (placeholders)
     · hours[]        — plausible, not confirmed
     · menu[].price, beans[].price, merch[].price          (plausible)
   Confirmed from the café's own channels: the name, the bio line, the
   district, the Instagram handle, the Maps pin, and the La Palma lot.
   ─────────────────────────────────────────────────────────────

   Adding a drink is one entry in menu[].items — never HTML.
   Keys under t.* are addressed from markup as data-i18n="nav.home".
   ============================================================ */

window.SITE = {

  /* ---- Identity ---------------------------------------------------- */
  brand: {
    primary:   { ar: 'رهوة', en: 'Rahwah' },
    secondary: 'RAHWAH',
    currency:  { ar: 'ر.س', en: 'SAR' }
  },

  /* ---- Contact — every link on the site resolves from here ---------- */
  contact: {
    addressLines: {
      ar: ['الرياض – حي الملقا', 'المملكة العربية السعودية'],
      en: ['Riyadh – Al Malqa', 'Saudi Arabia']
    },
    /* PLACEHOLDER — replace with the café's real number. */
    phone:     '+9665XXXXXXXX',
    phoneHref: 'tel:+9665XXXXXXXX',
    phoneLabel:'+966 5X XXX XXXX',
    whatsapp:  'https://wa.me/9665XXXXXXXX',

    email:     'hello@rahwa.sa',
    emailHref: 'mailto:hello@rahwa.sa',
    instagram: 'https://instagram.com/rahwa.sa',
    instagramHandle: '@rahwa.sa',
    maps:      'https://maps.app.goo.gl/9uag48UQN1PayJRo6'
  },

  /* ---- Opening hours ------------------------------------------------
     PLACEHOLDER pattern — a typical Riyadh specialty schedule, with the
     late Thursday and the Friday-prayer gap. Confirm before launch.
     Keep the `key` values: they drive today's highlight. */
  hours: [
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '٧:٠٠ ص – ١:٠٠ ص',  en: '7:00 AM – 1:00 AM'  } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: '١:٣٠ م – ١:٠٠ ص',  en: '1:30 PM – 1:00 AM'  } },
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '٧:٠٠ ص – ١٢:٠٠ م', en: '7:00 AM – 12:00 AM' } }
  ],

  /* ---- Menu ---------------------------------------------------------
     Categories render in array order on menu.html. `featured: true`
     lifts an item onto the home page strip (first three win). */
  menu: [
    {
      id: 'hot',
      name: { ar: 'المشروبات الساخنة', en: 'Hot' },
      note: { ar: 'تُحضَّر عند الطلب', en: 'Made to order' },
      items: [
        { price: '13',
          name: { ar: 'إسبريسو', en: 'Espresso' },
          desc: { ar: 'جرعة مركزة من خلطة رهوة الموسمية.', en: 'A concentrated shot of the seasonal Rahwah blend.' } },
        { price: '15',
          name: { ar: 'أمريكانو', en: 'Americano' },
          desc: { ar: 'إسبريسو وماء ساخن، صافٍ وبسيط.', en: 'Espresso and hot water — clean and plain.' } },
        { price: '17',
          name: { ar: 'فلات وايت', en: 'Flat White' },
          desc: { ar: 'حليب مخملي وطبقة كريما رقيقة.', en: 'Velvet milk under a thin crema.' } },
        { price: '18', featured: true,
          name: { ar: 'لاتيه', en: 'Latte' },
          desc: { ar: 'الأكثر طلبًا في رهوة، هادئ ومتوازن.', en: 'The one most people order — calm and balanced.' } },
        { price: '20',
          name: { ar: 'سبانيش لاتيه', en: 'Spanish Latte' },
          desc: { ar: 'حليب مكثّف محلّى، دافئ وسميك.', en: 'Sweetened condensed milk — warm and thick.' } },
        { price: '22', featured: true,
          name: { ar: 'قهوة مقطرة V60', en: 'V60 Pour Over' },
          desc: { ar: 'حبّة مفردة تتغير كل موسم. اسأل الباريستا عن حبّة اليوم.',
                  en: 'A single origin that changes each season. Ask the barista about today’s lot.' } }
      ]
    },
    {
      id: 'cold',
      name: { ar: 'المشروبات الباردة', en: 'Cold' },
      note: { ar: 'مع ثلج مصنوع من الماء المفلتر', en: 'Over filtered ice' },
      items: [
        { price: '19',
          name: { ar: 'آيس أمريكانو', en: 'Iced Americano' },
          desc: { ar: 'منعش وخفيف، للأيام الطويلة.', en: 'Light and refreshing, for the long days.' } },
        { price: '20',
          name: { ar: 'آيس لاتيه', en: 'Iced Latte' },
          desc: { ar: 'إسبريسو مزدوج على حليب بارد.', en: 'A double shot over cold milk.' } },
        { price: '22',
          name: { ar: 'آيس سبانيش لاتيه', en: 'Iced Spanish Latte' },
          desc: { ar: 'حلو ودسم، وأكثر ما يُطلب في الصيف.', en: 'Sweet and rich — the summer regular.' } },
        { price: '21',
          name: { ar: 'كولد برو', en: 'Cold Brew' },
          desc: { ar: 'منقوع ست عشرة ساعة، خفيف وحلو بطبعه.', en: 'Steeped sixteen hours — light and naturally sweet.' } },
        { price: '23', featured: true,
          name: { ar: 'باشن فروت', en: 'Passion Fruit' },
          desc: { ar: 'باردة وحامضة قليلًا، بلا قهوة.', en: 'Cold, faintly tart, and coffee-free.' } }
      ]
    },
    {
      id: 'sweets',
      name: { ar: 'الحلويات', en: 'Sweets' },
      note: { ar: 'تُخبز كل صباح', en: 'Baked each morning' },
      items: [
        { price: '16',
          name: { ar: 'كوكيز', en: 'Cookie' },
          desc: { ar: 'طري من الداخل، مقرمش من الحواف.', en: 'Soft centre, crisp edge.' } },
        { price: '19',
          name: { ar: 'كرواسون زبدة', en: 'Butter Croissant' },
          desc: { ar: 'زبدة حقيقية واثنتان وسبعون ساعة تخمير.', en: 'Real butter, seventy-two hours of ferment.' } },
        { price: '24',
          name: { ar: 'تشيز كيك', en: 'Cheesecake' },
          desc: { ar: 'قاعدة بسكوت وقشدة خفيفة.', en: 'Biscuit base, light cream.' } },
        { price: '26',
          name: { ar: 'حلى اليوم', en: 'Sweet of the Day' },
          desc: { ar: 'يتغير يوميًا. اسأل عمّا خرج من الفرن اليوم.', en: 'Changes daily — ask what came out of the oven.' } }
      ]
    }
  ],

  /* ---- Retail bags ----------------------------------------------------
     La Palma is taken from the café's own lot card: Colombia, anaerobic,
     fruity — grape, pear, pomegranate. */
  beans: [
    { price: '85', weight: '250g',
      name:    { ar: 'لا بالما', en: 'La Palma' },
      origin:  { ar: 'كولومبيا', en: 'Colombia' },
      process: { ar: 'لا هوائية', en: 'Anaerobic' },
      notes:   { ar: 'عنب، كمثرى، رمان', en: 'Grape, pear, pomegranate' } },
    { price: '75', weight: '250g',
      name:    { ar: 'خلطة رهوة', en: 'Rahwah Blend' },
      origin:  { ar: 'البرازيل وكولومبيا', en: 'Brazil & Colombia' },
      process: { ar: 'مغسولة', en: 'Washed' },
      notes:   { ar: 'كراميل، شوكولاتة، بندق', en: 'Caramel, chocolate, hazelnut' } },
    { price: '90', weight: '250g',
      name:    { ar: 'حبّة الموسم', en: 'Seasonal Lot' },
      origin:  { ar: 'إثيوبيا', en: 'Ethiopia' },
      process: { ar: 'طبيعية', en: 'Natural' },
      notes:   { ar: 'توت، ياسمين، خوخ', en: 'Berry, jasmine, peach' } }
  ],

  /* ---- Merch ----------------------------------------------------------- */
  merch: [
    { price: '220', name: { ar: 'هودي رهوة', en: 'Rahwah Hoodie' },
      desc: { ar: 'قطن ثقيل بلون الرمل، والشعار مطرز على الظهر.', en: 'Heavy sand-coloured cotton, mark embroidered on the back.' } },
    { price: '110', name: { ar: 'تيشيرت', en: 'T-Shirt' },
      desc: { ar: 'قطن ممشط بقصّة واسعة.', en: 'Combed cotton, relaxed cut.' } },
    { price: '80',  name: { ar: 'كاب', en: 'Cap' },
      desc: { ar: 'مقاس واحد يناسب الجميع.', en: 'One size fits all.' } },
    { price: '55',  name: { ar: 'كوب فخّاري', en: 'Clay Cup' },
      desc: { ar: 'مصنوع يدويًا ومختوم بشعار رهوة، مثل أكوابنا في الفرع.', en: 'Hand-thrown and stamped with the Rahwah mark, like the ones we serve in.' } }
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
      tagline: { ar: 'قهوة، تفاصيل صغيرة، وطلبات تُصنع بحب. في قلب الملقا، من الصباح الباكر حتى آخر الليل.',
                 en: 'Coffee, small details, and orders made with care. In the middle of Al Malqa, from early morning until late.' },
      meta1:   { ar: 'الرياض – حي الملقا', en: 'Riyadh – Al Malqa' },
      meta2:   { ar: 'يوميًا من ٧ صباحًا',  en: 'Daily from 7 AM' }
    },

    home: {
      introEyebrow:  { ar: 'هلا بك في رهوة', en: 'Welcome to Rahwah' },
      introTitle:    { ar: 'نبدأ من الحبّة، وننتهي عندك', en: 'It starts with the bean and ends with you' },
      introText:     { ar: 'نختار حبّاتنا موسمًا بعد موسم، ونحمّصها على دفعات صغيرة. كل فنجان يُحضَّر عند الطلب، ويُقدَّم في كوب فخّاري مختوم بشعارنا.',
                       en: 'We choose our beans season by season and roast them in small batches. Every cup is made to order, and served in a clay cup stamped with our mark.' },
      featuredEyebrow:{ ar: 'المشروبات', en: 'Drinks' },
      featuredTitle: { ar: 'ما يطلبه الناس أكثر', en: 'What people order most' },
      galleryEyebrow:{ ar: 'المكان',   en: 'The room' },
      galleryTitle:  { ar: 'تفاصيل صغيرة، صُنعت بحب', en: 'Small details, made with care' },
      visitTitle:    { ar: 'تعال وقابلنا في الملقا', en: 'Come and find us in Al Malqa' },
      visitText:     { ar: 'الباب مفتوح من الصباح الباكر حتى آخر الليل، والجمعة لها طعم آخر. لا تحتاج حجزًا، فقط تعال.',
                       en: 'The door is open from early morning until late, and Friday has a flavour of its own. No booking needed — just come.' }
    },

    menuPage: {
      eyebrow: { ar: 'المشروبات والحلويات', en: 'Drinks & Sweets' },
      title: { ar: 'المنيو',  en: 'The Menu' },
      lede:  { ar: 'قائمة تتغير مع الموسم. اسأل الباريستا عن حبّة اليوم.',
               en: 'A list that moves with the season. Ask the barista about today’s bean.' },
      note:  { ar: 'الأسعار شاملة ضريبة القيمة المضافة.', en: 'All prices include VAT.' }
    },

    story: {
      eyebrow:    { ar: 'عن رهوة', en: 'About Rahwah' },
      title:      { ar: 'قصتنا',  en: 'Our Story' },
      lede:       { ar: 'رهوة كلمة تعني الاتساع والسكينة. بدأنا بفكرة واحدة: مكان يشبه البيت، وقهوة تستحق الجلسة.',
                    en: 'Rahwah is a word for openness and calm. We started with one idea: a room that feels like home, and coffee worth sitting down for.' },
      bodyTitle:  { ar: 'سنة من رهوة', en: 'A year of Rahwah' },
      bodyText:   { ar: 'فتحنا الباب في الملقا بطاولة واحدة وآلة إسبريسو. مرّت سنة، واتسعت المساحة، ودخلها النور والنبات، لكن الفكرة لم تتغير: نُحسن الاستقبال، ونُتقن الفنجان.',
                    en: 'We opened in Al Malqa with one table and an espresso machine. A year passed, the room grew, light and plants came in, but the idea has not changed: welcome people well, and get the cup right.' },
      valuesTitle:{ ar: 'ما نؤمن به', en: 'What we believe' },
      v1Title:    { ar: 'الحبّة أولًا',  en: 'The bean first' },
      v1Text:     { ar: 'نشتري بشفافية ونحمّص على دفعات صغيرة، ونكتب المصدر على كل كيس.', en: 'Sourced transparently, roasted in small batches, origin written on every bag.' },
      v2Title:    { ar: 'الضيافة',      en: 'Hospitality' },
      v2Text:     { ar: 'نعرف الأسماء، ونتذكّر الطلبات، ونقول هلا قبل أي شيء.', en: 'We learn names, remember orders, and say hello before anything else.' },
      v3Title:    { ar: 'المكان',       en: 'The room' },
      v3Text:     { ar: 'خشب ونبات وبلاط نجدي، وضوء يدخل من النوافذ طوال النهار.', en: 'Timber, plants, Najdi tile, and light through the windows all day.' },
      friendsTitle:{ ar: 'أصدقاؤنا',    en: 'Our friends' },
      friendsText:{ ar: 'نتعاون مع محمّصين ومزارعين وصنّاع فخّار محليين. أسماؤهم على الرف، لا في الظل، والأكواب التي تشرب فيها من صنع أيديهم.',
                    en: 'We work with roasters, growers and local potters. Their names sit on the shelf, not in the shadows — and the cup you drink from was made by their hands.' },
      quote:      { ar: '«الجمعة في رهوة لها طعم آخر.»', en: '“Friday at Rahwah has a flavour of its own.”' },
      quoteCite:  { ar: 'من زوّار رهوة', en: 'From a regular' }
    },

    shop: {
      eyebrow:    { ar: 'خذها معك', en: 'Take it home' },
      title:      { ar: 'المتجر', en: 'The Shop' },
      lede:       { ar: 'خذ شيئًا من رهوة إلى بيتك: حبّة قهوة، أو كوبًا فخّاريًا مثل الذي شربت فيه.',
                    en: 'Take a piece of Rahwah home: a bag of coffee, or a clay cup like the one you drank from.' },
      beansTitle: { ar: 'حبوب القهوة', en: 'Coffee Beans' },
      merchTitle: { ar: 'منتجات رهوة', en: 'Rahwah Merch' },
      orderNote:  { ar: 'للطلب أرسل لنا رسالة على إنستقرام أو واتساب، أو مرّ علينا في الفرع.',
                    en: 'To order, message us on Instagram or WhatsApp, or drop by the shop.' },
      origin:     { ar: 'المصدر',   en: 'Origin' },
      process:    { ar: 'المعالجة', en: 'Process' },
      notes:      { ar: 'النكهات',  en: 'Notes' }
    },

    visit: {
      eyebrow:      { ar: 'الموقع وأوقات العمل', en: 'Location & hours' },
      title:        { ar: 'زورونا', en: 'Visit Us' },
      lede:         { ar: 'نحن في حي الملقا، ونفتح كل يوم. تعال وحدك أو مع من تحب.',
                      en: 'We are in Al Malqa, open every day. Come alone or bring someone.' },
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

    /* Alt text for the image slots. Update when the café's photos land. */
    alt: {
      hero:     { ar: 'داخل رهوة: خشب ونبات وضوء طبيعي', en: 'Inside Rahwah: timber, plants and natural light' },
      room:     { ar: 'زاوية الجلوس فوق البلاط النجدي',  en: 'A seating corner over the Najdi tile' },
      counter:  { ar: 'الباريستا خلف طاولة التحضير',      en: 'The barista behind the bar' },
      cup:      { ar: 'كوب رهوة الفخّاري على الطاولة',    en: 'A Rahwah clay cup on the table' },
      sweets:   { ar: 'صينية حلويات رهوة',                en: 'A tray of Rahwah sweets' },
      beans:    { ar: 'كيس حبوب قهوة من رهوة',            en: 'A bag of Rahwah coffee beans' },
      merch:    { ar: 'منتجات رهوة: هودي وكاب وأكواب فخّار', en: 'Rahwah merch: hoodie, cap and clay cups' },
      storefront:{ ar: 'واجهة رهوة المضاءة في الملقا',    en: 'The lit Rahwah storefront in Al Malqa' },
      map:      { ar: 'موقع رهوة على الخريطة في حي الملقا', en: 'Rahwah’s location on the map in Al Malqa' }
    }
  }
};
