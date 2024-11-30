import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-sm">
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => navigate("/login")}>
        Sign in
      </Button>
      <Button onClick={() => navigate("/signup")}>
        Sign up
      </Button>
    </div>
  );
};