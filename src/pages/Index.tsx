import { Feed } from "@/components/Feed";
import { AuthButtons } from "@/components/AuthButtons";
import { CreatePost } from "@/components/CreatePost";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">codebutits.art</h1>
          <div className="flex items-center gap-4">
            {user && <CreatePost />}
            <AuthButtons />
          </div>
        </div>
      </header>
      <main>
        <Feed />
      </main>
    </div>
  );
};

export default Index;