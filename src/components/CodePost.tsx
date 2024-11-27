import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useAuth } from "@/contexts/AuthContext";

interface CommentType {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

interface CodePostProps {
  username: string;
  avatarUrl: string;
  title: string;
  initialCode: string;
  optimizedCode: string;
  likes: number;
  comments: CommentType[];
  timestamp: string;
  language: string;
}

export const CodePost = ({
  username,
  avatarUrl,
  title,
  initialCode,
  optimizedCode,
  likes,
  comments: initialComments,
  timestamp,
  language,
}: CodePostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleComment = (content: string) => {
    if (!user) return;
    
    const newComment: CommentType = {
      id: Math.random().toString(),
      username: user.email?.split("@")[0] || "anonymous",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      content,
      timestamp: "Just now",
    };

    setComments([...comments, newComment]);
  };

  return (
    <div className="post-card p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img src={avatarUrl} alt={username} className="object-cover" />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{username}</span>
            <span className="text-sm text-gray-500">{timestamp}</span>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {language}
        </Badge>
      </div>

      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Initial Implementation</h3>
          <pre className="code-block">{initialCode}</pre>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Optimized Version</h3>
          <pre className="code-block">{optimizedCode}</pre>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", isLiked && "text-secondary")}
          onClick={handleLike}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          {likesCount}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5" />
          {comments.length}
        </Button>
      </div>

      {showComments && (
        <div className="mt-4">
          {user && <CommentForm onSubmit={handleComment} />}
          <div className="space-y-2">
            {comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};