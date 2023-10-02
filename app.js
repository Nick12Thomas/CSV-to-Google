const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(express.static('public'))
app.use(fileUpload());
app.use(bodyParser.json());

//auth  client setup


const client = new google.auth.GoogleAuth({
    keyFile: 'creds.json',
    scopes:"https://www.googleapis.com/auth/spreadsheets"
  })
const sheets=google.sheets({version:"v4", auth:client})



// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle the CSV import request
app.post('/import', (req, res) => {
    const { data, selectedColumns } = req.body;

    // Prepare the data based on selected columns
    const importedData = data.map((row) => {
        const rowData = [];
        selectedColumns.forEach((column) => {
            rowData.push(row[column]);
        });
        return rowData;
    });

    // Define the spreadsheet ID and range
    const spreadsheetId ='1qtYpC69T9m7f1IzCouLgezSkDuI2VoP1eLi-URAMI74';
    const range = 'Sheet1';

    //create new sheet 
    // sheets.spreadsheets.create(
    //     {
    //       auth: client,
    //       resource: {
    //         properties: {
    //           title: 'Sheet1 ',
    //         },
    //       },
    //     },
    //     (err, response) => {
    //       if (err) {
    //         console.error(`Error creating a new sheet: ${err}`);
    //         return;
    //       }
      
    //       const newSheetId = response.data.spreadsheetId;
    //       console.log(`New sheet created with ID: ${newSheetId}`);
    //     }
    //   );
      

    // Append the data to the Google Sheets
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: importedData,
        },
    }, (err, response) => {
        if (err) {
            console.error('Error importing data:', err);
            res.status(500).json({ message: 'Error importing data' });
        } else {
            console.log('Data imported successfully.');
            res.status(200).json({ message: 'Data imported successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
