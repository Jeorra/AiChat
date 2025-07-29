// App.tsx

import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageState } from './pageState';
import data from "./data.json";
import type { PageFAQs, FAQItem, Message, Option, BotResponseData } from "./types";
import { IoIosSend } from "react-icons/io";
import { FaStopCircle } from "react-icons/fa";

const frequentQuestions = data as PageFAQs;

const pageTitles: { [key: string]: string } = {
  "/DersIslemleri/dersekle": "Ders Teklifi",
  "/DersIslemleri/DersTeklifDuzenle": "Ders Teklifi Güncelleme",
  "/Mufredat/MufredatDegisiklik": "Müfredat/Kredi İş Yükü Güncelleme",
  "/Grade/NotSubeSecim": "Not Giriş İşlemleri",
  "/Danisman/ogrencikatalogtop": "Öğrenci Katalog Düzenleme",
  "/eys/DersOnay/OgretimElemaniDersOnay": "Ders Onay ve Kayıt",
  "/Grade/notgoruntuleme": "Not Görüntüleme",
  "/ogrenci/dishekimligiderskayit": "Tıp/Diş Hekimliği/Hukuk Ders Kayıt",
  "/Ogrenci/OgrenciDersProgrami": "Öğrenci Ders Programı",
  "/kayit/yeni-ogrenci": "Yeni Öğrenci Kayıt",
  "/harc/odeme": "Harç Ödemeleri",
  "/kayit/yeni-ders": "Yeni Ders Kayıt",
  "/kayit/yeni-ders/yaz-okulu": "Yaz Okulu Ders Kayıt",
  "/": "Ana Sayfa",
  "global": "Genel Konular"
};

