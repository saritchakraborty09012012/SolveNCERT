import type { Chapter } from './content';

// ── IT BOOK CONTEXT FOR GROQ ────────────────────────────────────────────────
export const IT_BOOK_CONTEXT = `
INFORMATION TECHNOLOGY (Code 402) — Class IX (NCERT / PSSCIVE, 2026 Revised Syllabus)
Domestic Data Entry Operator — Employability + Vocational skill subject.

UNIT 1: Introduction to IT-ITeS Industry
- IT vs ITeS, IT-BPM industry sub-sectors, uses of IT across education, business,
  banking, healthcare, science & engineering, government e-services

UNIT 2: Data Entry and Keyboarding Skills
- Keyboard layout: alphanumeric, function, arrow, numeric keypad, special keys
- Touch typing, home keys, guide keys (F & J), muscle memory, typing ergonomics
- Rapid Typing Tutor colour codes, WPM (words per minute)

UNIT 3: Digital Documentation (LibreOffice Writer)
- Word processing basics, menus, toolbars, formatting, tables
- Find & Replace, Spell check, Mail Merge, page setup, headers/footers, passwords

UNIT 4: Electronic Spreadsheet (LibreOffice Calc)
- Cells, rows, columns, worksheets vs workbooks
- Relative/absolute/mixed cell referencing, formulas, functions (SUM, AVERAGE,
  MIN, MAX, IF, AND, OR, ROUND, ABS, UPPER, LOWER, LEN, date/time functions)
- Sorting, filtering, data validation, charts

UNIT 5: Digital Presentation (LibreOffice Impress)
- Presentation Wizard, slide views (Normal, Outline, Notes, Slide Sorter, Handout)
- Master slide, slide transitions, animations, headers/footers, templates
- Inserting objects: text, images, tables, charts, audio/video

Note: Practical/typing exercises requiring hands-on physical practice (not
fixed written answers) are excluded from the Q&A bank, per the source material.
`;

