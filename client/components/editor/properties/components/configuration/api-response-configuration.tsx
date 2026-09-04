/**
 * @fileoverview Панель свойств узла api_response
 * @module properties/components/configuration/api-response-configuration
 */

import type { Node } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/** Пропсы ApiResponseConfiguration */
interface ApiResponseConfigurationProps {
  /** Выбранный узел */
  selectedNode: Node;
  /** Обновление данных узла */
  onUpdateNode: (nodeId: string, updates: Partial<Node['data']>) => void;
}

/**
 * Панель свойств ответа API
 * @param props - Пропсы компонента
 * @returns JSX элемент
 */
export function ApiResponseConfiguration({ selectedNode, onUpdateNode }: ApiResponseConfigurationProps) {
  const data = selectedNode.data as Record<string, unknown>;

  /**
   * Обновляет поле data
   * @param field - Имя поля
   * @param value - Значение
   */
  const update = (field: string, value: unknown) =>
    onUpdateNode(selectedNode.id, { [field]: value });

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-xl bg-violet-50/60 dark:bg-violet-900/20 border border-violet-200/50 p-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Completes an HTTP request initiated by an API trigger. Supports {"{variables}"} in the body.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">HTTP status</Label>
        <Input
          type="number"
          value={Number(data.apiResponseStatusCode ?? 200)}
          onChange={(e) => update('apiResponseStatusCode', Number(e.target.value) || 200)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Content-Type</Label>
        <Select
          value={String(data.apiResponseContentType ?? 'application/json')}
          onValueChange={(v) => update('apiResponseContentType', v)}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="application/json">application/json</SelectItem>
            <SelectItem value="text/plain">text/plain</SelectItem>
            <SelectItem value="text/html">text/html</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Response body</Label>
        <Textarea
          rows={5}
          className="font-mono text-xs"
          value={String(data.apiResponseBody ?? '')}
          onChange={(e) => update('apiResponseBody', e.target.value)}
        />
      </div>
    </div>
  );
}
