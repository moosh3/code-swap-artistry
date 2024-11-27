import { Avatar } from "./ui/avatar";

interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

export const Comment = ({ username, avatarUrl, content, timestamp }: CommentProps) => {
  return (
    <div className="flex gap-3 p-4 border-b">
      <Avatar className="h-8 w-8">
        <img src={avatarUrl} alt={username} className="object-cover" />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{username}</span>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        <p className="mt-1 text-sm">{content}</p>
      </div>
    </div>
  );
};