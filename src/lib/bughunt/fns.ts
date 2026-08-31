import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Language, MalpracticePolicy, CompetitionStatus, ValidationRule } from "./types";

const detailsSchema = z.object({
  fullName: z.string().min(2).max(120),
  department: z.string().min(1).max(80),
  year: z.string().min(1).max(40),
  email: z.email().max(160),
  phone: z.string().min(7).max(20),
  college: z.string().min(2).max(160),
});

const registerSchema = z.object({
  fullName: z.string().max(120).optional().default(""),
  department: z.string().max(80).optional().default(""),
  year: z.string().max(40).optional().default(""),
  email: z.string().max(160).optional().default(""),
  phone: z.string().max(20).optional().default(""),
  college: z.string().max(160).optional().default(""),
  participationCode: z.string().min(4).max(40),
});

const ruleSchema: z.ZodType<ValidationRule> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("contains"),
      value: z.string(),
      caseSensitive: z.boolean().optional(),
    }),
    z.object({
      type: z.literal("not_contains"),
      value: z.string(),
      caseSensitive: z.boolean().optional(),
    }),
    z.object({
      type: z.literal("regex"),
      pattern: z.string(),
      flags: z.string().optional(),
    }),
    z.object({
      type: z.literal("all"),
      rules: z.array(ruleSchema),
    }),
    z.object({
      type: z.literal("any"),
      rules: z.array(ruleSchema),
    }),
  ]),
);

const saveQuestionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(160),
  language: z.enum(["python", "c"]),
  description: z.string().min(8).max(8000),
  buggyCode: z.string().min(1).max(40000),
  correctCode: z.string().max(40000),
  selectedSlot: z.union([z.coerce.number().int().min(1).max(6), z.null()]),
  isActive: z.boolean(),
  errors: z.array(
    z.object({
      id: z.string().optional(),
      errorType: z.enum(["syntax", "logic"]),
      description: z.string().min(1).max(800),
      location: z.string().max(200),
      expectedCorrection: z.string().max(2000),
      marks: z.coerce.number().int().min(0).max(50),
      validationRuleJson: z.string().max(12000),
      isActive: z.boolean(),
    }),
  ),
  testCases: z.array(
    z.object({
      id: z.string().optional(),
      visibility: z.enum(["visible", "hidden"]),
      stdin: z.string().max(8000),
      expectedStdout: z.string().max(8000),
    }),
  ),
});

export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const { getMeOp } = await import("./ops.server");
  return getMeOp();
});

export const getCompetition = createServerFn({ method: "GET" }).handler(async () => {
  const { getCompetitionPublicOp } = await import("./ops.server");
  return getCompetitionPublicOp();
});

export const registerParticipant = createServerFn({ method: "POST" })
  .validator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const { registerOp } = await import("./ops.server");
    return registerOp(data);
  });

export const updateDetails = createServerFn({ method: "POST" })
  .validator((data: unknown) => detailsSchema.parse(data))
  .handler(async ({ data }) => {
    const { updateDetailsOp } = await import("./ops.server");
    return updateDetailsOp(data);
  });

export const confirmDetails = createServerFn({ method: "POST" }).handler(async () => {
  const { confirmDetailsOp } = await import("./ops.server");
  return confirmDetailsOp();
});

export const coordinatorLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ code: z.string().min(4).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const { coordinatorLoginOp } = await import("./ops.server");
    await coordinatorLoginOp(data.code);
    return { ok: true as const };
  });

export const logoutSession = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutOp } = await import("./ops.server");
  await logoutOp();
  return { ok: true as const };
});

export const startExam = createServerFn({ method: "POST" }).handler(async () => {
  const { startExamOp } = await import("./ops.server");
  return startExamOp();
});

export const getExamState = createServerFn({ method: "GET" }).handler(async () => {
  const { getExamStateOp } = await import("./ops.server");
  return getExamStateOp();
});

export const saveCode = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ questionId: z.string(), code: z.string().max(20000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { saveCodeOp } = await import("./ops.server");
    await saveCodeOp(data.questionId, data.code);
    return { ok: true as const };
  });

export const setCurrentQuestion = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ slot: z.number().int().min(1).max(6) }).parse(data))
  .handler(async ({ data }) => {
    const { setCurrentQuestionOp } = await import("./ops.server");
    await setCurrentQuestionOp(data.slot);
    return { ok: true as const };
  });

