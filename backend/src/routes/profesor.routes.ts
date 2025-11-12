import { Router } from "express";
import * as profesorController from "../controllers/profesor.controller";
import { validate } from "../middlewares/validation.middleware"; 
import { createProfesorSchema, updateProfesorSchema } from "../validations/profesor.validation";

const router = Router();

router.get("/", profesorController.getAllProfesores);
router.get("/:id", profesorController.getProfesorById);

router.post("/", validate(createProfesorSchema), profesorController.createProfesor); 
router.put("/:id", validate(updateProfesorSchema), profesorController.updateProfesor); //agregar depsues el authorize admin

router.delete("/:id", profesorController.deleteProfesor);//agregar depsues el authorize admin

export const profesorRoutes = router;
