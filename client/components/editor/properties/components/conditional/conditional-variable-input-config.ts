/**
 * @fileoverview Конфигурация полей ввода переменных для условных сообщений
 */

export interface ConditionalVariableInputConfig {
  enableKey: string;
  variableKey: string;
  title: string;
  placeholder: string;
  colors: { text: string; border: string; focusBorder: string; focusRing: string; };
}

export const CONDITIONAL_VARIABLE_INPUTS: ConditionalVariableInputConfig[] = [
  {
    enableKey: 'enableTextInput',
    variableKey: 'textInputVariable',
    title: "Variable for text",
    placeholder: 'user_text',
    colors: { text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', focusBorder: 'focus:border-blue-500', focusRing: 'focus:ring-blue-200' }
  },
  {
    enableKey: 'enablePhotoInput',
    variableKey: 'photoInputVariable',
    title: "Variable for photo",
    placeholder: 'user_photo',
    colors: { text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700', focusBorder: 'focus:border-green-500', focusRing: 'focus:ring-green-200' }
  },
  {
    enableKey: 'enableVideoInput',
    variableKey: 'videoInputVariable',
    title: "Video variable",
    placeholder: 'user_video',
    colors: { text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700', focusBorder: 'focus:border-red-500', focusRing: 'focus:ring-red-200' }
  },
  {
    enableKey: 'enableAudioInput',
    variableKey: 'audioInputVariable',
    title: "Audio variable",
    placeholder: 'user_audio',
    colors: { text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700', focusBorder: 'focus:border-yellow-500', focusRing: 'focus:ring-yellow-200' }
  },
  {
    enableKey: 'enableDocumentInput',
    variableKey: 'documentInputVariable',
    title: "Document variable",
    placeholder: 'user_document',
    colors: { text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', focusBorder: 'focus:border-purple-500', focusRing: 'focus:ring-purple-200' }
  }
];
