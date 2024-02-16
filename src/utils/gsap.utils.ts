import { gsap } from "gsap";

export const makeAppearEffect = (el: string | HTMLElement) => {
  const target = el instanceof HTMLElement ? el : document.querySelector(el);
  if (!target) return;
  console.log('target', target)
  gsap.set(target, { y: '50%', opacity: 0 });
  gsap.to(target, {
    scrollTrigger: {
      trigger: target,
      start: "top bottom"
    },
    y: "0%",
    opacity: 1,
    duration: 0.6,
    delay: 1,
  })
}

export const makeCommonAppearEffect = (selector?: string) => {
  const targets = document.querySelectorAll(selector || '.common-up-move');
  if (targets && targets.length) {
    targets.forEach(item => {
      makeAppearEffect(item as HTMLElement);
    })
  }
}