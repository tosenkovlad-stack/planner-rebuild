import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  value: string;
  onSave: (v: string) => void;
}

export default function AffirmationSection({ value, onSave }: Props) {
  const [text, setText] = useState(value);

  useEffect(() => { setText(value); }, [value]);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        Daily Affirmation
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => { if (text !== value) onSave(text); }}
        placeholder="Today I will..."
        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-lg font-heading"
      />
    </section>
  );
}
