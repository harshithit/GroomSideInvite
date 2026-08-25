/* ============================================================
   EDIT ME — all real wedding content lives in this one file.
   Sourced from the family's printed card (Nagpal & Bhasin, R
   Chandra Palace, Chomu, Jaipur). Update photo paths as real
   photos become available.
   ============================================================ */

const WEDDING = {
  bride: {
    fullName: "Ishita",
    nickname: "Ishita",
    parentage: "D/o Mrs. Bharti Nagpal & Mr. Sundeep Nagpal",
    quote: "“Home is wherever I’m with you.”",
    photo: ""
  },
  groom: {
    fullName: "Harshit",
    nickname: "Harshit",
    parentage: "S/o Mrs. Madhu Bhasin & Mr. Kimti Bhasin",
    quote: "“Every love story is beautiful, but ours is my favorite.”",
    photo: ""
  },
  // NOTE: currently unrendered — the parents' names were removed from under
  // the hero arch. The Blessings section shows them via bride/groom
  // `parentage` above, so edit those, not this. Kept for future use.
  parents: {
    bride: "Mrs. Bharti & Mr. Sundeep Nagpal",
    groom: "Mrs. Madhu & Mr. Kimti Bhasin"
  },

  grandparents: [
    {
      side: "Ishita's Grandparents",
      pairs: [
        { label: "Dadi & Dadu", names: ["Smt. Rajkumari Nagpal", "Late Shri Shiv Dayal Nagpal"] },
        { label: "Nani & Nanu", names: ["Smt. Kamal Arora", "Late Shri Surendra Kumar Arora"] }
      ]
    },
    {
      side: "Harshit's Grandparents",
      pairs: [
        { label: "Dadi & Dadu", names: ["Late Smt. Satya Rani Bhasin", "Late Shri Roshan Lal Bhasin"] },
        { label: "Nani & Nanu", names: ["Late Smt. Krishna Kohli", "Shri Bhagwat Prasad Kohli"] }
      ]
    }
  ],

  monogram: "HI",

  // Only the Blessings section's "X weds Y" line is order-sensitive — the
  // hero already reads "Harshit with Ishita" structurally either way. Set
  // true for a groom's-side card. See groom/js/config.js for that variant.
  groomFirst: false,

  ganesha: {
    invocation: "॥ श्री गणेशाय नमः ॥",
    shloka: [
      "विघ्नहरण मंगल करण, श्री गणपति महाराज।",
      "प्रथम निमन्त्रण आपको, पूरण कीजै काज॥"
    ],
    // Closing invocation, shown beneath the shloka
    closing: "ॐ साईं राम"
  },

  // ISO datetime the main ceremony begins — drives the countdown.
  weddingDateTime: "2026-10-20T21:00:00",
  weddingDateDisplay: "19th & 20th October 2026",

  // One card per day. Each `function` is a ceremony on that day; give it
  // either a `time` (+ optional `note`), or a `schedule` list for
  // multi-part ceremonies like the wedding itself.
  events: [
    {
      key: "day1",
      dayLabel: "Day 1",
      date: "Monday, 19th October 2026",
      theme: "ochre",
      animal: "camel",
      functions: [
        {
          title: "Aagman & Abhinandan",
          subtitle: "Welcome Lunch",
          time: "12:00 PM onwards"
        },
        {
          title: "Shagun-e-Sangeet",
          schedule: [
            { label: "Sagan & Ring Ceremony", time: "5:00 PM Onwards" },
            { label: "Sangeet & Revelry", time: "7:00 PM, followed by dinner" }
          ]
        }
      ],
      venue: "R Chandra Palace, Chomu, Jaipur",
      tagline: "Rhythms · Rings · Revelry"
    },
    {
      key: "day2",
      dayLabel: "Day 2",
      date: "Tuesday, 20th October 2026",
      theme: "maroon",
      animal: "elephant",
      functions: [
        {
          title: "Rangilo Haldi",
          time: "10:00 AM onwards",
          note: "followed by Rajasthani Lunch"
        },
        {
          title: "Shubh Vivah",
          schedule: [
            { label: "Baraat", time: "6:00 PM" },
            { label: "Jaimala", time: "7:00 PM" },
            { label: "Pheras", time: "9:00 PM" }
          ]
        }
      ],
      venue: "R Chandra Palace, Chomu, Jaipur",
      tagline: "Two Families · Two Hearts · One Beautiful Beginning"
    }
  ],

  venue: {
    name: "R Chandra Palace",
    address: "Chomu, Jaipur, Rajasthan",
    mapsQuery: "R Chandra Palace, Chomu, Jaipur"
  },

  // Google Form RSVP.
  // Paste the form's SHARE link (…/viewform). The code converts it to the
  // embed form automatically. Leave url empty to hide the form entirely.
  //   Google Forms → Send → link icon 🔗 → copy
  rsvpForm: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSdg4Cni9gOFsMulMre_9uBVYhy40fTJH_2by-uGNY8G_WnhXw/viewform",
    heading: "RSVP",
    note: "Please fill in the form below so we know to expect you."
  },

  // WhatsApp RSVP. `phone` must be in full international format, digits only
  // — country code, no +, no spaces or dashes (e.g. 919876543210 for India).
  // Leave a phone empty and that contact is skipped.
  rsvp: {
    note: "It would mean the world to have you with us. Kindly let us know by 30th September 2026 so we can welcome you just right.",
    contacts: [
      { name: "Nishtha Bhasin Mehta", phone: "" },
      { name: "Vipul Mehta", phone: "" }
    ],
    message: "Hi! We'd love to attend Harshit & Ishita's wedding. "
  },

  loveStory: [
    {
      label: "Two Worlds, One Hometown",
      date: "Delhi",
      text: "Two childhoods rooted in Delhi, just a few kilometers and years apart. Harshit was the focused one from the start—methodical, ambitious, and certain he was going to be an engineer. Ishita had a much more colorful plan: explore everything, go with the flow, and have fun along the way. Years later, it turns out both plans worked out brilliantly.",
      side: "left"
    },
    {
      label: "Different Paths, Different Pin Codes",
      date: "Germany · Hyderabad",
      text: "Their journeys took them across maps and milestones. Harshit stayed the course in Delhi before heading to Germany for his Master’s and building his life as an engineer. Meanwhile, Ishita’s path wandered through Noida and Bangalore before landing her in Hyderabad, thriving in business analysis. Two vastly different rhythms across continents, completely unaware of how close their orbits would soon become.",
      side: "right"
    },
    {
      label: "The Icebreaker & The Spark",
      date: "How it began",
      text: "It all began with an arranged introduction and Harshit’s wonderfully direct text: “Our parents want us to speak, so let’s talk.” Initial polite chats—and his polished corporate-meets-Germany accent—quickly gave way to easy laughter and effortless banter. Before long, quick check-ins turned into hours-long calls across time zones, frequent flights, and a genuine connection that caught them both by surprise.",
      side: "left"
    },
    {
      label: "The Best Is Yet to Come",
      date: "October 2026",
      text: "Somewhere between bridging continents, sharing countless laughs, and realizing just how well their opposites complemented each other, an arranged match quietly became their favorite choice. This October, they leave the miles behind to start their biggest adventure yet—building a life together.",
      side: "right"
    }
  ],

  // Photos live in assets/photos/. Any entry whose file is missing falls back
  // to the gradient placeholder, so the page never breaks mid-edit.
  gallery: [
    { photo: "/assets/photos/baby-bangles.jpg",     caption: "Where it all began" },
    { photo: "/assets/photos/child-bonnet.jpg",     caption: "Always the poser" },
    { photo: "/assets/photos/baby-rose.jpg",        caption: "Tiny beginnings" },
    { photo: "/assets/photos/family-vintage.jpg",   caption: "Family always" },
    { photo: "/assets/photos/siblings-vintage.jpg", caption: "Hungry in love" },
    { photo: "/assets/photos/couple-gate.jpg",      caption: "Sunshine days" },
    { photo: "/assets/photos/couple-marble.jpg",    caption: "Just us" },
    { photo: "/assets/photos/couple-dinner.jpg",    caption: "Forever laughing" },
    { photo: "/assets/photos/couple-night.jpg",     caption: "Under the stars" },
    { photo: "/assets/photos/couple-palace.jpg",    caption: "Palace wanderings" }
  ],

  storyPhoto: { photo: "/assets/photos/couple-palace.jpg", location: "Jaipur, Rajasthan" }
};
