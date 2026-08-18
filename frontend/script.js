'use strict';

const COURSES = [
  {
    id: 'cs',
    icon: '💻',
    name: 'Computer Science',
    desc: 'Build software, algorithms & intelligent systems',
    duration: '3 Years',
    level: 'Undergraduate',
    modules: 36,
    seats: 24,
  },
  {
    id: 'business',
    icon: '📊',
    name: 'Business Administration',
    desc: 'Master strategy, leadership & modern management',
    duration: '3 Years',
    level: 'Undergraduate',
    modules: 30,
    seats: 40,
  },
  {
    id: 'design',
    icon: '🎨',
    name: 'Graphic Design',
    desc: 'Create compelling visual identities & experiences',
    duration: '2 Years',
    level: 'Diploma',
    modules: 24,
    seats: 18,
  },
  {
    id: 'ds',
    icon: '📈',
    name: 'Data Science',
    desc: 'Analyse data and build predictive ML models',
    duration: '2 Years',
    level: 'Postgraduate',
    modules: 28,
    seats: 20,
  },
  {
    id: 'marketing',
    icon: '📱',
    name: 'Digital Marketing',
    desc: 'Drive growth through digital channels & analytics',
    duration: '1 Year',
    level: 'Professional',
    modules: 16,
    seats: 35,
  },
];

const STEP_LABELS = [
  'Step 1 of 3 — Personal Info',
  'Step 2 of 3 — Course Selection',
  'Step 3 of 3 — Confirm & Submit',
];

const state = {
  step: 1,
  data: {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    course: null,
    address: '',
  },
};

const DOM = {};

function cacheDom() {
  DOM.headerStep = document.getElementById('header-step');

  DOM.pbSteps = document.querySelectorAll('.pb-step');
  DOM.conn12  = document.getElementById('conn-12');
  DOM.conn23  = document.getElementById('conn-23');

  DOM.stepPanels = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
  ];

  DOM.fullName     = document.getElementById('fullName');
  DOM.email        = document.getElementById('email');
  DOM.phone        = document.getElementById('phone');
  DOM.dob          = document.getElementById('dob');
  DOM.genderRadios = document.querySelectorAll('input[name="gender"]');

  DOM.dobAgeWrap = document.getElementById('dob-age-wrap');
  DOM.ageVal     = document.getElementById('age-val');

  DOM.courseGrid = document.getElementById('course-grid');
  DOM.cip        = document.getElementById('cip');
  DOM.cipLevel   = document.getElementById('cip-level');
  DOM.cipDur     = document.getElementById('cip-dur');
  DOM.cipMod     = document.getElementById('cip-mod');
  DOM.cipSeats   = document.getElementById('cip-seats');
  DOM.address    = document.getElementById('address');

  DOM.confirmSum = document.getElementById('confirm-summary');

  DOM.btnBack     = document.getElementById('btn-back');
  DOM.btnNext     = document.getElementById('btn-next');
  DOM.btnSubmit   = document.getElementById('btn-submit');
  DOM.submitLabel = document.getElementById('submit-label');
  DOM.btnSpinner  = document.getElementById('btn-spinner');

  DOM.pvAvatar = document.getElementById('pv-avatar');
  DOM.pvName   = document.getElementById('pv-name');
  DOM.pvEmail  = document.getElementById('pv-email');
  DOM.pvPhone  = document.getElementById('pv-phone');
  DOM.pvDob    = document.getElementById('pv-dob');
  DOM.pvCourse = document.getElementById('pv-course');
  DOM.pvpFill  = document.getElementById('pvp-fill');
  DOM.pvpText  = document.getElementById('pvp-text');
  DOM.pvpPct   = document.getElementById('pvp-pct');

  DOM.successScreen = document.getElementById('success-screen');
  DOM.ssName        = document.getElementById('ss-name');
  DOM.ssAppId       = document.getElementById('ss-app-id');
  DOM.ssDetails     = document.getElementById('ss-details');
  DOM.successTitle  = document.getElementById('success-heading');
  DOM.btnRegAgain   = document.getElementById('btn-register-again');

  DOM.pageMain     = document.getElementById('page-main');
  DOM.mobilePvBtn  = document.getElementById('mobile-preview-btn');
  DOM.previewPanel = document.getElementById('preview-panel');

  DOM.formErrorBanner = document.getElementById('form-error-banner');
  DOM.formErrorText   = document.getElementById('form-error-text');
}

