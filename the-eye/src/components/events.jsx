import React from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./events.css";
import { useEffect } from "react";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import bg4 from "../assets/bg4.jpg";

export default function events() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Simple timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      // Split text animation for background typography
      const splitText = document.querySelector(".bg-typography");

      if (splitText) {
        // Split the text into individual letters
        const letters = splitText.textContent
          .split("")
          .map((letter, index) => {
            return `<span class="letter" data-index="${index}">${
              letter === " " ? "&nbsp;" : letter
            }</span>`;
          })
          .join("");
        splitText.innerHTML = letters;

        const letterSpans = document.querySelectorAll(".letter");

        // Ensure letters are visible first, then animate
        gsap.set(letterSpans, {
          opacity: 0,
          y: 30,
        });

        // Animate with a longer delay to ensure it triggers
        gsap.to(letterSpans, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1, // Increased stagger for more visible effect
          ease: "back.out(1.7)",
          delay: 1, // Increased delay
        });
      }

      const cards = document.querySelectorAll(".cards");
      const totalCards = cards.length;

      if (totalCards === 0) {
        return;
      }

      // Clear any existing ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Set initial positions with correct z-index stacking
      cards.forEach((card, index) => {
        const cardImage = card.querySelector("img");

        if (index === 0) {
          gsap.set(card, {
            y: 0,
            scale: 1,
            rotation: 0,
            zIndex: totalCards, // Highest z-index for top card
            opacity: 1,
            visibility: "visible",
          });
          // Set initial image scale
          gsap.set(cardImage, { scale: 1 });
        } else {
          gsap.set(card, {
            y: "100%",
            scale: 1,
            rotation: 0,
            zIndex: totalCards - index, // Descending z-index (4,3,2,1)
            opacity: 1,
            visibility: "visible",
          });
          // Set initial image scale
          gsap.set(cardImage, { scale: 1 });
        }
      });

      // Create ScrollTrigger animation
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // When we reach the end of the pinned section, start fading out typography
            const progress = self.progress;
            if (progress > 0.9) {
              // Start fading when 90% through the animation
              const fadeProgress = (progress - 0.9) / 0.1; // Normalize to 0-1
              const typographyContainer = document.querySelector(
                ".bg-typography-container"
              );
              if (typographyContainer) {
                gsap.to(typographyContainer, {
                  opacity: 1 - fadeProgress,
                  duration: 0.1,
                  ease: "none",
                });
              }
            } else {
              // Ensure typography is visible during the main animation
              const typographyContainer = document.querySelector(
                ".bg-typography-container"
              );
              if (typographyContainer) {
                gsap.to(typographyContainer, {
                  opacity: 1,
                  duration: 0.1,
                  ease: "none",
                });
              }
            }
          },
          onLeave: () => {
            // Completely hide typography when leaving the section
            const typographyContainer = document.querySelector(
              ".bg-typography-container"
            );
            if (typographyContainer) {
              gsap.to(typographyContainer, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
          onEnterBack: () => {
            // Show typography when entering back
            const typographyContainer = document.querySelector(
              ".bg-typography-container"
            );
            if (typographyContainer) {
              gsap.to(typographyContainer, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        },
      });

      // Pin the typography container with the viewport during the entire events section
      ScrollTrigger.create({
        trigger: ".events",
        start: "top top",
        end: `+=${window.innerHeight * totalCards}`,
        pin: ".bg-typography-container",
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      // Create animations for each card with proper z-index management and image scaling
      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const currentCardImage = currentCard.querySelector("img");
        const nextCard = cards[i + 1];

        scrollTimeline
          .to(
            currentCard,
            {
              scale: 0.85,
              rotation: 3,
              duration: 1,
              ease: "none",
            },
            i
          )
          .to(
            currentCardImage,
            {
              scale: 1.2, // Scale image by 1.2 when card goes behind
              duration: 1,
              ease: "none",
            },
            i
          )
          .to(
            nextCard,
            {
              y: "0%",
              duration: 1,
              ease: "none",
              onStart: () => {
                // Ensure the next card comes to front when it starts animating
                gsap.set(nextCard, { zIndex: totalCards + 1 });
              },
            },
            i
          );
      }
    }, 500); // Increased timeout

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="events">
      {/* Background Typography */}
      <div className="bg-typography-container">
        <h1 className="bg-typography">EVENTS</h1>
      </div>

      <section className="sticky-cards">
        <div className="cards-container">
          <div className="cards">
            <div className="tag">
              <p>CTF</p>
            </div>
            <div className="card-title">
              <div className="pand">
                <h2>
                  The Pandemic that <br /> never happened
                </h2>
              </div>
            </div>
            <img src={bg1} alt="Background 1" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Mystery Event</p>
            </div>
            <div className="card-title">
              <h2>HiddenX</h2>
            </div>
            <img src={bg2} alt="Background 2" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Tech Summit</p>
            </div>
            <div className="card-title">
              <h2>EtherXSummit</h2>
            </div>
            <img src={bg3} alt="Background 3" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Innovation</p>
            </div>
            <div className="card-title">
              <div className="kriya">
                <h2>Kriya</h2>
              </div>
            </div>
            <img src={bg4} alt="Background 4" />
          </div>
        </div>
      </section>
    </div>
  );
}
