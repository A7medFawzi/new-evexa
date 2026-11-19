"use client";

/**
 * Evexa animation runtime (per page).
 *
 * Recreates every animation / interaction of the original Framer site with
 * the exact parameters extracted from its runtime bundles:
 *
 *  - Appear sequences per page (spring damping 60, stiffness 200, mass 1):
 *    badge .2s → text1 .5s → text2 .7s → body/buttons 1.1s → bottom 1.0s.
 *    About "Bottom" flips in: rotateX 0 → 30, transformPerspective 4000.
 *    Home hero background: spring(duration 3, bounce 0), scale 1.1 → 1.
 *  - Word-by-word reveal: blur(10px) + y:10 + opacity .001 → spring
 *    (stiffness 300, damping 50), stagger 0.05s/word, inView threshold 0.5,
 *    startDelay 0 / 0.2.
 *  - Scroll-linked char fill (exact original "Qt" component math):
 *    per-word progress window L/N…(L+1)/N, per-char sub-window, #666666 →
 *    #FFFFFF, chars < 40 forced #FFFFFF, offset ["start 0.75","start 0.15"],
 *    color tween 0.3s easeInOut.
 *  - Nav: fixed .framer-1hltwlr-container, centered via left:50% +
 *    translateX(-50%); hides after 250px scroll down (translateY(-110%)),
 *    shows on scroll up, transition transform 0.4s cubic-bezier(.44,0,.56,1).
 *    Mobile menu: header variant class swap (framer-v-gazge4 ↔
 *    framer-v-csul5u), height 84 → content (~0.3s ease), instant close,
 *    burger lines rotate ±45°.
 *  - Real page navigation (/, /about, /portfolio, /contact, /#faq …).
 *  - Tickers, FAQ accordion, testimonial drag slider, light rays canvas,
 *    video autoplay, star spin-ins, purple ring loop.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { SVG_TEMPLATES } from "@/content/svg-templates";
import { ABOUT_CARD_ICONS } from "@/content/about-card-icons";

/*
 * Container fills — the original Framer runtime fills ~199 empty
 * "framer-*-container" slots (icon tiles, card arrows ↗, logos…) with
 * SVG markup captured per breakpoint variant ("ssr-variant hidden-*"
 * signature). The captured data lives in /fills/{en,ar}.json and is
 * fetched lazily ONCE per language (never bundled: ~1.6 MB raw, gzipped
 * over the wire, cached by the browser), then applied by fillContainers.
 */

/* ------------------------------------------------------------------ */
/* lifecycle tracking — prevents cross-navigation leaks                */
/*                                                                     */
/* Every listener / infinite animation / observer created by the       */
/* runtime is registered here and released when the page effect        */
/* re-runs or unmounts. Without this, client-side navigations          */
/* accumulate listeners and rAF loops from every previously visited    */
/* page (verified: 22 addEventListener calls, no removals).            */
/* ------------------------------------------------------------------ */

let GEN = 0;
const CLEANUPS: Array<() => void> = [];

function on<E extends Event>(
  target: EventTarget,
  type: string,
  fn: (e: E) => void,
  opts?: AddEventListenerOptions | boolean
) {
  target.addEventListener(type, fn as EventListener, opts);
  CLEANUPS.push(() => target.removeEventListener(type, fn as EventListener, opts));
}

/** Register an arbitrary teardown (stop an animation, disconnect an observer…). */
function onCleanup(fn: () => void) {
  CLEANUPS.push(fn);
}

const SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;
const WORD_SPRING = { type: "spring", stiffness: 300, damping: 50, mass: 1 } as const;

/* ------------------------------------------------------------------ */
/* per-page appear maps: [selector, delay, initialRotateX?]            */
/* ------------------------------------------------------------------ */

type AppearEntry = [string, number, number?];

const PAGE_APPEAR: Record<string, AppearEntry[]> = {
  home: [
    ['[data-framer-appear-id="16birka"]', 0.2],
    ['[data-framer-appear-id="5hbeit"]', 0.5],
    ['[data-framer-appear-id="j0exq4"]', 0.7],
    ['[data-framer-appear-id="1df8tgi"]', 1.1],
    ['[data-framer-appear-id="1jq7msv"]', 1.2],
    ['[data-framer-appear-id="vh16f5"]', 1.0],
  ],
  about: [
    ['[data-framer-appear-id="1w47gc4"]', 0.2],
    ['[data-framer-appear-id="1epm5vf"]', 0.5],
    ['[data-framer-appear-id="b6y8g6"]', 0.7],
    ['[data-framer-appear-id="2g87xj"]', 1.1],
    ['[data-framer-appear-id="1kehpu3"]', 1.0, 30],
  ],
  portfolio: [
    ['[data-framer-appear-id="127bxxk"]', 0.2],
    ['[data-framer-appear-id="1cbtiid"]', 0.5],
    ['[data-framer-appear-id="5qx8y2"]', 0.7],
    ['[data-framer-appear-id="15iea0f"]', 1.1],
    ['[data-framer-appear-id="1s8q2e8"]', 1.0],
  ],
  contact: [
    ['[data-framer-appear-id="v0gqac"]', 0.2],
    ['[data-framer-appear-id="ngp4ar"]', 0.5],
    ['[data-framer-appear-id="13ympta"]', 0.7],
    ['[data-framer-appear-id="rkm0zu"]', 1.1],
    ['[data-framer-appear-id="4t83n5"]', 1.0],
  ],
  "portfolio-lemonide-tech": [
    ['[data-framer-appear-id="1ruvc2z"]', 0.2],
    ['[data-framer-appear-id="10bkfar"]', 0.5],
    ['[data-framer-appear-id="eo4mtq"]', 1.1],
    ['[data-framer-appear-id="f76vpe"]', 1.3],
    ['[data-framer-appear-id="ktt5yz"]', 1.0],
  ],
};

// the three portfolio detail pages share the same appear ids
PAGE_APPEAR["portfolio-million-one"] = PAGE_APPEAR["portfolio-lemonide-tech"];
PAGE_APPEAR["portfolio-viper-studio"] = PAGE_APPEAR["portfolio-lemonide-tech"];

const FAQ: Array<[string, string]> = [
  [
    "Will we need new software?",
    "Not necessarily. We review the systems you use and the options for integration first.",
  ],
  [
    "Does it work in Arabic and English?",
    "Yes, where the use case requires it. We test quality using representative business content.",
  ],
  [
    "What is needed to start?",
    "A short description of the workflow or problem is enough for an initial discussion.",
  ],
  [
    "How do you handle our data?",
    "We agree on data sources, access permissions, hosting, and security requirements in scope.",
  ],
  [
    "How long does a project take?",
    "It depends on complexity, data readiness, and integrations. We propose a plan after scoping.",
  ],
  [
    "Do you also build products?",
    "Yes. Custom AI is our core focus. We also build specialized products, including Dealplier.",
  ],
];

