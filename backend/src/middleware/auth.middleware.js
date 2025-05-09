import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'

export const authMiddleware = async (req, res) => {
  try {
    const token = req.cookie.jwt
    if (!token) {
      return res.status(401).json({
        message: 'unauthorized - token not provided',
        success: false
      })
    }

    let decoded

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      console.error('error while verifing token-->', error)
      res
        .status(401)
        .json({ message: 'unauthorized invalid token', success: false })
    }

    const user = db.user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        email: true
      }
    })

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      })
    }

    req.user = user
  } catch (error) {
    console.error('error authenticating user', error)

    res.status(500).json({
      message: 'error authenticating user',
      error,
      success: false
    })
  }
}

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied, admin only!',
        success: false
      })
    }

    next()
  } catch (error) {
    console.error('error while checking admin permission', error)
    res.status(500).json({
      message: 'error while checking admin role',
      success: false
    })
  }
}
