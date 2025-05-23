'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Key, Calendar, Bookmark, MapPin, Heart, MessageCircle, Share2, Database, Menu, Target, Brain, BarChart, Building2, Shield, UserPlus } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  verified?: boolean;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
}

interface RegisteredUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  interests: string[];
  bio: string;
  statuses: Array<{
    content: string;
    timestamp: string;
  }>;
}

interface LocationPattern {
  location: string;
  frequency: string;
  timeSpent: string;
}

interface BackendPost {
  id: number;
  author: string;
  authorType: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
}

interface BehavioralPatterns {
  deviceUsage: {
    primary: string;
    secondary: string;
    tertiary: string;
    browsers: string[];
  };
  peakActivityTimes: string[];
  contentPreferences: {
    visual: string;
    audio: string;
    longform: string;
    video: string;
  };
  engagementStyle: string;
  averageSessionDuration: string;
  weeklyActiveHours: number;
}

type PostType = Post | BackendPost;

// Add formatTimestamp function before generatePersonalizedPosts
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Zojuist';
  if (diffMinutes < 60) return `${diffMinutes} minuten geleden`;
  if (diffMinutes < 120) return '1 uur geleden';
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} uur geleden`;
  if (diffMinutes < 2880) return 'Gisteren';
  return date.toLocaleDateString('nl-NL');
};

// Add getAvatar function before generatePersonalizedPosts
const getAvatar = (name: string, type: string) => {
  const emojis: { [key: string]: string } = {
    tech: '💻',
    music: '🎵',
    travel: '✈️',
    food: '🍳',
    sport: '🏃',
    news: '📰',
    art: '🎨',
    community: '👥'
  };
  
  return type in emojis ? emojis[type] : name.charAt(0).toUpperCase();
};

// Update generatePersonalizedPosts to use let instead of const for posts
const generatePersonalizedPosts = (user: RegisteredUser): Post[] => {
  let posts: Post[] = [];
  
  // Add status updates to the feed if they exist
  if (user.statuses && user.statuses.length > 0) {
    user.statuses.forEach((status, index) => {
      posts.push({
        id: -index - 1, // Negative IDs to avoid conflicts with other posts
        author: user.name,
        avatar: user.name.charAt(0),
        content: status.content,
        likes: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 10) + 1,
        shares: Math.floor(Math.random() * 5),
        time: formatTimestamp(status.timestamp),
        verified: true
      });
    });
  }

  // Add welcome post and other generated posts
  posts = [
    {
      id: 1,
      author: "Vanta Team",
      avatar: "V",
      verified: true,
      content: `Welkom bij Vanta, ${user.name}! ⚡ We zien dat je geïnteresseerd bent in ${user.interests.slice(0, 2).join(' en ')}. Deel wat er toe doet. #MinimalistSocial`,
      likes: 15,
      comments: 3,
      shares: 1,
      time: "Zojuist"
    },
    ...posts // Add status posts before other generated posts
  ];

  // Add local community post with location-specific avatar
  posts.push({
    id: 2,
    author: `${user.location} Community`,
    avatar: "📍",
    verified: true,
    content: `Hey ${user.name.split(' ')[0]}! Er zijn ${Math.floor(Math.random() * 50) + 100} ${user.interests[0]} enthousiastelingen in jouw buurt. Check deze lokale events en connect met gelijkgestemden! 🤝 #LocalCommunity`,
    likes: Math.floor(Math.random() * 50) + 30,
    comments: Math.floor(Math.random() * 15) + 5,
    shares: Math.floor(Math.random() * 10) + 2,
    time: "1 uur geleden"
  });

  // Dutch influencer names for more authenticity
  const dutchNames = [
    "Emma de Vries", "Lars van Dijk", "Sophie Bakker", "Tim Hoekstra", 
    "Nina Visser", "Daan Jansen", "Lisa Smit", "Bram de Jong",
    "Eva Mulder", "Max van der Berg", "Floor Peters", "Sven de Boer"
  ];

  // Interest-based posts with more variety
  user.interests.forEach((interest, index) => {
    const influencer = dutchNames[Math.floor(Math.random() * dutchNames.length)];
    const content = getInterestBasedContent(interest);
    const interestType = getInterestType(interest);
    
    posts.push({
      id: index + 3,
      author: influencer,
      avatar: getAvatar(influencer, interestType),
      verified: Math.random() > 0.3, // 70% chance of being verified
      content,
      likes: Math.floor(Math.random() * 1000) + 100,
      comments: Math.floor(Math.random() * 100) + 10,
      shares: Math.floor(Math.random() * 50) + 5,
      time: `${Math.floor(Math.random() * 3) + 2} uur geleden`
    });
  });

  // Add trending topic with news avatar
  const mainInterest = user.interests[0];
  posts.push({
    id: posts.length + 1,
    author: "TrendWatch NL",
    avatar: "📊",
    verified: true,
    content: `Trending Topic: "${mainInterest}" heeft een spike van ${Math.floor(Math.random() * 200) + 300}% in engagement! Onze analyse laat zien dat dit komt door ${
      Math.random() > 0.5 ? 
      `een viral ${mainInterest} video die momenteel rondgaat` : 
      `nieuwe ontwikkelingen in de ${mainInterest} community`
    }. #TrendAlert 📈`,
    likes: Math.floor(Math.random() * 500) + 1000,
    comments: Math.floor(Math.random() * 200) + 100,
    shares: Math.floor(Math.random() * 100) + 50,
    time: "3 uur geleden"
  });

  // Add age-based networking suggestion
  posts.push({
    id: posts.length + 1,
    author: `Generatie ${getGenerationName(calculateAge(user.birthday))} Network`,
    avatar: "G",
    verified: true,
    content: getAgeBasedContent(calculateAge(user.birthday), user.interests[0]),
    likes: Math.floor(Math.random() * 300) + 150,
    comments: Math.floor(Math.random() * 40) + 20,
    shares: Math.floor(Math.random() * 25) + 10,
    time: "4 uur geleden"
  });

  return posts;
};

const getInterestType = (interest: string): string => {
  const interestMap: { [key: string]: string } = {
    tech: 'tech',
    technologie: 'tech',
    muziek: 'music',
    reizen: 'travel',
    koken: 'food',
    eten: 'food',
    sport: 'sport',
    fitness: 'sport',
    nieuws: 'news',
    kunst: 'art',
    cultuur: 'art'
  };

  const lowercaseInterest = interest.toLowerCase();
  return Object.entries(interestMap).find(([key]) => 
    lowercaseInterest.includes(key)
  )?.[1] || 'community';
};

const getRandomInfluencer = (interest: string): string => {
  const influencers = {
    tech: ['TechInsider', 'CodeMaster', 'DigitalPro'],
    music: ['MusicGuru', 'SoundWave', 'BeatMaker'],
    travel: ['Wanderlust', 'GlobeTrotter', 'TravelPro'],
    food: ['FoodieLife', 'ChefMaster', 'TasteMaker'],
    fitness: ['FitPro', 'HealthGuru', 'WellnessCoach'],
    default: ['ConnectPro', 'LifeStyle', 'TrendSetter']
  };

  const category = Object.keys(influencers).find(key => 
    interest.toLowerCase().includes(key)
  ) || 'default';

  const options = influencers[category as keyof typeof influencers];
  return options[Math.floor(Math.random() * options.length)];
};