/* Arabic FAQ (same order — the runtime pairs DOM question i with entry i) */
const FAQ_AR: Array<[string, string]> = [
  [
    "هل نحتاج إلى تغيير أنظمتنا؟",
    "ليس بالضرورة. نراجع أنظمتكم الحالية وإمكانات ربطها قبل تحديد الحل.",
  ],
  [
    "هل يدعم العربية والإنجليزية؟",
    "نعم، وفق متطلبات المشروع، مع اختبار الجودة باستخدام محتوى من بيئة العمل.",
  ],
  [
    "ما المطلوب للبدء؟",
    "يكفي وصف مختصر للإجراء أو التحدي، ثم نحدد المتطلبات معًا.",
  ],
  [
    "كيف تتعاملون مع بياناتنا؟",
    "نحدد مصادر البيانات والصلاحيات والاستضافة ومتطلبات الأمان ضمن نطاق المشروع.",
  ],
  [
    "كم يستغرق تنفيذ المشروع؟",
    "يعتمد على تعقيد الحل وجاهزية البيانات والتكاملات، ونحدد الجدول بعد دراسة النطاق.",
  ],
  [
    "هل تطوّرون منتجات أيضًا؟",
    "نعم. نركز على الحلول المخصصة، ونطوّر منتجات متخصصة من بينها Dealplier.",
  ],
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function sectionByName(root: ParentNode, name: string): HTMLElement | null {
  const els = root.querySelectorAll<HTMLElement>(
    `[data-framer-name="${name}"]`
  );
  return els.length ? els[0] : null;
}

/*
 * The About-Us support cards (framer-p4mmvm-container): the three breakpoint
 * variants of EACH card are adjacent in the DOM, so the generic DOM-order
 * cycling picks the wrong icons. Fill them by the card's Grey Linear Tag
 * text instead (Assist / Guide / Resolve), exactly as the original shows.
 */
function fixAboutCardIcons(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>(".framer-p4mmvm-container")
    .forEach((el) => {
      if (el.querySelector("svg")) return;
      const card = el.closest('[data-framer-name="Primary"]');
      if (!card) return;
      const tag = [...card.querySelectorAll("p")].find((p) =>
        /^(Assist|Guide|Resolve)$/.test(p.textContent?.trim() || "")
      );
      const fill = tag ? ABOUT_CARD_ICONS[tag.textContent!.trim()] : null;
      if (fill) el.innerHTML = fill;
    });
}

/* ------------------------------------------------------------------ */
/* SVG sprite (SSR-injected; runtime only as a fallback) + RTL glyphs  */
/* ------------------------------------------------------------------ */

function ensureSprite(root: ParentNode) {
  if (document.getElementById("svg-templates")) return;
  const holder = document.createElement("div");
  holder.id = "svg-templates";
  holder.style.display = "none";
  holder.innerHTML = SVG_TEMPLATES;
  // appended (not prepended) so :first-child/:nth-child CSS of the page
  // root is never affected by the sprite holder
  root.appendChild(holder);
}

// The Phosphor arrow-up-right (↗) on the service cards reads "backwards"
// in an RTL page — mirror it to ↖ (scaleX(-1)) so it points with the
// Arabic reading flow, matching the card's already-mirrored position.
function flipRtlArrows(root: ParentNode) {
  if (document.documentElement.dir !== "rtl") return;
  const UP_RIGHT = "M200,64V168a8,8,0,0,1-16,0V83.31L69.66";
  root.querySelectorAll<SVGPathElement>("svg path").forEach((pth) => {
    if (!(pth.getAttribute("d") || "").startsWith(UP_RIGHT)) return;
    const svg = pth.closest("svg");
    if (svg && !svg.getAttribute("style")?.includes("scaleX")) {
      svg.style.transform = "scaleX(-1)";
    }
  });
}

/*
 * Breakpoint-variant signature of an element: the nearest ancestor with an
 * "ssr-variant" class contributes its sorted `hidden-*` classes. The fills
 * JSON keys containers by exactly this signature, so each breakpoint gets
 * its captured icon set.
 */
function variantSig(el: HTMLElement): string {
  let n: HTMLElement | null = el;
  while (n && n !== document.body) {
    const cn = n.className?.toString?.() || "";
    if (cn.includes("ssr-variant")) {
      return cn
        .split(" ")
        .filter((c) => c.startsWith("hidden-"))
        .sort()
        .join(" ");
    }
    n = n.parentElement;
  }
  return "";
}

/*
 * Lazily fetch + cache the captured container fills for one language.
 * The JSON (~1.6 MB raw, heavily gzippable) is served from /fills/ as a
 * static asset with immutable caching — never re-downloaded on navigation
 * and never part of the JS bundle.
 */
type FillsByClass = Record<string, Record<string, string[]>>;
const FILLS_CACHE: Record<string, FillsByClass | null> = {};
let FILLS_INFLIGHT: Record<string, Promise<FillsByClass | null>> = {};

function buildFills(
  data: Record<string, string[]>,
  target: FillsByClass
): void {
  Object.entries(data).forEach(([k, list]) => {
    const i = k.indexOf("|");
    const cls = k.slice(0, i);
    const sig = k.slice(i + 1);
    (target[cls] ||= {})[sig] = list;
  });
}

function loadFills(lang: SiteLang): Promise<FillsByClass | null> {
  if (FILLS_CACHE[lang]) return Promise.resolve(FILLS_CACHE[lang]);
  FILLS_INFLIGHT[lang] ||= fetch(`/fills/${lang}.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((data: Record<string, string[]>) => {
      const target: FillsByClass = {};
      buildFills(data, target);
      FILLS_CACHE[lang] = target;
      return target;
    })
    .catch(() => {
      FILLS_CACHE[lang] = null;
      return null;
    })
    .finally(() => {
      delete FILLS_INFLIGHT[lang];
    });
  return FILLS_INFLIGHT[lang];
}

/*
 * Fill empty "framer-*-container" slots with their captured SVG content —
 * the icon tiles, service-card arrows (↗) and logo marks missing from the
 * static export. Consumes the fills per (class, variant) in DOM order: the
 * SSR markup order matches the original site, so the Nth empty slot gets
 * the Nth captured fill.
 */
function fillContainers(
  root: ParentNode,
  fillsByClass: FillsByClass | null
): void {
  if (!fillsByClass) return;

  const counters = new Map<string, number>();
  root.querySelectorAll<HTMLElement>('div[class*="-container"]').forEach(
    (el) => {
      const cls = (
        el.className.toString().match(/framer-[\w-]+-container/) || [""]
      )[0];
      if (
        !cls ||
        // glow canvases are painted by the LightRays painter instead
        (cls in LIGHT_RAYS_HOSTS)
      )
        return;
      const bySig = fillsByClass[cls];
      if (!bySig) return;

      const needFill =
        !el.querySelector("svg,img,video,canvas,iframe,source") &&
        (el.textContent || "").trim().length === 0;
      if (!needFill) return;

      const sig = variantSig(el);
      const list =
        bySig[sig] ?? bySig[""] ?? Object.values(bySig)[0] ?? [];
      if (!list.length) return;

      const ck = cls + "|" + sig;
      const idx = counters.get(ck) ?? 0;
      counters.set(ck, idx + 1);
      el.innerHTML = list[idx % list.length];
    }
  );
}

/* ------------------------------------------------------------------ */
/* word-by-word reveal                                                 */
/* ------------------------------------------------------------------ */

function isFramerToken(el: Element): boolean {
  if (el.tagName !== "SPAN") return false;
  const s = (el as HTMLElement).style;
  return s.opacity === "0.001" && (s.filter ?? "").includes("blur");
}

function setupWordReveal(root: ParentNode) {
  /*
   * The original Framer runtime only applies the word-appear effect to text
   * components that carry it — and it pre-tokenizes EXACTLY those in the SSR
   * HTML (spans with opacity 0.001 + blur). Every other text ships plain and
   * never animates. So we only animate pre-tokenized elements: no guessing,
   * no over-animation, identical to the original.
   */
  const targets: HTMLElement[] = [];
  const seen = new Set<Element>();

  root
    .querySelectorAll<HTMLElement>("section p, section h1, section h2, section h3, section h4")
    .forEach((el) => {
      if (seen.has(el)) return;
      if ([...targets].some((t) => t !== el && t.contains(el))) return;
      const framerTokens = [...el.querySelectorAll<HTMLElement>("span")].filter(isFramerToken);
      if (framerTokens.length === 0) return; // no effect configured → static text
      seen.add(el);
      targets.push(el);
    });

  targets.forEach((el, idx) => {
    const words = [...el.querySelectorAll<HTMLElement>("span")].filter(isFramerToken);
    if (!words.length) return;
    const startDelay = idx % 2 === 0 ? 0 : 0.2;

    // Choose an observable element + threshold that can actually trigger:
    // - the paragraph itself when it has a box (normal case);
    // - a rendered descendant when the paragraph is display:contents
    //   (zero box, never intersects);
    // - threshold 0 when the only box available is huge (tall section).
    const vh = window.innerHeight || 800;
    let obs: HTMLElement = el;
    let threshold = 0.5;
    if (obs.getBoundingClientRect().height === 0) {
      const desc = el.querySelector<HTMLElement>("span");
      if (desc && desc.getBoundingClientRect().height > 0) {
        obs = desc;
      } else {
        let node = el.parentElement;
        while (
          node &&
          node !== document.body &&
          (node.getBoundingClientRect().height === 0 ||
            node.getBoundingClientRect().height > vh * 1.5)
        ) {
          node = node.parentElement;
        }
        obs = node && node !== document.body ? node : el;
      }
    }
    if (obs.getBoundingClientRect().height > vh * 1.5) threshold = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          onCleanup(() => io.disconnect());
          words.forEach((w, i) => {
            animate(
              w,
              { opacity: [0.001, 1], y: [10, 0], filter: ["blur(10px)", "blur(0px)"] },
              { ...WORD_SPRING, delay: startDelay + i * 0.05 }
            );
          });
        });
      },
      { threshold }
    );

    io.observe(obs);
  });
}

/* ------------------------------------------------------------------ */
/* per-page appear sequence                                            */
/* ------------------------------------------------------------------ */

function setupAppear(page: string, root: ParentNode) {
  const entries = PAGE_APPEAR[page];
  if (!entries) return;

  entries.forEach(([selector, delay, initialRotateX]) => {
    // Framer SSR duplicates appear elements across breakpoint variants —
    // animate every match so resize variants are never stuck hidden.
    const els = [...root.querySelectorAll<HTMLElement>(selector)];
    if (!els.length) return;

    els.forEach((el) => {
      if (initialRotateX) {
        el.style.transform = `perspective(4000px) rotateX(${initialRotateX}deg)`;
        animate(
          el,
          { opacity: [0.001, 1], rotateX: [initialRotateX, 0] },
          { ...SPRING, delay }
        );
        return;
      }

      el.style.opacity = "0.001";
      animate(el, { opacity: [0.001, 1] }, { ...SPRING, delay });
    });
  });

  // home hero background: opacity .001 + scale 1.1 → spring(duration 3, bounce 0)
  // (every breakpoint variant instance — the visible one differs per viewport)
  if (page === "home") {
    root
      .querySelectorAll<HTMLElement>('[data-framer-appear-id="cjfzm3"]')
      .forEach((bg) => {
        bg.style.opacity = "0.001";
        bg.style.transform = "scale(1.1)";
        animate(
          bg,
          { opacity: [0.001, 1], scale: [1.1, 1] },
          { type: "spring", duration: 3, bounce: 0 }
        );
      });
  }
}

/* ------------------------------------------------------------------ */
/* scroll-linked char fill (exact Framer "Qt" component)               */
/* ------------------------------------------------------------------ */

function setupScrollReveal(root: ParentNode) {
  const paragraphs = [...root.querySelectorAll<HTMLElement>("p")].filter((p) => {
    const style = p.getAttribute("style") || "";
    return style.includes("#666666") && style.includes("flex");
  });
  if (!paragraphs.length) return;

  const START_INDEX = 40; // original: transitionStartIndex 40
  const WORD_START_INDEX = 5; // word-level (Arabic): first 5 words white, mirrors EN prefix

  paragraphs.forEach((el) => {
    el.classList.add("nb-reveal-text");

    const wordSpans = [...el.children].filter(
      (c) => c.tagName === "SPAN"
    ) as HTMLElement[];
    if (!wordSpans.length) return;

    const N = wordSpans.length;
    const chars: { span: HTMLElement; start: number; end: number; index: number }[] =
      [];
    let charIndex = 0;
    let wordLevel = false;

    wordSpans.forEach((ws, L) => {
      const starting = L / N;
      const ending = (L + 1) / N;
      const cSpans = [...ws.children].filter(
        (c): c is HTMLElement => c.tagName === "SPAN" && !!(c as HTMLElement).style.color
      );
      if (!cSpans.length) {
        // Word-level paragraphs (Arabic): splitting the joined Arabic script
        // into per-char spans would break letter shaping, so the whole word
        // is the smallest safe unit — it fades 666→fff inside its own
        // window. Gradient/clip-text words (e.g. "Evexa") keep their style.
        wordLevel = true;
        const isGradient =
          !!ws.style.backgroundImage ||
          ws.style.webkitBackgroundClip === "text" ||
          ws.style.color === "transparent";
        if (!isGradient) {
          chars.push({ span: ws, start: starting, end: ending, index: L });
          ws.style.transition = "color 0.3s ease-in-out";
        }
        return;
      }
      const len = cSpans.length;
      const cr = (ending - starting) / len;
      cSpans.forEach((cs, i) => {
        chars.push({
          span: cs,
          start: starting + cr * i,
          end: starting + cr * (i + 1),
          index: charIndex + i,
        });
        cs.style.transition = "color 0.3s ease-in-out";
      });
      charIndex += len + 1;
    });

    const startIdx = wordLevel ? WORD_START_INDEX : START_INDEX;

    const mix = (t: number) => {
      const v = Math.round(0x66 + (0xff - 0x66) * t);
      return `rgb(${v}, ${v}, ${v})`;
    };

    const paint = (progress: number) => {
      chars.forEach(({ span, start, end, index }) => {
        if (index < startIdx) {
          span.style.color = "#FFFFFF";
          return;
        }
        const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        span.style.color = mix(t);
      });
    };

    paint(0);
    // Scroll-linked progress, computed manually. framer-motion's scroll()
    // fails silently here: the Framer-exported containers are position:static,
    // so its offset math bails out (console warning "non-static position")
    // and the progress callback never fires — the text never lit up.
    // Same semantics as offset ["start 0.75", "start 0.15"]:
    //   progress 0 when the paragraph top = 75% of viewport height,
    //   progress 1 when the paragraph top = 15% of viewport height.
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (0.75 * vh - r.top) / (0.6 * vh)));
      paint(p);
    };
    let raf = 0;
    const onScrollPaint = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    on(window, "scroll", onScrollPaint, { passive: true });
    on(window, "resize", onScrollPaint);
    update();
  });
}

/* ------------------------------------------------------------------ */
/* tickers (marquees)                                                  */
/*                                                                     */
/* Measured from the original published site:                          */
/*  - word-chip rows (AI bento card): ~22px/s, directions alternate     */
/*    per row starting RIGHT (row1 →, row2 ←, row3 → …)                */
/*  - all other tickers (hero strip, wide marquees): ~24px/s, leftward  */
/* ------------------------------------------------------------------ */

const TICKER_SPEED_GENERIC = 24;
const TICKER_SPEED_WORDS = 22;

function setupTickers(root: ParentNode) {
  // word-chip rows alternate direction per visible row, first row → right
  const wordRows: HTMLElement[] = [];

  root.querySelectorAll<HTMLElement>("section").forEach((sec) => {
    if (sec.style.opacity !== "0") return;
    const list = sec.querySelector("ul, ol");
    if (!list) return;
    sec.style.opacity = "1";
    const lis = list.querySelectorAll("li");
    const isWordRow =
      lis.length > 0 &&
      !list.querySelector("li img") &&
      (list.textContent || "").trim().length > 0;
    if (isWordRow && sec.offsetParent) wordRows.push(list as HTMLElement);
    startMarquee(
      list as HTMLElement,
      sec,
      isWordRow ? { speed: TICKER_SPEED_WORDS } : { speed: TICKER_SPEED_GENERIC }
    );
  });

  wordRows.forEach((list, i) => {
    if (i % 2 === 0) list.classList.add("nb-marquee-right");
  });

  root
    .querySelectorAll<HTMLElement>('[data-framer-name="Ticker"]')
    .forEach((ticker) => {
      const list = ticker.querySelector("ul, ol");
      if (list) {
        startMarquee(list as HTMLElement, ticker, {
          speed: TICKER_SPEED_GENERIC,
        });
        return;
      }
      const inner = ticker.firstElementChild as HTMLElement | null;
      if (!inner || ticker.dataset.nbTicker) return;
      ticker.dataset.nbTicker = "1";
      const track = document.createElement("div");
      track.className = "nb-ticker-track";
      while (inner.firstChild) track.appendChild(inner.firstChild);
      inner.appendChild(track);
      inner.classList.add("nb-ticker-viewport");
      const clone = track.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      inner.appendChild(clone);
      requestAnimationFrame(() => {
        const w = track.scrollWidth || 1;
        const duration = Math.max(6, w / TICKER_SPEED_GENERIC);
        inner.querySelectorAll<HTMLElement>(".nb-ticker-track").forEach((t) => {
          t.style.animationDuration = `${duration}s`;
        });
      });
    });
}

function startMarquee(
  list: HTMLElement,
  viewport: HTMLElement,
  opts: { speed?: number } = {}
) {
  if (list.dataset.nbMarquee) return;
  list.dataset.nbMarquee = "1";
  viewport.classList.add("nb-ticker-viewport");
  list.classList.add("nb-ticker-track");

  // Measure inside rAF (layout settled), then clone whole content sets until
  // the track covers the viewport plus one set — with only two copies a wide
  // viewport outruns the track and the strip runs dry on the right for most
  // of each cycle (measured 428px hole @1200px). The shift is expressed as a
  // percentage of the track's own (max-content) width — exactly one set —
  // so the loop stays seamless at any breakpoint without re-measuring.
  const items = [...list.children];

  requestAnimationFrame(() => {
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const setW =
      items.reduce((s, k) => s + k.getBoundingClientRect().width, 0) +
      gap * items.length;
    const vpW = viewport.clientWidth;
    const copies =
      vpW > 0 && setW > 0 ? Math.max(2, Math.ceil((vpW + setW) / setW)) : 2;
    for (let c = 1; c < copies; c++) {
      items.forEach((li) => {
        const clone = li.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        list.appendChild(clone);
      });
    }
    // RTL pages lay the track out right-aligned inside the viewport, so the
    // marquee must travel rightward (positive shift) to keep the far edge
    // covered — mirroring the LTR leftward motion.
    const rtl = getComputedStyle(list).direction === "rtl";
    list.style.setProperty("--nb-shift", `${rtl ? "" : "-"}${100 / copies}%`);
    list.style.setProperty("--nb-gap", `${gap}px`);
    const duration = Math.max(6, setW / (opts.speed ?? TICKER_SPEED_GENERIC));
    list.style.animationDuration = `${duration}s`;
  });
}

/* ------------------------------------------------------------------ */
/* audio waves — Speech Recognition card playback loop                  */
/*                                                                     */
/* Exact original behaviour (framer-hK4SY "Audio Waves", Start/Stop):  */
/*  Start state: mask 2px wide (all bars grey), playhead at left:0.     */
/*  After 1s → switch to Stop: mask grows 2px→100% and the purple       */
/*  playhead line (with diamond) rides the wipe front over 10s linear.  */
/*  After the sweep → instant reset to Start. Loop = 11s.               */
/* ------------------------------------------------------------------ */

const WAVE_SWEEP_MS = 10000;
const WAVE_REST_MS = 1000;

function setupAudioWaves(root: ParentNode) {
  const waves = [...root.querySelectorAll<HTMLElement>(".framer-hK4SY")];
  const states = waves
    .map((el) => {
      if ((el as any).__nbWave) return null;
      (el as any).__nbWave = true;
      return {
        el,
        mask: el.querySelector<HTMLElement>(".framer-qjsdc9"),
        line: el.querySelector<HTMLElement>(".framer-skmche"),
        anims: [] as Animation[],
        timer: 0 as number,
      };
    })
    .filter((s): s is NonNullable<typeof s> => !!s && !!s.mask && !!s.line);
  if (!states.length) return;

  // RTL: mirror the whole bar strip (symmetric bars) so the wipe + playhead
  // travel right→left with the Arabic reading direction. Animating the
  // inner `left` values directly fights the RTL over-constrained box
  // resolution (left is ignored when right is set), so a container mirror
  // is the robust equivalent.
  if (document.documentElement.dir === "rtl") {
    states.forEach((s) => {
      s.el.style.transform = "scaleX(-1)";
    });
  }

  const reset = (s: (typeof states)[number]) => {
    s.anims.forEach((a) => a.cancel());
    s.anims = [];
    s.mask!.style.width = "";
    s.line!.style.left = "";
  };

  const sweep = (s: (typeof states)[number]) => {
    if (!s.el.isConnected || !s.el.offsetParent) return; // hidden SSR variant
    const w = s.el.getBoundingClientRect().width;
    if (!w) return;
    // playhead ends at calc(99.51456310679615% - 2px/2) of the waves root
    const endLeft = w * 0.99514556310679615 - 2;
    s.mask!.style.width = "2px";
    s.line!.style.left = "0px";
    s.anims = [
      s.mask!.animate(
        [{ width: "2px" }, { width: `${w}px` }],
        { duration: WAVE_SWEEP_MS, easing: "linear", fill: "forwards" }
      ),
      s.line!.animate(
        [{ left: "0px" }, { left: `${endLeft}px` }],
        { duration: WAVE_SWEEP_MS, easing: "linear", fill: "forwards" }
      ),
    ];
  };

  const cycle = (s: (typeof states)[number]) => {
    if (!s.el.isConnected) return;
    reset(s);
    s.timer = window.setTimeout(() => {
      sweep(s);
      s.timer = window.setTimeout(() => cycle(s), WAVE_SWEEP_MS + 1);
    }, WAVE_REST_MS);
  };

  states.forEach(cycle);
}

/* ------------------------------------------------------------------ */
/* integration curves — SVG path shimmer                                */
/*                                                                     */
/* Original "SVG Path Shimmer" component per curve:                     */
/*  base path: rgba(255,255,255,0.15), 1.5px, round caps                */
/*  shimmer path: purple rgba(0, 49, 213), pathLength 100,                */
/*  strokeDasharray "30 100", dashoffset animated linearly over 2s      */
/*  (first curve default 160→30, the other five reverse 30→160),        */
/*  0.3s delay between loops, endless. Pulse flows icon → stack icon.   */
/* ------------------------------------------------------------------ */

const SHIMMER_DASH = 30;
const SHIMMER_FROM = 100 + SHIMMER_DASH * 2; // 160
const SHIMMER_TO = SHIMMER_DASH; // 30
const SHIMMER_SWEEP_MS = 2000;
const SHIMMER_GAP_MS = 300;

function setupCurveShimmers(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>('[data-framer-name="SVG Path"]')
    .forEach((wrapper) => {
      const paths = [
        ...wrapper.querySelectorAll<SVGPathElement>('path[pathLength="100"]'),
      ];
      if (!paths.length) return;
      paths.forEach((path, i) => {
        if ((path as any).__nbShimmer) return;
        (path as any).__nbShimmer = true;
        const reverse = i > 0; // first curve "default", rest "reverse"
        const kfs = reverse
          ? [
              { strokeDashoffset: SHIMMER_TO, offset: 0 },
              {
                strokeDashoffset: SHIMMER_FROM,
                offset: SHIMMER_SWEEP_MS /
                  (SHIMMER_SWEEP_MS + SHIMMER_GAP_MS),
              },
              { strokeDashoffset: SHIMMER_FROM, offset: 1 },
            ]
          : [
              { strokeDashoffset: SHIMMER_FROM, offset: 0 },
              {
                strokeDashoffset: SHIMMER_TO,
                offset: SHIMMER_SWEEP_MS /
                  (SHIMMER_SWEEP_MS + SHIMMER_GAP_MS),
              },
              { strokeDashoffset: SHIMMER_TO, offset: 1 },
            ];
        path.animate(kfs, {
          duration: SHIMMER_SWEEP_MS + SHIMMER_GAP_MS,
          iterations: Infinity,
          easing: "linear",
        });
      });
    });
}

/* ------------------------------------------------------------------ */
/* FAQ accordion — exact original "FAQ/FAQ Single" component           */
/*                                                                     */
/* (chunk-W2X7TJDH.mjs): tap toggles Question ↔ Answer variants with   */
/* spring { stiffness: 500, damping: 60, mass: 1 }. On open:           */
/*   • the 24×24 plus-icon holder rotates 0 → 45°                      */
/*   • card border-color rgba(255,255,255,.07) → .15                   */
/*   • a 17px gap appears and the answer (DM Sans 16px, white 50%)     */
/*     expands below the row.                                          */
/* ------------------------------------------------------------------ */

const FAQ_SPRING = { type: "spring", stiffness: 500, damping: 60, mass: 1 } as const;

function setupFaq(root: ParentNode, lang: SiteLang = "en") {
  const faq = lang === "ar" ? FAQ_AR : FAQ;
  const faqSection = sectionByName(root, "FAQ");
  if (!faqSection) return;

  const cards = [
    ...faqSection.querySelectorAll<HTMLElement>(
      '[data-framer-name="Question"][tabindex="0"]'
    ),
  ];

  cards.forEach((card, i) => {
    if ((card as any).__nbFaq) return;
    (card as any).__nbFaq = true;
    const q = faq[i % faq.length];
    if (!q) return;
    const row = card.querySelector<HTMLElement>('[data-framer-name="Row"]');
    if (!row) return;
    card.style.cursor = "pointer";

    /* icon holder — the small 24×24 container at the end of the Row
       (framer-gzi45z-container). Rotate THE HOLDER only, never the row. */
    let icon =
      row.querySelector<HTMLElement>(".framer-gzi45z-container") ??
      (row.lastElementChild as HTMLElement | null);
    if (icon && !icon.querySelector("svg") && !icon.querySelector(".nb-faq-icon")) {
      const el = document.createElement("div");
      el.className = "nb-faq-icon";
      icon.appendChild(el);
    }

    /* answer — mounted below the Row (Framer only renders it in the open
       state); 17px gap via padding-top, text = preset-x0s9r5 white 50% */
    const answer = document.createElement("div");
    answer.className = "nb-faq-answer";
    answer.style.height = "0px";
    answer.style.opacity = "0";
    const p = document.createElement("p");
    p.className = "framer-text framer-styles-preset-x0s9r5 nb-faq-text";
    p.style.cssText =
      "--framer-text-color:rgba(255,255,255,0.5);padding:17px 0 0 0;margin:0;";
    p.textContent = q[1];
    answer.appendChild(p);
    card.appendChild(answer);

    /* resolve the CSS-var border colors to plain rgba strings so
       framer-motion can interpolate them */
    if (!card.style.getPropertyValue("--border-color").includes("rgba")) {
      card.style.setProperty("--border-color", "rgba(255, 255, 255, 0.07)");
    }

    let open = false;
    on(card, "click", () => {
      open = !open;
      if (open) {
        const h = p.scrollHeight;
        animate(answer, { height: [0, h], opacity: [0, 1] }, FAQ_SPRING);
        animate(
          card,
          { "--border-color": "rgba(255, 255, 255, 0.15)" } as any,
          FAQ_SPRING
        );
      } else {
        animate(answer, { height: [answer.scrollHeight, 0], opacity: [1, 0] }, FAQ_SPRING);
        animate(
          card,
          { "--border-color": "rgba(255, 255, 255, 0.07)" } as any,
          FAQ_SPRING
        );
      }
      if (icon) animate(icon, { rotate: open ? 45 : 0 }, FAQ_SPRING);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Circle Ticker wheel (the "Packed with Innovation" arc)              */
/*                                                                     */
/* Original loop config (page-home.mjs):                               */
/*   __framer__loop: { rotate: 360 }                                   */
/*   __framer__loopTransition: { delay: 0, duration: 50,               */
/*                               ease: [0,0,1,1], type: "tween" }      */
/*   repeatType: "loop", repeatDelay: 0 — a full turn every 50s.       */
/* ------------------------------------------------------------------ */

function setupCircleTicker(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>('[data-framer-name="Circle"]')
    .forEach((circle) => {
      if ((circle as any).__nbWheel) return;
      (circle as any).__nbWheel = true;
      const ctrl = animate(
        circle,
        { rotate: [0, 360] },
        { duration: 50, ease: [0, 0, 1, 1], repeat: Infinity, repeatDelay: 0 }
      );
      onCleanup(() => ctrl.stop());
    });
}

/* ------------------------------------------------------------------ */
/* Pulse rings behind the integrations logo ticker                     */
/*                                                                     */
/* Three purple 74px circles loop: opacity 1→0, scale 1→2.8/3/3.2,     */
/* rotate 0→360, tween 2s ease [0.44,0,0.56,1] with 0.5s delay and     */
/* repeat delays .2/.1/0 (page-home.mjs: wl/bl/vl + Ba).               */
/* ------------------------------------------------------------------ */

const PULSE_RINGS: Array<{ cls: string; scale: number; repeatDelay: number }> = [
  { cls: "framer-12ga4v9", scale: 2.8, repeatDelay: 0.2 },
  { cls: "framer-nkdin0", scale: 3, repeatDelay: 0.1 },
  { cls: "framer-u6tfun", scale: 3.2, repeatDelay: 0 },
];

function setupPulses(root: ParentNode) {
  PULSE_RINGS.forEach(({ cls, scale, repeatDelay }) => {
    root.querySelectorAll<HTMLElement>(`.` + cls).forEach((el) => {
      if ((el as any).__nbPulse) return;
      (el as any).__nbPulse = true;
      if (!el.offsetParent) return; // hidden breakpoint variant
      const ctrl = animate(
        el,
        { opacity: [1, 0], scale: [1, scale], rotate: [0, 360] },
        {
          duration: 2,
          ease: [0.44, 0, 0.56, 1],
          delay: 0.5,
          repeat: Infinity,
          repeatDelay,
        }
      );
      onCleanup(() => ctrl.stop());
    });
  });
}

/* ------------------------------------------------------------------ */
/* Custom cursor — the original Framer cursor system                   */
/*                                                                     */
/* The page root registers cursor "1bf4dyq": a white 14px dot that     */
/* follows the pointer (spring 400/60, positioned bottom-center of the */
/* pointer), native cursor stays visible. Portfolio/next-project cards */
/* register "8bnwio"/"850utj": the pill variant — white "View Now"     */
/* (DM Sans 700 16px #131313, radius 45px, padding 5px 15px, shadow    */
/* 0 4px 12px rgba(0,0,0,.1)) centered ON the pointer while the native */
/* cursor is hidden. Variant change spring { bounce: .2, duration:.4 } */
/* Opacity: tween .2s in on move, out on mouseleave. Off on touch.     */
/* ------------------------------------------------------------------ */

const CURSOR_PILL_IDS = new Set(["8bnwio", "850utj"]);

function cursorIdAt(x: number, y: number): string | null {
  let n = document.elementFromPoint(x, y) as HTMLElement | null;
  while (n) {
    const c = n.getAttribute?.("data-framer-cursor");
    if (c) return c;
    n = n.parentElement;
  }
  return null;
}

function setupCursor() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(any-hover: none)").matches) return;
  if (document.getElementById("nb-cursor")) return;

  const VARIANT_SPRING = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

  /* dot (default) */
  const dot = document.createElement("div");
  dot.id = "nb-cursor";
  dot.style.cssText =
    "position:fixed;top:0;left:0;width:14px;height:14px;border-radius:20px;" +
    "background:#FFFFFF;box-shadow:none;z-index:13;pointer-events:none;opacity:0;" +
    "will-change:transform;margin:-0px 0 0 -7px;";
  document.body.appendChild(dot);

  /* pill (hover variant) */
  const pill = document.createElement("div");
  pill.id = "nb-cursor-pill";
  pill.setAttribute("data-framer-name", "Hover");
  pill.style.cssText =
    "position:fixed;top:0;left:0;z-index:13;pointer-events:none;opacity:0;" +
    "display:flex;align-items:center;justify-content:center;white-space:pre;" +
    "background-color:#FFFFFF;border-radius:45px;padding:5px 15px 5px 15px;" +
    "box-shadow:0px 4px 12px 0px rgba(0,0,0,0.1);will-change:transform;";
  const pillText = document.createElement("p");
  pillText.className = "nb-cursor-text";
  pillText.textContent = "View Now";
  pill.appendChild(pillText);
  document.body.appendChild(pill);

  let raf = 0;
  const g = GEN;
  let px = -100, py = -100; // pointer
  let x = -100, y = -100;   // dot spring state
  let vx = 0, vy = 0;
  let last = 0;
  let pillX = -100, pillY = -100;
  let mode: "dot" | "pill" | null = null;
  let visible = false;

  onCleanup(() => {
    cancelAnimationFrame(raf);
    dot.remove();
    pill.remove();
    document.body.classList.remove("framer-cursor-none");
  });

  /* spring integrator (stiffness 400, damping 60, mass 1) */
  const stepSpring = (
    pos: number, vel: number, target: number, dt: number
  ): [number, number] => {
    const stiffness = 400, damping = 60, mass = 1;
    const F = -stiffness * (pos - target) - damping * vel;
    const a = F / mass;
    const nVel = vel + a * dt;
    const nPos = pos + nVel * dt;
    return [nPos, nVel];
  };

  const frame = (now: number) => {
    if (g !== GEN) return; // page changed — stop the loop
    const dt = Math.min(0.032, (now - last) / 1000) || 0.016;
    last = now;

    if (mode === "pill") {
      pillX = px;
      pillY = py;
      pill.style.transform = `translate(${pillX}px, ${pillY}px) translate(-50%, -50%)`;
    } else {
      [x, vx] = stepSpring(x, vx, px, dt);
      [y, vy] = stepSpring(y, vy, py, dt);
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0%)`;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  last = performance.now();

  const show = () => {
    if (visible) return;
    visible = true;
    const el = mode === "pill" ? pill : dot;
    animate(el, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    animate(dot, { opacity: 0 }, { duration: 0.2, ease: "linear" });
    animate(pill, { opacity: 0 }, { duration: 0.2, ease: "linear" });
  };

  const setMode = (next: "dot" | "pill") => {
    if (mode === next) return;
    const prev = mode;
    mode = next;
    if (next === "pill") {
      // pill grows out of the dot (variant spring, origin at pointer)
      const w = pill.offsetWidth || 100;
      const h = pill.offsetHeight || 36;
      pill.style.transformOrigin = "center";
      animate(pill, { opacity: [0, 1], scaleX: [14 / w, 1], scaleY: [14 / h, 1] }, VARIANT_SPRING);
      animate(dot, { opacity: [1, 0] }, { duration: 0.15, ease: "linear" });
      document.body.classList.add("framer-cursor-none");
      x = px; y = py; vx = 0; vy = 0;
    } else {
      animate(dot, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
      animate(pill, { opacity: [1, 0], scaleX: 14 / (pill.offsetWidth || 100) }, { duration: 0.15, ease: "linear" });
      document.body.classList.remove("framer-cursor-none");
    }
    void prev;
  };

  let modeRaf = 0;
  on(
    window,
    "pointermove",
    (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      show();
      // rate-limit the elementFromPoint walk
      if (!modeRaf) {
        modeRaf = requestAnimationFrame(() => {
          modeRaf = 0;
          const id = cursorIdAt(px, py);
          setMode(id && CURSOR_PILL_IDS.has(id) ? "pill" : "dot");
        });
      }
    },
    { passive: true }
  );

  /* pressed state — the dot shrinks to 10px (pressed gesture on Default) */
  on(window, "pointerdown", () => {
    if (mode !== "dot") return;
    animate(dot, { width: 10, height: 10, margin: "-0px 0 0 -5px" }, VARIANT_SPRING);
  });
  on(window, "pointerup", () => {
    if (mode !== "dot") return;
    animate(dot, { width: 14, height: 14, margin: "-0px 0 0 -7px" }, VARIANT_SPRING);
  });

  on(document.documentElement, "mouseleave", hide);
  on(window, "blur", hide);
}

/* ------------------------------------------------------------------ */
/* Hover interactions — every hover variant of the original, with its  */
/* exact spring transition:                                            */
/*   • Purple buttons: boxShadow 0 → 0 0 0 5px rgba(0, 49, 213,.3)      */
/*     (spring 200/60)                                                 */
/*   • Grey / White buttons: opacity → .6 (spring 200/60)              */
/*   • Subscribe button: purple glow + label #C4C4C4 (spring 400/60)   */
/*   • Contact submit: purple glow + label #C4C4C4                     */
/*   • Nav/footer text links: label opacity .6 → 1 (spring 400/60)     */
/*   • Service cards: arrow opacity .2 → 1 (spring 200/60)             */
/*   • Service small cards: social icon opacity .6 → 1                 */
/*   • Support cards: social icon opacity .2 → .9                      */
/*   • Portfolio / next-project cards: image scale 1 → 1.1             */
/*     (spring 250/60)                                                 */
/* ------------------------------------------------------------------ */

function bindHover(
  el: Element | null,
  enter: (el: HTMLElement) => void,
  leave: (el: HTMLElement) => void,
  id = "__nbHover"
) {
  if (!el) return;
  if ((el as any)[id]) return;
  (el as any)[id] = true;
  on(el, "pointerenter", () => enter(el as HTMLElement));
  on(el, "pointerleave", () => leave(el as HTMLElement));
}

function setupHovers(root: ParentNode) {
  const SPRING200 = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;
  const SPRING250 = { type: "spring", stiffness: 250, damping: 60, mass: 1 } as const;
  const SPRING400 = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;

  /* purple buttons — glow ring on hover */
  root
    .querySelectorAll<HTMLElement>('a[data-framer-name="Purple"]')
    .forEach((btn) => {
      bindHover(
        btn,
        (el) =>
          animate(
            el,
            { boxShadow: "0px 0px 0px 5px rgba(0, 49, 213, 0.3)" },
            SPRING200
          ),
        (el) =>
          animate(
            el,
            { boxShadow: "0px 0px 0px 0px rgba(0, 49, 213, 0.3)" },
            SPRING200
          )
      );
    });

  /* grey / white buttons — dim to .6 */
  root
    .querySelectorAll<HTMLElement>(
      'a[data-framer-name="Grey"], a[data-framer-name="White"]'
    )
    .forEach((btn) => {
      bindHover(
        btn,
        (el) => animate(el, { opacity: 0.6 }, SPRING200),
        (el) => animate(el, { opacity: 1 }, SPRING200)
      );
    });

  /* subscribe / submit buttons — purple glow + label #C4C4C4 */
  root
    .querySelectorAll<HTMLElement>(
      'form button[type="submit"], form button:not([type])'
    )
    .forEach((btn) => {
      const base = getComputedStyle(btn).boxShadow;
      const label = btn.querySelector("p, span") as HTMLElement | null;
      bindHover(
        btn,
        (el) => {
          animate(
            el,
            {
              boxShadow:
                "0px 0.6021873017743928px 3.010936508871964px 0px rgba(0, 49, 213, 0.04), 0px 2.288533303243457px 11.442666516217285px 0px rgba(0, 49, 213, 0.16), 0px 10px 50px 0px rgba(0, 49, 213, 0.7)",
            },
            SPRING400
          );
          if (label) animate(label, { color: "rgb(196, 196, 196)" }, SPRING400);
        },
        (el) => {
          animate(el, { boxShadow: base }, SPRING400);
          if (label)
            animate(label, { color: "rgb(255, 255, 255)" }, SPRING400);
        }
      );
    });

  /* nav / footer text links — label opacity .6 → 1 */
  root
    .querySelectorAll<HTMLElement>(
      'a.framer-i9k05o[data-framer-name="In-Active"]'
    )
    .forEach((link) => {
      const label = link.querySelector<HTMLElement>(
        ":scope > div, :scope > p, :scope > span"
      );
      if (!label) return;
      bindHover(
        link,
        () => animate(label, { opacity: 1 }, SPRING400),
        () => animate(label, { opacity: 0.6 }, SPRING400)
      );
    });

  /* service cards — arrow appears (opacity .2 → 1) */
  root
    .querySelectorAll<HTMLElement>(".framer-1atxxt1, a.framer-3lxv5q")
    .forEach((card) => {
      const arrow = card.querySelector<HTMLElement>(".framer-1d1pnhs");
      if (!arrow) return;
      bindHover(
        card,
        () => animate(arrow, { opacity: 1 }, SPRING200),
        () => animate(arrow, { opacity: 0.2 }, SPRING200)
      );
    });

  /* service small cards — social icon .6 → 1 */
  root
    .querySelectorAll<HTMLElement>(".framer-PxhKK")
    .forEach((card) => {
      const icon = card.querySelector<HTMLElement>(".framer-f6dhjq");
      if (!icon) return;
      bindHover(
        card,
        () => animate(icon, { opacity: 1 }, SPRING200),
        () => animate(icon, { opacity: 0.6 }, SPRING200)
      );
    });

  /* support cards — social icon .2 → .9 */
  root
    .querySelectorAll<HTMLElement>(".framer-vqNyI")
    .forEach((card) => {
      const icon = card.querySelector<HTMLElement>(".framer-dgrz5q");
      if (!icon) return;
      bindHover(
        card,
        () => animate(icon, { opacity: 0.9 }, SPRING200),
        () => animate(icon, { opacity: 0.2 }, SPRING200)
      );
    });

  /* portfolio cards (home preview + portfolio page) — image scales to 1.1 */
  root
    .querySelectorAll<HTMLElement>('[data-framer-cursor="8bnwio"]')
    .forEach((card) => {
      const img = card.querySelector<HTMLElement>(
        ".framer-1206r8s, .framer-vk9m4r"
      );
      if (!img) return;
      bindHover(
        card,
        () => animate(img, { scale: 1.1 }, SPRING250),
        () => animate(img, { scale: 1 }, SPRING250)
      );
    });

  /* next-project cards on detail pages — image dims to .6 */
  root
    .querySelectorAll<HTMLElement>('[data-framer-cursor="850utj"]')
    .forEach((card) => {
      const img = card.querySelector<HTMLElement>(".framer-pd56mf");
      if (!img) return;
      bindHover(
        card,
        () => animate(img, { opacity: 0.6 }, SPRING250),
        () => animate(img, { opacity: 1 }, SPRING250)
      );
    });
}

/* ------------------------------------------------------------------ */
/* Light Rays — the ORIGINAL Framer "Light Rays" Three.js component    */
/*                                                                     */
/* Extracted verbatim from the published site bundle                   */
/* (chunk-BS7EWRWF.mjs): fragment shader `j0` + uniforms. Every glow   */
/* host on the site uses the same config: intensity 20, rays 30,       */
/* purple rgba(0, 49, 213), animation { animate: true, speed: 10 }.      */
/* The u_time uniform advances dt_ms * speed / 1e3 / 10 (≈1 per s).    */
/* ------------------------------------------------------------------ */

/* ONLY these four containers carry the animated ray canvas in the original
 * runtime (verified against the shipped EvexaRuntime + user confirmation).
 * The other section-level "Light Rays" layers (Circle Ticker, Portfolio,
 * Support, About-Us, Process, above-FAQ) keep ONLY their frozen glow
 * backdrop image from the export — no canvas was ever attached there. */
const LIGHT_RAYS_HOSTS: Record<string, { position: number; reach: number; img: string }> = {
  "framer-1opuij9-container": { position: 50, reach: 30, img: "/images/glow/glow-services.webp" },
  "framer-14gb8d7-container": { position: 50, reach: 30, img: "/images/glow/glow-faq.webp" },
  "framer-apnosk-container": { position: 100, reach: 0, img: "/images/glow/glow-launch.webp" },
  "framer-vu8s90-container": { position: 50, reach: 30, img: "/images/glow/glow-cta.webp" },
};

const LIGHT_RAYS_SPEED = 10;
const LIGHT_RAYS_INTENSITY = 20;
const LIGHT_RAYS_COUNT = 30;
/* single color mode: rgba(0, 49, 213) — the Evexa Royal Blue token */
const LIGHT_RAYS_COLOR: [number, number, number, number] = [0 / 255, 49 / 255, 213 / 255, 1];

const LIGHT_RAYS_VERT = "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}";

/* Exact fragment shader of the original component (unused noise helpers removed) */
const LIGHT_RAYS_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);
    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214*speed;
    float raySeedB1 = 21.11349*speed;
    float raySpeed1 = 1.5*speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910*speed;
    float raySeedB2 = 18.0234*speed;
    float raySpeed2 = 1.1*speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0*u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

function setupLightRays(root: ParentNode) {
  Object.entries(LIGHT_RAYS_HOSTS).forEach(([cls, opts]) => {
    root
      .querySelectorAll<HTMLElement>(`.` + cls)
      .forEach((host) => {
        if (host.querySelector("canvas")) return;
        if (!host.offsetParent) return; // hidden breakpoint variant
        host.style.pointerEvents = "none";
        // host opacity comes from the DOM (0.8 on apnosk / vu8s90, 1 elsewhere)

        const canvas = document.createElement("canvas");
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
        host.insertBefore(canvas, host.firstChild);

        const gl = canvas.getContext("webgl", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        });

        if (!gl) {
          // WebGL unavailable → static captured field fallback
          canvas.remove();
          const img = document.createElement("img");
          img.src = opts.img;
          img.alt = "";
          img.setAttribute("aria-hidden", "true");
          img.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;";
          host.insertBefore(img, host.firstChild);
          return;
        }

        const compile = (type: number, src: string) => {
          const sh = gl.createShader(type)!;
          gl.shaderSource(sh, src);
          gl.compileShader(sh);
          return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, LIGHT_RAYS_VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, LIGHT_RAYS_FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          canvas.remove();
          return;
        }
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const U = (n: string) => gl.getUniformLocation(prog, n);
        const uRes = U("u_resolution");
        const uTime = U("u_time");
        const uColors = U("u_colors[0]");
        const uIntensity = U("u_intensity");
        const uRays = U("u_rays");
        const uReach = U("u_reach");
        const uPos1 = U("u_rayPos1");
        const uPos2 = U("u_rayPos2");

        // uniform maths — exactly the original component:
        // intensity 20 -> 20/100*.5 = .1 ; rays 30 -> 30/100*.3 = .09 ; reach 30 -> .15
        gl.uniform4fv(uColors, [...LIGHT_RAYS_COLOR, ...LIGHT_RAYS_COLOR]);
        gl.uniform1f(uIntensity, (LIGHT_RAYS_INTENSITY / 100) * 0.5);
        gl.uniform1f(uRays, (LIGHT_RAYS_COUNT / 100) * 0.3);
        gl.uniform1f(uReach, (opts.reach / 100) * 0.5);

        let time = Math.random() * 10000; // original starts u_time at random*1e4
        let raf = 0;
        let last = performance.now();
        let running = true;
        const g = GEN;

        const resize = () => {
          const w = Math.max(1, Math.round(host.clientWidth));
          const h = Math.max(1, Math.round(host.clientHeight));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          gl.viewport(0, 0, w, h);
          gl.uniform2f(uRes, w, h);
          // original: rayPos1=[position/100*w, -0.4*h], rayPos2=[(position/100+.02)*w, -0.5*h]
          gl.uniform2f(uPos1, (opts.position / 100) * w, -0.4 * h);
          gl.uniform2f(uPos2, (opts.position / 100 + 0.02) * w, -0.5 * h);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        const frame = (now: number) => {
          if (!running || g !== GEN) return; // paused off-screen or page changed
          const dt = now - last;
          last = now;
          // original: u_time += dt_ms * speed / 1e3 / 10  →  ≈1 per second at speed 10
          time += dt * (LIGHT_RAYS_SPEED / 1e3 / 10);
          gl.uniform1f(uTime, time);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        // pause off-screen (the original keeps a single rAF per canvas too)
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !running) {
                running = true;
                last = performance.now();
                raf = requestAnimationFrame(frame);
              } else if (!entry.isIntersecting && running) {
                running = false;
                cancelAnimationFrame(raf);
              }
            });
          },
          { rootMargin: "100px" }
        );
        io.observe(host);
        onCleanup(() => {
          running = false;
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
        });
      });
  });
}

