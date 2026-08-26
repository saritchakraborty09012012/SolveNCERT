// Advanced Science (Optional/Extended), Class 9 — CBSE 2026-27
// Complete Question-Answer Guide (Chapters 1-10) copied from:
//   "Science at Advanced Level (Optional) - Grade 9
//    Complete Question-Answer Guide (Chapters 1-10)"
// Every question from every chapter section - Quick Check, Check Your
// Understanding, in-text activities, and end-of-chapter exercises.

export interface AdvScienceQuestion {
  id:     string;
  number: string;
  text:   string;
  parts?: string[];
  isHard: boolean;
  answer: { answerKey: string; schoolMethod: string; };
}
export interface AdvScienceSection { id: string; title: string; questions: AdvScienceQuestion[]; }
export interface AdvScienceChapter {
  id: string; number: number; title: string; slug: string; code: string;
  description: string; exercises: AdvScienceSection[];
}

export const ADVSCIENCE_CHAPTERS: AdvScienceChapter[] = [
  {
    id: 'ch01', number: 1,
    title: 'Measurement - The Foundation of Science',
    slug: 'measurement-the-foundation-of-science',
    code: 'as01',
    description: 'Systems of units (CGS, FPS, SI), unit conversion, why measurement matters in physics and trade, and the relation Magnitude = Numerical value × Unit.',
    exercises: [
      {
        id: 'ex1.1', title: 'Quick Check',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Name any two systems of units.',
            answer: {
              answerKey: 'The CGS (centimetre-gram-second) system and the FPS (foot-pound-second) system are two commonly used systems of units.',
              schoolMethod: `**Solution:**

The **CGS (centimetre-gram-second)** system and the **FPS (foot-pound-second)** system are two commonly used systems of units.

**Answer:** The CGS system and the FPS system.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Why is the SI system preferred over other systems?',
            answer: {
              answerKey: 'The SI system is internationally accepted, based on the decimal system, and provides one uniform unit for each physical quantity, avoiding confusion.',
              schoolMethod: `**Solution:**

- The **SI system is internationally accepted**.
- It is **based on the decimal system**.
- It provides **one uniform unit for each physical quantity**, avoiding confusion.

**Answer:** The SI system is internationally accepted, based on the decimal system, and provides one uniform unit for each physical quantity, avoiding confusion.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Convert 250 N into gcm/s2.',
            answer: {
              answerKey: '1 N = 10⁵ g·cm/s². Therefore, 250 N = 250 × 10⁵ = 2.5 × 10⁷ g·cm/s².',
              schoolMethod: `**Solution:**

$1 \\text{ N} = 10^{5} \\text{ g cm/s}^{2}$

$250 \\text{ N} = 250 \\times 10^{5} = 2.5 \\times 10^{7} \\text{ g cm/s}^{2}$

**Answer:** $250 \\text{ N} = 2.5 \\times 10^{7} \\text{ g cm/s}^{2}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Convert 1000 kg/L into kg/m3.',
            answer: {
              answerKey: '1 L = 10⁻³ m³. Therefore, 1000 kg/L = 1000 / 10⁻³ = 1 × 10⁶ kg/m³.',
              schoolMethod: `**Solution:**

$1 \\text{ L} = 10^{-3} \\text{ m}^{3}$

$1000 \\text{ kg/L} = 1000 / 10^{-3} = 1 \\times 10^{6} \\text{ kg/m}^{3}$

**Answer:** $1000 \\text{ kg/L} = 1 \\times 10^{6} \\text{ kg/m}^{3}$.`,
            }
          },
        ]
      },
      {
        id: 'ex1.2', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Which of the following is not an SI unit? (a) Meter (b) Kilogram (c) Second (d) Foot',
            answer: {
              answerKey: '(d) Foot is not an SI unit.',
              schoolMethod: `**Solution:**

- SI base units include the metre, kilogram and second.
- Foot belongs to the FPS system, not the SI system.

**Answer:** (d) Foot is not an SI unit.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'The SI unit of mass is: (a) Gram (b) Kilogram (c) Pound (d) Tonne',
            answer: {
              answerKey: '(b) Kilogram is the SI unit of mass.',
              schoolMethod: `**Solution:**

- The SI base unit of mass is the **kilogram**.
- Gram, pound and tonne are not SI base units of mass.

**Answer:** (b) Kilogram is the SI unit of mass.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Name the system of units used internationally.',
            answer: {
              answerKey: 'The International System of Units (SI) is used internationally.',
              schoolMethod: `**Solution:**

The **International System of Units (SI)** is used internationally.

**Answer:** The International System of Units (SI).`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Why is a common system of units necessary?',
            answer: {
              answerKey: 'A common system avoids confusion in trade, prevents errors in scientific calculations, and allows scientific data to be shared and compared globally.',
              schoolMethod: `**Solution:**

- Avoids **confusion in trade**.
- **Prevents errors** in scientific calculations.
- Allows scientific data to be **shared and compared globally**.

**Answer:** A common system avoids confusion in trade, prevents errors in scientific calculations, and allows scientific data to be shared and compared globally.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Why is measurement necessary in physics?',
            answer: {
              answerKey: 'Physics is built entirely on measurable quantities; without accurate measurement of length, mass, and time, physical laws cannot be tested or applied.',
              schoolMethod: `**Solution:**

- Physics is built entirely on **measurable quantities**.
- Without accurate measurement of **length, mass, and time**, physical laws cannot be tested or applied.

**Answer:** Physics is built entirely on measurable quantities; without accurate measurement of length, mass, and time, physical laws cannot be tested or applied.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Why was there a need for a common system of units?',
            answer: {
              answerKey: 'Different regions used different units, which caused confusion in trade, calculation errors, and difficulty comparing scientific data internationally.',
              schoolMethod: `**Solution:**

- Different regions used **different units**.
- This caused **confusion in trade**, **calculation errors**, and **difficulty comparing scientific data** internationally.

**Answer:** Different regions used different units, which caused confusion in trade, calculation errors, and difficulty comparing scientific data internationally.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'Explain the relation: Magnitude = Numerical value × Unit.',
            answer: {
              answerKey: 'A physical quantity Q equals n × u, where n is the numerical value and u is the unit chosen. Q stays constant, but n changes when u changes.',
              schoolMethod: `**Solution:**

- A physical quantity **Q** equals $n \\times u$, where **n** is the numerical value and **u** is the unit chosen.
- **Q stays constant**, but **n changes when u changes**.

**Answer:** $Q = n \\times u$; the physical quantity stays constant, but the numerical value changes when the unit changes.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Why does the same classroom floor give different numerical values when measured with sticks of different lengths?',
            answer: {
              answerKey: 'The numerical value of a measurement is inversely proportional to the size of the unit used, so a longer stick (unit) gives a smaller numerical value.',
              schoolMethod: `**Solution:**

- The numerical value of a measurement is **inversely proportional to the size of the unit used**.
- A **longer stick (unit)** gives a **smaller numerical value**.

**Answer:** The numerical value of a measurement is inversely proportional to the size of the unit used, so a longer stick (unit) gives a smaller numerical value.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: '(Based on Activity 1.1) Why are numerical values different?',
            answer: {
              answerKey: 'The numerical values differ because sticks of different lengths (different units) were used to measure the same fixed floor dimensions.',
              schoolMethod: `**Solution:**

- The numerical values differ because **sticks of different lengths (different units)** were used.
- The same fixed floor dimensions were measured each time.

**Answer:** The numerical values differ because sticks of different lengths (different units) were used to measure the same fixed floor dimensions.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'Is the actual size of the classroom different? Why or why not?',
            answer: {
              answerKey: 'No. The actual size of the classroom does not change; only the numerical value changes because a different sized unit was used each time.',
              schoolMethod: `**Solution:**

- **No.** The actual size of the classroom **does not change**.
- Only the **numerical value changes** because a different sized unit was used each time.

**Answer:** No. The actual size of the classroom does not change; only the numerical value changes because a different sized unit was used each time.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'What conclusion can you draw about units and measurement from this activity?',
            answer: {
              answerKey: 'The numerical value of a measured quantity depends entirely on the unit chosen, while the physical quantity itself remains fixed and unchanged.',
              schoolMethod: `**Solution:**

- The **numerical value** of a measured quantity depends entirely on the **unit chosen**.
- The **physical quantity itself** remains fixed and unchanged.

**Answer:** The numerical value of a measured quantity depends entirely on the unit chosen, while the physical quantity itself remains fixed and unchanged.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'Fill in the blanks: (a) Measurement compares an unknown quantity with a ______ quantity. (b) SI unit of mass is ______. (c) In CGS, unit of length is ______. (d) 1 km = ______ m. (e) The modern internationally accepted system is called ______.',
            parts: [
              '(a) Measurement compares an unknown quantity with a ______ quantity.',
              '(b) SI unit of mass is ______.',
              '(c) In CGS, unit of length is ______.',
              '(d) 1 km = ______ m.',
              '(e) The modern internationally accepted system is called ______.',
            ],
            answer: {
              answerKey: '(a) standard (b) kilogram (c) centimetre (d) 1000 (e) SI (International System of Units).',
              schoolMethod: `**Solution:**

(a) standard
(b) kilogram
(c) centimetre
(d) 1000
(e) SI (International System of Units)

**Answer:** (a) standard (b) kilogram (c) centimetre (d) 1000 (e) SI.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'Match the following: Column A - CGS, FPS, SI, MKS; Column B - Kelvin, Pound, International system, Meter-Kilogram-Second.',
            answer: {
              answerKey: 'FPS - Pound; SI - International system; MKS - Meter-Kilogram-Second; CGS - Kelvin (matched by elimination as the remaining pair).',
              schoolMethod: `**Solution:**

- **FPS** - **Pound**
- **SI** - **International system**
- **MKS** - **Meter-Kilogram-Second**
- **CGS** - **Kelvin** (matched by elimination as the remaining pair)

**Answer:** FPS-Pound; SI-International system; MKS-Meter-Kilogram-Second; CGS-Kelvin.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'What problems might occur if every country used its own system of units for measurement?',
            answer: {
              answerKey: 'It would cause confusion in trade, communication errors, difficulty comparing scientific data, and a higher risk of calculation mistakes internationally.',
              schoolMethod: `**Solution:**

- **Confusion in trade**.
- **Communication errors**.
- **Difficulty comparing scientific data**.
- **Higher risk of calculation mistakes** internationally.

**Answer:** It would cause confusion in trade, communication errors, difficulty comparing scientific data, and a higher risk of calculation mistakes internationally.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'A scientist measures length in feet and another in meters. What difficulties may this lead to?',
            answer: {
              answerKey: 'Comparing or combining their results becomes difficult without conversion, increasing the chance of errors and miscommunication in shared scientific work.',
              schoolMethod: `**Solution:**

- Comparing or combining their results becomes **difficult without conversion**.
- This increases the chance of **errors and miscommunication** in shared scientific work.

**Answer:** Comparing or combining their results becomes difficult without conversion, increasing the chance of errors and miscommunication in shared scientific work.`,
            }
          },
          {
            id: 'q16', number: '16', isHard: false,
            text: 'If 1 meter was defined differently in different countries, what would happen to international trade?',
            answer: {
              answerKey: 'Trade would suffer from inconsistent measurements, unfair transactions, disputes over quantity, and difficulty verifying goods across borders.',
              schoolMethod: `**Solution:**

- Trade would suffer from **inconsistent measurements**.
- **Unfair transactions** and **disputes over quantity**.
- **Difficulty verifying goods across borders**.

**Answer:** Trade would suffer from inconsistent measurements, unfair transactions, disputes over quantity, and difficulty verifying goods across borders.`,
            }
          },
          {
            id: 'q17', number: '17', isHard: true,
            text: 'A shopkeeper sells rice in kilograms. A foreign customer asks for rice in pounds. (a) Why is unit conversion necessary here? (b) If 1 kg = 2.2 pounds, how many pounds are in 5 kg?',
            parts: [
              '(a) Why is unit conversion necessary here?',
              '(b) If 1 kg = 2.2 pounds, how many pounds are in 5 kg?',
            ],
            answer: {
              answerKey: '(a) Conversion is necessary because the two people use different unit systems, and conversion ensures both understand the same actual quantity. (b) 5 × 2.2 = 11 pounds.',
              schoolMethod: `**Solution:**

(a) Conversion is necessary because the two people use **different unit systems**, and conversion ensures both understand the **same actual quantity**.

(b) $5 \\times 2.2 = 11$ pounds.

**Answer:** (a) Conversion is necessary because the two people use different unit systems. (b) 11 pounds.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch02', number: 2,
    title: 'Understanding Motion through Experience',
    slug: 'understanding-motion-through-experience',
    code: 'as02',
    description: 'Rest and motion, frame of reference, scalar and vector quantities, distance vs displacement, vector addition and subtraction, and distance covered in the nth second.',
    exercises: [
      {
        id: 'ex2.1', title: 'Reflect (Chapter Opening Questions)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why do we feel pushed backward when a bus suddenly starts moving?',
            answer: {
              answerKey: 'Due to inertia, our body tends to stay at rest while the bus moves forward, so relative to the bus we feel pushed backward.',
              schoolMethod: `**Solution:**

- Due to **inertia**, our body tends to **stay at rest** while the bus moves forward.
- Relative to the bus, we feel **pushed backward**.

**Answer:** Due to inertia, our body tends to stay at rest while the bus moves forward, so relative to the bus we feel pushed backward.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Can an object be at rest for one observer but moving for another?',
            answer: {
              answerKey: 'Yes. Motion is relative; an object at rest in one frame of reference can appear to be moving when viewed from a different frame.',
              schoolMethod: `**Solution:**

- **Yes.** Motion is **relative**.
- An object at rest in one frame of reference can appear to be **moving** when viewed from a different frame.

**Answer:** Yes. Motion is relative; an object at rest in one frame of reference can appear to be moving when viewed from a different frame.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'How do athletes decide the best angle to throw a ball so that it travels the maximum distance?',
            answer: {
              answerKey: 'They apply projectile motion principles; on level ground with no air resistance, a launch angle of 45 degrees gives the maximum horizontal range.',
              schoolMethod: `**Solution:**

- They apply **projectile motion principles**.
- On level ground with **no air resistance**, a launch angle of **45 degrees** gives the maximum horizontal range.

**Answer:** A launch angle of 45 degrees gives the maximum horizontal range.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Can we measure motion using simple tools available in the classroom?',
            answer: {
              answerKey: 'Yes. Using a measuring tape and a stopwatch, distance and time can be recorded to calculate the speed of a moving object.',
              schoolMethod: `**Solution:**

- **Yes.** Using a **measuring tape** and a **stopwatch**.
- Record **distance** and **time** to calculate the **speed** of a moving object.

**Answer:** Yes, using a measuring tape and a stopwatch, distance and time can be recorded to calculate the speed of a moving object.`,
            }
          },
        ]
      },
      {
        id: 'ex2.2', title: 'Practice Question (Sita\u2019s Journey)',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'Points A(1,1), B(3,1), C(3,5), D(4,5) in km represent Sita\u2019s house, bus stop, traffic signal and school. She walks A to B, then travels B to D via C by bus. Calculate: (a) distance on foot (b) distance by bus (c) total displacement from house to school.',
            parts: [
              '(a) distance on foot',
              '(b) distance by bus',
              '(c) total displacement from house to school',
            ],
            answer: {
              answerKey: '(a) Distance on foot (A to B) = 2 km. (b) Distance by bus (B to C to D) = BC + CD = 4 km + 1 km = 5 km. (c) Displacement (A to D, straight line) = √(3² + 4²) = 5 km.',
              schoolMethod: `**Solution:**

(a) **Distance on foot (A to B)** = $2 \\text{ km}$.

(b) **Distance by bus (B to C to D)** = BC + CD = $4 + 1 = 5 \\text{ km}$.

(c) **Displacement (A to D, straight line)** = $\\sqrt{3^{2} + 4^{2}} = \\sqrt{25} = 5 \\text{ km}$.

**Answer:** (a) 2 km. (b) 5 km. (c) 5 km.`,
            }
          },
        ]
      },
      {
        id: 'ex2.3', title: 'Reflect and Discuss',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why is specifying a reference frame necessary to describe motion?',
            answer: {
              answerKey: 'Motion is relative; without a fixed reference point, we cannot determine whether an object\u2019s position is actually changing or not.',
              schoolMethod: `**Solution:**

- Motion is **relative**.
- Without a **fixed reference point**, we cannot determine whether an object's position is actually changing or not.

**Answer:** Motion is relative; without a fixed reference point, we cannot determine whether an object's position is actually changing or not.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'How do direction and magnitude together describe displacement?',
            answer: {
              answerKey: 'Displacement is a vector quantity; its magnitude gives the shortest distance between initial and final points, while direction shows the path\u2019s orientation.',
              schoolMethod: `**Solution:**

- Displacement is a **vector quantity**.
- Its **magnitude** gives the shortest distance between initial and final points.
- Its **direction** shows the path's orientation.

**Answer:** Displacement is a vector quantity; its magnitude gives the shortest distance between initial and final points, while direction shows the path's orientation.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Which daily activities around you involve accelerated motion?',
            answer: {
              answerKey: 'Examples include a bus starting or stopping, a ball falling under gravity, a cyclist speeding up, and a car taking a turn at changing speed.',
              schoolMethod: `**Solution:**

- A **bus starting or stopping**.
- A **ball falling under gravity**.
- A **cyclist speeding up**.
- A **car taking a turn** at changing speed.

**Answer:** A bus starting or stopping, a ball falling under gravity, a cyclist speeding up, and a car taking a turn at changing speed.`,
            }
          },
        ]
      },
      {
        id: 'ex2.4', title: 'Project-Based Learning',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Design a simple experiment using everyday materials to measure the speed of a moving object (bicycle or walking student).',
            answer: {
              answerKey: 'Mark two points a known distance apart using chalk; measure the time taken by the moving object to cover this distance with a stopwatch; calculate speed as distance divided by time, and repeat for accuracy.',
              schoolMethod: `**Solution:**

- **Mark two points** a known distance apart using chalk.
- **Measure the time** taken by the moving object to cover this distance with a stopwatch.
- Calculate **speed = distance ÷ time**, and **repeat** for accuracy.

**Answer:** Mark two points a known distance apart; measure the time with a stopwatch; calculate speed as distance divided by time, and repeat for accuracy.`,
            }
          },
        ]
      },
      {
        id: 'ex2.5', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Define a frame of reference in your own words.',
            answer: {
              answerKey: 'A frame of reference is a fixed point or system relative to which the position and motion of an object are described and measured.',
              schoolMethod: `**Solution:**

A **frame of reference** is a fixed point or system relative to which the position and motion of an object are described and measured.

**Answer:** A frame of reference is a fixed point or system relative to which the position and motion of an object are described and measured.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Give two real-life examples where motion depends on the observer.',
            answer: {
              answerKey: 'A co-passenger appears at rest to another passenger moving with the same speed in a train; trees appear to move backward to someone inside a moving car.',
              schoolMethod: `**Solution:**

- A **co-passenger appears at rest** to another passenger moving with the same speed in a train.
- **Trees appear to move backward** to someone inside a moving car.

**Answer:** A co-passenger appears at rest to a passenger moving with the same speed in a train; trees appear to move backward to someone inside a moving car.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Why does a person sitting in a moving train appear at rest to another passenger?',
            answer: {
              answerKey: 'Since both passengers move with the same velocity, their relative position does not change, so each appears stationary with respect to the other.',
              schoolMethod: `**Solution:**

- Both passengers move with the **same velocity**.
- Their **relative position does not change**.
- So each appears **stationary** with respect to the other.

**Answer:** Since both passengers move with the same velocity, their relative position does not change, so each appears stationary with respect to the other.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Classify the following as scalar or vector: speed, velocity, displacement, distance, acceleration, mass.',
            answer: {
              answerKey: 'Scalars: speed, distance, mass. Vectors: velocity, displacement, acceleration.',
              schoolMethod: `**Solution:**

- **Scalars:** speed, distance, mass.
- **Vectors:** velocity, displacement, acceleration.

**Answer:** Scalars - speed, distance, mass; Vectors - velocity, displacement, acceleration.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Explain the difference between distance and displacement with an activity diagram.',
            answer: {
              answerKey: 'Distance is the total path length travelled (scalar); displacement is the shortest straight-line distance between start and end points (vector). Walking from A to B and back to A gives distance 2AB but zero displacement.',
              schoolMethod: `**Solution:**

- **Distance** is the **total path length travelled** (scalar).
- **Displacement** is the **shortest straight-line distance** between start and end points (vector).
- Walking from A to B and back to A gives distance **2AB** but **zero displacement**.

**Answer:** Distance is the total path length travelled (scalar); displacement is the shortest straight-line distance between start and end points (vector).`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Give two everyday examples of vector quantities.',
            answer: {
              answerKey: 'The displacement of a car travelling from home to school, and the velocity of wind blowing in a specific direction.',
              schoolMethod: `**Solution:**

- The **displacement** of a car travelling from home to school.
- The **velocity** of wind blowing in a specific direction.

**Answer:** The displacement of a car travelling from home to school, and the velocity of wind blowing in a specific direction.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: true,
            text: 'Draw two vectors of 4 units east and 3 units north and find the resultant using the triangle method.',
            answer: {
              answerKey: 'Placing the vectors head to tail, the resultant (joining the start point to the final point) has magnitude √(4² + 3²) = 5 units, directed north-east of the start.',
              schoolMethod: `**Solution:**

- Place the two vectors **head to tail**.
- The resultant joins the **start point** to the **final point**.
- Magnitude $= \\sqrt{4^{2} + 3^{2}} = \\sqrt{25} = 5$ units, directed **north-east** of the start.

**Answer:** Resultant magnitude = 5 units, directed north-east of the start.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Explain how vector subtraction is performed graphically.',
            answer: {
              answerKey: 'To subtract vector B from vector A, reverse the direction of B to get -B, then add A and -B head to tail using the triangle method; the resulting line gives A minus B.',
              schoolMethod: `**Solution:**

- To subtract vector **B** from vector **A**, **reverse the direction** of B to get **-B**.
- Then **add A and -B head to tail** using the triangle method.
- The resulting line gives **A minus B**.

**Answer:** Reverse the direction of B to get -B, then add A and -B head to tail; the resulting line gives A minus B.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'Draw two opposite vectors of equal magnitude. Calculate its resultant.',
            answer: {
              answerKey: 'Two vectors of equal magnitude acting in exactly opposite directions cancel each other completely, giving a resultant of zero magnitude.',
              schoolMethod: `**Solution:**

- Two vectors of **equal magnitude** acting in **exactly opposite directions**.
- They **cancel each other completely**.
- Resultant = **zero magnitude**.

**Answer:** Two vectors of equal magnitude acting in exactly opposite directions cancel each other completely, giving a resultant of zero magnitude.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: true,
            text: 'A body starts from rest and accelerates at 4 m/s2. Find the distance travelled in the 6th second.',
            answer: {
              answerKey: 'Using s(n) = u + (a/2)(2n - 1): s(6) = 0 + (4/2)(2×6 - 1) = 2 × 11 = 22 m.',
              schoolMethod: `**Solution:**

$s(n) = u + \\frac{a}{2}(2n - 1)$

$s(6) = 0 + \\frac{4}{2}(2 \\times 6 - 1) = 2 \\times 11 = 22 \\text{ m}$

**Answer:** Distance travelled in the 6th second = 22 m.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: true,
            text: 'A car with initial velocity 8 m/s accelerates at 2 m/s2. Find the distance covered in the 5th second.',
            answer: {
              answerKey: 'Using s(n) = u + (a/2)(2n - 1): s(5) = 8 + (2/2)(2×5 - 1) = 8 + 9 = 17 m.',
              schoolMethod: `**Solution:**

$s(n) = u + \\frac{a}{2}(2n - 1)$

$s(5) = 8 + \\frac{2}{2}(2 \\times 5 - 1) = 8 + 9 = 17 \\text{ m}$

**Answer:** Distance covered in the 5th second = 17 m.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch03', number: 3,
    title: 'Newton\u2019s Laws of Motion',
    slug: 'newtons-laws-of-motion',
    code: 'as03',
    description: 'Newton\u2019s laws in inertial frames, pseudo force, gravitation and variation of g with height and depth, and turning forces (torque) around a pivot.',
    exercises: [
      {
        id: 'ex3.1', title: 'Activity 3.1 (Reflective Questions)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why does a passenger feel pushed backward when a bus suddenly accelerates? Is there really a backward force?',
            answer: {
              answerKey: 'No real backward force acts on the passenger. Due to inertia, the passenger\u2019s body tends to remain at rest while the bus accelerates forward, causing an apparent backward motion relative to the bus.',
              schoolMethod: `**Solution:**

- **No real backward force** acts on the passenger.
- Due to **inertia**, the passenger's body tends to **remain at rest** while the bus accelerates forward.
- This causes an **apparent backward motion** relative to the bus.

**Answer:** No real backward force acts on the passenger; inertia causes an apparent backward motion relative to the accelerating bus.`,
            }
          },
        ]
      },
      {
        id: 'ex3.2', title: 'Quick Check',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'In which type of reference frame are Newton\u2019s laws valid?',
            answer: {
              answerKey: 'Newton\u2019s laws are strictly valid only in an inertial (non-accelerating) frame of reference.',
              schoolMethod: `**Solution:**

Newton's laws are **strictly valid only in an inertial (non-accelerating) frame** of reference.

**Answer:** Newton's laws are strictly valid only in an inertial (non-accelerating) frame of reference.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Define pseudo force and write its formula.',
            answer: {
              answerKey: 'A pseudo force is an apparent, imaginary force felt only in an accelerating (non-inertial) frame. Formula: F(pseudo) = -m × a(frame), acting opposite to the frame\u2019s acceleration.',
              schoolMethod: `**Solution:**

- A **pseudo force** is an apparent, **imaginary force** felt only in an accelerating (non-inertial) frame.
- Formula: $F_{pseudo} = -m \\times a_{frame}$, acting **opposite** to the frame's acceleration.

**Answer:** $F_{pseudo} = -m \\times a_{frame}$, acting opposite to the frame's acceleration.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'A lift accelerates upward at 4.5 m/s2. Calculate the pseudo force experienced by a 60 kg person inside the lift.',
            answer: {
              answerKey: 'F = m × a = 60 × 4.5 = 270 N, directed downward, opposite to the lift\u2019s upward acceleration.',
              schoolMethod: `**Solution:**

$F = m \\times a = 60 \\times 4.5 = 270 \\text{ N}$

Directed **downward**, opposite to the lift's upward acceleration.

**Answer:** Pseudo force = 270 N, directed downward.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Why does pseudo force disappear in an inertial frame?',
            answer: {
              answerKey: 'Pseudo force is only introduced to make Newton\u2019s laws appear valid within an accelerating frame; in an inertial frame, real forces alone fully explain the motion.',
              schoolMethod: `**Solution:**

- Pseudo force is only introduced to make **Newton's laws appear valid** within an accelerating frame.
- In an **inertial frame**, real forces alone fully explain the motion.

**Answer:** In an inertial frame, real forces alone fully explain the motion, so pseudo force is not needed.`,
            }
          },
        ]
      },
      {
        id: 'ex3.3', title: 'Gravitation (Let Us Think)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What would happen if Earth\u2019s tangential speed decreases suddenly while the Sun\u2019s gravitational pull stays the same?',
            answer: {
              answerKey: 'The required centripetal force would exceed the actual pull needed for a stable orbit, so gravity would pull Earth inward, causing it to drift closer to the Sun instead of maintaining its orbit.',
              schoolMethod: `**Solution:**

- The required **centripetal force** would exceed the actual pull needed for a **stable orbit**.
- Gravity would pull Earth **inward**.
- Earth would **drift closer to the Sun** instead of maintaining its orbit.

**Answer:** Gravity would pull Earth inward, causing it to drift closer to the Sun instead of maintaining its orbit.`,
            }
          },
        ]
      },
      {
        id: 'ex3.4', title: 'Quick Check (Gravitation)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Where does the acceleration due to gravity reach its maximum value - on the surface, above, or below the Earth?',
            answer: {
              answerKey: 'Acceleration due to gravity is maximum at the Earth\u2019s surface; it decreases both above and below the surface.',
              schoolMethod: `**Solution:**

Acceleration due to gravity is **maximum at the Earth's surface**; it decreases **both above and below** the surface.

**Answer:** Maximum at the Earth's surface.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'What happens to g at the centre of the Earth?',
            answer: {
              answerKey: 'The value of g becomes zero at the centre of the Earth.',
              schoolMethod: `**Solution:**

The value of **g becomes zero at the centre of the Earth**.

**Answer:** g = 0 at the centre of the Earth.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Calculate g at a height of 400 km if R = 6400 km.',
            answer: {
              answerKey: 'Using g(h) = g × R²/(R+h)² = 9.8 × (6400/6800)² = approximately 8.68 m/s².',
              schoolMethod: `**Solution:**

$g(h) = g \\times \\frac{R^{2}}{(R + h)^{2}} = 9.8 \\times \\left(\\frac{6400}{6800}\\right)^{2} \\approx 8.68 \\text{ m/s}^{2}$

**Answer:** $g \\approx 8.68 \\text{ m/s}^{2}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'At what depth will g become half of its surface value?',
            answer: {
              answerKey: 'Using g(d) = g(1 - d/R), setting g(d) = g/2 gives d = R/2 = 3200 km (taking R = 6400 km).',
              schoolMethod: `**Solution:**

$g(d) = g\\left(1 - \\frac{d}{R}\\right)$

Setting $g(d) = g/2$ gives $1 - \\frac{d}{R} = \\frac{1}{2}$, so $d = \\frac{R}{2} = 3200 \\text{ km}$.

**Answer:** g becomes half its surface value at a depth of 3200 km.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Why does gravity decrease both above and below the surface of the Earth?',
            answer: {
              answerKey: 'Above the surface, distance from Earth\u2019s centre increases, weakening the pull; below the surface, only the mass enclosed within that radius contributes, reducing effective gravity.',
              schoolMethod: `**Solution:**

- **Above the surface**, distance from Earth's centre **increases**, weakening the pull.
- **Below the surface**, only the **mass enclosed within that radius** contributes, reducing effective gravity.

**Answer:** Above, distance from Earth's centre increases; below, only the enclosed mass contributes, reducing effective gravity.`,
            }
          },
        ]
      },
      {
        id: 'ex3.5', title: 'Check Your Understanding (Turning Forces)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why is it easier to open a door when you push at the handle rather than near the hinges?',
            answer: {
              answerKey: 'Torque depends on distance from the pivot; pushing farther from the hinge (at the handle) produces greater turning effect for the same applied force.',
              schoolMethod: `**Solution:**

- **Torque depends on distance from the pivot**.
- Pushing farther from the hinge (at the handle) produces **greater turning effect** for the same applied force.

**Answer:** Pushing at the handle gives a larger distance from the hinge, producing greater torque for the same force.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'A force is applied to a wrench at different angles. At which angle will the rotating force be maximum? What happens when force is applied parallel to the wrench?',
            answer: {
              answerKey: 'Torque is maximum when the force is applied at 90 degrees (perpendicular to the wrench). When force is applied parallel to the wrench, the turning effect (torque) becomes zero.',
              schoolMethod: `**Solution:**

- Torque is **maximum when the force is applied at 90 degrees** (perpendicular to the wrench).
- When force is applied **parallel to the wrench**, the turning effect (torque) becomes **zero**.

**Answer:** Maximum at 90°; torque becomes zero when the force is parallel to the wrench.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Two students apply the same force to open a gate, one perpendicular at 20 cm from the hinge, the other at 80 cm. Who produces greater torque? Justify.',
            answer: {
              answerKey: 'The student pushing at 80 cm produces greater torque, since torque equals force multiplied by distance from the pivot, and a larger distance gives a larger torque for the same force.',
              schoolMethod: `**Solution:**

- Torque = force × distance from the pivot.
- For the same force, a **larger distance** gives a **larger torque**.

**Answer:** The student pushing at 80 cm produces greater torque.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Is it possible for a force to act on a body and still produce zero turning about a fixed point? Give a real-life example.',
            answer: {
              answerKey: 'Yes, when the line of action of the force passes through the pivot point (angle 0 or 180 degrees). Example: pushing a door directly toward its hinge line produces no rotation.',
              schoolMethod: `**Solution:**

- **Yes**, when the line of action of the force passes **through the pivot point** (angle 0° or 180°).
- Example: **pushing a door directly toward its hinge line** produces no rotation.

**Answer:** Yes, when the line of action passes through the pivot; e.g. pushing a door directly toward its hinge line.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Two forces act on a rod pivoted at its centre: 10 N downward at 0.5 m on the left, and 10 N downward at 0.5 m on the right. Will the rod rotate? Explain.',
            answer: {
              answerKey: 'No, the rod will not rotate. Both torques are equal in magnitude but act in opposite rotational directions, so they cancel each other and the rod remains balanced.',
              schoolMethod: `**Solution:**

- Left torque $= 10 \\times 0.5 = 5 \\text{ N m}$ (clockwise).
- Right torque $= 10 \\times 0.5 = 5 \\text{ N m}$ (anticlockwise).
- Torques are **equal in magnitude** but **opposite in direction**, so they **cancel**.

**Answer:** No, the rod will not rotate; the torques cancel and the rod remains balanced.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'How can a mechanic loosen a tight bolt using a long spanner instead of applying a very large force? Explain using the torque formula.',
            answer: {
              answerKey: 'Since torque equals force multiplied by distance, increasing the spanner\u2019s length increases the distance from the pivot, producing a larger torque with a smaller applied force.',
              schoolMethod: `**Solution:**

- Torque = force × distance from the pivot.
- Increasing the **spanner's length** increases the **distance from the pivot**.
- A **larger torque** is produced with a **smaller applied force**.

**Answer:** A long spanner increases the distance from the pivot, producing a larger torque with a smaller force.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: true,
            text: 'A force of 20 N is applied to a door at 0.8 m from the hinge. Calculate the torque when the force is applied at (a) 90 degrees (b) 60 degrees (c) 30 degrees.',
            parts: [
              '(a) 90 degrees',
              '(b) 60 degrees',
              '(c) 30 degrees',
            ],
            answer: {
              answerKey: 'Torque = F × d × sin(θ). (a) 90°: 20 × 0.8 × 1 = 16 Nm. (b) 60°: 20 × 0.8 × 0.866 = 13.86 Nm. (c) 30°: 20 × 0.8 × 0.5 = 8 Nm.',
              schoolMethod: `**Solution:**

Torque $= F \\times d \\times \\sin\\theta$

(a) 90°: $20 \\times 0.8 \\times 1 = 16 \\text{ N m}$

(b) 60°: $20 \\times 0.8 \\times 0.866 = 13.86 \\text{ N m}$

(c) 30°: $20 \\times 0.8 \\times 0.5 = 8 \\text{ N m}$

**Answer:** (a) 16 Nm, (b) 13.86 Nm, (c) 8 Nm.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch04', number: 4,
    title: 'The Geometry of Power - Advanced Simple Machines',
    slug: 'the-geometry-of-power-advanced-simple-machines',
    code: 'as04',
    description: 'Mechanical advantage of machines, wheel and axle, gear trains, and tension in pulley systems (Atwood machine calculations).',
    exercises: [
      {
        id: 'ex4.1', title: 'Activity 4.1 (Reflective Questions)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Is the truck driver extremely strong? Does the crane create extra force? Does the cyclist get \u2018free\u2019 speed?',
            answer: {
              answerKey: 'No. In each case, a machine provides mechanical advantage, allowing a smaller input force or effort to produce a larger output force or motion, without creating any extra energy.',
              schoolMethod: `**Solution:**

- **No.** In each case, a machine provides **mechanical advantage**.
- A smaller **input force/effort** produces a larger **output force or motion**.
- No **extra energy** is created.

**Answer:** No; machines provide mechanical advantage without creating extra energy.`,
            }
          },
        ]
      },
      {
        id: 'ex4.2', title: 'Wheel and Axle (Think and Answer)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why is the steering wheel large and the steering column (axle) small? Why not make both of equal size?',
            answer: {
              answerKey: 'A larger wheel radius compared to the axle radius gives a greater mechanical advantage, so a small effort applied on the wheel produces a much larger turning force at the axle.',
              schoolMethod: `**Solution:**

- A **larger wheel radius** compared to the **axle radius** gives a greater **mechanical advantage**.
- A small effort applied on the wheel produces a **much larger turning force** at the axle.

**Answer:** A larger wheel compared to the axle gives greater mechanical advantage and a larger turning force at the axle.`,
            }
          },
        ]
      },
      {
        id: 'ex4.3', title: 'Quick Check (Gear Train)',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'If the seconds gear is 2 mm, and the seconds-to-minutes and minutes-to-hours gear ratios are both 60:1, how large would the hour gear be in metres?',
            answer: {
              answerKey: 'Minute gear = 2 mm × 60 = 120 mm. Hour gear = 120 mm × 60 = 7200 mm = 7.2 metres.',
              schoolMethod: `**Solution:**

- Minute gear $= 2 \\times 60 = 120 \\text{ mm}$.
- Hour gear $= 120 \\times 60 = 7200 \\text{ mm} = 7.2 \\text{ metres}$.

**Answer:** The hour gear would be 7.2 metres.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Which of the three hands\u2019 gear should be directly connected to the motor? Why?',
            answer: {
              answerKey: 'The seconds-hand gear should be connected directly to the motor, since it must rotate the fastest and drives the slower minute and hour gears through the gear train.',
              schoolMethod: `**Solution:**

- The **seconds-hand gear** must rotate the **fastest**.
- It **drives** the slower minute and hour gears through the gear train.

**Answer:** The seconds-hand gear should be connected directly to the motor.`,
            }
          },
        ]
      },
      {
        id: 'ex4.4', title: 'Tension (Activity, Let Us Calculate)',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'For the 0.55 kg mass moving downward: state the downward force (weight).',
            answer: {
              answerKey: 'Downward force = Weight = 0.55 × g = 0.55 × 9.8 = 5.39 N.',
              schoolMethod: `**Solution:**

Weight $= mg = 0.55 \\times 9.8 = 5.39 \\text{ N}$

**Answer:** Downward force = 5.39 N.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'For the 0.5 kg mass moving upward: state the downward force (weight).',
            answer: {
              answerKey: 'Downward force = Weight = 0.5 × g = 0.5 × 9.8 = 4.9 N.',
              schoolMethod: `**Solution:**

Weight $= mg = 0.5 \\times 9.8 = 4.9 \\text{ N}$

**Answer:** Downward force = 4.9 N.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Add both net-force equations (0.55g - T = 0.55a and T - 0.5g = 0.5a) to find the system\u2019s acceleration.',
            answer: {
              answerKey: 'Adding the equations: 0.55g - 0.5g = 0.55a + 0.5a, giving 0.05g = 1.05a, so acceleration a = (0.05 × 9.8)/1.05 = approximately 0.47 m/s².',
              schoolMethod: `**Solution:**

$0.55g - T = 0.55a$
$T - 0.5g = 0.5a$

Adding: $0.55g - 0.5g = 0.55a + 0.5a$

$0.05g = 1.05a$

$a = \\frac{0.05 \\times 9.8}{1.05} \\approx 0.47 \\text{ m/s}^{2}$

**Answer:** $a \\approx 0.47 \\text{ m/s}^{2}$.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'Find the tension in the string for this system.',
            answer: {
              answerKey: 'Using T - 0.5g = 0.5a: T = 0.5(g + a) = 0.5 × (9.8 + 0.47) = approximately 5.13 N.',
              schoolMethod: `**Solution:**

$T - 0.5g = 0.5a$

$T = 0.5(g + a) = 0.5 \\times (9.8 + 0.47) \\approx 5.13 \\text{ N}$

**Answer:** Tension $\\approx 5.13 \\text{ N}$.`,
            }
          },
        ]
      },
      {
        id: 'ex4.5', title: 'Check Your Understanding (Tension)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Show the direction of weight and tension for both objects m1 and m2 in a pulley diagram.',
            answer: {
              answerKey: 'Tension in the rope acts upward on both m1 and m2, toward the pulley, while the weight (mg) of each mass acts vertically downward due to gravity.',
              schoolMethod: `**Solution:**

- **Tension** in the rope acts **upward** on both $m_1$ and $m_2$, toward the pulley.
- The **weight ($mg$)** of each mass acts **vertically downward** due to gravity.

**Answer:** Tension acts upward toward the pulley; weight acts vertically downward on each mass.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'An 8 kg mass hangs freely from a single fixed pulley. The system is at rest. Find the tension in the rope.',
            answer: {
              answerKey: 'Since the system is at rest, tension T = mg = 8 × 9.8 = 78.4 N.',
              schoolMethod: `**Solution:**

Since the system is at rest, $T = mg = 8 \\times 9.8 = 78.4 \\text{ N}$.

**Answer:** Tension = 78.4 N.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Observe a diagram with a 10 kg and a 20 kg mass connected over a pulley. In which direction will the rope move, and what is the net downward force?',
            answer: {
              answerKey: 'The heavier 20 kg mass moves downward while the 10 kg mass moves upward. Net force = (20 - 10) × g = 10 × 9.8 = 98 N.',
              schoolMethod: `**Solution:**

- The heavier **20 kg** mass moves **downward**; the **10 kg** mass moves **upward**.
- Net force $= (20 - 10) \\times 9.8 = 10 \\times 9.8 = 98 \\text{ N}$.

**Answer:** Rope moves toward the 20 kg side; net downward force = 98 N.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'A 6 kg mass hangs freely from a single fixed pulley. The system is at rest. Find the tension in the rope.',
            answer: {
              answerKey: 'Since the system is at rest, tension T = mg = 6 × 9.8 = 58.8 N.',
              schoolMethod: `**Solution:**

Since the system is at rest, $T = mg = 6 \\times 9.8 = 58.8 \\text{ N}$.

**Answer:** Tension = 58.8 N.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'Two objects having masses 2 kg and 6 kg are connected over a frictionless pulley with the help of a rope. Find the acceleration and tension in the rope.',
            answer: {
              answerKey: 'Acceleration a = (m2 - m1)g/(m1 + m2) = (6-2) × 9.8 / 8 = 4.9 m/s². Tension T = m1(g + a) = 2 × (9.8 + 4.9) = 29.4 N.',
              schoolMethod: `**Solution:**

$a = \\frac{(m_2 - m_1)g}{m_1 + m_2} = \\frac{(6 - 2) \\times 9.8}{8} = 4.9 \\text{ m/s}^{2}$

$T = m_1(g + a) = 2 \\times (9.8 + 4.9) = 29.4 \\text{ N}$

**Answer:** Acceleration = 4.9 m/s²; tension = 29.4 N.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch05', number: 5,
    title: 'Work and Energy',
    slug: 'work-and-energy',
    code: 'as05',
    description: 'Conservative and non-conservative forces, conversion between potential and kinetic energy, PE = mgh, and energy stored in a stretched wire.',
    exercises: [
      {
        id: 'ex5.1', title: 'Reflect (Chapter Opening Questions)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why does a thrown ball come back down? Why does a stretched rubber band regain its shape? Why does a sliding book eventually stop?',
            answer: {
              answerKey: 'Gravity, a conservative force, pulls the ball back down, and spring force restores the rubber band\u2019s shape. Friction, a non-conservative force, converts the book\u2019s kinetic energy into heat, stopping it.',
              schoolMethod: `**Solution:**

- **Gravity**, a conservative force, pulls the ball back down.
- **Spring force** restores the rubber band's shape.
- **Friction**, a non-conservative force, converts the book's kinetic energy into heat, stopping it.

**Answer:** Gravity pulls the ball down, spring force restores the rubber band, and friction stops the sliding book.`,
            }
          },
        ]
      },
      {
        id: 'ex5.2', title: 'Quick Check',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Define a conservative force with one example.',
            answer: {
              answerKey: 'A conservative force is one whose work done is independent of the path taken and is zero over a closed path. Example: gravitational force.',
              schoolMethod: `**Solution:**

- A **conservative force** is one whose **work done is independent of the path taken**.
- Work is **zero over a closed path**.
- **Example:** gravitational force.

**Answer:** A conservative force does work independent of the path (zero over a closed path); e.g. gravity.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Why is gravitational force called a conservative force?',
            answer: {
              answerKey: 'Because the work done by gravity depends only on the initial and final positions, not the path taken, and equals zero over any closed path.',
              schoolMethod: `**Solution:**

- Work done by gravity depends only on the **initial and final positions**, not the path taken.
- It **equals zero over any closed path**.

**Answer:** Work by gravity depends only on positions and is zero over a closed path.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Why is friction called a non-conservative force?',
            answer: {
              answerKey: 'Because the work done against friction depends on the actual path length travelled and converts kinetic energy into heat, which cannot be fully recovered.',
              schoolMethod: `**Solution:**

- Work done against friction depends on the **actual path length travelled**.
- It converts **kinetic energy into heat**, which **cannot be fully recovered**.

**Answer:** Friction is non-conservative because its work depends on the path and converts kinetic energy into unrecoverable heat.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'What happens to energy when a non-conservative force acts on an object?',
            answer: {
              answerKey: 'Mechanical energy is not conserved; some energy is dissipated as heat, sound, or deformation, reducing the object\u2019s total kinetic energy over time.',
              schoolMethod: `**Solution:**

- **Mechanical energy is not conserved**.
- Some energy is **dissipated as heat, sound, or deformation**.
- This reduces the object's **total kinetic energy over time**.

**Answer:** Mechanical energy is not conserved; some energy is dissipated as heat, sound, or deformation.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'If there were no friction on Earth, how would motion be different? Explain.',
            answer: {
              answerKey: 'Objects once set in motion would continue moving forever at constant velocity; ordinary actions like walking, stopping, or driving would become impossible without friction.',
              schoolMethod: `**Solution:**

- Objects once set in motion would **continue moving forever at constant velocity**.
- Ordinary actions like **walking, stopping, or driving** would become impossible without friction.

**Answer:** Objects would keep moving at constant velocity forever, and walking, stopping or driving would become impossible.`,
            }
          },
        ]
      },
      {
        id: 'ex5.3', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Explain the conversion of potential energy to kinetic energy when a ball is thrown upward.',
            answer: {
              answerKey: 'As the ball rises, kinetic energy converts into potential energy; at the highest point all kinetic energy has become potential energy, and the process reverses as the ball falls.',
              schoolMethod: `**Solution:**

- As the ball rises, **kinetic energy converts into potential energy**.
- At the **highest point**, all kinetic energy has become potential energy.
- The process **reverses as the ball falls**.

**Answer:** KE converts into PE as the ball rises; the process reverses as it falls.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Why is gravitational potential energy considered to arise from a conservative force?',
            answer: {
              answerKey: 'Because gravitational force is conservative, the work it does depends only on the change in height, allowing potential energy to be uniquely defined at each position.',
              schoolMethod: `**Solution:**

- Gravitational force is **conservative**.
- Its work depends only on the **change in height**.
- This allows potential energy to be **uniquely defined at each position**.

**Answer:** Gravity is conservative, so PE is uniquely defined at each position.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'Calculate the potential energy of a 5 kg object kept on top of a 30 m high building (PE = 0 at the base).',
            answer: {
              answerKey: 'PE = mgh = 5 × 9.8 × 30 = 1470 J.',
              schoolMethod: `**Solution:**

$PE = mgh = 5 \\times 9.8 \\times 30 = 1470 \\text{ J}$

**Answer:** Potential energy = 1470 J.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: true,
            text: 'What is the increment in its potential energy?',
            answer: {
              answerKey: 'The increase in potential energy from the base to the top equals mgh = 1470 J, the same value as calculated above.',
              schoolMethod: `**Solution:**

- Increase in PE from the base to the top $= mgh = 5 \\times 9.8 \\times 30 = 1470 \\text{ J}$.

**Answer:** The increment in potential energy = 1470 J.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: true,
            text: 'A 10 kg weight is hung from a 5 m wire, causing it to stretch by 1 mm. Calculate the energy stored.',
            answer: {
              answerKey: 'Force F = mg = 10 × 9.8 = 98 N; extension x = 0.001 m. Energy stored = (1/2) × F × x = 0.5 × 98 × 0.001 = 0.049 J.',
              schoolMethod: `**Solution:**

$F = mg = 10 \\times 9.8 = 98 \\text{ N}$, extension $x = 0.001 \\text{ m}$.

Energy stored $= \\frac{1}{2} F x = 0.5 \\times 98 \\times 0.001 = 0.049 \\text{ J}$

**Answer:** Energy stored = 0.049 J.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'Calculate the work done by an external force to lift a 2 m long rod from a horizontal to a vertical position.',
            answer: {
              answerKey: 'Work done = mg × (rise in centre of mass), where the centre of mass rises by half the rod\u2019s length, i.e. 1 m; so W = mg × 1 = 9.8 × m joules (m being the rod\u2019s mass).',
              schoolMethod: `**Solution:**

- The **centre of mass rises by half the rod's length**, i.e. $1 \\text{ m}$.
- Work done $= mg \\times 1 = 9.8 \\times m$ joules ($m$ = rod's mass).

**Answer:** Work done = $9.8m$ joules, where m is the rod's mass.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch06', number: 6,
    title: 'Structure of Atom',
    slug: 'structure-of-atom',
    code: 'as06',
    description: 'Discovery of electron, proton and neutron (cathode rays, canal rays, Chadwick), Rutherford\u2019s model, Bohr\u2019s model, and line vs continuous spectra.',
    exercises: [
      {
        id: 'ex6.1', title: 'Quick Check (Discovery of Subatomic Particles)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why do cathode rays bend towards the positive plate?',
            answer: {
              answerKey: 'Cathode rays consist of negatively charged particles (electrons), which are attracted toward the positively charged plate in an electric field.',
              schoolMethod: `**Solution:**

- Cathode rays consist of **negatively charged particles (electrons)**.
- They are **attracted toward the positively charged plate** in an electric field.

**Answer:** Cathode rays are attracted to the positive plate because electrons are negatively charged.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'What conclusion did Thomson draw from using different gases in discharge tubes?',
            answer: {
              answerKey: 'Since cathode ray properties remained the same regardless of the gas used, Thomson concluded electrons are a fundamental constituent present in atoms of all elements.',
              schoolMethod: `**Solution:**

- Cathode ray properties remained the **same regardless of the gas used**.
- Thomson concluded electrons are a **fundamental constituent** present in atoms of **all elements**.

**Answer:** Electrons are a fundamental constituent present in atoms of all elements.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Why are canal rays different from cathode rays in nature?',
            answer: {
              answerKey: 'Canal rays are positively charged, and their mass depends on the type of gas used, whereas cathode rays are negatively charged electrons whose properties are independent of the gas.',
              schoolMethod: `**Solution:**

- **Canal rays** are **positively charged**, and their mass depends on the **type of gas used**.
- **Cathode rays** are **negatively charged electrons** whose properties are **independent of the gas**.

**Answer:** Canal rays are positive with gas-dependent mass; cathode rays are negative electrons independent of the gas.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Why was the discovery of the neutron necessary?',
            answer: {
              answerKey: 'Atomic mass was found to be greater than the combined mass of protons and electrons, indicating an additional neutral particle must contribute to the atom\u2019s mass.',
              schoolMethod: `**Solution:**

- Atomic mass was found to be **greater than the combined mass of protons and electrons**.
- This indicated an **additional neutral particle** must contribute to the atom's mass.

**Answer:** The extra mass beyond protons and electrons required a neutral particle - the neutron.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'In a cathode ray experiment, rays bend towards a positively charged plate. What can we conclude about the nature of these rays?',
            answer: {
              answerKey: 'The rays must carry a negative charge, since opposite charges attract each other.',
              schoolMethod: `**Solution:**

- The rays bend toward the **positive plate**.
- **Opposite charges attract** each other.

**Answer:** The rays must carry a negative charge.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'The gas is changed from hydrogen to neon, but cathode ray behaviour remains unchanged. What does this tell us about electrons?',
            answer: {
              answerKey: 'It shows electrons are a universal constituent of all atoms, present regardless of the type of gas used in the discharge tube.',
              schoolMethod: `**Solution:**

- Cathode ray behaviour is **unchanged** from hydrogen to neon.
- Electrons are a **universal constituent of all atoms**, regardless of the gas used.

**Answer:** Electrons are a universal constituent of all atoms.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'If cathode rays were neutral instead of negatively charged, how would their behaviour differ in an electric field?',
            answer: {
              answerKey: 'Neutral rays would travel undeflected in a straight line through the electric field, showing no attraction toward either plate.',
              schoolMethod: `**Solution:**

- **Neutral rays** carry no charge.
- They would travel **undeflected in a straight line** through the electric field, with no attraction toward either plate.

**Answer:** Neutral rays would pass straight through undeflected.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'In an experiment with canal rays, different gases give different masses of particles observed. What conclusion can be drawn?',
            answer: {
              answerKey: 'Canal rays are not a single fundamental particle; they consist of positive ions of the specific gas used, so their mass varies with the gas.',
              schoolMethod: `**Solution:**

- Canal rays are **not a single fundamental particle**.
- They consist of **positive ions of the specific gas used**, so their mass varies with the gas.

**Answer:** Canal rays are positive ions of the specific gas, so their mass varies with the gas.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'Why did scientists feel the need to propose the existence of neutral particles even after discovering electrons and protons? Explain using helium.',
            answer: {
              answerKey: 'Helium\u2019s mass is about four times that of hydrogen, yet it has only two protons; this extra mass could only be explained by two additional neutral particles (neutrons).',
              schoolMethod: `**Solution:**

- Helium's mass is about **four times that of hydrogen**, yet it has only **two protons**.
- This extra mass could only be explained by **two additional neutral particles (neutrons)**.

**Answer:** Helium's mass needed two extra neutral particles - neutrons.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'In Chadwick\u2019s experiment, the emitted particles were not deflected by electric or magnetic fields. What does this indicate about the nature of these particles?',
            answer: {
              answerKey: 'It indicates the particles carried no electric charge, confirming them as neutral particles, later named neutrons.',
              schoolMethod: `**Solution:**

- Particles were **not deflected** by electric or magnetic fields.
- They carried **no electric charge**.
- Confirmed as **neutral particles**, later named **neutrons**.

**Answer:** The particles carried no charge - they were neutrons.`,
            }
          },
        ]
      },
      {
        id: 'ex6.2', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'The hydrogen spectrum consists of only a few sharp spectral lines instead of a continuous spectrum. What information does it provide about the energy of electrons in an atom?',
            answer: {
              answerKey: 'It shows that electrons in an atom can only have certain fixed, discrete energy values (quantised), not a continuous range of energies.',
              schoolMethod: `**Solution:**

- Only a few **sharp spectral lines** are observed.
- Electrons can only have **fixed, discrete energy values (quantised)**, not a continuous range.

**Answer:** Electrons have fixed, quantised energy values.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Explain why Rutherford\u2019s model would predict a continuous spectrum rather than a line spectrum.',
            answer: {
              answerKey: 'Rutherford\u2019s model allowed electrons to have any continuous energy while revolving around the nucleus, so radiated energy would form a continuous, not discrete, spectrum.',
              schoolMethod: `**Solution:**

- Rutherford's model allowed electrons to have **any continuous energy** while revolving around the nucleus.
- Radiated energy would form a **continuous, not discrete**, spectrum.

**Answer:** Continuous electron energies give a continuous spectrum.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'A discharge tube filled with an unknown gas produces a line spectrum identical to hydrogen. What can you conclude about the gas? Give reason.',
            answer: {
              answerKey: 'The gas is likely hydrogen, since a line spectrum is characteristic and unique to each element, allowing identification of the element producing it.',
              schoolMethod: `**Solution:**

- A **line spectrum is characteristic and unique** to each element.
- The unknown gas produced a line spectrum **identical to hydrogen**.

**Answer:** The gas is likely hydrogen.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'If electrons in an atom were allowed to have a continuous set of energy values, what kind of spectrum would you expect? Why is this not observed?',
            answer: {
              answerKey: 'A continuous spectrum would be expected; this is not observed because electrons occupy only fixed, quantised energy levels, producing distinct line spectra instead.',
              schoolMethod: `**Solution:**

- A **continuous spectrum** would be expected.
- This is **not observed** because electrons occupy only **fixed, quantised energy levels**, producing distinct line spectra.

**Answer:** A continuous spectrum would be expected, but quantised energy levels give line spectra.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: '\u2018Bohr\u2019s model solved all problems of atomic structure.\u2019 Comment.',
            answer: {
              answerKey: 'This statement is incorrect. Bohr\u2019s model explained only hydrogen\u2019s spectrum but failed to explain multi-electron atom spectra, fine spectral lines, and effects of external fields.',
              schoolMethod: `**Solution:**

- This statement is **incorrect**.
- Bohr's model explained only **hydrogen's spectrum**.
- It failed to explain **multi-electron atom spectra**, **fine spectral lines**, and **effects of external fields**.

**Answer:** Bohr's model solved only hydrogen's spectrum, not all problems of atomic structure.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'How does the concept of fixed energy levels explain the stability of atoms?',
            answer: {
              answerKey: 'Since electrons can exist only in specific allowed orbits without continuously radiating energy, they do not spiral into the nucleus, keeping the atom stable.',
              schoolMethod: `**Solution:**

- Electrons can exist only in **specific allowed orbits**.
- They **do not continuously radiate energy**.
- They do **not spiral into the nucleus**, keeping the atom stable.

**Answer:** Fixed energy levels prevent electrons from spiralling into the nucleus, keeping atoms stable.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'Why do different elements produce different line spectra? Give a conceptual explanation.',
            answer: {
              answerKey: 'Each element has a unique set of allowed electron energy levels, so the specific energy jumps and the resulting emitted radiation wavelengths differ between elements.',
              schoolMethod: `**Solution:**

- Each element has a **unique set of allowed electron energy levels**.
- The **specific energy jumps** and resulting **emitted radiation wavelengths** differ between elements.

**Answer:** Different elements have different energy levels, so their line spectra differ.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Explain why Bohr\u2019s model works well for hydrogen but not for multi-electron atoms.',
            answer: {
              answerKey: 'Bohr\u2019s model considers only a single electron-nucleus interaction; multi-electron atoms have additional electron-electron repulsions that this simple model cannot account for.',
              schoolMethod: `**Solution:**

- Bohr's model considers only a **single electron-nucleus interaction**.
- Multi-electron atoms have additional **electron-electron repulsions** that this simple model cannot account for.

**Answer:** Bohr's model ignores electron-electron repulsions, so it fails for multi-electron atoms.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'State two limitations of Rutherford\u2019s model.',
            answer: {
              answerKey: 'It could not explain atomic stability, since an orbiting electron would continuously lose energy, and it could not explain the observed line spectrum of hydrogen.',
              schoolMethod: `**Solution:**

- It could **not explain atomic stability** - an orbiting electron would continuously lose energy.
- It could **not explain the observed line spectrum** of hydrogen.

**Answer:** (1) Cannot explain atomic stability. (2) Cannot explain hydrogen's line spectrum.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'Rutherford\u2019s model explained the structure of the atom but failed to explain atomic stability and spectra. Discuss.',
            answer: {
              answerKey: 'Rutherford correctly proposed a small, dense, positively charged nucleus with orbiting electrons, but could not explain why electrons do not spiral inward or why only discrete spectral lines are observed.',
              schoolMethod: `**Solution:**

- Rutherford **correctly proposed** a small, dense, **positively charged nucleus** with orbiting electrons.
- He could **not explain** why electrons do not spiral inward.
- He could **not explain** why only **discrete spectral lines** are observed.

**Answer:** Correct nucleus model, but failed on atomic stability and line spectra.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'What was the main drawback of Rutherford\u2019s model regarding electron motion? What assumption did Bohr make to overcome this problem?',
            answer: {
              answerKey: 'Electrons revolving continuously would lose energy and collapse into the nucleus. Bohr assumed electrons move only in fixed orbits without radiating energy.',
              schoolMethod: `**Solution:**

- Electrons revolving continuously would **lose energy and collapse into the nucleus**.
- Bohr assumed electrons move only in **fixed orbits without radiating energy**.

**Answer:** Drawback - electrons would collapse into the nucleus; Bohr assumed fixed, non-radiating orbits.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'How does Bohr\u2019s model explain the line spectrum of hydrogen?',
            answer: {
              answerKey: 'Electrons jump between fixed energy levels, releasing energy as radiation only in fixed amounts equal to the energy difference between levels, producing distinct spectral lines.',
              schoolMethod: `**Solution:**

- Electrons **jump between fixed energy levels**.
- They release energy as radiation only in **fixed amounts** equal to the energy difference between levels.
- This produces **distinct spectral lines**.

**Answer:** Fixed energy jumps between levels produce hydrogen's distinct spectral lines.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'Outline the limitations of Bohr\u2019s model.',
            answer: {
              answerKey: 'It could not explain the fine spectral line splitting, the spectra of atoms other than hydrogen, or the splitting of lines in magnetic (Zeeman) or electric (Stark) fields.',
              schoolMethod: `**Solution:**

- Could **not explain fine spectral line splitting**.
- Could **not explain the spectra of atoms other than hydrogen**.
- Could **not explain splitting in magnetic (Zeeman) or electric (Stark) fields**.

**Answer:** Bohr's model fails for fine structure, other atoms, and Zeeman/Stark effects.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'Define line spectrum and continuous spectrum with one example each.',
            answer: {
              answerKey: 'Continuous spectrum: an unbroken band of all colours, e.g., white light through a prism. Line spectrum: only distinct bright lines, e.g., the sodium vapour lamp spectrum.',
              schoolMethod: `**Solution:**

- **Continuous spectrum:** an unbroken band of all colours, e.g., **white light through a prism**.
- **Line spectrum:** only distinct bright lines, e.g., the **sodium vapour lamp spectrum**.

**Answer:** Continuous - white light through a prism; Line - sodium vapour lamp spectrum.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'Write two main postulates of Bohr\u2019s model.',
            answer: {
              answerKey: 'Electrons revolve only in certain fixed orbits without radiating energy; radiation is emitted or absorbed only when an electron jumps from one allowed orbit to another.',
              schoolMethod: `**Solution:**

- Electrons revolve only in **certain fixed orbits without radiating energy**.
- Radiation is emitted or absorbed only when an electron **jumps from one allowed orbit to another**.

**Answer:** (1) Fixed orbits without radiation. (2) Energy emitted/absorbed on jumping between orbits.`,
            }
          },
          {
            id: 'q16', number: '16', isHard: false,
            text: 'What is meant by fine structure in the hydrogen spectrum?',
            answer: {
              answerKey: 'It refers to closely spaced additional spectral lines observed with sophisticated spectroscopic techniques, which Bohr\u2019s simple model could not explain.',
              schoolMethod: `**Solution:**

- **Fine structure** refers to **closely spaced additional spectral lines**.
- Observed with sophisticated spectroscopic techniques.
- Bohr's simple model could **not explain** them.

**Answer:** Fine structure is the closely spaced additional spectral lines Bohr's model could not explain.`,
            }
          },
          {
            id: 'q17', number: '17', isHard: false,
            text: 'What is the significance of the Rydberg equation?',
            answer: {
              answerKey: 'It empirically predicts the energies and wavelengths of all spectral lines in the hydrogen spectrum using simple integer values representing the energy levels.',
              schoolMethod: `**Solution:**

- The **Rydberg equation** **empirically predicts** the energies and wavelengths of **all spectral lines** in the hydrogen spectrum.
- It uses simple **integer values** representing the energy levels.

**Answer:** It predicts the wavelengths of all hydrogen spectral lines using integer energy-level values.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch07', number: 7,
    title: 'Chemical Bonding',
    slug: 'chemical-bonding',
    code: 'as07',
    description: 'Octet rule and its exceptions (BF3, SF6, NO), duplet rule, Lewis dot structures, and metallic bonding explained by the electron sea model.',
    exercises: [
      {
        id: 'ex7.1', title: 'Quick Check (Octet Rule)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What is meant by the octet rule?',
            answer: {
              answerKey: 'Atoms tend to gain, lose, or share electrons to attain eight electrons in their valence shell, achieving a stable, noble-gas-like configuration.',
              schoolMethod: `**Solution:**

- Atoms tend to **gain, lose, or share electrons**.
- They aim to attain **eight electrons in their valence shell**.
- This achieves a **stable, noble-gas-like configuration**.

**Answer:** Atoms tend to gain, lose, or share electrons to attain eight electrons in the valence shell.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Why does hydrogen not follow the octet rule?',
            answer: {
              answerKey: 'Hydrogen\u2019s valence shell needs only two electrons, like helium, to become stable; hence it follows a duplet rule rather than an octet rule.',
              schoolMethod: `**Solution:**

- Hydrogen's valence shell needs only **two electrons**, like helium.
- It follows a **duplet rule** rather than an octet rule.

**Answer:** Hydrogen follows a duplet rule (2 electrons), not the octet rule.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Give one example each of a molecule with (a) incomplete octet (b) expanded octet (c) an odd number of electrons.',
            parts: [
              '(a) incomplete octet',
              '(b) expanded octet',
              '(c) an odd number of electrons',
            ],
            answer: {
              answerKey: '(a) Incomplete octet: BF3 (boron trifluoride). (b) Expanded octet: SF6 (sulphur hexafluoride). (c) Odd electron molecule: NO (nitric oxide).',
              schoolMethod: `**Solution:**

(a) **Incomplete octet:** BF3 (boron trifluoride).
(b) **Expanded octet:** SF6 (sulphur hexafluoride).
(c) **Odd electron molecule:** NO (nitric oxide).

**Answer:** (a) BF3 (b) SF6 (c) NO.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Why can boron form compounds with only six electrons around it?',
            answer: {
              answerKey: 'Boron has only three valence electrons, so it can form only three bonds, leaving six electrons around it and an incomplete octet.',
              schoolMethod: `**Solution:**

- Boron has only **three valence electrons**.
- It can form only **three bonds**.
- This leaves **six electrons** around it - an incomplete octet.

**Answer:** Boron has only three valence electrons, so it forms three bonds leaving six electrons.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'What is meant by a duplet configuration?',
            answer: {
              answerKey: 'A duplet configuration is a stable arrangement of only two electrons in the valence shell, as seen in hydrogen and helium.',
              schoolMethod: `**Solution:**

A **duplet configuration** is a stable arrangement of only **two electrons in the valence shell**, as seen in hydrogen and helium.

**Answer:** A duplet is a stable arrangement of two electrons in the valence shell.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Why is NO considered an exception to the octet rule?',
            answer: {
              answerKey: 'NO has an odd total of eleven valence electrons, so at least one atom (nitrogen) is left with an incomplete octet and an unpaired electron.',
              schoolMethod: `**Solution:**

- NO has an **odd total of eleven valence electrons**.
- At least one atom (nitrogen) is left with an **incomplete octet** and an **unpaired electron**.

**Answer:** NO has 11 valence electrons (odd), leaving nitrogen with an incomplete octet.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'Draw the Lewis dot structure of BF3 and explain why boron does not complete its octet.',
            answer: {
              answerKey: 'Boron forms three single bonds with three fluorine atoms, using only six electrons around itself, since it has just three valence electrons available for bonding.',
              schoolMethod: `**Solution:**

- Boron forms **three single bonds** with three fluorine atoms.
- It uses only **six electrons around itself**.
- Boron has just **three valence electrons** available for bonding.

**Answer:** Boron uses only six electrons around it because it has only three valence electrons.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Assertion: SF6 violates the octet rule. Reason: Sulphur can accommodate more than eight electrons.',
            answer: {
              answerKey: '(A) Both the assertion and the reason are correct, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** SF6 violates the octet rule - correct.
- **Reason:** Sulphur can accommodate more than eight electrons - correct.
- The reason **correctly explains** the assertion.

**Answer:** (A) Both assertion and reason are correct, and the reason explains the assertion.`,
            }
          },
        ]
      },
      {
        id: 'ex7.2', title: 'Check Your Understanding (Metallic Bonding)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What is meant by the term \u2018electron sea\u2019 in metals?',
            answer: {
              answerKey: 'It refers to the collection of delocalised, freely moving valence electrons that surround the fixed positive metal ions in a metallic structure.',
              schoolMethod: `**Solution:**

- **Electron sea** refers to the collection of **delocalised, freely moving valence electrons**.
- These surround the **fixed positive metal ions** in a metallic structure.

**Answer:** The electron sea is the delocalised, freely moving valence electrons around positive metal ions.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'What type of particles are in a fixed position in a metal according to the electron sea model?',
            answer: {
              answerKey: 'Positive metal ions are fixed in a regular, ordered arrangement within the metal\u2019s structure.',
              schoolMethod: `**Solution:**

**Positive metal ions** are fixed in a **regular, ordered arrangement** within the metal's structure.

**Answer:** Positive metal ions are fixed in a regular, ordered arrangement.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Define metallic bonding.',
            answer: {
              answerKey: 'Metallic bonding is the force of attraction between fixed positive metal ions and the surrounding sea of freely moving, delocalised electrons.',
              schoolMethod: `**Solution:**

**Metallic bonding** is the force of attraction between **fixed positive metal ions** and the surrounding **sea of freely moving, delocalised electrons**.

**Answer:** Metallic bonding is the attraction between positive metal ions and the electron sea.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Why are metallic bonds called non-directional?',
            answer: {
              answerKey: 'Because the electrons are shared collectively by all atoms rather than being localised between two specific atoms, allowing ions to shift position without breaking the bond.',
              schoolMethod: `**Solution:**

- Electrons are shared **collectively by all atoms**.
- They are **not localised between two specific atoms**.
- Ions can **shift position without breaking the bond**.

**Answer:** Electrons are shared collectively by all atoms, so the bond is non-directional.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Name two properties of metals explained by the electron sea model.',
            answer: {
              answerKey: 'Electrical conductivity and malleability (or ductility) are both explained using the mobile electron sea and the fixed positive ion structure.',
              schoolMethod: `**Solution:**

- **Electrical conductivity** - explained by the mobile electron sea.
- **Malleability (or ductility)** - explained by the fixed positive ion structure.

**Answer:** Electrical conductivity and malleability (or ductility).`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Explain how the electron sea model accounts for electrical conductivity in metals.',
            answer: {
              answerKey: 'Free electrons move throughout the metal; when an electric field is applied, they drift in one direction, and this movement of electrons constitutes an electric current.',
              schoolMethod: `**Solution:**

- **Free electrons move** throughout the metal.
- When an **electric field is applied**, they **drift in one direction**.
- This movement of electrons constitutes an **electric current**.

**Answer:** Drifting free electrons under an electric field constitute an electric current.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'How does the electron sea model explain thermal conductivity in metals?',
            answer: {
              answerKey: 'Heated electrons gain energy and move faster, transferring this energy through collisions to other electrons and vibrating ions, spreading heat quickly.',
              schoolMethod: `**Solution:**

- **Heated electrons gain energy and move faster**.
- They transfer this energy through **collisions** to other electrons and vibrating ions.
- Heat spreads **quickly**.

**Answer:** Fast-moving electrons transfer energy by collisions, spreading heat quickly.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Why can metals be beaten into thin sheets? Explain using the electron sea model.',
            answer: {
              answerKey: 'Layers of positive ions can slide over one another without breaking, since the mobile electron sea continues to hold the shifted ions together, allowing malleability.',
              schoolMethod: `**Solution:**

- Layers of **positive ions can slide over one another without breaking**.
- The **mobile electron sea** continues to hold the shifted ions together.
- This allows **malleability**.

**Answer:** Sliding ion layers are held together by the mobile electron sea, allowing malleability.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'What is meant by ductility? How is it explained by the electron sea model?',
            answer: {
              answerKey: 'Ductility is the ability of a metal to be drawn into wires; metal ions slide past each other while the mobile electron sea maintains the attraction holding them together.',
              schoolMethod: `**Solution:**

- **Ductility** is the ability of a metal to be **drawn into wires**.
- Metal ions **slide past each other**.
- The **mobile electron sea** maintains the attraction holding them together.

**Answer:** Ductility is drawing metals into wires; the electron sea holds sliding ions together.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'How is metallic bonding different from covalent bonding?',
            answer: {
              answerKey: 'Covalent bonds involve localised electron sharing between two specific atoms, while metallic bonds involve electrons delocalised and shared collectively among all atoms.',
              schoolMethod: `**Solution:**

- **Covalent bonds:** localised electron sharing between **two specific atoms**.
- **Metallic bonds:** electrons **delocalised** and shared **collectively among all atoms**.

**Answer:** Covalent = localised sharing between two atoms; metallic = delocalised sharing among all atoms.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'Explain the structure of a metal according to the electron sea model.',
            answer: {
              answerKey: 'A metal consists of fixed, regularly arranged positive metal ions surrounded by a \u2018sea\u2019 of freely moving, delocalised valence electrons that hold the structure together.',
              schoolMethod: `**Solution:**

- A metal consists of **fixed, regularly arranged positive metal ions**.
- Surrounded by a **'sea' of freely moving, delocalised valence electrons**.
- The electron sea **holds the structure together**.

**Answer:** Fixed positive ions surrounded by a sea of delocalised valence electrons.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'If electrons in a metal were not free to move, which property would be most affected? Explain.',
            answer: {
              answerKey: 'Electrical conductivity would be most affected, since the flow of current depends entirely on the free movement of delocalised electrons through the metal.',
              schoolMethod: `**Solution:**

- **Electrical conductivity** would be most affected.
- Current flow depends entirely on the **free movement of delocalised electrons**.

**Answer:** Electrical conductivity would be most affected.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'Explain why metals do not break when hammered but instead change shape.',
            answer: {
              answerKey: 'The non-directional metallic bond allows layers of ions to slide past one another while the electron sea continues to hold them together, preventing breakage.',
              schoolMethod: `**Solution:**

- The **non-directional metallic bond** allows layers of ions to **slide past one another**.
- The electron sea continues to **hold them together**.
- This **prevents breakage**.

**Answer:** Sliding ion layers held together by the electron sea prevent breakage.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'Copper is used for electrical wiring, while rubber is not. Explain using the electron sea model.',
            answer: {
              answerKey: 'Copper has free, delocalised electrons that enable current flow, while rubber has no free electrons or mobile charges, making it a poor conductor.',
              schoolMethod: `**Solution:**

- **Copper** has **free, delocalised electrons** that enable current flow.
- **Rubber** has **no free electrons or mobile charges**.
- Rubber is therefore a **poor conductor**.

**Answer:** Copper has free delocalised electrons; rubber has none, making it a poor conductor.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'Why are metals generally good conductors of heat as compared to non-metals?',
            answer: {
              answerKey: 'Metals have free electrons that quickly transfer thermal energy throughout the structure, while non-metals lack such mobile charge carriers.',
              schoolMethod: `**Solution:**

- Metals have **free electrons** that quickly transfer **thermal energy** throughout the structure.
- Non-metals **lack such mobile charge carriers**.

**Answer:** Metals conduct heat well because of their free, mobile electrons.`,
            }
          },
          {
            id: 'q16', number: '16', isHard: false,
            text: 'Assertion: Metals are good conductors of electricity. Reason: Metals contain free electrons that can move under an electric field.',
            answer: {
              answerKey: '(A) Both the assertion and the reason are correct, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** Metals are good conductors of electricity - correct.
- **Reason:** Metals contain free electrons that can move under an electric field - correct.
- The reason **correctly explains** the assertion.

**Answer:** (A) Both assertion and reason are correct, and the reason explains the assertion.`,
            }
          },
          {
            id: 'q17', number: '17', isHard: false,
            text: 'Assertion: Metallic bonds are non-directional. Reason: Electrons in metals are localised between two atoms.',
            answer: {
              answerKey: '(D) The assertion is correct, but the reason is wrong, since metallic electrons are delocalised, not localised between two atoms.',
              schoolMethod: `**Solution:**

- **Assertion:** Metallic bonds are non-directional - correct.
- **Reason:** Electrons in metals are localised between two atoms - **wrong**.
- Metallic electrons are **delocalised**, not localised.

**Answer:** (D) Assertion correct, reason wrong.`,
            }
          },
          {
            id: 'q18', number: '18', isHard: false,
            text: 'Assertion: Metals are malleable. Reason: Layers of metal ions can slide while electrons continue to hold them together.',
            answer: {
              answerKey: '(A) Both the assertion and the reason are correct, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** Metals are malleable - correct.
- **Reason:** Layers of metal ions can slide while electrons continue to hold them together - correct.
- The reason **correctly explains** the assertion.

**Answer:** (A) Both assertion and reason are correct, and the reason explains the assertion.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch08', number: 8,
    title: 'Mixtures and Separation of Mixtures',
    slug: 'mixtures-and-separation-of-mixtures',
    code: 'as08',
    description: 'Chromatography (stationary and mobile phase), column chromatography, and simple vs fractional distillation with the role of the fractionating column.',
    exercises: [
      {
        id: 'ex8.1', title: 'Questions',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What is chromatography? Mention its two main phases.',
            answer: {
              answerKey: 'Chromatography separates the components of a mixture based on their differing rates of movement through a stationary phase under the influence of a moving mobile phase.',
              schoolMethod: `**Solution:**

- **Chromatography** separates components based on their **differing rates of movement**.
- It uses a **stationary phase** and a **moving mobile phase**.

**Answer:** Chromatography separates mixture components using a stationary phase and a moving mobile phase.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Who discovered chromatography and in which year?',
            answer: {
              answerKey: 'The Russian botanist Mikhail Tswett discovered chromatography in 1906 while studying plant pigments.',
              schoolMethod: `**Solution:**

The Russian botanist **Mikhail Tswett** discovered chromatography in **1906** while studying plant pigments.

**Answer:** Mikhail Tswett, in 1906.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'What is meant by stationary phase and mobile phase?',
            answer: {
              answerKey: 'The stationary phase is the fixed medium, such as silica gel, over which components move; the mobile phase is the moving solvent that carries the mixture.',
              schoolMethod: `**Solution:**

- **Stationary phase:** the **fixed medium** (e.g. silica gel) over which components move.
- **Mobile phase:** the **moving solvent** that carries the mixture.

**Answer:** Stationary phase is the fixed medium; mobile phase is the moving solvent.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Name two common adsorbents used in column chromatography.',
            answer: {
              answerKey: 'Silica gel and alumina are two common adsorbents used in column chromatography.',
              schoolMethod: `**Solution:**

Two common adsorbents used in column chromatography are **silica gel** and **alumina**.

**Answer:** Silica gel and alumina.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'What is an eluent in column chromatography?',
            answer: {
              answerKey: 'The eluent is the solvent poured through the column, which carries the mixture\u2019s components down through the stationary phase.',
              schoolMethod: `**Solution:**

The **eluent** is the **solvent poured through the column**, which carries the mixture's components down through the stationary phase.

**Answer:** The eluent is the solvent that carries components down the column.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Why do different substances move at different speeds in column chromatography?',
            answer: {
              answerKey: 'Substances have different adsorption tendencies toward the stationary phase; more strongly adsorbed components move slower than weakly adsorbed ones.',
              schoolMethod: `**Solution:**

- Substances have **different adsorption tendencies** toward the stationary phase.
- **More strongly adsorbed** components move **slower** than weakly adsorbed ones.

**Answer:** Different adsorption strengths cause components to move at different speeds.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'What is fractional distillation?',
            answer: {
              answerKey: 'Fractional distillation is a technique to separate miscible liquids whose boiling points differ by less than 25 degrees Celsius, using a fractionating column.',
              schoolMethod: `**Solution:**

**Fractional distillation** separates **miscible liquids whose boiling points differ by less than 25 °C**, using a **fractionating column**.

**Answer:** Fractional distillation separates miscible liquids with close boiling points using a fractionating column.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'When is fractional distillation preferred over simple distillation?',
            answer: {
              answerKey: 'It is preferred when the boiling points of the miscible liquids differ by less than 25 degrees Celsius, requiring better separation than simple distillation can provide.',
              schoolMethod: `**Solution:**

- Preferred when boiling points differ by **less than 25 °C**.
- Requires **better separation** than simple distillation can provide.

**Answer:** Fractional distillation is preferred when boiling points differ by less than 25 °C.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'What is the role of the fractionating column?',
            answer: {
              answerKey: 'It provides extra surface area for repeated condensation and vaporisation, which improves the separation of liquids with close boiling points.',
              schoolMethod: `**Solution:**

- The fractionating column provides **extra surface area**.
- This allows **repeated condensation and vaporisation**.
- It **improves separation** of liquids with close boiling points.

**Answer:** The fractionating column provides extra surface area for repeated condensation and vaporisation.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'In column chromatography, a mixture of two compounds A and B is separated, and A comes out first. What can you say about its interaction with the stationary phase?',
            answer: {
              answerKey: 'Compound A is less strongly adsorbed onto the stationary phase and travels faster along with the mobile phase, so it elutes first.',
              schoolMethod: `**Solution:**

- **A comes out first** (elutes first).
- A is **less strongly adsorbed** onto the stationary phase.
- It **travels faster** along with the mobile phase.

**Answer:** Compound A is less strongly adsorbed, so it travels faster and elutes first.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'A mixture of ethanol (boiling point 78 degrees Celsius) and water (boiling point 100 degrees Celsius) is to be separated. Which method will you use and why?',
            answer: {
              answerKey: 'Fractional distillation should be used, since the boiling point difference is less than 25 degrees Celsius, requiring a fractionating column for effective separation.',
              schoolMethod: `**Solution:**

- Boiling point difference $= 100 - 78 = 22\\degree$C, which is **less than 25 °C**.
- A **fractionating column** is required for effective separation.

**Answer:** Use fractional distillation, since the boiling point difference is less than 25 °C.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'Explain why repeated condensation and vaporization improve separation in fractional distillation.',
            answer: {
              answerKey: 'Each condensation-vaporisation cycle further enriches the rising vapour with the more volatile component, gradually achieving purer separation as vapour rises through the column.',
              schoolMethod: `**Solution:**

- Each **condensation-vaporisation cycle** further **enriches the rising vapour** with the more volatile component.
- This **gradually achieves purer separation** as vapour rises through the column.

**Answer:** Repeated cycles enrich the vapour with the more volatile component, giving purer separation.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'In a fractional distillation column, why does temperature decrease from bottom to top?',
            answer: {
              answerKey: 'More volatile, lower-boiling components rise higher in the column before condensing, so the temperature progressively decreases with increasing height.',
              schoolMethod: `**Solution:**

- **More volatile, lower-boiling components** rise **higher** in the column before condensing.
- So the temperature **progressively decreases with increasing height**.

**Answer:** Temperature decreases from bottom to top because more volatile components rise higher.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'Why is simple distillation not suitable for separating liquids with close boiling points?',
            answer: {
              answerKey: 'Without a fractionating column, the vapours of both liquids rise together, giving poor separation when their boiling points are close to each other.',
              schoolMethod: `**Solution:**

- Without a **fractionating column**, the vapours of **both liquids rise together**.
- This gives **poor separation** when boiling points are close.

**Answer:** Without a fractionating column, both vapours rise together giving poor separation.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'Assertion: In chromatography, separation occurs due to difference in boiling points. Reason: Components move at different speeds in the column.',
            answer: {
              answerKey: '(D) The assertion is false, but the reason is true; chromatography separation is actually due to differing adsorption or solubility, not boiling points.',
              schoolMethod: `**Solution:**

- **Assertion** (separation due to boiling points) is **false**.
- **Reason** (components move at different speeds) is **true**.
- Chromatography separation is due to **differing adsorption or solubility**, not boiling points.

**Answer:** (D) Assertion false, reason true.`,
            }
          },
          {
            id: 'q16', number: '16', isHard: false,
            text: 'Assertion: Fractional distillation gives better separation than simple distillation. Reason: It involves repeated condensation and vaporization.',
            answer: {
              answerKey: '(A) Both the assertion and the reason are correct, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** Fractional distillation gives better separation - correct.
- **Reason:** It involves repeated condensation and vaporization - correct.
- The reason **correctly explains** the assertion.

**Answer:** (A) Both assertion and reason are correct, and the reason explains the assertion.`,
            }
          },
          {
            id: 'q17', number: '17', isHard: false,
            text: 'Difference in which property forms the basis for separating components in fractional distillation? (a) Solubility (b) Boiling points (c) Particle size (d) Chemical reactivity',
            answer: {
              answerKey: '(b) Boiling points.',
              schoolMethod: `**Solution:**

Fractional distillation separates components based on their **boiling points**.

**Answer:** (b) Boiling points.`,
            }
          },
          {
            id: 'q18', number: '18', isHard: false,
            text: 'What is the main purpose of the fractionating column in fractional distillation? (a) To heat the mixture faster (b) To cool vapours at a fast rate (c) To provide more surface area for vapours (d) To let vapours mix',
            answer: {
              answerKey: '(c) To provide more surface area for vapours.',
              schoolMethod: `**Solution:**

The fractionating column's main purpose is to **provide more surface area for vapours**.

**Answer:** (c) To provide more surface area for vapours.`,
            }
          },
          {
            id: 'q19', number: '19', isHard: false,
            text: 'In column chromatography, the solid substance filled in the column is called the: (a) Mobile phase (b) Solvent (c) Stationary phase (d) Mixture',
            answer: {
              answerKey: '(c) Stationary phase.',
              schoolMethod: `**Solution:**

The **solid substance filled in the column** is the **stationary phase**.

**Answer:** (c) Stationary phase.`,
            }
          },
          {
            id: 'q20', number: '20', isHard: false,
            text: 'Which component of a mixture moves down the column at a faster rate? (a) Most attracted to stationary phase (b) Highest boiling point (c) Most soluble in mobile phase (d) Largest particle',
            answer: {
              answerKey: '(c) The one most soluble in the mobile phase (solvent).',
              schoolMethod: `**Solution:**

The component **most soluble in the mobile phase (solvent)** moves down the column faster.

**Answer:** (c) The one most soluble in the mobile phase.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch09', number: 9,
    title: 'Microscope and Microscopy',
    slug: 'microscope-and-microscopy',
    code: 'as09',
    description: 'Compound microscope, magnification and resolution, calculating actual size, temporary vs permanent slides, and electron microscopes (TEM and SEM).',
    exercises: [
      {
        id: 'ex9.1', title: 'Activity 9.1 (Let Us Think and Write)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'If you could shrink yourself and travel inside a leaf, what would you see? Write 3-4 lines.',
            answer: {
              answerKey: 'Inside a leaf, one would see rows of green box-like cells packed with round chloroplasts, thin transparent cell walls, tiny pore-like stomata for gas exchange, and vein-like vascular tissue carrying water and nutrients.',
              schoolMethod: `**Solution:**

- **Rows of green box-like cells** packed with round **chloroplasts**.
- **Thin transparent cell walls**.
- Tiny pore-like **stomata** for gas exchange.
- **Vein-like vascular tissue** carrying water and nutrients.

**Answer:** Green box-like cells with chloroplasts, cell walls, stomata, and vascular tissue.`,
            }
          },
        ]
      },
      {
        id: 'ex9.2', title: 'Activity 9.4 (Monocot vs Dicot Leaf Peels)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Compare the epidermal cells, guard cells, and stomata distribution of a monocot leaf and a dicot leaf.',
            answer: {
              answerKey: 'Monocot leaf epidermal cells are elongated with a regular parallel pattern, and stomata are distributed evenly on both surfaces. Dicot leaf cells are irregular, jigsaw-shaped, with stomata mainly on the lower surface.',
              schoolMethod: `**Solution:**

- **Monocot leaf:** epidermal cells are **elongated with a regular parallel pattern**; stomata are distributed **evenly on both surfaces**.
- **Dicot leaf:** cells are **irregular, jigsaw-shaped**; stomata are **mainly on the lower surface**.

**Answer:** Monocot - parallel cells, stomata on both surfaces; Dicot - jigsaw cells, stomata mainly on the lower surface.`,
            }
          },
        ]
      },
      {
        id: 'ex9.3', title: 'Activity 9.5 (Permanent Slides)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Do you find any difference in the clarity of temporary and permanent slides? Identify two common anatomical differences that remain consistent.',
            answer: {
              answerKey: 'Permanent slides show clearer, sharper, and well-stained cell walls and guard cells compared to temporary mounts. Two consistent features across both: distinct guard cell shape around stomata, and visible cell wall boundaries.',
              schoolMethod: `**Solution:**

- **Permanent slides** show **clearer, sharper, well-stained** cell walls and guard cells.
- Two consistent features across both:
  1. **Distinct guard cell shape** around stomata.
  2. **Visible cell wall boundaries**.

**Answer:** Permanent slides are clearer; both show distinct guard cells and visible cell walls.`,
            }
          },
        ]
      },
      {
        id: 'ex9.4', title: 'Let Us Find Out',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'If a cell measures 5 mm on a 100X image, calculate its actual size.',
            answer: {
              answerKey: 'Actual size = image size / magnification = 5 mm / 100 = 0.05 mm (50 micrometres).',
              schoolMethod: `**Solution:**

Actual size $= \\dfrac{\\text{image size}}{\\text{magnification}} = \\dfrac{5}{100} = 0.05 \\text{ mm} = 50 \\mu\\text{m}$

**Answer:** Actual size = 0.05 mm (50 µm).`,
            }
          },
          {
            id: 'q2', number: '2', isHard: true,
            text: 'If you use a 15X eyepiece and a 10X objective, what will be the total magnification?',
            answer: {
              answerKey: 'Total magnification M = m(o) × m(e) = 10 × 15 = 150X.',
              schoolMethod: `**Solution:**

$M = m_o \\times m_e = 10 \\times 15 = 150\\times$

**Answer:** Total magnification = 150X.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: true,
            text: 'If 4 cells fit across a 0.8 mm field of view, what will be the approximate size of one cell?',
            answer: {
              answerKey: 'Size of one cell = 0.8 mm / 4 = 0.2 mm.',
              schoolMethod: `**Solution:**

Size of one cell $= \\dfrac{0.8}{4} = 0.2 \\text{ mm}$

**Answer:** Approximate size of one cell = 0.2 mm.`,
            }
          },
        ]
      },
      {
        id: 'ex9.5', title: 'Think',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why do you think electron microscopes are usually found in big research centres and not in normal school laboratories?',
            answer: {
              answerKey: 'Electron microscopes are extremely costly, require a vacuum environment, need complex sample preparation, and demand skilled operation, making them impractical for regular school laboratories.',
              schoolMethod: `**Solution:**

- **Extremely costly**.
- Require a **vacuum environment**.
- Need **complex sample preparation**.
- Demand **skilled operation**.

**Answer:** Cost, vacuum requirement, complex preparation, and skilled operation make them impractical for schools.`,
            }
          },
        ]
      },
      {
        id: 'ex9.6', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: true,
            text: 'A microscope has a 10X eyepiece and a 40X objective. (a) What is its total magnification? (b) At this setting, the field of view is 0.4 mm; if 4 cells fit across, estimate the size of one cell.',
            parts: [
              '(a) What is its total magnification?',
              '(b) At this setting, the field of view is 0.4 mm; if 4 cells fit across, estimate the size of one cell.',
            ],
            answer: {
              answerKey: '(a) Total magnification = 10 × 40 = 400X. (b) Size of one cell = 0.4 mm / 4 = 0.1 mm.',
              schoolMethod: `**Solution:**

(a) Total magnification $= 10 \\times 40 = 400\\times$.

(b) Size of one cell $= \\dfrac{0.4}{4} = 0.1 \\text{ mm}$.

**Answer:** (a) 400X. (b) 0.1 mm.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: '(a) You want to watch live protozoa moving in pond water. Which microscope is best and why? (b) Neha wants to study the 3D surface of a pollen grain. Which microscope should she choose and why?',
            parts: [
              '(a) You want to watch live protozoa moving in pond water. Which microscope is best and why?',
              '(b) Neha wants to study the 3D surface of a pollen grain. Which microscope should she choose and why?',
            ],
            answer: {
              answerKey: '(a) A phase-contrast microscope is best, as it enhances contrast in living cells without chemical stains that would kill them. (b) A Scanning Electron Microscope (SEM) is best, as it gives 3D-like surface images.',
              schoolMethod: `**Solution:**

(a) **Phase-contrast microscope** - enhances contrast in **living cells** without chemical stains that would kill them.

(b) **Scanning Electron Microscope (SEM)** - gives **3D-like surface images**.

**Answer:** (a) Phase-contrast. (b) SEM.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Riya sees a sharp onion cell image at 100X, but when she switches to 400X, the image is bigger but very blurred. Name the concept causing this problem and explain.',
            answer: {
              answerKey: 'This is due to limited resolution; increasing magnification beyond the microscope\u2019s resolving power only enlarges the blur, since resolution, not magnification, determines the clarity of fine detail.',
              schoolMethod: `**Solution:**

- This is due to **limited resolution**.
- Increasing magnification beyond the microscope's **resolving power** only **enlarges the blur**.
- **Resolution, not magnification**, determines the clarity of fine detail.

**Answer:** Limited resolution - magnification beyond resolving power only enlarges the blur.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Draw a ray diagram of a compound microscope.',
            answer: {
              answerKey: 'The objective lens (short focal length) forms a real, inverted, magnified image of the specimen just beyond its focal point; this image becomes the object for the eyepiece, which further magnifies it into a final upright, virtual image.',
              schoolMethod: `**Solution:**

- The **objective lens** (short focal length) forms a **real, inverted, magnified image** just beyond its focal point.
- This image becomes the **object for the eyepiece**.
- The eyepiece **further magnifies** it into a final **upright, virtual image**.

**Answer:** Objective forms a real inverted image; the eyepiece magnifies it into an upright virtual image.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Design a simple poster \u2018How to take care of a microscope?\u2019 with three do\u2019s and three don\u2019ts.',
            answer: {
              answerKey: 'Do\u2019s: always carry it by the arm while supporting the base; clean lenses only with lens paper; store it covered in a dust-free place. Don\u2019ts: never touch lenses with bare fingers; never force the focus knob; never tilt it while viewing a wet mount.',
              schoolMethod: `**Solution:**

**Do's:**
- Always carry it by the **arm** while supporting the **base**.
- Clean lenses only with **lens paper**.
- Store it **covered** in a dust-free place.

**Don'ts:**
- Never touch lenses with **bare fingers**.
- Never **force the focus knob**.
- Never **tilt it** while viewing a wet mount.

**Answer:** Three do's and three don'ts as above.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: true,
            text: 'At 40X total magnification, the field diameter is 4 mm. Predict the field diameter at 400X magnification (assume it is inversely proportional to magnification).',
            answer: {
              answerKey: 'Field diameter at 400X = 4 mm × (40/400) = 0.4 mm.',
              schoolMethod: `**Solution:**

Field diameter at 400X $= 4 \\times \\dfrac{40}{400} = 0.4 \\text{ mm}$

**Answer:** Field diameter at 400X = 0.4 mm.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'A student accidentally traps many air bubbles while placing the cover slip. How will this affect observation? Suggest two ways to avoid bubbles next time.',
            answer: {
              answerKey: 'Air bubbles appear as dark circular outlines that obscure specimen details. To avoid them: lower the cover slip gradually at an angle, and use a sufficient, evenly spread drop of mounting fluid.',
              schoolMethod: `**Solution:**

- **Air bubbles** appear as **dark circular outlines** that obscure specimen details.
- To avoid them:
  1. **Lower the cover slip gradually at an angle**.
  2. Use a **sufficient, evenly spread drop** of mounting fluid.

**Answer:** Bubbles obscure details; lower the cover slip at an angle and use enough mounting fluid.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'Compare TEM and SEM in terms of: (a) type of image (b) best use (internal vs surface).',
            parts: [
              '(a) type of image',
              '(b) best use (internal vs surface)',
            ],
            answer: {
              answerKey: 'TEM produces two-dimensional images showing internal structures like organelles and viruses, best for studying internal cell details. SEM produces three-dimensional-like images, best for studying external surface features.',
              schoolMethod: `**Solution:**

(a) **TEM** produces **two-dimensional images** showing **internal structures** (organelles, viruses). **SEM** produces **three-dimensional-like images**.

(b) **TEM** - best for **internal cell details**. **SEM** - best for **external surface features**.

**Answer:** TEM - 2D internal images; SEM - 3D-like surface images.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'Plan a brief investigation using a school light microscope to compare the purity of three water samples (tap water, RO-purified water, and pond water). Outline the main steps and predict your expected observations.',
            answer: {
              answerKey: 'Prepare wet mounts of each water sample and observe under the same magnification, counting visible microorganisms or particles. Expected result: pond water shows the most organisms, followed by tap water, with RO water showing the least.',
              schoolMethod: `**Solution:**

- Prepare **wet mounts** of each water sample.
- Observe under the **same magnification**, counting visible **microorganisms or particles**.
- Expected result: **pond water** shows the most organisms, followed by **tap water**, with **RO water** showing the least.

**Answer:** Count organisms in wet mounts at the same magnification; pond > tap > RO.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'Can we rely on electron microscopes for studying living cells? Explain the reason.',
            answer: {
              answerKey: 'No, because the vacuum environment and metal coating or staining required for electron microscopy kill living specimens, making them unsuitable for observing life processes.',
              schoolMethod: `**Solution:**

- **No.** The **vacuum environment** and **metal coating or staining** required kill living specimens.
- They are unsuitable for observing **life processes**.

**Answer:** No - the vacuum and coating kill living specimens.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'List two ways how microscopes are used in hospitals and one way they are used in industries that manufacture mobile phones.',
            answer: {
              answerKey: 'Hospitals: diagnosing diseases such as malaria from blood smears, and examining tissue biopsies for cancer. Mobile phone industry: inspecting microchip circuits for manufacturing defects using electron microscopes.',
              schoolMethod: `**Solution:**

**Hospitals:**
- Diagnosing diseases such as **malaria from blood smears**.
- Examining **tissue biopsies for cancer**.

**Mobile phone industry:**
- Inspecting **microchip circuits** for manufacturing defects using electron microscopes.

**Answer:** Two hospital uses (malaria, biopsies) and one phone-industry use (microchip inspection).`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'Imagine you are Robert Hooke. Write a 5-6 line diary entry about what you felt when you first saw \u2018little boxes\u2019 (cells) in cork.',
            answer: {
              answerKey: 'Today I observed thin slices of cork bark under my microscope and was astonished to see tiny hexagonal, box-like spaces resembling a honeycomb pattern; I have decided to name these small units \u2018cells\u2019.',
              schoolMethod: `**Solution:**

Today I observed thin slices of **cork bark** under my microscope and was astonished to see tiny **hexagonal, box-like spaces** resembling a honeycomb pattern; I have decided to name these small units **'cells'**.

**Answer:** Diary entry describing the first sight of cork 'little boxes' (cells).`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'Ananya says, \u2018If we add more and more lenses, we can see anything, even atoms, with a school microscope.\u2019 Use the idea of resolution to correct this statement.',
            answer: {
              answerKey: 'This is incorrect. Adding more lenses only increases magnification, not resolution. Light microscopes cannot resolve details smaller than about 0.2 micrometres, which is far larger than an atom.',
              schoolMethod: `**Solution:**

- This is **incorrect**.
- Adding more lenses only increases **magnification**, not **resolution**.
- Light microscopes cannot resolve details smaller than about **0.2 µm**, which is **far larger than an atom**.

**Answer:** More lenses increase magnification, not resolution; light microscopes cannot resolve atoms.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'Nishant wants to observe the effect of a concentrated salt solution on cells of a Rhoeo leaf and also wants to keep slides for future reference. (a) Which type of mount should be used for this purpose? Give reason. (b) Will the same slide be suitable for long-term storage? Elucidate the reason.',
            parts: [
              '(a) Which type of mount should be used for this purpose? Give reason.',
              '(b) Will the same slide be suitable for long-term storage? Elucidate the reason.',
            ],
            answer: {
              answerKey: '(a) A temporary mount should be used first, since the immediate live cellular reaction (plasmolysis) must be observed fresh. (b) No, the same slide is not suitable for long-term storage, since temporary mounts dry out and cells distort over time; a separate permanent mount must be prepared for storage.',
              schoolMethod: `**Solution:**

(a) A **temporary mount** should be used first, since the immediate **live cellular reaction (plasmolysis)** must be observed fresh.

(b) **No.** The same slide is **not suitable for long-term storage** - temporary mounts **dry out** and cells **distort over time**. A separate **permanent mount** must be prepared.

**Answer:** (a) Temporary mount. (b) No - prepare a separate permanent mount.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'Why is it important to fix and dehydrate cheek cells before mounting in Canada Balsam for school laboratory storage? Predict the consequences if a student inadvertently skipped the fixation and dehydration steps.',
            answer: {
              answerKey: 'Fixing preserves the cell\u2019s structure, and dehydration removes water so the mounting medium can properly seal the specimen. Skipping these steps would cause the cells to rot, distort, or dissolve, ruining the permanent slide.',
              schoolMethod: `**Solution:**

- **Fixing** preserves the cell's **structure**.
- **Dehydration** removes water so the mounting medium can **properly seal** the specimen.
- Skipping these steps would cause the cells to **rot, distort, or dissolve**, ruining the permanent slide.

**Answer:** Fixing and dehydration preserve the cells; skipping them ruins the permanent slide.`,
            }
          },
        ]
      },
    ]
  },
  {
    id: 'ch10', number: 10,
    title: 'Engineering Life - Miracles in Biotechnology',
    slug: 'engineering-life-miracles-in-biotechnology',
    code: 'as10',
    description: 'Definition of biotechnology, traditional vs modern biotechnology, fermenters and sterility, microbial growth curve, and genetic engineering (insulin, GM crops, bioremediation).',
    exercises: [
      {
        id: 'ex10.1', title: 'Quick Check',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'What is biotechnology?',
            answer: {
              answerKey: 'Biotechnology is the judicious use of living organisms or their cellular components to produce substances beneficial to humans.',
              schoolMethod: `**Solution:**

**Biotechnology** is the **judicious use of living organisms or their cellular components** to produce substances **beneficial to humans**.

**Answer:** Biotechnology is the judicious use of living organisms or their cellular components to produce useful substances.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Give two examples from your daily life demonstrating the use of biotechnology.',
            answer: {
              answerKey: 'Making curd from milk using bacteria, and baking bread using yeast fermentation are two everyday examples of biotechnology.',
              schoolMethod: `**Solution:**

- **Making curd from milk** using bacteria.
- **Baking bread** using yeast fermentation.

**Answer:** Making curd and baking bread are two everyday examples.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Why are microorganisms important in biotechnology?',
            answer: {
              answerKey: 'Microorganisms grow rapidly, need minimal space and simple nutrients, and their DNA can be easily manipulated, making them ideal biological tools.',
              schoolMethod: `**Solution:**

- **Grow rapidly**.
- Need **minimal space and simple nutrients**.
- Their **DNA can be easily manipulated**.

**Answer:** Rapid growth, simple needs, and easy DNA manipulation make microbes ideal tools.`,
            }
          },
        ]
      },
      {
        id: 'ex10.2', title: 'Quick Check (Traditional vs Modern Biotechnology)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Uses natural microbial processes | Uses ______ techniques.',
            answer: {
              answerKey: 'Uses genetic engineering / recombinant DNA techniques.',
              schoolMethod: `**Solution:**

Modern biotechnology **uses genetic engineering / recombinant DNA techniques**.

**Answer:** Genetic engineering / recombinant DNA techniques.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Used since ______ times | Developed in ______ times.',
            answer: {
              answerKey: 'Traditional biotechnology has been used since ancient times; modern biotechnology was developed in recent/modern times.',
              schoolMethod: `**Solution:**

- **Traditional biotechnology** has been used since **ancient times**.
- **Modern biotechnology** was developed in **recent/modern times**.

**Answer:** Ancient times / recent (modern) times.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Example: Making curd and bread | Example: Production of ______ using bacteria.',
            answer: {
              answerKey: 'Example: Production of insulin using bacteria.',
              schoolMethod: `**Solution:**

Modern biotechnology example: **production of insulin using bacteria**.

**Answer:** Production of insulin using bacteria.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Has limited control over ______ | Provides greater control over ______.',
            answer: {
              answerKey: 'Traditional biotechnology has limited control over the genetic makeup of organisms; modern biotechnology provides greater control over genetic traits.',
              schoolMethod: `**Solution:**

- **Traditional biotechnology** has **limited control over the genetic makeup** of organisms.
- **Modern biotechnology** provides **greater control over genetic traits**.

**Answer:** Genetic makeup / genetic traits.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Does not involve gene transfer | Involves ______ modification.',
            answer: {
              answerKey: 'Modern biotechnology involves genetic modification.',
              schoolMethod: `**Solution:**

Modern biotechnology **involves genetic modification**.

**Answer:** Genetic modification.`,
            }
          },
        ]
      },
      {
        id: 'ex10.3', title: 'Quick Check (Fermenters)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Why is temperature control important in fermenters?',
            answer: {
              answerKey: 'Microbial growth and enzyme activity are temperature-sensitive; excess heat produced during growth can kill the microbes if not controlled by cooling.',
              schoolMethod: `**Solution:**

- **Microbial growth and enzyme activity are temperature-sensitive**.
- **Excess heat** produced during growth can **kill the microbes** if not controlled by cooling.

**Answer:** Excess heat can kill microbes, so temperature must be controlled.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'What happens if contamination occurs?',
            answer: {
              answerKey: 'Unwanted microorganisms compete for nutrients, may produce harmful by-products, and spoil the desired product, reducing yield and quality.',
              schoolMethod: `**Solution:**

- **Unwanted microorganisms compete for nutrients**.
- They may produce **harmful by-products**.
- They **spoil the desired product**, reducing **yield and quality**.

**Answer:** Contamination reduces yield and quality by spoiling the product.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Explain sterilization and its importance in microbial growth.',
            answer: {
              answerKey: 'Sterilization removes all unwanted microorganisms from the equipment and medium beforehand, ensuring only the desired culture grows without contamination.',
              schoolMethod: `**Solution:**

- **Sterilization removes all unwanted microorganisms** from the equipment and medium beforehand.
- It ensures **only the desired culture grows** without contamination.

**Answer:** Sterilization removes unwanted microbes so only the desired culture grows.`,
            }
          },
        ]
      },
      {
        id: 'ex10.4', title: 'Activity (Growth Simulation)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Using the hypothetical fermenter data, plot a graph of time versus number of microorganisms.',
            answer: {
              answerKey: 'The graph rises slowly at first, then increases steeply, flattens near its peak, and finally declines, forming a typical S-shaped microbial growth curve.',
              schoolMethod: `**Solution:**

- The graph **rises slowly at first**.
- Then **increases steeply**.
- **Flattens near its peak**.
- **Finally declines**.

**Answer:** The graph forms a typical S-shaped microbial growth curve.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Identify and label the growth phases: lag, log, stationary, and death.',
            answer: {
              answerKey: 'Lag phase: initial hours with slow adaptation; Log phase: period of rapid, steep rise; Stationary phase: levelling off near the peak; Death phase: decline after nutrient depletion.',
              schoolMethod: `**Solution:**

- **Lag phase:** initial hours with **slow adaptation**.
- **Log phase:** period of **rapid, steep rise**.
- **Stationary phase:** **levelling off near the peak**.
- **Death phase:** **decline after nutrient depletion**.

**Answer:** Lag, Log, Stationary, Death.`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'During which time period do microorganisms grow most rapidly?',
            answer: {
              answerKey: 'Microorganisms grow most rapidly during the middle hours of the experiment, corresponding to the log (exponential) phase.',
              schoolMethod: `**Solution:**

Microorganisms grow most rapidly during the **middle hours** of the experiment, corresponding to the **log (exponential) phase**.

**Answer:** During the log (exponential) phase.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Suggest one reason why the population decreases after a certain time.',
            answer: {
              answerKey: 'Nutrients become depleted and toxic metabolic waste accumulates in the fermenter, causing the death rate to exceed the reproduction rate.',
              schoolMethod: `**Solution:**

- **Nutrients become depleted**.
- **Toxic metabolic waste accumulates** in the fermenter.
- The **death rate exceeds the reproduction rate**.

**Answer:** Nutrient depletion and toxic waste accumulation cause the population to decline.`,
            }
          },
        ]
      },
      {
        id: 'ex10.5', title: 'Activity (Traditional Biotechnology Research)',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Part A: Make a list of fermented foods used in your home or community and identify the responsible microorganism.',
            answer: {
              answerKey: 'Common fermented foods include curd (Lactobacillus bacteria), bread (yeast), idli and dosa batter (bacteria and yeast), and pickles (lactic acid bacteria).',
              schoolMethod: `**Solution:**

- **Curd** - Lactobacillus bacteria.
- **Bread** - yeast.
- **Idli and dosa batter** - bacteria and yeast.
- **Pickles** - lactic acid bacteria.

**Answer:** Curd (Lactobacillus), bread (yeast), idli/dosa (bacteria + yeast), pickles (lactic acid bacteria).`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Part B: Prepare kanji using carrot and beetroot and record observations over several days.',
            answer: {
              answerKey: 'Fermenting chopped carrot and beetroot with water, salt, and mustard powder in sunlight for 2-3 days produces a sour aroma, colour change, and bubble formation, indicating lactic acid bacterial fermentation.',
              schoolMethod: `**Solution:**

- Ferment **chopped carrot and beetroot** with water, salt, and mustard powder in **sunlight for 2-3 days**.
- Observe a **sour aroma**, **colour change**, and **bubble formation**.
- This indicates **lactic acid bacterial fermentation**.

**Answer:** Sour aroma, colour change, and bubbles indicate lactic acid fermentation.`,
            }
          },
        ]
      },
      {
        id: 'ex10.6', title: 'Check Your Understanding',
        questions: [
          {
            id: 'q1', number: '1', isHard: false,
            text: 'Define biotechnology. Explain how microorganisms act as \u2018life\u2019s engineers\u2019 giving two examples.',
            answer: {
              answerKey: 'Biotechnology uses living organisms to create useful products. Microorganisms act as \u2018life\u2019s engineers\u2019 by converting milk into curd (bacteria) and producing insulin using genetically engineered bacteria.',
              schoolMethod: `**Solution:**

- **Biotechnology** uses living organisms to create useful products.
- Microorganisms act as **'life's engineers'** by:
  1. **Converting milk into curd** (bacteria).
  2. **Producing insulin** using genetically engineered bacteria.

**Answer:** Biotechnology uses living organisms to create useful products; microbes act as 'life's engineers'.`,
            }
          },
          {
            id: 'q2', number: '2', isHard: false,
            text: 'Differentiate between traditional biotechnology and modern biotechnology using suitable examples.',
            answer: {
              answerKey: 'Traditional biotechnology uses natural microbial processes, like fermentation for bread and curd; modern biotechnology uses genetic engineering, such as producing insulin using genetically modified bacteria.',
              schoolMethod: `**Solution:**

- **Traditional biotechnology:** uses **natural microbial processes**, e.g. fermentation for **bread and curd**.
- **Modern biotechnology:** uses **genetic engineering**, e.g. **producing insulin** using genetically modified bacteria.

**Answer:** Traditional - natural fermentation (bread, curd); Modern - genetic engineering (insulin).`,
            }
          },
          {
            id: 'q3', number: '3', isHard: false,
            text: 'Why are fermenters used instead of open containers for industrial production of useful substances? Give any two reasons.',
            answer: {
              answerKey: 'Fermenters maintain sterile, contamination-free conditions, and allow precise control of temperature, pH, and aeration needed for optimal microbial growth.',
              schoolMethod: `**Solution:**

1. Fermenters maintain **sterile, contamination-free conditions**.
2. They allow **precise control of temperature, pH, and aeration** needed for optimal microbial growth.

**Answer:** Sterility and precise control of temperature, pH, and aeration.`,
            }
          },
          {
            id: 'q4', number: '4', isHard: false,
            text: 'Explain the importance of maintaining sterility inside a fermenter. What problems may arise if sterility is not maintained?',
            answer: {
              answerKey: 'Sterility ensures only the desired microorganism grows inside the fermenter. Without it, contaminating microbes compete for nutrients, lower product yield, and may spoil the final product.',
              schoolMethod: `**Solution:**

- **Sterility** ensures only the **desired microorganism** grows inside the fermenter.
- Without it, **contaminating microbes compete for nutrients**, **lower product yield**, and may **spoil the final product**.

**Answer:** Sterility ensures only the desired microbe grows; contamination lowers yield and spoils product.`,
            }
          },
          {
            id: 'q5', number: '5', isHard: false,
            text: 'Study the diagram of a fermenter. (A) Identify any two parts responsible for maintaining microbial growth. (B) What is the function of the stirrer in a fermenter? (C) Why is oxygen supply important in some fermenters?',
            parts: [
              '(A) Identify any two parts responsible for maintaining microbial growth.',
              '(B) What is the function of the stirrer in a fermenter?',
              '(C) Why is oxygen supply important in some fermenters?',
            ],
            answer: {
              answerKey: '(A) The stirrer (impeller) and the sparger, which distribute nutrients/oxygen and support aeration respectively. (B) The stirrer agitates the broth so every microbial cell receives adequate nutrients and oxygen evenly. (C) Many microbes are aerobic and require oxygen for respiration to grow and form the desired product.',
              schoolMethod: `**Solution:**

(A) **The stirrer (impeller)** and **the sparger** - they distribute nutrients/oxygen and support aeration.

(B) The **stirrer agitates the broth** so every microbial cell receives **adequate nutrients and oxygen evenly**.

(C) Many microbes are **aerobic** and require **oxygen for respiration** to grow and form the desired product.

**Answer:** (A) Stirrer and sparger. (B) Agitates broth for even nutrients/oxygen. (C) Aerobic microbes need oxygen.`,
            }
          },
          {
            id: 'q6', number: '6', isHard: false,
            text: 'Using the given fermenter growth data: (a) During which time period does rapid microbial growth occur? (b) Identify the stationary phase from the data. (c) Suggest one reason why the microbial population decreases after a certain time.',
            parts: [
              '(a) During which time period does rapid microbial growth occur?',
              '(b) Identify the stationary phase from the data.',
              '(c) Suggest one reason why the microbial population decreases after a certain time.',
            ],
            answer: {
              answerKey: '(a) Rapid growth occurs during the middle hours, corresponding to the log (exponential) phase, where numbers rise sharply. (b) The stationary phase occurs when counts level off near their peak value. (c) Accumulation of toxic waste and depletion of nutrients causes the death rate to exceed the growth rate.',
              schoolMethod: `**Solution:**

(a) **Rapid growth** occurs during the **middle hours** - the **log (exponential) phase** - where numbers rise sharply.

(b) The **stationary phase** occurs when counts **level off near their peak value**.

(c) **Accumulation of toxic waste** and **depletion of nutrients** causes the **death rate to exceed the growth rate**.

**Answer:** (a) Middle hours (log phase). (b) When counts level off near the peak. (c) Toxic waste and nutrient depletion.`,
            }
          },
          {
            id: 'q7', number: '7', isHard: false,
            text: 'Microbes are used in food production, medicine and environmental protection. Analyse how biotechnology helps improve human life using any three examples.',
            answer: {
              answerKey: 'Insulin production for diabetic patients using engineered bacteria, Bt cotton providing pest-resistant crops for farmers, and bioremediation using bacteria to clean up oil spills and industrial pollutants.',
              schoolMethod: `**Solution:**

1. **Insulin production** for diabetic patients using engineered bacteria.
2. **Bt cotton** providing pest-resistant crops for farmers.
3. **Bioremediation** using bacteria to clean up oil spills and industrial pollutants.

**Answer:** Insulin, Bt cotton, and bioremediation are three examples.`,
            }
          },
          {
            id: 'q8', number: '8', isHard: false,
            text: 'A scientist wants to produce insulin using bacteria. Explain how modern biotechnology makes this possible. Why has traditional biotechnology not achieved this?',
            answer: {
              answerKey: 'The human insulin gene is cut using restriction enzymes and inserted into a bacterial plasmid using DNA ligase; the transformed bacteria then mass-produce insulin. Traditional biotechnology lacked the gene-transfer technology required for this process.',
              schoolMethod: `**Solution:**

- The **human insulin gene** is **cut using restriction enzymes** and **inserted into a bacterial plasmid using DNA ligase**.
- The **transformed bacteria** then **mass-produce insulin**.
- **Traditional biotechnology** lacked the **gene-transfer technology** required for this process.

**Answer:** Recombinant DNA technology inserts the insulin gene into bacteria; traditional methods lacked gene transfer.`,
            }
          },
          {
            id: 'q9', number: '9', isHard: false,
            text: 'Biotechnology has helped increase food production, but some people have ethical concerns regarding GM crops. Evaluate both advantages and concerns.',
            answer: {
              answerKey: 'Advantages: pest resistance, higher yield, and improved nutrition, as seen in Golden Rice. Concerns: gene flow creating herbicide-resistant \u2018super-weeds\u2019, harm to beneficial insects, and unequal access to seeds due to patent control.',
              schoolMethod: `**Solution:**

**Advantages:**
- **Pest resistance**, **higher yield**, **improved nutrition** - as seen in Golden Rice.

**Concerns:**
- **Gene flow** creating herbicide-resistant 'super-weeds'.
- **Harm to beneficial insects**.
- **Unequal access to seeds** due to patent control.

**Answer:** Advantages - pest resistance, yield, nutrition; Concerns - super-weeds, harm to insects, seed patents.`,
            }
          },
          {
            id: 'q10', number: '10', isHard: false,
            text: 'Design a simple biotechnology product that can help solve an environmental problem in your community. Describe the microorganism/enzyme used, the problem it solves, and how it benefits society.',
            answer: {
              answerKey: 'Using oil-degrading Pseudomonas bacteria for bioremediation of contaminated soil or water; it naturally breaks down pollutants like hydrocarbons, restoring the ecosystem without the use of harsh chemicals.',
              schoolMethod: `**Solution:**

- **Microorganism:** oil-degrading **Pseudomonas bacteria**.
- **Problem it solves:** bioremediation of **contaminated soil or water**.
- **How it benefits society:** it naturally **breaks down pollutants like hydrocarbons**, restoring the ecosystem without harsh chemicals.

**Answer:** Pseudomonas bacteria for bioremediation of contaminated soil/water.`,
            }
          },
          {
            id: 'q11', number: '11', isHard: false,
            text: 'Which of the following is an example of traditional biotechnology? (a) Production of insulin using bacteria (b) Preparation of curd from milk (c) Development of disease-resistant crops (d) Gene transfer between organisms',
            answer: {
              answerKey: '(b) Preparation of curd from milk.',
              schoolMethod: `**Solution:**

**Preparation of curd from milk** is a natural microbial process - an example of **traditional biotechnology**.

**Answer:** (b) Preparation of curd from milk.`,
            }
          },
          {
            id: 'q12', number: '12', isHard: false,
            text: 'Which microorganism is commonly used in bread making? (a) Bacteria (b) Virus (c) Yeast (d) Algae',
            answer: {
              answerKey: '(c) Yeast.',
              schoolMethod: `**Solution:**

**Yeast** is commonly used in bread making (fermentation).

**Answer:** (c) Yeast.`,
            }
          },
          {
            id: 'q13', number: '13', isHard: false,
            text: 'Which of the following conditions is necessary for proper functioning of a fermenter? (a) Contamination (b) Controlled temperature (c) Open environment (d) Absence of nutrients',
            answer: {
              answerKey: '(b) Controlled temperature.',
              schoolMethod: `**Solution:**

A fermenter requires **controlled temperature** for proper functioning.

**Answer:** (b) Controlled temperature.`,
            }
          },
          {
            id: 'q14', number: '14', isHard: false,
            text: 'Genetic engineering mainly involves: (a) Mixing different foods (b) Transfer of genes between organisms (c) Increasing natural microbial growth (d) Removing microorganisms from food',
            answer: {
              answerKey: '(b) Transfer of genes between organisms.',
              schoolMethod: `**Solution:**

**Genetic engineering** mainly involves the **transfer of genes between organisms**.

**Answer:** (b) Transfer of genes between organisms.`,
            }
          },
          {
            id: 'q15', number: '15', isHard: false,
            text: 'During which phase do microorganisms show maximum growth? (a) Lag phase (b) Log phase (c) Stationary phase (d) Death phase',
            answer: {
              answerKey: '(b) Log phase.',
              schoolMethod: `**Solution:**

Microorganisms show **maximum growth** during the **log (exponential) phase**.

**Answer:** (b) Log phase.`,
            }
          },
          {
            id: 'q16', number: '16', isHard: false,
            text: 'Assertion: Sterility must be maintained inside a fermenter. Reason: Contamination by unwanted microorganisms can reduce product quality.',
            answer: {
              answerKey: '(a) Both assertion and reason are true, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** Sterility must be maintained inside a fermenter - true.
- **Reason:** Contamination can reduce product quality - true.
- The reason **correctly explains** the assertion.

**Answer:** (a) Both assertion and reason are true, and the reason explains the assertion.`,
            }
          },
          {
            id: 'q17', number: '17', isHard: false,
            text: 'Assertion: Modern biotechnology allows production of insulin using bacteria. Reason: Modern biotechnology involves genetic modification techniques.',
            answer: {
              answerKey: '(a) Both assertion and reason are true, and the reason correctly explains the assertion.',
              schoolMethod: `**Solution:**

- **Assertion:** Modern biotechnology allows insulin production using bacteria - true.
- **Reason:** Modern biotechnology involves genetic modification techniques - true.
- The reason **correctly explains** the assertion.

**Answer:** (a) Both assertion and reason are true, and the reason explains the assertion.`,
            }
          },
        ]
      },
    ]
  },
];

export const ADVSCIENCE_BOOK_CONTEXT = `
ADVANCED SCIENCE (Science Advanced full book), Grade 9 — CBSE 2026-27:
Ch1: Measurement — The Foundation of Science — CGS, FPS and SI systems, why SI is preferred, unit conversion (N → g·cm/s², kg/L → kg/m³), Magnitude = Numerical value × Unit, why a common system of units is necessary
Ch2: Understanding Motion through Experience — rest and motion, relative motion and frame of reference, scalar vs vector, distance vs displacement, vector addition (triangle method) and subtraction, distance in the nth second s(n) = u + (a/2)(2n − 1)
Ch3: Newton's Laws of Motion — laws valid in inertial frames, pseudo force F(pseudo) = −m·a(frame), gravitation, g at surface/centre, g(h) = gR²/(R+h)², g(d) = g(1 − d/R), turning forces/torque = F·d·sinθ
Ch4: The Geometry of Power — Advanced Simple Machines — mechanical advantage, wheel and axle (larger wheel gives more MA), gear train ratios, tension in pulley systems (Atwood machine: a = (m₂−m₁)g/(m₁+m₂), T = m₁(g+a))
Ch5: Work and Energy — conservative vs non-conservative forces (gravity vs friction), PE = mgh, KE, energy stored in a stretched wire (½Fx), work to raise centre of mass
Ch6: Structure of Atom — cathode rays (electrons), canal rays (positive ions), neutron discovery (Chadwick), Thomson, Rutherford's nucleus model and its drawbacks, Bohr's model and postulates, quantised energy levels, line vs continuous spectrum, Rydberg equation
Ch7: Chemical Bonding — octet rule, duplet rule (hydrogen), exceptions BF3 (incomplete octet), SF6 (expanded octet), NO (odd electron), Lewis structures, metallic bonding and the electron sea model
Ch8: Mixtures and Separation of Mixtures — chromatography (stationary/mobile phase), Mikhail Tswett 1906, column chromatography (adsorbents, eluent), simple vs fractional distillation, fractionating column (boiling point difference < 25 °C)
Ch9: Microscope and Microscopy — compound microscope, magnification = objective × eyepiece, resolution vs magnification, actual size = image size/magnification, temporary vs permanent slides, light vs electron microscope, TEM vs SEM
Ch10: Engineering Life — Miracles in Biotechnology — definition, traditional (curd, bread fermentation) vs modern (genetic engineering) biotechnology, fermenters and sterility, microbial growth curve (lag, log, stationary, death), insulin production, GM crops (Bt cotton, Golden Rice), bioremediation (Pseudomonas), ethical concerns
`;
