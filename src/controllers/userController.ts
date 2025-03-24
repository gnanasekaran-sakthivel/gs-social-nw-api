import { Request, Response } from "express";
import { User, Thought } from "../models/index.js";
import mongoose from "mongoose";

/**
 * GET All Users
 * @returns an array of users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET User based on id
 * @param string id
 * @returns a single User object
 */
export const getUSerById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
    } else {
      const user = await User.findById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST User /users
 * @body object username and email
 * @returns a single User object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const newUser = await User.create(user);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * PUT Update a user based on id
 * @param object id, username
 * @returns a single User object
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: "No user with this id!" });
    } else {
      res.json(user);
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE User based on id
 * @param string id
 * @returns string
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      res.status(404).json({
        message: "No user with that ID",
      });
    } else {
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and thoughts deleted!" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Reaction based on /users/:userId/friends
 * @param string id
 * @returns object User
 */

export const addFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body } },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: "No User found with that ID :(" });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * DELETE User's friend based on /users/:userId/friends/:friendId
 * @param string userId
 * @param string friendId
 * @returns object User
 */

export const removeFriend = async (req: Request, res: Response) => {
  try {
    console.log(`friend Id = ${req.params.friendId}`);

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({
        message: `No User found with that ID :(${req.params.userId}`,
      });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
