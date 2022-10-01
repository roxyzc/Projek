"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectToDatabase_config_1 = require("./config/connectToDatabase.config");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandlers_middleware_1 = require("./middlewares/errorHandlers.middleware");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const logging_library_1 = require("./library/logging.library");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const session_middleware_1 = __importDefault(require("./middlewares/session.middleware"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const local_1 = __importDefault(require("./strategies/local"));
// connect to database
(0, connectToDatabase_config_1.connectToDatabase)();
const app = (0, express_1.default)();
// middleware
if (process.env.NODE_ENV === 'production')
    app.set('trust proxy', 1);
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN
}));
app.use((0, cookie_parser_1.default)());
app.use(session_middleware_1.default);
app.use(local_1.default.initialize());
app.use(local_1.default.session());
// route
app.use('/api', auth_route_1.default);
app.use('/api/user', user_route_1.default);
// errors handler
app.use(errorHandlers_middleware_1.notFound);
app.use(errorHandlers_middleware_1.errorHandler);
app.listen(process.env.PORT, () => {
    logging_library_1.Logger.info(`Listen at port ${process.env.PORT} in mode: ${process.env.NODE_ENV}`);
});
