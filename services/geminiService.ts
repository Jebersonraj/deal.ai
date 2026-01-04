
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, ProductDetails } from '../types';

// IMPORTANT: This check is required for the environment this code runs in.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

// Helper function to parse potentially malformed JSON from Gemini
const parseGeminiJson = <T,>(jsonString: string): T => {
    try {
        // First attempt to parse directly
        return JSON.parse(jsonString);
    } catch (e) {
        // If it fails, try to extract from markdown code block
        const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("Invalid JSON response from AI model.");
    }
};


export const searchProducts = async (query: string): Promise<Product[]> => {
    const prompt = `You are a product data aggregation API. A user is searching for '${query}'. Return a JSON array of 8 realistic but fictional product listings from 'Amazon', 'Flipkart', 'Myntra', and 'Ajio'. Each product must have these fields:
- id: a unique string
- name: a relevant and specific product name related to the query
- platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio'
- price: a number between 1000 and 50000
- rating: a number between 3.5 and 5.0, with one decimal place
- reviewCount: a number between 50 and 5000
- imageUrl: a relevant image URL from source.unsplash.com/400x300/?{search_term}. The {search_term} should be a simple, one- or two-word lowercase description of the product category (e.g., 'headphones', 'running-shoes', 'smartwatch'). This is critical to ensure images load correctly.
- productUrl: a valid search URL on the product's platform for the Indian version of the site. For a product named 'XYZ ABC', the URL should be constructed like this:
  - Amazon: 'https://www.amazon.in/s?k=XYZ+ABC'
  - Flipkart: 'https://www.flipkart.com/search?q=XYZ+ABC'
  - Myntra: 'https://www.myntra.com/XYZ-ABC'
  - Ajio: 'https://www.ajio.com/search/?text=XYZ+ABC'
- inStock: boolean
- bestCardOffer: a short, catchy bank offer string, e.g., '10% Instant Discount on SBI Card' or 'Flat ₹1500 Off on HDFC EMI'.
- bestEmiPlan: a concise EMI plan description, e.g., 'No Cost EMI from ₹4,165/month' or 'EMI starts at ₹1,999/month'.
Ensure the JSON is well-formed.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        if (!response.text) {
            throw new Error("Empty response from AI model.");
        }
        
        return parseGeminiJson<Product[]>(response.text);

    } catch (error) {
        console.error("Error fetching products from Gemini:", error);
        throw new Error("Failed to fetch product search results.");
    }
};

export const fetchMoreProducts = async (query: string, existingIds: string[]): Promise<Product[]> => {
    const prompt = `You are a product data aggregation API. A user is searching for '${query}'. They already have products with these IDs: ${existingIds.join(', ')}. Return a JSON array of 4 NEW realistic but fictional product listings that are NOT in the existing IDs list. Each product must have these fields:
- id: a unique string NOT in the provided list of existing IDs.
- name: a relevant and specific product name related to the query.
- platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio'
- price: a number between 1000 and 50000
- rating: a number between 3.5 and 5.0, with one decimal place
- reviewCount: a number between 50 and 5000
- imageUrl: a relevant image URL from source.unsplash.com/400x300/?{search_term}. The {search_term} should be a simple, one- or two-word lowercase description of the product category (e.g., 'headphones', 'running-shoes', 'smartwatch'). This is critical to ensure images load correctly.
- productUrl: a valid search URL on the product's platform for the Indian version of the site.
- inStock: boolean
- bestCardOffer: a short, catchy bank offer string.
- bestEmiPlan: a concise EMI plan description.
Ensure the JSON is well-formed.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        if (!response.text) {
            throw new Error("Empty response from AI model.");
        }
        
        return parseGeminiJson<Product[]>(response.text);

    } catch (error) {
        console.error("Error fetching more products from Gemini:", error);
        throw new Error("Failed to fetch more product results.");
    }
};

export const fetchProductDetails = async (product: Product): Promise<ProductDetails> => {
    const prompt = `You are a price prediction API. For the product named '${product.name}' with ID '${product.id}', generate its price history for the last 14 days and a price prediction for the next 14 days. The current price is ${product.price}. 
    
    Return a JSON object with these keys: "priceHistory", "pricePrediction", and "predictionExplanation".
    - "priceHistory": An array of objects, one for each of the last 14 days, with "date" (YYYY-MM-DD format, ending yesterday) and "price" (a number fluctuating realistically around the current price).
    - "pricePrediction": An array of objects for today and the next 13 days, with "date", "predictedPrice", "confidenceMin" (lower bound), and "confidenceMax" (upper bound). The prediction should show a plausible trend.
    - "predictionExplanation": A short, user-friendly text (2-3 sentences) explaining the price prediction trend (e.g., 'Prices are expected to slightly decrease over the next week due to seasonal demand changes.').
    
    Ensure the JSON is well-formed.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        if (!response.text) {
            throw new Error("Empty response from AI model.");
        }

        const details = parseGeminiJson<Omit<ProductDetails, keyof Product>>(response.text);

        return { ...product, ...details };

    } catch (error) {
        console.error("Error fetching product details from Gemini:", error);
        throw new Error("Failed to fetch product details.");
    }
};