function frac(x: number) {
  return x - Math.floor(x);
}

function setupDecor(root: ParentNode) {
  const ring = root.querySelector<HTMLElement>('img[alt="Purple Ring"]');
  if (ring && !(ring as any).__nbDecor) {
    (ring as any).__nbDecor = true;
    const ctrl = animate(
      ring,
      { opacity: [1, 0.8], rotate: [0, -3], skewY: [0, 2], y: [0, 6] },
      { duration: 1.5, ease: [0, 0, 1, 1], repeat: Infinity, repeatType: "mirror" }
    );
    onCleanup(() => ctrl.stop());
  }

  /* NOTE: the "Rays" images (About/FAQ/Circle-Ticker light beams) are STATIC
     in the original — only their wrapper carries opacity .7. No appear effect.
     (verified: no initial/effect/loop props on any alt:"Rays" instance) */

  // Stars: both the alt="Star" images and the fill-injected
  // [data-framer-name="Star"] SVG holders (testimonial / rating stars)
  // spin in once, exactly like the original's appear effect.
  const stars = [
    ...root.querySelectorAll<HTMLElement>(
      'img[alt="Star"], svg[alt="Star"], [data-framer-name="Star"]'
    ),
  ];
  stars.forEach((star, i) => {
    if ((star as any).__nbDecor) return;
    (star as any).__nbDecor = true;
    star.style.opacity = "0.001";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          animate(
            star,
            { opacity: [0.001, 1], rotate: [0, 360] },
            { ...WORD_SPRING, delay: (i % 5) * 0.05 }
          );
        });
      },
      { threshold: 0.5 }
    );
    io.observe(star);
    onCleanup(() => io.disconnect());
  });
}

