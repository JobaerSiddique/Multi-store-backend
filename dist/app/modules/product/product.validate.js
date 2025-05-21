"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const z = __importStar(require("zod"));
const types_1 = require("../types");
const createProductSchema = z.object({
    name: z.string().nonempty('Required'),
    description: z.string().optional(),
    category: z.enum(['GROCERY', 'ELECTRONICS', 'CLOTHING', 'FISHFEED', 'CHICKEN FEED']),
    size: z.string().optional(),
    prices: z.object({
        local: z.number(),
        wholesale: z.number(),
        online: z.number(),
    }),
    stock: z.number(),
    saleChannels: z.array(z.string()).nonempty('At least one sale channel is required'),
});
const updateProductSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    category: z.enum(Object.values(types_1.ProductCategory)).optional(),
    size: z.enum(Object.values(types_1.ProductSize)).optional(),
    prices: z
        .object({
        local: z.number().min(0).optional(),
        wholesale: z.number().min(0).optional(),
        online: z.number().min(0).optional(),
    })
        .optional(),
    stock: z.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    saleChannels: z
        .array(z.enum(Object.values(types_1.SaleChannel)))
        .min(1)
        .optional(),
});
exports.ProductValidation = {
    createProductSchema,
    updateProductSchema
};
