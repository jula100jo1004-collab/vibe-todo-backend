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

let isDbReady = false;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Todo backend is running",
    db: isDbReady ? "connected" : "disconnected",
  });
});

app.use("/todos", (req, res, next) => {
  if (!isDbReady) {
    return res.status(503).json({ message: "MongoDB에 아직 연결되지 않았습니다." });
  }
  next();
}, todoRouter);

app.use("/api/todos", (req, res, next) => {
  if (!isDbReady) {
    return res.status(503).json({ message: "MongoDB에 아직 연결되지 않았습니다." });
  }
  next();
}, todoRouter);

async function connectMongo(retries = 5) {
  if (!MONGO_URI) {
    console.error("MONGO_URI 환경변수가 없습니다. Heroku Config Vars에 설정하세요.");
    return;
  }

  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(MONGO_URI);
      isDbReady = true;
      console.log("MongoDB 연결 성공");
      return;
    } catch (err) {
      console.error(`MongoDB 연결 실패 (${i}/${retries}):`, err.message);
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
  connectMongo();
});
