import React from "react";
import { BrainCircuit } from "lucide-react";

export function CodeMindIcon({ className, ...props }: React.ComponentProps<typeof BrainCircuit>) {
    return <BrainCircuit className={className} {...props} />;
}
