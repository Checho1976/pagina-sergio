/**
 * script.js
 * Servicios Personalizados — Servicios del Hogar
 * ─────────────────────────────────────────
 * Módulos:
 *   1. Proyectos dinámicos
 *   2. Header scrolleado
 *   3. Menú móvil
 *   4. Scroll reveal
 *   5. Microinteracciones
 *   6. Footer año dinámico
 *   7. Smooth scroll a anclas
 * ─────────────────────────────────────────
 */

'use strict';

/* ================================================================
  1. PROYECTOS — Datos y renderizado dinámico
================================================================ */

/**
 * Array de proyectos.
 * Para ocultar la sección, dejarlo vacío: []
 * Cada objeto admite: { titulo, categoria, descripcion, imagen, alt }
 * "imagen" puede ser una URL real o una ruta local.
 */
const PROYECTOS = [

  // ─────────────────────────────────────────────────────────────────
  // CÓMO AGREGAR TUS FOTOS:
  //
  // En el campo "imagen" podés poner:
  //   • Una ruta local:  'fotos/trabajo1.jpg'
  //     (la foto tiene que estar en una carpeta "fotos" junto al index.html)
  //   • Una URL directa: 'https://ejemplo.com/foto.jpg'
  //
  // Recomendación de tamaño: mínimo 800×600 px, formato JPG o WEBP.
  // ─────────────────────────────────────────────────────────────────

  {
  titulo:      'Tablero nuevo · Pocitos',
  categoria:   'Electricidad',
  descripcion: 'Renovación completa del tablero eléctrico en apartamento de Pocitos. Instalación de diferencial y termomagnéticas nuevas con cableado ordenado y seguro. Trabajo terminado en medio día.',
  imagen:      './img/proyecto1.JPG',
  alt:         'Tablero eléctrico renovado en vivienda de Pocitos',
},

{
  titulo:      'Cielorraso liso · Cordón',
  categoria:   'Construcción en Yeso',
  descripcion: 'Instalación y terminación de cielorraso de yeso en dormitorio de apartamento en Cordón. Superficie completamente alisada con moldura perimetral y lista para pintar.',
  imagen:      './img/proyecto2.JPG',
  alt:         'Cielorraso de yeso terminado en apartamento de Cordón',
},

{
  titulo:      'Portón automático · Carrasco Norte',
  categoria:   'Automatismos y Portones',
  descripcion: 'Instalación de automatismo en portón corredizo en vivienda de Carrasco Norte. Colocación de motor, riel y sistema de control remoto para apertura suave y silenciosa.',
  imagen:      './img/proyecto3.JPG',
  alt:         'Portón corredizo automático instalado en vivienda de Carrasco Norte',
},

{
  titulo:      'Jardín prolijo · Parque del Plata',
  categoria:   'Jardines',
  descripcion: 'Mantenimiento completo de jardín en casa de Parque del Plata. Corte de césped, poda de arbustos y limpieza de canteros para dejar el espacio ordenado y prolijo.',
  imagen:      './img/proyecto4.JPG',
  alt:         'Jardín mantenido y césped recién cortado en Parque del Plata',
},

{
  titulo:      'Pared recién pintada · Unión',
  categoria:   'Pintura',
  descripcion: 'Pintura interior de paredes en vivienda del barrio Unión. Aplicación de pintura nueva con terminación uniforme y preparación previa de la superficie.',
  imagen:      './img/proyecto5.JPG',
  alt:         'Pared interior recién pintada en vivienda del barrio Unión',
},

{
  titulo:      'Cisterna reparada · La Blanqueada',
  categoria:   'Plomería y Mantenimiento',
  descripcion: 'Reparación de cisterna y cambio de cañería en baño de vivienda en La Blanqueada. Instalación de piezas nuevas y ajuste completo para eliminar pérdidas de agua.',
  imagen:      './img/proyecto6.JPG',
  alt:         'Reparación de cisterna y cañería en baño de vivienda en La Blanqueada',
},

  // ¿Más proyectos? Copiá uno de los bloques de arriba y pegalo acá.
  // La grilla se ajusta sola.

];

/**
 * Crea el HTML de una tarjeta de proyecto.
 * @param {Object} proyecto
 * @param {number} index — usado para el delay de animación reveal
 * @returns {string} HTML string
 */
function crearTarjetaProyecto(proyecto, index) {
  const delay = (index % 3) * 0.12; // escalonado por columna
  return `
    <article
      class="proyecto-card reveal"
      style="transition-delay: ${delay}s"
      role="listitem"
      aria-label="${proyecto.titulo}"
    >
      <div class="proyecto-img-wrap">
        <img
          class="proyecto-img"
          src="${proyecto.imagen}"
          alt="${proyecto.alt}"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="proyecto-body">
        <p class="proyecto-tag">${proyecto.categoria}</p>
        <h3 class="proyecto-title">${proyecto.titulo}</h3>
        <p class="proyecto-desc">${proyecto.descripcion}</p>
      </div>
    </article>
  `.trim();
}

/**
 * Renderiza los proyectos en el DOM.
 * Oculta la sección si no hay proyectos.
 */
function inicializarProyectos() {
  const seccion = document.getElementById('proyectos');
  const grid    = document.getElementById('proyectos-grid');

  if (!seccion || !grid) return;

  if (!PROYECTOS || PROYECTOS.length === 0) {
    // Sin proyectos → sección invisible y fuera del flujo
    seccion.hidden = true;
    return;
  }

  // Hay proyectos → mostrar sección
  seccion.hidden = false;

  const fragment = document.createDocumentFragment();
  const wrapper  = document.createElement('div');

  wrapper.innerHTML = PROYECTOS
    .map((proyecto, i) => crearTarjetaProyecto(proyecto, i))
    .join('');

  Array.from(wrapper.children).forEach(el => fragment.appendChild(el));
  grid.appendChild(fragment);
}


