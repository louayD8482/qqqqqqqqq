import subhaEmblemImg from '../assets/images/subha_icon.jpg';

export interface StatsExportData {
  totalToday: number;
  roundsCompleted: number;
  streakDays: number;
  dailyHistory: Record<string, number>;
  currentDhikrTitle?: string;
}

/**
 * 1. إنشاء نص التقرير الكامل بصيغة نصية منسقة
 */
export function generateStatsTextReport(data: StatsExportData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // حساب إحصائيات الأسبوع الماضي
  const last7Days: { date: string; dayName: string; count: number }[] = [];
  let weeklyTotal = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('ar-SA', { weekday: 'long' });
    const count = data.dailyHistory[iso] || (i === 0 ? data.totalToday : 0);
    last7Days.push({ date: iso, dayName, count });
    weeklyTotal += count;
  }

  const weeklyAverage = Math.round(weeklyTotal / 7);

  return `=======================================================
           تقرير إحصائيات التسبيح والأوراد 📿✨
                 تطبيق «سبحة نور الإسلام»
=======================================================

📅 تاريخ التقرير: ${dateStr}
⏰ الوقت: ${timeStr}

-------------------------------------------------------
📊 أولاً: ملخص إنجاز اليوم
-------------------------------------------------------
• مجموع تسبيحات وأذكار اليوم: ${data.totalToday.toLocaleString('ar-SA')} تسبيحة
• الدورات والختمات المكتملة: ${data.roundsCompleted} دورة
• سلسلة المواظبة المستمرة: ${data.streakDays} أيام متتالية
• الذكر الحالي المختار: ${data.currentDhikrTitle || 'سبحان الله وبحمده'}

-------------------------------------------------------
📈 ثانياً: تفصيل نشاط الأسبوع (آخر ٧ أيام)
-------------------------------------------------------
${last7Days
  .map(
    (item, index) =>
      `${index + 1}. ${item.dayName.padEnd(12, ' ')} (${item.date}): ${item.count.toLocaleString('ar-SA')} تسبيحة`
  )
  .join('\n')}

• إجمالي تسبيحات الأسبوع: ${weeklyTotal.toLocaleString('ar-SA')} تسبيحة
• المعدل اليومي لهذا الأسبوع: ${weeklyAverage.toLocaleString('ar-SA')} تسبيحة/يوم

-------------------------------------------------------
🌟 ثالثاً: تذكير بالفضل والأجر
-------------------------------------------------------
قال رسول الله ﷺ:
«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»
وقال تعالى:
«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»

-------------------------------------------------------
🤲 إهداء ودعاء
-------------------------------------------------------
هذا التطبيق صدقة جارية عن لؤي بن حسين ولوالده رحمه الله تعالى 
وغفر له وأسكنه الفردوس الأعلى من الجنة وجميع موتى المسلمين.
جزاكم الله خيراً وتقبل منا ومنكم صالح الأعمال.
=======================================================`;
}

/**
 * 2. تنزيل التقرير كملف نصي (.txt)
 */
