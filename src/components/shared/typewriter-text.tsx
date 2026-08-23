"use client";

import * as React from "react";

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export function TypewriterText({
  words,
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseDuration = 1200,
  className = "",
  cursorClassName = "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState("");

  // Refs to maintain state across re-renders without re-triggering effect resets
  const stateRef = React.useRef({
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    isWaiting: false,
  });

  React.useEffect(() => {
    if (!words || words.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const state = stateRef.current;
      const currentWord = words[state.wordIndex % words.length];

      if (state.isWaiting) {
        // Finished waiting -> start deleting
        state.isWaiting = false;
        state.isDeleting = true;
        timeoutId = setTimeout(tick, deletingSpeed);
        return;
      }

      if (!state.isDeleting) {
        // Typing forward
        if (state.charIndex < currentWord.length) {
          state.charIndex += 1;
          setDisplayText(currentWord.slice(0, state.charIndex));
          timeoutId = setTimeout(tick, typingSpeed);
        } else {
          // Finished typing word -> wait for pauseDuration
          state.isWaiting = true;
          timeoutId = setTimeout(tick, pauseDuration);
        }
      } else {
        // Deleting backward
        if (state.charIndex > 0) {
          state.charIndex -= 1;
          setDisplayText(currentWord.slice(0, state.charIndex));
          timeoutId = setTimeout(tick, deletingSpeed);
        } else {
          // Finished deleting -> move to next word and start typing
          state.isDeleting = false;
          state.wordIndex = (state.wordIndex + 1) % words.length;
          timeoutId = setTimeout(tick, 150);
        }
      }
    };

    // Start the animation loop
    timeoutId = setTimeout(tick, typingSpeed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center justify-center whitespace-nowrap align-middle ${className}`}>
      <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
        {displayText || "\u200B"}
      </span>
      <span
        aria-hidden="true"
        className={`inline-block w-[3px] sm:w-[3.5px] h-[0.85em] ml-1.5 rounded-full ${cursorClassName} animate-cursor-blink align-baseline`}
      />
    </span>
  );
}
