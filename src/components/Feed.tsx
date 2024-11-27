import { useState } from "react";
import { CodePost } from "./CodePost";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const SAMPLE_POSTS = [
  {
    username: "sarah_dev",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    title: "Optimizing array manipulation in TypeScript",
    initialCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}`,
    optimizedCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);`,
    likes: 42,
    comments: 5,
    timestamp: "2h ago",
    language: "typescript",
  },
  {
    username: "code_master",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    title: "Better React state management",
    initialCode: `const [name, setName] = useState("");
const [age, setAge] = useState(0);
const [email, setEmail] = useState("");`,
    optimizedCode: `const [user, setUser] = useState({
  name: "",
  age: 0,
  email: ""
});`,
    likes: 28,
    comments: 3,
    timestamp: "4h ago",
    language: "javascript",
  },
];

const LANGUAGES = Array.from(new Set(SAMPLE_POSTS.map(post => post.language)));

export const Feed = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const filteredPosts = selectedLanguage !== "all"
    ? SAMPLE_POSTS.filter(post => post.language === selectedLanguage)
    : SAMPLE_POSTS;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="w-[200px] mb-6">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredPosts.map((post, index) => (
        <CodePost key={index} {...post} />
      ))}
    </div>
  );
};