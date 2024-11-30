import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CodePost } from "@/components/CodePost";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchLikedPosts();
  }, [id]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      return;
    }

    setProfile(data);
    setBio(data.bio || "");
    setGithubUrl(data.github_url || "");
    setLoading(false);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:profiles(username),
        likes:likes(count)
      `)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
      return;
    }

    setPosts(data);
  };

  const fetchLikedPosts = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select(`
        posts:posts(
          *,
          profiles:profiles(username),
          likes:likes(count)
        )
      `)
      .eq("user_id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load liked posts",
        variant: "destructive",
      });
      return;
    }

    setLikedPosts(data.map((like) => like.posts));
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        bio,
        github_url: githubUrl,
      })
      .eq("id", user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setEditing(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">{profile.username}'s Profile</h1>
          {!editing ? (
            <div className="space-y-4">
              <p className="text-gray-600">{profile.bio || "No bio yet"}</p>
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub Profile
                </a>
              )}
              {isOwnProfile && (
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Write something about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Input
                placeholder="GitHub URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <div className="space-x-2">
                <Button onClick={updateProfile}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="likes">Liked Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-6">
            {posts.map((post) => (
              <CodePost
                key={post.id}
                username={post.profiles.username}
                avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                title={post.title}
                initialCode={post.initial_code}
                optimizedCode={post.optimized_code}
                likes={post.likes?.[0]?.count || 0}
                comments={[]}
                timestamp={new Date(post.created_at).toLocaleDateString()}
                language={post.language}
              />
            ))}
          </TabsContent>
          <TabsContent value="likes" className="space-y-6">
            {likedPosts.map((post) => (
              <CodePost
                key={post.id}
                username={post.profiles.username}
                avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                title={post.title}
                initialCode={post.initial_code}
                optimizedCode={post.optimized_code}
                likes={post.likes?.[0]?.count || 0}
                comments={[]}
                timestamp={new Date(post.created_at).toLocaleDateString()}
                language={post.language}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;