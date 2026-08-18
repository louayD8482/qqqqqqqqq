import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, Loader2, BookOpen, Compass } from 'lucide-react';

interface AIAssistantSectionProps {
  triggerNotification: (msg: string) => void;
  isRTL: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({
  triggerNotification,
  isRTL,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: isRTL
        ? 'السلام عليكم ورحمة الله وبركاته يا أخي الكريم ✨ أنا مساعدك الشرعي والروحي في "نور الإسلام". كيف يمكنني خدمتك اليوم في تفسير آية، شرح حديث، مواقيت الصلاة، أو صيغ الأذكار والتسبيح؟'
        : 'Assalamu Alaykum brother ✨ I am your Islamic & Spiritual Assistant in Noor Al-Islam. How may I assist you with Quranic meanings, authentic Hadith, prayer rules, or Dhikr guidelines?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const botReply = data.reply || (isRTL ? 'وفقك الله لكل خير.' : 'May Allah bless you.');

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      triggerNotification(isRTL ? 'تمت الإجابة على استفسارك 🤖' : 'AI responded to your query 🤖');
    } catch (err) {
      console.error(err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: isRTL
          ? 'بإذن الله تجد في القرآن والسنة النبوية كل خير ونور. نسأل الله أن يرزقك العلم النافع والعمل الصالح.'
          : 'May Allah grant you beneficial knowledge and righteous deeds.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    { label: isRTL ? 'ما هو فضل سورة الملك؟' : 'Virtue of Surah Al-Mulk', q: 'ما هو فضل قراءة سورة الملك كل ليلة من الأحاديث الصحيحة؟' },
    { label: isRTL ? 'ما هي صيغة سيد الاستغفار؟' : 'Sayyid al-Istighfar', q: 'ما هو نص ودعاء سيد الاستغفار وما فضله العظيم؟' },
    { label: isRTL ? 'أفضل الذكر بعد الصلاة المكتوبة' : 'Best Dhikr after prayer', q: 'ما هي الأذكار المأثورة عن النبي ﷺ عقب الصلوات الخمس؟' },
    { label: isRTL ? 'كيف أخشع في صلاتي؟' : 'How to attain Khushoo?', q: 'ما هي الوسائل المعينة على استحضار الخشوع وحضور القلب في الصلاة؟' },
  ];

  return (
    <div className="flex flex-col h-[520px] rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden select-none">
      {/* 1. Chat Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500/15 via-emerald-600/10 to-teal-500/15 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-1.5">
              <span>{isRTL ? 'ذكاء نور الإسلام الاصطناعي' : 'Noor Al-Islam AI Assistant'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isRTL ? 'إجابات شرعية وتربوية موثوقة وميسرة' : 'Reliable Islamic & Spiritual Guidance'}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
          Gemini Powered
        </span>
      </div>

      {/* 2. Quick Question Chips */}
      <div className="p-2.5 bg-stone-50 dark:bg-stone-950/40 border-b border-stone-200 dark:border-stone-800/60 overflow-x-auto flex gap-2 scrollbar-none">
        {quickQuestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.q)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400 text-[11px] font-medium whitespace-nowrap active:scale-95 transition-all shadow-xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50 dark:bg-stone-950/20">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 text-stone-800 dark:text-stone-100 rounded-tl-none font-sans'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1.5 ${
                    isUser ? 'text-stone-900/70 text-left' : 'text-stone-400 text-right'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-500 font-medium p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{isRTL ? 'جاري استحضار الجواب الشرعي الموثق...' : 'Consulting verified sources...'}</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* 4. Input Area */}
      <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isRTL ? 'اكتب سؤالك الشرعي أو استفسارك هنا...' : 'Ask your Islamic question...'}
          className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
