(function(){
  var copyrightYear = document.getElementById('copyright-year');
  if(copyrightYear) copyrightYear.textContent = new Date().getFullYear();

  var sex = 'all', cat = 'all', shot = 'all', plat = 'all', q = '', onlyStar = false;

  var PLAT_NAME = { oai: 'OpenAI', nb: 'Nano Banana', jm: '即梦' };

  /* 该场景「确实更有优势」的平台。留空 = 三平台都合适，不做优劣区分。 */
  var STRENGTH = {
    F01:'', F02:'nb oai jm', F03:'nb jm', F04:'oai', F05:'', F06:'', F07:'oai nb',
    F08:'', F09:'', F10:'nb oai', F11:'', F12:'jm', F13:'', F14:'', F15:'nb',
    F16:'', F17:'jm', F18:'jm', F19:'nb jm', F20:'oai nb', F21:'oai nb',
    F22:'oai nb', F23:'oai nb', F24:'oai nb', F25:'nb oai', F26:'nb oai',
    F27:'nb', F28:'', F29:'', F30:'oai nb', F31:'jm', F32:'', F33:'oai nb',
    F34:'oai nb', F35:'oai jm', F36:'nb oai', F37:'jm nb', F38:'nb oai',
    F39:'nb', F40:'jm oai',
    F41:'oai nb', F42:'nb oai', F43:'oai nb', F44:'', F45:'', F46:'',
    F47:'oai', F48:'nb oai', F49:'', F50:'', F51:'', F52:'nb',
    F53:'nb oai', F54:'nb oai', F55:'oai nb', F56:'nb jm', F57:'nb oai',
    F58:'jm oai', F59:'nb oai', F60:'nb oai', F61:'nb oai', F62:'jm oai',
    F63:'oai jm', F64:'jm oai', F65:'', F66:'oai nb', F67:'', F68:'nb oai',
    F69:'oai nb', F70:'nb oai',
    M01:'oai nb', M02:'oai', M03:'', M04:'', M05:'nb jm', M06:'nb oai',
    M07:'oai nb', M08:'nb oai', M09:'', M10:'oai nb', M11:'jm', M12:'jm',
    M13:'oai nb', M14:'oai nb', M15:'nb oai', M16:'nb oai', M17:'oai',
    M18:'', M19:'oai jm', M20:'nb oai', M21:'jm', M22:'', M23:'', M24:'jm nb',
    M25:'',
    C01:'oai jm', C02:'nb oai', C03:'oai nb', C04:'nb', C05:'oai jm',
    C06:'oai nb', C07:'nb oai', C08:'jm',
    I01:'oai nb', I02:'oai nb', I03:''
  };

  /* 景别：取景范围。可写多个，空格分隔；留空 = 不属于任何景别分类。 */
  var SHOT = {
    F01:'中景', F02:'全身', F03:'中近景', F04:'全身', F05:'中近景', F06:'中景',
    F07:'中景', F08:'中景 全身', F09:'中近景', F10:'中景', F11:'中景', F12:'中景',
    F13:'中近景', F14:'全身', F15:'中景 全身', F16:'中景', F17:'中景', F18:'中景',
    F19:'中近景', F20:'中景', F21:'中景', F22:'特写', F23:'大特写 特写', F24:'近景',
    F25:'近景', F26:'中景', F27:'中景', F28:'中近景', F29:'全身', F30:'中景',
    F31:'全身 环境', F32:'中景', F33:'中景', F34:'中景', F35:'中景', F36:'中景',
    F37:'中景 全身', F38:'中近景', F39:'中景', F40:'中近景',
    F41:'大特写', F42:'大特写', F43:'特写', F44:'中近景', F45:'中景', F46:'中景',
    F47:'全身', F48:'环境', F49:'中景', F50:'中景', F51:'中景 全身', F52:'中近景',
    F53:'中近景', F54:'特写 中景', F55:'中景', F56:'中近景', F57:'中近景',
    F58:'中景 环境', F59:'全身', F60:'中景', F61:'环境', F62:'全身 环境',
    F63:'中景', F64:'中景', F65:'中近景', F66:'中景 环境', F67:'中近景',
    F68:'中近景', F69:'全身', F70:'中景',
    M01:'近景', M02:'全身', M03:'中景', M04:'中景', M05:'中近景', M06:'中景',
    M07:'中景 全身', M08:'全身', M09:'中景', M10:'中景', M11:'中景', M12:'中景',
    M13:'特写', M14:'近景', M15:'近景', M16:'中景', M17:'中景 全身 环境', M18:'全身 环境',
    M19:'中近景', M20:'中景', M21:'中景', M22:'中景', M23:'近景',
    M24:'全身 环境', M25:'全身',
    C01:'中景', C02:'中景 环境', C03:'全身', C04:'中景', C05:'中景', C06:'中景',
    C07:'全身', C08:'全身 环境',
    I01:'近景', I02:'近景', I03:'近景'
  };

  /* 个别卡片有明确的平台差异，单独写；其余用类型级规则兜底 */
  var CARD_NOTE = {
    C04: {
      nb: 'Pro 同画面通常只稳定保持 4–5 人，这张已经在临界值：务必从左到右点名每个人是谁，否则特征会互相融合。',
      jm: '用「帮我生成几张图」拆成一组，比硬塞进一张更稳；每张写明人物位置。',
      oai: '按 Image 1 / Image 2 的顺序给每个人编号，并写清左右位置与各自动作。'
    },
    C08: {
      nb: '六个人超过 Pro 的稳定人数上限，会出现脸互相混淆；建议改用即梦组图，或分两排、每排三人拍摄。',
      jm: '六人不要挤一张：加「组图」拆成 2–3 张，每张 2–3 人，稳定性明显更好。'
    },
    I01: {
      jm: '即梦对中文证照规格理解最好，但<b>必须补一句「无美颜滤镜痕迹」</b>——它默认会修成网红脸，容易被证照审核打回。',
      oai: '指令遵循最强：露耳、露额、镜片无反光这些硬指标写成句子，它基本照做。',
      nb: '用正向表述写规格（「双耳完整露出、额头清晰可见」），不要写「不要遮住耳朵」。'
    },
    I02: {
      oai: '规格类要求（构图比例、留白、光位角度）写成句子，OpenAI 的遵循度明显更好。',
      nb: '如果同时要出多张不同场景的头像，用它的「命名 + 只改场景」法最省事。'
    },
    F23: {
      nb: 'Nano Banana 没有负面词，把「不要过曝」改写成「保留可见的毛孔与皮肤纹理、亮部仍有层次」。',
      oai: '高调光容易把皮肤烧成一片白，务必补一句「亮部仍保留皮肤纹理」。'
    },
    F22: {
      oai: '光位参数（45 度、key/fill/rim 的角度与强度比）写得越具体越稳。'
    },
    M07: {
      oai: '肌肉线条依赖方向性硬光：写清「单一光源 + 角度 + 硬阴影」，柔光会把肌肉抹平。',
      nb: '描述光线在肌肉上的明暗分割方式，而不是只写「hard light」。'
    },
    M17: {
      oai: '西部年代的服装与场景细节，OpenAI 的世界知识会自行补全得更准确，写清年代即可。'
    },
    M24: {
      jm: '东方武侠的服装层次与竹景，中文描述给即梦的效果更好；注意把「静止」写清楚，否则它会自作主张加打斗动作。',
      nb: '先把「静止、垂首、手搭刀柄」写进前半段，风格词（胶片、宽画幅）放末尾。'
    },
    F17: { jm: '中式服饰的形制名称（唐制齐胸襦裙、点翠发簪）用中文写，即梦的语义理解最准，不容易串形制。' },
    F31: { jm: '敦煌色系与西域服饰用中文描述更准；配色建议直接点名赭红、石青，比写「高级配色」有效。' },
    C01: { jm: '中文里「互动的分寸感」更好表达；英文写双人互动容易生成商业糖水片。' }
  };

  /* 类型级兜底：没单独写的卡片，按「平台 × 场景类型」给一句可执行的改写要点 */
  var CAT_NOTE = {
    oai: {
      '日常': 'OpenAI 用 1–3 句自然语言就够：把人正在做什么、在哪、光从哪来写清；避免「影棚感」的词。',
      '街头': 'OpenAI 上把镜头、机位、光线方向写成摄影语言，比堆风格形容词更准。',
      '室内': 'OpenAI 要写明窗光方向；不想出现的元素直接写成句子（No X）。',
      '户外': 'OpenAI 的强项是世界知识：写清地点与时段，它会自行补全合理的环境与季节。',
      '古风': 'OpenAI 上把年代与建筑材质写具体，否则它容易自作主张加入现代元素。',
      '影棚': 'OpenAI 上把光位写具体（key / fill / rim 的角度与强度比），并说明背景材质。',
      '氛围': 'OpenAI 要写「尺度、空气感、颜色」三件事，只丢情绪词容易失控。',
      '家庭': 'OpenAI 必须按顺序点名每个人（Image 1 是…）并说明左右位置，否则人物会互相融合。',
      '证件': 'OpenAI 的指令遵循最强，规格类要求写成句子它基本照做。'
    },
    nb: {
      '日常': 'Nano Banana 只认正向描述：把「不要摆拍」改写成「自然抓拍、不看镜头、动作进行中」。',
      '街头': 'Nano Banana 不认负面词，排除杂物要改写成「干净空旷的街道」。',
      '室内': 'Nano Banana 上把窗光方向写进句子；改图时「改」与「保」分成两段写最稳。',
      '户外': 'Nano Banana 用摄影语言控光（golden hour backlighting 之类），并明确比例写在句末。',
      '古风': 'Nano Banana 容易把东方元素做混：服饰形制、朝代、材质逐项写明，风格词放最后。',
      '影棚': 'Nano Banana 里把相机与光线当成一个槽位写满（角度 + 柔光箱尺寸 + 阴影质感）。',
      '氛围': 'Nano Banana 处理复杂光效最稳，但要把每种颜色和它的方向分别写清，否则会糊成一团。',
      '家庭': '有多人时给每个人起名（Call this one "A"...），并按左到右标注位置，这是它官方推荐的做法。',
      '证件': 'Nano Banana 一律用正向表述写规格，不要出现「不要/不能」。'
    },
    jm: {
      '日常': '即梦吃中文自然段：先写人正在做什么，再用短词补风格、色彩、光影，最后带一句用途。',
      '街头': '即梦上编辑类指令要短而准：套「变化动作 + 变化对象 + 变化特征」即可。',
      '室内': '即梦垫图模式下写「保留什么 + 修改什么 + 要求什么」，最后用「无 XX」句式收口。',
      '户外': '即梦上专业名词用词源语言（英文）更准，如胶片型号、镜头焦段。',
      '古风': '中式元素是即梦的强项：形制、纹样、朝代用中文写全，别只写「古风」。',
      '影棚': '即梦上把光源与背景写成短词组合，不要写成文学描写，反而降准。',
      '氛围': '即梦上把环境光源数量说清（只有一盏／两盏），否则它会自动补光，画面变平。',
      '家庭': '要套图就加「一系列 / 组图 / 帮我生成几张图」，最多 15 张（输入 + 输出合计）。',
      '证件': '即梦中文规格类口令最好用，但务必补「无美颜滤镜痕迹」，避免被修成网红脸。'
    }
  };

  var TIPS = {
    oai: {
      name: 'OpenAI（gpt-image-2 / GPT Image 2.5）',
      adv: '严格规格与多约束指令、图中文字、<b>透明背景抠图</b>、世界知识与年代推断',
      rules: [
        '<b>1–3 句自然语言就够</b>，短优于长；复杂需求分段写（场景 / 主体 / 细节 / 约束）。',
        '没有负面词框，<b>排除项必须写成句子</b>：No extra text, no logos。',
        '改图用「只改 X，其余完全不变」，并且<b>每一轮都要重申保留项</b>。'
      ],
      last: '<b>两个开关：</b>编辑时开 <code>input_fidelity="high"</code> 保脸；画面有小字或密集信息时先试 <code>quality="high"</code>。<b>一个禁忌：</b>不要写暗示影棚精修 / 摆拍的词，官方范例里直接写了 No glamorization, no heavy retouching。'
    },
    nb: {
      name: 'Nano Banana（gemini-3-pro-image）',
      adv: '<b>多图融合（最多 14 张参考）</b>、同画面多人一致、对话式连续改图、文字渲染',
      rules: [
        '<b>只用正向表述</b>，它不认负面词：「不要车」要写成「空旷无人的街道」。',
        '改与保<b>分成两段</b>写：先写改什么，再写什么必须一模一样。',
        '有参考图时<b>给人物起名</b>（Call this character "Mira"），之后只用名字指代。'
      ],
      last: '<b>两个限制：</b>同画面稳定人数约 4–5 人，超出会混脸；水印是永久的，别指望干净成图。<b>一个禁忌：</b>不要重描被参考的那张脸——重描反而导致容貌漂移。'
    },
    jm: {
      name: '即梦 Seedream 4.0 / 4.5',
      adv: '<b>中文语义与中式元素</b>、组图输出、垫图换背景、局部重绘 / 扩图 / 消除 / 抠图',
      rules: [
        '文生图 ＝（主体 + 行为 + 环境）的连贯句子 ＋（风格 + 色彩 + 光影 + 构图）短词。',
        '编辑 ＝ <b>变化动作 + 变化对象 + 变化特征</b>，如「将头盔变为金色」。',
        '要套图就加「一系列 / 组图 / 帮我生成几张图」，最多 15 张（输入 + 输出合计）。'
      ],
      last: '<b>两个要点：</b>专业名词用词源语言（英文）更准；需要保持一致性<b>必须上传参考图</b>，纯文字撑不住。<b>一个禁忌：</b>编辑指令要短而准，写成长篇文学描写反而降低准确度。'
    }
  };

  var cards = Array.prototype.slice.call(document.querySelectorAll('.style-card'));
  function addCopyRow(copy, hint, container){
    var row = document.createElement('div');
    row.className = 'copy-row';
    var label = document.createElement('span');
    label.className = 'copy-hint';
    label.textContent = hint;
    row.appendChild(label);
    row.appendChild(copy);
    container.appendChild(row);
  }
  cards.forEach(function(c){
    var tEl = c.querySelector('.card-h .t');
    c.dataset.id = tEl ? tEl.textContent.trim().slice(0, 3) : '';
    c.dataset.strength = STRENGTH[c.dataset.id] || '';
    c.dataset.shot = SHOT[c.dataset.id] || '';
    /* 搜索索引在注入平台要点之前建立，避免搜「即梦」「OpenAI」时命中所有卡片 */
    c.dataset.search = (c.textContent + ' ' + c.dataset.shot + ' ' + c.dataset.cat).toLowerCase();
    var star = document.createElement('span');
    star.className = 'star';
    star.textContent = '★ 本平台优势';
    c.querySelector('.card-h').appendChild(star);
    c._star = star;
    var pd = document.createElement('div');
    pd.className = 'plat-notes';
    c.appendChild(pd);
    c._pd = pd;
    var prompt = c.querySelector('.prompt');
    var pre = prompt && prompt.querySelector('pre');
    var copy = prompt && prompt.querySelector('.copy');
    if(prompt && pre){
      pre.id = 'prompt-' + c.dataset.id;
      prompt.classList.add('is-collapsed');
      var expand = document.createElement('button');
      expand.type = 'button';
      expand.className = 'expand-card';
      expand.textContent = '展开完整提示词 ↓';
      expand.setAttribute('aria-expanded', 'false');
      expand.setAttribute('aria-controls', pre.id);
      prompt.insertAdjacentElement('afterend', expand);
      expand.addEventListener('click', function(){
        var opened = c.classList.toggle('is-expanded');
        prompt.classList.toggle('is-collapsed', !opened);
        expand.setAttribute('aria-expanded', opened ? 'true' : 'false');
        expand.textContent = opened ? '收起提示词 ↑' : '展开完整提示词 ↓';
      });
      if(copy){
        copy.type = 'button';
        copy.setAttribute('aria-label', '复制' + (tEl ? tEl.textContent.trim() : '提示词'));
        addCopyRow(copy, '复制给生图模型，可生成同款场景；上传自己的照片，也可改成同款写真。', c);
      }
    }
  });

  document.querySelectorAll('#s5 .prompt, #s2 .prompt').forEach(function(prompt){
    var copy = prompt.querySelector('.copy');
    if(!copy) return;
    var hint = prompt.closest('#s5')
      ? '上传原图后复制给生图模型，按所选需求修改照片。'
      : '复制公式，填入具体内容后再发送给生图模型。';
    var row = document.createElement('div');
    row.className = 'copy-row';
    var label = document.createElement('span');
    label.className = 'copy-hint';
    label.textContent = hint;
    row.appendChild(label);
    row.appendChild(copy);
    prompt.insertBefore(row, prompt.firstChild);
  });

  var countEl = document.getElementById('count');
  var tipEl = document.getElementById('tipbox');
  var chk = document.getElementById('onlyStar');
  var chkWrap = document.getElementById('chkwrap');

  var emptyEl = document.createElement('div');
  emptyEl.className = 'empty';
  emptyEl.innerHTML = '没有匹配的提示词 —— <b>换个关键词，或点「重置」清空条件</b>。';
  var s4El = document.getElementById('s4');
  if(s4El) s4El.appendChild(emptyEl);

  function isStar(c){
    return (c.dataset.strength || '').split(' ').indexOf(plat) > -1;
  }

  function renderTip(){
    if(plat === 'all'){ tipEl.className = 'tipbox'; tipEl.innerHTML = ''; return; }
    var t = TIPS[plat];
    tipEl.className = 'tipbox on';
    tipEl.innerHTML = '<div class="tt">' + t.name + ' · 改写要点</div>' +
      '<ul><li><b>优势场景：</b>' + t.adv + '</li>' +
      t.rules.map(function(r){ return '<li>' + r + '</li>'; }).join('') +
      '</ul><p class="last">' + t.last + '</p>';
  }

  function renderPlat(){
    cards.forEach(function(c){
      if(plat === 'all'){
        c._star.style.display = 'none';
        c._pd.className = 'plat-notes';
        c._pd.innerHTML = '';
        return;
      }
      c._star.style.display = isStar(c) ? '' : 'none';
      var own = (CARD_NOTE[c.dataset.id] || {})[plat];
      var txt = own || (CAT_NOTE[plat] || {})[c.dataset.cat] || '按上方改写要点调整句式即可。';
      c._pd.className = 'plat-notes on';
      c._pd.innerHTML = '<p><b>' + PLAT_NAME[plat] + '</b>：' + txt + '</p>';
    });
  }

  function apply(){
    var groups = document.querySelectorAll('.cat-group');
    var total = 0, starred = 0;
    groups.forEach(function(g){
      var sexOk = (sex === 'all' || g.dataset.sex === sex);
      if(!sexOk){ g.style.display = 'none'; return; }
      var vis = 0;
      g.querySelectorAll('.style-card').forEach(function(c){
        var okCat = (cat === 'all' || c.dataset.cat === cat);
        var okShot = (shot === 'all' || (c.dataset.shot || '').split(' ').indexOf(shot) > -1);
        var okQ = !q || (c.dataset.search || '').indexOf(q) > -1;
        var okP = (plat === 'all' || !onlyStar || isStar(c));
        var show = okCat && okShot && okQ && okP;
        c.style.display = show ? '' : 'none';
        if(show){ total++; if(plat !== 'all' && isStar(c)) starred++; }
        if(show) vis++;
      });
      g.style.display = vis ? '' : 'none';
    });
    var label = '共 ' + total + ' 条';
    if(plat !== 'all'){
      label = onlyStar
        ? '共 ' + total + ' 条 · ' + PLAT_NAME[plat] + '优势场景'
        : '共 ' + total + ' 条 · 其中 ' + starred + ' 条为' + PLAT_NAME[plat] + '优势场景';
    }
    countEl.textContent = label;
    emptyEl.classList.toggle('on', total === 0);
    if(jumpCountEl) jumpCountEl.textContent = total;
    var mobileCount = document.getElementById('mobileCount');
    if(mobileCount) mobileCount.textContent = total + ' 条';
    paintSum();
  }

  document.querySelectorAll('.chip[data-f]').forEach(function(chip){
    chip.setAttribute('aria-pressed', chip.classList.contains('on') ? 'true' : 'false');
  });
  document.querySelectorAll('.chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      var f = chip.dataset.f, v = chip.dataset.v;
      /* 「复制结果」「重置」也是 .chip，但没有 data-f，不能进筛选分支 */
      if(!f) return;
      document.querySelectorAll('.chip[data-f="' + f + '"]').forEach(function(x){
        x.classList.toggle('on', x === chip);
        x.setAttribute('aria-pressed', x === chip ? 'true' : 'false');
      });
      if(f === 'sex'){ sex = v; apply(); return; }
      if(f === 'cat'){ cat = v; apply(); return; }
      if(f === 'shot'){ shot = v; apply(); return; }
      /* 平台切换 */
      plat = v;
      if(v === 'all'){
        chk.checked = false; chk.disabled = true; onlyStar = false;
        chkWrap.classList.add('dis');
      } else {
        chk.disabled = false; chk.checked = true; onlyStar = true;
        chkWrap.classList.remove('dis');
      }
      renderTip(); renderPlat(); apply();
    });
  });

  chk.addEventListener('change', function(){
    onlyStar = chk.checked;
    apply();
  });

  var input = document.getElementById('q');
  input.addEventListener('input', function(){
    q = input.value.trim().toLowerCase();
    apply();
  });

  // 吸顶导航高亮
  var links = document.querySelectorAll('nav.topbar a');
  var secs = [];
  links.forEach(function(a){
    var el = document.querySelector(a.getAttribute('href'));
    if(el) secs.push({a:a, el:el});
  });
  function highlight(){
    var y = window.scrollY + 90, cur = null;
    secs.forEach(function(s){ if(s.el.offsetTop <= y) cur = s; });
    links.forEach(function(a){ a.classList.remove('on'); });
    if(!cur && window.scrollY < 120 && secs.length) cur = secs[0];
    if(cur) cur.a.classList.add('on');
  }
  /* 滚动/尺寸变化统一交给文件末尾的单帧调度器（highlight + 返回顶部 + 进度） */
  highlight();

  // 返回顶部
  var top = document.getElementById('top');
  top.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  // 复制反馈与降级处理
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function showToast(message){
    if(!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('on'); }, 2200);
  }
  function copyText(value){
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var success = false;
      try { success = document.execCommand('copy'); } catch(err){}
      document.body.removeChild(ta);
      return success ? Promise.resolve() : Promise.reject(new Error('复制失败'));
    }
    return navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(value).catch(fallback)
      : fallback();
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.copy');
    if(!btn) return;
    var card = btn.closest('.style-card');
    var pre = card ? card.querySelector('pre') : btn.closest('.prompt').querySelector('pre');
    if(!pre) return;
    copyText(pre.innerText.trim()).then(function(){
      var old = btn.textContent;
      btn.textContent = '已复制 ✓';
      btn.classList.add('done');
      showToast('提示词已复制');
      setTimeout(function(){ btn.textContent = old; btn.classList.remove('done'); }, 1500);
    }).catch(function(){ showToast('复制失败，请长按提示词手动复制'); });
  });

  /* ---------- 一键重置 ---------- */
  function resetAll(){
    sex = 'all'; cat = 'all'; shot = 'all'; plat = 'all'; onlyStar = false; q = '';
    document.querySelectorAll('.chip').forEach(function(x){
      if(x.classList.contains('act')) return;
      x.classList.toggle('on', x.dataset.v === 'all');
      x.setAttribute('aria-pressed', x.dataset.v === 'all' ? 'true' : 'false');
    });
    chk.checked = false; chk.disabled = true;
    chkWrap.classList.add('dis');
    input.value = '';
    renderTip(); renderPlat(); apply();
  }
  var resetBtn = document.getElementById('reset');
  if(resetBtn) resetBtn.addEventListener('click', resetAll);

  /* ---------- 复制当前筛选结果 ---------- */
  var copyAllBtn = document.getElementById('copyAll');
  if(copyAllBtn) copyAllBtn.addEventListener('click', function(){
    var out = [];
    document.querySelectorAll('.cat-group').forEach(function(g){
      if(g.style.display === 'none') return;
      g.querySelectorAll('.style-card').forEach(function(c){
        if(c.style.display === 'none') return;
        var t = c.querySelector('.card-h .t'), pre = c.querySelector('pre');
        if(t && pre) out.push(t.textContent.trim() + '\n' + pre.innerText.trim());
      });
    });
    if(!out.length){ showToast('当前没有可复制的结果'); return; }
    copyText(out.join('\n\n---\n\n')).then(function(){
      var old = copyAllBtn.textContent;
      copyAllBtn.textContent = '已复制 ' + out.length + ' 条';
      copyAllBtn.classList.add('on');
      showToast('已复制 ' + out.length + ' 条提示词');
      setTimeout(function(){ copyAllBtn.textContent = old; copyAllBtn.classList.remove('on'); }, 1700);
    }).catch(function(){ showToast('复制失败，请缩小筛选范围后重试'); });
  });

  /* ---------- 阅读进度 / 吸顶阴影 / 进度环 ---------- */
  var prog = document.getElementById('prog');
  var navEl = document.getElementById('topbar');
  function onScroll(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if(prog) prog.style.width = (p * 100).toFixed(2) + '%';
    if(navEl) navEl.classList.toggle('stuck', window.scrollY > 4);
    top.style.setProperty('--p', (p * 100).toFixed(1));
    syncJump();
  }
  /* 尺寸变化同样交给文件末尾的单帧调度器 */
  onScroll();

  /* ---------- 回到筛选面板 ---------- */
  var jumpEl = document.getElementById('jump');
  var jumpCountEl = document.getElementById('jumpCount');
  var filterEl = document.getElementById('filter');
  function goFilter(){
    if(filterEl) filterEl.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function syncJump(){
    if(!jumpEl || !filterEl || !s4El) return;
    var y = window.scrollY;
    var bottom = s4El.offsetTop + s4El.offsetHeight;
    var passed = filterEl.getBoundingClientRect().bottom < 40;
    jumpEl.classList.toggle('on', passed && y < bottom - 240);
  }
  if(jumpEl) jumpEl.addEventListener('click', goFilter);
  var mobileSearch = document.getElementById('mobileSearch');
  var mobileFilter = document.getElementById('mobileFilter');
  if(mobileSearch) mobileSearch.addEventListener('click', function(){
    goFilter();
    setTimeout(function(){ input.focus({preventScroll:true}); }, 300);
  });
  if(mobileFilter) mobileFilter.addEventListener('click', function(){
    setCollapsed(false);
    goFilter();
  });

  /* ---------- 深浅色切换 ---------- */
  var themeBtn = document.getElementById('theme');
  function paintTheme(){
    var mark = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
    if(themeBtn) themeBtn.textContent = mark;
    var mobileTheme = document.getElementById('mobileTheme');
    if(mobileTheme) mobileTheme.textContent = mark;
  }
  function setTheme(t){
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('pp-theme', t); } catch(e){}
    paintTheme();
  }
  paintTheme();
  if(themeBtn) themeBtn.addEventListener('click', function(){
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  var mobileThemeBtn = document.getElementById('mobileTheme');
  if(mobileThemeBtn) mobileThemeBtn.addEventListener('click', function(){
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ---------- 宽表在窄屏内横向滚动 ---------- */
  document.querySelectorAll('table').forEach(function(t){
    if(t.parentElement && t.parentElement.classList.contains('tscroll')) return;
    var first = t.querySelector('tr');
    if(first && first.querySelector('th') && !t.querySelector('thead')){
      var thead = document.createElement('thead');
      t.insertBefore(thead, t.firstChild);
      thead.appendChild(first);
    }
    var labels = Array.prototype.map.call(t.querySelectorAll('thead th'), function(x){ return x.textContent.trim(); });
    t.querySelectorAll('tbody tr').forEach(function(row){
      row.querySelectorAll('td').forEach(function(cell, i){ cell.dataset.label = labels[i] || ''; });
    });
    var w = document.createElement('div');
    w.className = 'tscroll';
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });

  /* ---------- 键盘快捷键：/ 搜索 · R 重置 · T 主题 · Esc 清空 ---------- */
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(document.activeElement === input){ input.value = ''; q = ''; apply(); input.blur(); }
      return;
    }
    if(e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if(e.key === '/'){ e.preventDefault(); input.focus(); input.select(); }
    else if(e.key === 'r' || e.key === 'R'){ resetAll(); }
    else if(e.key === 'f' || e.key === 'F'){ goFilter(); }
    else if(e.key === 't' || e.key === 'T'){ setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
  });

  /* ---------- 移动端：筛选面板折叠 + 当前条件摘要 ---------- */
  var SEX_NAME = { f: '女性', m: '男性', c: '双人多人', id: '证件头像' };
  var filterPanel = document.getElementById('filter');
  var fToggle = document.getElementById('fToggle');
  var fSum = document.getElementById('fSum');
  var mqNarrow = window.matchMedia ? window.matchMedia('(max-width:720px)') : null;

  function paintSum(){
    if(!fSum) return;
    var parts = [];
    if(sex !== 'all') parts.push(SEX_NAME[sex] || sex);
    if(cat !== 'all') parts.push(cat);
    if(shot !== 'all') parts.push(shot);
    if(plat !== 'all') parts.push(PLAT_NAME[plat] || plat);
    if(q) parts.push('「' + q + '」');
    fSum.textContent = parts.length ? parts.join(' · ') : '全部';
    if(fToggle) fToggle.classList.toggle('has', parts.length > 0);
    var dot = document.getElementById('activeFilterDot');
    if(dot) dot.classList.toggle('on', parts.length > 0 || onlyStar);
  }

  function setCollapsed(v){
    if(!filterPanel || !fToggle) return;
    filterPanel.classList.toggle('collapsed', !!v);
    fToggle.setAttribute('aria-expanded', v ? 'false' : 'true');
  }

  if(fToggle){
    fToggle.addEventListener('click', function(){
      setCollapsed(!filterPanel.classList.contains('collapsed'));
    });
  }
  function syncNarrow(){ if(mqNarrow) setCollapsed(mqNarrow.matches); }
  if(mqNarrow){
    if(mqNarrow.addEventListener) mqNarrow.addEventListener('change', syncNarrow);
    else if(mqNarrow.addListener) mqNarrow.addListener(syncNarrow);
  }
  syncNarrow();
  paintSum();

  /* ---------- 滚动与尺寸变化：合并到单帧调度，降低超长页面的滚动开销 ---------- */
  (function(){
    var pend = false;
    var raf = window.requestAnimationFrame || function(f){ return setTimeout(f, 16); };
    function run(){
      pend = false;
      highlight();
      top.style.display = window.scrollY > 500 ? 'flex' : 'none';
      onScroll();
    }
    function sched(){
      if(pend) return;
      pend = true;
      raf(run);
    }
    window.addEventListener('scroll', sched, {passive:true});
    window.addEventListener('resize', sched, {passive:true});
    sched();
  })();
})();
