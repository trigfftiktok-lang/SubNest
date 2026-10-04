const actionChips = [...document.querySelectorAll('.action-pill')];
const linkForm = document.querySelector('#link-form');
const sourceUrl = document.querySelector('#source-url');
const destinationUrl = document.querySelector('#destination-url');
const urlError = document.querySelector('#url-error');
const generatedResult = document.querySelector('#generated-result');
const generatedTitle = document.querySelector('#generated-title');
const generatedMeta = document.querySelector('#generated-meta');
const generatedUnlock = document.querySelector('#unlock-generated');
const copyButton = document.querySelector('#copy-link');
const resetButton = document.querySelector('#reset-form');
const phoneUnlockButton = document.querySelector('#phone-unlock-button');
const toast = document.querySelector('#toast');
const toastText = document.querySelector('#toast-text');
const sourceWrap = document.querySelector('#source-url')?.closest('.builder-input-wrap');
const destinationWrap = document.querySelector('#destination-url')?.closest('.builder-input-wrap');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

let toastTimer;
const AD_URL = 'https://t.co/FZ2NWlqc3C';
const PREVIEW_DESTINATION = 'https://example.com/creator-pack';

function getSelectedActions() {
  return actionChips.filter((chip) => chip.classList.contains('selected'));
}

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function createSlug(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').split('.')[0];
    const suffixes = ['bright-nest', 'creator-drop', 'golden-link', 'next-wave'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${host || 'your'}-${suffix}`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
  } catch {
    return 'your-bright-nest';
  }
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function updateInputState(input, wrap) {
  if (!input || !wrap) return;
  wrap.classList.toggle('valid', isValidUrl(input.value.trim()));
}

function setUnlockButtonState(button, adOpened) {
  if (!button) return;
  button.classList.toggle('ad-opened', adOpened);
  button.classList.remove('unlocked');
  button.innerHTML = adOpened ? 'Unlock file <span>→</span>' : 'Open unlock link <span>↗</span>';
}

function handleUnlockClick(button, destination, storageKey) {
  if (!button || !storageKey) return;
  const adWasOpened = localStorage.getItem(storageKey) === 'opened';

  if (!adWasOpened) {
    window.open(AD_URL, '_blank', 'noopener,noreferrer');
    localStorage.setItem(storageKey, 'opened');
    setUnlockButtonState(button, true);
    showToast('Ad opened in a new tab — click again to unlock');
    return;
  }

  window.open(destination || PREVIEW_DESTINATION, '_blank', 'noopener,noreferrer');
  localStorage.removeItem(storageKey);
  button.classList.remove('ad-opened');
  button.classList.add('unlocked');
  button.innerHTML = 'File opened <span>✓</span>';
  showToast('Your file is opening');
}

actionChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    const label = chip.textContent.replace(/^[−+]\s*/, '').trim();
    chip.textContent = `${chip.classList.contains('selected') ? '−' : '+'} ${label}`;
  });
});

sourceUrl?.addEventListener('input', () => updateInputState(sourceUrl, sourceWrap));
destinationUrl?.addEventListener('input', () => updateInputState(destinationUrl, destinationWrap));

linkForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const sourceValue = sourceUrl?.value.trim() || '';
  const destinationValue = destinationUrl?.value.trim() || '';
  let valid = true;
  urlError.textContent = '';
  sourceUrl?.removeAttribute('aria-invalid');
  destinationUrl?.removeAttribute('aria-invalid');

  if (!sourceValue || !isValidUrl(sourceValue)) {
    urlError.textContent = 'Add a valid YouTube or social URL first.';
    sourceUrl?.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (!destinationValue || !isValidUrl(destinationValue)) {
    urlError.textContent = 'Add a valid destination or file URL to continue.';
    destinationUrl?.setAttribute('aria-invalid', 'true');
    valid = false;
  }

  if (getSelectedActions().length === 0) {
    urlError.textContent = 'Choose at least one social action before generating.';
    valid = false;
  }

  if (!valid) {
    (sourceValue && !isValidUrl(destinationValue) ? destinationUrl : sourceUrl)?.focus();
    return;
  }

  const slug = createSlug(destinationValue);
  const actionTotal = getSelectedActions().length;
  const storageKey = `subnest-ad-${slug}`;
  generatedTitle.textContent = `subnest.to/${slug}`;
  generatedMeta.textContent = `${actionTotal} action${actionTotal === 1 ? '' : 's'} · click twice to unlock`;
  generatedUnlock.dataset.destination = destinationValue;
  generatedUnlock.dataset.storageKey = storageKey;
  setUnlockButtonState(generatedUnlock, localStorage.getItem(storageKey) === 'opened');
  generatedResult.hidden = false;
  generatedResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Your unlock link is ready');
});

generatedUnlock?.addEventListener('click', () => {
  handleUnlockClick(generatedUnlock, generatedUnlock.dataset.destination, generatedUnlock.dataset.storageKey);
});

phoneUnlockButton?.addEventListener('click', () => {
  handleUnlockClick(phoneUnlockButton, destinationUrl?.value.trim() || PREVIEW_DESTINATION, 'subnest-ad-preview');
});

copyButton?.addEventListener('click', async () => {
  const shareLink = `https://subnest.to/${generatedTitle.textContent.split('/').pop()}`;
  try {
    await navigator.clipboard.writeText(shareLink);
    showToast('Link copied to clipboard');
  } catch {
    showToast('Link ready to share');
  }
});

resetButton?.addEventListener('click', () => {
  const storageKey = generatedUnlock?.dataset.storageKey;
  if (storageKey) localStorage.removeItem(storageKey);
  generatedResult.hidden = true;
  if (sourceUrl) sourceUrl.value = '';
  if (destinationUrl) destinationUrl.value = '';
  urlError.textContent = '';
  sourceWrap?.classList.remove('valid');
  destinationWrap?.classList.remove('valid');
  sourceUrl?.removeAttribute('aria-invalid');
  destinationUrl?.removeAttribute('aria-invalid');
  if (generatedUnlock) {
    delete generatedUnlock.dataset.destination;
    delete generatedUnlock.dataset.storageKey;
    setUnlockButtonState(generatedUnlock, false);
  }
  sourceUrl?.focus();
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    const indicator = detail.querySelector('summary b');
    if (indicator) indicator.textContent = detail.open ? '−' : '+';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.section-light .reveal, .faq-section .reveal, .feature-card').forEach((element) => observer.observe(element));
