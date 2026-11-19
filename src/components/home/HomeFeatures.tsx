import type { ReactNode } from "react";
import Marquee from "@/components/motion/Marquee";
import {
  BilingualIcon,
  ConnectedSystemsIcon,
  DocumentsIcon,
  HumanReviewIcon,
  RoleAccessIcon,
  TrustedKnowledgeIcon,
  VoiceIcon,
} from "@/components/ui/icons";
import { CONNECTED_TOOLS, type HomeFeaturesCopy } from "@/content/home";
import styles from "./HomeFeatures.module.css";

const POINT_ICONS = [RoleAccessIcon, BilingualIcon, DocumentsIcon, HumanReviewIcon];

/** Heights (px) of the bars in the voice card's audio wave. */
const WAVE_BARS = [19, 13, 9, 4, 22, 22, 18, 13, 9, 5, 22, 40, 18, 26, 22, 13, 9, 13, 22, 18, 13, 9, 5, 18, 26, 22, 18];

/** Six curves from the tool icons down to the central stack (viewBox, path). */
const CURVES: [string, string][] = [
  ["0 0 501 200", "M1 0c0 150 250 75 250 200"],
  ["0 0 500 200", "M250 200c0-125-150-50-150-200"],
  ["0 0 500 200", "M250 200c0-125-50-50-50-200"],
  ["0 0 500 200", "M250 200c0-125 50-50 50-200"],
  ["0 0 500 200", "M250 200c0-125 150-50 150-200"],
  ["0 0 501 200", "M250 200c0-125 250-50 250-200"],
];

/** Three showcase cards, then four short capability points. */
export default function HomeFeatures({ copy }: { copy: HomeFeaturesCopy }) {
  const [connected, knowledge, voice] = copy.cards;
  return (
    <section className={styles.section}>
      <span className={styles.line} aria-hidden="true" />
      <div className={styles.cards}>
        <FeatureCard icon={<ConnectedSystemsIcon size={24} />} title={connected.title} text={connected.text} visualClass={styles.visualConnected}>
          <ConnectedVisual />
        </FeatureCard>
        <FeatureCard icon={<TrustedKnowledgeIcon size={24} />} title={knowledge.title} text={knowledge.text} visualClass={styles.visualKnowledge}>
          <KnowledgeVisual rows={copy.chipRows} />
        </FeatureCard>
        <FeatureCard icon={<VoiceIcon size={24} />} title={voice.title} text={voice.text} visualClass={styles.visualVoice}>
          <VoiceVisual label={copy.voiceLabel} />
        </FeatureCard>
      </div>
      <span className={styles.line} aria-hidden="true" />
      <ul className={styles.points}>
        {copy.points.map((point, i) => {
          const Icon = POINT_ICONS[i];
          return (
            <li key={point.title} className={styles.point}>
              <div className={styles.pointHead}>
                <Icon size={23} />
                <h4>{point.title}</h4>
              </div>
              <p>{point.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FeatureCard({ icon, title, text, visualClass, children }: { icon: ReactNode; title: string; text: string; visualClass: string; children: ReactNode }) {
  return (
    <article className={styles.card}>
      <span className={styles.cardHighlight} aria-hidden="true" />
      <img className={styles.cardDots} src="/images/jjGQmnCK9DnrLM4akTOerjVkp9A.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <img className={styles.cardGlow} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>{icon}</span>
        <h3>{title}</h3>
        <span className={styles.cardRule} aria-hidden="true" />
        <p>{text}</p>
      </div>
      <div className={`${styles.visual} ${visualClass}`} aria-hidden="true">
        <span className={styles.visualShade} />
        {children}
        <span className={styles.visualOverlay} />
      </div>
    </article>
  );
}

/** Tool icons wired into one stack by six shimmering curves. */
function ConnectedVisual() {
  return (
    <div className={styles.connected}>
      <div className={styles.toolRow}>
        {CONNECTED_TOOLS.map((src) => (
          <span key={src} className={styles.tool}>
            <span className={styles.toolShade} />
            <img src={src} width={24} height={24} alt="" />
          </span>
        ))}
      </div>
      <div className={styles.curves}>
        <div className={styles.curvesBox}>
          {CURVES.map(([viewBox, d], i) => (
            <svg key={d} viewBox={viewBox} className={styles.curve}>
              <path d={d} className={styles.curveBase} />
              <path d={d} pathLength={100} className={i === 0 ? styles.curvePulse : `${styles.curvePulse} ${styles.curvePulseReverse}`} />
            </svg>
          ))}
        </div>
      </div>
      <span className={styles.stackIcon}>
        <img src="/images/features/stack.svg" width={29} height={29} alt="" />
      </span>
    </div>
  );
}

/** Rows of topic chips drifting in alternating directions behind a check mark. */
function KnowledgeVisual({ rows }: { rows: string[][] }) {
  return (
    <>
      {rows.map((row, i) => (
        <Marquee key={i} className={styles.chipRow} gap={10} speed={22} reverse={i % 2 === 0}>
          {row.map((chip) => (
            <span key={chip} className={styles.chip}>
              <span className={styles.chipShade} />
              <span className={styles.chipLabel}>{chip}</span>
            </span>
          ))}
        </Marquee>
      ))}
      <img className={styles.verified} src="/images/i3lRpYZPF6l5tginmGCGm4k6Fo.svg" width={74} height={74} alt="" />
    </>
  );
}

/** "Speech recognition" bubble over a little audio player whose wave fills up. */
function VoiceVisual({ label }: { label: string }) {
  const bars = (
    <>
      {WAVE_BARS.map((h, i) => (
        <span key={i} className={styles.bar} style={{ height: h }} />
      ))}
    </>
  );
  return (
    <>
      <span className={styles.bubble}>
        {label}
        <span className={styles.bubbleTip} />
      </span>
      <div className={styles.player}>
        <span className={styles.micRing}>
          <span className={styles.mic}>
            <img src="/images/features/mic.svg" width={16} height={16} alt="" />
          </span>
        </span>
        <span className={styles.audioBox}>
          <span className={styles.waves}>
            <span className={`${styles.bars} ${styles.barsIdle}`}>{bars}</span>
            <span className={styles.wavesPlayed}>
              <span className={`${styles.bars} ${styles.barsPlayed}`}>{bars}</span>
            </span>
            <span className={styles.playhead}>
              <span className={styles.playheadTip} />
            </span>
          </span>
        </span>
      </div>
    </>
  );
}