/* ================================================================
  2. HEADER — Clase "scrolled" al hacer scroll
================================================================ */

function inicializarHeader() {
  const header    = document.querySelector('.site-header');
  if (!header) return;

  const umbral = 60; // px desde el top

  function actualizarHeader() {
    header.classList.toggle('scrolled', window.scrollY > umbral);
  }

  // Estado inicial (útil si la página se carga con scroll)
  actualizarHeader();

  window.addEventListener('scroll', actualizarHeader, { passive: true });
}


/* ================================================================
  3. MENÚ MÓVIL — Toggle hamburger
================================================================ */

function inicializarMenuMovil() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const body   = document.body;

  if (!toggle || !nav) return;

  function abrirMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-open');
    nav.classList.add('is-open');
    body.style.overflow = 'hidden';
    header.style.zIndex = '300';
  }

  function cerrarMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    body.style.overflow = '';
    header.style.zIndex = '';
  }

  toggle.addEventListener('click', () => {
    const estaAbierto = toggle.getAttribute('aria-expanded') === 'true';
    estaAbierto ? cerrarMenu() : abrirMenu();
  });

  // Cerrar al hacer click en un enlace del menú
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', cerrarMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      cerrarMenu();
      toggle.focus();
    }
  });

  // Cerrar si se cambia a desktop
  const mq = window.matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', e => { if (e.matches) cerrarMenu(); });
}


/* ================================================================
  4. SCROLL REVEAL — Intersection Observer
================================================================ */

function inicializarScrollReveal() {
  const elementos = document.querySelectorAll(
    '.servicio-card, .proceso-step, .proyecto-card, .channel-card, .section-header, .hero-trust'
  );

  if (!elementos.length) return;

  // Marcar todos con la clase base para animación CSS
  elementos.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  const opciones = {
    root:       null,
    rootMargin: '0px 0px -60px 0px',
    threshold:  0.08,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // una sola vez
      }
    });
  }, opciones);

  elementos.forEach(el => observer.observe(el));
}


/* ================================================================
  5. MICROINTERACCIONES
================================================================ */

/**
 * Efecto tilt sutil en tarjetas de servicios (solo desktop).
 * Se cancela automáticamente en dispositivos táctiles.
 */
function inicializarTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return; // touch → skip

  const tarjetas = document.querySelectorAll('.servicio-card');

  tarjetas.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 a 1
      const dy     = (e.clientY - cy) / (rect.height / 2); // -1 a 1
      const rotX   =  dy * -4;  // grados
      const rotY   =  dx *  4;

      card.style.transform = `
        translateY(-5px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        scale(1.01)
      `;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
    });
  });
}

/**
 * Efecto ripple en botones principales.
 */
function inicializarRipple() {
  const botones = document.querySelectorAll('.btn-primary, .channel-card');

  botones.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      // Asegurar posición relativa en el botón
      const pos = getComputedStyle(this).position;
      if (pos === 'static') this.style.position = 'relative';
      this.style.overflow = 'hidden';

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inyectar keyframe una sola vez
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to {
          transform: translate(-50%, -50%) scale(28);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Efecto de contador animado en los indicadores del hero.
 * Ej: "+8 años" → cuenta del 0 al 8.
 */
function inicializarContadores() {
  const items = document.querySelectorAll('.trust-item strong');
  if (!items.length) return;

  const re = /(\+?)(\d+)(.*)/; // captura número y texto alrededor

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const texto = el.textContent.trim();
      const match = texto.match(re);

      if (!match) return;

      const prefijo = match[1];       // "+" o ""
      const destino = parseInt(match[2], 10);
      const sufijo  = match[3];       // " años", etc.
      const duracion = 1400;          // ms
      const inicio   = performance.now();

      function animar(tiempo) {
        const progreso = Math.min((tiempo - inicio) / duracion, 1);
        // easeOutQuart
        const ease     = 1 - Math.pow(1 - progreso, 4);
        const actual   = Math.floor(ease * destino);

        el.textContent = `${prefijo}${actual}${sufijo}`;

        if (progreso < 1) {
          requestAnimationFrame(animar);
        } else {
          el.textContent = texto; // restaurar valor exacto
        }
      }

      requestAnimationFrame(animar);
      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  items.forEach(el => {
    if (re.test(el.textContent.trim())) observer.observe(el);
  });
}


/* ================================================================
  6. FOOTER — Año dinámico
================================================================ */

function inicializarAnio() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ================================================================
  7. SMOOTH SCROLL — Anclas internas
================================================================ */

function inicializarSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const hash   = this.getAttribute('href');
      if (hash === '#') return;

      const destino = document.querySelector(hash);
      if (!destino) return;

      e.preventDefault();

      const headerH  = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68',
        10
      );
      const top = destino.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });

      // Actualizar URL sin saltar
      history.pushState(null, '', hash);
    });
  });
}


/* ================================================================
  INIT — Punto de entrada principal
================================================================ */

function init() {
  inicializarAnio();
  inicializarProyectos();
  inicializarHeader();
  inicializarMenuMovil();
  inicializarSmoothScroll();

  // Diferir lo visual para no bloquear el primer pintado
  requestAnimationFrame(() => {
    inicializarScrollReveal();
    inicializarTiltCards();
    inicializarRipple();
    inicializarContadores();
  });
}

// Esperar al DOM listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}