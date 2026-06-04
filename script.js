document.addEventListener('DOMContentLoaded', () => {
    // ── Video Autoplay Kickstarter ─────────────────────────────
    const bgVideos = document.querySelectorAll('video');
    bgVideos.forEach(video => {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.body.addEventListener('touchstart', () => { video.play(); }, { once: true });
                document.body.addEventListener('click', () => { video.play(); }, { once: true });
            });
        }
    });

    // ── Elements & State ───────────────────────────────────────
    const hamburger         = document.querySelector('.hamburger');
    const navLinks          = document.querySelector('.nav-links');

    // ── Hamburger ──────────────────────────────────────────────
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // ── Service Data for Detail Modal ──────────────────────────
    const serviceData = {
        wash_wax: {
            title: 'Premium Wash & Wax',
            price: 'Starting at $120',
            desc: 'A thorough exterior hand wash topped with a high-quality wax for lasting shine and protection.',
            items: [
                'Foam cannon pre-soak & hand wash',
                'Wheels, tires & wheel wells deep cleaned',
                'Iron decontamination spray',
                'Premium carnauba wax application',
                'Tire dressing & trim restoration',
                'Exterior windows & mirrors streak-free',
                'Door jambs wiped down',
            ],
            note: 'Recommended every 4–6 weeks for regular maintenance.'
        },
        interior: {
            title: 'Full Interior Detail',
            price: 'Starting at $150',
            desc: 'Complete interior rejuvenation. Every surface cleaned, conditioned, and restored to feel brand new.',
            items: [
                'Full vacuum, seats, carpet, trunk & crevices',
                'Hot water extraction carpet & upholstery shampoo',
                'Leather cleaning & conditioning',
                'Steam cleaning of all plastics and vinyls',
                'UV protection applied to dash and trim',
                'Interior glass & displays cleaned',
                'Odor elimination treatment',
            ],
            note: 'Ideal for daily drivers and family vehicles.'
        },
        combo: {
            title: 'Full Inside & Out',
            price: 'Starting at $250',
            desc: 'The ultimate detailing package. A complete reset for your vehicle, inside and out.',
            items: [
                'Everything in Premium Wash & Wax',
                'Everything in Full Interior Detail',
                'Engine bay light cleaning & dressing',
                'Clay bar treatment for smooth paint',
                'Exhaust tips polished',
            ],
            note: 'Best value. Brings your car back to factory-fresh condition.'
        },
        ceramic: {
            title: 'System X Ceramic Coating',
            price: 'Quote Required',
            desc: 'Long-term paint protection using professional-grade System X ceramic nano-coatings.',
            items: [
                'Intensive multi-stage hand wash',
                'Chemical & mechanical paint decontamination',
                'Multi-stage paint correction (swirl & scratch removal)',
                'Panel prep wipe down',
                'System X Ceramic coating applied to paint, plastics, & glass',
                'Registered manufacturer warranty',
            ],
            note: 'Paint correction level determined at inspection. Turnaround 1–3 days.'
        }
    };

    // ── Global Click Event Delegation (SPA & Modals) ───────────
    document.body.addEventListener('click', async e => {
        // Modals might be dynamically injected by SPA, so query them here
        const bookingModal = document.getElementById('booking-modal');
        const serviceModal = document.getElementById('service-detail-modal');

        // 1. Close Modals if clicking on overlay or close button
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }

        // 2. Booking Buttons (nav, page, or service modal)
        const bookBtn = e.target.closest('.book-btn, .nav-cta, .svc-modal-book, a[href="contact.html"]');
        if (bookBtn && bookingModal) {
            e.preventDefault();
            bookingModal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Close service modal if open
            if (serviceModal) serviceModal.classList.remove('active');

            const svc = bookBtn.getAttribute('data-service');
            if (svc) {
                const sel = document.getElementById('modal-service');
                if (sel) sel.value = svc;
            }
            return;
        }

        // 3. Service Detail Buttons
        const detailBtn = e.target.closest('.detail-btn');
        if (detailBtn && serviceModal) {
            e.preventDefault();
            const key  = detailBtn.getAttribute('data-detail');
            const data = serviceData[key];
            if (!data) return;

            serviceModal.querySelector('.svc-modal-title').textContent   = data.title;
            serviceModal.querySelector('.svc-modal-price').textContent   = data.price;
            serviceModal.querySelector('.svc-modal-desc').textContent    = data.desc;
            serviceModal.querySelector('.svc-modal-note').textContent    = data.note;
            serviceModal.querySelector('.svc-modal-list').innerHTML      = data.items.map(i => `<li>${i}</li>`).join('');

            const svcBookBtn = serviceModal.querySelector('.svc-modal-book');
            if (svcBookBtn) svcBookBtn.setAttribute('data-service', key);

            serviceModal.classList.add('active');
            document.body.classList.add('no-scroll');
            return;
        }

        // 4. SPA Navigation Intercept
        const link = e.target.closest('a');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
        
        const url = new URL(link.href, window.location.href);
        // Only intercept internal standard pages, not anchors or external links
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.hash) return;
        if (url.pathname.endsWith('.pdf') || url.pathname.endsWith('.mp4')) return;
        
        e.preventDefault();

        // Close mobile nav if open
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }

        await navigateTo(url.href);
    });

    // ── SPA Routing Logic ──────────────────────────────────────
    window.addEventListener('popstate', () => {
        navigateTo(window.location.href, false);
    });

    async function navigateTo(url, push = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Swap main content securely
            const newMain = doc.querySelector('main.main-content');
            const currentMain = document.querySelector('main.main-content');
            if (newMain && currentMain) {
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.className = newMain.className; // Transfer classes like hero background overrides
            }

            // Swap modals dynamically
            document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
            doc.querySelectorAll('.modal-overlay').forEach(m => document.body.appendChild(m));

            // Swap background video if it has changed
            const newVideoSrc = doc.querySelector('#bg-video source')?.getAttribute('src');
            const currentVideo = document.getElementById('bg-video');
            if (newVideoSrc && currentVideo) {
                const currentSource = currentVideo.querySelector('source');
                if (currentSource && currentSource.getAttribute('src') !== newVideoSrc) {
                    currentSource.setAttribute('src', newVideoSrc);
                    currentVideo.load();
                    // Attempt to play, catch if mobile prevents it without interaction
                    const playPromise = currentVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => console.log('Video autoplay interrupted on SPA route:', e));
                    }
                }
            }

            // Update title
            document.title = doc.title;

            // Update active nav link
            const pathname = new URL(url).pathname;
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
                const href = a.getAttribute('href');
                if (pathname.endsWith(href) || (pathname.endsWith('/') && href === 'index.html')) {
                    a.classList.add('active');
                }
            });

            if (push) {
                window.history.pushState({}, '', url);
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('SPA Navigation failed:', error);
            window.location.href = url; // Hard fallback
        }
    }
});
