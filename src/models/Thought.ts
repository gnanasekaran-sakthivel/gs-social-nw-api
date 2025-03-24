import { Schema, Types, model, type Document } from "mongoose";

interface IReaction {
  reactionId: Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

interface IThought extends Document {
  thoughtText: string;
  username: string;
  createdAt: Date;
  reactions: IReaction[];
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    _id: false,
    toJSON: { getters: true },
  }
);

const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //Use a getter method to format the timestamp on query
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
    toJSON: { getters: true }, // Enables getters when converting to JSON
    toObject: { getters: true }, // Enables getters when converting to objects
  }
);

thoughtSchema.virtual("reactionCount").get(function (this: IThought) {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

export default Thought;
