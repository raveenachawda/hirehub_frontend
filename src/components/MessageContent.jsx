import React, { useState } from "react";
import { Send, Search as SearchIcon } from "lucide-react";

const MessageContent = ({ messages, setMessages }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toISOString(),
        unread: false,
        company: selectedMessage?.company || "Unknown Company",
        position: selectedMessage?.position || "Unknown Position",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 h-[calc(100vh-100px)]">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Message List */}
        <div className="col-span-4 border-r pr-4 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F83002]"
              />
              <SearchIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    // Mark as read when selected
                    setMessages(
                      messages.map((m) =>
                        m.id === message.id ? { ...m, unread: false } : m
                      )
                    );
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedMessage?.id === message.id
                      ? "bg-[#ffe5e0]"
                      : "hover:bg-gray-100"
                  } ${message.unread ? "font-semibold" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {message.content}
                  </p>
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="font-medium">{message.company}</span>
                    <span className="mx-1">•</span>
                    <span>{message.position}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="col-span-8 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold">{selectedMessage.company}</h3>
                <p className="text-sm text-gray-600">
                  {selectedMessage.position}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-[#ffe5e0] p-4 rounded-lg max-w-[80%]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {selectedMessage.sender}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{selectedMessage.content}</p>
                </div>
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F83002]"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#F83002] text-white px-4 py-2 rounded-lg hover:bg-[#ff5a3a] transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