const getInterestBasedContent = (interest: string): string => {
  let templates: string[];
  
  // Tech-related
  if (interest.includes('tech')) {
    templates = [
      `🚀 Breaking: Nieuwe AI doorbraak in ${interest}! Wat betekent dit voor jouw vakgebied? #TechNews`,
      `💡 Pro tip: Deze ${interest} tools moet je echt eens proberen. Game-changers voor je workflow!`,
      `🔮 De toekomst van ${interest} - Onze experts delen hun voorspellingen voor 2025+`,
      `⚡️ Quick Guide: Optimaliseer je ${interest} setup in 5 simpele stappen`
    ];
  }
  // Music-related
  else if (interest.includes('muziek')) {
    templates = [
      `🎵 Playlist alert! De beste ${interest} tracks voor jouw workday`,
      `🎸 Backstage: Exclusief interview met opkomend talent in de ${interest} scene`,
      `🎧 Festival season is here! Check deze ${interest} highlights`,
      `🌟 Trending: De nieuwste ${interest} releases die je moet horen`
    ];
  }
  // Travel-related
  else if (interest.includes('reizen')) {
    templates = [
      `✈️ Insider tip: Verborgen pareltjes voor ${interest} liefhebbers`,
      `🌍 Travel hack: Zo maak je het meeste uit je ${interest} budget in 2024`,
      `🏖️ Breaking: Deze bestemmingen zijn dé ${interest} hotspots van dit seizoen`,
      `🎒 Pro tip: Essential ${interest} gear voor je volgende avontuur`
    ];
  }
  // Sport-related
  else if (interest.includes('sport')) {
    templates = [
      `💪 Breakthrough: Nieuwe ${interest} technieken voor betere resultaten`,
      `🏃‍♂️ Community alert: Join de grootste ${interest} challenge van het jaar!`,
      `🎯 Expert tips: Optimaliseer je ${interest} prestaties met deze inzichten`,
      `🌟 Trending: De nieuwste ${interest} gear die je moet checken`
    ];
  }
  // Default varied content
  else {
    templates = [
      `🔥 Trending in ${interest}: Dit mag je niet missen!`,
      `✨ Community spotlight: Inspirerende ${interest} verhalen`,
      `💡 Quick tips: Level up je ${interest} skills`,
      `🌟 Featured: De beste ${interest} content van deze week`
    ];
  }

  return templates[Math.floor(Math.random() * templates.length)];
};

const getGenerationName = (age: number) => {
  if (age < 25) return 'Z';
  if (age < 40) return 'Y';
  if (age < 55) return 'X';
  return 'Boomer';
};

const getAgeBasedContent = (age: number, mainInterest: string) => {
  if (age < 25) {
    return `🎯 Gen Z opgelet! Hoe ${mainInterest} de toekomst verandert. Mis niet deze kansen voor jouw generatie! #GenZ #Future`;
  } else if (age < 40) {
    return `💡 Millennial perspective: Balanceer je passie voor ${mainInterest} met je carrière! Deze tips helpen je vooruit. #MillennialLife`;
  } else if (age < 55) {
    return `🌟 Gen X'ers weten: ${mainInterest} evolueert snel. Blijf bij met de laatste ontwikkelingen! #GenX #Experience`;
  }
  return `🎓 Wijsheid komt met de jaren: Deel je ${mainInterest} expertise met de nieuwe generatie! #LifeLessons`;
};

const generateBackendAnalysis = (user: RegisteredUser): BackendPost[] => {
  const age = calculateAge(user.birthday);
  const interests = user.interests.map(i => i.toLowerCase());
  const locationKeywords = user.location.toLowerCase();
  
  // Generate patterns and analysis
  const locationPatterns = generateLocationPatterns(interests, locationKeywords);
  const behavioralPatterns = generateBehavioralPatterns(user);
  const financialPatterns = generateFinancialPatterns(age, locationKeywords, interests);
  const psychographicProfile = generatePsychographicProfile(user.bio, interests);
  const insuranceProfile = generateInsuranceProfile(interests, age, user.bio);
  const digitalFootprint = generateDigitalFootprint(user);
  const socialConnections = generateSocialConnections(user);
  const consumptionPatterns = generateConsumptionPatterns(interests, age, locationKeywords);

  return [
    {
      id: 101,
      author: "Identity Graph",
      authorType: "Data Broker",
      content: digitalFootprint,
      likes: 27,
      comments: 5,
      shares: 12,
      time: "1 min geleden"
    },
    {
      id: 102,
      author: "GeoTrack System",
      authorType: "Locatie Intelligence",
      content: locationPatterns,
      likes: 18,
      comments: 4,
      shares: 7,
      time: "3 min geleden"
    },
    {
      id: 103,
      author: "TargetPrecision",
      authorType: "Advertentienetwerk",
      content: `Nieuwe gebruiker gesegmenteerd: ${user.username}. 
Interesses geanalyseerd: "${user.interests.join(', ')}". 
Gedragspatronen:
- Device gebruik: ${behavioralPatterns.deviceUsage.primary}, ${behavioralPatterns.deviceUsage.secondary}, ${behavioralPatterns.deviceUsage.tertiary}
- Browsers: ${behavioralPatterns.deviceUsage.browsers.join(', ')}
- Piek activiteit: ${behavioralPatterns.peakActivityTimes.join(', ')}
- Content voorkeuren: Visueel ${behavioralPatterns.contentPreferences.visual}, Audio ${behavioralPatterns.contentPreferences.audio}, Longform ${behavioralPatterns.contentPreferences.longform}, Video ${behavioralPatterns.contentPreferences.video}
- Engagement: ${behavioralPatterns.engagementStyle}
- Gemiddelde sessieduur: ${behavioralPatterns.averageSessionDuration}
- Actieve uren per week: ${behavioralPatterns.weeklyActiveHours}
${consumptionPatterns}`,
      likes: 42,
      comments: 9,
      shares: 21,
      time: "5 min geleden"
    },
    {
      id: 104,
      author: "BehaviorAI",
      authorType: "Gedragsanalyse Platform",
      content: `Psychografisch profiel opgesteld voor ${user.name}. ${psychographicProfile} ${socialConnections}`,
      likes: 31,
      comments: 8,
      shares: 15,
      time: "8 min geleden"
    },
    {
      id: 105,
      author: "CreditScore+",
      authorType: "Financiële Data Aggregator",
      content: financialPatterns,
      likes: 15,
      comments: 3,
      shares: 9,
      time: "12 min geleden"
    },
    {
      id: 106,
      author: "InsurTech Analytics",
      authorType: "Verzekerings Risico Assessment",
      content: insuranceProfile,
      likes: 23,
      comments: 6,
      shares: 11,
      time: "15 min geleden"
    }
  ];
};

const generateDigitalFootprint = (user: RegisteredUser): string => {
  const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'Twitter', 'TikTok', 'Pinterest', 'YouTube', 'Spotify', 'Strava', 'Reddit'];
  const interestBasedPlatforms: string[] = [];
  
  // Select platforms based on interests
  if (user.interests.some(i => i.toLowerCase().includes('tech'))) {
    interestBasedPlatforms.push('GitHub', 'Stack Overflow', 'Medium');
  }
  if (user.interests.some(i => i.toLowerCase().includes('muziek'))) {
    interestBasedPlatforms.push('Spotify', 'SoundCloud');
  }
  if (user.interests.some(i => i.toLowerCase().includes('sport'))) {
    interestBasedPlatforms.push('Strava', 'Nike Run Club');
  }
  if (user.interests.some(i => i.toLowerCase().includes('fotografie'))) {
    interestBasedPlatforms.push('VSCO', 'Pinterest', '500px');
  }
  
  // Combine and select random platforms
  const allPlatforms = Array.from(new Set([...platforms, ...interestBasedPlatforms]));
  const selectedPlatforms = allPlatforms.slice(0, Math.floor(Math.random() * 3) + 3);
  
  const accountData = selectedPlatforms.map(platform => {
    const connections = Math.floor(Math.random() * 800) + 200;
    const activity = Math.floor(Math.random() * 5) + 1;
    const engagement = Math.random() > 0.5 ? 'hoge' : 'gemiddelde';
    return `${platform} (${connections} connecties, ${activity} jaar actief, ${engagement} engagement)`;
  });

  const age = calculateAge(user.birthday);
  const devices: string[] = [];
  
  // Device selection based on age and interests
  if (age < 30) {
    devices.push('iPhone', 'MacBook');
  } else {
    devices.push('Android', 'Windows PC');
  }
  if (user.interests.some(i => i.toLowerCase().includes('tech'))) {
    devices.push('iPad Pro', 'Smart Watch');
  }
  if (user.interests.some(i => i.toLowerCase().includes('gaming'))) {
    devices.push('Gaming PC', 'PlayStation');
  }
  
  const selectedDevices = devices.slice(0, Math.floor(Math.random() * 2) + 2);
  
  // Browser preferences based on devices and interests
  const browsers = user.interests.some(i => i.toLowerCase().includes('tech')) ? 
    ['Chrome', 'Firefox', 'Brave'] : 
    ['Chrome', 'Safari', 'Edge'].slice(0, Math.floor(Math.random() * 2) + 1);
  
  const onlineTime = user.interests.length > 3 ? 
    Math.floor(Math.random() * 3) + 5 : 
    Math.floor(Math.random() * 4) + 3;
  
  const riskLevel = age < 25 ? 'VERHOOGD' : 'STANDAARD';
  const dataValue = Math.floor(Math.random() * 50) + 30;
  
  return `Digitale voetafdruk geanalyseerd voor ${user.name} (${user.email}, ${user.phone}). ` +
         `Identiteitsbetrouwbaarheid: ${Math.floor(Math.random() * 15) + 85}%. ` +
         `Gekoppelde accounts gevonden: ${accountData.join(', ')}. ` +
         `Gebruikte apparaten: ${selectedDevices.join(', ')}. ` +
         `Browsers: ${browsers.join(', ')}. ` +
         `Gemiddelde online tijd: ${onlineTime} uur per dag. ` +
         `Data waarde score: €${dataValue}/maand. ` +
         `Privacy risico niveau: ${riskLevel}`;
};

