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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
exports.isAdmin = router.post("/assign-admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield db_1.prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Update the user's role to admin
        const updatedUser = yield db_1.prismaClient.user.update({
            where: { email },
            data: { role: "admin" },
        });
        res.status(200).json({
            message: `Admin role assigned to ${updatedUser.name} (${updatedUser.email})`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to assign admin role" });
    }
}));
// export function authMiddleware (req: Request,res:any,next: NextFunction) {
//     const token = req.headers.authorization as unknown as string
//      try{
//     const payload = jwt.verify(token, JWT_PASSWORD)
//         // @ts-ignore
//         req.id = payload.id
//         next();
//     }catch(e){
//         return res.status(403).json({
//             message: "You are not logged in"
//         })
//     }
// }
