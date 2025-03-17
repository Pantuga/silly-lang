"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
var input = require("./input");
var classes_1 = require("./classes");
var parser_1 = require("./parser");
var cmds = {
    declare: ':3',
    assign: ':p', // :P
    label: 'u.u',
    concat: ':v', // :V
    add: ':d', // :D
    sub: ':c',
    mult: ':}',
    div: ':{',
    inc: '^.^',
    dec: 't.t', // T.T
    in: 'owo', // OwO
    out: 'uwu', // UwU
    error: 'xwx',
    // for normal jumps: "jmp [destination] ~"
    // for condicional jumps: "jmp [destination] [arg1] [condition] [arg2] ~"
    jmp: 'o.o', // B)
    jmp_eq: ':)',
    jmp_neq: ':(',
    jmp_eq_notype: '>:)',
    jmp_neq_notype: '>:(',
    jmp_gt: ':]',
    jmp_lt: ':[',
    jmp_eq_gt: '>:]',
    jmp_eq_lt: '>:[',
    halt: "x.x"
};
var Interpreter = /** @class */ (function () {
    function Interpreter() {
        this.varMap = {
            "_endl": '\n',
            "_tab": '\t',
            "_nan": NaN,
            "_empty_str": '',
            "_prog_counter": 0,
            ":>": 1,
            "_true": 1,
            ":<": 0,
            "_false": 0,
            "twt" /*TwT*/: 0, // random number (to be reevaluated every command)
        };
    }
    Interpreter.prototype.logerror = function (msg, error) {
        if (msg === void 0) { msg = 'No further information provided.'; }
        if (error === void 0) { error = 'Error'; }
        console.log('\x1b[1m\x1b[31m' + "".concat(error, " in Command ").concat(this.varMap._prog_counter, ": ") + '\x1b[0m\x1b[31m' + msg + '\x1b[0m');
    };
    Interpreter.prototype.logcode = function (code) {
        code.forEach(function (cmd) { return cmd.log(); });
    };
    Interpreter.prototype.concatTokens = function (array, start) {
        if (start === void 0) { start = 0; }
        var out = '';
        for (var i = start; i < array.length; i++) {
            out += this.getTokenValue(array[i]);
        }
        return out;
    };
    Interpreter.prototype.declareVar = function (name, value) {
        if (name in this.varMap) {
            this.logerror("Variable ".concat(name, " already exists"));
            return false;
        }
        ;
        this.varMap[name] = value;
        return true;
    };
    Interpreter.prototype.assignVar = function (name, value) {
        if (name in this.varMap) {
            this.varMap[name] = value;
            return true;
        }
        this.logerror("Variable \"".concat(name, "\" not found."));
        return false;
    };
    Interpreter.prototype.getTokenValue = function (token) {
        switch (token.type) {
            case classes_1.TokenTypes.ANY:
                if (token.value in this.varMap) {
                    return this.varMap[token.value];
                }
                else {
                    this.logerror("Variable \"".concat(token.value, "\" not found."));
                    break;
                }
            case classes_1.TokenTypes.STR:
                return token.value;
            case classes_1.TokenTypes.INT:
                return (0, parser_1.strToNum)(token.value);
        }
        return '';
    };
    Interpreter.prototype.getName = function (token) {
        if (token.type == classes_1.TokenTypes.ANY)
            return token.value;
        this.logerror("".concat(token.value, " is not a valid variable name."));
        return '';
    };
    Interpreter.prototype.getKeyword = function (token) {
        if (token.type == classes_1.TokenTypes.ANY && token.value in cmds)
            return token.value;
        this.logerror("\"".concat(token.value, "\" is not a valid keyword name."));
        return '';
    };
    Interpreter.prototype.getString = function (token) {
        switch (token.type) {
            case classes_1.TokenTypes.ANY:
                if (typeof this.varMap[token.value] == 'string')
                    return this.varMap[token.value];
                else {
                    this.logerror("".concat(token.value, " is not a string."));
                    break;
                }
            case classes_1.TokenTypes.STR:
                return token.value;
            case classes_1.TokenTypes.INT:
                this.logerror("".concat(token.value, " is not a string."));
                break;
        }
        return '';
    };
    Interpreter.prototype.getNum = function (token) {
        switch (token.type) {
            case classes_1.TokenTypes.ANY:
                var value = this.varMap[token.value];
                if (typeof value === 'number') {
                    return value; // Return the number directly
                }
                else if (typeof value === 'string') {
                    // Try to parse the string as a number
                    var parsed = parseFloat(value);
                    if (!isNaN(parsed)) {
                        return parsed;
                    }
                    else
                        this.logerror("".concat(token.value, " is not a number."));
                }
                break;
            case classes_1.TokenTypes.STR:
                this.logerror("".concat(token.value, " is not a number."));
                break;
            case classes_1.TokenTypes.INT:
                return (0, parser_1.strToNum)(token.value);
        }
        return NaN;
    };
    Interpreter.prototype.checkArgs = function (cmd) {
        var sizes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sizes[_i - 1] = arguments[_i];
        }
        var out = sizes.includes(cmd.args.length);
        if (!out)
            this.logerror("Invalid argument count for \"".concat(cmd.name, "\": ").concat(cmd.args.length, ". Allowed counts: ").concat(sizes.join(', ')));
        return out;
    };
    Interpreter.prototype.atLeastArgs = function (cmd, min) {
        var out = cmd.args.length >= min;
        if (!out)
            this.logerror("Invalid argument count for \"".concat(cmd.name, "\": ").concat(cmd.args.length, ". Command must have at least ").concat(min, " arguments"));
        return out;
    };
    Interpreter.prototype.execute = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var i, cmd, _a, inputValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('');
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < code.length)) return [3 /*break*/, 19];
                        cmd = code[i];
                        if (cmd.name === cmds.halt)
                            return [3 /*break*/, 19]; // Stop execution on halt command
                        this.varMap._prog_counter = i;
                        this.varMap["twt"] = Math.random();
                        _a = cmd.name;
                        switch (_a) {
                            case cmds.in: return [3 /*break*/, 2];
                            case cmds.out: return [3 /*break*/, 4];
                            case cmds.error: return [3 /*break*/, 5];
                            case cmds.declare: return [3 /*break*/, 6];
                            case cmds.assign: return [3 /*break*/, 7];
                            case cmds.label: return [3 /*break*/, 8];
                            case cmds.concat: return [3 /*break*/, 9];
                            case cmds.add: return [3 /*break*/, 10];
                            case cmds.sub: return [3 /*break*/, 11];
                            case cmds.mult: return [3 /*break*/, 12];
                            case cmds.div: return [3 /*break*/, 13];
                            case cmds.inc: return [3 /*break*/, 14];
                            case cmds.mult: return [3 /*break*/, 14];
                            case cmds.dec: return [3 /*break*/, 15];
                            case cmds.jmp: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 17];
                    case 2:
                        if (!this.atLeastArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        return [4 /*yield*/, input.ask(this.concatTokens(cmd.args, 1))];
                    case 3:
                        inputValue = _b.sent();
                        this.assignVar(this.getName(cmd.args[0]), inputValue);
                        return [3 /*break*/, 18];
                    case 4:
                        console.log(this.concatTokens(cmd.args));
                        return [3 /*break*/, 18];
                    case 5:
                        this.logerror(this.concatTokens(cmd.args), 'Runtime Error');
                        return [3 /*break*/, 18];
                    case 6:
                        if (!this.checkArgs(cmd, 1, 2))
                            return [3 /*break*/, 18];
                        if (cmd.args.length == 2)
                            this.declareVar(this.getName(cmd.args[0]), this.getTokenValue(cmd.args[1]));
                        else
                            this.declareVar(this.getName(cmd.args[0]), NaN); // Default value for declaration
                        return [3 /*break*/, 18];
                    case 7:
                        if (!this.checkArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getTokenValue(cmd.args[1]));
                        return [3 /*break*/, 18];
                    case 8:
                        if (!this.checkArgs(cmd, 1))
                            return [3 /*break*/, 18];
                        this.declareVar(this.getName(cmd.args[0]), this.varMap._prog_counter);
                        return [3 /*break*/, 18];
                    case 9:
                        if (!this.atLeastArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getString(cmd.args[0]).concat(this.concatTokens(cmd.args, 1)));
                        return [3 /*break*/, 18];
                    case 10:
                        if (!this.checkArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) + this.getNum(cmd.args[1]));
                        return [3 /*break*/, 18];
                    case 11:
                        if (!this.checkArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) - this.getNum(cmd.args[1]));
                        return [3 /*break*/, 18];
                    case 12:
                        if (!this.checkArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) * this.getNum(cmd.args[1]));
                        return [3 /*break*/, 18];
                    case 13:
                        if (!this.checkArgs(cmd, 2))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) / this.getNum(cmd.args[1]));
                        return [3 /*break*/, 18];
                    case 14:
                        if (!this.checkArgs(cmd, 1))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) + 1);
                        return [3 /*break*/, 18];
                    case 15:
                        if (!this.checkArgs(cmd, 1))
                            return [3 /*break*/, 18];
                        this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) - 1);
                        return [3 /*break*/, 18];
                    case 16:
                        if (!this.checkArgs(cmd, 1, 4))
                            return [3 /*break*/, 18];
                        if (cmd.args.length == 1)
                            i = this.getNum(cmd.args[0]);
                        else
                            switch (this.getKeyword(cmd.args[2])) {
                                case cmds.jmp_eq:
                                    if (this.getTokenValue(cmd.args[1]) === this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_neq:
                                    if (!(this.getTokenValue(cmd.args[1]) === this.getTokenValue(cmd.args[2])))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_eq_notype:
                                    if (this.getTokenValue(cmd.args[1]) == this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_neq_notype:
                                    if (!(this.getTokenValue(cmd.args[1]) == this.getTokenValue(cmd.args[2])))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_gt:
                                    if (this.getTokenValue(cmd.args[1]) > this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_lt:
                                    if (this.getTokenValue(cmd.args[1]) < this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_eq_gt:
                                    if (this.getTokenValue(cmd.args[1]) >= this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                case cmds.jmp_eq_lt:
                                    if (this.getTokenValue(cmd.args[1]) <= this.getTokenValue(cmd.args[2]))
                                        i = this.getNum(cmd.args[0]);
                                    break;
                                default: this.logerror("The keyword ".concat(cmd.args[2], " is not a valid keyword for a condicional jump."));
                            }
                        return [3 /*break*/, 18];
                    case 17:
                        this.logerror("The command \"".concat(cmd.name, "\" does not exit"));
                        _b.label = 18;
                    case 18:
                        i++;
                        return [3 /*break*/, 1];
                    case 19:
                        input.rl.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
