import bcrypt, { hash } from 'bcryptjs'
import { db } from '../libs/db.js'
import { UserRole } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { email, password, name } = req.body

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'user alrady exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = db.user.create({
      data: {
        email,
        password: hashedPassword,
        user: UserRole.USER,
        name
      }
    })

    //creating token
    const token = jwt.sign(
      {
        id: newUser.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      source: process.env.NODE_ENV !== 'devlopment',
      maxAge: 1000 * 60 * 60 * 24
    })

    res.status(201).json({
      message: 'User Created Succesfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.user,
        image: newUser.image
      }
    })
    
  } catch (error) {
    console.log('my error is:---->> ', error)

    res.status(500).json({
      message: 'error while creating user',
      error
    })
  }
}

export const login = async (req, res) => {}

export const logout = async (req, res) => {}

export const check = async (req, res) => {}
