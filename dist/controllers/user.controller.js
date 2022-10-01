'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const logging_library_1 = require('../library/logging.library');
const user_model_1 = __importDefault(require('../models/user.model'));
class User {
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.sendStatus(200);
            } catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
                if (!user) return res.sendStatus(400);
                if (req.User.id === req.params.id) {
                    return req.logOut((_error) => {
                        req.session.destroy((error) => {
                            if (error) throw new Error(error);
                            res.status(204).end();
                        });
                    });
                }
                return res.sendStatus(200);
            } catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
}
exports.default = User;
