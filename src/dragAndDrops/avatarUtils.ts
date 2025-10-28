import './tiltCard.scss';

// src/dragAndDrops/TiltAnimator.ts
import VanillaTilt from 'vanilla-tilt';

export class TiltAnimator {
  private element: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tilt: any;

  constructor(element: HTMLElement) {
    this.element = element;
    this.initTilt();
    this.bindEvents();
  }

  private initTilt() {
    VanillaTilt.init(this.element, {
      max: 30, // максимальний кут нахилу
      speed: 300, // швидкість реакції
      glare: true, // відблиск
      'max-glare': 0.25, // інтенсивність відблиску
      scale: 1.03, // трохи збільшити під час drag
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.tilt = (this.element as any).vanillaTilt;
    this.element.classList.add('tilted-card');
  }

  private bindEvents() {
    document.addEventListener('dragend', this.destroy);
  }

  destroy = () => {
    document.removeEventListener('dragend', this.destroy);
    if (this.tilt) {
      this.tilt.destroy();
      this.element.classList.remove('tilted-card');
      this.element.style.transform = '';
    }
  };
}
