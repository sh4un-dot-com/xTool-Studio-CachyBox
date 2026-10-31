import "node:module";
import { contextBridge, ipcRenderer } from "electron";
import process from "node:process";
import { contextBridge as contextBridge$1, ipcRenderer as ipcRenderer$1, webUtils } from "electron/renderer";
import { webcrypto } from "node:crypto";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i$1 = 0, n$1 = keys.length, key; i$1 < n$1; i$1++) {
			key = keys[i$1];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
//#region ../../../../../node_modules/.pnpm/@sentry+electron@6.11.0/node_modules/@sentry/electron/esm/preload/index.js
/** Ways to communicate between the renderer and main process  */
var IPCMode;
(function(IPCMode$1) {
	/** Configures Electron IPC to receive messages from renderers */
	IPCMode$1[IPCMode$1["Classic"] = 1] = "Classic";
	/** Configures Electron protocol module to receive messages from renderers */
	IPCMode$1[IPCMode$1["Protocol"] = 2] = "Protocol";
	/**
	* Configures both methods for best compatibility.
	*
	* Renderers favour IPC but fall back to protocol if IPC has not
	* been configured in a preload script
	*/
	IPCMode$1[IPCMode$1["Both"] = 3] = "Both";
})(IPCMode || (IPCMode = {}));
var IPCChannel;
(function(IPCChannel$1) {
	/** IPC to check main process is listening */
	IPCChannel$1["RENDERER_START"] = "sentry-electron.renderer-start";
	/** IPC to pass scope changes to main process. */
	IPCChannel$1["SCOPE"] = "sentry-electron.scope";
	/** IPC to pass envelopes to the main process. */
	IPCChannel$1["ENVELOPE"] = "sentry-electron.envelope";
	/** IPC to pass renderer status updates */
	IPCChannel$1["STATUS"] = "sentry-electron.status";
	/** IPC to pass structured log messages */
	IPCChannel$1["STRUCTURED_LOG"] = "sentry-electron.structured-log";
})(IPCChannel || (IPCChannel = {}));
/**
* This preload script may be used with sandbox mode enabled which means regular require is not available.
*/
if (window.__SENTRY_IPC__) console.log("Sentry Electron preload has already been run");
else {
	const ipcObject = {
		sendRendererStart: () => ipcRenderer.send(IPCChannel.RENDERER_START),
		sendScope: (scopeJson) => ipcRenderer.send(IPCChannel.SCOPE, scopeJson),
		sendEnvelope: (envelope) => ipcRenderer.send(IPCChannel.ENVELOPE, envelope),
		sendStatus: (status) => ipcRenderer.send(IPCChannel.STATUS, status),
		sendStructuredLog: (log) => ipcRenderer.send(IPCChannel.STRUCTURED_LOG, log)
	};
	window.__SENTRY_IPC__ = ipcObject;
	if (contextBridge) try {
		contextBridge.exposeInMainWorld("__SENTRY_IPC__", ipcObject);
	} catch (e$1) {}
}

//#endregion
//#region ../../foundation/src/constants/electron.ts
/** webContents 启动参数,用于标记当前webContents的类型 */
let TabArgs = /* @__PURE__ */ function(TabArgs$1) {
	TabArgs$1["HomeView"] = "--home-view";
	TabArgs$1["TabView"] = "--tab-view";
	TabArgs$1["ShellView"] = "--shell-view";
	TabArgs$1["ActiveTabView"] = "--active-tab-view";
	return TabArgs$1;
}({});
/** 额外参数，传递一些必要的应用参数 */
let AdditionalArguments = /* @__PURE__ */ function(AdditionalArguments$1) {
	AdditionalArguments$1["AppName"] = "--app-name";
	AdditionalArguments$1["AppVersion"] = "--app-version";
	AdditionalArguments$1["WebUrl"] = "--web-url";
	AdditionalArguments$1["Env"] = "--env";
	AdditionalArguments$1["Area"] = "--area";
	AdditionalArguments$1["CountryCode"] = "--country-code";
	AdditionalArguments$1["CommitId"] = "--commit-id";
	AdditionalArguments$1["CreatedTime"] = "--created-time";
	return AdditionalArguments$1;
}({});

//#endregion
//#region ../../../../../node_modules/.pnpm/ansis@4.2.0/node_modules/ansis/index.cjs
var require_ansis = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let e, t, r, { defineProperty: l, setPrototypeOf: n, create: o, keys: s } = Object, i = "", { round: c, max: a$1 } = Math, p = (e$1) => {
		let t$1 = /([a-f\d]{3,6})/i.exec(e$1)?.[1], r$1 = t$1?.length, l$1 = parseInt(6 ^ r$1 ? 3 ^ r$1 ? "0" : t$1[0] + t$1[0] + t$1[1] + t$1[1] + t$1[2] + t$1[2] : t$1, 16);
		return [
			l$1 >> 16 & 255,
			l$1 >> 8 & 255,
			255 & l$1
		];
	}, u = (e$1, t$1, r$1) => e$1 ^ t$1 || t$1 ^ r$1 ? 16 + 36 * c(e$1 / 51) + 6 * c(t$1 / 51) + c(r$1 / 51) : 8 > e$1 ? 16 : e$1 > 248 ? 231 : c(24 * (e$1 - 8) / 247) + 232, d = (e$1) => {
		let t$1, r$1, l$1, n$1, o$1;
		return 8 > e$1 ? 30 + e$1 : 16 > e$1 ? e$1 - 8 + 90 : (232 > e$1 ? (o$1 = (e$1 -= 16) % 36, t$1 = (e$1 / 36 | 0) / 5, r$1 = (o$1 / 6 | 0) / 5, l$1 = o$1 % 6 / 5) : t$1 = r$1 = l$1 = (10 * (e$1 - 232) + 8) / 255, n$1 = 2 * a$1(t$1, r$1, l$1), n$1 ? 30 + (c(l$1) << 2 | c(r$1) << 1 | c(t$1)) + (2 ^ n$1 ? 0 : 60) : 30);
	}, f = (() => {
		let r$1 = (e$1) => o$1.some(((t$1) => e$1.test(t$1))), l$1 = globalThis, n$1 = l$1.process ?? {}, o$1 = n$1.argv ?? [], i$1 = n$1.env ?? {}, c$1 = -1;
		try {
			e = "," + s(i$1).join(",");
		} catch (e$1) {
			i$1 = {}, c$1 = 0;
		}
		let a$2 = "FORCE_COLOR", p$1 = {
			false: 0,
			0: 0,
			1: 1,
			2: 2,
			3: 3
		}[i$1[a$2]] ?? -1, u$1 = a$2 in i$1 && p$1 || r$1(/^--color=?(true|always)?$/);
		return u$1 && (c$1 = p$1), ~c$1 || (c$1 = ((r$2, l$2, n$2) => (t = r$2.TERM, {
			"24bit": 3,
			truecolor: 3,
			ansi256: 2,
			ansi: 1
		}[r$2.COLORTERM] || (r$2.CI ? /,GITHUB/.test(e) ? 3 : 1 : l$2 && "dumb" !== t ? n$2 ? 3 : /-256/.test(t) ? 2 : 1 : 0)))(i$1, !!i$1.PM2_HOME || i$1.NEXT_RUNTIME?.includes("edge") || !!n$1.stdout?.isTTY, "win32" === n$1.platform)), !p$1 || i$1.NO_COLOR || r$1(/^--(no-color|color=(false|never))$/) ? 0 : l$1.window?.chrome || u$1 && !c$1 ? 3 : c$1;
	})(), g = {
		open: i,
		close: i
	}, h = 39, b = 49, O = {}, m = ({ p: e$1 }, { open: t$1, close: l$1 }) => {
		let o$1 = (e$2, ...r$1) => {
			if (!e$2) {
				if (t$1 && t$1 === l$1) return t$1;
				if ((e$2 ?? i) === i) return i;
			}
			let n$1, s$2 = e$2.raw ? String.raw({ raw: e$2 }, ...r$1) : i + e$2, c$2 = o$1.p, a$2 = c$2.o, p$1 = c$2.c;
			if (s$2.includes("\x1B")) for (; c$2; c$2 = c$2.p) {
				let { open: e$3, close: t$2 } = c$2, r$2 = t$2.length, l$2 = i, o$2 = 0;
				if (r$2) for (; ~(n$1 = s$2.indexOf(t$2, o$2)); o$2 = n$1 + r$2) l$2 += s$2.slice(o$2, n$1) + e$3;
				s$2 = l$2 + s$2.slice(o$2);
			}
			return a$2 + (s$2.includes("\n") ? s$2.replace(/(\r?\n)/g, p$1 + "$1" + a$2) : s$2) + p$1;
		}, s$1 = t$1, c$1 = l$1;
		return e$1 && (s$1 = e$1.o + t$1, c$1 = l$1 + e$1.c), n(o$1, r), o$1.p = {
			open: t$1,
			close: l$1,
			o: s$1,
			c: c$1,
			p: e$1
		}, o$1.open = s$1, o$1.close = c$1, o$1;
	};
	const w = new function e$1(t$1 = f) {
		let s$1 = {
			Ansis: e$1,
			level: t$1,
			isSupported: () => a$2,
			strip: (e$2) => e$2.replace(/[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, i),
			extend(e$2) {
				for (let t$2 in e$2) {
					let r$1 = e$2[t$2], l$1 = (typeof r$1)[0];
					"s" === l$1 ? (c$1(t$2, T(...p(r$1))), c$1(_(t$2), v(...p(r$1)))) : c$1(t$2, r$1, "f" === l$1);
				}
				return r = o({}, O), n(s$1, r), s$1;
			}
		}, c$1 = (e$2, t$2, r$1) => {
			O[e$2] = { get() {
				let n$1 = r$1 ? (...e$3) => m(this, t$2(...e$3)) : m(this, t$2);
				return l(this, e$2, { value: n$1 }), n$1;
			} };
		}, a$2 = t$1 > 0, w$1 = (e$2, t$2) => a$2 ? {
			open: `[${e$2}m`,
			close: `[${t$2}m`
		} : g, y = (e$2) => (t$2) => e$2(...p(t$2)), R = (e$2, t$2) => (r$1, l$1, n$1) => w$1(`${e$2}8;2;${r$1};${l$1};${n$1}`, t$2), $ = (e$2, t$2) => (r$1, l$1, n$1) => w$1(((e$3, t$3, r$2) => d(u(e$3, t$3, r$2)))(r$1, l$1, n$1) + e$2, t$2), x = (e$2) => (t$2, r$1, l$1) => e$2(u(t$2, r$1, l$1)), T = R(3, h), v = R(4, b), C = (e$2) => w$1("38;5;" + e$2, h), E = (e$2) => w$1("48;5;" + e$2, b);
		2 === t$1 ? (T = x(C), v = x(E)) : 1 === t$1 && (T = $(0, h), v = $(10, b), C = (e$2) => w$1(d(e$2), h), E = (e$2) => w$1(d(e$2) + 10, b));
		let M, I = {
			fg: C,
			bg: E,
			rgb: T,
			bgRgb: v,
			hex: y(T),
			bgHex: y(v),
			visible: g,
			reset: w$1(0, 0),
			bold: w$1(1, 22),
			dim: w$1(2, 22),
			italic: w$1(3, 23),
			underline: w$1(4, 24),
			inverse: w$1(7, 27),
			hidden: w$1(8, 28),
			strikethrough: w$1(9, 29)
		}, _ = (e$2) => "bg" + e$2[0].toUpperCase() + e$2.slice(1), k = "Bright";
		return "black,red,green,yellow,blue,magenta,cyan,white,gray".split(",").map(((e$2, t$2) => {
			M = _(e$2), 8 > t$2 ? (I[e$2 + k] = w$1(90 + t$2, h), I[M + k] = w$1(100 + t$2, b)) : t$2 = 60, I[e$2] = w$1(30 + t$2, h), I[M] = w$1(40 + t$2, b);
		})), s$1.extend(I);
	}();
	module.exports = w, w.default = w;
}));

