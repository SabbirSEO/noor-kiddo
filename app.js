/**
 * Noor Kiddo (নূর কিডো) - Playful Islamic Learning Magnet Board
 * Built for Toddlers & Playgroup (Ages 2-6)
 */

(function () {
  'use strict';

  // ==================== APPLICATION STATE ====================
  const state = {
    lang: 'bn', // 'bn' | 'en' | 'ar'
    activeShelf: 'arabic', // 'arabic' | 'bangla' | 'english' | 'numbers' | 'duas' | 'prayers' | 'nature' | 'game'
    activeSubFilter: 'all',
    selectedItem: null,
    audioEnabled: true,
    stars: 0,
    seenItems: new Set(),
    quiz: {
      active: false,
      round: 1,
      totalRounds: 10,
      score: 0,
      targetItem: null,
      choices: []
    }
  };

  // ==================== SOUND SYNTHESIZER (Web Audio API) ====================
  class SoundEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTapChime() {
      if (!state.audioEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }

    playPop() {
      if (!state.audioEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    playSuccessChord() {
      if (!state.audioEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord (C5, E5, G5, C6)

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    }

    playWiggleSound() {
      if (!state.audioEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    playFanfare() {
      if (!state.audioEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const sequence = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.50, d: 0.35 }
      ];

      let t = now;
      sequence.forEach((item) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + item.d);
        t += item.d + 0.04;
      });
    }
  }

  const sound = new SoundEngine();

  // ==================== NATURAL STUDIO AUDIO PLAYER ====================
  class AudioPlayer {
    constructor() {
      this.currentAudio = null;
    }

    play(src, fallbackText = null, fallbackLang = 'bn') {
      if (!state.audioEnabled) return;

      // Stop previous audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (src) {
        const audio = new Audio(src);
        this.currentAudio = audio;
        audio.play().catch(err => {
          console.log('Audio file playback fallback to speech:', err);
          if (fallbackText) {
            speech.speak(fallbackText, fallbackLang);
          }
        });
      } else if (fallbackText) {
        speech.speak(fallbackText, fallbackLang);
      }
    }

    stop() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    }
  }

  const audioPlayer = new AudioPlayer();

  // ==================== SPEECH ENGINE (Web Speech API Fallback) ====================
  class SpeechEngine {
    speak(text, lang = 'bn-BD') {
      if (!state.audioEnabled || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85; // Slightly slower and gentle for toddlers
      utter.pitch = 1.15; // Cheerful friendly pitch

      if (lang === 'bn') utter.lang = 'bn-BD';
      else if (lang === 'ar') utter.lang = 'ar-SA';
      else utter.lang = 'en-US';

      // Enhanced voice detection for natural/premium voices
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => (v.lang.startsWith(utter.lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Enhanced')))) || voices.find(v => v.lang.startsWith(utter.lang.slice(0, 2)));
      if (matchingVoice) {
        utter.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utter);
    }
  }

  const speech = new SpeechEngine();

  // ==================== DATA COLLECTIONS ====================

  // 1. ARABIC HAROF (আরবি হরফ)
  const ARABIC_LETTERS = [
    { id: 'ar-1', char: 'ا', name: 'Alif', nameBn: 'আলিফ', wordAr: 'اَللّٰه', wordBn: 'আল্লাহ', wordEn: 'Allah', emoji: '🕋', meaningBn: 'আমাদের সৃষ্টিকর্তা ও প্রতিপালক', meaningEn: 'The One Almighty God, our Creator', theme: 'emerald' },
    { id: 'ar-2', char: 'ب', name: 'Baa', nameBn: 'বা', wordAr: 'بَيْتُ اللّٰه', wordBn: 'বাইতুল্লাহ', wordEn: 'Baytullah (Kabah)', emoji: '🕋', meaningBn: 'আল্লাহর পবিত্র ঘর (কাবা)', meaningEn: 'The Sacred House of Allah (Kabah)', theme: 'amber' },
    { id: 'ar-3', char: 'ت', name: 'Taa', nameBn: 'তা', wordAr: 'تَوْبَة', wordBn: 'তাওবাহ', wordEn: 'Tawbah', emoji: '🤲', meaningBn: 'আল্লাহর কাছে ক্ষমা প্রার্থনা', meaningEn: 'Repentance & asking Allah for forgiveness', theme: 'sky' },
    { id: 'ar-4', char: 'ث', name: 'Thaa', nameBn: 'ছা', wordAr: 'ثَوَاب', wordBn: 'সাওয়াব', wordEn: 'Sawab', emoji: '🌟', meaningBn: 'ভালো কাজের নেক পুরস্কার', meaningEn: 'Reward for good deeds', theme: 'violet' },
    { id: 'ar-5', char: 'ج', name: 'Jeem', nameBn: 'জীম', wordAr: 'جَنَّة', wordBn: 'জান্নাত', wordEn: 'Jannah', emoji: '🌺', meaningBn: 'সুন্দর চিরস্থায়ী বাগান ও পুরস্কার', meaningEn: 'Paradise, the eternal garden', theme: 'teal' },
    { id: 'ar-6', char: 'ح', name: 'Haa', nameBn: 'হা', wordAr: 'حَجّ', wordBn: 'হজ', wordEn: 'Hajj', emoji: '🕋', meaningBn: 'পবিত্র মক্কায় হজ পালন', meaningEn: 'Pilgrimage to Makkah', theme: 'emerald' },
    { id: 'ar-7', char: 'خ', name: 'Khaa', nameBn: 'খা', wordAr: 'خَيْر', wordBn: 'খায়ের (কল্যাণ)', wordEn: 'Khayr (Goodness)', emoji: '✨', meaningBn: 'সকল ভালো ও মঙ্গল কাজ', meaningEn: 'All goodness and righteousness', theme: 'amber' },
    { id: 'ar-8', char: 'د', name: 'Daal', nameBn: 'দাল', wordAr: 'دُعَاء', wordBn: 'দু’আ', wordEn: 'Dua', emoji: '🤲', meaningBn: 'আল্লাহর কাছে মোনাজাত ও প্রার্থনা', meaningEn: 'Supplication to Allah', theme: 'sky' },
    { id: 'ar-9', char: 'ذ', name: 'Dhaal', nameBn: 'যাল', wordAr: 'ذِكْر', wordBn: 'জিকির', wordEn: 'Dhikr', emoji: '📿', meaningBn: 'আল্লাহর স্মরণ ও প্রশংসা করা', meaningEn: 'Remembrance of Allah', theme: 'violet' },
    { id: 'ar-10', char: 'ر', name: 'Raa', nameBn: 'রা', wordAr: 'رَمَضَان', wordBn: 'রমাদান', wordEn: 'Ramadan', emoji: '🌙', meaningBn: 'পবিত্র বরকতময় রোজার মাস', meaningEn: 'Blessed month of fasting', theme: 'teal' },
    { id: 'ar-11', char: 'ز', name: 'Zay', nameBn: 'যা', wordAr: 'زَكَاة', wordBn: 'যাকাত', wordEn: 'Zakah', emoji: '🪙', meaningBn: 'গরিবদের সাহায্য ও দান করা', meaningEn: 'Charity & helping the needy', theme: 'emerald' },
    { id: 'ar-12', char: 'س', name: 'Seen', nameBn: 'সীন', wordAr: 'سَلَام', wordBn: 'সালাম', wordEn: 'Salam', emoji: '🤝', meaningBn: 'শান্তি ও শুভেচ্ছা বিনিময়', meaningEn: 'Peace & greeting of Islam', theme: 'amber' },
    { id: 'ar-13', char: 'ش', name: 'Sheen', nameBn: 'শীন', wordAr: 'شُكْر', wordBn: 'শুকর (ধন্যবাদ)', wordEn: 'Shukr (Gratitude)', emoji: '💖', meaningBn: 'আল্লাহর নেয়ামতের কৃতজ্ঞতা', meaningEn: 'Gratitude and thankfulness to Allah', theme: 'sky' },
    { id: 'ar-14', char: 'ص', name: 'Saad', nameBn: 'সোয়াদ', wordAr: 'صَلَاة', wordBn: 'সালাত (নামাজ)', wordEn: 'Salah (Prayer)', emoji: '🕌', meaningBn: 'দৈনিক ৫ ওয়াক্ত নামাজ', meaningEn: 'Daily 5 times prayer', theme: 'violet' },
    { id: 'ar-15', char: 'ض', name: 'Daad', nameBn: 'দোয়াদ', wordAr: 'ضِيَاء', wordBn: 'দিয়া (আলো)', wordEn: 'Diyaa (Light)', emoji: '💡', meaningBn: 'সৎ পথের উজ্জ্বল আলো', meaningEn: 'Guiding bright light', theme: 'teal' },
    { id: 'ar-16', char: 'ط', name: 'Taa', nameBn: 'তোয়া', wordAr: 'طَيِّب', wordBn: 'তায়্যিব (পবিত্র)', wordEn: 'Tayyib (Pure)', emoji: '🌿', meaningBn: 'উত্তম, হালাল ও পবিত্র জিনিস', meaningEn: 'Pure, wholesome and good', theme: 'emerald' },
    { id: 'ar-17', char: 'ظ', name: 'Zaa', nameBn: 'জোয়া', wordAr: 'ظِلّ', wordBn: 'জিল্ল (ছায়া)', wordEn: 'Zill (Shade)', emoji: '🌴', meaningBn: 'গাছের শীতল ছায়া', meaningEn: 'Pleasant cooling shade', theme: 'amber' },
    { id: 'ar-18', char: 'ع', name: 'Ayn', nameBn: 'আইন', wordAr: 'عِلْم', wordBn: 'ইলম (জ্ঞান)', wordEn: 'Ilm (Knowledge)', emoji: '📚', meaningBn: 'কুরআন ও হাদিসের কল্যাণকর জ্ঞান', meaningEn: 'Beneficial knowledge of Islam', theme: 'sky' },
    { id: 'ar-19', char: 'غ', name: 'Ghayn', nameBn: 'গাইন', wordAr: 'غَفُور', wordBn: 'গফুর (ক্ষমাশীল)', wordEn: 'Ghafoor (Forgiving)', emoji: '🌈', meaningBn: 'আল্লাহ পরম ক্ষমাশীল', meaningEn: 'Allah, The All-Forgiving', theme: 'violet' },
    { id: 'ar-20', char: 'ف', name: 'Faa', nameBn: 'ফা', wordAr: 'فَجْر', wordBn: 'ফজর', wordEn: 'Fajr', emoji: '🌅', meaningBn: 'ভোরের প্রথম নামাজ', meaningEn: 'The dawn prayer of every morning', theme: 'teal' },
    { id: 'ar-21', char: 'ق', name: 'Qaaf', nameBn: 'ক্বাফ', wordAr: 'قُرْآن', wordBn: 'কুরআন', wordEn: 'Quran', emoji: '📖', meaningBn: 'আল্লাহর পবিত্র বাণী ও হেদায়েত', meaningEn: 'The Holy Quran, word of Allah', theme: 'emerald' },
    { id: 'ar-22', char: 'ك', name: 'Kaaf', nameBn: 'কাফ', wordAr: 'كَعْبَة', wordBn: 'কা’বা শরীফ', wordEn: 'Kabah', emoji: '🕋', meaningBn: 'আমাদের কেবলা ও পবিত্র কাবা', meaningEn: 'The sacred Kaaba in Makkah', theme: 'amber' },
    { id: 'ar-23', char: 'ل', name: 'Laam', nameBn: 'লাম', wordAr: 'لَيْل', wordBn: 'লাইল (রাত)', wordEn: 'Layl (Night)', emoji: '🌌', meaningBn: 'তারার আলোয় সুন্দর রাত', meaningEn: 'The peaceful night sky', theme: 'sky' },
    { id: 'ar-24', char: 'م', name: 'Meem', nameBn: 'মীম', wordAr: 'مَسْجِد', wordBn: 'মসজিদ', wordEn: 'Masjid', emoji: '🕌', meaningBn: 'আল্লাহর ঘর ও নামাজের স্থান', meaningEn: 'Masjid, place of worship', theme: 'violet' },
    { id: 'ar-25', char: 'ن', name: 'Noon', nameBn: 'নূন', wordAr: 'نُور', wordBn: 'নূর (আলো)', wordEn: 'Noor (Divine Light)', emoji: '☀️', meaningBn: 'ঈমানের পবিত্র নূর ও আলো', meaningEn: 'The divine light of faith', theme: 'teal' },
    { id: 'ar-26', char: 'هـ', name: 'Haa', nameBn: 'হা', wordAr: 'هُدَى', wordBn: 'হুদা (সৎপথ)', wordEn: 'Huda (Guidance)', emoji: '🧭', meaningBn: 'সঠিক ও সত্য পথের সন্ধান', meaningEn: 'True divine guidance', theme: 'emerald' },
    { id: 'ar-27', char: 'و', name: 'Waaw', nameBn: 'ওয়াও', wordAr: 'وُضُوء', wordBn: 'ওযু', wordEn: 'Wudu', emoji: '💧', meaningBn: 'পবিত্র পানির সুন্দর অজু', meaningEn: 'Ablution for prayer', theme: 'amber' },
    { id: 'ar-28', char: 'ي', name: 'Yaa', nameBn: 'ইয়া', wordAr: 'يَسِير', wordBn: 'ইয়াসীর (সহজ)', wordEn: 'Yaseer (Easy)', emoji: '🌸', meaningBn: 'আল্লাহ আমাদের জন্য সব সহজ করুন', meaningEn: 'Ease & blessings from Allah', theme: 'sky' }
  ];

  // 2. BANGLA BORNOMALA (বাংলা বর্ণমালা)
  const BANGLA_LETTERS = [
    // স্বরবর্ণ
    { id: 'bn-1', char: 'অ', type: 'vowel', nameBn: 'অজু', nameEn: 'Wudu', emoji: '💧', meaningBn: 'নামাজের আগে সুন্দর অজু করি', meaningEn: 'Perform wudu before salah', theme: 'emerald' },
    { id: 'bn-2', char: 'আ', type: 'vowel', nameBn: 'আল্লাহ', nameEn: 'Allah', emoji: '🕋', meaningBn: 'আল্লাহ আমাদের একমাত্র রব', meaningEn: 'Allah is our Creator', theme: 'amber' },
    { id: 'bn-3', char: 'ই', type: 'vowel', nameBn: 'ইবাদত', nameEn: 'Ibadah', emoji: '🤲', meaningBn: 'আল্লাহর সন্তুষ্টির জন্য ইবাদত', meaningEn: 'Worship Allah sincerely', theme: 'sky' },
    { id: 'bn-4', char: 'ঈ', type: 'vowel', nameBn: 'ঈদ', nameEn: 'Eid', emoji: '🌙', meaningBn: 'ঈদের আনন্দের মিষ্টি দিন', meaningEn: 'Joyful celebration of Eid', theme: 'rose' },
    { id: 'bn-5', char: 'উ', type: 'vowel', nameBn: 'উট', nameEn: 'Camel', emoji: '🐫', meaningBn: 'মরুভূমির সুন্দর প্রাণী উট', meaningEn: 'Camel in the desert', theme: 'violet' },
    { id: 'bn-6', char: 'ঊ', type: 'vowel', nameBn: 'ঊষা', nameEn: 'Dawn', emoji: '🌅', meaningBn: 'ভোরের লাল সূর্য ও ফজর', meaningEn: 'The peaceful dawn sky', theme: 'teal' },
    { id: 'bn-7', char: 'ঋ', type: 'vowel', nameBn: 'ঋতু', nameEn: 'Season', emoji: '🍂', meaningBn: 'আল্লাহর সৃষ্টির সুন্দর ঋতু', meaningEn: 'Beautiful seasons of Allah', theme: 'emerald' },
    { id: 'bn-8', char: 'এ', type: 'vowel', nameBn: 'একতা', nameEn: 'Unity', emoji: '🤝', meaningBn: 'আমরা সবাই মুসলিম ভাই-বোন', meaningEn: 'Muslim unity and love', theme: 'amber' },
    { id: 'bn-9', char: 'ঐ', type: 'vowel', nameBn: 'ঐক্য', nameEn: 'Harmony', emoji: '🌟', meaningBn: 'সবাই মিলেমিশে থাকা সুন্দর', meaningEn: 'Living in harmony and peace', theme: 'sky' },
    { id: 'bn-10', char: 'ও', type: 'vowel', nameBn: 'ওহী', nameEn: 'Revelation', emoji: '📜', meaningBn: 'আল্লাহর প্রেরিত পবিত্র ওহী', meaningEn: 'Divine revelation from Allah', theme: 'violet' },
    { id: 'bn-11', char: 'ঔ', type: 'vowel', nameBn: 'ঔষধ', nameEn: 'Medicine', emoji: '💊', meaningBn: 'রোগ হলে দোয়া ও ঔষধ খাই', meaningEn: 'Dua and medicine for healing', theme: 'teal' },

    // ব্যঞ্জনবর্ণ
    { id: 'bn-12', char: 'ক', type: 'consonant', nameBn: 'কুরআন', nameEn: 'Quran', emoji: '📖', meaningBn: 'পবিত্র কুরআন প্রতিদিন পড়ি', meaningEn: 'Read Quran every day', theme: 'emerald' },
    { id: 'bn-13', char: 'খ', type: 'consonant', nameBn: 'খেজুর', nameEn: 'Dates', emoji: '🌴', meaningBn: 'সুন্নতি সুস্বাদু মিষ্টি খেজুর', meaningEn: 'Blessed dates of Sunnah', theme: 'amber' },
    { id: 'bn-14', char: 'গ', type: 'consonant', nameBn: 'গোলাপ', nameEn: 'Rose', emoji: '🌹', meaningBn: 'আল্লাহর সৃষ্টি সুন্দর সুবাসিত ফুল', meaningEn: 'Fragrant rose created by Allah', theme: 'rose' },
    { id: 'bn-15', char: 'ঘ', type: 'consonant', nameBn: 'ঘড়ি', nameEn: 'Clock', emoji: '⏰', meaningBn: 'সময়মতো ৫ ওয়াক্ত নামাজ পড়ব', meaningEn: 'Pray 5 daily prayers on time', theme: 'sky' },
    { id: 'bn-16', char: 'ঙ', type: 'consonant', nameBn: 'রঙধনু', nameEn: 'Rainbow', emoji: '🌈', meaningBn: 'আকাশে সাত রঙের সুন্দর রংধনু', meaningEn: 'Seven-colored rainbow in the sky', theme: 'violet' },
    { id: 'bn-17', char: 'চ', type: 'consonant', nameBn: 'চাঁদ', nameEn: 'Moon', emoji: '🌙', meaningBn: 'রমাদানের সুন্দর বাঁকা চাঁদ', meaningEn: 'Crescent moon of Ramadan', theme: 'teal' },
    { id: 'bn-18', char: 'ছ', type: 'consonant', nameBn: 'ছাতা', nameEn: 'Umbrella', emoji: '☂️', meaningBn: 'বৃষ্টির সময় ছাতা ব্যবহার করি', meaningEn: 'Rain umbrella for protection', theme: 'emerald' },
    { id: 'bn-19', char: 'জ', type: 'consonant', nameBn: 'জান্নাত', nameEn: 'Jannah', emoji: '🌺', meaningBn: 'ভালো কাজের জন্য চিরসুখের জান্নাত', meaningEn: 'Everlasting Jannah', theme: 'amber' },
    { id: 'bn-20', char: 'ঝ', type: 'consonant', nameBn: 'ঝরনা', nameEn: 'Waterfall', emoji: '🏞️', meaningBn: 'পাহাড়ের শীতল পানির ঝরনা', meaningEn: 'Refreshing mountain stream', theme: 'sky' },
    { id: 'bn-21', char: 'ঞ', type: 'consonant', nameBn: 'মিঞা', nameEn: 'Friend', emoji: '🐱', meaningBn: 'বিড়াল ছানা ও মিষ্টি পাখি', meaningEn: 'Cute animal and pet', theme: 'rose' },
    { id: 'bn-22', char: 'ট', type: 'consonant', nameBn: 'টুপি', nameEn: 'Prayer Cap', emoji: '🧢', meaningBn: 'নামাজের সময় মাথায় পরি টুপি', meaningEn: 'Prayer cap for salah', theme: 'violet' },
    { id: 'bn-23', char: 'ঠ', type: 'consonant', nameBn: 'ঠোঁট', nameEn: 'Lips', emoji: '👄', meaningBn: 'ঠোঁট দিয়ে সুন্দর মিষ্টি কথা বলি', meaningEn: 'Speak good and kind words', theme: 'teal' },
    { id: 'bn-24', char: 'ড', type: 'consonant', nameBn: 'ডালিম', nameEn: 'Pomegranate', emoji: '🍎', meaningBn: 'জান্নাতের সুস্বাদু ফল ডালিম', meaningEn: 'Pomegranate of Jannah', theme: 'emerald' },
    { id: 'bn-25', char: 'ঢ', type: 'consonant', nameBn: 'ঢাকনা', nameEn: 'Cover', emoji: '🍲', meaningBn: 'খাবার সবসময় ঢেকে রাখি', meaningEn: 'Keep food covered as Sunnah', theme: 'amber' },
    { id: 'bn-26', char: 'ণ', type: 'consonant', nameBn: 'হরিণ', nameEn: 'Deer', emoji: '🦌', meaningBn: 'সবুজ বনের মায়াবী হরিণ', meaningEn: 'Gentle deer in the forest', theme: 'sky' },
    { id: 'bn-27', char: 'ত', type: 'consonant', nameBn: 'তাসবীহ', nameEn: 'Tasbeeh', emoji: '📿', meaningBn: 'আল্লাহর জিকির ও তাসবীহ পড়ি', meaningEn: 'Tasbeeh for dhikr of Allah', theme: 'rose' },
    { id: 'bn-28', char: 'থ', type: 'consonant', nameBn: 'থালা', nameEn: 'Plate', emoji: '🍽️', meaningBn: 'ডান হাতে খাবার খাই', meaningEn: 'Eat with the right hand', theme: 'violet' },
    { id: 'bn-29', char: 'দ', type: 'consonant', nameBn: 'দু’আ', nameEn: 'Dua', emoji: '🤲', meaningBn: 'সবকিছুতে আল্লাহর কাছে চাই', meaningEn: 'Ask everything from Allah', theme: 'teal' },
    { id: 'bn-30', char: 'ধ', type: 'consonant', nameBn: 'ধন্যবাদ', nameEn: 'Thank you', emoji: '💐', meaningBn: 'উপকার পেলে জাযাকাল্লাহ বলি', meaningEn: 'Say JazakAllah Khayr', theme: 'emerald' },
    { id: 'bn-31', char: 'ন', type: 'consonant', nameBn: 'নামাজ', nameEn: 'Salah', emoji: '🕌', meaningBn: 'প্রতিদিন পাঁচ ওয়াক্ত নামাজ', meaningEn: 'Pray 5 daily prayers', theme: 'amber' },
    { id: 'bn-32', char: 'প', type: 'consonant', nameBn: 'পাখি', nameEn: 'Bird', emoji: '🐦', meaningBn: 'গাছের ডালে মিষ্টি পাখি গায়', meaningEn: 'Sweet singing bird', theme: 'sky' },
    { id: 'bn-33', char: 'ফ', type: 'consonant', nameBn: 'ফল', nameEn: 'Fruit', emoji: '🍉', meaningBn: 'আল্লাহর নিয়ামত মিষ্টি মিষ্টি ফল', meaningEn: 'Delicious fruits of Allah', theme: 'rose' },
    { id: 'bn-34', char: 'ব', type: 'consonant', nameBn: 'বিসমিল্লাহ', nameEn: 'Bismillah', emoji: '🌸', meaningBn: 'সব কাজের শুরুতে বিসমিল্লাহ', meaningEn: 'Begin in the name of Allah', theme: 'violet' },
    { id: 'bn-35', char: 'ভ', type: 'consonant', nameBn: 'ভালোবাসা', nameEn: 'Love', emoji: '❤️', meaningBn: 'বাবা-মা ও সবাইকে ভালোবাসি', meaningEn: 'Love parents and family', theme: 'teal' },
    { id: 'bn-36', char: 'ম', type: 'consonant', nameBn: 'মসজিদ', nameEn: 'Masjid', emoji: '🕌', meaningBn: 'আল্লাহর ঘর পবিত্র মসজিদ', meaningEn: 'The house of Allah', theme: 'emerald' },
    { id: 'bn-37', char: 'য', type: 'consonant', nameBn: 'যমযম', nameEn: 'Zamzam', emoji: '💧', meaningBn: 'মক্কার বরকতময় পবিত্র পানি', meaningEn: 'Blessed water of Zamzam', theme: 'amber' },
    { id: 'bn-38', char: 'র', type: 'consonant', nameBn: 'রব', nameEn: 'Lord (Rab)', emoji: '👑', meaningBn: 'আল্লাহ আমাদের একমাত্র রব', meaningEn: 'Allah is our Lord', theme: 'sky' },
    { id: 'bn-39', char: 'ল', type: 'consonant', nameBn: 'লাব্বাইক', nameEn: 'Labbayk', emoji: '🕋', meaningBn: 'হজের মধুর সুর লাব্বাইক', meaningEn: 'Labbayk of Hajj', theme: 'rose' },
    { id: 'bn-40', char: 'শ', type: 'consonant', nameBn: 'শুকরিয়া', nameEn: 'Gratitude', emoji: '💖', meaningBn: 'সবসময় আলহামদুলিল্লাহ বলি', meaningEn: 'Say Alhamdulillah always', theme: 'violet' },
    { id: 'bn-41', char: 'ষ', type: 'consonant', nameBn: 'ষাঁড়', nameEn: 'Bull', emoji: '🐂', meaningBn: 'কোরবানির পশু ও খামার', meaningEn: 'Cattle and sacrificial animals', theme: 'teal' },
    { id: 'bn-42', char: 'স', type: 'consonant', nameBn: 'সালাম', nameEn: 'Salam', emoji: '🤝', meaningBn: 'দেখা হলেই সালাম বিনিময় করি', meaningEn: 'Spread peaceful greetings', theme: 'emerald' },
    { id: 'bn-43', char: 'হ', type: 'consonant', nameBn: 'হজ', nameEn: 'Hajj', emoji: '🕋', meaningBn: 'পবিত্র মক্কার হজ পালন', meaningEn: 'Pilgrimage to Makkah', theme: 'amber' },
    { id: 'bn-44', char: 'ড়', type: 'consonant', nameBn: 'ঘুড়ি', nameEn: 'Kite', emoji: '🪁', meaningBn: 'নীল আকাশে উড়ে রঙিন ঘুড়ি', meaningEn: 'Colorful kite in the sky', theme: 'sky' },
    { id: 'bn-45', char: 'ঢ়', type: 'consonant', nameBn: 'আষাঢ়', nameEn: 'Rainy Month', emoji: '🌧️', meaningBn: 'বৃষ্টিতে গাছে পানি জমে', meaningEn: 'Rain pouring from clouds', theme: 'violet' },
    { id: 'bn-46', char: 'য়', type: 'consonant', nameBn: 'ময়না', nameEn: 'Myna Bird', emoji: '🦜', meaningBn: 'কথা বলা সুন্দর ময়না পাখি', meaningEn: 'Singing myna bird', theme: 'teal' },
    { id: 'bn-47', char: 'ৎ', type: 'consonant', nameBn: 'সৎ কাজ', nameEn: 'Good Deed', emoji: '🌟', meaningBn: 'সবার সাথে ভালো ব্যবহার করি', meaningEn: 'Do good deeds for all', theme: 'emerald' },
    { id: 'bn-48', char: 'ং', type: 'consonant', nameBn: 'রং', nameEn: 'Color', emoji: '🎨', meaningBn: 'আল্লাহর রঙে রঙিন পৃথিবী', meaningEn: 'Colors of Allah’s world', theme: 'amber' },
    { id: 'bn-49', char: 'ঃ', type: 'consonant', nameBn: 'দুঃখী', nameEn: 'Help Needy', emoji: '🤲', meaningBn: 'দুঃখীদের সাহায্য করা সাওয়াব', meaningEn: 'Helping the poor is charity', theme: 'sky' },
    { id: 'bn-50', char: 'ঁ', type: 'consonant', nameBn: 'হাঁস', nameEn: 'Duck', emoji: '🦆', meaningBn: 'পুকুরের জলে ভাসে সাদা হাঁস', meaningEn: 'Duck swimming in the pond', theme: 'rose' }
  ];

  // 3. ENGLISH ABC (Islamic Alphabet)
  const ENGLISH_LETTERS = [
    { id: 'en-1', char: 'A', nameEn: 'Allah', nameBn: 'আল্লাহ', emoji: '🕋', meaningBn: 'আল্লাহ আমাদের সৃষ্টিকর্তা', meaningEn: 'Allah is the Creator of all things', theme: 'emerald' },
    { id: 'en-2', char: 'B', nameEn: 'Bismillah', nameBn: 'বিসমিল্লাহ', emoji: '🌸', meaningBn: 'আল্লাহর নামে শুরু করি', meaningEn: 'In the name of Allah', theme: 'amber' },
    { id: 'en-3', char: 'C', nameEn: 'Crescent', nameBn: 'বাঁকা চাঁদ', emoji: '🌙', meaningBn: 'রমাদান ও ঈদের নতুন চাঁদ', meaningEn: 'Crescent moon of Ramadan and Eid', theme: 'sky' },
    { id: 'en-4', char: 'D', nameEn: 'Dua', nameBn: 'দু’আ', emoji: '🤲', meaningBn: 'আল্লাহর কাছে প্রার্থনা', meaningEn: 'Supplication and talking to Allah', theme: 'rose' },
    { id: 'en-5', char: 'E', nameEn: 'Eid', nameBn: 'ঈদ', emoji: '🎉', meaningBn: 'ঈদের খুশির পবিত্র উৎসব', meaningEn: 'Joyous Muslim celebration', theme: 'violet' },
    { id: 'en-6', char: 'F', nameEn: 'Fajr', nameBn: 'ফজর', emoji: '🌅', meaningBn: 'ভোরের বরকতময় নামাজ', meaningEn: 'Dawn prayer of the morning', theme: 'teal' },
    { id: 'en-7', char: 'G', nameEn: 'Good Deeds', nameBn: 'নেক আমল', emoji: '🌟', meaningBn: 'ভালো কাজ ও মানুষকে সাহায্য', meaningEn: 'Doing good deeds and helping others', theme: 'emerald' },
    { id: 'en-8', char: 'H', nameEn: 'Hajj', nameBn: 'হজ', emoji: '🕋', meaningBn: 'পবিত্র মক্কার হজ', meaningEn: 'Pilgrimage to holy Makkah', theme: 'amber' },
    { id: 'en-9', char: 'I', nameEn: 'Islam', nameBn: 'ইসলাম', emoji: '🕊️', meaningBn: 'শান্তি ও কল্যাণের ধর্ম', meaningEn: 'The religion of peace and submission', theme: 'sky' },
    { id: 'en-10', char: 'J', nameEn: 'Jannah', nameBn: 'জান্নাত', emoji: '🌺', meaningBn: 'অনন্ত সুখের জান্নাত', meaningEn: 'Paradise and eternal reward', theme: 'rose' },
    { id: 'en-11', char: 'K', nameEn: 'Kabah', nameBn: 'কাবা শরীফ', emoji: '🕋', meaningBn: 'আমাদের কেবলা কাবা ঘর', meaningEn: 'The Holy Kabah in Makkah', theme: 'violet' },
    { id: 'en-12', char: 'L', nameEn: 'Lantern', nameBn: 'ফানুস / বাতি', emoji: '🏮', meaningBn: 'রমাদানের সুন্দর আলোক বাতি', meaningEn: 'Bright Ramadan lantern', theme: 'teal' },
    { id: 'en-13', char: 'M', nameEn: 'Masjid', nameBn: 'মসজিদ', emoji: '🕌', meaningBn: 'আল্লাহর ঘর ও নামাজের স্থান', meaningEn: 'Mosque, place of worship', theme: 'emerald' },
    { id: 'en-14', char: 'N', nameEn: 'Niyyah', nameBn: 'নিয়ত', emoji: '💖', meaningBn: 'ভালো কাজের খাঁটি নিয়ত', meaningEn: 'Pure intention in the heart', theme: 'amber' },
    { id: 'en-15', char: 'O', nameEn: 'Olive', nameBn: 'জলপাই', emoji: '🫒', meaningBn: 'কুরআনে বর্ণিত বরকতময় জলপাই', meaningEn: 'Blessed olive mentioned in Quran', theme: 'sky' },
    { id: 'en-16', char: 'P', nameEn: 'Prayer (Salah)', nameBn: 'সালাত / নামাজ', emoji: '🕌', meaningBn: 'দৈনিক ৫ ওয়াক্ত নামাজ', meaningEn: 'Daily five obligatory prayers', theme: 'rose' },
    { id: 'en-17', char: 'Q', nameEn: 'Quran', nameBn: 'পবিত্র কুরআন', emoji: '📖', meaningBn: 'আল্লাহর পবিত্র বাণী', meaningEn: 'The Holy Quran, book of guidance', theme: 'violet' },
    { id: 'en-18', char: 'R', nameEn: 'Ramadan', nameBn: 'রমাদান', emoji: '🌙', meaningBn: 'পবিত্র বরকতময় রোজার মাস', meaningEn: 'Month of fasting and blessing', theme: 'teal' },
    { id: 'en-19', char: 'S', nameEn: 'Salam', nameBn: 'সালাম', emoji: '🤝', meaningBn: 'আসসালামু আলাইকুম বলা', meaningEn: 'Greeting with peace', theme: 'emerald' },
    { id: 'en-20', char: 'T', nameEn: 'Tasbeeh', nameBn: 'তাসবীহ', emoji: '📿', meaningBn: 'সুবহানাল্লাহ জিকির', meaningEn: 'Remembering Allah with Tasbeeh', theme: 'amber' },
    { id: 'en-21', char: 'U', nameEn: 'Ummah', nameBn: 'উম্মাহ', emoji: '🌍', meaningBn: 'বিশ্বের সকল মুসলিম এক উম্মাহ', meaningEn: 'Global brotherhood and Muslim community', theme: 'sky' },
    { id: 'en-22', char: 'V', nameEn: 'Virtue', nameBn: 'সততা ও ভদ্রতা', emoji: '✨', meaningBn: 'সবসময় সত্য কথা বলা', meaningEn: 'Good character and honesty', theme: 'rose' },
    { id: 'en-23', char: 'W', nameEn: 'Wudu', nameBn: 'অজু', emoji: '💧', meaningBn: 'পবিত্র পানি দিয়ে অজু', meaningEn: 'Ablution and cleanliness', theme: 'violet' },
    { id: 'en-24', char: 'X', nameEn: 'Xtra Charity', nameBn: 'দান-সদকা', emoji: '🎁', meaningBn: 'গরিবদের বেশি বেশি দান করা', meaningEn: 'Giving charity to the needy', theme: 'teal' },
    { id: 'en-25', char: 'Y', nameEn: 'Yaseen', nameBn: 'সূরা ইয়াসীন', emoji: '📜', meaningBn: 'কুরআনের সুন্দর সূরা ইয়াসীন', meaningEn: 'Surah Yaseen of the Quran', theme: 'emerald' },
    { id: 'en-26', char: 'Z', nameEn: 'Zakah', nameBn: 'যাকাত', emoji: '🪙', meaningBn: 'গরিবের হক ও পবিত্র দান', meaningEn: 'Obligatory charity for poor', theme: 'amber' }
  ];

  // 4. NUMBERS & COUNTING (১-২০ গণনা)
  const NUMBERS_DATA = [
    { num: 1, charBn: '১', charEn: '1', charAr: '١', wordBn: 'এক', wordEn: 'One', wordAr: 'وَاحِد', itemEmoji: '🕋', itemNameBn: 'একটি কাবা শরীফ', itemNameEn: 'One Holy Kabah', theme: 'emerald' },
    { num: 2, charBn: '২', charEn: '2', charAr: '٢', wordBn: 'দুই', wordEn: 'Two', wordAr: 'اِثْنَان', itemEmoji: '🤲', itemNameBn: 'দুটি হাত দিয়ে দু’আ', itemNameEn: 'Two hands in prayer', theme: 'amber' },
    { num: 3, charBn: '৩', charEn: '3', charAr: '٣', wordBn: 'তিন', wordEn: 'Three', wordAr: 'ثَلَاثَة', itemEmoji: '🌴', itemNameBn: 'তিনটি মিষ্টি খেজুর', itemNameEn: 'Three sweet dates', theme: 'sky' },
    { num: 4, charBn: '৪', charEn: '4', charAr: '٤', wordBn: 'চার', wordEn: 'Four', wordAr: 'أَرْبَعَة', itemEmoji: '📖', itemNameBn: 'চারটি পবিত্র আসমানী কিতাব', itemNameEn: 'Four holy divine books', theme: 'rose' },
    { num: 5, charBn: '৫', charEn: '5', charAr: '٥', wordBn: 'পাঁচ', wordEn: 'Five', wordAr: 'خَمْسَة', itemEmoji: '🕌', itemNameBn: 'পাঁচ ওয়াক্ত নামাজ ও ইসলামের ৫ ভিত্তি', itemNameEn: 'Five daily prayers and 5 pillars', theme: 'violet' },
    { num: 6, charBn: '৬', charEn: '6', charAr: '٦', wordBn: 'ছয়', wordEn: 'Six', wordAr: 'سِتَّة', itemEmoji: '⭐', itemNameBn: 'ছয়টি ঈমানের মূল স্তম্ভ', itemNameEn: 'Six articles of faith', theme: 'teal' },
    { num: 7, charBn: '৭', charEn: '7', charAr: '٧', wordBn: 'সাত', wordEn: 'Seven', wordAr: 'سَبْعَة', itemEmoji: '🌈', itemNameBn: 'সাতটি সুন্দর আসমান', itemNameEn: 'Seven beautiful heavens', theme: 'emerald' },
    { num: 8, charBn: '৮', charEn: '8', charAr: '٨', wordBn: 'আট', wordEn: 'Eight', wordAr: 'ثَمَانِيَة', itemEmoji: '🌺', itemNameBn: 'জান্নাতের আটটি দরজা', itemNameEn: 'Eight gates of Jannah', theme: 'amber' },
    { num: 9, charBn: '৯', charEn: '9', charAr: '٩', wordBn: 'নয়', wordEn: 'Nine', wordAr: 'تِسْعَة', itemEmoji: '🏮', itemNameBn: 'নয়টি আলোকিত ফানুস', itemNameEn: 'Nine bright lanterns', theme: 'sky' },
    { num: 10, charBn: '১০', charEn: '10', charAr: '١٠', wordBn: 'দশ', wordEn: 'Ten', wordAr: 'عَشَرَة', itemEmoji: '📿', itemNameBn: 'দশটি তাসবীহের দানা', itemNameEn: 'Ten prayer beads', theme: 'rose' },
    { num: 11, charBn: '১১', charEn: '11', charAr: '١١', wordBn: 'এগারো', wordEn: 'Eleven', wordAr: 'أَحَدَ عَشَرَ', itemEmoji: '🌙', itemNameBn: 'এগারোটি রুপালী চাঁদ', itemNameEn: 'Eleven silver moons', theme: 'violet' },
    { num: 12, charBn: '১২', charEn: '12', charAr: '١٢', wordBn: 'বারো', wordEn: 'Twelve', wordAr: 'اِثْنَا عَشَرَ', itemEmoji: '🗓️', itemNameBn: 'বছরের বারোটি ইসলামিক মাস', itemNameEn: 'Twelve Islamic months', theme: 'teal' },
    { num: 13, charBn: '১৩', charEn: '13', charAr: '١٣', wordBn: 'তেরো', wordEn: 'Thirteen', wordAr: 'ثَلَاثَةَ عَشَرَ', itemEmoji: '🍎', itemNameBn: 'তেরোটি মিষ্টি ফল', itemNameEn: 'Thirteen sweet apples', theme: 'emerald' },
    { num: 14, charBn: '১৪', charEn: '14', charAr: '١٤', wordBn: 'চৌদ্দ', wordEn: 'Fourteen', wordAr: 'أَرْبَعَةَ عَشَرَ', itemEmoji: '✨', itemNameBn: 'চৌদ্দটি উজ্জ্বল নক্ষত্র', itemNameEn: 'Fourteen glowing stars', theme: 'amber' },
    { num: 15, charBn: '১৫', charEn: '15', charAr: '١٥', wordBn: 'পনেরো', wordEn: 'Fifteen', wordAr: 'خَمْسَةَ عَشَرَ', itemEmoji: '🕊️', itemNameBn: 'পনেরোটি সাদা শান্তির পায়রা', itemNameEn: 'Fifteen peaceful doves', theme: 'sky' },
    { num: 16, charBn: '১৬', charEn: '16', charAr: '١٦', wordBn: 'ষোলো', wordEn: 'Sixteen', wordAr: 'سِتَّةَ عَشَرَ', itemEmoji: '🌷', itemNameBn: 'ষোলোটি রঙিন টিউলিপ ফুল', itemNameEn: 'Sixteen tulip flowers', theme: 'rose' },
    { num: 17, charBn: '১৭', charEn: '17', charAr: '١٧', wordBn: 'সতেরো', wordEn: 'Seventeen', wordAr: 'سَبْعَةَ عَشَرَ', itemEmoji: '🕌', itemNameBn: 'প্রতিদিন ১৭ রাকাত ফরজ নামাজ', itemNameEn: 'Seventeen fard rakats of prayer', theme: 'violet' },
    { num: 18, charBn: '১৮', charEn: '18', charAr: '١٨', wordBn: 'আঠারো', wordEn: 'Eighteen', wordAr: 'ثَمَانِيَةَ عَشَرَ', itemEmoji: '🍯', itemNameBn: 'আঠারো ফোঁটা খাঁটি মধু', itemNameEn: 'Eighteen drops of honey', theme: 'teal' },
    { num: 19, charBn: '১৯', charEn: '19', charAr: '١٩', wordBn: 'উনিশ', wordEn: 'Nineteen', wordAr: 'تِسْعَةَ عَشَرَ', itemEmoji: '🫒', itemNameBn: 'উনিশটি সুস্বাদু জলপাই', itemNameEn: 'Nineteen blessed olives', theme: 'emerald' },
    { num: 20, charBn: '২০', charEn: '20', charAr: '٢٠', wordBn: 'বিশ', wordEn: 'Twenty', wordAr: 'عِشْرُونَ', itemEmoji: '🎁', itemNameBn: 'বিশটি সুন্দর উপহার', itemNameEn: 'Twenty wonderful gifts', theme: 'amber' }
  ];

  // 5. DAILY DUAS & KALIMAS (দৈনন্দিন দো’আ ও কালিমা)
  const DUAS_DATA = [
    {
      id: 'dua-1',
      titleBn: 'খাওয়ার শুরুর দো’আ',
      titleEn: 'Before Eating',
      arabic: 'بِسْمِ اللّٰهِ',
      translit: 'Bismillah',
      meaningBn: 'আল্লাহর নামে শুরু করছি।',
      meaningEn: 'In the name of Allah I begin.',
      emoji: '🍎',
      theme: 'emerald'
    },
    {
      id: 'dua-2',
      titleBn: 'খাওয়ার শেষের দো’আ',
      titleEn: 'After Eating',
      arabic: 'اَلْحَمْدُ لِلّٰهِ',
      translit: 'Alhamdulillah',
      meaningBn: 'সমস্ত প্রশংসা একমাত্র আল্লাহর, যিনি আমাদের খাওয়ালেন ও পান করালেন।',
      meaningEn: 'All praise is for Allah who fed us and gave us drink.',
      emoji: '🍽️',
      theme: 'amber'
    },
    {
      id: 'dua-3',
      titleBn: 'ঘুম থেকে ওঠার দো’আ',
      titleEn: 'Waking Up',
      arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا',
      translit: 'Alhamdulillahi-lladhi ahyana ba\'da ma amatana',
      meaningBn: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের ঘুম থেকে নতুন জীবন দিলেন।',
      meaningEn: 'All praise to Allah Who gave us life after giving us sleep.',
      emoji: '☀️',
      theme: 'sky'
    },
    {
      id: 'dua-4',
      titleBn: 'সালাম বিনিময়',
      titleEn: 'Saying Salam',
      arabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
      translit: 'Assalamu Alaikum wa Rahmatullah',
      meaningBn: 'আপনার ওপর আল্লাহর শান্তি ও রহমত বর্ষিত হোক।',
      meaningEn: 'May peace and mercy of Allah be upon you.',
      emoji: '🤝',
      theme: 'rose'
    },
    {
      id: 'dua-5',
      titleBn: 'কালিমা তায়্যিবাহ',
      titleEn: 'Kalima Tayyibah',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُولُ اللّٰهِ',
      translit: 'La ilaha illallah, Muhammadur Rasulullah',
      meaningBn: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, মুহাম্মাদ (সা.) আল্লাহর রাসুল।',
      meaningEn: 'There is no god but Allah, Muhammad (pbuh) is His Messenger.',
      emoji: '🕋',
      theme: 'violet'
    },
    {
      id: 'dua-6',
      titleBn: 'সুন্দর কিছু দেখলে',
      titleEn: 'When Seeing Beauty',
      arabic: 'مَا شَاءَ اللّٰهُ / سُبْحَانَ اللّٰهِ',
      translit: 'MashaAllah / SubhanAllah',
      meaningBn: 'আল্লাহ যা চেয়েছেন তাই হয়েছে / আল্লাহ কতই না পবিত্র ও মহান!',
      meaningEn: 'What Allah has willed! / Glory be to Allah the Almighty!',
      emoji: '🌸',
      theme: 'teal'
    },
    {
      id: 'dua-7',
      titleBn: 'হাঁচি দিলে ও শুনলে',
      titleEn: 'Sneezing Etiquette',
      arabic: 'اَلْحَمْدُ لِلّٰهِ ➔ يَرْحَمُكَ اللّٰهُ',
      translit: 'Alhamdulillah ➔ Yarhamukallah',
      meaningBn: 'হাঁচি দিয়ে ‘আলহামদুলিল্লাহ’ বলা এবং শুনলে ‘ইয়ারহামুকাল্লাহ’ বলা।',
      meaningEn: 'Say Alhamdulillah when sneezing; reply Yarhamukallah.',
      emoji: '🤧',
      theme: 'emerald'
    },
    {
      id: 'dua-8',
      titleBn: 'জ্ঞান বৃদ্ধির দো’আ',
      titleEn: 'Dua for Knowledge',
      arabic: 'رَبِّ زِدْنِي عِلْمًا',
      translit: 'Rabbi Zidni Ilma',
      meaningBn: 'হে আমার প্রতিপালক! আমার জ্ঞান বাড়িয়ে দিন।',
      meaningEn: 'O my Lord! Increase me in knowledge and wisdom.',
      emoji: '📚',
      theme: 'amber'
    }
  ];

  // 5.1. FOUR KALIMAS (৪ কালিমা)
  const KALIMA_DATA = [
    {
      id: 'kal-1',
      titleBn: '১. কালিমা তাইয়্যেবাহ',
      titleEn: '1. Kalima Tayyibah',
      subtitleBn: 'পবিত্র কালিমা (Kalima of Purity)',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُولُ اللّٰهِ',
      translit: 'La ilaha illallah, Muhammadur Rasulullah',
      meaningBn: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, মুহাম্মাদ (সা.) আল্লাহর রাসুল।',
      meaningEn: 'There is no god but Allah, Muhammad (pbuh) is the Messenger of Allah.',
      emoji: '🕋',
      theme: 'emerald'
    },
    {
      id: 'kal-2',
      titleBn: '২. কালিমা শাহাদাত',
      titleEn: '2. Kalima Shahadat',
      subtitleBn: 'সাক্ষ্যদানের কালিমা (Kalima of Testimony)',
      arabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      translit: "Ash-hadu alla ilaha illallahu wahdahu la sharika lahu, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh",
      meaningBn: 'আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরিক নেই। এবং আরও সাক্ষ্য দিচ্ছি যে, নিশ্চয়ই মুহাম্মাদ (সা.) তাঁর বান্দা ও রাসুল।',
      meaningEn: 'I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger.',
      emoji: '☝️',
      theme: 'sky'
    },
    {
      id: 'kal-3',
      titleBn: '৩. কালিমা তামজীদ',
      titleEn: '3. Kalima Tamjeed',
      subtitleBn: 'শ্রেষ্ঠত্ব ও প্রশংসার কালিমা (Kalima of Glory)',
      arabic: 'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ',
      translit: "Subhanallahi wal hamdulillahi wa la ilaha illallahu wallahu akbar, wa la hawla wa la quwwata illa billahil 'aliyyil 'azeem",
      meaningBn: 'আল্লাহ অতি পবিত্র, সমস্ত প্রশংসা আল্লাহর, আল্লাহ ছাড়া কোনো উপাস্য নেই এবং আল্লাহ সর্বশ্রেষ্ঠ। মহান আল্লাহর সাহায্য ছাড়া পাপ থেকে বাঁচার এবং সৎ কাজ করার কোনো ক্ষমতা নেই।',
      meaningEn: 'Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest. There is no power or might except with Allah, the Most High, the Supreme.',
      emoji: '📿',
      theme: 'amber'
    },
    {
      id: 'kal-4',
      titleBn: '৪. কালিমা তাওহীদ',
      titleEn: '4. Kalima Tawheed',
      subtitleBn: 'একত্ববাদের কালিমা (Kalima of Oneness)',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      translit: "La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu, yuhyee wa yumeetu, biyadihil khayru, wa huwa 'ala kulli shay'in qadeer",
      meaningBn: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরিক নেই। রাজত্ব একমাত্র তাঁরই এবং সমস্ত প্রশংসাও তাঁরই। তিনিই জীবন ও মৃত্যু দেন, সমস্ত কল্যাণ তাঁরই হাতে এবং তিনি সকল কিছুর ওপর সর্বশক্তিমান।',
      meaningEn: 'There is no god but Allah, alone without partner. To Him belongs sovereignty and praise. He gives life and causes death, in His hand is all good, and He has power over all things.',
      emoji: '🌟',
      theme: 'rose'
    }
  ];

  // 6. PRAYERS & PILLARS & WUDU (নামাজ ও রুকন)
  const PRAYERS_PILLARS = [
    // 5 Prayers
    { id: 'pr-1', type: 'salah', titleBn: '১. ফজর (Fajr)', titleEn: 'Fajr Prayer', timeBn: 'ভোরবেলার শান্ত নামাজ (সূর্য ওঠার আগে)', timeEn: 'Dawn prayer before sunrise', emoji: '🌅', rakatBn: '২ রাকাত ফরজ', rakatEn: '2 Rakats Fard', theme: 'sky' },
    { id: 'pr-2', type: 'salah', titleBn: '২. জোহর (Dhuhr)', titleEn: 'Dhuhr Prayer', timeBn: 'দুপুরের নামাজ (সূর্য হেলে পড়ার পর)', timeEn: 'Noon prayer after sun crosses zenith', emoji: '☀️', rakatBn: '৪ রাকাত ফরজ', rakatEn: '4 Rakats Fard', theme: 'amber' },
    { id: 'pr-3', type: 'salah', titleBn: '৩. আসর (Asr)', titleEn: 'Asr Prayer', timeBn: 'বিকেলের নামাজ (সূর্যাস্তের আগে)', timeEn: 'Afternoon prayer before sunset', emoji: '🌤️', rakatBn: '৪ রাকাত ফরজ', rakatEn: '4 Rakats Fard', theme: 'teal' },
    { id: 'pr-4', type: 'salah', titleBn: '৪. মাগরিব (Maghrib)', titleEn: 'Maghrib Prayer', timeBn: 'সন্ধ্যার নামাজ (সূর্য ডোবার পরপরই)', timeEn: 'Evening prayer right after sunset', emoji: '🌇', rakatBn: '৩ রাকাত ফরজ', rakatEn: '3 Rakats Fard', theme: 'rose' },
    { id: 'pr-5', type: 'salah', titleBn: '৫. এশা (Isha)', titleEn: 'Isha Prayer', timeBn: 'রাতের প্রশান্ত নামাজ', timeEn: 'Night prayer before sleeping', emoji: '🌌', rakatBn: '৪ রাকাত ফরজ', rakatEn: '4 Rakats Fard', theme: 'violet' },

    // 5 Pillars
    { id: 'pil-1', type: 'pillar', titleBn: '১. ঈমান ও শাহাদাহ', titleEn: '1. Shahadah (Faith)', timeBn: 'আল্লাহর একত্ববাদ ও রাসুল (সা.)-এ বিশ্বাস', timeEn: 'Belief in One God Allah & His Messenger', emoji: '☝️', rakatBn: 'ইসলামের প্রথম ভিত্তি', rakatEn: '1st Pillar of Islam', theme: 'emerald' },
    { id: 'pil-2', type: 'pillar', titleBn: '২. সালাত (নামাজ)', titleEn: '2. Salah (Prayer)', timeBn: 'প্রতিদিন পাঁচ ওয়াক্ত নামাজ আদায় করা', timeEn: 'Establishing 5 daily prayers', emoji: '🕌', rakatBn: 'ইসলামের দ্বিতীয় ভিত্তি', rakatEn: '2nd Pillar of Islam', theme: 'sky' },
    { id: 'pil-3', type: 'pillar', titleBn: '৩. সাওম (রোজা)', titleEn: '3. Sawm (Fasting)', timeBn: 'পবিত্র রমাদান মাসে রোজা রাখা', timeEn: 'Fasting during the month of Ramadan', emoji: '🌙', rakatBn: 'ইসলামের তৃতীয় ভিত্তি', rakatEn: '3rd Pillar of Islam', theme: 'amber' },
    { id: 'pil-4', type: 'pillar', titleBn: '৪. যাকাত (দান)', titleEn: '4. Zakah (Charity)', timeBn: 'গরিবদের হক আদায় ও দান করা', timeEn: 'Giving charity to the needy and poor', emoji: '🪙', rakatBn: 'ইসলামের চতুর্থ ভিত্তি', rakatEn: '4th Pillar of Islam', theme: 'rose' },
    { id: 'pil-5', type: 'pillar', titleBn: '৫. হজ (Hajj)', titleEn: '5. Hajj (Pilgrimage)', timeBn: 'সামর্থ্যবানদের জন্য মক্কার পবিত্র হজ', timeEn: 'Pilgrimage to Makkah once in lifetime', emoji: '🕋', rakatBn: 'ইসলামের পঞ্চম ভিত্তি', rakatEn: '5th Pillar of Islam', theme: 'violet' },

    // 5 Wudu Steps
    { id: 'wudu-1', type: 'wudu', titleBn: '১. নিয়ত ও হাত ধোয়া', titleEn: '1. Wash Hands', timeBn: 'বিসমিল্লাহ বলে দুই হাত কবজি পর্যন্ত ৩ বার ধোয়া', timeEn: 'Say Bismillah and wash hands up to wrists 3 times', emoji: '🤲', rakatBn: 'অজুর প্রথম ধাপ', rakatEn: 'Step 1 of Wudu', theme: 'teal' },
    { id: 'wudu-2', type: 'wudu', titleBn: '২. কুলি ও নাকে পানি', titleEn: '2. Rinse Mouth & Nose', timeBn: '৩ বার সুন্দরভাবে কুলি করা ও নাকে পানি দিয়ে পরিষ্কার', timeEn: 'Rinse mouth and clean nose with water 3 times', emoji: '💧', rakatBn: 'অজুর দ্বিতীয় ধাপ', rakatEn: 'Step 2 of Wudu', theme: 'sky' },
    { id: 'wudu-3', type: 'wudu', titleBn: '৩. মুখমণ্ডল ধোয়া', titleEn: '3. Wash Entire Face', timeBn: 'পুরো মুখমণ্ডল কপাল থেকে থুতনি পর্যন্ত ৩ বার ধোয়া', timeEn: 'Wash entire face from forehead to chin 3 times', emoji: '😊', rakatBn: 'অজুর তৃতীয় ধাপ', rakatEn: 'Step 3 of Wudu', theme: 'emerald' },
    { id: 'wudu-4', type: 'wudu', titleBn: '৪. কনুই পর্যন্ত হাত ও মাথা মাসেহ', titleEn: '4. Arms & Wipe Head', timeBn: 'দুই হাত কনুই পর্যন্ত ধোয়া ও ভেজা হাতে মাথা মাসেহ', timeEn: 'Wash arms up to elbows and gently wipe head', emoji: '💆', rakatBn: 'অজুর চতুর্থ ধাপ', rakatEn: 'Step 4 of Wudu', theme: 'amber' },
    { id: 'wudu-5', type: 'wudu', titleBn: '৫. দুই পা টাখনু পর্যন্ত ধোয়া', titleEn: '5. Wash Both Feet', timeBn: 'ডান পা ও বাম পা গোড়ালি-টাখনু পর্যন্ত ৩ বার ধোয়া', timeEn: 'Wash right and left feet up to ankles 3 times', emoji: '🦶', rakatBn: 'অজু সম্পন্ন হলো ✨', rakatEn: 'Step 5: Wudu Complete ✨', theme: 'rose' }
  ];

  // 7. ALLAH'S CREATION (আল্লাহর সুন্দর সৃষ্টি - Animals, Fruits & Nature)
  const NATURE_CREATION = [
    // Animals
    { id: 'nat-1', category: 'animal', nameBn: 'উট', nameEn: 'Camel', nameAr: 'جَمَل', emoji: '🐫', descBn: 'আল্লাহর অপূর্ব সৃষ্টি মরুভূমির ধৈর্যশীল উট', descEn: 'Patient camel created by Allah', soundHint: 'উটের ডাক', theme: 'amber' },
    { id: 'nat-2', category: 'animal', nameBn: 'বিড়াল', nameEn: 'Cat', nameAr: 'قِطَّة', emoji: '🐱', descBn: 'আমাদের প্রিয় নবীজির প্রিয় মিষ্টি পোষা প্রাণী বিড়াল', descEn: 'Loving, gentle cat loved by Prophet (pbuh)', soundHint: 'মিঁউ মিঁউ', theme: 'sky' },
    { id: 'nat-3', category: 'animal', nameBn: 'মৌমাছি', nameEn: 'Honeybee', nameAr: 'نَحْلَة', emoji: '🐝', descBn: 'কুরআনে বর্ণিত উপকারী মৌমাছি—যা মিষ্টি মধু বানায়', descEn: 'Honeybee producing healing sweet honey', soundHint: 'ভন ভন', theme: 'emerald' },
    { id: 'nat-4', category: 'animal', nameBn: 'পাখি', nameEn: 'Bird', nameAr: 'طَائِر', emoji: '🐦', descBn: 'গাছের ডালে মিষ্টি সুরে গান গেয়ে আল্লাহর প্রশংসা করে', descEn: 'Bird singing praises to Allah', soundHint: 'কূজন ও গান', theme: 'rose' },
    { id: 'nat-5', category: 'animal', nameBn: 'ভেড়া', nameEn: 'Sheep', nameAr: 'خَرُوف', emoji: '🐑', descBn: 'কোমল পশমের শান্ত ও মিষ্টি ভেড়া', descEn: 'Gentle woolly sheep', soundHint: 'ম্যা ম্যা', theme: 'violet' },
    { id: 'nat-6', category: 'animal', nameBn: 'তিমি মাছ', nameEn: 'Whale', nameAr: 'حُوت', emoji: '🐋', descBn: 'ইউনুস (আ.)-এর মাছ ও গভীর সাগরের রহস্যময় সৃষ্টি', descEn: 'Great whale of Prophet Yunus (as)', soundHint: 'সাগরের ঢেউ', theme: 'teal' },

    // Blessed Fruits Mentioned in Quran
    { id: 'nat-7', category: 'fruit', nameBn: 'খেজুর', nameEn: 'Date', nameAr: 'تَمْر', emoji: '🌴', descBn: 'সুন্নতি অত্যন্ত পুষ্টিকর ও মিষ্টি ফল খেজুর', descEn: 'Nutritious and blessed Sunnah dates', soundHint: 'মিষ্টি স্বাদ', theme: 'amber' },
    { id: 'nat-8', category: 'fruit', nameBn: 'জলপাই', nameEn: 'Olive', nameAr: 'زَيْتُون', emoji: '🫒', descBn: 'কুরআনে শপথকৃত বরকতময় পবিত্র ফল জলপাই', descEn: 'Blessed olive tree mentioned in Quran', soundHint: 'বরকতময়', theme: 'emerald' },
    { id: 'nat-9', category: 'fruit', nameBn: 'ডুমুর (ত্বীন)', nameEn: 'Fig (Teen)', nameAr: 'تِين', emoji: '🫐', descBn: 'পবিত্র কুরআনের সূরা ত্বীনে বর্ণিত মিষ্টি ডুমুর ফল', descEn: 'Sweet fig fruit of Surah At-Teen', soundHint: 'সুস্বাদু', theme: 'violet' },
    { id: 'nat-10', category: 'fruit', nameBn: 'বেদানা / ডালিম', nameEn: 'Pomegranate', nameAr: 'رُمَّان', emoji: '🍎', descBn: 'জান্নাতী ফল সুস্বাদু লাল টকটকে ডালিম', descEn: 'Ruby red pomegranate of Jannah', soundHint: 'রসালো', theme: 'rose' },
    { id: 'nat-11', category: 'fruit', nameBn: 'আঙুর', nameEn: 'Grapes', nameAr: 'عِنَب', emoji: '🍇', descBn: 'আল্লাহর নিয়ামত মিষ্টি রসালো আঙুর ফল', descEn: 'Sweet juicy grapes created by Allah', soundHint: 'মিষ্টি আঙুর', theme: 'teal' },
    { id: 'nat-12', category: 'fruit', nameBn: 'কলা', nameEn: 'Banana', nameAr: 'مَوْز', emoji: '🍌', descBn: 'জান্নাতের তালহ গাছ ও মজাদার পুষ্টিকর কলা', descEn: 'Delicious nutritious banana', soundHint: 'শক্তিদায়ক', theme: 'amber' },

    // Beautiful Cosmos & Nature
    { id: 'nat-13', category: 'nature', nameBn: 'উজ্জ্বল সূর্য', nameEn: 'Bright Sun', nameAr: 'شَمْس', emoji: '☀️', descBn: 'আমাদের জন্য আলো ও উষ্ণতা দেয় সোনালী সূর্য', descEn: 'Warm bright sun giving light to Earth', soundHint: 'দিনের আলো', theme: 'amber' },
    { id: 'nat-14', category: 'nature', nameBn: 'রুপালী চাঁদ', nameEn: 'Silver Moon', nameAr: 'قَمَر', emoji: '🌙', descBn: 'রাতের আকাশে স্নিগ্ধ আলো ছড়ায় সুন্দর চাঁদ', descEn: 'Peaceful moon shining in the night', soundHint: 'শীতল আলো', theme: 'sky' },
    { id: 'nat-15', category: 'nature', nameBn: 'বৃষ্টি ও মেঘ', nameEn: 'Rain & Clouds', nameAr: 'مَطَر', emoji: '🌧️', descBn: 'রহমতের শীতল মিষ্টি বৃষ্টি যা পৃথিবীকে সতেজ করে', descEn: 'Merciful rain reviving green plants', soundHint: 'বৃষ্টির শব্দ', theme: 'teal' },
    { id: 'nat-16', category: 'nature', nameBn: 'রংধনু', nameEn: 'Rainbow', nameAr: 'قَوْسُ قُزَح', emoji: '🌈', descBn: 'বৃষ্টির পরে আকাশে সাত রঙের অপূর্ব রংধনু', descEn: 'Seven beautiful colors of rainbow', soundHint: 'রঙিন সৌন্দর্য', theme: 'violet' }
  ];

  // ==================== CONFETTI REWARD ENGINE ====================
  class ConfettiEngine {
    constructor() {
      this.canvas = document.getElementById('confetti-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    }

    burst() {
      if (!this.canvas || !this.ctx) return;
      this.resize();
      const colors = ['#10B981', '#F59E0B', '#0EA5E9', '#F43F5E', '#8B5CF6', '#14B8A6', '#FCD34D'];

      for (let i = 0; i < 90; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 100,
          y: this.canvas.height / 2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 1.2) * 16,
          size: Math.random() * 9 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          life: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }

      if (!this.animId) {
        this.animate();
      }
    }

    animate() {
      if (!this.ctx || this.particles.length === 0) {
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animId = null;
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.life);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(() => this.animate());
    }
  }

  const confetti = new ConfettiEngine();

  // ==================== UI RENDERING & CONTROLLER ====================

  const UI = {
    elements: {
      starCountDisplay: document.getElementById('star-count-display'),
      starBadge: document.getElementById('star-badge'),
      audioToggleBtn: document.getElementById('audio-toggle-btn'),
      audioIcon: document.getElementById('audio-icon'),
      langBtns: document.querySelectorAll('.lang-btn'),
      shelfTabs: document.querySelectorAll('.shelf-tab'),
      subFilterBar: document.getElementById('sub-filter-bar'),
      magnetGrid: document.getElementById('magnet-grid'),
      gameContainer: document.getElementById('game-container'),
      stageSection: document.getElementById('stage-section'),
      stageCard: document.getElementById('stage-card'),
      stageSymbolBubble: document.getElementById('stage-symbol-bubble'),
      stageSymbol: document.getElementById('stage-symbol'),
      stageEmoji: document.getElementById('stage-emoji'),
      stageCategoryPill: document.getElementById('stage-category-pill'),
      stagePhonetic: document.getElementById('stage-phonetic'),
      stagePrimaryWord: document.getElementById('stage-primary-word'),
      stageMeaning: document.getElementById('stage-meaning'),
      stageVisualTray: document.getElementById('stage-visual-tray'),
      stageSoundBtn: document.getElementById('stage-sound-btn'),
      soundLabelText: document.getElementById('sound-label-text'),
      appTitleText: document.getElementById('app-title-text'),
      appSubtitleText: document.getElementById('app-subtitle-text'),
      footerHint: document.getElementById('footer-hint'),

      // Game UI elements
      gameRoundNum: document.getElementById('game-round-num'),
      gameScoreNum: document.getElementById('game-score-num'),
      gamePromptText: document.getElementById('game-prompt-text'),
      gamePromptIcon: document.getElementById('game-prompt-icon'),
      gameRepeatBtn: document.getElementById('game-repeat-btn'),
      gameChoicesGrid: document.getElementById('game-choices-grid'),
      gameFeedbackBanner: document.getElementById('game-feedback-banner'),
      feedbackText: document.getElementById('feedback-text'),

      // Parent Drawer
      parentDrawerToggle: document.getElementById('parent-drawer-toggle'),
      parentDrawer: document.getElementById('parent-drawer'),
      drawerBackdrop: document.getElementById('drawer-backdrop'),
      drawerCloseBtn: document.getElementById('drawer-close-btn'),
      currTabs: document.querySelectorAll('.curr-tab'),
      currTabContents: document.querySelectorAll('.curr-tab-content'),
      statsTotalStars: document.getElementById('stats-total-stars'),
      statsExploredCount: document.getElementById('stats-explored-count'),
      progressPercentage: document.getElementById('progress-percentage'),
      progressFillBar: document.getElementById('progress-fill-bar'),
      resetProgressBtn: document.getElementById('reset-progress-btn'),
      curriculumCheckboxes: document.querySelectorAll('.curriculum-item-check input')
    },

    init() {
      this.loadStorage();
      this.bindEvents();
      this.renderShelf(state.activeShelf);
      this.updateStats();
    },

    loadStorage() {
      try {
        const savedStars = localStorage.getItem('noor_kiddo_stars');
        if (savedStars !== null) state.stars = parseInt(savedStars, 10) || 0;

        const savedSeen = localStorage.getItem('noor_kiddo_seen');
        if (savedSeen) state.seenItems = new Set(JSON.parse(savedSeen));

        const savedLang = localStorage.getItem('noor_kiddo_lang');
        if (savedLang && ['bn', 'en', 'ar'].includes(savedLang)) state.lang = savedLang;

        // Load curriculum checkboxes
        const savedChecks = localStorage.getItem('noor_kiddo_curriculum');
        if (savedChecks) {
          const checkMap = JSON.parse(savedChecks);
          this.elements.curriculumCheckboxes.forEach(cb => {
            const id = cb.getAttribute('data-currid');
            if (checkMap[id]) cb.checked = true;
          });
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      this.updateStarUI();
      this.updateLangButtons();
    },

    saveStorage() {
      try {
        localStorage.setItem('noor_kiddo_stars', state.stars.toString());
        localStorage.setItem('noor_kiddo_seen', JSON.stringify(Array.from(state.seenItems)));
        localStorage.setItem('noor_kiddo_lang', state.lang);

        const checkMap = {};
        this.elements.curriculumCheckboxes.forEach(cb => {
          const id = cb.getAttribute('data-currid');
          checkMap[id] = cb.checked;
        });
        localStorage.setItem('noor_kiddo_curriculum', JSON.stringify(checkMap));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    },

    updateStarUI() {
      if (this.elements.starCountDisplay) {
        this.elements.starCountDisplay.textContent = state.stars;
      }
      if (this.elements.statsTotalStars) {
        this.elements.statsTotalStars.textContent = state.stars;
      }
    },

    updateLangButtons() {
      this.elements.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === state.lang);
      });

      // Update titles based on language
      if (state.lang === 'en') {
        this.elements.appTitleText.textContent = 'Noor Kiddo';
        this.elements.appSubtitleText.textContent = 'Playful Islamic Learning Board';
        this.elements.soundLabelText.textContent = 'Hear';
        this.elements.footerHint.textContent = 'Tap any magnet to hear & learn • No mistakes, only joy!';
      } else if (state.lang === 'ar') {
        this.elements.appTitleText.textContent = 'نُور كِيدُو';
        this.elements.appSubtitleText.textContent = 'لوحة التعليم الإسلامي المرحة للأطفال';
        this.elements.soundLabelText.textContent = 'استمع';
        this.elements.footerHint.textContent = 'اضغط على أي مغناطيس للاستماع والتعلم بكل مرح!';
      } else {
        this.elements.appTitleText.textContent = 'নূর কিডো';
        this.elements.appSubtitleText.textContent = 'ছোটদের ইসলামিক খেলার পাঠশালা';
        this.elements.soundLabelText.textContent = 'শুনুন';
        this.elements.footerHint.textContent = 'ম্যাগনেটে ট্যাপ করে শুনুন ও শিখুন • কোনো ভুল নেই, শুধু আনন্দ!';
      }
    },

    bindEvents() {
      // Audio toggle
      this.elements.audioToggleBtn.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        this.elements.audioIcon.textContent = state.audioEnabled ? '🔊' : '🔇';
        sound.playPop();
      });

      // Language Switcher
      this.elements.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = btn.getAttribute('data-lang');
          if (state.lang !== selected) {
            state.lang = selected;
            this.updateLangButtons();
            this.saveStorage();
            sound.playTapChime();
            if (state.selectedItem) {
              this.updateStage(state.selectedItem);
            }
            if (state.activeShelf === 'game') {
              this.startQuiz();
            } else {
              this.renderShelf(state.activeShelf);
            }
          }
        });
      });

      // Shelf Tab Navigation
      this.elements.shelfTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const shelf = tab.getAttribute('data-shelf');
          this.elements.shelfTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          state.activeShelf = shelf;
          sound.playTapChime();
          this.renderShelf(shelf);
        });
      });

      // Stage repeat sound button
      this.elements.stageSoundBtn.addEventListener('click', () => {
        if (state.selectedItem) {
          sound.playTapChime();
          this.speakItem(state.selectedItem);
        }
      });

      // Parent Drawer Open/Close
      this.elements.parentDrawerToggle.addEventListener('click', () => {
        sound.playPop();
        this.openDrawer();
      });

      this.elements.drawerCloseBtn.addEventListener('click', () => {
        this.closeDrawer();
      });

      this.elements.drawerBackdrop.addEventListener('click', () => {
        this.closeDrawer();
      });

      // Drawer Tabs
      this.elements.currTabs.forEach(t => {
        t.addEventListener('click', () => {
          const tabId = t.getAttribute('data-currtab');
          this.elements.currTabs.forEach(btn => btn.classList.remove('active'));
          this.elements.currTabContents.forEach(c => c.classList.remove('active'));
          t.classList.add('active');
          const targetContent = document.getElementById(`currtab-${tabId}`);
          if (targetContent) targetContent.classList.add('active');
        });
      });

      // Curriculum Checkboxes
      this.elements.curriculumCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          sound.playTapChime();
          this.saveStorage();
          this.updateStats();
        });
      });

      // Reset Progress
      this.elements.resetProgressBtn.addEventListener('click', () => {
        if (confirm('আপনি কি সত্যিই সমস্ত স্টার ও অগ্রগতি রিসেট করতে চান?')) {
          state.stars = 0;
          state.seenItems.clear();
          this.elements.curriculumCheckboxes.forEach(cb => cb.checked = false);
          this.saveStorage();
          this.updateStarUI();
          this.updateStats();
          this.renderShelf(state.activeShelf);
          alert('অগ্রগতি সফলভাবে রিসেট করা হয়েছে!');
        }
      });

      // Game Repeat Question Button
      this.elements.gameRepeatBtn.addEventListener('click', () => {
        if (state.quiz.targetItem) {
          sound.playTapChime();
          this.speakQuizPrompt();
        }
      });
    },

    openDrawer() {
      this.elements.parentDrawer.classList.add('open');
      this.elements.drawerBackdrop.classList.add('open');
      this.updateStats();
    },

    closeDrawer() {
      this.elements.parentDrawer.classList.remove('open');
      this.elements.drawerBackdrop.classList.remove('open');
    },

    updateStats() {
      const totalItems = ARABIC_LETTERS.length + BANGLA_LETTERS.length + ENGLISH_LETTERS.length + NUMBERS_DATA.length + DUAS_DATA.length + KALIMA_DATA.length + PRAYERS_PILLARS.length + NATURE_CREATION.length;
      const exploredCount = state.seenItems.size;

      if (this.elements.statsExploredCount) {
        this.elements.statsExploredCount.textContent = `${exploredCount} / ${totalItems}`;
      }

      const percent = Math.min(100, Math.round((exploredCount / totalItems) * 100));
      if (this.elements.progressPercentage) {
        this.elements.progressPercentage.textContent = `${percent}%`;
      }
      if (this.elements.progressFillBar) {
        this.elements.progressFillBar.style.width = `${percent}%`;
      }
    },

    // ==================== SHELF CONTENT RENDERING ====================
    renderShelf(shelf) {
      if (shelf === 'game') {
        this.elements.magnetGrid.style.display = 'none';
        this.elements.subFilterBar.style.display = 'none';
        this.elements.gameContainer.style.display = 'block';
        this.startQuiz();
        return;
      }

      this.elements.gameContainer.style.display = 'none';
      this.elements.magnetGrid.style.display = 'grid';
      this.elements.magnetGrid.innerHTML = '';

      let items = [];

      if (shelf === 'arabic') {
        items = ARABIC_LETTERS;
        this.elements.subFilterBar.style.display = 'none';
      } else if (shelf === 'bangla') {
        items = BANGLA_LETTERS;
        this.renderSubFilters([
          { id: 'all', label: 'সব বর্ণমালা' },
          { id: 'vowel', label: 'স্বরবর্ণ (১১)' },
          { id: 'consonant', label: 'ব্যঞ্জনবর্ণ (৩৯)' }
        ]);
        if (state.activeSubFilter !== 'all') {
          items = items.filter(it => it.type === state.activeSubFilter);
        }
      } else if (shelf === 'english') {
        items = ENGLISH_LETTERS;
        this.elements.subFilterBar.style.display = 'none';
      } else if (shelf === 'numbers') {
        items = NUMBERS_DATA;
        this.elements.subFilterBar.style.display = 'none';
      } else if (shelf === 'duas') {
        items = DUAS_DATA;
        this.elements.subFilterBar.style.display = 'none';
      } else if (shelf === 'kalima') {
        items = KALIMA_DATA;
        this.elements.subFilterBar.style.display = 'none';
      } else if (shelf === 'prayers') {
        items = PRAYERS_PILLARS;
        this.renderSubFilters([
          { id: 'all', label: 'সব বিষয়' },
          { id: 'salah', label: '৫ ওয়াক্ত নামাজ' },
          { id: 'pillar', label: 'ইসলামের ৫ স্তম্ভ' },
          { id: 'wudu', label: '৫টি সহজ অজু ধাপ' }
        ]);
        if (state.activeSubFilter !== 'all') {
          items = items.filter(it => it.type === state.activeSubFilter);
        }
      } else if (shelf === 'nature') {
        items = NATURE_CREATION;
        this.renderSubFilters([
          { id: 'all', label: 'সব সৃষ্টি' },
          { id: 'animal', label: 'পশুপাখি' },
          { id: 'fruit', label: 'জান্নাতী ফল' },
          { id: 'nature', label: 'সূর্য, চাঁদ ও প্রকৃতি' }
        ]);
        if (state.activeSubFilter !== 'all') {
          items = items.filter(it => it.category === state.activeSubFilter);
        }
      }

      // Render cards to magnetGrid
      items.forEach(item => {
        const card = this.createMagnetCard(item, shelf);
        this.elements.magnetGrid.appendChild(card);
      });

      // Update stage with first item if none selected or not in shelf
      if (items.length > 0) {
        this.selectItem(items[0], false);
      }
    },

    renderSubFilters(filterList) {
      this.elements.subFilterBar.style.display = 'flex';
      this.elements.subFilterBar.innerHTML = '';
      filterList.forEach(f => {
        const btn = document.createElement('button');
        btn.className = `sub-filter-btn ${state.activeSubFilter === f.id ? 'active' : ''}`;
        btn.textContent = f.label;
        btn.addEventListener('click', () => {
          state.activeSubFilter = f.id;
          sound.playTapChime();
          this.renderShelf(state.activeShelf);
        });
        this.elements.subFilterBar.appendChild(btn);
      });
    },

    createMagnetCard(item, shelf) {
      const card = document.createElement('div');
      const themeClass = `theme-${item.theme || 'emerald'}`;
      const isSeen = state.seenItems.has(item.id);
      card.className = `magnet-card ${themeClass} ${isSeen ? 'seen' : ''}`;

      // Star in top right for exploration
      const starIcon = document.createElement('span');
      starIcon.className = 'card-seen-star';
      starIcon.textContent = '⭐';
      card.appendChild(starIcon);

      // Primary Char or Illustration
      if (shelf === 'arabic') {
        const char = document.createElement('div');
        char.className = 'card-primary-char';
        char.textContent = item.char;
        card.appendChild(char);

        const word = document.createElement('div');
        word.className = 'card-word';
        word.textContent = state.lang === 'en' ? item.wordEn : item.wordBn;
        card.appendChild(word);

        const hint = document.createElement('div');
        hint.className = 'card-hint';
        hint.textContent = item.nameBn;
        card.appendChild(hint);
      } else if (shelf === 'bangla') {
        const char = document.createElement('div');
        char.className = 'card-primary-char';
        char.textContent = item.char;
        card.appendChild(char);

        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const word = document.createElement('div');
        word.className = 'card-word';
        word.textContent = state.lang === 'en' ? item.nameEn : item.nameBn;
        card.appendChild(word);
      } else if (shelf === 'english') {
        const char = document.createElement('div');
        char.className = 'card-primary-char';
        char.textContent = item.char;
        card.appendChild(char);

        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const word = document.createElement('div');
        word.className = 'card-word';
        word.textContent = state.lang === 'bn' ? item.nameBn : item.nameEn;
        card.appendChild(word);
      } else if (shelf === 'numbers') {
        const char = document.createElement('div');
        char.className = 'card-primary-char';
        if (state.lang === 'ar') char.textContent = item.charAr;
        else if (state.lang === 'en') char.textContent = item.charEn;
        else char.textContent = item.charBn;
        card.appendChild(char);

        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.textContent = item.itemEmoji;
        card.appendChild(illus);

        const word = document.createElement('div');
        word.className = 'card-word';
        word.textContent = state.lang === 'en' ? item.wordEn : (state.lang === 'ar' ? item.wordAr : item.wordBn);
        card.appendChild(word);
      } else if (shelf === 'duas') {
        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.style.fontSize = '2.2rem';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const title = document.createElement('div');
        title.className = 'card-word';
        title.textContent = state.lang === 'en' ? item.titleEn : item.titleBn;
        card.appendChild(title);

        const hint = document.createElement('div');
        hint.className = 'card-hint';
        hint.textContent = item.translit;
        card.appendChild(hint);
      } else if (shelf === 'kalima') {
        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.style.fontSize = '2.2rem';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const title = document.createElement('div');
        title.className = 'card-word';
        title.textContent = state.lang === 'en' ? item.titleEn : item.titleBn;
        card.appendChild(title);

        const hint = document.createElement('div');
        hint.className = 'card-hint';
        hint.textContent = item.subtitleBn || item.translit;
        card.appendChild(hint);
      } else if (shelf === 'prayers') {
        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.style.fontSize = '2.2rem';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const title = document.createElement('div');
        title.className = 'card-word';
        title.textContent = state.lang === 'en' ? item.titleEn : item.titleBn;
        card.appendChild(title);

        const hint = document.createElement('div');
        hint.className = 'card-hint';
        hint.textContent = state.lang === 'en' ? item.rakatEn : item.rakatBn;
        card.appendChild(hint);
      } else if (shelf === 'nature') {
        const illus = document.createElement('div');
        illus.className = 'card-illustration';
        illus.style.fontSize = '2.2rem';
        illus.textContent = item.emoji;
        card.appendChild(illus);

        const title = document.createElement('div');
        title.className = 'card-word';
        title.textContent = state.lang === 'en' ? item.nameEn : (state.lang === 'ar' ? item.nameAr : item.nameBn);
        card.appendChild(title);

        const hint = document.createElement('div');
        hint.className = 'card-hint';
        hint.textContent = item.soundHint || '';
        card.appendChild(hint);
      }

      // Tap Event
      card.addEventListener('click', () => {
        this.selectItem(item, true);
        if (!state.seenItems.has(item.id)) {
          state.seenItems.add(item.id);
          state.stars += 1;
          card.classList.add('seen');
          this.updateStarUI();
          this.saveStorage();
          this.updateStats();
        }
      });

      return card;
    },

    selectItem(item, shouldSpeak = true) {
      state.selectedItem = item;
      this.updateStage(item);
      if (shouldSpeak) {
        sound.playTapChime();
        this.speakItem(item);
      }
    },

    updateStage(item) {
      // Clear visual tray
      this.elements.stageVisualTray.innerHTML = '';

      if (state.activeShelf === 'arabic') {
        this.elements.stageSymbol.textContent = item.char;
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = 'আরবি হরফ (Arabic)';
        this.elements.stagePhonetic.textContent = `${item.name} • ${item.nameBn}`;
        this.elements.stagePrimaryWord.textContent = `${item.wordAr} (${state.lang === 'en' ? item.wordEn : item.wordBn})`;
        this.elements.stageMeaning.textContent = state.lang === 'en' ? item.meaningEn : item.meaningBn;
      } else if (state.activeShelf === 'bangla') {
        this.elements.stageSymbol.textContent = item.char;
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = item.type === 'vowel' ? 'বাংলা স্বরবর্ণ' : 'বাংলা ব্যঞ্জনবর্ণ';
        this.elements.stagePhonetic.textContent = `${item.char} -তে ${item.nameBn}`;
        this.elements.stagePrimaryWord.textContent = `${item.char} • ${state.lang === 'en' ? item.nameEn : item.nameBn}`;
        this.elements.stageMeaning.textContent = state.lang === 'en' ? item.meaningEn : item.meaningBn;
      } else if (state.activeShelf === 'english') {
        this.elements.stageSymbol.textContent = item.char;
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = 'English Islamic Alphabet';
        this.elements.stagePhonetic.textContent = `${item.char} is for ${item.nameEn}`;
        this.elements.stagePrimaryWord.textContent = `${item.char} • ${item.nameEn} (${item.nameBn})`;
        this.elements.stageMeaning.textContent = state.lang === 'bn' ? item.meaningBn : item.meaningEn;
      } else if (state.activeShelf === 'numbers') {
        if (state.lang === 'ar') this.elements.stageSymbol.textContent = item.charAr;
        else if (state.lang === 'en') this.elements.stageSymbol.textContent = item.charEn;
        else this.elements.stageSymbol.textContent = item.charBn;

        this.elements.stageEmoji.textContent = item.itemEmoji;
        this.elements.stageCategoryPill.textContent = 'গণনা ও সংখ্যা (Counting)';
        this.elements.stagePhonetic.textContent = `${item.wordBn} • ${item.wordEn} • ${item.wordAr}`;
        this.elements.stagePrimaryWord.textContent = state.lang === 'en' ? `${item.charEn} - ${item.itemNameEn}` : `${item.charBn} - ${item.itemNameBn}`;
        this.elements.stageMeaning.textContent = `${item.wordBn} (${item.wordEn}) - ${item.num} ${state.lang === 'en' ? 'items count' : 'টি গণনা'}`;

        // Populate counting visual tray!
        for (let i = 0; i < item.num; i++) {
          const itemSpan = document.createElement('span');
          itemSpan.className = 'tray-item';
          itemSpan.textContent = item.itemEmoji;
          itemSpan.style.animationDelay = `${i * 0.03}s`;
          this.elements.stageVisualTray.appendChild(itemSpan);
        }
      } else if (state.activeShelf === 'duas') {
        this.elements.stageSymbol.textContent = '🤲';
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = 'দৈনন্দিন দো’আ ও জিকির';
        this.elements.stagePhonetic.textContent = item.translit;
        this.elements.stagePrimaryWord.textContent = item.arabic;
        this.elements.stageMeaning.textContent = state.lang === 'en' ? `${item.titleEn}: ${item.meaningEn}` : `${item.titleBn}: ${item.meaningBn}`;
      } else if (state.activeShelf === 'kalima') {
        this.elements.stageSymbol.textContent = '📿';
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = '৪ কালিমা (Four Kalimas)';
        this.elements.stagePhonetic.textContent = item.translit;
        this.elements.stagePrimaryWord.textContent = item.arabic;
        this.elements.stageMeaning.textContent = state.lang === 'en' ? `${item.titleEn}: ${item.meaningEn}` : `${item.titleBn}: ${item.meaningBn}`;
      } else if (state.activeShelf === 'prayers') {
        this.elements.stageSymbol.textContent = '🕌';
        this.elements.stageEmoji.textContent = item.emoji;
        this.elements.stageCategoryPill.textContent = item.type === 'salah' ? '৫ ওয়াক্ত সালাত' : (item.type === 'pillar' ? 'ইসলামের স্তম্ভ' : 'সহজ অজু পদ্ধতি');
        this.elements.stagePhonetic.textContent = state.lang === 'en' ? item.rakatEn : item.rakatBn;
        this.elements.stagePrimaryWord.textContent = state.lang === 'en' ? item.titleEn : item.titleBn;
        this.elements.stageMeaning.textContent = state.lang === 'en' ? item.timeEn : item.timeBn;
      } else if (state.activeShelf === 'nature') {
        this.elements.stageSymbol.textContent = item.emoji;
        this.elements.stageEmoji.textContent = '✨';
        this.elements.stageCategoryPill.textContent = 'আল্লাহর সুন্দর সৃষ্টি (Creation)';
        this.elements.stagePhonetic.textContent = `${item.nameBn} • ${item.nameEn} • ${item.nameAr}`;
        this.elements.stagePrimaryWord.textContent = state.lang === 'en' ? item.nameEn : (state.lang === 'ar' ? item.nameAr : item.nameBn);
        this.elements.stageMeaning.textContent = state.lang === 'en' ? item.descEn : item.descBn;
      }

      // Animate bubble
      this.elements.stageSymbolBubble.style.transform = 'scale(0.85)';
      setTimeout(() => {
        this.elements.stageSymbolBubble.style.transform = 'scale(1)';
      }, 150);
    },

    speakItem(item) {
      if (!state.audioEnabled) return;

      if (state.activeShelf === 'arabic') {
        const audioSrc = `assets/audio/arabic/${item.id}.mp3`;
        audioPlayer.play(audioSrc, `${item.nameBn}, ${item.wordBn}`, 'bn');
      } else if (state.activeShelf === 'bangla') {
        const audioSrc = `assets/audio/bangla/${item.id}.mp3`;
        audioPlayer.play(audioSrc, `${item.char}, ${item.nameBn}`, 'bn');
      } else if (state.activeShelf === 'english') {
        const audioSrc = `assets/audio/english/${item.id}.mp3`;
        audioPlayer.play(audioSrc, `${item.char}, for ${item.nameEn}`, 'en');
      } else if (state.activeShelf === 'numbers') {
        let audioSrc = '';
        if (state.lang === 'ar') audioSrc = `assets/audio/numbers/num-ar-${item.num}.mp3`;
        else if (state.lang === 'en') audioSrc = `assets/audio/numbers/num-en-${item.num}.mp3`;
        else audioSrc = `assets/audio/numbers/num-bn-${item.num}.mp3`;

        const fallback = state.lang === 'en' ? `${item.wordEn}` : (state.lang === 'ar' ? item.wordAr : item.wordBn);
        audioPlayer.play(audioSrc, fallback, state.lang);
      } else if (state.activeShelf === 'duas') {
        const audioSrc = `assets/audio/duas/${item.id}.mp3`;
        audioPlayer.play(audioSrc, `${item.translit}. ${item.meaningBn}`, 'bn');
      } else if (state.activeShelf === 'kalima') {
        const audioSrc = `assets/audio/kalima/${item.id}.mp3`;
        audioPlayer.play(audioSrc, `${item.titleBn}। ${item.translit}। ${item.meaningBn}`, 'bn');
      } else if (state.activeShelf === 'prayers') {
        const audioSrc = `assets/audio/prayers/${item.id}.mp3`;
        audioPlayer.play(audioSrc, state.lang === 'en' ? item.titleEn : item.titleBn, state.lang);
      } else if (state.activeShelf === 'nature') {
        const audioSrc = `assets/audio/nature/${item.id}.mp3`;
        audioPlayer.play(audioSrc, state.lang === 'en' ? item.nameEn : item.nameBn, state.lang);
      }
    },

    // ==================== PLAY & QUIZ GAME ENGINE ====================
    startQuiz() {
      state.quiz.active = true;
      state.quiz.round = 1;
      state.quiz.score = 0;
      this.loadNextQuizRound();
    },

    loadNextQuizRound() {
      this.elements.gameRoundNum.textContent = `${state.quiz.round} / ${state.quiz.totalRounds}`;
      this.elements.gameScoreNum.textContent = `${state.quiz.score} ⭐`;

      // Pick question pool from arabic, bangla, english, numbers, kalima, and nature
      const pool = [
        ...ARABIC_LETTERS.map(x => ({ type: 'arabic', target: x, label: `আলিফ-বা: “${x.nameBn} (${x.char})”`, promptSpeech: `খুঁজে বের করো: ${x.nameBn}`, display: x.char, emoji: x.emoji, name: x.nameBn })),
        ...BANGLA_LETTERS.slice(0, 20).map(x => ({ type: 'bangla', target: x, label: `বাংলা বর্ণ: “${x.char}” (${x.nameBn})`, promptSpeech: `খুঁজে বের করো: ${x.char}, ${x.nameBn}`, display: x.char, emoji: x.emoji, name: x.nameBn })),
        ...ENGLISH_LETTERS.slice(0, 15).map(x => ({ type: 'english', target: x, label: `Letter “${x.char}” (${x.nameEn})`, promptSpeech: `Find letter ${x.char}, for ${x.nameEn}`, display: x.char, emoji: x.emoji, name: x.nameEn })),
        ...NUMBERS_DATA.slice(0, 10).map(x => ({ type: 'number', target: x, label: `সংখ্যা: “${x.charBn} (${x.wordBn})”`, promptSpeech: `খুঁজে বের করো সংখ্যা: ${x.wordBn}`, display: x.charBn, emoji: x.itemEmoji, name: x.wordBn })),
        ...KALIMA_DATA.map(x => ({ type: 'kalima', target: x, label: `কালিমা: “${x.titleBn}”`, promptSpeech: `খুঁজে বের করো: ${x.titleBn}`, display: x.emoji, emoji: x.emoji, name: x.titleBn })),
        ...NATURE_CREATION.slice(0, 10).map(x => ({ type: 'nature', target: x, label: `আল্লাহর সৃষ্টি: “${x.nameBn}”`, promptSpeech: `খুঁজে বের করো: ${x.nameBn}`, display: x.emoji, emoji: x.emoji, name: x.nameBn }))
      ];

      // Random target
      const target = pool[Math.floor(Math.random() * pool.length)];
      state.quiz.targetItem = target;

      // 3 wrong distractors
      const distractors = pool.filter(p => p.display !== target.display);
      const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [target, ...shuffledDistractors].sort(() => 0.5 - Math.random());
      state.quiz.choices = choices;

      // Update question UI
      this.elements.gamePromptText.textContent = state.lang === 'en' ? `Find: ${target.name}` : `খুঁজে বের করো: “${target.name}”`;
      this.elements.gamePromptIcon.textContent = target.emoji || '🔍';
      this.elements.feedbackText.textContent = state.lang === 'en' ? 'Tap the matching magnet!' : 'সঠিক উত্তরের ম্যাগনেটে ট্যাপ করো!';

      // Render 4 choice buttons
      this.elements.gameChoicesGrid.innerHTML = '';
      choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'game-choice-btn';
        btn.innerHTML = `
          <span>${ch.display}</span>
          <span class="game-choice-label">${ch.name}</span>
        `;

        btn.addEventListener('click', () => {
          this.handleQuizAnswer(ch, btn);
        });

        this.elements.gameChoicesGrid.appendChild(btn);
      });

      // Speak prompt
      this.speakQuizPrompt();
    },

    speakQuizPrompt() {
      if (state.quiz.targetItem) {
        const item = state.quiz.targetItem.target;
        const type = state.quiz.targetItem.type;
        let audioSrc = null;
        if (type === 'arabic') audioSrc = `assets/audio/arabic/${item.id}.mp3`;
        else if (type === 'bangla') audioSrc = `assets/audio/bangla/${item.id}.mp3`;
        else if (type === 'english') audioSrc = `assets/audio/english/${item.id}.mp3`;
        else if (type === 'number') audioSrc = `assets/audio/numbers/num-bn-${item.num}.mp3`;
        else if (type === 'kalima') audioSrc = `assets/audio/kalima/${item.id}.mp3`;
        else if (type === 'nature') audioSrc = `assets/audio/nature/${item.id}.mp3`;

        audioPlayer.play(audioSrc, state.quiz.targetItem.promptSpeech, 'bn');
      }
    },

    handleQuizAnswer(choice, btnElement) {
      if (choice.display === state.quiz.targetItem.display) {
        // Correct answer!
        sound.playSuccessChord();
        confetti.burst();
        btnElement.classList.add('correct');
        state.quiz.score += 1;
        state.stars += 2; // Bonus star reward!
        this.updateStarUI();
        this.saveStorage();

        this.elements.feedbackText.textContent = state.lang === 'en' ? '🎉 Mashallah! That is correct!' : '🎉 মাশাআল্লাহ! চমৎকার, সঠিক উত্তর!';

        setTimeout(() => {
          if (state.quiz.round < state.quiz.totalRounds) {
            state.quiz.round += 1;
            this.loadNextQuizRound();
          } else {
            // Quiz Complete
            sound.playFanfare();
            confetti.burst();
            alert(`🏆 সুবহানাল্লাহ! আপনি ${state.quiz.totalRounds} রাউন্ড সম্পন্ন করেছেন এবং ${state.quiz.score} স্কোর অর্জন করেছেন!`);
            this.startQuiz();
          }
        }, 1200);
      } else {
        // Wrong answer - Gentle kid-friendly wiggle, no penalty!
        sound.playWiggleSound();
        btnElement.classList.add('wiggle');
        this.elements.feedbackText.textContent = state.lang === 'en' ? 'Try again! You can do it ✨' : 'আবার চেষ্টা করো! তুমি পারবে ✨';
        setTimeout(() => {
          btnElement.classList.remove('wiggle');
        }, 600);
      }
    }
  };

  // Initialize once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    UI.init();

    // Register Service Worker for offline PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('ServiceWorker registration skipped or file mode:', err);
      });
    }
  });

})();
