import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { config } from "dotenv";
config();
// Create a vector store through any method, here from texts as an example
const vectorStore = await HNSWLib.fromTexts(
  ["Hello world", "Bye bye", "hello nice world"],
  [{ id: 2 }, { id: 1 }, { id: 3 }],
  new OpenAIEmbeddings()
);

// Save the vector store to a directory
const directory = "./";
await vectorStore.save(directory);
console.log(typeof vectorStore);
console.log(vectorStore);

// // Load the vector store from the same directory
// const loadedVectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

// // vectorStore and loadedVectorStore are identical

// console.log(loadedVectorStore);
