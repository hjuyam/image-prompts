(function(){
  var year = document.getElementById('copyright-year');
  if(year) year.textContent = new Date().getFullYear();

  var cards = Array.prototype.slice.call(document.querySelectorAll('.style-card'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.cat-group'));
  var input = document.getElementById('q');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var filter = document.getElementById('filters');
  var filterToggle = document.getElementById('fToggle');
  var filterSummary = document.getElementById('fSum');
  var toast = document.getElementById('toast');
  var sex = 'all', cat = 'all', query = '', visible = cards;
  var toastTimer;

  function message(text){
    toast.textContent = text;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('on'); }, 2300);
  }
  function fallbackCopy(value){
    var field = document.createElement('textarea');
    field.value = value;
    field.style.cssText = 'position:fixed;opacity:0;inset:0;';
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(e){}
    field.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error('Copy failed'));
  }
  function copyText(value){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(value).catch(function(){ return fallbackCopy(value); });
    }
    return fallbackCopy(value);
  }
  function addCopyRow(button, hint, parent){
    var row = document.createElement('div');
    row.className = 'copy-row';
    var label = document.createElement('span');
    label.className = 'copy-hint';
    label.textContent = hint;
    row.appendChild(label);
    row.appendChild(button);
    parent.appendChild(row);
  }
  document.querySelectorAll('.style-card, .english-edit .card').forEach(function(card){
    var prompt = card.querySelector('.prompt');
    var button = prompt.querySelector('.copy');
    var pre = prompt.querySelector('pre');
    var title = card.querySelector('.card-h .t').textContent.trim();
    button.setAttribute('aria-label', 'Copy ' + title);
    if(card.classList.contains('style-card')){
      card.dataset.search = (title + ' ' + pre.textContent + ' ' + card.dataset.cat).toLowerCase();
      var preId = 'en-' + title.slice(0, 3);
      pre.id = preId;
      prompt.classList.add('is-collapsed');
      var expand = document.createElement('button');
      expand.type = 'button';
      expand.className = 'expand-card';
      expand.textContent = 'Read the full prompt ↓';
      expand.setAttribute('aria-controls', preId);
      expand.setAttribute('aria-expanded', 'false');
      prompt.insertAdjacentElement('afterend', expand);
      expand.addEventListener('click', function(){
        var opened = card.classList.toggle('is-expanded');
        prompt.classList.toggle('is-collapsed', !opened);
        expand.setAttribute('aria-expanded', String(opened));
        expand.textContent = opened ? 'Collapse prompt ↑' : 'Read the full prompt ↓';
      });
      addCopyRow(button, 'Copy to an image model to create this scene, or upload your photo to edit it.', card);
    } else {
      addCopyRow(button, 'Upload your photo, then copy this instruction to an image editor.', prompt);
    }
    button.addEventListener('click', function(){
      copyText(pre.textContent.trim()).then(function(){
        button.classList.add('done');
        button.textContent = 'Copied';
        message('Prompt copied');
        setTimeout(function(){ button.classList.remove('done'); button.textContent = 'Copy'; }, 1700);
      }).catch(function(){ message('Could not copy. Please select the prompt text manually.'); });
    });
  });

  function apply(){
    visible = cards.filter(function(card){
      var show = (sex === 'all' || card.dataset.sex === sex) &&
        (cat === 'all' || card.dataset.cat === cat) &&
        (!query || card.dataset.search.indexOf(query) !== -1);
      card.style.display = show ? '' : 'none';
      return show;
    });
    groups.forEach(function(group){
      group.style.display = Array.prototype.some.call(group.querySelectorAll('.style-card'), function(card){
        return card.style.display !== 'none';
      }) ? '' : 'none';
    });
    count.textContent = visible.length + (visible.length === 1 ? ' prompt' : ' prompts');
    document.getElementById('mobileCount').textContent = String(visible.length);
    empty.classList.toggle('on', visible.length === 0);
    var summary = [];
    if(sex !== 'all') summary.push(document.querySelector('.chip[data-f="sex"][data-v="' + sex + '"]').textContent);
    if(cat !== 'all') summary.push(document.querySelector('.chip[data-f="cat"][data-v="' + cat + '"]').textContent);
    if(query) summary.push('“' + query + '”');
    filterSummary.textContent = summary.length ? summary.join(' · ') : 'All scenes';
    document.getElementById('activeFilterDot').classList.toggle('on', summary.length > 0);
  }
  document.querySelectorAll('.chip[data-f]').forEach(function(chip){
    chip.setAttribute('aria-pressed', String(chip.classList.contains('on')));
    chip.addEventListener('click', function(){
      var kind = chip.dataset.f;
      document.querySelectorAll('.chip[data-f="' + kind + '"]').forEach(function(other){
        other.classList.toggle('on', other === chip);
        other.setAttribute('aria-pressed', String(other === chip));
      });
      if(kind === 'sex') sex = chip.dataset.v;
      else cat = chip.dataset.v;
      apply();
    });
  });
  input.addEventListener('input', function(){ query = input.value.trim().toLowerCase(); apply(); });
  function reset(){
    sex = 'all'; cat = 'all'; query = ''; input.value = '';
    document.querySelectorAll('.chip[data-f]').forEach(function(chip){
      var on = chip.dataset.v === 'all';
      chip.classList.toggle('on', on);
      chip.setAttribute('aria-pressed', String(on));
    });
    apply();
  }
  document.getElementById('reset').addEventListener('click', reset);
  document.getElementById('copyAll').addEventListener('click', function(){
    if(!visible.length){ message('No prompts to copy'); return; }
    var out = visible.map(function(card){
      return card.querySelector('.card-h .t').textContent.trim() + '\n' + card.querySelector('pre').textContent.trim();
    }).join('\n\n---\n\n');
    copyText(out).then(function(){ message('Copied ' + visible.length + ' prompts'); })
      .catch(function(){ message('Could not copy these results. Try a smaller selection.'); });
  });
  function setCollapsed(value){
    filter.classList.toggle('collapsed', value);
    filterToggle.setAttribute('aria-expanded', String(!value));
  }
  if(matchMedia('(max-width:720px)').matches) setCollapsed(true);
  filterToggle.addEventListener('click', function(){ setCollapsed(!filter.classList.contains('collapsed')); });
  document.getElementById('mobileSearch').addEventListener('click', function(){
    filter.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(function(){ input.focus({preventScroll:true}); }, 250);
  });
  document.getElementById('mobileFilter').addEventListener('click', function(){
    setCollapsed(false);
    filter.scrollIntoView({behavior:'smooth',block:'start'});
  });
  function theme(value){
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem('pp-theme', value); } catch(e){}
    var icon = value === 'dark' ? '☀' : '☾';
    document.getElementById('theme').textContent = icon;
    document.getElementById('mobileTheme').textContent = icon;
  }
  function toggleTheme(){ theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
  theme(document.documentElement.dataset.theme || 'light');
  document.getElementById('theme').addEventListener('click', toggleTheme);
  document.getElementById('mobileTheme').addEventListener('click', toggleTheme);
  var top = document.getElementById('top');
  top.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  function onScroll(){
    var max = document.documentElement.scrollHeight - innerHeight;
    var progress = max > 0 ? Math.min(100, Math.max(0, 100 * scrollY / max)) : 0;
    document.getElementById('prog').style.width = progress.toFixed(1) + '%';
    top.style.display = scrollY > 450 ? 'flex' : 'none';
    top.style.setProperty('--p', progress.toFixed(1));
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  onScroll(); apply();
})();
