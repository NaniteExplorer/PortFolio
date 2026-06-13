"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through `words` with a typing/deleting effect. Pure client component;
 * respects no external deps.
 */
export function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pause = 1400,
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1)
        );
      },
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className="text-accent">
      {text}
      <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-accent align-middle" style={{ height: "1em" }} />
    </span>
  );
}
