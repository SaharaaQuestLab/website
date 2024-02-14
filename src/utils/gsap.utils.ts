import { gsap } from "gsap";

export const makeAppearEffect = (el: string | HTMLElement) => {
  const target = el instanceof HTMLElement ? el : document.querySelector(el);
  if (!target) return;
  gsap.set(target, { y: '10%', opacity: 0 });
  gsap.to(target, {
    scrollTrigger: {
      trigger: target,
      start: "top bottom"
    },
    y: "0%",
    opacity: 1,
    duration: 0.33
  })
}