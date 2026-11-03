const video = document.querySelector(".video-section video");

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(min-width: 75rem) and (prefers-reduced-motion: no-preference)", () => {
    video.play().catch(() => {});
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    });
    gsap.to(".img-container", {
      scale: 52,
      ease: "ease",
      scrollTrigger: {
        trigger: ".video-section",
        scrub: 1,
        start: "top top",
        end: "bottom",
        pin: true,
      },
    });
    gsap.to(".right", {
      autoAlpha: 0,
      x: 200,
      duration: 1.5,
      scrollTrigger: {
        start: 1,
      },
    });
    gsap.to(".left", {
      autoAlpha: 0,
      x: -200,
      duration: 1.5,
      scrollTrigger: {
        start: 1,
      },
    });
    gsap.to(".txt-bottom", {
      autoAlpha: 0,
      letterSpacing: -10,
      duration: 2,
      scrollTrigger: {
        start: 2,
      },
    });
    const tl = gsap.timeline();
    tl.from(".left-side div", {
      y: 150,
      opacity: 0,
      stagger: {
        amount: 0.4,
      },
      delay: 0.5,
    })
      .from(
        ".right-side",
        {
          opacity: 0,
          duration: 2,
        },
        0.5
      )
      .to(".wrapper", {
        x: () => -window.innerWidth,
      });
    ScrollTrigger.create({
      animation: tl,
      trigger: ".wrapper",
      start: "top top",
      end: "+=600",
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      ease: "ease",
    });
    const timeline = gsap.timeline();
    timeline
      .from(".title span", {
        y: 80,
        skewY: 7,
        duration: 3,
      })
      .from(".txt-bottom", {
        letterSpacing: -10,
        opacity: 0,
        duration: 3,
        scrollTrigger: {
          start: 2,
        },
      });
    gsap.utils.toArray(".col").forEach((image) => {
      gsap.fromTo(
        image,
        {
          opacity: 0.3,
          x: 0,
        },
        {
          opacity: 1,
          x: -50,
          scrollTrigger: {
            trigger: image,
            start: "0%",
            stagger: {
              amount: 0.4,
            },
          },
        }
      );
    });
    return () => video.pause();
  });
}
