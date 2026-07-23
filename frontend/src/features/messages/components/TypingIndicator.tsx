interface TypingIndicatorProps {
  users: string[];
}

const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) return null;

  let text = "";
  if (users.length === 1) {
    text = `${users[0]} is typing...`;
  } else if (users.length === 2) {
    text = `${users.join(" and ")} are typing...`;
  } else if (users.length > 2) {
    text = `${users.length} people are typing...`;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400">
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{text}</span>
    </div>
  );
};

export default TypingIndicator;