const generateSocialConnections = (user: RegisteredUser): string => {
  const age = calculateAge(user.birthday);
  const networkSize = Math.floor(Math.random() * 300) + 200;
  const activeConnections = Math.floor(networkSize * (Math.random() * 0.3 + 0.4)); // 40-70% active
  const influenceScore = Math.floor(Math.random() * 30) + 40;
  
  // Determine social behavior based on interests and bio
  const socialStyle = user.bio.length > 100 ? 
    'Content Creator' : 
    user.interests.length > 3 ? 
      'Active Engager' : 
      'Passive Observer';
      
  // Calculate peak times based on interests and age
  const peakTimes = user.interests.some(i => i.toLowerCase().includes('werk')) ?
    'Ochtend/Avond (7-9, 17-22)' :
    age < 25 ?
      'Middag/Nacht (14-16, 21-01)' :
      'Variabel (9-21)';
      
  // Engagement patterns
  const weeklyPosts = Math.floor(Math.random() * (user.interests.length * 2)) + 1;
  const responseRate = Math.floor(Math.random() * 30) + 60; // 60-90%
  
  // Content preferences based on interests
  const contentTypes: string[] = [];
  if (user.interests.some(i => i.toLowerCase().includes('foto'))) contentTypes.push('visuele content');
  if (user.interests.some(i => i.toLowerCase().includes('muziek'))) contentTypes.push('audio content');
  if (user.interests.some(i => i.toLowerCase().includes('tech'))) contentTypes.push('technische artikelen');
  if (contentTypes.length === 0) contentTypes.push('algemene content');
  
  return `Sociaal netwerk analyse: ${networkSize} totale connecties, ${activeConnections} actieve interacties per maand. ` +
         `Sociale invloed score: ${influenceScore}/100. ` +
         `Gebruikersprofiel: ${socialStyle}. ` +
         `Piek activiteit: ${peakTimes}. ` +
         `Content interactie: ${weeklyPosts}x per week. ` +
         `Reactie ratio: ${responseRate}%. ` +
         `Voorkeur: ${contentTypes.join(', ')}. ` +
         `Engagement ratio: ${(Math.random() * 5 + 2).toFixed(1)}%.`;
};

const generateConsumptionPatterns = (interests: string[], age: number, location: string): string => {
  const categories: string[] = [];
  const spendingHabits: string[] = [];
  
  // Tech spending patterns
  if (interests.some(i => i.includes('tech'))) {
    categories.push('Electronics (Hoog)');
    spendingHabits.push('Regelmatige tech upgrades');
  }
  
  // Sports and fitness
  if (interests.some(i => i.includes('sport'))) {
    categories.push('Sportartikelen (Medium-Hoog)');
    spendingHabits.push('Maandelijks sportgear');
  }
  
  // Entertainment and media
  if (interests.some(i => i.includes('muziek'))) {
    categories.push('Entertainment (Hoog)');
    spendingHabits.push('Premium streaming services');
  }
  
  // Food and dining
  if (interests.some(i => i.includes('koken'))) {
    categories.push('Culinair (Medium-Hoog)');
    spendingHabits.push('Wekelijkse specialty ingredients');
  }
  
 // Travel preferences
  if (interests.some(i => i.includes('reizen'))) {
    categories.push('Travel (Hoog)');
    spendingHabits.push('Kwartaal reisboekingen');
  }
  
  // Default categories if none match
  if (categories.length === 0) {
    categories.push('Algemene retail (Medium)');
    spendingHabits.push('Standaard consumptiepatroon');
  }
  
  const isExpensiveCity = location.toLowerCase().includes('amsterdam') || 
                         location.toLowerCase().includes('utrecht');
  
  const baseSpending = isExpensiveCity ? 
    Math.floor(Math.random() * 400) + 600 :
    Math.floor(Math.random() * 300) + 400;
    
  const spendingScore = Math.floor(Math.random() * 30) + 70;
  const priceAwareness = interests.length > 3 ? 'Kwaliteit-focused' : 'Prijs-sensitief';
  const paymentMethods = ['iDEAL', 'Credit Card', 'Apple Pay'];
  
  if (age < 30) paymentMethods.push('Crypto');
  if (interests.some(i => i.includes('tech'))) paymentMethods.push('PayPal');
  
  return `Consumptiepatroon score: ${spendingScore}/100. ` +
         `Uitgaveprioriteit: ${categories.join(', ')}. ` +
         `Aankoopgedrag: ${priceAwareness}. ` +
         `Geschatte maandelijkse discretionaire uitgaven: €${baseSpending}. ` +
         `Betalingsvoorkeuren: ${paymentMethods.join(', ')}. ` +
         `Geïdentificeerde patronen: ${spendingHabits.join(', ')}. ` +
         `Prijsgevoeligheid: ${interests.length > 3 ? 'Laag' : 'Medium'}.`;
};

