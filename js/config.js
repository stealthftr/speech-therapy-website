/* ============================================================
   LARK — Speech Pathology for Children (Adelaide)
   SITE CONFIG — edit this ONE file to wire up real services.
   Everything here is a placeholder until you swap it.
   ============================================================ */
window.SITE_CONFIG = {
  // 1) CLINIKO — your booking system. Paste your Cliniko *bookings URL* here, e.g.
  //    "https://your-name.au4.cliniko.com/bookings"
  //    Find it in Cliniko → Settings → Online bookings (the shard, e.g. au4,
  //    is already in your URL — just copy the whole thing). The booking page
  //    then embeds your live Cliniko calendar. While empty (""), the page shows
  //    the appointment-request form instead.
  //
  //    Prefer Cliniko's own copy-paste widget? In Cliniko, Settings → Online
  //    bookings → "Code to embed in your website" gives you a snippet — paste it
  //    directly into book.html where marked, and leave this empty.
  clinikoUrl: "https://light-unfolding.au5.cliniko.com/bookings#schedule",
  // [SWAP] This is the current Cliniko booking URL (still under the old
  // "Light Unfolding" account name/subdomain). Update the business name in
  // Cliniko → Settings so the booking page reads "Lark", to match this site.

  // 1b) CLINIKO MODE — how the booking page presents Cliniko:
  //    "embed" = in-page iframe (seamless, but bookings show as "Direct" in
  //              Google Analytics — the referral/ad source is lost).
  //    "link"  = a button that sends parents to your Cliniko booking page
  //              (a real navigation, so the referral source & UTM/ad tracking
  //              carry through — Cliniko's recommendation for accurate tracking).
  //    Use "link" if you run ads or care where bookings come from.
  clinikoMode: "embed",

  // 2) CALENDLY (optional alternative) — only used if clinikoUrl is empty.
  //    Since you're on Cliniko, you can ignore this.
  calendlyUrl: "",

  // 3) FORM ENDPOINT — optional, for the request/enquiry forms (NOT the booking
  //    calendar). Paste a Formspree endpoint, e.g. "https://formspree.io/f/abc",
  //    and every form POSTs to it. If empty: on a Netlify deploy, forms use
  //    Netlify Forms; previewing locally, forms run in demo mode (validate +
  //    confirm, logged to the browser console).
  formEndpoint: "",

  // 4) CONTACT DETAILS — [SWAP] verify/replace before launch.
  //    Phone is the real practice number; email is a placeholder on the new Lark
  //    domain (migrate from LightUnfolding once the domain is secured).
  phone: "0485 881 270",
  phoneHref: "tel:+61485881270",
  email: "hello@larkspeech.com.au", // [SWAP] once Lark domain is registered
};
