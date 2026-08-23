/**
 * @fileoverview Тесты сравнения версий приложения
 * @module shared/compare-app-versions.test
 */

import assert from "node:assert/strict";
import { compareAppVersions } from "./compare-app-versions";

assert.equal(compareAppVersions("2.2.0.9", "2.2.0.9"), 0);
assert.equal(compareAppVersions("v2.2.0.9", "2.2.0.9"), 0);
assert.equal(compareAppVersions("2.2.0.9", "2.1.9.8"), 1);
assert.equal(compareAppVersions("2.1.9.8", "2.2.0.9"), -1);
assert.equal(compareAppVersions("2.2.0.10", "2.2.0.9"), 1);

console.log("compare-app-versions.test.ts: OK");
