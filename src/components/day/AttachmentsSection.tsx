import { useState, useRef } from "react";
import { Paperclip, Plus, Link as LinkIcon, Image, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Attachment {
  id: string;
  type: string;
  url: string;
  label: string | null;
}

interface Props {
  attachments: Attachment[];
  onAddLink: (url: string, label: string) => void;
  onAddImage: (file: File) => void;
  onDelete: (id: string) => void;
}

export default function AttachmentsSection({ attachments, onAddLink, onAddImage, onDelete }: Props) {
  const [addingLink, setAddingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    onAddLink(linkUrl, linkLabel || linkUrl);
    setLinkUrl("");
    setLinkLabel("");
    setAddingLink(false);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Paperclip className="h-4 w-4" />
          Attachments
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setAddingLink(!addingLink)} className="h-7 gap-1 text-xs">
            <LinkIcon className="h-3 w-3" /> Link
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="h-7 gap-1 text-xs">
            <Image className="h-3 w-3" /> Image
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onAddImage(e.target.files[0]); }} />
        </div>
      </div>

      {addingLink && (
        <div className="mb-3 space-y-2 rounded-md border border-border bg-secondary/30 p-3">
          <Input placeholder="URL" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
          <Input placeholder="Label (optional)" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddLink}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingLink(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {attachments.length === 0 && !addingLink && <p className="text-sm text-muted-foreground/50">No attachments yet</p>}
        {attachments.filter(a => a.type === "image").map(a => (
          <div key={a.id} className="group relative overflow-hidden rounded-md">
            <img src={a.url} alt={a.label ?? ""} className="w-full max-h-48 object-cover rounded-md" />
            <button onClick={() => onDelete(a.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-background/80 p-1">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
        ))}
        {attachments.filter(a => a.type === "link").map(a => (
          <div key={a.id} className="group flex items-center gap-2 rounded-md p-2 hover:bg-muted/30">
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-primary hover:underline truncate">{a.label || a.url}</a>
            <button onClick={() => onDelete(a.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
