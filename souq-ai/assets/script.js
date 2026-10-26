(function(){'use strict';

  // Accessible, touch-friendly three-slide homepage hero.
  const hero=document.querySelector('.hero-carousel');
  if(hero){
    const slides=[...hero.querySelectorAll('.hero-slide')];
    const dots=[...hero.querySelectorAll('[data-go-slide]')];
    const prev=hero.querySelector('.hero-prev'), next=hero.querySelector('.hero-next');
    let active=0, timer=null, touchStartX=null;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show=(index)=>{active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===active);slide.setAttribute('aria-hidden',i===active?'false':'true');slide.querySelectorAll('a,button').forEach(el=>{if(i===active){el.removeAttribute('tabindex')}else{el.setAttribute('tabindex','-1')}})});dots.forEach((dot,i)=>{dot.classList.toggle('active',i===active);dot.setAttribute('aria-pressed',i===active?'true':'false')});};
    const stop=()=>{if(timer){clearInterval(timer);timer=null}};
    const start=()=>{stop();if(!reduced&&!document.hidden)timer=setInterval(()=>show(active+1),6500)};
    if(prev)prev.addEventListener('click',()=>{show(active-1);start()});
    if(next)next.addEventListener('click',()=>{show(active+1);start()});
    dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.goSlide)||0);start()}));
    hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);hero.addEventListener('focusin',stop);hero.addEventListener('focusout',start);
    hero.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){show(active-1);start()}if(e.key==='ArrowRight'){show(active+1);start()}});
    hero.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});
    hero.addEventListener('touchend',e=>{if(touchStartX===null)return;const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>45){show(active+(dx<0?1:-1));start()}touchStartX=null},{passive:true});
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());show(0);start();
  }

  const preloader=document.getElementById('preloader');
  const hideLoader=()=>{if(preloader)preloader.classList.add('loaded');};
  window.addEventListener('load',()=>setTimeout(hideLoader,350));
  setTimeout(hideLoader,2500);
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  const topButton=document.getElementById('backToTop');
  const onScroll=()=>{if(topButton)topButton.classList.toggle('visible',window.scrollY>450);};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(topButton)topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  const modalEl=document.getElementById('quoteModal');
  const quoteModal=modalEl&&window.bootstrap?new bootstrap.Modal(modalEl):null;
  document.querySelectorAll('[data-open-quote]').forEach(btn=>btn.addEventListener('click',()=>{
    const service=btn.getAttribute('data-service');const select=document.querySelector('#leadService');if(service&&select){const arMap={'CCTV':'كاميرات المراقبة','CCTV & Surveillance':'كاميرات المراقبة','Access Control':'التحكم بالدخول','Networking':'الشبكات وتمديد الكابلات المنظمة','Wi-Fi':'حلول الواي فاي','Smart Automation':'أتمتة المنازل والمكاتب الذكية','AV':'الأنظمة السمعية والبصرية وغرف الاجتماعات','PABX':'أنظمة البدالات وهواتف IP','Business IT':'حلول تقنية المعلومات للأعمال'};const wanted=document.documentElement.lang==='ar'?(arMap[service]||service):service;for(const option of select.options){if(option.text.toLowerCase().includes(wanted.toLowerCase())||wanted.toLowerCase().includes(option.text.toLowerCase())){select.value=option.value||option.text;break;}}}
    if(quoteModal)quoteModal.show();
  }));
  // WhatsApp enquiry handling: validates the form and opens a pre-filled message to AI Souq.
  // WhatsApp requires the visitor to press Send; this website does not send messages silently.
  document.querySelectorAll('[data-lead-form]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const name=(data.get('name')||'').toString().trim();
    const phone=(data.get('phone')||'').toString().trim();
    const email=(data.get('email')||'').toString().trim();
    const service=(data.get('service')||'Not specified').toString().trim();
    const message=(data.get('message')||'').toString().trim();
    const isArabic=document.documentElement.lang==='ar';
    const body=isArabic?[
      'مرحباً سوق الذكاء، أرغب في الاستفسار عن خدماتكم.',
      '',
      'الاسم: '+name,
      'رقم الهاتف: '+phone,
      'البريد الإلكتروني: '+(email||'غير متوفر'),
      'الخدمة المطلوبة: '+service,
      '',
      'تفاصيل المشروع:',
      message||'غير متوفر',
      '',
      'تم إرسال هذا الاستفسار من موقع سوق الذكاء.'
    ].join('\n'):[
      'Hello AI Souq! I would like to enquire about your services.',
      '',
      'Name: '+name,
      'Phone: '+phone,
      'Email: '+(email||'Not provided'),
      'Service: '+service,
      '',
      'Project details:',
      message||'Not provided',
      '',
      'Sent from the AI Souq website.'
    ].join('\n');
    const feedback=form.querySelector('.form-feedback');
    if(feedback){
      feedback.className='form-feedback success';
      feedback.textContent=isArabic?'سيتم فتح واتساب مع استفسارك. راجع الرسالة واضغط «إرسال» لإتمام الطلب.':'Opening WhatsApp with your enquiry. Please review the message and tap Send to complete your submission.';
    }
    const whatsappUrl='https://wa.me/971561725767?text='+encodeURIComponent(body);
    const opened=window.open(whatsappUrl,'_blank','noopener,noreferrer');
    if(!opened)window.location.href=whatsappUrl;
  }));
  // Popup appears once per browser session after a short delay, and can always be opened from CTA buttons.
  if(quoteModal&&!sessionStorage.getItem('aisouqQuotePopupSeen')){
    window.setTimeout(()=>{if(!document.querySelector('.modal.show'))quoteModal.show();sessionStorage.setItem('aisouqQuotePopupSeen','1');},6500);
  }
  // Mobile navigation: keep the menu open when the Services dropdown is toggled.
  // Only close the collapsed navigation after a visitor chooses a real destination.
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link=>{
    link.addEventListener('click',event=>{
      if(link.matches('.dropdown-toggle')) return;
      const nav=document.getElementById('mainNav');
      if(nav&&nav.classList.contains('show')&&window.bootstrap){
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

})();
