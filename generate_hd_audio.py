"""
Noor Kiddo - Ultra-Realistic HD Audio Generator
Supports: OpenAI TTS-HD and ElevenLabs Multilingual v2
"""

import os
import sys
import json
import urllib.request
import urllib.error

# Directories
BASE_DIR = 'assets/audio'
DIRS = ['arabic', 'bangla', 'english', 'numbers', 'duas', 'kalima', 'prayers', 'nature']
for d in DIRS:
    os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)

# 1. Arabic Harof List
ARABIC_DATA = [
    ('ar-1', 'ا', 'আলিফ', 'اَللّٰه', 'আল্লাহ', 'আমাদের সৃষ্টিকর্তা ও রব'),
    ('ar-2', 'ب', 'বা', 'بَيْتُ اللّٰه', 'বাইতুল্লাহ', 'আল্লাহর পবিত্র ঘর কাবা'),
    ('ar-3', 'ت', 'তা', 'تَوْبَة', 'তাওবাহ', 'আল্লাহর কাছে ক্ষমা প্রার্থনা'),
    ('ar-4', 'ث', 'ছা', 'ثَوَاب', 'সাওয়াব', 'ভালো কাজের নেক পুরস্কার'),
    ('ar-5', 'ج', 'জীম', 'جَنَّة', 'জান্নাত', 'সুন্দর চিরস্থায়ী বাগান'),
    ('ar-6', 'ح', 'হা', 'حَجّ', 'হজ', 'পবিত্র মক্কায় হজ পালন'),
    ('ar-7', 'خ', 'খা', 'خَيْر', 'খায়ের', 'সকল ভালো ও মঙ্গল কাজ'),
    ('ar-8', 'د', 'দাল', 'دُعَاء', 'দু’আ', 'আল্লাহর কাছে মোনাজাত ও প্রার্থনা'),
    ('ar-9', 'ذ', 'যাল', 'ذِكْر', 'জিকির', 'আল্লাহর স্মরণ ও প্রশংসা করা'),
    ('ar-10', 'ر', 'রা', 'رَمَضَان', 'রমাদান', 'পবিত্র বরকতময় রোজার মাস'),
    ('ar-11', 'ز', 'যা', 'زَكَاة', 'যাকাত', 'গরিবদের সাহায্য ও দান করা'),
    ('ar-12', 'س', 'সীন', 'سَلَام', 'সালাম', 'শান্তি ও শুভেচ্ছা বিনিময়'),
    ('ar-13', 'ش', 'শীন', 'شُكْر', 'শুকর', 'আল্লাহর নেয়ামতের কৃতজ্ঞতা'),
    ('ar-14', 'ص', 'সোয়াদ', 'صَلَاة', 'সালাত', 'দৈনিক পাঁচ ওয়াক্ত নামাজ'),
    ('ar-15', 'ض', 'দোয়াদ', 'ضِيَاء', 'দিয়া', 'সৎ পথের উজ্জ্বল আলো'),
    ('ar-16', 'ط', 'তোয়া', 'طَيِّب', 'তায়্যিব', 'উত্তম, হালাল ও পবিত্র'),
    ('ar-17', 'ظ', 'জোয়া', 'ظِلّ', 'জিল্ল', 'গাছের শীতল ছায়া'),
    ('ar-18', 'ع', 'আইন', 'عِلْم', 'ইলম', 'কুরআন ও হাদিসের কল্যাণকর জ্ঞান'),
    ('ar-19', 'غ', 'গাইন', 'غَفُور', 'গফুর', 'আল্লাহ পরম ক্ষমাশীল'),
    ('ar-20', 'ف', 'ফা', 'فَجْر', 'ফজর', 'ভোরের প্রথম নামাজ'),
    ('ar-21', 'ق', 'ক্বাফ', 'قُرْآن', 'কুরআন', 'আল্লাহর পবিত্র বাণী ও হেদায়েত'),
    ('ar-22', 'ك', 'কাফ', 'كَعْبَة', 'কা’বা', 'আমাদের কেবলা ও পবিত্র কাবা'),
    ('ar-23', 'ل', 'লাম', 'لَيْل', 'লাইল', 'তারার আলোয় সুন্দর রাত'),
    ('ar-24', 'م', 'মীম', 'مَسْجِد', 'মসজিদ', 'আল্লাহর ঘর ও নামাজের স্থান'),
    ('ar-25', 'ن', 'নূন', 'নূর্', 'নূর', 'ঈমানের পবিত্র নূর ও আলো'),
    ('ar-26', 'هـ', 'হা', 'هُدَى', 'হুদা', 'সঠিক ও সত্য পথের সন্ধান'),
    ('ar-27', 'و', 'ওয়াও', 'وُضُوء', 'ওযু', 'পবিত্র পানির সুন্দর অজু'),
    ('ar-28', 'ي', 'ইয়া', 'يَسِير', 'ইয়াসীর', 'আল্লাহর সহজ ও কল্যাণকর রহমত')
]

