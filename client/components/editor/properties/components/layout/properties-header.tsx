/**
 * @fileoverview Компонент заголовка панели свойств узла
 * 
 * Отображает информацию о выбранном узле, иконку типа,
 * селектор типа узла и ID для копирования.
 * 
 * @module PropertiesHeader
 */

import { Node } from '@shared/schema';
import { Button as UIButton } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getNodeDefaults } from '../../utils/node-defaults';
import { getNodeName, getNodeIcon, getNodeColor } from '../../../shared/node-registry';
import { PropertiesViewToggle, type PropertiesView } from './properties-view-toggle';

/**
 * Пропсы компонента заголовка панели свойств
 */
interface PropertiesHeaderProps {
  /** Выбранный узел для редактирования */
  selectedNode: Node;
  /** Функция изменения типа узла */
  onNodeTypeChange?: (nodeId: string, newType: Node['type'], newData: Partial<Node['data']>) => void;
  /** Функция закрытия панели */
  onClose?: (() => void) | undefined;
  /** Отображаемый ID узла */
  displayNodeId: string;
  /** Режим панели: форма или JSON */
  propertiesView?: PropertiesView;
  /** Смена режима панели */
  onPropertiesViewChange?: (view: PropertiesView) => void;
}

/**
 * Компонент заголовка панели свойств узла
 * 
 * @param {PropertiesHeaderProps} props - Пропсы компонента
 * @returns {JSX.Element} Заголовок панели свойств
 */
