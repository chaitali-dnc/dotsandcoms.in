import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const WORDS = [
  "CRAFTING EXPERIENCES",
  "BUILDING PLATFORMS",
  "DRIVING GROWTH",
  "CONNECTING DOTS",
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(window.hasLoadedOnce ? 100 : 0);
  const [isDone, setIsDone] = useState(!!window.hasLoadedOnce);
  const [isBypassed] = useState(!!window.hasLoadedOnce);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (window.hasLoadedOnce) {
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    const duration = 1800; // Increased to 1.8 seconds for premium pacing
    const intervalTime = 16;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          window.hasLoadedOnce = true;
          setTimeout(() => {
            setIsDone(true);
            if (onCompleteRef.current) onCompleteRef.current();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (isBypassed) {
    return null;
  }

  // Map progress (0 - 100) to WORDS index (0 - 3)
  const activeWordIndex = Math.min(
    Math.floor(progress / 25),
    WORDS.length - 1
  );

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }} // Keep wrapper mounted while panels slide up
          className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Staggered Vertical Panels (Curtain Reveal) */}
          <div className="absolute inset-0 flex z-0 pointer-events-none">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 0.85,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.08,
                }}
                className="h-full w-1/4 bg-[#080b11] border-r border-slate-900/30 last:border-r-0 relative overflow-hidden"
              >
                {/* Subtle digital node matrix within curtains */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:20px_20px]" />
              </motion.div>
            ))}
          </div>

          {/* Glowing Radial Ambient Aura (Slides up with panels) */}
          <motion.div
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute w-[600px] h-[600px] bg-gradient-to-r from-[#dc2626]/4 to-[#ea580c]/3 rounded-full blur-3xl -z-10 pointer-events-none"
          />

          {/* Loader Interactive Content Panel */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -40,
              transition: { duration: 0.4, ease: "easeIn" } 
            }}
            className="relative z-10 flex flex-col items-center justify-center select-none"
          >
            {/* Logo */}
            <div className="mb-8 opacity-90 scale-95 md:scale-100">
              <Logo size="md" />
            </div>

            {/* Orbiting Dots Animation ("Dots and Coms ") */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 relative flex items-center justify-center mb-6"
            >
              {/* Dot 1 - Red */}
              <motion.div
                className="w-3.5 h-3.5 rounded-full bg-[#dc2626] absolute left-0 shadow-[0_0_12px_#dc2626]"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Connecting line */}
              <div className="w-full h-[1.2px] bg-gradient-to-r from-[#dc2626] to-[#ea580c] opacity-30 absolute" />

              {/* Dot 2 - Orange */}
              <motion.div
                className="w-3.5 h-3.5 rounded-full bg-[#ea580c] absolute right-0 shadow-[0_0_12px_#ea580c]"
                animate={{ scale: [1.25, 1, 1.25] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Percentage Progress Counter */}
            <div className="overflow-hidden h-[80px] md:h-[100px] flex items-center justify-center">
              <h1 className="text-6xl md:text-8xl font-black font-heading text-white tracking-tighter tabular-nums">
                {Math.round(progress)}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] to-[#ea580c] ml-1 font-extrabold select-none">
                  %
                </span>
              </h1>
            </div>

            {/* Subtext and Word Cycling Text Slider */}
            <div className="flex flex-col items-center justify-center mt-3">
              <span className="text-[10px] tracking-[0.25em] font-mono text-slate-500 uppercase font-bold">
                ESTABLISHED 1999
              </span>
              
              <div className="h-6 overflow-hidden flex justify-center items-center mt-2 relative w-[240px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWordIndex}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                    className="text-[10px] font-bold font-heading tracking-widest text-[#ea580c] uppercase text-center"
                  >
                    {WORDS[activeWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

