"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
}));
//# sourceMappingURL=app.config.js.map