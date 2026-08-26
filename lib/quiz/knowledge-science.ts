import type { SubjectKnowledge } from './knowledge-base';

export const SCIENCE_KNOWLEDGE: SubjectKnowledge = {
  id: 'science', name: 'Science', slug: 'science',
  book: 'Exploration', bookSlug: 'exploration',
  chapters: [
    {
      id: 'ch01', number: 1, title: 'Exploring the World of Science',
      slug: 'exploring-the-world-of-science', subject: 'Science',
      keyConcepts: ['scientific method', 'SI units', 'measurement', 'uncertainty', 'significant figures'],
      topics: [
        { name: 'Scientific Method', keywords: ['observation', 'hypothesis', 'experiment', 'conclusion'], concepts: ['Steps of scientific method', 'Formulating hypotheses'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'SI Units and Measurement', keywords: ['SI unit', 'meter', 'kilogram', 'second', 'measurement'], concepts: ['Fundamental and derived units', 'Precision and accuracy'], difficulty: 'easy', questionTypes: ['mcq', 'numerical'] },
        { name: 'Uncertainty in Measurement', keywords: ['error', 'significant figures', 'precision', 'accuracy'], concepts: ['Significant figures', 'Rounding off'], difficulty: 'moderate', questionTypes: ['numerical', 'short_answer'] },
      ],
    },
    {
      id: 'ch02', number: 2, title: 'The Cell',
      slug: 'the-cell', subject: 'Science',
      keyConcepts: ['cell structure', 'organelles', 'prokaryotic', 'eukaryotic', 'cell membrane'],
      topics: [
        { name: 'Cell Structure', keywords: ['nucleus', 'cytoplasm', 'membrane', 'organelle'], concepts: ['Parts of a cell', 'Cell membrane function'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Types of Cells', keywords: ['prokaryotic', 'eukaryotic', 'bacteria', 'plant', 'animal'], concepts: ['Prokaryotic vs eukaryotic', 'Plant vs animal cells'], difficulty: 'moderate', questionTypes: ['mcq', 'match_following', 'assertion_reason'] },
        { name: 'Cell Organelles', keywords: ['mitochondria', 'ribosome', 'golgi', 'ER', 'vacuole'], concepts: ['Functions of organelles', 'Endoplasmic reticulum'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
      ],
    },
    {
      id: 'ch03', number: 3, title: 'Tissues',
      slug: 'tissues', subject: 'Science',
      keyConcepts: ['meristematic tissue', 'permanent tissue', 'epithelial', 'connective', 'muscular', 'nervous'],
      topics: [
        { name: 'Plant Tissues', keywords: ['meristematic', 'permanent', 'xylem', 'phloem'], concepts: ['Meristematic vs permanent', 'Vascular tissues'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Animal Tissues', keywords: ['epithelial', 'connective', 'muscular', 'nervous'], concepts: ['Types of animal tissues', 'Functions'], difficulty: 'moderate', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Tissue Systems', keywords: ['tissue system', 'organ', 'organ system'], concepts: ['Plant tissue systems', 'Complex tissues'], difficulty: 'hard', questionTypes: ['assertion_reason', 'competency'] },
      ],
    },
    {
      id: 'ch04', number: 4, title: 'Describing Motion',
      slug: 'describing-motion', subject: 'Science',
      keyConcepts: ['speed', 'velocity', 'acceleration', 'distance', 'displacement', 'uniform motion'],
      formulas: ['Speed = Distance/Time', 'Velocity = Displacement/Time', 'Acceleration = (v-u)/t'],
      topics: [
        { name: 'Distance and Displacement', keywords: ['distance', 'displacement', 'path length', 'vector'], concepts: ['Scalar vs vector quantities', 'Path dependent vs path independent'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Speed and Velocity', keywords: ['speed', 'velocity', 'uniform', 'non-uniform'], concepts: ['Average speed', 'Instantaneous velocity'], difficulty: 'moderate', questionTypes: ['numerical', 'mcq'] },
        { name: 'Acceleration and Graphs', keywords: ['acceleration', 'deceleration', 'distance-time', 'velocity-time'], concepts: ['Interpreting motion graphs', 'Uniform acceleration'], difficulty: 'hard', questionTypes: ['numerical', 'competency', 'hots'] },
      ],
    },
    {
      id: 'ch05', number: 5, title: 'Mixtures',
      slug: 'mixtures', subject: 'Science',
      keyConcepts: ['solution', 'suspension', 'colloid', 'separation', 'solubility'],
      topics: [
        { name: 'Types of Mixtures', keywords: ['solution', 'suspension', 'colloid', 'homogeneous', 'heterogeneous'], concepts: ['True solution vs colloid vs suspension', 'Tyndall effect'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Separation Techniques', keywords: ['filtration', 'distillation', 'chromatography', 'evaporation'], concepts: ['Methods of separation', 'Choosing the right technique'], difficulty: 'moderate', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Concentration of Solutions', keywords: ['concentration', 'saturated', 'solubility', 'dissolving'], concepts: ['Saturated and unsaturated solutions', 'Factors affecting solubility'], difficulty: 'moderate', questionTypes: ['numerical', 'competency'] },
      ],
    },
    {
      id: 'ch06', number: 6, title: 'How Forces Affect Motion',
      slug: 'how-forces-affect-motion', subject: 'Science',
      keyConcepts: ['force', 'friction', 'gravity', 'Newton laws', 'inertia'],
      formulas: ['F = ma', 'W = mg', 'F_net = F1 + F2 + ...'],
      topics: [
        { name: 'Force and its Effects', keywords: ['force', 'push', 'pull', 'net force'], concepts: ['Effects of force', 'Balanced and unbalanced forces'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Laws of Motion', keywords: ['Newton', 'inertia', 'action', 'reaction', 'F=ma'], concepts: ['Three laws of motion', 'Inertia and mass'], difficulty: 'moderate', questionTypes: ['mcq', 'assertion_reason'] },
        { name: 'Friction and Gravity', keywords: ['friction', 'gravity', 'weight', 'normal force'], concepts: ['Types of friction', 'Gravitational force'], difficulty: 'hard', questionTypes: ['numerical', 'competency', 'hots'] },
      ],
    },
    {
      id: 'ch07', number: 7, title: 'Work Energy and Simple Machines',
      slug: 'work-energy-and-simple-machines', subject: 'Science',
      keyConcepts: ['work', 'energy', 'power', 'kinetic energy', 'potential energy', 'machines'],
      formulas: ['W = F*d', 'KE = 1/2*mv^2', 'PE = mgh', 'Power = Work/Time'],
      topics: [
        { name: 'Work and Energy', keywords: ['work', 'energy', 'joule', 'transfer'], concepts: ['Conditions for work', 'Forms of energy'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Kinetic and Potential Energy', keywords: ['KE', 'PE', 'motion', 'height', 'position'], concepts: ['KE depends on mass and velocity', 'PE depends on height and mass'], difficulty: 'moderate', questionTypes: ['numerical', 'mcq'] },
        { name: 'Simple Machines and Power', keywords: ['lever', 'pulley', 'machine', 'power', 'watt'], concepts: ['Types of simple machines', 'Mechanical advantage'], difficulty: 'hard', questionTypes: ['numerical', 'competency', 'case_based'] },
      ],
    },
    {
      id: 'ch08', number: 8, title: 'Journey Inside the Atom',
      slug: 'journey-inside-the-atom', subject: 'Science',
      keyConcepts: ['protons', 'neutrons', 'electrons', 'atomic number', 'mass number', 'isotopes'],
      formulas: ['Mass number = Protons + Neutrons', 'Atomic number = Number of protons'],
      topics: [
        { name: 'Subatomic Particles', keywords: ['proton', 'neutron', 'electron', 'charge', 'mass'], concepts: ['Discovery of subatomic particles', 'Relative charges and masses'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Atomic Structure', keywords: ['atomic number', 'mass number', 'isotope', 'isobar'], concepts: ['Calculating subatomic particles', 'Isotopes and isobars'], difficulty: 'moderate', questionTypes: ['numerical', 'mcq'] },
        { name: 'Electronic Configuration', keywords: ['shell', 'K', 'L', 'M', 'valence'], concepts: ['Bohr model', 'Filling electron shells'], difficulty: 'hard', questionTypes: ['numerical', 'assertion_reason'] },
      ],
    },
    {
      id: 'ch09', number: 9, title: 'Sound Waves',
      slug: 'sound-waves', subject: 'Science',
      keyConcepts: ['frequency', 'pitch', 'amplitude', 'loudness', 'speed of sound', 'echo'],
      formulas: ['Speed = Distance/Time', 'Frequency = 1/Time period', 'v = f * lambda'],
      topics: [
        { name: 'Properties of Sound', keywords: ['frequency', 'amplitude', 'pitch', 'loudness'], concepts: ['Relation between frequency and pitch', 'Relation between amplitude and loudness'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Speed of Sound', keywords: ['speed', 'medium', 'temperature', 'echo'], concepts: ['Sound needs a medium', 'Echo and reverberation'], difficulty: 'moderate', questionTypes: ['numerical', 'short_answer'] },
        { name: 'Noise and Music', keywords: ['noise', 'musical sound', 'vibration', 'resonance'], concepts: ['Musical instruments classification', 'Factors affecting sound quality'], difficulty: 'moderate', questionTypes: ['competency', 'case_based'] },
      ],
    },
    {
      id: 'ch10', number: 10, title: 'Reproduction',
      slug: 'reproduction', subject: 'Science',
      keyConcepts: ['asexual reproduction', 'sexual reproduction', 'binary fission', 'budding', 'vegetative propagation'],
      topics: [
        { name: 'Asexual Reproduction', keywords: ['binary fission', 'budding', 'fragmentation', 'spore'], concepts: ['Types of asexual reproduction', 'Single parent involved'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Sexual Reproduction', keywords: ['gamete', 'fertilization', 'zygote', 'flower'], concepts: ['Male and female gametes', 'Fertilization process'], difficulty: 'moderate', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Reproduction in Plants', keywords: ['vegetative propagation', 'layering', 'cutting', 'grafting'], concepts: ['Methods of vegetative propagation', 'Advantages of asexual reproduction'], difficulty: 'moderate', questionTypes: ['competency', 'assertion_reason'] },
      ],
    },
    {
      id: 'ch11', number: 11, title: 'Diversity in Living Organisms',
      slug: 'diversity-in-living-organisms', subject: 'Science',
      keyConcepts: ['classification', 'taxonomy', 'kingdoms', 'vertebrates', 'invertebrates', 'binomial nomenclature'],
      topics: [
        { name: 'Classification Systems', keywords: ['kingdom', 'phylum', 'class', 'order', 'family'], concepts: ['Five kingdom classification', 'Taxonomic hierarchy'], difficulty: 'easy', questionTypes: ['mcq', 'match_following'] },
        { name: 'Animal Groups', keywords: ['vertebrate', 'invertebrate', 'mammal', 'reptile', 'amphibian'], concepts: ['Vertebrate classes', 'Characteristics of each group'], difficulty: 'moderate', questionTypes: ['mcq', 'short_answer'] },
        { name: 'Plant Groups and Binomial Nomenclature', keywords: ['binomial', 'nomenclature', 'genus', 'species'], concepts: ['Rules of naming', 'Plant classification'], difficulty: 'moderate', questionTypes: ['assertion_reason', 'competency'] },
      ],
    },
    {
      id: 'ch12', number: 12, title: 'Earth as a System',
      slug: 'earth-as-a-system', subject: 'Science',
      keyConcepts: ['lithosphere', 'atmosphere', 'hydrosphere', 'biosphere', 'earth systems'],
      topics: [
        { name: 'Spheres of the Earth', keywords: ['lithosphere', 'atmosphere', 'hydrosphere', 'biosphere'], concepts: ['Components of each sphere', 'Interdependence of spheres'], difficulty: 'easy', questionTypes: ['mcq', 'fill_blank'] },
        { name: 'Earth Systems Interaction', keywords: ['interaction', 'cycle', 'balance', 'system'], concepts: ['How spheres interact', 'Water cycle example'], difficulty: 'moderate', questionTypes: ['short_answer', 'competency'] },
        { name: 'Human Impact', keywords: ['pollution', 'conservation', 'sustainability', 'environment'], concepts: ['Human activities affecting earth systems', 'Importance of balance'], difficulty: 'hard', questionTypes: ['case_based', 'hots'] },
      ],
    },
  ],
};
