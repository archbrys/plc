import bcrypt from 'bcrypt'
import {
  PrismaClient,
  QuestionSetStatus,
  QuestionType,
  Role,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.studentAnswer.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.choice.deleteMany()
  await prisma.question.deleteMany()
  await prisma.questionSet.deleteMany()
  await prisma.user.deleteMany()
  await prisma.chapterPage.deleteMany()
  await prisma.courseChapter.deleteMany()
  await prisma.course.deleteMany()

  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const studentPinOneHash = await bcrypt.hash('1234', 10)
  const studentPinTwoHash = await bcrypt.hash('5678', 10)

  await prisma.user.create({
    data: {
      role: Role.ADMIN,
      username: 'admin',
      fullName: 'System Admin',
      passwordHash: adminPasswordHash,
    },
  })

  const student1 = await prisma.user.create({
    data: {
      role: Role.STUDENT,
      studentId: 'S1001',
      fullName: 'Ava Student',
      passwordHash: studentPinOneHash,
    },
  })

  await prisma.user.create({
    data: {
      role: Role.STUDENT,
      studentId: 'S1002',
      fullName: 'Noah Learner',
      passwordHash: studentPinTwoHash,
    },
  })

  await prisma.questionSet.create({
    data: {
      title: 'PLC Fundamentals',
      description: 'Interactive Digital Learning - Programmable Logic Controller trainer',
      status: QuestionSetStatus.PUBLISHED,
      questions: {
        create: [
          {
            questionText: 'What is the primary purpose of a Programmable Logic Controller (PLC)?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 1,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'To create computer games', isCorrect: false, orderNumber: 1 },
                { choiceText: 'To control and automate industrial processes', isCorrect: true, orderNumber: 2 },
                { choiceText: 'To browse the internet', isCorrect: false, orderNumber: 3 },
                { choiceText: 'To store multimedia files', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which characteristic makes a PLC more suitable for industrial environments than a personal computer?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 2,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Larger screen size', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Faster internet connection', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Resistance to dust, vibration, and electrical noise', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Ability to run office applications', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'During the PLC scan cycle, which process occurs first?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 3,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Personal Learning Computer', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Programmable Logic Controller', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Public Library Catalog', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Power Line Communication', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which PLC component receives signals from sensors and switches?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 4,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'CPU', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Power Supply', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Output Module', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Input Module', isCorrect: true, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'What is the main function of the CPU in a PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 5,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Supply electrical power', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Store wiring diagrams only', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Process data and execute the control program', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Connect external sensors directly', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which component sends signals to motors, relays, and indicator lamps?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 6,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Input Module', isCorrect: false, orderNumber: 1 },
                { choiceText: 'CPU', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Output Module', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Programming Device', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'What is the primary role of the power supply in a PLC system?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 7,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Monitor sensor status', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Convert incoming power to the required operating voltage', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Store data permanently', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Execute ladder programs', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which device is commonly used to create and edit PLC programs?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 8,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Oscilloscope', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Multimeter', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Programming Device (PC or laptop)', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Circuit Breaker', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which of the following is an example of an input device?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 9,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Lamp', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Motor', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Solenoid Valve', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Push Button', isCorrect: true, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which of the following is considered an output device?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 10,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Proximity Sensor', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Limit Switch', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Motor', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Push Button', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'A discrete signal can best be described as:',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 11,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Continuously varying value', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Binary ON/OFF state', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Wireless communication signal', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Analog voltage only', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which signal type is commonly used to represent temperature and pressure measurements?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 12,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Discrete Signal', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Binary Signal', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Analog Signal', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Digital Pulse Only', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Why is Ladder Diagram (LD) widely used in PLC programming?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 13,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'It requires advanced coding skills', isCorrect: false, orderNumber: 1 },
                { choiceText: 'It resembles electrical relay circuits', isCorrect: true, orderNumber: 2 },
                { choiceText: 'It uses only numerical instructions', isCorrect: false, orderNumber: 3 },
                { choiceText: 'It can only control motors', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'In a Ladder Diagram, the horizontal lines between the rails are called:',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 14,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Nodes', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Blocks', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Networks', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Rungs', isCorrect: true, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which programming language represents operations as interconnected blocks?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 15,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Ladder Diagram (LD)', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Statement List (STL)', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Function Block Diagram (FBD)', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Assembly Language', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which feature is an advantage of Function Block Diagrams (FBD)?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 16,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Requires no logic operations', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Simplifies complex control processes', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Uses only text commands', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Eliminates the need for PLC hardware', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which PLC programming language is text-based and suitable for advanced programming?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 17,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Ladder Diagram', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Function Block Diagram', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Statement List', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Sequential Function Chart', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Why is Statement List (STL) generally more difficult for beginners?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 18,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'It requires graphical symbols', isCorrect: false, orderNumber: 1 },
                { choiceText: 'It cannot perform calculations', isCorrect: false, orderNumber: 2 },
                { choiceText: 'It cannot control outputs', isCorrect: false, orderNumber: 3 },
                { choiceText: 'It uses text instructions rather than elements', isCorrect: true, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which software is specifically used to program the Omron CP1E PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 19,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'AutoCAD', isCorrect: false, orderNumber: 1 },
                { choiceText: 'MATLAB', isCorrect: false, orderNumber: 2 },
                { choiceText: 'CX-Programmer', isCorrect: true, orderNumber: 3 },
                { choiceText: 'TIA Portal', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'CX-Programmer is part of which Omron software package?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 20,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'CX-One', isCorrect: true, orderNumber: 1 },
                { choiceText: 'FactoryTalk', isCorrect: false, orderNumber: 2 },
                { choiceText: 'WinCC', isCorrect: false, orderNumber: 3 },
                { choiceText: 'LabVIEW', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'In the Omron CP1E PLC, the first built-in input address is typically:',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 21,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: '100.00', isCorrect: false, orderNumber: 1 },
                { choiceText: '0.00', isCorrect: true, orderNumber: 2 },
                { choiceText: 'D0000', isCorrect: false, orderNumber: 3 },
                { choiceText: 'W0.00', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'In the Omron CP1E PLC, the first built-in output address is typically:',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 22,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: '0.00', isCorrect: false, orderNumber: 1 },
                { choiceText: '10.00', isCorrect: false, orderNumber: 2 },
                { choiceText: '100.00', isCorrect: true, orderNumber: 3 },
                { choiceText: '200.00', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which memory area is primarily used for physical inputs and outputs?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 23,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'W Area', isCorrect: false, orderNumber: 1 },
                { choiceText: 'D Area', isCorrect: false, orderNumber: 2 },
                { choiceText: 'CIO Area', isCorrect: true, orderNumber: 3 },
                { choiceText: 'H Area', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which memory area contains internal relays used for intermediate logic operations?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 24,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'W Area', isCorrect: true, orderNumber: 1 },
                { choiceText: 'CIO Area', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Timer Area', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Auxiliary Area', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which memory area is commonly used to store numerical values such as sensor readings and timer settings?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 25,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'W Area', isCorrect: false, orderNumber: 1 },
                { choiceText: 'D Area', isCorrect: true, orderNumber: 2 },
                { choiceText: 'CIO Area', isCorrect: false, orderNumber: 3 },
                { choiceText: 'TR Area', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which memory area retains its data even when PLC power is turned OFF?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 26,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Temporary Relay (TR)', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Auxiliary Area (A)', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Holding Area (H)', isCorrect: true, orderNumber: 3 },
                { choiceText: 'CIO Area', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'What is the purpose of the Auxiliary Area (A)?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 27,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Store production counts permanently', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Provide read-only system flags and status information', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Control physical outputs directly', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Store analog sensor values only', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which instruction is used to transfer data from one memory area to another in the CP1E PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 28,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'TIM', isCorrect: false, orderNumber: 1 },
                { choiceText: 'CMP', isCorrect: false, orderNumber: 2 },
                { choiceText: 'MOV', isCorrect: true, orderNumber: 3 },
                { choiceText: 'CNT', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which instruction is commonly used to compare values for decision-making in PLC programs?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 29,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'MOV', isCorrect: false, orderNumber: 1 },
                { choiceText: 'CMP', isCorrect: true, orderNumber: 2 },
                { choiceText: 'TIM', isCorrect: false, orderNumber: 3 },
                { choiceText: 'END', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which statement best describes the role of a PLC in motor control applications?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 30,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'It directly generates mechanical power.', isCorrect: false, orderNumber: 1 },
                { choiceText: 'It replaces all motors in industrial systems.', isCorrect: false, orderNumber: 2 },
                { choiceText: 'It receives input signals, processes logic, and controls motor operation through output devices.', isCorrect: true, orderNumber: 3 },
                { choiceText: 'It only monitors motor speed without controlling it.', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
        ],
      },
    },
  })

  await prisma.questionSet.create({
    data: {
      title: 'Chapter 1: Introduction to PLC',
      description: 'Chapter 1 assessment covering PLC history, fundamentals, and key concepts.',
      status: QuestionSetStatus.PUBLISHED,
      questions: {
        create: [
          {
            questionText: 'What does PLC stand for?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 1,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Programmable Logic Computer', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Process Logic Controller', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Programmable Logic Controller', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Process Line Computer', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which of the following is a primary function of a PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 2,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Playing multimedia files', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Controlling industrial machines and processes', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Creating spreadsheets', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Browsing the internet', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Before PLCs were invented, industrial control systems mainly used:',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 3,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Smartphones', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Microprocessors', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Relays and timers', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Cloud computing', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which company initiated the development of the first PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 4,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Siemens', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Allen-Bradley', isCorrect: false, orderNumber: 2 },
                { choiceText: 'General Motors', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Omron', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Who is widely known as the "Father of the PLC"?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 5,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Bill Gates', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Dick Morley', isCorrect: true, orderNumber: 2 },
                { choiceText: 'Steve Jobs', isCorrect: false, orderNumber: 3 },
                { choiceText: 'Alan Turing', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'What was the name of the first PLC?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 6,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'PLC-2', isCorrect: false, orderNumber: 1 },
                { choiceText: 'CP1E', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Modicon 084', isCorrect: true, orderNumber: 3 },
                { choiceText: 'Modbus', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Why was Ladder Logic developed?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 7,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'To increase computer speed', isCorrect: false, orderNumber: 1 },
                { choiceText: 'To imitate electrical relay diagrams', isCorrect: true, orderNumber: 2 },
                { choiceText: 'To replace all programming languages', isCorrect: false, orderNumber: 3 },
                { choiceText: 'To improve internet communication', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which protocol introduced in 1979/1980 allowed PLCs to communicate with other devices?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 8,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Ethernet/IP', isCorrect: false, orderNumber: 1 },
                { choiceText: 'PROFINET', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Modbus', isCorrect: true, orderNumber: 3 },
                { choiceText: 'TCP/IP', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'What is one major advantage of PLCs over relay logic systems?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 9,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Larger size', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Difficult maintenance', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Easier modification', isCorrect: true, orderNumber: 3 },
                { choiceText: 'More wiring required', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'Which programming language is included in IEC 61131-3?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 10,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'Java', isCorrect: false, orderNumber: 1 },
                { choiceText: 'Python', isCorrect: false, orderNumber: 2 },
                { choiceText: 'Ladder Diagram', isCorrect: true, orderNumber: 3 },
                { choiceText: 'C#', isCorrect: false, orderNumber: 4 },
              ],
            },
          },
          {
            questionText: 'A specialized industrial computer used to control machines.',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 11,
            points: 1,
            required: true,
          },
          {
            questionText: 'The engineer known as the "Father of the PLC."',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 12,
            points: 1,
            required: true,
          },
          {
            questionText: 'The first commercially successful PLC developed by Bedford Associates.',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 13,
            points: 1,
            required: true,
          },
          {
            questionText: 'The international standard released in 1993 for PLC programming languages.',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 14,
            points: 1,
            required: true,
          },
          {
            questionText: 'The communication protocol introduced by Modicon for PLC networking.',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 15,
            points: 1,
            required: true,
          },
        ],
      },
    },
  })

  // Create the default course
  await prisma.course.create({
    data: {
      title: 'PLC Course',
      chapters: {
        create: [
          {
            orderNumber: 1,
            title: 'Introduction to PLC',
            pages: {
              create: [
                {
                  type: 'slideshow',
                  orderNumber: 1,
                  config: JSON.stringify({
                    images: ['25.png', '26.png', '27.png', '28.png'],
                    autoAdvanceMs: 3000,
                  }),
                },
                {
                  type: 'narration',
                  orderNumber: 2,
                  config: JSON.stringify({
                    character: 'Aaron',
                    text: 'Do you know what a Programmable Logic Controller looks like?',
                  }),
                },
                {
                  type: 'narration',
                  orderNumber: 3,
                  config: JSON.stringify({
                    character: 'Aaron',
                    text: 'Wow! So this is what a Programmable Logic Controller looks like?! It looks so cool. I wanna know the history.',
                  }),
                },
                {
                  type: 'narration',
                  orderNumber: 4,
                  config: JSON.stringify({
                    character: 'Aaron',
                    text: 'For the chapter 1, we will have to learn about the History of Programmable Logic Controller.',
                  }),
                },
                {
                  type: 'content_section',
                  orderNumber: 5,
                  config: JSON.stringify({
                    sectionNumber: 1,
                    sectionTitle: 'Introduction',
                    chapterTitle: 'Chapter 1: Introduction to PLC and its History',
                    contents: [
                      `Automation plays a vital role in modern industries. Machines and processes are controlled automatically to improve efficiency, accuracy and productivity. One of the most widely used control devices in industrial automation is the Programmable Logic Controller PLC.

- It's like a computer for machines that:
- Receives inputs (buttons, sensors)
- Processes logic (program)
- Sends outputs (motors, lights)

PLC is a computer — but a very specific kind of computer.

PLC is defined by NEMA (National Electrical Manufacturers Association) as a digital electronic device with a programmable memory for storing instructions to implement specific function such as logic, sequencing, timing, counting and arithmetic to control machines and processes.

PLC stands for Programmable Logic Controller, not "programmable logic computer". a PLC is a specialized industrial computer purpose-built to control machines, not a general-purpose computing device like a laptop or server.`,
                      `Unlike a general-purpose computer (PC, laptop, server), a PLC is:

• Designed to operate in harsh industrial environments (dust, vibration, temperature extremes, electrical noise)
• Built around a deterministic scan cycle for predictable real-time behavior
• Equipped with industrial I/O interfaces (24 V DC, 4-20 mA, digital and analog modules)
• Certified for specific safety and regulatory standards
• Expected to run continuously for 10-20 years without human intervention`,
                    ],
                  }),
                },
                {
                  type: 'content_section',
                  orderNumber: 6,
                  config: JSON.stringify({
                    sectionNumber: 2,
                    sectionTitle: 'The Timeline',
                    chapterTitle: 'Chapter 1: Introduction to PLC and its History',
                    sideImage: '/assets/logo-plc.png',
                    contents: [
                      `The Pre-PLC Era: The Age of "Relay Hell" (Before 1968)

• Before PLCs, industrial automation relied entirely on hardwired electromagnetic relays, timers, and counters.

• The Problem: If a factory wanted to change its production line process, electricians had to physically re-wire thousands of relays. A single modification could take days or weeks.

• The Footprint: Relay control rooms were massive, generated intense heat, and troubleshooting a single failed mechanical contact among miles of wire was an absolute nightmare.`,
                      `1968: The Spark of an Idea

The automotive industry, spearheaded by General Motors (GM), was hit hardest by the limitations of relay panels because they completely retooled their assembly lines every year for new car models.

• The Challenge: Bill Stone, an engineer at GM's Hydramatic division, issued a design specification request for a "Standard Machine Controller."

• The Criteria: It needed to be solid-state (no moving parts), easily programmable, survivable in harsh factory environments, and smaller than a massive relay panel.`,
                      `1969: The Birth of the First PLC (The Modicon 084)

A team of brilliant engineers at Bedford Associates, led by Dick Morley (widely considered the "Father of the PLC"), took on GM's challenge.

• The Solution: They built a digital computer designed specifically for industrial environments. They called it the MODICON 084 (MOdular DIgital CONtroller, project #84).

• The Innovation: Morley and his team intentionally avoided using standard computer programming languages of the era. Instead, they designed it to look like Ladder Logic, mimicking the schematic diagrams electricians and maintenance technicians already understood.`,
                      `The 1970s: Microprocessors and Identity

The 1970s transformed the PLC from an experimental tool into an industry standard.

• 1973: Modicon introduces the Modicon 184, which becomes the first massive commercial success in the PLC market.

• The Mid-1970s: The introduction of the microprocessor (like the Intel 8008) allows PLCs to perform complex arithmetic, arithmetic functions, and handle analog signals, moving far beyond simple ON/OFF control.

• 1978: Allen-Bradley (now Rockwell Automation) introduces the PLC-2 and coins the acronym "PLC" (Programmable Logic Controller), which officially replaces the term "Programmable Controller."`,
                      `The 1980s: Communication and the PC Revolution

PLCs stopped operating as isolated digital islands and started talking to each other.

• 1979/1980: Modicon introduces Modbus, an industrial communication protocol that allows PLCs to exchange data with other devices and computers. It quickly becomes an open industry standard.

• The PC Boom: Instead of using bulky, expensive, proprietary handheld programming terminals, engineers begin using personal computers (PCs) running early software to program PLCs.`,
                      `The 1990s: Standardization (IEC 61131-3)

As the market grew, every PLC manufacturer developed their own proprietary software and programming methods. This made cross-platform engineering incredibly difficult.

• 1993: The International Electrotechnical Commission releases IEC 61131-3, the global standard for PLC programming languages. It standardized five distinct languages:

  - Ladder Diagram (LD)
  - Function Block Diagram (FBD)
  - Structured Text (ST)
  - Instruction List (IL)
  - Sequential Function Chart (SFC)`,
                      `The 2000s to Present: PACs, Edge Computing, and Industry 4.0

• The Rise of PACs: The line between PCs and PLCs blurred with the introduction of Programmable Automation Controllers (PACs), which offer the rugged reliability of a PLC but handle massive data processing, motion control, and IT networking.

• Industrial Ethernet: High-speed Ethernet networks like EtherNet/IP, PROFINET, and EtherCAT replace old serial connections, allowing PLCs to seamlessly feed real-time data to SCADA, ERP systems, and cloud storage.

• Today (Industry 4.0): Today's PLCs handle Edge Computing, feature advanced cybersecurity protocols, integrate directly with Artificial Intelligence for predictive maintenance, and can even be programmed using modern IT languages like Python or C++.`,
                    ],
                  }),
                },
                {
                  type: 'content_section',
                  orderNumber: 7,
                  config: JSON.stringify({
                    sectionNumber: 3,
                    sectionTitle: 'Relay Logic vs. PLC',
                    chapterTitle: 'Chapter 1: Introduction to PLC and its History',
                    sideImage: '/assets/logo-plc.png',
                    contents: [
                      `Advantages of Programmable Logic Controller

• Reprogrammable – A PLC can be easily reprogrammed to perform different control tasks without changing the hardware, making it flexible for various applications.

• Faster Troubleshooting – PLCs have built-in diagnostic features that quickly identify faults, reducing downtime and making repairs easier.

• Smaller in Size – A PLC combines multiple control functions into one compact device, saving panel space and simplifying system installation.

• More Reliable – PLCs are designed to operate continuously in harsh industrial environments, providing stable and dependable performance.

• Easy to Modify – Changes to the control process can be made by updating the PLC program instead of rewiring electrical circuits, saving time and effort.

• Can Handle Complex Operations – PLCs can execute advanced control functions such as sequencing, timing, counting, data processing, and communication with other devices efficiently.`,
                    ],
                  }),
                },
                {
                  type: 'narration',
                  orderNumber: 8,
                  config: JSON.stringify({
                    character: 'Aaron',
                    text: 'Chapter 1 is done, before we proceed to the next chapter. I want to know if you really learn from this chapter.',
                  }),
                },
                {
                  type: 'interactive_practice',
                  orderNumber: 9,
                  config: JSON.stringify({}),
                },
                {
                  type: 'quiz',
                  orderNumber: 10,
                  config: JSON.stringify({
                    questionSetTitle: 'Chapter 1: Introduction to PLC',
                  }),
                },
              ],
            },
          },
          {
            orderNumber: 2,
            title: 'PLC Components',
            pages: {
              create: [],
            },
          },
        ],
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
