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
  about: { en: 'About Us', am: 'ስለ እኛ' },
  program: { en: 'Program', am: 'ፕሮግራም' },
  testimonials: { en: 'Testimonials', am: 'ምስክርነቶች' },
  memories: { en: 'Memories', am: 'ትዝታዎች' },
  register: { en: 'Register', am: 'ይመዝገቡ' },
  login: { en: 'Login', am: 'ግባ' },
  logout: { en: 'Logout', am: 'ውጣ' },
  admin: { en: 'Admin', am: 'አስተዳዳሪ' },
  
  // Hero Section
  heroTitle1: { en: 'Become a', am: 'ባለአደራ ትውልድ' },
  heroTitle2: { en: 'Trustee Generation', am: 'ይሁኑ' },
  and: { en: 'and', am: 'እና' },
  heroSubtitle1: { en: 'This is your moment. A generation rising — ', am: 'ጊዜው አውን ነው። የሚነሳ ትውልድ :-'},
  heroSubtitleBold1: { en: 'bold', am: 'ደፋር' },
  heroSubtitleBold2: { en: 'fearless', am: 'የማይፈራ'},
  heroSubtitleBold3: { en: 'grounded in truth', am: 'በእውነት የተመሰረተ፣' },
  heroSubtitle2: { en: 'Join a ', am: 'ተቀላቀሉን በዚ' },
  heroSubtitleBold4: { en: 'life-changing journey', am: ' ህይወትን የሚቀይር ጉዞ' },
  heroSubtitle3: { en: ' where young hearts are ', am: '፣ ልባችንም ' },
  heroSubtitleBold5: { en: 'lit with divine wisdom', am: 'በመሎኮታዊ እና' },
  heroSubtitle4: { en: ', trained in real ', am: '፣ በእውነተኛ ' },
  heroSubtitleBold6: { en: 'biblical power', am: 'የመጽሐፍ ቅዱሳዊ ኃይል' },
  heroSubtitle5: { en: ', and called to carry', am: ' እየሞላን' },
  heroSubtitleBold7: { en: "God's mission with purpose", am: 'ለእግዚአብሔር ተልዕኮ' },
  heroSubtitle6: { en: '.', am: ' የተዘጋጀን እንሁን።' },
  heroSubtitle7: { en: 'You\'re not just learning — you\'re becoming a ', am: 'መማር ብቻ ሳይሆን:-  በዚ ትውልድ - ' },
  heroSubtitleBold8: { en: 'trusted leader', am: 'ታማኝ መሪ' },
  heroSubtitle8: { en: ', a ', am: '፣ ' },
  heroSubtitleBold9: { en: 'world-changer', am: 'ዓለም ቀያሪ' },
  heroSubtitle9: { en: ', a ', am: '፣ ' },
  heroSubtitleBold10: { en: 'kingdom warrior', am: 'የመንግሥተ ሰማያት ወታደር' },
  heroSubtitle10: { en: ' for your generation.', am: ' ነው የሚሆኑት።' },
  registerNow: { en: 'Register Now', am: 'አሁኑኑ ይመዝገቡ' },
  ourMission: { en: 'Our Mission', am: 'ተልእኳችን' },
  trusteeGeneration: { en: 'Trustee Generation of Tomorrow', am: 'የነገ ባለአደራ ትውልድ' },
  
  // About Section
  ourDivineCalling: { en: 'Our Divine Calling', am: 'የእኛ ጥሪ' },
  callingDescription: { 
    en: 'To raise a generation of trustworthy, Christ-centered individuals who are deeply passionate about and faithfully committed to their local church — cultivating the Body of Christ, advancing the mission of the Church, and strengthening the unity and fellowship of believers for the glory of God.',
    am: 'በክርስቶስ የተመሰረተ ፣ በቤተክርስቲያናቸው ላይ ጥልቅ ትኩረት ያላቸው እና ታማኝ ተስፋ ያላቸው ባለአደራ ትውልድ ለመድረስ — የክርስቶስን ሥጋ በመንከባከብ ፣ የቤተክርስቲያንን ተልእኮ በማሳደግ ፣ እና የምእምናንን አንድነት እና ቤተክርስቲያናዊ ተባባሪነት ለእግዚአብሔር ክብር በማጠናከር።'
  },
  
  // Program Section
  eventDetails: { en: 'Event Details', am: 'ዝርዝር' },
  joinUs: { en: 'Join us for a transformative spiritual experience', am: 'ለለውጣማ መንፈሳዊ ተሞክሮ ይቀላቀሉን' },
  when: { en: 'When', am: 'መቼ' },
  where: { en: 'Where', am: 'የት' },
  who: { en: 'Who', am: 'ለማን' },
  
  // Impact Section
  ourImpact: { en: 'Our Impact', am: 'ተጽዕኖ' },
  transformingLives: { en: 'Transforming lives through 4 powerful rounds of our program', am: 'በ 4 ኃይለኛ የፕሮግራማችን ምድቦች ሕይወቶችን በመቀየር ላይ' },
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
  biblicalFoundation: { en: 'Biblical Foundation', am: 'የመጽሐፍ ቅዱስ መሰረት' },
  biblicalFoundationDesc: { 
    en: 'Grounded in Scripture, we equip young people with God\'s Word as the foundation for wise leadership and righteous living in their communities.',
    am: 'በመጽሐፍ ቅዱስ የተመሰረተ ፣ ወጣቶችን በእግዚአብሔር ቃል እናዘጋጃቸዋለን በማህበረሰባቸው ውስጥ ጥበበኛ መሪ እና ጻድቅ ህይወት ለመኖር።'
  },
  servantLeadership: { en: 'Servant Leadership', am: 'አገልጋይ መሪነት' },
  servantLeadershipDesc: {
    en: 'Following Christ\'s example of servant leadership, we nurture hearts that seek to serve others with humility, compassion, and divine love.',
    am: 'የክርስቶስን የአገልጋይ መሪነት ምሳሌ ተከትለን ፣ አንዳንዶችን በትሕትና ፣ በርኅራኄ እና በአምላካዊ ፍቅር ለማገልገል የሚፈልጉ ልቦችን እንፈጥራለን።'
  },
  spiritualGrowth: { en: 'Spiritual Growth', am: 'መንፈሳዊ እድገት' },
  spiritualGrowthDesc: {
    en: 'Through prayer, fellowship, and biblical study, participants grow in spiritual maturity and develop a deeper relationship with God.',
    am: 'በጸሎት ፣ በወንጌላዊ ጉባኤ እና በመጽሐፍ ቅዱስ ጥናት በኩል ተሳታፊዎች በመንፈሳዊ ጤናቸው ይዳብራሉ እና ከእግዚአብሔር ጋር የበለጠ ጥልቅ ግንኙነት ይፈጥራሉ።'
  },
  // Program Section
  who: { en: 'Who', am: 'ማን' },
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
    am: 'ወጣቶች (14-19 ዓመት) ከእኛ አስደናቂ የተቋቋሙ ቤተክርስቲያናት — ለበለጠ ነገር በልዩ ምርጫ እና ጥሪ የተጠሩ።'
  },
  churchesPartnered: {
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
