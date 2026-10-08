(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const esc = s => String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const key = 'nwt9-seifenblasen-lernpfad-v1';
  const fresh = () => ({version:1,answers:{},completed:{},quiz:{},lastRoute:'#/lernen/start/0'});
  let state = fresh(), storageAvailable = true, active = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key)||'null');
    if(saved && saved.version===1 && typeof saved.answers==='object' && saved.answers && typeof saved.completed==='object' && saved.completed) {
      state={...fresh(),...saved,quiz:saved.quiz||{}};
    }
    localStorage.setItem(key,JSON.stringify(state));
  } catch { storageAvailable=false; }
  function storageNotice() {
    if(!storageAvailable) {
      $('#storage-notice').hidden=false;
      $('#storage-notice').textContent='Dieser Browser kann deine Antworten nicht dauerhaft speichern. Sichere sie vor dem Schließen über „Mein Lernheft“. Während diese Seite offen bleibt, bleiben sie erhalten.';
    }
  }
  storageNotice();
  function save() {
    state.updated=new Date().toISOString();
    if(storageAvailable) {
      try { localStorage.setItem(key,JSON.stringify(state)); }
      catch { storageAvailable=false;storageNotice(); }
    }
    $('#save-status').textContent=storageAvailable?'Auf diesem Gerät gespeichert. Sichere dein Lernheft regelmäßig.':'Nur für diese Sitzung gespeichert. Bitte Lernheft herunterladen.';
  }
  let toastTimer;
  function toast(text) {
    clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;
    toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);
  }
  const stepKey = (module,step) => `${module.id}-${step.id}`;
  const answerKey = (module,step,field) => `${stepKey(module,step)}-${field.key}`;
  const total = COURSE.reduce((n,m)=>n+m.steps.length,0);
  function nav(current) {
    let done=0;
    $('#module-nav').innerHTML=COURSE.map(m=>{
      const count=m.steps.filter(s=>state.completed[stepKey(m,s)]).length;done+=count;
      return `<a class="module-link ${current===m.id?'active':''} ${count===m.steps.length?'done':''}" href="#/lernen/${m.id}/0" ${current===m.id?'aria-current="page"':''}><span class="module-number">${count===m.steps.length?'✓':m.number}</span><span>${esc(m.title)}<small>${count} von ${m.steps.length} Schritten</small></span></a>`;
    }).join('');
    const percent=Math.round(done/total*100);$('#overall-text').textContent=`${percent} %`;$('#overall-progress').value=percent;
    $('#learn-link').href=state.lastRoute||'#/lernen/start/0';
  }
  function fieldMarkup(id,field) {
    const value=state.answers[id]??'';
    return `<div class="field"><label for="${esc(id)}">${esc(field.label)}</label>${field.guide?`<div class="field-guide">${esc(field.guide)}</div>`:''}<textarea id="${esc(id)}" data-answer="${esc(id)}" ${field.type==='code'?'class="code-answer" spellcheck="false"':''} placeholder="${esc(field.placeholder||'Schreibe deine Antwort hier …')}">${esc(value)}</textarea></div>`;
  }
  function criteria() {
    return `<div class="criteria" aria-label="Messbare Projektkriterien"><div class="criterion"><strong>15 s</strong><span>höchstens bis zur<br>fertigen Seifenblase</span></div><div class="criterion"><strong>7 cm</strong><span>mindestens<br>Durchmesser</span></div><div class="criterion"><strong>8 s</strong><span>mindestens<br>Schwebezeit</span></div></div>`;
  }
  function quizMarkup(m,s) {
    if(!s.quiz)return '';
    const id=stepKey(m,s), q=s.quiz, selected=state.quiz[id];
    return `<section class="quiz" aria-label="Selbstcheck"><h3>Prüfe dein Verständnis</h3><form data-quiz="${id}"><fieldset><legend>${esc(q.question)}</legend>${q.options.map((option,i)=>`<label><input type="radio" name="${id}-quiz" value="${i}" ${selected===i?'checked':''}><span>${esc(option)}</span></label>`).join('')}</fieldset><button class="button small" type="submit">Antwort prüfen</button><div class="quiz-feedback" role="status"></div></form></section>`;
  }
  function lesson(m,index) {
    const s=m.steps[index],id=stepKey(m,s);active={module:m,step:s,index};
    state.lastRoute=`#/lernen/${m.id}/${index}`;save();nav(m.id);
    const all=COURSE.flatMap(x=>x.steps.map((y,i)=>({module:x,step:y,index:i}))), position=all.findIndex(x=>x.module.id===m.id&&x.index===index);
    const prev=all[position-1],next=all[position+1];
    $('#main').innerHTML=`<div class="module-heading"><div><div class="eyebrow">Kapitel ${m.number} · ${esc(m.subtitle)}</div><h1>${esc(m.title)}</h1></div><span class="chapter-tag">${esc(m.time)}</span></div><p class="intro">${esc(m.intro)}</p>${(m.id==='start'||m.id==='projekt')&&index===0?criteria():''}<div class="lesson-layout"><article class="lesson-card"><header class="lesson-card-head"><span class="step-badge" aria-hidden="true">${index+1}</span><div><div class="step-meta">Schritt ${index+1} von ${m.steps.length}</div><h2>${esc(s.title)}</h2></div></header><div class="lesson-body">${s.body}${s.widget?`<div id="lesson-widget"></div>`:''}${s.fields.length?`<section class="task-section"><h3>Jetzt bist du dran</h3><p>Bearbeite die Fragen in deinem Heft oder direkt hier.</p>${s.fields.map(f=>fieldMarkup(answerKey(m,s,f),f)).join('')}<div class="helper-note">Zeichnungen und Versuchsaufbauten hältst du auf Papier fest.</div></section>`:''}${quizMarkup(m,s)}${(s.hints?.length||s.solution)?`<div class="hints"><h3 class="small-heading">Wenn du Unterstützung brauchst</h3>${(s.hints||[]).map((hint,i)=>`<details><summary>Tipp ${i+1}</summary><div>${hint}</div></details>`).join('')}${s.solution?`<details class="solution"><summary>Vergleichslösung ansehen</summary><div><p class="helper-note">Vergleiche erst nach deinem eigenen Versuch. Mehrere fachlich passende Antworten sind möglich.</p>${s.solution}</div></details>`:''}</div>`:''}<div class="source-label">Grundlage: ${esc(m.source)}</div></div><footer class="lesson-actions"><button id="complete-step" class="button ${state.completed[id]?'complete':'secondary'}" aria-pressed="${!!state.completed[id]}">${state.completed[id]?'✓ Als bearbeitet markiert':'Als bearbeitet markieren'}</button><div class="button-row">${prev?`<a class="button secondary" href="#/lernen/${prev.module.id}/${prev.index}">Zurück</a>`:''}${next?`<a class="button" href="#/lernen/${next.module.id}/${next.index}">Nächster Schritt</a>`:'<a class="button" href="#/heft">Lernheft sichern</a>'}</div></footer></article><aside class="step-list" aria-label="Schritte dieses Kapitels"><h3>In diesem Kapitel</h3><nav>${m.steps.map((st,i)=>`<a class="step-item ${i===index?'active':''} ${state.completed[stepKey(m,st)]?'done':''}" href="#/lernen/${m.id}/${i}" ${i===index?'aria-current="step"':''} aria-label="Schritt ${i+1}: ${esc(st.title)}"><b>${state.completed[stepKey(m,st)]?'✓':i+1}</b><span>${esc(st.title)}</span></a>`).join('')}</nav><a class="material-shortcut" href="#/material">Arbeitsblätter und Folien</a></aside></div>`;
    $('#complete-step').onclick=()=>{
      state.completed[id]=!state.completed[id];save();nav(m.id);
      const b=$('#complete-step');b.textContent=state.completed[id]?'✓ Als bearbeitet markiert':'Als bearbeitet markieren';b.className=`button ${state.completed[id]?'complete':'secondary'}`;b.setAttribute('aria-pressed',String(state.completed[id]));
      const item=$$('.step-item')[index];item.classList.toggle('done',!!state.completed[id]);$('b',item).textContent=state.completed[id]?'✓':String(index+1);
    };
    if(s.widget)mountWidget(s.widget,id);
    const form=$('[data-quiz]');
    if(form)form.onsubmit=e=>{
      e.preventDefault();const chosen=$('input:checked',form),out=$('.quiz-feedback',form);
      if(!chosen){out.innerHTML='<div class="feedback">Wähle zuerst eine Antwort aus.</div>';return;}
      const value=Number(chosen.value);state.quiz[id]=value;save();const correct=value===s.quiz.answer;
      out.innerHTML=`<div class="feedback ${correct?'correct':''}"><strong>${correct?'Richtig.':'Schau noch einmal genau hin.'}</strong> ${esc(s.quiz.explanation)}${correct?'':' Du kannst eine andere Antwort wählen und erneut prüfen.'}</div>`;
    };
    bindAnswers();bindCopy();
  }
  function bindAnswers() {
    $$('[data-answer]').forEach(el=>{
      if(el.tagName!=='TEXTAREA'&&state.answers[el.dataset.answer]!==undefined)el.value=state.answers[el.dataset.answer];
      el.addEventListener('input',()=>{state.answers[el.dataset.answer]=el.value;save();});
    });
  }
  function bindCopy() {
    $$('.copy-code').forEach(b=>b.onclick=async()=>{
      const text=$('pre code',b.closest('.code-block')).textContent;
      try {await navigator.clipboard.writeText(text);toast('Code kopiert.');}
      catch {
        const temp=document.createElement('textarea');temp.value=text;temp.style.position='fixed';temp.style.opacity='0';document.body.appendChild(temp);temp.select();
        const ok=document.execCommand('copy');temp.remove();toast(ok?'Code kopiert.':'Bitte markiere den Code und kopiere ihn mit deiner Tastatur.');
      }
    });
  }
  function material() {
    active=null;nav(null);
    $('#main').innerHTML=`<div class="eyebrow">Deine Unterlagen</div><h1>Arbeitsblätter und Folien</h1><p class="intro">Öffne ein PDF zum Nachlesen oder speichere es zum Ausdrucken. Die Erklärungen, Hilfen und Vergleichslösungen findest du im Lernpfad.</p><div class="materials-list">${MATERIALS.map(m=>`<article class="material-card"><span class="file-type">${esc(m.type)}</span><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><div class="button-row"><a class="button small" href="material/${m.file}" target="_blank" rel="noopener">PDF öffnen</a><a class="button small secondary" href="material/${m.file}" download>Herunterladen</a></div></article>`).join('')}</div><section class="source-note"><h2>Hinweise zu deinen Unterlagen</h2><p>Die Texte und Abbildungen stammen aus den bereitgestellten Unterrichtsmaterialien. Motor- und Getriebegrundlagen sowie die Versuchsführung bei Seifenblasen ergänzen den Lernbedarf aus den Folien.</p><p>Die Arduino-Beispiele gelten für den <strong>Uno R3</strong>. Im Lernpfad findest du Präzisierungen zum Taster, zu PWM, zur Servoversorgung und zu den auffälligen Statik-Messwerten. Vergleiche bei abweichenden Boards und Bauteilen die jeweilige Dokumentation.</p><h3>Zum Nachschlagen</h3><ul><li><a href="https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/" target="_blank" rel="noopener">Arduino: Taster mit internem Pullup</a></li><li><a href="https://support.arduino.cc/hc/en-us/articles/9350537961500-Use-PWM-output-with-Arduino" target="_blank" rel="noopener">Arduino: PWM-Ausgänge</a></li><li><a href="https://docs.arduino.cc/libraries/servo/" target="_blank" rel="noopener">Arduino: Servo-Bibliothek</a></li><li><a href="https://docs.arduino.cc/learn/electronics/servo-motors/" target="_blank" rel="noopener">Arduino: Servoversorgung und Anschluss</a></li><li><a href="https://docs.arduino.cc/learn/electronics/transistor-motor-control/" target="_blank" rel="noopener">Arduino: Transistor und DC-Motor</a></li></ul><p class="helper-note">Externe Seiten öffnen sich erst, wenn du einen Link anklickst. Die Website lädt keine externen Videos, Schriften oder Analyseprogramme.</p></section>`;
  }
  function extraEntries(m,s) {
    const id=stepKey(m,s),list=[];
    if(s.widget==='flow') ['Batterie versorgt Motor','Taster meldet Zustand an Arduino','Behälter liefert Seifenlösung an Ring','Motor treibt ein Getriebe an','Sensor meldet Temperatur an Steuerung','Pumpe fördert Abwasser'].forEach((label,i)=>list.push({label:`Strom zuordnen: ${label}`,id:`${id}-flow-${i}`}));
    if(s.widget==='commands')COMMANDS.forEach((row,i)=>list.push({label:`Befehlsübersicht ${i+1}: ${row[row[2]==='command'?1:0]}`,id:`${id}-command-${i}`}));
    if(s.widget==='means-length'||s.widget==='means-area') {
      const labels=s.widget==='means-length'?['10 cm','20 cm','30 cm','40 cm']:['einfach','zweifach','dreifach','vierfach'];
      labels.forEach((x,i)=>list.push({label:`Mittelwert ${x} (N)`,id:`${id}-mean-${i}`}));
    }
    if(s.widget==='project-test') {
      ['Versuch 1','Versuch 2','Versuch 3'].forEach((x,i)=>{
        [['time','Erzeugungszeit in s'],['diameter','Durchmesser in cm'],['flight','Schwebezeit in s']].forEach(([k,label])=>list.push({label:`${x}: ${label}`,id:`${id}-test-${i}-${k}`}));
        list.push({label:`${x}: Start durch Tastendruck`,id:`${id}-test-${i}-button`});
      });
    }
    return list;
  }
  function notebookEntries() {
    return COURSE.map(m=>({module:m,entries:m.steps.flatMap(s=>[...s.fields.map(f=>({label:`${s.title} · ${f.label}`,id:answerKey(m,s,f)})),...extraEntries(m,s)])}));
  }
  function notebook() {
    active=null;nav(null);const groups=notebookEntries(),answered=Object.values(state.answers).filter(x=>String(x).trim()).length;
    $('#main').innerHTML=`<div class="notebook-top"><div><div class="eyebrow">Deine Ergebnisse</div><h1>Mein Lernheft</h1><p class="intro">${answered} ausgefüllte Antwortfelder. Deine Antworten werden nur in diesem Browser gespeichert. Lade sie für die Abgabe herunter oder drucke sie als PDF.</p></div><div class="button-row"><button class="button" id="download-notes">Lernheft herunterladen</button><button class="button secondary" id="print-notes">Drucken / PDF</button></div></div>${answered?groups.filter(g=>g.entries.some(x=>String(state.answers[x.id]||'').trim())).map(g=>`<section class="notebook-section"><h2>${g.module.number} · ${esc(g.module.title)}</h2>${g.entries.filter(x=>String(state.answers[x.id]||'').trim()).map(x=>`<div class="notebook-label">${esc(x.label)}</div><div class="notebook-answer">${esc(state.answers[x.id])}</div>`).join('')}</section>`).join(''):'<div class="empty-state"><p>Dein Lernheft ist noch leer. Wenn du im Lernpfad Antworten eingibst, erscheinen sie hier.</p><a href="'+esc(state.lastRoute)+'">Zum Lernpfad</a></div>'}<div class="reset-area"><details><summary>Gespeicherte Antworten und Fortschritt löschen</summary><p>Sichere dein Lernheft zuerst. Auf gemeinsam benutzten Geräten kann danach die nächste Person mit einem leeren Lernpfad starten.</p><button class="button secondary" id="reset-data">Alles auf diesem Gerät zurücksetzen</button></details></div>`;
    $('#download-notes').onclick=()=>{
      const lines=['NwT Klasse 9 · Seifenblasenmaschine','Mein Lernheft',`Export: ${new Date().toLocaleString('de-DE')}`,''];
      groups.forEach(g=>{
        const entries=g.entries.filter(x=>String(state.answers[x.id]||'').trim());if(!entries.length)return;
        lines.push(`${g.module.number} ${g.module.title}`,'='.repeat(35),'');
        entries.forEach(x=>lines.push(x.label,String(state.answers[x.id]),''));
      });
      if(!answered)lines.push('Noch keine Antworten eingetragen.');
      download('NwT9_Lernheft.txt',lines.join('\n'),'text/plain;charset=utf-8');
    };
    $('#print-notes').onclick=()=>window.print();
    $('#reset-data').onclick=()=>{
      if(!window.confirm('Alle Antworten und Lernfortschritte auf diesem Gerät löschen? Sichere vorher dein Lernheft.'))return;
      state=fresh();save();notebook();toast('Der Lernpfad wurde zurückgesetzt.');
    };
  }
  function download(name,content,type) {
    const url=URL.createObjectURL(new Blob(['\ufeff',content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
  function widgetShell(title,body) {return `<section class="widget"><h3>${title}</h3>${body}</section>`;}
  function decimal(value) {const s=String(value).trim().replace(',','.');return s===''?NaN:Number(s);}
  function nfmt(n,d=2) {return n.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});}
  function mountWidget(type,id) {
    const root=$('#lesson-widget');
    if(type==='flow') {
      const cases=[['Batterie versorgt Motor','Energie'],['Taster meldet Zustand an Arduino','Information'],['Behälter liefert Seifenlösung an Ring','Stoff'],['Motor treibt ein Getriebe an','Energie'],['Sensor meldet Temperatur an Steuerung','Information'],['Pumpe fördert Abwasser','Stoff']];
      root.innerHTML=widgetShell('Ströme zuordnen',cases.map((x,i)=>`<div class="field"><label for="flow-${i}">${esc(x[0])}</label><select id="flow-${i}" data-answer="${id}-flow-${i}"><option value="">Wähle einen Strom …</option>${['Energie','Stoff','Information'].map(y=>`<option>${y}</option>`).join('')}</select></div>`).join('')+'<button class="button small" id="check-flows">Zuordnung prüfen</button><div id="flow-feedback" role="status"></div>');
      $('#check-flows').onclick=()=>{
        const values=cases.map((x,i)=>$(`#flow-${i}`).value),correct=values.filter((v,i)=>v===cases[i][1]).length;
        $('#flow-feedback').innerHTML=`<div class="feedback ${correct===cases.length?'correct':''}">${correct} von ${cases.length} richtig. ${cases.filter((x,i)=>values[i]!==x[1]).map(x=>esc(`${x[0]}: ${x[1]}.`)).join(' ')} Du kannst deine Zuordnung ändern und erneut prüfen.</div>`;
      };
    }
    if(type==='button') {
      root.innerHTML=widgetShell('Tastermodell',`<p class="helper-note">Klicke zum Umschalten zwischen gedrückt und losgelassen.</p><div class="state-box"><div><span>digitalRead(2)</span><strong class="state-value" id="button-value">HIGH · 1</strong></div><button class="button" id="sim-button" aria-pressed="false">Taster drücken</button></div><p class="helper-note" id="button-meaning">Nicht gedrückt: Der interne Pullup hält den Eingang auf HIGH.</p>`);
      let pressed=false;$('#sim-button').onclick=()=>{pressed=!pressed;$('#button-value').textContent=pressed?'LOW · 0':'HIGH · 1';$('#sim-button').textContent=pressed?'Taster loslassen':'Taster drücken';$('#sim-button').setAttribute('aria-pressed',String(pressed));$('#button-meaning').textContent=pressed?'Gedrückt: Der Taster verbindet den Eingang mit GND.':'Nicht gedrückt: Der interne Pullup hält den Eingang auf HIGH.';};
    }
    if(type==='pwm') {
      root.innerHTML=widgetShell('PWM selbst verändern',`<label for="pwm-range">PWM-Wert: <output id="pwm-value">128</output></label><input id="pwm-range" type="range" min="0" max="255" value="128"><div class="sim-result"><strong id="pwm-duty"></strong><p id="pwm-code"></p><svg id="pwm-chart" viewBox="0 0 600 190" role="img" aria-label="Zeitdiagramm des PWM-Signals"></svg></div><p class="helper-note">Das Diagramm zeigt ein vergrößertes Zeitmodell. Die echte Schaltfolge ist viel schneller. Vier Perioden sind dargestellt.</p>`);
      const update=()=>{
        const value=Number($('#pwm-range').value),duty=value/255;$('#pwm-value').value=String(value);$('#pwm-duty').textContent=`${nfmt(duty*100,1)} % Einschaltzeit`;$('#pwm-code').textContent=`analogWrite(5, ${value});`;
        let points='60,145';for(let i=0;i<4;i++){const x=60+i*125,w=125*duty;if(value===0){points+=` ${x+125},145`;}else if(value===255){points+=` ${x},45 ${x+125},45`;}else{points+=` ${x},45 ${x+w},45 ${x+w},145 ${x+125},145`;}}
        $('#pwm-chart').innerHTML=`<path d="M60 25V155H570" fill="none" stroke="#76859b"/><text x="10" y="49" font-size="16" fill="#54647a">5 V</text><text x="10" y="149" font-size="16" fill="#54647a">0 V</text><text x="495" y="181" font-size="16" fill="#54647a">Zeit</text>${[1,2,3,4].map(i=>`<path d="M${60+i*125} 25V155" stroke="#e0e5ee"/>`).join('')}<polyline points="${points}" fill="none" stroke="#00796f" stroke-width="3"/>`;
      };$('#pwm-range').oninput=update;update();
    }
    if(type==='lamp') {
      root.innerHTML=widgetShell('Den Zustandswechsel ausprobieren',`<div class="state-box"><div><span>Aktuelle Stufe</span><strong class="state-value" id="lamp-stufe">0 · aus</strong><span id="lamp-pwm">PWM: 0</span></div><button class="button" id="lamp-button">Einmal drücken</button></div><p class="helper-note">Dieses Modell zählt pro Klick einen neuen Druck. Es steuert keine echte Hardware.</p>`);
      let value=0;$('#lamp-button').onclick=()=>{value=(value+1)%3;$('#lamp-stufe').textContent=`${value} · ${['aus','hell','sehr hell'][value]}`;$('#lamp-pwm').textContent=`PWM: ${[0,128,255][value]}`;};
    }
    if(type==='servo') {
      root.innerHTML=widgetShell('LED-Stufe und Zeiger koppeln',`<label for="servo-stage">Lampenstufe</label><select id="servo-stage"><option value="0">aus · PWM 0</option><option value="1">hell · PWM 128</option><option value="2">sehr hell · PWM 255</option></select><svg id="servo-chart" viewBox="0 0 440 235" role="img" aria-label="Zeigerstellung zur Lampenstufe"></svg><p class="helper-note" id="servo-code"></p>`);
      const update=()=>{const stage=Number($('#servo-stage').value),degrees=[40,90,140][stage],rad=degrees*Math.PI/180,x=220+140*Math.cos(rad),y=205-140*Math.sin(rad);$('#servo-code').textContent=`anzeige.write(${degrees}); · ${['aus','hell','sehr hell'][stage]}`;$('#servo-chart').innerHTML=`<path d="M60 205A160 160 0 0 1 380 205" fill="none" stroke="#dce3ee" stroke-width="2"/>${[40,90,140].map((d,i)=>{const r=d*Math.PI/180,tx=220+174*Math.cos(r),ty=205-174*Math.sin(r);return `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="17" fill="#54647a">${d}°</text>`;}).join('')}<path d="M220 205L${x} ${y}" stroke="#00796f" stroke-width="5" stroke-linecap="round"/><circle cx="220" cy="205" r="7" fill="#111f3a"/>`;};$('#servo-stage').onchange=update;update();
    }
    if(type==='commands') {
      root.innerHTML=widgetShell('Befehlsübersicht zum Ausfüllen',`<div class="table-wrap"><table><thead><tr><th scope="col">Arduino-Befehl</th><th scope="col">Erklärung</th></tr></thead><tbody>${COMMANDS.map((row,i)=>`<tr><td>${row[2]==='command'?`<input class="command-input" aria-label="Fehlender Befehl in Zeile ${i+1}" data-answer="${id}-command-${i}" spellcheck="false">`:`<code>${esc(row[0])}</code>`}</td><td>${row[2]==='explanation'?`<input class="command-input" aria-label="Fehlende Erklärung in Zeile ${i+1}" data-answer="${id}-command-${i}">`:esc(row[1])}<span class="command-result" id="command-result-${i}" hidden></span></td></tr>`).join('')}</tbody></table></div><button class="button small secondary" id="compare-commands">Mit der Musterlösung vergleichen</button><p class="helper-note">Deine Antworten werden gespeichert. Der Vergleich zeigt passende Formulierungen; eigene Erklärungen können ebenso richtig sein.</p>`);
      $('#compare-commands').onclick=()=>COMMANDS.forEach((row,i)=>{const result=$(`#command-result-${i}`);result.hidden=false;result.textContent=`Vergleich: ${row[row[2]==='command'?0:1]}`;});
    }
    if(type==='means-length'||type==='means-area') {
      const isLength=type==='means-length',rows=isLength?[[10,7.18,9.5,6.99],[20,8.42,6.4,6.8],[30,8.2,7,7.95],[40,8.4,7.6,8.4]]:[[1,9.5,10.2,1],[2,19.5,20.3,20.1],[3,27,265,27.5],[4,29.5,30.2,30]];
      root.innerHTML=widgetShell('Mittelwerte berechnen und prüfen',`<div class="table-wrap"><table><thead><tr><th scope="col">${isLength?'Länge in cm':'Fadenzahl'}</th><th scope="col">F₁ / N</th><th scope="col">F₂ / N</th><th scope="col">F₃ / N</th><th scope="col">Mittelwert / N</th></tr></thead><tbody>${rows.map((row,i)=>`<tr><td>${row[0]}</td>${row.slice(1).map(v=>`<td>${nfmt(v,v%1?2:1)}</td>`).join('')}<td><input class="mean-input" aria-label="Mittelwert für ${isLength?row[0]+' cm':row[0]+' Fäden'} in N" data-answer="${id}-mean-${i}" inputmode="decimal"></td></tr>`).join('')}</tbody></table></div><div class="button-row"><button class="button small" id="check-means">Mittelwerte prüfen</button><button class="button small secondary" id="show-diagram">Diagramm vergleichen</button></div><div class="mean-result" id="mean-feedback" role="status"></div><div class="diagram-result" id="mean-diagram" hidden></div><p class="helper-note">Zeichne zuerst selbst auf Papier. Der Vergleich verwendet die Mittelwerte der angegebenen Originaldaten.</p>`);
      $('#check-means').onclick=()=>{
        const correct=rows.map((row,i)=>Math.abs(decimal($(`[data-answer="${id}-mean-${i}"]`).value)-(row[1]+row[2]+row[3])/3)<=.015),out=$('#mean-feedback');
        out.innerHTML=`<div class="feedback ${correct.every(Boolean)?'correct':''}">${correct.filter(Boolean).length} von 4 Mittelwerten stimmen auf zwei Nachkommastellen. ${correct.map((ok,i)=>ok?'':`${isLength?rows[i][0]+' cm':rows[i][0]+'-fach'}: Summe der drei Kräfte durch 3 teilen.`).filter(Boolean).join(' ')}${!isLength?' Die auffälligen Originalwerte bleiben für diese Rechnung unverändert.':''}</div>`;
      };
      $('#show-diagram').onclick=()=>{
        const result=$('#mean-diagram');result.hidden=!result.hidden;$('#show-diagram').textContent=result.hidden?'Diagramm vergleichen':'Diagramm ausblenden';
        if(!result.hidden)result.innerHTML=pointChart(rows.map(r=>[r[0],(r[1]+r[2]+r[3])/3]),isLength?'Länge / cm':'Fadenzahl',isLength?10:120,isLength?40:4)+`<p class="helper-note">${isLength?'Die Punkte liegen ungefähr auf einer Höhe. Eine waagerechte Ausgleichslinie wäre hier eine mögliche Darstellung.':'Die dritte Reihe wird vom auffälligen Wert 265 N dominiert. Eine Ausgleichslinie wäre vor der Datenprüfung irreführend.'}</p>`;
      };
    }
    if(type==='gear') {
      root.innerHTML=widgetShell('Übersetzung berechnen',`<div class="control-pair"><div><label for="gear-in">Zähne am Antriebsrad</label><input id="gear-in" type="range" min="10" max="60" step="5" value="10"><output id="gear-in-value">10</output></div><div><label for="gear-out">Zähne am Abtriebsrad</label><input id="gear-out" type="range" min="10" max="60" step="5" value="30"><output id="gear-out-value">30</output></div></div><label for="gear-speed">Eingangsdrehzahl: <output id="gear-speed-value">120 U/min</output></label><input id="gear-speed" type="range" min="10" max="300" step="10" value="120"><div class="sim-result" id="gear-result" role="status"></div>`);
      const update=()=>{const a=Number($('#gear-in').value),b=Number($('#gear-out').value),n=Number($('#gear-speed').value),out=n*a/b;$('#gear-in-value').value=a;$('#gear-out-value').value=b;$('#gear-speed-value').value=`${n} U/min`;$('#gear-result').textContent=`Ausgang: ${n} · ${a} / ${b} = ${nfmt(out,1)} U/min. Eine Umdrehung dauert ${nfmt(60/out,2)} s.`;};['gear-in','gear-out','gear-speed'].forEach(x=>$(`#${x}`).oninput=update);update();
    }
    if(type==='beam') {
      root.innerHTML=widgetShell('Das Balkenmodell vergleichen',`<p class="helper-note">Material, Last und Auflagerung bleiben gleich. Alle Werte beziehen sich auf einen Ausgangsbalken mit Faktor 1.</p>${[['length','Spannweite l'],['width','Breite b'],['height','Höhe h']].map(([x,label])=>`<label for="beam-${x}">${label}: <output id="beam-${x}-value">1,00 ×</output></label><input id="beam-${x}" type="range" min="0.5" max="2" step="0.1" value="1">`).join('')}<div class="sim-result" id="beam-result" role="status"></div>`);
      const update=()=>{const l=Number($('#beam-length').value),b=Number($('#beam-width').value),h=Number($('#beam-height').value),ratio=l**3/(b*h**3);['length','width','height'].forEach(x=>$(`#beam-${x}-value`).value=`${nfmt(Number($(`#beam-${x}`).value))} ×`);$('#beam-result').textContent=`Relative Durchbiegung: ${nfmt(ratio)} ×. ${ratio>1.005?'Mehr':ratio<.995?'Weniger':'Gleiche'} Durchbiegung als beim Ausgangsbalken.`;};['length','width','height'].forEach(x=>$(`#beam-${x}`).oninput=update);update();
    }
    if(type==='project-test') {
      root.innerHTML=widgetShell('Drei Gesamttests dokumentieren',`<div class="table-wrap"><table class="test-table"><thead><tr><th>Versuch</th><th>Start per Taster?</th><th>Erzeugung / s</th><th>Durchmesser / cm</th><th>Schweben / s</th></tr></thead><tbody>${[0,1,2].map(i=>`<tr><td>${i+1}</td><td><select aria-label="Versuch ${i+1}: Start durch Taster" data-answer="${id}-test-${i}-button"><option value="">Auswählen</option><option value="ja">Ja</option><option value="nein">Nein</option></select></td>${[['time','Erzeugungszeit'],['diameter','Durchmesser'],['flight','Schwebezeit']].map(([k,label])=>`<td><input inputmode="decimal" aria-label="Versuch ${i+1}: ${label}" data-answer="${id}-test-${i}-${k}"></td>`).join('')}</tr>`).join('')}</tbody></table></div><button class="button small" id="check-project">Kriterien prüfen</button><div id="project-feedback" role="status"></div>`);
      $('#check-project').onclick=()=>{
        $('#project-feedback').innerHTML=[0,1,2].map(i=>{
          const get=k=>$(`[data-answer="${id}-test-${i}-${k}"]`).value,t=decimal(get('time')),d=decimal(get('diameter')),f=decimal(get('flight')),button=get('button');
          if(!button||![t,d,f].every(Number.isFinite))return `<div class="feedback">Versuch ${i+1}: Trage zuerst alle Angaben ein.</div>`;
          if(t<0||d<=0||f<0)return `<div class="feedback">Versuch ${i+1}: Prüfe deine Werte. Zeiten dürfen nicht negativ sein; der Durchmesser muss größer als 0 sein.</div>`;
          const issues=[];if(button!=='ja')issues.push('Start durch Tastendruck fehlt');if(t>15)issues.push('Erzeugung dauert länger als 15 s');if(d<7)issues.push('Durchmesser kleiner als 7 cm');if(f<8)issues.push('Schwebezeit kürzer als 8 s');
          return `<div class="feedback ${issues.length?'':'correct'}"><strong>Versuch ${i+1}:</strong> ${issues.length?issues.join('; ')+'.':'Alle Projektkriterien erfüllt.'}</div>`;
        }).join('');
      };
    }
  }
  function pointChart(points,xlabel,ymax,xmax) {
    const x=v=>65+v/xmax*470,y=v=>240-v/ymax*200;
    return `<svg viewBox="0 0 600 305" role="img" aria-label="Mittlere Reißkraft in Newton in Abhängigkeit von ${esc(xlabel)}">${[0,1,2,3,4,5].map(i=>{const py=240-i*40;return `<path d="M65 ${py}H550" stroke="#dce3ee"/><text x="54" y="${py+5}" text-anchor="end" font-size="15" fill="#54647a">${nfmt(ymax*i/5,0)}</text>`;}).join('')}<path d="M65 25V240H555" fill="none" stroke="#536680" stroke-width="2"/><text x="68" y="18" font-size="16" fill="#142440">mittlere Reißkraft / N</text><text x="415" y="295" font-size="16" fill="#142440">${esc(xlabel)}</text>${points.map(([a,b])=>`<path d="M${x(a)} 240v7" stroke="#536680"/><text x="${x(a)}" y="270" text-anchor="middle" font-size="16" fill="#54647a">${a}</text><circle cx="${x(a)}" cy="${y(b)}" r="5" fill="#00796f"><title>${a}: ${nfmt(b)} N</title></circle>`).join('')}</svg>`;
  }
  function render(focus=true) {
    if(location.hash && !location.hash.startsWith('#/'))return;
    const parts=(location.hash||state.lastRoute).replace(/^#\//,'').split('/');const view=parts[0];
    $$('.topbar nav a').forEach(a=>a.classList.toggle('current',view==='material'?a.hash==='#/material':view==='heft'?a.hash==='#/heft':a.id==='learn-link'));
    if(view==='material') {document.title='Material · NwT Lernlabor';material();}
    else if(view==='heft') {document.title='Mein Lernheft · NwT Lernlabor';notebook();}
    else {
      const m=COURSE.find(x=>x.id===parts[1])||COURSE[0];let index=Number(parts[2]||0);if(!Number.isInteger(index)||index<0||index>=m.steps.length)index=0;
      document.title=`${m.title} · NwT Lernlabor`;lesson(m,index);
    }
    $('#sidebar').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');
    if(focus){window.scrollTo(0,0);$('#main').focus({preventScroll:true});}
  }
  $('#menu-toggle').onclick=()=>{const opened=$('#sidebar').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(opened));};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}});
  window.addEventListener('hashchange',()=>render());
  if(!location.hash)history.replaceState(null,'',state.lastRoute);
  render(false);
})();
