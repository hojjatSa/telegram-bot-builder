/**
 * @fileoverview Аватар аккаунта в панели управления
 * @module components/admin/users/platform-user-avatar
 */

/** Пропсы аватара */
interface PlatformUserAvatarProps {
  /** Адрес картинки или null */
  photoUrl?: string | null;
  /** Отображаемое имя */
  name: string;
  /** Опознаватель Telegram */
  userId: number;
  /** Размер в пикселях */
  size?: 'sm' | 'md';
}

/**
 * Круглый аватар: картинка профиля или буква имени
 * @param props - Свойства компонента
 * @returns JSX элемент
 */
export function PlatformUserAvatar({
  photoUrl,
  name,
  userId,
  size = 'sm',
}: PlatformUserAvatarProps) {
  const dim = size === 'md' ? 'h-10 w-10 text-sm' : 'h-7 w-7 text-[11px]';
  const initial = (name.replace(/^@/, '').charAt(0) || String(userId).charAt(0)).toUpperCase();

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={`${dim} shrink-0 rounded-full object-cover bg-muted`}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

/**
 * Формирует отображаемое имя аккаунта
 * @param firstName - Имя
 * @param lastName - Фамилия
 * @param username - Имя вида @name
 * @param id - Опознаватель
 * @returns Строка для UI
 */
export function formatPlatformUserName(
  firstName: string,
  lastName: string | null | undefined,
  username: string | null | undefined,
  id: number,
): string {
  if (username) return `@${username.replace(/^@/, '')}`;
  const full = [firstName, lastName].filter(Boolean).join(' ').trim();
  return full || String(id);
}

/**
 * Форматирует дату для таблицы
 * @param iso - ISO-строка или null
 * @returns Локализованная дата или тире
 */
export function formatPlatformUserDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
