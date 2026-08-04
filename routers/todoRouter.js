import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// 할일 생성
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "할일 제목을 입력해주세요." });
    }

    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json({
      message: "할일이 저장되었습니다.",
      todo,
    });
  } catch (err) {
    res.status(500).json({ message: "할일 저장 실패", error: err.message });
  }
});

// 할일 목록 조회
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "할일 조회 실패", error: err.message });
  }
});

// 할일 단건 조회
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "할일 조회 실패", error: err.message });
  }
});

// 할일 수정
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "할일 제목을 입력해주세요." });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    res.json({
      message: "할일이 수정되었습니다.",
      todo,
    });
  } catch (err) {
    res.status(500).json({ message: "할일 수정 실패", error: err.message });
  }
});

// 할일 삭제
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    res.json({
      message: "할일이 삭제되었습니다.",
      todo,
    });
  } catch (err) {
    res.status(500).json({ message: "할일 삭제 실패", error: err.message });
  }
});

export default router;
