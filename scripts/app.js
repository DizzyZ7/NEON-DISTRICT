(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const q = (selector, context = document) => context.querySelector(selector);
  const qa = (selector, context = document) => [...context.querySelectorAll(selector)];

  addEventListener('load', () => setTimeout(() => q('.loader')?.classList.add('is-hidden'), 500));

  const menu = q('.menu-panel');
  const menuButton = q('.menu-toggle');
  const setMenu = open => {
    menu?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-hidden', String(!open));
    menuButton?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  qa('.menu-panel a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  let pulseMode = false;
  q('.sound-toggle')?.addEventListener('click', event => {
    pulseMode = !pulseMode;
    event.currentTarget.classList.toggle('is-active', pulseMode);
    event.currentTarget.setAttribute('aria-pressed', String(pulseMode));
    q('span', event.currentTarget).textContent = pulseMode ? 'Pulse on' : 'Pulse off';
  });

  if (fine) {
    const cursor = q('.cursor');
    addEventListener('pointermove', event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    qa('a,button,[data-cursor]').forEach(element => {
      element.addEventListener('pointerenter', () => {
        cursor.classList.add('is-active');
        q('span', cursor).textContent = element.dataset.cursor || 'OPEN';
      });
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
    qa('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        if (!window.gsap) return;
        const rect = element.getBoundingClientRect();
        gsap.to(element, { x:(event.clientX-rect.left-rect.width/2)*.14, y:(event.clientY-rect.top-rect.height/2)*.14, duration:.35 });
      });
      element.addEventListener('pointerleave', () => window.gsap && gsap.to(element, { x:0, y:0, duration:.55, ease:'power3.out' }));
    });
    const portal = q('.hero__portal');
    portal?.addEventListener('pointermove', event => {
      if (!window.gsap) return;
      const rect = portal.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to('.portal-core', { rotateY:x*14, rotateX:-y*10, x:x*16, y:y*12, duration:.75, ease:'power3.out' });
      gsap.to('.portal-card--one,.portal-card--three', { x:x*-25, y:y*-18, duration:.8 });
      gsap.to('.portal-card--two', { x:x*24, y:y*20, duration:.8 });
    });
    portal?.addEventListener('pointerleave', () => window.gsap && gsap.to('.portal-core,.portal-card', { rotateX:0, rotateY:0, x:0, y:0, duration:.9, ease:'power3.out' }));
  }

  const zoneData = [
    {code:'ZONE / A',name:'SPECTRA',copy:'Large-scale projection, volumetric light and responsive architecture.',glyph:'A'},
    {code:'ZONE / B',name:'VECTOR',copy:'Live audiovisual performance where image and sound are generated in real time.',glyph:'V'},
    {code:'ZONE / C',name:'PULSE',copy:'A body-led performance floor shaped by movement, rhythm and collective heat.',glyph:'P'},
    {code:'ZONE / D',name:'NULL ROOM',copy:'Slow experiments, low frequencies and intimate works designed for small groups.',glyph:'Ø'}
  ];
  qa('.zone-button').forEach((button,index) => {
    const activate = () => {
      qa('.zone-button').forEach((item,itemIndex) => {
        item.classList.toggle('is-active', itemIndex === index);
        item.setAttribute('aria-selected', String(itemIndex === index));
      });
      const stage = q('.zones__stage');
      const data = zoneData[index];
      stage.dataset.active = String(index);
      q('.zone-code').textContent = data.code;
      q('.zone-name').textContent = data.name;
      q('.zone-copy').textContent = data.copy;
      q('.zone-object__glyph').textContent = data.glyph;
      if (window.gsap) gsap.fromTo('.zone-object__glyph,.zone-readout strong,.zone-readout p',{y:20,opacity:.15,rotate:-4},{y:0,opacity:1,rotate:0,duration:.55,stagger:.06,ease:'power3.out'});
    };
    button.addEventListener('click', activate);
    button.addEventListener('mouseenter', () => fine && activate());
  });

  qa('.poster').forEach((poster,index) => poster.addEventListener('click', () => {
    qa('.poster').forEach(item => item.classList.remove('is-active'));
    poster.classList.add('is-active');
    const shifts = ['0deg','8deg','-7deg','12deg'];
    qa('.poster').forEach((item,itemIndex) => item.style.transform = itemIndex === index ? 'translateY(-22px) rotateX(4deg)' : `rotate(${shifts[(itemIndex+index)%4]}) scale(.96)`);
    setTimeout(() => qa('.poster').forEach((item,itemIndex) => item.style.transform = itemIndex === index ? 'translateY(-22px) rotateX(4deg)' : ''), 900);
  }));

  const dayPrograms = [
    [['19:00','KIRA VANE','KINETIC LIGHT','SPECTRA'],['21:10','MONOCHROME UNIT','LIVE AV','VECTOR'],['23:40','RITUAL OBJECTS','PERFORMANCE','PULSE'],['02:20','NOX ARRAY','LASER / SOUND','VECTOR'],['04:00','AMBIENT ERROR','SLEEP CONCERT','NULL ROOM']],
    [['18:30','SOFT MACHINE','GENERATIVE INSTALLATION','SPECTRA'],['20:40','ECHO INDEX','LIVE CINEMA','VECTOR'],['23:00','BODY PROTOCOL','CHOREOGRAPHY','PULSE'],['01:30','STATIC BLOOM','MODULAR AV','VECTOR'],['03:50','SILENT CURRENT','DARK AMBIENT','NULL ROOM']],
    [['18:20','AFTERIMAGE LAB','SPATIAL LIGHT','SPECTRA'],['20:20','LOW SIGNAL','DATA PERFORMANCE','VECTOR'],['22:50','CHROMA STATE','LIVE SET','PULSE'],['01:10','MACHINE WEATHER','AUDIOVISUAL','VECTOR'],['03:30','LAST TRANSMISSION','CLOSING WORK','NULL ROOM']]
  ];
  qa('.day-tab').forEach((button,index) => button.addEventListener('click', () => {
    qa('.day-tab').forEach((item,itemIndex) => {item.classList.toggle('is-active',itemIndex===index);item.setAttribute('aria-selected',String(itemIndex===index));});
    const rows = qa('.artist-row');
    rows.forEach((row,rowIndex) => {
      const data = dayPrograms[index][rowIndex];
      q('time',row).textContent=data[0];q('.artist-name',row).textContent=data[1];q('.artist-format',row).textContent=data[2];q('b',row).textContent=data[3];
    });
    if (window.gsap) gsap.fromTo(rows,{x:35,opacity:0},{x:0,opacity:1,duration:.45,stagger:.06,ease:'power3.out'});
  }));

  const passData = [
    {code:'ND / 01',name:'ONE NIGHT',copy:'Access to every active zone on one selected night, from 18:00 until close.',access:'1 NIGHT',entry:'STANDARD',price:'18 000 ₸'},
    {code:'ND / 03',name:'FULL DISTRICT',copy:'Three-night access, re-entry privileges and priority routes through high-capacity zones.',access:'3 NIGHTS',entry:'PRIORITY',price:'42 000 ₸'},
    {code:'ND / BX',name:'BACKSTAGE SIGNAL',copy:'Full festival access plus artist talks, studio visits and the midnight control-room session.',access:'3 NIGHTS',entry:'STUDIO',price:'78 000 ₸'}
  ];
  qa('.pass-tab').forEach((button,index) => button.addEventListener('click', () => {
    qa('.pass-tab').forEach((item,itemIndex) => {item.classList.toggle('is-active',itemIndex===index);item.setAttribute('aria-selected',String(itemIndex===index));});
    const data = passData[index];
    q('.pass-code').textContent=data.code;q('.pass-name').textContent=data.name;q('.pass-copy').textContent=data.copy;q('.pass-access').textContent=data.access;q('.pass-entry').textContent=data.entry;q('.pass-price-value').textContent=data.price;
    if (window.gsap) gsap.fromTo('.pass-name,.pass-copy,.pass-meta,.pass-price',{y:18,opacity:.15},{y:0,opacity:1,duration:.45,stagger:.06,ease:'power3.out'});
  }));

  q('.contact-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = `NEON DISTRICT transmission\nName: ${form.get('name')}\nEmail: ${form.get('email')}\nAccess: ${form.get('interest')}\nMessage: ${form.get('message') || '—'}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    const button = q('.submit-button', event.currentTarget);
    button.innerHTML = '<span>Transmission saved</span><b>✓</b>';
  });

  const canvas = q('#signal-canvas');
  const ctx = canvas?.getContext('2d');
  let width = innerWidth, height = innerHeight, pointerX = .5, pointerY = .5, scrollRatio = 0;
  const rings = Array.from({length:22}, (_,i) => ({z:i/22,phase:Math.random()*Math.PI*2}));
  const resize = () => { if(!canvas || !ctx) return; const dpr=Math.min(devicePixelRatio||1,2); width=innerWidth;height=innerHeight;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0); };
  addEventListener('resize',resize); resize();
  addEventListener('pointermove',e=>{pointerX=e.clientX/width;pointerY=e.clientY/height;});
  addEventListener('scroll',()=>{scrollRatio=scrollY/Math.max(1,document.documentElement.scrollHeight-height);},{passive:true});
  const draw = time => {
    if (!ctx || reduced) return;
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(width*(.5+(pointerX-.5)*.06),height*(.5+(pointerY-.5)*.05));
    const pulse = pulseMode ? 1+Math.sin(time*.008)*.1 : 1;
    rings.forEach((ring,index) => {
      ring.z += .0022 + scrollRatio*.0025;
      if(ring.z>1) ring.z-=1;
      const depth = ring.z;
      const size = (1-depth)*Math.min(width,height)*.78*pulse;
      const alpha = Math.sin(depth*Math.PI)*.28;
      const hue = index%4;
      ctx.strokeStyle = [`rgba(255,58,191,${alpha})`,`rgba(46,242,255,${alpha})`,`rgba(217,255,69,${alpha})`,`rgba(109,76,255,${alpha})`][hue];
      ctx.lineWidth = 1+depth*1.5;
      ctx.save();ctx.rotate(time*.00008*(index%2?1:-1)+ring.phase+scrollRatio*2);ctx.strokeRect(-size/2,-size/2,size,size);ctx.restore();
    });
    ctx.restore();
    requestAnimationFrame(draw);
  };
  if (!reduced) requestAnimationFrame(draw);

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({duration:1.15,smoothWheel:true});
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(time=>lenis.raf(time*1000));
      gsap.ticker.lagSmoothing(0);
    }
    gsap.to('.page-progress span',{scaleY:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
    gsap.from('.hero__meta,.hero__title-line,.hero__portal,.hero__footer',{y:70,opacity:0,duration:1.15,stagger:.09,ease:'power4.out',delay:.2});
    gsap.to('.hero__title',{yPercent:-18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero__portal',{scale:.82,rotate:15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.from('.manifest h2,.manifest__copy',{y:65,opacity:0,stagger:.14,scrollTrigger:{trigger:'.manifest',start:'top 70%'}});
    gsap.to('.manifest__rule span',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.manifest__rule',start:'top 85%',end:'top 35%',scrub:true}});
    gsap.from('.zones__stage',{clipPath:'inset(8% 8% 8% 8%)',scrollTrigger:{trigger:'.zones__stage',start:'top 80%',end:'top 25%',scrub:true}});
    gsap.from('.poster',{y:90,rotate:8,opacity:0,stagger:.1,scrollTrigger:{trigger:'.poster-deck',start:'top 78%'}});
    gsap.from('.lineup__board',{y:70,opacity:0,scrollTrigger:{trigger:'.lineup__board',start:'top 78%'}});
    const programSteps = qa('.program-step');
    const activateProgram = index => {
      programSteps.forEach((item,i)=>item.classList.toggle('is-active',i===index));
      const step=programSteps[index];
      q('.program-time').textContent=step.dataset.time;
      q('.program-state').textContent=step.dataset.state;
      gsap.to('.tunnel-ring--1',{rotate:45+index*18,scale:1-index*.04,duration:.7});
      gsap.to('.tunnel-ring--2',{rotate:-45-index*22,scale:1-index*.03,duration:.7});
      gsap.to('.tunnel-ring--3',{rotate:45+index*30,duration:.7});
    };
    if(matchMedia('(min-width:900px)').matches){programSteps.forEach((step,index)=>ScrollTrigger.create({trigger:step,start:'top 55%',end:'bottom 55%',onEnter:()=>activateProgram(index),onEnterBack:()=>activateProgram(index)}));}
    gsap.from('.pass-card',{scale:.94,opacity:0,scrollTrigger:{trigger:'.passes__grid',start:'top 75%',end:'top 30%',scrub:true}});
    qa('[data-count]').forEach(element=>{const target=Number(element.dataset.count),proxy={value:0};gsap.to(proxy,{value:target,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 85%',once:true},onUpdate:()=>element.textContent=Math.round(proxy.value)});});
    gsap.from('.contact-form label,.submit-button',{y:35,opacity:0,stagger:.07,scrollTrigger:{trigger:'.contact-form',start:'top 75%'}});
  }
})();
