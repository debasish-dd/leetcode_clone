import express from 'express'
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js'
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from '../controllers/problems.crontroller.js'

const problemsRoutes = express.Router()

problemsRoutes.get(
  '/create-problems',
  authMiddleware,
  checkAdmin,
  createProblem
)
problemsRoutes.get('/all-problems', authMiddleware, getAllProblems)
problemsRoutes.get('/get-problems:id', authMiddleware, getProblemById)

problemsRoutes.put('/update-problems', authMiddleware, checkAdmin,updateProblem )

problemsRoutes.delete('/delete-problem/:id', authMiddleware, checkAdmin, deleteProblem)
problemsRoutes.get('/get-solved-problems', authMiddleware, getAllProblemsSolvedByUser)

export default problemsRoutes
