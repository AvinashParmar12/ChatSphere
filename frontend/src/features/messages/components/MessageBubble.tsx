import clsx from "clsx";
import type { Message } from "../types/message.types";
import { formatMessageTime } from "@/features/conversations/utils/conversation.mapper"; // wait I can use the existing time formatter

const MessageBubble = ({
  message,
  isOwnMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
}) => {
  const isSystem = message.messageType === "system";
  const timeString = formatMessageTime(message.createdAt);

  if (isSystem) {
    return (
      <div className="flex w-full justify-center my-4">
        <div className="rounded-full bg-slate-800/60 px-4 py-1.5 text-xs font-medium text-slate-400">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx("flex w-full mb-4 px-4 gap-3", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
      })}
    >
      {/* Avatar for other user's message */}
      {!isOwnMessage && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white overflow-hidden mt-auto">
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[10px] tracking-wider uppercase">
              {message.sender.username.substring(0, 2)}
            </span>
          )}
        </div>
      )}

      {/* Message Content */}
      <div
        className={clsx("flex flex-col max-w-[70%]", {
          "items-end": isOwnMessage,
          "items-start": !isOwnMessage,
        })}
      >
        {!isOwnMessage && (
          <span className="mb-1 ml-1 text-xs font-medium text-slate-400">
            {message.sender.username}
          </span>
        )}
        
        <div
          className={clsx("rounded-2xl px-4 py-2.5 shadow-sm", {
            "bg-blue-600 text-white rounded-br-sm": isOwnMessage,
            "bg-slate-800 text-slate-200 rounded-bl-sm": !isOwnMessage,
          })}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <span className="mt-1 text-[10px] text-slate-500 font-medium px-1">
          {timeString}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