/* ------------------------------------------------------------------ */
/* video                                                               */
/* ------------------------------------------------------------------ */

function setupVideo(root: ParentNode) {
  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    // metadata only: the full 12 MB launch video must not start downloading
    // on page load; playback begins when the section scrolls into view.
    video.preload = "metadata";
    if (!video.getAttribute("src") && video.querySelector("source")) {
      video.load();
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    onCleanup(() => {
      io.disconnect();
      video.pause();
    });
  });
}

/* ------------------------------------------------------------------ */
/* language helpers                                                    */
/* ------------------------------------------------------------------ */

type SiteLang = "en" | "ar";

/** Prefix an internal href with the active language segment. */
function withLang(href: string, lang: SiteLang): string {
  // Always prefix the locale: client-side navigations then hit the real
  // route directly instead of bouncing through the locale redirect in
  // src/proxy.ts (which only serves unprefixed, e.g. first-visit links).
  if (href.startsWith("/#")) return `/${lang}#${href.slice(2)}`;
  if (href === "/") return `/${lang}`;
  if (href.startsWith(`/${lang}/`) || href === `/${lang}`) return href;
  return `/${lang}${href}`;
}

/**
 * Language switcher — injected into every visible header nav (desktop +
 * mobile variants). Glass pill matching the site's button language; the
 * active language is highlighted with the brand gradient.
 */
