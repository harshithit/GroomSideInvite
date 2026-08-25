(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function initials(name) {
    return (name || "").trim().charAt(0).toUpperCase();
  }

  function showPlaceholder(container, name) {
    container.classList.add("ph-photo");
    const span = document.createElement("span");
    span.className = "initials";
    span.textContent = initials(name);
    container.appendChild(span);
  }

  function photoOrInitials(container, photoUrl, name) {
    if (!photoUrl) {
      showPlaceholder(container, name);
      return;
    }
    const img = document.createElement("img");
    img.alt = name || "";
    // A configured-but-missing file falls back to the placeholder rather
    // than leaving a broken-image icon in the layout.
    img.addEventListener("error", () => {
      img.remove();
      showPlaceholder(container, name);
    });
    img.src = photoUrl;
    container.appendChild(img);
  }

  /* ===================================================
     Rajasthani motifs — real artwork (lanterns, camel, elephant)
     plus the small inline lotus used as a divider glyph.
     =================================================== */
  function lanternHTML(cls) {
    return `
    <picture class="lantern ${cls || ""}">
      <source srcset="/assets/decor/lanterns.webp" type="image/webp">
      <img src="/assets/decor/lanterns.png" alt="" />
    </picture>`;
  }

  function lotusSVG() {
    return `
    <svg viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 29 C20 29 6 23 6 13 C6 7 12 5 20 13 C28 5 34 7 34 13 C34 23 20 29 20 29 Z" fill="none" stroke="#A67D3D" stroke-width="1.3"/>
      <path d="M20 29 C20 29 14 19 14 9 C14 5 17 3 20 9 C23 3 26 5 26 9 C26 19 20 29 20 29 Z" fill="#EFA3C4" opacity="0.55"/>
    </svg>`;
  }

  function elephantImageHTML() {
    return `
    <picture>
      <source srcset="/assets/animals/elephant.webp" type="image/webp">
      <img src="/assets/animals/elephant.png" alt="Decorated ceremonial elephant" />
    </picture>`;
  }

  function camelImageHTML() {
    return `
    <picture>
      <source srcset="/assets/animals/camel.webp" type="image/webp">
      <img src="/assets/animals/camel.png" alt="Decorated Rajasthani camel" />
    </picture>`;
  }

  /* ===================================================
     Render content from WEDDING config
     =================================================== */
  function renderContent() {
    // Whose name leads wherever the two are named together. The hero is the
    // one exception — its markup reads "<groom> with <bride>" structurally.
    const first = WEDDING.groomFirst ? WEDDING.groom : WEDDING.bride;
    const second = WEDDING.groomFirst ? WEDDING.bride : WEDDING.groom;

    $("#hero-groom-name").textContent = WEDDING.groom.fullName;
    $("#hero-bride-name").textContent = WEDDING.bride.fullName;
    $("#wedding-date-display").textContent = WEDDING.weddingDateDisplay;
    $("#scratch-date").textContent = WEDDING.weddingDateDisplay;
    $("#footer-names").innerHTML = `${first.fullName} &amp; ${second.fullName}`;
    $("#venue-name").textContent = WEDDING.venue.name;
    $("#venue-address").textContent = WEDDING.venue.address;
    $("#story-location").textContent = `📍 ${WEDDING.storyPhoto.location}`;

    // Celebrations span two days, so the footer echoes the same display
    // string rather than a single computed date.
    $("#footer-date").textContent = WEDDING.weddingDateDisplay;

    // Ganesha invocation (envelope + hero)
    const shlokaHTML = `
      <p class="invocation">${WEDDING.ganesha.invocation}</p>
      <p class="verse">${WEDDING.ganesha.shloka.join("<br>")}</p>
      ${WEDDING.ganesha.closing ? `<p class="closing-invocation">${WEDDING.ganesha.closing}</p>` : ""}
    `;
    $("#envelope-shloka").innerHTML = shlokaHTML;
    $("#hero-shloka").innerHTML = shlokaHTML;

    // Hero lanterns
    $("#hero-lanterns").innerHTML = lanternHTML("lantern-left") + lanternHTML("lantern-right");

    // Lineage / blessings
    const lineage = $("#lineage-content");
    const gpCols = WEDDING.grandparents
      .map(
        (group) => `
        <div class="grandparents-col">
          <p class="gp-side">${group.side}</p>
          ${group.pairs
            .map(
              (pair) => `
            <div class="gp-pair">
              <p class="gp-pair-label">${pair.label}</p>
              ${pair.names.map((n) => `<p class="gp-pair-name">${n}</p>`).join("")}
            </div>
          `
            )
            .join("")}
        </div>
      `
      )
      .join("");
    lineage.innerHTML = `
      <p class="lineage-blessing">With the blessings of our<strong>Beloved Grandparents</strong></p>
      <div class="grandparents-wrap">${gpCols}</div>
      <p class="lineage-vow">With joyful hearts and gratitude, we invite you to celebrate love, unity and the beginning of a beautiful journey together.</p>
      <div class="lineage-names">
        <p class="lineage-name script-font">${first.fullName}</p>
        <p class="lineage-parentage">${first.parentage}</p>
        <p class="lineage-weds">weds</p>
        <p class="lineage-name script-font">${second.fullName}</p>
        <p class="lineage-parentage">${second.parentage}</p>
      </div>
    `;

    // Meet the couple
    const coupleGrid = $("#couple-grid");
    [first, second].forEach((person) => {
      const card = document.createElement("div");
      card.className = "couple-card";
      const portrait = document.createElement("div");
      portrait.className = "couple-portrait";
      photoOrInitials(portrait, person.photo, person.fullName);
      const name = document.createElement("p");
      name.className = "couple-name";
      name.textContent = person.fullName;
      const quote = document.createElement("p");
      quote.className = "couple-quote";
      quote.textContent = person.quote;
      card.append(portrait, name, quote);
      coupleGrid.appendChild(card);
    });

    // Love story chat thread
    const thread = $("#chat-thread");
    WEDDING.loveStory.forEach((entry) => {
      const row = document.createElement("div");
      row.className = `chat-row ${entry.side}`;
      const milestone = document.createElement("div");
      milestone.className = "chat-milestone";
      milestone.innerHTML = `<span>${entry.side === "left" ? "📍" : "💗"}</span><span>${entry.label}</span>`;
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.textContent = entry.text;
      const date = document.createElement("div");
      date.className = "chat-date";
      date.textContent = entry.date;
      row.append(milestone, bubble, date);
      thread.appendChild(row);
    });

    const storyPhoto = $("#story-photo");
    const storyCaption = `${first.nickname} + ${second.nickname}`;
    function storyFallback() {
      storyPhoto.classList.add("ph-photo");
      const span = document.createElement("span");
      span.textContent = storyCaption;
      storyPhoto.appendChild(span);
    }
    if (WEDDING.storyPhoto.photo) {
      storyPhoto.classList.remove("ph-photo");
      const img = document.createElement("img");
      img.alt = "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.addEventListener("error", () => {
        img.remove();
        storyFallback();
      });
      img.src = WEDDING.storyPhoto.photo;
      storyPhoto.appendChild(img);
    } else {
      storyFallback();
    }

    // Moments gallery (polaroids)
    const scatter = $("#polaroid-scatter");
    const rotations = [-6, 4, -3, 5, -5, 3];
    WEDDING.gallery.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "polaroid";
      // set as a custom property so the stagger animation can compose with it
      card.style.setProperty("--rot", `${rotations[i % rotations.length]}deg`);
      card.style.transform = `rotate(var(--rot))`;
      const photoBox = document.createElement("div");
      photoOrInitials(photoBox, item.photo, WEDDING.monogram);
      const caption = document.createElement("p");
      caption.className = "polaroid-caption";
      caption.textContent = item.caption;
      card.append(photoBox, caption);
      scatter.appendChild(card);
    });

    // Floating particle dots
    const particlesWrap = $("#moments-particles");
    const dotColors = ["#F0A93B", "#EFA3C4", "#F2D06B"];
    for (let i = 0; i < 16; i++) {
      const dot = document.createElement("span");
      dot.className = "particle-dot";
      const size = 4 + Math.random() * 6;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.background = dotColors[i % dotColors.length];
      dot.style.animationDelay = `${Math.random() * 4}s`;
      dot.style.animationDuration = `${5 + Math.random() * 4}s`;
      particlesWrap.appendChild(dot);
    }

    // Events schedule
    const eventsList = $("#events-list");
    WEDDING.events.forEach((ev) => {
      const card = document.createElement("div");
      card.className = `event-card theme-${ev.theme}`;

      const lanterns = document.createElement("div");
      lanterns.className = "lantern-pair";
      lanterns.innerHTML = lanternHTML("lantern-left") + lanternHTML("lantern-right");

      // Day heading
      const title = document.createElement("p");
      title.className = "event-day-label";
      title.textContent = ev.dayLabel;

      const subtitle = document.createElement("p");
      subtitle.className = "event-day-date";
      subtitle.textContent = ev.date;

      // Each ceremony on the day: either a single time (+ note) or a
      // multi-part schedule list.
      const schedule = document.createElement("div");
      schedule.className = "event-functions";
      schedule.innerHTML = ev.functions
        .map((fn) => {
          const rows = fn.schedule
            ? `<div class="fn-schedule">${fn.schedule
                .map(
                  (r) =>
                    `<div class="fn-row"><span class="fn-row-label">${r.label}</span><span class="fn-row-time">${r.time}</span></div>`
                )
                .join("")}</div>`
            : `${fn.time ? `<p class="fn-time">${fn.time}</p>` : ""}`;
          return `
        <div class="event-function">
          <p class="fn-title script-font">${fn.title}</p>
          ${fn.subtitle ? `<p class="fn-subtitle">${fn.subtitle}</p>` : ""}
          ${rows}
          ${fn.note ? `<p class="fn-note">${fn.note}</p>` : ""}
        </div>`;
        })
        .join("");

      const venue = document.createElement("p");
      venue.className = "event-venue";
      venue.textContent = ev.venue;

      const details = document.createElement("div");
      details.append(venue);

      const divider = document.createElement("div");
      divider.className = "lotus-divider";
      divider.innerHTML = `<span class="divider-line"></span>${lotusSVG()}<span class="divider-line"></span>`;

      const tagline = document.createElement("p");
      tagline.className = "event-tagline";
      tagline.textContent = ev.tagline;

      const animalLeft = document.createElement("div");
      animalLeft.className = "event-animal left";
      animalLeft.innerHTML = ev.animal === "camel" ? camelImageHTML() : elephantImageHTML();
      const animalRight = document.createElement("div");
      animalRight.className = "event-animal right";
      animalRight.innerHTML = ev.animal === "camel" ? camelImageHTML() : elephantImageHTML();

      card.append(lanterns, title, subtitle, schedule, details, divider, tagline, animalLeft, animalRight);
      eventsList.appendChild(card);
    });

    // RSVP — WhatsApp deep links
    const rsvpWrap = $("#rsvp-content");
    if (rsvpWrap && WEDDING.rsvp) {
      const contacts = (WEDDING.rsvp.contacts || []).filter((c) => c.phone);
      const prefill = encodeURIComponent(WEDDING.rsvp.message || "");
      const buttons = contacts
        .map(
          (c) => `
        <a class="rsvp-btn" href="https://wa.me/${c.phone}?text=${prefill}"
           target="_blank" rel="noopener noreferrer">
          <svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1a12 12 0 0 1-5.3-4.6c-.4-.6-.9-1.5-.9-2.4 0-.9.5-1.4.7-1.6a.8.8 0 0 1 .6-.3h.4c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3-.1.5.3.6.8 1.2 1.3 1.6.6.5 1.1.7 1.4.8.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.8c.2.1.3.2.4.3v.6z"/>
          </svg>
          <span>RSVP to ${c.name}</span>
        </a>`
        )
        .join("");

      // Google Form — accept any of the share/edit/embed URL shapes and
      // normalise to the embeddable one.
      const form = WEDDING.rsvpForm || {};
      let formBlock = "";
      if (form.url) {
        const embedUrl = form.url
          .replace(/\/(viewform|edit)(\?[^#]*)?(#.*)?$/, "/viewform")
          .replace(/\/viewform$/, "/viewform?embedded=true");
        formBlock = `
          <div class="rsvp-form">
            ${form.note ? `<p class="rsvp-form-note">${form.note}</p>` : ""}
            <iframe class="rsvp-frame" id="rsvp-frame" src="${embedUrl}"
                    loading="lazy" title="RSVP form">Loading…</iframe>
            <a class="rsvp-form-fallback" href="${form.url}"
               target="_blank" rel="noopener noreferrer">Open the RSVP form in a new tab</a>
          </div>`;
      }

      rsvpWrap.innerHTML = `
        <p class="rsvp-note">${WEDDING.rsvp.note || ""}</p>
        ${formBlock}
        ${
          buttons
            ? `<p class="rsvp-or">Or send us a message</p>
               <div class="rsvp-buttons">${buttons}</div>`
            // only apologise for missing contacts if there is no form either
            : (formBlock ? "" : `<p class="rsvp-pending">RSVP contact details coming soon.</p>`)
        }
      `;
    }

    // Map + directions
    const query = encodeURIComponent(WEDDING.venue.mapsQuery);
    $("#map-iframe").src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
    $("#directions-link").href = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }

  /* ===================================================
     Envelope open interaction
     =================================================== */
  function initEnvelope() {
    const envelopeScreen = $("#envelope-screen");
    const envelopeScene = $("#envelope-scene");
    const tapBtn = $("#tap-to-open");
    const flash = $("#flash-overlay");
    const main = $("#main-content");
    let opened = false;

    tapBtn.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      envelopeScene.classList.add("is-open");
      tapBtn.classList.add("is-hidden");

      // Must start from inside this click handler — browsers only allow
      // audio to begin as a direct result of a user gesture.
      startMusic();

      // petals begin as the flap opens and keep falling for the whole visit
      setTimeout(() => startPetalShower(), 500);

      // flap opens, seal cracks away, card slides up out of the pocket —
      // then the flash-wipe covers the tail end of that motion.
      setTimeout(() => flash.classList.add("flashing"), 950);
      setTimeout(() => {
        envelopeScreen.style.display = "none";
        main.hidden = false;
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        startRevealObserver();
      }, 1100);
      setTimeout(() => flash.classList.remove("flashing"), 1650);
    });

    document.body.style.overflow = "hidden";
  }

  /* ===================================================
     Flower shower
     =================================================== */
  const PETAL_COLORS = ["#EFA3C4", "#F2B6D0", "#F0A93B", "#E8B65C", "#FFF3E2", "#D9769B"];

  function makePetal(layer, { maxDelay = 0 } = {}) {
    const p = document.createElement("span");
    p.className = "petal";
    const fall = 5.5 + Math.random() * 4.5;
    const delay = Math.random() * maxDelay;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--size", `${9 + Math.random() * 12}px`);
    p.style.setProperty("--petal-color", PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]);
    p.style.setProperty("--fall", `${fall}s`);
    p.style.setProperty("--delay", `${delay}s`);
    p.style.setProperty("--sway", `${1.8 + Math.random() * 1.8}s`);
    p.style.setProperty("--drift", `${14 + Math.random() * 30}px`);
    p.style.setProperty("--spin", `${(Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 480)}deg`);

    // Remove each petal once it has fallen, so the shower can run for the
    // whole visit without the node count growing without bound.
    p.addEventListener("animationend", (e) => {
      if (e.animationName === "petal-fall") p.remove();
    });
    layer.appendChild(p);
  }

  function startPetalShower() {
    const layer = $("#petal-layer");
    if (!layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const MAX_ON_SCREEN = 40;
    let timer = null;

    function tick() {
      // Skip while the tab is backgrounded — animations are throttled there
      // anyway, and this avoids a burst all landing at once on return.
      if (!document.hidden && layer.childElementCount < MAX_ON_SCREEN) {
        makePetal(layer);
      }
    }

    // opening flourish, then a steady gentle fall
    for (let i = 0; i < 26; i++) makePetal(layer, { maxDelay: 3.2 });
    timer = window.setInterval(tick, 420);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) layer.innerHTML = "";
    });

    // stop cleanly if the user switches on reduced motion mid-visit
    const onPrefChange = (e) => {
      if (e.matches) {
        window.clearInterval(timer);
        timer = null;
        layer.innerHTML = "";
      }
    };
    if (reduced.addEventListener) reduced.addEventListener("change", onPrefChange);
  }

  /* ===================================================
     Background music
     =================================================== */
  let startMusic = () => {};

  function initMusic() {
    const audio = $("#bg-music");
    const toggle = $("#music-toggle");
    if (!audio || !toggle) return;

    audio.volume = 0.45;          // background level, not foreground
    let wantsSound = true;        // what the guest last chose

    function setUI(playing) {
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    }

    startMusic = function () {
      toggle.hidden = false;
      audio.play().then(() => setUI(true)).catch(() => {
        // Autoplay refused (low-power mode, silent switch, strict settings).
        // Leave the control visible so the guest can start it themselves.
        wantsSound = false;
        setUI(false);
      });
    };

    toggle.addEventListener("click", () => {
      if (audio.paused) {
        wantsSound = true;
        audio.play().then(() => setUI(true)).catch(() => setUI(false));
      } else {
        wantsSound = false;
        audio.pause();
        setUI(false);
      }
    });

    // Don't keep playing into a backgrounded tab; resume only if the guest
    // hadn't paused it themselves.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else if (wantsSound && audio.paused) {
        audio.play().then(() => setUI(true)).catch(() => setUI(false));
      }
    });

    audio.addEventListener("play", () => setUI(true));
    audio.addEventListener("pause", () => {
      if (!document.hidden) setUI(false);
    });
  }

  /* ===================================================
     Scratch-to-reveal card
     =================================================== */
  function initScratchCard() {
    const canvas = $("#scratch-canvas");
    const wrap = $(".scratch-wrap");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function paintCover() {
      const w = canvas.width, h = canvas.height;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#E8CE8F");
      grad.addColorStop(1, "#A67D3D");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, h / 2);
      ctx.fill();
    }
    paintCover();

    let scratching = false;
    let scratchedPixels = 0;
    const totalPixels = canvas.width * canvas.height;

    function getPos(evt) {
      const rect = canvas.getBoundingClientRect();
      const point = evt.touches ? evt.touches[0] : evt;
      return {
        x: ((point.clientX - rect.left) / rect.width) * canvas.width,
        y: ((point.clientY - rect.top) / rect.height) * canvas.height,
      };
    }

    function scratchAt(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkRevealProgress() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      for (let i = 3; i < imgData.length; i += 4 * 20) {
        if (imgData[i] === 0) cleared++;
      }
      const sampled = Math.ceil(totalPixels / 20);
      scratchedPixels = cleared / sampled;
      if (scratchedPixels > 0.45) {
        revealAll();
      }
    }

    function revealAll() {
      wrap.classList.add("is-revealed");
    }

    function start(evt) {
      scratching = true;
      const pos = getPos(evt);
      scratchAt(pos.x, pos.y);
    }
    function move(evt) {
      if (!scratching) return;
      evt.preventDefault();
      const pos = getPos(evt);
      scratchAt(pos.x, pos.y);
      checkRevealProgress();
    }
    function end() {
      scratching = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
  }

  /* ===================================================
     Countdown
     =================================================== */
  function initCountdown() {
    const target = new Date(WEDDING.weddingDateTime).getTime();
    const daysEl = $("#cd-days"), hoursEl = $("#cd-hours"), minsEl = $("#cd-mins"), secsEl = $("#cd-secs");

    function tick() {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minsEl.textContent = String(mins).padStart(2, "0");
      secsEl.textContent = String(secs).padStart(2, "0");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ===================================================
     Scroll reveal
     =================================================== */
  // Tag the notable children of each section so they animate in sequence.
  function prepareStagger() {
    const groups = [
      "#countdown-grid .countdown-box",
      "#couple-grid .couple-card",
      "#chat-thread .chat-row",
      "#polaroid-scatter .polaroid",
      "#events-list .event-card",
      "#rsvp-content .rsvp-btn",
      "#lineage-content .grandparents-col"
    ];
    groups.forEach((sel) => {
      $$(sel).forEach((el, i) => {
        el.classList.add("stagger-item");
        el.style.setProperty("--d", `${i * 90}ms`);
      });
    });
  }

  function startRevealObserver() {
    prepareStagger();
    const targets = $$(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t));
  }

  /* ===================================================
     Init
     =================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    initMusic();      // before initEnvelope: the tap handler calls startMusic()
    initEnvelope();
    initScratchCard();
    initCountdown();
  });
})();
