import 'dotenv/config'
import { loadEnv } from '../config/env'
import { initDb } from '../config/db'

const env = loadEnv()
const { sequelize } = initDb(env)

const questions = [
  {
    questionText: 'What does the CSS property "display: flex" do?',
    codeSnippet: '.container {\n  display: flex;\n}',
    answers: ['Makes the element a flex container', 'Hides the element', 'Makes the element inline', 'Changes background color'],
    correctAnswerIndex: 0,
    explanation: 'display: flex creates a flex container, enabling flexbox layout for its children.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'Which CSS property controls text size?',
    codeSnippet: null,
    answers: ['font-size', 'text-size', 'font-style', 'text-style'],
    correctAnswerIndex: 0,
    explanation: 'font-size is the correct property to control the size of text.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What does "z-index" control in CSS?',
    codeSnippet: '.element {\n  position: absolute;\n  z-index: 10;\n}',
    answers: ['Stacking order of elements', 'Element width', 'Element height', 'Text color'],
    correctAnswerIndex: 0,
    explanation: 'z-index controls the stacking order of positioned elements along the z-axis.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you center a block element horizontally?',
    codeSnippet: '.centered {\n  margin: 0 auto;\n  width: 50%;\n}',
    answers: ['margin: 0 auto', 'text-align: center', 'align: center', 'center: true'],
    correctAnswerIndex: 0,
    explanation: 'margin: 0 auto with a defined width centers a block element horizontally.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the CSS selector ".class1.class2" select?',
    codeSnippet: '.class1.class2 {\n  color: red;\n}',
    answers: ['Elements with both classes', 'Elements with either class', 'Nested elements', 'Parent elements'],
    correctAnswerIndex: 0,
    explanation: 'A selector without spaces selects elements that have both classes applied.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'What is the default value of the position property?',
    codeSnippet: null,
    answers: ['static', 'relative', 'absolute', 'fixed'],
    correctAnswerIndex: 0,
    explanation: 'The default position value is static, which means normal document flow.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'Which CSS property is used for controlling the layout of multiple columns?',
    codeSnippet: '.multi-column {\n  column-count: 3;\n}',
    answers: ['column-count', 'columns', 'col-count', 'multi-column'],
    correctAnswerIndex: 0,
    explanation: 'column-count specifies the number of columns an element should be divided into.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'What does "!important" do in CSS?',
    codeSnippet: '.element {\n  color: red !important;\n}',
    answers: ['Increases specificity', 'Decreases specificity', 'Disables the rule', 'Makes it inline'],
    correctAnswerIndex: 0,
    explanation: '!important gives a CSS declaration the highest specificity, overriding other declarations.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'Which property creates rounded corners?',
    codeSnippet: '.box {\n  border-radius: 10px;\n}',
    answers: ['border-radius', 'corner-radius', 'round-corner', 'border-round'],
    correctAnswerIndex: 0,
    explanation: 'border-radius is used to create rounded corners on elements.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What is the CSS Box Model order from inside to outside?',
    codeSnippet: null,
    answers: ['Content, Padding, Border, Margin', 'Margin, Border, Padding, Content', 'Content, Border, Padding, Margin', 'Padding, Content, Border, Margin'],
    correctAnswerIndex: 0,
    explanation: 'The CSS Box Model layers from inside out: Content, Padding, Border, Margin.',
    category: 'css',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you define a variable in SCSS?',
    codeSnippet: '$primary-color: #333;\n\n.button {\n  background: $primary-color;\n}',
    answers: ['$variable-name', '@variable-name', 'var(--variable-name)', '--variable-name'],
    correctAnswerIndex: 0,
    explanation: 'SCSS uses $ prefix for defining variables.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the @mixin directive do in SCSS?',
    codeSnippet: '@mixin center {\n  display: flex;\n  justify-content: center;\n}',
    answers: ['Defines reusable CSS code', 'Imports files', 'Creates variables', 'Extends selectors'],
    correctAnswerIndex: 0,
    explanation: '@mixin creates reusable blocks of CSS code that can be included with @include.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you use a mixin in SCSS?',
    codeSnippet: '.button {\n  @include center;\n}',
    answers: ['@include mixin-name', '@use mixin-name', '@apply mixin-name', '@extend mixin-name'],
    correctAnswerIndex: 0,
    explanation: '@include is used to apply a mixin to a selector.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What is nesting in SCSS?',
    codeSnippet: '.parent {\n  .child {\n    color: blue;\n  }\n}',
    answers: ['Writing selectors inside other selectors', 'Importing files', 'Creating loops', 'Defining functions'],
    correctAnswerIndex: 0,
    explanation: 'SCSS allows nesting selectors inside one another to create more organized and readable code.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the & symbol represent in SCSS?',
    codeSnippet: '.button {\n  &:hover {\n    opacity: 0.8;\n  }\n}',
    answers: ['Parent selector', 'Child selector', 'Variable', 'Mixin'],
    correctAnswerIndex: 0,
    explanation: 'The & symbol references the parent selector, useful for pseudo-classes and BEM.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you import a file in SCSS?',
    codeSnippet: '@import "variables";\n@import "mixins";',
    answers: ['@import "filename"', '@use "filename"', '@require "filename"', '@include "filename"'],
    correctAnswerIndex: 0,
    explanation: '@import is used to include other SCSS files (though @use is now preferred).',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What is @extend used for in SCSS?',
    codeSnippet: '.error {\n  @extend .message;\n}',
    answers: ['Inherit styles from another selector', 'Create variables', 'Define mixins', 'Import files'],
    correctAnswerIndex: 0,
    explanation: '@extend allows one selector to inherit the styles of another.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you create a for loop in SCSS?',
    codeSnippet: '@for $i from 1 through 3 {\n  .col-#{$i} { width: 100% / $i; }\n}',
    answers: ['@for $i from 1 through 3', 'for $i in 1..3', '@loop $i from 1 to 3', '@each $i in 1..3'],
    correctAnswerIndex: 0,
    explanation: '@for creates loops in SCSS, useful for generating repetitive CSS.',
    category: 'scss',
    difficulty: 'hard'
  },
  {
    questionText: 'What does @each do in SCSS?',
    codeSnippet: '@each $color in red, blue, green {\n  .bg-#{$color} { background: $color; }\n}',
    answers: ['Iterates over a list', 'Creates variables', 'Defines mixins', 'Imports files'],
    correctAnswerIndex: 0,
    explanation: '@each loops through lists or maps in SCSS.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you define a placeholder in SCSS?',
    codeSnippet: '%placeholder {\n  color: blue;\n}\n\n.element {\n  @extend %placeholder;\n}',
    answers: ['%placeholder-name', '$placeholder-name', '@placeholder-name', '#placeholder-name'],
    correctAnswerIndex: 0,
    explanation: 'Placeholders are defined with % and can be extended but won\'t appear in compiled CSS unless extended.',
    category: 'scss',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you define a variable in Stylus?',
    codeSnippet: 'primary-color = #333\n\n.button\n  background primary-color',
    answers: ['variable-name = value', '$variable-name: value', '@variable-name: value', 'var(--variable-name)'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses simple assignment without $ or @ prefix.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'What is unique about Stylus syntax?',
    codeSnippet: '.button\n  padding 10px\n  margin 5px',
    answers: ['Optional braces and semicolons', 'Requires $ for variables', 'Uses @ for mixins', 'Mandatory semicolons'],
    correctAnswerIndex: 0,
    explanation: 'Stylus allows omitting braces, semicolons, and colons for cleaner syntax.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'How do you define a mixin in Stylus?',
    codeSnippet: 'center()\n  display flex\n  justify-content center\n\n.button\n  center()',
    answers: ['name()', '@mixin name', 'mixin name', '$name'],
    correctAnswerIndex: 0,
    explanation: 'Stylus mixins are defined like functions with parentheses.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'How does Stylus handle color manipulation?',
    codeSnippet: 'base-color = #333\nlight-color = base-color + 30%',
    answers: ['Built-in color functions', 'Requires external library', 'Not possible', 'Only with hex values'],
    correctAnswerIndex: 0,
    explanation: 'Stylus has built-in color manipulation with operators like +, -, *, /.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What is the purpose of the @import directive in Stylus?',
    codeSnippet: '@import "variables"\n@import "mixins"',
    answers: ['Import other Stylus files', 'Create variables', 'Define functions', 'Extend selectors'],
    correctAnswerIndex: 0,
    explanation: '@import in Stylus includes other files, similar to SCSS.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'How do you create a conditional in Stylus?',
    codeSnippet: 'if dark-mode\n  background black\nelse\n  background white',
    answers: ['if condition', '@if condition', 'when condition', 'case condition'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses if/else for conditionals without @ prefix.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What are transparent mixins in Stylus?',
    codeSnippet: 'border-radius()\n  -webkit-border-radius arguments\n  -moz-border-radius arguments\n  border-radius arguments',
    answers: ['Mixins that accept any number of arguments', 'Mixins with opacity', 'Hidden mixins', 'Compiled mixins'],
    correctAnswerIndex: 0,
    explanation: 'Transparent mixins in Stylus can accept any number of arguments using the arguments keyword.',
    category: 'stylus',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you iterate in Stylus?',
    codeSnippet: 'for num in 1..3\n  .col-{num}\n    width (100% / num)',
    answers: ['for variable in range', '@for variable in range', '@each variable in range', 'loop variable in range'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses for loops with the in keyword.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What does the "arguments" keyword do in Stylus?',
    codeSnippet: 'box-shadow()\n  -webkit-box-shadow arguments\n  box-shadow arguments',
    answers: ['Passes all mixin arguments', 'Defines function parameters', 'Creates variables', 'Imports files'],
    correctAnswerIndex: 0,
    explanation: 'The arguments keyword in Stylus passes all arguments to properties, useful for vendor prefixes.',
    category: 'stylus',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you interpolate variables in Stylus?',
    codeSnippet: 'sides = top right bottom left\n\nfor side in sides\n  .margin-{side}\n    margin-{side} 10px',
    answers: ['{variable}', '#{variable}', '${variable}', '%{variable}'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses curly braces {} for variable interpolation.',
    category: 'stylus',
    difficulty: 'medium'
  }
]

async function seedQuiz() {
  try {
    await sequelize.authenticate()
    console.log('Connected to database')

    await sequelize.query(`
      INSERT INTO quiz_questions (
        question_text, code_snippet, answers, correct_answer_index,
        explanation, category, difficulty
      ) VALUES ${questions.map((_, i) => `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`).join(', ')}
      ON CONFLICT DO NOTHING
    `, {
      bind: questions.flatMap(q => [
        q.questionText,
        q.codeSnippet,
        JSON.stringify(q.answers),
        q.correctAnswerIndex,
        q.explanation,
        q.category,
        q.difficulty
      ])
    })

    console.log(`Seeded ${questions.length} quiz questions`)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

seedQuiz()
