/**

 * @fileoverview Общая оболочка страницы с iframe и боковым меню

 * @module components/admin/admin-embed-frame

 */



import { Link } from 'wouter';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';



/**

 * Пропсы компонента AdminEmbedFrame

 */

interface AdminEmbedFrameProps {

  /** Заголовок над фреймом */

  title: string;

  /** URL содержимого iframe */

  embedSrc: string;

  /** Ссылка «назад» (если задана — показывается кнопка) */

  backHref?: string;

  /** Подпись кнопки «назад» */

  backLabel?: string;

  /** Колбэк после загрузки iframe */

  onLoad?: () => void;

}



/**

 * Страница с iframe на весь экран внутри панели управления

 * @param props - Свойства компонента

 * @returns JSX элемент с iframe

 */

export function AdminEmbedFrame({

  title,

  embedSrc,

  backHref,

  backLabel = 'Back',

  onLoad,

}: AdminEmbedFrameProps) {

  return (

    <div className="flex flex-col flex-1 min-h-0">

      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/50 bg-background shrink-0">

        {backHref && (

          <Link href={backHref}>

            <Button variant="ghost" size="sm" className="gap-2 h-8">

              <ArrowLeft className="h-4 w-4" />

              {backLabel}

            </Button>

          </Link>

        )}

        <h1 className="text-sm font-semibold">{title}</h1>

      </div>

      <iframe

        title={title}

        src={embedSrc}

        onLoad={onLoad}

        className="w-full flex-1 min-h-[480px] border-0 bg-background"

      />

    </div>

  );

}


