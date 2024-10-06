import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const geminiRouter = createTRPCRouter({
    getAnalytics: protectedProcedure
        .input(z.object({
            transactions: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                const prompt = `Here are my recent transactions, I want you to  generate a summary of my spending habits: ${input.transactions}, and also mark the categories I spent the most money in and suggestions on how to budget myself better and save money. Keep it personalized, not generalized advice. MAXIMUM 150 WORDS; DO NOT USE ANY ASTERISKS OR OTHER FORMATTING SYMBOLS`;
                const result = await model.generateContent(prompt);
                return { text: result.response.text() };
            } catch (error) {
                console.error("Error querying Gemini AI:", error);
                throw new Error("Error querying Gemini AI API");
            }
        }),

    getPersonalizedNews: protectedProcedure
        .input(z.object({
            investments: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                const prompt = `Here are the companies I am currently invested in. ${input.investments}, I want you to generate a list of relevant news articles regarding them and offer suggestions for diversifying my investments or looking into other sectors with one other news article to broaden my horizons. MAXIMUM WORDS; DO NOT USE ANY ASTERISKS OR OTHER FORMATTING SYMBOLS`
                const result = await model.generateContent(prompt);
                return { text: result.response.text() };
            } catch (error) {
                console.error("Error querying Gemini AI:", error);
                throw new Error("Error querying Gemini AI API");
            }
        }),
});

export default geminiRouter;