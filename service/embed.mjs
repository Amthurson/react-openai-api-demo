// 导入所需库
import openai from "openai";
const { Completion } = openai;
import PDFParser from "pdf2json";
import axios from "axios";
import fs from "fs/promises";
const { post } = axios;
import { fileURLToPath } from "url";
import { dirname } from "path";

// 配置 OpenAI API 密钥
const apiKey = "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";

// 读取 PDF 文件并转换为文本
async function pdfToText(fileBuffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve(pdfData.Pages.map(v=>v.Texts.map(v=>decodeURIComponent(v.R[0].T)).join("")).join("\n"));
      // if (pdfData.formImage && pdfData.formImage.Pages) {
      //   const text = pdfData.formImage.Pages.map(page =>
      //     page.Texts.map(textItem => decodeURIComponent(textItem.R[0].T)).join(" ")
      //   ).join("\n");
      //   resolve(text);
      // } else {
      //   reject(new Error("The PDF file does not contain form images."));
      // }
    });
    pdfParser.parseBuffer(fileBuffer);
  });
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fileNames = ["files/test.pdf"].map(file => `${__dirname}/${file}`);

// 定义一个函数，将文本转换为 Embedding
async function getEmbedding(text) {
  try {
    const response = await post(
      "https://api.openai.com/v1/embeddings",
      { model: "text-embedding-ada-002", text },
      { headers: { "Authorization": `Bearer ${apiKey}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error getting embedding for text: ${error.message}`);
    throw error;
  }
}

// 将财务数据转换为 Embeddings 并存储
async function prepareFinancialData(fileNames) {
  const financialData = [];
  for (const fileName of fileNames) {
    try {
      const fileBuffer = await fs.readFile(fileName);
      const text = await pdfToText(fileBuffer);
      const embedding = await getEmbedding(text);
      financialData.push({ text, embedding });
    } catch (error) {
      console.error(`Error processing file ${fileName}: ${error.message}`);
    }
  }
  return financialData;
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// 定义一个函数来处理用户问题
async function answerQuestion(question, financialData) {
  const questionEmbedding = await getEmbedding(question);
  const similarities = financialData.map(record => cosineSimilarity(record.embedding, questionEmbedding));
  const mostSimilarIndex = similarities.indexOf(Math.max(...similarities));
  const mostSimilarText = financialData[mostSimilarIndex].text;

  const response = await Completion.create({
    engine: "text-ada-001",
    prompt: `根据以下回答问题：${mostSimilarText}。问题：${question}。答案：`,
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 0.5,
  });

  const answer = response.choices[0].text.trim();
  return answer;
}

// 使用示例问题测试系统
(async () => {
  const financialData = await prepareFinancialData(fileNames);
  const question = "这个工程的建筑面积是多少？";
  const answer = await answerQuestion(question, financialData);
  console.log(answer);
})();
