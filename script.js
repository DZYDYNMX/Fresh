document.addEventListener('DOMContentLoaded', () => {
    // ── Hamburger ──────────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            });
        });
    }

    // ── Booking Modal ──────────────────────────────────────────
    const bookingModal  = document.getElementById('booking-modal');
    const bookingClose  = document.querySelector('#booking-modal .modal-close');

    if (bookingModal) {
        bookingModal.addEventListener('click', e => { 
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                bookingModal.classList.add('active');
                document.body.classList.add('no-scroll');
                const svc = btn.getAttribute('data-service');
                if (svc) {
                    const sel = document.getElementById('modal-service');
                    if (sel) sel.value = svc;
                }
            });
        });
        bookingClose && bookingClose.addEventListener('click', () => {
            bookingModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // ── Service Detail Modal ───────────────────────────────────
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
                'Dashboard, console & door panels detailed',
                'Air vents cleaned with detailing brushes',
                'Interior windows & mirrors cleaned',
                'Odor eliminator treatment',
            ],
            note: 'Ideal for deep cleaning before selling or after heavy use.'
        },
        combo: {
            title: 'Full Inside & Out',
            price: 'Starting at $250',
            desc: 'The complete package. Every inch of your vehicle meticulously cleaned and protected.',
            items: [
                'Everything in Wash & Wax',
                'Everything in Full Interior Detail',
                'Clay bar paint decontamination',
                'Sealant applied for extended protection',
                'Engine bay wipe-down',
                'Final inspection & quality check',
            ],
            note: 'Most popular package. Best value for a full reset.'
        },
        ceramic: {
            title: 'System X Ceramic Coating',
            price: 'Contact for Quote',
            desc: 'The ultimate paint protection. As certified System X installers, we deliver years of durability and extreme gloss backed by a manufacturer warranty.',
            items: [
                'Full paint decontamination & clay bar',
                '1-step or multi-step paint correction',
                'System X Pro or Diamond ceramic coating',
                'Extreme hydrophobicity, water beads instantly',
                'UV, chemical & scratch resistance',
                'Certified warranty included',
                'Wheel coating available as add-on',
            ],
            note: 'Paint correction level determined at inspection. Turnaround 1–3 days.'
        }
    };

    const serviceModal      = document.getElementById('service-detail-modal');
    const serviceModalClose = document.querySelector('#service-detail-modal .modal-close');

    if (serviceModal) {
        document.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const key  = btn.getAttribute('data-detail');
                const data = serviceData[key];
                if (!data) return;

                serviceModal.querySelector('.svc-modal-title').textContent   = data.title;
                serviceModal.querySelector('.svc-modal-price').textContent   = data.price;
                serviceModal.querySelector('.svc-modal-desc').textContent    = data.desc;
                serviceModal.querySelector('.svc-modal-note').textContent    = data.note;
                const ul = serviceModal.querySelector('.svc-modal-list');
                ul.innerHTML = data.items.map(i => `<li>${i}</li>`).join('');

                // Wire up the Book button inside the modal
                const bookBtn = serviceModal.querySelector('.svc-modal-book');
                bookBtn.setAttribute('data-service', key);

                serviceModal.classList.add('active');
                document.body.classList.add('no-scroll');
            });
        });

        serviceModalClose && serviceModalClose.addEventListener('click', () => {
            serviceModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        serviceModal.addEventListener('click', e => { 
            if (e.target === serviceModal) {
                serviceModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // Book from inside service detail modal
        serviceModal.querySelector('.svc-modal-book').addEventListener('click', e => {
            e.preventDefault();
            serviceModal.classList.remove('active');
            if (bookingModal) {
                bookingModal.classList.add('active');
                document.body.classList.add('no-scroll');
                const svc = e.currentTarget.getAttribute('data-service');
                if (svc) {
                    const sel = document.getElementById('modal-service');
                    if (sel) sel.value = svc;
                }
            } else {
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ── Background Video ───────────────────────────────────────
    const video = document.getElementById('bg-video');
    if (video) {
        // Optional: you can manually set a slower playback rate for all videos
        video.playbackRate = 0.5;
    }
});
