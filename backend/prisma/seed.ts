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
