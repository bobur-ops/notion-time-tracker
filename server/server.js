import express from "express";
import cors from "cors";
import axios from "axios";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

const client = "695b8556-de84-4c9c-b004-bf84a98457f1";
const secretId = "secret_VXxQ60Nnjp1VoRteBQUX5E8rErn9GeVwowZCNAbxyzK";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 1235;
console.log(process.env.NOTION_REDIRECT_URI);
app.use(express.json());
app.use(cors());

app.get("/api", async (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/api/create-item", async (req, res) => {
  const { token, database_id, name, duration } = req.body;

  try {
    const notion = new Client({
      auth: token,
    });

    const response = await notion.pages.create({
      parent: {
        database_id: database_id,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Duration: {
          rich_text: [
            {
              text: {
                content: duration,
              },
            },
          ],
        },
      },
    });

    res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error });
  }
});

app.post("/api/exchange-code", async (req, res) => {
  const { code } = req.body;

  const encodedIdAndSecret = Buffer.from(`${client}:${secretId}`).toString(
    "base64"
  );

  try {
    const result = await axios.post(
      "https://api.notion.com/v1/oauth/token",
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.NOTION_REDIRECT_URI,
      },
      {
        headers: {
          Authorization: `Basic ${encodedIdAndSecret}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );
    res.status(200).json({
      message: "Code Exchanged",
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
