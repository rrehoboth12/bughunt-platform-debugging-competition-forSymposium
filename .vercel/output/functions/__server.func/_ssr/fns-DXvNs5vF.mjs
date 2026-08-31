import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as boolean, c as literal, d as string, f as union, i as array, l as number$1, n as _enum, o as email, r as _null, s as lazy, t as number, u as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-DXvNs5vF.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var detailsSchema = object({
	fullName: string().min(2).max(120),
	department: string().min(1).max(80),
	year: string().min(1).max(40),
	email: email().max(160),
	phone: string().min(7).max(20),
	college: string().min(2).max(160)
});
var registerSchema = object({
	fullName: string().max(120).optional().default(""),
	department: string().max(80).optional().default(""),
	year: string().max(40).optional().default(""),
	email: string().max(160).optional().default(""),
	phone: string().max(20).optional().default(""),
	college: string().max(160).optional().default(""),
	participationCode: string().min(4).max(40)
});
var ruleSchema = lazy(() => union([
	object({
		type: literal("contains"),
		value: string(),
		caseSensitive: boolean().optional()
	}),
	object({
		type: literal("not_contains"),
		value: string(),
		caseSensitive: boolean().optional()
	}),
	object({
		type: literal("regex"),
		pattern: string(),
		flags: string().optional()
	}),
	object({
		type: literal("all"),
		rules: array(ruleSchema)
	}),
	object({
		type: literal("any"),
		rules: array(ruleSchema)
	})
]));
var saveQuestionSchema = object({
	id: string().optional(),
	title: string().min(2).max(160),
	language: _enum(["python", "c"]),
	description: string().min(8).max(8e3),
	buggyCode: string().min(1).max(4e4),
	correctCode: string().max(4e4),
	selectedSlot: union([number().int().min(1).max(6), _null()]),
	isActive: boolean(),
	errors: array(object({
		id: string().optional(),
		errorType: _enum(["syntax", "logic"]),
		description: string().min(1).max(800),
		location: string().max(200),
		expectedCorrection: string().max(2e3),
		marks: number().int().min(0).max(50),
		validationRuleJson: string().max(12e3),
		isActive: boolean()
	})),
	testCases: array(object({
		id: string().optional(),
		visibility: _enum(["visible", "hidden"]),
		stdin: string().max(8e3),
		expectedStdout: string().max(8e3)
	}))
});
var getMe_createServerFn_handler = createServerRpc({
	id: "64bece6ca28edfec93dfdd729e47c3e87e1294e923ebc5928c5f53b880390019",
	name: "getMe",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).handler(getMe_createServerFn_handler, async () => {
	const { getMeOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getMeOp();
});
var getCompetition_createServerFn_handler = createServerRpc({
	id: "c70348c54f55b4f7bdda66dedf4af7bd2cf1be75734370033e1d76845e6530b8",
	name: "getCompetition",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getCompetition.__executeServer(opts));
var getCompetition = createServerFn({ method: "GET" }).handler(getCompetition_createServerFn_handler, async () => {
	const { getCompetitionPublicOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getCompetitionPublicOp();
});
var registerParticipant_createServerFn_handler = createServerRpc({
	id: "262d9323f07779dedd6fe2d40bdecc9bd2d7e19509a3e6342b21fc48778fdfe7",
	name: "registerParticipant",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => registerParticipant.__executeServer(opts));
var registerParticipant = createServerFn({ method: "POST" }).validator((data) => registerSchema.parse(data)).handler(registerParticipant_createServerFn_handler, async ({ data }) => {
	const { registerOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return registerOp(data);
});
var updateDetails_createServerFn_handler = createServerRpc({
	id: "033d2f5b534ec99926ba5fae390f87b9f4aabb3c8dad035ccba4b4c476f6687e",
	name: "updateDetails",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => updateDetails.__executeServer(opts));
var updateDetails = createServerFn({ method: "POST" }).validator((data) => detailsSchema.parse(data)).handler(updateDetails_createServerFn_handler, async ({ data }) => {
	const { updateDetailsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return updateDetailsOp(data);
});
var confirmDetails_createServerFn_handler = createServerRpc({
	id: "1cdda48965eaac31dcf3ad6396c892335d6a5211bb667ba872bc7dc9d6bb8aaf",
	name: "confirmDetails",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => confirmDetails.__executeServer(opts));
var confirmDetails = createServerFn({ method: "POST" }).handler(confirmDetails_createServerFn_handler, async () => {
	const { confirmDetailsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return confirmDetailsOp();
});
var coordinatorLogin_createServerFn_handler = createServerRpc({
	id: "8fe6daad53d0277bf2d89d5abf8c5a62b8e60b22a20430cbdf36244244287860",
	name: "coordinatorLogin",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => coordinatorLogin.__executeServer(opts));
var coordinatorLogin = createServerFn({ method: "POST" }).validator((data) => object({ code: string().min(4).max(40) }).parse(data)).handler(coordinatorLogin_createServerFn_handler, async ({ data }) => {
	const { coordinatorLoginOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await coordinatorLoginOp(data.code);
	return { ok: true };
});
var logoutSession_createServerFn_handler = createServerRpc({
	id: "8ea014604148cda8da15a088d23cf740cd06060a585efe5359b202ce50a50f72",
	name: "logoutSession",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => logoutSession.__executeServer(opts));
var logoutSession = createServerFn({ method: "POST" }).handler(logoutSession_createServerFn_handler, async () => {
	const { logoutOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await logoutOp();
	return { ok: true };
});
var startExam_createServerFn_handler = createServerRpc({
	id: "4ac0ae60aeb00694c11d15bc9f6ba0eae1f184ede6abad199bb178e1080bfd86",
	name: "startExam",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => startExam.__executeServer(opts));
var startExam = createServerFn({ method: "POST" }).handler(startExam_createServerFn_handler, async () => {
	const { startExamOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return startExamOp();
});
var getExamState_createServerFn_handler = createServerRpc({
	id: "4f818c967d406256f45bd969619d311250463ece0f55e9cff58b0b681dab45d9",
	name: "getExamState",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getExamState.__executeServer(opts));
var getExamState = createServerFn({ method: "GET" }).handler(getExamState_createServerFn_handler, async () => {
	const { getExamStateOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getExamStateOp();
});
var saveCode_createServerFn_handler = createServerRpc({
	id: "2fa66bf274d083e72d9dbc2d85f6ae57ad9f53f9de9212e49eee51837168fa2a",
	name: "saveCode",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => saveCode.__executeServer(opts));
var saveCode = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(saveCode_createServerFn_handler, async ({ data }) => {
	const { saveCodeOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await saveCodeOp(data.questionId, data.code);
	return { ok: true };
});
var setCurrentQuestion_createServerFn_handler = createServerRpc({
	id: "8571ca63ed794d3c8555b0aaa6f6875fcd8e62d1841030178c0f554df43a3218",
	name: "setCurrentQuestion",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => setCurrentQuestion.__executeServer(opts));
var setCurrentQuestion = createServerFn({ method: "POST" }).validator((data) => object({ slot: number$1().int().min(1).max(6) }).parse(data)).handler(setCurrentQuestion_createServerFn_handler, async ({ data }) => {
	const { setCurrentQuestionOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await setCurrentQuestionOp(data.slot);
	return { ok: true };
});
var runCode_createServerFn_handler = createServerRpc({
	id: "ba99aa1aaddc6a948d0a3a9f25dfdc5b85c7e72d98a2fb4b5f3c7acd66b68977",
	name: "runCode",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => runCode.__executeServer(opts));
var runCode = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(runCode_createServerFn_handler, async ({ data }) => {
	const { runCodeOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return runCodeOp(data.questionId, data.code);
});
var submitAnswer_createServerFn_handler = createServerRpc({
	id: "a9f20120d658593041e17e0723674d9b29a9cbb37e4fb65dbb3a64b9eca2f457",
	name: "submitAnswer",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => submitAnswer.__executeServer(opts));
var submitAnswer = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(submitAnswer_createServerFn_handler, async ({ data }) => {
	const { submitAnswerOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return submitAnswerOp(data.questionId, data.code);
});
var finishExam_createServerFn_handler = createServerRpc({
	id: "d484b43d1077c0e273982d3aff4f198efb77cbf2619fe75315c73aec44831cbd",
	name: "finishExam",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => finishExam.__executeServer(opts));
var finishExam = createServerFn({ method: "POST" }).handler(finishExam_createServerFn_handler, async () => {
	const { finishExamOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return finishExamOp();
});
var logMalpractice_createServerFn_handler = createServerRpc({
	id: "420a2250fca9c320b53ef1860c2e3f05574bdf6f1324a5a6e97ed13894b225d4",
	name: "logMalpractice",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => logMalpractice.__executeServer(opts));
var logMalpractice = createServerFn({ method: "POST" }).validator((data) => object({
	violationType: string().min(1).max(80),
	questionSlot: number$1().int().min(1).max(6).nullable()
}).parse(data)).handler(logMalpractice_createServerFn_handler, async ({ data }) => {
	const { logMalpracticeOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return logMalpracticeOp(data);
});
var getResult_createServerFn_handler = createServerRpc({
	id: "a488f6b5a038a6987b5203d0f7cc7609d5bbc1c419c2949f30ee36edcf25de4b",
	name: "getResult",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getResult.__executeServer(opts));
var getResult = createServerFn({ method: "GET" }).handler(getResult_createServerFn_handler, async () => {
	const { getResultOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getResultOp();
});
var listCoordinatorParticipants_createServerFn_handler = createServerRpc({
	id: "d8adb7319dd57c770d98736e3189eea95433b328a02d29f3e85ce26cf6696c12",
	name: "listCoordinatorParticipants",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => listCoordinatorParticipants.__executeServer(opts));
var listCoordinatorParticipants = createServerFn({ method: "GET" }).handler(listCoordinatorParticipants_createServerFn_handler, async () => {
	const { listCoordinatorParticipantsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return listCoordinatorParticipantsOp();
});
var listQuestions_createServerFn_handler = createServerRpc({
	id: "1abce7b7ce06444c679c2ffa7deef97bda54b229ed87c07ec2b56e26b9390b90",
	name: "listQuestions",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => listQuestions.__executeServer(opts));
var listQuestions = createServerFn({ method: "GET" }).handler(listQuestions_createServerFn_handler, async () => {
	const { listQuestionsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return listQuestionsOp();
});
var restoreSeedQuestions_createServerFn_handler = createServerRpc({
	id: "3e9d24649de060e0ec07f191d81ab6d99851518b652cbe75b2660d73d3addb51",
	name: "restoreSeedQuestions",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => restoreSeedQuestions.__executeServer(opts));
var restoreSeedQuestions = createServerFn({ method: "POST" }).handler(restoreSeedQuestions_createServerFn_handler, async () => {
	const { restoreSeedQuestionsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return restoreSeedQuestionsOp();
});
var getQuestion_createServerFn_handler = createServerRpc({
	id: "823a5b2351199211f8e36ee63a450cb1062aab9e3aca01d68497516c0e9ceabf",
	name: "getQuestion",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getQuestion.__executeServer(opts));
var getQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(getQuestion_createServerFn_handler, async ({ data }) => {
	const { getQuestionOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getQuestionOp(data.id);
});
var saveQuestion_createServerFn_handler = createServerRpc({
	id: "d56c2477d3f63e9d336661789ea483e6ba93f0aa15aff6f6463b759a9a81453a",
	name: "saveQuestion",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => saveQuestion.__executeServer(opts));
var saveQuestion = createServerFn({ method: "POST" }).validator((data) => saveQuestionSchema.parse(data)).handler(saveQuestion_createServerFn_handler, async ({ data }) => {
	const { saveQuestionOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return saveQuestionOp({
		...data,
		language: data.language
	});
});
var validateAnswerKey_createServerFn_handler = createServerRpc({
	id: "a7fb07d604030ff22c02b8fbcb76490c3f7a4d5b1116db2343fa19b37ef913ff",
	name: "validateAnswerKey",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => validateAnswerKey.__executeServer(opts));
var validateAnswerKey = createServerFn({ method: "POST" }).validator((data) => saveQuestionSchema.parse(data)).handler(validateAnswerKey_createServerFn_handler, async ({ data }) => {
	const { validateAnswerKeyOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return validateAnswerKeyOp({
		...data,
		language: data.language
	});
});
var deleteQuestion_createServerFn_handler = createServerRpc({
	id: "99fc0c6994c632e9dd0cfacb706bc873e7ca7d3883b49378b767a4773de709a4",
	name: "deleteQuestion",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => deleteQuestion.__executeServer(opts));
var deleteQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(deleteQuestion_createServerFn_handler, async ({ data }) => {
	const { deleteQuestionOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await deleteQuestionOp(data.id);
	return { ok: true };
});
var duplicateQuestion_createServerFn_handler = createServerRpc({
	id: "cd1e15ad72510b29ce8759e0da0b50ce06978e058977a90f0dd755619ac9c8dc",
	name: "duplicateQuestion",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => duplicateQuestion.__executeServer(opts));
var duplicateQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(duplicateQuestion_createServerFn_handler, async ({ data }) => {
	const { duplicateQuestionOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return duplicateQuestionOp(data.id);
});
var reorderQuestions_createServerFn_handler = createServerRpc({
	id: "359103cfba9efcd58fc1611d6047e8a2a65fbbbbcd8e25b67a972efd97636c9f",
	name: "reorderQuestions",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => reorderQuestions.__executeServer(opts));
var reorderQuestions = createServerFn({ method: "POST" }).validator((data) => object({ ids: array(string()) }).parse(data)).handler(reorderQuestions_createServerFn_handler, async ({ data }) => {
	const { reorderQuestionsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await reorderQuestionsOp(data.ids);
	return { ok: true };
});
var setQuestionSlot_createServerFn_handler = createServerRpc({
	id: "5a927e9cacee14ec7d172409b5d38faf06c1262280e6492468d43718e8173362",
	name: "setQuestionSlot",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => setQuestionSlot.__executeServer(opts));
var setQuestionSlot = createServerFn({ method: "POST" }).validator((data) => object({
	id: string(),
	slot: number$1().int().min(1).max(6).nullable()
}).parse(data)).handler(setQuestionSlot_createServerFn_handler, async ({ data }) => {
	const { setQuestionSlotOp } = await import("./ops.server-DDA9Kmgm.mjs");
	await setQuestionSlotOp(data.id, data.slot);
	return { ok: true };
});
var updateSettings_createServerFn_handler = createServerRpc({
	id: "2a1b668cabfba0004bdef3676d2ef23af01f924653abff4d04fa4a928b84c5c9",
	name: "updateSettings",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => updateSettings.__executeServer(opts));
var updateSettings = createServerFn({ method: "POST" }).validator((data) => object({
	timerMinutes: number$1().int().min(1).max(180),
	malpracticePolicy: _enum([
		"log_only",
		"terminate_after",
		"immediate"
	]),
	malpracticeLimit: number$1().int().min(1).max(20),
	status: _enum([
		"setup",
		"open",
		"closed"
	]),
	questionsLocked: boolean()
}).parse(data)).handler(updateSettings_createServerFn_handler, async ({ data }) => {
	const { updateSettingsOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return updateSettingsOp({
		...data,
		malpracticePolicy: data.malpracticePolicy,
		status: data.status
	});
});
var getParticipantReview_createServerFn_handler = createServerRpc({
	id: "0a6dc973e89fcca12c12aa6fe183c7b96827c1eeaa5c521f738a27c84efcc5f5",
	name: "getParticipantReview",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => getParticipantReview.__executeServer(opts));
var getParticipantReview = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(getParticipantReview_createServerFn_handler, async ({ data }) => {
	const { getParticipantReviewOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return getParticipantReviewOp(data.id);
});
var exportCsv_createServerFn_handler = createServerRpc({
	id: "cee98828fd8a4e74876cd2028ed836b248ae3a74cd7e6b89ee0b01d9a999ad70",
	name: "exportCsv",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => exportCsv.__executeServer(opts));
var exportCsv = createServerFn({ method: "GET" }).handler(exportCsv_createServerFn_handler, async () => {
	const { exportCsvOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return exportCsvOp();
});
var exportDetailed_createServerFn_handler = createServerRpc({
	id: "ed1199947d05d808b2918b5c37c94706729cdf08380055de98bce3468220f19a",
	name: "exportDetailed",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => exportDetailed.__executeServer(opts));
var exportDetailed = createServerFn({ method: "GET" }).handler(exportDetailed_createServerFn_handler, async () => {
	const { exportDetailedOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return exportDetailedOp();
});
var exportJson_createServerFn_handler = createServerRpc({
	id: "0f0e2e638614ed8479d5757f8c879710ce45301a0ae5de21dd1c8d78e7ae040b",
	name: "exportJson",
	filename: "src/lib/bughunt/fns.ts"
}, (opts) => exportJson.__executeServer(opts));
var exportJson = createServerFn({ method: "GET" }).handler(exportJson_createServerFn_handler, async () => {
	const { exportJsonOp } = await import("./ops.server-DDA9Kmgm.mjs");
	return exportJsonOp();
});
//#endregion
export { confirmDetails_createServerFn_handler, coordinatorLogin_createServerFn_handler, deleteQuestion_createServerFn_handler, duplicateQuestion_createServerFn_handler, exportCsv_createServerFn_handler, exportDetailed_createServerFn_handler, exportJson_createServerFn_handler, finishExam_createServerFn_handler, getCompetition_createServerFn_handler, getExamState_createServerFn_handler, getMe_createServerFn_handler, getParticipantReview_createServerFn_handler, getQuestion_createServerFn_handler, getResult_createServerFn_handler, listCoordinatorParticipants_createServerFn_handler, listQuestions_createServerFn_handler, logMalpractice_createServerFn_handler, logoutSession_createServerFn_handler, registerParticipant_createServerFn_handler, reorderQuestions_createServerFn_handler, restoreSeedQuestions_createServerFn_handler, runCode_createServerFn_handler, saveCode_createServerFn_handler, saveQuestion_createServerFn_handler, setCurrentQuestion_createServerFn_handler, setQuestionSlot_createServerFn_handler, startExam_createServerFn_handler, submitAnswer_createServerFn_handler, updateDetails_createServerFn_handler, updateSettings_createServerFn_handler, validateAnswerKey_createServerFn_handler };
