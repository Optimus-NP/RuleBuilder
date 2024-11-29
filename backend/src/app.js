const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

// Create Express app
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from this origin
}));

app.use(bodyParser.json());

// Set up Redis client
const client = redis.createClient({
    url: 'redis://localhost:6379'
});

// Handle Redis connection errors
// Connect to Redis
(async () => {
    await client.connect();
    console.log('Connected to Redis');
})();

// API to create a new rule
app.post('/rules', async (req, res) => {
    const { id, rule } = req.body;

    console.log("Request received: id: " + id);

    if (!id || !rule) {
        return res.status(400).json({ message: 'id and rule are required' });
    }

    // Store rule in Redis with the id as the key
    try {
        console.log("Setting rule in Redis...");
        const reply = await client.set(id, JSON.stringify(rule)); // Await the Redis operation
        console.log("Redis reply:", reply);
        
        return res.status(201).json({ message: 'Rule stored successfully', reply });
      } catch (err) {
        console.error("Redis set error:", err);
        return res.status(500).json({ message: 'Error storing the rule in Redis' });
    }
});

// API to get a rule by ID
app.get('/rules/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'id is required' });
    }

    // Retrieve rule from Redis
    try {
        console.log("Getting rule from Redis...");
        const rule = await client.get(id); // Await the Redis operation
        console.log("Redis reply:", rule);
        if (rule === null) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        return res.status(200).json({ id, rule: JSON.parse(rule) });
      } catch (err) {
        console.error("Redis get error:", err);
        return res.status(500).json({ message: 'Error retrieving the rule from Redis' });
    }
});

// API to delete a rule by ID
app.delete('/rules/:id', (req, res) => {
    const { id } = req.params;

    // Delete rule from Redis
    client.del(id, (err, reply) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting the rule from Redis' });
        }
        if (reply === 0) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.status(200).json({ message: 'Rule deleted successfully' });
    });
});

// Start the Express server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
