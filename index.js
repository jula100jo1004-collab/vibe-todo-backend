import "dotenv/config";
import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRouter from "./routers/todoRouter.js";

// Node가 127.0.0.1 DNS만 써서 SRV 조회가 실패하는 문제 우회
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo backend is running");
});

app.use("/todos", todoRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB 연결 성공");
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
    });
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err.message);
  });
