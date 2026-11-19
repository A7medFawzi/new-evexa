"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckBadgeIcon } from "@/components/ui/icons";
import GlowLabel from "@/components/ui/GlowLabel";
import styles from "./ProjectCard.module.css";

const HOVER_SPRING = { type: "spring", stiffness: 250, damping: 60, mass: 1 } as const;

export interface Project {
  href: string;
  label: string;
  title: string;
  points: string[];
  tags: string[];
  images: [{ src: string; alt: string }, { src: string; alt: string }];
}

/** Project summary card (whole card is a link); the first image zooms on hover. */
export default function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={project.href}
      className={styles.card}
      data-cursor="view"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className={styles.panel}>
        <span className={styles.glow} aria-hidden="true" />
        <div className={styles.head}>
          <GlowLabel>{project.label}</GlowLabel>
          <h4 className={styles.title}>{project.title}</h4>
        </div>
        <span className={styles.line} aria-hidden="true" />
        <ul className={styles.points}>
          {project.points.map((point) => (
            <li key={point}>
              <CheckBadgeIcon />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              <span>{tag}</span>
              <span className={styles.tagGlow} aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {project.images.map((image, i) => (
        <div key={image.src} className={i === 0 ? styles.media : `${styles.media} ${styles.secondary}`}>
          <div className={styles.mediaInner}>
            <motion.img
              className={styles.image}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              initial={false}
              animate={{ scale: i === 0 && hovered ? 1.1 : 1 }}
              transition={HOVER_SPRING}
            />
            <span className={styles.tint} aria-hidden="true" />
          </div>
        </div>
      ))}
    </Link>
  );
}
