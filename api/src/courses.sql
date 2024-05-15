-- Create the table for Course
CREATE TABLE Course (
    id VARCHAR(255) PRIMARY KEY
);

-- Create the table for FlashCard
CREATE TABLE FlashCard (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(255) REFERENCES Course(id),
    question TEXT NOT NULL,
    alternatives TEXT[] NOT NULL,
    correct INT NOT NULL
);

-- Create the table for FlashCardUnreviewed
CREATE TABLE FlashCardUnreviewed (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(255) REFERENCES Course(id),
    question TEXT NOT NULL,
    alternatives TEXT[],
    correct INT
);

-- Create the table for User
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    position INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    time INT NOT NULL
);

-- Create the table for UserSolved
CREATE TABLE UserSolved (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "User"(id),
    course_id VARCHAR(255) REFERENCES Course(id)
);

-- Create the table for UserSolvedFlashcards (to track which flashcards are solved by the user)
CREATE TABLE UserSolvedFlashcards (
    user_solved_id INT REFERENCES UserSolved(id),
    flashcard_id INT REFERENCES FlashCard(id),
    PRIMARY KEY (user_solved_id, flashcard_id)
);
