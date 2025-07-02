import { useState, useEffect, useRef } from 'react'; // useRef eklendi
import type { ChangeEvent } from 'react';
import './App.css';
import { categories } from './data';
import type { Question } from './data'

type Message = { role: "user" | "assistant"; content: string };

const PageState = {
  Main: 'main',
  Questions: 'questions',
  Answer: 'answer',
} as const;

type PageState = typeof PageState[keyof typeof PageState];


function App() {
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Kaydırma için ref

  const [currentPage, setCurrentPage] = useState<PageState>(PageState.Main);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Mesajlar eklendiğinde otomatik aşağı kaydırma
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", content: input }]);
    setInput('');

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      if (!res.ok) {
        throw new Error('Sunucu hatası: ' + res.status);
      }

      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.message?.content || "Cevap alınamadı" }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Bir hata oluştu: " + (error as Error).message }]);
    }
    finally {
      setLoading(false);
    }

  };

  const showQuestions = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage(PageState.Questions);
  };

  const showAnswer = (category: string, questionIndex: number) => {
    const questionData = categories[category]?.questions[questionIndex];
    if (questionData) {
      setCurrentQuestion(questionData);
      setCurrentPage(PageState.Answer);
    }
  };

  const satisfactionResponse = (satisfied: boolean) => {
    if (satisfied) {
      alert('Sorunuz çözüldüğü için mutluyuz! 😊\n\nAna sayfaya yönlendiriliyorsunuz...');
      goHome();
    } else {
      alert('Başka sorularınız için yardımcı olmaya devam ediyoruz! 🤝\n\nSoru listesine dönüyorsunuz...');
      goToQuestions();
    }
  };

  const goHome = () => {
    setCurrentPage(PageState.Main);
    setCurrentCategory('');
    setCurrentQuestion(null);
  };

  const goToQuestions = () => {
    setCurrentPage(PageState.Questions);
    setCurrentQuestion(null);
  };

  return (
    <>
      <div className="chatbot-container">
        <div className="header">
          <h1>🎓 PAÜ Öğrenci Danışman Chatbot</h1>
        </div>

        <div className="scrollable-content-area"> {/* Hem Soru-Cevap hem de Sohbet Geçmişi için kaydırılabilir alan */}
          {/* Ana Sayfa */}
          {currentPage === PageState.Main && (
            <div id="mainPage" className="page-section">
              <div className="welcome-message">
                <h2>👋 Hoş Geldiniz!</h2>
                <p>Aşağıdaki kategorilerden birine tıklayarak sorularınızın yanıtlarını bulabilirsiniz.</p>
              </div>

              <div className="keywords-container" id="keywordsContainer">
                {Object.keys(categories).map((category) => (
                  <button
                    key={category}
                    className="keyword-tag"
                    onClick={() => showQuestions(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* Soru Seçim Sayfası */}
          {currentPage === PageState.Questions && currentCategory && (
            <div id="questionPage" className="page-section">
              <button className="back-button" onClick={goHome}>← Kategorilere Dön</button>
              <div className="chat-area">
                <div className="question-section">
                  <h3>{currentCategory} - Sorular</h3>
                  <div id="categoryQuestions" className="category-questions">
                    {categories[currentCategory]?.questions.map((item: Question, index: number) => (
                      <div
                        key={index}
                        className="question-item"
                        onClick={() => showAnswer(currentCategory, index)}
                      >
                        {item.q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cevap Sayfası */}
          {currentPage === PageState.Answer && currentQuestion && (
            <div id="answerPage" className="page-section">
              <button className="back-button" onClick={goToQuestions}>← Sorulara Dön</button>
              <div className="chat-area">
                <div className="question-section">
                  <h3>📝 Sorunuz:</h3>
                  <p id="currentQuestion">{currentQuestion.q}</p>
                </div>

                <div className="answer-section">
                  <h4>💡 Cevap:</h4>
                  <div id="currentAnswer" className="answer-text">{currentQuestion.a}</div>
                </div>

                <div className="satisfaction-check">
                  <h4>❓ Sorunuz çözüme ulaştı mı?</h4>
                  <div className="satisfaction-buttons">
                    <button className="btn btn-success" onClick={() => satisfactionResponse(true)}>
                      ✅ Evet, çözüldü
                    </button>
                    <button className="btn btn-warning" onClick={() => satisfactionResponse(false)}>
                      ❌ Hayır, başka soru var
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entegre Sohbet Geçmişi */}
          <div className="integrated-chat-history">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}
              >
                <strong>{msg.role === 'user' ? 'Sen' : 'Bot'}:</strong> {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Otomatik kaydırma için boş div */}
          </div>
        </div>
        {/* Loading durumu mesajı */}
        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              fontStyle: 'italic',
              color: '#666',
              padding: '8px 12px',
              maxWidth: '60%',
            }}
          >
            Bot: Cevabınız yazılıyor...
          </div>
        )}

        {/* Entegre Sohbet Girişi - Her Zaman Görünür */}
        <div className="integrated-chat-input">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Mesaj yaz..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button onClick={handleSend}>Gönder</button>
        </div>

      </div>
    </>
  );
}

export default App;