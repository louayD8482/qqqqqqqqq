export interface HadithItem {
  id: number;
  book: 'صحيح البخاري' | 'صحيح مسلم' | 'الأربعين النووية' | 'رياض الصالحين' | 'جامع الترمذي';
  chapter?: string;
  text: string;
  narrator: string;
  virtue?: string;
}

export interface SurahItem {
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
  revelationType: 'مكية' | 'مدنية';
  sampleVerse: string;
  tafsirSample: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface CityLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  lat: number;
  lng: number;
  timezoneOffset: number; // in hours
}

export const CITIES_LIST: CityLocation[] = [
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', countryAr: 'المملكة العربية السعودية', lat: 24.7136, lng: 46.6753, timezoneOffset: 3 },
  { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', countryAr: 'المملكة العربية السعودية', lat: 21.4225, lng: 39.8262, timezoneOffset: 3 },
  { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', countryAr: 'المملكة العربية السعودية', lat: 24.5247, lng: 39.5692, timezoneOffset: 3 },
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', countryAr: 'مصر', lat: 30.0444, lng: 31.2357, timezoneOffset: 2 },
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', countryAr: 'الإمارات', lat: 25.2048, lng: 55.2708, timezoneOffset: 4 },
  { id: 'jerusalem', nameAr: 'القدس الشريف', nameEn: 'Jerusalem', countryAr: 'فلسطين', lat: 31.7683, lng: 35.2137, timezoneOffset: 2 },
  { id: 'kuwait', nameAr: 'الكويت', nameEn: 'Kuwait City', countryAr: 'الكويت', lat: 29.3759, lng: 47.9774, timezoneOffset: 3 },
  { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', countryAr: 'قطر', lat: 25.2854, lng: 51.5310, timezoneOffset: 3 },
  { id: 'amman', nameAr: 'عمّان', nameEn: 'Amman', countryAr: 'الأردن', lat: 31.9454, lng: 35.9284, timezoneOffset: 3 },
  { id: 'casablanca', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', countryAr: 'المغرب', lat: 33.5731, lng: -7.5898, timezoneOffset: 1 },
  { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', countryAr: 'تركيا', lat: 41.0082, lng: 28.9784, timezoneOffset: 3 },
  { id: 'london', nameAr: 'لندن', nameEn: 'London', countryAr: 'بريطانيا', lat: 51.5074, lng: -0.1278, timezoneOffset: 0 },
];

export const HADITHS_DATABASE: HadithItem[] = [
  {
    id: 1,
    book: 'صحيح البخاري',
    chapter: 'بدء الوحي',
    text: '«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا، أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».',
    narrator: 'عمر بن الخطاب رضي الله عنه',
    virtue: 'أصل عظيم من أصول الإسلام وقاعدة تدور عليها جميع الأعمال والعبادات.'
  },
  {
    id: 2,
    book: 'صحيح مسلم',
    chapter: 'الإيمان والإسلام والإحسان',
    text: '«بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ، إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعَرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ... فَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ...».',
    narrator: 'عمر بن الخطاب رضي الله عنه',
    virtue: 'حديث جبريل المشهور الذي يجمع أركان الدين ومراتبه الثلاث.'
  },
  {
    id: 3,
    book: 'الأربعين النووية',
    chapter: 'النصيحة عماد الدين',
    text: '«الدِّينُ النَّصِيحَةُ، قُلْنَا: لِمَنْ يَا رَسُولَ اللَّهِ؟ قَالَ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ».',
    narrator: 'تميم بن أوس الداري رضي الله عنه',
    virtue: 'يدل على شمول النصيحة وإخلاص القصد في كل شأن من شؤون الحياة.'
  },
  {
    id: 4,
    book: 'صحيح البخاري',
    chapter: 'الرقاق والذكر',
    text: '«كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ».',
    narrator: 'أبو هريرة رضي الله عنه',
    virtue: 'خاتمة صحيح البخاري وأحد أرجى الأذكار مضاعفة للأجر والمغفرة.'
  },
  {
    id: 5,
    book: 'صحيح مسلم',
    chapter: 'فضل الأذكار',
    text: '«لَأَنْ أَقُولَ: سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، أَحَبُّ إِلَيَّ مِمَّا طَلَعَتْ عَلَيْهِ الشَّمْسُ».',
    narrator: 'أبو هريرة رضي الله عنه',
    virtue: 'الباقيات الصالحات وغراس الجنة.'
  },
  {
    id: 6,
    book: 'الأربعين النووية',
    chapter: 'حفظ الله ورعايته',
    text: '«يَا غُلاَمُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ».',
    narrator: 'عبد الله بن عباس رضي الله عنهما',
    virtue: 'وصية نبوية جامعة للتوكل على الله وتفويض الأمور إليه.'
  },
  {
    id: 7,
    book: 'رياض الصالحين',
    chapter: 'التقوى وحسن الخلق',
    text: '«اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ».',
    narrator: 'أبو ذر ومعاذ بن جبل رضي الله عنهما',
    virtue: 'وصية جامعة لحق الله تعالى وحقوق عباده وحسن التعامل.'
  },
  {
    id: 8,
    book: 'جامع الترمذي',
    chapter: 'فضل الصلاة على النبي ﷺ',
    text: '«أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً».',
    narrator: 'عبد الله بن مسعود رضي الله عنه',
    virtue: 'بشارة عظيمة لملازمي الصلاة على رسول الله ﷺ بالقرب منه يوم القيامة.'
  }
];

export const SURAHS_DATABASE: SurahItem[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', versesCount: 7, revelationType: 'مكية', sampleVerse: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝', tafsirSample: 'أم الكتاب والسبع المثاني والشفاء التام، يفتتح بها كتاب الله وتصلى بها كل ركعة.' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', versesCount: 286, revelationType: 'مدنية', sampleVerse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ', tafsirSample: 'سنام القرآن وفيها أعظم آية في كتاب الله (آية الكرسي) وخواتيمها كنز من تحت العرش.' },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', versesCount: 200, revelationType: 'مدنية', sampleVerse: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ ۚ', tafsirSample: 'الزهراء الثانية مع سورة البقرة تظلان صاحبهما يوم القيامة كغمامتين.' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', versesCount: 176, revelationType: 'مدنية', sampleVerse: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ', tafsirSample: 'أحكام العدل وحقوق الضعفاء واليتامى والفرائض وتبيان الحقوق الأسرية.' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', versesCount: 110, revelationType: 'مكية', sampleVerse: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ', tafsirSample: 'نور ما بين الجمعتين وعصمة من فتنة المسيح الدجال بما تضمنته من قصص العبر.' },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', versesCount: 83, revelationType: 'مكية', sampleVerse: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ۝', tafsirSample: 'تأكيد الرسالة النبوية والبعث والنشور ودلائل قدرة الله في الكون.' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', versesCount: 78, revelationType: 'مدنية', sampleVerse: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ ۝', tafsirSample: 'عروس القرآن بما فيها من ترغيب وتعداد نعم الله الجليلة الظاهرة والباطنة.' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', versesCount: 96, revelationType: 'مكية', sampleVerse: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝', tafsirSample: 'بيان أحوال الناس يوم القيامة: السابقون المقربون، وأصحاب اليمين، وأصحاب الشمال.' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', versesCount: 30, revelationType: 'مكية', sampleVerse: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝', tafsirSample: 'المنجية والمانعة من عذاب القبر تشفع لصاحبها حتى يغفر له.' },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha', versesCount: 11, revelationType: 'مكية', sampleVerse: 'وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ ۝', tafsirSample: 'تسلية لقلب النبي ﷺ وبشارة العطاء العظيم والرضا التام في الدنيا والآخرة.' },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', versesCount: 8, revelationType: 'مكية', sampleVerse: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝', tafsirSample: 'انشراح الصدر وتفريج الكرب وبشارة أن مع كل ضيق فرجاً ميسراً.' },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', versesCount: 5, revelationType: 'مكية', sampleVerse: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۝ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۝', tafsirSample: 'فضل الليلة المباركة التي أنزل فيها القرآن وتقدير الأرزاق والأعمار وتنزل الملائكة.' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', versesCount: 4, revelationType: 'مكية', sampleVerse: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝', tafsirSample: 'تعدل ثلث القرآن في الأجر والفضل لتضمنها صفة الواحد الأحد وتنزيهه التام.' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', versesCount: 5, revelationType: 'مكية', sampleVerse: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝', tafsirSample: 'الاستعاذة برب الصبح من شرور المخلوقات والظلمات والحسد والسحر.' },
  { number: 114, name: 'الناس', englishName: 'An-Nas', versesCount: 6, revelationType: 'مكية', sampleVerse: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝', tafsirSample: 'عصمة وحماية من وساوس الشياطين وشرور الإنس والجن.' }
];

export const HISN_ALMUSLIM_CATEGORIES = [
  {
    id: 'sabah',
    titleAr: 'أذكار الصباح',
    titleEn: 'Morning Adhkar',
    icon: 'Sun',
    items: [
      { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', target: 1, virtue: 'حفظ وبركة ليوم المسلم من الصباح حتى المساء.' },
      { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.', target: 1, virtue: 'الاعتراف بنعمة الحياة والإحياء والتفويض لله.' },
      { text: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.', target: 1, virtue: 'سيد الاستغفار: من قالها موقناً بها فمات من يومه دخل الجنة.' },
      { text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.', target: 3, virtue: 'تفريج الكرب وإصلاح الأحوال وتوكيل الأمر لله.' },
      { text: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', target: 3, virtue: 'حماية وحصانة تامة لا يضره شيء حتى يمسي.' }
    ]
  },
  {
    id: 'masaa',
    titleAr: 'أذكار المساء',
    titleEn: 'Evening Adhkar',
    icon: 'Moon',
    items: [
      { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', target: 1, virtue: 'شكر الله على نعمة إدراك المساء والسلامة.' },
      { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.', target: 1, virtue: 'تجديد العهد والتوكل في ختام النهار.' },
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', target: 3, virtue: 'حرز وحفظ من الهوام والسموم والشرور في الليل.' },
      { text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.', target: 7, virtue: 'من قالها سبع مرات كفاه الله ما أهمه من أمر الدنيا والآخرة.' }
    ]
  },
  {
    id: 'after_prayer',
    titleAr: 'أذكار ما بعد الصلاة',
    titleEn: 'Post-Prayer Adhkar',
    icon: 'Compass',
    items: [
      { text: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.', target: 1, virtue: 'سنة نبوية مؤكدة عقب السلام من كل صلاة مكتوبة.' },
      { text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.', target: 1, virtue: 'توحيد واعتراف بقدرة الله المطلقة.' },
      { text: 'سُبْحَانَ اللَّهِ (٣٣) ، الْحَمْدُ لِلَّهِ (٣٣) ، اللَّهُ أَكْبَرُ (٣٣) ، تَمَامَ الْمِائَةِ: لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', target: 100, virtue: 'غفرت خطاياه وإن كانت مثل زبد البحر.' }
    ]
  },
  {
    id: 'sleep',
    titleAr: 'أذكار النوم والاستيقاظ',
    titleEn: 'Sleep & Awakening',
    icon: 'Sparkles',
    items: [
      { text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.', target: 1, virtue: 'حفظ الروح عند النوم وتسليم الأمر للخالق.' },
      { text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.', target: 3, virtue: 'سنة النبي ﷺ كان يضع يده اليمنى تحت خده ويقولها.' },
      { text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.', target: 1, virtue: 'ذكر الاستيقاظ من النوم وشكر نعمة تجدد الحياة.' }
    ]
  }
];

// Helper to compute local prayer times based on city offset
export function calculateCityPrayerTimes(city: CityLocation): {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  minutesRemaining: number;
} {
  // Approximate standard schedules customized per city longitude
  const now = new Date();
  
  // Base Riyadh times
  const baseFajrHour = 4;
  const baseFajrMin = 18;
  const baseSunriseHour = 5;
  const baseSunriseMin = 38;
  const baseDhuhrHour = 11;
  const baseDhuhrMin = 58;
  const baseAsrHour = 15;
  const baseAsrMin = 22;
  const baseMaghribHour = 18;
  const baseMaghribMin = 18;
  const baseIshaHour = 19;
  const baseIshaMin = 48;

  // Longitudinal difference in minutes from Riyadh (46.67E)
  const diffMinutes = Math.round((city.lng - 46.6753) * 4);

  const formatTime = (h: number, m: number) => {
    let totalMins = h * 60 + m + diffMinutes;
    while (totalMins < 0) totalMins += 24 * 60;
    while (totalMins >= 24 * 60) totalMins -= 24 * 60;
    const finalH = Math.floor(totalMins / 60);
    const finalM = totalMins % 60;
    return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;
  };

  const fajrStr = formatTime(baseFajrHour, baseFajrMin);
  const sunriseStr = formatTime(baseSunriseHour, baseSunriseMin);
  const dhuhrStr = formatTime(baseDhuhrHour, baseDhuhrMin);
  const asrStr = formatTime(baseAsrHour, baseAsrMin);
  const maghribStr = formatTime(baseMaghribHour, baseMaghribMin);
  const ishaStr = formatTime(baseIshaHour, baseIshaMin);

  // Determine current & next prayer
  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const parseToMins = (tStr: string) => {
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  };

  const prayers = [
    { name: 'صلاة الفجر', time: fajrStr, mins: parseToMins(fajrStr) },
    { name: 'شروق الشمس', time: sunriseStr, mins: parseToMins(sunriseStr) },
    { name: 'صلاة الظهر', time: dhuhrStr, mins: parseToMins(dhuhrStr) },
    { name: 'صلاة العصر', time: asrStr, mins: parseToMins(asrStr) },
    { name: 'صلاة المغرب', time: maghribStr, mins: parseToMins(maghribStr) },
    { name: 'صلاة العشاء', time: ishaStr, mins: parseToMins(ishaStr) },
  ];

  let nextPrayer = prayers[0];
  let diff = prayers[0].mins - currentTotalMins;

  for (const p of prayers) {
    if (p.mins > currentTotalMins) {
      nextPrayer = p;
      diff = p.mins - currentTotalMins;
      break;
    }
  }

  // If passed Isha, next is Fajr tomorrow
  if (diff <= 0) {
    nextPrayer = prayers[0];
    diff = 24 * 60 - currentTotalMins + prayers[0].mins;
  }

  return {
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    nextPrayerName: nextPrayer.name,
    nextPrayerTime: nextPrayer.time,
    minutesRemaining: diff,
  };
}
