import { useState, useEffect } from "react";
import { CodePost } from "./CodePost";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

export const Feed = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [selectedLanguage]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles(username),
          likes:likes(count)
        `)
        .order("created_at", { ascending: false });

      if (selectedLanguage !== "all") {
        query = query.eq("language", selectedLanguage);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);

      // Update languages list
      const uniqueLanguages = Array.from(
        new Set(data?.map((post) => post.language) || [])
      );
      setLanguages(uniqueLanguages);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="w-[200px] mb-6">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map(lang => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {posts.map((post) => (
        <CodePost
          key={post.id}
          id={post.id}
          username={post.profiles.username}
          avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
          title={post.title}
          initialCode={post.initial_code}
          optimizedCode={post.optimized_code}
          likes={post.likes?.[0]?.count || 0}
          comments={[]}
          timestamp={new Date(post.created_at).toLocaleDateString()}
          language={post.language}
          userId={post.user_id}
        />
      ))}
    </div>
  );
};