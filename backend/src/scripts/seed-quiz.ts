import 'dotenv/config'
import { loadEnv } from '../config/env'
import { initDb } from '../config/db'

const env = loadEnv()
const { sequelize } = initDb(env)

const questions = [
  {
    questionText: 'What does the CSS property "display: flex" do?',
    questionTextUk: 'Що робить властивість CSS "display: flex"?',
    codeSnippet: '.container {\n  display: flex;\n}',
    answers: ['Makes the element a flex container', 'Hides the element', 'Makes the element inline', 'Changes background color'],
    answersUk: ['Робить елемент flex-контейнером', 'Приховує елемент', 'Робить елемент інлайновим', 'Змінює колір фону'],
    correctAnswerIndex: 0,
    explanation: 'display: flex creates a flex container, enabling flexbox layout for its children.',
    explanationUk: 'display: flex створює flex-контейнер і вмикає flex-розкладку для його дітей.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'Which CSS property controls text size?',
    questionTextUk: 'Яка CSS-властивість керує розміром тексту?',
    codeSnippet: null,
    answers: ['font-size', 'text-size', 'font-style', 'text-style'],
    answersUk: ['font-size', 'text-size', 'font-style', 'text-style'],
    correctAnswerIndex: 0,
    explanation: 'font-size is the correct property to control the size of text.',
    explanationUk: 'font-size — правильна властивість для керування розміром тексту.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What does "z-index" control in CSS?',
    questionTextUk: 'За що відповідає "z-index" у CSS?',
    codeSnippet: '.element {\n  position: absolute;\n  z-index: 10;\n}',
    answers: ['Stacking order of elements', 'Element width', 'Element height', 'Text color'],
    answersUk: ['Порядок накладання елементів', 'Ширину елемента', 'Висоту елемента', 'Колір тексту'],
    correctAnswerIndex: 0,
    explanation: 'z-index controls the stacking order of positioned elements along the z-axis.',
    explanationUk: 'z-index керує порядком накладання позиційованих елементів по осі z.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you center a block element horizontally?',
    questionTextUk: 'Як відцентрувати блочний елемент по горизонталі?',
    codeSnippet: '.centered {\n  margin: 0 auto;\n  width: 50%;\n}',
    answers: ['margin: 0 auto', 'text-align: center', 'align: center', 'center: true'],
    answersUk: ['margin: 0 auto', 'text-align: center', 'align: center', 'center: true'],
    correctAnswerIndex: 0,
    explanation: 'margin: 0 auto with a defined width centers a block element horizontally.',
    explanationUk: 'margin: 0 auto з заданою шириною центрує блочний елемент по горизонталі.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the CSS selector ".class1.class2" select?',
    questionTextUk: 'Що вибирає селектор CSS ".class1.class2"?',
    codeSnippet: '.class1.class2 {\n  color: red;\n}',
    answers: ['Elements with both classes', 'Elements with either class', 'Nested elements', 'Parent elements'],
    answersUk: ['Елементи з обома класами', 'Елементи з будь-яким із класів', 'Вкладені елементи', 'Батьківські елементи'],
    correctAnswerIndex: 0,
    explanation: 'A selector without spaces selects elements that have both classes applied.',
    explanationUk: 'Селектор без пробілу вибирає елементи, які мають обидва класи одночасно.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'What is the default value of the position property?',
    questionTextUk: 'Яке значення position використовується за замовчуванням?',
    codeSnippet: null,
    answers: ['static', 'relative', 'absolute', 'fixed'],
    answersUk: ['static', 'relative', 'absolute', 'fixed'],
    correctAnswerIndex: 0,
    explanation: 'The default position value is static, which means normal document flow.',
    explanationUk: 'Значення position за замовчуванням — static, тобто звичайний потік документа.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'Which CSS property is used for controlling the layout of multiple columns?',
    questionTextUk: 'Яка CSS-властивість керує багатоколонковим макетом?',
    codeSnippet: '.multi-column {\n  column-count: 3;\n}',
    answers: ['column-count', 'columns', 'col-count', 'multi-column'],
    answersUk: ['column-count', 'columns', 'col-count', 'multi-column'],
    correctAnswerIndex: 0,
    explanation: 'column-count specifies the number of columns an element should be divided into.',
    explanationUk: 'column-count визначає, на скільки колонок треба розділити елемент.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'What does "!important" do in CSS?',
    questionTextUk: 'Що робить "!important" у CSS?',
    codeSnippet: '.element {\n  color: red !important;\n}',
    answers: ['Increases specificity', 'Decreases specificity', 'Disables the rule', 'Makes it inline'],
    answersUk: ['Підвищує специфічність', 'Знижує специфічність', 'Вимикає правило', 'Робить інлайновим'],
    correctAnswerIndex: 0,
    explanation: '!important gives a CSS declaration the highest specificity, overriding other declarations.',
    explanationUk: '!important надає декларації найвищу специфічність і перекриває інші правила.',
    category: 'css',
    difficulty: 'medium'
  },
  {
    questionText: 'Which property creates rounded corners?',
    questionTextUk: 'Яка властивість створює округлені кути?',
    codeSnippet: '.box {\n  border-radius: 10px;\n}',
    answers: ['border-radius', 'corner-radius', 'round-corner', 'border-round'],
    answersUk: ['border-radius', 'corner-radius', 'round-corner', 'border-round'],
    correctAnswerIndex: 0,
    explanation: 'border-radius is used to create rounded corners on elements.',
    explanationUk: 'border-radius використовується для округлення кутів елементів.',
    category: 'css',
    difficulty: 'easy'
  },
  {
    questionText: 'What is the CSS Box Model order from inside to outside?',
    questionTextUk: 'Який порядок шарів у CSS Box Model зсередини назовні?',
    codeSnippet: null,
    answers: ['Content, Padding, Border, Margin', 'Margin, Border, Padding, Content', 'Content, Border, Padding, Margin', 'Padding, Content, Border, Margin'],
    answersUk: ['Content, Padding, Border, Margin', 'Margin, Border, Padding, Content', 'Content, Border, Padding, Margin', 'Padding, Content, Border, Margin'],
    correctAnswerIndex: 0,
    explanation: 'The CSS Box Model layers from inside out: Content, Padding, Border, Margin.',
    explanationUk: 'Порядок шарів у Box Model зсередини назовні: Content, Padding, Border, Margin.',
    category: 'css',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you define a variable in SCSS?',
    questionTextUk: 'Як оголосити змінну в SCSS?',
    codeSnippet: '$primary-color: #333;\n\n.button {\n  background: $primary-color;\n}',
    answers: ['$variable-name', '@variable-name', 'var(--variable-name)', '--variable-name'],
    answersUk: ['$variable-name', '@variable-name', 'var(--variable-name)', '--variable-name'],
    correctAnswerIndex: 0,
    explanation: 'SCSS uses $ prefix for defining variables.',
    explanationUk: 'У SCSS для змінних використовується префікс $.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the @mixin directive do in SCSS?',
    questionTextUk: 'Для чого директива @mixin у SCSS?',
    codeSnippet: '@mixin center {\n  display: flex;\n  justify-content: center;\n}',
    answers: ['Defines reusable CSS code', 'Imports files', 'Creates variables', 'Extends selectors'],
    answersUk: ['Створює багаторазовий блок CSS', 'Імпортує файли', 'Створює змінні', 'Розширює селектори'],
    correctAnswerIndex: 0,
    explanation: '@mixin creates reusable blocks of CSS code that can be included with @include.',
    explanationUk: '@mixin створює багаторазовий блок стилів, який підключають через @include.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you use a mixin in SCSS?',
    questionTextUk: 'Як використати міксин у SCSS?',
    codeSnippet: '.button {\n  @include center;\n}',
    answers: ['@include mixin-name', '@use mixin-name', '@apply mixin-name', '@extend mixin-name'],
    answersUk: ['@include mixin-name', '@use mixin-name', '@apply mixin-name', '@extend mixin-name'],
    correctAnswerIndex: 0,
    explanation: '@include is used to apply a mixin to a selector.',
    explanationUk: '@include застосовує міксин до селектора.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What is nesting in SCSS?',
    questionTextUk: 'Що таке вкладення (nesting) у SCSS?',
    codeSnippet: '.parent {\n  .child {\n    color: blue;\n  }\n}',
    answers: ['Writing selectors inside other selectors', 'Importing files', 'Creating loops', 'Defining functions'],
    answersUk: ['Запис селекторів усередині інших селекторів', 'Імпорт файлів', 'Створення циклів', 'Визначення функцій'],
    correctAnswerIndex: 0,
    explanation: 'SCSS allows nesting selectors inside one another to create more organized and readable code.',
    explanationUk: 'SCSS дозволяє вкладати селектори один в один, роблячи код більш структурованим і читабельним.',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What does the & symbol represent in SCSS?',
    questionTextUk: 'Що означає символ & у SCSS?',
    codeSnippet: '.button {\n  &:hover {\n    opacity: 0.8;\n  }\n}',
    answers: ['Parent selector', 'Child selector', 'Variable', 'Mixin'],
    answersUk: ['Батьківський селектор', 'Дочірній селектор', 'Змінна', 'Міксин'],
    correctAnswerIndex: 0,
    explanation: 'The & symbol references the parent selector, useful for pseudo-classes and BEM.',
    explanationUk: 'Символ & посилається на батьківський селектор, зручно для псевдокласів і BEM.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you import a file in SCSS?',
    questionTextUk: 'Як імпортувати файл у SCSS?',
    codeSnippet: '@import "variables";\n@import "mixins";',
    answers: ['@import "filename"', '@use "filename"', '@require "filename"', '@include "filename"'],
    answersUk: ['@import "filename"', '@use "filename"', '@require "filename"', '@include "filename"'],
    correctAnswerIndex: 0,
    explanation: '@import is used to include other SCSS files (though @use is now preferred).',
    explanationUk: '@import підключає інші SCSS-файли (хоча зараз рекомендують @use).',
    category: 'scss',
    difficulty: 'easy'
  },
  {
    questionText: 'What is @extend used for in SCSS?',
    questionTextUk: 'Для чого використовують @extend у SCSS?',
    codeSnippet: '.error {\n  @extend .message;\n}',
    answers: ['Inherit styles from another selector', 'Create variables', 'Define mixins', 'Import files'],
    answersUk: ['Успадковувати стилі іншого селектора', 'Створювати змінні', 'Визначати міксини', 'Імпортувати файли'],
    correctAnswerIndex: 0,
    explanation: '@extend allows one selector to inherit the styles of another.',
    explanationUk: '@extend дає селектору успадкувати стилі іншого селектора.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you create a for loop in SCSS?',
    questionTextUk: 'Як створити цикл for у SCSS?',
    codeSnippet: '@for $i from 1 through 3 {\n  .col-#{$i} { width: 100% / $i; }\n}',
    answers: ['@for $i from 1 through 3', 'for $i in 1..3', '@loop $i from 1 to 3', '@each $i in 1..3'],
    answersUk: ['@for $i from 1 through 3', 'for $i in 1..3', '@loop $i from 1 to 3', '@each $i in 1..3'],
    correctAnswerIndex: 0,
    explanation: '@for creates loops in SCSS, useful for generating repetitive CSS.',
    explanationUk: '@for створює цикли у SCSS, зручно для генерації повторюваних стилів.',
    category: 'scss',
    difficulty: 'hard'
  },
  {
    questionText: 'What does @each do in SCSS?',
    questionTextUk: 'Що робить @each у SCSS?',
    codeSnippet: '@each $color in red, blue, green {\n  .bg-#{$color} { background: $color; }\n}',
    answers: ['Iterates over a list', 'Creates variables', 'Defines mixins', 'Imports files'],
    answersUk: ['Ітерується списком', 'Створює змінні', 'Визначає міксини', 'Імпортує файли'],
    correctAnswerIndex: 0,
    explanation: '@each loops through lists or maps in SCSS.',
    explanationUk: '@each проходить по списках або мапах у SCSS.',
    category: 'scss',
    difficulty: 'medium'
  },
  {
    questionText: 'How do you define a placeholder in SCSS?',
    questionTextUk: 'Як оголосити placeholder у SCSS?',
    codeSnippet: '%placeholder {\n  color: blue;\n}\n\n.element {\n  @extend %placeholder;\n}',
    answers: ['%placeholder-name', '$placeholder-name', '@placeholder-name', '#placeholder-name'],
    answersUk: ['%placeholder-name', '$placeholder-name', '@placeholder-name', '#placeholder-name'],
    correctAnswerIndex: 0,
    explanation: 'Placeholders are defined with % and can be extended but won\'t appear in compiled CSS unless extended.',
    explanationUk: 'Плейсхолдери оголошують із %, їх можна розширювати, але в CSS вони з\'являються лише після @extend.',
    category: 'scss',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you define a variable in Stylus?',
    questionTextUk: 'Як оголосити змінну в Stylus?',
    codeSnippet: 'primary-color = #333\n\n.button\n  background primary-color',
    answers: ['variable-name = value', '$variable-name: value', '@variable-name: value', 'var(--variable-name)'],
    answersUk: ['ім\'я-змінної = значення', '$variable-name: value', '@variable-name: value', 'var(--variable-name)'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses simple assignment without $ or @ prefix.',
    explanationUk: 'У Stylus використовують просте присвоєння без префіксів $ чи @.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'What is unique about Stylus syntax?',
    questionTextUk: 'Чим особливий синтаксис Stylus?',
    codeSnippet: '.button\n  padding 10px\n  margin 5px',
    answers: ['Optional braces and semicolons', 'Requires $ for variables', 'Uses @ for mixins', 'Mandatory semicolons'],
    answersUk: ['Можна опускати дужки й крапки з комою', 'Потрібен $ для змінних', 'Використовує @ для міксинів', 'Обовʼязкові крапки з комою'],
    correctAnswerIndex: 0,
    explanation: 'Stylus allows omitting braces, semicolons, and colons for cleaner syntax.',
    explanationUk: 'Stylus дозволяє опускати дужки, крапки з комою та двокрапки для компактного синтаксису.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'How do you define a mixin in Stylus?',
    questionTextUk: 'Як оголосити міксин у Stylus?',
    codeSnippet: 'center()\n  display flex\n  justify-content center\n\n.button\n  center()',
    answers: ['name()', '@mixin name', 'mixin name', '$name'],
    correctAnswerIndex: 0,
    explanation: 'Stylus mixins are defined like functions with parentheses.',
    explanationUk: 'Міксини Stylus оголошуються як функції з дужками.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'How does Stylus handle color manipulation?',
    questionTextUk: 'Як Stylus працює з кольорами?',
    codeSnippet: 'base-color = #333\nlight-color = base-color + 30%',
    answers: ['Built-in color functions', 'Requires external library', 'Not possible', 'Only with hex values'],
    answersUk: ['Вбудовані функції для кольорів', 'Потрібна зовнішня бібліотека', 'Неможливо', 'Лише з hex-значеннями'],
    correctAnswerIndex: 0,
    explanation: 'Stylus has built-in color manipulation with operators like +, -, *, /.',
    explanationUk: 'У Stylus є вбудована робота з кольорами через оператори +, -, *, /.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What is the purpose of the @import directive in Stylus?',
    questionTextUk: 'Для чого директива @import у Stylus?',
    codeSnippet: '@import "variables"\n@import "mixins"',
    answers: ['Import other Stylus files', 'Create variables', 'Define functions', 'Extend selectors'],
    correctAnswerIndex: 0,
    explanation: '@import in Stylus includes other files, similar to SCSS.',
    explanationUk: '@import у Stylus підключає інші файли, схоже на SCSS.',
    category: 'stylus',
    difficulty: 'easy'
  },
  {
    questionText: 'How do you create a conditional in Stylus?',
    questionTextUk: 'Як створити умовний оператор у Stylus?',
    codeSnippet: 'if dark-mode\n  background black\nelse\n  background white',
    answers: ['if condition', '@if condition', 'when condition', 'case condition'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses if/else for conditionals without @ prefix.',
    explanationUk: 'Stylus використовує if/else без префікса @ для умов.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What are transparent mixins in Stylus?',
    questionTextUk: 'Що таке прозорі міксини в Stylus?',
    codeSnippet: 'border-radius()\n  -webkit-border-radius arguments\n  -moz-border-radius arguments\n  border-radius arguments',
    answers: ['Mixins that accept any number of arguments', 'Mixins with opacity', 'Hidden mixins', 'Compiled mixins'],
    correctAnswerIndex: 0,
    explanation: 'Transparent mixins in Stylus can accept any number of arguments using the arguments keyword.',
    explanationUk: 'Прозорі міксини Stylus приймають довільну кількість аргументів через keyword arguments.',
    category: 'stylus',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you iterate in Stylus?',
    questionTextUk: 'Як робити ітерації у Stylus?',
    codeSnippet: 'for num in 1..3\n  .col-{num}\n    width (100% / num)',
    answers: ['for variable in range', '@for variable in range', '@each variable in range', 'loop variable in range'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses for loops with the in keyword.',
    explanationUk: 'Stylus використовує цикл for із ключовим словом in.',
    category: 'stylus',
    difficulty: 'medium'
  },
  {
    questionText: 'What does the "arguments" keyword do in Stylus?',
    questionTextUk: 'Що робить keyword "arguments" у Stylus?',
    codeSnippet: 'box-shadow()\n  -webkit-box-shadow arguments\n  box-shadow arguments',
    answers: ['Passes all mixin arguments', 'Defines function parameters', 'Creates variables', 'Imports files'],
    correctAnswerIndex: 0,
    explanation: 'The arguments keyword in Stylus passes all arguments to properties, useful for vendor prefixes.',
    explanationUk: 'arguments у Stylus передає всі аргументи в властивості, зручно для вендорних префіксів.',
    category: 'stylus',
    difficulty: 'hard'
  },
  {
    questionText: 'How do you interpolate variables in Stylus?',
    questionTextUk: 'Як інтерполювати змінні у Stylus?',
    codeSnippet: 'sides = top right bottom left\n\nfor side in sides\n  .margin-{side}\n    margin-{side} 10px',
    answers: ['{variable}', '#{variable}', '${variable}', '%{variable}'],
    correctAnswerIndex: 0,
    explanation: 'Stylus uses curly braces {} for variable interpolation.',
    explanationUk: 'Stylus використовує фігурні дужки {} для інтерполяції змінних.',
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
        explanation, category, difficulty, question_text_uk, answers_uk, explanation_uk
      ) VALUES ${questions.map((_, i) => `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`).join(', ')}
      ON CONFLICT DO NOTHING
    `, {
      bind: questions.flatMap(q => [
        q.questionText,
        q.codeSnippet,
        JSON.stringify(q.answers),
        q.correctAnswerIndex,
        q.explanation,
        q.category,
        q.difficulty,
        q.questionTextUk,
        q.answersUk ? JSON.stringify(q.answersUk) : null,
        q.explanationUk
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
