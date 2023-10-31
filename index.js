import express from "express";
import bodyParser from "body-parser";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import { config } from "dotenv";
config();

const app = express();
app.use(bodyParser.json());

app.post("/process-input", async (req, res) => {
  const { API_KEY, sessionId, input } = req.body;

  // Validate API_KEY, sessionId, and input
  if (!API_KEY || !sessionId || !input) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  // Validate API_KEY (You might want to implement a proper API key validation logic here)

  // Memory
  const memory = new BufferMemory({
    chatHistory: new UpstashRedisChatMessageHistory({
      sessionId: sessionId,
      config: {
        url: process.env.UPSTASH_URL,
        token: process.env.UPSTASH_TOKEN,
      },
    }),
  });

  // Model
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.4,
  });

  // Chain
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
  });

  try {
    const response = await chain.call({ input });
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
