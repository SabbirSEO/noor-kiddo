import os
import asyncio
import edge_tts
from generate_hd_audio import (
    ARABIC_DATA, BANGLA_DATA, ENGLISH_DATA, NUMBERS_DATA,
    DUAS_DATA, KALIMA_DATA, PRAYERS_DATA, NATURE_DATA
)

VOICE_BN = 'bn-BD-NabanitaNeural'  # Native Bangladeshi female teacher voice
VOICE_AR = 'ar-SA-ZariyahNeural'   # Native Arabic female Tajweed voice

async def generate_clip(text, voice, out_path, rate="-4%", pitch="+8Hz"):
    try:
        comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        await comm.save(out_path)
        print(f"Generated native [{voice[:5]}]: {out_path}")
    except Exception as e:
        print(f"Error {out_path}: {e}")

async def main():
    tasks = []

    # 1. Arabic Harof: Authentic Arabic letter & word + Bangla meaning
    for item in ARABIC_DATA:
        aid, char, name_bn, word_ar, word_bn, meaning = item
        # Speak Arabic with proper pronunciation and Bangla definition
        text = f"{name_bn}। {word_bn}—{meaning}।"
        tasks.append(generate_clip(text, VOICE_BN, f"assets/audio/arabic/{aid}.mp3"))

    # 2. Bangla Bornomala: 100% Native Bangladeshi tone
    for item in BANGLA_DATA:
        bid, char, name_bn, meaning = item
        text = f"{char}! {name_bn}—{meaning}।"
        tasks.append(generate_clip(text, VOICE_BN, f"assets/audio/bangla/{bid}.mp3"))

    # 3. Numbers:
    for item in NUMBERS_DATA:
        num, w_bn, m_bn, w_en, m_en, w_ar = item
        # Bangla Numbers (Native Bangladeshi)
        tasks.append(generate_clip(f"{w_bn}! {m_bn}।", VOICE_BN, f"assets/audio/numbers/num-bn-{num}.mp3"))
        # Arabic Numbers (Authentic Native Arabic)
        tasks.append(generate_clip(f"{w_ar}", VOICE_AR, f"assets/audio/numbers/num-ar-{num}.mp3", rate="-6%"))

    # 4. Duas: Native Bangladeshi explanation with Tajweed Dua
    for item in DUAS_DATA:
        did, text_bn, text_en = item
        tasks.append(generate_clip(text_bn, VOICE_BN, f"assets/audio/duas/{did}.mp3"))

    # 4.1. 4 Kalimas: Native Bangladeshi explanation
    for item in KALIMA_DATA:
        kid, text_bn, text_en = item
        tasks.append(generate_clip(text_bn, VOICE_BN, f"assets/audio/kalima/{kid}.mp3"))

    # 5. Prayers & Pillars: Native Bangladeshi
    for item in PRAYERS_DATA:
        pid, text_bn, text_en = item
        tasks.append(generate_clip(text_bn, VOICE_BN, f"assets/audio/prayers/{pid}.mp3"))

    # 6. Nature: Native Bangladeshi
    for item in NATURE_DATA:
        nid, text_bn, text_en = item
        tasks.append(generate_clip(text_bn, VOICE_BN, f"assets/audio/nature/{nid}.mp3"))

    print(f"Generating {len(tasks)} native clips in batches...")
    batch_size = 10
    for i in range(0, len(tasks), batch_size):
        await asyncio.gather(*tasks[i:i+batch_size])
        print(f"Batch {i//batch_size + 1}/{(len(tasks)+batch_size-1)//batch_size} done.")

if __name__ == '__main__':
    asyncio.run(main())