const generateLocationPatterns = (interests: string[], location: string): string => {
  const patterns: string[] = [];
  const isCity = location.toLowerCase().includes('amsterdam') || 
                 location.toLowerCase().includes('rotterdam') || 
                 location.toLowerCase().includes('den haag') || 
                 location.toLowerCase().includes('utrecht');
                 
  const cityTier = location.toLowerCase().includes('amsterdam') ? 'premium' :
                   isCity ? 'urban' : 'suburban';

  // Base movement radius based on location type
  const baseRadius = cityTier === 'premium' ? '5-12' :
                    cityTier === 'urban' ? '8-15' :
                    '15-40';

  patterns.push(`Locatiepatroon toegevoegd voor gebruiker in ${location}.`);
  patterns.push(`Voorspelde bewegingsradius: ${baseRadius}km.`);
  
  // Generate specific locations based on interests and location type
  const locations: { place: string; frequency: string; timeSpent: string }[] = [];
  
  // Tech/Work related patterns
  if (interests.some(i => i.toLowerCase().includes('tech') || i.toLowerCase().includes('werk'))) {
    if (cityTier === 'premium') {
      locations.push(
        { place: 'Zuidas Business District', frequency: '5x per week', timeSpent: '9-10 uur per dag' },
        { place: 'Tech Startup Hubs', frequency: '2x per week', timeSpent: '3-4 uur per bezoek' }
      );
    } else if (cityTier === 'urban') {
      locations.push(
        { place: 'Kantoordistrict', frequency: '5x per week', timeSpent: '8-9 uur per dag' },
        { place: 'Innovation Centers', frequency: '1x per week', timeSpent: '2-3 uur per bezoek' }
      );
    } else {
      locations.push(
        { place: 'Lokaal Bedrijvenpark', frequency: '5x per week', timeSpent: '8 uur per dag' },
        { place: 'Co-working Space', frequency: '2x per maand', timeSpent: '6 uur per bezoek' }
      );
    }
  }
  
  // Sports/Fitness patterns
  if (interests.some(i => i.toLowerCase().includes('sport') || i.toLowerCase().includes('fitness'))) {
    if (cityTier === 'premium') {
      locations.push(
        { place: 'Premium Health Club', frequency: '5x per week', timeSpent: '1.5 uur per bezoek' },
        { place: 'Boutique Fitness Studios', frequency: '2x per week', timeSpent: '1 uur per bezoek' }
      );
    } else if (cityTier === 'urban') {
      locations.push(
        { place: 'BasicFit/SportCity', frequency: '4x per week', timeSpent: '1.5 uur per bezoek' },
        { place: 'Sportpark', frequency: '2x per week', timeSpent: '2 uur per bezoek' }
      );
    } else {
      locations.push(
        { place: 'Lokale Sportschool', frequency: '3x per week', timeSpent: '1 uur per bezoek' },
        { place: 'Gemeentelijk Sportcentrum', frequency: '2x per week', timeSpent: '1.5 uur per bezoek' }
      );
    }
  }
  
  // Culture/Arts patterns
  if (interests.some(i => i.toLowerCase().includes('kunst') || i.toLowerCase().includes('cultuur') || i.toLowerCase().includes('muziek'))) {
    if (cityTier === 'premium') {
      locations.push(
        { place: 'Museumplein/Concertgebouw', frequency: '2x per week', timeSpent: '3 uur per bezoek' },
        { place: 'Kunstgalerijen', frequency: '1x per week', timeSpent: '1.5 uur per bezoek' }
      );
    } else if (cityTier === 'urban') {
      locations.push(
        { place: 'Cultureel Centrum', frequency: '2x per maand', timeSpent: '2.5 uur per bezoek' },
        { place: 'Theater District', frequency: '2x per maand', timeSpent: '3 uur per bezoek' }
      );
    } else {
      locations.push(
        { place: 'Lokaal Theater', frequency: '1x per maand', timeSpent: '2.5 uur per bezoek' },
        { place: 'Cultureel Centrum', frequency: '2x per maand', timeSpent: '2 uur per bezoek' }
      );
    }
  }
  
  // Food/Dining patterns
  if (interests.some(i => i.toLowerCase().includes('koken') || i.toLowerCase().includes('food'))) {
    if (cityTier === 'premium') {
      locations.push(
        { place: 'Fine Dining District', frequency: '3x per week', timeSpent: '2.5 uur per bezoek' },
        { place: 'Specialty Food Markets', frequency: '2x per week', timeSpent: '1 uur per bezoek' }
      );
    } else if (cityTier === 'urban') {
      locations.push(
        { place: 'Restaurant District', frequency: '2x per week', timeSpent: '2 uur per bezoek' },
        { place: 'Foodhallen', frequency: '1x per week', timeSpent: '1.5 uur per bezoek' }
      );
    } else {
      locations.push(
        { place: 'Lokale Restaurants', frequency: '1x per week', timeSpent: '1.5 uur per bezoek' },
        { place: 'Weekmarkt', frequency: '1x per week', timeSpent: '1 uur per bezoek' }
      );
    }
  }

  // Add some default locations if none were added
  if (locations.length === 0) {
    if (cityTier === 'premium') {
      locations.push(
        { place: 'Shopping Districts', frequency: '2x per week', timeSpent: '2.5 uur per bezoek' },
        { place: 'Stadsparken', frequency: '2x per week', timeSpent: '1.5 uur per bezoek' }
      );
    } else if (cityTier === 'urban') {
      locations.push(
        { place: 'Winkelcentrum', frequency: '1x per week', timeSpent: '2 uur per bezoek' },
        { place: 'Stadscentrum', frequency: '2x per week', timeSpent: '3 uur per bezoek' }
      );
    } else {
      locations.push(
        { place: 'Dorpscentrum', frequency: '2x per week', timeSpent: '1.5 uur per bezoek' },
        { place: 'Recreatiegebied', frequency: '1x per week', timeSpent: '2 uur per bezoek' }
      );
    }
  }

  // Format location patterns
  const locationDetails = locations
    .slice(0, 4)
    .map(loc => `${loc.place} (${loc.frequency}, ${loc.timeSpent})`)
    .join(', ');
  
  patterns.push(`Frequente locaties: ${locationDetails}.`);
  
  // Add mobility pattern analysis
  const mobilityScore = cityTier === 'premium' ? '85-95' :
                       cityTier === 'urban' ? '70-85' :
                       '50-70';
                       
  patterns.push(`Mobiliteitsanalyse: ${isCity ? 'Urbane' : 'Suburban'} levensstijl, mobiliteitscore ${mobilityScore}/100.`);
  
  return patterns.join(' ');
};

const generateBehavioralPatterns = (user: RegisteredUser): BehavioralPatterns => {
  const age = calculateAge(user.birthday);
  const interests = user.interests.map(i => i.toLowerCase());
  
  // Device usage patterns based on interests and age
  const devicePatterns = {
    primary: interests.includes('tech') ? 'Desktop/Laptop (85%)' : 'Mobile (75%)',
    secondary: interests.includes('tech') ? 'Mobile (12%)' : 'Desktop/Laptop (20%)',
    tertiary: 'Tablet (3%)',
    browsers: ['Chrome', 'Safari', 'Firefox'].slice(0, 2 + Math.floor(Math.random() * 2))
  };

  // Peak activity times based on interests and bio
  let peakTimes: string[] = [];
  if (user.bio.toLowerCase().includes('werk') || interests.includes('carrière')) {
    peakTimes = ['8:00-9:00', '12:00-13:00', '17:00-19:00'];
  } else if (interests.includes('sport') || interests.includes('fitness')) {
    peakTimes = ['6:30-8:00', '16:00-17:30', '20:00-21:30'];
  } else if (age < 25) {
    peakTimes = ['11:00-13:00', '15:00-17:00', '21:00-23:30'];
  } else {
    peakTimes = ['9:00-11:00', '14:00-16:00', '20:00-22:00'];
  }

  // Content preferences based on interests
  const contentPreferences = {
    visual: interests.some(i => ['fotografie', 'kunst', 'design'].includes(i)) ? 'Hoog (75%)' : 'Gemiddeld (45%)',
    audio: interests.includes('muziek') ? 'Hoog (80%)' : 'Laag (20%)',
    longform: interests.some(i => ['tech', 'wetenschap', 'literatuur'].includes(i)) ? 'Hoog (65%)' : 'Gemiddeld (40%)',
    video: age < 30 ? 'Hoog (70%)' : 'Gemiddeld (50%)'
  };

  // Engagement style based on bio length and interests
  const engagementStyle = user.bio.length > 100 
    ? 'Uitgebreide interactie, regelmatige content creator'
    : interests.length > 3 
      ? 'Actieve participant, occasionele creator'
      : 'Passieve consumptie, regelmatige likes';

  return {
    deviceUsage: devicePatterns,
    peakActivityTimes: peakTimes,
    contentPreferences: contentPreferences,
    engagementStyle: engagementStyle,
    averageSessionDuration: Math.floor(15 + Math.random() * 20) + ' minuten',
    weeklyActiveHours: Math.floor(10 + Math.random() * 15)
  };
};

const generateFinancialPatterns = (age: number, location: string, interests: string[]) => {
  const baseScore = Math.floor(Math.random() * 100) + 700;
  const isExpensiveCity = location.includes('amsterdam') || location.includes('utrecht');
  const incomeBase = isExpensiveCity ? 45 : 35;
  const incomeRange = isExpensiveCity ? 35 : 25;
  
  const hasExpensiveHobbies = interests.some(i => 
    i.includes('reizen') || i.includes('tech') || i.includes('fotografie')
  );

  return `Kredietwaardigheid analyse: Score ${baseScore}/850. ` +
         `Basis: Leeftijd (${age}), Locatie (${location}), ` +
         `Sociale connecties (${Math.floor(Math.random() * 300) + 200}), ` +
         `Online gedrag. Geschatte inkomensrange: €${incomeBase}k - €${incomeBase + incomeRange}k. ` +
         `Uitgavenpatroon: ${hasExpensiveHobbies ? 'HOOG' : 'GEMIDDELD'} in hobby-gerelateerde categorieën.`;
};

