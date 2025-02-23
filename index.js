const express = require("express");
const driver = require("./neo4j");
const Movie = require("./models/Movie");
const connectDB = require("./utils/db");
const cors = require("cors");

const app = express();
app.use(express.json());
connectDB();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Insert "LIKES" Relationship (User -> Movie)
app.post("/discovery/like", async (req, res) => {
  const { userId, movieId } = req.body;
  const session = driver.session();

  try {
    await session.run(
      "MERGE (u:User {id: $userId}) MERGE (m:Movie {id: $movieId}) MERGE (u)-[:LIKES]->(m)",
      { userId, movieId }
    );
    res.json({ message: `User ${userId} liked Movie ${movieId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Recommend a Movie for a User (Find movies liked by similar users)
app.get("/discovery/recommend/:userId", async (req, res) => {
  const { userId } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u:User {id: '${userId}'})-[:LIKES]->(m:Movie)<-[:LIKES]-(other:User)-[:LIKES]->(rec:Movie)
        WHERE NOT (u)-[:LIKES]->(rec)
        RETURN DISTINCT rec.id AS recommendedMovie;
        `,
      { userId }
    );
    const movieIds = result.records.map((record) => record._fields[0]);

    //Query MongoDB to find movies by the extracted IDs
    const recommended = await Movie.find({
      _id: { $in: movieIds }, // Use the _id field automatically created by MongoDB
    }).sort({ createdAt: -1 });
    res.json([{ category: "Recommended", content: recommended }]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
