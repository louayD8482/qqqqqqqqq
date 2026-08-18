import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Bell, BellOff, Clock, Sparkles, Navigation } from 'lucide-react';
import { CITIES_LIST, CityLocation, calculateCityPrayerTimes } from '../data/islamicContent';

interface PrayerSectionProps {
  triggerNotification: (msg: string) => void;
  isRTL: boolean;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({
  triggerNotification,
  isRTL,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES_LIST[0]);
  const [prayerNotifications, setPrayerNotifications] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const [prayerData, setPrayerData] = useState(() => calculateCityPrayerTimes(CITIES_LIST[0]));

  useEffect(() => {
    setPrayerData(calculateCityPrayerTimes(selectedCity));
    const interval = setInterval(() => {
      setPrayerData(calculateCityPrayerTimes(selectedCity));
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const togglePrayerAlert = (key: string, name: string) => {
    setPrayerNotifications((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };
      if (nextVal) {
        triggerNotification(isRTL ? `تم تفعيل تنبيه ${name} ⏰` : `Alert enabled for ${name} ⏰`);
      } else {
        triggerNotification(isRTL ? `تم إيقاف تنبيه ${name}` : `Alert disabled for ${name}`);
      }
      return updated;
    });
  };

  const prayersList = [
    { key: 'fajr', name: isRTL ? 'صلاة الفجر' : 'Fajr', time: prayerData.fajr, icon: '🌅' },
    { key: 'sunrise', name: isRTL ? 'شروق الشمس' : 'Sunrise', time: prayerData.sunrise, icon: '☀️' },
    { key: 'dhuhr', name: isRTL ? 'صلاة الظهر' : 'Dhuhr', time: prayerData.dhuhr, icon: '🌤️' },
    { key: 'asr', name: isRTL ? 'صلاة العصر' : 'Asr', time: prayerData.asr, icon: '⛅' },
    { key: 'maghrib', name: isRTL ? 'صلاة المغرب' : 'Maghrib', time: prayerData.maghrib, icon: '🌇' },
    { key: 'isha', name: isRTL ? 'صلاة العشاء' : 'Isha', time: prayerData.isha, icon: '🌙' },
  ];

  const hoursLeft = Math.floor(prayerData.minutesRemaining / 60);
  const minsLeft = prayerData.minutesRemaining % 60;

  return (
    <div className="space-y-4 select-none">
      {/* 1. Next Prayer Hero Card */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-emerald-700/20 to-teal-900/30 border border-amber-500/40 dark:border-amber-400/30 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-amber-500/30 rounded-2xl px-3 py-1.5 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = CITIES_LIST.find((c) => c.id === e.target.value);
                if (found) {
                  setSelectedCity(found);
                  triggerNotification(isRTL ? `تم تحديد الموقع: ${found.nameAr}` : `Location set to ${found.nameEn}`);
                }
              }}
              className="bg-transparent text-xs font-bold text-amber-200 outline-none cursor-pointer"
            >
              {CITIES_LIST.map((city) => (
                <option key={city.id} value={city.id} className="bg-stone-900 text-stone-100">
                  {isRTL ? `${city.nameAr} - ${city.countryAr}` : `${city.nameEn} (${city.countryAr})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>{isRTL ? 'مواقيت دقيقة' : 'Accurate Times'}</span>
          </div>
        </div>

        {/* Big Countdown */}
        <div className="text-center py-3 space-y-1">
          <span className="text-xs text-stone-400 uppercase tracking-wider block">
            {isRTL ? 'الصلاة القادمة بإذن الله' : 'Next Prayer'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400 drop-shadow-md">
            {prayerData.nextPrayerName}
          </h2>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-stone-100 my-1">
            {prayerData.nextPrayerTime}
          </div>
          <p className="text-xs text-emerald-300 font-medium">
            {isRTL
              ? `متبقي: ${hoursLeft > 0 ? `${hoursLeft} ساعة و ` : ''}${minsLeft} دقيقة`
              : `Remaining: ${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft}m`}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => triggerNotification(isRTL ? "تم تفعيل إشعارات الصلوات بالكامل 🔔" : "All prayer notifications active 🔔")}
          className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>{isRTL ? 'تفعيل الأذان والتنبيه لكافة الصلوات' : 'Enable Adhan Alerts for All Prayers'}</span>
        </button>
      </div>

      {/* 2. Today's Full Schedule */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{isRTL ? 'جدول صلوات اليوم' : 'Daily Prayer Schedule'}</span>
        </h3>

        <div className="space-y-2">
          {prayersList.map((p) => {
            const isAlertActive = prayerNotifications[p.key] ?? false;
            return (
              <div
                key={p.key}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 transition-all hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      {p.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
                    {p.time}
                  </span>
                  {p.key !== 'sunrise' && (
                    <button
                      onClick={() => togglePrayerAlert(p.key, p.name)}
                      className={`p-2 rounded-xl transition-all ${
                        isAlertActive
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                      }`}
                      title={isRTL ? 'تفعيل/إلغاء التنبيه' : 'Toggle Alert'}
                    >
                      {isAlertActive ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Qibla Compass Indicator */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
              {isRTL ? 'اتجاه القبلة الشريفة (مكة المكرمة)' : 'Qibla Direction (Makkah)'}
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isRTL ? 'الاتجاه التقريبي: جنوب غرب (٢٤٥°)' : 'Approx direction: South-West (245°)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerNotification(isRTL ? "وجه هاتفك نحو القبلة المباركة 🕋" : "Align phone towards the Qibla 🕋")}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all whitespace-nowrap"
        >
          {isRTL ? 'تحديد القبلة' : 'Find Qibla'}
        </button>
      </div>
    </div>
  );
};
