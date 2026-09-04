/**
 * @fileoverview Диалог создания персонального токена агента (MCP)
 *
 * Форма: название, права (read / read,write), срок действия. После успеха
 * передаёт полный секрет токена наверх для одноразового показа.
 *
 * @module editor/agent/CreateTokenDialog
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateAgentToken } from "./use-agent-tokens";
import type { CreateAgentTokenBody } from "./agent-token-types";

/** Свойства диалога создания токена */
export interface CreateTokenDialogProps {
  /** Признак открытия диалога */
  open: boolean;
  /** Обработчик изменения состояния открытия */
  onOpenChange: (open: boolean) => void;
  /** Колбэк с полным секретом созданного токена */
  onCreated: (token: string) => void;
}

/**
 * Диалог создания токена агента.
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function CreateTokenDialog({ open, onOpenChange, onCreated }: CreateTokenDialogProps) {
  const { toast } = useToast();
  const createToken = useCreateAgentToken();
  const [label, setLabel] = useState("");
  // Права временно зафиксированы на read,write (селектор скрыт до включения enforcement scopes)
  const scopes: CreateAgentTokenBody["scopes"] = "read,write";
  const [expiry, setExpiry] = useState("0");

  /** Отправляет форму создания токена */
  const handleSubmit = async () => {
    if (!label.trim()) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    const expiresInDays = parseInt(expiry);
    try {
      const res = await createToken.mutateAsync({
        label: label.trim(),
        scopes,
        ...(expiresInDays > 0 ? { expiresInDays } : {}),
      });
      onOpenChange(false);
      setLabel("");
      setExpiry("0");
      onCreated(res.token);
    } catch {
      toast({ title: "Failed to create token", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a token</DialogTitle>
          <DialogDescription>A token for connecting an AI agent to your projects.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="agent-token-label">Name</Label>
            <Input
              id="agent-token-label"
              placeholder={"For example, Cursor on a laptop"}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Validity period</Label>
            <Select value={expiry} onValueChange={setExpiry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No deadline</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createToken.isPending}>
            {createToken.isPending ? "We create..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
