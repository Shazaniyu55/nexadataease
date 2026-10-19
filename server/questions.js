// CBT question bank. answer = index of the correct option. Add more questions any time.
module.exports = {
  web: [
    { q: "Which HTML tag creates a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0 },
    { q: "Which CSS property changes the colour of text?", options: ["font-color", "color", "text-style", "fg"], answer: 1 },
    { q: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?", options: ["var", "let", "const", "def"], answer: 1 },
    { q: "Which HTTP method is normally used to create a new resource?", options: ["GET", "DELETE", "POST", "HEAD"], answer: 2 },
    { q: "Express.js runs on which platform?", options: ["Python", "Java", "Node.js", "PHP"], answer: 2 },
  ],
  data: [
    { q: "Which SQL clause filters rows?", options: ["WHERE", "ORDER BY", "GROUP BY", "LIMIT"], answer: 0 },
    { q: "Which Excel function looks up a value in the first column of a table?", options: ["SUMIF", "VLOOKUP", "COUNTA", "CONCAT"], answer: 1 },
    { q: "Which Python library is most used for data frames?", options: ["Flask", "pandas", "Django", "pytest"], answer: 1 },
    { q: "Which measure is the middle value of a sorted dataset?", options: ["Mean", "Mode", "Median", "Range"], answer: 2 },
    { q: "Which chart best shows a trend over time?", options: ["Pie chart", "Line chart", "Donut chart", "Venn diagram"], answer: 1 },
  ],
  mobile: [
    { q: "Flutter apps are written in which language?", options: ["Java", "Swift", "Dart", "Kotlin"], answer: 2 },
    { q: "In Flutter, almost everything on screen is a:", options: ["Activity", "Widget", "Controller", "Fragment"], answer: 1 },
    { q: "Which widget type can rebuild when its internal state changes?", options: ["StatelessWidget", "StatefulWidget", "Container", "Text"], answer: 1 },
    { q: "Which file lists a Flutter project's dependencies?", options: ["pubspec.yaml", "package.json", "build.gradle", "Podfile"], answer: 0 },
    { q: "Which command runs a Flutter app?", options: ["flutter run", "flutter start", "dart serve", "npm start"], answer: 0 },
  ],
  uiux: [
    { q: "What does UX stand for?", options: ["User Xerox", "User Experience", "Universal Exchange", "Unified Experience"], answer: 1 },
    { q: "A low-fidelity layout of a screen is called a:", options: ["Wireframe", "Logo", "Style guide", "Moodboard"], answer: 0 },
    { q: "What is the main goal of user research?", options: ["Make the UI colourful", "Understand users' needs and behaviour", "Reduce code size", "Pick fonts"], answer: 1 },
    { q: "Which tool is commonly used for UI prototyping?", options: ["Figma", "Docker", "Postman", "Git"], answer: 0 },
    { q: "Good contrast between text and background mainly improves:", options: ["Database speed", "Readability and accessibility", "Battery life", "File size"], answer: 1 },
  ],
};