function injectLangSwitch(root: ParentNode, lang: SiteLang, navigate: (href: string) => void) {
  if (root.querySelector(".nb-lang-switch")) return;
  // every header variant (desktop/tablet/phone) gets its own pill — each is
  // shown/hidden with its header by the breakpoint classes, so no resize
  // re-injection is needed.
  const headers = [...root.querySelectorAll<HTMLElement>("header.framer-5H12c")];
  headers.forEach((header) => {
    const nav = header.querySelector("nav");
    if (!nav) return;
    const pill = document.createElement("div");
    pill.className = "nb-lang-switch";
    pill.setAttribute("role", "group");
    pill.setAttribute("aria-label", "Language switcher");
    const en = document.createElement("button");
    en.type = "button";
    en.className = "nb-lang-opt" + (lang === "en" ? " nb-lang-active" : "");
    en.textContent = "EN";
    const ar = document.createElement("button");
    ar.type = "button";
    ar.className = "nb-lang-opt nb-ar" + (lang === "ar" ? " nb-lang-active" : "");
    ar.textContent = "عربي";
    const go = (target: SiteLang) => (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (target === lang) return;
      const path = window.location.pathname.replace(/^\/(en|ar)/, "");
      navigate("/" + target + (path || ""));
    };
    on(en, "click", go("en"));
    on(ar, "click", go("ar"));
    pill.appendChild(en);
    pill.appendChild(ar);

    // Desktop nav (row): [logo][menu][CTA] → tag the zones, then insert the
    // pill BETWEEN menu and CTA so the far cluster reads [lang][CTA].
    const menu = nav.querySelector<HTMLElement>('[class*="framer-1y44wop-container"]');
    const cta = nav.querySelector<HTMLElement>('[class*="framer-1jr9gz1-container"]');
    const logoRow = nav.querySelector<HTMLElement>(":scope > .framer-1y9d1w4");
    if (menu && cta && logoRow) {
      logoRow.classList.add("nb-nav-logo");
      menu.classList.add("nb-nav-menu");
      cta.classList.add("nb-nav-cta");
      cta.parentElement!.insertBefore(pill, cta);
      return;
    }

    // Tablet / phone nav (column variant): the pill must live inside the
    // logo+burger row — appending it to the nav itself puts it at order:0
    // above the logo, pushing the real bar out of the 84px header clip.
    const row = nav.querySelector<HTMLElement>(":scope > .framer-1y9d1w4");
    if (row) {
      pill.classList.add("nb-lang-switch-row");
      row.insertBefore(pill, row.children[1] ?? null);
    }
  });
}

