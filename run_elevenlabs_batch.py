import os
import sys
import time
import json
import urllib.request
import urllib.error
from generate_hd_audio import build_all_items

API_KEY = "sk_e2beddb54cfa04be16b8597d5985042a2e3131e8503388d0"
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Sarah - warm, gentle, clear female teacher voice
URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

def main():
    items = build_all_items()
    total = len(items)
    print(f"Starting ElevenLabs HD Voice Generation for {total} audio clips...")

    success_count = 0
    skip_count = 0
    fail_count = 0

    for idx, (text, out_path) in enumerate(items, 1):
        # If file was already generated recently (size > 15KB for elevenlabs), skip
        # (We want to replace all old Edge-TTS files with ElevenLabs HD files)
        
        payload = json.dumps({
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.55,
                "similarity_boost": 0.75,
                "style": 0.4,
                "use_speaker_boost": True
            }
        }).encode("utf-8")

        req = urllib.request.Request(URL, data=payload, method="POST")
        req.add_header("xi-api-key", API_KEY)
        req.add_header("Content-Type", "application/json")

        retries = 3
        while retries > 0:
            try:
                with urllib.request.urlopen(req) as resp:
                    data = resp.read()
                    with open(out_path, "wb") as f:
                        f.write(data)
                    success_count += 1
                    print(f"[{idx}/{total}] Generated: {out_path} ({len(data)} bytes)")
                    break
            except urllib.error.HTTPError as e:
                err_text = e.read().decode('utf-8', errors='ignore')
                print(f"[{idx}/{total}] HTTP Error {e.code} for {out_path}: {err_text[:120]}")
                if e.code == 429: # Rate limit
                    time.sleep(4)
                    retries -= 1
                else:
                    fail_count += 1
                    break
            except Exception as e:
                print(f"[{idx}/{total}] Error for {out_path}: {e}")
                fail_count += 1
                break

        # Small 200ms delay between requests to be polite to the API
        time.sleep(0.2)

    print(f"\n==========================================")
    print(f"Generation finished! Success: {success_count}, Failed: {fail_count}")

if __name__ == "__main__":
    main()
