require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.use(express.json());

// Import Models
const Article = require("./models/Article");

// Connect to MongoDB
mongoose
  .connect(process.env.VITE_API_URL)
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// ======= ARTICLE ENDPOINTS ==========

// Create a new article
app.post("/articles", async (req, res) => {
  try {
    const { articleTitle, articleBody } = req.body;

    const newArticle = new Article({
      title: articleTitle,
      body: articleBody,
      numberOfLikes: 100,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the article" });
  }
});

// Get all articles
app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    console.log("Fetched articles:", articles);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the articles" });
  }
});

// Get an article by ID
app.get("/articles/:articleId", async (req, res) => {
  const { articleId } = req.params;

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Fetched article:", article);
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the article" });
  }
});

// Delete an article by ID
app.delete("/articles/:articleId", async (req, res) => {
  const { articleId } = req.params;

  try {
    const deletedArticle = await Article.findByIdAndDelete(articleId);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Deleted article:", deletedArticle);
    res.json({ message: "Article deleted successfully", deletedArticle });
  } catch (error) {
    console.error("Error deleting article:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the article" });
  }
});

// Update an article by ID
app.put("/articles/:articleId", async (req, res) => {
  const { articleId } = req.params;
  const { articleTitle, articleBody } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        title: articleTitle,
        body: articleBody,
      },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Updated article:", updatedArticle);
    res.json({ message: "Article updated successfully", updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the article" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