/* ------------------------------------------------------------------ */
/* navigation                                                          */
/* ------------------------------------------------------------------ */

function setupNav(
  root: ParentNode,
  navigate: (href: string) => void,
  lang: SiteLang = "en"
) {
  const container = root.querySelector<HTMLElement>(
    '[class*="framer-1hltwlr-container"]'
  );

  if (container) {
    container.style.transition = "transform 0.4s cubic-bezier(0.44, 0, 0.56, 1)";
    // keep the CSS centering (left:50% + translateX(-50%)) intact:
    // animate translateY only, always combined with translateX(-50%).
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 250) {
        container.style.transform = "translate(-50%, -110%)";
      } else if (y < lastY || y <= 250) {
        container.style.transform = "translate(-50%, 0)";
      }
      lastY = y;
    };
    on(window, "scroll", onScroll, { passive: true });
  }

  /* ---------------- mobile menu (exact original behavior) ----------- */
  // The SSR ships desktop/tablet/phone nav variants; pick the VISIBLE ones
  // (zero-height elements belong to inactive breakpoint variants).
  const header =
    [...root.querySelectorAll<HTMLElement>("header.framer-5H12c")].find(
      (h) => h.getBoundingClientRect().height > 0
    ) ?? root.querySelector<HTMLElement>("header.framer-5H12c");
  const burger = [
    ...root.querySelectorAll<HTMLElement>('[data-framer-name="Mobile Menu Icon"]'),
  ].find((b) => b.getBoundingClientRect().height > 0);

  if (header && burger) {
    burger.style.cursor = "pointer";

    const lines = [
      ...burger.querySelectorAll<HTMLElement>('[data-framer-name="Line"]'),
    ].slice(0, 2);

    let open = false;
    let animating = false;

    const setOpenClass = (openState: boolean) => {
      header.classList.toggle("framer-v-gazge4", !openState);
      header.classList.toggle("framer-v-csul5u", openState);
      if (openState) {
        header.style.backdropFilter = "blur(20px)";
        header.style.setProperty("-webkit-backdrop-filter", "blur(20px)");
        header.style.background =
          "linear-gradient(180deg, rgb(19, 19, 19) 6.642384572072071%, rgba(0, 0, 0, 0.3) 100%)";
      } else {
        header.style.backdropFilter = "";
        header.style.setProperty("-webkit-backdrop-filter", "");
        header.style.background = "";
      }
      lines.forEach((line, i) => {
        line.style.transition = "transform 0.3s ease";
        line.style.transform = openState
          ? `rotate(${i === 0 ? "" : "-"}45deg)`
          : "rotate(0deg)";
      });
    };

    const openMenu = () => {
      open = true;
      setOpenClass(true);
      const target = header.scrollHeight;
      animating = true;
      animate(
        header,
        { height: [header.getBoundingClientRect().height, target] },
        { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
      ).then(() => {
        animating = false;
        header.style.height = "min-content";
      });
    };

    const closeMenu = () => {
      open = false;
      setOpenClass(false);
      header.style.height = "";
      animating = false;
    };

    on(burger, "click", (e) => {
      e.stopPropagation();
      if (animating) return;
      if (open) closeMenu();
      else openMenu();
    });

    // close when a menu link is clicked
    header.querySelectorAll("a").forEach((a) => {
      on(a, "click", () => {
        if (open) closeMenu();
      });
    });
  }

  /* ---------------- real page navigation ---------------------------- */
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("http") || href.startsWith("mailto")) return;

    on(a, "click", (e) => {
      // hash-only or same-page hash links: smooth scroll within the page
      if (href.startsWith("#") || href.startsWith("/#")) {
        const id = href.slice(href.indexOf("#") + 1);
        e.preventDefault();
        const sec =
          (id ? document.getElementById(id) : null) ??
          sectionByName(root, "FAQ");
        if (sec) {
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // FAQ section lives on the home page
          window.location.href = withLang("/#" + id, lang);
        }
        return;
      }
      // internal route links ("/", "/about", …): Next.js client-side
      // navigation — no full reload, matching Framer's instant transitions.
      if (href.startsWith("/")) {
        e.preventDefault();
        navigate(withLang(href, lang));
      }
    });
  });

  // hash scroll on load (e.g. /#faq)
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    window.setTimeout(() => {
      const sec =
        (id ? document.getElementById(id) : null) ??
        sectionByName(root, "FAQ");
      sec?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }

  /* ---------------- subscribe / contact forms ------------------------ */
  /* The contact form carries a message textarea; newsletter forms are
   * email-only. Both POST to /api/contact (zod-validated, NDJSON-backed);
   * feedback replaces the button label exactly like the original's
   * "Subscribed!" micro-interaction. */
  root.querySelectorAll("form").forEach((form) => {
    const email = form.querySelector<HTMLInputElement>('input[type="email"]');
    const textarea = form.querySelector("textarea");
    const textInputs = [
      ...form.querySelectorAll<HTMLInputElement>('input[type="text"]'),
    ];
    const btn = form.querySelector("button");
    if (!email || !btn) return;
    const oldLabel = btn.textContent ?? "";
    const setLabel = (text: string, revertMs?: number) => {
      btn.textContent = text;
      if (revertMs)
        window.setTimeout(() => (btn.textContent = oldLabel), revertMs);
    };

    on(form, "submit", (e: Event) => {
      e.preventDefault();
      const isContact = !!textarea;
      const payload = isContact
        ? {
            name: textInputs.map((i) => i.value.trim()).filter(Boolean).join(" "),
            email: email.value.trim(),
            message: (textarea as HTMLTextAreaElement).value.trim(),
          }
        : {
            name: "",
            email: email.value.trim(),
            message: "",
            subscribe: true,
          };
      if (!payload.email || (isContact && !payload.message)) return;
      setLabel("Sending…");
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          if (isContact) {
            form.reset();
            setLabel("Message sent!");
            window.setTimeout(() => setLabel(oldLabel), 3000);
          } else {
            email.value = "";
            setLabel("Subscribed!", 2500);
          }
        })
        .catch(() => setLabel("Error — try again"));
    });
  });
}

