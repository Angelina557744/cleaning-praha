const SERVICES = [
  { id: 'sofa3',      name: 'Трёхместный диван',              price: 900,  unit: 'от',  type: 'fixed' },
  { id: 'sofa4',      name: 'Четырёхместный диван',           price: 1100, unit: 'от',  type: 'fixed' },
  { id: 'sofa5',      name: 'Пятиместный диван',              price: 1300, unit: 'от',  type: 'fixed' },
  { id: 'corner',     name: 'Угловой диван без подушек',      price: 1000, unit: 'от',  type: 'fixed' },
  { id: 'matras1',    name: 'Матрас — одна сторона',          price: 900,  unit: 'от',  type: 'fixed' },
  { id: 'matras2',    name: 'Матрас — две стороны',           price: 1600, unit: 'от',  type: 'fixed' },
  { id: 'carpet',     name: 'Ковёр',                          price: 120,  unit: 'от',  type: 'per_m2' },
  { id: 'chairsoft',  name: 'Мягкий стул',                    price: 300,  unit: 'от',  type: 'fixed' },
  { id: 'armchair',   name: 'Кресло',                         price: 200,  unit: 'от',  type: 'fixed' },
  { id: 'stool',      name: 'Табурет / пуф',                  price: 100,  unit: 'от',  type: 'fixed' },
  { id: 'sofa2',      name: 'Двухместная сидячая секция',     price: 300,  unit: 'от',  type: 'fixed' },
  { id: 'sofabig',    name: 'Большой / модульный / П-образный диван', price: 1500, unit: 'от', type: 'fixed' },
  { id: 'carpeting',  name: 'Ковролин',                       price: 100,  unit: 'от',  type: 'per_m2' },
  { id: 'headboard',  name: 'Изголовье и мягкий каркас кровати', price: 500, unit: 'от', type: 'fixed' },
  { id: 'pillow',     name: 'Подушка / сиденье',              price: 100,  unit: 'от',  type: 'fixed' },
  { id: 'office',     name: 'Офисное кресло',                 price: 200,  unit: 'от',  type: 'fixed' },
  { id: 'urine',      name: 'Устранение запаха мочи — гарантия 100%', price: 300, unit: 'от', type: 'fixed' },
  { id: 'other',      name: 'Другие текстильные поверхности',  price: null, unit: '',    type: 'photo' },
  { id: 'dry',        name: 'Сушка мебели',                   price: 400,  unit: '',    type: 'fixed' },
];

const MIN_ORDER = 900;

const FAQ = [
  { q: 'Как узнать точную цену?', a: 'Менеджер определит её по фотографиям или мастер при осмотре на месте. Стоимость согласовывается с вами до начала работ.' },
  { q: 'Можно приехать сегодня?', a: 'Выезд сегодня возможен при наличии свободного мастера. Работаем 24/7. Выбранное в заявке время не означает автоматического подтверждения записи.' },
  { q: 'Что входит в расчёт?', a: 'Калькулятор показывает начальную стоимость выбранных услуг и учитывает минимальный заказ 900 Kč. Позиции без прайса рассчитываются отдельно.' },
  { q: 'Выезд по Праге платный?', a: 'Нет, выезд по Праге бесплатный.' },
  { q: 'Как работает сушка?', a: 'Сушку мебели можно добавить за 400 Kč. Время высыхания мастер уточнит с учётом ткани и условий.' },
];

const fmtPrice = (n) => n.toLocaleString('cs-CZ').replace(/\u00a0/g, ' ') + ' Kč';
const priceLabel = (s) => s.price == null
  ? 'Цена по фото'
  : `${s.unit ? s.unit + ' ' : ''}${fmtPrice(s.price)}${s.type === 'per_m2' ? '/m²' : ''}`;

