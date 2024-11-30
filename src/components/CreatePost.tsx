import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [language, setLanguage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to post code snippets",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("posts").insert([
        {
          title,
          initial_code: initialCode,
          optimized_code: optimizedCode,
          language,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your code snippet has been posted",
        variant: "default",
        className: "bg-green-500 text-white",
      });

      setIsOpen(false);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const highlightCode = (code: string) => {
    if (!language) return code;
    
    const grammar = Prism.languages[language.toLowerCase()];
    if (grammar) {
      return Prism.highlight(code, grammar, language.toLowerCase());
    }
    return code;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Post Code Snippet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Code Snippet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Textarea
              placeholder="Initial Code"
              value={initialCode}
              onChange={(e) => setInitialCode(e.target.value)}
              className="min-h-[150px] font-mono"
              style={{ 
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "0.5rem" 
              }}
            />
            {language && (
              <pre 
                className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
                style={{ padding: "1rem" }}
              >
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightCode(initialCode) 
                  }} 
                />
              </pre>
            )}
          </div>
          <div className="relative">
            <Textarea
              placeholder="Optimized Code"
              value={optimizedCode}
              onChange={(e) => setOptimizedCode(e.target.value)}
              className="min-h-[150px] font-mono"
              style={{ 
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "0.5rem" 
              }}
            />
            {language && (
              <pre 
                className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
                style={{ padding: "1rem" }}
              >
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightCode(optimizedCode) 
                  }} 
                />
              </pre>
            )}
          </div>
          <Button type="submit">Post</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};