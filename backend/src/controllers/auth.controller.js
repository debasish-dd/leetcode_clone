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
        error: 'user alrady exists',
        success: false
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
        image: newUser.image,
        role: newUser.role
      },
      success: true
    })
  } catch (error) {
    console.log('my error is:---->> ', error)

    res.status(500).json({
      message: 'error while creating user',
      error,
      success: false,
      
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: 'user not found', success: false })
    }

    const isMatchedPass = await bcrypt.compare(password, user.password)
    if (!isMatchedPass) {
      return res
        .status(401)
        .json({ message: 'invalid email or password', success: false })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      source: process.env.NODE_ENV !== 'devlopment',
      maxAge: 1000 * 60 * 60 * 24
    })

    res.status(200).json({
      message: 'User logged in Succesfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.user,
        image: user.image
      },
      success: true
    })
  } catch (error) {
    console.log('my error is:---->> ', error)

    res.status(500).json({
      message: 'error while logging in user',
      error
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      source: process.env.NODE_ENV !== 'devlopment'
    })

    res
      .status(204)
      .json({ message: 'User logged out succesfull', success: true })
  } catch (error) {
    console.error('error while logging out user', error)

    res.status(500).json({
      message: 'error while logging out user',
      error,
      success: false
    })
  }
}

export const check = async (req, res) => {
  try {
    res.status(204).json({ 
      message: 'User authenticated succesfull', success: true,
      user:req.user
     });

  } catch (error) {
    console.error('error while checking user', error)

    res.status(500).json({
      message: 'error while checking user',
      error,
      success: false
    })
  }
}