export function PropertiesHeader({
  selectedNode,
  onNodeTypeChange,
  onClose,
  displayNodeId,
  propertiesView,
  onPropertiesViewChange,
}: PropertiesHeaderProps) {
  const { toast } = useToast();

  const getNodeTitle = () => {
    return getNodeName(selectedNode.type as string);
  };

  const nodeTitle = getNodeTitle();
  const nodeIcon = getNodeIcon(selectedNode.type as string);
  const nodeColor = getNodeColor(selectedNode.type as string);

  return (
    <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/40 dark:to-slate-900/30 border-b border-border/50 backdrop-blur-sm">
      <div className="p-3 sm:p-4 space-y-3">
        {/* Main Info Row */}
        <div className="space-y-3 sm:space-y-3.5">
          {/* Header with Icon and Title */}
          <div className="flex items-center gap-3 sm:gap-3.5 justify-between">
            <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
              <div className={`w-10 sm:w-11 h-10 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${nodeColor}`}>
                <i className={`${nodeIcon} text-base sm:text-lg`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Current element</p>
                <div className="flex items-center gap-2 mt-2 w-full">
                  <Select
                    value={selectedNode.type}
                    onValueChange={(value) => {
                      if (onNodeTypeChange) {
                        const nextType = value as Node['type'];
                        const newData = getNodeDefaults(nextType);

                        if (nextType === 'input') {
                          onNodeTypeChange(selectedNode.id, nextType, {
                            ...newData,
                            inputType: selectedNode.data.inputType ?? 'any',
                            inputVariable: selectedNode.data.inputVariable ?? '',
                            appendVariable: selectedNode.data.appendVariable ?? false,
                            saveToDatabase: selectedNode.data.saveToDatabase ?? false,
                            inputPrompt: selectedNode.data.inputPrompt ?? 'Enter a response',
                            inputRequired: selectedNode.data.inputRequired ?? true,
                          });
                          return;
                        }

                        const preservedData = {
                          messageText: selectedNode.data.messageText ?? '',
                          keyboardType: selectedNode.data.keyboardType ?? 'none',
                          buttons: selectedNode.data.buttons ?? [],
                          markdown: selectedNode.data.markdown ?? false,
                          oneTimeKeyboard: selectedNode.data.oneTimeKeyboard ?? false,
                          resizeKeyboard: selectedNode.data.resizeKeyboard ?? true
                        };
                        const finalData = { ...newData, ...preservedData };
                        onNodeTypeChange(selectedNode.id, nextType, finalData);
                      }
                    }}
                  >
                    <SelectTrigger className="w-1/2 h-9 text-xs sm:text-sm bg-transparent border-none shadow-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent min-h-[36px]">
                      {nodeTitle}
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-gradient-to-br from-slate-50/95 to-slate-100/90 dark:from-slate-900/95 dark:to-slate-800/95 max-h-60 overflow-y-auto">
                      <SelectItem value="message">📝 Text Message</SelectItem>
                      <SelectItem value="start">🚀 Start</SelectItem>
                      <SelectItem value="command">⌨️ Command</SelectItem>
                      <SelectItem value="keyboard">⌨️ Keyboard</SelectItem>
                      <SelectItem value="sticker">😀 Sticker</SelectItem>
                      <SelectItem value="voice">🎤 Voice Message</SelectItem>
                      <SelectItem value="animation">🎞️ GIF Animation</SelectItem>
                      <SelectItem value="location">📍 Location</SelectItem>
                      <SelectItem value="contact">📞 Contact</SelectItem>
                      <SelectItem value="command_trigger">⚡ Command Trigger</SelectItem>
                      <SelectItem value="text_trigger">💬 Text Trigger</SelectItem>
                      <SelectItem value="pin_message">📌 Pin Message</SelectItem>
                      <SelectItem value="unpin_message">📌❌ Unpin Message</SelectItem>
                      <SelectItem value="delete_message">🗑️ Delete Message</SelectItem>
                      <SelectItem value="forward_message">↗️ Forward Message</SelectItem>
                      <SelectItem value="ban_user">🚫 Ban User</SelectItem>
                      <SelectItem value="unban_user">✅ Unban User</SelectItem>
                      <SelectItem value="mute_user">🔇 Restrict User</SelectItem>
                      <SelectItem value="unmute_user">🔊 Remove Restrictions</SelectItem>
                      <SelectItem value="kick_user">👢 Kick User</SelectItem>
                      <SelectItem value="promote_user">👑 Promote Administrator</SelectItem>
                      <SelectItem value="demote_user">👤 Demote Administrator</SelectItem>
                      <SelectItem value="admin_rights">⚡ Administrator Rights</SelectItem>
                      <SelectItem value="broadcast">📢 Broadcast</SelectItem>
                      <SelectItem value="input">Save answer to variable</SelectItem>
                      <SelectItem value="media">🖼️ Media File</SelectItem>
                      <SelectItem value="loop">🔄 Loop</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(displayNodeId);
                      toast({
                        title: "✅ ID copied!",
                        description: `"${displayNodeId}" copied to clipboard`,
                      });
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 dark:from-blue-600/20 dark:to-cyan-600/20 hover:from-blue-500/25 hover:to-cyan-500/25 dark:hover:from-blue-600/30 dark:hover:to-cyan-600/30 border border-blue-300/40 dark:border-blue-600/40 hover:border-blue-400/60 dark:hover:border-blue-500/60 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md w-1/2 min-w-0"
                    title="Click to copy ID"
                    data-testid="button-copy-node-id"
                  >
                    <code className="text-sm font-mono font-semibold text-blue-700 dark:text-blue-300 truncate group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors w-full overflow-hidden text-left">
                      {displayNodeId}
                    </code>
                    <i className="fas fa-copy text-blue-600 dark:text-blue-400 text-sm opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"></i>
                  </button>
                </div>
              </div>
            </div>
            {onClose && (
              <UIButton
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={onClose}
                title="Close properties panel"
                data-testid="button-close-properties"
              >
                <X className="w-4 h-4" />
              </UIButton>
            )}
          </div>
        </div>
        {onPropertiesViewChange && propertiesView && (
          <PropertiesViewToggle value={propertiesView} onChange={onPropertiesViewChange} />
        )}
      </div>
    </div>
  );
}