const validators = {
  fullName(v) {
    const t = v.trim();
    if (!t)            return 'Full name is required.';
    if (t.length < 2)  return 'Name must be at least 2 characters.';
    if (t.length > 80) return 'Name must not exceed 80 characters.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/.test(t))
      return 'Name may only contain letters, spaces, hyphens, and apostrophes.';
    return '';
  },

  email(v) {
    const t = v.trim();
    if (!t) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t))
      return 'Please enter a valid email (e.g. jane@example.com).';
    return '';
  },

  phone(v) {
    const t = v.trim();
    if (!t) return 'Phone number is required.';
    const cleanDigits = t.replace(/[\s\-\(\)\.]/g, '');
    const indianPhoneRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanDigits))
      return 'Please enter a valid 10-digit Indian phone number (e.g. 9876543210).';
    return '';
  },

  dob(v) {
    if (!v) return 'Date of birth is required.';
    const d = new Date(v + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Please enter a valid date.';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d > today) return 'Date of birth cannot be in the future.';
    const age = calcAge(d);
    if (age < 5)   return 'Student must be at least 5 years old.';
    if (age > 120) return 'Please enter a valid date of birth.';
    return '';
  },

  gender() {
    return document.querySelector('input[name="gender"]:checked')
      ? '' : 'Please select a gender.';
  },

  course() {
    return state.data.course ? '' : 'Please select a course.';
  },

  address(v) {
    const t = v.trim();
    if (!t)            return 'Residential address is required.';
    if (t.length < 10) return 'Please enter a more complete address (at least 10 characters).';
    if (t.length > 400) return 'Address must not exceed 400 characters.';
    return '';
  },
};


function setFieldState(id, s, msg = '') {
  const fg  = document.getElementById('fg-' + id);
  const err = document.getElementById('e-' + id);
  if (!fg) return;

  fg.classList.remove('is-valid', 'is-invalid');

  const vi = fg.querySelector('.vi');
  if (vi)  { vi.textContent = ''; vi.style.color = ''; }
  if (err) { err.textContent = ''; }

  if (s === 'valid') {
    fg.classList.add('is-valid');
    if (vi) { vi.textContent = '✓'; vi.style.color = 'var(--clr-success)'; }
  } else if (s === 'invalid') {
    fg.classList.add('is-invalid');
    if (vi)  { vi.textContent = '✗'; vi.style.color = 'var(--clr-error)'; }
    if (err) { err.textContent = msg; }
  }
}


function validateField(id, value = '') {
  const fn  = validators[id];
  if (!fn) return true;
  const msg = (id === 'gender' || id === 'course') ? fn() : fn(value);
  if (msg) { setFieldState(id, 'invalid', msg); return false; }
  setFieldState(id, 'valid');
  return true;
}

function validateStep(step) {
  if (step === 1) {
    const r = [
      validateField('fullName', DOM.fullName.value),
      validateField('email',    DOM.email.value),
      validateField('phone',    DOM.phone.value),
      validateField('dob',      DOM.dob.value),
      validateField('gender'),
    ];
    const allOk = r.every(Boolean);
    if (!allOk) {
      const ids = ['fullName', 'email', 'phone', 'dob'];
      for (const id of ids) {
        const fg = document.getElementById('fg-' + id);
        if (fg && fg.classList.contains('is-invalid')) {
          document.getElementById(id).focus();
          break;
        }
      }
    }
    return allOk;
  }

  if (step === 2) {
    const r1 = validateField('course');
    const r2 = validateField('address', DOM.address.value);
    if (!r1 && !r2) { DOM.courseGrid.querySelector('.course-card').focus?.(); }
    else if (!r2)   { DOM.address.focus(); }
    return r1 && r2;
  }

  return true; 
}

function calcAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function updateAgeDisplay() {
  const v = DOM.dob.value;
  if (!v) { DOM.dobAgeWrap.hidden = true; return; }
  const d = new Date(v + 'T00:00:00');
  if (isNaN(d.getTime())) { DOM.dobAgeWrap.hidden = true; return; }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (d > today) { DOM.dobAgeWrap.hidden = true; return; }
  const age = calcAge(d);
  if (age < 0 || age > 120) { DOM.dobAgeWrap.hidden = true; return; }
  DOM.ageVal.textContent = age + (age === 1 ? ' year' : ' years');
  DOM.dobAgeWrap.hidden = false;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalize(str) {
  if (!str) return '—';
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function updatePreview() {
  const name   = DOM.fullName.value.trim();
  const email  = DOM.email.value.trim();
  const phone  = DOM.phone.value.trim();
  const dob    = DOM.dob.value;
  const course = state.data.course;

  const initials = getInitials(name);
  if (DOM.pvAvatar.textContent !== initials) {
    DOM.pvAvatar.textContent = initials;
  }

  function setPvField(el, text) {
    el.textContent = text || '—';
    el.dataset.empty = text ? 'false' : 'true';
  }

  setPvField(DOM.pvName,   name);
  setPvField(DOM.pvEmail,  email);
  setPvField(DOM.pvPhone,  phone);
  setPvField(DOM.pvDob,    dob ? formatDate(dob) : '');
  setPvField(DOM.pvCourse, course ? course.name : '');

  const step = state.step;
  const pct  = Math.round((step / 3) * 100);
  DOM.pvpFill.style.width = pct + '%';
  DOM.pvpText.textContent = STEP_LABELS[step - 1];
  DOM.pvpPct.textContent  = pct + '%';
}

function updateProgressBar(step) {
  DOM.pbSteps.forEach(el => {
    const s = parseInt(el.dataset.step, 10);
    el.classList.remove('pb-active', 'pb-done');
    el.removeAttribute('aria-current');
    if (s < step)        el.classList.add('pb-done');
    else if (s === step) { el.classList.add('pb-active'); el.setAttribute('aria-current', 'step'); }
  });
  DOM.conn12.classList.toggle('pb-done', step > 1);
  DOM.conn23.classList.toggle('pb-done', step > 2);
  DOM.headerStep.textContent = step;
}

function syncNavButtons() {
  const s = state.step;
  DOM.btnBack.hidden   = s === 1;
  DOM.btnNext.hidden   = s === 3;
  DOM.btnSubmit.hidden = s !== 3;
}

function goToStep(newStep, dir) {
  const current = DOM.stepPanels[state.step - 1];
  const next    = DOM.stepPanels[newStep - 1];
  if (!next || newStep === state.step) return;

  if (current) current.classList.remove('step-active', 'dir-back');

  next.classList.remove('dir-back');
  if (dir === 'backward') next.classList.add('dir-back');
  next.classList.add('step-active');

  state.step = newStep;
  updateProgressBar(newStep);
  syncNavButtons();
  updatePreview();

  setTimeout(() => {
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}

function renderCourseCards() {
  DOM.courseGrid.innerHTML = COURSES.map(c => `
    <label class="course-card" data-id="${c.id}">
      <input type="radio" name="course" value="${c.id}" aria-label="${esc(c.name)}" />
      <div class="cc-top">
        <span class="cc-icon" aria-hidden="true">${c.icon}</span>
        <span class="cc-check-badge" aria-hidden="true">✓</span>
      </div>
      <div class="cc-name">${esc(c.name)}</div>
      <div class="cc-desc">${esc(c.desc)}</div>
      <div class="cc-tags">
        <span class="cc-tag">${esc(c.level)}</span>
        <span class="cc-tag">${esc(c.duration)}</span>
      </div>
    </label>
  `).join('');

  DOM.courseGrid.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', onCourseSelect);
  });
}

function onCourseSelect(e) {
  const selectedId = e.target.value;
  const course     = COURSES.find(c => c.id === selectedId);
  if (!course) return;

  state.data.course = course;

  DOM.courseGrid.querySelectorAll('.course-card').forEach(card => {
    card.classList.toggle('cc-selected', card.dataset.id === selectedId);
  });

  DOM.cipLevel.textContent = course.level;
  DOM.cipDur.textContent   = course.duration;
  DOM.cipMod.textContent   = course.modules + ' Modules';
  DOM.cipSeats.textContent = course.seats + ' Seats';

  DOM.cip.hidden = false;
  DOM.cip.classList.remove('cip-anim');
  void DOM.cip.offsetWidth; 
  DOM.cip.classList.add('cip-anim');

  setFieldState('course', 'valid');
  updatePreview();
}

function populateConfirmation() {
  const genderEl  = document.querySelector('input[name="gender"]:checked');
  const genderVal = genderEl ? capitalize(genderEl.value) : '—';
  const course    = state.data.course;

  DOM.confirmSum.innerHTML = `
    <div class="cs-section">
      <div class="cs-section-title">Personal Information</div>
      <div class="cs-grid">
        <div>
          <div class="cs-key">Full Name</div>
          <div class="cs-val">${esc(DOM.fullName.value.trim() || '—')}</div>
        </div>
        <div>
          <div class="cs-key">Email Address</div>
          <div class="cs-val">${esc(DOM.email.value.trim() || '—')}</div>
        </div>
        <div>
          <div class="cs-key">Phone Number</div>
          <div class="cs-val">${esc(DOM.phone.value.trim() || '—')}</div>
        </div>
        <div>
          <div class="cs-key">Date of Birth</div>
          <div class="cs-val">${esc(formatDate(DOM.dob.value))}</div>
        </div>
        <div>
          <div class="cs-key">Gender</div>
          <div class="cs-val">${esc(genderVal)}</div>
        </div>
      </div>
    </div>

    <div class="cs-section">
      <div class="cs-section-title">Course Selection</div>
      ${course ? `
        <div class="cs-course-row">
          <span class="cs-course-icon" aria-hidden="true">${course.icon}</span>
          <div>
            <div class="cs-course-name">${esc(course.name)}</div>
            <div class="cs-course-meta">${esc(course.level)} &middot; ${esc(course.duration)}</div>
          </div>
        </div>
      ` : '<div class="cs-val">No course selected</div>'}
    </div>

    <div class="cs-section">
      <div class="cs-section-title">Residential Address</div>
      <div class="cs-address">${esc(DOM.address.value.trim() || '—')}</div>
    </div>
  `.trim();
}

function generateAppId() {
  const year = new Date().getFullYear();
  const num  = Math.floor(1000 + Math.random() * 9000);
  return `EDU-${year}-${num}`;
}

async function handleSubmit() {
  const ok1 = validateStep(1);
  const ok2 = validateStep(2);

  if (!ok1) { goToStep(1, 'backward'); return; }
  if (!ok2) { goToStep(2, 'backward'); return; }

  if (DOM.formErrorBanner) DOM.formErrorBanner.hidden = true;

  DOM.submitLabel.textContent = 'Submitting Registration…';
  DOM.btnSpinner.hidden       = false;
  DOM.btnSubmit.disabled      = true;
  DOM.btnBack.disabled        = true;

  const genderEl = document.querySelector('input[name="gender"]:checked');

  const studentData = {
    name: DOM.fullName.value.trim(),
    email: DOM.email.value.trim(),
    phone: DOM.phone.value.trim(),
    date_of_birth: DOM.dob.value,
    gender: genderEl ? genderEl.value : '',
    course: state.data.course ? state.data.course.name : '',
    address: DOM.address.value.trim(),
  };

  const API_URL = window.API_BASE_URL || 'http://localhost:5000/api/students';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccessScreen(result.registrationId || generateAppId(), result.student);
    } else {
      let errorMsg = result.message || 'Unable to complete registration. Please try again.';
      if (result.errors) {
        const details = Object.values(result.errors).join(' ');
        errorMsg += ' ' + details;
      }
      showFormError(errorMsg);
      reEnableSubmitButtons();
    }
  } catch (error) {
    console.error('Network or Server connection error:', error);
    showFormError('Unable to connect to the server. Please verify the backend server is running on port 5000.');
    reEnableSubmitButtons();
  }
}

