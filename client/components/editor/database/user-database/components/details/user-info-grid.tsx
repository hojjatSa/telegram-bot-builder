/**
 * @fileoverview Компонент сетки основной информации пользователя
 * @description Отображает основную информацию и статистику
 */

import { Label } from '@/components/ui/label';
import { UserBotData } from '@shared/schema';

/**
 * Пропсы компонента UserInfoGrid
 */
interface UserInfoGridProps {
  /** Данные пользователя */
  selectedUser: UserBotData;
  /** Количество сообщений пользователя */
  userMessageCounts: { userSent: number; botSent: number; total: number };
  /** Флаг мобильного режима */
  isMobile: boolean;
}

/**
 * Компонент сетки основной информации
 * @param props - Пропсы компонента
 * @returns JSX компонент сетки
 */
export function UserInfoGrid({
  selectedUser,
  userMessageCounts,
  isMobile,
}: UserInfoGridProps): React.JSX.Element {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
      <div>
        <Label className="text-sm font-medium">Basic information</Label>
        <div className="mt-2 space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Name:</span>{' '}
            {selectedUser.firstName || 'Not specified'}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Username:</span>{' '}
            {selectedUser.userName ? `@${selectedUser.userName}` : 'Not specified'}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Telegram ID:</span>{' '}
            {selectedUser.userId}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Statistics</Label>
        <div className="mt-2 space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Total messages:</span>{' '}
            {userMessageCounts.total || selectedUser.interactionCount || 0}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">From the user:</span>{' '}
            {userMessageCounts.userSent}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">From the bot:</span>{' '}
            {userMessageCounts.botSent}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Based on the history of the dialogue between the user and the bot
        </p>
      </div>
    </div>
  );
}