//#endregion
//#region ../../../../../node_modules/.pnpm/ansis@4.2.0/node_modules/ansis/index.mjs
var import_ansis = /* @__PURE__ */ __toESM(require_ansis(), 1);
const { Ansis, fg, bg, rgb, bgRgb, hex, bgHex, reset, inverse, hidden, visible, bold, dim, italic, underline, strikethrough, black, red, green, yellow, blue, magenta, cyan, white, gray, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright } = import_ansis.default;

//#endregion
//#region ../../../../../node_modules/.pnpm/nanoid@5.1.7/node_modules/nanoid/url-alphabet/index.js
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

//#endregion
//#region ../../../../../node_modules/.pnpm/nanoid@5.1.7/node_modules/nanoid/index.js
const POOL_SIZE_MULTIPLIER = 128;
let pool, poolOffset;
function fillPool(bytes) {
	if (!pool || pool.length < bytes) {
		pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
		webcrypto.getRandomValues(pool);
		poolOffset = 0;
	} else if (poolOffset + bytes > pool.length) {
		webcrypto.getRandomValues(pool);
		poolOffset = 0;
	}
	poolOffset += bytes;
}
function nanoid(size = 21) {
	fillPool(size |= 0);
	let id = "";
	for (let i$1 = poolOffset - size; i$1 < poolOffset; i$1++) id += urlAlphabet[pool[i$1] & 63];
	return id;
}

