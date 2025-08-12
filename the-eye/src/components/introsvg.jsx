// IntroLogo.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroLogo() {
  const overlayRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    
    const overlay = overlayRef.current;
    const svg = svgRef.current;
   

    if (!overlay || !svg) return;

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      overlay.style.transform = "translateY(-100%)";
      overlay.style.pointerEvents = "none";
      return;
    }

    // Find all strokeable shapes: path, line, polyline, polygon
    const paths = svg.querySelectorAll("path, line, polyline, polygon");
    

    // prepare each path for stroke drawing
    paths.forEach((p, index) => {
      let len;
      try {
        len = p.getTotalLength();
      } catch (e) {
        // fallback for non-paths
        len = 300;
      }
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.stroke = "#fff"; // White stroke for dark background
      p.style.strokeWidth = "2"; // Add stroke width
      // Store original fill for later
      const originalFill = p.getAttribute("fill") || getComputedStyle(p).fill;
      p.setAttribute("data-original-fill", originalFill);
      // Start with no fill
      p.style.fillOpacity = 0;
    });

    // build timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    // 1) draw strokes in sequence (stagger)
    tl.to(
      paths,
      {
        strokeDashoffset: 0,
        duration: 2.5,
        stagger: 0.2,
        ease: "power2.out",
      },
      0
    );

    // 2) fill (fade in fillOpacity) with restored original colors
    tl.to(
      paths,
      {
        fillOpacity: 1,
        duration: 1.5,
        stagger: 0.1,
        onComplete: function () {
          // Restore original fill colors
          paths.forEach((p) => {
            const originalFill = p.getAttribute("data-original-fill");
            if (originalFill && originalFill !== "none") {
              p.style.fill = originalFill;
            }
          });
        },
      },
      "-=0.5"
    );

    // 3) Logo bounce and scale effect
    tl.to(
      svg,
      {
        scale: 1.1,
        duration: 0.5,
        ease: "back.out(2)",
      },
      "+=0.2"
    ).to(svg, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    // 4) Slide the entire component out to the right and up
    tl.to(
      overlay,
      {
        y: "-100%",
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          // disable pointer events and hide
          overlay.style.pointerEvents = "none";
          overlay.style.display = "none";
        },
      },
      "+=0.5"
    );

    // Cleanup on unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      {/* overlay covering the whole viewport */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",

          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          background: "#1a1a1a",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="200"
          viewBox="0 0 650 400"
          fill="none"
        >
          <path
            d="M333.5 69C337.5 59 350.5 7.99998 348 15C316.8 78.6 239 134.5 172.5 158.5C119.833 182.333 30.5 242 0.5 326C0.5 326 21 303 38 291.5C60.8717 276.028 92.5 256 117 246C134.315 238.933 299.833 185.5 387 163C395.5 177 399.071 251.839 392.5 278.5C365 390.077 232 397.5 232 397.5C380.5 415 427.5 313.333 433.5 270C440.054 241.402 438.833 176.333 433.5 147C557.5 113.4 630.667 37.1666 649.5 5.5C600.3 45.1 474.667 92.3333 414 111.5C451.333 88.1667 519.4 34.8 525 0C525 0 447 70 291.5 131C291.5 131 319.5 104 333.5 69Z"
            fill="#D9D9D9"
          />
          <path
            d="M172 260L105.5 287C125 331.5 198.3 405.6 311.5 354C385.9 309.6 382.167 231.833 374 197.5L305.5 218.5C307.167 239.333 299.4 284 255 296C210.6 308 181.167 277 172 260Z"
            fill="white"
          />
          <path
            d="M283 222.5L194 250.5C204.5 272 234.5 286.2 258.5 273C282.5 259.8 284.667 233 283 222.5Z"
            fill="white"
          />
        </svg>
      </div>
    </>
  );
}