# 2. Bangla Bornomala
BANGLA_DATA = [
    ('bn-1', 'অ', 'অজু', 'নামাজের আগে সুন্দর অজু করি'),
    ('bn-2', 'আ', 'আল্লাহ', 'আল্লাহ আমাদের একমাত্র রব'),
    ('bn-3', 'ই', 'ইবাদত', 'আল্লাহর সন্তুষ্টির জন্য ইবাদত করি'),
    ('bn-4', 'ঈ', 'ঈদ', 'ঈদের আনন্দের মিষ্টি দিন'),
    ('bn-5', 'উ', 'উট', 'মরুভূমির সুন্দর প্রাণী উট'),
    ('bn-6', 'ঊ', 'ঊষা', 'ভোরের লাল সূর্য ও ফজর'),
    ('bn-7', 'ঋ', 'ঋতু', 'আল্লাহর সৃষ্টির সুন্দর ঋতু'),
    ('bn-8', 'এ', 'একতা', 'আমরা সবাই মুসলিম ভাই-বোন'),
    ('bn-9', 'ঐ', 'ঐক্য', 'সবাই মিলেমিশে থাকা সুন্দর'),
    ('bn-10', 'ও', 'ওহী', 'আল্লাহর প্রেরিত পবিত্র বাণী'),
    ('bn-11', 'ঔ', 'ঔষধ', 'অসুস্থ হলে দোয়া ও ঔষধ খাই'),
    ('bn-12', 'ক', 'কুরআন', 'পবিত্র কুরআন প্রতিদিন পড়ি'),
    ('bn-13', 'খ', 'খেজুর', 'সুন্নতি সুস্বাদু মিষ্টি খেজুর'),
    ('bn-14', 'গ', 'গোলাপ', 'আল্লাহর সৃষ্টি সুন্দর সুবাসিত ফুল'),
    ('bn-15', 'ঘ', 'ঘড়ি', 'সময়মতো পাঁচ ওয়াক্ত নামাজ পড়ব'),
    ('bn-16', 'ঙ', 'রঙধনু', 'আকাশে সাত রঙের সুন্দর রংধনু'),
    ('bn-17', 'চ', 'চাঁদ', 'রমাদানের সুন্দর বাঁকা চাঁদ'),
    ('bn-18', 'ছ', 'ছাতা', 'বৃষ্টির সময় ছাতা ব্যবহার করি'),
    ('bn-19', 'জ', 'জান্নাত', 'ভালো কাজের জন্য চিরসুখের জান্নাত'),
    ('bn-20', 'ঝ', 'ঝরনা', 'পাহাড়ের শীতল পানির ঝরনা'),
    ('bn-21', 'ঞ', 'মিঞা', 'বিড়াল ছানা ও মিষ্টি পাখি'),
    ('bn-22', 'ট', 'টুপি', 'নামাজের সময় মাথায় পরি টুপি'),
    ('bn-23', 'ঠ', 'ঠোঁট', 'ঠোঁট দিয়ে সুন্দর মিষ্টি কথা বলি'),
    ('bn-24', 'ড', 'ডালিম', 'জান্নাতের সুস্বাদু ফল ডালিম'),
    ('bn-25', 'ঢ', 'ঢাকনা', 'খাবার সবসময় ঢেকে রাখি'),
    ('bn-26', 'ণ', 'হরিণ', 'সবুজ বনের মায়াবী হরিণ'),
    ('bn-27', 'ত', 'তাসবীহ', 'আল্লাহর জিকির ও তাসবীহ পড়ি'),
    ('bn-28', 'থ', 'থালা', 'ডান হাতে খাবার খাই'),
    ('bn-29', 'দ', 'দু’আ', 'সবকিছুতে আল্লাহর কাছে চাই'),
    ('bn-30', 'ধ', 'ধন্যবাদ', 'উপকার পেলে জাযাকাল্লাহ বলি'),
    ('bn-31', 'ন', 'নামাজ', 'প্রতিদিন পাঁচ ওয়াক্ত নামাজ আদায় করি'),
    ('bn-32', 'প', 'পাখি', 'গাছের ডালে মিষ্টি পাখি গায়'),
    ('bn-33', 'ফ', 'ফল', 'আল্লাহর নিয়ামত মিষ্টি মিষ্টি ফল'),
    ('bn-34', 'ব', 'বিসমিল্লাহ', 'সব কাজের শুরুতে বিসমিল্লাহ বলি'),
    ('bn-35', 'ভ', 'ভালোবাসা', 'বাবা-মা ও সবাইকে ভালোবাসি'),
    ('bn-36', 'ম', 'মসজিদ', 'আল্লাহর ঘর পবিত্র মসজিদ'),
    ('bn-37', 'য', 'যমযম', 'মক্কার বরকতময় পবিত্র পানি'),
    ('bn-38', 'র', 'রব', 'আল্লাহ আমাদের একমাত্র রব'),
    ('bn-39', 'ল', 'লাব্বাইক', 'হজের মধুর সুর লাব্বাইক'),
    ('bn-40', 'শ', 'শুকরিয়া', 'সবসময় আলহামদুলিল্লাহ বলি'),
    ('bn-41', 'ষ', 'ষাঁড়', 'কোরবানির পশু ও খামার'),
    ('bn-42', 'স', 'সালাম', 'দেখা হলেই সালাম বিনিময় করি'),
    ('bn-43', 'হ', 'হজ', 'পবিত্র মক্কার হজ পালন'),
    ('bn-44', 'ড়', 'ঘুড়ি', 'নীল আকাশে উড়ে রঙিন ঘুড়ি'),
    ('bn-45', 'ঢ়', 'আষাঢ়', 'বৃষ্টিতে গাছে পানি জমে'),
    ('bn-46', 'য়', 'ময়না', 'কথা বলা সুন্দর ময়না পাখি'),
    ('bn-47', 'ৎ', 'সৎ কাজ', 'সবার সাথে ভালো ব্যবহার করি'),
    ('bn-48', 'ং', 'রং', 'আল্লাহর রঙে রঙিন পৃথিবী'),
    ('bn-49', 'ঃ', 'দুঃখী', 'দুঃখীদের সাহায্য করা সাওয়াব'),
    ('bn-50', 'ঁ', 'হাঁস', 'পুকুরের জলে ভাসে সাদা হাঁস')
]

