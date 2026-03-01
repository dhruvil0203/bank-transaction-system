import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model.js";

async function userRegisterController(req, res) {
  try {
    const { email, name, password } = req.body;

    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(422).json({
        message: "User already exists with email",
        status: "failed",
      });
    }

    const newUser = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token);
    res.status(201).json({
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: "failed" });
  }
}
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
        status: "failed",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token);
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: "failed" });
  }
}
async function userLogoutController(req,res){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(400).json({
      message:"User logged out successfully",
    })
  }

  res.cookie("token","")

  await blacklistModel.create({
    token,
  })

  return res.json({
    message:"User logged out successfully",
  })
}


export default {
  userRegisterController,
  userLoginController,
  userLogoutController
};