//#endregion
//#region src/node/utils.ts
function generateRequestId() {
	return nanoid();
}

//#endregion
//#region src/shared/types.ts
/** 通信渲染进程 */
let RendererName = /* @__PURE__ */ function(RendererName$1) {
	/** 主页，url: atomm://renderer/ */
	RendererName$1["Home"] = "home";
	/** tab */
	RendererName$1["Shell"] = "shell";
	/** 当前激活的 Tab页 */
	RendererName$1["ActiveTab"] = "activeTab";
	return RendererName$1;
}({});
/**
* 标准JSON RPC 2.0 错误代码
* 参考 https://www.jsonrpc.org/specification#error_object
*/
let RpcErrorCode = /* @__PURE__ */ function(RpcErrorCode$1) {
	RpcErrorCode$1[RpcErrorCode$1["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
	RpcErrorCode$1[RpcErrorCode$1["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
	RpcErrorCode$1[RpcErrorCode$1["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
	RpcErrorCode$1[RpcErrorCode$1["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
	RpcErrorCode$1[RpcErrorCode$1["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
	RpcErrorCode$1[RpcErrorCode$1["TIMEOUT_ERROR"] = -32001] = "TIMEOUT_ERROR";
	RpcErrorCode$1[RpcErrorCode$1["TRANSPORT_ERROR"] = -32002] = "TRANSPORT_ERROR";
	RpcErrorCode$1[RpcErrorCode$1["SERVICE_NOT_FOUND"] = -32003] = "SERVICE_NOT_FOUND";
	return RpcErrorCode$1;
}({});

//#endregion
//#region src/shared/utils.ts
function defineNotificationHandlers(handlers) {
	return handlers;
}
/**
* 根据渲染进程名称获取 webContentsId
* @param rendererName 渲染进程名称
* @param activeTabWebContentsId 当前激活的标签页的 webContentsId
* @param getWebContents 获取所有渲染进程的函数
* @returns webContentsId
*/
async function getWcIdByRendererName(rendererName, activeTabWebContentsId$1, getWebContents) {
	if (rendererName === RendererName.ActiveTab && activeTabWebContentsId$1 !== 0) return activeTabWebContentsId$1;
	const wcInfos = getWebContents();
	const allWebContents = wcInfos instanceof Promise ? await wcInfos : wcInfos;
	for (const wc of allWebContents) if (wc.argv.includes(TabArgs.HomeView) && rendererName === RendererName.Home) return wc.id;
	else if (wc.argv.includes(TabArgs.ShellView) && rendererName === RendererName.Shell) return wc.id;
	else if (wc.activeTab && rendererName === RendererName.ActiveTab) return wc.id;
	return 0;
}

//#endregion
//#region src/preload/index.ts
const logger = console;
const logPrefix = () => gray(`rpc:preload`);
let activeTabWebContentsId = 0;
const messageChannels = /* @__PURE__ */ new Map();
const messageChannelRequestPromises = /* @__PURE__ */ new Map();
const rendererRequestPromises = /* @__PURE__ */ new Map();
const rendererMessagePorts = /* @__PURE__ */ new Map();
const pendingMessageChannelRequests = /* @__PURE__ */ new Map();
const channelConnectionState = /* @__PURE__ */ new Map();
const requestHandlers = /* @__PURE__ */ new Set();
function cleanupChannelQueue(channelId, error) {
	(pendingMessageChannelRequests.get(channelId) || []).forEach(({ reject, timer }) => {
		clearTimeout(timer);
		reject(new Error(error || `MessageChannel ${channelId} cleanup`));
	});
	pendingMessageChannelRequests.delete(channelId);
	channelConnectionState.delete(channelId);
}
/**
* 处理渲染进程的RPC请求
*/
async function handleRendererRequest(request) {
	let lastNotFoundResponse = null;
	for (const handler of requestHandlers) try {
		const response = await handler(request);
		if (response.id === request.id) {
			if (response.error?.code === RpcErrorCode.SERVICE_NOT_FOUND || response.error?.code === RpcErrorCode.METHOD_NOT_FOUND) {
				lastNotFoundResponse = response;
				continue;
			}
			return response;
		}
	} catch (error) {
		logger.error("Error in renderer request handler:", error);
	}
	if (lastNotFoundResponse) return lastNotFoundResponse;
	return {
		jsonrpc: "2.0",
		id: request.id || null,
		error: {
			code: RpcErrorCode.METHOD_NOT_FOUND,
			message: "Method not found"
		}
	};
}
const handleNotification = (notification) => {
	const { method, params } = notification;
	const handlers = notificationHandlers.get(method);
	if (handlers) handlers.forEach((handler) => {
		const { webContentsId, ...rest } = params;
		handler({ webContentsId }, rest);
	});
};
/**
* 处理队列中的请求
*/
const tryHandleMessagePending = (channelId) => {
	channelConnectionState.set(channelId, "connected");
	const queuedRequests = pendingMessageChannelRequests.get(channelId) || [];
	const defaultQueuedRequests = pendingMessageChannelRequests.get("default") || [];
	if (channelId !== "default" && defaultQueuedRequests.length) {
		logger.info(gray(`rpc:preload:message-channel:Processing ${defaultQueuedRequests.length} default queued requests on channel ${channelId}`));
		for (const { request, resolve, reject, timer, timeout, noTimeout } of defaultQueuedRequests) {
			clearTimeout(timer);
			sendMessageChannelRequestDirect(channelId, request, {
				timeout,
				noTimeout
			}).then(resolve).catch(reject);
		}
		pendingMessageChannelRequests.delete("default");
		channelConnectionState.delete("default");
	}
	logger.debug(gray(`rpc:preload:message-channel:Processing ${queuedRequests.length} queued requests for channel ${channelId}`));
	for (const { request, resolve, reject, timer, timeout } of queuedRequests) {
		timer && clearTimeout(timer);
		sendMessageChannelRequestDirect(channelId, request, { timeout }).then(resolve).catch(reject);
	}
	pendingMessageChannelRequests.delete(channelId);
};
function setupMessageChannelCommunication() {
	logger.info("rpc:preload:mp:start listen message channel...");
	ipcRenderer$1.on("electron-rpc-message-channel", (event, { channelId }) => {
		const [port] = event.ports;
		logger.debug("rpc:preload:mp:receive rpc message channel", port, channelId);
		if (!port) {
			logger.error("rpc:preload:mp: Failed to get port from event", port, channelId);
			cleanupChannelQueue(channelId, `Failed to establish MessageChannel connection: ${channelId}`);
			return;
		}
		messageChannels.set(channelId, port);
		tryHandleMessagePending(channelId);
		port.postMessage({ type: "electron-rpc-connected" });
		port.addEventListener("message", (event$1) => {
			const { data } = event$1;
			if (data?.type === "electron-rpc-response") {
				const response = data.payload;
				const requestId = response.id;
				const pendingRequest = messageChannelRequestPromises.get(requestId);
				if (pendingRequest) {
					clearTimeout(pendingRequest.timer);
					messageChannelRequestPromises.delete(requestId);
					if (response.error) pendingRequest.reject(response.error);
					else pendingRequest.resolve(response.result);
				}
			} else if (data?.type === "electron-rpc-notification") {
				logger.info(`${logPrefix()}: Received MessageChannel notification via ${channelId} method: ${data.payload.method}`, { notification: data.payload });
				handleNotification(data.payload);
			} else if (data?.type === "electron-rpc-request") handleRendererRequest(data.payload).then((response) => {
				port.postMessage({
					type: "electron-rpc-response",
					payload: response
				});
			}).catch(() => {});
			else if (data?.type === "electron-rpc-other-renderer-reload") {
				console.debug("electron-rpc-other-renderer-reload", data.payload, rendererMessagePorts);
				const { webContentsId } = data.payload;
				if (webContentsId) rendererMessagePorts.delete(webContentsId);
			}
		});
		port.start();
	});
	ipcRenderer$1.on("electron-rpc-renderer-channel", (event, targetWebContentsId) => {
		const [port] = event.ports;
		logger.debug("rpc:preload:renderer-channel:receive renderer message channel", port, targetWebContentsId);
		if (!port) {
			logger.error("Failed to get renderer port from event", port, targetWebContentsId);
			return;
		}
		rendererMessagePorts.set(targetWebContentsId, port);
		port.addEventListener("message", (event$1) => {
			const { data } = event$1;
			if (data?.type === "electron-rpc-renderer-response") {
				const response = data.payload;
				const requestId = response.id;
				const pendingRequest = rendererRequestPromises.get(requestId);
				if (pendingRequest) {
					clearTimeout(pendingRequest.timer);
					rendererRequestPromises.delete(requestId);
					if (response.error) pendingRequest.reject(response.error);
					else pendingRequest.resolve(response.result);
				}
			} else if (data?.type === "electron-rpc-renderer-request") handleRendererRequest(data.payload).then((response) => {
				port.postMessage({
					type: "electron-rpc-renderer-response",
					payload: response
				});
			}).catch(() => {});
			else if (data?.type === "electron-rpc-renderer-notification") handleNotification(data.payload);
		});
		port.start();
	});
}
/**
* 直接发送MessageChannel请求（不处理队列）
*/
async function sendMessageChannelRequestDirect(channelId, request, options) {
	const { timeout = 30 * 1e3, noTimeout = false } = options;
	const port = messageChannels.get(channelId);
	if (!port) throw new Error(`MessageChannel ${channelId} not found`);
	const requestId = request.id || generateRequestId();
	request.id = requestId;
	return new Promise((resolve, reject) => {
		const timer = noTimeout ? void 0 : setTimeout(() => {
			messageChannelRequestPromises.delete(requestId.toString());
			reject(/* @__PURE__ */ new Error(`rpc:preload:MessageChannel request timeout after ${timeout}ms`));
		}, timeout);
		messageChannelRequestPromises.set(requestId.toString(), {
			resolve,
			reject,
			timer
		});
		port.postMessage({
			type: "electron-rpc-request",
			payload: request
		});
	});
}
/**
* 发送MessageChannel请求（支持队列机制）
*/
async function sendMessageChannelRequest(channelId, request, options) {
	const { timeout, noTimeout } = options;
	const connectionState = channelConnectionState.get(channelId);
	if (connectionState === "connected" && messageChannels.has(channelId)) return sendMessageChannelRequestDirect(channelId, request, options);
	if (connectionState === "failed") throw new Error(`MessageChannel ${channelId} connection failed`);
	logger.info(`MessageChannel ${channelId} connection state: ${connectionState}, request append to queue`);
	return new Promise((resolve, reject) => {
		const timer = noTimeout ? void 0 : setTimeout(() => {
			const queue = pendingMessageChannelRequests.get(channelId) || [];
			const index = queue.findIndex((item) => item.timer === timer);
			if (index !== -1) {
				queue.splice(index, 1);
				if (!queue.length) pendingMessageChannelRequests.delete(channelId);
			}
			reject(/* @__PURE__ */ new Error(`rpc:preload:MessageChannel request timeout after ${timeout}ms (queued)`));
		}, timeout);
		const queuedRequest = {
			request,
			resolve,
			reject,
			timer,
			timeout: options.timeout,
			noTimeout: options.noTimeout
		};
		if (!pendingMessageChannelRequests.has(channelId)) pendingMessageChannelRequests.set(channelId, []);
		pendingMessageChannelRequests.get(channelId)?.push(queuedRequest);
		const queueLength = pendingMessageChannelRequests.get(channelId)?.length || 0;
		logger.debug(`MessageChannel ${channelId} connection state: ${connectionState}, request already in queue, queue length: ${queueLength}, method: ${request.method}`);
	});
}
async function getWebContentsIdByRendererName(rendererName) {
	return await getWcIdByRendererName(rendererName, activeTabWebContentsId, electronRpcApi.getWebContents);
}
/**
* 渲染进程到渲染进程通信
*/
async function handleRendererToRendererRequest(request, options) {
	const { rendererName, timeout, noTimeout, wcId = 0 } = options;
	const targetWebContentsId = wcId || await getWebContentsIdByRendererName(rendererName);
	const rendererPort = rendererMessagePorts.get(targetWebContentsId);
	return new Promise((resolve, reject) => {
		const timer = noTimeout ? void 0 : setTimeout(() => {
			rendererRequestPromises.delete(request.id);
			reject(/* @__PURE__ */ new Error(`rpc:preload:r2r req timeout after ${timeout}ms`));
		}, timeout);
		rendererRequestPromises.set(request.id, {
			resolve,
			reject,
			timer
		});
		if (rendererPort) rendererPort.postMessage({
			type: "electron-rpc-renderer-request",
			payload: request
		});
		else ipcRenderer$1.invoke("electron-rpc-request-renderer-channel", targetWebContentsId).then((result) => {
			if (!result) {
				reject(/* @__PURE__ */ new Error("Failed to establish renderer-to-renderer connection"));
				return;
			}
			let _timer;
			const checkConnection = () => {
				const port = rendererMessagePorts.get(targetWebContentsId);
				if (port) {
					_timer && clearTimeout(_timer);
					port.postMessage({
						type: "electron-rpc-renderer-request",
						payload: request
					});
				} else _timer = setTimeout(checkConnection, 100);
			};
			checkConnection();
		}).catch((error) => {
			reject(error);
		});
	});
}
function parseAdditionalArguments(additionalArguments) {
	return additionalArguments.reduce((acc, arg) => {
		const [key, value] = arg.split("=");
		acc[key] = value;
		return acc;
	}, {});
}
const additionalArgs = parseAdditionalArguments(process.argv);
setupMessageChannelCommunication();
const sendMPRequest = (request, options, channelId) => {
	if (!channelId) {
		const availableChannels = Array.from(messageChannels.keys());
		if (availableChannels.length) channelId = availableChannels[0];
		else {
			const defaultChannelId = "default";
			logger.info(`${logPrefix()}: No available channels, queuing request for method: ${request.method} on default channel`);
			return sendMessageChannelRequest(defaultChannelId, request, options);
		}
	}
	return sendMessageChannelRequest(channelId, request, options);
};
const notificationHandlers = /* @__PURE__ */ new Map();
const electronRpcApi = {
	invoke: async (method, params, options) => {
		const { timeout = 30 * 1e3, channelId = "", noTimeout = false } = options || {};
		const request = {
			jsonrpc: "2.0",
			method,
			params,
			id: generateRequestId()
		};
		if (options?.rendererName || options?.wcId) return handleRendererToRendererRequest(request, {
			timeout,
			rendererName: options.rendererName,
			wcId: options.wcId,
			noTimeout
		});
		return sendMPRequest(request, {
			timeout,
			noTimeout,
			...options
		}, channelId);
	},
	notify: async (method, params, options) => {
		let { channelId, rendererName, targetWebContentsId } = options || {};
		const notification = {
			jsonrpc: "2.0",
			method,
			params: params ?? {}
		};
		if (rendererName || targetWebContentsId) {
			let _targetWebContentsId = 0;
			if (targetWebContentsId) _targetWebContentsId = targetWebContentsId;
			else if (rendererName) _targetWebContentsId = await getWebContentsIdByRendererName(rendererName);
			if (!_targetWebContentsId) return;
			const rendererPort = rendererMessagePorts.get(_targetWebContentsId);
			logger.info(`${logPrefix()}: Renderer to renderer notification`, {
				notification,
				rendererName,
				rendererPort
			});
			notification["params"] = {
				webContentsId: _targetWebContentsId,
				...notification.params
			};
			if (rendererPort) rendererPort.postMessage({
				type: "electron-rpc-renderer-notification",
				payload: notification
			});
			else ipcRenderer$1.invoke("electron-rpc-request-renderer-channel", _targetWebContentsId).then((result) => {
				if (!result) throw new Error("Failed to establish renderer-to-renderer connection");
				const sendNotification = () => {
					const port = rendererMessagePorts.get(_targetWebContentsId);
					if (port) port.postMessage({
						type: "electron-rpc-renderer-notification",
						payload: notification
					});
					else setTimeout(sendNotification, 100);
				};
				sendNotification();
			}).catch(() => {});
		}
		if (!channelId) {
			const availableChannels = Array.from(messageChannels.keys());
			if (availableChannels.length) channelId = availableChannels[0];
		}
		if (channelId) {
			const port = messageChannels.get(channelId);
			if (port) port.postMessage({
				type: "electron-rpc-notification",
				payload: notification
			});
		} else ipcRenderer$1.send("electron-rpc-notification", notification);
	},
	on: (method, handler) => {
		if (!notificationHandlers.has(method)) notificationHandlers.set(method, /* @__PURE__ */ new Set());
		const handlers = notificationHandlers.get(method);
		handlers?.add(handler);
		return () => {
			handlers?.delete(handler);
			if (!handlers?.size) notificationHandlers.delete(method);
		};
	},
	onRequest: (handler) => {
		requestHandlers.add(handler);
		return () => {
			requestHandlers.delete(handler);
		};
	},
	getWebContentsId: () => {
		return ipcRenderer$1.sendSync("electron-rpc-get-webcontents-id");
	},
	getWebContents: async () => {
		return ipcRenderer$1.invoke("electron-rpc-get-all-webcontents");
	},
	getQueueStatus: () => {
		const queueStatus = {};
		for (const [channelId, requests] of pendingMessageChannelRequests) queueStatus[channelId] = {
			queueLength: requests.length,
			connectionState: channelConnectionState.get(channelId),
			requests: requests.map((req) => ({
				method: req.request.method,
				id: req.request.id
			}))
		};
		return {
			totalChannels: messageChannels.size,
			pendingChannels: pendingMessageChannelRequests.size,
			queueStatus,
			connectionStates: Object.fromEntries(channelConnectionState)
		};
	},
	getPathForFile: async (file) => {
		try {
			return await webUtils.getPathForFile(file);
		} catch (error) {
			logger.error(`Failed to get path for file: ${file.name}`, error);
			return "";
		}
	},
	appInfo: {
		electron: true,
		appName: additionalArgs[AdditionalArguments.AppName] ?? "",
		appVersion: additionalArgs[AdditionalArguments.AppVersion] ?? "",
		env: additionalArgs[AdditionalArguments.Env],
		platform: process.platform,
		arch: process.arch,
		isWin: process.platform === "win32",
		isMac: process.platform === "darwin",
		isLinux: process.platform === "linux",
		versions: process.versions,
		area: additionalArgs[AdditionalArguments.Area],
		countryCode: additionalArgs[AdditionalArguments.CountryCode] ?? "",
		commitId: additionalArgs[AdditionalArguments.CommitId] ?? "",
		createdTime: additionalArgs[AdditionalArguments.CreatedTime] ?? ""
	}
};
const notificationHandler = defineNotificationHandlers({ "renderer:updateActiveTab": (_ctx, { webContentId }) => {
	activeTabWebContentsId = webContentId;
} });
try {
	contextBridge$1.exposeInMainWorld("electronRpc", electronRpcApi);
	const handler = electronRpcApi.on("renderer:updateActiveTab", notificationHandler["renderer:updateActiveTab"]);
	window.addEventListener("beforeunload", handler);
} catch (error) {
	logger.error(`${logPrefix()}: Failed to expose electronRpc API:`, error);
}

//#endregion
export { getWebContentsIdByRendererName };