# 3. English ABC
ENGLISH_DATA = [
    ('en-1', 'A', 'Allah', 'Allah is the Creator of all things'),
    ('en-2', 'B', 'Bismillah', 'In the name of Allah I begin'),
    ('en-3', 'C', 'Crescent', 'Crescent moon of Ramadan and Eid'),
    ('en-4', 'D', 'Dua', 'Supplication and talking to Allah'),
    ('en-5', 'E', 'Eid', 'Joyous Muslim celebration'),
    ('en-6', 'F', 'Fajr', 'Dawn prayer of the morning'),
    ('en-7', 'G', 'Good Deeds', 'Doing good deeds and helping others'),
    ('en-8', 'H', 'Hajj', 'Pilgrimage to holy Makkah'),
    ('en-9', 'I', 'Islam', 'The religion of peace and submission'),
    ('en-10', 'J', 'Jannah', 'Paradise and eternal reward'),
    ('en-11', 'K', 'Kabah', 'The Holy Kabah in Makkah'),
    ('en-12', 'L', 'Lantern', 'Bright Ramadan lantern'),
    ('en-13', 'M', 'Masjid', 'Mosque, place of worship'),
    ('en-14', 'N', 'Niyyah', 'Pure intention in the heart'),
    ('en-15', 'O', 'Olive', 'Blessed olive mentioned in Quran'),
    ('en-16', 'P', 'Prayer', 'Daily five obligatory prayers'),
    ('en-17', 'Q', 'Quran', 'The Holy Quran, book of guidance'),
    ('en-18', 'R', 'Ramadan', 'Month of fasting and blessing'),
    ('en-19', 'S', 'Salam', 'Greeting with peace'),
    ('en-20', 'T', 'Tasbeeh', 'Remembering Allah with Tasbeeh'),
    ('en-21', 'U', 'Ummah', 'Global brotherhood and Muslim community'),
    ('en-22', 'V', 'Virtue', 'Good character and honesty'),
    ('en-23', 'W', 'Wudu', 'Ablution and cleanliness'),
    ('en-24', 'X', 'Xtra Charity', 'Giving charity to the needy'),
    ('en-25', 'Y', 'Yaseen', 'Surah Yaseen of the Holy Quran'),
    ('en-26', 'Z', 'Zakah', 'Obligatory charity for poor')
]

