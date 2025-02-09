require("dotenv").config();
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function testConnection() {
  const session = driver.session();
  try {
    const result = await session.run("RETURN 'Neo4j Connected' AS message");
    console.log(result.records[0].get("message"));
  } catch (error) {
    console.error("Neo4j Connection Error:", error);
  } finally {
    await session.close();
  }
}

// Test the connection
testConnection();

module.exports = driver;
