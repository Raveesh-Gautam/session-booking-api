import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Teacher } from "../models/Teacher";

const run = async () => {
  await connectDB();

  const existing = await Teacher.countDocuments();
  if (existing === 0) {
    await Teacher.insertMany([
      { fullName: "Anita Sharma", email: "anita@example.com", specialization: "Mathematics", experience: 8 },
      { fullName: "Rahul Verma", email: "rahul@example.com", specialization: "Physics", experience: 5 },
      { fullName: "Priya Singh", email: "priya@example.com", specialization: "English", experience: 10 },
    ]);
    console.log("Teachers seeded");
  } else {
    console.log("Teachers already exist, skipping insert");
  }

  const teachers = await Teacher.find();
  teachers.forEach((t) => console.log(`${t.fullName}: ${t._id}`));

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});