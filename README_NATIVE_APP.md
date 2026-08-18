# 📱 دليل تحويل تطبيق «سبحة نور الإسلام» إلى تطبيق هاتف حقيقي Native (iOS & Android)

تم تجهيز هذا المشروع بالكامل ليعمل كتطبيق هاتف حقيقي وأصلي (Native Mobile App) عبر تقنية **Capacitor** الحديثة المتوافقة مع أجهزة iPhone و Android ومتجر App Store و Google Play.

---

## 🌟 1. الميزات الأصلية المجهزة في المشروع:
- ✅ **مساحات الأمان العلوية والسفلية (Safe Areas)**: دعم شاشات الـ iPhone بمختلف أنواعها (الجزيرة الديناميكية Dynamic Island، النوتش Notch، شريط المؤشر السفلي) وشاشات Android الحديثة.
- ✅ **الهيدر الثابت الاحترافي**: متمركز بدقة تحت شريط الحالة (Status Bar) بدون أي تداخل مع الساعة أو البطارية.
- ✅ **ملف التكوين الأصلي**: `capacitor.config.json` معد مسبقاً بمعرّف الحزمة `com.nouralislam.subha`.
- ✅ **نظام التنبيهات المحلي (Local Notifications)**: دعم التذكير بالأذكار والورد اليومي.
- ✅ **المحرك الصوتي واللمسي (Haptic & Audio)**: اهتزازات حقيقية ونقرات تسبيح متعددة.
- ✅ **أيقونة التطبيق الفاخرة (4K Emblem)**: جاهزة كأيقونة رئيسية للتطبيق وشاشة البداية (Splash Screen).

---

## 🚀 2. خطوات إنشاء تطبيق Android (ملف APK و AAB للنشر):

### المتطلبات:
- تثبيت [Node.js](https://nodejs.org)
- تثبيت [Android Studio](https://developer.android.com/studio)

### الأوامر البرمجية في الطرفية (Terminal):
```bash
# 1. تثبيت حزم Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. بناء ملفات الويب للإنتاج
npm run build

# 3. تهيئة وإضافة منصة الأندرويد
npx cap add android

# 4. مزامنة الملفات مع مجلد الأندرويد
npx cap sync android

# 5. فتح المشروع في Android Studio
npx cap open android
```
> **داخل Android Studio:** اضغط على قائمة `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)` لتوليد ملف الـ APK وتثبيته مباشرة على أي جهاز أندرويد.

---

## 🍏 3. خطوات إنشاء تطبيق iOS (ملف IPA للآيفون ومتجر App Store):

### المتطلبات:
- جهاز كمبيوتر Mac
- تثبيت [Xcode](https://developer.apple.com/xcode/)

### الأوامر البرمجية في الطرفية (Terminal):
```bash
# 1. تثبيت حزم Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. بناء ملفات الويب للإنتاج
npm run build

# 3. تهيئة وإضافة منصة الـ iOS
npx cap add ios

# 4. مزامنة الملفات مع مجلد iOS
npx cap sync ios

# 5. فتح المشروع في Xcode
npx cap open ios
```
> **داخل Xcode:** اختر جهازك أو المحاكي (Simulator) واضغط على زر التشغيل `▶ Run` أو اذهب إلى `Product` > `Archive` لتجهيز التطبيق لمتجر App Store.

---

## 🌐 4. التثبيت السريع كتطبيق مباشر (PWA Standalone):
- على **iPhone (Safari)**: اضغط على زر المشاركة `Share` ثم اختر **«إضافة إلى الصفحة الرئيسية (Add to Home Screen)»**.
- على **Android (Chrome)**: اضغط على خيارات المتصفح واختر **«تثبيت التطبيق (Install App)»**.

---
✨ **صدقة جارية عن لؤي بن حسين وعن والده رحمه الله وغفر له**