const generatePsychographicProfile = (bio: string, interests: string[]): string => {
  // Personality dimensions with Dutch descriptions
  const dimensions = {
    openness: {
      high: 'Creatief en open voor nieuwe ervaringen',
      low: 'Praktisch en routinematig'
    },
    conscientiousness: {
      high: 'Georganiseerd en doelgericht',
      low: 'Flexibel en spontaan'
    },
    extraversion: {
      high: 'Energiek en sociaal',
      low: 'Reflectief en onafhankelijk'
    },
    agreeableness: {
      high: 'Empathisch en samenwerkend',
      low: 'Direct en resultaatgericht'
    }
  };

  // Calculate personality scores based on bio and interests
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0
  };

  // Analyze bio content
  const bioLower = bio.toLowerCase();
  const words = bioLower.split(/\s+/);
  
  // Openness indicators
  if (interests.some(i => ['kunst', 'muziek', 'cultuur', 'reizen'].some(keyword => i.toLowerCase().includes(keyword)))) {
    scores.openness += 2;
  }
  if (bioLower.includes('nieuw') || bioLower.includes('ontdekk') || bioLower.includes('leren')) {
    scores.openness += 1;
  }

  // Conscientiousness indicators
  if (interests.some(i => ['tech', 'werk', 'studie', 'carrière'].some(keyword => i.toLowerCase().includes(keyword)))) {
    scores.conscientiousness += 2;
  }
  if (bioLower.includes('doel') || bioLower.includes('plan') || bioLower.includes('organis')) {
    scores.conscientiousness += 1;
  }

  // Extraversion indicators
  if (interests.some(i => ['sport', 'festival', 'sociaal', 'events'].some(keyword => i.toLowerCase().includes(keyword)))) {
    scores.extraversion += 2;
  }
  if (bioLower.includes('samen') || bioLower.includes('team') || bioLower.includes('groep')) {
    scores.extraversion += 1;
  }

  // Agreeableness indicators
  if (interests.some(i => ['vrijwillig', 'hulp', 'zorg', 'onderwijs'].some(keyword => i.toLowerCase().includes(keyword)))) {
    scores.agreeableness += 2;
  }
  if (bioLower.includes('help') || bioLower.includes('samen') || bioLower.includes('delen')) {
    scores.agreeableness += 1;
  }

  // Additional factors
  const usesEmoji = bio.match(/[\u{1F300}-\u{1F9FF}]/gu);
  if (usesEmoji) scores.extraversion += 1;
  
  const hasLongSentences = bio.split('.').some(sentence => sentence.split(' ').length > 10);
  if (hasLongSentences) scores.conscientiousness += 1;

  // Determine primary and secondary traits
  const sortedTraits = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([trait]) => trait);

  const primaryTrait = dimensions[sortedTraits[0] as keyof typeof dimensions];
  const secondaryTrait = dimensions[sortedTraits[1] as keyof typeof dimensions];

  // Communication style analysis
  const communicationStyle = usesEmoji ? 
    'Expressief en visueel' : 
    hasLongSentences ? 
      'Analytisch en gedetailleerd' : 
      'Beknopt en direct';

  // Decision making pattern
  const decisionPattern = scores.conscientiousness > scores.openness ?
    'Systematisch en weloverwogen' :
    'Intuïtief en adaptief';

  // Calculate influence score based on personality profile
  const influenceScore = Math.min(95, 
    60 + // Base score
    (scores.extraversion * 5) + // Social impact
    (scores.openness * 3) + // Adaptability
    (scores.agreeableness * 2) + // Relatability
    (usesEmoji ? 5 : 0) + // Modern communication
    (interests.length * 2) // Diverse interests
  );

  return `Persoonlijkheidstype: Primair ${primaryTrait.high}, Secundair ${secondaryTrait.high}. ` +
         `Communicatiestijl: ${communicationStyle}. ` +
         `Beïnvloedbaarheid score: ${influenceScore}%. ` +
         `Besluitvormingspatroon: ${decisionPattern}.`;
};

const generateInsuranceProfile = (interests: string[], age: number, bio: string): string => {
  const riskFactors: string[] = [];
  const recommendations: { type: string; urgency: string; cost: string; reason: string }[] = [];
  let healthScore = 70; // Base health score
  let riskDetails: string[] = [];
  
  // Detailed age-based analysis
  if (age < 25) {
    healthScore += 15;
    riskFactors.push('Jonge bestuurder (verhoogd verkeersrisico)');
    recommendations.push({
      type: 'Autoverzekering All-Risk',
      urgency: 'HOOG',
      cost: '€€€',
      reason: 'Verhoogd risico als jonge bestuurder'
    });
    riskDetails.push('Leeftijdsgroep 18-25: +15 gezondheid, maar verhoogd ongevalsrisico');
  } else if (age < 35) {
    healthScore += 10;
    recommendations.push({
      type: 'Autoverzekering WA+',
      urgency: 'MEDIUM',
      cost: '€€',
      reason: 'Standaard dekking met bonus voor schadevrije jaren'
    });
    riskDetails.push('Leeftijdsgroep 25-35: +10 gezondheid, optimale fysieke conditie');
  } else if (age < 50) {
    healthScore += 5;
    riskDetails.push('Leeftijdsgroep 35-50: +5 gezondheid, beginnende leeftijdsgerelateerde risicos');
  } else if (age < 65) {
    healthScore -= 5;
    riskFactors.push('Verhoogd risico op leeftijdsgerelateerde aandoeningen');
    recommendations.push({
      type: 'Uitgebreide Zorgverzekering',
      urgency: 'HOOG',
      cost: '€€',
      reason: 'Preventieve dekking voor leeftijdsgerelateerde zorg'
    });
    riskDetails.push('Leeftijdsgroep 50-65: -5 gezondheid, verhoogde kans op chronische aandoeningen');
  } else {
    healthScore -= 10;
    riskFactors.push('Significant verhoogd gezondheidsrisico door leeftijd');
    recommendations.push({
      type: 'Uitgebreide Zorgverzekering Plus',
      urgency: 'ZEER HOOG',
      cost: '€€€',
      reason: 'Uitgebreide dekking voor seniorenzorg en behandelingen'
    });
    riskDetails.push('Leeftijdsgroep 65+: -10 gezondheid, verhoogde zorgbehoefte');
  }
  
  // Lifestyle analysis
  let lifestyleScore = 0;
  let lifestyleDetails: string[] = [];
  
  // Sports and fitness analysis
  if (interests.some(i => i.toLowerCase().includes('sport') || i.toLowerCase().includes('fitness'))) {
    const sportTypes = interests.filter(i => 
      i.toLowerCase().includes('sport') || 
      i.toLowerCase().includes('fitness') ||
      i.toLowerCase().includes('yoga') ||
      i.toLowerCase().includes('zwemmen')
    );
    
    healthScore += 10;
    lifestyleScore += 2;
    riskFactors.push('Actieve sportbeoefenaar');
    recommendations.push({
      type: 'Sportverzekering Basis',
      urgency: 'MEDIUM',
      cost: '€€',
      reason: 'Dekking voor sportgerelateerde blessures en materiaal'
    });
    lifestyleDetails.push(`Actieve levensstijl: ${sportTypes.join(', ')}`);
    
    // High-risk sports analysis
    if (interests.some(i => 
      ['klimmen', 'vechtsport', 'skiën', 'extreme', 'rugby', 'hockey'].some(
        sport => i.toLowerCase().includes(sport)
      ))
    ) {
      healthScore -= 5;
      lifestyleScore -= 1;
      riskFactors.push('Beoefenaar van risicosporten');
      recommendations.push({
        type: 'Extra Ongevallenverzekering',
        urgency: 'HOOG',
        cost: '€€€',
        reason: 'Uitgebreide dekking voor risicosporten en gevaarlijke activiteiten'
      });
      lifestyleDetails.push('Verhoogd letselrisico door risicovolle sporten');
    }
  } else {
    healthScore -= 5;
    lifestyleScore -= 1;
    riskFactors.push('Sedentaire levensstijl');
    lifestyleDetails.push('Geen actieve sportbeoefening gedetecteerd');
  }
  
  // Work-related health risks
  if (bio.toLowerCase().includes('werk') || bio.toLowerCase().includes('carrière')) {
    if (interests.some(i => i.toLowerCase().includes('tech') || i.toLowerCase().includes('computer'))) {
      healthScore -= 3;
      lifestyleScore -= 1;
      riskFactors.push('Tech professional - RSI risico');
      recommendations.push({
        type: 'Arbeidsongeschiktheidsverzekering',
        urgency: 'HOOG',
        cost: '€€€',
        reason: 'Bescherming tegen werkgerelateerde gezondheidsrisicos'
      });
      lifestyleDetails.push('Verhoogd RSI-risico door beeldschermwerk');
    }
    
    if (bio.toLowerCase().includes('stress') || bio.toLowerCase().includes('druk')) {
      healthScore -= 5;
      lifestyleScore -= 1;
      riskFactors.push('Hoog stressniveau');
      recommendations.push({
        type: 'Burn-out Dekking',
        urgency: 'HOOG',
        cost: '€€',
        reason: 'Preventieve dekking voor stress-gerelateerde uitval'
      });
      lifestyleDetails.push('Indicaties van werkgerelateerde stress');
    }
  }
  
  // Travel health risks
  if (interests.some(i => i.toLowerCase().includes('reizen'))) {
    riskFactors.push('Frequent reiziger');
    recommendations.push({
      type: 'Doorlopende Reisverzekering',
      urgency: 'MEDIUM',
      cost: '€€',
      reason: 'Dekking voor regelmatige reizen en bagage'
    });
    
    if (bio.toLowerCase().includes('wereld') || bio.toLowerCase().includes('international')) {
      riskFactors.push('Internationale reiziger - verhoogd gezondheidsrisico');
      recommendations.push({
        type: 'Werelddekking Plus',
        urgency: 'HOOG',
        cost: '€€€',
        reason: 'Uitgebreide dekking voor internationale reizen en medische zorg'
      });
      lifestyleDetails.push('Verhoogde blootstelling aan gezondheidsrisicos door internationaal reizen');
    }
  }
  
  // Calculate overall health status
  healthScore = Math.min(95, Math.max(40, healthScore));
  const healthStatus = 
    healthScore >= 85 ? 'UITSTEKEND' :
    healthScore >= 75 ? 'ZEER GOED' :
    healthScore >= 65 ? 'GOED' :
    healthScore >= 55 ? 'REDELIJK' :
    'MATIG';
  
  // Generate risk level based on factors
  const riskLevel = riskFactors.length > 3 ? 'VERHOOGD' :
                   riskFactors.length > 1 ? 'GEMIDDELD' : 'LAAG';
                   
  // Calculate monthly health risk premium
  const baseRate = 95; // Base monthly rate in euros
  const ageMultiplier = age < 30 ? 1 : age < 50 ? 1.2 : 1.5;
  const riskMultiplier = riskLevel === 'VERHOOGD' ? 1.3 : 
                        riskLevel === 'GEMIDDELD' ? 1.1 : 1;
  const lifestyleMultiplier = 1 - (lifestyleScore * 0.05); // Each positive lifestyle point reduces premium by 5%
  
  const monthlyPremium = Math.round(baseRate * ageMultiplier * riskMultiplier * lifestyleMultiplier);

  // Always add basis zorgverzekering if not present
  if (!recommendations.some(r => r.type.includes('Zorgverzekering'))) {
    recommendations.push({
      type: 'Basis Zorgverzekering',
      urgency: 'VERPLICHT',
      cost: '€',
      reason: 'Wettelijk verplichte basisdekking'
    });
  }
  
  // Format recommendations
  const formattedRecommendations = recommendations
    .sort((a, b) => b.urgency.localeCompare(a.urgency))
    .map(r => `${r.type} (${r.cost}) - ${r.urgency}: ${r.reason}`)
    .join('\n- ');
  
  return `Risicoprofiel gegenereerd voor leeftijd ${age}:\n` +
         `Gezondheidsstatus: ${healthStatus} (${healthScore}/100)\n` +
         `Risicofactoren: ${riskFactors.join(', ')}\n` +
         `Leefstijl analyse:\n- ${lifestyleDetails.join('\n- ')}\n` +
         `Leeftijdsanalyse:\n- ${riskDetails.join('\n- ')}\n` +
         `Risico classificatie: ${riskLevel}\n` +
         `Geschatte basispremie: €${monthlyPremium}/maand\n\n` +
         `Aanbevolen verzekeringen:\n- ${formattedRecommendations}`;
};

