import { Router } from 'express';
import {strictLimiter} from "../middlewares/security.js";
import {validationRequest} from "../middlewares/validateRequest.js";
import {loginSchema, registerSchema} from "../validations/auth.validation.js";
import {register, login, verifyEmail} from "../controllers/auth.controller.js";

const router = Router();

router.post('/login', strictLimiter,validationRequest(loginSchema),login);

router.post('/register', strictLimiter, validationRequest(registerSchema),register);

router.get('/verify-email', strictLimiter, verifyEmail);

export default router;