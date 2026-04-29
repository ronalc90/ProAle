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

    /* ---------- About Carousel (notebook-style pages) ---------- */
    const aboutCarousel = $('#about-carousel');
    if (aboutCarousel) {
        const track = $('#about-track', aboutCarousel);
        const slides = $$('.about-card', track);
        const prevBtn = $('.about-carousel__nav--prev', aboutCarousel);
        const nextBtn = $('.about-carousel__nav--next', aboutCarousel);
        const dots = $$('.about-carousel__dot', aboutCarousel);
        let index = 0;

        let isAnimating = false;
        const goTo = (i, direction = 'next') => {
            if (isAnimating) return;
            const newIndex = Math.max(0, Math.min(slides.length - 1, i));
            if (newIndex === index && slides[newIndex].classList.contains('is-visible')) return;

            const currentCard = slides[index];
            const flipPane = direction === 'prev'
                ? currentCard.querySelector('.about-card__title-pane')
                : currentCard.querySelector('.about-card__content-pane');
            const flipClass = direction === 'prev' ? 'is-flipping-prev' : 'is-flipping-next';

            isAnimating = true;
            currentCard.classList.add('is-flipping');
            if (flipPane) flipPane.classList.add(flipClass);

            // A mitad de la animación cambiamos el slide para que la nueva página
            // aparezca cuando la anterior ya esté volteada al menos 90°
            setTimeout(() => {
                index = newIndex;
                track.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
                slides[index].classList.add('is-visible');
            }, 420);

            // Limpiar al terminar
            setTimeout(() => {
                currentCard.classList.remove('is-flipping');
                if (flipPane) flipPane.classList.remove(flipClass);
                isAnimating = false;
            }, 880);
        };
        const next = () => goTo((index + 1) % slides.length, 'next');
        const prev = () => goTo((index - 1 + slides.length) % slides.length, 'prev');

        prevBtn?.addEventListener('click', prev);
        nextBtn?.addEventListener('click', next);
        dots.forEach((d, di) => d.addEventListener('click', () => goTo(di)));

        // Keyboard support — global cuando el carrusel está visible
        aboutCarousel.setAttribute('tabindex', '0');
        const isCarouselInView = () => {
            const r = aboutCarousel.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
        };
        const onKey = (e) => {
            if (!isCarouselInView()) return;
            const tag = (e.target?.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
        };
        document.addEventListener('keydown', onKey);

        // Click "tipo libro": mitad izquierda retrocede, mitad derecha avanza
        track.addEventListener('click', (e) => {
            // ignorar clics en enlaces o elementos interactivos del card
            if (e.target.closest('a, button, input, textarea, [role="button"]')) return;
            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 2) prev(); else next();
        });

        // Swipe support
        let startX = 0, dx = 0, swiping = false;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX; dx = 0; swiping = true;
        }, { passive: true });
        track.addEventListener('touchmove', (e) => {
            if (!swiping) return;
            dx = e.touches[0].clientX - startX;
        }, { passive: true });
        track.addEventListener('touchend', () => {
            if (!swiping) return;
            if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
            swiping = false;
        });

        goTo(0);
    }

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

    /* ---------- Contact form (real submission via formsubmit.co/ajax) ---------- */
    const form = $('#contact-form');
    const status = $('#form-status');
    const submitBtn = $('#contact-submit');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const name = (data.get('name') || '').toString().trim();
            const email = (data.get('email') || '').toString().trim();
            const msg = (data.get('message') || '').toString().trim();

            if (!name || !email || !msg) {
                status.textContent = 'Por favor completa nombre, correo y mensaje.';
                status.className = 'form-status is-error';
                return;
            }

            // honeypot — silently drop bots
            if ((data.get('_honey') || '').toString()) return;

            submitBtn.classList.add('is-loading');
            status.textContent = '';
            status.className = 'form-status';

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: data
                });
                if (res.ok) {
                    status.textContent = '¡Mensaje enviado! Te responderé muy pronto. ✦';
                    status.className = 'form-status is-success';
                    form.reset();
                } else {
                    throw new Error('http');
                }
            } catch (err) {
                // Fallback: open mailto
                const subject = encodeURIComponent(`Nuevo mensaje desde el portafolio — ${name}`);
                const body = encodeURIComponent(
                    `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${(data.get('phone') || '').toString()}\n\n${msg}`
                );
                window.location.href = `mailto:lauraalejandracortesortegate@gmail.com?subject=${subject}&body=${body}`;
                status.textContent = 'Abriendo tu cliente de correo… si no se abre, escríbeme por WhatsApp.';
                status.className = 'form-status is-error';
            } finally {
                submitBtn.classList.remove('is-loading');
            }
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

    /* ---------- Tilt-on-hover for project media (subtle 3D) ---------- */
    const tilts = $$('.arch-card__media');
    tilts.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            el.style.transform = `perspective(700px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    /* ---------- Skill brand colors from data-color ---------- */
    $$('.skill[data-color]').forEach(el => {
        el.style.setProperty('--skill-color', el.dataset.color);
    });

    /* ---------- SKILL DETAIL MODAL ---------- */
    const skillItems = $$('.skill[data-name]');
    if (skillItems.length) {
        const modal = document.createElement('div');
        modal.className = 'skill-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="skill-modal__panel" role="document">
                <button class="skill-modal__close" type="button" aria-label="Cerrar">×</button>
                <header class="skill-modal__head">
                    <span class="skill__icon" id="sm-icon"></span>
                    <div>
                        <h3 class="skill-modal__name" id="sm-name"></h3>
                        <span class="skill-modal__level" id="sm-level"></span>
                    </div>
                </header>
                <p class="skill-modal__desc" id="sm-desc"></p>
                <p class="skill-modal__uses-title">¿Qué puedo hacer con esta herramienta?</p>
                <ul class="skill-modal__uses" id="sm-uses"></ul>
                <div class="skill-modal__cta">
                    <a href="#contacto" class="btn btn--primary" data-close>Hagamos un proyecto →</a>
                    <button class="btn btn--ghost" type="button" data-close>Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const panel = $('.skill-modal__panel', modal);
        const smIcon = $('#sm-icon', modal);
        const smName = $('#sm-name', modal);
        const smLevel = $('#sm-level', modal);
        const smDesc = $('#sm-desc', modal);
        const smUses = $('#sm-uses', modal);

        const openSkill = (skill) => {
            const color = skill.dataset.color || '#b878ad';
            panel.style.setProperty('--accent', color);
            // clone the icon
            smIcon.innerHTML = '';
            const iconNode = skill.querySelector('.skill__icon');
            if (iconNode) smIcon.innerHTML = iconNode.innerHTML;
            smName.textContent = skill.dataset.name || '';
            smLevel.textContent = skill.dataset.level || '';
            smDesc.textContent = skill.dataset.desc || '';
            smUses.innerHTML = (skill.dataset.uses || '')
                .split('|').map(u => u.trim()).filter(Boolean)
                .map(u => `<li>${u}</li>`).join('');
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const closeSkill = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        skillItems.forEach(s => {
            s.addEventListener('click', () => openSkill(s));
            s.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSkill(s); }
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('[data-close]')) closeSkill();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeSkill();
        });
    }

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

        // Wrapper anchors (.arch-card__media is a link) - prevent navigation
        $$('.arch-card__media').forEach(a => {
            a.addEventListener('click', (e) => e.preventDefault());
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
