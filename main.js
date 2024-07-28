import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import pdf from 'pdf-parse'; // pdf-parse library

const BASE_URL = 'https://finance.naver.com/research/company_list.naver';
const MAX_RETRIES = 3;
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds
const MAX_ROWS_TO_PROCESS = 3; // Process only the first 3 rows

async function scrapeNaverFinance(page = 1) {
  let response; // Declare response outside the while loop
  let rows; // Declare rows outside the try-catch blocks

  try {
    // Axios request with retry mechanism... (your existing code)
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const url = `${BASE_URL}?&page=${page}`;
        response = await axios.get(url, { responseType: 'arraybuffer' }); // Assign response here
        if (response.status === 200) break; // Success
        else throw new Error(`Request failed with status code ${response.status}`);
      } catch (err) {
        console.error(`Attempt ${retries + 1} failed:`, err);
        retries++;
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    }
    if (retries === MAX_RETRIES) throw new Error(`Failed after ${MAX_RETRIES} retries`);

    // Now it's safe to use response here because it's guaranteed to have a value (or an error was thrown)
    // Decoding and Cheerio loading
    // Decoding and Cheerio loading
    const decodedHtml = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(decodedHtml);
    rows = $('tbody tr').not('.blank_07'); // Assign to 'rows' here

    const reports = [];
    for (let i = 0; i < Math.min(rows.length, MAX_ROWS_TO_PROCESS); i++) {
      const row = rows.eq(i);

      try {
        // Extract post page URL
        const postPageLinkElement = row.find('td:nth-child(2) a:first-child');
        const postPageUrl = postPageLinkElement.attr('href');

        // Fetch post page
        const postPageResponse = await axios.get(postPageUrl);
        const $post = cheerio.load(postPageResponse.data);

        // Extract target price (목표주가)
        const targetPriceElement = $post('em.money'); 
        const targetPriceText = targetPriceElement.text().trim();

        // Extract current price (현재주가)
        const currentPriceElement = $post('table.view_info_2 tr:nth-child(1) td:nth-child(2)');
        const currentPriceText = currentPriceElement.text().trim();


        // Parse prices (remove commas, symbols, etc., if necessary)
        const targetPrice = parseInt(targetPriceText.replace(/[^0-9]/g, ''), 10) || 'N/A'; // Set to "N/A" if parsing fails
        const currentPrice = parseInt(currentPriceText.replace(/[^0-9]/g, ''), 10) || 'N/A';

        const structuredData = {
          종목명: iconv.decode(Buffer.from(row.find('td:nth-child(1)').text().trim()), 'utf-8'),
          증권사: iconv.decode(Buffer.from(row.find('td:nth-child(3)').text().trim()), 'utf-8'),
          첨부: 'Yes',
          작성일: row.find('.date').text().trim(),
          목표주가: targetPrice,
          현재주가: currentPrice,
        };

        // ... (your existing data filtering logic) ...

      } catch (rowError) {
        // ... (your existing error handling for row processing) ...
      }
    } // End of for loop (row processing)

    console.log(reports); // Output data for the current page

    // ... (your existing pagination logic) ...
  } catch (error) { // This is the main 'catch' for the outer 'try' block
    console.error('Error scraping data:', error);
    // ... (Add more general error handling if needed) ...
  }
}

scrapeNaverFinance();
