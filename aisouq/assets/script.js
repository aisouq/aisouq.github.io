(function(){'use strict';
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
    const service=btn.getAttribute('data-service');const select=document.querySelector('#leadService');if(service&&select){for(const option of select.options){if(option.text.toLowerCase().includes(service.toLowerCase())||service.toLowerCase().includes(option.text.toLowerCase())){select.value=option.value||option.text;break;}}}
    if(quoteModal)quoteModal.show();
  }));
  // Demo-friendly form handling: opens a pre-addressed email because no form backend is configured yet.
  document.querySelectorAll('[data-lead-form]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=new FormData(form);const name=(data.get('name')||'').toString().trim();const phone=(data.get('phone')||'').toString().trim();const email=(data.get('email')||'').toString().trim();const service=(data.get('service')||'General enquiry').toString();const message=(data.get('message')||'').toString().trim();
    const subject=encodeURIComponent('Website enquiry — '+service);const body=encodeURIComponent('Name: '+name+'\nPhone: '+phone+'\nEmail: '+email+'\nService: '+service+'\n\nProject details:\n'+message);
    const feedback=form.querySelector('.form-feedback');if(feedback){feedback.className='form-feedback success';feedback.textContent='Your email app will open with the enquiry details. Please send the email to complete your enquiry.';}
    window.location.href='mailto:info@aisouq.ae?subject='+subject+'&body='+body;
  }));
  // Popup appears once per browser session after a short delay, and can always be opened from CTA buttons.
  if(quoteModal&&!sessionStorage.getItem('aisouqQuotePopupSeen')){
    window.setTimeout(()=>{if(!document.querySelector('.modal.show'))quoteModal.show();sessionStorage.setItem('aisouqQuotePopupSeen','1');},6500);
  }
  // Close the mobile navigation after choosing a page link.
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link=>link.addEventListener('click',()=>{const nav=document.getElementById('mainNav');if(nav&&nav.classList.contains('show')&&window.bootstrap)bootstrap.Collapse.getOrCreateInstance(nav).hide();}));
})();
