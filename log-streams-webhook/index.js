require("dotenv").config();
const express = require("express");
const http = require("http");
const sendEventsToMoesif = require("./sendEventsToMoesif");

const app = express();
app.use(express.json());

app.post("/api/logs", async (req, res, next) => {
  const { body, headers } = req;
  if (!body || !Array.isArray(body)) {
    return res.sendStatus(400);
  }

  if (!headers.authorization) {
    return res.sendStatus(401);
  }

  // the moesifApplicationId should be be used as the authorization configured in Auth0
  let moesifApplicationId = headers.authorization;

  try {
    if (moesifApplicationId.indexOf("Bearer ") === 0) {
      moesifApplicationId = moesifApplicationId.replace("Bearer", "");
    }
    const apiResponse = await sendEventsToMoesif(moesifApplicationId, body);

    res.status(apiResponse.status).json(apiResponse.data);
  } catch (error) {
    if (error.response) {
      // If the API responded with an error, mirror the status and error message
      res.status(error.response.status).json(error.response.data);
    } else {
      // If there was a network or other error, respond with a generic error message
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

const port = process.env.PORT || 3035;
http.createServer(app).listen(port, () => {
  console.log("Listening on port " + port);
});
