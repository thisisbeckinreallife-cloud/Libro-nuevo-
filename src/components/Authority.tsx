"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function Authority() {
  const { t } = useLang();
  return (
    <section className="authority" id="lara">
      <div className="wrap">
        <div className="authority-grid">
          <Reveal>
            <div className="lara-portrait">
              <Image
                src="/lara-portrait.png"
                alt="Lara Lawn"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                priority
              />
              <div className="portrait-mark">Lara</div>
              <div className="portrait-caption">
                <span>{t.authority.portraitRole}</span>
                <span>{t.authority.portraitEdition}</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="authority-text">
            <div className="mono label">{t.authority.label}</div>
            <h2>
              {t.authority.h2Line1}
              <br />
              {t.authority.h2Line2Pre}
              <em>{t.authority.h2Line2Em}</em>
              <br />
              {t.authority.h2Line3}
            </h2>
            <p>{t.authority.p1}</p>
            <p>
              {t.authority.p2Pre}
              <em>{t.authority.p2Em}</em>
            </p>

            <div className="credentials">
              {t.authority.creds.map((c, i) => (
                <div className="cred" key={i}>
                  <span className="dot" />
                  <div className="text">
                    <strong>{c.title}</strong>
                    <span>{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