export const IT_CHAPTERS: Chapter[] = [
  {
    id: 'ch01', number: 1,
    title: 'Introduction to IT-ITeS Industry',
    slug:  'introduction-to-it-ites-industry',
    code:  '17925ch01',
    exercises: [
      {
        id: 'ex1.a', title: 'Give an Example of the Use of IT',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Give an example of the use of IT in classroom content transaction.',
            answer: {
              answerKey: 'Teachers use projectors/smart-boards to show digital slides, videos and animations.',
              schoolMethod: 'Teachers use projectors and smart-boards to show digital slides, videos and animations to explain lessons instead of only using chalk and talk.',
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Give an example of the use of IT in assessment of students.',
            answer: {
              answerKey: 'Online tests/quizzes on computers auto-check answers and generate marks/result sheets.',
              schoolMethod: 'Online tests/quizzes are conducted on computers which auto-check answers, generate marks and prepare result sheets quickly and without bias.',
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Give an example of the use of IT in library management.',
            answer: {
              answerKey: 'Barcode/RFID software issues/returns books, tracks due dates, sends overdue reminders.',
              schoolMethod: 'Barcode/RFID based software issues and returns books, tracks due dates and sends automatic overdue reminders to students.',
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Give an example of the use of IT in student record management.',
            answer: {
              answerKey: 'School management software stores attendance, marks, fee and personal details in a searchable database.',
              schoolMethod: 'School management software stores attendance, marks, fee and personal details of every student in a searchable database.',
            }
          },
        ]
      },
      {
        id: 'ex1.b', title: 'Short Answer Questions (50 words)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What do you understand by the term IT and ITeS?',
            answer: {
              answerKey: 'IT = creating/managing/storing/exchanging information via hardware & software. ITeS = services delivered using IT (call centres, BPOs, medical transcription, data processing).',
              schoolMethod: 'IT (Information Technology) means creating, managing, storing and exchanging information using computer hardware and software. ITeS (IT enabled Services) means services delivered using IT to improve business efficiency, such as call centres, BPOs, medical transcription and data processing.',
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'What are the pros and cons of using ICT?',
            answer: {
              answerKey: 'Pros: faster communication, easy info access, saves time/cost, efficiency. Cons: cyber crime risk, overdependence, reduced personal interaction, misuse of data.',
              schoolMethod: 'Pros: faster communication, easy access to information, saves time and cost, and improves efficiency. Cons: risk of cyber crime and data theft, overdependence on technology, reduced personal interaction, and possible misuse of personal information.',
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'What precautions are required to ensure that ICT use is safe?',
            answer: {
              answerKey: 'Strong passwords, updated antivirus, avoid sharing personal data, verify links, secure networks, log out after use.',
              schoolMethod: '• Use strong, unique passwords\n• Keep antivirus software updated\n• Avoid sharing personal data online\n• Verify links/attachments before opening\n• Use secure, trusted networks\n• Log out after using shared computers',
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'What are the four main sub-sectors in the IT-BPM industry?',
            answer: {
              answerKey: 'IT Services, Business Process Management (BPM), Software Products, Engineering/R&D and Hardware services.',
              schoolMethod: 'The four main sub-sectors of the IT-BPM industry are: (i) IT Services, (ii) Business Process Management (BPM), (iii) Software Products, and (iv) Engineering, R&D and Hardware services.',
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Give examples of use of IT in everyday life.',
            answer: {
              answerKey: 'Embedded software in appliances; computers for contacts/schedules; mobiles for banking, shopping, navigation, communication.',
              schoolMethod: 'Household appliances like washing machines and microwave ovens use embedded software; computers store contacts and schedules; mobiles are used for banking, shopping, navigation and communication in daily routines.',
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'How is IT used in libraries?',
            answer: {
              answerKey: 'Barcodes/magnetic strips linked to software issue/return/track books and deactivate only when legally borrowed.',
              schoolMethod: 'Books carry barcodes/magnetic strips linked to software that issues, returns and tracks books, keeps records of availability, and deactivates the strip only when a book is legally borrowed.',
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'What are the various processes of education where IT is used?',
            answer: {
              answerKey: 'E-learning, smart-board presentations, desktop publishing, educational games, CD-ROM learning, online assessment, LMS.',
              schoolMethod: 'IT is used in e-learning classrooms, smart-board presentations, desktop publishing of study material, educational games, CD-ROM based learning, online assessment, and Learning Management Systems (LMS) for anytime learning.',
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Which software are used in digital communication?',
            answer: {
              answerKey: 'Email clients, chat/messaging apps, video conferencing software, FTP/Telnet tools.',
              schoolMethod: 'Email clients, chat and messaging apps, video conferencing software, and File Transfer Protocol (FTP)/Telnet based tools are commonly used software for digital communication.',
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'For what purpose is IT used in business?',
            answer: {
              answerKey: 'Payroll, budgeting, sales analysis, forecasting, stock management, e-commerce, marketing, CRM.',
              schoolMethod: 'IT is used in business for payroll calculation, budgeting, sales analysis, financial forecasting, stock management, e-commerce transactions, marketing, and maintaining customer and supplier relationships efficiently.',
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'Which are the prominent areas where IT is used in science and engineering?',
            answer: {
              answerKey: 'CAD/CAM, scientific calculations, simulation/testing, large data storage, space/rocket research.',
              schoolMethod: 'IT is prominently used in Computer Aided Design (CAD) and Computer Aided Manufacturing (CAM), scientific calculations, simulation and testing of designs, storing large data sets, and space/rocket research.',
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'List the various uses of IT in a banking system.',
            answer: {
              answerKey: 'Customer/transaction records, e-RD/e-FD, NEFT/RTGS, online banking, ATM services, capital market analysis.',
              schoolMethod: '• Recording customer data and transactions\n• Recurring/Fixed deposits (e-RD, e-FD)\n• Fund transfer through NEFT/RTGS\n• Online banking transactions\n• ATM cash deposit/withdrawal\n• Capital market and financial analysis services',
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'Which are the different areas of healthcare where IT is used? And how?',
            answer: {
              answerKey: 'Hospital Management Systems (records); CAT/MRI/ECG/EEG (diagnosis); expert systems (early detection); IT-aided instrument manufacturing.',
              schoolMethod: 'Hospital Management Systems maintain patient records; CAT, MRI, ECG and EEG machines use IT for diagnosis; expert systems help detect diseases early; computers aid manufacturing of diagnostic instruments.',
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'List any 5 websites of the Indian government which provide IT enabled services to the people.',
            answer: {
              answerKey: 'india.gov.in, incometax.gov.in, epathshala.nic.in, digitalindia.gov.in, uidai.gov.in',
              schoolMethod: '• www.india.gov.in\n• www.incometax.gov.in\n• www.epathshala.nic.in\n• www.digitalindia.gov.in\n• www.uidai.gov.in (Aadhaar)',
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch02', number: 2,
    title: 'Data Entry and Keyboarding Skills',
    slug:  'data-entry-and-keyboarding-skills',
    code:  '17925ch02',
    exercises: [
      {
        id: 'ex2.mcq', title: 'Multiple Choice Questions',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Which of the following is not a key for punctuation marks?', parts: ['(a) comma (,)', '(b) period (.)', '(c) semicolon (;)', '(d) equal sign (=)'], answer: { answerKey: '(d) equal sign (=)', schoolMethod: '(d) equal sign (=) is not a punctuation key — it is a mathematical operator key.' } },
          { id: 'q2', number: '2', isHard: false, text: 'Which of the following is not an arrow key?', parts: ['(a) top (^)', '(b) down (↓)', '(c) right (→)', '(d) left (←)'], answer: { answerKey: '(a) top (^)', schoolMethod: '(a) top (^) is not an arrow key — the correct up arrow key is ↑, not the caret symbol.' } },
          { id: 'q3', number: '3', isHard: false, text: 'Which of the following operation is not performed by a mouse?', parts: ['(a) Left Click', '(b) Right Click', '(c) Middle Click', '(d) Double Click'], answer: { answerKey: '(c) Middle Click', schoolMethod: 'A standard mouse does not have a distinct "Middle Click" operation the way it has Left, Right, and Double Click.' } },
          { id: 'q4', number: '4', isHard: false, text: 'In the Rapid typing tutor, which of the following is not true?', parts: ['(a) Green = right inputs', '(b) Yellow = right inputs in extra time', '(c) Red = wrong inputs within time', '(d) Orange = wrong inputs within time'], answer: { answerKey: '(d) Orange = wrong inputs within time', schoolMethod: 'Statement (d) is incorrect — Orange denotes wrong inputs exceeding the allotted time, not wrong inputs within time.' } },
          { id: 'q5', number: '5', isHard: false, text: 'The lesson control panel can be used for ______.', parts: ['(a) animation', '(b) enable or disable sounds', '(c) plain', '(d) background'], answer: { answerKey: '(b) enable or disable sounds', schoolMethod: '(b) enable or disable sounds is the function of the lesson control panel.' } },
        ]
      },
      {
        id: 'ex2.fib', title: 'Fill in the Blanks',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'A touch typist knows the location on the keyboard through ________ memory.', answer: { answerKey: 'muscle', schoolMethod: 'muscle' } },
          { id: 'q2', number: '2', isHard: false, text: 'The typing speed is measured in ________.', answer: { answerKey: 'words per minute', schoolMethod: 'words per minute' } },
          { id: 'q3', number: '3', isHard: false, text: 'Alphabets (A–Z) and numbers (0–9) are known as ________ keys.', answer: { answerKey: 'Alpha Numeric', schoolMethod: 'Alpha Numeric' } },
          { id: 'q4', number: '4', isHard: false, text: 'Del key deletes the character at the ________ cursor position.', answer: { answerKey: 'current', schoolMethod: 'current' } },
          { id: 'q5', number: '5', isHard: false, text: 'A standard keyboard has ________ Function keys.', answer: { answerKey: '12', schoolMethod: '12' } },
          { id: 'q6', number: '6', isHard: false, text: 'Numeric keypad is used to enter ________ data.', answer: { answerKey: 'Numeric', schoolMethod: 'Numeric' } },
          { id: 'q7', number: '7', isHard: false, text: 'Page Up key is used to shift the ________ one page up.', answer: { answerKey: 'Cursor', schoolMethod: 'Cursor' } },
          { id: 'q8', number: '8', isHard: false, text: 'Pressing the End key moves the cursor to the ________ character of the line.', answer: { answerKey: 'Last', schoolMethod: 'Last' } },
          { id: 'q9', number: '9', isHard: false, text: "On numeric keypad '0' is to be pressed by the ________ thumb.", answer: { answerKey: 'right-hand', schoolMethod: 'right-hand' } },
          { id: 'q10', number: '10', isHard: false, text: 'The numeric keypad has ________ columns and ________ rows.', answer: { answerKey: 'four, five', schoolMethod: 'four, five' } },
        ]
      },
      {
        id: 'ex2.tf', title: 'True or False',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'The Alt key is always used with the other key.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q2', number: '2', isHard: false, text: 'There are 5 arrow keys on the keyboard.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q3', number: '3', isHard: false, text: 'The Backspace key is used to delete the character on the right to the cursor.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q4', number: '4', isHard: false, text: 'Caps lock key is a toggle key.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q5', number: '5', isHard: false, text: 'The control key is used in conjunction with other keys.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q6', number: '6', isHard: false, text: 'Enter key is also known as Return key.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q7', number: '7', isHard: false, text: 'The function keys have different meaning in different software.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q8', number: '8', isHard: false, text: "The keys 'F' and 'J' are known as guide keys.", answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q9', number: '9', isHard: false, text: 'There are two Caps Lock keys on the keyboard.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q10', number: '10', isHard: false, text: 'The mouse has two scroll buttons.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q11', number: '11', isHard: false, text: 'PageDown key is used to move the cursor on next page.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q12', number: '12', isHard: false, text: 'Pressing the Home Key, moves the cursor to the first character in the document.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q13', number: '13', isHard: false, text: 'On a numeric keypad, the number 8 is the guide key.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q14', number: '14', isHard: false, text: 'In Rapid typing tutor, the right input entered is denoted by yellow colour.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q15', number: '15', isHard: false, text: 'In Rapid typing tutor, the right input entered in exceeding time frame is denoted by Red colour.', answer: { answerKey: 'False', schoolMethod: 'False' } },
        ]
      },
      {
        id: 'ex2.sa', title: 'Short Answer Questions (50 words)',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Discuss the various types of keys available on a computer keyboard.', answer: { answerKey: 'Alphanumeric, punctuation, arrow, function keys, and special keys (Alt, Ctrl, Esc, Enter, Backspace, Delete, Caps Lock).', schoolMethod: '• Alphanumeric keys (A-Z, 0-9)\n• Punctuation keys (, . ;)\n• Arrow keys (↑↓←→)\n• Function keys (F1-F12)\n• Special keys: Alt, Ctrl, Esc, Enter, Backspace, Delete, Caps Lock' } },
          { id: 'q2', number: '2', isHard: false, text: 'Differentiate between Home Keys and Guide Keys.', answer: { answerKey: 'Home Keys = base position (ASDF/;LKJ); Guide Keys (F & J) have a raised mark to find Home Row without looking.', schoolMethod: "Home Keys (ASDF and ;LKJ) are the base position keys where fingers rest. Guide Keys ('F' and 'J') carry a small raised mark that helps a touch typist locate the Home Row without looking." } },
          { id: 'q3', number: '3', isHard: false, text: 'What do you understand by Guide Keys? Name the Guide keys of a (a) computer keyboard (b) typewriter.', answer: { answerKey: 'Guide keys have a raised mark for correct finger placement without looking; F and J on both computer keyboard and typewriter.', schoolMethod: 'Guide keys have a raised tactile mark that helps a touch typist place fingers correctly without looking at the keyboard. (a) Computer keyboard: F and J keys. (b) Typewriter: similarly F and J keys.' } },
          { id: 'q4', number: '4', isHard: false, text: 'Explain the role of typing ergonomics.', answer: { answerKey: 'Ensures correct posture, hand position, monitor/keyboard placement to maintain speed/accuracy and prevent fatigue.', schoolMethod: 'Typing ergonomics ensures correct sitting posture, hand position, monitor height and keyboard/mouse placement, which helps maintain speed and accuracy in typing while preventing fatigue and strain during long working hours.' } },
          { id: 'q5', number: '5', isHard: false, text: 'Why the use of various typing software is common now-a-days?', answer: { answerKey: 'Free, easy, structured lessons with speed/accuracy stats and games — convenient for learning touch typing.', schoolMethod: "Typing software like Rapid Typing Tutor is free, easy to use, and provides structured lessons, speed/accuracy statistics and games, making it convenient to learn touch typing efficiently at one's own pace." } },
          { id: 'q6', number: '6', isHard: false, text: 'Mention the finger allocation of keys of the Bottom Row of computer keyboard.', answer: { answerKey: 'Left: Ring-Z, Middle-X, Index-C,V. Right: Index-B,N, Middle-M, Ring-comma, Little-full stop.', schoolMethod: 'Left hand: Ring-Z, Middle-X, Index-C, V. Right hand: Index-B, N, Middle-M, Ring-comma(,), Little-full stop(.). The little finger of the left hand is not used on this row.' } },
        ]
      },
    ]
  },
  {
    id: 'ch03', number: 3,
    title: 'Digital Documentation',
    slug:  'digital-documentation',
    code:  '17925ch03',
    exercises: [
      {
        id: 'ex3.mcq', title: 'Multiple Choice Questions',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Which of following is not a component of the Office Suite?', parts: ['(a) Writer', '(b) Impress', '(c) Internet Explorer', '(d) Base'], answer: { answerKey: '(c) Internet Explorer', schoolMethod: '(c) Internet Explorer is a web browser, not a component of an office suite.' } },
          { id: 'q2', number: '2', isHard: false, text: 'The most widely used word processing software in late 1970s was ______.', parts: ['(a) Word Perfect', '(b) Word', '(c) Word Star', '(d) Writer'], answer: { answerKey: '(c) Word Star', schoolMethod: '(c) Word Star was the most widely used word processing software in the late 1970s.' } },
          { id: 'q3', number: '3', isHard: false, text: 'We can change the mistakes noticed in which of the following?', parts: ['(a) Electronic typewriter', '(b) Word processor software', '(c) Simple typewriter', '(d) Both (a) and (b)'], answer: { answerKey: '(d) Both (a) and (b)', schoolMethod: '(d) Both (a) and (b) — mistakes can be corrected in both an electronic typewriter and word processor software.' } },
          { id: 'q4', number: '4', isHard: false, text: 'Header and Footer is available in which of the following menus?', parts: ['(a) File Menu', '(b) Insert Menu', '(c) View Menu', '(d) Edit Menu'], answer: { answerKey: '(b) Insert Menu', schoolMethod: '(b) Insert Menu contains the Header and Footer option.' } },
          { id: 'q5', number: '5', isHard: false, text: 'To hide or view ruler we should go to which of the following menus?', parts: ['(a) Tools Menu', '(b) Insert Menu', '(c) View Menu', '(d) Edit Menu'], answer: { answerKey: '(c) View Menu', schoolMethod: '(c) View Menu is used to hide or view the ruler.' } },
          { id: 'q6', number: '6', isHard: false, text: 'To check the grammar we should go to which of the following menus?', parts: ['(a) Tools Menu', '(b) Insert Menu', '(c) View Menu', '(d) Edit Menu'], answer: { answerKey: '(a) Tools Menu', schoolMethod: '(a) Tools Menu contains the grammar check option.' } },
          { id: 'q7', number: '7', isHard: false, text: 'To replace a word Bombay with Mumbai, we should go to which of the following menus?', parts: ['(a) Tools Menu', '(b) Edit Menu', '(c) View Menu', '(d) Language Menu'], answer: { answerKey: '(b) Edit Menu', schoolMethod: '(b) Edit Menu contains Find & Replace.' } },
          { id: 'q8', number: '8', isHard: false, text: 'To close an opened document, we should go to which of the following menus?', parts: ['(a) File Menu', '(b) Insert Menu', '(c) View Menu', '(d) Edit Menu'], answer: { answerKey: '(a) File Menu', schoolMethod: '(a) File Menu is used to close an opened document.' } },
          { id: 'q9', number: '9', isHard: false, text: 'Which of the following is the default extension of the writer file?', parts: ['(a) .obt', '(b) .doc', '(c) .odt', '(d) .docx'], answer: { answerKey: '(c) .odt', schoolMethod: '(c) .odt is the default extension of a LibreOffice Writer file.' } },
          { id: 'q10', number: '10', isHard: false, text: 'Which of the following technique selects a sentence in Writer?', parts: ['(a) Single click', '(b) Double Click', '(c) Triple Click', '(d) None of the above'], answer: { answerKey: '(c) Triple Click', schoolMethod: '(c) Triple Click selects an entire sentence in Writer.' } },
          { id: 'q11', number: '11', isHard: false, text: 'Which of the following is a shortcut key to Redo any operation?', parts: ['(a) CTRL + R', '(b) CTRL + Y', '(c) CTRL + X', '(d) CTRL + Z'], answer: { answerKey: '(b) CTRL + Y', schoolMethod: '(b) CTRL + Y is the shortcut key for Redo.' } },
          { id: 'q12', number: '12', isHard: false, text: 'To find a word in a document we can use which of the following function key?', parts: ['(a) F5 key', '(b) F8 key', '(c) F1 key', '(d) None of the above'], answer: { answerKey: '(d) None of the above', schoolMethod: '(d) None of the above — Ctrl+F is used to find a word, not a function key.' } },
          { id: 'q13', number: '13', isHard: false, text: 'Spellings are corrected automatically in Writer because of which of the following features?', parts: ['(a) Auto Text', '(b) Auto Correct', '(c) Auto Complete', '(d) All of the above'], answer: { answerKey: '(b) Auto Correct', schoolMethod: '(b) Auto Correct is the feature that automatically corrects spellings.' } },
          { id: 'q14', number: '14', isHard: false, text: 'The default table size is ______.', parts: ['(a) 1 column, 1 row', '(b) 2 columns, 1 row', '(c) 2 columns, 2 rows', '(d) 1 column, 2 rows'], answer: { answerKey: '(c) 2 columns, 2 rows', schoolMethod: '(c) 2 columns, 2 rows is the default table size when inserted.' } },
          { id: 'q15', number: '15', isHard: false, text: 'What is the shape of the mouse pointer when drawing a table?', parts: ['(a) Pencil', '(b) White pointing arrow', '(c) Black pointing arrow', '(d) Black plus'], answer: { answerKey: '(a) Pencil', schoolMethod: '(a) Pencil — the mouse pointer changes to a pencil shape when drawing a table.' } },
          { id: 'q16', number: '16', isHard: false, text: 'Which shortcut key is used for automatic spell checking?', parts: ['(a) SHIFT + INSERT', '(b) SHIFT + F7', '(c) CTRL + INSERT', '(d) TAB + INSERT'], answer: { answerKey: '(b) SHIFT + F7', schoolMethod: '(b) SHIFT + F7 is the shortcut for automatic spell checking.' } },
          { id: 'q17', number: '17', isHard: false, text: 'Which shortcut key is used to insert table?', parts: ['(a) CTRL + F12', '(b) ALT + DELETE', '(c) CTRL + DELETE', '(d) TAB + DELETE'], answer: { answerKey: '(a) CTRL + F12', schoolMethod: '(a) CTRL + F12 is the shortcut to insert a table.' } },
          { id: 'q18', number: '18', isHard: false, text: 'Which of the following is not valid type of data source in mail merge?', parts: ['(a) Spreadsheet', '(b) Text files', '(c) MySQL', '(d) CSV file'], answer: { answerKey: '(c) MySQL', schoolMethod: '(c) MySQL is not a valid mail merge data source type in Writer.' } },
          { id: 'q19', number: '19', isHard: false, text: 'The default orientation of a page in Writer is ______.', parts: ['(a) portrait', '(b) landscape', '(c) book', '(d) None of the above'], answer: { answerKey: '(a) portrait', schoolMethod: '(a) portrait is the default page orientation in Writer.' } },
          { id: 'q20', number: '20', isHard: false, text: 'Which of the following does not come under page formatting?', parts: ['(a) Setting margins', '(b) Find and replace', '(c) Setting header and footer', '(d) Page orientation'], answer: { answerKey: '(b) Find and replace', schoolMethod: '(b) Find and replace is a text-editing tool, not part of page formatting.' } },
          { id: 'q21', number: '21', isHard: false, text: 'Saving an existing document with some other name using the Save As option ______.', parts: ['(a) replaces the current document', '(b) leaves the current document intact', '(c) is not possible', '(d) closes the document'], answer: { answerKey: '(b) leaves the current document intact', schoolMethod: '(b) leaves the current document intact — Save As creates a new file without altering the original.' } },
          { id: 'q22', number: '22', isHard: false, text: 'Keyboard shortcut to italicise the selected text is', parts: ['(a) Ctrl + U', '(b) Shift + U', '(c) Ctrl + I', '(d) Shift + I'], answer: { answerKey: '(c) Ctrl + I', schoolMethod: '(c) Ctrl + I is the shortcut to italicise selected text.' } },
          { id: 'q23', number: '23', isHard: false, text: 'Which option should be used to type H2O, to get 2 at its proper place?', parts: ['(a) Bold', '(b) Superscript', '(c) Underline', '(d) Subscript'], answer: { answerKey: '(d) Subscript', schoolMethod: '(d) Subscript is used to place the 2 below the line, as in H₂O.' } },
          { id: 'q24', number: '24', isHard: false, text: "What option should be used to change the word 'Books' to 'Copies' in a document?", parts: ['(a) Find', '(b) Find and Replace', '(c) Spell check', '(d) Spelling and grammar check'], answer: { answerKey: '(b) Find and Replace', schoolMethod: '(b) Find and Replace is used to change one word to another throughout a document.' } },
          { id: 'q25', number: '25', isHard: false, text: 'What is the option to print the document so that the height of the page is less than its width?', parts: ['(a) Landscape', '(b) Portrait', '(c) Indent', '(d) Tab setting'], answer: { answerKey: '(a) Landscape', schoolMethod: '(a) Landscape orientation makes the page height less than its width.' } },
        ]
      },
      {
        id: 'ex3.fib', title: 'Fill in the Blanks',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: "The submenu item with three dots '...' just after the submenu name, denote that it will open the ________.", answer: { answerKey: 'dialog box', schoolMethod: 'dialog box' } },
          { id: 'q2', number: '2', isHard: false, text: "The submenu item with right hand side arrows '■', means, clicking on it will open ________.", answer: { answerKey: 'another submenu', schoolMethod: 'another submenu' } },
          { id: 'q3', number: '3', isHard: false, text: 'Formatting Tool Bar contains various options for ________.', answer: { answerKey: 'formatting a document', schoolMethod: 'formatting a document' } },
          { id: 'q4', number: '4', isHard: false, text: 'By pressing the Home key you jump to the ________ and by pressing the End key you jump to ________.', answer: { answerKey: 'beginning of the line, the end of a line', schoolMethod: 'beginning of the line, the end of a line' } },
          { id: 'q5', number: '5', isHard: false, text: 'After using the undo command, to go back again to the previous position, the ________ option or command is used.', answer: { answerKey: 'redo', schoolMethod: 'redo' } },
          { id: 'q6', number: '6', isHard: false, text: 'Double click is used to select the ________.', answer: { answerKey: 'word', schoolMethod: 'word' } },
          { id: 'q7', number: '7', isHard: false, text: 'Headers appear at the ________ and footers appear at the ________ of every page.', answer: { answerKey: 'top, bottom', schoolMethod: 'top, bottom' } },
          { id: 'q8', number: '8', isHard: false, text: 'In the ________ page orientation the height of the page is less than its width.', answer: { answerKey: 'landscape', schoolMethod: 'landscape' } },
          { id: 'q9', number: '9', isHard: false, text: 'The ________ option is used to see how the document will look like when it will be printed.', answer: { answerKey: 'print preview', schoolMethod: 'print preview' } },
          { id: 'q10', number: '10', isHard: false, text: 'In mail merge the file holding the mailing addresses is called as ________.', answer: { answerKey: 'data source', schoolMethod: 'data source' } },
        ]
      },
      {
        id: 'ex3.tf', title: 'True or False',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: "To open word processor 'Window' menu option is selected.", answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q2', number: '2', isHard: false, text: 'Current file name is shown in Status Bar.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q3', number: '3', isHard: false, text: 'Open icon for opening a file is part of Standard Tool Bar.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q4', number: '4', isHard: false, text: 'Format Menu contains the options that apply to the whole document.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q5', number: '5', isHard: false, text: 'It is possible to open a MS-Word file in Libre Office-Writer.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q6', number: '6', isHard: false, text: 'We cannot open Libre Office-Writer file in MS-Word.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q7', number: '7', isHard: false, text: 'Writer does not permit to copy a selected text into another document.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q8', number: '8', isHard: false, text: 'It is possible to copy a selected text without using Menu options and keyboard options.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q9', number: '9', isHard: false, text: "To open the 'Find & Replace' dialog box, we have to go to Format menu.", answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q10', number: '10', isHard: false, text: "We can find all the cities included in a document using 'Find and Replace' feature of Writer.", answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q11', number: '11', isHard: false, text: 'While typing if an incorrect spelling is detected a red line is marked under it. After correcting, the red line is converted into green line.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q12', number: '12', isHard: false, text: 'The text written in Header and Footer is printed on each page of the document.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q13', number: '13', isHard: false, text: 'The page number appears with grey background and is printed with background.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q14', number: '14', isHard: false, text: 'Writer creates a table as wide as the page area.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q15', number: '15', isHard: false, text: 'A new column is created in table by pressing tab key.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q16', number: '16', isHard: false, text: 'Mail merge is used to prepare multiple copies of the same document.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q17', number: '17', isHard: false, text: 'The Form Letter contains the variable information in mail merge.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q18', number: '18', isHard: false, text: 'The portrait and landscape orientations are set in Paper option under properties.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q19', number: '19', isHard: false, text: 'In Print Range by default current page is selected for printing.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q20', number: '20', isHard: false, text: 'By default the page size is A4.', answer: { answerKey: 'True', schoolMethod: 'True' } },
        ]
      },
      {
        id: 'ex3.sa', title: 'Short Answer Questions (50 words)',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: "In a document all the occurrences of word 'this' have to be changed to 'these'. Which option is suitable for this and what is the shortcut command used for it?", answer: { answerKey: "Find and Replace (Edit menu); shortcut Ctrl+H.", schoolMethod: "The 'Find and Replace' option under the Edit menu is used. Its shortcut command is Ctrl+H, which replaces every occurrence of 'this' with 'these' in one go." } },
          { id: 'q2', number: '2', isHard: false, text: 'Which two documents are essential for mail merge?', answer: { answerKey: 'The Form Letter (main document) and the Data Source (mailing details file).', schoolMethod: 'The Form Letter (main document containing the fixed content) and the Data Source (file containing the variable mailing addresses/details) are essential for mail merge.' } },
          { id: 'q3', number: '3', isHard: false, text: 'Explain the concept of Word Processing.', answer: { answerKey: 'Using software to enter, edit, format, store, retrieve and print documents, replacing typewriters.', schoolMethod: 'Word processing is the use of computer software to enter, edit, format, store, retrieve and print documents such as letters, reports and notices, replacing manual/electronic typewriters.' } },
          { id: 'q4', number: '4', isHard: false, text: 'List the various software available for word processing.', answer: { answerKey: 'MS Word, LibreOffice Writer, WordPad, WordStar, WordPerfect, Google Docs.', schoolMethod: '• MS Word\n• LibreOffice Writer\n• WordPad\n• WordStar\n• WordPerfect\n• Google Docs' } },
          { id: 'q5', number: '5', isHard: false, text: 'Write difference between a text editor and a word processor software. Write the name of any text editor or word processor available in market.', answer: { answerKey: 'Text editor (Notepad) = plain text only; word processor (Writer) = formatting, spell check, tables, images.', schoolMethod: 'A text editor (e.g. Notepad) handles plain text without formatting. A word processor (e.g. LibreOffice Writer) supports formatting, spell check, tables and images along with text editing.' } },
          { id: 'q6', number: '6', isHard: false, text: 'List the various components of LibreOffice suite. Explain each component in one line.', answer: { answerKey: 'Writer (word processing), Calc (spreadsheets), Impress (presentations), Base (database), Draw (graphics).', schoolMethod: '• Writer – word processing\n• Calc – spreadsheet preparation\n• Impress – presentations\n• Base – database management\n• Draw – drawing and graphics' } },
          { id: 'q7', number: '7', isHard: false, text: 'Compare the features of manual typewriter, electronic typewriter and word processing software.', answer: { answerKey: 'Manual: no storage, retype for errors. Electronic: minor edits, tiny display. Word processor: full editing/formatting/storage/printing.', schoolMethod: 'Manual typewriter needs retyping for any error and cannot store text. Electronic typewriter allows minor edits but has a tiny display. Word processing software allows full editing, formatting, storage and printing.' } },
          { id: 'q8', number: '8', isHard: false, text: 'Explain the different views to display a document.', answer: { answerKey: 'Print Layout (as it prints), Web Layout (as webpage), Full Screen (toolbars hidden).', schoolMethod: '• Print Layout/Normal view – shows page as it will print\n• Web Layout view – shows document as a webpage\n• Full Screen view – hides toolbars for reading' } },
          { id: 'q9', number: '9', isHard: false, text: 'What are the various methods for selecting the text in a document? Give the steps to select a paragraph.', answer: { answerKey: 'Drag, Shift+Arrow, double-click (word), triple-click (sentence), Ctrl+A (all); quadruple-click selects a paragraph.', schoolMethod: 'Text can be selected by dragging the mouse, using Shift+Arrow keys, double-click (word), triple-click (sentence) or Ctrl+A (whole document). To select a paragraph, quadruple-click (click four times) anywhere within it.' } },
          { id: 'q10', number: '10', isHard: false, text: 'What are the special characters? How can you insert them in a document?', answer: { answerKey: 'Symbols like ©,®,° not on keyboard; Insert → Special Character → select → Insert.', schoolMethod: 'Special characters are symbols not directly available on the keyboard, such as ©, ®, ° or ■. Go to Insert menu → Special Character, select the required symbol, and click Insert.' } },
          { id: 'q11', number: '11', isHard: false, text: 'How will you count the total words of a document?', answer: { answerKey: 'Tools menu → Word Count.', schoolMethod: 'Go to the Tools menu and select the Word Count option. Writer displays the total number of words, characters and lines present in the whole document instantly.' } },
          { id: 'q12', number: '12', isHard: false, text: 'What are the various menu of Writer GUI?', answer: { answerKey: 'File, Edit, View, Insert, Format, Styles, Table, Tools, Window, Help.', schoolMethod: 'File, Edit, View, Insert, Format, Styles, Table, Tools, Window and Help are the various menus available in the LibreOffice Writer graphical user interface.' } },
          { id: 'q13', number: '13', isHard: false, text: 'What is the default extension assigned to the document in Writer when you save it? Write down the steps to save the document to Microsoft Word document?', answer: { answerKey: 'Default .odt. Save as .docx: File → Save As → choose Word 2007-365 (.docx) → Save.', schoolMethod: "The default extension is .odt. To save as MS Word format: File → Save As → choose 'Word 2007-365 (.docx)' or '.doc' from the File type list → click Save." } },
          { id: 'q14', number: '14', isHard: false, text: 'What is the importance of password in the document? How will you protect the document using password in Writer?', answer: { answerKey: "Restricts unauthorised access. File → Save As → tick 'Save with password' → enter twice → Save.", schoolMethod: "A password restricts unauthorised access and protects confidential content. Steps: File → Save As → tick 'Save with password' → enter the password twice → click Save." } },
          { id: 'q15', number: '15', isHard: false, text: 'What is mail merge? Write down the steps to create mailing labels to paste on wedding cards.', answer: { answerKey: 'Combines form letter + data source for personalised copies. Tools → Mail Merge Wizard → Labels → set data source → merge.', schoolMethod: 'Mail merge combines a form letter with a data source to create personalised copies for many recipients. Steps: open Writer → Tools → Mail Merge Wizard → select document type as Labels → choose/create the address data source → arrange address block → complete merge and print.' } },
          { id: 'q16', number: '16', isHard: false, text: 'What are the advantages of table? Prepare your report card of Class VIII in table format.', answer: { answerKey: 'Tables organise data into rows/columns, ease comparison, save space, improve readability.', schoolMethod: 'Tables organise data neatly into rows and columns, make comparison easy, save space and improve readability. (Prepare a table in Writer with columns: Subject, Marks Obtained, Maximum Marks, Grade, and fill in your own Class VIII results.)' } },
          { id: 'q17', number: '17', isHard: false, text: 'Write an application to your Principal for field visit to any IT Industry.', answer: { answerKey: 'Formal application requesting permission for an educational IT-industry field visit.', schoolMethod: 'To,\nThe Principal,\n[School Name]\n\nSubject: Request for permission for an educational field visit\n\nRespected Sir/Madam,\n\nI am a student of Class IX, [Section]. I request your kind permission to organise a field visit for our class to [Name of IT Company], to help us understand real-world IT operations as part of our IT curriculum. Kindly grant permission and oblige.\n\nThanking you,\nYours obediently,\n[Your Name]\nClass IX, Roll No. ___' } },
        ]
      },
    ]
  },
  {
    id: 'ch04', number: 4,
    title: 'Electronic Spreadsheet',
    slug:  'electronic-spreadsheet',
    code:  '17925ch04',
    exercises: [
      {
        id: 'ex4.mcq', title: 'Multiple Choice Questions',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Which of the following technique can be used to allow only date value in cell?', parts: ['(a) Data formatting', '(b) Data sorting', '(c) Data filtering', '(d) Data validation'], answer: { answerKey: '(d) Data validation', schoolMethod: '(d) Data validation restricts cell entries to a specific type, such as dates only.' } },
          { id: 'q2', number: '2', isHard: false, text: 'Which of the following options when selected deletes all data validation?', parts: ['(a) Delete formatting', '(b) Delete all', '(c) Delete formula', '(d) Delete me'], answer: { answerKey: '(b) Delete all', schoolMethod: '(b) Delete all removes all data validation rules from a cell.' } },
          { id: 'q3', number: '3', isHard: false, text: 'We can replace multiple occurrences of a word using which of the following facilities of Calc?', parts: ['(a) Find and replace', '(b) By replace only', '(c) By copy command', '(d) By preview command'], answer: { answerKey: '(a) Find and replace', schoolMethod: '(a) Find and replace lets you replace multiple occurrences of a word at once.' } },
          { id: 'q4', number: '4', isHard: false, text: 'What is the name of mechanism to arrange the data in a particular order?', parts: ['(a) Sorting', '(b) Searching', '(c) Filtering', '(d) Validating'], answer: { answerKey: '(a) Sorting', schoolMethod: '(a) Sorting arranges data in ascending or descending order.' } },
          { id: 'q5', number: '5', isHard: false, text: 'What is the name of mechanism to filter out unnecessary data?', parts: ['(a) Sorting', '(b) Searching', '(c) Filtering', '(d) Validating'], answer: { answerKey: '(d) Validating', schoolMethod: 'As per the answer key given in the source material, the correct answer is (d) Validating.' } },
          { id: 'q6', number: '6', isHard: false, text: 'Which of the following type of package does Calc refer to?', parts: ['(a) Spreadsheet', '(b) Double sheet', '(c) Multi-sheet', '(d) Cannot determine'], answer: { answerKey: '(d) Cannot determine', schoolMethod: 'As per the answer key given in the source material, the correct answer is (d) Cannot determine.' } },
          { id: 'q7', number: '7', isHard: false, text: 'Which of the following is an extension of a worksheet created in Calc?', parts: ['(a) .ods', '(b) .odd', '(c) .xls', '(d) .obj'], answer: { answerKey: '(a) .ods', schoolMethod: '(a) .ods is the default extension of a LibreOffice Calc worksheet.' } },
          { id: 'q8', number: '8', isHard: false, text: 'How can one calculate the total of values entered in a worksheet column?', parts: ['(a) By manual entry', '(b) By auto-sum', '(c) By formula', '(d) By sum function'], answer: { answerKey: '(d) By sum function', schoolMethod: '(d) By sum function — the SUM function totals values in a column.' } },
          { id: 'q9', number: '9', isHard: false, text: 'If we move a cell containing a formula having reference to another cell, what will happen to the cell numbers used in the formula?', parts: ['(a) Row and columns changed at destination', '(b) Row changes at destination', '(c) Columns changed at destination', '(d) No change will occur'], answer: { answerKey: '(c) The cell columns are changed at destination', schoolMethod: '(c) The cell columns are changed at destination when a formula cell is moved.' } },
          { id: 'q10', number: '10', isHard: false, text: 'What is the correct way to enter a function in Calc?', parts: ['(a) Directly typing function name in a cell', '(b) Using function wizard or toolbar', '(c) Both (a) and (b)', '(d) Depends on the function'], answer: { answerKey: '(d) Depends on the function', schoolMethod: '(d) Depends on the function — some functions are simple enough to type directly, others need the wizard.' } },
          { id: 'q11', number: '11', isHard: false, text: 'A function should start with ______.', parts: ["(a) '=' sign", '(b) alphabets', '(c) numbers', '(d) All of these'], answer: { answerKey: "(a) '=' sign", schoolMethod: "(a) '=' sign — every function/formula in Calc starts with an equal sign." } },
          { id: 'q12', number: '12', isHard: false, text: 'Which of the following option is used to print a chart?', parts: ['(a) Insert → Chart', '(b) File → View', '(c) File → Print', '(d) View → Chart'], answer: { answerKey: '(a) Insert → Chart', schoolMethod: 'As per the answer key given in the source material, the correct answer is (a) Insert → Chart.' } },
          { id: 'q13', number: '13', isHard: false, text: 'How many axes does charts in Calc have?', parts: ['(a) Two', '(b) Three', '(c) Two or three', '(d) Four'], answer: { answerKey: '(a) Two', schoolMethod: '(a) Two — the X-axis and the Y-axis.' } },
          { id: 'q14', number: '14', isHard: false, text: 'The chart preview can be seen in ______.', parts: ['(a) Page preview', '(b) Chart preview', '(c) Export chart', '(d) All of these'], answer: { answerKey: '(d) All of these', schoolMethod: '(d) All of these options can show a chart preview.' } },
        ]
      },
      {
        id: 'ex4.fib', title: 'Fill in the Blanks',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: "The column immediately next to column 'Z' is ________.", answer: { answerKey: 'AA', schoolMethod: 'AA' } },
          { id: 'q2', number: '2', isHard: false, text: 'The default extension of a workbook created using a LibreOffice Calc spreadsheet is ________.', answer: { answerKey: '.ods', schoolMethod: '.ods' } },
          { id: 'q3', number: '3', isHard: false, text: 'The spreadsheet feature used to continue the series is called as ________.', answer: { answerKey: 'Fill handle', schoolMethod: 'Fill handle' } },
          { id: 'q4', number: '4', isHard: false, text: "The formula '=MIN(C1:C5)' stored in cell C6 when copied to cell D6 changes to ________.", answer: { answerKey: '=MIN(D1:D5)', schoolMethod: '=MIN(D1:D5)' } },
          { id: 'q5', number: '5', isHard: false, text: 'The formula in cell A2 is =B2+C3. On copying this formula to cell C2, C2 will change to ________.', answer: { answerKey: '=D2+E3', schoolMethod: '=D2+E3' } },
          { id: 'q6', number: '6', isHard: false, text: 'The cell address of the cell formed by the intersection of the ninth column and the eighth row will be ________.', answer: { answerKey: 'I8', schoolMethod: 'I8' } },
          { id: 'q7', number: '7', isHard: false, text: '$A1$B2 is an example of ________ referencing in spreadsheet software.', answer: { answerKey: 'mixed', schoolMethod: 'mixed' } },
          { id: 'q8', number: '8', isHard: false, text: 'Numbers entered into a cell are automatically ________ aligned.', answer: { answerKey: 'right', schoolMethod: 'right' } },
          { id: 'q9', number: '9', isHard: false, text: 'If A1:A5 contain the numbers 16, 10, 3, 25 and 6 then =Average(A1:A5;60) will display ________.', answer: { answerKey: '20', schoolMethod: '20' } },
          { id: 'q10', number: '10', isHard: false, text: 'In ________ referencing, the reference changes rows and columns automatically when it is copied to a new cell.', answer: { answerKey: 'Relative', schoolMethod: 'Relative' } },
        ]
      },
      {
        id: 'ex4.tf', title: 'True or False',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'A cell is a combination of row and column.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q2', number: '2', isHard: false, text: 'A spreadsheet is also called as worksheet.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q3', number: '3', isHard: false, text: "There are 'n' number of sheets in a spreadsheet.", answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q4', number: '4', isHard: false, text: 'In a spreadsheet, we can change the column width and row height.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q5', number: '5', isHard: false, text: '$A1$B2 is an example of mixed referencing.', answer: { answerKey: 'True', schoolMethod: 'True' } },
        ]
      },
      {
        id: 'ex4.solve', title: 'Solve the Following in a Spreadsheet',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Cell A1 contains the number 10 and B1 contains 5. What will be the contents of cell C1, if the formula =A1+B1*2^3 is entered in cell C1?', answer: { answerKey: '50', schoolMethod: 'Following BODMAS order: 2^3=8, B1*8=5*8=40, then A1+40 = 10+40 = 50. So cell C1 will show 50.' } },
          { id: 'q2', number: '2', isHard: false, text: 'The contents of Cell A1, B1, C1 and D1 are 5, –25, 30 and –35, respectively. What will be the value displayed in cell E1 which contains the formula =MIN(A1:D1).', answer: { answerKey: '–35', schoolMethod: 'MIN(A1:D1) finds the smallest value among 5, –25, 30 and –35. The smallest value is –35, so cell E1 will display –35.' } },
          { id: 'q3', number: '3', isHard: false, text: 'Cell D5 contains the formula =$B$5+C5 and this formula is copied to cell E5, what will be the copied formula in cell E5?', answer: { answerKey: '=$B$5+D5', schoolMethod: '=$B$5+D5 — the absolute reference $B$5 stays fixed, while the relative reference C5 changes to D5 as the column shifts by one.' } },
          { id: 'q4', number: '4', isHard: false, text: 'Cell D5 contains the formula =$B5 + C5 and this formula is copied to cell E5, what will be the copied formula in cell E5?', answer: { answerKey: '=$B5+D5', schoolMethod: '=$B5+D5 — the column part of $B5 (mixed reference) stays fixed at B, and the relative reference C5 changes to D5.' } },
          { id: 'q5', number: '5', isHard: false, text: 'Cell D5 contains the formula =$B5 + C$5 and this formula is copied to cell E6, what will be the copied formula in cell E6?', answer: { answerKey: '=$B6+D$5', schoolMethod: '=$B6+D$5 — in $B5 the column B is fixed but row changes to 6; in C$5 the row 5 is fixed but column changes to D.' } },
        ]
      },
      {
        id: 'ex4.sa', title: 'Short Answer Questions (50 words)',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'What do you call the document created in a spreadsheet application?', answer: { answerKey: 'A workbook, containing one or more worksheets.', schoolMethod: 'A document created in a spreadsheet application is called a workbook, which contains one or more worksheets (also called spreadsheets) made up of rows, columns and cells.' } },
          { id: 'q2', number: '2', isHard: false, text: 'What are the steps to create a new spreadsheet?', answer: { answerKey: 'Open Calc → File → New → Spreadsheet (or Ctrl+N).', schoolMethod: 'Open LibreOffice Calc → click File → New → Spreadsheet (or press Ctrl+N). A new blank worksheet named Sheet1 opens, ready for entering data.' } },
          { id: 'q3', number: '3', isHard: false, text: 'What is the difference between spreadsheet, worksheet and sheet?', answer: { answerKey: 'Spreadsheet = the whole file/workbook; worksheet/sheet = one page within it.', schoolMethod: 'A spreadsheet is the entire application/file (workbook); a worksheet (or sheet) is a single page of that workbook made up of rows and columns where data is entered.' } },
          { id: 'q4', number: '4', isHard: false, text: 'What is the default name of the worksheet? How can it be renamed?', answer: { answerKey: 'Sheet1, Sheet2 etc.; rename via double-click the tab, type new name, Enter.', schoolMethod: 'The default name is Sheet1, Sheet2, etc. To rename, double-click the sheet tab at the bottom, type the new name, and press Enter.' } },
          { id: 'q5', number: '5', isHard: false, text: 'Write the steps to insert and delete the worksheet in Calc.', answer: { answerKey: 'Insert: right-click tab → Insert Sheet → OK. Delete: right-click tab → Delete Sheet → Yes.', schoolMethod: 'Insert: Right-click the sheet tab → Insert Sheet → set position and name → OK. Delete: Right-click the sheet tab → Delete Sheet → confirm Yes.' } },
          { id: 'q6', number: '6', isHard: false, text: 'What is an active cell? How to delete the contents of an active cell?', answer: { answerKey: 'Currently selected cell (thick border); press Delete key to clear contents.', schoolMethod: 'An active cell is the currently selected cell, shown with a thick border, ready to accept data. To delete its contents, select the cell and press the Delete key.' } },
          { id: 'q7', number: '7', isHard: false, text: 'What is relative and absolute cell address in the spreadsheet?', answer: { answerKey: 'Relative (B2) changes when copied; absolute ($B$2) stays fixed.', schoolMethod: 'A relative address (e.g. B2) changes automatically when a formula is copied to another cell. An absolute address (e.g. $B$2) stays fixed and does not change on copying.' } },
          { id: 'q8', number: '8', isHard: false, text: 'Explain any two operations performed on data in a spreadsheet.', answer: { answerKey: 'Sorting arranges by order; Filtering shows only rows meeting criteria.', schoolMethod: 'Sorting arranges data in ascending or descending order based on a chosen column. Filtering displays only rows meeting specific criteria while hiding the rest of the data temporarily.' } },
          { id: 'q9', number: '9', isHard: false, text: 'How do formulae work in a spreadsheet?', answer: { answerKey: 'Start with "=", followed by references/values/operators; Calc auto-computes and updates.', schoolMethod: "A formula always begins with an '=' sign followed by cell references, values and operators. Calc computes the result automatically and updates it whenever the referenced cell values change." } },
          { id: 'q10', number: '10', isHard: false, text: 'Can you include more than one mathematical operators in a formula?', answer: { answerKey: 'Yes, following BODMAS order.', schoolMethod: 'Yes, a single formula can include multiple mathematical operators, such as =A1+B1*C1-D1/2, and Calc evaluates it following the standard BODMAS order of operations.' } },
          { id: 'q11', number: '11', isHard: false, text: 'How to make visible the desired toolbar in a spreadsheet?', answer: { answerKey: 'View menu → Toolbars → tick the required toolbar.', schoolMethod: 'Go to the View menu → Toolbars → click on the required toolbar name (e.g. Formatting, Drawing) to place a tick mark and display it on screen.' } },
          { id: 'q12', number: '12', isHard: false, text: 'Give the syntax and example of any three mathematical functions in spreadsheet.', answer: { answerKey: 'SUM, ROUND, ABS.', schoolMethod: '• SUM: =SUM(A1:A5) – adds values\n• ROUND: =ROUND(A1,2) – rounds to 2 decimals\n• ABS: =ABS(A1) – gives absolute value' } },
          { id: 'q13', number: '13', isHard: false, text: 'Give the syntax and example of any three statistical functions in spreadsheet.', answer: { answerKey: 'AVERAGE, MAX, MIN.', schoolMethod: '• AVERAGE: =AVERAGE(A1:A5) – mean value\n• MAX: =MAX(A1:A5) – largest value\n• MIN: =MIN(A1:A5) – smallest value' } },
          { id: 'q14', number: '14', isHard: false, text: 'Give the syntax and example of any three decision making functions in spreadsheet.', answer: { answerKey: 'IF, AND, OR.', schoolMethod: '• IF: =IF(A1>50,"Pass","Fail")\n• AND: =AND(A1>0,B1>0)\n• OR: =OR(A1>0,B1>0)' } },
          { id: 'q15', number: '15', isHard: false, text: 'Give the syntax and example of any three date and time functions in spreadsheet.', answer: { answerKey: 'TODAY, NOW, DATE.', schoolMethod: '• TODAY: =TODAY() – current date\n• NOW: =NOW() – current date and time\n• DATE: =DATE(2024,1,26) – builds a date value' } },
          { id: 'q16', number: '16', isHard: false, text: 'Give the syntax and example of any three logical functions in spreadsheet.', answer: { answerKey: 'NOT, AND, OR.', schoolMethod: '• NOT: =NOT(A1>10)\n• AND: =AND(A1>5,B1<20)\n• OR: =OR(A1="Yes",B1="Yes")' } },
          { id: 'q17', number: '17', isHard: false, text: 'Give the syntax and example of any three string functions in spreadsheet.', answer: { answerKey: 'UPPER, LOWER, LEN.', schoolMethod: '• UPPER: =UPPER(A1) – converts to capital letters\n• LOWER: =LOWER(A1) – converts to small letters\n• LEN: =LEN(A1) – counts number of characters' } },
          { id: 'q18', number: '18', isHard: false, text: 'Explain the advantages of drawing a chart in Calc.', answer: { answerKey: 'Charts show trends/comparisons visually, more presentable than raw numbers.', schoolMethod: 'Charts present numerical data visually, making trends, comparisons and patterns easier to understand at a glance than plain rows of numbers, and make reports more presentable.' } },
          { id: 'q19', number: '19', isHard: false, text: 'Explain in one line each the various types of charts.', answer: { answerKey: 'Bar (comparison), Pie (proportion), Line (trend), Area (volume of change).', schoolMethod: '• Bar chart – compares values using horizontal/vertical bars\n• Pie chart – shows proportion of a whole\n• Line chart – shows trend over time\n• Area chart – shows volume of change over time' } },
          { id: 'q20', number: '20', isHard: false, text: 'Write the steps to insert a chart in Calc.', answer: { answerKey: 'Select data → Insert → Chart → choose type → set range → Finish.', schoolMethod: 'Select the data range → click Insert menu → Chart → choose chart type in the wizard → set data range/series → add titles → click Finish to insert the chart.' } },
          { id: 'q21', number: '21', isHard: false, text: 'Name and explain any five components of a chart in a spreadsheet package.', answer: { answerKey: 'Chart title, X-axis, Y-axis, Legend, Data series.', schoolMethod: '• Chart title – name of the chart\n• X-axis – shows categories\n• Y-axis – shows values\n• Legend – identifies data series by colour\n• Data series – the actual plotted values' } },
        ]
      },
    ]
  },
  {
    id: 'ch05', number: 5,
    title: 'Digital Presentation',
    slug:  'digital-presentation',
    code:  '17925ch05',
    exercises: [
      {
        id: 'ex5.mcq', title: 'Multiple Choice Questions',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'Which of the following option is not available on Presentation Wizard?', parts: ['(a) Empty presentation', '(b) Form template', '(c) Open new presentation', '(d) Open existing presentation'], answer: { answerKey: '(b) Form template', schoolMethod: '(b) Form template is not an option available in the Presentation Wizard.' } },
          { id: 'q2', number: '2', isHard: false, text: 'Which of the following is not a part of main Impress window?', parts: ['(a) Slides pane', '(b) Workspace', '(c) Work pane', '(d) Task pane'], answer: { answerKey: '(c) Work pane', schoolMethod: '(c) Work pane is not a real part of the main Impress window — it is Workspace, not "Work pane".' } },
          { id: 'q3', number: '3', isHard: false, text: 'Which of the following is not a section of tasks pane?', parts: ['(a) Master pages', '(b) Layouts', '(c) Custom View', '(d) Custom animation'], answer: { answerKey: '(c) Custom View', schoolMethod: '(c) Custom View is not a section of the Tasks pane.' } },
          { id: 'q4', number: '4', isHard: false, text: 'Which view button listed below is not one of those available in the workspace?', parts: ['(a) Normal view', '(b) Outline view', '(c) Thumbnail view', '(d) Notes'], answer: { answerKey: '(c) Thumbnail view', schoolMethod: '(c) Thumbnail view is not one of the workspace view buttons.' } },
          { id: 'q5', number: '5', isHard: false, text: 'Which view is generally used for creating, formatting and designing slides?', parts: ['(a) Normal view', '(b) Outline view', '(c) Notes', '(d) Slide Sorter view'], answer: { answerKey: '(a) Normal view', schoolMethod: '(a) Normal view is used for creating, formatting and designing slides.' } },
          { id: 'q6', number: '6', isHard: false, text: 'The slide show can be exited at any time during the show by pressing which of the following keys?', parts: ['(a) Space bar', '(b) End key', '(c) Break key', '(d) Esc key'], answer: { answerKey: '(d) Esc key', schoolMethod: '(d) Esc key exits a slide show at any time.' } },
          { id: 'q7', number: '7', isHard: false, text: 'Which of the following features is used to create a new slide show with the current slides but presented in a different order?', parts: ['(a) Rehearsal', '(b) Custom Slide show', '(c) Slide Show Setup', '(d) Slide Show View'], answer: { answerKey: '(b) Custom Slide show', schoolMethod: '(b) Custom Slide show creates a new order/sequence using the existing slides.' } },
          { id: 'q8', number: '8', isHard: false, text: 'Which of the following feature is used to progress the slide show automatically while speaking on the topic?', parts: ['(a) Custom Animation', '(b) Rehearse Timing', '(c) Slide Transition', '(d) Either (a) or (b)'], answer: { answerKey: '(b) Rehearse Timing', schoolMethod: '(b) Rehearse Timing records timing so the slide show progresses automatically.' } },
        ]
      },
      {
        id: 'ex5.fib', title: 'Fill in the Blanks',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: '________ is used to maintain consistency in design and colour in the presentation.', answer: { answerKey: 'Master slide', schoolMethod: 'Master slide' } },
          { id: 'q2', number: '2', isHard: false, text: '________ view is used to view all the slides simultaneously.', answer: { answerKey: 'slide sorter', schoolMethod: 'slide sorter' } },
          { id: 'q3', number: '3', isHard: false, text: '________ is used to perform basic operations on the presentation.', answer: { answerKey: 'File Menu', schoolMethod: 'File Menu' } },
          { id: 'q4', number: '4', isHard: false, text: 'Master Page is used to modify the ________ of the slide.', answer: { answerKey: 'Base architecture', schoolMethod: 'Base architecture' } },
          { id: 'q5', number: '5', isHard: false, text: 'To create a new blank presentation, use the key combination ________.', answer: { answerKey: 'Ctrl + N', schoolMethod: 'Ctrl + N' } },
          { id: 'q6', number: '6', isHard: false, text: 'In every presentation, first slide should be ________.', answer: { answerKey: 'Title Slide', schoolMethod: 'Title Slide' } },
          { id: 'q7', number: '7', isHard: false, text: 'To save a presentation, we can use key combination ________.', answer: { answerKey: 'Ctrl + S', schoolMethod: 'Ctrl + S' } },
          { id: 'q8', number: '8', isHard: false, text: 'In LibreOffice Impress, by default the presentation is saved with ________ extension.', answer: { answerKey: '.odp', schoolMethod: '.odp' } },
          { id: 'q9', number: '9', isHard: false, text: 'The keyboard shortcut key for slide show is ________.', answer: { answerKey: 'F5', schoolMethod: 'F5' } },
          { id: 'q10', number: '10', isHard: false, text: 'The short cut key to close the LibreOffice impress is ________.', answer: { answerKey: 'CTRL + W', schoolMethod: 'CTRL + W' } },
          { id: 'q11', number: '11', isHard: false, text: 'The short cut key to insert a new slide is ________.', answer: { answerKey: 'Ctrl + M', schoolMethod: 'Ctrl + M' } },
          { id: 'q12', number: '12', isHard: false, text: 'The ________ view is used to apply animation on the content of slide.', answer: { answerKey: 'Normal View', schoolMethod: 'Normal View' } },
          { id: 'q13', number: '13', isHard: false, text: 'A paper copy of presentation given to the audience is known as ________.', answer: { answerKey: 'Handouts', schoolMethod: 'Handouts' } },
          { id: 'q14', number: '14', isHard: false, text: 'To play a sound during transitions, select a sound from the ________ list.', answer: { answerKey: 'Sound', schoolMethod: 'Sound' } },
          { id: 'q15', number: '15', isHard: false, text: 'To play the sound repeatedly, the ________ is used.', answer: { answerKey: 'loop until next sound', schoolMethod: 'loop until next sound' } },
        ]
      },
      {
        id: 'ex5.tf', title: 'True or False',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'The order of the slides cannot be changed in slides pane.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q2', number: '2', isHard: false, text: 'Slide design or layout can be changed for multiple slides simultaneously.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q3', number: '3', isHard: false, text: 'Every slide in a presentation has exactly one slide master.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q4', number: '4', isHard: false, text: 'Animations once applied can be changed but cannot be removed.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q5', number: '5', isHard: false, text: 'Slide names are included in outline view.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q6', number: '6', isHard: false, text: 'The notes added to slides can be seen during the presentation.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q7', number: '7', isHard: false, text: 'A presentation can have multiple slide masters.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q8', number: '8', isHard: false, text: 'A user can create his/her own slide master.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q9', number: '9', isHard: false, text: 'Once a pre-defined slide master is selected, the background of slide cannot be changed.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q10', number: '10', isHard: false, text: 'The text added to the header is displayed on the first slide only.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q11', number: '11', isHard: false, text: 'The text added to the footer is displayed on the last slide only.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q12', number: '12', isHard: false, text: 'User can create his/her own template and use it in the Presentation Wizard.', answer: { answerKey: 'True', schoolMethod: 'True' } },
          { id: 'q13', number: '13', isHard: false, text: 'The Notes View is used for the audience.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q14', number: '14', isHard: false, text: 'It is not possible to insert audio or video clips in the presentation.', answer: { answerKey: 'False', schoolMethod: 'False' } },
          { id: 'q15', number: '15', isHard: false, text: 'Header and footer can be inserted in the presentation.', answer: { answerKey: 'True', schoolMethod: 'True' } },
        ]
      },
      {
        id: 'ex5.sa', title: 'Short Answer Questions (50 words)',
        questions: [
          { id: 'q1', number: '1', isHard: false, text: 'List the possible multimedia contents that are included while creating a presentation.', answer: { answerKey: 'Text, images, audio/video, charts/tables, animations/transitions.', schoolMethod: '• Text\n• Images/pictures\n• Audio/sound clips\n• Video clips\n• Charts and tables\n• Animations and transitions' } },
          { id: 'q2', number: '2', isHard: false, text: 'List the important points to be considered while making an effective presentation.', answer: { answerKey: 'Simple slides, consistent fonts/colours, limited text, relevant visuals, readable size, rehearse timing.', schoolMethod: '• Keep slides simple and uncluttered\n• Use consistent fonts and colours\n• Limit text; use bullet points\n• Use relevant images/charts\n• Maintain readable font size\n• Rehearse timing before presenting' } },
          { id: 'q3', number: '3', isHard: false, text: 'What are the advantages of using a presentation?', answer: { answerKey: 'Organises info visually, simplifies complex ideas, engages audience, reusable/editable/shareable.', schoolMethod: 'Presentations organise information visually, make complex ideas easier to understand, engage the audience with multimedia, and can be reused, edited and shared conveniently for different audiences.' } },
          { id: 'q4', number: '4', isHard: false, text: 'What objects can be inserted to slides in Impress?', answer: { answerKey: 'Text boxes, images, tables, charts, audio/video, shapes/diagrams.', schoolMethod: '• Text boxes\n• Pictures/images\n• Tables\n• Charts\n• Audio and video clips\n• Shapes and diagrams' } },
          { id: 'q5', number: '5', isHard: false, text: 'What are the steps to add picture or object to the slide?', answer: { answerKey: 'Insert → Image/Object → browse & select → Open/Insert.', schoolMethod: 'Select the slide → click Insert menu → Image (or Object) → browse and select the required file → click Open/Insert to place it on the slide.' } },
          { id: 'q6', number: '6', isHard: false, text: 'How can text be added to header or footer on the slides?', answer: { answerKey: 'Insert → Header and Footer → tick checkbox → type text → Apply/Apply to All.', schoolMethod: "Click Insert menu → Header and Footer → tick the Footer/Header checkbox → type the required text → click 'Apply to All' or 'Apply' for the current slide." } },
          { id: 'q7', number: '7', isHard: false, text: 'Describe the use of fields available in header and footer.', answer: { answerKey: 'Date/time, slide number, footer text — auto-update across all slides.', schoolMethod: 'Fields like Date and time, Slide number, and Footer text can be inserted automatically; they update on their own and appear consistently across all slides of the presentation.' } },
          { id: 'q8', number: '8', isHard: false, text: 'Write the steps to create a template.', answer: { answerKey: 'Design presentation → File → Templates → Save as Template → name → Save.', schoolMethod: 'Design a presentation with the desired background, fonts and layout → click File → Templates → Save as Template → give it a name → click Save.' } },
          { id: 'q9', number: '9', isHard: false, text: 'Write down the steps to add slide transition in your presentation.', answer: { answerKey: 'Slide menu → Slide Transition → choose effect/speed/sound → Apply to All Slides.', schoolMethod: "Select the slide → click Slide menu → Slide Transition → choose a transition effect and speed → set sound if needed → click 'Apply to All Slides'." } },
          { id: 'q10', number: '10', isHard: false, text: 'How will you add the slide number at the bottom of each slide?', answer: { answerKey: "Insert → Header and Footer → tick 'Slide number' → Apply to All.", schoolMethod: "Click Insert menu → Header and Footer → tick 'Slide number' checkbox → click 'Apply to All' so the slide number appears at the bottom of every slide." } },
          { id: 'q11', number: '11', isHard: false, text: "How will you insert a company's logo (picture) in first slide of your presentation?", answer: { answerKey: 'First slide → Insert → Image → select logo → Open → resize/position.', schoolMethod: 'Open the first slide → click Insert menu → Image → browse and select the logo file → click Open → resize and position the logo as required.' } },
          { id: 'q12', number: '12', isHard: false, text: 'How will you add the name of the company on the top of each slide?', answer: { answerKey: 'Add a text box on the Slide Master with the company name.', schoolMethod: 'Insert a text box on the Slide Master, type the company name, position it at the top → close Master View; the name then appears on top of every slide.' } },
          { id: 'q13', number: '13', isHard: false, text: 'Write down the steps to create a table in a presentation.', answer: { answerKey: 'Insert → Table → set rows/columns → OK → type data.', schoolMethod: 'Select the slide → click Insert menu → Table → enter the required number of rows and columns → click OK → type data into the table cells.' } },
          { id: 'q14', number: '14', isHard: false, text: 'Write down the steps to insert a chart in slide.', answer: { answerKey: 'Insert → Chart → edit sample data → choose type → click outside to finish.', schoolMethod: 'Select the slide → click Insert menu → Chart → a default chart with sample data appears → edit the data table → choose chart type → click outside to finish.' } },
          { id: 'q15', number: '15', isHard: false, text: 'What are the five views of presentation?', answer: { answerKey: 'Normal, Outline, Notes, Slide Sorter, Handout.', schoolMethod: '• Normal view\n• Outline view\n• Notes view\n• Slide Sorter view\n• Handout view' } },
        ]
      },
    ]
  },
];
