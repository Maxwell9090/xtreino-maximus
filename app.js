// app.js - Música toca ao abrir o site (autoplay garantido), slots, topo elegante

(() => {
  const SLOTS = 36;
  const RESERVES = 3;
  const STORAGE_KEY = 'xtreino-list-final-v7';

  const slotsGrid = document.getElementById('slots-grid');
  const reservesGrid = document.getElementById('reserves');
  const linkTransmissaoDisplay = document.getElementById('link-transmissao-display');
  const linkGrupoDisplay = document.getElementById('link-grupo-display');
  const bgmusic = document.getElementById('bgmusic');
  const musicToggle = document.getElementById('music-toggle');

  // Dados iniciais
  const defaultSlots = [
    { clan:'nitrix / shark', tag:'Nx / Sk', player1:'New End', player2:'', semtag:'', contato:'34984278843' },
    { clan:'', tag:'', player1:'', player2:'', semtag:'', contato:'Sayajin' },
    { clan:'', tag:'', player1:'', player2:'', semtag:'', contato:'jujuba' },
    { clan:'Maximus', tag:'M•', player1:'M҉・CHZINN', player2:'M҉・ÁLVARO', semtag:'', contato:'' },
    { clan:'Maximus', tag:'M•', player1:'M҉・MAGRINHO', player2:'M҉・IGRIS', semtag:'', contato:'' },
    { clan:'Maximus', tag:'M•', player1:'M҉・GOMES', player2:'M҉・SAITAMA', semtag:'', contato:'' },
    { clan:'', tag:'Jesus / Ruivinha', player1:'', player2:'', semtag:'', contato:'' },
    { clan:'', tag:'', player1:'', player2:'', semtag:'Mucilønttk/ৡPSڪwalaceৡ', contato:'87981385456' },
    { clan:'LDN', tag:'', player1:'', player2:'', semtag:'MF-EoJoker.Tk/Macaco louco', contato:'91383536' },
    { clan:'Ladrões de Kill', tag:'ĿÐK', player1:'Pedro', player2:'Eliza', semtag:'', contato:'' },
    { clan:'JIG SAW', tag:'SAW •', player1:'Storm', player2:'Loba', semtag:'', contato:'' },
    { clan:'', tag:'Vђa杰Suang', player1:'conexões', player2:'', semtag:'ǨȺȺȞ', contato:'(11)94874-8668' },
    { clan:'Legião Sombria', tag:'LS', player1:'', player2:'', semtag:'Ceifador/Calviz', contato:'54991278578' },
    { clan:'', tag:'', player1:'', player2:'', semtag:'BRUTA.ttk®-Ark-jr', contato:'92992901463' },
    ...Array.from({length: SLOTS - 14}, () => ({clan:'', tag:'', player1:'', player2:'', semtag:'', contato:''}))
  ];

  let state = {
    event: {
      transmissao: 'https://www.tiktok.com/@tamiresnazario?_t=ZM-8zGFRa0iGpC&_r=1',
      grupo: 'https://chat.whatsapp.com/L6KSovaeB2ZBsNRwmtcwnk'
    },
    slots: defaultSlots.slice(),
    reserves: Array.from({length: RESERVES}, () => ({clan:'', tag:'', player1:'', player2:'', semtag:'', contato:''}))
  };

  // Load/migrate
  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && parsed.slots && parsed.event){
          parsed.slots = parsed.slots.map(s => {
            if(s.player1 !== undefined) return s;
            const line = (s.line || '').toString();
            const parts = line.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
            return {
              clan: s.clan || '',
              tag: s.tag || '',
              player1: parts[0] || '',
              player2: parts[1] || '',
              semtag: s.semtag || '',
              contato: s.contato || ''
            };
          });
          state = parsed;
        }
      }
    }catch(e){}
  }
  function saveState(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  }

  function updateLinkDisplay(anchorEl, url){
    if(!anchorEl) return;
    const trimmed = (url || '').trim();
    if(!trimmed){
      anchorEl.href = '#';
      anchorEl.textContent = '';
      anchorEl.style.pointerEvents = 'none';
      anchorEl.style.opacity = '0.6';
    } else {
      let href = trimmed;
      if(!/^https?:\/\//i.test(href)) href = 'https://' + href;
      anchorEl.href = href;
      anchorEl.textContent = trimmed;
      anchorEl.style.pointerEvents = '';
      anchorEl.style.opacity = '';
    }
  }

  function createSlotCard(index, data, onSave){
    const wrapper = document.createElement('div');
    wrapper.className = 'slot-card';

    const title = document.createElement('h4');
    title.textContent = `☠︎ ${String(index).padStart(2,'0')} ➤`;
    wrapper.appendChild(title);

    function makeField(labelText, value, key){
      const row = document.createElement('div');
      row.className = 'slot-field';
      const lbl = document.createElement('div');
      lbl.className = 'label';
      lbl.textContent = labelText;
      const inp = document.createElement('input');
      inp.className = 'slot-input';
      inp.type = 'text';
      inp.value = value || '';
      inp.disabled = true;
      inp.dataset.key = key;
      row.appendChild(lbl);
      row.appendChild(inp);
      return {row, inp};
    }
    const clan = makeField('Clã:', data.clan, 'clan');
    const tag = makeField('Tag:', data.tag, 'tag');
    const player1 = makeField('Player 1:', data.player1, 'player1');
    const player2 = makeField('Player 2:', data.player2, 'player2');
    const semtag = makeField('Sem tag:', data.semtag, 'semtag');
    const contato = makeField('Contato:', data.contato, 'contato');

    wrapper.appendChild(clan.row);
    wrapper.appendChild(tag.row);
    wrapper.appendChild(player1.row);
    wrapper.appendChild(player2.row);
    wrapper.appendChild(semtag.row);
    wrapper.appendChild(contato.row);

    const actions = document.createElement('div');
    actions.className = 'slot-actions';
    const btnEdit = document.createElement('button'); btnEdit.textContent = 'Editar';
    const btnSave = document.createElement('button'); btnSave.textContent = 'Salvar';
    btnSave.disabled = true;

    actions.appendChild(btnEdit);
    actions.appendChild(btnSave);
    wrapper.appendChild(actions);

    btnEdit.addEventListener('click', () => {
      [clan.inp, tag.inp, player1.inp, player2.inp, semtag.inp, contato.inp].forEach(i => i.disabled = false);
      clan.inp.focus();
      btnSave.disabled = false;
      btnEdit.disabled = true;
    });

    btnSave.addEventListener('click', () => {
      const newData = {
        clan: clan.inp.value.trim(),
        tag: tag.inp.value.trim(),
        player1: player1.inp.value.trim(),
        player2: player2.inp.value.trim(),
        semtag: semtag.inp.value.trim(),
        contato: contato.inp.value.trim()
      };
      [clan.inp, tag.inp, player1.inp, player2.inp, semtag.inp, contato.inp].forEach(i => i.disabled = true);
      btnSave.disabled = true;
      btnEdit.disabled = false;
      onSave(newData);
    });

    return wrapper;
  }

  function render(){
    slotsGrid.innerHTML = '';
    reservesGrid.innerHTML = '';
    updateLinkDisplay(linkTransmissaoDisplay, state.event.transmissao || '');
    updateLinkDisplay(linkGrupoDisplay, state.event.grupo || '');

    state.slots.forEach((s, idx) => {
      const card = createSlotCard(idx+1, s, (newData) => {
        state.slots[idx] = newData;
        saveState();
      });
      slotsGrid.appendChild(card);
    });

    state.reserves.forEach((r, idx) => {
      const card = createSlotCard(`Reserva ${idx+1}`, r, (newData) => {
        state.reserves[idx] = newData;
        saveState();
      });
      reservesGrid.appendChild(card);
    });
  }

  // Música de fundo: garantir autoplay e controle
  function setupMusic(){
    let playing = true;
    function updateBtn(){
      musicToggle.textContent = playing ? "🔊" : "🔈";
      musicToggle.classList.toggle("off", !playing);
    }
    updateBtn();
    musicToggle.onclick = ()=>{
      playing = !playing;
      bgmusic.muted = !playing;
      updateBtn();
      if(playing && bgmusic.paused) bgmusic.play();
    };
    // Autoplay garantido: tenta play em várias situações
    function tryPlay(){
      if(bgmusic && bgmusic.paused) {
        bgmusic.muted = false;
        bgmusic.volume = 1;
        bgmusic.play().catch(()=>{});
      }
    }
    // Desktop: clique
    document.addEventListener('click', tryPlay, {once:true});
    // Mobile: toque
    document.addEventListener('touchstart', tryPlay, {once:true});
    // Caso o navegador permita, tenta autoplay assim que carregar
    window.addEventListener('DOMContentLoaded', tryPlay);

    // Se for bloqueado, o botão 🔊 sempre ativa
  }

  // Init
  loadState();
  render();
  setupMusic();
})();