export function downloadTextReport(data: StatsExportData): void {
  const content = generateStatsTextReport(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Taqreer_Tasbeeh_Nour_Al_Islam_${dateStr}.txt`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * 3. توليد بطاقة إنجاز فاخرة كصورة عالية الدقة (Canvas Image Card)
 */
export async function generateStatsCardImageBlob(data: StatsExportData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // أبعاد عالية الدقة للمشاركة (1080 x 1350 - نسبة مناسبة لإنستغرام وواتساب)
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  // 1. الخلفية المتدرجة الفاخرة (Dark Emerald & Midnight Onyx)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#06101e');
  bgGrad.addColorStop(0.4, '#0a192f');
  bgGrad.addColorStop(0.8, '#06261c');
  bgGrad.addColorStop(1, '#03120d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // إضاءات ناعمة ذهبية وخضراء في الزوايا
  const glow1 = ctx.createRadialGradient(150, 150, 10, 150, 150, 450);
  glow1.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  glow1.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width - 150, height - 200, 10, width - 150, height - 200, 500);
  glow2.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
  glow2.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 2. إطار زخرفي ذهبي ملكي
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // 3. رسم الشعار / الأفتار
  try {
    const emblemImg = new Image();
    emblemImg.src = subhaEmblemImg;
    await new Promise((resolve) => {
      emblemImg.onload = resolve;
      emblemImg.onerror = resolve;
    });

    if (emblemImg.complete && emblemImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, 160, 65, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(emblemImg, width / 2 - 65, 95, 130, 130);
      ctx.restore();

      // حلقة ذهبية حول الأفتار
      ctx.beginPath();
      ctx.arc(width / 2, 160, 68, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  } catch (e) {
    console.error('Could not render emblem in canvas', e);
  }

  // 4. النصوص والعناوين
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px Tajawal, sans-serif';
  ctx.fillText('سبحة نور الإسلام', width / 2, 285);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '500 24px Tajawal, sans-serif';
  ctx.fillText('بطاقة إنجاز الأوراد والتسبيح اليومية والأسبوعية 📿', width / 2, 330);

  // خط فاصل ذهبي
  const lineGrad = ctx.createLinearGradient(150, 360, width - 150, 360);
  lineGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
  lineGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)');
  lineGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 360);
  ctx.lineTo(width - 150, 360);
  ctx.stroke();

  // 5. الصندوق الرئيسي: مجموع تسبيحات اليوم
  ctx.fillStyle = 'rgba(10, 30, 25, 0.7)';
  ctx.roundRect(100, 390, width - 200, 240, 32);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 26px Tajawal, sans-serif';
  ctx.fillText('مجموع تسبيحات وذكر اليوم', width / 2, 445);

  ctx.fillStyle = '#fde047';
  ctx.font = '900 88px monospace, Tajawal, sans-serif';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
  ctx.shadowBlur = 20;
  ctx.fillText(data.totalToday.toLocaleString('ar-SA'), width / 2, 545);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 24px Tajawal, sans-serif';
  ctx.fillText('تسبيحة واستغفار وتهليلة مباركة ✨', width / 2, 595);

  // 6. شبكة الإحصائيات الفرعية (3 كروت)
  // حساب إجمالي الأسبوع
  let weeklyTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    weeklyTotal += data.dailyHistory[iso] || (i === 0 ? data.totalToday : 0);
  }

  const cardWidth = 260;
  const cardHeight = 160;
  const startX = 110;
  const spacing = (width - 220 - cardWidth * 3) / 2;
  const cardY = 660;

  const statsCards = [
    { title: 'الدورات المكتملة', value: `${data.roundsCompleted}`, sub: 'ختمات الورد', color: '#10b981' },
    { title: 'إجمالي الأسبوع', value: weeklyTotal.toLocaleString('ar-SA'), sub: 'تسبيحة في ٧ أيام', color: '#f59e0b' },
    { title: 'المواظبة المستمرة', value: `${data.streakDays} أيام`, sub: 'سلسلة متتالية', color: '#f43f5e' },
  ];

  statsCards.forEach((c, idx) => {
    const x = startX + idx * (cardWidth + spacing);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.roundRect(x, cardY, cardWidth, cardHeight, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px Tajawal, sans-serif';
    ctx.fillText(c.title, x + cardWidth / 2, cardY + 40);

    ctx.fillStyle = c.color;
    ctx.font = 'bold 36px monospace, Tajawal, sans-serif';
    ctx.fillText(c.value, x + cardWidth / 2, cardY + 95);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 16px Tajawal, sans-serif';
    ctx.fillText(c.sub, x + cardWidth / 2, cardY + 135);
  });

  // 7. الآية القرآنية الكريمة
  ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.roundRect(100, 850, width - 200, 160, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 30px Amiri, serif';
  ctx.fillText('« أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ »', width / 2, 915);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 20px Tajawal, sans-serif';
  ctx.fillText('قال ﷺ: «أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر»', width / 2, 965);

  // 8. تذييل البطاقة والصدقة الجارية
  const nowStr = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px Tajawal, sans-serif';
  ctx.fillText(`تاريخ الإنجاز: ${nowStr}`, width / 2, 1055);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 20px Tajawal, sans-serif';
  ctx.fillText('صدقة جارية عن لؤي بن حسين ولوالده رحمه الله وغفر له', width / 2, 1180);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px Tajawal, sans-serif';
  ctx.fillText('تطبيق سبحة نور الإسلام • انضم وشاركنا الأجر 🤲', width / 2, 1215);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create card image blob'));
    }, 'image/png');
  });
}

/**
 * 4. تنزيل بطاقة الإنجاز كصورة PNG مباشرة
 */
export async function downloadStatsCardImage(data: StatsExportData): Promise<void> {
  const blob = await generateStatsCardImageBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Bitaqat_Injaz_Tasbeeh_${dateStr}.png`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * 5. مشاركة ذكية للصورة أو النص عبر المتصفح
 */
export async function shareStatsCard(
  data: StatsExportData,
  onFallbackText: () => void
): Promise<boolean> {
  const shareText = `الحمد لله رب العالمين 📿✨\nأتممت اليوم ${data.totalToday.toLocaleString('ar-SA')} تسبيحة وذكر في تطبيق (سبحة نور الإسلام).\n«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»\n#تسبيح #أذكار #سبحة_نور_الإسلام`;

  try {
    const blob = await generateStatsCardImageBlob(data);
    const file = new File([blob], 'Tasbeeh_Card.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'إنجاز تسبيح اليوم - سبحة نور الإسلام',
        text: shareText,
        files: [file],
      });
      return true;
    } else if (navigator.share) {
      await navigator.share({
        title: 'إنجاز تسبيح اليوم - سبحة نور الإسلام',
        text: shareText,
      });
      return true;
    }
  } catch (err) {
    console.error('Web share failed', err);
  }

  onFallbackText();
  return false;
}