function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card">
      <div class="service-name">${s.name}</div>
      <div class="service-price">${priceLabel(s)}</div>
    </div>
  `).join('');
}

function renderCalculator() {
  const wrap = document.getElementById('calcItems');
  if (!wrap) return;
  wrap.innerHTML = SERVICES.map(s => `
    <label class="calc-item" data-id="${s.id}">
      <input type="checkbox" data-id="${s.id}" />
      <div class="calc-item-body">
        <div class="calc-item-name">${s.name}</div>
        <div class="calc-item-price">${priceLabel(s)}</div>
      </div>
    </label>
  `).join('');

  wrap.addEventListener('change', (e) => {
    const item = e.target.closest('.calc-item');
    if (!item) return;
    item.classList.toggle('selected', e.target.checked);
    updateTotals();
  });

  updateTotals();
}

function getSelected() {
  return [...document.querySelectorAll('.calc-item input[type="checkbox"]:checked')]
    .map(cb => SERVICES.find(s => s.id === cb.dataset.id))
    .filter(Boolean);
}

function calcSum() {
  return getSelected().reduce((acc, s) => acc + (s.price ?? 0), 0);
}

function updateTotals() {
  const sum = calcSum();
  const total = Math.max(sum, MIN_ORDER);
  const has = getSelected().length > 0;
  const text = `от ${fmtPrice(has ? total : MIN_ORDER)}`;

  const c = document.getElementById('calcTotal');
  const f = document.getElementById('formTotal');
  const ft = document.getElementById('footerTotal');
  if (c) c.textContent = text;
  if (f) f.textContent = text;
  if (ft) ft.textContent = text;
}

function renderFaq() {
  const wrap = document.getElementById('faq');
  if (!wrap) return;
  wrap.innerHTML = FAQ.map((item, i) => `
    <div class="faq-item">
      <button type="button" class="faq-q" aria-expanded="false" data-index="${i}">
        <span>${item.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
    </div>
  `).join('');

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement;
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

function initBeforeAfter() {
  document.querySelectorAll('.ba-image').forEach(box => {
    const after  = box.querySelector('.ba-after');
    const line   = box.querySelector('.ba-line');
    const handle = box.querySelector('.ba-handle');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = box.getBoundingClientRect();
      let p = (clientX - rect.left) / rect.width;
      p = Math.max(0, Math.min(1, p));
      const percent = p * 100;
      if (after)  after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      if (line)   line.style.left   = percent + '%';
      if (handle) handle.style.left = percent + '%';
    };

    const start = (e) => { dragging = true; setPos(e.touches ? e.touches[0].clientX : e.clientX); };
    const move  = (e) => {
      if (!dragging) return;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
      if (e.cancelable) e.preventDefault();
    };
    const end = () => { dragging = false; };

    box.addEventListener('mousedown', start);
    box.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
  });
}

function initForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.phone || !data.date || !data.time) {
      alert('Пожалуйста, заполните имя, телефон, дату и время.');
      return;
    }

    const success = document.getElementById('formSuccess');
    if (success) success.hidden = false;
    form.reset();
    document.querySelectorAll('.calc-item.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.calc-item input').forEach(cb => cb.checked = false);
    updateTotals();
  });
}

function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function initVideoStages() {
  const bg = document.querySelector('.video-bg');
  const frame = document.getElementById('bgFrame');
  const v1 = document.getElementById('bgV1');
  const v2 = document.getElementById('bgV2');
  const videoSections = document.querySelectorAll('.video-section');
  if (!bg || !frame || !v1 || !v2 || !videoSections.length) return;

  const FORWARD = { '1': 'videos/video-1.mp4', '2': 'videos/video-2.mp4' };
  const REVERSE = { '1': 'videos/reverse-1.mp4', '2': 'videos/reverse-2.mp4' };
  const VIDEO_MAP = { '1': v1, '2': v2 };
  const LAYER_INDEX = { '1': 1, '2': 2 };

  let scrollDir = 1;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastY + 2) scrollDir = 1;
    else if (window.scrollY < lastY - 2) scrollDir = -1;
    lastY = window.scrollY;
  }, { passive: true });

  function setBg(idx) {
    [frame, v1, v2].forEach((el, i) => el.classList.toggle('is-active', i === idx));
  }

  const isPlaying = { '1': false, '2': false };

  videoSections.forEach((section) => {
    const which = section.dataset.video;
    const video = VIDEO_MAP[which];
    if (!video) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (isPlaying[which]) return;

        isPlaying[which] = true;
        section.classList.add('is-playing');
        bg.classList.add('is-playing');

        const src = scrollDir === 1 ? FORWARD[which] : REVERSE[which];
        video.src = src;
        video.load();
        video.currentTime = 0;
        video.muted = true;
        video.playbackRate = 1.5;

        setBg(LAYER_INDEX[which]);

        const onEnded = () => {
          video.removeEventListener('ended', onEnded);
          section.classList.remove('is-playing');
          bg.classList.remove('is-playing');
          isPlaying[which] = false;
        };
        video.addEventListener('ended', onEnded);

        const promise = video.play();
        if (promise && promise.catch) {
          promise.catch(() => {
            section.classList.remove('is-playing');
            bg.classList.remove('is-playing');
            isPlaying[which] = false;
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

    observer.observe(section);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderCalculator();
  renderFaq();
  initBeforeAfter();
  initForm();
  initYear();
  initVideoStages();
});