# 4. Numbers (1-20)
NUMBERS_DATA = [
    (1, 'এক', 'একটি কাবা শরীফ', 'One', 'One Holy Kabah', 'وَاحِد'),
    (2, 'দুই', 'দুটি হাত দিয়ে দু’আ', 'Two', 'Two hands in prayer', 'اِثْنَان'),
    (3, 'তিন', 'তিনটি মিষ্টি খেজুর', 'Three', 'Three sweet dates', 'ثَلَاثَة'),
    (4, 'চার', 'চারটি আসমানী কিতাব', 'Four', 'Four divine books', 'أَرْبَعَة'),
    (5, 'পাঁচ', 'পাঁচ ওয়াক্ত নামাজ ও ইসলামের পাঁচ ভিত্তি', 'Five', 'Five daily prayers and 5 pillars', 'خَمْسَة'),
    (6, 'ছয়', 'ছয়টি ঈমানের স্তম্ভ', 'Six', 'Six articles of faith', 'سِتَّة'),
    (7, 'সাত', 'সাতটি সুন্দর আসমান', 'Seven', 'Seven beautiful heavens', 'سَبْعَة'),
    (8, 'আট', 'জান্নাতের আটটি দরজা', 'Eight', 'Eight gates of Jannah', 'ثَمَانِيَة'),
    (9, 'নয়', 'নয়টি আলোকিত ফানুস', 'Nine', 'Nine bright lanterns', 'تِسْعَة'),
    (10, 'দশ', 'দশটি তাসবীহের দানা', 'Ten', 'Ten prayer beads', 'عَشَرَة'),
    (11, 'এগারো', 'এগারোটি রুপালী চাঁদ', 'Eleven', 'Eleven silver moons', 'أَحَدَ عَشَرَ'),
    (12, 'বারো', 'বারোটি ইসলামিক মাস', 'Twelve', 'Twelve Islamic months', 'اِثْنَا عَشَرَ'),
    (13, 'তেরো', 'তেরোটি মিষ্টি ফল', 'Thirteen', 'Thirteen sweet apples', 'ثَلَاثَةَ عَشَرَ'),
    (14, 'চৌদ্দ', 'চৌদ্দটি উজ্জ্বল নক্ষত্র', 'Fourteen', 'Fourteen glowing stars', 'أَرْبَعَةَ عَشَرَ'),
    (15, 'পনেরো', 'পনেরোটি সাদা শান্তির পায়রা', 'Fifteen', 'Fifteen peaceful doves', 'خَمْسَةَ عَشَرَ'),
    (16, 'ষোলো', 'ষোলোটি রঙিন টিউলিপ ফুল', 'Sixteen', 'Sixteen tulip flowers', 'سِتَّةَ عَشَرَ'),
    (17, 'সতেরো', 'প্রতিদিন সতেরো রাকাত ফরজ নামাজ', 'Seventeen', 'Seventeen fard rakats of prayer', 'سَبْعَةَ عَشَرَ'),
    (18, 'আঠারো', 'আঠারো ফোঁটা খাঁটি মধু', 'Eighteen', 'Eighteen drops of honey', 'ثَمَانِيَةَ عَشَرَ'),
    (19, 'উনিশ', 'উনিশটি সুস্বাদু জলপাই', 'Nineteen', 'Nineteen blessed olives', 'تِسْعَةَ عَشَرَ'),
    (20, 'বিশ', 'বিশটি সুন্দর উপহার', 'Twenty', 'Twenty wonderful gifts', 'عِشْرُونَ')
]

