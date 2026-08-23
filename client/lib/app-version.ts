/**
 * @fileoverview Версия приложения для клиентской сборки (из version.json)
 * @module lib/app-version
 */

import manifest from "../../version.json";

/** Версия из version.json на момент сборки Vite */
export const CLIENT_APP_VERSION = manifest.version;
