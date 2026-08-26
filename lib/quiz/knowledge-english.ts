import type { SubjectKnowledge } from './knowledge-base';

export const ENGLISH_KNOWLEDGE: SubjectKnowledge = {
  id: 'english', name: 'English', slug: 'english',
  book: 'Blossoms', bookSlug: 'blossoms',
  chapters: [
    {
      id: 'ch01', number: 1, title: 'How I Taught My Grandmother to Read',
      slug: 'how-i-taught-my-grandmother-to-read', subject: 'English',
      keyConcepts: ['narrative', 'reading skills', 'comprehension', 'family bonds', 'learning'],
      topics: [
        { name: 'Comprehension', keywords: ['narrative', 'plot', 'setting', 'character'], concepts: ['Story structure', 'Main idea and supporting details'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Vocabulary', keywords: ['context clue', 'meaning', 'synonym', 'antonym'], concepts: ['Using context to guess meaning', 'Word meanings in context'], difficulty: 'easy', questionTypes: ['fill_blank', 'match_following'] },
        { name: 'Character Analysis', keywords: ['character', 'trait', 'motivation', 'grandmother'], concepts: ['Character traits', 'Relationships between characters'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch02', number: 2, title: 'The Pot Maker',
      slug: 'the-pot-maker', subject: 'English',
      keyConcepts: ['poetry', 'figurative language', 'imagery', 'rhyme scheme', 'tone'],
      topics: [
        { name: 'Poetry Analysis', keywords: ['stanza', 'line', 'rhyme', 'rhythm', 'meter'], concepts: ['Identifying poetic devices', 'Stanza and line structure'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Figurative Language', keywords: ['metaphor', 'simile', 'personification', 'imagery'], concepts: ['Types of figurative language', 'Interpreting imagery'], difficulty: 'moderate', questionTypes: ['match_following', 'short_answer'] },
        { name: 'Theme and Tone', keywords: ['theme', 'tone', 'mood', 'message'], concepts: ['Identifying the central theme', 'Tone of the poet'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch03', number: 3, title: 'Winds of Change',
      slug: 'winds-of-change', subject: 'English',
      keyConcepts: ['prose', 'historical context', 'colonialism', 'resistance', 'social change'],
      topics: [
        { name: 'Comprehension', keywords: ['passage', 'inference', 'context', 'detail'], concepts: ['Inferring meaning from context', 'Identifying main events'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Historical Context', keywords: ['colonial', 'freedom', 'British', 'India'], concepts: ['Historical background of the text', 'Impact of colonialism'], difficulty: 'moderate', questionTypes: ['case_based', 'competency'] },
        { name: 'Literary Devices', keywords: ['imagery', 'symbolism', 'allusion', 'rhetoric'], concepts: ['Identifying literary devices', 'Effect of devices on meaning'], difficulty: 'hard', questionTypes: ['assertion_reason', 'hots'] },
      ],
    },
    {
      id: 'ch04', number: 4, title: 'Vitamin M',
      slug: 'vitamin-m', subject: 'English',
      keyConcepts: ['memoir', 'childhood memories', 'family', 'nostalgia', 'personal narrative'],
      topics: [
        { name: 'Comprehension', keywords: ['memoir', 'sequence', 'detail', 'event'], concepts: ['Identifying key events', 'Sequencing of events'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Character and Theme', keywords: ['family', 'childhood', 'bond', 'love'], concepts: ['Relationships in the text', 'Central themes'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
        { name: 'Writing Skills', keywords: ['narration', 'description', 'sensory detail'], concepts: ['How memoir uses detail', 'First person narration'], difficulty: 'moderate', questionTypes: ['short_answer', 'case_based'] },
      ],
    },
    {
      id: 'ch05', number: 5, title: 'World of Limitless Possibilities',
      slug: 'world-of-limitless-possibilities', subject: 'English',
      keyConcepts: ['science fiction', 'imagination', 'technology', 'future', 'creativity'],
      topics: [
        { name: 'Comprehension', keywords: ['fiction', 'setting', 'plot', 'prediction'], concepts: ['Understanding sci-fi settings', 'Making predictions'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Vocabulary', keywords: ['technical', 'new word', 'guess meaning', 'root'], concepts: ['Word formation', 'Technical vocabulary in context'], difficulty: 'moderate', questionTypes: ['fill_blank', 'match_following'] },
        { name: 'Themes and Imagination', keywords: ['imagination', 'technology', 'possibility', 'future'], concepts: ['Role of imagination in sci-fi', 'Technology and society'], difficulty: 'hard', questionTypes: ['competency', 'hots'] },
      ],
    },
    {
      id: 'ch06', number: 6, title: 'Twin Melodies',
      slug: 'twin-melodies', subject: 'English',
      keyConcepts: ['poetry', 'music', 'cultural heritage', 'parallelism', 'comparison'],
      topics: [
        { name: 'Poetry Analysis', keywords: ['melody', 'rhythm', 'sound', 'verse'], concepts: ['Musical elements in poetry', 'Sound devices'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Figurative Language', keywords: ['parallelism', 'contrast', 'comparison', 'juxtaposition'], concepts: ['Comparing two subjects', 'Use of parallel structure'], difficulty: 'moderate', questionTypes: ['short_answer', 'match_following'] },
        { name: 'Cultural Themes', keywords: ['heritage', 'tradition', 'music', 'culture'], concepts: ['Cultural references in poetry', 'Connection between music and identity'], difficulty: 'hard', questionTypes: ['competency', 'case_based'] },
      ],
    },
    {
      id: 'ch07', number: 7, title: 'Carrier of Words',
      slug: 'carrier-of-words', subject: 'English',
      keyConcepts: ['grammar', 'vocabulary', 'word origins', 'etymology', 'word formation'],
      topics: [
        { name: 'Grammar', keywords: ['tense', 'voice', 'subject', 'verb', 'object'], concepts: ['Parts of speech', 'Sentence structure'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Vocabulary Building', keywords: ['etymology', 'prefix', 'suffix', 'root'], concepts: ['Word origins and history', 'Prefixes and suffixes'], difficulty: 'moderate', questionTypes: ['match_following', 'short_answer'] },
        { name: 'Word Formation', keywords: ['compound', 'derivation', 'affix', 'blend'], concepts: ['How new words are formed', 'Types of word formation'], difficulty: 'hard', questionTypes: ['competency', 'hots'] },
      ],
    },
    {
      id: 'ch08', number: 8, title: 'Follow That Dream',
      slug: 'follow-that-dream', subject: 'English',
      keyConcepts: ['inspiration', 'perseverance', 'goals', 'motivation', 'self-belief'],
      topics: [
        { name: 'Comprehension', keywords: ['goal', 'journey', 'challenge', 'success'], concepts: ['Identifying the central message', 'Key events in the narrative'], difficulty: 'easy', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Character Analysis', keywords: ['determination', 'courage', 'perseverance', 'growth'], concepts: ['Character development', 'Lessons learned'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
        { name: 'Themes and Reflection', keywords: ['inspiration', 'self-belief', 'resilience', 'dream'], concepts: ['Universal themes of perseverance', 'Personal reflection'], difficulty: 'moderate', questionTypes: ['competency', 'case_based'] },
      ],
    },
  ],
};