export const runCode = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ questionId: z.string(), code: z.string().max(20000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { runCodeOp } = await import("./ops.server");
    return runCodeOp(data.questionId, data.code);
  });

export const submitAnswer = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ questionId: z.string(), code: z.string().max(20000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { submitAnswerOp } = await import("./ops.server");
    return submitAnswerOp(data.questionId, data.code);
  });

export const finishExam = createServerFn({ method: "POST" }).handler(async () => {
  const { finishExamOp } = await import("./ops.server");
  return finishExamOp();
});

export const logMalpractice = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        violationType: z.string().min(1).max(80),
        questionSlot: z.number().int().min(1).max(6).nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { logMalpracticeOp } = await import("./ops.server");
    return logMalpracticeOp(data);
  });

export const getResult = createServerFn({ method: "GET" }).handler(async () => {
  const { getResultOp } = await import("./ops.server");
  return getResultOp();
});

export const listCoordinatorParticipants = createServerFn({ method: "GET" }).handler(
  async () => {
    const { listCoordinatorParticipantsOp } = await import("./ops.server");
    return listCoordinatorParticipantsOp();
  },
);

export const listQuestions = createServerFn({ method: "GET" }).handler(async () => {
  const { listQuestionsOp } = await import("./ops.server");
  return listQuestionsOp();
});

export const restoreSeedQuestions = createServerFn({ method: "POST" }).handler(async () => {
  const { restoreSeedQuestionsOp } = await import("./ops.server");
  return restoreSeedQuestionsOp();
});

export const getQuestion = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { getQuestionOp } = await import("./ops.server");
    return getQuestionOp(data.id);
  });

export const saveQuestion = createServerFn({ method: "POST" })
  .validator((data: unknown) => saveQuestionSchema.parse(data))
  .handler(async ({ data }) => {
    const { saveQuestionOp } = await import("./ops.server");
    return saveQuestionOp({
      ...data,
      language: data.language as Language,
    });
  });

export const validateAnswerKey = createServerFn({ method: "POST" })
  .validator((data: unknown) => saveQuestionSchema.parse(data))
  .handler(async ({ data }) => {
    const { validateAnswerKeyOp } = await import("./ops.server");
    return validateAnswerKeyOp({
      ...data,
      language: data.language as Language,
    });
  });

export const deleteQuestion = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { deleteQuestionOp } = await import("./ops.server");
    await deleteQuestionOp(data.id);
    return { ok: true as const };
  });

export const duplicateQuestion = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { duplicateQuestionOp } = await import("./ops.server");
    return duplicateQuestionOp(data.id);
  });

export const reorderQuestions = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ ids: z.array(z.string()) }).parse(data))
  .handler(async ({ data }) => {
    const { reorderQuestionsOp } = await import("./ops.server");
    await reorderQuestionsOp(data.ids);
    return { ok: true as const };
  });

export const setQuestionSlot = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ id: z.string(), slot: z.number().int().min(1).max(6).nullable() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { setQuestionSlotOp } = await import("./ops.server");
    await setQuestionSlotOp(data.id, data.slot);
    return { ok: true as const };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        timerMinutes: z.number().int().min(1).max(180),
        malpracticePolicy: z.enum(["log_only", "terminate_after", "immediate"]),
        malpracticeLimit: z.number().int().min(1).max(20),
        status: z.enum(["setup", "open", "closed"]),
        questionsLocked: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { updateSettingsOp } = await import("./ops.server");
    return updateSettingsOp({
      ...data,
      malpracticePolicy: data.malpracticePolicy as MalpracticePolicy,
      status: data.status as CompetitionStatus,
    });
  });

export const getParticipantReview = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { getParticipantReviewOp } = await import("./ops.server");
    return getParticipantReviewOp(data.id);
  });

export const exportCsv = createServerFn({ method: "GET" }).handler(async () => {
  const { exportCsvOp } = await import("./ops.server");
  return exportCsvOp();
});

export const exportDetailed = createServerFn({ method: "GET" }).handler(async () => {
  const { exportDetailedOp } = await import("./ops.server");
  return exportDetailedOp();
});

export const exportJson = createServerFn({ method: "GET" }).handler(async () => {
  const { exportJsonOp } = await import("./ops.server");
  return exportJsonOp();
});
