import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [language, setLanguage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement post creation with Supabase
    toast({
      title: "Success",
      description: "Your code snippet has been posted!",
    });
  };

  return (
    <Dialog>
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
          <Textarea
            placeholder="Initial Code"
            value={initialCode}
            onChange={(e) => setInitialCode(e.target.value)}
            className="min-h-[150px] font-mono"
          />
          <Textarea
            placeholder="Optimized Code"
            value={optimizedCode}
            onChange={(e) => setOptimizedCode(e.target.value)}
            className="min-h-[150px] font-mono"
          />
          <Button type="submit">Post</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};