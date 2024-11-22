import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";

enum Role {
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  role: Role;
  content: string;
}

const App: React.FC = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage: Message = { role: Role.User, content: userMessage };
    setUserMessage("");
    setChatHistory((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        userMessage,
      });

      const botMessage: Message = {
        role: Role.Assistant,
        content: response.data.response,
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Ошибка API:", error);
    }
  };

  const handleSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  useEffect(() => {
    document.body.className = isDarkTheme ? "dark" : "light";
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1 className="chat-title">Chat</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            <img
              className="icon"
              src={`/src/assets/icons/${isDarkTheme ? "sun" : "moon"}.svg`}
              alt={isDarkTheme ? "Солнце" : "Луна"}
            />
          </button>
        </div>
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.role === "user" ? "user" : "assistant"
              }`}
            >
              <div>{message.content}</div>

              <img
                src={`/src/assets/icons/user-${
                  isDarkTheme ? "light" : "dark"
                }.svg`}
                alt="user icon"
              />
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={userMessage}
            onChange={handleInputChange}
            placeholder="Введите сообщение..."
            onKeyDown={handleSend}
          />
          <button
            className="btn"
            disabled={!userMessage.trim()}
            onClick={handleSendMessage}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
