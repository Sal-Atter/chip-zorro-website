/* Chip Zorro Shared Header/Footer - v1.0
 * Single source of truth for header and footer across all pages.
 * Loaded by static city pages to render identical header/footer as homepage.
 */
(function() {
  'use strict';
  
  var BASE = 'https://sal-atter.github.io/chip-zorro-website';
  
  var HEADER_HTML = '<header class="sticky top-0 z-50 w-full bg-night-950/90 backdrop-blur-xl border-b border-white/10 text-white">'
    + '<div class="bg-gradient-to-r from-ember-600 via-ember-500 to-ember-600 text-white text-[11px] font-semibold tracking-wide">'
    + '<div class="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 flex-wrap">'
    + '<span class="inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Mobile service active</span>'
    + '<span class="opacity-60">·</span><span>Dispatch 35–45 Min</span>'
    + '<span class="opacity-60">·</span><span>$0 insurance deductible</span>'
    + '<a href="tel:8005552447" class="inline-flex items-center gap-1 font-bold hover:text-white/90 transition-colors">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>(800) 555-2447</a>'
    + '</div></div>'
    + '<div class="max-w-7xl mx-auto px-4"><div class="flex items-center justify-between h-16 gap-3">'
    + '<a href="' + BASE + '/" class="flex items-center gap-2.5 min-w-0 cursor-pointer" aria-label="Chip Zorro home">'
    + '<img alt="Chip Zorro Windshield Chip Repair" class="h-11 w-auto object-contain block shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" src="' + BASE + '/assets/chip_zorro_mark-CWbhkdoq.png">'
    + '<span class="text-left leading-tight"><span class="block font-display font-extrabold text-[17px] tracking-tight">Chip <span class="text-ember-400">Zorro</span></span>'
    + '<span class="block text-[9px] font-semibold tracking-[0.22em] text-slate-400 uppercase">Mobile Windshield Repair</span></span></a>'
    + '<nav aria-label="Primary" class="hidden lg:flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em]">'
    + '<a href="' + BASE + '/#services-section" class="px-3.5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Services</a>'
    + '<a href="' + BASE + '/#how-it-works-section" class="px-3.5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">How It Works</a>'
    + '<a href="' + BASE + '/#dispatch" class="px-3.5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Track Tech</a>'
    + '<a href="' + BASE + '/#reviews" class="px-3.5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Reviews</a>'
    + '<div class="relative" id="cz-mega-wrap">'
    + '<button id="cz-mega-btn" class="px-3.5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer inline-flex items-center gap-1" aria-expanded="false" aria-haspopup="true">Service Areas'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="m6 9 6 6 6-6"></path></svg></button>'
    + '<div id="cz-mega" class="hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[42rem] max-w-[90vw] bg-night-950 border border-white/10 rounded-2xl shadow-card-dark p-6 z-50">'
    + '<div class="grid grid-cols-3 gap-6" id="cz-mega-grid"></div>'
    + '<div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">'
    + '<span class="text-xs text-slate-400">31 cities served</span>'
    + '<a href="' + BASE + '/service-areas/" class="text-xs font-bold text-ember-400 hover:text-ember-300">View all areas →</a>'
    + '</div></div></div></nav>'
    + '<div class="flex items-center gap-2.5">'
    + '<a href="tel:8005552447" class="hidden md:inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-200 hover:text-white transition-colors whitespace-nowrap">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-ember-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>(800) 555-2447</a>'
    + '<a href="' + BASE + '/#booking" class="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-ember-400 to-ember-600 px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white shadow-ember hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>Book Repair</a>'
    + '<button id="cz-hamb" class="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-slate-200 hover:text-white hover:border-white/30 transition-colors cursor-pointer" aria-label="Open menu" aria-expanded="false">'
    + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button>'
    + '</div></div></div>'
    + '<div id="cz-mobile-menu" class="lg:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0">'
    + '<nav aria-label="Mobile" class="px-4 pb-5 pt-1 flex flex-col gap-1 text-sm font-semibold">'
    + '<a href="' + BASE + '/#services-section" class="text-left px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Services</a>'
    + '<a href="' + BASE + '/#how-it-works-section" class="text-left px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">How It Works</a>'
    + '<a href="' + BASE + '/#dispatch" class="text-left px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Track Tech</a>'
    + '<a href="' + BASE + '/#reviews" class="text-left px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Reviews</a>'
    + '<a href="' + BASE + '/service-areas/" class="text-left px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">Service Areas</a>'
    + '<a href="' + BASE + '/#booking" class="text-left px-4 py-3 rounded-xl text-ember-400 hover:text-ember-300 hover:bg-white/10 transition-colors cursor-pointer font-bold">Book Chip Repair</a>'
    + '</nav></div></header>';

  var FOOTER_HTML = '<footer class="bg-night-950 border-t border-white/10 text-slate-400">'
    + '<div class="max-w-7xl mx-auto px-4 py-12">'
    + '<div class="grid grid-cols-2 md:grid-cols-4 gap-8">'
    + '<div><img alt="Chip Zorro" class="h-14 w-auto mb-4" src="' + BASE + '/assets/chip_zorro_mark-CWbhkdoq.png">'
    + '<p class="text-sm">Mobile windshield chip repair. $99 flat. We come to you.</p></div>'
    + '<div><h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Services</h4>'
    + '<ul class="space-y-2 text-sm">'
    + '<li><a href="' + BASE + '/#booking" class="hover:text-white transition-colors">Book Chip Repair</a></li>'
    + '<li><a href="' + BASE + '/#dispatch" class="hover:text-white transition-colors">Track Zorro Mobile Van</a></li>'
    + '<li><a href="' + BASE + '/#reviews" class="hover:text-white transition-colors">Customer Reviews</a></li>'
    + '<li><a href="' + BASE + '/#booking" class="hover:text-white transition-colors">$0 Insurance Claims</a></li>'
    + '<li><a href="' + BASE + '/#booking" class="hover:text-white transition-colors">Refer a Friend — $10</a></li>'
    + '</ul></div>'
    + '<div><h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Service Areas</h4>'
    + '<ul class="space-y-2 text-sm">'
    + '<li><a href="' + BASE + '/service-areas/" class="hover:text-white transition-colors">Service Areas — 31 Cities</a></li>'
    + '<li><a href="' + BASE + '/windshield-chip-repair-escondido/" class="hover:text-white transition-colors">Escondido</a></li>'
    + '<li><a href="' + BASE + '/windshield-chip-repair-oceanside/" class="hover:text-white transition-colors">Oceanside</a></li>'
    + '<li><a href="' + BASE + '/windshield-chip-repair-carlsbad/" class="hover:text-white transition-colors">Carlsbad</a></li>'
    + '</ul></div>'
    + '<div><h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>'
    + '<ul class="space-y-2 text-sm">'
    + '<li><a href="tel:8005552447" class="text-white font-semibold hover:text-ember-400 transition-colors">(800) 555-2447</a></li>'
    + '<li>Mobile service</li><li>San Diego County</li>'
    + '</ul></div></div>'
    + '<div class="mt-8 pt-8 border-t border-white/10 text-center text-xs">'
    + '<p>© 2026 Chip Zorro — Mobile Windshield Chip Repair. Repair only; we never replace windshields.</p>'
    + '</div></div></footer>';

  // Service areas data for mega menu
  var AREAS = [
    {region: 'Coastal', cities: ['Encinitas','Carlsbad','Oceanside','Solana Beach','Del Mar']},
    {region: 'Inland North County', cities: ['Escondido','San Marcos','Vista','San Diego']},
    {region: 'East County', cities: ['El Cajon','La Mesa','Santee']},
  ];

  function slug(city) {
    return city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function init() {
    // Replace existing header/footer if present
    var oldHeader = document.querySelector('header.site, header.sticky');
    var oldFooter = document.querySelector('footer.site, footer.bg-night-950');
    
    var headerDiv = document.createElement('div');
    headerDiv.innerHTML = HEADER_HTML;
    var headerEl = headerDiv.firstChild;
    
    var footerDiv = document.createElement('div');
    footerDiv.innerHTML = FOOTER_HTML;
    var footerEl = footerDiv.firstChild;
    
    if (oldHeader) {
      oldHeader.parentNode.replaceChild(headerEl, oldHeader);
    } else {
      document.body.insertBefore(headerEl, document.body.firstChild);
    }
    
    if (oldFooter) {
      oldFooter.parentNode.replaceChild(footerEl, oldFooter);
    } else {
      document.body.appendChild(footerEl);
    }
    
    // Mobile menu toggle
    var hamb = document.getElementById('cz-hamb');
    var mobileMenu = document.getElementById('cz-mobile-menu');
    if (hamb && mobileMenu) {
      hamb.addEventListener('click', function() {
        var isOpen = mobileMenu.classList.contains('max-h-0');
        if (isOpen) {
          mobileMenu.classList.remove('max-h-0', 'opacity-0');
          mobileMenu.classList.add('max-h-[500px]', 'opacity-100');
          hamb.setAttribute('aria-expanded', 'true');
        } else {
          mobileMenu.classList.add('max-h-0', 'opacity-0');
          mobileMenu.classList.remove('max-h-[500px]', 'opacity-100');
          hamb.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Mega menu
    var megaBtn = document.getElementById('cz-mega-btn');
    var mega = document.getElementById('cz-mega');
    var megaGrid = document.getElementById('cz-mega-grid');
    if (megaBtn && mega && megaGrid) {
      // Populate mega menu
      var html = '';
      AREAS.forEach(function(area) {
        html += '<div><div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">' + area.region + '</div><ul class="space-y-2">';
        area.cities.forEach(function(city) {
          html += '<li><a href="' + BASE + '/windshield-chip-repair-' + slug(city) + '/" class="text-sm text-slate-300 hover:text-white transition-colors">' + city + '</a></li>';
        });
        html += '</ul></div>';
      });
      megaGrid.innerHTML = html;
      
      megaBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isHidden = mega.classList.contains('hidden');
        if (isHidden) {
          mega.classList.remove('hidden');
          megaBtn.setAttribute('aria-expanded', 'true');
        } else {
          mega.classList.add('hidden');
          megaBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      document.addEventListener('click', function(e) {
        var wrap = document.getElementById('cz-mega-wrap');
        if (wrap && !wrap.contains(e.target)) {
          mega.classList.add('hidden');
          megaBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          mega.classList.add('hidden');
          megaBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
