import AutoplayVideo from "@/components/motion/AutoplayVideo";
import LightRays from "@/components/motion/LightRays";
import WordReveal from "@/components/motion/WordReveal";
import Badge from "@/components/ui/Badge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { ProblemIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { HomeChallengeCopy } from "@/content/home";
import styles from "./HomeChallenge.module.css";

/** "Where does work slow down?" — a video beside a short call to action. */
export default function HomeChallenge({ copy, lang }: { copy: HomeChallengeCopy; lang: Lang }) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.raysBox} aria-hidden="true">
          <LightRays className={styles.rays} position={100} reach={0} fallbackImage="/images/glow/glow-launch.webp" />
          <span className={styles.raysFade} />
        </div>
        <img className={styles.dots} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />

        <div className={styles.video}>
          <AutoplayVideo src="/videos/hero-video.mp4" className={styles.videoEl} />
          <span className={styles.videoFade} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <div className={styles.top}>
            <Badge label={copy.badge} icon={<ProblemIcon />} />
            <div className={styles.title}>
              <WordReveal as="h3" text={copy.title[0]} />
              <WordReveal as="h3" text={copy.title[1]} delay={0.2} className={styles.dim} />
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.points}>
              <span className={styles.rule} aria-hidden="true" />
              <p>{copy.text}</p>
            </div>
            <div className={styles.actions}>
              <PrimaryButton href={localizeHref(copy.button.href, lang)}>{copy.button.label}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
