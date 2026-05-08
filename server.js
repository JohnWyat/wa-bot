require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 1. This is your CRM endpoint
app.post("/deposit-confirmed", async (req, res) => {

    const { amount, accountNumber, requestId } = req.body;

    const message =
`🚨 NEW DEPOSIT CONFIRMED

💰 Amount: $${amount}
🏦 Account: ${accountNumber}
🆔 Request ID: ${requestId}`;

    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: "96181061279",   // <-- BO WhatsApp number
                type: "text",
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.send("BO notified");

    } catch (err) {
        console.log("FULL ERROR:");
        console.log(err.response?.data || err.message);
    }
});

// 2. just to check server is alive
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("WhatsApp bot running");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});