export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  type: "music" | "voice-memo";
  tag: string;
  audioUrl?: string;
  notes?: string;
}

export interface FriendWish {
  id: string;
  sender: string;
  displayName: string;
  tag: string;
  image: string;
  snippet: string;
  fullMessage: string;
  width: number;
  height: number;
  audioUrl?: string;
  audioDuration?: string;
}

export interface CelebrationConfig {
  recipientName: string;
  eventTitle: string;
  milestone: string;
  surprisePrompt: string;
  video: {
    title: string;
    description: string;
    videoUrl?: string;
    posterImage?: string;
  };
  cake: {
    candleCount: number;
    flavor: string;
    blowSensitivityThreshold: number;
    secretWish: {
      headline: string;
      message: string;
      signOff: string;
      senderName: string;
    };
  };
  jukebox: {
    playlist: PlaylistItem[];
  };
  friendWishes: FriendWish[];
}

export const celebrationConfig: CelebrationConfig = {
  recipientName: "Nada",
  eventTitle: "Happy Birthday, Nada!",
  milestone: "Celebrating our favorite birthday queen in sparkling style",
  surprisePrompt: "A sparkling celebration prepared just for you. Press below to unlock your party.",
  video: {
    title: "Nada's Birthday Reel",
    description: "An animated celebration tribute honoring Nada with magical fluttering butterflies, radiant stars, and celebration spotlights.",
    videoUrl: "/Birthday-Video.mp4",
    posterImage: "/video-poster.png",
  },
  cake: {
    candleCount: 3,
    flavor: "Wild Strawberry & Pink Champagne Cake",
    blowSensitivityThreshold: 0.12,
    secretWish: {
      headline: "The Secret Birthday Wish Unlocked",
      message:
        "To Nada, the girl who brings the brightest energy into every room: may this year bring you breathtaking adventures, big dream milestones, and love as genuine as you are. Keep shining, dreaming big, and inspiring everyone around you.",
      signOff: "With so much love and champagne cheers,",
      senderName: "Your Best Crew",
    },
  },
  friendWishes: [
    {
      id: "wish-hayati",
      sender: "Hayati",
      displayName: "Haya",
      tag: "8-9 Years of Love",
      image: "/wishes/Hayati.jpeg",
      width: 1066,
      height: 1600,
      audioUrl: "/hayati.mp3",
      audioDuration: "0:12",
      snippet:
        "Queen of my heart, Happiest Birthday Nada! My love, my everything, and my whole world! You are the purest, most beautiful soul I have ever seen.",
      fullMessage:
        "✨💖 Queen of my heart, Happiest Birthday Nada! 💖✨\n\n💍 My love, my everything, and my whole world! 🌍✨\n\nYou are the purest, most beautiful soul I have ever seen. It has been more than 8-9 wonderful years since we first met, and looking back, every single moment with you has been a blessing. We have stayed strong together through all of life's ups and downs, and my love for you only grows deeper with each passing day. 👩‍❤️‍👩💖\n\n🌹 You deserve nothing less than the absolute best, my dear. 🌹\n\nYou are my safe haven, my best friend, and the greatest gift in my life. May all your heart's desires and secret wishes come true. Ameen. 🤲🏻❤️\n\n✨ Stay Infinitely Happy ✨\n✨ Stay Forever Blessed, My One True Love! 👑❤️🔥",
    },
    {
      id: "wish-vampire",
      sender: "Vampire",
      displayName: "Evelina",
      tag: "Golden Heart & Angel",
      image: "/wishes/Vampire.jpeg",
      width: 1080,
      height: 1084,
      snippet:
        "Dear Nada, my darling, u been and always will be the best person i ever met in this game, no world has ever seen as golden heart as urs.",
      fullMessage:
        "Dear Nada, my darling, u been and always will be the best person i ever met in this game, no world has ever seen as golden heart as urs, u r the example of an Angel on this earth. Today is your day, the day this earth seen such beauty and kind soul like yours and i like to wish you to always remember who u r, always stay this kind, sweet, innocent, perfectly understanding and pretty girl you always been. Hope this year brings u even more beautiful memories and all your dreams come true. Love you always and forever,\nEvelina",
    },
    {
      id: "wish-glamira",
      sender: "Glamira",
      displayName: "M. Dior",
      tag: "Sweet Cutie Wish",
      image: "/wishes/Glamira.jpeg",
      width: 1080,
      height: 256,
      audioUrl: "/glam.mp3",
      audioDuration: "0:06",
      snippet:
        "Happy Birthday Nadaa ❤️ i wish you all the best cutie",
      fullMessage:
        "Happy Birthday Nadaa ❤️ i wish you all the best cutie",
    },
    {
      id: "wish-jazmin",
      sender: "Jazmin",
      displayName: "Jaz",
      tag: "Kindest Soul",
      image: "/wishes/Jazmin.jpeg",
      width: 1080,
      height: 306,
      snippet:
        "Happy Birthday Nada, Kindest person alive I wish you love and happiness",
      fullMessage:
        "Happy Birthday Nada, Kindest person alive I wish you love and happiness . ⁺. ✦ ❤ . ⁺. ✦",
    },
    {
      id: "wish-spate",
      sender: "Spate",
      displayName: "S.",
      tag: "Endless Happiness",
      image: "/wishes/Spate.jpeg",
      width: 1080,
      height: 411,
      audioUrl: "/spate.mp3",
      audioDuration: "0:15",
      snippet:
        "Happy Birthday, Nada! Wish you endless happiness, success, and beautiful memories. May all your dreams come true.",
      fullMessage:
        "Happy Birthday, Nada! Wish you endless happiness, success, and beautiful memories. May all your dreams come true, and may your smile never fade. You deserve the best, always!",
    },
    {
      id: "wish-steelassassin",
      sender: "SteelAssassin",
      displayName: "Steel",
      tag: "Best in Life",
      image: "/wishes/SteelAssassin.jpeg",
      width: 1080,
      height: 704,
      snippet:
        "Happy Birthday Nada! ❤️🎂 I hope you have an amazing day filled with happiness, laughter, and beautiful memories.",
      fullMessage:
        "Happy Birthday Nada! ❤️🎂 I hope you have an amazing day filled with happiness, laughter, and beautiful memories. I wish you all the best in life, lots of success, good health, and happiness. May all your wishes come true and may this year bring you many wonderful moments, Enjoy your special dayyy! 🥳❤️",
    },
    {
      id: "wish-fahmida",
      sender: "Fahmida",
      displayName: "Allium",
      tag: "Heartfelt Dua",
      image: "/wishes/Fahmida.jpeg",
      width: 1080,
      height: 773,
      snippet:
        "HAPPY BIRTHDAY NADA! MAY ALLAH SWT SHOWER HIS BLESSINGS UPON YOU ALLLLL THROUGHOUT YOUR LIFEEE ✨🤍",
      fullMessage:
        "HAPPY BIRTHDAY NADA!\n\nMAY ALLAH SWT SHOWER HIS BLESSINGS UPON YOU ALLLLL THROUGHOUT YOUR LIFEEE ✨🤍, MAKE ALL YOUR HARDSHIPS EASIER FOR YOU TO BEAR, MAKE YOU PLEASED WITH EVERYTHING. MAY ALL YOUR WISHES COME TRUE.\n\nENJOY YOUR BIRTHDAY WITH CHOCOLATES CAKES AND HAPPINESS ✨🎉",
    },
    {
      id: "wish-cafy",
      sender: "Cafy",
      displayName: "Cafy",
      tag: "Sweetheart",
      image: "/wishes/cafy.jpeg",
      width: 1080,
      height: 542,
      snippet:
        "Happy birthday Nadaaaa!!!! 🫶❤️ I hope you have the best day everrrrr!!!! You're such a sweetheart",
      fullMessage:
        "Happy birthday Nadaaaa!!!! 🫶❤️ I hope you have the best day everrrrr!!!! You're such a sweetheart and you deserve all the good things life has to offer. Inshallah you have many more birthdays to come 🥳🎉",
    },
    {
      id: "wish-pyke",
      sender: "Pyke",
      displayName: "Pyke [DIOR]",
      tag: "Special Note",
      image: "/wishes/pyke.jpeg",
      width: 689,
      height: 56,
      snippet:
        "Hey noob nadoula, I wish you happy birthday and I hope u finally see the version of yourself that I see in you",
      fullMessage:
        "Hey noob nadoula, I wish you happy birthday and I hope u finally see the version of yourself that I see in you",
    },
  ],
  jukebox: {
    playlist: [
      {
        id: "memo-hayati",
        title: "Voice Note: Love from Hayati",
        artist: "Hayati (Haya)",
        duration: "0:12",
        type: "voice-memo",
        tag: "Real Voice Note",
        audioUrl: "/hayati.mp3",
        notes: "Real voice note from Hayati celebrating 8-9 wonderful years together",
      },
      {
        id: "memo-glamira",
        title: "Voice Note: Wishes from Glamira",
        artist: "Glamira (M. Dior)",
        duration: "0:06",
        type: "voice-memo",
        tag: "Real Voice Note",
        audioUrl: "/glam.mp3",
        notes: "Real voice note wishing Nada the sweetest birthday",
      },
      {
        id: "memo-spate",
        title: "Voice Note: Blessings from Spate",
        artist: "Spate (S.)",
        duration: "0:15",
        type: "voice-memo",
        tag: "Real Voice Note",
        audioUrl: "/spate.mp3",
        notes: "Real voice note from Spate wishing endless happiness and smiles",
      },
      {
        id: "memo-xotic",
        title: "Voice Note: Message from Xotic",
        artist: "Xotic",
        duration: "0:12",
        type: "voice-memo",
        tag: "Real Voice Note",
        audioUrl: "/xotic.mp3",
        notes: "Real voice note with heartfelt birthday blessings from Xotic",
      },
    ],
  },
};
