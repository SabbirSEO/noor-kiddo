import os
import asyncio
import edge_tts

VOICE = 'bn-BD-NabanitaNeural'

KALIMA_SSML = [
    (
        'kal-1',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-10%">
                    ১. কালিমা তাইয়্যেবাহ।
                    <break time="500ms"/>
                    লা ইলাহা,
                    <break time="500ms"/>
                    ইল্লাল্লাহু,
                    <break time="600ms"/>
                    মুহাম্মাদুর,
                    <break time="500ms"/>
                    রাসুলুল্লাহ!
                    <break time="700ms"/>
                    অর্থ:
                    আল্লাহ ছাড়া কোনো উপাস্য নেই,
                    <break time="450ms"/>
                    মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম আল্লাহর রাসুল।
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-2',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-10%">
                    ২. কালিমা শাহাদাত।
                    <break time="500ms"/>
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
                    <break time="700ms"/>
                    অর্থ:
                    আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো উপাস্য নেই,
                    <break time="450ms"/>
                    তিনি একক, তাঁর কোনো শরিক নেই,
                    <break time="500ms"/>
                    এবং নিশ্চয়ই মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম তাঁর বান্দা ও রাসুল।
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-3',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-10%">
                    ৩. কালিমা তামজীদ।
                    <break time="500ms"/>
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
                    <break time="700ms"/>
                    অর্থ:
                    আল্লাহ অতি পবিত্র,
                    <break time="450ms"/>
                    সমস্ত প্রশংসা আল্লাহর,
                    <break time="450ms"/>
                    আল্লাহ ছাড়া কোনো উপাস্য নেই,
                    <break time="450ms"/>
                    এবং আল্লাহ সর্বশ্রেষ্ঠ।
                </prosody>
            </voice>
        </speak>'''
    ),
    (
        'kal-4',
        '''<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD">
            <voice name="bn-BD-NabanitaNeural">
                <prosody pitch="+6Hz" rate="-10%">
                    ৪. কালিমা তাওহীদ।
                    <break time="500ms"/>
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
                    <break time="700ms"/>
                    অর্থ:
                    আল্লাহ ছাড়া কোনো উপাস্য নেই,
                    <break time="450ms"/>
                    তিনি এক, তাঁর কোনো শরিক নেই,
                    <break time="450ms"/>
                    রাজত্ব ও সমস্ত প্রশংসা একমাত্র তাঁরই।
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
        print(f"Generated word-by-word pause audio: {out} ({os.path.getsize(out)} bytes)")

if __name__ == '__main__':
    asyncio.run(main())
