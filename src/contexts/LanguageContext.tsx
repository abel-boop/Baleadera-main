import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'am';

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

const translations: Translations = {
  // Navigation
  home: { en: 'Home', am: 'ዋና ገጽ' },
  orderTshirt: { en: 'Order T-Shirt', am: 'ሸሚዝ ይዘዙ' },
  about: { en: 'About Us', am: 'ስለ እኛ' },
  program: { en: 'Program', am: 'ፕሮግራም' },
  testimonials: { en: 'Testimonials', am: 'ምስክርነቶች' },
  memories: { en: 'Memories', am: 'ትዝታዎች' },
  register: { en: 'Register', am: 'ይመዝገቡ' },
  login: { en: 'Login', am: 'ግባ' },
  logout: { en: 'Logout', am: 'ውጣ' },
  admin: { en: 'Admin', am: 'አስተዳዳሪ' },
  
  // Hero Section
  heroTitle1: { en: 'Become a', am: 'ባለአደራ ትውልድን' },
  heroTitle2: { en: 'Trustee Generation', am: 'ይቀላቀሉ' },
  heroParagraph1: { 
    en: 'This is your moment. A generation is <strong>rising</strong> — <strong>passionate</strong> about the Church, all about <strong>unity</strong>, and building <strong>together</strong>, not apart and <strong>grounded</strong> in truth.', 
    am: 'ጊዜው አሁን ነው! ትውልድ እየተነሳ ነው! ለቤተ-ክርስቲያን ሸክም ያለው ፣ በአንድነት የሚያምን እና በእውነት ስር የሰደደ።'
  },
  heroParagraph2: {
    en: 'Join a <strong>life-changing</strong> journey where young hearts are <strong>ignited</strong> with <strong>divine wisdom</strong>, trained in real <strong>biblical power</strong>, and called to carry <strong>God\'s mission</strong> with purpose.',
    am: 'ወደዚህ ህይወት ለዋጭ ጉዞ ይቀላቀሉ። በመንፈስ ቅዱስ ኃይል እና በመጽሐፍ ቅዱስ  በእግዚአብሔር ቃል ጥበብ እየተሞላን ፡ ለእግዚአብሔር ተልዕኮ የተዘጋጀን እንሁን።'
  },
  heroParagraph3: {
    en: 'You\'re not just learning — you\'re becoming a <strong>trusted leader</strong>, a <strong>world-changer</strong>, a <strong>kingdom warrior</strong> for your generation.',
    am: 'ወደዚህ መጠራታችሁ ስልጠና ለመካፈል ብቻ ሳይሆን ፤ በትውልዳችሁ መካከል - የምትታመኑ መሪዎች ፣ ዓለም የምትቀይሩ እና የመንግሥተ ሰማያት ወታደሮች እንድትሆኑ ተጠርታችኋል።'
  },
  registerNow: { en: 'Register Now', am: 'አሁኑኑ ይመዝገቡ' },
  ourMission: { en: 'Our Mission', am: 'ተልእኳችን' },
  trusteeGeneration: { en: 'Trustee Generation of Tomorrow', am: 'የነገ ባለአደራ ትውልድ' },
  
  // About Section
  ourDivineCalling: { en: 'Our Divine Calling', am: 'ጥሪያችን' },
  callingDescription: { 
    en: 'To raise a generation of trustworthy, Christ-centered individuals who are deeply passionate about and faithfully committed to their local church — cultivating the Body of Christ, advancing the mission of the Church, and strengthening the unity and fellowship of believers for the glory of God.',
    am: 'ክርስቶስን ማዕከል ያደረገ ፣ ለቤተ-ክርስቲያንና ለወንጌል ሸክም ያለው እንዲሁም በአንድነት የሚያምን — አካሉን ለማነጽ የሚተጋ እና ለታላቁ ተልዕኮ ራሱን ያዘጋጀ ባለአደራ ትውልድን ማስነሳት።'
  },
  
  // Program Section
  eventDetails: { en: 'Event Details', am: 'ዝርዝር' },
  joinUs: { en: 'Join us for a transformative spiritual experience', am: 'ወደ ለዋጩ መንፈሳ ልምምድ ይቀላቀሉ' },
  when: { en: 'When', am: 'መቼ' },
  where: { en: 'Where', am: 'የት' },
  who: { en: 'Who', am: 'ለማን' },
  
  // Impact Section
  ourImpact: { en: 'Our Impact', am: 'ተጽዕኖ' },
  transformingLives: { en: 'Transforming lives through 4 powerful rounds of our program', am: 'በ 4ቱ አስደናቂ የስልጠና ዙሮች የተከናወኑ ህይወት ለዋጭ ተግባራት' },
  totalReach: { en: 'Total Reach', am: 'ጠቅላላ ደርሷል' },
  teenagersReached: { en: 'Teenagers reached across our 4 rounds of programs', am: 'በ 4 የፕሮግራማችን ምድቦች የደረስናቸው ወጣቶች' },
  spiritualImpact: { en: 'Spiritual Impact', am: 'መንፈሳዊ ተጽዕኖ' },
  setFree: { en: 'Set free from demonic oppression', am: 'ከዲያብሎስ እስር የተፈቱ' },
  lifeChanges: { en: 'Life Changes', am: 'የህይወት ለውጦች' },
  livesTransformed: { en: 'Lives transformed by overcoming addiction through our program', am: 'በፕሮግራማችን በመጠቀም ከጥፋተኝነት የወጡ ህይወቶች' },
  churchesPartnered: { en: 'Churches', am: 'ቤተክርስቲያናት' },
  partneredWithUs: { en: 'Partnered with us, including 11 churches that have integrated our program into their regular curriculum', am: 'ከእኛ ጋር የተቀናጁ ፣ ከነዚህም ውስጥ 11 ቤተክርስቲያናት ፕሮግራማችንን በየካቲት ስርዓታቸው ውስጥ አስገብተዋል' },
  
  // Call to Action
  stepIntoYourCalling: { en: 'Step Into Your Calling. Change Your World!', am: 'ጥሪዎን ይቀበሉ። ዓለምዎን ይቀይሩ!' },
  joinTrusteeGeneration: { en: 'Join the Trustee Generation — a movement of young warriors rising up to lead with God\'s love, live with unshakable purpose, and bring real change to their communities through divine wisdom', am: 'ወደ ባለአደራ ትውልድ ይቀላቀሉ — በእግዚአብሔር ፍቅር ለመምራት ፣ በማይናወጥ ዓላማ ለመኖር ፣ እና በአምላካዊ ጥበብ እውነተኛ ለውጥ ለማምጣት የሚነሱ ወጣት ወታደሮች እንቅስቃሴ' },
  beginYourJourney: { en: 'Begin Your Spiritual Journey', am: 'መንፈሳዊ ጉዞዎን ይጀምሩ' },
  
  // Footer
  allRightsReserved: { en: 'All rights reserved', am: 'ሁሉም መብቶች የተጠበቁ ናቸው' },
  privacyPolicy: { en: 'Privacy Policy', am: 'የግላዊነት ፖሊሲ' },
  termsOfService: { en: 'Terms of Service', am: 'የአገልግሎት ውሎች' },
  contactUs: { en: 'Contact Us', am: 'ያግኙን' },
  followUs: { en: 'Follow Us', am: 'ተከተሉን' },
  
  // Card Content
  biblicalFoundation: { en: 'Biblical Foundation', am: 'መጽሐፍ ቅዱሳዊ መሰረት' },
  biblicalFoundationDesc: { 
    en: 'Grounded in Scripture, we equip young people with God\'s Word as the foundation for wise leadership and righteous living in their communities.',
    am: 'በመጽሐፍ ቅዱስ የተመሰረቱ ፣ ታዳጊ ወጣቶችን በእግዚአብሔር ቃል እናዘጋጃቸዋለን ፡ በማህበረሰባቸው ውስጥ አስተዋይ መሪዎች ለመሆን እና የጽድቅን ህይወት ለመኖር።'
  },
  servantLeadership: { en: 'Servant Leadership', am: 'መሪነት' },
  servantLeadershipDesc: {
    en: 'Following Christ\'s example of servant leadership, we nurture hearts that seek to serve others with humility, compassion, and divine love.',
    am: 'የክርስቶስን የአገልጋይ መሪነት ምሳሌ ተከትለን ፣ አንዳንዶችን በትሕትና ፣ በርኅራኄ እና በአምላካዊ ፍቅር ለማገልገል የሚፈልጉ ልቦችን እንፈጥራለን።'
  },
  spiritualGrowth: { en: 'Spiritual Growth', am: 'መንፈሳዊ እድገት' },
  spiritualGrowthDesc: {
    en: 'Through prayer, fellowship, and biblical study, participants grow in spiritual maturity and develop a deeper relationship with God.',
    am: 'በጸሎት ፣ በትምህርት ጉባኤ እና በመጽሐፍ ቅዱስ ጥናት በኩል ተሳታፊዎች በመንፈሳዊ ጤናቸው ይዳብራሉ እና ከእግዚአብሔር ጋር የበለጠ ጥልቅ ግንኙነት ይፈጥራሉ።'
  },
  // Program Section
  programWhoLabel: { en: 'Who', am: 'ለማን' },
  programLocation1: { 
    en: 'Location 1: Hawassa Genet Church',
    am: 'ቦታ 1: ሀዋሳ ገነት ቤተ-ክርስቲያን'
  },
  programLocation2: {
    en: 'Location 2: Hawassa Emmanuel United Church',
    am: 'ቦታ 2: ሀዋሳ አማኑኤል ኀብረት ቤተ-ክርስቲያን'
  },
  programWho: {
    en: 'Teenagers (Ages 14–19) From our awesome partner churches — specially chosen & called for something greater.',
    am: 'ታዳጊ ወጣቶች ዕድሜያቸው (ከ14-19 ዓመት) ያሉ ጥሪ ከተደረገላቸው ከተለያዩ ቤተክርስቲያናት።'
  },
  churchesPartneredDesc: {
    en: 'Churches partnered with us, including 11 churches that have integrated our program into their regular curriculum',
    am: 'ከእኛ ጋር የተተባበሩ ቤተክርስቲያናት፣ ፕሮግራማችንን በመደበኛ ስርዓተ-ትምህርታቸው ውስጥ ያስተካከሉ 11 ቤተክርስቲያናትን ጨምሮ'
  },
  // Footer
  raisingTheNextGeneration: {
    en: 'Raising the next generation of trustees through biblical wisdom, spiritual growth, and servant leadership.',
    am: 'በመጽሐፍ ቅዱሳዊ ጥበብ፣ መንፈሳዊ እድገት እና አገልጋይ መሪነት የሚቀጥለውን ባለአደራ ትውልድ በመዳበር ላይ።'
  },
  joinTheMovement: {
    en: 'Join the Trustee Generation — a movement of young warriors rising up to lead with God\'s love, live with unshakable purpose, and bring real change to their communities through divine wisdom',
    am: 'ወደ ባለአደራ ትውልድ ይቀላቀሉ — በእግዚአብሔር ፍቅር ለመምራት፣ በማይናወጥ ዓላማ ለመኖር እና በአምላካዊ ጥበብ እውነተኛ ለውጥ ለማምጣት የሚነሱ ወጣት ወታደሮች እንቅስቃሴ'}
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
