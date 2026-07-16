/* Renders the newsletter signup form (site-native Kit submission) and, where
   its containers are present, the archive of past issues from
   js/newsletter-data.js. Used on the contact page (signup + archive) and the
   collector page (signup only — the archive block simply doesn't run). */

document.addEventListener('DOMContentLoaded', () => {

    const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.07 });
    const reveal = () => setTimeout(() => document.querySelectorAll('.fade-up').forEach(el => io.observe(el)), 100);

    // ── signup form ───────────────────────────────────────────
    const signup = document.getElementById('nl-signup');
    if (signup && typeof SITE !== 'undefined' && SITE.newsletter && SITE.newsletter.action) {
        const cta = signup.dataset.cta || 'subscribe';
        signup.innerHTML =
            `<form action="${SITE.newsletter.action}" method="post" target="_blank" class="newsletter-form">
                 <input type="email" name="${SITE.newsletter.field || 'email'}" required placeholder="your email" aria-label="Email address">
                 <button type="submit" class="lb-submit nl-submit">${cta}</button>
             </form>`;

        // submit in the background and confirm inline, in our own typography;
        // if the request fails, fall back to a normal form submission
        const form = signup.querySelector('form');
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' },
                });
                if (!res.ok) throw new Error('subscribe failed: ' + res.status);
                signup.innerHTML =
                    '<p class="newsletter-confirm">thank you — now check your inbox to confirm the subscription.</p>';
            } catch (err) {
                btn.disabled = false;
                form.submit();
            }
        });
    }

    // ── archive of past issues (only where its containers exist) ─
    const list  = document.getElementById('nl-issues');
    const count = document.getElementById('nl-count');
    if (list && count) {
        const issues = (typeof NEWSLETTER_ISSUES !== 'undefined' ? NEWSLETTER_ISSUES : [])
            .slice()
            .sort((a, b) => String(b.date).localeCompare(String(a.date)));

        const MONTHS = ['january','february','march','april','may','june',
                        'july','august','september','october','november','december'];
        const formatDate = iso => {
            const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '').trim());
            if (!m) return String(iso || '');
            const [, y, mo, d] = m;
            return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
        };

        if (!issues.length) {
            count.textContent = '';
            list.innerHTML =
                `<p class="nl-empty">the first issue is on its way. subscribe above and it will land in your inbox — and appear here — as soon as it goes out.</p>`;
        } else {
            count.textContent = `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
            issues.forEach(it => {
                const row = document.createElement('article');
                row.className = 'issue-item fade-up';
                const link = it.url ? String(it.url) : '';
                row.innerHTML =
                    `<div class="issue-date">${formatDate(it.date)}</div>
                     <div class="issue-body">
                         <h3 class="issue-title">${link ? `<a href="${link}" target="_blank" rel="noopener">${it.title || 'untitled'}</a>` : (it.title || 'untitled')}</h3>
                         ${it.excerpt ? `<p class="issue-excerpt">${it.excerpt}</p>` : ''}
                     </div>
                     ${link ? `<a class="issue-link lb-submit" href="${link}" target="_blank" rel="noopener">read</a>` : ''}`;
                list.appendChild(row);
            });
        }
    }

    reveal();

    // ── analytics (live domain only, same rule as the homepage) ─
    if (typeof SITE !== 'undefined' && SITE.goatcounter && location.hostname === 'kubachojnacki.com') {
        const s = document.createElement('script');
        s.async = true;
        s.dataset.goatcounter = `https://${SITE.goatcounter}.goatcounter.com/count`;
        s.src = 'https://gc.zgo.at/count.js';
        document.body.appendChild(s);
    }
});
