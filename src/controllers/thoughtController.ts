import { Request, Response } from "express";
//import { ObjectId } from "mongodb";
import { Thought, User } from "../models/index.js";

export const headCount = async () => {
  const numberOfThoughts = await Thought.aggregate().count("thoughtCount");
  return numberOfThoughts;
};

/**
 * GET All Thoughts
 * @returns an array of Thoughts
 */
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const Thoughts = await Thought.find();

    const ThoughtObj = {
      Thoughts,
      headCount: await headCount(),
    };

    res.json(ThoughtObj);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET Thought based on id
 * @param string id
 * @returns a single Thought object
 */
export const getThoughtById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      res.json({
        thought,
      });
    } else {
      res.status(404).json({
        message: "Thought not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST Thought /Thoughts
 * @param object Thought
 * @returns a single Thought object
 * 
 * {
    "thoughtText": "Here's a cool thought...",
    "userId": "5edff358a0fcb779aa7b118b"
    }
 *
 */
export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, userId } = req.body;

    const userDoc = await User.findById(userId);

    if (!userDoc) {
      res.status(404).json({ message: "User not found!" });
    } else {
      const userJson = userDoc.toJSON();
      const username = userJson.username;
      const thought = await Thought.create({ thoughtText, username });

      // Update the user's thoughts array
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { thoughts: thought._id } }, // Add the thought ID to the thoughts array
        { new: true, runValidators: true } // Return updated document & ensure it meets schema validation
      );

      if (!updatedUser) {
        Thought.findOneAndDelete({ _id: thought._id });
        res
          .status(404)
          .json({ message: "User not updated and thought not created" });
      } else {
        res.json(thought);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * PUT Update a thought based on id
 * @param object id, thoughttext
 * @returns a single thought object
 */
export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "No thought with this id!" });
    } else {
      res.json(thought);
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE Thought based on id
 * @param string id
 * @returns string
 */

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });

    if (!thought) {
      res.status(404).json({ message: "No such Thought exists" });
    } else {
      res.json({ message: "Thought successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * POST Reaction based on /Thoughts/:ThoughtId/reactions
 * @param string id
 * @param object assignment
 * @returns object Thought
 */

export const addReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: "No Thought found with that ID :(" });
    } else {
      res.status(200).json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * DELETE Reaction based on /Thoughts/:thoughtId/reactions/:reactionId
 * @param string reactionId
 * @param string thoughtId
 * @returns object Thought
 */

export const removeReaction = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({
        message: `No Thought found with that ID :(${req.params.thoughtId}`,
      });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
