const puppeteer = require('puppeteer');
const asyncHandler = require("express-async-handler");

const checkForOutOfStock = asyncHandler(async (req, res) => {
    const { productData } = req.body;
  
    if (!productData || !Array.isArray(productData)) {
      return res.status(400).json({ error: 'Invalid request. Please provide an array of products.' });
    }
  
    try {
      const browser = await puppeteer.launch();
  
      const results = await Promise.all(
        productData
          .filter(product => product.productSourceUrl) // Filter products with productSourceUrl
          .map(async (product) => {
            try {
              const page = await browser.newPage();
              await page.goto(product.productSourceUrl, { waitUntil: 'networkidle2' });
  
              // Wait for a while to make sure all dynamic content is loaded
              await page.waitForTimeout(5000);
  
              const foundOutOfStock = await page.evaluate(() => {
                // Adjust this logic based on the actual structure of the website
                const outOfStockElements = document.querySelectorAll('.Badge'); // Use an appropriate selector
                return outOfStockElements.length > 0;
              });
  
              await page.close();
  
              return { ...product, outOfStock: foundOutOfStock };
            } catch (error) {
              console.error(`Failed to fetch data for ${product.name}:`, error);
              return { ...product, outOfStock: null };
            }
          })
      );
  
      await browser.close();
  
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = { checkForOutOfStock };