function showFormError(msg) {
  if (DOM.formErrorText && DOM.formErrorBanner) {
    DOM.formErrorText.textContent = msg;
    DOM.formErrorBanner.hidden = false;
    DOM.formErrorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    alert(msg);
  }
}

function reEnableSubmitButtons() {
  DOM.submitLabel.textContent = 'Submit Registration →';
  DOM.btnSpinner.hidden       = true;
  DOM.btnSubmit.disabled      = false;
  DOM.btnBack.disabled        = false;
}

function showSuccessScreen(appId, studentObj) {
  const name   = (studentObj && studentObj.name) || DOM.fullName.value.trim();
  const email  = (studentObj && studentObj.email) || DOM.email.value.trim();
  const phone  = (studentObj && studentObj.phone) || DOM.phone.value.trim();
  const course = (studentObj && studentObj.course) ? studentObj.course : (state.data.course ? state.data.course.name : '—');

  DOM.ssName.textContent  = name;
  DOM.ssAppId.textContent = appId;

  DOM.ssDetails.innerHTML = [
    { icon: '🎓', text: course },
    { icon: '✉️', text: email },
    { icon: '📞', text: phone },
  ].map(row => `
    <div class="ss-detail-row">
      <span aria-hidden="true">${row.icon}</span>
      <span>${esc(row.text)}</span>
    </div>
  `).join('');

  DOM.pageMain.hidden      = true;
  DOM.successScreen.hidden = false;
  DOM.successTitle.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetAll() {
  state.step = 1;
  state.data = { fullName: '', email: '', phone: '', dob: '', gender: '', course: null, address: '' };

  if (DOM.formErrorBanner) DOM.formErrorBanner.hidden = true;

  DOM.fullName.value = '';
  DOM.email.value    = '';
  DOM.phone.value    = '';
  DOM.dob.value      = '';
  DOM.address.value  = '';
  DOM.genderRadios.forEach(r => { r.checked = false; });
  DOM.courseGrid.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });

  DOM.courseGrid.querySelectorAll('.course-card').forEach(c => c.classList.remove('cc-selected'));
  DOM.cip.hidden = true;

  document.querySelectorAll('.fg').forEach(fg => fg.classList.remove('is-valid', 'is-invalid'));
  document.querySelectorAll('.vi').forEach(vi => { vi.textContent = ''; vi.style.color = ''; });
  document.querySelectorAll('.fe').forEach(fe => { fe.textContent = ''; });

  DOM.dobAgeWrap.hidden = true;

  DOM.stepPanels.forEach(p => p.classList.remove('step-active', 'dir-back'));
  DOM.stepPanels[0].classList.add('step-active');

  DOM.btnBack.hidden      = true;
  DOM.btnNext.hidden      = false;
  DOM.btnSubmit.hidden    = true;
  DOM.btnSubmit.disabled  = false;
  DOM.btnBack.disabled    = false;
  DOM.submitLabel.textContent = 'Submit Registration →';
  DOM.btnSpinner.hidden   = true;

  DOM.previewPanel.classList.remove('preview-open');
  DOM.mobilePvBtn.setAttribute('aria-expanded', 'false');

  updateProgressBar(1);
  updatePreview();

  DOM.successScreen.hidden = true;
  DOM.pageMain.hidden      = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function wireTextInput(el, fieldId) {
  el.addEventListener('input', () => {
    updatePreview();
    const fg = document.getElementById('fg-' + fieldId);
    if (fg && fg.classList.contains('is-invalid')) validateField(fieldId, el.value);
  });
  el.addEventListener('blur', () => validateField(fieldId, el.value));
}

