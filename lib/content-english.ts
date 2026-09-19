export interface EnglishQuestion {
  id:     string;
  number: string;
  text:   string;
  parts?: string[];
  answer: string;
}

export interface EnglishSection {
  id:       string;
  title:    string;
  type:     'listening' | 'reading' | 'writing' | 'grammar' | 'speaking' | 'vocabulary' | 'poem';
  questions: EnglishQuestion[];
}

/** One of the two independently-routable pieces inside a chapter (a story/play and a poem). */
export interface EnglishContent {
  id:       string;   // 'a' | 'b'
  kind:     'reading' | 'poem';
  title:    string;
  slug:     string;
  sections: EnglishSection[];
}

export interface EnglishChapter {
  id:       string;
  number:   number;
  code:     string;               // e.g. '0903ch01' — shared by BOTH contents in this chapter
  contents: [EnglishContent, EnglishContent];
}

// ── ENGLISH BOOK CONTEXT FOR GROQ ──────────────────────────────────────────
export const ENGLISH_BOOK_CONTEXT = `
KAVERI — Grade 9 English (NCERT 2026 Revised Syllabus)

UNIT 1: How I Taught My Grandmother to Read + Bharat Our Land (poem)
Theme: Digital literacy, elderly education, perseverance, intergenerational learning
Story: A grandmother learns to read Kannada at old age to follow a serialised novel
Poem: Bharat Our Land — patriotic poem about India's rivers, mountains, and heritage

UNIT 2: The Pot Maker + Gifts of Grace: Honouring Our Vocations (poem)
Theme: Traditional crafts, perseverance, cultural heritage, pottery, learning from elders
Story: Sentila watches her mother Arenla and learns the art of pot-making with Onula's help
Poem: Gifts of Grace — honouring vocations like farming, pottery, masonry, cooking

UNIT 3: Winds of Change + Canvas of Soil (poem)
Theme: Traditional hand-fan (pankha) craft revival, cultural heritage, commercialisation
Story: About regional pankha-making traditions across India and their transformation into commerce
Poem: Canvas of Soil — a garden compared to a painting, celebrating gardeners as artists

UNIT 4: Vitamin-M + I Cannot Remember My Mother (poem, Rabindranath Tagore)
Theme: Meditation, elderly care, memory, generational wisdom, family bonds
Story: Ravi's grandfather moves to the city; a day of mischief reveals his sharp wit and memory
Poem: I Cannot Remember My Mother — Tagore's poem on sensory memories of a lost mother

UNIT 5: The World of Limitless Possibilities + Nine Gold Medals (poem)
Theme: Disability, inclusion, achievement, Dr. Deepa Malik, Paralympic champion
Interview: Dr. Deepa Malik — India's first Paralympic medallist, overcoming paralysis
Poem: Nine Gold Medals — Special Olympics runners stop to help a fallen competitor

UNIT 6: Twin Melodies + A Friend Found in Music (poem)
Theme: Music, cultural harmony, classical vs. contemporary, generational conflict
Play: Shruti must choose between classical Hindustani music and modern fusion; her father Nabin eventually accepts both can coexist
Poem: A Friend Found in Music — music as a lifelong, comforting companion

UNIT 7: Carrier of Words + Words (poem)
Theme: India Post, rural postal service, letter writing, communication, Khetaram (GDS postman)
Story: Khetaram, a Gramin Dak Sewak in the Rajasthan desert, carries letters and hope across remote villages
Poem: Words — the contrast between empty, showy words and few sincere ones

UNIT 8: Follow That Dream + Believe in Yourself (poem)
Theme: Ambition, perseverance, following one's dream, vocational education
Story: Ming's ambition and her mother's honest advice on the sacrifices dreams require
Poem: Believe in Yourself — self-belief and taking the first step toward change

GRAMMAR TOPICS (across all units):
- Tenses: Simple, Continuous, Perfect
- Parts of speech, prepositions, phrasal verbs
- Reported speech, direct/indirect speech
- Modal verbs, conditionals, determiners
- Noun clauses, relative clauses
- Word meanings, idioms, collocations, vocabulary in context
`;

