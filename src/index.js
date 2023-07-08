//yarn init => tạo ra package.json (nơi lưu thư viện)

//yarn add express
import express from "express";

//yarn add cors
import cors from 'cors';
import rootRouter from "./routers/rootRouter.js";

//tạo biến với hàm express
const app = express();
app.use(express.json()); //middleware cho phép đọc đinh dạng json gửi từ FE
app.use(express.static(".")); //middleware đinh vị nơi load tài nguyen từ src BE
app.use(cors());

//khởi tạo server BE với port 8080
app.listen(8080);

app.use("/api", rootRouter);