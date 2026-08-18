/**
 * Native & Web Local Notifications Helper
 * يدعم التنبيهات والإشعارات اليومية على iOS و Android والمتصفحات
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/subha_icon.jpg',
        badge: '/subha_icon.jpg',
        dir: 'rtl',
        lang: 'ar',
        ...options,
      });
    } catch (e) {
      console.warn('Native notification trigger failed', e);
    }
  }
}

/**
 * جدولة تذكير يومي بالاستغفار والتسبيح
 */
export function scheduleDailyTasbeehReminder(hour: number = 9, minute: number = 0): void {
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeoutMs = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendLocalNotification('ساعة الذكر والتسبيح 📿✨', {
      body: 'قال رسول الله ﷺ: «ألا بذكر الله تطمئن القلوب». لا تنس وردك اليومي من التسبيح والاستغفار.',
    });
    // إعادة الجدولة لليوم التالي
    scheduleDailyTasbeehReminder(hour, minute);
  }, timeoutMs);
}
