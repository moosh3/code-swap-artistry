import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CommentType {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

interface CodePostProps {
  id?: string;
  username: string;
  avatarUrl: string;
  title: string;
  initialCode: string;
  optimizedCode: string;
  likes: number;
  comments: CommentType[];
  timestamp: string;
  language: string;
  userId?: string;
}

export const CodePost = ({
  id,
  username,
  avatarUrl,
  title,
  initialCode,
  optimizedCode,
  likes: initialLikes,
  comments: initialComments,
  timestamp,
  language,
  userId,
}: CodePostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && id) {
      checkIfLiked();
    }
  }, [user, id]);

  const checkIfLiked = async () => {
    if (!id || !user) return;

    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setIsLiked(true);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      console.error("Post ID is missing");
      return;
    }

    if (isLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to unlike post",
          variant: "destructive",
        });
        return;
      }

      setIsLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ post_id: id, user_id: user.id }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to like post",
          variant: "destructive",
        });
        return;
      }

      setIsLiked(true);
      setLikesCount(likesCount + 1);
    }
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
          <Avatar 
            className="h-10 w-10 cursor-pointer" 
            onClick={() => userId && navigate(`/profile/${userId}`)}
          >
            <img src={avatarUrl} alt={username} className="object-cover" />
          </Avatar>
          <div className="flex flex-col">
            <span 
              className="font-medium cursor-pointer hover:underline" 
              onClick={() => userId && navigate(`/profile/${userId}`)}
            >
              {username}
            </span>
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