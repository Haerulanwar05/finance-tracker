import * as React from "react";
import {
  Shield,
  Plane,
  Home,
  Car,
  Laptop,
  Briefcase,
  GraduationCap,
  Heart,
  PiggyBank,
  Gem,
  Sparkles,
} from "lucide-react";

interface GoalIconProps {
  name?: string | null;
  className?: string;
}

export function GoalIcon({ name, className = "h-5 w-5" }: GoalIconProps) {
  switch (name?.toLowerCase()) {
    case "shield":
      return <Shield className={className} />;
    case "plane":
      return <Plane className={className} />;
    case "home":
      return <Home className={className} />;
    case "car":
      return <Car className={className} />;
    case "laptop":
      return <Laptop className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "graduation":
    case "graduationcap":
      return <GraduationCap className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "gem":
      return <Gem className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "piggy":
    case "piggybank":
    default:
      return <PiggyBank className={className} />;
  }
}
