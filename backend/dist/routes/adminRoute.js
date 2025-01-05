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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Middleware to check admin role
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = yield prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.role !== "admin") {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// Add a menu item
router.post("/menu", isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, image, restaurantId } = req.body;
    try {
        // console.log("Creating menu item with data:", { name, description, price, image, restaurantId });
        const menu = yield prisma.menu.create({
            data: { name, description, price, image, restaurantId },
        });
        res.status(201).json(menu);
    }
    catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({ error: "Failed to add menu item" });
    }
}));
// Update a menu item
router.put("/menu/:id", isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
    try {
        const updatedMenu = yield prisma.menu.update({
            where: { id },
            data: { name, description, price, image },
        });
        res.json(updatedMenu);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update menu item" });
    }
}));
// Delete a menu item
router.delete("/menu/:id", isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.menu.delete({ where: { id } });
        res.status(200).json({ message: "Menu item deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete menu item" });
    }
}));
exports.default = router;
