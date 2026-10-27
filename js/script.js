/* =====================================================
   LAURA CORTÉS · PORTAFOLIO — INTERACTIONS
   ===================================================== */

(() => {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---------- Year stamp ---------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav toggle ---------- */
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open);
        });
        $$('.nav__link', menu).forEach(a => a.addEventListener('click', () => {
            menu.classList.remove('is-open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }));
    }

    /* ---------- Header scrolled state + progress bar ---------- */
    const header = $('#header');
    const progress = $('#progress-bar');
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 30);
        if (progress) {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? (y / max) * 100 : 0;
            progress.style.width = pct + '%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Active link by section ---------- */
    const sections = $$('section[id]');
    const navLinks = $$('.nav__link');
    const setActive = () => {
        const y = window.scrollY + 120;
        let current = sections[0]?.id;
        for (const sec of sections) {
            if (sec.offsetTop <= y) current = sec.id;
        }
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

    /* ---------- Reveal on scroll ---------- */
    const revealEls = $$('.reveal, .reveal-up');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: .15, rootMargin: '0px 0px -50px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Hero text auto-reveal on load ---------- */
    window.addEventListener('load', () => {
        $$('.hero .reveal').forEach(el => el.classList.add('is-visible'));
    });

    /* ---------- Menu drawer (botón circular MENU) ---------- */
    const menuFab = $('#menu-fab');
    const drawer = $('#menu-drawer');
    const drawerClose = $('#menu-drawer-close');
    const drawerBackdrop = $('#menu-drawer-backdrop');
    const drawerLinks = $$('.menu-drawer__link');

    const openDrawer = () => {
        drawer?.classList.add('is-open');
        drawer?.setAttribute('aria-hidden', 'false');
        menuFab?.classList.add('is-active');
        menuFab?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
        drawer?.classList.remove('is-open');
        drawer?.setAttribute('aria-hidden', 'true');
        menuFab?.classList.remove('is-active');
        menuFab?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    menuFab?.addEventListener('click', () => {
        drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    drawerClose?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);
    drawerLinks.forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer?.classList.contains('is-open')) closeDrawer();
    });

    // Mantener "is-active" en el drawer link según la sección visible
    const setDrawerActive = () => {
        const y = window.scrollY + 200;
        let current = sections[0]?.id;
        for (const sec of sections) {
            if (sec.offsetTop <= y) current = sec.id;
        }
        drawerLinks.forEach(a => a.classList.toggle('is-active', a.dataset.section === current));
    };
    window.addEventListener('scroll', setDrawerActive, { passive: true });
    setDrawerActive();

    /* ---------- Cursor follower ---------- */
    const dot = $('.cursor-dot');
    if (dot && matchMedia('(hover: hover)').matches) {
        let raf;
        const move = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
            });
        };
        document.addEventListener('mousemove', move);
        $$('a, button, .thumb, .arch-card, .discipline, .discipline-card, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        });
    }

    /* ---------- Smooth-scroll offset for sticky header ---------- */
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - headerH + 1,
            behavior: 'smooth'
        });
    });

    /* ---------- LIGHTBOX (fullscreen image viewer) ---------- */
    const lightboxImages = $$('.project__media img, .arch-card__media img, .thumb img, .project-card__media img');

    if (lightboxImages.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Visor de imagen');
        lightbox.innerHTML = `
            <span class="lightbox__counter" id="lb-counter"></span>
            <button class="lightbox__btn lightbox__close" type="button" aria-label="Cerrar">×</button>
            <button class="lightbox__btn lightbox__prev"  type="button" aria-label="Anterior">‹</button>
            <button class="lightbox__btn lightbox__next"  type="button" aria-label="Siguiente">›</button>
            <figure class="lightbox__inner">
                <img src="" alt="" id="lb-img">
                <figcaption id="lb-cap"></figcaption>
            </figure>
        `;
        document.body.appendChild(lightbox);

        const lbImg = $('#lb-img', lightbox);
        const lbCap = $('#lb-cap', lightbox);
        const lbCounter = $('#lb-counter', lightbox);
        let currentIndex = -1;

        const open = (i) => {
            currentIndex = i;
            const src = lightboxImages[i];
            lbImg.src = src.src;
            lbImg.alt = src.alt || '';
            lbCap.textContent = src.alt || '';
            lbCounter.textContent = `${i + 1} / ${lightboxImages.length}`;
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            currentIndex = -1;
        };
        const navigate = (dir) => {
            const next = (currentIndex + dir + lightboxImages.length) % lightboxImages.length;
            open(next);
        };

        lightboxImages.forEach((img, i) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                open(i);
            });
            // Allow keyboard activation
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
            });
        });

        $('.lightbox__close', lightbox).addEventListener('click', close);
        $('.lightbox__prev',  lightbox).addEventListener('click', () => navigate(-1));
        $('.lightbox__next',  lightbox).addEventListener('click', () => navigate(1));

        lightbox.addEventListener('click', (e) => {
            // close when clicking outside the figure
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape')      close();
            if (e.key === 'ArrowLeft')   navigate(-1);
            if (e.key === 'ArrowRight')  navigate(1);
        });

        // Swipe support on touch
        let touchX = 0;
        lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend',   (e) => {
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
        }, { passive: true });
    }

})();
