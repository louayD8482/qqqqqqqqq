export type CustomSoundMode = 'wood' | 'amber' | 'crystal' | 'water' | 'stone' | 'tick' | 'oud' | 'silent';

export interface SoundOptionMeta {
  mode: CustomSoundMode;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export const SOUND_OPTIONS: SoundOptionMeta[] = [
  {
    mode: 'wood',
    name: 'خشب الزيتون العريق',
    category: 'أصلي وطبيعي',
    description: 'نقرة خشبية كلاسيكية دافئة تحاكي مسابح خشب الزيتون الطبيعي',
    icon: '🪵'
  },
  {
    mode: 'amber',
    name: 'حبات الكهرمان الملكية',
    category: 'فاخر وهادئ',
    description: 'صوت عميق ورنان دافئ يحاكي مسابح الكهرمان الثمينة',
    icon: '📿'
  },
  {
    mode: 'crystal',
    name: 'البلور والكريستال الصافي',
    category: 'نقي ومتلألئ',
    description: 'رنين ناعم وواضح يشبه لمس حبات البلور والزجاج الفاخر',
    icon: '💎'
  },
  {
    mode: 'water',
    name: 'قطرات الماء والسلسبيل',
    category: 'سكينة وروحانية',
    description: 'إيقاع قطرة ماء هادئة ومريحة للنفس وتبعث على الطمأنينة',
    icon: '💧'
  },
  {
    mode: 'stone',
    name: 'أحجار العقيق والصوان',
    category: 'أصيل وملموس',
    description: 'نقرة حجرية ملموسة تحاكي مسابح الأحجار الكريمة القديمة',
    icon: '🪨'
  },
  {
    mode: 'tick',
    name: 'العداد الرقمي الدقيق',
    category: 'عصري ودقيق',
    description: 'تكة إلكترونية خفيفة وسريعة للاستجابة اللمسية الفورية',
    icon: '⏱️'
  },
  {
    mode: 'oud',
    name: 'نغمة الأوتار الشرقية',
    category: 'تأمل وخشوع',
    description: 'نبرة وترية شرقية خافتة تشعرك بالسكينة مع كل ذكر',
    icon: '🎵'
  },
  {
    mode: 'silent',
    name: 'الوضع الصامت الهادئ',
    category: 'صامت',
    description: 'بدون أي صوت مع الاعتماد على الاهتزاز اللمسي فقط',
    icon: '🔇'
  }
];

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function getSavedSoundVolume(): number {
  if (typeof window === 'undefined') return 0.8;
  const saved = localStorage.getItem('subha_sound_volume');
  if (saved !== null) {
    const val = parseFloat(saved);
    return isNaN(val) ? 0.8 : Math.max(0, Math.min(1, val));
  }
  return 0.8;
}

export function saveSoundVolume(volume: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('subha_sound_volume', String(Math.max(0, Math.min(1, volume))));
  }
}

export function playBeadSound(type: CustomSoundMode = 'wood', customVolume?: number) {
  if (type === 'silent') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = customVolume !== undefined ? customVolume : getSavedSoundVolume();
  if (vol <= 0) return;

  if (type === 'wood') {
    // Realistic olive wood bead click (hollow acoustic resonance)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.032);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(640, now);
    filter.Q.setValueAtTime(2.8, now);

    gain.gain.setValueAtTime(0.7 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'amber') {
    // Deep warm amber bead resonance
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(380, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.045);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(760, now);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.03);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.65 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.055);
    osc2.stop(now + 0.055);
  } else if (type === 'water') {
    // Gentle natural water droplet echo
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(1350, now + 0.035);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.075);

    gain.gain.setValueAtTime(0.45 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } else if (type === 'crystal') {
    // Crystal glass ping with harmonic sparkle
    const osc = ctx.createOscillator();
    const oscHarmo = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1560, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.07);

    oscHarmo.type = 'sine';
    oscHarmo.frequency.setValueAtTime(3120, now);
    oscHarmo.frequency.exponentialRampToValueAtTime(1840, now + 0.05);

    gain.gain.setValueAtTime(0.4 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    oscHarmo.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    oscHarmo.start(now);
    osc.stop(now + 0.08);
    oscHarmo.stop(now + 0.08);
  } else if (type === 'stone') {
    // Natural stone bead tactile knock
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.6 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } else if (type === 'tick') {
    // Crisp modern electronic tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.012);

    gain.gain.setValueAtTime(0.45 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.018);
  } else if (type === 'oud') {
    // Plucked string harmonic tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.06);

    gain.gain.setValueAtTime(0.5 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  }
}

export function playCompletionChime(customVolume?: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const vol = customVolume !== undefined ? customVolume : getSavedSoundVolume();
  if (vol <= 0) return;

  const now = ctx.currentTime;
  // Major pentatonic victory chime arpeggio: C5, E5, G5, B5, C6
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.075);

    gain.gain.setValueAtTime(0, now + index * 0.075);
    gain.gain.linearRampToValueAtTime(0.3 * vol, now + index * 0.075 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.075 + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.075);
    osc.stop(now + index * 0.075 + 0.6);
  });
}

export function triggerHapticFeedback(pattern: number | number[] = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors on unsupported browsers
    }
  }
}
