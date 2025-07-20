"use client";

import React, { useState, useEffect } from "react";

export default function WelcomeMessage() {
  const messages = [
    "Hello, Welcome \nto this website Oj",
    "I know you have been feeling a little down so I made a little something for you",
    "But first a short quiz 👀",
  ];
  const [displayedText, setDisplayedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messageIndex < messages.length) {
      let index = 0;
      const currentMessage = messages[messageIndex];
      const interval = setInterval(() => {
        setDisplayedText(currentMessage.slice(0, index + 1));
        index++;
        if (index === currentMessage.length) {
          clearInterval(interval);
          if (messageIndex < messages.length - 1) {
            setTimeout(() => {
              setMessageIndex(messageIndex + 1);
            }, 1000);
          }
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [messageIndex]);

  return (
    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold text-center whitespace-pre-wrap">
      {displayedText}
    </h1>
  );
}
