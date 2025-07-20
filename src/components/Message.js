// Ensure this component is located in your pages or app directory as appropriate.
"use client";

import React, { useEffect, useState } from "react";

export default function Message() {
  // ... (state and messages are fine)
  const messages = [
    "Enough of the games 💔🎭",
    "I know you have been down because of your mouth 💕🤗💬",
    "I care about you more than you know ❤️",
    "This phase is only temporary, my love... until it's good again 🌈",
    "You will get well soon, my love 💌",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const sendNotificationEmail = async () => {
    setEmailSending(true);
    console.log("[CLIENT] Initiating email notification process..."); // 🪵 LOG: Start of process

    try {
      // CRITICAL: This fetch path must lead to your API file.
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 🪵 LOG: Log the raw server response status
      console.log(`[CLIENT] Received response with status: ${response.status}`);

      if (!response.ok) {
        // 🪵 LOG: If response is not OK, log the status text and throw an error
        const errorText = await response.text(); // Get error text instead of JSON
        console.error(`[CLIENT] Server responded with an error: ${errorText}`);
        throw new Error(`Server error: ${response.statusText}`);
      }

      // The error happens here if the response is not valid JSON
      const data = await response.json();
      console.log("[CLIENT] Email notification API response:", data); // 🪵 LOG: Successful API response
    } catch (error) {
      console.error("[CLIENT] Failed to send email due to an error:", error); // 🪵 LOG: Catch any fetch/parsing error
    } finally {
      setEmailSending(false);
    }
  };

  // ... (useEffect and handlePasswordSubmit are fine)
  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      const currentMessage = messages[messageIndex];
      setDisplayedText(currentMessage.slice(0, index + 1));
      index++;
      if (index === currentMessage.length) {
        clearInterval(interval);

        if (messageIndex < messages.length - 1) {
          setTimeout(() => {
            setMessageIndex((prev) => prev + 1);
          }, 1000);
        } else {
          setTimeout(() => {
            setShowPassword(true);
          }, 1500);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [messageIndex]);

  const handlePasswordSubmit = async () => {
    if (password === "memetentacion") {
      setIsCorrect(true);
      await sendNotificationEmail();
    }
  };

  // ... (The rest of the JSX is for display and is correct)
  return (
    <div className="text-pink-100 flex flex-col items-center justify-center p-4 gap-4 text-center min-h-screen">
      <div className="text-2xl sm:text-3xl font-mono max-w-[90%] break-words text-pink-50 drop-shadow-lg">
        {displayedText}
        {!showPassword && !isCorrect && (
          <span className="animate-pulse text-pink-200">|</span>
        )}
      </div>

      {showPassword && !isCorrect && (
        <div className="flex flex-col items-center gap-4 backdrop-blur-sm rounded-2xl p-8 border border-pink-300/20 shadow-2xl">
          <label className="text-xl sm:text-2xl text-pink-100 font-semibold">
            Enter password to continue 🔐
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            className="p-3 text-pink-900 bg-pink-50 rounded-xl text-lg border-2 border-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-300"
            placeholder="Password"
            disabled={emailSending}
          />
          <button
            onClick={handlePasswordSubmit}
            disabled={emailSending}
            className={`${
              emailSending
                ? "bg-pink-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 hover:scale-105"
            } text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center gap-2`}
          >
            {emailSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Sending notification...
              </>
            ) : (
              "Submit"
            )}
          </button>
          <div className="text-sm text-pink-200 italic mt-1 max-w-sm">
            Hint: What was the name of the page where we first chatted on the
            comment section?
          </div>
        </div>
      )}

      {isCorrect && (
        <div className="text-center mt-6 space-y-6 backdrop-blur-sm rounded-3xl p-10 border border-pink-300/30 shadow-2xl max-w-lg mx-auto">
          <div className="text-4xl font-bold text-pink-200 animate-bounce drop-shadow-lg">
            🎉 Congratulations 🎉
          </div>
          <p className="text-xl sm:text-2xl text-pink-100 leading-relaxed font-medium">
            I have set the website so that when you enter the correct password,
            I get a notification, and I will immediately order your gift to your
            house. It will reach you in 15 minutes.
          </p>
          {emailSending && (
            <div className="text-pink-200 text-sm">
              📧 Sending notification email...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
