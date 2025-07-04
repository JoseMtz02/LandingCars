import { useAuthDebugger } from "../hooks/useAuthDebugger";

interface DebugWrapperProps {
  children: React.ReactNode;
}

export function DebugWrapper({ children }: DebugWrapperProps) {
  useAuthDebugger();
  return <>{children}</>;
}
