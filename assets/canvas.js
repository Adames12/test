// canvas.js - rotující znak + kouř + parallax
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'shared-canvas';
  canvas.style.position='fixed';
  canvas.style.left=0; canvas.style.top=0;
  canvas.style.width='100vw'; canvas.style.height='100vh';
  canvas.style.zIndex=0; canvas.style.pointerEvents='none'; canvas.style.opacity='0.14';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = innerWidth, H = innerHeight;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  addEventListener('resize', resize); resize();

  // load dragon image (if missing, fallback to shape)
  const img = new Image();
  img.src = 'dragon.png';
  let imgReady = false;
  img.onload = ()=> imgReady = true;

  // smoke particles
  const particles = [];
  function spawnSmoke(x,y,life=160,scale=1){
    particles.push({x,y,vx:(Math.random()-0.5)*0.4, vy:-0.2+Math.random()*-0.4, r:10*scale, life, alpha:0.9});
  }

  // generate ambient smoke regularly
  setInterval(()=> {
    const x = Math.random()*W;
    const y = H + 30;
    spawnSmoke(x,y,200, 0.6 + Math.random()*0.9);
  }, 700);

  // pointer parallax
  let px=0, py=0;
  addEventListener('mousemove', e => { px = (e.clientX - W/2) / W * 18; py = (e.clientY - H/2) / H * 12; });
  addEventListener('touchmove', e => {
    const t = e.touches[0]; px = (t.clientX - W/2) / W * 18; py = (t.clientY - H/2) / H * 12;
  }, {passive:true});

  let rot = 0;
  function draw(){
    ctx.clearRect(0,0,W,H);

    // subtle vignette
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, 'rgba(0,0,0,0.0)'); grad.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    // draw smoke
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx + px*0.002;
      p.y += p.vy + py*0.002;
      p.life--;
      p.r *= 1.001;
      p.alpha *= 0.998;
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,180,70,${Math.max(0, p.alpha*p.life/200)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      if(p.life < 0 || p.alpha < 0.03){ particles.splice(i,1); }
    }

    // draw central dragon (or fallback)
    const size = Math.max(200, Math.min(W,H) * 0.5);
    const cx = W/2 + px*1.6, cy = H/2 + py*1.0;
    ctx.save();
    ctx.translate(cx, cy);
    rot += 0.002;
    ctx.rotate(rot);
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = 'rgba(212,175,55,0.75)';
    ctx.shadowBlur = size * 0.08;

    if(imgReady){
      const scale = size / Math.max(img.width, img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, -w/2, -h/2, w, h);
    } else {
      // fallback: stylized glyph
      ctx.fillStyle = 'rgba(212,175,55,0.06)';
      ctx.beginPath();
      ctx.arc(0,0,size*0.35,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = 'rgba(212,175,55,0.12)';
      ctx.fillRect(-size*0.4, -size*0.05, size*0.8, size*0.1);
    }

    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
  }
  draw();

  // expose small API
  window.CanvasShared = {
    spawnSmoke
  };
})();
