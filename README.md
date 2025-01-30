# Advanced Search Query Builder

This project implements an advanced query-building interface inspired by JIRA, enabling seamless construction of complex search conditions. The system dynamically offers suggestions via dropdowns based on user inputs and updates suggestions in real-time as the user types. It features dynamic dropdown suggestions, keyboard navigation, real-time input processing to enhance search precision and efficiency.

## Features

- **Switch Modes**: Toggle between "Basic Mode" and "Advanced Mode" for tailored search experiences.
- **Dynamic Suggestions**: Context-aware dropdown suggestions dynamically update based on user input, with autocomplete for fields, operators, and values.
- **Keyboard Shortcuts**: Navigate options with the "up-down arrow button," auto-complete with "TAB Key"
- **Real-Time Feedback**: Updates suggestions in real-time as queries are typed.
- **Query Composition**: Supports intuitive query input with `field`, `condition`, and `value` syntax.
- **Custom Query Syntax**: Use a flexible and customizable syntax similar to JIRA Query Language (JQL), allowing you to create highly complex queries with fields, operators, values, and keywords.
- **Field-Specific Filtering**: Query based on various fields like status, assignee, project, labels, priority, and more.
- **Logical Operators**: Combine conditions using logical operators like AND, OR, and NOT.
- **Sorting and Ordering**: Specify sorting order using the `ORDER BY` clause.
- **Keyword Search**: Use keywords like `==`, `!=`, `HAS`, `HASNOT`, `STARTSWITH`, `ENDWITH` etc. for flexible filtering.
- **Subqueries**: Embed subqueries for nested condition handling.
- **Backend Integration**: 
   - **Solr Querying**: The backend integrates with Solr to fetch field values dynamically, allowing for fast and scalable search results.
   - **Field and Value Retrieval**: For each field, the backend queries Solr to return a list of available values
   - **Real-Time Data Fetching**: As the user types, the backend dynamically processes input and fetches updated field values from Solr.

## Usage Instructions

1. **Switch to Advanced Mode**: Click the button to enable "Advanced Mode."
2. **Input Query**: Start typing your query in the format of `field`, `condition`, and `value`.
3. **Select Suggestions**: Use the dropdown to view suggested options based on your input.
4. **Keyboard Shortcuts**:
   - Use the "up-down arrow button" to navigate through dropdown options.
   - Press the "TAB Key" to auto-complete the selected suggestion.
5. **Dynamic Updates**: As you type, the dropdown will update to show the most relevant suggestions.

## Example Query Flow

1. Start typing: `source` 
   - Dropdown suggests options like `sourceFileName`, `sourceFileType`, `sourceFileSize`.
2. Navigate with "up-down arrow button".
3. Press "TAB Key" to auto-complete.
4. Continue typing additional conditions or press "Enter Key" to search.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

To use this project:

1. Clone the repository:
   ```bash
   git clone https://github.com/ManasChougule475/advanced-search-query-builder.git
   ```

2. Navigate to the project directory:
   ```bash
   cd advanced-search-query-builder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm start

