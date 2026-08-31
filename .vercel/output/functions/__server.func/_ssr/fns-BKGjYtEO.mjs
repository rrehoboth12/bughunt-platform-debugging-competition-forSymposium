import { a as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as boolean, c as literal, d as string, f as union, i as array, l as number$1, n as _enum, o as email, r as _null, s as lazy, t as number, u as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-BKGjYtEO.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getMe = createServerFn({ method: "GET" }).handler(createSsrRpc("64bece6ca28edfec93dfdd729e47c3e87e1294e923ebc5928c5f53b880390019"));
var getCompetition = createServerFn({ method: "GET" }).handler(createSsrRpc("c70348c54f55b4f7bdda66dedf4af7bd2cf1be75734370033e1d76845e6530b8"));
var registerParticipant = createServerFn({ method: "POST" }).validator((data) => registerSchema.parse(data)).handler(createSsrRpc("262d9323f07779dedd6fe2d40bdecc9bd2d7e19509a3e6342b21fc48778fdfe7"));
var updateDetails = createServerFn({ method: "POST" }).validator((data) => detailsSchema.parse(data)).handler(createSsrRpc("033d2f5b534ec99926ba5fae390f87b9f4aabb3c8dad035ccba4b4c476f6687e"));
var confirmDetails = createServerFn({ method: "POST" }).handler(createSsrRpc("1cdda48965eaac31dcf3ad6396c892335d6a5211bb667ba872bc7dc9d6bb8aaf"));
var coordinatorLogin = createServerFn({ method: "POST" }).validator((data) => object({ code: string().min(4).max(40) }).parse(data)).handler(createSsrRpc("8fe6daad53d0277bf2d89d5abf8c5a62b8e60b22a20430cbdf36244244287860"));
var logoutSession = createServerFn({ method: "POST" }).handler(createSsrRpc("8ea014604148cda8da15a088d23cf740cd06060a585efe5359b202ce50a50f72"));
var startExam = createServerFn({ method: "POST" }).handler(createSsrRpc("4ac0ae60aeb00694c11d15bc9f6ba0eae1f184ede6abad199bb178e1080bfd86"));
var getExamState = createServerFn({ method: "GET" }).handler(createSsrRpc("4f818c967d406256f45bd969619d311250463ece0f55e9cff58b0b681dab45d9"));
var saveCode = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(createSsrRpc("2fa66bf274d083e72d9dbc2d85f6ae57ad9f53f9de9212e49eee51837168fa2a"));
var setCurrentQuestion = createServerFn({ method: "POST" }).validator((data) => object({ slot: number$1().int().min(1).max(6) }).parse(data)).handler(createSsrRpc("8571ca63ed794d3c8555b0aaa6f6875fcd8e62d1841030178c0f554df43a3218"));
var runCode = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(createSsrRpc("ba99aa1aaddc6a948d0a3a9f25dfdc5b85c7e72d98a2fb4b5f3c7acd66b68977"));
var submitAnswer = createServerFn({ method: "POST" }).validator((data) => object({
	questionId: string(),
	code: string().max(2e4)
}).parse(data)).handler(createSsrRpc("a9f20120d658593041e17e0723674d9b29a9cbb37e4fb65dbb3a64b9eca2f457"));
var finishExam = createServerFn({ method: "POST" }).handler(createSsrRpc("d484b43d1077c0e273982d3aff4f198efb77cbf2619fe75315c73aec44831cbd"));
var logMalpractice = createServerFn({ method: "POST" }).validator((data) => object({
	violationType: string().min(1).max(80),
	questionSlot: number$1().int().min(1).max(6).nullable()
}).parse(data)).handler(createSsrRpc("420a2250fca9c320b53ef1860c2e3f05574bdf6f1324a5a6e97ed13894b225d4"));
var getResult = createServerFn({ method: "GET" }).handler(createSsrRpc("a488f6b5a038a6987b5203d0f7cc7609d5bbc1c419c2949f30ee36edcf25de4b"));
var listCoordinatorParticipants = createServerFn({ method: "GET" }).handler(createSsrRpc("d8adb7319dd57c770d98736e3189eea95433b328a02d29f3e85ce26cf6696c12"));
var listQuestions = createServerFn({ method: "GET" }).handler(createSsrRpc("1abce7b7ce06444c679c2ffa7deef97bda54b229ed87c07ec2b56e26b9390b90"));
var restoreSeedQuestions = createServerFn({ method: "POST" }).handler(createSsrRpc("3e9d24649de060e0ec07f191d81ab6d99851518b652cbe75b2660d73d3addb51"));
var getQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(createSsrRpc("823a5b2351199211f8e36ee63a450cb1062aab9e3aca01d68497516c0e9ceabf"));
var saveQuestion = createServerFn({ method: "POST" }).validator((data) => saveQuestionSchema.parse(data)).handler(createSsrRpc("d56c2477d3f63e9d336661789ea483e6ba93f0aa15aff6f6463b759a9a81453a"));
var validateAnswerKey = createServerFn({ method: "POST" }).validator((data) => saveQuestionSchema.parse(data)).handler(createSsrRpc("a7fb07d604030ff22c02b8fbcb76490c3f7a4d5b1116db2343fa19b37ef913ff"));
var deleteQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(createSsrRpc("99fc0c6994c632e9dd0cfacb706bc873e7ca7d3883b49378b767a4773de709a4"));
var duplicateQuestion = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(createSsrRpc("cd1e15ad72510b29ce8759e0da0b50ce06978e058977a90f0dd755619ac9c8dc"));
var reorderQuestions = createServerFn({ method: "POST" }).validator((data) => object({ ids: array(string()) }).parse(data)).handler(createSsrRpc("359103cfba9efcd58fc1611d6047e8a2a65fbbbbcd8e25b67a972efd97636c9f"));
var setQuestionSlot = createServerFn({ method: "POST" }).validator((data) => object({
	id: string(),
	slot: number$1().int().min(1).max(6).nullable()
}).parse(data)).handler(createSsrRpc("5a927e9cacee14ec7d172409b5d38faf06c1262280e6492468d43718e8173362"));
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
}).parse(data)).handler(createSsrRpc("2a1b668cabfba0004bdef3676d2ef23af01f924653abff4d04fa4a928b84c5c9"));
var getParticipantReview = createServerFn({ method: "POST" }).validator((data) => object({ id: string() }).parse(data)).handler(createSsrRpc("0a6dc973e89fcca12c12aa6fe183c7b96827c1eeaa5c521f738a27c84efcc5f5"));
var exportCsv = createServerFn({ method: "GET" }).handler(createSsrRpc("cee98828fd8a4e74876cd2028ed836b248ae3a74cd7e6b89ee0b01d9a999ad70"));
var exportDetailed = createServerFn({ method: "GET" }).handler(createSsrRpc("ed1199947d05d808b2918b5c37c94706729cdf08380055de98bce3468220f19a"));
var exportJson = createServerFn({ method: "GET" }).handler(createSsrRpc("0f0e2e638614ed8479d5757f8c879710ce45301a0ae5de21dd1c8d78e7ae040b"));
//#endregion
export { updateSettings as A, saveCode as C, startExam as D, setQuestionSlot as E, submitAnswer as O, runCode as S, setCurrentQuestion as T, logMalpractice as _, exportCsv as a, reorderQuestions as b, finishExam as c, getMe as d, getParticipantReview as f, listQuestions as g, listCoordinatorParticipants as h, duplicateQuestion as i, validateAnswerKey as j, updateDetails as k, getCompetition as l, getResult as m, coordinatorLogin as n, exportDetailed as o, getQuestion as p, deleteQuestion as r, exportJson as s, confirmDetails as t, getExamState as u, logoutSession as v, saveQuestion as w, restoreSeedQuestions as x, registerParticipant as y };
