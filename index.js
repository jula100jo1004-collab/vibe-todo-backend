import "dotenv/config";
import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRouter from "./routers/todoRouter.js";

// Node가 127.0.0.1 DNS만 써서 SRV 조회가 실패하는 문제 우회
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo backend is running");
});

app.use("/todos", todoRouter);
app.use("/api/todos", todoRouter);

async function start() {
  if (!MONGO_URI) {
    console.error("MONGO_URI 환경변수가 없습니다. Heroku Config Vars에 설정하세요.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB 연결 성공");

    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
    });
  } catch (err) {
    console.error("MongoDB 연결 실패:", err.message);
    process.exit(1);
  }
}

start();
