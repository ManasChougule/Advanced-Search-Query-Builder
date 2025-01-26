# Advanced Search Query Builder

This project implements an advanced query-building interface inspired by JIRA, enabling seamless construction of complex search conditions. The system dynamically offers suggestions via dropdowns based on user inputs and updates suggestions in real-time as the user types. It features dynamic dropdown suggestions, keyboard navigation, real-time input processing to enhance search precision and efficiency.

## Features

- **Switch Modes**: Toggle between "Basic Mode" and "Advanced Mode" for tailored search experiences.
- **Dynamic Suggestions**: Context-aware dropdown suggestions dynamically update based on user input, with autocomplete for fields, operators, and values.
- **Keyboard Shortcuts**: Navigate options with the "down arrow button," auto-complete with "TAB Key," and execute queries with the "Enter Key."
- **Real-Time Feedback**: Updates suggestions in real-time as queries are typed.
- **Query Composition**: Supports intuitive query input with `field`, `condition`, and `value` syntax.
- **Custom Query Syntax**: Use a highly customizable syntax similar to JIRA Query Language (JQL), allowing you to create complex queries with fields, operators, values, and keywords.
- **Field-Specific Filtering**: Query based on various fields like status, assignee, project, labels, priority, and more.
- **Logical Operators**: Combine conditions using logical operators like AND, OR, and NOT.
- **Sorting and Ordering**: Specify sorting order using the `ORDER BY` clause.
- **Keyword Search**: Use keywords like `IN`, `NOT IN`, `IS`, `IS NOT` for flexible filtering.
- **Subqueries**: Embed subqueries for nested condition handling.

## Usage Instructions

1. **Switch to Advanced Mode**: Click the button to enable "Advanced Mode."
2. **Input Query**: Start typing your query in the format of `field`, `condition`, and `value`.
3. **Select Suggestions**: Use the dropdown to view suggested options based on your input.
4. **Keyboard Shortcuts**:
   - Use the "down arrow button" to navigate through dropdown options.
   - Press the "TAB Key" to auto-complete the selected suggestion.
   - Press the "Enter Key" to execute the search.
5. **Dynamic Updates**: As you type, the dropdown will update to show the most relevant suggestions.

## Example Query Flow

1. Start typing: `status =` 
   - Dropdown suggests options like `Open`, `In Progress`, `Closed`.
2. Navigate with "down arrow button" to select `Open`.
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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