/* ------------------------------------------------------------------ */
/* scroll-linked transform effects (exact Framer "styleTransform")     */
/*                                                                     */
/* Framer marks elements with __framer__transformTargets + trigger     */
/* "onInView": values interpolate between target[0] and target[1]     */
/* while the element travels from "start end" to "end end" relative    */
/* to the viewport. Extracted verbatim from the original page bundles. */
/* ------------------------------------------------------------------ */

type XTarget = Partial<{
  opacity: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
}>;

const TRANSFORM_EFFECTS: Record<
  string,
  { from: XTarget; to: XTarget; appear?: boolean; spring?: object }
> = {
  // home — portfolio preview cards (slide up + un-rotate while entering)
  "framer-dz2cqt-container": {
    from: { opacity: 0.3, rotate: 2, y: -180 },
    to: { opacity: 1, rotate: 0, y: 0 },
  },
  "framer-1b1npw3-container": {
    from: { opacity: 0.3, rotate: -2, y: -180 },
    to: { opacity: 1, rotate: 0, y: 0 },
  },
  // home — section zoom-ins (scale .9 → 1 while entering)
  "framer-1m5ax3o-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-1ad9dhx-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-tf4iar-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  // about — same zoom-in treatment
  "framer-x3f56l-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-19rrn65-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-t31ig5-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  // portfolio grid cards
  "framer-17cqt85-container": {
    from: { rotate: 2, y: -180 },
    to: { rotate: 0, y: 0 },
  },
  "framer-7xq6g6-container": {
    from: { rotate: -2, y: -180 },
    to: { rotate: 0, y: 0 },
  },
  // shared — badge "Blue Line" glow (pop in once fully in view)
  "framer-1ahrcnp": {
    from: { opacity: 0, scale: 0.3 },
    to: { opacity: 1, scale: 1 },
    appear: true,
    spring: { type: "spring", stiffness: 300, damping: 60, mass: 1, delay: 0.2 },
  },
};

