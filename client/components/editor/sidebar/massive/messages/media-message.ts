/**
 * @fileoverview Определение компонента медиа-ноды
 * Чистая нода для отправки медиафайлов без текста
 */
import { ComponentDefinition } from "@shared/schema";

/** Медиа-нода: фото, видео, аудио или документ */
export const mediaMessage: ComponentDefinition = {
  id: 'media-message',
  name: 'Media File',
  description: "Photo, video, audio or document",
  icon: 'fas fa-photo-video',
  color: 'bg-fuchsia-100 text-fuchsia-600',
  type: 'media',
  defaultData: {
    attachedMedia: [],
    enableAutoTransition: false,
    autoTransitionTo: '',
  }
};