function App() {
  // --- State Tanımlamaları ---
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.Main);
  const [currentQuestion, setCurrentQuestion] = useState<FAQItem | null>(null);
  const [userType, setUserType] = useState<'ogrenci' | 'personel' | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Stream anında true olur
  const [currentFAQs, setCurrentFAQs] = useState<FAQItem[]>([]);

  // --- Ref Tanımlamaları ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null); // Stream'i iptal etmek için
  const botResponseCount = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null); // DÜZELTME: Input'a odaklanmak için ref eklendi

  const location = useLocation();
  const navigate = useNavigate();

  // --- Effect'ler ---

  // URL'den gelen parametreleri işler
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageQuery = params.get('page');
    const userQuery = params.get('user');

    if (userQuery === 'ogrenci' || userQuery === 'personel') {
      setUserType(userQuery);
      console.log("userType URL'den alındı:", userQuery);
    }

    if (pageQuery) {
      const targetPath = Object.keys(pageTitles).find(path =>
        path.toLowerCase().includes(pageQuery.toLowerCase())
      );

      if (targetPath && targetPath !== location.pathname) {
        navigate(targetPath);
      }
    }
  }, []); // Bu effect sadece component ilk yüklendiğinde bir kere çalışır

  // Sayfa yüklendiğinde veya değiştiğinde SSS'leri ve kullanıcı tipini ayarlar
  useEffect(() => {
    const currentPagePath = location.pathname;
    const pageData = frequentQuestions[currentPagePath];
    const globalData = frequentQuestions["global"];

    const faqsForPage = pageData?.faqs || [];
    const globalFAQs = globalData?.faqs || [];
    setCurrentFAQs([...faqsForPage, ...globalFAQs]);
  }, [location.pathname, userType]);

  // Sohbet geçmişi her güncellendiğinde en alta kaydırır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // DÜZELTME: Sayfa yüklendiğinde ve bot cevap verdiğinde input'a odaklanır
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);


  // --- Temel Fonksiyonlar ---

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Streaming olmayan, normal JSON cevaplarını işler
  const handleJsonResponse = (data: BotResponseData) => {
    const botMessage: Message = { role: 'assistant', content: data.message.content };
    setChatHistory(prev => [...prev, botMessage]);

    if (data.options) setOptions(data.options);
    if (data.type === 'reset_and_continue') botResponseCount.current = 0;
    if (data.type === 'redirect' && data.url) {
      setTimeout(() => window.open(data.url, '_blank'), 1500);
    }
    if (data.type === 'end_chat') {
      setTimeout(() => {
        setChatHistory([]);
        botResponseCount.current = 0;
      }, 2000);
    }
  };

  // Ana mesaj gönderme ve stream işleme fonksiyonu
  const sendMessage = async (messageContent: string, isOptionClick: boolean = false) => {
    if (isLoading || !messageContent.trim()) return;

    if (!isOptionClick) {
      const newUserMessage: Message = { role: "user", content: messageContent };
      setChatHistory(prev => [...prev, newUserMessage]);
    }

    setInput('');
    setOptions([]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageContent,
          role: userType
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

      const contentType = res.headers.get("content-type");
      if (contentType?.includes("text/event-stream")) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n').filter(Boolean);

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const dataStr = line.substring(5);
              if (dataStr.trim() === "[DONE]") continue;

              try {
                const data = JSON.parse(dataStr);
                if (data.type === 'message_chunk' && data.content) {
                  setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    lastMessage.content += data.content;
                    return newHistory;
                  });
                } else if (data.type === 'done') {
                  botResponseCount.current += 1;
                  if (botResponseCount.current >= 3) {
                    setChatHistory(prevChat => [...prevChat, { role: "assistant", content: "Sohbete devam etmek istiyor musunuz?" }]);
                    setOptions([
                      { text: "Evet", payload: "ACTION_CONTINUE_YES" },
                      { text: "Hayır", payload: "ACTION_CONTINUE_NO" }
                    ]);
                  }
                } else if (data.type === 'error') {
                  throw new Error(data.detail);
                }
              } catch (e) {
                console.error("Stream verisi parse edilemedi:", e);
              }
            }
          }
        }
      } else {
        const data = await res.json();
        handleJsonResponse(data);
      }

    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setChatHistory(prev => [...prev, { role: "assistant", content: `Bir hata oluştu: ${(error as Error).message}` }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      setChatHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content.trim() === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleSend = () => {
    sendMessage(input, false);
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleOptionClick = (payload: string) => {
    const optionText = options.find(o => o.payload === payload)?.text || payload;
    setChatHistory(prev => [...prev, { role: "user", content: optionText }]);
    sendMessage(payload, true);
  };

  const showAnswer = (faqItem: FAQItem) => {
    setCurrentQuestion(faqItem);
    setCurrentPage(PageState.Answer);
  };

  const satisfactionResponse = (satisfied: boolean) => {
    if (satisfied) {
      alert('Sorunuz çözüldüğü için mutluyuz! 😊');
      goHome();
    } else {
      if (currentQuestion) {
        sendMessage(currentQuestion.question, false);
      }
    }
  };

  const goHome = () => {
    setCurrentPage(PageState.Main);
    setCurrentQuestion(null);
    setChatHistory([]);
    botResponseCount.current = 0;
    setOptions([]);
    setIsNavOpen(false);
  };

  const goToQuestions = () => {
    setCurrentPage(PageState.Main);
    setCurrentQuestion(null);
  };

  const linkify = (text: string) => {
    const urlRegex = /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=_|!:,.;]*[-A-Z0-9+&@#/%=_|])/ig;
    return text.split(urlRegex).map((part, i) =>
      i % 2 === 1
        ? <a href={part} key={i} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>
        : part
    );
  };

  const isChatDisabled = isLoading || !userType;


  return (
    <>


      <nav className="bg-blue-800 p-4 shadow-lg">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center">
            <img src="/pau_logo.svg" alt="PAU Logo" className="h-10 mr-3" />
            <span className="text-white text-xl font-bold">PAÜ Chatbot</span>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
          <div className="hidden md:flex space-x-6">
            <a onClick={goHome} className="text-white hover:text-blue-200 transition duration-300 cursor-pointer">Anasayfa</a>
          </div>
        </div>
        {isNavOpen && (
          <div className="md:hidden bg-blue-700 mt-4 rounded-md shadow-lg">
            <a onClick={goHome} className="block px-4 py-2 text-white hover:bg-blue-600 transition duration-300 cursor-pointer">Anasayfa</a>
          </div>
        )}
      </nav>

      <div className="w-full h-[650px] flex flex-col font-sans bg-white pt-12">
        <main className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">

          <div>
            {currentPage === PageState.Main && (
              <div className="w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">👋 Hoş Geldiniz!</h2>
                <p className="text-gray-600 mb-6">Aşağıda bulunduğunuz sayfaya göre sıkça sorulan soruları bulabilirsiniz.</p>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{pageTitles[location.pathname] || 'Genel Konular'}</h3>
                {currentFAQs.length > 0 ? (
                  <div className="space-y-2">
                    {currentFAQs.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => showAnswer(item)}>
                        {item.question}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">Bu sayfa için SSS bulunamadı.</p>}
              </div>
            )}

            {currentPage === PageState.Answer && currentQuestion && (
              <div className="animate-fade-in space-y-4">
                <button className="mb-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={goToQuestions}>← Sorulara Dön</button>
                <div className="p-4 bg-blue-50 rounded-lg"><h3 className="font-semibold">Soru:</h3><p>{currentQuestion.question}</p></div>
                <div className="p-4 bg-green-50 rounded-lg"><h4 className="font-semibold">Cevap:</h4><div>{linkify(currentQuestion.answer)}</div></div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-3">Sorunuz çözüme ulaştı mı?</h4>
                  <div className="flex justify-center gap-3">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => satisfactionResponse(true)}>✅ Evet</button>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg" onClick={() => satisfactionResponse(false)}>❌ Hayır</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {chatHistory.length > 0 && (
            <div className="mt-6 border-t-2 border-gray-200 pt-6">
              <div className="space-y-3">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl max-w-xs text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} whitespace-pre-wrap break-words`}>
                      <strong>{msg.role === 'user' ? 'Sen' : 'Bot'}:</strong> {linkify(msg.content)}
                      {msg.role === 'assistant' && isLoading && msg.content.length === 0 && <span className="animate-pulse">...</span>}
                      {msg.action && (
                        <a href={msg.action.url} target="_blank" rel="noopener noreferrer" className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs text-center">
                          {msg.action.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {options.length > 0 && (
                <div className="flex justify-center gap-3 my-3">
                  {options.map((option) => (
                    <button key={option.payload} onClick={() => handleOptionClick(option.payload)} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="p-3 bg-white border-t rounded-b-lg flex-shrink-0">

          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={!userType ? "Lütfen önce bir rol seçin..." : ""}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              className="flex-grow bg-transparent outline-none text-sm"
              disabled={isChatDisabled}
            />
            {isLoading ? (
              <button onClick={handleStop} className="text-blue-600" aria-label="Durdur">
                <FaStopCircle className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={handleSend} disabled={isChatDisabled || !input.trim()} className="text-blue-600" aria-label="Gönder">
                <IoIosSend className="w-6 h-6" />
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
