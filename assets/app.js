// Shared app utilities: nav, loading, toast, service-worker register
(function(){
  // Loading overlay helpers
  function showLoading(text="Načítání…"){
    if(document.getElementById('loadingOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-card">
        <div class="loading-spinner">⚚</div>
        <div>
          <div style="font-weight:700;color:var(--gold);margin-bottom:6px">${text}</div>
          <div class="small">Prosím čekejte — připojuji se ke hře.</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  function hideLoading(){
    const el = document.getElementById('loadingOverlay');
    if(el) el.remove();
  }

  // Toast
  function toast(msg, ms=2400){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), ms);
  }

  // Simple nav (inject header)
  function injectHeader(){
    if(document.querySelector('.header')) return;
    const hdr = document.createElement('div');
    hdr.className = 'app header';
    hdr.innerHTML = `
      <div class="brand">
        <div class="logo"><img src="dragon.png" style="width:100%;height:100%;object-fit:cover"></div>
        <h1>Škola Stínů</h1>
      </div>
      <div class="controls">
        <button class="btn" data-link="SKOLA STINU REGISTER.html">Registrace</button>
        <button class="btn" data-link="SKOLA STINU VERIFY.html">Ověření</button>
        <button class="btn" data-link="welcome.html">Vítej</button>
        <button class="btn" data-link="SKOLA STINU PLAYER.html">Můj profil</button>
        <button class="btn" data-link="admin.html">Admin</button>
      </div>`;
    document.body.insertBefore(hdr, document.body.firstChild);
    hdr.querySelectorAll('[data-link]').forEach(b=>{
      b.addEventListener('click', ()=> location.href = b.dataset.link);
    });
  }

  // Service Worker registration helper
  async function registerSW(){
    if('serviceWorker' in navigator){
      try{
        const reg = await navigator.serviceWorker.register('service-worker.js');
        console.log('SW registered', reg);
        reg.addEventListener('updatefound', ()=> {
          toast('Nová verze aplikace dostupná — obnov stránku');
        });
      }catch(e){
        console.warn('SW registration failed', e);
      }
    }
  }

  // Expose API
  window.AppShared = {
    showLoading, hideLoading, toast, injectHeader, registerSW
  };

  // Auto-initialize small things
  document.addEventListener('DOMContentLoaded', ()=>{
    injectHeader();
    registerSW();
  });
})();
