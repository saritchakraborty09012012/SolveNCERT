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
              { id: 'q1', number: '1', text: 'Complete the cause and effect table.', answer: '1. Morning papers arrived late → Weekly magazines came one day late.\n2. Grandmother never went to school → She could not read.\n3. She was deeply interested in the story → She discussed it with her friends.\n4. Narrator went to a wedding for a week → Grandmother cried because she missed the reading.\n5. Grandmother never went to school → She regretted not being educated.\n6. Grandmother regretted not going to school → She decided to learn the alphabet.' },
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
              { id: 'q1', number: '1', text: 'Complete the table with suffixes and their meanings.', answer: '-ous → full of → generous\n-ity → state of being old → antiquity\n-est → superlative → peerless\n-less → without → fearless' },
              { id: 'q2', number: '2', text: 'Add different suffixes and make sentences.', answer: '-ive → active → She is very active in class.\n-ment → achievement → His achievement was celebrated by all.\n-ed → sanctified → The land was sanctified by sages.' },
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
              { id: 'q3', number: '3', text: 'Arrange events in sequence.', answer: '4 → 6 → 3 → 8 → 1 → 5 → 2 → 9 → 7' },
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
              { id: 'q1', number: '1', text: 'Classify the words into tools/implements, raw materials, and process.', answer: 'Tools/Implements → dao, spatula, basket, cylinders\nRaw Materials → clay, dough, bamboo, bed of hay\nProcess → pounding, rotating, shaping, kiln' },
              { id: 'q2', number: '2', text: 'Economy words — meanings and sentences.', answer: 'bankrupt → without money → The company went bankrupt.\ncredit → trust in payment → He bought the bike on credit.\ncurrency → money system → The Indian currency is the rupee.\ndebt → money owed → He cleared his debt last year.\nfiscal → relating to finance → The fiscal year ends in March.\ninflation → rise in prices → Inflation makes goods expensive.\ninvestment → putting money for profit → She made an investment in shares.\ninterest → extra money paid on loans → The bank charges high interest.' },
              { id: 'q3', number: '3', text: 'Complete the noun clauses.', answer: 'The elders emphasised that skills must be passed on.\nMesoba explained why Arenla delayed teaching.\nOnula\'s promise was that she would help Sentila.\nSentila observed her mother carefully when she was shaping the mouth of the pot, which improved her skill.\nThe kiln, where pots were fired, required careful attention.' },
              { id: 'q4', number: '4', text: 'Complete the relative clauses.', answer: "Sentila, whose passion was pottery, practised diligently.\nThe village council, where elders gathered, sought an explanation.\nThe potter's hands, which were skilled, shaped clay beautifully.\nArenla, her mother, wanted her to learn weaving, which was profitable.\nMesoba went home and discussed the matter with Arenla, who agreed to teach." },
              { id: 'q5', number: '5', text: 'Determiners — fill in the blanks.', answer: 'Examples: the, this, that, her, many, some, all.\nA. The florist arranged five bouquets for her clients, that were displayed in an elegant floral shop.\nB. The carpenter crafted several unique tables, and those became the centrepiece in the furniture collection.\nC. Each of the apprentices in the culinary class demonstrated knife skills during the intense cooking session.\nD. Many of the sculptures were displayed at an art exhibition, showcasing diverse artistic skills.' },
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
              { id: 'q1', number: '1', text: 'True/False statements.', answer: '1. True\n2. True\n3. True' },
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
            ]
          },
          {
            id: 's4', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'How does the poet compare a garden to a painting?', answer: 'The poet compares seeds to brushstrokes and plots to canvas, showing how gardeners create beauty like artists. Gardens bloom with colours and patterns, resembling paintings that reflect creativity and harmony in nature.' },
              { id: 'q2', number: '2', text: 'What does the poem suggest about the role of gardeners?', answer: 'Gardeners are portrayed as artists who transform soil into living canvases. Their efforts bring life, colour, and beauty, making gardens symbolic of creativity, patience, and dedication. They turn nature into art through their work.' },
              { id: 'q3', number: '3', text: 'How does the poem highlight harmony and diversity?', answer: 'The poem describes blossoms of different hues dancing together, symbolising diversity. Just like colours in a painting, varied plants in a garden coexist harmoniously, reflecting the beauty of unity in diversity in life and nature.' },
              { id: 'q4', number: '4', text: 'Why can the poem be considered an allegory?', answer: "The garden symbolises life's journey, growth, and diversity. Seeds represent beginnings, blossoms reflect achievements, and seasons show cycles of existence. Thus, the poem conveys deeper meanings about harmony, creativity, and the value of nurturing." },
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
              { id: 'q1', number: '1', text: "Complete Grandpa's day out flow chart.", answer: "1. Children's park → buys peanuts → watches children play\n2. Ravi scolded by boy's mother and vendors\n3. Tea stall → drinks tea → eats bananas and ice cream\n4. Barber shop\n5. Bus stop → boards bus → Ravi fooled by stranger with same cap" },
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
              { id: 'q3', number: '(iii)', text: "Why was Ravi's mother impatient?", answer: "Because she thought Grandpa forgot Ravi's birthday." },
              { id: 'q4', number: '(iv)', text: 'True or False, with reason.', answer: 'False — Grandpa remembered his own birthday tradition.' },
              { id: 'q5', number: '(v)', text: 'Why did Grandpa tease Ravi?', answer: 'Because Ravi had been following him secretly, Grandpa teased him.' },
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
              { id: 'q2', number: '2', text: 'Fill in the blanks (detective story).', answer: '1. trailing 2. bustle 3. thudded 4. across 5. darted 6. crouch 7. creeping 8. grunted 9. cut and run 10. whirr' },
              { id: 'q3', number: '3', text: 'Synonyms for dilemma.', answer: 'Quandary, Predicament' },
              { id: 'q4', number: '4', text: 'Word meanings table — part of speech, synonym, antonym.', answer: 'craftily → cleverly (adv) | synonym: cunningly | antonym: honestly\ndilemma → difficult choice (noun) | synonym: predicament | antonym: certainty\nfurious → very angry (adj) | synonym: enraged | antonym: calm\nboomed → spoke loudly (verb) | synonym: thundered | antonym: whispered\nhumiliation → embarrassment (noun) | synonym: disgrace | antonym: pride\nattire → clothing (noun) | synonym: outfit | antonym: undress' },
              { id: 'q5', number: '5', text: 'Match emotions/expressions.', answer: 'embarrassed → felt uncomfortable\ncountered → reply to an argument\nflushed → became red in the face\nstricken → affected severely by unpleasant feeling\ngleam → expression of emotion' },
              { id: 'q6', number: '6', text: 'Prepositions exercise.', answer: '(i) through (ii) over (iii) near (iv) in (v) along (vi) into' },
              { id: 'q7', number: '7', text: 'Interrogative sentences.', answer: 'A. Words in quotes are interrogative. B. Sentences 1, 4, 5 → Yes/No type. C. Sentences 2, 3 → Wh-type. D. Two types of interrogative sentences.' },
              { id: 'q8', number: '8', text: 'Reported speech exercise.', answer: '1. helped in taking care of grandparents\n2. took turns making sure they were alright\n3. if he had grandparents living with him\n4. he visited his grandpa every weekend\n5. how they managed medical needs\n6. they had a schedule for medications and doctor visits' },
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
              { id: 'q3', number: '3', text: 'Match words with meanings.', answer: 'hover → remain in a place for some time\nhum → sing softly\ncradle → small bed for a baby\nrocking → moving gently back and forth\nritual → ceremony or custom\nmidst → the middle of something' },
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
              { id: 'q5', number: '5', text: 'What is the tone of the poem?', answer: 'Nostalgic and emotional, as the poet remembers his mother with love and longing.' },
              { id: 'q6', number: '6', text: 'Effect of the repeated line "I cannot remember my mother." (30–40 words)', answer: "It emphasises the poet's sense of loss and longing. Though he cannot recall her face, he connects with her through sensory memories, showing how deeply he misses her presence." },
              { id: 'q7', number: '7', text: 'Identify two symbols used in the poem.', answer: "Shiuli flowers (symbol of purity and memory), sky (symbol of mother's eternal gaze)." },
              { id: 'q8', number: '8', text: 'Why does the poet connect nature with his mother? (30–40 words)', answer: "Because nature's sights, sounds, and smells remind him of her. The fragrance of flowers, the tune of songs, and the sky help him feel her presence, showing how deeply she is tied to his world." },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection (Extracts)', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Extract 1: "I cannot remember my mother only sometimes in the midst of my play..."', answer: 'Emotion: Nostalgia\nReason: He recalls her through songs while playing.\nExpression: Her hum connects him to childhood.' },
              { id: 'q2', number: '2', text: 'Extract 2: "The smell of the shiuli flowers floats in the air..."', answer: 'Emotion: Affection\nReason: Fragrance reminds him of her presence in temple rituals.' },
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
              { id: 'q3', number: '3', text: 'Identify the function of the modal verbs.', answer: '1. could hear → possibility\n2. couldn\'t be helped → impossibility\n3. should give → advice/obligation\n4. would win → prediction/past habit' },
              { id: 'q4', number: '4', text: 'Sentences using modal verbs.', answer: 'Could (possibility): It could rain today.\nCould (request): Could you help me?\nCould (suggestion): You could try harder.\nShould (advice): You should eat healthy.\nWould (past habit): He would visit us every summer.' },
              { id: 'q5', number: '5', text: 'Direct vs Reported Speech — identify.', answer: 'Given sentences are in Direct Speech. They are Declarative sentences.' },
            ]
          },
          {
            id: 's7', title: 'Writing Task', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Draft a notice for an Inter-school Athletic Meet.', answer: 'ABC School Sports Club\n\nNOTICE\n\nDate: [Insert Date]\n\nInter-school Athletic Meet\n\nThe Sports Club is organising an Inter-school Athletic Meet. Interested students are requested to register for selection in different events by [insert date]. For details, contact the undersigned.\n\n(Signature)\nSarit\nSports Captain' },
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
              { id: 'q3', number: '3', text: 'Appreciation — poetic devices, imagery, tone, mood, message.', answer: '1. Alliteration → "stumbled and staggered", "beaming faces."\n2. Visual imagery → (i) athletes at starting line, (ii) boy falling on asphalt, (iii) nine runners holding hands.\n3. Auditory imagery → "The pistol exploded."\n4. Effect of imagery → It makes the poem vivid and emotional, helping readers visualise and feel the moment.\n5. Tone change → From competitive excitement to compassionate unity.\n6. Overall mood → Inspirational and uplifting.\n7. Message → True victory lies in empathy, compassion, and unity, not just winning medals.' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'Extract 1: "The eight other runners pulled up on their heels..."', answer: '(i) Phrase meaning → B. stopped running. (ii) Trait common to all → Compassion. (iii) Tone → Admirable and empathetic. (iv) Young athlete\'s feeling → Grateful, relieved, and encouraged. (v) Turning point → Yes, because the race changed from competition to unity, redefining victory.' },
              { id: 'q2', number: '2', text: 'Extract 2: "That\'s how the race ended, with nine gold medals..."', answer: '(i) Contestants felt joyful, proud, and united. (ii) They were given gold medals because their act of compassion was greater than competition, symbolising the true spirit of Special Olympics.' },
            ]
          },
          {
            id: 's4', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'How does the poem highlight empathy and compassion?', answer: 'The poem shows athletes stopping their race to help a fallen boy. Their empathy turned competition into unity, proving that compassion is more valuable than individual victory.' },
              { id: 'q2', number: '2', text: "Why is the title 'Nine Gold Medals' significant?", answer: 'It signifies that all nine athletes won together. Their act of kindness was rewarded equally, showing that true gold lies in humanity and shared success.' },
              { id: 'q3', number: '3', text: 'How does the poem redefine the meaning of victory?', answer: 'Victory is not just about finishing first but about showing humanity. The athletes proved that helping others and finishing together is the greatest triumph.' },
              { id: 'q4', number: '4', text: 'What lesson can readers learn from the poem?', answer: 'Readers learn that empathy and unity are more important than competition. Success should be measured by compassion and collective achievement, not just personal gain.' },
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
              { id: 'q3', number: '3', text: 'Difference in choice of music between children and elders. (30–40 words)', answer: 'Yes, children often prefer fast, modern beats, while elders enjoy classical or devotional music. This difference arises from generational experiences, cultural values, and emotional connections to traditions.' },
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
              { id: 'q1', number: '1', text: 'Why is music often called a universal language? (30–40 words)', answer: 'Music is called a universal language because it expresses emotions beyond words. People from different cultures can understand joy, sorrow, or love through melodies and rhythms, making it a bridge across boundaries and generations.' },
              { id: 'q2', number: '2', text: 'Do you think music can be a friend? Explain. (30–40 words)', answer: 'Yes, music can be a friend because it comforts us in sadness, energises us in happiness, and keeps us company when we feel alone. It listens silently yet speaks directly to our hearts.' },
            ]
          },
          {
            id: 's2', title: 'Reading for Meaning', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'What does the poet mean by "music is my companion"?', answer: 'The poet means that music is always present, offering comfort, joy, and support like a true friend.' },
              { id: 'q2', number: '2', text: 'How does music help the poet in times of difficulty? (30–40 words)', answer: 'Music helps the poet by soothing pain, calming worries, and giving strength. It transforms sadness into hope and loneliness into companionship, proving its power to heal and uplift the spirit.' },
              { id: 'q3', number: '3', text: 'Why does the poet compare music to a friend?', answer: 'Because music shares emotions, provides comfort, and never abandons us, just like a loyal friend.' },
            ]
          },
          {
            id: 's3', title: 'Check Your Understanding', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'True/False Statements.', answer: 'Music is described as a loyal companion. → True\nThe poet feels music abandons him in sadness. → False\nMusic is compared to a friend. → True\nThe poem suggests music is only for entertainment. → False' },
              { id: 'q2', number: '2', text: 'Fill in the blanks.', answer: 'Music is described as a companion.\nIt helps the poet in times of difficulty.\nMusic is compared to a friend.' },
            ]
          },
          {
            id: 's4', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'What message does the poem convey about the role of music in life? (30–40 words)', answer: 'The poem conveys that music is more than entertainment; it is a source of emotional support. It comforts, inspires, and strengthens us, acting as a true friend in both joy and sorrow.' },
              { id: 'q2', number: '2', text: 'How does the poem highlight the emotional power of music? (30–40 words)', answer: "The poem highlights music's emotional power by showing how it heals pain, uplifts spirits, and provides companionship. It demonstrates that music connects deeply with human feelings, making it essential in life's journey." },
            ]
          },
          {
            id: 's5', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Synonyms.', answer: 'Companion → friend, partner\nComfort → relief, solace\nStrength → power, energy' },
              { id: 'q2', number: '2', text: 'Use in sentences.', answer: 'Music is my companion in loneliness.\nA kind word gives comfort in sadness.\nHard work builds strength for success.' },
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
              { id: 'q3', number: '3', text: 'How would phone lines help? (30–40 words)', answer: 'Phone lines would reduce his burden, allowing faster communication. He could become a Gramin Sanchar Sewak, carrying phones and post, making his work easier and more efficient.' },
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
              { id: 'q5', number: '5', text: 'Why tribute to people like Khetaram? (30–40 words)', answer: "Because they serve tirelessly in extreme conditions, connecting remote communities. Their dedication sustains social bonds and trust, making them unsung heroes of India's communication system." },
            ]
          },
          {
            id: 's7', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Match phrases and use in sentences.', answer: "crumbles into sand → disappears in desert — The road crumbles into sand after the village.\ngive a new lease of life → chance to continue living — This job gave him a new lease of life.\nturn into a trickle before drying out → lessen gradually then stop — The river turned into a trickle before drying out.\nbearing words across desolate geography → carrying letters to remote areas — He kept bearing words across desolate geography." },
              { id: 'q2', number: '2', text: 'Alliteration & metaphor.', answer: 'Alliteration → "scorching summer winds and swirling sandstorms."\nMetaphor → "walking sandman" (describing him covered in sand).' },
              { id: 'q3', number: '3', text: 'Match words.', answer: 'arid → farmland without much yield\nconcessional → interest rate for farmers\ngaunt → farmer waiting for rains\nremote → corner of the world\ndesolate → desert stretching far and wide' },
              { id: 'q4', number: '4', text: 'Present perfect tense exercise.', answer: '1. have got 2. has collected 3. have studied 4. have begun 5. has inspired' },
              { id: 'q5', number: '5', text: 'Passive voice advice.', answer: 'A. Reading clearly will be expected by villagers.\nB. Words must be written neatly.\nC. Drafting replies will be asked by villagers.\nD. Full-sleeved shirts and trousers should be worn.' },
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
              { id: 'q5', number: '5', text: 'Hyperbole example and others.', answer: '"If words could satisfy the chest, the world might hold a feast."\nOther hyperboles: "I\'ve told you a million times." / "Her smile lights up the whole world." / "He runs faster than the wind."' },
            ]
          },
          {
            id: 's3', title: 'Critical Reflection', type: 'reading',
            questions: [
              { id: 'q1', number: '1', text: 'What message does the poem convey? (30–40 words)', answer: 'The poem conveys that words alone cannot satisfy the heart. Empty or insincere words are worthless, like weeds. True joy comes from a few sincere words spoken with honesty, which touch the heart deeply.' },
              { id: 'q2', number: '2', text: 'How does the poet contrast empty words with sincere ones? (30–40 words)', answer: 'Empty words are compared to flashy plants with no fruit, showing they look impressive but lack value. Sincere words, though few, bring joy and comfort, proving quality matters more than quantity in communication.' },
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
              { id: 'q5', number: '5', text: 'Role of parents and community. (30–40 words)', answer: 'Parents and community provide emotional support, resources, and encouragement. They guide children, help them overcome obstacles, and create opportunities to nurture talents, making dreams achievable.' },
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
              { id: 'q4', number: '4', text: "How does Ming's mother persuade her?", answer: 'She uses critical questions and personal anecdotes, showing both encouragement and caution, making her advice realistic and relatable.' },
              { id: 'q5', number: '5', text: 'How does she balance encouragement with caution?', answer: 'She motivates Ming to follow her passion but reminds her of sacrifices, time, and obstacles involved.' },
              { id: 'q6', number: '6', text: 'Is this advice relevant today? (30–40 words)', answer: 'Yes, because even today achieving dreams requires effort, sacrifice, and resilience. Though circumstances change, the principle of hard work and persistence remains timeless.' },
              { id: 'q7', number: '7', text: 'Costs you are willing/unwilling to invest.', answer: 'Willing to invest time and effort; unwilling to sacrifice health or family relationships.' },
            ]
          },
          {
            id: 's6', title: 'Vocabulary and Structures', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Compound words and dialogue fill-ins.', answer: 'mindscape → mental world\nseascape → view of the sea\ncityscape → view of a city\nlandscape → view of land\nDialogue fill-ins: (i) seascape (ii) cityscape (iii) landscape (iv) mindscape' },
              { id: 'q2', number: '2', text: 'Expressions.', answer: '1. burn in her blood → passionate desire\n2. uphill task → tough challenge\n3. buoyed up → energised by success\n4. wishful thinking → hopeful belief but unlikely true\n5. wet blanket → spoil-sport\n6. coursing through her veins → flowing through her body' },
              { id: 'q3', number: '3', text: 'First conditional sentences.', answer: '1. If the idea excites you, go for it.\n2. If you hear strange noises, check immediately.\n3. If this seems too hard, ask for help.\n4. If you care about the issue, speak up.\n5. If you finish early, review your work.' },
              { id: 'q4', number: '4', text: "Usage of 'could'.", answer: '1. Possibility\n2. Unreal/hypothetical\n3. Past possibility/speculation\n4. Past ability/purpose' },
              { id: 'q5', number: '5', text: "Sentences with 'could'.", answer: '1. I wish I could study abroad without worrying about money.\n2. They could have taken the shorter route.\n3. When I was younger, I could run miles without stopping.\n4. She could be in the library right now.\n5. Could you repeat the question?' },
              { id: 'q6', number: '6', text: 'Experiential learning blanks.', answer: '1. helps 2. learnt 3. work 4. apply 5. conducts 6. analyses 7. must reflect 8. helps 9. is 10. will incorporate' },
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
              { id: 'q2', number: '2', text: 'Rhyme scheme.', answer: 'The poem follows a simple rhyme scheme of ABAB.' },
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
              {
                id: 'q1', number: '1', text: 'Extract 1 Questions.',
                answer: '(i) "There is no crowd to see" → Facing challenges is personal, not for show.\n(ii) "It\'s just you and the future" → Success depends on individual effort and vision.\n(iii) Fill blank → Latha will plunge her efforts to improve.\n(iv) Suitable title → C. A Journey of Growth.\n(v) Analogy → achieve: goal :: face: challenge.'
              },
            ]
          },
          {
            id: 's5', title: 'Answer the Following (Paragraphs 30–40 words)', type: 'writing',
            questions: [
              { id: 'q1', number: '1', text: 'Significance of the metaphor.', answer: 'It shows that starting is hardest, but once begun, growth becomes possible.' },
              { id: 'q2', number: '2', text: 'Message of the antithesis.', answer: 'Personal development involves choosing courage over fear.' },
              { id: 'q3', number: '3', text: 'Realistic message of the poem.', answer: 'Believing in yourself is vital, but support, planning, and effort are also necessary.' },
              { id: 'q4', number: '4', text: 'Application in life.', answer: 'Taking the first step in exams or public speaking felt tough, but self-belief helped overcome fear.' },
            ]
          },
          {
            id: 's6', title: 'Vocabulary in Context', type: 'vocabulary',
            questions: [
              { id: 'q1', number: '1', text: 'Latin expressions.', answer: '(i) e.g. → Harry Potter and Magical Paint Brush.\n(ii) quid pro quo → favour in return.\n(iii) etc. → trekking, hiking, biking, etc.\n(iv) per se → by itself.\n(v) ad hoc → temporary team.\n(vi) in media res → movie started in middle of battle.' },
              { id: 'q2', number: '2', text: 'Rhetorical questions.', answer: '(i) "Isn\'t it obvious ...?" → To urge responsibility.\n(ii) "Will we let fear control us ...?" → To inspire courage.' },
              { id: 'q3', number: '3', text: 'Match situations.', answer: 'Standing up for right → A. How can we ever grow if we never try anything new?\nOwning mistake → B. Isn\'t it better to admit our mistakes than let them define us?\nTrying public speaking → C. If I don\'t take responsibility now, when will I?\nChoosing career path → D. Can I really move forward without knowing which path to take?' },
            ]
          },
        ]
      },
    ]
  },
];