function applyX(el: HTMLElement, v: Required<XTarget>) {
  const parts: string[] = [];
  if (v.x || v.y) parts.push(`translate(${v.x}px, ${v.y}px)`);
  if (v.rotate) parts.push(`rotate(${v.rotate}deg)`);
  if (v.scale !== 1) parts.push(`scale(${v.scale})`);
  el.style.transform = parts.length ? parts.join(" ") : "none";
  el.style.opacity = String(v.opacity);
}

function setupTransformEffects(root: ParentNode, lang: SiteLang = "en") {
  const flip = lang === "ar" ? -1 : 1; // mirror tilt direction for RTL
  Object.entries(TRANSFORM_EFFECTS).forEach(([cls, cfg]) => {
    const els = root.querySelectorAll<HTMLElement>(`.${cls}`);
    if (!els.length) return;

    els.forEach((el) => {
      if (el.dataset.nbXeff) return;
      el.dataset.nbXeff = "1";

      if (cfg.appear) {
        // trigger-based pop (once fully in view), matching __framer__threshold:1
        applyX(el, { opacity: cfg.from.opacity!, x: 0, y: 0, scale: cfg.from.scale!, rotate: 0 });
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio < 1) return;
              io.disconnect();
              animate(
                el,
                { opacity: [cfg.from.opacity!, cfg.to.opacity!], scale: [cfg.from.scale!, cfg.to.scale!] },
                (cfg.spring ?? {
                  type: "spring",
                  stiffness: 300,
                  damping: 60,
                  mass: 1,
                }) as object
              );
            });
          },
          { threshold: 1 }
        );
        io.observe(el);
        onCleanup(() => io.disconnect());
        return;
      }

      // scroll-linked interpolation between from → to.
      // Progress is computed from the element's LAYOUT position (offsetTop
      // chain), never from getBoundingClientRect: the applied translateY/
      // rotate must not feed back into the measurement (that feedback is
      // what made the section feel stuck/janky while scrolling).
      const from = {
        opacity: cfg.from.opacity ?? 1,
        x: cfg.from.x ?? 0,
        y: cfg.from.y ?? 0,
        scale: cfg.from.scale ?? 1,
        rotate: (cfg.from.rotate ?? 0) * flip,
      };
      const to = {
        opacity: cfg.to.opacity ?? 1,
        x: cfg.to.x ?? 0,
        y: cfg.to.y ?? 0,
        scale: cfg.to.scale ?? 1,
        rotate: (cfg.to.rotate ?? 0) * flip,
      };
      el.style.willChange = "transform, opacity";

      let docTop = 0;
      const measure = () => {
        let t = 0;
        let n: HTMLElement | null = el;
        while (n) {
          t += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        docTop = t;
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      onCleanup(() => ro.disconnect());

      let dirty = true;
      let raf = 0;
      const paint = () => {
        raf = 0;
        if (!dirty) return;
        dirty = false;
        const vh = window.innerHeight;
        const h = el.offsetHeight || 1;
        // 0: element top at viewport bottom — 1: element bottom at viewport bottom
        const p = Math.min(1, Math.max(0, (window.scrollY + vh - docTop) / h));
        const cur = {
          opacity: from.opacity + (to.opacity - from.opacity) * p,
          x: from.x + (to.x - from.x) * p,
          y: from.y + (to.y - from.y) * p,
          scale: from.scale + (to.scale - from.scale) * p,
          rotate: from.rotate + (to.rotate - from.rotate) * p,
        };
        applyX(el, cur);
      };
      const schedule = () => {
        dirty = true;
        if (!raf) raf = requestAnimationFrame(paint);
      };

      paint();
      on(window, "scroll", schedule, { passive: true });
      on(window, "resize", schedule);
    });
  });
}

/* ------------------------------------------------------------------ */
/* main effect                                                         */
/* ------------------------------------------------------------------ */

export default function EvexaRuntime({ page, lang = "en" }: { page: string; lang?: string }) {
  const siteLang: SiteLang = lang === "ar" ? "ar" : "en";
  const router = useRouter();

  useEffect(() => {
    GEN += 1; // invalidate rAF loops / observers from any previous page
    const root = document.getElementById("main") ?? document.body;

    // Remember the language the visitor is actually browsing, so locale-less
    // internal links (/about, /contact…) stay in it — src/proxy.ts prefers
    // this cookie over the browser's Accept-Language header.
    document.cookie = `NEXT_LOCALE=${siteLang};path=/;max-age=31536000;samesite=lax`;

    // prefetch every internal route so client-side page swaps are instant,
    // like the original site's navigation
    [
      "/",
      "/about",
      "/portfolio",
      "/contact",
      "/terms-conditions",
      "/privacy-policy",
      "/portfolio/lemonide-tech",
      "/portfolio/million-one",
      "/portfolio/viper-studio",
    ].forEach((r) => {
      try {
        router.prefetch(withLang(r, siteLang));
      } catch {}
    });

    const t = window.setTimeout(() => {
      ensureSprite(root);

      // Container fills (icon tiles, card arrows ↗, logos). When already
      // cached (2nd+ navigation) they apply synchronously; otherwise they
      // stream in as a static asset and are applied the moment they land.
      // flipRtlArrows re-runs afterwards because the fills inject the ↗
      // arrows that need mirroring on RTL pages.
      const applyFills = (fills: FillsByClass | null) => {
        fillContainers(root, fills);
        flipRtlArrows(root);
        // The fills inject content that several setups target: the card ↗
        // arrows and icons (hovers), the shimmer curves inside "SVG Path"
        // blocks, stars, audio waves… All of these are idempotent (guarded
        // by __nb* flags), so re-running them binds ONLY the new content —
        // without this, the injected elements never animate.
        setupHovers(root);
        setupCurveShimmers(root);
        setupPulses(root);
        setupAudioWaves(root);
        setupCircleTicker(root);
        setupDecor(root);
      };
      if (FILLS_CACHE[siteLang]) {
        applyFills(FILLS_CACHE[siteLang]);
      } else {
        const gen = GEN;
        loadFills(siteLang).then((fills) => {
          if (gen !== GEN) return; // navigated away meanwhile
          applyFills(fills);
        });
      }

      setupAppear(page, root);
      setupWordReveal(root);
      setupScrollReveal(root);
      setupTickers(root);
      setupAudioWaves(root);
      setupCurveShimmers(root);
      setupTransformEffects(root, siteLang);
      setupLightRays(root);
      setupCircleTicker(root);
      setupPulses(root);
      setupFaq(root, siteLang);
      setupDecor(root);
      setupVideo(root);
      setupHovers(root);
      setupCursor();
      setupNav(root, (href) => router.push(href), siteLang);
      injectLangSwitch(root, siteLang, (href) => router.push(href));
    }, 0);

    return () => {
      window.clearTimeout(t);
      CLEANUPS.splice(0).forEach((fn) => fn());
    };
  }, [page, siteLang, router]);

  return null;
}