function attachEvents() {
  DOM.btnNext.addEventListener('click', () => {
    if (!validateStep(state.step)) return;
    if (state.step === 2) populateConfirmation();
    goToStep(state.step + 1, 'forward');
  });

  DOM.btnBack.addEventListener('click', () => goToStep(state.step - 1, 'backward'));
  DOM.btnSubmit.addEventListener('click', handleSubmit);
  DOM.btnRegAgain.addEventListener('click', resetAll);

  wireTextInput(DOM.fullName, 'fullName');
  wireTextInput(DOM.email,    'email');
  wireTextInput(DOM.phone,    'phone');

  DOM.dob.addEventListener('change', () => {
    updateAgeDisplay();
    updatePreview();
    validateField('dob', DOM.dob.value);
  });

  DOM.genderRadios.forEach(radio => {
    radio.addEventListener('change', () => validateField('gender'));
  });

  DOM.address.addEventListener('input', () => {
    const fg = document.getElementById('fg-address');
    if (fg && fg.classList.contains('is-invalid')) validateField('address', DOM.address.value);
  });
  DOM.address.addEventListener('blur', () => validateField('address', DOM.address.value));

  DOM.mobilePvBtn.addEventListener('click', () => {
    const isOpen = DOM.previewPanel.classList.toggle('preview-open');
    DOM.mobilePvBtn.setAttribute('aria-expanded', String(isOpen));
  });

  DOM.courseGrid.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      const card = e.target.closest('.course-card');
      if (card) {
        e.preventDefault();
        const radio = card.querySelector('input[type="radio"]');
        if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
      }
    }
  });
}

function init() {
  cacheDom();
  renderCourseCards();
  attachEvents();
  updateProgressBar(1);
  syncNavButtons();
  updatePreview();

  const today = new Date().toISOString().split('T')[0];
  DOM.dob.setAttribute('max', today);
}

document.addEventListener('DOMContentLoaded', init);
