export default {
  // Chicken Coop Lesson
  "step1Title": "Task Introduction",
  "step2Title": "Problem Description",
  "step3Title": "Experimentation",
  "step4Title": "Mathematical Analysis",
  "step5Title": "Formal Solution",
  
  // Problem description
  "problemDescription": "We have 40 meters of fencing available. We want to build a rectangular chicken coop with the largest possible area. What should its dimensions be?",
  "problemHint": "Think about how the area changes depending on the proportions of the sides. Is there a shape that seems to give the largest area with a constant perimeter?",
  
  // Interactive elements
  "sideA": "Side A length",
  "sideB": "Side B length",
  "usedFence": "Used fencing",
  "chickenArea": "Chicken coop area",
  "tryMaximize": "Try to maximize the area!",
  "isMaximum": "Great! You are close to the optimal solution!",
  
  // Tasks
  "task": "Task",
  "task1": "Calculate the x-coordinate of the vertex (length of one side)",
  "task2": "Calculate the length of the second side",
  "task3": "Provide optimal chicken coop dimensions (x × y)",
  "task1Placeholder": "x = -b / (2a) = -20 / (2×(-1)) = ...",
  "task2Placeholder": "y = L - x = 20 - 10 = ...",
  "task3Placeholder": "__ × __ meters (e.g. 10.0 × 10.0)",
  "task1Hint": "Hint: L = 20 (half of 40m perimeter), a = -1, b = 20",
  "task2Hint": "Hint: y = 20 - x = 20 - 10",
  "task3Hint": "Hint: Substitute the calculated values of x and y",
  
  // Feedback
  "enterNumber": "Enter a number",
  "correct": "Correct! ✅",
  "incorrect": "Incorrect. Correct answer:",
  "meters": "meters",
  "allCorrect": "🎉 Congratulations! You discovered that a square gives the largest area!",
  "someIncorrect": "📚 Some answers need improvement. Check the hints and try again.",
  
  // Solution
  "solutionSummary": "Solution summary:",
  "vertexCoordinate": "Vertex x-coordinate: x = -20/(-2) = 10 m",
  "secondSide": "Second side length: y = 20 - 10 = 10 m",
  "optimalDimensions": "Optimal dimensions: 10.0 × 10.0 meters",
  "maximumArea": "Maximum area: 100 m²",
  "mathematicalConclusion": "Mathematical conclusion: With a constant perimeter, a square has the largest area among all rectangles. This is a universal principle in optimization problems!",
  
  // Additional translations
  "formalApproach": "Now we'll move to a formal mathematical approach. The problem can be formulated as:",
  "findMaximum": "Find the maximum of the function: P(x) = x(L-x)",
  "whereX": "where x is the length of one side, and L is half the perimeter.",
  "parabolaExplanation": "This is a quadratic function whose graph is a parabola. The maximum value of the function (i.e., the largest area) is at the vertex of this parabola. The x-coordinate of the vertex of a parabola with equation ax² + bx + c is: x = -b / (2a). In our case, after expanding P(x) = Lx - x², we have a = -1, b = L, c = 0.",
  "step1VertexTitle": "Step 1: Calculate the x-coordinate of the vertex",
  "vertexFormula": "Formula for the x-coordinate of parabola vertex",
  "formulaExplanation": "Where for function P(x) = Lx - x² we have: a = -1, b = L = 20, c = 0",
  "step2SecondSideTitle": "Step 2: Calculate the length of the second side",
  "secondSideFormula": "Formula for the second side",
  "secondSideExplanation": "Where L = 20 (half the perimeter), and x = {{x}} (from previous step)",
  "step3DimensionsTitle": "Step 3: Provide optimal chicken coop dimensions",
  "calculationSummary": "Calculation summary",
  "firstSide": "first side",
  "secondSide": "second side",
  "provideFinalDimensions": "Now provide the final chicken coop dimensions in format: x × y",
  "congratulations": "🎉 Congratulations! Task completed!",
  "backToFinalStep": "Back to final step",
  "nextStep": "Next step",
  "finalStep": "Final step",
  "provideCorrectX": "First provide the correct answer for the x-coordinate!",
  "provideCorrectY": "First provide the correct answer for the second side length!",
  "back": "Back",
  "browserNotSupport": "Your browser does not support video"
}