// ── CHAPTER DATA ────────────────────────────────────────────────────────────
export const ENGLISH_CHAPTERS: EnglishChapter[] = [
  {
    id: 'ch01', number: 1, code: '0903ch01',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'How I Taught My Grandmother to Read',
        slug:  'how-i-taught-my-grandmother-to-read',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Why is it important to learn how to read and write?', answer: 'Reading and writing are important because they help in communication, give access to knowledge, provide independence, build confidence, and open opportunities.' },
              { id: 'q2', number: '2', text: 'Which language(s) do your grandparents or elderly relatives speak?', answer: "They speak Kannada (replace with your family's language if different)." },
              { id: 'q3', number: '3', text: 'How do they spend their time? How do you spend time with them?', answer: 'They spend time in prayer, storytelling, and household work. I spend time listening to their stories and playing games with them.' },
              { id: 'q4', number: '4', text: 'What is your favourite experience with them?', answer: 'My favourite experience is listening to their childhood stories.' },
              { id: 'q5', number: '5', text: 'What is something that the elderly in your family cannot do easily but enjoy watching you do?', answer: 'They cannot use a smartphone easily but enjoy watching me use it.' },
            ]
          },
          {
            id: 's2', title: 'Vocabulary Exercise', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Match the highlighted words with their meanings.', answer: '1. excitedly → eagerly\n2. believable → convincing\n3. people living in one particular area → community\n4. discussion → debate\n5. a part of a story → episode\n6. focus → concentration\n7. main character → protagonist\n8. directed → guided' },
            ]
          },
          {
            id: 's3', title: 'Reading for Meaning', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Complete the cause and effect table.', answer: "1. Cause: The transport system was not very good in those days → Effect: The morning papers arrived late in the day and weekly magazines came one day late.\n2. Cause: The grandmother, Krishtakka, never went to school → Effect: She could not read.\n3. Cause: She identified herself with the story's protagonist and listened with great concentration → Effect: She was deeply interested in the story and discussed it with her friends.\n4. Cause: The narrator went to a wedding for a week → Effect: The grandmother could not get the latest episode read to her, so she was in tears when the narrator returned.\n5. Cause: People did not consider education essential for girls in those days → Effect: The grandmother never went to school.\n6. Cause: The grandmother regretted not going to school → Effect: She made sure that her children and grandchildren studied well." },
              { id: 'q2', number: '2', text: 'Did the narrator expect to see her grandmother in tears? Why/Why not?', answer: 'No, because she had never seen her cry even in difficult situations.' },
              { id: 'q3', number: '3', text: "How might the narrator help her grandmother to fulfil her desire to learn?", answer: 'By teaching her the Kannada alphabet patiently and reading stories with her.' },
            ]
          },
          {
            id: 's4', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'The grandmother wanted to learn the Kannada alphabet to gain independence. (True/False)', answer: 'True' },
              { id: 'q2', number: '2', text: 'The grandmother asked someone in the village to read Kashi Yatre to her while the narrator was away. (True/False)', answer: 'False' },
              { id: 'q3', number: '3', text: "The narrator was the grandmother's first teacher and taught her how to read Kannada. (True/False)", answer: 'True' },
              { id: 'q4', number: '4', text: 'The grandmother believed that there was no age limit for learning. (True/False)', answer: 'True' },
              { id: 'q5', number: '5', text: "The grandmother touched the narrator's feet as a mark of respect for her as a teacher. (True/False)", answer: 'True' },
              { id: 'q6', number: '6', text: 'The narrator was disappointed with the progress her grandmother made in learning to read. (True/False)', answer: 'False' },
            ]
          },
          {
            id: 's5', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "The phrase 'never seen her cry in the most difficult situations' tells us that the grandmother was ...", answer: 'Strong-willed' },
              { id: 'q2', number: '(ii)', text: 'Grandmother did not reply because she might have been too ...', answer: 'Emotional' },
              { id: 'q3', number: '(iii)', text: 'Identify the clue that indicates a rural setting.', answer: '"Sleeping in the open terrace ... summer night ... full moon."' },
              { id: 'q4', number: '(iv)', text: 'Which lines establish a tender atmosphere?', answer: '"Her affectionate hands touched my forehead."' },
              { id: 'q5', number: '(v)', text: 'Which aspect is NOT emphasised?', answer: "Grandmother's regret over her lack of education." },
            ]
          },
          {
            id: 's6', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "What does the grandmother's statement 'I want to be independent' reveal?", answer: 'She desires self-sufficiency.' },
              { id: 'q2', number: '(ii)', text: "The grandmother's determination shows that learning has no ...", answer: 'Age limit.' },
              { id: 'q3', number: '(iii)', text: "Why does the narrator laugh at her grandmother's decision?", answer: 'Because she assumed sixty-two was too old to learn.' },
              { id: 'q4', number: '(iv)', text: 'List any two qualities displayed by the grandmother. (30–40 words)', answer: 'The grandmother displayed determination and patience. Despite her age, she worked tirelessly to learn the Kannada alphabet. Her perseverance and calm acceptance of challenges showed her strong will and eagerness to achieve independence through education.' },
              { id: 'q5', number: '(v)', text: 'How can we say that the narrator is making assumptions about her grandmother? (30–40 words)', answer: 'The narrator assumed that age, grey hair, and physical limitations would prevent her grandmother from learning. These assumptions overlooked her inner strength and resolve, proving that the narrator judged her abilities based only on outward appearance.' },
            ]
          },
          {
            id: 's7', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Why do you think the grandmother felt embarrassed to ask someone else to read to her while the narrator was away?', answer: 'The grandmother felt embarrassed because she did not want others to know her weakness. Depending on others for reading made her feel helpless, so she waited eagerly for her granddaughter to return and read the story aloud.' },
              { id: 'q2', number: '2', text: "Why does the narrator initially laugh at her grandmother's determination to learn at the age of sixty-two?", answer: "The narrator laughed because she thought learning at sixty-two was unrealistic. She assumed her grandmother's age, grey hair, and household responsibilities made education impossible, not realising that determination can overcome such barriers." },
              { id: 'q3', number: '3', text: "What significance does the story of Kashi Yatre have in both the grandmother's life and the story?", answer: "Kashi Yatre symbolised sacrifice and devotion. The grandmother identified with the protagonist's struggles and selflessness, which inspired her desire to read independently. The story became a turning point, motivating her to pursue literacy despite her age." },
              { id: 'q4', number: '4', text: "What does the grandmother's desire to learn the Kannada alphabet reflect about her?", answer: 'Her desire reflects her longing for independence and dignity. She wanted to overcome her dependence on others and prove that learning has no age limit. It shows her courage, self-respect, and belief in the power of education.' },
              { id: 'q5', number: '5', text: "What lessons can we infer from the grandmother's action of touching the narrator's feet?", answer: "By touching her granddaughter's feet, the grandmother showed respect for the role of a teacher, regardless of age. This teaches us humility, reverence for knowledge, and the importance of valuing education above social conventions." },
              { id: 'q6', number: '6', text: "What does the line 'For a good cause if you are determined, you can overcome any obstacle' tell us about the broader theme of the story?", answer: 'The line highlights that determination and perseverance can break barriers of age, tradition, or circumstance. It reflects the broader theme that education and self-belief empower individuals to achieve independence and dignity in life.' },
              { id: 'q7', number: '7', text: 'How effectively does the story highlight the value of education in supporting personal independence?', answer: "The story shows education as a tool for freedom and self-reliance. The grandmother's journey proves that literacy empowers individuals to live with confidence, dignity, and independence, making education essential for personal growth at any age." },
            ]
          },
          {
            id: 's8', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Binomials — match with their meanings and use in sentences.', answer: "sink or swim → succeed or fail without help — Life is full of challenges; you must sink or swim.\non and off → sometimes, occasionally — It rained on and off all day.\nmix and match → put different things together — She likes to mix and match her clothes.\nall or nothing → something done completely or not at all — Success is all or nothing in competitive exams.\npart and parcel → complete part of or belong to — Hard work is part and parcel of success.\npick and choose → choose only the best\nsooner or later → at sometime in the future\nleaps and bounds → increase or develop quickly" },
              { id: 'q2', number: '2', text: 'Prefixes — form the opposite word.', answer: 'popular → unpopular\nbelief → disbelief\nimportant → unimportant\nrespect → disrespect\ncorrect → incorrect\ncontinue → discontinue\nunderstand → misunderstand\nordinary → extraordinary\ninteresting → uninteresting\npossible → impossible' },
              { id: 'q3', number: '3', text: 'Idioms — match with their meanings.', answer: "hit the books → study seriously\ndraw a blank → unable to remember\nlearn the ropes → understand how to do something\nrack one's brain → think very hard\nlearn by heart → memorise\nburn the midnight oil → study late at night" },
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: "India has 22 major languages according to the Eighth Schedule. Complete the family-words table with words from any five Indian languages.", answer: "Example (Kannada): Grandmother – Avva, Grandfather – Ajja, Mother – Amma, Father – Appa, Sister – Akka, Brother – Anna. Substitute real words from any five languages and discuss similarities." },
            ]
          },
          {
            id: 's10', title: 'Listen and Respond (Digital Literacy)', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'Literacy these days includes the ability to use _______.', answer: 'digital tools (effectively and responsibly)' },
              { id: 'q2', number: '2', text: 'Digital literacy is also about protecting _______.', answer: 'personal data' },
              { id: 'q3', number: '3', text: 'Digital literacy enables the elderly to _______.', answer: 'stay connected' },
              { id: 'q4', number: '4', text: 'Digital literacy encourages using the internet safely by helping us recognise _______ and _______.', answer: 'misinformation; scams (and cyber threats)' },
              { id: 'q5', number: '5', text: 'The National Digital Literacy Mission helps people across the country by imparting _______.', answer: 'IT training' },
            ]
          },
          {
            id: 's11', title: 'Speaking Activity — Turncoat Debate', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: "Topic 1: It is important to learn a new language apart from your mother tongue. Speak 'for' and 'against'.", answer: "For: learning another language broadens opportunity, connects cultures, improves career prospects. Against: your mother tongue preserves identity and family bonds; not everyone needs a second language." },
              { id: 'q2', number: '2', text: 'Topic 2: Learning can happen only when you are young. Speak for and against.', answer: "For: young minds grasp languages and skills quickly with flexible memory. Against: adults learn through experience and motivation; age is never a barrier to education." },
            ]
          },
          { id: 's12', title: 'Vocabulary and Structures in Context (V-i): Tenses', type: 'grammar',
            questions: [
              { id: 'q1', number: 'A', text: 'When the delegates _______ (arrive) at the conference, the keynote speaker _______ (already begin) the session.', answer: 'arrived; had already begun' },
              { id: 'q2', number: 'B', text: 'After the students _______ (learn) how to identify fake news online, they _______ (start) verifying information before sharing it.', answer: 'had learnt / had learned; started' },
              { id: 'q3', number: 'C', text: 'Before Kiran _______ (start) using digital payment platforms, she _______ (ensure) her understanding of online fraud prevention.', answer: 'started; had ensured' },
              { id: 'q4', number: 'D', text: 'By the time Varun _______ (recognise) the importance of budgeting, he _______ (exhaust) most of his savings.', answer: 'recognised; had exhausted' },
              { id: 'q5', number: 'E', text: 'When Raghu _______ (log in) to the cybersecurity webinar, the instructor _______ (already discuss) the importance of strong passwords.', answer: 'logged in; had already discussed' },
            ]
          },
          { id: 's13', title: 'Vocabulary and Structures in Context (V-ii): Tenses', type: 'grammar',
            questions: [
              { id: 'q1', number: 'A–C', text: 'Last year, my parents and I _______ (take) a financial planning course. When we _______ (review) our expenses, we realised we _______ (spend) too much.', answer: 'A. took; B. reviewed; C. had spent' },
              { id: 'q2', number: 'D–E', text: 'After my parents _______ (discuss) ways to save, I _______ (open) a savings account.', answer: 'D. discussed; E. opened' },
              { id: 'q3', number: 'F–G', text: "By the time we _______ (set) our budget, the course _______ (already introduce) investment strategies.", answer: 'F. set; G. had already introduced' },
              { id: 'q4', number: 'H–I', text: 'We _______ (hurry) to take notes, but many participants _______ (complete) their financial plans.', answer: 'H. hurried; I. had completed' },
              { id: 'q5', number: 'J', text: 'Despite that, we _______ (enjoy) learning how to manage money wisely.', answer: 'J. enjoyed' },
            ]
          },
          { id: 's14', title: 'Writing Task — Letter to the Editor', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Write a letter to the Editor of a local newspaper emphasising the importance of student participation in adult literacy camps. Discuss benefits and suggest ways to spread awareness.', answer: "Dear Editor, Students can powerfully promote adult literacy. Camps empower adults, build students' leadership and empathy, and create an educated community. Schools should partner with NGOs, run awareness drives, offer volunteer credits, and organise flexible sessions to encourage more students to join this noble cause. Yours truly, A Concerned Student." },
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Bharat Our Land',
        slug:  'bharat-our-land',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Recall the lines of the National Anthem and complete the table with states, mountain ranges, and rivers mentioned.', answer: 'States/Provinces → Punjab, Sindh, Gujarat, Maratha, Dravida, Utkala, Bengal\nMountain Ranges → Vindhya, Himachal\nRivers → Ganga, Yamuna' },
              { id: 'q2', number: '2', text: "What do the words 'Jaya he' in the last two lines of the National Anthem convey?", answer: "They convey victory, praise, and celebration of India's greatness, expressing respect and admiration for the motherland." },
              { id: 'q3', number: '3', text: 'Choose the odd one out for the underlined words.', answer: 'Peerless → Odd: valuable (others mean incomparable/unmatched)\nSanctified → Odd: applauded (others mean blessed/purified)\nAuspicious → Odd: fantastic (others mean fortunate/favourable)\nHoary antiquity → Odd: recent past (others mean ancient/time immemorial)' },
            ]
          },
          {
            id: 's2', title: 'Reading for Appreciation', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Fill in the blanks to complete the summary.', answer: "The poem celebrates India's natural beauty, spiritual heritage, and historical greatness. The poet praises the Himavant, describing it as mighty and unparalleled. The Ganga is depicted as generous and graceful, while the Upanishads are honoured as sacred and unmatched. The poem highlights the contributions of warriors and sages who enriched the land with bravery and wisdom. It acknowledges the presence of Brahma-knowledge and the teachings of Buddha, highlighting India's deep-rooted traditions. The poet asserts India is peerless, urging everyone to praise her." },
              { id: 'q2', number: '2', text: 'Complete the features about the poem (mood, tone, rhyme scheme, personification).', answer: 'Impact on readers (mood): Inspires pride and admiration.\nPoet\'s attitude (tone): Reverent and celebratory.\nRhyme scheme: Free verse with repetition.\nExamples of personification: "The generous Ganga," "This sunny golden land."' },
              { id: 'q3', number: '3', text: "What is the impact of the refrain 'she's peerless, let's praise her!'?", answer: "It reinforces admiration and pride, reminding readers repeatedly of India's uniqueness and greatness." },
              { id: 'q4', number: '4', text: "India is metaphorically described as 'this sunny golden land,' suggesting that it is ...", answer: 'Rich, prosperous, and full of warmth and glory.' },
              { id: 'q5', number: '5', text: 'Match the symbols in the poem with what they represent.', answer: 'Himavant → strength and permanence\nGanga → purity and generosity\nUpanishads → spiritual and philosophical legacy\nGallant warriors and sages → courage and wisdom\nBrahma-knowledge and Buddha\'s Dhamma → knowledge and enlightenment\nSunny golden land → richness and glory' },
              { id: 'q6', number: '6', text: 'Give two examples of imagery.', answer: '"The mighty Himavant is ours" (visual imagery of mountains); "The generous Ganga is ours" (imagery of flowing river grace).' },
              { id: 'q7', number: '7', text: 'What is the impact of hyphens in the first stanza?', answer: "They create deliberate pauses, add lyrical rhythm, and emphasise India's greatness by presenting qualities before the hyphen and strong assertions after." },
              { id: 'q8', number: '8', text: 'Identify examples of hyperbole.', answer: '"There\'s no equal anywhere on earth" and "She\'s peerless" are exaggerations used to highlight India\'s unmatched greatness.' },
              { id: 'q9', number: '9', text: 'Identify examples that show the poem is an ode.', answer: 'Lines praising Himavant, Ganga, Upanishads, and repeated refrain "She\'s peerless, let\'s praise her!" show admiration in elevated style.' },
              { id: 'q10', number: '10', text: 'Identify allusions in the poem.', answer: "Upanishads → allusion to ancient scriptures symbolising wisdom.\nBrahma-knowledge → allusion to spiritual knowledge and ultimate truth.\nBuddha's Dhamma → allusion to Gautama Buddha's teachings of compassion and enlightenment." },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: "The word 'mighty' refers to the ... of the Himavant.", answer: 'Strength and grandeur.' },
              { id: 'q2', number: '2', text: 'The question mark at the end of lines is used to ...', answer: 'Emphasise a point.' },
              { id: 'q3', number: '3', text: 'Why is the Ganga described as generous?', answer: 'Because it provides water, fertility, and sustains millions of lives selflessly.' },
              { id: 'q4', number: '4', text: "Why is the river's movement described as graceful?", answer: 'Its flowing nature is calm, smooth, and life-giving, symbolising beauty and dignity.' },
              { id: 'q5', number: '5', text: 'The poet implies the Upanishads are ... in their wisdom.', answer: 'Unmatched.' },
            ]
          },
          {
            id: 's4', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'How does the poem reflect a strong connection to cultural identity and heritage?', answer: "The poem highlights India's mountains, rivers, scriptures, sages, and warriors, showing pride in natural and spiritual heritage. It reflects cultural identity by celebrating traditions and values that define India's greatness across ages." },
              { id: 'q2', number: '2', text: "What can you infer about the poet's attitude from the phrase 'she's peerless, let's praise her!'?", answer: "The poet's attitude is reverent and patriotic. He sees India as unique and unmatched, urging readers to admire and honour her. The repetition shows deep pride and emotional attachment to the motherland." },
              { id: 'q3', number: '3', text: "What does the line 'many a sage has sanctified this land' suggest about India's spiritual heritage?", answer: "It suggests India has been blessed by saints and sages whose wisdom and teachings enriched the land. Their presence sanctified India, making it a centre of spirituality, philosophy, and moral guidance for generations." },
              { id: 'q4', number: '4', text: "How does the poet connect warriors and music to India's greatness?", answer: "The poet mentions gallant warriors who defended the land and divine music that flourished here. Together, they symbolise courage and cultural richness, showing India's greatness lies in both bravery and artistic achievements." },
              { id: 'q5', number: '5', text: 'How does this poem foster a sense of national pride?', answer: "By praising India's natural beauty, spiritual depth, and historical achievements, the poem instils pride. It reminds readers of their heritage, encouraging admiration and respect for the motherland's unique qualities and timeless greatness." },
            ]
          },
          {
            id: 's5', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Complete the table with suffixes and their meanings.', answer: '-ous → full of → generous\n-ity → state of being old → antiquity\n-est → superlative form → divinest\n-less → without something → peerless' },
              { id: 'q2', number: '2', text: 'Add different suffixes and make sentences.', answer: '-ive → active → She is very active in class.\n-ment → achievement → His achievement was celebrated by all.\n-ed → sanctified → The land was sanctified by sages.' },
            ]
          },
          {
            id: 's6', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Search for poems or songs dedicated to India in your regional language. Share them with your classmates and explain their meaning.', answer: 'Model answer: e.g., Vande Mataram or a folk song praising the land, rivers and freedom fighters. Explain its theme, key images and the pride it expresses.' },
              { id: 'q2', number: 'II', text: 'Prepare an interdisciplinary project on India’s major geographical features: describe each region, its importance, and languages spoken. Include mountains, rivers, deserts, valleys, islands and plateaus.', answer: 'Model answer: Himalayas–northern border, rivers like Ganga nourish plains; desert–Rajasthan; valleys–Kashmir; islands–Andaman & Lakshadweep; plateau–Deccan. Note languages: e.g., Hindi in north, Tamil in south, Bengali in east, Marathi in west.' }
            ]
          },
          {
            id: 's7', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'You will listen to four people talk about the places they like to travel to. Write the speaker number for the two pictures given.', answer: 'Picture 1 (a traveller filming amid green/forest terrain) → Speaker 4 (the travel vlogger who loves forests). Picture 2 (a person climbing a rocky mountain slope) → Speaker 2 (the adventure-seeker who loves mountains).' },
              { id: 'q2', number: 'II', text: 'Listen again and match the given statements to the speakers. (Two statements are not needed.)', answer: '1. The green surroundings look beautiful visually → Speaker 4.\n3. The quietness of the environment here leads to a peaceful experience → Speaker 1.\n4. The risk and thrill in such an area is what is most appealing → Speaker 2.\n6. The sight of such beauty is very inviting and has to be captured → Speaker 3.\n(Statements 2 and 5 are not needed.)' }
            ]
          },
          {
            id: 's8', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'In pairs, speak about the aspects of your village/town/city that you feel are an asset — geographical, cultural, traditional, or historical. (Use given cues.)', answer: 'Model answer: My town\'s asset is its riverfront and old temple. The river supports farming, while the temple preserves our cultural traditions and history, attracting visitors and uniting the community.' }
            ]
          },
          {
            id: 's9', title: 'Writing Task', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: 'Write a paragraph about a place you have visited that has stayed in your memory. (Include reasons, companions, preparation, stay, activities.)', answer: 'I visited Shimla with my family last summer. We prepared by packing warm clothes and booked a hotel on the Mall Road. We enjoyed long walks, toy-train rides and the snowy peaks. The cool breeze and the laughter shared with my cousins made it unforgettable.' }
            ]
          },
        ]
      },
    ]
  },

  {
    id: 'ch02', number: 2, code: '0903ch02',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'The Pot Maker',
        slug:  'the-pot-maker',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Identify vocations and list five more.', answer: 'Pottery, weaving, farming, carpentry. Five more: teaching, medicine, blacksmithing, tailoring, fishing.' },
              { id: 'q2', number: '2', text: 'What is common among these pictures?', answer: 'All show skill-based manual work requiring craftsmanship.' },
              { id: 'q3', number: '3', text: 'We refer to such skill-based work as ...', answer: 'Vocations.' },
              { id: 'q4', number: '4', text: 'Differences between handmade and machine-made products.', answer: 'Handmade products are unique, time-consuming, and culturally valuable; machine-made are uniform, faster, and cheaper.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding (Part I)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Is pot making easy? (30–40 words)', answer: 'No, pot making is difficult. Clay must be collected from far away, pounded, shaped carefully, and fired correctly. A small mistake can ruin the batch, making it a tiring and demanding process with little financial reward.' },
              { id: 'q2', number: '2', text: 'Would Sentila fulfil her dream? (30–40 words)', answer: "Yes, Sentila eventually fulfils her dream. Though she struggles initially, with guidance from Onula and perseverance she learns the art. She finally produces pots equal in quality to her mother's, proving her determination and skill." },
              { id: 'q3', number: '3', text: 'Would Mesoba and Arenla support Sentila? (30–40 words)', answer: 'Yes, because the village council reminded them that traditional skills must be passed on. Mesoba assured the elders that Sentila would learn, and later Arenla herself began teaching her, showing their eventual support for her passion.' },
            ]
          },
          {
            id: 's3', title: 'Check Your Understanding (Part II)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: "Did Onula's support help Sentila? (30–40 words)", answer: "Yes, Onula's support was crucial. She encouraged Sentila when she was frustrated, taught her patiently, and gave her confidence. This guidance helped Sentila overcome her fear and finally succeed in shaping pots beautifully." },
              { id: 'q2', number: '2', text: "What does Sentila's observation of her mother show? (30–40 words)", answer: "It shows her keen interest, patience, and determination. She carefully studied her mother's technique, especially shaping the mouth of pots, proving her dedication to mastering the craft despite repeated failures." },
              { id: 'q3', number: '3', text: 'Arrange events in sequence.', answer: '4 → 3 → 6 → 1 → 8 → 5 → 2 → 9 → 7' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the reason.', answer: 'A. Pot making is tiresome and long, with little earnings.' },
              { id: 'q2', number: '(ii)', text: 'Why did Arenla want Sentila to learn weaving instead?', answer: 'Because it was easier, profitable, and less tiring.' },
              { id: 'q3', number: '(iii)', text: 'What advantage does weaving have?', answer: 'Weaving takes less time and gives better returns.' },
              { id: 'q4', number: '(iv)', text: 'Identify the correct sentence.', answer: 'B. They will make a handsome profit selling this property.' },
              { id: 'q5', number: '(v)', text: 'Purpose of the question mark here.', answer: "To emphasise Arenla's frustration at poor returns." },
            ]
          },
          {
            id: 's5', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "Why did Onula feel Sentila's effort was clumsy?", answer: 'Because she was tense and lacked confidence.' },
              { id: 'q2', number: '(ii)', text: 'What kind of person was Onula?', answer: 'Sincere and generous.' },
              { id: 'q3', number: '(iii)', text: 'Identify the effect described.', answer: 'A. As a result, the clay seemed unable to yield the right shape.' },
              { id: 'q4', number: '(iv)', text: "What does 'fashioned' mean?", answer: 'Created.' },
              { id: 'q5', number: '(v)', text: 'How did Sentila feel?', answer: 'Frustrated, ashamed, and hopeless.' },
            ]
          },
          {
            id: 's6', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Describe the process of pot making.', answer: 'Expert potters mix clay with water, pound it, and shape it skillfully using hands and a spatula. They dry the pots in the sun, arrange them in kilns with hay and bamboo, and fire them carefully to avoid damage.' },
              { id: 'q2', number: '2', text: 'What warning was given to Mesoba?', answer: "The council warned Mesoba that traditional skills like pottery belong to the community. They reminded him it was Arenla's duty to pass on the craft to her daughter and others willing to learn, ensuring continuity of tradition." },
              { id: 'q3', number: '3', text: 'How did Sentila feel after failing for a year?', answer: 'Sentila felt ashamed, frustrated, and hopeless. Despite repeated attempts, she could not shape pots properly, which made her lose confidence. She hung her head in despair, believing she might never succeed in her dream.' },
              { id: 'q4', number: '4', text: "Explain 'Onula stood there ... new phenomenon'.", answer: 'Onula saw two rows of pots, one by Arenla and one by Sentila, both equally perfect. She realised a new pot maker had been born, marking a profound moment of revelation and continuity of tradition.' },
              { id: 'q5', number: '5', text: "What does 'tradition and history ... not belong to any individual' symbolise?", answer: 'It symbolises that cultural skills like pottery are collective heritage. They must be preserved and passed on to future generations, ensuring continuity of tradition and identity, rather than being withheld for personal reasons.' },
              { id: 'q6', number: '6', text: "Significance of concluding line 'A new pot maker was born'.", answer: "It signifies Sentila's transformation from a struggling learner to a skilled potter. Despite hardships, she mastered the craft, ensuring the continuation of her community's tradition and proving the power of perseverance." },
              { id: 'q7', number: '7', text: 'Role of perseverance in pursuing dreams.', answer: "Perseverance played a vital role in Sentila's journey. Though she failed repeatedly, she never gave up. With guidance and determination, she mastered pottery, showing that persistence and resilience are essential to achieve dreams." },
            ]
          },
          {
            id: 's7', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Classify the words into tools/implements, raw materials, and process.', answer: 'Tools/Implements → dao, spatula, basket, cylinders, kiln\nRaw Materials → clay, dough, bamboo, bed of hay\nProcess → pounding, rotating, shaping' },
              { id: 'q2', number: '2', text: 'Economy words — meanings and sentences.', answer: 'bankrupt → without money → The company went bankrupt.\ncredit → trust in payment → He bought the bike on credit.\ncurrency → money system → The Indian currency is the rupee.\ndebt → money owed → He cleared his debt last year.\nfiscal → relating to finance → The fiscal year ends in March.\ninflation → rise in prices → Inflation makes goods expensive.\ninvestment → putting money for profit → She made an investment in shares.\ninterest → extra money paid on loans → The bank charges high interest.' },
              { id: 'q3', number: '3', text: 'Complete the noun clauses.', answer: 'The elders emphasised that skills must be passed on.\nMesoba explained why Arenla delayed teaching.\nOnula\'s promise was that she would help Sentila.\nSentila observed her mother carefully when she was shaping the mouth of the pot, which improved her skill.\nThe kiln, where pots were fired, required careful attention.' },
              { id: 'q4', number: '4', text: 'Complete the relative clauses.', answer: "Sentila, whose passion was pottery, practised diligently.\nThe village council, where elders gathered, sought an explanation.\nThe potter's hands, which were skilled, shaped clay beautifully.\nArenla, her mother, wanted her to learn weaving, which was profitable.\nMesoba went home and discussed the matter with Arenla, who agreed to teach." },
              { id: 'q5', number: '5', text: 'Determiners — fill in the blanks.', answer: 'Examples: the, this, that, her, many, some, all.\nA. The florist arranged five bouquets for her clients, that were displayed in an elegant floral shop.\nB. The carpenter crafted several unique tables, and those became the centrepiece in the furniture collection.\nC. Each of the apprentices in the culinary class demonstrated their knife skills during the intense cooking session.\nD. Many of the sculptures were displayed at an art exhibition, showcasing their diverse artistic skills.' },
            ]
          },
          {
            id: 's8', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Find out about the different styles of indigenous pottery of your region and other regions of India. (Match pictures with pottery types.)', answer: 'Region potteries include: blue pottery of Jaipur, terracotta of West Bengal (Bankura horses), black clay of Manipur, Nizamabad black ware of UP, and Odisha\'s stone-grey ware. Each uses local clay and unique techniques.' },
              { id: 'q2', number: 'II', text: "Read the story 'Quality' by John Galsworthy. Write its review highlighting the decline of traditional crafts vs industrialisation and mass-produced goods.", answer: 'Galsworthy\'s "Quality" shows two shoemakers whose handmade boots are superior yet lose out to cheap factory goods. The review should contrast craft pride and quality with industrialisation\'s low cost, speed and uniformity, showing how craftsmanship declines.' }
            ]
          },
          {
            id: 's9', title: 'Listen and Respond (Stone Statues)', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'A statue is carved to create a shape that is 1. _______. Among the many things stone is used for, making stone 2. _______ is one of them. India has some of the most 3. _______ stone sculptures.', answer: '1. visually interesting; 2. sculptures; 3. fascinating and mesmerising.' },
              { id: 'q2', number: '2', text: 'Select the six correct steps for making stone statues (out of nine).', answer: 'The six correct steps: choose the stone; measure the weight and dimensions of the statue; carve to remove large unwanted portions of the stone; work to bring out the imagined shape; refine the creation within the stone; detach the creation from the stone as the final statue. (Not steps: setting up tools, leaving the statue in water overnight, and carving from the centre.)' }
            ]
          },
          {
            id: 's10', title: 'Speaking Activity — Role-Play', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: "Prepare a role-play between Sentila and one other character (Arenla, Mesoba, Onula, or a village elder) covering Sentila's desire to learn pot making, her challenges, and the advice offered.", answer: 'Model: Sentila–(Mother) "I want to learn pot making." Mother–"It is tiring and pays little." Sentila–"But it is our heritage." Mother–"Then observe carefully and never give up." Expert advice: practise daily, accept failures, and keep the tradition alive.' }
            ]
          },
          {
            id: 's11', title: 'Writing Task — Reflective Writing', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: '"Identifying Skills and Passion" — create a write-up about your skills and passions (introduction; describing skills; passion into profession; examples and reflection; conclusion).', answer: 'I am passionate about art and sketching. My skills include drawing and designing posters for school events. I believe passion should guide career choice. For example, I designed our class magazine cover. Reflecting, I realise that nurturing this passion could lead to a career in graphic design. Skill plus passion becomes purpose.' }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Gifts of Grace: Honouring Our Vocations',
        slug:  'gifts-of-grace',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Riddles — identify the vocations.', answer: '1. Farmer\n2. Potter\n3. Mason/Builder\n4. Cook/Chef' },
              { id: 'q2', number: '2', text: 'Role and relevance of these people. (30–40 words)', answer: "Farmers provide food security, potters preserve tradition, masons build homes and infrastructure, and cooks nourish society. Each contributes to daily life and cultural identity, making their vocations vital for community well-being and progress." },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'True/False statements (with rectification of false ones).', answer: "1. The poem highlights the skilled work of craftspersons. → True\n2. The poet shares that musicians express emotions through their instruments. → True\n3. The carpenters in the poem are admired for their logical work. → True (their mathematical precision)\n4. The electricians in the poem are recognised for their crucial role in lighting up lives. → True\n5. The poem pays homage to shoemakers who manufacture quality footwear. → True\n6. The poem celebrates the patriotism of the people of Bharat. → False. Rectified: The poem celebrates the varied vocations and craftsmanship of the people of Bharat, not their patriotism.\n7. The poet feels that each vocation deserves to be respected. → True" },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: "The poet says the shoemakers 'affirm' the quality of their work. What does 'affirm' refer to here?", answer: "To declare with confidence. ‘Affirm’ means the shoemakers openly stand by the quality of their work, expressing pride and ownership rather than making adjustments, labelling goods, or justifying their efforts." },
              { id: 'q2', number: '2', text: 'What do quality shoes help with, according to the poet?', answer: 'Good shoes protect and support the feet through every activity — walking, dancing, running, jumping and returning home safely. According to the poet, quality footwear sustains the body’s movement, comfort and freedom, honouring the worker whose craft makes it possible.' },
              { id: 'q3', number: '3', text: "What does 'return home' symbolise besides the literal act of returning?", answer: '‘Return home’ symbolises safety, rest, belonging and emotional fulfilment after a day’s labour. Beyond the literal act, it suggests life’s purpose: all work and wandering find meaning when the worker comes back to family, warmth and home.' },
              { id: 'q4', number: '4', text: 'Identify the phrase that tells us every worker’s contribution is distinct.', answer: '"...each celebrating what belongs to them and to none else."' },
              { id: 'q5', number: '5', text: 'Complete: …for the feet that walk, dance, run, jump, return home refers to _______.', answer: 'The full range of human activities — working, playing, celebrating and living — that depend on the shoemaker’s craft.' },
            ]
          },
          {
            id: 's3b', title: 'Answer the Following', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "Why does the poet say, 'I hear Bharat celebrating, the varied vocations I hear'?", answer: 'The poet means that across India, every kind of work — from farming to shoemaking — is a form of celebration. Bharat as a nation comes alive through the pride, skill and dedication of its many workers and craftspersons.' },
              { id: 'q2', number: '2', text: "What does the electrician 'humming' while getting ready for work suggest?", answer: "The humming suggests contentment and pride in one's work. It shows that the electrician finds joy and satisfaction in the task ahead, treating even routine labour as something cheerful rather than a burden." },
              { id: 'q3', number: '3', text: "Explain the significance of the line, 'The voice of their vocation is the voice of their identity.'", answer: 'This line means that a person’s work defines who they are. Their vocation is not just a means of earning but a core part of their identity, dignity and self-expression in society.' },
              { id: 'q4', number: '4', text: 'Do you think the role of all the people belonging to different vocations is important in our daily lives? Support your answer with a reason.', answer: 'Yes, every vocation is important. Farmers grow our food, masons build our homes, and cooks nourish us. Society functions smoothly only because of the combined, interdependent contribution of people across all vocations.' },
              { id: 'q5', number: '5', text: 'Why is the poet celebrating all the vocations in the poem? Explain by giving examples from your context.', answer: 'The poet celebrates vocations because each one, however humble, sustains life and society. For example, in my context, the local farmer, tailor and electrician all quietly keep daily life running, deserving equal respect and recognition.' },
              { id: 'q6', number: '6', text: 'How does the poet use sensory imagery to bring out the beauty of everyday work?', answer: 'The poet uses visual imagery (colours, hues, feet that walk and dance) and auditory imagery (lutes, humming, singing, rhythm) to make ordinary work vivid and alive, helping readers see and hear the beauty in everyday labour.' },
            ]
          },
          {
            id: 's4', title: 'Let Us Appreciate the Poem', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Rhyme scheme and lineation: Does the poem strictly follow a rhyme scheme or is it free verse? What is the impact of varying line lengths? What pattern do most lines follow?', answer: 'The poem is largely free verse with no fixed rhyme scheme. Varying line lengths mimic natural speech and the rhythm of work. Most lines begin with the worker and end with the celebration of the craft.' },
              { id: 'q2', number: '2', text: 'Who appears to be the speaker and what is her/his role?', answer: 'The speaker is the poet, acting as an admiring observer of working life. She does not perform any labour; her role is to notice, honour and celebrate every worker’s dignity, giving voice and visibility to vocations society often overlooks.' },
              { id: 'q3', number: '3', text: 'Tone and mood — fill in the blanks with suitable options (serious, celebratory, hostile, reverential, joyful, sympathetic).', answer: 'Tone: reverential and celebratory — depicting admiration and respect for artisans and craftspersons. Mood: joyful — capturing the vibrancy and richness of cultural traditions and skills throughout the poem.' },
              { id: 'q4', number: '4', text: 'Select two descriptions that evoke visual images; fill in the blanks with suitable phrases (auditory imagery).', answer: 'Visual: feet that walk, dance, run, jump and return home, and workers each celebrating their craft. Auditory: the delicious singing of the cook, the rhythm of the designer and mason — sounds of joyful labour that turn work into music.' },
              { id: 'q5', number: '5', text: "Is 'delicious singing' a metaphor? Give a reason.", answer: "Yes — singing is not literally delicious; the word transfers the taste sense to sound, showing how pleasing the singing is." },
              { id: 'q6', number: '6', text: 'Select the line that personifies vocations.', answer: 'The line presenting each vocation as one that celebrates personifies occupations — singing, rhythm and designing are shown as living beings rejoicing in their work. This device honours labour by granting crafts the human qualities of pride, joy and self-expression.' },
              { id: 'q7', number: '7', text: 'Why might the poet have begun and ended with the same line?', answer: 'The repeated opening line frames the poem like a refrain, fixing its central message of dignified labour in the reader’s mind. This circular structure gives the poem unity: it begins and ends in celebration, suggesting work’s endless, renewing rhythm.' },
              { id: 'q8', number: '8', text: 'Identify two examples of alliteration.', answer: "‘Sailing, and singing’ (repeated 's' sound describing the boatmen) and ‘the voice of their vocation’ (repeated 'v' sound). Both add music and rhythm, emphasising the joy and pride embedded in each worker’s craft." },
              { id: 'q9', number: '9', text: 'What does each vocation symbolise beyond a job?', answer: 'Beyond jobs, each vocation symbolises human dignity, self-identity and social contribution. The shoemaker, cook, mason and designer stand for honest labour’s worth: every craft, however humble, sustains community life and deserves equal honour and respect.' },
            ]
          },
          {
            id: 's5', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Match the vocations (ASHA worker, confectioner, sericulturist, welder, horticulturist, goldsmith) with descriptions.', answer: 'horticulturist → studies/grows garden plants; ASHA worker → trained female community health worker; sericulturist → producer of raw silk; confectioner → makes or sells sweets and chocolates; goldsmith → metalworker specialising in precious metals; welder → person who fuses materials together.' },
              { id: 'q2', number: '2', text: 'Identify the word in Column 2 that is NOT a synonym of the word in Column 1.', answer: '1. myriad → NOT a synonym: countable (myriad means innumerable/abundant).\n2. hues → NOT a synonym: drawing (hues means shades/tints/colour).\n3. precision → NOT a synonym: calculation (precision means exactness/accuracy).\n4. varied → NOT a synonym: uniform (varied means diverse/different, the opposite of uniform).\n5. delicious → NOT a synonym: inedible (delicious means tasty, the opposite of inedible).' },
            ]
          },
          {
            id: 's6', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'What does the boy use to understand the details of the tools?', answer: 'Toy cars (he uses toy cars to discuss details and usage with his father).' },
              { id: 'q2', number: 'II', text: "Select the correct option: 1) The girl is ___ about taking food for her mother. 2) The boy thinks the mother's job carries a lot of ___. 3) The girl ___ why the boy is good at science exhibitions. 4) The girl shares her ___ about joining the weekend discussion on tools.", answer: '1. happy\n2. responsibility\n3. realises\n4. wish' },
            ]
          },
          {
            id: 's7', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'In groups of five, each student represents one vocation from the poem and speaks about who they are, what they do, where they work, experiences, problems, and a message.', answer: 'Model: represent the cook — I cook nourishing food in homes and hotels. I enjoy feeding people but work long hours. My message: every job deserves respect and fair pay.' },
            ]
          },
          {
            id: 's8', title: 'Writing Task — Career Mela Poster', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: 'Your school will be organising a \u2018Career Mela\u2019. Complete the poster for the event with the organiser name, event name, purpose, date, time, venue, highlights, slogan, entry details, and sponsors, within a 50-word limit.', answer: "Model: ABC PUBLIC SCHOOL announces CAREER MELA — to spread awareness about various careers, on 25 February, 9 a.m.\u20136 p.m., at the School Auditorium, New Delhi. Highlights: Details and information provided for all streams; Counsellors for all careers; Interactive sessions with professionals. Slogan: CHART YOUR FUTURE AT CAREER MELA. Entry: FREE. Sponsors: Local Businesses Association. Issued by: ABC Public School." },
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: "Read the poem 'The Lamplighter' by R.L. Stevenson and enjoy it as a self-reading piece about childhood fascination with vocations.", answer: 'Model: the poem shows a child\u2019s admiration for the lamplighter\u2019s humble but magical evening job, and the child\u2019s wish to grow up and do the same, reflecting how children see dignity and wonder in everyday work.' },
              { id: 'q2', number: 'II', text: 'Visit the MSDE website (msde.gov.in), collect information on any one vocation of your choice, and prepare a presentation on the reason for your choice and its benefit to society and self.', answer: 'Model: chosen vocation \u2014 plumbing. Plumbers maintain clean water and sanitation, essential for public health. I chose it because skilled workers are always in demand. This vocation serves society by preventing disease while providing stable, respected employment.' },
              { id: 'q3', number: 'III', text: 'Read the Japanese Haiku example, then create a Haiku poem of your own (5-7-5 syllables) and share it.', answer: 'Model: Hands shape the red clay, / Fires turn it into beauty \u2014 / Craft carries our heart. (Haiku: 5\u20137\u20135 syllables on one theme.)' },
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'ch03', number: 3, code: '0903ch03',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'Winds of Change',
        slug:  'winds-of-change',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Does anyone in your family use a hand fan? What do you call it in your language? What is it made of?', answer: 'Yes, my grandmother uses a hand fan. In Hindi we call it pankha. It is usually made of palm leaves or bamboo strips tied together.' },
              { id: 'q2', number: '2', text: 'Complete the table of fans (state, shape, made of).', answer: 'Assam → Round → Bamboo/cane\nKerala → Rectangular → Palm leaf\nUttar Pradesh → Oval → Moonj grass' },
              { id: 'q3', number: '3', text: 'Match words with meanings.', answer: 'indigenous → local, from where it originated\ninnovative → new and original in approach\nindustrious → hardworking\nintricate → elaborate/detailed\ninvoked → brought out\ninitiatives → actions to improve a situation' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Complete the table on pankha (state, type, materials/technique).', answer: 'Rajasthan → appliqué hand fan → fabric pieces sewn with ornamental needlework\nRajasthan → zardozi hand fan → gold thread\nRajasthan → temple hand fans → brass, long handle\nGujarat → mirror work hand fans → cotton cloth with mirror embroidery\nGujarat → beads hand fan → beads, silver handle\nGujarat → leather hand fans → leather decorated with thread and wool\nWest Bengal → sola hand fans → sola (water grass) centre\nUttar Pradesh → phadh hand fans → pure gold, silver zari, silk, satin frills\nBihar → bamboo hand fans → bamboo' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'True/False: Pankhas were one of the most popular items of commerce.', answer: 'True' },
              { id: 'q2', number: '(ii)', text: "Why has the word 'traditional' been used?", answer: 'Because pankhas represent cultural heritage and age-old craftsmanship passed down generations.' },
              { id: 'q3', number: '(iii)', text: 'Why is "exotic and stylish" an opinion?', answer: 'Because it reflects personal perception of beauty, not a factual statement.' },
              { id: 'q4', number: '(iv)', text: 'Reason for commonality in use across India.', answer: 'They were practical tools for cooling and widely needed in temples, courts, and homes.' },
              { id: 'q5', number: '(v)', text: 'Identify the correct assertion.', answer: 'A. Each kind of pankha could be distinguished from the other.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Negative impact of technology.', answer: 'Traditional pankhas lost popularity as electric fans replaced them.' },
              { id: 'q2', number: '(ii)', text: "Why does the writer call pankhas a 'culture'?", answer: 'Because they embody stories, artistry, and traditions beyond being mere objects.' },
              { id: 'q3', number: '(iii)', text: 'Identify the line showing change in role.', answer: '"Once made for personal use, over time this handicraft has transformed into a commercial business."' },
              { id: 'q4', number: '(iv)', text: 'One benefit of increased demand.', answer: 'It provides livelihood and income to artisans.' },
              { id: 'q5', number: '(v)', text: 'Factor contributing to commercialisation.', answer: 'B. economic demand' },
            ]
          },
          {
            id: 's5', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "How does the title 'Winds of Change' capture the essence of the chapter?", answer: 'The title reflects transformation in the role of pankhas. Once everyday tools, they are now cultural artefacts. It symbolises changing times, where traditional crafts adapt to modern demands while preserving heritage.' },
              { id: 'q2', number: '2', text: "Support the statement: 'The structure and design of pankhas are testimony to cultural identity.'", answer: "Rajasthan's appliqué and zardozi fans show rich textile traditions, while Gujarat's mirror work reflects local embroidery styles. Each design embodies the cultural identity of its region, making pankhas symbols of heritage and artistry." },
              { id: 'q3', number: '3', text: 'Evaluate the balance between preserving craftsmanship and incorporating innovation.', answer: 'Preserving traditional methods ensures cultural continuity, while innovative designs attract modern buyers. Combining both helps artisans sustain livelihoods, keeps the craft relevant, and prevents it from fading in the age of technology.' },
              { id: 'q4', number: '4', text: 'How might pankha-making workshops contribute to preservation?', answer: 'Workshops spread awareness, teach younger generations, and provide artisans with platforms to showcase skills. They encourage appreciation of heritage, create demand, and ensure the craft survives as both tradition and livelihood.' },
              { id: 'q5', number: '5', text: 'Assess how celebrating pankhas benefits artisans and craft.', answer: "Celebrating pankhas honours artisans' work, increases demand, and provides recognition. It helps sustain livelihoods, preserves cultural heritage, and motivates artisans to continue their craft with pride and dignity." },
              { id: 'q6', number: '6', text: 'How does restriction of pankhas to decorative use reflect cultural change?', answer: "It shows how modern technology replaced their functional role. Now valued as art pieces, pankhas represent heritage rather than utility, reflecting society's shift from traditional practices to modern conveniences." },
            ]
          },
          {
            id: 's6', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Classify word pairs by category.', answer: 'Appearance → exotic and stylish, ornate and encrusted\nPlace → villages and towns, within and outside\nMaterial → thread and wool, silk and brass' },
              { id: 'q2', number: '2', text: 'Fixed expressions — match with meanings.', answer: 'high and dry → in a difficult situation, without help or money\ncut and run → to make a quick escape\nfacts and figures → accurate and detailed information\nall and sundry → everyone, not just a few special people\nwear and tear → damage due to normal use\ntime and again → often, repeatedly\nthick and thin → even when there are problems' },
              { id: 'q3', number: '3', text: 'Collocations.', answer: '(i) take the exam (ii) have a seat (iii) ran into a car (iv) take responsibility (v) improve my grammar' },
              { id: 'q4', number: '4', text: 'Present perfect tense exercise.', answer: '(i) have created (ii) have mastered (iii) has evolved (iv) have passed (v) have performed' },
            ]
          },
          {
            id: 's6b', title: 'Listen and Respond (Choosing a Pankha)', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'You will listen to a dialogue between a boy and a girl discussing which type of pankha they should choose as a gift. Choose four statements out of seven that are true.', answer: "True: 1. Rohan thinks Grandma prefers heavier items because they feel more substantial. 2. Priya suggests getting a pankha that can be easily moved around (a medium option, not too heavy or light). 3. Rohan believes Grandma enjoys sitting in the verandah during the evenings. 6. Priya suggests choosing between a bamboo pankha with beadwork or an embroidered pankha with mirror work.\nFalse: 4 (it was Rohan, not Priya, who said Grandma likes to keep special items close), 5 (neither felt intricate designs were too delicate — both admired them), 7 (they decide TO consult their mom, not avoid her)." },
            ]
          },
          {
            id: 's7', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Identify any art or craft item from your region and make a presentation describing its features, materials, process of making, and usage.', answer: 'Model: choose Madhubani painting from Bihar. Features: bold lines and folk motifs; materials: natural colours, twigs and cloth; process: outlines drawn then filled with vegetable dyes; usage: decorating walls, festivals and gifts, supporting rural artists.' },
              { id: 'q2', number: 'II', text: 'Make your own hand fan in groups of four. Display the hand fans in class and describe the process used to make it.', answer: 'Model: take bamboo strips, arrange them like a fan and weave palm-leaf or cloth between them. Secure with thread at the base. Decorate with paint or beads. Present: describe materials used and folding technique.' },
              { id: 'q3', number: 'III', text: "Read and enjoy 'The Last Leaf' by O. Henry and discuss it.", answer: 'Model: the story is about sacrifice and hope. An old artist paints a leaf on a wall to give a sick girl courage to live, sacrificing his own life. Discuss the themes of selfless love and the power of hope.' }
            ]
          },
          {
            id: 's8', title: 'Speaking Activity — I Am a Fan', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Work in groups of four. Each picks one kind of fan from the pictures, imagines being that fan, and introduces yourself describing your features, likes, weakness, and uniqueness.', answer: 'Model: I am a folding hand fan, light and elegant. I love swirling to create cool breezes and dancing in ladies\' hands. My weakness: I tear easily and dread being soaked in rain. My uniqueness: I unfold into art carrying painted stories.' }
            ]
          },
          {
            id: 's9', title: 'Writing Task — Factual Description', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Describe an artefact you have made in your craft class or learnt from someone. Begin with collecting facts using the given pointers. Do not include your opinion.', answer: 'Model: I made a paper-mache mask in craft class. It is about 20 cm tall and oval in shape. It was made by soaking paper strips in starch paste and layering them on a mould, then drying and painting it orange and black. It is light and lasts for months.' }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Canvas of Soil',
        slug:  'canvas-of-soil',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'What all do you see in a garden?', answer: 'In a garden, I see colourful flowers, green grass, tall trees, butterflies, and birds. There are shades of red, yellow, pink, and green spread across different corners, making it vibrant and lively.' },
              { id: 'q2', number: '2', text: 'Similarities between a garden and a painting.', answer: 'Just as a garden has colours, shapes, and patterns, similarly, a painting also displays hues and designs. Both are creative expressions, and both bring joy and beauty to life.' },
              { id: 'q3', number: '3', text: 'Identify palette, canvas, and hue.', answer: 'Palette → The board with mixed colours.\nCanvas → The painting itself.\nHue → Shade of green in the artwork.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Complete the summary of the stanzas.', answer: "1. The earth is portrayed as a rich palette where gardeners' dreams flourish in the form of seeds, awaiting spring.\n2. The garden flowers bloom into a beautiful display of different blossoms, resembling a painting by Mother Nature, in the light of morning.\n3. Each garden is likened to a wide canvas, integrating art and life. Through the efforts of gardeners, gardens transform into still-life paintings." },
              { id: 'q2', number: '2', text: 'Select titles for the stanzas.', answer: "1. Earth and Possibilities\n2. Nature's Work of Art\n3. Gardens as Living Canvases" },
              { id: 'q3', number: '3', text: 'Match poetic devices.', answer: '1. Imagery → colours, brushstrokes, blossoms, shades of green\n2. Metaphor → garden as a painting, plot as canvas, seeds as brushstrokes\n3. Rhyme Scheme → AABB\n4. Tone → appreciative\n5. Mood → joyful\n6. Speaker → a gardener\n7. Alliteration → "Blossoms bloom"' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "The poet has used a metaphor in 'Brushstrokes of seeds'. Which option uses a metaphor?", answer: 'B. She has a heart of gold.' },
              { id: 'q2', number: '(ii)', text: "Complete the sentence: The phrase 'planted true' is significant because it implies ______.", answer: 'that the seeds were planted with care, accuracy and sincerity, reflecting the gardener\u2019s dedication and honest effort.' },
              { id: 'q3', number: '(iii)', text: "Why has the poet used the word 'hue' instead of 'colours' in the extract?", answer: "'Hue' is a more poetic and precise word, suggesting subtle shades and depth of colour, which fits the poem's artistic, painting-related imagery better than the plain word 'colours'." },
              { id: 'q4', number: '(iv)', text: 'Complete the analogy: Summer : hot :: Spring : ______.', answer: 'vibrant (as in \u201cawaiting spring\u2019s vibrant hue\u201d)' },
              { id: 'q5', number: '(v)', text: 'Assertion (A): Gardeners wait for Spring. Reason (R): Gardens are worth painting in Spring. Select the correctly suited option.', answer: 'B. Both (A) and (R) are true, but (R) is not the correct explanation of (A) — gardeners wait for Spring because that is when their planted seeds bloom, not specifically because gardens are worth painting then.' },
            ]
          },
          {
            id: 's3b', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "What does 'Each plot' refer to in this extract?", answer: 'Each individual patch or bed of land in the garden that a gardener cultivates.' },
              { id: 'q2', number: '(ii)', text: 'Select the option that imitates the rhyme scheme of the extract.', answer: 'A. \u201cbeautiful and clear / laughter and cheer\u201d (clear\u2013cheer rhyme, like wide\u2013coincide in the extract).' },
              { id: 'q3', number: '(iii)', text: 'Select the line that conveys that gardening blends aesthetic beauty with natural growth.', answer: '"Each plot, a canvas wide, / Where art and life coincide."' },
              { id: 'q4', number: '(iv)', text: 'Complete: The plot is likened to a canvas suggesting that ______.', answer: 'gardening is a creative, artistic act — the gardener shapes living plants the way a painter shapes a work of art on canvas.' },
              { id: 'q5', number: '(v)', text: "Why has the poet most likely used the word 'wide' instead of 'long' in 'canvas wide'?", answer: '\u2018Wide\u2019 suggests openness, expansiveness and scope for creativity, evoking a broad, generous artistic space, whereas \u2018long\u2019 would only suggest length/measurement.' },
            ]
          },
          {
            id: 's3c', title: 'Give Reasons for the Comparisons', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'A painter is compared to a gardener because ______.', answer: 'both use skill, patience and creative vision to turn raw material — paint or soil and seeds — into something beautiful.' },
              { id: 'q2', number: '2', text: 'A palette is like earth as ______.', answer: 'both hold a rich variety of colours/materials from which a creation — a painting or a garden — eventually emerges.' },
              { id: 'q3', number: '3', text: 'The brushstrokes are like seeds because ______.', answer: 'both are small, deliberate initial actions that, through care and time, grow into a larger, beautiful finished creation.' },
              { id: 'q4', number: '4', text: 'A canvas is similar to a garden plot as ______.', answer: 'both are a defined space on which something artistic and living is created and gradually takes shape.' },
            ]
          },
          {
            id: 's4', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "How does the metaphor 'Brushstrokes of seeds' enhance the understanding of gardening as an art form?", answer: 'The metaphor equates a gardener\u2019s act of planting seeds with a painter\u2019s brushstrokes on a canvas. It presents gardening as a deliberate, creative art, where each seed, like each stroke, contributes to a larger living masterpiece.' },
              { id: 'q2', number: '2', text: "What can you infer about the poet's perspective on the relationship between nature and creativity from 'Each plot, a canvas wide, / Where art and life coincide'?", answer: 'The poet views nature and creativity as inseparable. A garden plot is both a living, growing thing and a work of art, showing that natural growth and artistic expression coincide and enrich each other.' },
              { id: 'q3', number: '3', text: "Do you think the imagery in the poem successfully paints a vivid picture in the reader's mind? If yes, why? If no, why not?", answer: 'Yes, the imagery is vivid — words like brushstrokes, blossoms, shades of green, red and blue, and dancing flowers create clear visual pictures, helping readers imagine the garden as a living painting in full colour.' },
              { id: 'q4', number: '4', text: 'Support the view that the poet\u2019s mention of the colour yellow, besides red, blue and green, would have lent effectively to the imagery.', answer: 'Yellow is strongly associated with sunlight, marigolds and blooming flowers. Adding yellow would have made the garden\u2019s imagery even warmer, brighter and more vivid, further strengthening the comparison of the garden to a vibrant painting.' },
              { id: 'q5', number: '5', text: "Considering the line 'Gardens become paintings still', what can you interpret about the poet's view on the timelessness of nature's beauty?", answer: 'The poet suggests that nature\u2019s beauty is enduring and timeless, like a painting that remains admired forever. Gardens, shaped by gardeners across seasons, continue to be living works of art that never lose their charm.' },
              { id: 'q6', number: '6', text: "Justify the title of the poem, 'Canvas of Soil'.", answer: 'The title is apt because it merges art and nature — soil, like a canvas, is the base on which gardeners \u2018paint\u2019 with seeds and blossoms, transforming plain earth into a living work of art.' },
            ]
          },
          {
            id: 's5', title: 'Mini-Project — Gardens of India', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Mini-project: explore the multifaceted world of gardens — select any TWO assignments: research five famous gardens of India; explore art inspired by gardens; design your own garden; interview a gardener.', answer: 'Model: research — Mughal Gardens, Rock Garden Chandigarh, Lal Bagh Bengaluru, Brindavan Gardens Mysuru, Botanical Garden Kolkata. Note each garden\'s style, plants, and history; present pictures and interesting facts.' },
              { id: 'q2', number: 'II', text: "Read and enjoy 'A Sea of Foliage Girds Our Garden Round' by Toru Dutt.", answer: 'Model: the poem praises a garden surrounded by lush foliage, with flowers, birds and gentle breezes—a peaceful haven to be enjoyed for its natural beauty.' }
            ]
          },
          {
            id: 's6', title: 'Listen and Respond (School Garden)', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Listen to a girl describe her school garden. Identify which of the points 1–3 (shown as pictures) she does not talk about.', answer: 'She talks about the flowers, the potted plants and the decorated bricks/bench, but does not talk about a pond or water feature (she describes flowers, useful/evergreen plants, brick borders, the banyan tree, and waste-material craft items — no pond is mentioned).' },
              { id: 'q2', number: 'II', text: 'Listen again and circle the correct answers from the options given.', answer: '1. Colour of flowers in the first row → pink.\n2. Type of flowers in the second row → rose.\n3. Position of the useful plants → left corners.\n4. Number of potted evergreen plants → 20.\n5. Paint colour on the bordering bricks → red and white.\n6. Type of tree in the centre of the garden → banyan.\n7. Things created with waste material → dustbins (also scarecrows and pin wheels).' }
            ]
          },
          {
            id: 's7', title: 'Speaking Activity — My Garden', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Some like a flower garden, some a vegetable garden. Think and note the advantages of both.', answer: 'Flower garden: beauty, fragrance, attracts butterflies and birds, brings peace. Vegetable garden: healthy fresh food, saves money, teaches patience and sustainability. Both connect us to nature.' },
              { id: 'q2', number: 'II', text: 'Would you like a flower garden or a vegetable garden at home? Why? (Use the sentence prompts.)', answer: 'I prefer a vegetable garden because it gives us fresh, chemical-free food daily. It is useful and satisfying. However, I would keep a few flowering plants at the corner for colour and joy.' }
            ]
          },
          {
            id: 's8', title: 'Vocabulary — Shades of Colour', type: 'vocabulary',
            questions: [
              { id: 'q1', number: 'I', text: 'Read the names of different shades of green, red and blue. Discuss any two things you associate with these colours.', answer: 'Green: forests, freshness; Red: roses, love, festivals; Blue: sky, sea, calm. Model: emerald green reminds me of paddy fields; crimson red of marigold garlands in Diwali.' },
              { id: 'q2', number: 'II', text: 'Discuss the meanings of painting-related words using context: easel, tonal range, underpainting, mural, etc.', answer: 'easel → stand that holds a canvas; tonal range → scale of light to dark shades; underpainting → first layer of paint under the final colours; mural → a painting made directly on a wall.' }
            ]
          },
          {
            id: 's9', title: 'Writing Task — Descriptive Piece', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Write a descriptive piece of two to three paragraphs on the garden you have visited. Focus on how shades interact, create contrast, and bring the garden to life.', answer: 'The garden burst with green — deep emerald leaves beneath bright lemon-yellow marigolds. Pink roses contrasted against white jasmine, their petals gleaming in morning dew. Butterflies fluttered between violet and scarlet blooms. The wooden bench under the banyan gave a cool, shaded vista. Every shade, from pale mint to dark green, blended to create a living, breathing canvas of colour and calm.' }
            ]
          },
        ]
      },
    ]
  },

  {
    id: 'ch04', number: 4, code: '0903ch04',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'Vitamin-M',
        slug:  'vitamin-m',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Caring for the elderly — graphic organiser.', answer: 'Why care: They give wisdom, love, and guidance.\nProblems faced: Weak health, loneliness, memory loss.\nReasons: Ageing, lack of support, city life stress.\nHow to care: Show respect, spend time, provide medical help, listen patiently.' },
              { id: 'q2', number: '2', text: 'Meanings of words.', answer: 'frail → weak and delicate\nshuddered → trembled with fear or discomfort\npoky → small and cramped\nforbid → to prohibit\npottering → moving about aimlessly, doing small tasks\nwinced → showed embarrassment or pain' },
              { id: 'q3', number: '3', text: 'Share a tradition/story/recipe from your grandparents. (30–40 words)', answer: 'My grandmother passed down a recipe for mango pickle. It connects me to childhood summers, reminding me of family gatherings and her love. Such traditions preserve memories and strengthen bonds across generations.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding (Part I)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Why did Grandpa dislike living in the city?', answer: 'He hated the noise, crowd, and bustle. He missed his quiet brick house with a mango tree, where evenings were peaceful enough to hear a leaf fall.' },
              { id: 'q2', number: '2', text: "Why did Vidya not want her father to go out alone?", answer: 'Because he had earlier taken wrong doses of medicine and once got lost. She feared for his safety and wanted to prevent accidents.' },
              { id: 'q3', number: '3', text: 'Was Ravi in favour of his mother treating Grandpa like a child? How can you say so?', answer: 'No, Ravi winced when his mother spoke loudly to Grandpa as if he were a child. He felt it was disrespectful and tried to treat Grandpa with dignity.' },
              { id: 'q4', number: '4', text: 'Would Ravi be able to keep up his promise to his mother?', answer: 'No, because Grandpa tricked him and went out alone. Ravi followed secretly but could not stop him, showing he failed to keep the promise.' },
            ]
          },
          {
            id: 's3', title: 'Check Your Understanding (Part II)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: "Complete Grandpa's day out flow chart.", answer: "1. children's park\n2. peanuts (watches children play)\n3. the tea stall\n4. the boy's mother and the vendors\n5. tea (eats bananas and ice cream)\n6. barber shop\n7. bus stop (and boards a bus) — where Ravi discovers he had been following a stranger wearing an identical cap." },
              { id: 'q2', number: '2', text: "Was Grandpa lost as feared by Ravi's mother?", answer: 'No, Grandpa returned home safely and was found snoring peacefully in his room.' },
              { id: 'q3', number: '3', text: 'How would Ravi feel after seeing Grandpa? (30–40 words)', answer: 'Ravi felt immense relief and affection. He knelt by Grandpa, hugged him, and realised his deep love. His worry turned into joy, showing how much he cared for his grandfather\'s safety and presence.' },
              { id: 'q4', number: '4', text: "Do you think Ravi's mother will get to know what happened?", answer: 'No, because Grandpa cleverly told her Ravi disappeared instead of staying home, hiding the truth.' },
            ]
          },
          {
            id: 's4', title: 'Check Your Understanding (Part III)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: "Ravi's emotional reaction on finding Grandpa safe. (30–40 words)", answer: "Ravi was overcome with affection and relief. He hugged Grandpa, felt his wrinkled skin, and realised his love. His emotions revealed deep attachment and worry, showing how much he valued his grandfather." },
              { id: 'q2', number: '2', text: "Significance of Grandpa's habit of giving gifts.", answer: 'It shows his generosity and love. Instead of receiving, he gave gifts to family, treating them as his "babies." It reflects his caring nature and desire to spread joy.' },
              { id: 'q3', number: '3', text: 'Why did Grandpa give Ravi a detective story book?', answer: "Because he knew Ravi had followed him all day. The gift showed Grandpa's awareness and humour, encouraging Ravi to improve his detective skills." },
            ]
          },
          {
            id: 's5', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the emotion.', answer: 'Nostalgic' },
              { id: 'q2', number: '(ii)', text: 'Why did Grandpa hate city life?', answer: 'Because it was noisy and crowded.' },
              { id: 'q3', number: '(iii)', text: 'Why did he come to the city?', answer: 'He slipped in his garden and needed care.' },
              { id: 'q4', number: '(iv)', text: 'Identify the expression used.', answer: 'Pin drop silence' },
              { id: 'q5', number: '(v)', text: 'State one advantage and one disadvantage.', answer: 'Advantage: peaceful environment; Disadvantage: unsafe when alone.' },
            ]
          },
          {
            id: 's6', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the tone.', answer: 'Calm' },
              { id: 'q2', number: '(ii)', text: 'Why was Ravi confused and embarrassed?', answer: "Because Grandpa revealed he hadn't stayed home as instructed." },
              { id: 'q3', number: '(iii)', text: "Why was Ravi's mother impatient?", answer: "Because she believed Grandpa's memory was failing — he was giving Ravi a birthday gift even though Ravi's actual birthday had passed three months earlier." },
              { id: 'q4', number: '(iv)', text: 'True or False, with reason.', answer: "False — Grandpa had not forgotten; the gift was not for Ravi's birthday at all, but part of Grandpa's own tradition of gifting everyone on his birthday." },
              { id: 'q5', number: '(v)', text: "Why did Grandpa say he didn't know what kind of morning Ravi might have had?", answer: "Grandpa was playfully pretending not to know that Ravi had secretly followed him all morning, shielding Ravi from trouble while enjoying a private joke at his expense." },
            ]
          },
          {
            id: 's7', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "Give two evidences to disprove Grandpa's failing memory.", answer: 'He remembered famous chess games in detail and his tradition of giving gifts on his birthday. These show his memory was sharp in important matters despite occasional forgetfulness.' },
              { id: 'q2', number: '2', text: 'Traits of the characters.', answer: "Grandfather: witty, independent\nRavi: loyal, caring\nRavi's mother: anxious, protective" },
              { id: 'q3', number: '3', text: 'Why was Ravi worried about Grandpa at the tea stall?', answer: "Because Grandpa ate sugar, bananas, and ice cream, all forbidden at home. Ravi feared his mother's reaction and worried about Grandpa's health." },
              { id: 'q4', number: '4', text: 'Was it easy for Ravi to follow Grandpa?', answer: 'No, because he had to hide behind bushes, trees, and cars, facing humiliation and confusion. It was tiring and embarrassing.' },
              { id: 'q5', number: '5', text: "'Ravi is a good detective' — argument for and against.", answer: 'For: He followed Grandpa closely and observed details. Against: He got fooled by a stranger with the same cap, showing lack of skill.' },
              { id: 'q6', number: '6', text: 'Was Grandpa aware Ravi was following him?', answer: "Yes, his gift of a detective book and twinkle in his eye showed he knew Ravi's actions." },
              { id: 'q7', number: '7', text: 'Who needs Vitamin-M? Why?', answer: "Ravi's mother needs it, as Grandpa joked, because she forgot his birthday tradition. It symbolises memory support." },
              { id: 'q8', number: '8', text: 'Give an example of age bias. (30–40 words)', answer: "In many families, children's opinions are ignored because they are considered too young. Similarly, elderly people's views are dismissed as outdated. This shows discrimination where age becomes a reason to disregard valuable perspectives." },
            ]
          },
          {
            id: 's8', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Classify Movement vs Sound words.', answer: 'Movement: pottering, twirling, crouch, bustle, crawl, creeping, ducked, zigzagging, evicted, briskly, sprinting, jumping, darted, trailing\nSound: boomed, thudded, whirr, shrieks, grunted, snoring' },
              { id: 'q2', number: '2', text: 'Fill in the blanks (detective story).', answer: '1. trailing 2. bustle 3. briskly 4. thudded 5. twirling 6. crouch 7. creeping 8. grunted 9. darted 10. snoring' },
              { id: 'q3', number: '3', text: 'Synonyms for dilemma.', answer: 'Quandary, Predicament' },
              { id: 'q4', number: '4', text: 'Word meanings table — part of speech, synonym, antonym.', answer: 'craftily → cleverly (adv) | synonym: cunningly | antonym: honestly\ndilemma → difficult choice (noun) | synonym: predicament | antonym: certainty\nfurious → very angry (adj) | synonym: enraged | antonym: calm\nboomed → spoke loudly (verb) | synonym: thundered | antonym: whispered\nhumiliation → embarrassment (noun) | synonym: disgrace | antonym: pride\nattire → clothing (noun) | synonym: outfit | antonym: undress' },
              { id: 'q5', number: '5', text: 'Match emotions/expressions.', answer: 'embarrassed → felt uncomfortable\ncountered → reply to an argument\nflushed → became red in the face\nstricken → affected severely by unpleasant feeling\ngleam → expression of emotion' },
              { id: 'q6', number: '6', text: 'Prepositions exercise.', answer: '(i) through (ii) over (iii) near (iv) in (v) along (vi) into' },
              { id: 'q7', number: '7', text: 'Interrogative sentences.', answer: 'A. Words in quotes are interrogative. B. Sentences 1, 4, 5 → Yes/No type. C. Sentences 2, 3 → Wh-type. D. Two types of interrogative sentences.' },
              { id: 'q8', number: '8', text: 'Reported speech exercise.', answer: '1. helped in taking care of grandparents\n2. took turns making sure they were alright\n3. if he had grandparents living with him\n4. he visited his grandpa every weekend\n5. how they managed medical needs\n6. they had a schedule for medications and doctor visits' },
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Revisit the story and choose the image that correctly displays Grandpa’s walking stick.', answer: 'Model: choose the image showing a sturdy, slightly curved wooden stick — Grandpa used it for support while walking.' },
              { id: 'q2', number: 'II', text: 'Explore and revisit memories: collect a few memorable photographs of yourself and your family. Make a slide show with details.', answer: 'Model: gather 5–6 photos of festivals, birthdays and trips. For each, write who is in it, when it was taken, and why it is special. Arrange them in order and present the story behind each memory.' },
              { id: 'q3', number: 'III', text: 'Read and discuss the story ‘The Lost Child’ by Mulk Raj Anand (abridged).', answer: 'Model: the story is about a child who is fascinated by fair attractions but loses his parents in the crowd. Once separated, he refuses sweets and toys — he only wants his mother and father. Discuss the theme that parental love matters more than material things.' }
            ]
          },
          {
            id: 's9b', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'Meditation is a form of yoga that usually refreshes the mind and helps with _______.', answer: 'stress management (relaxation and stress management)' },
              { id: 'q2', number: '2', text: 'Meditation leads to a better health condition both _______.', answer: 'physically and emotionally' },
              { id: 'q3', number: '3', text: 'Meditation also aids in lessening undesirable feelings and improving _______.', answer: 'self-awareness' },
              { id: 'q4', number: '4', text: 'It is advised that we meditate every day so that it becomes a _______.', answer: 'routine' },
              { id: 'q5', number: '5', text: 'Meditating on a daily basis is beneficial in comfortably tackling _______.', answer: 'exam-related pressure' },
            ]
          },
          {
            id: 's10', title: 'Speaking Activity — Intonation and Presentation', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Practise intonation using different question types from the story (rising/falling patterns); work in pairs and speak them aloud.', answer: 'Model: Yes/No questions rise at the end: "Did you go out?" Wh- questions fall: "Where did you go?" Practise tag questions and statements with proper stress for natural speech.' },
              { id: 'q2', number: 'II', text: 'Make a presentation about a brief personal experience related to taking care of an older person. (Use given prompts.)', answer: 'Model: when my grandmother was unwell, I brought her meals and medicines on time, read newspapers to her, and sat with her in the evening. I learned patience, respect and the value of family care.' }
            ]
          },
          {
            id: 's11', title: 'Writing Task — Article', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "Write an article for your school magazine on the topic 'Our Inspiring Elderly' based on lessons learned from them.", answer: "Our Inspiring Elderly\n\nOur grandparents teach us patience, courage and wisdom through their simple daily lives. They work hard without complaint, forgive quickly, and value relationships over material things. From their stories we learn history, from their habits we learn discipline. We must care for them, listen to them, and let them guide our growing years." }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'I Cannot Remember My Mother',
        slug:  'i-cannot-remember-my-mother',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Work in pairs. Discuss the memories from your early childhood that you still remember clearly. (30–40 words)', answer: 'I remember playing with toys, listening to lullabies, and watching my grandmother cook. These small moments shaped my childhood, giving me comfort and joy, and they remain vivid even though many other memories have faded.' },
              { id: 'q2', number: '2', text: "How do early childhood experiences with parents influence a child's emotions and personality? (30–40 words)", answer: 'Early experiences with parents provide love, security, and guidance. They shape personality by instilling confidence, empathy, and values. Positive interactions help children grow emotionally strong, while neglect can cause insecurity and fear.' },
              { id: 'q3', number: '3', text: 'Match words with meanings.', answer: 'hover → linger or remain near a place\nhum → sing a tune with your lips closed\ncradle → a small bed for a baby\nshiuli → a type of flower (coral jasmine)\nmorning service → rituals conducted in a temple\ngaze → look steadily for a long time' },
            ]
          },
          {
            id: 's2', title: 'Reading for Meaning', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Fill in the blanks — Stanza 1.', answer: 'The poet recalls his mother when he is playing.\nHe remembers a soft tune but not her face.\nThe sound of playthings reminds him of a song she used to sing.\nSetting: indoor' },
              { id: 'q2', number: '2', text: 'Fill in the blanks — Stanza 2.', answer: 'The poet connects his mother with the autumn season.\nHe remembers her through the smell of shiuli flowers.\nThe smell in the temple reminds him of her scent.\nSetting: outdoor' },
              { id: 'q3', number: '3', text: 'Fill in the blanks — Stanza 3.', answer: "The poet feels his mother's gaze watching him from the sky.\nHe imagines her gaze spreading across the blue sky.\nThe sky reflects her love and presence.\nSetting: indoor" },
              { id: 'q4', number: '4', text: 'Identify the senses used in each stanza.', answer: 'Stanza 1: "...the tune of some song that she used to hum while rocking my cradle." → Auditory\nStanza 2: "...the smell of the shiuli flowers floats in the air." → Olfactory\nStanza 3: "...my mother\'s gaze on my face has spread all over the sky." → Visual' },
            ]
          },
          {
            id: 's3', title: 'Poetic Devices', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Give two examples of alliteration.', answer: '"midst of my" and "some song."' },
              { id: 'q2', number: '2', text: 'Give an example of onomatopoeia.', answer: '"hum."' },
              { id: 'q3', number: '3', text: 'How does the poet use imagery? (30–40 words)', answer: "The poet uses vivid sensory images — the tune of a song, the fragrance of shiuli flowers, and the vast blue sky. These create clear pictures in the reader's mind, evoking emotions and memories of his mother." },
              { id: 'q4', number: '4', text: 'Why is the poem enjoyable even without rhyme?', answer: 'Because of its repetition, musical language, and emotional imagery.' },
              { id: 'q5', number: '5', text: 'What is the tone of the poet? Why do you say so?', answer: 'Nostalgic and wistful — the poet gently longs for a mother he cannot picture, and only senses her through fleeting sounds, smells and the sky, giving the poem a tender, reflective tone.' },
              { id: 'q6', number: '6', text: 'What impact does the title of the poem have on the overall mood of the poem?', answer: 'The title sets a mood of quiet loss and longing from the start. It prepares the reader for a reflective, bittersweet poem about sensing an absent mother through memory rather than sight.' },
              { id: 'q7', number: '7', text: "The poet uses 'I cannot remember my mother' as a refrain because _______.", answer: 'it emphasises his sense of loss and longing, while also linking the three stanzas together, each time followed by a sensory memory that lets him feel her presence despite not recalling her face.' },
              { id: 'q8', number: '8', text: "Identify the symbols the poet uses to indicate the memory of his mother's presence.", answer: 'The humming tune (symbol of her voice/love), the shiuli flowers and temple scent (symbol of her presence in nature), and the blue sky (symbol of her eternal, watchful gaze).' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'The poet is reminded of his mother during his ______.', answer: 'play / playtime (\u201cin the midst of my play\u201d)' },
              { id: 'q2', number: '(ii)', text: "What is the primary emotion conveyed by the line 'a tune seems to hover over my playthings'?", answer: 'C. It activates memories of the mother.' },
              { id: 'q3', number: '(iii)', text: "What role does the hovering tune play during the speaker's playtime?", answer: 'It quietly triggers a memory of his mother, drifting into his play without disrupting it, gently reconnecting him to her presence through sound alone.' },
              { id: 'q4', number: '(iv)', text: 'True or False: The poet experiences the tune lingering over playthings only occasionally during playtime.', answer: 'True (\u201conly sometimes in the midst of my play\u201d).' },
              { id: 'q5', number: '(v)', text: "How could the poet feel his mother's presence, even though she isn't there?", answer: "Through sensory memory — a half-remembered tune, the scent of flowers, and the sky's stillness let him feel her presence emotionally, even without a clear visual memory of her." },
            ]
          },
          {
            id: 's4b', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "What does the poet suggest about the stillness of his mother's gaze spreading over the sky?", answer: "B. The sky is a symbolic extension of the mother's presence." },
              { id: 'q2', number: '(ii)', text: "What emotion does the poet associate with the 'stillness' of his mother's gaze?", answer: 'D. a sense of serenity.' },
              { id: 'q3', number: '(iii)', text: "True or False: The poet suggests that the mother's gaze has a tangible and visual effect on the sky.", answer: "False — it is a felt, imagined presence, not a literal, physical effect on the sky." },
              { id: 'q4', number: '(iv)', text: "What is the purpose of likening the mother's gaze to the sky?", answer: "To show that her presence feels vast, boundless and ever-present — as wide and enduring as the sky itself, greater than any single image or memory could hold." },
              { id: 'q5', number: '(v)', text: 'Complete the sentence: The tone of the poet in the given extract is ______ because ______.', answer: "serene and comforted, because imagining his mother's eternal, watchful presence in the sky gives him a sense of peace rather than sorrow." },
            ]
          },
          {
            id: 's4c', title: 'Answer the Following', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "What is the emotional impact of the refrain, 'I cannot remember my mother'?", answer: 'The refrain reinforces the poet\u2019s quiet sense of loss and longing. Its repetition gives the poem a meditative rhythm, mirroring how he keeps returning, again and again, to search for a memory of her.' },
              { id: 'q2', number: '2', text: "Interpret the connection between the poet's mother and (i) shiuli flowers (ii) humming tune.", answer: '(i) The autumn scent of shiuli flowers and temple rituals recalls the fragrance associated with her presence. (ii) The half-remembered tune she hummed while rocking his cradle represents her voice, love and nurturing care.' },
              { id: 'q3', number: '3', text: "What role does nature play in the poet's description of the memory of his mother?", answer: 'Nature — the tune-like breeze, flower scent, and sky — becomes the medium through which the poet senses his mother, standing in for the direct visual memory of her face that he lacks.' },
              { id: 'q4', number: '4', text: "What can be inferred about the poet's perception of the mother–child relationship?", answer: 'It is deep, tender and enduring. Even without conscious memory of her face, the bond survives through sensory and emotional connections, suggesting love that outlasts forgetting and absence.' },
            ]
          },
          {
            id: 's5', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Gather more information on unique flowers of India — where found, appearance, fragrance, and historical significance (e.g., Kurinji/Neelakurinji).', answer: 'Model: Neelakurinji blooms once in 12 years in the Western Ghats, covering hills in blue. Add roses of Kashmir, lotus of northern lakes, and palash of central India. Note where each grows, its colour and fragrance, and its cultural significance.' },
              { id: 'q2', number: 'II', text: 'Collect poems and songs related to family, friends and reminiscences (in English and your own language) and share them.', answer: 'Model: choose a lullaby and a poem on mothers and memories, e.g., Rabindranath Tagore\'s poems. Present the poet, theme and one memorable line, explaining why it is dear to you.' }
            ]
          },
          {
            id: 's6', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'Listen to four short extracts of people expressing childhood memories. Match each statement 1–6 to a speaker (i)–(iv). (Two statements are not needed.)', answer: '1 (seaside memories not the same anymore) → Speaker (iv).\n2 (grandfather\'s encouragement in difficulty) → Speaker (i).\n4 (freedom and outdoor pleasures) → Speaker (ii).\n5 (grandparents and funny tales) → Speaker (iii).\nNot needed: statements 3 and 6.' }
            ]
          },
          {
            id: 's7', title: 'Speaking Activity — My Memory', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Think of an object, song, or place that is memorable for you. Speak about it using the prompts (introduction, sensory details, specific memory, impact, summary).', answer: 'Model: my grandmother\'s wooden cradle. It rocks softly and creaks gently, holding a quilt she stitched. I remember lying in it while she sang lullabies. It taught me love and patience. No treasure is dearer than that cradle of memories.' }
            ]
          },
          {
            id: 's8', title: 'Vocabulary — Sensory Words', type: 'vocabulary',
            questions: [
              { id: 'q1', number: 'I', text: 'Classify the sensory words in the box (visual, auditory, olfactory, tactile).', answer: 'Visual: glowing, gigantic, minuscule, gloomy, vibrant, crimson\nAuditory: hiss, rustle, sizzle, deafening, squeaky, ear-splitting\nOlfactory: aroma, stale, scent, pungent, stinky, fragrant\nTactile: sticky, rough, chilled, fluffy, smooth, slimy, hairy' },
              { id: 'q2', number: 'II', text: 'Fill in the blanks with sensory words in the passage written by Sarojini Naidu (choose from the given list; two words are extra).', answer: '1. scarlet 2. sweetness 3. perfumes 4. shrill 5. scents 6. essence 7. flaming. (Extra, unused words: sizzle, smooth.)' },
              { id: 'q3', number: 'III', text: 'Write numbers against each picture with the phrases that describe them with their sensorial associations. (Six listed phrases.)', answer: 'Model: match each picture to the phrase and its sense, e.g., a rainbow picture → "red and gold" (visual); a night picture → "silence of the dark" (auditory).' }
            ]
          },
          {
            id: 's9', title: 'Writing Task — Diary Entry', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Imagine you went on a school trip to a scenic place that appealed to all your senses. Write a diary entry describing the place and why it was memorable.', answer: 'Dear Diary, Today we visited Manali — snow peaks, chirping birds, the fragrance of pine, and the cool breeze on my face. We played in the snow and shared stories under the stars. Every sight, sound and smell was magical. I will never forget this day.' }
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'ch05', number: 5, code: '0903ch05',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'The World of Limitless Possibilities',
        slug:  'the-world-of-limitless-possibilities',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: "Observations about Sheetal Devi's picture.", answer: 'She is a para-archer, confident and focused, holding her bow with determination. Her posture reflects strength and resilience.' },
              { id: 'q2', number: '2', text: 'Does this personality inspire you? Explain. (30–40 words)', answer: 'Yes, Sheetal Devi inspires me because she overcame physical challenges to achieve excellence in sports. Her success shows that determination and hard work can break barriers, motivating others to pursue their dreams fearlessly.' },
              { id: 'q3', number: '3', text: 'Caption for the picture.', answer: '"Strength Beyond Limits."' },
              { id: 'q4', number: '4', text: 'Complete the Paralympics KWL table.', answer: 'What I know → Paralympics are international games for differently-abled athletes.\nWhat I want to know → How athletes train, India\'s achievements, and the history of Paralympics.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Fact Table — Dr. Deepa Malik.', answer: "1. Diagnosed with spinal tumour at age 29\n2. Result of surgery → Paralysed waist down, wheelchair-bound\n3. Named among top 10 inspirational para-athletes by International Paralympic Committee\n4. First successful Paralympic event → 2016 Rio Games, silver medal in shot-put\n5. List of 'firsts' → (i) First Indian female para-athlete to win Asian Games medal (ii) First Indian female Paralympics medallist across any sport\n6. Awards won → (i) Khel Ratna (ii) Arjuna Award (iii) Padma Shri\n7. Supports → (i) Emotional health and empowerment of women (ii) Providing equipment and awareness for para-sportspersons" },
              { id: 'q2', number: '2', text: 'Fact-Opinion / Cause-Effect classification.', answer: '(1)(i) Fact, (ii) Opinion\n(2) Cause-Effect' },
              { id: 'q3', number: '3', text: 'Identify the pairs.', answer: 'Dr. Malik in Working Group → Fact-Opinion\nParalympics showcase talent → Cause-Effect' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Why is she compared to a caterpillar turning into a butterfly?', answer: 'Because she transformed tragedy into opportunity, creating a new life.' },
              { id: 'q2', number: '(ii)', text: 'Why could she switch comfortably?', answer: 'Because she already loved sports and had been a swimmer.' },
              { id: 'q3', number: '(iii)', text: 'Why was Rio 2016 a breakthrough?', answer: 'Because she won silver and changed perceptions.' },
              { id: 'q4', number: '(iv)', text: "What does 'in hindsight' mean here?", answer: 'B. reflective' },
              { id: 'q5', number: '(v)', text: 'What perception was likely changed?', answer: 'That disability limits ability.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the tone.', answer: 'A and D (appreciative, optimistic)' },
              { id: 'q2', number: '(ii)', text: 'Identify the analogy.', answer: 'preconceived notions : stereotypes' },
              { id: 'q3', number: '(iii)', text: 'True or False, with reason.', answer: 'True — Paralympics showcase abilities and challenge stereotypes.' },
              { id: 'q4', number: '(iv)', text: "What does 'push boundaries' mean here?", answer: 'She overcame limits and achieved beyond expectations.' },
              { id: 'q5', number: '(v)', text: 'Identify the phrase.', answer: '"Paralympics has given me a new lease of life."' },
            ]
          },
          {
            id: 's5', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "How do Dr. Malik's achievements challenge societal perceptions?", answer: 'Her medals prove that disability does not mean inability. She showed that para-athletes can excel internationally, breaking stereotypes and inspiring society to respect and value differently-abled individuals equally.' },
              { id: 'q2', number: '2', text: 'Long-term impact of youth advocacy.', answer: 'Involving youth builds awareness, empathy, and inclusivity. It ensures future generations respect disability rights, creating a society where opportunities are equal and stereotypes are diminished.' },
              { id: 'q3', number: '3', text: 'Appropriateness of the title.', answer: "The title reflects Dr. Malik's attitude of turning setbacks into opportunities. Her journey shows that possibilities are limitless when determination and resilience guide one's path." },
              { id: 'q4', number: '4', text: '"Every setback is an opportunity..." — what lesson does this teach?', answer: 'This teaches everyone to see challenges as chances to grow. Failures can strengthen character, build resilience, and inspire success, not just in sports but in everyday life.' },
              { id: 'q5', number: '5', text: 'Contribution to gender equality.', answer: "Being recognised globally as an inspirational para-athlete highlights women's achievements in sports. It challenges gender bias and encourages equal opportunities for female athletes." },
              { id: 'q6', number: '6', text: "'Ability beyond disability' as a guideline.", answer: 'It motivates para-athletes to focus on strengths rather than limitations. It encourages them to believe in their potential and achieve success despite challenges.' },
              { id: 'q7', number: '7', text: 'Learnings from the interview.', answer: 'I learnt resilience, positivity, and inclusivity. I can implement these by facing challenges with courage, respecting diversity, and supporting others in their journeys.' },
            ]
          },
          {
            id: 's6', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Match phrases with meanings.', answer: 'defy the odds → succeed despite difficulties\na new lease of life → become more energetic/active\nin hindsight → understand after it happened\nbreakthrough moment → significant discovery/achievement\nturn obstacles into stepping stones → use challenges to progress' },
              { id: 'q2', number: '2', text: 'Word cline — order from slow to fast.', answer: 'Crawl → creep → plod → amble → stroll → saunter → walk → jog → run → dart → sprint' },
              { id: 'q3', number: '3', text: 'Identify the function of the modal verbs.', answer: '1. could hear → past ability\n2. couldn\'t be helped → impossibility\n3. should give → obligation\n4. would win → prediction\n(Two extra, unused options: promise, possibility.)' },
              { id: 'q4', number: '4', text: 'Sentences using modal verbs.', answer: 'Could (possibility): It could rain today.\nCould (unreal ability): If I had trained harder, I could have won.\nCould (request): Could you help me, please?\nCould (suggestion): You could try practising every morning.\nCouldn\'t (inability): He couldn\'t lift the heavy box.\nShould (probability): The results should be out by evening.\nShould (advice): You should eat healthy food.\nWould (request): Would you pass the water, please?\nWould (past habit): He would visit us every summer.' },
              { id: 'q5', number: '5', text: 'Direct vs Reported Speech — identify.', answer: 'Given sentences are in Direct Speech. They are Declarative sentences.' },
              { id: 'q6', number: '6', text: 'Change the sentences from Column 1 (Direct Speech) to Column 2 (Reported Speech) and note the changes.', answer: '"You\'ve been listed as one of the ten most inspirational women para-athletes globally..." → The interviewer said that she had been listed as one of the 10 most inspirational women para-athletes globally... (said added; \u2018that\u2019 added; have been→had been; you→she)\n"I love sports and had been a swimmer too, so I decided to switch..." → Dr Malik said that she loved sports and had been a swimmer too, and so she had decided to switch... (said that added; I→she; decided→had decided)\n"Your story is indeed a testament to the power of determination." → The interviewer said that her story was indeed a testament to the power of determination. (your→her; is→was)\n"I believe youth is the voice of tomorrow." → Dr Malik says that she believes youth is the voice of tomorrow. (I→she; believe→believes)' },
              { id: 'q7', number: '7', text: "Change the Siya–Tarun conversation into reported speech.", answer: "1. Siya said that she had watched a documentary on the para equestrian event on television the previous night.\n2. Siya added that it did and that it had been so interesting to watch.\n3. Siya replied that they also had to find and develop their own style of communication with their horse.\n4. Tarun said that he would watch that documentary the following weekend." },
            ]
          },
          {
            id: 's6b', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'The venue for the special assembly is the _______.', answer: 'school auditorium' },
              { id: 'q2', number: '2', text: 'A presentation on inclusion will be made by the _______.', answer: 'Interact Club' },
              { id: 'q3', number: '3', text: 'The dance performance will focus on the themes of _______ and _______.', answer: 'diversity; acceptance' },
              { id: 'q4', number: '4', text: 'A _______ will be conducted by experts who support inclusion.', answer: 'panel discussion' },
              { id: 'q5', number: '5', text: 'The celebration will end with a _______ to encourage team work.', answer: 'song' },
            ]
          },
          {
            id: 's6c', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Interview the Sports Captain (informal) and the Sports Coach (formal) of your school, in pairs, exchanging roles.', answer: 'Informal (to Sports Captain): "Hello! Tell me about yourself and your love for sports. Did you face any challenges? What impressive achievements have you had? What would you say to juniors interested in sports?"\nFormal (to Sports Coach): "Good morning, it is my privilege to have this interaction with you. Could you tell me how your journey in sports began? Could you share the challenges you faced and how you overcame them? You\u2019ve received many accolades — what do these accomplishments mean to you? What advice do you have for aspiring athletes?"' },
            ]
          },
          {
            id: 's7', title: 'Writing Task', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Draft a notice for an Inter-school Athletic Meet.', answer: 'ABC School Sports Club\n\nNOTICE\n\nDate: [Insert Date]\n\nInter-school Athletic Meet\n\nThe Sports Club is organising an Inter-school Athletic Meet. Interested students are requested to register for selection in different events by [insert date]. For details, contact the undersigned.\n\n(Signature)\nSarit\nSports Captain' },
            ]
          },
          {
            id: 's8', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Work in groups of four. Choose any one topic and make a presentation: (i) Two lesser-known Paralympic sports; (ii) Two Paralympians from India. (Follow the specified steps and slide structure.)', answer: 'Model: choose two Paralympic sports — wheelchair fencing and boccia. For each, describe the rules, equipment, and how athletes participate. Then present two Indian Paralympians, e.g., Deepa Malik (shot-put) and Mariyappan Thangavelu (high jump), with their achievements.' },
              { id: 'q2', number: 'II', text: 'Interview the Sports Captain (informal) and the Sports Coach (formal) of your school. Work in pairs and alternate interviewer/interviewee roles.', answer: 'Model: prepare questions on training, discipline, and achievements. Informal (Captain): friendly tone, personal experiences. Formal (Coach): respectful language, professional details. Note down answers and present the summary.' }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Nine Gold Medals',
        slug:  'nine-gold-medals',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Difference between Olympics, Special Olympics, and Paralympics.', answer: 'Olympics → Global sporting event for able-bodied athletes.\nParalympics → International event for athletes with physical disabilities.\nSpecial Olympics → For athletes with intellectual disabilities, focusing on inclusion and participation.' },
              { id: 'q2', number: '2', text: 'Match empathy, sympathy, compassion.', answer: '"I am so sorry for what is happening to you." → Sympathy\n"I can imagine how you feel." → Empathy\n"I understand why you feel low; I will spend time with you so you don\'t feel lonely." → Compassion' },
              { id: 'q3', number: '3', text: 'Words associated with empathy.', answer: 'Understanding, kindness, patience, sensitivity, care, support.' },
            ]
          },
          {
            id: 's2', title: 'Reading for Appreciation', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Match words with meanings.', answer: '1. dashed in the dirt → destroyed\n2. stumbled → step awkwardly, lose balance\n3. staggered → walk/move with difficulty\n4. anguish → extreme pain or suffering\n5. asphalt → hard black substance used for roads' },
              { id: 'q2', number: '2', text: 'Gist of the stanzas.', answer: '1. Stanza 2 → Spectators cheered and waited for final event.\n2. Stanza 4 → One athlete tripped and fell.\n3. Stanza 8 → Race ended with nine athletes holding hands, winning gold medals.\n4. Stanza 3 → Athletes ready at starting line.\n5. Stanza 1 → Athletes trained for months, dreaming of medals.\n6. Stanza 6 → Eight athletes stopped to help the fallen boy.\n7. Stanza 7 → Nine athletes walked hand in hand, banner of Special Olympics.\n8. Stanza 5 → Fallen athlete cried, but something unique happened.' },
              { id: 'q3', number: '3', text: 'Appreciation — poetic devices, imagery, tone, mood, message.', answer: '1. Alliteration → "stumbled and staggered", "dreams... dashed in the dirt."\n2. Visual imagery → (i) athletes at starting line, (ii) boy falling on asphalt, (iii) nine runners holding hands.\n3. Auditory imagery → "The pistol exploded."\n4. Effect of imagery → It makes the poem vivid and emotional, helping readers visualise and feel the moment.\n5. Tone change → From competitive excitement to compassionate unity.\n6. Overall mood → Inspirational and uplifting.\n7. Message → True victory lies in empathy, compassion, and unity, not just winning medals.' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "The phrase 'pulled up on their heels' means that the runners ______.", answer: 'B. stopped running.' },
              { id: 'q2', number: '(ii)', text: 'Mention one character trait common to all the eight other runners.', answer: 'Compassion — they showed genuine care and kindness for a fellow competitor over their own chance to win.' },
              { id: 'q3', number: '(iii)', text: 'What is the tone of the poet in these lines?', answer: 'Admiring and warm, as the poet highlights the runners\u2019 selflessness and kindness with evident approval.' },
              { id: 'q4', number: '(iv)', text: 'How might the young athlete have felt on being helped by the others?', answer: 'Grateful, relieved and encouraged — comforted that his fall did not end the race for him, and touched by his fellow runners\u2019 kindness.' },
              { id: 'q5', number: '(v)', text: 'Would you consider this incident as a turning point in the poem? If yes, why? If no, why not?', answer: 'Yes, because the race changes from a competitive event into an act of collective compassion, redefining what winning means in the poem.' },
            ]
          },
          {
            id: 's3b', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'How did the nine contestants feel when they reached the finishing line together?', answer: 'They felt joyful, proud and united, as shown by their beaming faces and the fact that they finished still holding hands.' },
              { id: 'q2', number: '(ii)', text: 'Why do you think all the nine contestants were given gold medals?', answer: 'Because their act of compassion — stopping to help a fallen competitor — mattered more than winning, embodying the true spirit of the Special Olympics.' },
              { id: 'q3', number: '(iii)', text: 'Complete the sentence: The holding of hands signifies a feeling of ______.', answer: 'unity, togetherness and shared triumph.' },
              { id: 'q4', number: '(iv)', text: "The spectators giving a 'standing ovation' indicates that they were ______.", answer: 'A. amazed.' },
              { id: 'q5', number: '(v)', text: 'Explain the last line of the extract.', answer: 'The line means that the athletes\u2019 joyful faces expressed their compassion and unity more powerfully than any words could — the moment itself was the message.' },
            ]
          },
          {
            id: 's4', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Describe how the setting established in the first two stanzas of the poem creates a vivid atmosphere for the events that follow.', answer: 'The poem opens with athletes gathered after months of training and spectators cheering with excitement. This builds anticipation and a competitive, celebratory atmosphere, making the later act of compassion feel even more powerful and unexpected.' },
              { id: 'q2', number: '2', text: 'How do you think the youngest athlete might have felt when he fell?', answer: 'He likely felt frustration, embarrassment and heartbreak, as his months of training and dreams of winning seemed to collapse in an instant, leaving him in pain both physically and emotionally.' },
              { id: 'q3', number: '3', text: 'Why were the athletes eager to begin the race?', answer: 'They were eager because they had trained for weeks and months, and the race was the culmination of all their hard work and hope of winning gold, silver or bronze.' },
              { id: 'q4', number: '4', text: 'What does the transformation of the hundred-yard dash to a walk symbolise?', answer: 'It symbolises a shift in priority from competition to compassion. Winning individually no longer mattered; supporting a fellow athlete and finishing together became the true goal.' },
              { id: 'q5', number: '5', text: 'How might the poem be different if the focus was solely on individual achievement rather than collective support?', answer: 'It would have been an ordinary sports poem about winning and losing. The collective support instead makes it a moving story about empathy, transforming a race into a lesson on humanity.' },
              { id: 'q6', number: '6', text: "How does the poet's use of language and tone enhance the reader's engagement with the poem?", answer: 'Simple, rhythmic language and a tone that shifts from excitement to compassion draw readers emotionally into the race, making them feel the disappointment, the kindness, and the final joy alongside the athletes.' },
              { id: 'q7', number: '7', text: "What might be the poet's purpose in writing this poem?", answer: 'The poet\u2019s purpose is to show that true victory lies in empathy and unity, encouraging readers to value compassion and helping others over personal achievement and competition.' },
            ]
          },
          {
            id: 's4b', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: 'I', text: "The phrase 'standing ovation' is an adjective\u2013noun collocation. Identify two other similar examples from the poem.", answer: '\u201cOld field\u201d and \u201cyoung boy\u201d (also acceptable: \u201cbeaming faces\u201d).' },
              { id: 'q2', number: 'II', text: 'Complete the table by writing four nouns that collocate with each adjective.', answer: '1. big \u2192 disappointment, failure, surprise, decision\n2. heavy \u2192 rain, traffic, burden, losses\n3. strong \u2192 smell, wind, opinion, coffee\n4. large \u2192 crowd, amount, family, scale\n5. great \u2192 achievement, joy, distance, importance' },
              { id: 'q3', number: 'III', text: 'Choose the correct adjective (positive, significant, youngest, noisy, loud) for the underlined word in each sentence.', answer: '1. littlest \u2192 youngest\n2. smiling (attitude) \u2192 positive\n3. huge (cry) \u2192 loud\n4. terrible (difference) \u2192 significant\n5. gaudy (crowd) \u2192 noisy' },
            ]
          },
          {
            id: 's4c', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Listen to a radio talk about Patrick Gomes, a coach of special athletes. Write true or false.', answer: '1. Patrick Gomes began his career in sports with track events. \u2192 True.\n2. Patrick Gomes has been coaching special athletes for 10 years. \u2192 False (he has coached for over 15 years).\n3. Patrick Gomes does all the household work himself. \u2192 True.' },
              { id: 'q2', number: 'II', text: 'Listen again and choose the correct option for each question.', answer: "1. 'Push your boundaries' wants listeners to \u2192 (i) challenge themselves.\n2. Patrick Gomes is at present a \u2192 (ii) coach of special athletes.\n3. The Special Olympics at Connecticut was a \u2192 (ii) turning point for him.\n4. As a special athlete, he mostly participated in \u2192 (iii) football.\n5. He believes sports is essential because it encourages \u2192 (i) a positive outlook, along with fitness." },
            ]
          },
          {
            id: 's4d', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'In pairs, take turns expressing your points of view on the importance of Special Olympics, its impact, and how to create awareness, using given sentence starters.', answer: 'Model: "Personally, I believe Special Olympics promotes inclusion by giving athletes with intellectual disabilities a platform to shine." / "What is your opinion on how it impacts their confidence?" / "From my perspective, awareness can be created through school events and social media campaigns."' },
            ]
          },
          {
            id: 's4e', title: 'Writing Task', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: "Write three creative slogans on Special Olympics, then design a poster inspired by the poem.", answer: 'Slogans: 1. "Special Olympics: Where Every Finish Line is a Victory." 2. "Abilities Unite, Hearts Ignite." 3. "Together We Run, Together We Win." Poster: include a bold slogan, an illustration of athletes holding hands, key facts about Special Olympics, and a call to action to volunteer or attend.' },
            ]
          },
          {
            id: 's5', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Read the information about Special Olympics 2023 Indian medallists (Ravimathi Arumugam, Aanchal Goyal, Saket Kundu). Find out more about other Indian achievers of Special Olympics.', answer: 'Model: these athletes won medals in events like powerlifting and athletics. Research examples: more Indian Special Olympics achievers at the 2023 Berlin Games — e.g., athletes in swimming and table tennis. Note their events and achievements for a short presentation.' },
              { id: 'q2', number: 'II', text: 'Read the infographic (Olympics/Paralympics). Create an infographic on any sport and present it in class.', answer: 'Model: design an infographic on high jump — history, rules, famous Indian athletes (e.g., Mariyappan Thangavelu), and key records. Include images, simple statistics, and interesting facts in a clear, colourful layout.' }
            ]
          },
        ]
      },
    ]
  },

  {
    id: 'ch06', number: 6, code: '0903ch06',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'Twin Melodies',
        slug:  'twin-melodies',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Identify stringed instruments.', answer: 'Sitar, Sarod, Santoor, Sarangi, Mandolin, Veena, Guitar, Banjo.' },
              { id: 'q2', number: '2', text: 'Do you play a musical instrument? Which one would you choose? (30–40 words)', answer: 'I don\'t play yet, but I would choose the guitar because it is versatile and can be used for classical, folk, and modern music. It allows self-expression and is easy to carry anywhere.' },
              { id: 'q3', number: '3', text: 'Difference in choice of music between children and elders. (30–40 words)', answer: 'Yes, children often prefer fast, energetic beats and film songs, while elders lean towards classical, folk, or devotional music. The difference comes from generational experiences, changing lifestyles, and deeper emotional bonds with tradition.' },
              { id: 'q4', number: '4', text: 'Complete the paragraph with phrases.', answer: '1. winding up 2. wearing a look of distress 3. lost in his thoughts 4. bring it up 5. found words 6. come around 7. sweating on 8. throw a party' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding (Act I)', type: 'reading',
            questions: [
              {
                id: 'q1', number: '1', text: 'Complete the table (setting, children and instruments, speaker/words/reason).',
                answer: "Setting → Iqbal's room; description: small rack, wooden table, posters of Pandit Hariprasad Chaurasia and Shashank Subramanyam.\nChildren and instruments → Iqbal: flute; Avinash: tabla; Peter: keyboard; Shruti: violin.\nAvinash: \"Oh ho! Wow Shruti! ... throw a party!\" → Excited about her fame.\nShruti: \"There is need to worry Iqbal! You don't know papa.\" → Concerned about father's strict views.\nPeter: \"That's the spirit!\" → Encouraging Shruti to be brave."
              },
              { id: 'q2', number: '2', text: 'Do you think Shruti will gather courage to speak to her father? (30–40 words)', answer: 'Yes, because her friends encouraged her to face the situation. She realised hiding would worsen matters and decided to "bite the bullet" and talk to her father at dinner.' },
              { id: 'q3', number: '3', text: "What might be Shruti's father's reaction? Why? (30–40 words)", answer: 'Initially, he would react with disapproval because he values Hindustani classical music and sees fusion as disrespectful. His strictness comes from tradition and fear of losing purity of art.' },
            ]
          },
          {
            id: 's3', title: 'Check Your Understanding (Act II)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Complete the summary.', answer: '1. absent-minded 2. courage 3. disapproval 4. plea 5. firm 6. scolded 7. clash 8. setback' },
              { id: 'q2', number: '2', text: "Will Shruti's father go for rehearsal?", answer: 'No, because he dismissed fusion music as "noise" and refused to attend practice.' },
              { id: 'q3', number: '3', text: 'Will Shruti and her parents understand one another? (30–40 words)', answer: "Yes, eventually. Though there is a clash between tradition and modernity, Shruti's sincerity and her mother's support help her father realise that fusion can still respect classical roots." },
            ]
          },
          {
            id: 's4', title: 'Check Your Understanding (Act III)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Identify true statements.', answer: '1. True\n2. True\n3. False\n4. False (he broke tradition, choosing violin over vocals)\n5. True\n6. True' },
            ]
          },
          {
            id: 's5', title: 'Critical Reflection: Extract 1 (Shruti & Iqbal)', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "Shruti's situation.", answer: 'D. in a dilemma' },
              { id: 'q2', number: '(ii)', text: "What does 'right way' mean here?", answer: "A respectful manner that won't hurt her father's feelings." },
              { id: 'q3', number: '(iii)', text: 'Describe the generational gap.', answer: 'Father values tradition, Shruti wants to explore modern fusion.' },
              { id: 'q4', number: '(iv)', text: "What did Iqbal's words assure her of?", answer: 'That her father would eventually understand.' },
              { id: 'q5', number: '(v)', text: 'Identify the phrase.', answer: '"of any worth should play."' },
            ]
          },
          {
            id: 's6', title: "Critical Reflection: Extract 2 (Nabin's acceptance)", type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Bridge between what?', answer: 'B. traditional values and modern expressions.' },
              { id: 'q2', number: '(ii)', text: "What does 'lost' mean here?", answer: 'Losing musicality and losing connection with family.' },
              { id: 'q3', number: '(iii)', text: 'Which word is not conveyed?', answer: 'Duty.' },
              { id: 'q4', number: '(iv)', text: "What can we infer?", answer: "Shruti's future will be bright, with her father's trust and support." },
              { id: 'q5', number: '(v)', text: 'Identify the phrase.', answer: '"Each bay, its own wind."' },
            ]
          },
          {
            id: 's7', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "Justify the title 'Twin Melodies'.", answer: 'The play explores two melodies — tradition and modernity. Shruti represents fusion, while her father represents classical purity. Their reconciliation shows that both can coexist, creating harmony in diversity.' },
              { id: 'q2', number: '2', text: 'Perspectives of Peter, Iqbal, and Avinash.', answer: 'Peter is practical, suggesting honesty. Iqbal is optimistic, believing parents will understand. Avinash is humorous, downplaying scolding. Their attitudes show support for Shruti and value for courage.' },
              { id: 'q3', number: '3', text: "Analyse Nabin Sharma's character.", answer: 'Nabin is strict, traditional, and values Hindustani classical music. Initially rigid, he later realises fusion can respect tradition. His evolution shows growth, humility, and acceptance of artistic freedom.' },
              { id: 'q4', number: '4', text: "Shruti's internal conflict.", answer: "Shruti struggles between duty to her father's values and her passion for fusion music. This conflict highlights generational differences and the challenge of balancing respect for family with personal dreams." },
              { id: 'q5', number: '5', text: 'Evaluate the conclusion.', answer: "The conclusion is effective. Nabin accepts Shruti's choice after witnessing her performance. It realistically shows reconciliation through understanding and respect, resolving the conflict positively." },
              { id: 'q6', number: '6', text: 'Role of cultural diversity.', answer: 'Cultural diversity enriches the storyline by blending Indian classical with Western music. It highlights how different traditions can coexist, creating new art forms and teaching acceptance.' },
            ]
          },
          {
            id: 's8', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: "'Aside' usage.", answer: '(iv) All — shows thoughts, links audience, reveals feelings.' },
              { id: 'q2', number: '2', text: 'Non-lexical fillers.', answer: '1 → err\n2 → hmmm\n3 → arrgh\n4 → whew' },
              { id: 'q3', number: '3', text: 'Match music words.', answer: '1. rhythm → pattern of beats\n2. tempo → speed of music\n3. bass → lowest tone\n4. baritone → male voice between high and low\n5. cacophony → unpleasant mixture of sounds\n6. pitch → high/low frequency of sound\n7. scale → series of notes moving up/down' },
              { id: 'q4', number: '4', text: 'Meanings of phrases.', answer: '1. drown your individual style → lose uniqueness\n2. sense of musicality → artistic ability in music\n3. go down the drain → wasted effort' },
              { id: 'q5', number: '5', text: 'Exclamatory → Declarative.', answer: '1. Shruti exclaimed that she enjoyed performing the piece.\n2. Nabin exclaimed with pride that the performance was soulful and wonderful.' },
              { id: 'q6', number: '6', text: 'Reported speech.', answer: '2. Iqbal exclaimed that it was an incredible achievement and he couldn\'t believe they had pulled it off.\n3. Shruti\'s mother applauded that each note was executed perfectly and the performance was flawless.\n4. Iqbal joked that he had a little bit of scolding for breakfast every day.\n5. Shruti promised her mother she wouldn\'t hide again.\n6. Avinash exclaimed that Shruti was a sensation and suggested she throw a party.' },
              { id: 'q7', number: '7', text: 'Dialogue (Asma & Deepa).', answer: '1. had a unique experience at the art studio.\n2. she had accidentally spilled paint all over her canvas.\n3. the painting looked better than her original plan.\n4. it was incredible.' },
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Study the bracketed stage directions and answer questions about their use.', answer: 'Model: stage directions describe setting, movements and emotions (e.g., \"sweating on his forehead\" shows tension). They help actors perform and readers visualise the scene.' },
              { id: 'q2', number: 'II', text: 'Read about the Recycled Orchestra of Cateura, Paraguay.', answer: 'Model: the orchestra of Cateura makes instruments from recycled rubbish — oil drums as cellos, pipes as flutes. It gives children of the landfill town music, dignity and hope, showing how creativity can transform waste.' },
              { id: 'q3', number: 'III', text: 'Find out indigenous musical instruments in your region.', answer: 'Model: in many parts of India, e.g., dhol (drum), ektara (single-string), shehnai (wind), and thavil (percussion). Note the material, how it is played, and the occasion it is used for.' },
              { id: 'q4', number: 'IV', text: 'In groups of five, select objects around you to create a rhythm; present in class.', answer: 'Model: use desks, bottles, and rulers to make beats — e.g., tap a steady dha-dhin rhythm. Practise the pattern together and present it, varying speed and volume.' },
              { id: 'q5', number: 'V', text: 'Read the book Rigmarole and Other Plays by Sai Paranjpye and enjoy the humour and wit.', answer: 'Model: the anthology has short funny plays on everyday situations. Read one play, note its humorous dialogues, and share your favourite comic moment with the class.' }
            ]
          },
          {
            id: 's10', title: 'Listen and Respond (The Yazh)', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Look at the given stringed musical instruments and decide which one could be the yazh [yāḻ].', answer: 'Model: the yazh is an ancient Tamil harp — a curved string instrument with a boat-shaped resonator. Choose the picture showing a harp-like instrument with many strings.' },
              { id: 'q2', number: 'II', text: 'Listen to a musician describing the yazh and check if your choice was correct.', answer: 'Model answer: after listening, confirm whether the instrument you chose matches the description (harp-like, strings over a resonator, played with fingers).' },
              { id: 'q3', number: 'III', text: 'Listen again. Complete the notes with not more than three words (type, design, resonator, design variety).', answer: 'Model answer: type — ancient harp; design — curved with strings; resonator — boat-shaped wooden body; variation — smaller/larger sizes in different regions.' }
            ]
          },
          {
            id: 's11', title: 'Speaking Activity — Stress and Intonation', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Stress and intonation exercises: pick lines from the play and speak them aloud focusing on stress/intonation as illustrated. Practise other sentences similarly.', answer: 'Model: say "Oh WOw! Shruti!" with a rising, excited tone. Emphasise key words like WOW and GREAT. Practise questions with a rising pitch at the end, and statements with a falling pitch for confidence.' }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'A Friend Found in Music',
        slug:  'a-friend-found-in-music',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'What kind of music do you prefer to listen to — vocal or instrumental?', answer: 'Model: I prefer vocal music because the lyrics let me connect emotionally with the singer\u2019s feelings and story, in addition to enjoying the melody.' },
              { id: 'q2', number: '2', text: 'Name your favourite musician(s).', answer: 'Model: A. R. Rahman — his compositions blend Indian classical and modern styles beautifully.' },
              { id: 'q3', number: '3', text: 'Give reasons for your choice.', answer: 'Model: I admire the emotional depth and originality of the music, and how it stays with me long after I finish listening.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: 'I', text: "Complete the poet's diary about her feelings on music, filling blanks with words from the poem.", answer: '1. shore\n2. rhythm\n3. core\n4. therapy\n5. spirits\n6. cheerful\n7. needed\n8. care' },
            ]
          },
          {
            id: 's3', title: 'Let Us Appreciate the Poem', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: "The phrase 'moves me' in 'That moves me to the core' is an example of ______.", answer: 'a metaphorical/figurative use of the verb \u2018move\u2019 \u2014 here it does not mean physical movement but suggests music stirring the poet\u2019s deepest emotions.' },
              { id: 'q2', number: '2', text: 'List the metaphors for music and rewrite them as similes.', answer: 'Music is the ocean \u2192 Music is as vast and pulling as the ocean.\nMusic is the rhythm \u2192 Music is like a rhythm that stirs my core.\nMusic is the therapy \u2192 Music is as healing as therapy.\nMusic is the needed friend \u2192 Music is as comforting and dependable as a needed friend.' },
              { id: 'q3', number: '3', text: 'What is the rhyme scheme of the poem? What impact does it have?', answer: 'ABCB in each stanza (e.g., shore/core; blue/through; there/care). This gentle, song-like rhyme gives the poem a soothing, musical flow that mirrors its subject.' },
              { id: 'q4', number: '4', text: "What is the poet's purpose in using the word 'music' repetitively?", answer: 'The repetition emphasises how central and ever-present music is in the poet\u2019s life, functioning almost like a refrain, reinforcing its comforting, constant presence.' },
              { id: 'q5', number: '5', text: 'What is the message the poet wishes to convey through the poem?', answer: 'That music is a source of comfort, healing and companionship, supporting us emotionally, especially in sad or lonely moments, like a true and dependable friend.' },
              { id: 'q6', number: '6', text: 'Identify the mood of the poem.', answer: '(ii) thoughtful — the poet reflects gratefully and sincerely on music\u2019s comforting role in her life.' },
              { id: 'q7', number: '7', text: 'Give evidence from the poem to support that the speaker is the poet herself.', answer: 'The poem is written in the first person (\u2018me\u2019, \u2018I\u2019) expressing personal feelings, and is signed with the poet\u2019s own name, Bryanna T. Perkins, suggesting these are her genuine reflections.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "Complete: the phrase 'feel blue' indicates ______.", answer: 'feeling sad or low.' },
              { id: 'q2', number: '(ii)', text: 'Identify the line which shows music makes the poet happy.', answer: '"Music lifts my spirits / To make sure I pull through."' },
              { id: 'q3', number: '(iii)', text: 'What does the last line of the extract signify?', answer: '"To make sure I pull through" signifies that music gives her the strength and resilience to overcome difficult times.' },
              { id: 'q4', number: '(iv)', text: "True or False: Music plays a vital role in the poet's life.", answer: 'True.' },
              { id: 'q5', number: '(v)', text: 'Select the central idea of the extract.', answer: 'A. Music brings comfort during sadness.' },
            ]
          },
          {
            id: 's4b', title: 'Answer the Following', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "How is music able to move the poet 'to the core'?", answer: 'Music resonates deeply with her innermost emotions, touching feelings that ordinary words cannot reach, creating a profound and personal emotional connection within her.' },
              { id: 'q2', number: '2', text: "Why does the poet compare music to a 'needed friend'?", answer: 'Like a true friend, music is always there for her — comforting her, lifting her spirits, and offering companionship, especially at times when no one else seems to care.' },
              { id: 'q3', number: '3', text: "Explain the poet's attitude towards music.", answer: 'The poet is deeply appreciative and affectionate towards music, seeing it as an essential, dependable source of comfort, healing and emotional support in her life.' },
              { id: 'q4', number: '4', text: 'Support the opinion that this poem has a universal appeal.', answer: 'Everyone, across cultures and ages, experiences music\u2019s comforting and uplifting power, so the poem\u2019s message of finding solace in music feels relatable to readers everywhere, not just the poet.' },
              { id: 'q5', number: '5', text: 'Compare your experience of music with the feelings expressed in the poem.', answer: 'Model: Like the poet, I find music comforting during stress — listening to songs calms my mind and lifts my mood, echoing the poem\u2019s central idea of music as a needed friend.' },
            ]
          },
          {
            id: 's5', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: 'I', text: 'Classify the phrases as positive or negative emotions, then fill blanks with the correct word.', answer: 'Positive: lifts my spirits, most cheerful. Negative: feel blue.\n1. nostalgia\n2. anguish\n3. melancholy\n4. jubilant' },
              { id: 'q2', number: 'III', text: "Match the phrasal verbs (move out, move in, move on, move over, move along, move off) to their meanings.", answer: '1. move out \u2192 (v) leave a place where one has been living\n2. move in \u2192 (ii) begin living in a new home/place\n3. move on \u2192 (i) start doing/discussing something new\n4. move over \u2192 (vi) shift position to make space for someone/something\n5. move along \u2192 (iv) go to a new position, to make room for other people\n6. move off \u2192 (iii) start moving; to leave' },
              { id: 'q3', number: 'IV', text: "Create phrasal verbs from 'put', 'get', 'look', 'break', find their meanings, and use them in sentences.", answer: 'put off (postpone): We had to put off the picnic due to rain.\nget over (recover from): It took her a week to get over the flu.\nlook after (take care of): She looks after her younger brother.\nbreak down (stop working / lose emotional control): The car broke down on the highway.' },
            ]
          },
          {
            id: 's6', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Before you listen, read the questions and guess the responses.', answer: 'Model predictions before listening — to be checked against the actual conversation.' },
              { id: 'q2', number: 'II', text: 'Listen to the conversation and check/rectify your answers.', answer: '1. How are the speakers connected? \u2192 (i) parent\u2013child.\n2. Where is the conversation taking place? \u2192 (i) music centre.\n3. Which instrument is the reason for the problem? \u2192 (ii) santoor.\n4. What is the problem? \u2192 (ii) irregularity of the music class (the santoor teacher visits only twice a week).\n5. Unsuccessful solution tried? \u2192 (iii) watching videos about playing the instrument.\n6. Final decision? \u2192 (iii) purchase the musical instrument (meanwhile, borrowing one to practise at home).' },
            ]
          },
          {
            id: 's7', title: 'Speaking Activity — Role Play', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Work in groups of four and choose a role each (Music teacher; Student 1; Student 2; Parent). Present a role play in class about joining music classes.', answer: 'Model: Student asks, "May I join the music class?" Teacher says classes are on Saturday. Parent asks about timings and fees. Student promises to balance studies. End with agreement and happy expressions.' }
            ]
          },
          {
            id: 's8', title: 'Writing Task — Invitation Letter', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Your school is organising a musical evening on 21 June, World Music Day. You are presenting a Sitar recital. Draft an invitation letter requesting your grandparents to attend.', answer: "Dear Dada-Dadi, Our school is organising a musical evening on 21 June (World Music Day) at 6 p.m. in the school auditorium. I am presenting a sitar recital and would be honoured if you could attend. Your presence will make this day special for me. Your loving grandson, Aryan." }
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Find out how music is used as an alternative therapy today (Raga Chikitsa context).', answer: 'Model: music therapy uses melodies and rhythms to reduce stress, pain and anxiety. In Raga Chikitsa, different ragas are linked to moods — e.g., raga Yaman for calmness. Hospitals and wellness centres use it for healing.' },
              { id: 'q2', number: 'II', text: 'Speak to your music teacher and find out about the origin of the seven swaras of Indian classical music.', answer: 'Model: the seven swaras (Sa Re Ga Ma Pa Dha Ni) are said to originate from sounds of birds and animals — e.g., peacock (Sa), bull (Re), goat (Ga). They form the basis of Indian classical music scales.' },
              { id: 'q3', number: 'III', text: 'Collect poems/songs about music (English and your own language) and compile them.', answer: 'Model: collect songs praising music, e.g., lyrics about rain, lullabies, or devotional bhajans. For each, note the theme, the musical feeling it creates, and compile them into a small anthology.' },
              { id: 'q4', number: 'IV', text: "Read and enjoy the poem 'Music' by Walter de la Mare.", answer: 'Model: the poem celebrates how music transforms perception, making the earth\u2019s beauty more vivid and summoning visions of water nymphs (Naiads). Note its imagery of enchantment and share which lines you found most musical.' }
            ]
          },
        ]
      },
    ]
  },
  {
    id: 'ch07', number: 7, code: '0903ch07',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'Carrier of Words',
        slug:  'carrier-of-words',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Which profession do they belong to?', answer: 'They are postmen/postal workers.' },
              { id: 'q2', number: '2', text: 'Do they face difficulties? (30–40 words)', answer: 'Yes, they face harsh weather, long distances, and heavy loads. In deserts or remote areas, they walk miles in extreme heat or cold, making their duty physically exhausting but still essential.' },
              { id: 'q3', number: '3', text: 'How does their profession affect people?', answer: 'It connects families, delivers news, money orders, and builds trust.' },
              { id: 'q4', number: '4', text: "How can 'words' be carried?", answer: 'Through letters, books, speeches, songs, and digital messages.' },
              { id: 'q5', number: '5', text: 'Who could be a carrier of words?', answer: 'Postmen, writers, teachers, singers, and journalists.' },
              { id: 'q6', number: '6', text: 'Means to stay connected.', answer: 'Letters, phones, internet, social media, and face-to-face communication.' },
              { id: 'q7', number: '7', text: 'Fill passage with words.', answer: '1. signals 2. dunes 3. hamlets 4. defying 5. slumped 6. devoid' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding (Part I)', type: 'reading',
            questions: [
              {
                id: 'q1', number: '1', text: 'Identity card for Khetaram.',
                answer: 'Name → Khetaram\nPosition → Gramin Dak Sewak (GDS)\nEmployer → India Post\nOfficial address → Somarad Branch Post Office, Barmer district, Rajasthan\nMode of transport → On foot (sometimes bus or BSF lift)\nKey responsibilities → Deliver letters, money orders, connect remote hamlets, read/write letters for villagers.'
              },
              { id: 'q2', number: '2', text: 'Why did Khetaram take up this job?', answer: 'Because farming in the desert was insufficient. The job gave him assured income to support his family.' },
              { id: 'q3', number: '3', text: 'How would he feel about the task? (30–40 words)', answer: 'He feels proud yet exhausted. Despite extreme heat and long distances, he values his role as a trusted link for villagers. His dedication shows resilience and commitment to service.' },
            ]
          },
          {
            id: 's3', title: 'Check Your Understanding (Part II)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Situations and reasons.', answer: 'Temperature 50°C → State holiday declared.\nKhetaram can dwell on thresholds → Because villagers ask him to read/write letters.\nBSF gave him a lift → Because he delivered their dak and was offered tea.' },
              { id: 'q2', number: '2', text: 'Why was jaggery offered?', answer: 'As a simple token of gratitude and celebration when he brought good news of births or weddings.' },
              { id: 'q3', number: '3', text: 'How would phone lines help? (30–40 words)', answer: 'Phone lines would reduce his physical burden by allowing faster communication across the desert. He could serve as a Gramin Sanchar Sewak, carrying mobile phones along with post, making his work lighter and more efficient.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 1 (Famine & bajra)', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Why does one crop make little difference?', answer: 'Because it cannot feed a family for long.' },
              { id: 'q2', number: '(ii)', text: 'Why is famine a way of life?', answer: 'Because droughts are frequent in the desert.' },
              { id: 'q3', number: '(iii)', text: 'Why did he have to take the job?', answer: 'To earn money for survival.' },
              { id: 'q4', number: '(iv)', text: 'Identify the analogy.', answer: 'Other families: money orders :: Khetaram: GDS job.' },
              { id: 'q5', number: '(v)', text: 'What does a good year mean?', answer: 'Enough rain for one crop.' },
            ]
          },
          {
            id: 's5', title: 'Critical Reflection: Extract 2 (Death letters)', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the correct option.', answer: 'B. Sender of the letter.' },
              { id: 'q2', number: '(ii)', text: 'Why did he read twice?', answer: 'To ensure clarity and respect for the family.' },
              { id: 'q3', number: '(iii)', text: 'Identify his philosophy.', answer: 'Bad news must be destroyed; he tore the letter after reading.' },
              { id: 'q4', number: '(iv)', text: 'True or False.', answer: 'False — his action matched his belief.' },
              { id: 'q5', number: '(v)', text: 'Identify his temperament.', answer: 'Sensitive and compassionate.' },
            ]
          },
          {
            id: 's6', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Why is the GDS role invaluable?', answer: 'Because they deliver letters and money orders to remote, inaccessible areas, connecting families and ensuring trust in the postal system.' },
              { id: 'q2', number: '2', text: 'Difference between India Post and the British system.', answer: 'The British system served administration; India Post serves the entire population, ensuring inclusivity and access.' },
              { id: 'q3', number: '3', text: 'People trusted GDS — two instances.', answer: 'Villagers entrusted savings to post offices; they asked GDS to read/write letters, showing confidence in their honesty.' },
              { id: 'q4', number: '4', text: 'Why grateful to continue after 60?', answer: 'Because the job gave him livelihood and dignity even in old age, ensuring survival for his family.' },
              { id: 'q5', number: '5', text: 'Why tribute to people like Khetaram? (30–40 words)', answer: "Because they serve tirelessly in extreme heat and isolation, connecting remote hamlets with the outside world. Their quiet dedication sustains social bonds and trust, making them the unsung heroes of India's communication system." },
            ]
          },
          {
            id: 's7', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Match phrases and use in sentences.', answer: "crumbles into sand → disappears in desert — The road crumbles into sand after the village.\ngive a new lease of life → chance to continue living — This job gave him a new lease of life.\nturn into a trickle before drying out → lessen gradually then stop — The river turned into a trickle before drying out.\nbearing words across desolate geography → carrying letters to remote areas — He kept bearing words across desolate geography." },
              { id: 'q2', number: '2', text: 'Alliteration & metaphor.', answer: 'Alliteration → "scorching summer winds and swirling sandstorms."\nMetaphor → "walking sandman" (describing him covered in sand).' },
              { id: 'q3', number: '3', text: 'Match words.', answer: 'arid → farmland without much yield\nconcessional → interest rate for farmers\ngaunt → farmer waiting for rains\nremote → corner of the world\ndesolate → desert stretching far and wide' },
              { id: 'q4', number: '4', text: 'Present perfect tense exercise.', answer: '1. have got 2. has collected 3. have studied 4. have begun 5. has inspired' },
              { id: 'q5', number: '5', text: 'Passive voice — complete the paragraph about Khetaram\'s advice (blanks A\u2013E).', answer: 'A. will be needed\nB. will be expected\nC. must be written\nD. will be asked\nE. should be worn\n(Full sentence sense: "...reading clearly A. will be needed, as you B. will be expected to read out the letters by some of the villagers. Words C. must be written neatly as you D. will be asked to draft replies by some villagers. Full-sleeved shirts and trousers E. should be worn to protect yourself from the heat.")' },
            ]
          },
          {
            id: 's7b', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Listen to a girl talking about an event. Fill in the blank with the suitable word: The speaker concluded her talk with a _______ (suggestion/request/advice).', answer: 'request (she says, "I request all the students to actively participate...").' },
              { id: 'q2', number: 'II', text: 'Listen again and choose the correct option.', answer: "1. Occasion: \u2192 (iii) Indian Postal Day.\n2. India Post is famous for having the most extensive network \u2192 (ii) in the world.\n3. Letter writing is being revived as this art form has been \u2192 (iii) forgotten.\n4. Part of the letter writing carnival \u2192 (i) calligraphy and graphology.\n5. What the postal department will add \u2192 (i) interactive demonstrations." },
            ]
          },
          {
            id: 's7c', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'In groups of four, each represents a postcard, inland letter, envelope, or money order form, arguing logically why they are the most important, using given discussion points (utility, cost-effectiveness, privacy, space to write, possibility of enclosures) and verbal cues.', answer: 'Model (envelope): "It seems to me that an envelope is most important because it offers privacy and enclosure space \u2014 I can seal letters, photos or documents inside, which a postcard cannot offer." (postcard counters): "That\u2019s one way to look at it, but a postcard is far more cost-effective and needs no extra covering."' },
            ]
          },
          {
            id: 's7d', title: 'Writing Task \u2014 Condolence Message', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: "On behalf of your parents, draft an imaginary condolence message for your aunt on the recent passing away of her father.", answer: "Dear Aunt, We are deeply saddened to hear about the passing of your father. Please accept our heartfelt condolences. We extend our deepest sympathy to you and your family in this hour of grief. May God grant eternal peace to the departed soul and give your family the courage to bear this loss. Yours sincerely, [Parents' names]" },
            ]
          },
          {
            id: 's8', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'The unique \'Daakroom\' carnival (information).', answer: 'Model: the \'Daakroom\' carnival is a unique event (likely a postal-themed exhibition or fair) that celebrates the postal service and stamp-collecting heritage. Students can read about it and share interesting facts with the class.' },
              { id: 'q2', number: 'II', text: 'Philately tasks: 1. Study the postage stamps given and discuss who/what they depict. 2. In groups of five, find information about stamps in categories (personalities, celebrations, centenaries, nature, our heritage) and prepare a class board on \'Philately — Upholding Our Heritage\'.', answer: 'Model: study the given stamps and identify the personalities, events, or themes they depict. Then, in groups, research stamps in each category and create a class display board titled \'Philately — Upholding Our Heritage\', showing how stamps preserve history, culture, and achievements.' }
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Words',
        slug:  'words',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Why are words important? Can we communicate without words? (30–40 words)', answer: 'Words are important because they express thoughts, emotions, and ideas clearly. Yet communication can happen without words through gestures, facial expressions, music, or art. These non-verbal forms also convey meaning and connect people deeply.' },
              { id: 'q2', number: '2', text: 'Fill the blanks in the poem summary.', answer: '1. depart 2. pilgrim 3. weeds 4. joy 5. lonely 6. world 7. fruit' },
            ]
          },
          {
            id: 's2', title: 'Reading for Appreciation', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Rhyming words and rhyme scheme.', answer: 'Rhyming sets: care/air, weeds/needs, impart/heart, cheer/dear.\nRhyme scheme: ABAB in most stanzas.' },
              {
                id: 'q2', number: '2', text: 'Identify poetic devices.',
                answer: '"words, like summer birds, depart" → Simile (words compared to birds flying away).\n"heart, a pilgrim upon earth" → Metaphor (heart compared to a traveller).\n"words ... as little worth as weeds" → Metaphor (worthless words compared to weeds).\n"If words could satisfy the chest ... Oft satisfy the least!" → Irony (words fail to satisfy).\n"The world might hold a feast" → Hyperbole (exaggeration of satisfaction).\n"plants that make a gaudy show ... blossom to the root" → Metaphor (empty words compared to flashy plants).\n"cannot grow one particle of fruit" → Symbolism (words without meaning produce no value).'
              },
              { id: 'q3', number: '3', text: 'Which words are repeated? Why?', answer: 'Words like "heart," "joy," "worth," and "dear" are repeated to emphasise the contrast between empty words and sincere ones, highlighting the importance of truth and simplicity.' },
              { id: 'q4', number: '4', text: 'Emotions in stanzas ending with exclamation marks.', answer: 'Stanza 4 → frustration\nStanza 5 → admiration\nStanza 6 → disillusionment' },
              { id: 'q5', number: '5', text: 'Identify the hyperbole in "If words could satisfy the chest, The world might hold a feast." Then complete the sentences with hyperboles using the hints given.', answer: 'The hyperbole: "the world might hold a feast" (a wild exaggeration of universal celebration).\n1. I have tonnes of things to do this weekend.\n2. The player missed the basket by a mile.\n3. My mother is so tired that she can sleep for a decade.\n4. I will be back in two seconds.' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "Why has the poet referred to the heart as 'a pilgrim'?", answer: 'Because, like a pilgrim journeying in search of something sacred, the heart travels through life seeking genuine comfort and meaning, which mere words often fail to provide.' },
              { id: 'q2', number: '(ii)', text: "When would a heart 'need' words?", answer: 'The heart needs words at times of sorrow, loneliness or distress, when it seeks comfort, reassurance or connection from others.' },
              { id: 'q3', number: '(iii)', text: 'Complete: The words are like weeds because ______.', answer: 'like weeds, they grow easily and in abundance but serve no real purpose or value, offering nothing of true worth to the heart.' },
              { id: 'q4', number: '(iv)', text: "Mention two emotions the heart might be experiencing when it finds words to be of 'little worth'.", answer: 'Disappointment and loneliness — the heart feels let down that words cannot offer the comfort it seeks, deepening its sense of isolation.' },
              { id: 'q5', number: '(v)', text: 'What do these lines suggest about the nature of communication?', answer: 'They suggest that communication through words alone is often insufficient and superficial; true comfort comes from sincerity and connection, not mere quantity of words.' },
            ]
          },
          {
            id: 's3b', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "How can words 'satisfy the chest'?", answer: 'Words can satisfy the chest (the heart/emotions) when they are sincere and meaningful, genuinely comforting and fulfilling an emotional need.' },
              { id: 'q2', number: '(ii)', text: "How can words be 'summoned to the test'?", answer: 'Words are \u2018tested\u2019 when we actually rely on them in moments of real need, to see whether they can truly comfort or satisfy us.' },
              { id: 'q3', number: '(iii)', text: "What does 'the world' holding 'a feast' imply?", answer: 'It implies universal celebration and joy — that if mere words could truly satisfy, the whole world would be joyfully content.' },
              { id: 'q4', number: '(iv)', text: 'Complete: The poet mentions that words satisfy the least because ______.', answer: 'they are often empty and insincere, sounding impressive without carrying real emotional substance or truth.' },
              { id: 'q5', number: '(v)', text: "Select the word that does NOT mean the same as 'oft'.", answer: 'A. always (oft/often means \u2018frequently\u2019 or \u2018usually\u2019, not \u2018always\u2019).' },
            ]
          },
          {
            id: 's3c', title: 'Answer the Following', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "What is the comparison that the poet draws between words and 'empty air'?", answer: 'The poet compares fleeting, insincere words to summer birds that depart, leaving only empty air behind — suggesting words vanish quickly without leaving any lasting comfort or substance.' },
              { id: 'q2', number: '2', text: 'According to the poet, meaningful words are more precious than a lot of them. Explain.', answer: 'The poet believes a few sincere, truthful words touch the heart more deeply than countless empty ones, showing that quality and sincerity matter far more than quantity in communication.' },
              { id: 'q3', number: '3', text: "Do you agree that the poet presents contrasting ideas related to 'words' in the poem? If yes, why? If no, why not?", answer: 'Yes, the poet contrasts empty, insincere words (like weeds) with a few truly sincere words (which bring deep joy), highlighting that value lies in sincerity, not abundance.' },
              { id: 'q4', number: '4', text: "The theme of loneliness hovers over the poem. Support this statement with examples from the text.", answer: "The heart is called a 'pilgrim upon earth', wandering and seeking comfort; a 'lonely home' is mentioned as cheered by few precious words, showing how isolation and longing run through the poem." },
              { id: 'q5', number: '5', text: 'How does the poet convey the superficial nature of words? What ought to be done to address this?', answer: 'The poet uses images like weeds and gaudy, fruitless plants to show words can look impressive but lack substance. To address this, we should speak fewer, more sincere and truthful words.' },
            ]
          },
          {
            id: 's3d', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: 'I', text: 'Match the figurative phrases with their meanings and use each in a sentence.', answer: 'satisfy the heart \u2192 makes one happy\ndepart and leave but empty air \u2192 makes no impact\nhosts of words \u2192 many words\nnever touch the heart \u2192 does not appeal to our emotions\nwins its sunny way \u2192 cheers up a person\nplants that cannot grow fruit \u2192 there is no outcome' },
              { id: 'q2', number: 'II', text: 'Create a Word Map (meaning, synonym, antonym, sentence, sketch) for words from the poem: depart, pilgrim, cheer, word, sunny, satisfy, heart.', answer: 'Model (pilgrim): Meaning \u2014 a person who travels to a sacred place; Synonym \u2014 traveller; Antonym \u2014 settler; Sentence \u2014 The pilgrim walked many miles to reach the temple; Sketch \u2014 a figure with a walking stick and bag.' },
            ]
          },
          {
            id: 's3e', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Listen to a conversation between a girl and a boy about a declamation contest. Mark four statements from 1–6 that are true.', answer: 'True: 1 (the girl was excited to participate), 2 (the boy asked, somewhat doubtfully, whether the topic could lead to an engaging talk), 4 (the boy was unaware of the role of body language, asking "Body language? How?").\nFalse: 3 (the girl actually says people WANT to share and relate experiences, not keep them to themselves), 5 (the girl stresses body language has a SIGNIFICANT role, not an insignificant one). The four true statements are 1, 2, 4 and 6 (by elimination, since 3 and 5 directly contradict the dialogue).' },
            ]
          },
          {
            id: 's3f', title: 'Speaking Activity', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Read the given quotations on words, select the one you like most, and explain your choice with a connected personal experience.', answer: 'Model: "I chose Gautama Buddha\u2019s quotation, \u2018Whatever words we utter should be chosen with care...\u2019 because it reminds me that words have real power to influence others, for good or ill. Once, a careless comment I made hurt a friend, and I later learnt to think before speaking."' },
            ]
          },
          {
            id: 's3g', title: 'Writing Task — Essay', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: 'Write an essay on any one quotation from the Speaking Activity, following the given paragraph-division guidelines.', answer: 'Model essay on "Whatever words we utter should be chosen with care..." (Gautama Buddha): Introduction \u2014 mention the quotation, speaker and why it appealed to me. Body \u2014 explain how words influence relationships and give a personal example of careless vs. careful speech. Conclusion \u2014 reaffirm the importance of speaking thoughtfully in daily life.' },
            ]
          },
          {
            id: 's4', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'V', text: 'Rhythm/Metre: Listen to the teacher read the poem and underline the stressed syllables in all the lines (first 4 lines\' scansion given as example). Share answers with the teacher.', answer: 'Model: read each line aloud and mark the stressed (´) and unstressed (˘) syllables. For example, "Words, like sum-mer birds, de-part" → ˘ ´ ˘ ˘ ´ ˘ ´. Identify the pattern in each line — most lines follow an iambic rhythm with some variations. Share and compare your markings with the class.' }
            ]
          },
        ]
      },
    ]
  },

  {
    id: 'ch08', number: 8, code: '0903ch08',
    contents: [
      {
        id: 'a', kind: 'reading',
        title: 'Follow That Dream',
        slug:  'follow-that-dream',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'What is your dream?', answer: 'My dream is to become a creative writer and inspire others through stories.' },
              { id: 'q2', number: '2', text: 'Who inspires you to dream?', answer: 'Great personalities like A.P.J. Abdul Kalam inspire me to dream big.' },
              { id: 'q3', number: '3', text: 'Qualities needed to fulfil a dream.', answer: 'Dedication, patience, resilience, courage, and hard work.' },
              { id: 'q4', number: '4', text: "Discuss Abdul Kalam's quote. (30–40 words)", answer: "Kalam's quote means that true dreams are powerful goals that keep us awake with passion. They are not fantasies but visions that drive us to work tirelessly until they are achieved." },
              { id: 'q5', number: '5', text: 'Role of parents and community. (30–40 words)', answer: 'Parents and the community provide emotional support, resources, and encouragement. They guide children through failures, help them overcome obstacles, and open opportunities to nurture talents, turning distant dreams into achievable goals.' },
              { id: 'q6', number: '6', text: 'Importance of following a dream (web chart).', answer: 'Gives purpose, builds confidence, inspires others, leads to growth, creates happiness.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'True/False Statements.', answer: '1. True 2. True 3. False 4. True 5. False 6. False 7. True' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection: Extract 1', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'Identify the analogy.', answer: 'enthusiasm : passion :: belief : conviction' },
              { id: 'q2', number: '(ii)', text: 'Identify the correct option.', answer: 'B. an early abandonment of the dream' },
              { id: 'q3', number: '(iii)', text: "What does the word 'plunge' mean here?", answer: 'Complete involvement.' },
              { id: 'q4', number: '(iv)', text: 'Why is intrinsic motivation important here?', answer: 'Because doing what you love gives inner satisfaction and keeps you motivated without external rewards.' },
              { id: 'q5', number: '(v)', text: 'Identify a motivating factor.', answer: 'Love for the art or encouragement from family/friends.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection: Extract 2', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: 'What does this reveal about dreams?', answer: 'Dreams are dynamic/evolving.' },
              { id: 'q2', number: '(ii)', text: 'What does this mean?', answer: "It means that even changed dreams are valuable and worth pursuing." },
              { id: 'q3', number: '(iii)', text: 'Identify the phrase.', answer: '"maze of hurdles."' },
              { id: 'q4', number: '(iv)', text: 'Give the reason.', answer: "Because as life changes, more people become part of one's journey." },
              { id: 'q5', number: '(v)', text: 'Identify the tone.', answer: 'C. optimistic and encouraging.' },
            ]
          },
          {
            id: 's5', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'What might Ming have written to her mother?', answer: 'Ming probably wrote about her ambitions and asked for guidance on pursuing her dream. She may have expressed doubts or fears, seeking encouragement and advice from her mother.' },
              { id: 'q2', number: '2', text: 'How to attain international skill level?', answer: 'By practising intensively for years and committing to continuous learning. Seeking mentorship and global exposure also helps.' },
              { id: 'q3', number: '3', text: 'Difference between dreamers and achievers.', answer: 'Dreamers only wish, while achievers invest effort, sacrifice, and persistence to make dreams reality.' },
              { id: 'q4', number: '4', text: "How does Ming's mother persuade her?", answer: "She uses rhetorical questions ('Do you know...?') to make Ming reflect, and shares real anecdotes — like people whose Raffles College dreams were derailed by World War II, and her own decade-long journey to publish her book — making her advice both realistic and relatable." },
              { id: 'q5', number: '5', text: 'How does she balance encouragement with caution?', answer: 'She motivates Ming to follow her passion but reminds her of sacrifices, time, and obstacles involved.' },
              { id: 'q6', number: '6', text: 'Is this advice relevant today? (30–40 words)', answer: 'Yes, because even today, achieving dreams demands effort, sacrifice, and resilience. Circumstances and technology may change, but the timeless principle of hard work, patience, and persistence remains the true key to success.' },
              { id: 'q7', number: '7', text: 'Costs you are willing/unwilling to invest.', answer: 'Willing to invest time and effort; unwilling to sacrifice health or family relationships.' },
            ]
          },
          {
            id: 's6', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Compound words and dialogue fill-ins.', answer: 'mindscape → mental world\nseascape → view of the sea\ncityscape → view of a city\nlandscape → view of land\nDialogue fill-ins: (i) seascape (ii) cityscape (iii) landscape (iv) mindscape' },
              { id: 'q2', number: '2', text: 'Expressions.', answer: '1. burn in her blood → passionate desire\n2. uphill task → tough challenge\n3. buoyed up → lifted in spirit\n4. wishful thinking → hopeful belief but unlikely true\n5. wet blanket → spoil-sport\n6. coursing through her veins → flowing through her body' },
              { id: 'q3', number: '3', text: 'First conditional sentences.', answer: '1. If the idea excites you, go for it.\n2. If you hear strange noises, check immediately.\n3. If this seems too hard, ask for help.\n4. If you care about the issue, speak up.\n5. If you finish early, review your work.' },
              { id: 'q4', number: '4', text: "Usage of 'could'.", answer: '1. Possibility\n2. Unreal/hypothetical\n3. Past possibility/speculation\n4. Past ability/purpose' },
              { id: 'q5', number: '5', text: "Sentences with 'could'.", answer: '1. I wish I could study abroad without worrying about money.\n2. They could have taken the shorter route.\n3. When I was younger, I could run miles without stopping.\n4. She could be in the library right now.\n5. Could you repeat the question?' },
              { id: 'q6', number: '6', text: 'Experiential learning blanks.', answer: '1. helps 2. learnt 3. work 4. apply 5. conducts 6. analyses 7. must reflect 8. helps 9. is 10. will incorporate' },
            ]
          },
          {
            id: 's6b', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: '1', text: 'Vocational courses will begin in the month of _______.', answer: 'April' },
              { id: 'q2', number: '2', text: 'The objective of the courses is to prepare you with _______ for future studies and jobs.', answer: 'practical skills' },
              { id: 'q3', number: '3', text: 'Offered courses include Graphic Design, _______, Web Application, and Entrepreneurship Skills, etc.', answer: 'Basic Coding' },
              { id: 'q4', number: '4', text: 'Classes will be conducted by _______ at school.', answer: 'trained professionals' },
              { id: 'q5', number: '5', text: 'The application forms will be available at the _______.', answer: 'school office' },
              { id: 'q6', number: '6', text: 'Choice of course will be given to _______ applicants.', answer: 'early' },
            ]
          },
          {
            id: 's7', title: 'Speaking Activity — Role Play', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Work in groups of four. Each member takes up one role — The Dreamer, A Parent, A Mentor/Teacher, A Friend/Sibling — and presents a role play about pursuing a dream, using the sentence prompts given for each role.', answer: 'The Dreamer: "Ever since I was a child, I\u2019ve dreamed of being a trekking guide. It\u2019s an uphill journey, but I\u2019m ready for it because it\u2019s what makes me happiest." Parent: "I know you\u2019re passionate, but what if it doesn\u2019t work out financially?" Mentor: "Remember, dreams need planning — are you ready to build a realistic roadmap?" Friend: "You\u2019ve always been good at this — don\u2019t give up now. If anyone can do this, it\u2019s you."' }
            ]
          },
          {
            id: 's8', title: 'Writing Task — Email', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: 'You are passionate about pursuing a course in designing. You come across a summer workshop conducted by a reputed design institute. Write a formal email to the Director enquiring about the workshop details and expressing your interest in joining it.', answer: "From: aditi.sharma@email.com\nTo: director@designinstitute.edu\nSubject: Enquiry Regarding Summer Design Workshop\n\nRespected Sir/Madam,\n\nI am Aditi Sharma, a Grade 9 student with a keen interest in pursuing a career in design. I recently learnt about the summer workshop being conducted by your institute and would be grateful if you could share further details, including the course content, duration, fees, and eligibility criteria.\n\nI am eager to join this workshop to strengthen my foundational skills in design. I would appreciate your guidance on the application process.\n\nThank you for your time and consideration.\n\nYours sincerely,\nAditi Sharma\nContact: 98xxxxxxx" },
            ]
          },
          {
            id: 's9', title: 'Learning Beyond the Text — Vision Board', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Create a Vision Board for yourself — a visual representation of your goals, dreams and inspirations, using pictures, words or symbols.', answer: 'Model: a vision board with images of a laptop and books (career goal: software engineer), a globe (travel dreams), a family photo (values), and words like "Discipline," "Growth," and "Confidence" arranged to inspire daily motivation.' },
            ]
          },
        ]
      },
      {
        id: 'b', kind: 'poem',
        title: 'Believe in Yourself',
        slug:  'believe-in-yourself',
        sections: [
          {
            id: 's1', title: 'Reflect and Respond', type: 'speaking',
            questions: [
              { id: 'q1', number: '1', text: 'Emotions at the base of a difficult task.', answer: 'Nervousness, fear, hesitation, but also hope and determination.' },
              { id: 'q2', number: '2', text: 'What might make you take the first step?', answer: 'Self-belief, encouragement from loved ones, and the desire to grow.' },
              { id: 'q3', number: '3', text: 'Challenge faced in life. (30–40 words)', answer: 'At first, I felt anxious and unsure, but once I decided to move forward, I felt empowered. The journey was tough, but believing in myself gave me strength to succeed.' },
              { id: 'q4', number: '4', text: "Meaning of 'believe in yourself'.", answer: 'It means trusting your abilities, having confidence, and not giving up despite obstacles. Associated words: courage, confidence, resilience, determination.' },
              { id: 'q5', number: '5', text: "Meaning of 'status quo'.", answer: 'Option 2 → A situation to keep things the same.' },
            ]
          },
          {
            id: 's2', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Central ideas of stanzas.', answer: 'Stanza 1 → Facing challenges requires personal responsibility and focus on the future.\nStanza 2 → Fear and uncertainty make choices difficult as the future approaches.\nStanza 3 → Personal growth requires leaving behind comfort and embracing change.\nStanza 4 → The first step is difficult, but self-belief keeps you on track.' },
              { id: 'q2', number: '2', text: 'Rhyme scheme.', answer: 'The poem follows a simple ABCB rhyme scheme in each stanza (e.g., see/be, fear/near, quo/grow, back/track), giving it a steady, flowing rhythm.' },
              { id: 'q3', number: '3', text: 'Tone.', answer: '1. Motivational and encouraging → True\n2. Shifts from thoughtful to determined → True' },
              { id: 'q4', number: '4', text: 'Who is the speaker?', answer: 'The speaker is a guide who encourages the reader to take control of their future. The use of "You" makes it feel like the speaker is talking directly to the reader.' },
            ]
          },
          {
            id: 's3', title: 'Poetic Devices', type: 'poem',
            questions: [
              { id: 'q1', number: '1', text: 'Imagery.', answer: '"There is no crowd to see ..." → Solitary journey, stressing individual effort.\n"push you back in fear" → Mental barrier preventing growth.' },
              { id: 'q2', number: '2', text: 'Symbolism.', answer: '1. Comfort/status quo → stagnation and fear of change.\n2. Future → unknown, requiring a leap of faith.\n3. First step → courage needed for self-improvement and personal development.' },
              { id: 'q3', number: '3', text: 'Metaphor.', answer: '"The first step is the hardest" is metaphorical because it compares beginning a journey to a physical step, showing how initial effort feels most difficult in personal growth.' },
              { id: 'q4', number: '4', text: 'Antithesis.', answer: '"Pull you forward / Or push you back in fear" → contrasts progress vs fear. It highlights the choice between growth and stagnation.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '(i)', text: "What does the line, 'There is no crowd to see' suggest about facing challenges?", answer: 'It suggests that facing challenges is a deeply personal journey, undertaken alone rather than for an audience, with the true purpose being self-growth, not external validation.' },
              { id: 'q2', number: '(ii)', text: "Complete: The line 'It's just you and the future' suggests that ______.", answer: 'ultimately, only you can decide and shape your own path forward, since success depends on individual effort, courage and vision rather than on others.' },
              { id: 'q3', number: '(iii)', text: 'Fill in the blank with the appropriate word/phrase from the extract: Latha will ______ her efforts to improve her vocal performance by practising harder each day.', answer: 'step up (echoing the poem\u2019s opening line, \u2018Step up to the challenge\u2019).' },
              { id: 'q4', number: '(iv)', text: 'Select the most suitable title for the extract.', answer: 'C. A Journey of Growth.' },
              { id: 'q5', number: '(v)', text: 'Complete the analogy using a word from the extract: achieve : goal :: face : ______.', answer: 'challenge' },
            ]
          },
          {
            id: 's5', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: "What is the significance of the metaphor, 'The first step is the hardest', in the context of personal growth?", answer: "It suggests that beginning any change feels most difficult, since it means leaving familiar comfort behind. Once that first step is taken, momentum builds, and continuing forward becomes progressively easier than starting was." },
              { id: 'q2', number: '2', text: 'What message does the antithesis in the poem convey about the nature of personal development?', answer: 'By contrasting being pulled forward with being pushed back in fear, the antithesis shows personal growth as a constant tug between courage and hesitation, emphasising that real development demands consciously choosing courage over fear.' },
              { id: 'q3', number: '3', text: "Do you think the poet's message is realistic in the context of real-world struggles?", answer: "It is partly realistic — self-belief truly is essential to begin. However, real-world success also depends on planning, resources, guidance and persistent effort, so believing in yourself alone may not always be enough." },
              { id: 'q4', number: '4', text: 'Consider a situation where you or someone you know had to take a difficult first step towards a goal. How does the poem’s message apply?', answer: 'Before my first public-speaking competition, I felt anxious and wanted to quit. Like the poem says, that first step felt hardest; once I began speaking, my confidence grew, proving that self-belief truly does help you move forward.' },
            ]
          },
          {
            id: 's6', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Latin expressions.', answer: '(i) e.g. → Harry Potter and Magical Paint Brush.\n(ii) quid pro quo → favour in return.\n(iii) etc. → trekking, hiking, biking, etc.\n(iv) per se → by itself.\n(v) ad hoc → temporary team.\n(vi) in media res → movie started in middle of battle.' },
              { id: 'q2', number: '2', text: 'Rhetorical questions.', answer: '(i) "Isn\'t it obvious ...?" → To urge responsibility.\n(ii) "Will we let fear control us ...?" → To inspire courage.' },
              { id: 'q3', number: '3', text: 'Match situations.', answer: '(i) Standing up for right → F. How can we stay silent when we know what is right?\n(ii) Owning a mistake in a group project → B. Isn\'t it better to admit our mistakes than let them define us?\n(iii) Trying something challenging, like public speaking → A. How can we ever grow if we never try anything new?\n(iv) Choosing between two career paths → D. Can I really move forward without knowing which path to take?\n(v) Deciding whether to apologise for a mistake → C. If I don\'t take responsibility now, when will I?\n(vi) Trying something new, stepping out of your comfort zone → E. What\'s the point of playing it safe if it means staying stuck?' },
            ]
          },
          {
            id: 's6b', title: 'Listen and Respond', type: 'listening',
            questions: [
              { id: 'q1', number: 'I', text: 'Listen to a conversation between two friends. Answer in one to three exact words.', answer: '1. How did the boy feel before the play? → nervous.\n2. According to the girl, where does confidence come from? → taking action.\n3. What was the girl finally sure about regarding the boy? → you\'ll shine.' },
              { id: 'q2', number: 'II', text: 'Listen again and select the four true statements from 1–7.', answer: 'True: 2 (the girl encourages him to trust his preparation), 4 (self-doubt is a normal part of preparing for a big performance), 5 (he doubts his abilities despite having practised), 7 (pushing through nervousness helps him grow and build confidence).\nFalse: 1 (he is not confident, he is nervous throughout), 3 (not stated), 6 (she never suggests avoiding nervousness or performing perfectly).' },
            ]
          },
          {
            id: 's6c', title: 'Speaking Activity — Role Play', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'In pairs, choose one of three sayings ("Don\'t judge a book by its cover"; "Actions speak louder than words"; "When the going gets tough, the tough get going"), briefly explain it, relate it to a real-life situation, and enact a role play, ending with a reflection.', answer: 'Model ("Actions speak louder than words"): Introduction — this means what we do matters more than what we say. Situation — one friend keeps promising to help with a project but never does, while another quietly helps without being asked. Conclusion — I learnt that genuine effort speaks louder than empty promises.' },
            ]
          },
          {
            id: 's6d', title: 'Writing Task — Speech', type: 'writing',
            questions: [
              { id: 'q1', number: 'I', text: "Your class is conducting the morning assembly. Deliver a speech on 'Turning Challenges into Opportunities', following the given structure (opening with a quote/question, two body paragraphs, concluding paragraph, formal and persuasive tone).", answer: '"Respected Principal, teachers and dear friends, don\'t you agree that our biggest challenges often become our greatest teachers? Today, I want to speak on \'Turning Challenges into Opportunities.\' Challenges push us out of our comfort zone and teach us new skills we would never have discovered otherwise. Change can feel scary, isn\'t it, because it takes us into the unknown — yet every successful person, from Dr. Kalam to Lal Bahadur Shastri, turned early hardship into strength. To conclude, let us welcome challenges with a positive mindset, for they are simply opportunities in disguise. Thank you."' },
            ]
          },
          {
            id: 's7', title: 'Learning Beyond the Text', type: 'speaking',
            questions: [
              { id: 'q1', number: 'I', text: 'Create a Vision Board for yourself (with sections: My Dreams; I Want to Try; Goals; Places I Will Go; Inspiration).', answer: 'Model: create a vision board on chart paper or digitally. Divide it into five sections — My Dreams (what you aspire to become), I Want to Try (new activities/skills), Goals (academic/personal targets), Places I Will Go (destinations you wish to visit), and Inspiration (people/quotes that motivate you). Display and share with the class.' },
              { id: 'q2', number: 'II', text: 'Find and present success stories of personalities from your village/town/city/state who turned challenges into opportunities (examples provided: Ambedkar, Shastri, APJ Abdul Kalam).', answer: 'Model: research a local or national personality who overcame adversity — e.g., Dr. B.R. Ambedkar, who faced caste discrimination but became the architect of the Indian Constitution; Lal Bahadur Shastri, who rose from humble beginnings to become Prime Minister; or A.P.J. Abdul Kalam, who sold newspapers in childhood and became India\'s missile man and President. Present their story of turning challenges into opportunities.' }
            ]
          },
        ]
      },
    ]
  },
];
