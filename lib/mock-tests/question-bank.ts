export interface ChapterTopic {
  chapter: string;
  chapterNumber: number;
  topics: string[];
  keyConcepts: string[];
  formulas?: string[];
  importantTerms?: string[];
}

export interface SubjectKnowledge {
  id: string;
  name: string;
  book: string;
  chapters: ChapterTopic[];
}

export const CLASS_9_KNOWLEDGE: Record<string, SubjectKnowledge> = {
  maths: {
    id: 'maths',
    name: 'Mathematics',
    book: 'Ganita Manjari Part I',
    chapters: [
      {
        chapter: 'Orienting Yourself: The Use of Coordinates',
        chapterNumber: 1,
        topics: ['Cartesian plane', 'Quadrants', 'Plotting points', 'Distance formula', 'Midpoint formula', 'x-axis and y-axis properties'],
        keyConcepts: ['Ordered pairs', 'Coordinate geometry basics', 'Sign conventions in quadrants', 'Points on axes'],
        formulas: ['Distance = √((x₂-x₁)² + (y₂-y₁)²)', 'Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)'],
      },
      {
        chapter: 'Introduction to Linear Polynomials',
        chapterNumber: 2,
        topics: ['Polynomial degree', 'Coefficients', 'Linear equations', 'Value of polynomial', 'Zeroes of polynomial'],
        keyConcepts: ['Degree of polynomial', 'Constant polynomial', 'Linear polynomial', 'Quadratic polynomial', 'Cubic polynomial'],
        formulas: ['p(x) = ax + b (linear)', 'p(x) = ax² + bx + c (quadratic)'],
      },
      {
        chapter: 'The World of Numbers',
        chapterNumber: 3,
        topics: ['Natural numbers', 'Integers', 'Rational numbers', 'Number line', 'Operations on integers', 'Properties of operations'],
        keyConcepts: ['Closure property', 'Commutative property', 'Associative property', 'Distributive property', 'Additive inverse', 'Multiplicative inverse'],
        formulas: ['a × (-b) = -(a×b)', '(-a) × (-b) = a×b', 'a ÷ (-b) = -(a÷b)'],
      },
      {
        chapter: 'Exploring Algebraic Identities',
        chapterNumber: 4,
        topics: ['Algebraic identities', 'Expansion', 'Factorisation', 'Perfect squares', 'Difference of squares'],
        keyConcepts: ['(a+b)² = a²+2ab+b²', '(a-b)² = a²-2ab+b²', '(a+b)(a-b) = a²-b²', '(a+b)³', 'Factorisation using identities'],
        formulas: ['(a+b)² = a²+2ab+b²', '(a-b)² = a²-2ab+b²', '(a+b)(a-b) = a²-b²', '(a+b)³ = a³+3a²b+3ab²+b³'],
      },
      {
        chapter: "I'm Up and Down, and Round and Round",
        chapterNumber: 5,
        topics: ['Circles', 'Circumference', 'Area of circle', 'Arc', 'Sector', 'Chord', 'Radius and diameter relationships'],
        keyConcepts: ['Circumference = 2πr', 'Area = πr²', 'Diameter = 2r', 'Revolution and distance'],
        formulas: ['C = 2πr = πd', 'A = πr²', 'Distance = Circumference × number of revolutions'],
      },
      {
        chapter: 'Measuring Space: Perimeter and Area',
        chapterNumber: 6,
        topics: ['Perimeter of rectangles', 'Area of rectangles', 'Area of squares', 'Area of triangles', 'Heron\'s formula', 'Area of trapezium', 'Area of parallelogram', 'Area of rhombus'],
        keyConcepts: ['Rectangle area = l×b', 'Square area = s²', 'Triangle area = ½×base×height', "Heron's formula", 'Trapezium area'],
        formulas: ['Rectangle: A = l×b, P = 2(l+b)', 'Square: A = s², P = 4s', 'Triangle: A = ½bh', 'Trapezium: A = ½(a+b)h', "Heron's: A = √(s(s-a)(s-b)(s-c))"],
      },
      {
        chapter: 'The Mathematics of Maybe: Introduction to Probability',
        chapterNumber: 7,
        topics: ['Probability basics', 'Sample space', 'Favourable outcomes', 'Events', 'Sure and impossible events'],
        keyConcepts: ['P(E) = Favourable/Total outcomes', 'Sample space', 'Sure event P=1', 'Impossible event P=0', 'Probability range 0-1'],
        formulas: ['P(E) = Number of favourable outcomes / Total number of outcomes', '0 ≤ P(E) ≤ 1'],
      },
      {
        chapter: 'Sequences and Progressions',
        chapterNumber: 8,
        topics: ['Arithmetic Progression', 'Common difference', 'nth term', 'Sum of AP', 'Finite and infinite AP'],
        keyConcepts: ['AP: numbers with constant difference', 'First term a', 'Common difference d', 'nth term formula', 'Sum formula'],
        formulas: ['nth term: aₙ = a + (n-1)d', 'Sum: Sₙ = n/2[2a + (n-1)d]', 'Sum: Sₙ = n/2(a + l)'],
      },
    ],
  },
  science: {
    id: 'science',
    name: 'Science',
    book: 'Exploration',
    chapters: [
      {
        chapter: 'Exploration: Entering the World of Secondary Science',
        chapterNumber: 1,
        topics: ['Scientific method', 'SI units', 'Laboratory safety', 'Observation and inference', 'Models in science'],
        keyConcepts: ['Hypothesis', 'Experiment', 'Observation', 'Conclusion', 'SI base units', 'Derived units', 'Significant figures'],
      },
      {
        chapter: 'The Fundamental Unit of Life: The Cell',
        chapterNumber: 2,
        topics: ['Cell structure', 'Cell organelles', 'Plant and animal cells', 'Cell membrane', 'Nucleus', 'Mitochondria'],
        keyConcepts: ['Cell theory', 'Prokaryotic and eukaryotic cells', 'Cell membrane function', 'Nucleus as control centre', 'Mitochondria as power house'],
      },
      {
        chapter: 'Tissues: The Building Blocks',
        chapterNumber: 3,
        topics: ['Plant tissues', 'Animal tissues', 'Meristematic tissue', 'Permanent tissue', 'Epithelial tissue', 'Connective tissue'],
        keyConcepts: ['Simple and complex permanent tissues', 'Xylem and phloem', 'Simple permanent: parenchyma, collenchyma, sclerenchyma', 'Vascular and non-vascular tissues'],
      },
      {
        chapter: 'Describing Motion',
        chapterNumber: 4,
        topics: ['Distance and displacement', 'Speed and velocity', 'Acceleration', 'Uniform and non-uniform motion', 'Distance-time graphs'],
        keyConcepts: ['Scalar and vector quantities', 'Speed = distance/time', 'Velocity = displacement/time', 'Acceleration = change in velocity/time', 'Retardation'],
        formulas: ['Speed = Distance/Time', 'Velocity = Displacement/Time', 'Acceleration = (v-u)/t', 'Distance = ut + ½at²', 'v² = u² + 2as'],
      },
      {
        chapter: 'Separating Mixtures',
        chapterNumber: 5,
        topics: ['Types of mixtures', 'Separation techniques', 'Evaporation', 'Distillation', 'Chromatography', 'Filtration'],
        keyConcepts: ['Homogeneous and heterogeneous mixtures', 'Solutions, suspensions, colloids', 'Sublimation', 'Centrifugation', 'Separating funnel'],
      },
      {
        chapter: 'How Forces Affect Motion',
        chapterNumber: 6,
        topics: ['Force and motion', 'Newton\'s laws', 'Friction', 'Inertia', 'Momentum', 'Balanced and unbalanced forces'],
        keyConcepts: ['Force causes change in motion', 'Newton\'s first law (inertia)', 'Newton\'s second law (F=ma)', 'Newton\'s third law', 'Friction types'],
        formulas: ['F = ma', 'p = mv', 'Weight = mg'],
      },
      {
        chapter: 'Work, Energy and Simple Machines',
        chapterNumber: 7,
        topics: ['Work done', 'Energy types', 'Power', 'Simple machines', 'Machine principle', 'Efficiency'],
        keyConcepts: ['Work = Force × displacement', 'Kinetic and potential energy', 'Conservation of energy', 'MA and VR', 'Efficiency = MA/VR × 100%'],
        formulas: ['W = F × d', 'KE = ½mv²', 'PE = mgh', 'Power = Work/Time', 'MA = Load/Effort', 'VR = Effort arm/Load arm'],
      },
      {
        chapter: 'Journey Inside the Atom',
        chapterNumber: 8,
        topics: ['Atomic structure', 'Subatomic particles', 'Thomson model', 'Rutherford model', 'Bohr model', 'Electron configuration'],
        keyConcepts: ['Proton, neutron, electron', 'Atomic number and mass number', 'Isotopes', 'Isobars', 'Shell configuration (K, L, M, N)'],
      },
      {
        chapter: 'Atoms and Molecules',
        chapterNumber: 9,
        topics: ['Dalton\'s atomic theory', 'Laws of chemical combination', 'Molecules', 'Ions', 'Chemical formulas', 'Molecular mass'],
        keyConcepts: ['Law of conservation of mass', 'Law of constant proportions', 'Formula unit', 'Molecular mass', 'Avogadro number'],
      },
      {
        chapter: 'Sound Waves',
        chapterNumber: 10,
        topics: ['Sound production', 'Sound传播', 'Sound speed', 'Pitch and frequency', 'Loudness and amplitude', 'Echo and ultrasound'],
        keyConcepts: ['Sound needs medium', 'Speed of sound in air ~344 m/s', 'Frequency → pitch', 'Amplitude → loudness', 'Infrasound and ultrasound'],
      },
      {
        chapter: 'Reproduction in Living Organisms',
        chapterNumber: 11,
        topics: ['Reproduction types', 'Asexual reproduction', 'Sexual reproduction', 'Fission', 'Budding', 'Vegetative propagation'],
        keyConcepts: ['Why reproduction is essential', 'Asexual vs sexual reproduction', 'Binary fission', 'Multiple fission', 'Spore formation'],
      },
      {
        chapter: 'Diversity in Living Organisms',
        chapterNumber: 12,
        topics: ['Classification', 'Taxonomy', 'Five kingdom classification', 'Plant groups', 'Animal groups', 'Biodiversity'],
        keyConcepts: ['Whittaker\'s five kingdom system', 'Basis of classification', 'Vertebrates and invertebrates', 'Cryptogams and phanerogams'],
      },
      {
        chapter: 'The Earth as a System',
        chapterNumber: 13,
        topics: ['Earth\'s structure', 'Lithosphere', 'Atmosphere', 'Hydrosphere', 'Biosphere', 'Earth\'s layers'],
        keyConcepts: ['Crust, mantle, core', 'Tectonic plates', 'Rock cycle', 'Earth\'s atmosphere layers', 'Environmental interactions'],
      },
    ],
  },
  english: {
    id: 'english',
    name: 'English',
    book: 'Kaveri',
    chapters: [
      {
        chapter: 'How I Taught My Grandmother to Read',
        chapterNumber: 1,
        topics: ['Narrative writing', 'Family relationships', 'Importance of literacy', 'Indian culture', 'Reading and learning'],
        keyConcepts: ['Narrative techniques', 'Character sketch', 'Theme analysis', 'Reading comprehension', 'Vocabulary building'],
      },
      {
        chapter: 'The Pot Maker',
        chapterNumber: 2,
        topics: ['Poetry analysis', 'Rhyme scheme', 'Metre', 'Figurative language', 'Literary devices'],
        keyConcepts: ['Alliteration', 'Simile', 'Metaphor', 'Imagery', 'Personification', 'Poetic appreciation'],
      },
      {
        chapter: 'Winds of Change',
        chapterNumber: 3,
        topics: ['Prose analysis', 'Social change', 'Historical context', 'Writing styles', 'Comprehension skills'],
        keyConcepts: ['Critical thinking', 'Textual analysis', 'Inference making', 'Contextual vocabulary'],
      },
      {
        chapter: 'Vitamin-M',
        chapterNumber: 4,
        topics: ['Humour in writing', 'Wordplay', 'Dialogue', 'Character building', 'Story comprehension'],
        keyConcepts: ['Narrative voice', 'Dialogue punctuation', 'Tone and mood', 'Comprehension strategies'],
      },
      {
        chapter: 'World of Limitless Possibilities',
        chapterNumber: 5,
        topics: ['Science fiction', 'Imagination', 'Technology', 'Future vision', 'Creative writing'],
        keyConcepts: ['Creative expression', 'Descriptive writing', 'Expanding vocabulary', 'Idea generation'],
      },
      {
        chapter: 'Twin Melodies',
        chapterNumber: 6,
        topics: ['Music in literature', 'Sensory language', 'Emotional expression', 'Cultural references'],
        keyConcepts: ['Sensory imagery', 'Emotional appeal', 'Cultural context', 'Literary appreciation'],
      },
      {
        chapter: 'Carrier of Words',
        chapterNumber: 7,
        topics: ['Communication', 'Language usage', 'Grammar in context', 'Writing skills'],
        keyConcepts: ['Active and passive voice', 'Direct and reported speech', 'Tenses', 'Grammar application'],
      },
      {
        chapter: 'Follow That Dream',
        chapterNumber: 8,
        topics: ['Aspirations', 'Goal setting', 'Perseverance', 'Biographical elements'],
        keyConcepts: ['Theme of ambition', 'Character analysis', 'Story structure', 'Writing techniques'],
      },
    ],
  },
  sst: {
    id: 'sst',
    name: 'Social Science',
    book: 'Understanding Society: India and Beyond',
    chapters: [
      {
        chapter: 'Understanding Social Science',
        chapterNumber: 1,
        topics: ['Social science disciplines', 'Geography', 'History', 'Civics', 'Economics', 'Research methods'],
        keyConcepts: ['Interdisciplinary approach', 'Society and social groups', 'Culture', 'Socialization', 'Research methodology'],
      },
      {
        chapter: 'Shaping of the Earth\'s Surface',
        chapterNumber: 2,
        topics: ['Earth\'s interior', 'Tectonic plates', 'Volcanoes', 'Earthquakes', 'Rock cycle', 'Weathering'],
        keyConcepts: ['Endogenic and exogenic forces', 'Continental drift', 'Plate tectonics', 'Types of rocks', 'Soil formation'],
      },
      {
        chapter: 'Atmosphere and Climate',
        chapterNumber: 3,
        topics: ['Atmosphere layers', 'Weather and climate', 'Monsoon', 'Climate zones', 'Climate change'],
        keyConcepts: ['Troposphere and weather', 'Greenhouse effect', 'Indian monsoon', 'Climate classification', 'Global warming'],
      },
      {
        chapter: 'Early Humans and Beginning of Civilisation',
        chapterNumber: 4,
        topics: ['Stone Age', 'Paleolithic', 'Mesolithic', 'Neolithic', 'Early settlements', 'Agricultural revolution'],
        keyConcepts: ['Hunter-gatherers', 'Tool making', 'Domestication', 'Settled life', 'Indus Valley Civilization'],
      },
      {
        chapter: 'State and Society up to 1000 CE',
        chapterNumber: 5,
        topics: ['Ancient kingdoms', 'Maurya empire', 'Gupta period', 'Social hierarchy', 'Religion and society'],
        keyConcepts: ['Administrative systems', 'Caste system', 'Varna and Jati', 'Religious practices', 'Trade and economy'],
      },
      {
        chapter: 'Democracy in the Modern World',
        chapterNumber: 6,
        topics: ['Democracy concept', 'Types of government', 'Indian democracy', 'Constitution', 'Fundamental rights'],
        keyConcepts: ['Free and fair elections', 'Rule of law', 'Separation of powers', 'Fundamental duties', 'Panchayati Raj'],
      },
      {
        chapter: 'Elections and Representation',
        chapterNumber: 7,
        topics: ['Electoral process', 'Election Commission', 'Voting system', 'Political parties', 'Representation'],
        keyConcepts: ['Universal adult franchise', 'FPTP system', 'Election Commission of India', 'Model code of conduct', 'EVM and VVPAT'],
      },
      {
        chapter: 'Building Blocks in Economics: The Problem of Choice',
        chapterNumber: 8,
        topics: ['Economic problem', 'Scarcity', 'Opportunity cost', 'Production possibility curve', 'Economic systems'],
        keyConcepts: ['Central economic problem', 'Unlimited wants vs limited resources', 'Opportunity cost concept', 'Types of economies'],
      },
      {
        chapter: 'The Price Puzzle: What Drives the Market',
        chapterNumber: 9,
        topics: ['Demand and supply', 'Price determination', 'Market equilibrium', 'Factors affecting demand and supply'],
        keyConcepts: ['Law of demand', 'Law of supply', 'Equilibrium price', 'Shift vs movement', 'Market forces'],
      },
    ],
  },
  'it-part-a': {
    id: 'it-part-a',
    name: 'Information Technology (Part A)',
    book: 'Employability Skills',
    chapters: [
      {
        chapter: 'Communication Skills',
        chapterNumber: 1,
        topics: ['Verbal communication', 'Non-verbal communication', 'Barriers to communication', 'Effective communication'],
        keyConcepts: ['Listening skills', 'Body language', 'Written communication', 'Professional communication'],
      },
      {
        chapter: 'Self-Management Skills',
        chapterNumber: 2,
        topics: ['Self-awareness', 'Motivation', 'Time management', 'Stress management', 'Emotional intelligence'],
        keyConcepts: ['Goal setting', 'Positive attitude', 'Self-confidence', 'Work-life balance'],
      },
      {
        chapter: 'ICT Skills',
        chapterNumber: 3,
        topics: ['Computer basics', 'Operating system', 'File management', 'Internet and email', 'Digital literacy'],
        keyConcepts: ['Hardware and software', 'Input/output devices', 'Network basics', 'Cyber safety'],
      },
      {
        chapter: 'Entrepreneurial Skills',
        chapterNumber: 4,
        topics: ['Entrepreneurship', 'Business plan', 'Market research', 'Risk taking', 'Innovation'],
        keyConcepts: ['Entrepreneur qualities', 'Opportunity identification', 'Resource management', 'Business ethics'],
      },
      {
        chapter: 'Green Skills',
        chapterNumber: 5,
        topics: ['Environmental awareness', 'Sustainability', 'Reduce-Reuse-Recycle', 'Green practices', 'E-waste management'],
        keyConcepts: ['Carbon footprint', 'Sustainable development', 'Environmental protection', 'Energy conservation'],
      },
    ],
  },
  'it-part-b': {
    id: 'it-part-b',
    name: 'Information Technology (Part B)',
    book: 'Code 402',
    chapters: [
      {
        chapter: 'Keyboarding Skills',
        chapterNumber: 1,
        topics: ['Touch typing', 'Keyboard layout', 'Speed and accuracy', 'Ergonomics'],
        keyConcepts: ['Home row keys', 'Typing techniques', 'Speed calculation', 'Practice methods'],
      },
      {
        chapter: 'LibreOffice Writer',
        chapterNumber: 2,
        topics: ['Document creation', 'Formatting', 'Mail merge', 'Styles', 'Templates'],
        keyConcepts: ['Text formatting', 'Page layout', 'Table creation', 'Headers and footers', 'Track changes'],
      },
      {
        chapter: 'LibreOffice Calc',
        chapterNumber: 3,
        topics: ['Spreadsheet basics', 'Formulas', 'Functions', 'Charts', 'Data analysis'],
        keyConcepts: ['Cell references', 'SUM, AVERAGE, COUNT', 'VLOOKUP', 'Conditional formatting', 'Pivot tables'],
      },
      {
        chapter: 'LibreOffice Impress',
        chapterNumber: 4,
        topics: ['Presentation basics', 'Slide design', 'Animations', 'Transitions', 'Master slides'],
        keyConcepts: ['Slide layouts', 'Object formatting', 'Slide transitions', 'Presentation delivery'],
      },
    ],
  },
  'advanced-maths': {
    id: 'advanced-maths',
    name: 'Advanced Mathematics',
    book: 'Advanced Mathematics',
    chapters: [
      {
        chapter: 'Sets',
        chapterNumber: 1,
        topics: ['Set notation', 'Roster and set-builder forms', 'Types of sets', 'Subsets', 'Power set', "De Morgan's laws"],
        keyConcepts: ['Empty set', 'Universal set', 'Venn diagrams', 'Union and intersection', 'Complement of set'],
        formulas: ["De Morgan's: (A∪B)' = A'∩B'", "(A∩B)' = A'∪B'", 'n(A∪B) = n(A) + n(B) - n(A∩B)'],
      },
      {
        chapter: 'Logarithms',
        chapterNumber: 2,
        topics: ['Logarithm definition', 'Properties of logarithms', 'Common and natural logarithms', 'Change of base'],
        keyConcepts: ['log_a(b) = c means a^c = b', 'Product rule', 'Quotient rule', 'Power rule'],
        formulas: ['log(ab) = log a + log b', 'log(a/b) = log a - log b', 'log(a^n) = n·log a', 'log_a(a) = 1', 'log_a(1) = 0'],
      },
      {
        chapter: 'Relations and Functions',
        chapterNumber: 3,
        topics: ['Ordered pairs', 'Cartesian product', 'Relations', 'Functions', 'Domain and range', 'Types of functions'],
        keyConcepts: ['Relation as subset of Cartesian product', 'Function as special relation', 'One-one and onto functions', 'Identity function'],
      },
      {
        chapter: 'Coordinate Geometry',
        chapterNumber: 4,
        topics: ['Slope of a line', 'Equation of a line', 'Parallel and perpendicular lines', 'Section formula'],
        keyConcepts: ['Slope = tan θ', 'Point-slope form', 'Slope-intercept form', 'Condition for parallel/perpendicular'],
        formulas: ['Slope m = (y₂-y₁)/(x₂-x₁)', 'y - y₁ = m(x - x₁)', 'y = mx + c', 'Parallel: m₁ = m₂', 'Perpendicular: m₁×m₂ = -1'],
      },
      {
        chapter: 'Combinatorics',
        chapterNumber: 5,
        topics: ['Permutations', 'Combinations', 'Factorial', 'Fundamental counting principle', 'Applications'],
        keyConcepts: ['nPr = n!/(n-r)!', 'nCr = n!/(r!(n-r)!)', 'Permutation with repetition', 'Combination order doesn\'t matter'],
        formulas: ['n! = n×(n-1)×...×1', 'nPr = n!/(n-r)!', 'nCr = nPr/r!'],
      },
      {
        chapter: 'Exploring Some More Progressions',
        chapterNumber: 6,
        topics: ['Arithmetic Progression', 'Geometric Progression', 'Sum formulas', 'nth term'],
        keyConcepts: ['AP: constant common difference', 'GP: constant common ratio', 'Finite and infinite sequences'],
        formulas: ['AP: aₙ = a+(n-1)d', 'GP: aₙ = ar^(n-1)', 'GP sum: Sₙ = a(r^n-1)/(r-1)'],
      },
    ],
  },
  'advanced-science': {
    id: 'advanced-science',
    name: 'Advanced Science',
    book: 'Science Advanced',
    chapters: [
      {
        chapter: 'Measurement and Units',
        chapterNumber: 1,
        topics: ['SI units', 'Dimensional analysis', 'Significant figures', 'Errors in measurement', 'Vernier calipers', 'Screw gauge'],
        keyConcepts: ['Seven SI base units', 'Derived units', 'Least count', 'Absolute and relative error'],
      },
      {
        chapter: 'Understanding Motion',
        chapterNumber: 2,
        topics: ['Distance and displacement', 'Velocity and acceleration', 'Equations of motion', 'Graphs of motion'],
        keyConcepts: ['Uniform and non-uniform motion', 'Average and instantaneous quantities', 'Free fall'],
        formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as'],
      },
      {
        chapter: 'Newton\'s Laws of Motion',
        chapterNumber: 3,
        topics: ['Newton\'s three laws', 'Inertia', 'Momentum', 'Impulse', 'Action-reaction pairs'],
        keyConcepts: ['F = ma', 'Conservation of momentum', 'Friction', 'Rocket propulsion'],
        formulas: ['F = ma', 'p = mv', 'Impulse = F×t = Δp'],
      },
      {
        chapter: 'Advanced Simple Machines',
        chapterNumber: 4,
        topics: ['Lever classes', 'Pulley systems', 'Inclined plane', 'MA, VR, efficiency', 'Power'],
        keyConcepts: ['Mechanical advantage', 'Velocity ratio', 'Ideal and actual MA', 'Friction in machines'],
        formulas: ['MA = Load/Effort', 'VR = distance moved by effort / distance moved by load', 'η = MA/VR × 100%'],
      },
      {
        chapter: 'Work and Energy',
        chapterNumber: 5,
        topics: ['Work definition', 'Kinetic energy', 'Potential energy', 'Conservation of energy', 'Power'],
        keyConcepts: ['Work done by force at angle', 'Energy transformations', 'Conservation laws'],
        formulas: ['W = Fd cos θ', 'KE = ½mv²', 'PE = mgh', 'P = W/t'],
      },
      {
        chapter: 'Structure of Atom',
        chapterNumber: 6,
        topics: ['Atomic models', 'Bohr model', 'Electronic configuration', 'Quantum numbers', 'Moseley\'s law'],
        keyConcepts: ['Thomson, Rutherford, Bohr models', 'Energy levels', 'Shells and subshells', 'Atomic number and Z'],
      },
      {
        chapter: 'Chemical Bonding',
        chapterNumber: 7,
        topics: ['Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Electronegativity', 'Lewis structures'],
        keyConcepts: ['Electron transfer', 'Electron sharing', 'Bond polarity', 'Octet rule', 'Coordinate bonding'],
      },
      {
        chapter: 'Mixtures and Separation',
        chapterNumber: 8,
        topics: ['Types of mixtures', 'Separation methods', 'Solutions', 'Suspensions', 'Colloids'],
        keyConcepts: ['Distillation', 'Chromatography', 'Evaporation', 'Sublimation', 'Centrifugation'],
      },
      {
        chapter: 'Microscope and Microscopy',
        chapterNumber: 9,
        topics: ['Light microscope', 'Magnification', 'Resolution', 'Types of microscopes', 'Microscopy techniques'],
        keyConcepts: ['Compound microscope parts', 'Magnifying power', 'Resolution limit', 'Electron microscope basics'],
      },
      {
        chapter: 'Biotechnology',
        chapterNumber: 10,
        topics: ['Biotechnology definition', 'Applications', 'Genetic engineering', 'Fermentation', 'Bioethics'],
        keyConcepts: ['Recombinant DNA technology', 'PCR basics', 'Genetic modification', 'Industrial biotechnology'],
      },
    ],
  },
};

export function getChaptersForSubject(subjectId: string): ChapterTopic[] {
  return CLASS_9_KNOWLEDGE[subjectId]?.chapters || [];
}

export function getTopicsForChapter(subjectId: string, chapterNumber: number): ChapterTopic | undefined {
  return CLASS_9_KNOWLEDGE[subjectId]?.chapters.find(ch => ch.chapterNumber === chapterNumber);
}

export function getAllSubjectIds(): string[] {
  return Object.keys(CLASS_9_KNOWLEDGE);
}

export function getSubjectDisplayName(subjectId: string): string {
  return CLASS_9_KNOWLEDGE[subjectId]?.name || subjectId;
}

export function getSubjectBookName(subjectId: string): string {
  return CLASS_9_KNOWLEDGE[subjectId]?.book || '';
}
