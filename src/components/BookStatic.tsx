"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";

/**
 * Static echo of the Book3D used inside Buy. Same 6 faces, fixed pose,
 * no pointer events, no RAF loop. Reuses the cover assets in
 * public/book/ and the .face.* CSS rules defined in globals.css.
 */
export function BookStatic() {
  const { lang, t } = useLang();
  const suffix = lang === "en" ? "en" : "es";
  const frontSrc = `/book/cover-front-${suffix}.jpg`;
  const backSrc = `/book/cover-back-${suffix}.jpg`;
  const spineSrc = `/book/cover-spine-${suffix}.png`;
  const alt = `${t.hero.coverTitleLine1} ${t.hero.coverTitleLine2} — ${t.hero.coverAuthor}`;

  return (
    <div
      className="book-stage book-stage--static"
      role="img"
      aria-label={alt}
    >
      <div className="face front">
        <Image
          src={frontSrc}
          alt=""
          fill
          sizes="(max-width: 900px) 60vw, 340px"
          className="book-face-img"
        />
      </div>
      <div className="face back">
        <Image
          src={backSrc}
          alt=""
          fill
          sizes="(max-width: 900px) 60vw, 340px"
          className="book-face-img"
        />
      </div>
      <div className="face spine">
        <Image
          src={spineSrc}
          alt=""
          fill
          sizes="(max-width: 900px) 40px, 50px"
          className="book-face-img"
        />
      </div>
      <div className="face edge" />
      <div className="face top" />
      <div className="face bottom" />
    </div>
  );
}
