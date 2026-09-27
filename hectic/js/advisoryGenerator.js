/**
 * Gemini 3.7 Flash Multi-Lingual Early Warning Advisory Engine
 * APAC-Resilience AI Platform - Bay of Bengal
 */

window.AdvisoryGenerator = (function() {
  'use strict';

  let currentAdvisoryText = "";

  async function generateAdvisory(params) {
    const language = params.language || 'English';
    const audience = params.audience || 'Coastal Communities';
    const customPrompt = params.customPrompt || '';
    const cycloneData = params.cycloneData || {
      name: "Super Cyclone Bay-26X",
      wind_speed_kmh: 195,
      surge_height_m: 4.2,
      lead_time_hours: 24,
      landfall_target: "Cox's Bazar & Sundarbans Estuary"
    };

    const payload = {
      prompt: customPrompt || `Generate an urgent anticipatory action advisory for ${audience} in ${language}.`,
      language: language,
      audience: audience,
      cyclone_data: cycloneData
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      currentAdvisoryText = data.advisory || "Error generating advisory.";
      return data;
    } catch (err) {
      console.warn("API request failed, using client-side fallback logic:", err);
      const fallbackText = getClientFallbackAdvisory(language, audience, cycloneData);
      currentAdvisoryText = fallbackText;
      return {
        status: "success",
        model: "Gemini 3.7 Flash (Client Fallback)",
        advisory: fallbackText
      };
    }
  }

  function speakAdvisoryText(text, language) {
    if (!('speechSynthesis' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    
    // Set voice language code
    if (language === 'Bengali') utterance.lang = 'bn-BD';
    else if (language === 'Odia') utterance.lang = 'or-IN';
    else if (language === 'Hindi') utterance.lang = 'hi-IN';
    else if (language === 'Burmese') utterance.lang = 'my-MM';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  function getClientFallbackAdvisory(language, audience, cyclone) {
    if (language === 'Bengali') {
      return `🚨 **জরুরি পূর্বাভাস বিজ্ঞপ্তি - ${cyclone.name} (T - ${cyclone.lead_time_hours} ঘণ্টা)**\n\n` +
             `**প্রভাব এলাকা:** ${cyclone.landfall_target}\n` +
             `**বাতাসের গতিবেগ:** ${cyclone.wind_speed_kmh} কিমি/ঘণ্টা | **প্লাবন উচ্চতা:** ${cyclone.surge_height_m} মিটার\n\n` +
             `📢 **প্রস্তুতিমূলক নির্দেশাবলী (${audience}):**\n` +
             `১. উপকূলবর্তী নিম্নাঞ্চলের অধিবাসীদের অবিলম্বে সাইক্লোন শেল্টারে স্থানান্তরিত করুন।\n` +
             `২. মৎস্যজীবী ট্রলার ও নৌকা সমুদ্র থেকে অবিলম্বে কূলে ফিরিয়ে এনে নিরাপদ স্থানে নোঙ্গর করুন।\n` +
             `৩. প্যারামেট্রিক বীমা অটোমেটিক ফান্ড (bKash/নগদ) সাইক্লোন আঘাত হানার ১৮ ঘণ্টা পূর্বেই অ্যাকাউন্টে জমা হবে।`;
    } else if (language === 'Odia') {
      return `🚨 **ଜରୁରୀ ସତର୍କତା ସୂଚନା - ${cyclone.name} (T - ${cyclone.lead_time_hours} ଘଣ୍ଟା)**\n\n` +
             `**ପ୍ରଭାବିତ ଅଞ୍ଚଳ:** ${cyclone.landfall_target}\n` +
             `**ପବନର ବେଗ:** ${cyclone.wind_speed_kmh} କିମି/ଘଣ୍ଟା | **ଜଳପ୍ଲାବନ ଉଚ୍ଚତା:** ${cyclone.surge_height_m} ମିଟର\n\n` +
             `📢 **ଅଗ୍ରଗାମୀ ପଦକ୍ଷେପ (${audience}):**\n` +
             `୧. ଉପକୂଳବର୍ତ୍ତୀ କଞ୍ଚା ଘରୁ ତୁରନ୍ତ ସାଇକ୍ଲୋନ୍ ଆଶ୍ରୟସ୍ଥଳକୁ ସ୍ଥାନାନ୍ତର ହୁଅନ୍ତୁ।\n` +
             `୨. ବ୍ୟାଙ୍କ ଖାତାକୁ ସିଧାସଳଖ ଆଗୁଆ ସହାୟତା ରାଶି ପ୍ରଦାନ ପ୍ରକ୍ରିୟା ଆରମ୍ଭ ହୋଇସାରିଛି।`;
    } else {
      return `🚨 **ANTICIPATORY ACTION ADVISORY: ${cyclone.name} (Lead Time: T - ${cyclone.lead_time_hours} Hours)**\n\n` +
             `📍 **Target Impact Zone:** ${cyclone.landfall_target}\n` +
             `🌬️ **Max Sustained Wind Speed:** ${cyclone.wind_speed_kmh} km/h (Category 4 Major Cyclone)\n` +
             `🌊 **Peak GEE Hydrodynamic Surge:** ${cyclone.surge_height_m} meters above Astronomical High Tide\n\n` +
             `🎯 **Action Protocol for ${audience}:**\n` +
             `1. **Pre-Landfall Evacuation:** Execute mandatory early transfer of 185,000 high-vulnerability households to reinforced cyclone shelters.\n` +
             `2. **Embankment Reinforcement:** Deploy rapid-response engineering corps to Sundarbans Sector 4 & Cox's Bazar West Dykes.\n` +
             `3. **Parametric Insurance Disbursement:** Auto-trigger pre-landfall cash payout of $1.24M directly to registered bKash/Mobile Wallets.`;
    }
  }

  function exportAdvisoryText() {
    if (!currentAdvisoryText) return;
    const blob = new Blob([currentAdvisoryText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `APAC_Resilience_Advisory_${Date.now()}.txt`;
    link.click();
  }

  return {
    generateAdvisory: generateAdvisory,
    speakAdvisoryText: speakAdvisoryText,
    exportAdvisoryText: exportAdvisoryText,
    getCurrentAdvisoryText: () => currentAdvisoryText
  };
})();
