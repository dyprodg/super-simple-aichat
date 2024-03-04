import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import Loader from "./components/loader";

const App = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { question: "test", answer: "this is the answer for the test" },
    { question: "test", answer: "this is the answer for the second test" },
  ]);
  const groqClient = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: inputMessage,
          },
        ],
        model: "mixtral-8x7b-32768",
      });

      const newMessage = {
        question: inputMessage,
        answer: completion.choices[0]?.message?.content.replace(/\n/g, "\n"),
      };

      setChatMessages([newMessage, ...chatMessages]);
      setInputMessage("");
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="mt-8 flex h-20 w-[80%] items-center justify-between border-b-2 border-gray-300 bg-white shadow-lg">
        <textarea
          className="m-4 w-full resize-none rounded-md border-2 p-2 hover:border-gray-400 focus:border-gray-400"
          placeholder="Enter message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        <button
          className={`mx-4 rounded-md p-2 ${
            loading
              ? "cursor-wait bg-gray-100 text-gray-500"
              : "bg-black text-white hover:bg-gray-800"
          }`}
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? "Wait..." : "Send"}
        </button>
      </div>
      {loading && <Loader />}

      <div className="mt-2 w-[80%] bg-transparent">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className="my-4 mb-2 flex w-full flex-col rounded-md border bg-gray-100 p-2 shadow-lg"
          >
            <div>
              <strong>User:</strong> {message.question}
            </div>
            <div>
              <strong>Dyprod AI:</strong>{" "}
              <div className="m-2 rounded-md bg-stone-700 p-2 text-white shadow-lg">
                {message.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
