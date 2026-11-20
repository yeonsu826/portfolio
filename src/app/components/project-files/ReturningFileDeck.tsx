import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { fileRows, rowTabWidth, tabColors, tabNames } from "./projectFileData";

export type ReturnDeck = {
  cards: { row: number; left: number; top: number; color: string }[];
  left: number;
  top: number;
  width: number;
  height: number;
  rowHeight: number;
};

export default function ReturningFileDeck({
  deck,
  onDone,
}: {
  deck: ReturnDeck;
  onDone: () => void;
}) {
  const [dropping, setDropping] = useState(false);
  return (
    <div
      className="archive-return-deck"
      data-return-phase={dropping ? "dropping" : "collecting"}
      aria-hidden="true"
    >
      {deck.cards.map((card, index) => {
        const row = fileRows[card.row];
        return (
          <motion.div
            key={row.id}
            className="archive-return-file"
            initial={{ x: card.left, y: card.top }}
            animate={{
              x: deck.left,
              y: dropping ? window.innerHeight + deck.height : deck.top,
            }}
            transition={{
              duration: dropping ? 0.6 : 0.75,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={
              {
                width: deck.width,
                height: deck.height + deck.rowHeight,
                zIndex: index + 1,
                "--row-height": `${deck.rowHeight}px`,
                "--tab-height": `${deck.rowHeight * 0.76}px`,
                "--row-color": card.color,
                "--tab-width": rowTabWidth(row),
              } as CSSProperties
            }
            onAnimationComplete={() => {
              if (index !== 0) return;
              if (!dropping) setDropping(true);
              else onDone();
            }}
          >
            <div className="mosby-row">
              <div className="mosby-tabs">
                {row.keys.map((key) => (
                  <span
                    key={key}
                    className="mosby-tab"
                    style={
                      {
                        "--tab-color": tabColors[key],
                        "--tab-ink":
                          key === "devARContentGroup" ? "#191a18" : "#f8f1e4",
                      } as CSSProperties
                    }
                  >
                    <svg viewBox="0 0 240 40" preserveAspectRatio="none">
                      <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
                    </svg>
                    <span>{tabNames[key]}</span>
                  </span>
                ))}
              </div>
            </div>
            <div
              className="archive-return-paper"
              style={{ backgroundColor: card.color }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
