import { Router } from 'express';
import {strictLimiter} from "../middlewares/security.js";
import {validationRequest} from "../middlewares/validateRequest.js";
import {registerSchema} from "../validations/auth.validation.js";

const router = Router();

router.post('/login', strictLimiter,  );

router.post('/register', strictLimiter, validationRequest(registerSchema),);

export default router;