# 5. Duas
DUAS_DATA = [
    ('dua-1', 'খাওয়ার শুরুর দো’আ। বিসমিল্লাহ। আল্লাহর নামে শুরু করছি।', 'Bismillah. In the name of Allah I begin.'),
    ('dua-2', 'খাওয়ার শেষের দো’আ। আলহামদুলিল্লাহ। সকল প্রশংসা আল্লাহর যিনি আমাদের খাওয়ালেন ও পান করালেন।', 'Alhamdulillah. All praise is for Allah.'),
    ('dua-3', 'ঘুম থেকে ওঠার দো’আ। আলহামদুলিল্লাহিল্লাজি আহইয়ানা বা’দা মা আমাতানা। সকল প্রশংসা আল্লাহর যিনি আমাদের ঘুম থেকে নতুন জীবন দিলেন।', 'Alhamdulillah. Praise be to Allah Who woke us up.'),
    ('dua-4', 'সালাম বিনিময়। আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ। আপনার ওপর আল্লাহর শান্তি ও রহমত বর্ষিত হোক।', 'Assalamu Alaikum. May peace and blessings of Allah be upon you.'),
    ('dua-5', 'কালিমা তায়্যিবাহ। লা ইলাহা ইল্লাল্লাহু মুহাম্মাদুর রাসুলুল্লাহ। আল্লাহ ছাড়া কোনো উপাস্য নেই, মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম আল্লাহর রাসুল।', 'La ilaha illallah, Muhammadur Rasulullah. There is no god but Allah, Muhammad is His Messenger.'),
    ('dua-6', 'মাশাআল্লাহ, সুবহানাল্লাহ। আল্লাহ যা চেয়েছেন তাই হয়েছে, আল্লাহ কতই না পবিত্র ও মহান!', 'MashaAllah, SubhanAllah. Glory be to Allah the Almighty!'),
    ('dua-7', 'হাঁচি দিলে বলা—আলহামদুলিল্লাহ, আর শুনলে জবাব দেওয়া—ইয়ারহামুকাল্লাহ।', 'Sneezing dua: say Alhamdulillah, reply Yarhamukallah.'),
    ('dua-8', 'জ্ঞান বৃদ্ধির দো’আ। রাব্বি যিদনী ইলমা। হে আমার প্রতিপালক, আমার জ্ঞান বাড়িয়ে দিন।', 'Rabbi Zidni Ilma. O Lord, increase me in knowledge.')
]

