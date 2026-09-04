/**
 * @fileoverview Панель свойств ноды задержки
 * @module components/editor/properties/components/configuration/delay-configuration
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Node } from '@shared/schema';
import { VariableSelector } from '../variables/variable-selector';
import type { Variable } from '../../../inline-rich/types';

/** Пропсы компонента конфигурации задержки */
interface DelayConfigurationProps {
  /** Выбранный узел delay */
  selectedNode: Node;
  /** Функция обновления данных узла */
  onNodeUpdate: (nodeId: string, updates: Partial<any>) => void;
  /** Доступные переменные */
  textVariables?: Variable[];
}

/**
 * Компонент конфигурации ноды задержки.
 * Содержит выбор режима, значение задержки, единицы времени и селектор переменных.
 */
export function DelayConfiguration({ selectedNode, onNodeUpdate, textVariables = [] }: DelayConfigurationProps) {
  const data = selectedNode.data as any;
  const seconds = data?.seconds || '3';
  const unit = data?.unit || 'seconds';
  const mode = data?.mode || 'blocking';

  /** Вставка переменной в поле значения */
  const handleVariableInsert = (varName: string) => {
    onNodeUpdate(selectedNode.id, { seconds: `{${varName}}` });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Режим */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Mode</Label>
        <Select value={mode} onValueChange={(val) => onNodeUpdate(selectedNode.id, { mode: val })}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blocking">⏸ Pause</SelectItem>
            <SelectItem value="background">🚀 Background timer</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-gray-400">
          {mode === 'blocking' ? "Waits for the specified time, then moves on" : "Starts a transition after N time, the chain ends immediately"}
        </p>
      </div>

      {/* Значение + единицы */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Delay</Label>
        <div className="flex gap-2">
          <Input
            value={seconds}
            onChange={(e) => onNodeUpdate(selectedNode.id, { seconds: e.target.value })}
            placeholder={unit === 'seconds' ? "3 or 0.1" : '3'}
            className="h-8 text-xs flex-1"
          />
          <Select value={unit} onValueChange={(val) => onNodeUpdate(selectedNode.id, { unit: val })}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">minutes</SelectItem>
              <SelectItem value="hours">Watch</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {unit === 'seconds' && (
          <p className="text-[10px] text-gray-400">
            Fractional values ​​are supported, for example 0.1 = 100 ms
          </p>
        )}
      </div>

      {/* Селектор переменных */}
      {textVariables.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Insert variable</Label>
          <VariableSelector
            availableVariables={textVariables}
            onSelect={handleVariableInsert}
          />
        </div>
      )}
    </div>
  );
}
