(function () {
    'use strict';

    // ─── Header scroll effect ───────────────────────────────────────────────
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }, { passive: true });

    // ─── Mobile menu ─────────────────────────────────────────────────────────
    const mobileBtn   = document.querySelector('.mobile-menu-btn');
    const mobileMenu  = document.getElementById('mobileMenu');

    function openMenu() {
        mobileBtn.classList.add('is-open');
        mobileMenu.classList.add('is-open');
        mobileBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileBtn.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    mobileBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close when clicking a link inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('is-open') &&
            !mobileMenu.contains(e.target) &&
            !mobileBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ─── Smooth scroll ────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Scroll reveal (data-aos) ─────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

    // ─── Progressive counter animation ────────────────────────────────────────
    function animateCounter(el) {
        const target   = parseFloat(el.dataset.target) || 0;
        const divider  = parseFloat(el.dataset.divider) || 1;
        const prefix   = el.dataset.prefix || '';
        const suffix   = el.dataset.suffix || '';
        const duration = 1800; // ms
        const start    = performance.now();
        const final    = target / divider;

        el.classList.add('counter-visible');

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current  = final * eased;

            // Format: if result is integer, show no decimal; else 1 decimal
            const display = Number.isInteger(final)
                ? Math.floor(current)
                : current.toFixed(1);

            el.textContent = prefix + display + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + (Number.isInteger(final) ? final : final.toFixed(1)) + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

    // ─── Contact form ─────────────────────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const btn  = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert(`Obrigado, ${name}! Recebemos sua solicitação e entraremos em contato em breve.`);
                btn.innerText = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 1500);
        });
    }

})();
