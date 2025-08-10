import React from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import "./events.css";
import { useEffect } from "react";

export default function events() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = document.querySelectorAll(".cards");
    const images = document.querySelectorAll(".cards img");
    const totalCards = cards.length;

    gsap.set(cards[0], { y: 0, scale: 1, rotation: 0 });
    gsap.set(images[0], { scale: 1 });
    for (let i = 1; i < totalCards; i++) {
      gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      gsap.set(images[i], { scale: 1 });
    }

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-cards",
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: 0.5,
        
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const currentCard = cards[i];
      const currentImg = images[i];
      const nextCard = cards[i + 1];
      const position = i;

      scrollTimeline.to(
        currentCard,
        { scale: 0.5, rotation: 10, duration: 1, ease: "none" },
        position
      );
    }

    return () => {};
  }, []);

  return (
    <div className="events">
      <section className="sticky-cards">
        <div className="cards-container">
          <div className="cards">
            <div className="tag">
              <p>Kriya</p>
            </div>
            <img src="src\assets\bg1.jpg" alt="" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Kriya</p>
            </div>
            <img src="src\assets\bg2.jpg" alt="" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Kriya</p>
            </div>
            <img src="src\assets\bg3.jpg" alt="" />
          </div>
          <div className="cards">
            <div className="tag">
              <p>Kriya</p>
            </div>
            <img src="src\assets\bg4.jpg" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}