# 5.1. Four Kalimas
KALIMA_DATA = [
    ('kal-1', 'কালিমা তাইয়্যেবাহ। লা ইলাহা ইল্লাল্লাহু মুহাম্মাদুর রাসুলুল্লাহ। আল্লাহ ছাড়া কোনো উপাস্য নেই, মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম আল্লাহর রাসুল।', 'Kalima Tayyibah. There is no god but Allah, Muhammad is His Messenger.'),
    ('kal-2', 'কালিমা শাহাদাত। আশহাদু আল্লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসুলুহু। আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরিক নেই। এবং নিশ্চয়ই মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম তাঁর বান্দা ও রাসুল।', 'Kalima Shahadat. I bear witness that there is no god but Allah, and Muhammad is His servant and Messenger.'),
    ('kal-3', 'কালিমা তামজীদ। সুবহানাল্লাহি ওয়াল হামদুলিল্লাহি ওয়া লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার, ওয়া লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহিল আলিয়্যিল আজীম। আল্লাহ অতি পবিত্র, সমস্ত প্রশংসা আল্লাহর, আল্লাহ ছাড়া কোনো উপাস্য নেই এবং আল্লাহ সর্বশ্রেষ্ঠ।', 'Kalima Tamjeed. Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.'),
    ('kal-4', 'কালিমা তাওহীদ। লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ইউহয়ী ওয়া ইউমীতু, বিয়াদিহিল খাইরু, ওয়া হুয়া আলা কুল্লি শাইয়িন ক্বাদীর। আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি এক, রাজত্ব ও সমস্ত প্রশংসা একমাত্র তাঁরই।', 'Kalima Tawheed. There is no god but Allah, He is One, to Him belongs all sovereignty and praise.')
]

# 6. Prayers & Pillars
PRAYERS_DATA = [
    ('pr-1', 'ফজর নামাজ। ভোরবেলার শান্ত নামাজ, দুই রাকাত ফরজ।', 'Fajr prayer at dawn.'),
    ('pr-2', 'জোহর নামাজ। দুপুরের নামাজ, চার রাকাত ফরজ।', 'Dhuhr prayer at noon.'),
    ('pr-3', 'আসর নামাজ। বিকেলের নামাজ, চার রাকাত ফরজ।', 'Asr prayer in the afternoon.'),
    ('pr-4', 'মাগরিব নামাজ। সন্ধ্যার নামাজ, তিন রাকাত ফরজ।', 'Maghrib prayer at sunset.'),
    ('pr-5', 'এশা নামাজ। রাতের প্রশান্ত নামাজ, চার রাকাত ফরজ।', 'Isha prayer at night.'),
    ('pil-1', 'ইসলামের প্রথম স্তম্ভ: ঈমান ও শাহাদাহ—আল্লাহ এক ও মুহাম্মাদ সাঃ তাঁর রাসুল।', '1st Pillar: Shahadah.'),
    ('pil-2', 'ইসলামের দ্বিতীয় স্তম্ভ: সালাত—প্রতিদিন পাঁচ ওয়াক্ত নামাজ আদায় করা।', '2nd Pillar: Salah.'),
    ('pil-3', 'ইসলামের তৃতীয় স্তম্ভ: সাওম—পবিত্র রমাদান মাসে রোজা রাখা।', '3rd Pillar: Sawm.'),
    ('pil-4', 'ইসলামের চতুর্থ স্তম্ভ: যাকাত—গরিবদের সাহায্য ও দান করা।', '4th Pillar: Zakah.'),
    ('pil-5', 'ইসলামের পঞ্চম স্তম্ভ: হজ—পবিত্র মক্কার কাবা ঘরে হজ পালন।', '5th Pillar: Hajj.'),
    ('wudu-1', 'অজুর প্রথম ধাপ: বিসমিল্লাহ বলে দুই হাত কবজি পর্যন্ত ৩ বার ধোয়া।', 'Step 1 of Wudu: Wash hands.'),
    ('wudu-2', 'অজুর দ্বিতীয় ধাপ: ৩ বার কুলি করা ও নাকে পানি দিয়ে পরিষ্কার করা।', 'Step 2: Rinse mouth and nose.'),
    ('wudu-3', 'অজুর তৃতীয় ধাপ: পুরো মুখমণ্ডল ৩ বার সুন্দর করে ধোয়া।', 'Step 3: Wash entire face.'),
    ('wudu-4', 'অজুর চতুর্থ ধাপ: দুই হাত কনুই পর্যন্ত ধোয়া ও ভেজা হাতে মাথা মাসেহ করা।', 'Step 4: Wash arms and wipe head.'),
    ('wudu-5', 'অজুর পঞ্চম ধাপ: দুই পা টাখনু পর্যন্ত ৩ বার ধোয়া। মাশাআল্লাহ অজু সম্পন্ন হলো!', 'Step 5: Wash feet. Wudu complete!')
]

