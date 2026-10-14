import { boolean, integer, jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'teacher', 'admin']);
export const exerciseTypeEnum = pgEnum('exercise_type', ['classify', 'match', 'order', 'choice', 'feedback']);
export const levelEnum = pgEnum('level', ['easy', 'medium', 'hard']);
export const diagStageEnum = pgEnum('diag_stage', ['pre', 'post']);

/* ---------------- Foydalanuvchilar va guruhlar ---------------- */
export const groups = pgTable('groups', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    teacherId: integer('teacher_id').references((): any => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    role: roleEnum('role').default('student').notNull(),
    groupId: integer('group_id').references(() => groups.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true })
});

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(), // token’ning sha256 xeshi
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
}, t => [index('sessions_user_idx').on(t.userId)]);

export const passwordResets = pgTable('password_resets', {
    id: text('id').primaryKey(), // token xeshi
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

/* ---------------- Kontent ---------------- */
export const lessons = pgTable('lessons', {
    id: serial('id').primaryKey(),
    position: integer('position').default(0).notNull(),
    chapter: text('chapter').default('I bob').notNull(),
    title: text('title').notNull(),
    summary: text('summary').default('').notNull(),
    icon: text('icon').default('fa-book-open').notNull(),
    duration: integer('duration').default(20).notNull(),
    goals: jsonb('goals').$type<string[]>().default([]).notNull(),
    content: text('content').default('').notNull(), // Markdown
    terms: jsonb('terms').$type<string[]>().default([]).notNull(),
    reviewQuestions: jsonb('review_questions').$type<string[]>().default([]).notNull(),
    videoUrl: text('video_url'),
    pdfUrl: text('pdf_url'),
    published: boolean('published').default(true).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
    position: integer('position').default(0).notNull(),
    text: text('text').notNull(),
    options: jsonb('options').$type<string[]>().notNull(),
    correct: integer('correct').notNull(),
    explanation: text('explanation').default('').notNull()
}, t => [index('questions_lesson_idx').on(t.lessonId)]);

export type ClassifyData = { categories: string[]; items: { t: string; c: number }[] };
export type MatchData = { pairs: { l: string; r: string }[] };
export type OrderData = { items: string[] };
export type ChoiceData = { cases: { t: string; o: string[]; a: number; e: string }[] };
export type FeedbackData = { work: string; rubric: string[]; checklist: string[]; praise: string[]; next: string[]; model: string };
export type ExerciseData = ClassifyData | MatchData | OrderData | ChoiceData | FeedbackData;

export const exercises = pgTable('exercises', {
    id: serial('id').primaryKey(),
    position: integer('position').default(0).notNull(),
    lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'set null' }),
    type: exerciseTypeEnum('type').notNull(),
    title: text('title').notNull(),
    summary: text('summary').default('').notNull(),
    task: text('task').default('').notNull(),
    icon: text('icon').default('fa-puzzle-piece').notNull(),
    level: levelEnum('level').default('medium').notNull(),
    duration: integer('duration').default(10).notNull(),
    data: jsonb('data').$type<ExerciseData>().notNull(),
    published: boolean('published').default(true).notNull()
});

export type SimCriterion = { n: string; d: [string, string, string] };
export type SimStudent = { name: string; color: string; work: string; expert: number[]; fb: string };

export const simulators = pgTable('simulators', {
    id: serial('id').primaryKey(),
    position: integer('position').default(0).notNull(),
    subject: text('subject').notNull(),
    grade: text('grade').notNull(),
    icon: text('icon').default('fa-children').notNull(),
    level: levelEnum('level').default('medium').notNull(),
    title: text('title').notNull(),
    summary: text('summary').default('').notNull(),
    task: text('task').notNull(),
    criteria: jsonb('criteria').$type<SimCriterion[]>().notNull(),
    students: jsonb('students').$type<SimStudent[]>().notNull(),
    published: boolean('published').default(true).notNull()
});

export const tools = pgTable('tools', {
    id: serial('id').primaryKey(),
    position: integer('position').default(0).notNull(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    icon: text('icon').default('fa-laptop').notNull(),
    url: text('url').notNull(),
    use: text('use').notNull(),
    tip: text('tip').default('').notNull(),
    kinds: jsonb('kinds').$type<string[]>().default([]).notNull()
});

export const glossary = pgTable('glossary', {
    id: serial('id').primaryKey(),
    term: text('term').notNull().unique(),
    definition: text('definition').notNull()
});

/* ---------------- Natijalar ---------------- */
export const lessonCompletions = pgTable('lesson_completions', {
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull()
}, t => [primaryKey({ columns: [t.userId, t.lessonId] })]);

// testKey: 'lesson:<id>' yoki 'final'
export const testAttempts = pgTable('test_attempts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    testKey: text('test_key').notNull(),
    score: integer('score').notNull(),
    correct: integer('correct').notNull(),
    total: integer('total').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('test_attempts_user_idx').on(t.userId, t.testKey)]);

export const exerciseAttempts = pgTable('exercise_attempts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('exercise_attempts_user_idx').on(t.userId)]);

export const simulatorAttempts = pgTable('simulator_attempts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    simulatorId: integer('simulator_id').notNull().references(() => simulators.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [index('simulator_attempts_user_idx').on(t.userId)]);

export type DiagResult = Record<'mot' | 'cog' | 'met' | 'ref' | 'total', number>;
export const diagnostics = pgTable('diagnostics', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    stage: diagStageEnum('stage').notNull(),
    values: jsonb('values').$type<number[]>().notNull(),
    result: jsonb('result').$type<DiagResult>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, t => [uniqueIndex('diagnostics_user_stage_idx').on(t.userId, t.stage)]);

export const certificates = pgTable('certificates', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    number: text('number').notNull().unique(),
    fullName: text('full_name').notNull(),
    finalScore: integer('final_score').notNull(),
    overall: integer('overall').notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull()
});

export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Simulator = typeof simulators.$inferSelect;
export type Tool = typeof tools.$inferSelect;
