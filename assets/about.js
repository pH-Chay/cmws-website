async function renderClubs() {
  const list = document.querySelector('#club-list');
  if (!list) return;

  const clubs = await loadJSON('data/clubs.json');
  clubs.forEach(club => list.insertAdjacentHTML('beforeend', `<article class="club"><div><h3>${club.name}</h3><div class="club-meta">${club.seat} · est. ${club.established}<br>${club.role}</div></div><div><p>${club.description}</p>${club.website ? `<a href="${club.website}" target="_blank" rel="noopener">Club website →</a>` : ''}</div></article>`));
}

function initializeVisitCarousel() {
  const carousel = document.querySelector('.visit-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.visit-carousel-track');
  const photos = Array.from(track.children);
  const controls = carousel.querySelector('.visit-carousel-controls');
  const position = controls.querySelector('.visit-carousel-position');
  const buttons = Array.from(controls.querySelectorAll('button'));
  const last = photos.length - 1;
  let current = -1;
  let destination = null;

  function setPosition(index) {
    if (index === current) return;

    current = index;
    position.textContent = `${current + 1} of ${photos.length}`;
    buttons[0].setAttribute('aria-disabled', String(current === 0));
    buttons[1].setAttribute('aria-disabled', String(current === last));
  }

  function updatePosition() {
    const width = track.clientWidth;
    if (!width) return;
    if (destination !== null && Math.abs(track.scrollLeft - destination * width) > 1) return;

    destination = null;
    setPosition(Math.max(0, Math.min(last, Math.round(track.scrollLeft / width))));
  }

  function followTrack() {
    destination = null;
    updatePosition();
  }

  function showPhoto(index) {
    if (index < 0 || index > last) return;

    destination = index;
    setPosition(index);
    track.scrollTo({ left: index * track.clientWidth });
    updatePosition();
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => showPhoto(current + Number(button.dataset.step)));
  });

  track.addEventListener('scroll', updatePosition, { passive: true });
  track.addEventListener('scrollend', followTrack);
  track.addEventListener('pointerdown', followTrack, { passive: true });
  track.addEventListener('wheel', followTrack, { passive: true });
  track.addEventListener('keydown', event => {
    const target = {
      ArrowLeft: current - 1,
      ArrowRight: current + 1,
      Home: 0,
      End: last,
    }[event.key];
    if (typeof target !== 'number' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    event.preventDefault();
    showPhoto(target);
  });

  track.classList.add('is-interactive');
  updatePosition();
  controls.hidden = false;
}

initializeVisitCarousel();
renderClubs();