# 7. Nature & Creation
NATURE_DATA = [
    ('nat-1', 'উট। মরুভূমির শান্ত ও ধৈর্যশীল প্রাণী উট।', 'Camel. Patient creature of the desert.'),
    ('nat-2', 'বিড়াল। নবীজির প্রিয় মিষ্টি পোষা প্রাণী বিড়াল। মিঁউ মিঁউ!', 'Cat. Gentle sweet pet.'),
    ('nat-3', 'মৌমাছি। ফুলের মধু সংগ্রহকারী উপকারী মৌমাছি। ভন ভন!', 'Honeybee making sweet honey.'),
    ('nat-4', 'পাখি। গাছের ডালে মিষ্টি সুরে গান গেয়ে আল্লাহর প্রশংসা করে।', 'Sweet singing bird in the tree.'),
    ('nat-5', 'ভেড়া। নরম পশমের শান্ত ও মিষ্টি ভেড়া। ম্যা ম্যা!', 'Gentle woolly sheep.'),
    ('nat-6', 'তিমি মাছ। সাগরের বিশাল ও রহস্যময় প্রাণী তিমি মাছ।', 'Great whale in the deep ocean.'),
    ('nat-7', 'খেজুর। সুন্নতি অত্যন্ত পুষ্টিকর ও মিষ্টি ফল খেজুর।', 'Blessed sweet dates of Sunnah.'),
    ('nat-8', 'জলপাই। কুরআনে বর্ণিত বরকতময় পবিত্র ফল জলপাই।', 'Blessed olive mentioned in Quran.'),
    ('nat-9', 'ডুমুর বা ত্বীন ফল। সূরা ত্বীনে বর্ণিত মিষ্টি ডুমুর ফল।', 'Sweet fig fruit of Surah At-Teen.'),
    ('nat-10', 'বেদানা বা ডালিম। জান্নাতী ফল সুস্বাদু লাল টকটকে ডালিম।', 'Delicious pomegranate of Jannah.'),
    ('nat-11', 'আঙুর। আল্লাহর নিয়ামত মিষ্টি রসালো আঙুর ফল।', 'Sweet juicy grapes.'),
    ('nat-12', 'কলা। জান্নাতী তালহ গাছ ও পুষ্টিকর সুস্বাদু কলা।', 'Delicious nutritious banana.'),
    ('nat-13', 'উজ্জ্বল সূর্য। আমাদের আলো ও উষ্ণতা দেয় সুন্দর সোনালী সূর্য।', 'Bright warm sun giving light to Earth.'),
    ('nat-14', 'রুপালী চাঁদ। রাতের আকাশে স্নিগ্ধ আলো ছড়ায় সুন্দর চাঁদ।', 'Peaceful moon shining in the night sky.'),
    ('nat-15', 'বৃষ্টি ও মেঘ। রহমতের শীতল মিষ্টি বৃষ্টি যা পৃথিবীকে সতেজ করে।', 'Merciful rain reviving green plants.'),
    ('nat-16', 'রংধনু। বৃষ্টির পরে আকাশে সাত রঙের অপূর্ব সুন্দর রংধনু।', 'Seven beautiful colors of rainbow.')
]

