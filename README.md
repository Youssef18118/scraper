# Naver Finance Web Crawler & MongoDB Storage

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This Node.js project is a web crawler designed to gather financial data from Naver Finance (https://finance.naver.com/research/company_list.naver) and store it in a MongoDB database. The crawler specifically targets company stock reports, extracting key information and providing valuable insights into market trends and analyst sentiment.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Data Extraction Strategy](#data-extraction-strategy)
- [Future Enhancements](#future-enhancements)
- [Disclaimer](#disclaimer)

## Features

- **Data Extraction:** Gathers the following data points from each company stock report:
    - Analyst Name
    - Analyst Company
    - Target Company Name
    - Target Company Stock Prediction Price
    - Target Company Stock Price at Time of Prediction
    - Target Company Stock Price Today (current)
- **Data Parsing:** Utilizes the Cheerio library to parse the HTML structure of the main list page and the detailed post pages.
- **Data Cleansing:** Handles character encoding issues using iconv-lite to properly decode Korean text.
- **Data Persistence:** Stores the structured data into a MongoDB database for further analysis or use.
- **Pagination:** Iterates through multiple pages of the Naver Finance company list to collect a comprehensive dataset.

## Technologies Used

- **axios:** A promise-based HTTP client for making requests to the Naver Finance website.
- **cheerio:** A server-side jQuery implementation for parsing HTML content.
- **iconv-lite:** A pure JavaScript character encoding conversion library.
- **MongoDB:** A NoSQL database for flexible and scalable data storage.
- **Node.js:** The JavaScript runtime environment.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/<your-repository-name>.git

