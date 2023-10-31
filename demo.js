import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { UpstashRedisChatMessageHistory } from "langchain/stores/message/upstash_redis";
import { config } from "dotenv";
config();

//Memory
const memory = new BufferMemory({
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: "123",
    config: {
      url: "https://apn1-vast-pika-33777.upstash.io",

      token:
        "AYPxACQgZGI3NjJkMGYtYWUyNS00MDI0LTkxNjUtZDFjYzczZGU3YmUzODZiZmNkMmE3YzI2NGQ4OGFiMGVhYjYwNjM0ZDgwYjA=",
    },
  }),
});

//model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.4,
});

//Chain
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

const res = await chain.call({ input: "What is my name" });
console.log(res);