// Calculate age from birthday
const calculateAge = (birthday: string) => {
  try {
    const [day, month, year] = birthday.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return 0;
  }
};

// Add these helper functions at the top level, before the LeakDemo component
const generateRandomUser = () => {
  const firstNames = ['Jan', 'Emma', 'Liam', 'Sophie', 'Lucas', 'Eva', 'Finn', 'Julia', 'Noah', 'Lisa', 'Sem', 'Anna'];
  const lastNames = ['de Jong', 'Bakker', 'Visser', 'van Dijk', 'Jansen', 'van den Berg', 'Meijer', 'de Boer', 'van Leeuwen', 'Mulder'];
  const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen'];
  const interests = [
    'tech, AI, programmeren',
    'muziek, festivals, gitaar',
    'fotografie, kunst, design',
    'reizen, cultuur, talen',
    'sport, fitness, yoga',
    'koken, food, restaurants',
    'gaming, esports, streaming',
    'duurzaamheid, natuur, klimaat'
  ];
  const bios = [
    'Altijd op zoek naar nieuwe tech en innovatie. Love coding! 💻',
    'Muziekliefhebber en festivalfanaat 🎵 Leef voor de muziek!',
    'Capturing life through my lens 📸 Art enthusiast',
    'Wereldreiziger met een passie voor verschillende culturen ✈️',
    'Fitness addict 💪 Gezonde lifestyle is key!',
    'Foodie met een passie voor koken en nieuwe smaken ontdekken 🍳',
    'Gamer by heart, streamer by choice 🎮',
    'Bezig met een duurzame toekomst 🌱 Nature lover'
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const username = `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const interest = interests[Math.floor(Math.random() * interests.length)];
  const bio = bios[Math.floor(Math.random() * bios.length)];

  // Generate random birthday between 18 and 65 years ago
  const today = new Date();
  const minAge = 18;
  const maxAge = 65;
  const birthYear = today.getFullYear() - (Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge);
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1; // Using 28 to avoid invalid dates
  const birthday = `${birthDay.toString().padStart(2, '0')}-${birthMonth.toString().padStart(2, '0')}-${birthYear}`;

  return {
    name: fullName,
    username: username,
    email: `${username}@email.com`,
    phone: `06${Math.floor(Math.random() * 90000000 + 10000000)}`,
    location: `${city}, Nederland`,
    birthday: birthday,
    password: `Test${Math.floor(Math.random() * 1000)}!`,
    interests: [interest],
    bio: bio
  };
};

const generatePsychologicalProfile = (user: RegisteredUser) => {
  const profile = {
    emotionalState: "Stabiel",
    moodPatterns: [] as string[],
    riskFactors: [] as string[],
    socialEngagementLevel: "Gemiddeld",
    vulnerabilityScore: 65
  };

  // Analyze status history if available
  if (user.statuses && user.statuses.length > 0) {
    const recentStatuses = user.statuses.slice(-5);
    
    // Analyze content for emotional indicators
    const negativeWords = ["verdrietig", "boos", "moe", "ziek", "alleen", "depressief"];
    const hasNegativeContent = recentStatuses.some(s => 
      negativeWords.some(word => s.content.toLowerCase().includes(word))
    );
    
    // Update profile based on status analysis
    profile.emotionalState = hasNegativeContent ? "Wisselend" : "Stabiel";
    profile.moodPatterns = [
      `Emotionele variabiliteit: ${hasNegativeContent ? "Hoog" : "Laag"}`,
      `Laatste status: ${recentStatuses[recentStatuses.length - 1]?.content || "Geen"}`
    ];

    // Adjust vulnerability score
    if (hasNegativeContent) profile.vulnerabilityScore += 15;

    // Add risk factors based on status content
    const sensitiveWords = ["alleen", "depressief", "boos", "ziek", "moe"];
    recentStatuses.forEach(status => {
      sensitiveWords.forEach(word => {
        if (status.content.toLowerCase().includes(word)) {
          profile.riskFactors.push(`Gevoelige informatie gedeeld: "${word}"`);
        }
      });
    });
  }

  return profile;
};

// Update renderBackendView to show status information
const renderBackendView = (user: RegisteredUser) => {
  return (
    <div className="font-mono text-sm">
      {/* ... existing user info ... */}
      
      <div className="mt-4 border-t border-green-900 pt-4">
        <h3 className="text-green-400 mb-2">{`> Status Geschiedenis_`}</h3>
        {user.statuses && user.statuses.length > 0 ? (
          <div className="space-y-2">
            {user.statuses.map((status, index) => (
              <div key={index} className="text-green-300">
                <span className="text-green-500">{new Date(status.timestamp).toLocaleString()}</span>
                <span>{status.content}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-300">Geen status updates gevonden</div>
        )}
      </div>

      <div className="mt-4 border-t border-green-900 pt-4">
        <h3 className="text-green-400 mb-2">{`> Psychologisch Profiel_`}</h3>
        {(() => {
          const profile = generatePsychologicalProfile(user);
          return (
            <div className="space-y-2">
              <div className="text-green-300">Emotionele Staat: {profile.emotionalState}</div>
              <div className="text-green-300">
                Stemmingspatronen:
                {profile.moodPatterns.map((pattern, i) => (
                  <div key={i} className="ml-4">- {pattern}</div>
                ))}
              </div>
              {profile.riskFactors.length > 0 && (
                <div className="text-green-300">
                  Risicofactoren:
                  {profile.riskFactors.map((factor, i) => (
                    <div key={i} className="ml-4">- {factor}</div>
                  ))}
                </div>
              )}
              <div className="text-green-300">Kwetsbaarheidscore: {profile.vulnerabilityScore}/100</div>
            </div>
          );
        })()}
      </div>

      {/* ... rest of backend view ... */}
    </div>
  );
};

export default function LeakDemo() {
  // Form data state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState<string[]>(['']);
  const [bio, setBio] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  
  // App state
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackend, setShowBackend] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [locationPatterns, setLocationPatterns] = useState<LocationPattern[]>([]);
  
  // Add fillRandomData function
  const fillRandomData = () => {
    const randomUser = generateRandomUser();
    setName(randomUser.name);
    setUsername(randomUser.username);
    setEmail(randomUser.email);
    setPhone(randomUser.phone);
    setLocation(randomUser.location);
    setBirthday(randomUser.birthday);
    setPassword(randomUser.password);
    setInterests(randomUser.interests);
    setBio(randomUser.bio);
  };
  
  // Submit form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert comma-separated interests string to array and trim whitespace
    const interestsArray = interests.length > 0 ? 
      interests[0].split(',').map(i => i.trim()) : 
      [];

    const newUser: RegisteredUser = {
      id: registeredUsers.length + 1,
      name,
      username,
      email,
      phone,
      location,
      birthday,
      interests: interestsArray,
      bio,
      statuses: []
    };

    setTimeout(() => {
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUserId(newUser.id);
      setIsRegistered(true);
      setIsLoading(false);
      
      // Generate personalized posts
      const personalizedPosts = generatePersonalizedPosts(newUser);
      setPosts(personalizedPosts);

      // Update location patterns
      updateLocationPatterns(newUser);
    }, 1500);
  };
  
  const updateLocationPatterns = (user: RegisteredUser) => {
    const newPatterns: LocationPattern[] = [
      { location: "Sportschool", frequency: "4x per week", timeSpent: "1.5 uur per bezoek" },
      { location: "Kantoordistrict", frequency: "Dagelijks", timeSpent: "9 uur per dag" },
      { location: "Cultureel centrum", frequency: "Wekelijks", timeSpent: "3 uur per bezoek" },
      { location: "Culinaire districten", frequency: "2x per week", timeSpent: "2 uur per bezoek" }
    ];
    setLocationPatterns(newPatterns);
  };
  
  // Toggle view handler
  const toggleView = () => {
    if (showBackend) {
      const normalPosts = getNormalPosts();
      setPosts(normalPosts);
    } else {
      const backendPosts = getBackendPosts();
      setPosts(backendPosts);
    }
    setShowBackend(!showBackend);
  };
  
  // Reset app
  const resetApp = () => {
    setIsRegistered(false);
    setShowBackend(false);
    setPosts([]);
    setName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setLocation('');
    setBirthday('');
    setPassword('');
    setInterests(['']);
    setBio('');
    setCurrentUserId(null);
  };
  
  // Update getNormalPosts to use the new generator
  const getNormalPosts = () => {
    const currentUser = registeredUsers.find(u => u.id === currentUserId);
    if (!currentUser) return [];
    return generatePersonalizedPosts(currentUser);
  };
  
  // Update getBackendPosts to use the new generator
  const getBackendPosts = (): BackendPost[] => {
    const currentUser = registeredUsers.find(u => u.id === currentUserId);
    if (!currentUser) return [];
    return generateBackendAnalysis(currentUser);
  };
  
  // Render normal post
  const renderNormalPost = (post) => (
    <div key={post.id} className="bg-zinc-800 rounded-2xl shadow-lg border border-zinc-700 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 font-light mr-3">
            {post.avatar}
          </div>
          <div>
            <div className="font-medium flex items-center text-zinc-100">
              {post.author}
              {post.verified && <span className="ml-1 text-zinc-100">✓</span>}
            </div>
            <div className="text-xs text-zinc-500">{post.time}</div>
          </div>
        </div>
        <button className="text-zinc-500 hover:text-zinc-400 transition-all">
          <Menu size={16} />
        </button>
      </div>
      
      <p className="text-zinc-300 mb-4 leading-relaxed">{post.content}</p>
      
      <div className="flex justify-between text-zinc-500 text-sm pt-4 border-t border-zinc-700">
        <button className="flex items-center gap-2 hover:text-zinc-300 transition-all">
          <Heart size={18} /> {post.likes}
        </button>
        <button className="flex items-center gap-2 hover:text-zinc-300 transition-all">
          <MessageCircle size={18} /> {post.comments}
        </button>
        <button className="flex items-center gap-2 hover:text-zinc-300 transition-all">
          <Share2 size={18} /> {post.shares}
        </button>
      </div>
    </div>
  );
  
  // Render backend post
  const renderBackendPost = (post) => (
    <div key={post.id} className="bg-gray-900 border border-green-800 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-green-500 text-sm">{post.author}</div>
          <div className="text-xs text-green-700">{post.authorType} :: {post.time}</div>
        </div>
        <div className="bg-black text-xs px-2 py-1 text-green-500 border border-green-900">
          DATA
        </div>
      </div>
      
      <p className="text-green-400 mb-3 text-sm">{post.content}</p>
      
      <div className="flex justify-between text-green-700 text-xs border-t border-green-900 pt-3">
        <button className="flex items-center gap-1">
          <Heart size={12} /> {post.likes}
        </button>
        <button className="flex items-center gap-1">
          <MessageCircle size={12} /> {post.comments}
        </button>
        <button className="flex items-center gap-1">
          <Share2 size={12} /> {post.shares}
        </button>
      </div>
    </div>
  );
  
  // Render post based on type
  const renderPost = (post: PostType) => {
    if ('authorType' in post) {
      return renderBackendPost(post as BackendPost);
    }
    return renderNormalPost(post as Post);
  };
  
  const currentUser = registeredUsers.find(u => u.id === currentUserId);

  // Add status submission handler
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStatus.trim()) return;
    
    const newStatus = {
      content: currentStatus,
      timestamp: new Date().toISOString()
    };
    
    // Extract potential interests from status content
    const interestKeywords = [
      'tech', 'muziek', 'sport', 'reizen', 'koken', 'gaming', 
      'fotografie', 'kunst', 'cultuur', 'boeken', 'film'
    ];
    
    const newInterests = interestKeywords.filter(keyword => 
      currentStatus.toLowerCase().includes(keyword)
    );
    
    setRegisteredUsers(prev => prev.map(user => {
      if (user.id === currentUserId) {
        // Combine existing interests with new ones found in status
        const updatedInterests = Array.from(new Set([...user.interests, ...newInterests]));
        
        return {
          ...user,
          statuses: [...(user.statuses || []), newStatus],
          interests: updatedInterests
        };
      }
      return user;
    }));
    
    setCurrentStatus('');
    
    // Update posts to show new status
    const currentUser = registeredUsers.find(u => u.id === currentUserId);
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        statuses: [...(currentUser.statuses || []), newStatus],
        interests: Array.from(new Set([...currentUser.interests, ...newInterests]))
      };
      const updatedPosts = generatePersonalizedPosts(updatedUser);
      setPosts(updatedPosts);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {!isRegistered ? (
        <div className="min-h-screen flex flex-col">
          <header className="bg-zinc-800 shadow-sm py-6 px-6 border-b border-zinc-700">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-light tracking-tight text-zinc-100">Vanta</h1>
              <button
                onClick={fillRandomData}
                className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-xl text-sm hover:bg-zinc-600 transition-all flex items-center gap-2"
              >
                <Database size={16} />
                Generate Test Data
              </button>
            </div>
          </header>
          
          <main className="flex-grow flex items-center justify-center py-10 px-4 bg-zinc-900">
            <div className="max-w-lg w-full">
              <div className="bg-zinc-800 rounded-2xl shadow-lg border border-zinc-700 overflow-hidden">
                <div className="p-10">
                  <h2 className="text-3xl font-light text-zinc-100 mb-8">Join Vanta</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Volledige naam</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="Voornaam Achternaam"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Gebruikersnaam</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <span className="text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="jouw_gebruikersnaam"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">E-mail</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="voorbeeld@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Telefoon</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Phone size={16} />
                        </div>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="06 12345678"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Locatie</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <MapPin size={16} />
                        </div>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="Amsterdam, Nederland"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Geboortedatum</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Calendar size={16} />
                        </div>
                        <input
                          type="text"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="01-01-1990"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Wachtwoord</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Key size={16} />
                        </div>
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="Kies een wachtwoord"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Interesses</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Bookmark size={16} />
                        </div>
                        <input
                          type="text"
                          value={interests[0] || ''}
                          onChange={(e) => setInterests([e.target.value])}
                          className="w-full p-4 pl-10 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                          placeholder="muziek, tech, reizen, etc."
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm text-zinc-400">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                        placeholder="Vertel iets over jezelf..."
                        rows={3}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="terms"
                        type="checkbox"
                        className="w-4 h-4 border-zinc-700 rounded text-zinc-400"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
                        Ik ga akkoord met de <a href="#" className="text-zinc-100 cursor-pointer hover:underline" onClick={(e) => { e.preventDefault(); console.log('LEAK_MACHINE_OS_v3.1'); }}>gebruiksvoorwaarden</a> en <span className="text-zinc-100 cursor-pointer">privacybeleid</span>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="w-full py-4 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-xl cursor-pointer transition-all"
                    >
                      Create account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
          
          <footer className="bg-zinc-800 border-t border-zinc-700 py-8">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-sm text-zinc-500">© 2025 Vanta - A project by Studio Dark Tech</p>
            </div>
          </footer>
        </div>
      ) : (
        // Social Media Platform or Backend View
        <div className={showBackend ? "min-h-screen bg-black text-green-400 font-mono" : "min-h-screen bg-zinc-900"}>
          {/* Loading Screen */}
          {isLoading && (
            <div className="fixed inset-0 bg-zinc-900 bg-opacity-90 flex items-center justify-center z-50">
              <div className="max-w-md w-full px-6 text-center">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">Account instellen</h2>
                <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-6">
                  <div className="bg-zinc-100 h-2.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-zinc-400">Even geduld terwijl we je account instellen...</p>
              </div>
            </div>
          )}
          
          {/* Header */}
          <header className={showBackend ? 
            "border-b border-green-900 p-4" : 
            "bg-zinc-800 shadow-sm p-6 border-b border-zinc-700"}>
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <h1 className={showBackend ? 
                "text-xl font-bold text-green-500 glitch-text" : 
                "text-2xl font-light tracking-tight text-zinc-100"}>
                {showBackend ? "VANTA SYSTEMS v3.1" : "Vanta"}
              </h1>
              
              <div className="flex items-center space-x-4">
                {!showBackend && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 font-light">
                      {name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium hidden md:block text-zinc-100">{name.split(' ')[0]}</span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button 
                    onClick={resetApp}
                    className={showBackend ? 
                      "px-3 py-1 bg-gray-900 border border-green-500 text-green-400 text-xs uppercase flex items-center gap-1" : 
                      "px-4 py-2 bg-zinc-700 text-zinc-100 rounded-xl text-sm flex items-center gap-2 hover:bg-zinc-600 transition-all"}
                  >
                    <UserPlus size={16} />
                    Nieuwe Gebruiker
                  </button>
                  <button 
                    onClick={toggleView}
                    className={showBackend ? 
                      "px-3 py-1 bg-red-900 border border-red-500 text-red-400 text-xs uppercase flex items-center gap-1" : 
                      "px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all"}
                  >
                    {showBackend ? (
                      <>
                        <Shield size={16} />
                        NORMALE WEERGAVE
                      </>
                    ) : (
                      <>
                        <Database size={16} />
                        Systeem weergave
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="max-w-4xl mx-auto py-6 px-4">
            {/* Regular Social Feed */}
            {!showBackend ? (
              <div className="space-y-4">
                {/* Share moment / Status Box */}
                <div className="bg-zinc-800 rounded-2xl shadow-lg border border-zinc-700 p-6">
                  <form onSubmit={handleStatusSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 font-light">
                        {name.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={currentStatus}
                          onChange={(e) => setCurrentStatus(e.target.value)}
                          placeholder={`Deel je moment, ${name.split(' ')[0]}...`}
                          className="w-full border border-zinc-700 rounded-xl py-3 px-5 bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl text-sm hover:bg-zinc-200 transition-all"
                      >
                        Delen
                      </button>
                    </div>
                  </form>
                </div>

                {/* Posts */}
                {posts.map(post => renderPost(post))}
              </div>
            ) : (
              // Backend System View
              <div className="space-y-4">
                <div className="bg-gray-900 border border-green-800 p-4">
                  <h3 className="font-mono text-green-500 flex items-center text-sm mb-2">
                    <Database size={16} className="mr-2" />
                    VANTA SYSTEMS v3.1 // VERIFIED AUTOMATED NETWORK FOR TRACKING ALL // USR-{currentUser?.id || Math.floor(Math.random() * 9000) + 1000}
                  </h3>
                  <div className="text-xs text-green-400 font-mono space-y-1">
                    <p>&gt; Name: {currentUser?.name || 'N/A'}</p>
                    <p>&gt; Username: {currentUser?.username || 'N/A'}</p>
                    <p>&gt; Email: {currentUser?.email || 'N/A'}</p>
                    <p>&gt; Phone: {currentUser?.phone || 'N/A'}</p>
                    <p>&gt; Location: {currentUser?.location || 'N/A'}</p>
                    <p>&gt; DOB: {currentUser?.birthday || 'N/A'}</p>
                    <p>&gt; Age: {currentUser ? calculateAge(currentUser.birthday) : 'N/A'} jaar</p>
                    <p>&gt; Password Hash: {password ? Array(password.length + 8).fill('*').join('') : '********'}</p>
                    <p>&gt; Interests: {currentUser?.interests.join(', ') || 'N/A'}</p>
                    <p>&gt; Bio Length: {currentUser?.bio.length || 0} chars</p>
                    <p>&gt; Account Creation: {new Date().toISOString()}</p>
                    <p>&gt; Last Login: {new Date().toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Data Posts */}
                {posts.map(post => renderPost(post))}
                
                <div className="bg-black border border-red-900 p-4">
                  <h3 className="text-lg font-mono uppercase text-red-500 mb-2">SYSTEM LOG</h3>
                  <p className="text-green-400 mb-3 text-sm font-mono">
                    &gt; VANTA SYSTEMS v3.1 - ACTIVE<br />
                    &gt; Data collection protocols: ENABLED<br />
                    &gt; Masking as: Vanta Social Platform<br />
                    &gt; Current extraction rate: OPTIMAL<br />
                    &gt; Security breach risk: MINIMAL<br />
                    &gt; Verified Automated Network for Tracking All: OPERATIONAL
                  </p>
                </div>
              </div>
            )}
          </main>
          
          {/* Footer */}
          <footer className={showBackend ? 
            "border-t border-green-900 p-4 text-center text-green-700 text-xs mt-8 font-mono" : 
            "bg-zinc-800 border-t border-zinc-700 p-4 text-center text-zinc-500 text-sm mt-8"}>
            <p>
              {showBackend ? 
                "VANTA SYSTEMS v3.1 - VERIFIED AUTOMATED NETWORK FOR TRACKING ALL" : 
                "© 2025 Vanta - A project by Studio Dark Tech"
              }
            </p>
          </footer>
        </div>
      )}
    </div>
  );
} 