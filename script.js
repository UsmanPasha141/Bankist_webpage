'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// console.log(btnsOpenModal);
const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
// console.log(tabsContainer);
const tabscontent = document.querySelectorAll('.operations__content');
// console.log(tabscontent);

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modal => {
  modal.addEventListener('click', openModal);
});
// btnsOpenModal.addEventListener('click', openModal); // if we uses the only querySelector

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////
//button scrolling

btnScrollTo.addEventListener('click', function () {
  // const s1scoords = section1.getBoundingClientRect();
  // console.log(s1scoords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  //scrolling
  // window.scrollTo(
  //   s1scoords.left + window.pageXOffset,
  //   s1scoords.top + window.pageYOffset
  // );
  // old school way
  // window.scrollTo({
  //   left: s1scoords.left + window.pageXOffset,
  //   top: s1scoords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////
//page Navigation
// const navItems = document.querySelectorAll('.nav__link');
// console.log(navItems);
// navItems.forEach(item => {
//   item.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     const section = document.querySelector(id);
//     section.scrollIntoView({ behavior: 'smooth' });
//   });
// });

//Event Deligation
const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', function (e) {
  // console.log(e.target.tagName); //A UL LI
  // console.log(e.target); //A UL LI

  // i did using chatgpt
  // if (e.target.tagName === 'A') {
  //   const sec = e.target.getAttribute('href');
  //   // console.log(sec);
  //   const section = document.querySelector(sec);
  //   // console.log(section);
  //   section.scrollIntoView({ behavior: 'smooth' });
  // }

  // console.log(e.target.classList.contains('nav__link'));
  // jonas did matching stratigy
  e.preventDefault();
  console.log(e.target.className);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  // console.log(e.target);
  // console.log(e.target.getAttribute('data-tab'));
  const clicked = e.target.closest('.operations__tab');

  //Gward clause
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabscontent.forEach(t => t.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  // Active content
  const datatabNo = clicked.getAttribute('data-tab');
  // console.log(datatabNo);
  const str = `operations__content--${datatabNo}`;
  // console.log(str);
  const openTab = document.querySelector(`.${str}`);
  // console.log(openTab);
  openTab.classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
const hoverFunc1 = handleHover.bind(0.5);
const hoverFunc2 = handleHover.bind(1);
nav.addEventListener('mouseover', hoverFunc1);
nav.addEventListener('mouseout', hoverFunc2);

// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY >= initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// Sticky Navigation Intersection Observer API;

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect();
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  //if entery.isIntersecting === false
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

// sliding animation of each section
const allSections = document.querySelectorAll('.section');
// console.log(sections);

const sectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return 0;

    entry.target.classList.remove('section--hidden');
    // once it completes its effect over the section again if we scroll up it shoukd unobseve the section
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);
allSections.forEach(section => {
  section.classList.add('section--hidden'); // for transfor that is animation added
  sectionObserver.observe(section);
});

//LazyLoading Images
function lazyloadImageFunc(entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  //guard class
  if (!entry.isIntersecting) return;

  //replace src with data-src bcz for the ghigh resolution
  entry.target.src = entry.target.dataset.src;
  //  entry.target.classList.remove('lazy-img');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
const lazyloadImageObj = {
  root: null, //view port
  threshold: 0, //20%
  rootMargin: '200px', //to load before that a user dont notice
};
const lazyloadImageObserver = new IntersectionObserver(
  lazyloadImageFunc,
  lazyloadImageObj
);

const allImages = document.querySelectorAll('.features__img');
// const allImages = document.querySelectorAll('img[data-src');
// console.log(allImages);
allImages.forEach(img => {
  lazyloadImageObserver.observe(img);
});

// Slider

const sliderFunctionality = function () {
  const slides = document.querySelectorAll('.slide');
  // console.log(slides);
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // functions;
  const createDots = function () {
    slides.forEach((_, i) => {
      const html = `<button class="dots__dot" data-slide="${i}"></button>`;
      dotContainer.insertAdjacentHTML('beforeend', html);
    });
  };

  // highliteDots
  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  // functionality of slides
  const gotoSlide = function (slide) {
    slides.forEach((s, i) => {
      //0%,100%,200%,300%
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  //0%,100%,200%,300%
  // slides.forEach((slide, i) => {
  //   slide.style.transform = `translateX(${i * 100}%)`;
  // });
  // OR

  //next slide
  const nextSlide = function () {
    //0%,100%,200%,300%
    //-100,0,-100,-200
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    //   console.log(curSlide);
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    //   console.log(e.target.getAttribute("data-slide"));
    //   console.log(e.target);
    if (e.target.classList.contains('dots__dot')) {
      // const slideNo = e.target.getAttribute("data-slide");
      const slideNo = e.target.dataset.slide;
      gotoSlide(slideNo);
      activateDot(slideNo);
    }
  });
};
sliderFunctionality();

////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/*
// Selecting;
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allbtns = document.getElementsByTagName('button');
console.log(allbtns);

console.log(document.getElementsByClassName('btn'));

//Creating and inserting ele
// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
// 'we use cookies for improved the functionality and analytics.';
message.innerHTML =
  'we use cookies for improved the functionality and analytics. <button class="btn btn--close-cookie">Got it</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
header.after(message);

// deleting the element
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    document.querySelector('.cookie-message').remove();
  });

const newEle = `<section class="cookie-message" id="section--4">
  <div class="section__title"> USMAN is GOOD </div></section>`;
header.insertAdjacentHTML('beforebegin', newEle);

//styles
message.style.backgroundColor = '#37383d';
document.querySelector('.cookie-message').style.backgroundColor = '#37383d';
message.style.width = '100%';
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
console.log(logo.id);

logo.alt = 'beautifull minimalistic logo';
console.log(logo.alt);

const link = document.querySelector('.nav__link--btn');
console.log(link.getAttribute('href'));

//classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');
*/

//events
/*
const h1 = document.querySelector('h1');

const alertMessage = function (e) {
  alert('addEventListener: Great! You are reading the Heading');

  // h1.removeEventListener('mouseenter', alertMessage);
};
h1.addEventListener('mouseenter', alertMessage);

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertMessage);
}, 3000);

//bit using in the old days
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the Heading');
// };

// h1.onclick = function (e) {
//   alert('onclick: Great! You are reading the Heading');
// };
*/

// rgb(255,255,255)
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, this);
  console.log(e.currentTarget === this);

  //stop propagation
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINR', this);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, this);
});
*/

/*
const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// document
//   .querySelector('.nav__link')
//   .closest('.nav__links').style.backgroundColor = 'yellow';

// Going sideWayes:siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
const arr = [...h1.parentElement.children];
arr.forEach(el => {
  if (el !== h1) el.style.transform = 'scale(0.5';
});
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully Loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'message';
// });
