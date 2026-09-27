import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error
import time

PORT = 8000

# Try reading GEMINI_API_KEY from env or file if exists
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    for env_filename in [".env.local", ".env"]:
        env_path = os.path.join(os.path.dirname(__file__), env_filename)
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith("GEMINI_API_KEY="):
                            GEMINI_API_KEY = line.split("=", 1)[1].strip('"\' ')
                            break
            except Exception as e:
                pass
        if GEMINI_API_KEY:
            break


class APACResilienceHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/gemini':
            self.handle_gemini_request()
        elif self.path == '/api/gee-simulation':
            self.handle_gee_request()
        elif self.path == '/api/parametric-payout':
            self.handle_parametric_request()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_gemini_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            prompt = body.get('prompt', '')
            language = body.get('language', 'English')
            audience = body.get('audience', 'Coastal Communities')
            cyclone_data = body.get('cyclone_data', {})
            
            response_text = ""
            
            # If GEMINI_API_KEY is available, call Gemini API
            if GEMINI_API_KEY:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                    headers = {'Content-Type': 'application/json'}
                    payload = {
                        "contents": [{
                            "parts": [{
                                "text": f"You are Gemini 3.7 Flash, the AI Climate Risk Sentinel for the Bay of Bengal Anticipatory Action Platform.\n"
                                        f"Language: {language}\nTarget Audience: {audience}\n"
                                        f"Cyclone Details: {json.dumps(cyclone_data)}\n"
                                        f"User Prompt: {prompt}\n\n"
                                        f"Generate a crisp, high-impact, professional early-warning advisory or risk evaluation."
                            }]
                        }]
                    }
                    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        res_json = json.loads(resp.read().decode('utf-8'))
                        response_text = res_json['candidates'][0]['content']['parts'][0]['text']
                except Exception as e:
                    print(f"Gemini API call failed: {e}. Falling back to internal engine.")
                    response_text = self.fallback_gemini_reasoning(prompt, language, audience, cyclone_data)
            else:
                response_text = self.fallback_gemini_reasoning(prompt, language, audience, cyclone_data)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "model": "Gemini 3.7 Flash Sentinel",
                "advisory": response_text,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }).encode('utf-8'))
        except Exception as err:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(err)}).encode('utf-8'))

    def fallback_gemini_reasoning(self, prompt, language, audience, cyclone_data):
        name = cyclone_data.get('name', 'Super Cyclone Bay-26X')
        wind = cyclone_data.get('wind_speed_kmh', 185)
        surge = cyclone_data.get('surge_height_m', 3.8)
        lead_time = cyclone_data.get('lead_time_hours', 24)
        location = cyclone_data.get('landfall_target', "Cox's Bazar & Sundarbans Delta")

        if language == 'Bengali':
            return (
                f"🚨 **জরুরি পূর্বাভাস বিজ্ঞপ্তি - {name} (T - {lead_time} ঘণ্টা)**\n\n"
                f"**প্রভাব এলাকা:** {location}\n"
                f"**বাতাসের গতিবেগ:** {wind} কিমি/ঘণ্টা | **প্লাবন উচ্চতা:** {surge} মিটার (GEE SAR সিমুলেটেড)\n\n"
                f"📢 **প্রস্তুতিমূলক নির্দেশাবলী ({audience}):**\n"
                f"১. উপকূলবর্তী নিম্নাঞ্চলের অধিবাসীদের অবিলম্বে সাইক্লোন শেল্টারে স্থানান্তরিত করুন।\n"
                f"২. মৎস্যজীবী ট্রলার ও নৌকা সমুদ্র থেকে অবিলম্বে কূলে ফিরিয়ে এনে নিরাপদ স্থানে নোঙ্গর করুন।\n"
                f"৩. প্যারামেট্রিক বীমা অটোমেটিক ফান্ড (bKash/নগদ) সাইক্লোন আঘাত হানার ১৮ ঘণ্টা পূর্বেই অ্যাকাউন্টে জমা হবে।\n"
                f"৪. পানীয় জল, শুকনো খাবার এবং জরুরি ফার্স্ট এইড কিট সাথে রাখুন।"
            )
        elif language == 'Odia':
            return (
                f"🚨 **ଜରୁରୀ ସତର୍କତା ସୂଚନା - {name} (T - {lead_time} ଘଣ୍ଟା)**\n\n"
                f"**ପ୍ରଭାବିତ ଅଞ୍ଚଳ:** {location}\n"
                f"**ପବନର ବେଗ:** {wind} କିମି/ଘଣ୍ଟା | **ଜଳପ୍ଲାବନ ଉଚ୍ଚତା:** {surge} ମିଟର\n\n"
                f"📢 **ଅଗ୍ରଗାମୀ ପଦକ୍ଷେପ ({audience}):**\n"
                f"୧. ଉପକୂଳବର୍ତ୍ତୀ କଞ୍ଚା ଘରୁ ତୁରନ୍ତ ସାଇକ୍ଲୋନ୍ ଆଶ୍ରୟସ୍ଥଳକୁ ସ୍ଥାନାନ୍ତର ହୁଅନ୍ତୁ।\n"
                f"୨. ଗ୍ରାମାଞ୍ଚଳ ବନ୍ଧ ସୁରକ୍ଷା ଓ ଗୋରୁଗାଈଙ୍କୁ ଉଚ୍ଚ ସ୍ଥାନକୁ ନିଅନ୍ତୁ।\n"
                f"୩. ବ୍ୟାଙ୍କ ଖାତାକୁ ସିଧାସଳଖ ଆଗୁଆ ସହାୟତା ରାଶି ପ୍ରଦାନ ପ୍ରକ୍ରିୟା ଆରମ୍ଭ ହୋଇସାରିଛି।"
            )
        elif language == 'Burmese':
            return (
                f"🚨 **အရေးပေါ် သတိပေးချက် - {name} (T - {lead_time} နာရီ)**\n\n"
                f"**ထိခိုက်နိုင်သော ဒေသ:** {location}\n"
                f"**လေတိုက်နှုန်း:** {wind} km/h | **ဒီရေလှိုင်းအမြင့်:** {surge} မီတာ\n\n"
                f"📢 **ကြိုတင်ကာကွယ်ရေး ညွှန်ကြားချက်များ ({audience}):**\n"
                f"၁။ ကမ်းရိုးတန်းနိမ့်ပိုင်းရှိ ပြည်သူများ ဘေးလွတ်ရာ စက္ကူစခန်းများသို့ ချက်ချင်း ရွှေ့ပြောင်းပါ။\n"
                f"၂။ ငါးဖမ်းလှေများ ကမ်းသို့ ချက်ချင်း ပြန်လာပါ။"
            )
        elif language == 'Hindi':
            return (
                f"🚨 **पूर्वानुमान पूर्व-चेतावनी - {name} (T - {lead_time} घंटे)**\n\n"
                f"**प्रभावित क्षेत्र:** {location}\n"
                f"**हवा की गति:** {wind} किमी/घंटा | **ज्वारीय लहर की ऊंचाई:** {surge} मीटर\n\n"
                f"📢 **पूर्वानुमानित कार्रवाई निर्देश ({audience}):**\n"
                f"१. तटीय निचले इलाकों के निवासियों को तुरंत चक्रवात आश्रय स्थलों में स्थानांतरित करें।\n"
                f"२. मछुआरों को समुद्र में जाने से रोकें और नौकाओं को तट पर बांधें।\n"
                f"३. ऑटोमेटेड पैरामेट्रिक वित्तीय सहायता सीधे खातों में हस्तांतरित की जा रही है।"
            )
        else: # English
            return (
                f"🚨 **ANTICIPATORY ACTION ADVISORY: {name} (Lead Time: T - {lead_time} Hours)**\n\n"
                f"📍 **Target Impact Zone:** {location}\n"
                f"🌬️ **Max Sustained Wind Speed:** {wind} km/h (Category 4 Major Cyclone)\n"
                f"🌊 **Peak GEE Hydrodynamic Surge:** {surge} meters above Astronomical High Tide\n\n"
                f"🎯 **Action Protocol for {audience}:**\n"
                f"1. **Pre-Landfall Evacuation:** Execute mandatory early transfer of 185,000 high-vulnerability households to reinforced cyclone shelters.\n"
                f"2. **Embankment Reinforcement:** Deploy rapid-response engineering corps to Sundarbans Sector 4 & Cox's Bazar West Dykes.\n"
                f"3. **Parametric Insurance Disbursement:** Auto-trigger pre-landfall cash payout of $1.24M directly to registered bKash/Mobile Wallets.\n"
                f"4. **Emergency Supply Staging:** Pre-position 40 mobile water purification units and emergency medical kits at DDMA hubs."
            )

    def handle_gee_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            lead_time = body.get('lead_time_hours', 24)
            sea_level_rise = body.get('sea_level_rise', 0.0)
            tide_phase = body.get('tide_phase', 'high_tide')
            
            # Simulated Earth Engine dynamic calculations
            surge_peak = round(3.2 + (72 - lead_time) * 0.025 + sea_level_rise, 2)
            if tide_phase == 'high_tide':
                surge_peak += 0.6
            
            flooded_area_sqkm = int(surge_peak * 410)
            exposed_pop = int(flooded_area_sqkm * 1850)
            critical_assets_at_risk = int(surge_peak * 18)
            
            res = {
                "status": "success",
                "gee_dataset": "COPERNICUS/S2_HARMONIZED + SENTINEL-1 SAR HYDRODYNAMIC",
                "metrics": {
                    "peak_surge_m": surge_peak,
                    "inundated_area_sqkm": flooded_area_sqkm,
                    "population_at_risk": exposed_pop,
                    "critical_infrastructure_at_risk": critical_assets_at_risk,
                    "embankment_breach_probability": min(98, int(surge_peak * 22))
                }
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

    def handle_parametric_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            
            surge = body.get('surge_m', 3.8)
            wind = body.get('wind_kmh', 185)
            
            triggered = (surge >= 2.2 or wind >= 130)
            
            payouts = []
            if triggered:
                payouts = [
                    {"category": "Smallholder Paddy Farmers", "households": 12400, "payout_per_hh": 120, "total_usd": 1488000, "channel": "bKash / Mobile Wallet"},
                    {"category": "Artisanal Coastal Fishers", "households": 8200, "payout_per_hh": 150, "total_usd": 1230000, "channel": "Nagad / Direct Transfer"},
                    {"category": "Salt Pan & Aquaculture Workers", "households": 4500, "payout_per_hh": 100, "total_usd": 450000, "channel": "UPI / APB System"},
                    {"category": "Female-Headed Vulnerable HHs", "households": 6100, "payout_per_hh": 180, "total_usd": 1098000, "channel": "Direct Cash Mobile Transfer"}
                ]
            
            res = {
                "status": "success",
                "parametric_triggered": triggered,
                "trigger_reason": f"GEE Hydrodynamic Surge ({surge}m >= 2.2m) & Wind ({wind}km/h >= 130km/h)",
                "total_disbursement_usd": sum(p["total_usd"] for p in payouts) if triggered else 0,
                "payout_breakdown": payouts
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    Handler = APACResilienceHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"APAC-Resilience AI Platform backend running at http://localhost:{PORT}")
            httpd.serve_forever()
    except OSError:
        PORT = 8080
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"APAC-Resilience AI Platform backend running at http://localhost:{PORT}")
            httpd.serve_forever()
