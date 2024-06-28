const cors = require("cors");
const dotenv = require("dotenv");
const express=require('express')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);
app.get("/",async(req,res)=>{
  res.send('hi from venkat')

})

app.post("/gemini", async (req, res) => {
  const { history, message } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});

app.listen(3001, () => console.log(`Server running on port 3001`));