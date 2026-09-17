import os
import asyncio
import edge_tts

VOICE = 'bn-BD-NabanitaNeural'

# Pure Kalima ONLY (No intro, no meaning) with toddler-friendly word-by-word pauses
KALIMA_SSML = [
    (
        'kal-1',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-8%">
                    লা ইলাহা,
                    <break time="500ms"/>
                    ইল্লাল্লাহু,
                    <break time="600ms"/>
                    মুহাম্মাদুর,
                    <break time="500ms"/>
                    রাসুলুল্লাহ!
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-2',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-8%">
                    আশহাদু আল্লা,
                    <break time="450ms"/>
                    ইলাহা,
                    <break time="450ms"/>
                    ইল্লাল্লাহু,
                    <break time="550ms"/>
                    ওয়াহদাহু,
                    <break time="450ms"/>
                    লা শারীকা লাহু,
                    <break time="600ms"/>
                    ওয়া আশহাদু আন্না,
                    <break time="450ms"/>
                    মুহাম্মাদান,
                    <break time="450ms"/>
                    আবদুহু,
                    <break time="450ms"/>
                    ওয়া রাসুলুহু!
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-3',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-8%">
                    সুবহানাল্লাহি,
                    <break time="500ms"/>
                    ওয়াল হামদুলিল্লাহি,
                    <break time="550ms"/>
                    ওয়া লা ইলাহা,
                    <break time="450ms"/>
                    ইল্লাল্লাহু,
                    <break time="550ms"/>
                    ওয়াল্লাহু আকবার!
                    <break time="650ms"/>
                    ওয়া লা হাওলা,
                    <break time="450ms"/>
                    ওয়া লা কুওয়াতা,
                    <break time="500ms"/>
                    ইল্লা বিল্লাহিল,
                    <break time="450ms"/>
                    আলিয়্যিল আজীম!
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-4',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-8%">
                    লা ইলাহা ইল্লাল্লাহু,
                    <break time="500ms"/>
                    ওয়াহদাহু লা শারীকা লাহু,
                    <break time="550ms"/>
                    লাহুল মুলকু,
                    <break time="450ms"/>
                    ওয়া লাহুল হামদু,
                    <break time="500ms"/>
                    ইউহয়ী ওয়া ইউমীতু,
                    <break time="500ms"/>
                    বিয়াদিহিল খাইরু,
                    <break time="500ms"/>
                    ওয়া হুয়া আলা কুল্লি শাইয়িন ক্বাদীর!
                </prosody>
            </voice>
        </speak>'''
    )
]

async def main():
    os.makedirs('assets/audio/kalima', exist_ok=True)
    for kid, ssml in KALIMA_SSML:
        out = f"assets/audio/kalima/{kid}.mp3"
        comm = edge_tts.Communicate(ssml, VOICE)
        await comm.save(out)
        print(f"Generated clean Kalima audio: {out} ({os.path.getsize(out)} bytes)")

if __name__ == '__main__':
    asyncio.run(main())
