# Bulk Data Extractor 

## Overview
This is an option page where you manipulate your product ids (UPC/ASIN) by opening it directly in chrome tabs and get the details then put it in the table.

![data-extractor](/assets/bulk-data-extractor.png)

## Page Datails
![page-details](/assets/details.png)

## Features
- **Amazon Detail Page Extractor**
    - Since you will be extracting Amazon Page, the product ID to be used is ASIN
    - Limit of 100 page only per bulk open
    - Always wait for the pages to be completely loaded in the chrome app
    - Extracted Data will be loaded in the table with search functionality added
    - Copy to Clipboard Functionality

- **Add Product Page Extractor**
    - Product ID used: UPC or ASIN
    - Limit of 50 page only per bulk open
    - Always wait for the pages to be completely loaded in the chrome app
    - Extracted Data will be loaded in the table with search functionality added
    - Copy to Clipboard Functionality

## Instructions
- Select first extractor type
    - Selecting type will change the header of the table and the data inside if available
    - Make sure to update the extractor type if you opened on another site
- Enter product ids depending on the selected type
    - Amazon Detail Page - ASIN only, it will cause missing detail page if not/invalid asin.
    - Add Product Page - UPC or ASIN
    - **Note:** Notification will popup when you exceed the limit number per type and exceed number will not be opened.
- Click **Open Button** to open all your entered product ids
    - You can also use chrome incognito mode, but make sure you are already logged-in specially seller central and enable the extension for incognito
    - To enable in incognito mode
        - Right click extension icon
        - Click Manage Extensions
        - Find **Allow in incognito** and enable it
- After all the pages completely loaded and click **Load Button**
- When you are done gathering all the data needed, click **Copy to Clipboard** button to copy it and paste it to excel
    - Header for excel is already added when you pasted it