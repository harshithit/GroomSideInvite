/* ============================================================
   Groom's-side variant — differences only.
   Everything else (dates, venue, love story, gallery, RSVP,
   monogram, event schedule…) is inherited from /js/config.js.
   Edit that ONE file and both /  and /groom/ update together;
   this file should only ever hold the two differences below.
   ============================================================ */

// "Harshit weds Ishita" — groom's name first in the Blessings section.
// (The hero already reads "Harshit with Ishita" either way.)
WEDDING.groomFirst = true;

// This card is shared with Harshit's side of the family, so it carries
// only his grandparents' blessing.
WEDDING.grandparents = WEDDING.grandparents.filter(
  (group) => !group.side.startsWith("Ishita")
);
