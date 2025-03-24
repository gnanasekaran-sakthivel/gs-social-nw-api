import db from "../config/connection.js";
import { User, Thought } from "../models/index.js";
import cleanDB from "./cleanDB.js";

try {
  await db();
  await cleanDB();

  const users = [
    { username: "John Doe", email: "johndoe@gmail.com", thoughts: [] },
    { username: "Jennifer Clears", email: "jenclears@gmail.com", thoughts: [] },
    { username: "Rocky Rolls", email: "rockrolls@gmail.com", thoughts: [] },
  ];

  const thoughts = [
    "This is what I need",
    "Awesome post",
    "Anybody can benefit from this",
    "Perfect",
    "My first impression about this is not good",
    "I would recommend anyone to read this",
    "Like your ideas",
    "Good way to start the day",
  ];

  // Function to randomly pick a thought and assign to each user
  const assignRandomThoughts = async (users: any[], thoughts: string[]) => {
    const thoughtPromises = users.map(async (user) => {
      const randomThought =
        thoughts[Math.floor(Math.random() * thoughts.length)];
      const thoughtData = {
        username: user.username,
        thoughtText: randomThought,
      };
      const thought = await Thought.create(thoughtData);
      console.log(thought);
      user.thoughts.push(thought._id); // Assuming thoughts are stored as ObjectIds
    });

    await Promise.all(thoughtPromises); // Wait for all thoughts to be assigned
  };

  // Call the function and await it
  await assignRandomThoughts(users, thoughts);

  // Create users sequentially (or use Promise.all for parallel execution)
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i]);
  }
  // If you want to rather call parallelly - this is how to do it
  // await Promise.all(users.map(user => User.create(user)));

  console.log("Seeding complete!");
  process.exit(0); // Exit successfully
} catch (error) {
  console.error("Error seeding database:", error);
  process.exit(1);
}
