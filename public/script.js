
        const csvFileInput = document.getElementById('csvFileInput');
        const csvDataTable = document.getElementById('csvDataTable');
        const columnSelection = document.getElementById('columnSelection');
        let csvData = [];
    
        // Add drag-and-drop event listeners to the entire document
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleFileSelect);
    
        // Prevent default behavior for drag-and-drop events
        function handleDragOver(e) {
            e.preventDefault();
        }
    
        // Handle dropped files
        function handleFileSelect(e) {
            e.preventDefault();
    
            const files = e.dataTransfer.files;
    
            if (files.length > 0) {
                const file = files[0];
    
                if (file.type === 'text/csv') {
                    alert('Uploaded Successful')
                    parseCSVFile(file);
                } else {
                    alert('Only CSV files are supported.');
                }
            }
        }

    // Parse the CSV file
    function parseCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvString = event.target.result;
            csvData = parseCSV(csvString);
            displayCSVData(csvData);
            createColumnCheckboxes(csvData[0])
        };
        reader.readAsText(file);
    }

    // Parse CSV data into an array of objects
    function parseCSV(csvString) {      
        const rows = csvString.split('\n');
        const headers = rows[0].split(',');
        const data = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = row[j];
            }
            data.push(rowData);
        }
        return data;
    }

    // Display CSV data in a table
    function displayCSVData(data) {
        const headers = Object.keys(data[0]);
        const tableHeaders = headers.map((header) => `<th>${header}</th>`).join('');
        const tableRows = data.map((row) => {
            return `<tr>${headers.map((header) => `<td>${row[header]}</td>`).join('')}</tr>`;
        }).join('');
        csvDataTable.innerHTML = `<thead><tr>${tableHeaders}</tr></thead><tbody>${tableRows}</tbody>`;
    }

   // Function to create column checkboxes for selection
function createColumnCheckboxes(columns) {
    
    const columnSelectionContainer = document.getElementById('columnSelection');
    columnSelectionContainer.innerHTML = ''; // Clear existing checkboxes

    const checkboxes = Object.keys(columns).map((column) => {
        return `
        <label>
            <input type="checkbox" name="selectedColumns" value="${column}">${column}
        </label><br>
        `;
    }).join('');

    columnSelection.innerHTML = checkboxes; // Add new checkboxes
}


    // Import selected data to Google Sheets
    

function importData() {
    const selectedColumns = Array.from(document.querySelectorAll('input[name="selectedColumns"]:checked'))
        .map((checkbox) => checkbox.value);

    // Send selected data to the server for Google Sheets integration
    fetch('/import', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: csvData, selectedColumns }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
        })
        .catch((error) => {
            console.log(error)
            alert('Error importing data: ' + error.message);
        });
}
