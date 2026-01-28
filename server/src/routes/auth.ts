import { Router } from 'express';
import {strictLimiter} from "../middlewares/security.js";
import {validationRequest} from "../middlewares/validateRequest.js";
import {registerSchema} from "../validations/auth.validation.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post('/login', strictLimiter,login);

router.post('/register', strictLimiter, validationRequest(registerSchema),register);

export default router;