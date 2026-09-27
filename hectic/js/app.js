/**
 * Main APAC-Resilience AI Application Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Initialize Leaflet Map
  if (window.MapController) {
    window.MapController.initMap('leaflet-map');
  }

  // 2. Initialize Analytics Charts
  if (window.AnalyticsEngine) {
    window.AnalyticsEngine.initCharts();
  }

  // 3. Right Panel Tab Switcher
  const tabBtns = document.querySelectorAll('.panel-tabs .tab-btn');
  const panelPanes = document.querySelectorAll('.panel-body .panel-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panelPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 4. Timeline Slider Scrubber
  const timelineSlider = document.getElementById('timeline-slider');
  const timelineHoursVal = document.getElementById('timeline-hours-val');
  const alertStatusText = document.getElementById('alert-status-text');
  let autoPlayTimer = null;

  if (timelineSlider) {
    timelineSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      const leadTimeHours = 72 - val; // 72h down to 0h
      
      if (leadTimeHours === 0) {
        timelineHoursVal.textContent = "Landfall (T - 0h)";
        alertStatusText.textContent = "CRITICAL LANDFALL IN PROGRESS";
      } else if (leadTimeHours < 0) {
        timelineHoursVal.textContent = `T + ${Math.abs(leadTimeHours)}h (Post-Landfall)`;
        alertStatusText.textContent = "POST-LANDFALL RECOVERY PROTOCOL";
      } else {
        timelineHoursVal.textContent = `T - ${leadTimeHours} Hours`;
        if (leadTimeHours <= 24) alertStatusText.textContent = `TRIGGER READY: T - ${leadTimeHours} HOURS`;
        else alertStatusText.textContent = `ANTICIPATORY WATCH: T - ${leadTimeHours} HOURS`;
      }

      if (window.MapController) {
        window.MapController.updateTimelinePosition(leadTimeHours);
      }

      if (window.AnalyticsEngine) {
        const currentSurge = parseFloat((1.5 + (72 - leadTimeHours) * 0.045).toFixed(2));
        window.AnalyticsEngine.updateChartsWithSimulation(currentSurge, 195);
      }
    });
  }

  // Auto Play button for timeline
  const btnPlay = document.getElementById('btn-scrub-play');
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btnPlay.textContent = "▶ Auto Play";
      } else {
        btnPlay.textContent = "⏸ Pause";
        autoPlayTimer = setInterval(() => {
          let curr = parseInt(timelineSlider.value);
          if (curr >= 72) {
            timelineSlider.value = 0;
          } else {
            timelineSlider.value = curr + 1;
          }
          timelineSlider.dispatchEvent(new Event('input'));
        }, 300);
      }
    });
  }

  const btnReset = document.getElementById('btn-scrub-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btnPlay.textContent = "▶ Auto Play";
      }
      timelineSlider.value = 0;
      timelineSlider.dispatchEvent(new Event('input'));
    });
  }

  // 5. Cyclone Preset Selector
  const presetSelect = document.getElementById('cyclone-preset-select');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (window.MapController) {
        window.MapController.loadCyclonePreset(selected);
        const p = window.MapController.CYCLONE_PRESETS[selected];
        if (p) {
          document.getElementById('hud-cyclone-name').textContent = `🌀 ${p.name}`;
          document.getElementById('hud-top-wind').textContent = `${p.wind_speed_kmh} km/h`;
          document.getElementById('hud-top-surge').textContent = `${p.surge_m}m`;
          document.getElementById('hud-pressure').textContent = `${p.pressure_hpa} hPa`;
          document.getElementById('hud-surge-depth').textContent = `${p.surge_m} meters`;
        }
      }
    });
  }

  // 6. Map Layer Toggle Checkboxes
  const chkGoogleMaps = document.getElementById('chk-google-maps');
  const chkSatTiles = document.getElementById('chk-sat-tiles');
  const chkDarkTiles = document.getElementById('chk-dark-tiles');

  function updateBaseMapSelection(selectedLayer) {
    if (chkGoogleMaps) chkGoogleMaps.checked = selectedLayer === 'google';
    if (chkSatTiles) chkSatTiles.checked = selectedLayer === 'satellite';
    if (chkDarkTiles) chkDarkTiles.checked = selectedLayer === 'dark';
    if (window.MapController) {
      window.MapController.setMapLayer(selectedLayer);
    }
  }

  if (chkGoogleMaps) {
    chkGoogleMaps.addEventListener('change', (e) => {
      if (e.target.checked) updateBaseMapSelection('google');
      else updateBaseMapSelection('dark');
    });
  }

  if (chkSatTiles) {
    chkSatTiles.addEventListener('change', (e) => {
      if (e.target.checked) updateBaseMapSelection('satellite');
      else updateBaseMapSelection('google');
    });
  }

  if (chkDarkTiles) {
    chkDarkTiles.addEventListener('change', (e) => {
      if (e.target.checked) updateBaseMapSelection('dark');
      else updateBaseMapSelection('google');
    });
  }

  // 7. Advisory Generator Buttons
  const btnGenAdvisory = document.getElementById('btn-generate-advisory');
  const advisoryBox = document.getElementById('advisory-display-box');

  if (btnGenAdvisory && advisoryBox) {
    btnGenAdvisory.addEventListener('click', async () => {
      const language = document.getElementById('select-language').value;
      const audience = document.getElementById('select-audience').value;

      advisoryBox.textContent = "⚡ Ingesting GEE Sentinel-1 SAR & Querying Gemini 3.7 Flash AI...";
      
      const res = await window.AdvisoryGenerator.generateAdvisory({
        language: language,
        audience: audience
      });

      advisoryBox.innerHTML = res.advisory ? res.advisory.replace(/\n/g, '<br>') : "Error generating advisory.";
    });
  }

  const btnSpeak = document.getElementById('btn-speak-advisory');
  if (btnSpeak) {
    btnSpeak.addEventListener('click', () => {
      const text = advisoryBox.innerText || advisoryBox.textContent;
      const language = document.getElementById('select-language').value;
      window.AdvisoryGenerator.speakAdvisoryText(text, language);
    });
  }

  const btnExport = document.getElementById('btn-export-advisory');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.AdvisoryGenerator.exportAdvisoryText();
    });
  }

  // 8. Parametric Payout Buttons
  const btnEvalParametric = document.getElementById('btn-eval-parametric');
  const paramResultBox = document.getElementById('parametric-result-box');

  if (btnEvalParametric && paramResultBox) {
    btnEvalParametric.addEventListener('click', async () => {
      const currentSurge = parseFloat(document.getElementById('hud-top-surge').textContent) || 4.2;
      const currentWind = parseInt(document.getElementById('hud-top-wind').textContent) || 195;

      const res = await window.ParametricEngine.evaluateTrigger(currentSurge, currentWind);
      paramResultBox.style.display = 'block';

      if (res.parametric_triggered) {
        document.getElementById('param-result-title').textContent = "PARAMETRIC TRIGGER EXECUTED";
        document.getElementById('param-result-title').style.color = "#34d399";
        document.getElementById('param-result-desc').innerHTML = `Reason: ${res.trigger_reason}<br>Total Approved Payout: <b>$${(res.total_disbursement_usd).toLocaleString()} USD</b>`;
      } else {
        document.getElementById('param-result-title').textContent = "TRIGGER THRESHOLD NOT MET";
        document.getElementById('param-result-title').style.color = "#fbbf24";
        document.getElementById('param-result-desc').textContent = res.trigger_reason;
      }
    });
  }

  const btnExecuteDisbursement = document.getElementById('btn-execute-disbursement');
  const txnLogContainer = document.getElementById('txn-log-container');

  if (btnExecuteDisbursement && txnLogContainer) {
    btnExecuteDisbursement.addEventListener('click', () => {
      const breakdown = [
        { category: "Smallholder Paddy Farmers", households: 12400, payout_per_hh: 120, total_usd: 1488000, channel: "bKash / Mobile Wallet" },
        { category: "Artisanal Coastal Fishers", households: 8200, payout_per_hh: 150, total_usd: 1230000, channel: "Nagad / Direct Transfer" },
        { category: "Salt Pan Workers", households: 4500, payout_per_hh: 100, total_usd: 450000, channel: "UPI / APB System" },
        { category: "Female-Headed Vulnerable HHs", households: 6100, payout_per_hh: 180, total_usd: 1098000, channel: "Direct Cash Mobile Transfer" }
      ];

      const newTxns = window.ParametricEngine.executeInstantDisbursement(breakdown);
      
      let html = "";
      newTxns.forEach(t => {
        html += `<div style="margin-bottom:0.3rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.2rem;">` +
                `<span style="color:#10b981;">[${t.timestamp}]</span> <b>${t.category}</b> - $${t.amount_usd.toLocaleString()}<br>` +
                `<span style="color:var(--text-dim);">Hash: ${t.hash} (${t.channel})</span>` +
                `</div>`;
      });
      txnLogContainer.innerHTML = html;
      alert(`🚀 Disbursed $4,266,000 USD to 31,200 households across 4 mobile money channels in pre-landfall state!`);
    });
  }

  // 9. Gemini 3.7 Flash Copilot Chat
  const copilotInput = document.getElementById('copilot-input');
  const btnSendCopilot = document.getElementById('btn-send-copilot');
  const copilotChatBox = document.getElementById('copilot-chat-box');

  if (btnSendCopilot && copilotInput && copilotChatBox) {
    const handleCopilotSend = async () => {
      const query = copilotInput.value.trim();
      if (!query) return;

      // Append user msg
      const userDiv = document.createElement('div');
      userDiv.style.color = '#ffffff';
      userDiv.style.marginTop = '0.5rem';
      userDiv.innerHTML = `<b>You:</b> ${query}`;
      copilotChatBox.appendChild(userDiv);

      copilotInput.value = '';
      copilotChatBox.scrollTop = copilotChatBox.scrollHeight;

      // Thinking indicator
      const aiDiv = document.createElement('div');
      aiDiv.style.color = 'var(--primary-cyan)';
      aiDiv.style.marginTop = '0.4rem';
      aiDiv.innerHTML = `<b>🤖 Gemini 3.7 Flash:</b> Thinking...`;
      copilotChatBox.appendChild(aiDiv);
      copilotChatBox.scrollTop = copilotChatBox.scrollHeight;

      const res = await window.AdvisoryGenerator.generateAdvisory({
        customPrompt: query,
        language: 'English',
        audience: 'General'
      });

      aiDiv.innerHTML = `<b>🤖 Gemini 3.7 Flash:</b> ${res.advisory.replace(/\n/g, '<br>')}`;
      copilotChatBox.scrollTop = copilotChatBox.scrollHeight;
    };

    btnSendCopilot.addEventListener('click', handleCopilotSend);
    copilotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCopilotSend();
    });
  }

});
