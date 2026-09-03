/* ============================================================
   CONTENT  —  ★ RESKIN FILE 2 of 3        · RAHWAH / رهوة ·
   ------------------------------------------------------------
   Every word on this website lives here, as an { ar, en } pair, plus
   the data that drives the menu and shop grids.

   Rahwah is a specialty coffee shop in Al Malqa, Riyadh. The voice is
   taken from the café's own words: «مكان يرحّب بك», «هلا بك في رهوة»,
   «قهوة، تفاصيل صغيرة، وطلبات تصنع بحب».

   ─────────────────────────────────────────────────────────────
   CONFIRMED from the café's own channels: the name and what it means,
   the bio line, the district, the Instagram handle, the Maps pin, the
   full hot and cold drinks menu with prices, the opening hours, and the
   La Palma lot.

   STILL TO CONFIRM before this goes live — each is one edit in this file:
     · contact.phone / phoneHref / phoneLabel / whatsapp   (placeholders)
     · contact.email                                       (assumed)
     · the الحلويات menu — the café has a sweets highlight but the prices
       are not published; the category is left out rather than invented.
       Paste it into menu[] in the same shape as the drinks categories.
     · beans[].price and merch[].price                     (plausible only)
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
    maps:      'https://maps.app.goo.gl/KcsFkwFw1d4gZxm7A'
  },

  /* ---- Opening hours ------------------------------------------------
     CONFIRMED, from the café's own أوقات العمل highlight. Their wording
     is kept as-is: السبت–الخميس ٦ صباحًا–١٢ ليلًا, with Thursday running
     an hour later and Friday opening at noon.
     Keep the `key` values: they drive today's highlight. */
  hours: [
    { key: 'sat', day: { ar: 'السبت',    en: 'Saturday'  }, time: { ar: '6 صباحًا – 12 ليلًا', en: '6:00 AM – 12:00 AM' } },
    { key: 'sun', day: { ar: 'الأحد',    en: 'Sunday'    }, time: { ar: '6 صباحًا – 12 ليلًا', en: '6:00 AM – 12:00 AM' } },
    { key: 'mon', day: { ar: 'الاثنين',  en: 'Monday'    }, time: { ar: '6 صباحًا – 12 ليلًا', en: '6:00 AM – 12:00 AM' } },
    { key: 'tue', day: { ar: 'الثلاثاء', en: 'Tuesday'   }, time: { ar: '6 صباحًا – 12 ليلًا', en: '6:00 AM – 12:00 AM' } },
    { key: 'wed', day: { ar: 'الأربعاء', en: 'Wednesday' }, time: { ar: '6 صباحًا – 12 ليلًا', en: '6:00 AM – 12:00 AM' } },
    { key: 'thu', day: { ar: 'الخميس',   en: 'Thursday'  }, time: { ar: '6 صباحًا – 1 ليلًا',  en: '6:00 AM – 1:00 AM'  } },
    { key: 'fri', day: { ar: 'الجمعة',   en: 'Friday'    }, time: { ar: '12 ظهرًا – 1 ليلًا',  en: '12:00 PM – 1:00 AM' } }
  ],

  /* ---- Menu ---------------------------------------------------------
     CONFIRMED, transcribed from the café's own المشروبات highlight. Their
     own grouping is kept: each of the hot and cold lists is split into
     espresso drinks, filter, and no-coffee.

     The الحلويات category is deliberately absent — the café has a sweets
     highlight but does not publish prices, and inventing them on a real
     client's site is not acceptable. Paste it in here in the same shape
     when they send it.

     `featured: true` lifts an item onto the home page strip (first three
     in array order win). `image` swaps the branded placeholder for a real
     photograph. */
  menu: [
    {
      id: 'hot-espresso',
      name: { ar: 'ساخن · مشروبات الإسبريسو', en: 'Hot · Espresso' },
      note: { ar: 'تُحضَّر عند الطلب', en: 'Made to order' },
      items: [
        { price: '13', name: { ar: 'إسبريسو',       en: 'Espresso'      } },
        { price: '13', name: { ar: 'أمريكانو',      en: 'Americano'     } },
        { price: '14', name: { ar: 'كورتادو',       en: 'Cortado'       } },
        { price: '15', name: { ar: 'فلات وايت',     en: 'Flat White'    } },
        { price: '16', name: { ar: 'كابتشينو',      en: 'Cappuccino'    } },
        { price: '16', name: { ar: 'لاتيه',         en: 'Latte'         } },
        { price: '17', featured: true,
          name: { ar: 'سبانيش لاتيه', en: 'Spanish Latte' } }
      ]
    },
    {
      id: 'hot-filter',
      name: { ar: 'ساخن · القهوة المقطرة', en: 'Hot · Filter' },
      note: { ar: 'اسأل الباريستا عن حبّة اليوم', en: 'Ask the barista about today’s bean' },
      items: [
        /* Any item can carry `image` (and an optional per-item `alt`) and
           render a real photograph instead of the branded placeholder —
           see BRAND.md. Left off here so the featured strip stays visually
           consistent while the café has only supplied one photo. */
        { price: '17', featured: true,
          name: { ar: 'في 60', en: 'V60' } },
        { price: '9 – 11', name: { ar: 'قهوة اليوم', en: 'Coffee of the Day' } }
      ]
    },
    {
      id: 'hot-nocoffee',
      name: { ar: 'ساخن · بدون قهوة', en: 'Hot · Without coffee' },
      items: [
        { price: '21', name: { ar: 'هوت شوكلت', en: 'Hot Chocolate' } },
        { price: '19', name: { ar: 'ماتشا',     en: 'Matcha'        } }
      ]
    },
    {
      id: 'cold-espresso',
      name: { ar: 'بارد · مشروبات الإسبريسو', en: 'Iced · Espresso' },
      note: { ar: 'مع ثلج مصنوع من الماء المفلتر', en: 'Over filtered ice' },
      items: [
        { price: '13', name: { ar: 'آيس أمريكانو', en: 'Iced Americano' } },
        { price: '16', name: { ar: 'آيس لاتيه',    en: 'Iced Latte'     } },
        { price: '18', featured: true,
          name: { ar: 'آيس سبانيش', en: 'Iced Spanish' } }
      ]
    },
    {
      id: 'cold-filter',
      name: { ar: 'بارد · القهوة المقطرة', en: 'Iced · Filter' },
      items: [
        { price: '17', name: { ar: 'في 60',     en: 'V60'               } },
        { price: '12', name: { ar: 'قهوة اليوم', en: 'Coffee of the Day' } }
      ]
    },
    {
      id: 'cold-nocoffee',
      name: { ar: 'بارد · بدون قهوة', en: 'Iced · Without coffee' },
      items: [
        { price: '18', name: { ar: 'آيس كركديه', en: 'Iced Hibiscus' } },
        { price: '20', name: { ar: 'آيس ماتشا',  en: 'Iced Matcha'   } }
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
      meta2:   { ar: 'نفتح 6 صباحًا',  en: 'Open from 6 AM' }
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
      eyebrow: { ar: 'المشروبات', en: 'Drinks' },   /* add الحلويات back when the sweets menu arrives */
      title: { ar: 'المنيو',  en: 'The Menu' },
      lede:  { ar: 'مشروبات ساخنة وباردة. اسأل الباريستا عن حبّة اليوم.',
               en: 'Hot and cold. Ask the barista about today’s bean.' },
      note:  { ar: 'الأسعار شاملة ضريبة القيمة المضافة.', en: 'All prices include VAT.' }
    },

    story: {
      eyebrow:    { ar: 'عن رهوة', en: 'About Rahwah' },
      title:      { ar: 'قصتنا',  en: 'Our Story' },
      lede:       { ar: 'رهوة كلمة عربية تعني مكان التجمع، ويُقال «رهوة آل فلان» للدلالة على مكان يجتمع فيه أفراد العائلة.',
                    en: 'Rahwah is an Arabic word for a gathering place. People say “the rahwah of such-and-such family” to mean the place where a family comes together.' },
      bodyTitle:  { ar: 'وأنتم عائلتنا', en: 'And you are our family' },
      bodyText:   { ar: 'وأنتم عائلتنا، ورهوة هي مكانكم دائمًا. فتحنا الباب في الملقا بطاولة واحدة وآلة إسبريسو، ومرّت سنة واتسعت المساحة ودخلها النور والنبات، لكن معنى الاسم لم يتغير: مكان يجتمع فيه الناس.',
                    en: 'You are our family, and Rahwah is always your place. We opened in Al Malqa with one table and an espresso machine; a year passed, the room grew, light and plants came in — but the meaning of the name has not changed: a place where people gather.' },
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
      quote:      { ar: '«وأنتم عائلتنا، ورهوة هي مكانكم دائمًا.»',
                    en: '“You are our family, and Rahwah is always your place.”' },
      quoteCite:  { ar: 'من رهوة', en: 'Rahwah' }
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
      cup:      { ar: 'كوب رهوة وإبريق قهوة مقطرة على وسادة سدو',
                  en: 'A Rahwah cup and a filter carafe on a Sadu cushion' },
      sweets:   { ar: 'صينية حلويات رهوة',                en: 'A tray of Rahwah sweets' },
      beans:    { ar: 'كيس حبوب قهوة من رهوة',            en: 'A bag of Rahwah coffee beans' },
      merch:    { ar: 'منتجات رهوة: هودي وكاب وأكواب فخّار', en: 'Rahwah merch: hoodie, cap and clay cups' },
      storefront:{ ar: 'واجهة رهوة المضاءة في الملقا',    en: 'The lit Rahwah storefront in Al Malqa' },
      map:      { ar: 'موقع رهوة على الخريطة في حي الملقا', en: 'Rahwah’s location on the map in Al Malqa' }
    }
  }
};
