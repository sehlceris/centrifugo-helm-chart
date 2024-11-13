import { Centrifuge } from "npm:centrifuge";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

// Configuration
const CENTRIFUGO_SERVER = "wss://centrifugo.test.party/connection/websocket"; // Default path for Centrifugo
const HMAC_SECRET = "RomeLoseDoneSquareShow1296"; // Replace with your token HMAC secret key
const CHANNEL = "test";
const USER_ID = "test"; // Replace with your user ID

async function generateJWT() {
  const now = Date.now() / 1000; // Current time in seconds

  const payload = {
    sub: USER_ID, // Subject (user ID)
    exp: getNumericDate(60 * 60), // Token expiration (1 hour from now)
    iat: getNumericDate(now), // Issued at
    info: {
      // Optional user info
      name: "Test User",
    },
    channels: [CHANNEL],
  };

  // Convert HMAC secret to crypto key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(HMAC_SECRET);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Create JWT
  const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, key);
  return jwt;
}

async function main() {
  try {
    // Generate JWT token
    const token = await generateJWT();
    console.log("Generated JWT:", token);

    // Create Centrifugo client
    const centrifuge = new Centrifuge(CENTRIFUGO_SERVER, {
      token: token,
    });

    // Handle successful connection
    centrifuge.on("connected", (context) => {
      console.log("Connected to Centrifugo:", context);

      // Publish a message upon connection
      publishMessage("Hello from Deno!");
    });

    // Handle connection errors
    centrifuge.on("error", (error) => {
      console.error("Centrifugo error:", error);
    });

    // Handle disconnection
    centrifuge.on("disconnected", () => {
      console.log("Disconnected from Centrifugo");
    });

    // Subscribe to the test channel
    const subscription = centrifuge.newSubscription(CHANNEL);

    // Handle subscription events
    subscription.on("publication", (ctx) => {
      console.log("Received message:", ctx.data);
    });

    subscription.on("subscribed", (ctx) => {
      console.log("Subscribed to channel:", CHANNEL);
    });

    subscription.on("error", (err) => {
      console.error("Subscription error:", err);
    });

    // Start subscription
    await subscription.subscribe();

    // Helper function to publish messages
    async function publishMessage(message: string) {
      try {
        const response = await centrifuge.publish(CHANNEL, {
          message: message,
          timestamp: new Date().toISOString(),
        });
        console.log("Message published successfully:", response);
      } catch (error) {
        console.error("Error publishing message:", error);
      }
    }

    // Connect to Centrifugo
    centrifuge.connect();
  } catch (error) {
    console.error("Main error:", error);
  }
}

// Run the application
main().catch(console.error);
