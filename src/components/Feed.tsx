import { CodePost } from "./CodePost";

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
  },
];

export const Feed = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {SAMPLE_POSTS.map((post, index) => (
        <CodePost key={index} {...post} />
      ))}
    </div>
  );
};