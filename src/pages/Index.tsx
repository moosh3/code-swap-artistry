import { Feed } from "@/components/Feed";
import { AuthButtons } from "@/components/AuthButtons";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">codebutits.art</h1>
          <AuthButtons />
        </div>
      </header>
      <main>
        <Feed />
      </main>
    </div>
  );
};

export default Index;