def generate_openai_tts(text, voice, out_path, api_key):
    url = "https://api.openai.com/v1/audio/speech"
    payload = json.dumps({
        "model": "tts-1-hd",
        "input": text,
        "voice": voice, # 'nova' (cheerful female), 'shimmer' (warm female), or 'alloy'
        "speed": 0.95
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req) as resp:
            audio_bytes = resp.read()
            with open(out_path, "wb") as f:
                f.write(audio_bytes)
            print(f"[OpenAI HD] Saved: {out_path}")
            return True
    except Exception as e:
        print(f"Error generating {out_path}: {e}")
        return False

def generate_elevenlabs_tts(text, voice_id, out_path, api_key):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.35,
            "use_speaker_boost": True
        }
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header("xi-api-key", api_key)
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req) as resp:
            audio_bytes = resp.read()
            with open(out_path, "wb") as f:
                f.write(audio_bytes)
            print(f"[ElevenLabs] Saved: {out_path}")
            return True
    except Exception as e:
        print(f"Error generating {out_path}: {e}")
        return False

def build_all_items():
    items = []
    # 1. Arabic
    for aid, char, name_bn, word_ar, word_bn, meaning in ARABIC_DATA:
        items.append((f"{name_bn}। {word_bn}—{meaning}।", f"assets/audio/arabic/{aid}.mp3"))
    # 2. Bangla
    for bid, char, name_bn, meaning in BANGLA_DATA:
        items.append((f"{char}। {name_bn}—{meaning}।", f"assets/audio/bangla/{bid}.mp3"))
    # 3. English
    for eid, char, name_en, meaning in ENGLISH_DATA:
        items.append((f"{char}, for {name_en}. {meaning}.", f"assets/audio/english/{eid}.mp3"))
    # 4. Numbers
    for num, w_bn, m_bn, w_en, m_en, w_ar in NUMBERS_DATA:
        items.append((f"{w_bn}। {m_bn}।", f"assets/audio/numbers/num-bn-{num}.mp3"))
        items.append((f"{w_en}. {m_en}.", f"assets/audio/numbers/num-en-{num}.mp3"))
        items.append((f"{w_ar}", f"assets/audio/numbers/num-ar-{num}.mp3"))
    # 5. Duas
    for did, text_bn, text_en in DUAS_DATA:
        items.append((text_bn, f"assets/audio/duas/{did}.mp3"))
    # 5.1. Kalimas
    for kid, text_bn, text_en in KALIMA_DATA:
        items.append((text_bn, f"assets/audio/kalima/{kid}.mp3"))
    # 6. Prayers & Pillars
    for pid, text_bn, text_en in PRAYERS_DATA:
        items.append((text_bn, f"assets/audio/prayers/{pid}.mp3"))
    # 7. Nature
    for nid, text_bn, text_en in NATURE_DATA:
        items.append((text_bn, f"assets/audio/nature/{nid}.mp3"))
    return items

if __name__ == "__main__":
    openai_key = os.environ.get("OPENAI_API_KEY")
    eleven_key = os.environ.get("ELEVEN_API_KEY") or os.environ.get("ELEVENLABS_API_KEY")

    if not openai_key and not eleven_key:
        print("Please provide OPENAI_API_KEY or ELEVEN_API_KEY to run studio generation.")
        sys.exit(1)

    items = build_all_items()
    print(f"Total clips to generate: {len(items)}")

    for idx, (text, out_path) in enumerate(items):
        if os.path.exists(out_path) and os.path.getsize(out_path) > 3000:
            continue
        if eleven_key:
            # Default ElevenLabs high quality friendly voice (e.g. Rachel / 21m00Tcm4TlvDq8ikWAM)
            voice_id = os.environ.get("ELEVEN_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
            generate_elevenlabs_tts(text, voice_id, out_path, eleven_key)
        elif openai_key:
            # OpenAI TTS HD with 'nova' (warm, energetic female voice)
            generate_openai_tts(text, "nova", out_path, openai_key)
