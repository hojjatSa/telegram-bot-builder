/**
 * @fileoverview Секция настроек Deep Link для команды /start
 *
 * Отображает поля режима совпадения, параметра deep link,
 * превью ссылки и опциональное сохранение значения в переменную.
 * @module components/editor/properties/components/trigger/DeepLinkSection
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeepLinkSectionProps {
  deepLinkMatchMode: 'exact' | 'startsWith';
  deepLinkParam: string;
  deepLinkSaveToVar: boolean;
  deepLinkVarName: string;
  onChange: (updates: Partial<DeepLinkSectionProps>) => void;
}

export function DeepLinkSection({
  deepLinkMatchMode,
  deepLinkParam,
  deepLinkSaveToVar,
  deepLinkVarName,
  onChange,
}: DeepLinkSectionProps) {
  const preview = deepLinkParam ? `t.me/bot?start=${deepLinkParam}` : 't.me/bot?start=<value>';

  return (
    <div className="space-y-3 rounded-lg border border-sky-300/40 dark:border-sky-700/40 p-3">
      <Label className="text-sm font-semibold text-sky-700 dark:text-sky-300">Deep Link</Label>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Match mode</Label>
        <Select
          value={deepLinkMatchMode}
          onValueChange={(value) =>
            onChange({ deepLinkMatchMode: value as 'exact' | 'startsWith' })
          }
        >
          <SelectTrigger className="text-sm bg-white/70 dark:bg-slate-950/60 border border-sky-300/40 dark:border-sky-700/40 hover:border-sky-400/60 dark:hover:border-sky-600/60 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 rounded-lg text-sky-900 dark:text-sky-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-sky-50/95 to-blue-50/90 dark:from-slate-900/95 dark:to-slate-800/95">
            <SelectItem value="exact">Exact match</SelectItem>
            <SelectItem value="startsWith">Starts with</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Parameter</Label>
        <Input
          value={deepLinkParam}
          onChange={(e) => onChange({ deepLinkParam: e.target.value })}
          placeholder="ref"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground font-mono">{preview}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange({ deepLinkSaveToVar: !deepLinkSaveToVar })}
        className="flex items-center gap-2 w-full text-left group"
      >
        <div className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${
          deepLinkSaveToVar
            ? 'bg-sky-500'
            : 'bg-slate-600 dark:bg-slate-700'
        }`}>
          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
            deepLinkSaveToVar ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          Save to variable
        </span>
      </button>

      {deepLinkSaveToVar && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Variable name</Label>
          <Input
            value={deepLinkVarName}
            onChange={(e) => onChange({ deepLinkVarName: e.target.value })}
            placeholder="referrer_id"
            className="font-mono"
          />
        </div>
      )}
    </div>
  );
}
