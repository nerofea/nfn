import React from "react";

const StreamChat = () => {
  return (
    <div className="w-[300px] bg-[#0e0e11] text-white flex flex-col rounded-lg shadow-md border-l-4 border-purple-600">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-[#1c1c21] border-b border-gray-800 text-xs font-semibold">
        <span>STREAM CHAT</span>
        <button>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" />
          </svg>
        </button>
      </div>

      {/* Active users */}
      <div className="flex gap-2 px-3 py-2 text-xs border-b border-gray-800">
        <span className="flex items-center gap-1">
          🪙 <span className="text-gray-300">Boris_Mitov_1...</span>
        </span>
        <span className="flex items-center gap-1">
          🪙 <span className="text-gray-300">vladinson0...</span>
        </span>
      </div>

      {/* Pinned Message */}
      <div className="bg-[#16161a] m-2 px-3 py-2 rounded-lg text-sm">
        <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
          <span>
            📌 Pinned by <span className="text-red-500">🇧🇬 Nerofea</span>
          </span>
          <button className="text-white">▼</button>
        </div>
        <div className="font-bold">Ти си monster</div>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Chat Input */}
      <div className="px-2 py-2 border-t border-gray-800">
        <input
          type="text"
          placeholder="Send a message"
          className="w-full bg-[#1c1c21] text-sm px-3 py-2 rounded-lg focus:outline-none placeholder-gray-500"
        />
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1 px-1">
          <div className="flex gap-2">🔮 ⚙️</div>
          <button className="bg-purple-600 text-white px-3 py-1 rounded">Chat</button>
        </div>
      </div>
    </div>
  );
};

export default StreamChat;
