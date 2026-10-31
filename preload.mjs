import { createRequire as e } from "node:module";
import "node:url";
globalThis.require || (globalThis.require = e(import.meta.url));
import { contextBridge as t, ipcRenderer as n } from "electron";
import { webFrame as r } from "electron/renderer";
import i, { basename as a, dirname as o, extname as s, isAbsolute as c, join as l, parse as u, posix as d, win32 as f } from "node:path";
import p from "fs";
import m from "assert";
import h, { dirname as g, parse as ee } from "path";
import { exec as _ } from "node:child_process";
import { promisify as v } from "node:util";
import { release as te } from "os";
import y, { createReadStream as ne, createWriteStream as b, existsSync as re, readdir as ie, unlinkSync as ae } from "node:fs";
import oe, { access as x, copyFile as se, mkdir as S, readFile as ce, readdir as le, rename as ue, rm as de, stat as fe, unlink as pe, writeFile as me } from "node:fs/promises";
import { platform as C, release as he } from "node:os";
import { createHash as ge, randomBytes as _e } from "node:crypto";
import { createInterface as ve } from "node:readline";
import { createGunzip as ye } from "node:zlib";
import be, { EventEmitter as xe } from "events";
import { EventEmitter as Se } from "node:events";
import Ce from "node:stream";
import { StringDecoder as we } from "node:string_decoder";
import { Buffer as Te } from "buffer";
import * as Ee from "zlib";
import De from "zlib";
import Oe from "node:assert";
import { pathToFileURL as ke } from "node:url";
//#region \0rolldown/runtime.js
var w = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), T = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), Ae = "(() => {\n  const bridge = window[__BRIDGE_NAME__];\n  if (!bridge) {\n    console.warn('[cookie][main-world] Bridge not found, skip injection');\n    return;\n  }\n\n  if (window[__FLAG_NAME__]) {\n    return;\n  }\n\n  const defineCookie = target => {\n    if (!target) return;\n    Object.defineProperty(target, 'cookie', {\n      configurable: true,\n      enumerable: true,\n      get() {\n        try {\n          return bridge.getCookieString();\n        } catch (error) {\n          console.error('[cookie][main-world] Failed to read cookie', error);\n          return '';\n        }\n      },\n      set(value) {\n        try {\n          bridge.setCookieString(String(value ?? ''));\n        } catch (error) {\n          console.error('[cookie][main-world] Failed to set cookie', error);\n        }\n      },\n    });\n  };\n\n  defineCookie(Document.prototype);\n  defineCookie(document);\n  window[__FLAG_NAME__] = true;\n})();\n";
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/domain.js
function je(e, t) {
	return e.endsWith(t) ? e.length === t.length || e[e.length - t.length - 1] === "." : !1;
}
function Me(e, t) {
	let n = e.length - t.length - 2, r = e.lastIndexOf(".", n);
	return r === -1 ? e : e.slice(r + 1);
}
function Ne(e, t, n) {
	if (n.validHosts !== null) {
		let e = n.validHosts;
		for (let n of e) if (je(t, n)) return n;
	}
	let r = 0;
	if (t.startsWith(".")) for (; r < t.length && t[r] === ".";) r += 1;
	return e.length === t.length - r ? null : Me(t, e);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/domain-without-suffix.js
function Pe(e, t) {
	return e.slice(0, -t.length - 1);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/extract-hostname.js
function Fe(e, t) {
	let n = 0, r = e.length, i = !1;
	if (!t) {
		if (e.startsWith("data:")) return null;
		for (; n < e.length && e.charCodeAt(n) <= 32;) n += 1;
		for (; r > n + 1 && e.charCodeAt(r - 1) <= 32;) --r;
		if (e.charCodeAt(n) === 47 && e.charCodeAt(n + 1) === 47) n += 2;
		else {
			let t = e.indexOf(":/", n);
			if (t !== -1) {
				let r = t - n, i = e.charCodeAt(n), a = e.charCodeAt(n + 1), o = e.charCodeAt(n + 2), s = e.charCodeAt(n + 3), c = e.charCodeAt(n + 4);
				if (!(r === 5 && i === 104 && a === 116 && o === 116 && s === 112 && c === 115) && !(r === 4 && i === 104 && a === 116 && o === 116 && s === 112) && !(r === 3 && i === 119 && a === 115 && o === 115) && !(r === 2 && i === 119 && a === 115)) for (let r = n; r < t; r += 1) {
					let t = e.charCodeAt(r) | 32;
					if (!(t >= 97 && t <= 122 || t >= 48 && t <= 57 || t === 46 || t === 45 || t === 43)) return null;
				}
				for (n = t + 2; e.charCodeAt(n) === 47;) n += 1;
			}
		}
		let t = -1, a = -1, o = -1;
		for (let s = n; s < r; s += 1) {
			let n = e.charCodeAt(s);
			if (n === 35 || n === 47 || n === 63) {
				r = s;
				break;
			} else n === 64 ? t = s : n === 93 ? a = s : n === 58 ? o = s : n >= 65 && n <= 90 && (i = !0);
		}
		if (t !== -1 && t > n && t < r && (n = t + 1), e.charCodeAt(n) === 91) return a === -1 ? null : e.slice(n + 1, a).toLowerCase();
		o !== -1 && o > n && o < r && (r = o);
	}
	for (; r > n + 1 && e.charCodeAt(r - 1) === 46;) --r;
	let a = n !== 0 || r !== e.length ? e.slice(n, r) : e;
	return i ? a.toLowerCase() : a;
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/is-ip.js
function Ie(e) {
	if (e.length < 7 || e.length > 15) return !1;
	let t = 0;
	for (let n = 0; n < e.length; n += 1) {
		let r = e.charCodeAt(n);
		if (r === 46) t += 1;
		else if (r < 48 || r > 57) return !1;
	}
	return t === 3 && e.charCodeAt(0) !== 46 && e.charCodeAt(e.length - 1) !== 46;
}
function Le(e) {
	if (e.length < 3) return !1;
	let t = e.startsWith("[") ? 1 : 0, n = e.length;
	if (e[n - 1] === "]" && --n, n - t > 39) return !1;
	let r = !1;
	for (; t < n; t += 1) {
		let n = e.charCodeAt(t);
		if (n === 58) r = !0;
		else if (!(n >= 48 && n <= 57 || n >= 97 && n <= 102 || n >= 65 && n <= 90)) return !1;
	}
	return r;
}
function E(e) {
	return Le(e) || Ie(e);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/is-valid.js
function Re(e) {
	return e >= 97 && e <= 122 || e >= 48 && e <= 57 || e > 127;
}
function D(e) {
	if (e.length > 255 || e.length === 0 || !Re(e.charCodeAt(0)) && e.charCodeAt(0) !== 46 && e.charCodeAt(0) !== 95) return !1;
	let t = -1, n = -1, r = e.length;
	for (let i = 0; i < r; i += 1) {
		let r = e.charCodeAt(i);
		if (r === 46) {
			if (i - t > 64 || n === 46 || n === 45 || n === 95) return !1;
			t = i;
		} else if (!(Re(r) || r === 45 || r === 95)) return !1;
		n = r;
	}
	return r - t - 1 <= 63 && n !== 45;
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/options.js
function ze({ allowIcannDomains: e = !0, allowPrivateDomains: t = !1, detectIp: n = !0, extractHostname: r = !0, mixedInputs: i = !0, validHosts: a = null, validateHostname: o = !0 }) {
	return {
		allowIcannDomains: e,
		allowPrivateDomains: t,
		detectIp: n,
		extractHostname: r,
		mixedInputs: i,
		validHosts: a,
		validateHostname: o
	};
}
var Be = ze({});
function Ve(e) {
	return e === void 0 ? Be : ze(e);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/subdomain.js
function He(e, t) {
	return t.length === e.length ? "" : e.slice(0, -t.length - 1);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/factory.js
function Ue() {
	return {
		domain: null,
		domainWithoutSuffix: null,
		hostname: null,
		isIcann: null,
		isIp: null,
		isPrivate: null,
		publicSuffix: null,
		subdomain: null
	};
}
function We(e) {
	e.domain = null, e.domainWithoutSuffix = null, e.hostname = null, e.isIcann = null, e.isIp = null, e.isPrivate = null, e.publicSuffix = null, e.subdomain = null;
}
function Ge(e, t, n, r, i) {
	let a = Ve(r);
	return typeof e != "string" || (a.extractHostname ? a.mixedInputs ? i.hostname = Fe(e, D(e)) : i.hostname = Fe(e, !1) : i.hostname = e, a.detectIp && i.hostname !== null && (i.isIp = E(i.hostname), i.isIp)) ? i : a.validateHostname && a.extractHostname && i.hostname !== null && !D(i.hostname) ? (i.hostname = null, i) : (t === 0 || i.hostname === null || (n(i.hostname, a, i), t === 2 || i.publicSuffix === null) || (i.domain = Ne(i.publicSuffix, i.hostname, a), t === 3 || i.domain === null) || (i.subdomain = He(i.hostname, i.domain), t === 4) || (i.domainWithoutSuffix = Pe(i.domain, i.publicSuffix)), i);
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts-core@7.0.27/node_modules/tldts-core/dist/es6/src/lookup/fast-path.js
function Ke(e, t, n) {
	if (!t.allowPrivateDomains && e.length > 3) {
		let t = e.length - 1, r = e.charCodeAt(t), i = e.charCodeAt(t - 1), a = e.charCodeAt(t - 2), o = e.charCodeAt(t - 3);
		if (r === 109 && i === 111 && a === 99 && o === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "com", !0;
		if (r === 103 && i === 114 && a === 111 && o === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "org", !0;
		if (r === 117 && i === 100 && a === 101 && o === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "edu", !0;
		if (r === 118 && i === 111 && a === 103 && o === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "gov", !0;
		if (r === 116 && i === 101 && a === 110 && o === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "net", !0;
		if (r === 101 && i === 100 && a === 46) return n.isIcann = !0, n.isPrivate = !1, n.publicSuffix = "de", !0;
	}
	return !1;
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts@7.0.27/node_modules/tldts/dist/es6/src/data/trie.js
var qe = (function() {
	let e = [1, {}], t = [0, { city: e }];
	return [0, {
		ck: [0, { www: e }],
		jp: [0, {
			kawasaki: t,
			kitakyushu: t,
			kobe: t,
			nagoya: t,
			sapporo: t,
			sendai: t,
			yokohama: t
		}]
	}];
})(), Je = (function() {
	let e = [1, {}], t = [2, {}], n = [1, {
		com: e,
		edu: e,
		gov: e,
		net: e,
		org: e
	}], r = [1, {
		com: e,
		edu: e,
		gov: e,
		mil: e,
		net: e,
		org: e
	}], i = [0, { "*": t }], a = [2, { s: i }], o = [0, { relay: t }], s = [2, { id: t }], c = [1, { gov: e }], l = [0, {
		airflow: i,
		"lambda-url": t,
		"transfer-webapp": t
	}], u = [0, {
		airflow: i,
		"transfer-webapp": t
	}], d = [0, { "transfer-webapp": t }], f = [0, {
		"transfer-webapp": t,
		"transfer-webapp-fips": t
	}], p = [0, {
		notebook: t,
		studio: t
	}], m = [0, {
		labeling: t,
		notebook: t,
		studio: t
	}], h = [0, { notebook: t }], g = [0, {
		labeling: t,
		notebook: t,
		"notebook-fips": t,
		studio: t
	}], ee = [0, {
		notebook: t,
		"notebook-fips": t,
		studio: t,
		"studio-fips": t
	}], _ = [0, { shop: t }], v = [0, { "*": e }], te = [1, { co: t }], y = [0, { objects: t }], ne = [2, {
		"eu-west-1": t,
		"us-east-1": t
	}], b = [2, { nodes: t }], re = [0, { my: t }], ie = [0, {
		s3: t,
		"s3-accesspoint": t,
		"s3-website": t
	}], ae = [0, {
		s3: t,
		"s3-accesspoint": t
	}], oe = [0, { direct: t }], x = [0, { "webview-assets": t }], se = [0, {
		vfs: t,
		"webview-assets": t
	}], S = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: ie,
		s3: t,
		"s3-accesspoint": t,
		"s3-object-lambda": t,
		"s3-website": t,
		"aws-cloud9": x,
		cloud9: se
	}], ce = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: ae,
		s3: t,
		"s3-accesspoint": t,
		"s3-object-lambda": t,
		"s3-website": t,
		"aws-cloud9": x,
		cloud9: se
	}], le = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: ie,
		s3: t,
		"s3-accesspoint": t,
		"s3-object-lambda": t,
		"s3-website": t,
		"analytics-gateway": t,
		"aws-cloud9": x,
		cloud9: se
	}], ue = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: ie,
		s3: t,
		"s3-accesspoint": t,
		"s3-object-lambda": t,
		"s3-website": t
	}], de = [0, {
		s3: t,
		"s3-accesspoint": t,
		"s3-accesspoint-fips": t,
		"s3-fips": t,
		"s3-website": t
	}], fe = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: de,
		s3: t,
		"s3-accesspoint": t,
		"s3-accesspoint-fips": t,
		"s3-fips": t,
		"s3-object-lambda": t,
		"s3-website": t,
		"aws-cloud9": x,
		cloud9: se
	}], pe = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: de,
		s3: t,
		"s3-accesspoint": t,
		"s3-accesspoint-fips": t,
		"s3-fips": t,
		"s3-object-lambda": t,
		"s3-website": t
	}], me = [0, {
		"execute-api": t,
		"emrappui-prod": t,
		"emrnotebooks-prod": t,
		"emrstudio-prod": t,
		dualstack: de,
		s3: t,
		"s3-accesspoint": t,
		"s3-accesspoint-fips": t,
		"s3-deprecated": t,
		"s3-fips": t,
		"s3-object-lambda": t,
		"s3-website": t,
		"analytics-gateway": t,
		"aws-cloud9": x,
		cloud9: se
	}], C = [0, { auth: t }], he = [0, {
		auth: t,
		"auth-fips": t
	}], ge = [0, { "auth-fips": t }], _e = [0, { apps: t }], ve = [0, { paas: t }], ye = [2, { eu: t }], be = [0, { app: t }], xe = [0, { site: t }], Se = [1, {
		com: e,
		edu: e,
		net: e,
		org: e
	}], Ce = [0, { j: t }], we = [0, { dyn: t }], Te = [2, { web: t }], Ee = [1, {
		co: e,
		com: e,
		edu: e,
		gov: e,
		net: e,
		org: e
	}], De = [0, { p: t }], Oe = [0, { user: t }], ke = [1, { ms: t }], w = [0, { cdn: t }], T = [2, { raw: i }], Ae = [0, {
		cust: t,
		reservd: t
	}], je = [0, { cust: t }], Me = [0, { s3: t }], Ne = [1, {
		biz: e,
		com: e,
		edu: e,
		gov: e,
		info: e,
		net: e,
		org: e
	}], Pe = [0, { ipfs: t }], Fe = [1, { framer: t }], Ie = [0, { forgot: t }], Le = [0, {
		core: [0, {
			blob: t,
			file: t,
			web: t
		}],
		servicebus: t
	}], E = [1, { gs: e }], Re = [0, { nes: e }], D = [1, {
		k12: e,
		cc: e,
		lib: e
	}], ze = [1, { cc: e }], Be = [1, {
		cc: e,
		lib: e
	}];
	return [0, {
		ac: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			drr: t,
			feedback: t,
			forms: t
		}],
		ad: e,
		ae: [1, {
			ac: e,
			co: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			sch: e
		}],
		aero: [1, {
			airline: e,
			airport: e,
			"accident-investigation": e,
			"accident-prevention": e,
			aerobatic: e,
			aeroclub: e,
			aerodrome: e,
			agents: e,
			"air-surveillance": e,
			"air-traffic-control": e,
			aircraft: e,
			airtraffic: e,
			ambulance: e,
			association: e,
			author: e,
			ballooning: e,
			broker: e,
			caa: e,
			cargo: e,
			catering: e,
			certification: e,
			championship: e,
			charter: e,
			civilaviation: e,
			club: e,
			conference: e,
			consultant: e,
			consulting: e,
			control: e,
			council: e,
			crew: e,
			design: e,
			dgca: e,
			educator: e,
			emergency: e,
			engine: e,
			engineer: e,
			entertainment: e,
			equipment: e,
			exchange: e,
			express: e,
			federation: e,
			flight: e,
			freight: e,
			fuel: e,
			gliding: e,
			government: e,
			groundhandling: e,
			group: e,
			hanggliding: e,
			homebuilt: e,
			insurance: e,
			journal: e,
			journalist: e,
			leasing: e,
			logistics: e,
			magazine: e,
			maintenance: e,
			marketplace: e,
			media: e,
			microlight: e,
			modelling: e,
			navigation: e,
			parachuting: e,
			paragliding: e,
			"passenger-association": e,
			pilot: e,
			press: e,
			production: e,
			recreation: e,
			repbody: e,
			res: e,
			research: e,
			rotorcraft: e,
			safety: e,
			scientist: e,
			services: e,
			show: e,
			skydiving: e,
			software: e,
			student: e,
			taxi: e,
			trader: e,
			trading: e,
			trainer: e,
			union: e,
			workinggroup: e,
			works: e
		}],
		af: n,
		ag: [1, {
			co: e,
			com: e,
			net: e,
			nom: e,
			org: e,
			obj: t
		}],
		ai: [1, {
			com: e,
			net: e,
			off: e,
			org: e,
			uwu: t,
			framer: t,
			kiloapps: t
		}],
		al: r,
		am: [1, {
			co: e,
			com: e,
			commune: e,
			net: e,
			org: e,
			radio: t
		}],
		ao: [1, {
			co: e,
			ed: e,
			edu: e,
			gov: e,
			gv: e,
			it: e,
			og: e,
			org: e,
			pb: e
		}],
		aq: e,
		ar: [1, {
			bet: e,
			com: e,
			coop: e,
			edu: e,
			gob: e,
			gov: e,
			int: e,
			mil: e,
			musica: e,
			mutual: e,
			net: e,
			org: e,
			seg: e,
			senasa: e,
			tur: e
		}],
		arpa: [1, {
			e164: e,
			home: e,
			"in-addr": e,
			ip6: e,
			iris: e,
			uri: e,
			urn: e
		}],
		as: c,
		asia: [1, {
			cloudns: t,
			daemon: t,
			dix: t
		}],
		at: [1, {
			4: t,
			ac: [1, { sth: e }],
			co: e,
			gv: e,
			or: e,
			funkfeuer: [0, { wien: t }],
			futurecms: [0, {
				"*": t,
				ex: i,
				in: i
			}],
			futurehosting: t,
			futuremailing: t,
			ortsinfo: [0, {
				ex: i,
				kunden: i
			}],
			biz: t,
			info: t,
			"123webseite": t,
			priv: t,
			my: t,
			myspreadshop: t,
			"12hp": t,
			"2ix": t,
			"4lima": t,
			"lima-city": t
		}],
		au: [1, {
			asn: e,
			com: [1, {
				cloudlets: [0, { mel: t }],
				myspreadshop: t
			}],
			edu: [1, {
				act: e,
				catholic: e,
				nsw: e,
				nt: e,
				qld: e,
				sa: e,
				tas: e,
				vic: e,
				wa: e
			}],
			gov: [1, {
				qld: e,
				sa: e,
				tas: e,
				vic: e,
				wa: e
			}],
			id: e,
			net: e,
			org: e,
			conf: e,
			oz: e,
			act: e,
			nsw: e,
			nt: e,
			qld: e,
			sa: e,
			tas: e,
			vic: e,
			wa: e,
			hrsn: [0, { vps: t }]
		}],
		aw: [1, { com: e }],
		ax: e,
		az: [1, {
			biz: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			int: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			pp: e,
			pro: e
		}],
		ba: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			brendly: _,
			rs: t
		}],
		bb: [1, {
			biz: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			net: e,
			org: e,
			store: e,
			tv: e
		}],
		bd: [1, {
			ac: e,
			ai: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			id: e,
			info: e,
			it: e,
			mil: e,
			net: e,
			org: e,
			sch: e,
			tv: e
		}],
		be: [1, {
			ac: e,
			cloudns: t,
			webhosting: t,
			interhostsolutions: [0, { cloud: t }],
			kuleuven: [0, { ezproxy: t }],
			my: t,
			"123website": t,
			myspreadshop: t,
			transurl: i
		}],
		bf: c,
		bg: [1, {
			0: e,
			1: e,
			2: e,
			3: e,
			4: e,
			5: e,
			6: e,
			7: e,
			8: e,
			9: e,
			a: e,
			b: e,
			c: e,
			d: e,
			e,
			f: e,
			g: e,
			h: e,
			i: e,
			j: e,
			k: e,
			l: e,
			m: e,
			n: e,
			o: e,
			p: e,
			q: e,
			r: e,
			s: e,
			t: e,
			u: e,
			v: e,
			w: e,
			x: e,
			y: e,
			z: e,
			barsy: t
		}],
		bh: n,
		bi: [1, {
			co: e,
			com: e,
			edu: e,
			or: e,
			org: e
		}],
		biz: [1, {
			activetrail: t,
			"cloud-ip": t,
			cloudns: t,
			jozi: t,
			dyndns: t,
			"for-better": t,
			"for-more": t,
			"for-some": t,
			"for-the": t,
			selfip: t,
			webhop: t,
			orx: t,
			mmafan: t,
			myftp: t,
			"no-ip": t,
			dscloud: t
		}],
		bj: [1, {
			africa: e,
			agro: e,
			architectes: e,
			assur: e,
			avocats: e,
			co: e,
			com: e,
			eco: e,
			econo: e,
			edu: e,
			info: e,
			loisirs: e,
			money: e,
			net: e,
			org: e,
			ote: e,
			restaurant: e,
			resto: e,
			tourism: e,
			univ: e
		}],
		bm: n,
		bn: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			co: t
		}],
		bo: [1, {
			com: e,
			edu: e,
			gob: e,
			int: e,
			mil: e,
			net: e,
			org: e,
			tv: e,
			web: e,
			academia: e,
			agro: e,
			arte: e,
			blog: e,
			bolivia: e,
			ciencia: e,
			cooperativa: e,
			democracia: e,
			deporte: e,
			ecologia: e,
			economia: e,
			empresa: e,
			indigena: e,
			industria: e,
			info: e,
			medicina: e,
			movimiento: e,
			musica: e,
			natural: e,
			nombre: e,
			noticias: e,
			patria: e,
			plurinacional: e,
			politica: e,
			profesional: e,
			pueblo: e,
			revista: e,
			salud: e,
			tecnologia: e,
			tksat: e,
			transporte: e,
			wiki: e
		}],
		br: [1, {
			"9guacu": e,
			abc: e,
			adm: e,
			adv: e,
			agr: e,
			aju: e,
			am: e,
			anani: e,
			aparecida: e,
			api: e,
			app: e,
			arq: e,
			art: e,
			ato: e,
			b: e,
			barueri: e,
			belem: e,
			bet: e,
			bhz: e,
			bib: e,
			bio: e,
			blog: e,
			bmd: e,
			boavista: e,
			bsb: e,
			campinagrande: e,
			campinas: e,
			caxias: e,
			cim: e,
			cng: e,
			cnt: e,
			com: [1, { simplesite: t }],
			contagem: e,
			coop: e,
			coz: e,
			cri: e,
			cuiaba: e,
			curitiba: e,
			def: e,
			des: e,
			det: e,
			dev: e,
			ecn: e,
			eco: e,
			edu: e,
			emp: e,
			enf: e,
			eng: e,
			esp: e,
			etc: e,
			eti: e,
			far: e,
			feira: e,
			flog: e,
			floripa: e,
			fm: e,
			fnd: e,
			fortal: e,
			fot: e,
			foz: e,
			fst: e,
			g12: e,
			geo: e,
			ggf: e,
			goiania: e,
			gov: [1, {
				ac: e,
				al: e,
				am: e,
				ap: e,
				ba: e,
				ce: e,
				df: e,
				es: e,
				go: e,
				ma: e,
				mg: e,
				ms: e,
				mt: e,
				pa: e,
				pb: e,
				pe: e,
				pi: e,
				pr: e,
				rj: e,
				rn: e,
				ro: e,
				rr: e,
				rs: e,
				sc: e,
				se: e,
				sp: e,
				to: e
			}],
			gru: e,
			ia: e,
			imb: e,
			ind: e,
			inf: e,
			jab: e,
			jampa: e,
			jdf: e,
			joinville: e,
			jor: e,
			jus: e,
			leg: [1, {
				ac: t,
				al: t,
				am: t,
				ap: t,
				ba: t,
				ce: t,
				df: t,
				es: t,
				go: t,
				ma: t,
				mg: t,
				ms: t,
				mt: t,
				pa: t,
				pb: t,
				pe: t,
				pi: t,
				pr: t,
				rj: t,
				rn: t,
				ro: t,
				rr: t,
				rs: t,
				sc: t,
				se: t,
				sp: t,
				to: t
			}],
			leilao: e,
			lel: e,
			log: e,
			londrina: e,
			macapa: e,
			maceio: e,
			manaus: e,
			maringa: e,
			mat: e,
			med: e,
			mil: e,
			morena: e,
			mp: e,
			mus: e,
			natal: e,
			net: e,
			niteroi: e,
			nom: v,
			not: e,
			ntr: e,
			odo: e,
			ong: e,
			org: e,
			osasco: e,
			palmas: e,
			poa: e,
			ppg: e,
			pro: e,
			psc: e,
			psi: e,
			pvh: e,
			qsl: e,
			radio: e,
			rec: e,
			recife: e,
			rep: e,
			ribeirao: e,
			rio: e,
			riobranco: e,
			riopreto: e,
			salvador: e,
			sampa: e,
			santamaria: e,
			santoandre: e,
			saobernardo: e,
			saogonca: e,
			seg: e,
			sjc: e,
			slg: e,
			slz: e,
			social: e,
			sorocaba: e,
			srv: e,
			taxi: e,
			tc: e,
			tec: e,
			teo: e,
			the: e,
			tmp: e,
			trd: e,
			tur: e,
			tv: e,
			udi: e,
			vet: e,
			vix: e,
			vlog: e,
			wiki: e,
			xyz: e,
			zlg: e,
			tche: t
		}],
		bs: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			we: t
		}],
		bt: n,
		bv: e,
		bw: [1, {
			ac: e,
			co: e,
			gov: e,
			net: e,
			org: e
		}],
		by: [1, {
			gov: e,
			mil: e,
			com: e,
			of: e,
			mediatech: t
		}],
		bz: [1, {
			co: e,
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			za: t,
			mydns: t,
			gsj: t
		}],
		ca: [1, {
			ab: e,
			bc: e,
			mb: e,
			nb: e,
			nf: e,
			nl: e,
			ns: e,
			nt: e,
			nu: e,
			on: e,
			pe: e,
			qc: e,
			sk: e,
			yk: e,
			gc: e,
			barsy: t,
			awdev: i,
			co: t,
			"no-ip": t,
			onid: t,
			myspreadshop: t,
			box: t
		}],
		cat: e,
		cc: [1, {
			cleverapps: t,
			"cloud-ip": t,
			cloudns: t,
			ccwu: t,
			ftpaccess: t,
			"game-server": t,
			myphotos: t,
			scrapping: t,
			twmail: t,
			csx: t,
			fantasyleague: t,
			spawn: [0, { instances: t }],
			ec: t,
			eu: t,
			gu: t,
			uk: t,
			us: t
		}],
		cd: [1, {
			gov: e,
			cc: t
		}],
		cf: e,
		cg: e,
		ch: [1, {
			square7: t,
			cloudns: t,
			cloudscale: [0, {
				cust: t,
				lpg: y,
				rma: y
			}],
			objectstorage: [0, {
				lpg: t,
				rma: t
			}],
			flow: [0, {
				ae: [0, { alp1: t }],
				appengine: t
			}],
			"linkyard-cloud": t,
			gotdns: t,
			dnsking: t,
			"123website": t,
			myspreadshop: t,
			firenet: [0, {
				"*": t,
				svc: i
			}],
			"12hp": t,
			"2ix": t,
			"4lima": t,
			"lima-city": t
		}],
		ci: [1, {
			ac: e,
			"xn--aroport-bya": e,
			aéroport: e,
			asso: e,
			co: e,
			com: e,
			ed: e,
			edu: e,
			go: e,
			gouv: e,
			int: e,
			net: e,
			or: e,
			org: e,
			us: t
		}],
		ck: v,
		cl: [1, {
			co: e,
			gob: e,
			gov: e,
			mil: e,
			cloudns: t
		}],
		cm: [1, {
			co: e,
			com: e,
			gov: e,
			net: e
		}],
		cn: [1, {
			ac: e,
			com: [1, {
				amazonaws: [0, {
					"cn-north-1": [0, {
						"execute-api": t,
						"emrappui-prod": t,
						"emrnotebooks-prod": t,
						"emrstudio-prod": t,
						rds: i,
						dualstack: ie,
						s3: t,
						"s3-accesspoint": t,
						"s3-deprecated": t,
						"s3-object-lambda": t,
						"s3-website": t
					}],
					"cn-northwest-1": [0, {
						"execute-api": t,
						"emrappui-prod": t,
						"emrnotebooks-prod": t,
						"emrstudio-prod": t,
						rds: i,
						dualstack: ae,
						s3: t,
						"s3-accesspoint": t,
						"s3-object-lambda": t,
						"s3-website": t
					}],
					compute: i,
					airflow: [0, {
						"cn-north-1": i,
						"cn-northwest-1": i
					}],
					eb: [0, {
						"cn-north-1": t,
						"cn-northwest-1": t
					}],
					elb: i
				}],
				amazonwebservices: [0, { on: [0, {
					"cn-north-1": u,
					"cn-northwest-1": u
				}] }],
				sagemaker: [0, {
					"cn-north-1": p,
					"cn-northwest-1": p
				}]
			}],
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			"xn--55qx5d": e,
			公司: e,
			"xn--od0alg": e,
			網絡: e,
			"xn--io0a7i": e,
			网络: e,
			ah: e,
			bj: e,
			cq: e,
			fj: e,
			gd: e,
			gs: e,
			gx: e,
			gz: e,
			ha: e,
			hb: e,
			he: e,
			hi: e,
			hk: e,
			hl: e,
			hn: e,
			jl: e,
			js: e,
			jx: e,
			ln: e,
			mo: e,
			nm: e,
			nx: e,
			qh: e,
			sc: e,
			sd: e,
			sh: [1, { as: t }],
			sn: e,
			sx: e,
			tj: e,
			tw: e,
			xj: e,
			xz: e,
			yn: e,
			zj: e,
			"canva-apps": t,
			canvasite: re,
			myqnapcloud: t,
			quickconnect: oe
		}],
		co: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			nom: e,
			org: e,
			carrd: t,
			crd: t,
			otap: i,
			hidns: t,
			leadpages: t,
			lpages: t,
			mypi: t,
			xmit: i,
			rdpa: [0, {
				clusters: i,
				srvrless: i
			}],
			firewalledreplit: s,
			repl: s,
			supabase: [2, {
				realtime: t,
				storage: t
			}],
			umso: t
		}],
		com: [1, {
			a2hosted: t,
			cpserver: t,
			adobeaemcloud: [2, { dev: i }],
			africa: t,
			auiusercontent: i,
			aivencloud: t,
			alibabacloudcs: t,
			kasserver: t,
			amazonaws: [0, {
				"af-south-1": S,
				"ap-east-1": ce,
				"ap-northeast-1": le,
				"ap-northeast-2": le,
				"ap-northeast-3": S,
				"ap-south-1": le,
				"ap-south-2": ue,
				"ap-southeast-1": le,
				"ap-southeast-2": le,
				"ap-southeast-3": ue,
				"ap-southeast-4": ue,
				"ap-southeast-5": [0, {
					"execute-api": t,
					dualstack: ie,
					s3: t,
					"s3-accesspoint": t,
					"s3-deprecated": t,
					"s3-object-lambda": t,
					"s3-website": t
				}],
				"ca-central-1": fe,
				"ca-west-1": pe,
				"eu-central-1": le,
				"eu-central-2": ue,
				"eu-north-1": ce,
				"eu-south-1": S,
				"eu-south-2": ue,
				"eu-west-1": [0, {
					"execute-api": t,
					"emrappui-prod": t,
					"emrnotebooks-prod": t,
					"emrstudio-prod": t,
					dualstack: ie,
					s3: t,
					"s3-accesspoint": t,
					"s3-deprecated": t,
					"s3-object-lambda": t,
					"s3-website": t,
					"analytics-gateway": t,
					"aws-cloud9": x,
					cloud9: se
				}],
				"eu-west-2": ce,
				"eu-west-3": S,
				"il-central-1": [0, {
					"execute-api": t,
					"emrappui-prod": t,
					"emrnotebooks-prod": t,
					"emrstudio-prod": t,
					dualstack: ie,
					s3: t,
					"s3-accesspoint": t,
					"s3-object-lambda": t,
					"s3-website": t,
					"aws-cloud9": x,
					cloud9: [0, { vfs: t }]
				}],
				"me-central-1": ue,
				"me-south-1": ce,
				"sa-east-1": S,
				"us-east-1": [2, {
					"execute-api": t,
					"emrappui-prod": t,
					"emrnotebooks-prod": t,
					"emrstudio-prod": t,
					dualstack: de,
					s3: t,
					"s3-accesspoint": t,
					"s3-accesspoint-fips": t,
					"s3-deprecated": t,
					"s3-fips": t,
					"s3-object-lambda": t,
					"s3-website": t,
					"analytics-gateway": t,
					"aws-cloud9": x,
					cloud9: se
				}],
				"us-east-2": me,
				"us-gov-east-1": pe,
				"us-gov-west-1": pe,
				"us-west-1": fe,
				"us-west-2": me,
				compute: i,
				"compute-1": i,
				airflow: [0, {
					"af-south-1": i,
					"ap-east-1": i,
					"ap-northeast-1": i,
					"ap-northeast-2": i,
					"ap-northeast-3": i,
					"ap-south-1": i,
					"ap-south-2": i,
					"ap-southeast-1": i,
					"ap-southeast-2": i,
					"ap-southeast-3": i,
					"ap-southeast-4": i,
					"ap-southeast-5": i,
					"ap-southeast-7": i,
					"ca-central-1": i,
					"ca-west-1": i,
					"eu-central-1": i,
					"eu-central-2": i,
					"eu-north-1": i,
					"eu-south-1": i,
					"eu-south-2": i,
					"eu-west-1": i,
					"eu-west-2": i,
					"eu-west-3": i,
					"il-central-1": i,
					"me-central-1": i,
					"me-south-1": i,
					"sa-east-1": i,
					"us-east-1": i,
					"us-east-2": i,
					"us-west-1": i,
					"us-west-2": i
				}],
				rds: [0, {
					"af-south-1": i,
					"ap-east-1": i,
					"ap-east-2": i,
					"ap-northeast-1": i,
					"ap-northeast-2": i,
					"ap-northeast-3": i,
					"ap-south-1": i,
					"ap-south-2": i,
					"ap-southeast-1": i,
					"ap-southeast-2": i,
					"ap-southeast-3": i,
					"ap-southeast-4": i,
					"ap-southeast-5": i,
					"ap-southeast-6": i,
					"ap-southeast-7": i,
					"ca-central-1": i,
					"ca-west-1": i,
					"eu-central-1": i,
					"eu-central-2": i,
					"eu-west-1": i,
					"eu-west-2": i,
					"eu-west-3": i,
					"il-central-1": i,
					"me-central-1": i,
					"me-south-1": i,
					"mx-central-1": i,
					"sa-east-1": i,
					"us-east-1": i,
					"us-east-2": i,
					"us-gov-east-1": i,
					"us-gov-west-1": i,
					"us-northeast-1": i,
					"us-west-1": i,
					"us-west-2": i
				}],
				s3: t,
				"s3-1": t,
				"s3-ap-east-1": t,
				"s3-ap-northeast-1": t,
				"s3-ap-northeast-2": t,
				"s3-ap-northeast-3": t,
				"s3-ap-south-1": t,
				"s3-ap-southeast-1": t,
				"s3-ap-southeast-2": t,
				"s3-ca-central-1": t,
				"s3-eu-central-1": t,
				"s3-eu-north-1": t,
				"s3-eu-west-1": t,
				"s3-eu-west-2": t,
				"s3-eu-west-3": t,
				"s3-external-1": t,
				"s3-fips-us-gov-east-1": t,
				"s3-fips-us-gov-west-1": t,
				"s3-global": [0, { accesspoint: [0, { mrap: t }] }],
				"s3-me-south-1": t,
				"s3-sa-east-1": t,
				"s3-us-east-2": t,
				"s3-us-gov-east-1": t,
				"s3-us-gov-west-1": t,
				"s3-us-west-1": t,
				"s3-us-west-2": t,
				"s3-website-ap-northeast-1": t,
				"s3-website-ap-southeast-1": t,
				"s3-website-ap-southeast-2": t,
				"s3-website-eu-west-1": t,
				"s3-website-sa-east-1": t,
				"s3-website-us-east-1": t,
				"s3-website-us-gov-west-1": t,
				"s3-website-us-west-1": t,
				"s3-website-us-west-2": t,
				elb: i
			}],
			amazoncognito: [0, {
				"af-south-1": C,
				"ap-east-1": C,
				"ap-northeast-1": C,
				"ap-northeast-2": C,
				"ap-northeast-3": C,
				"ap-south-1": C,
				"ap-south-2": C,
				"ap-southeast-1": C,
				"ap-southeast-2": C,
				"ap-southeast-3": C,
				"ap-southeast-4": C,
				"ap-southeast-5": C,
				"ap-southeast-7": C,
				"ca-central-1": C,
				"ca-west-1": C,
				"eu-central-1": C,
				"eu-central-2": C,
				"eu-north-1": C,
				"eu-south-1": C,
				"eu-south-2": C,
				"eu-west-1": C,
				"eu-west-2": C,
				"eu-west-3": C,
				"il-central-1": C,
				"me-central-1": C,
				"me-south-1": C,
				"mx-central-1": C,
				"sa-east-1": C,
				"us-east-1": he,
				"us-east-2": he,
				"us-gov-east-1": ge,
				"us-gov-west-1": ge,
				"us-west-1": he,
				"us-west-2": he
			}],
			amplifyapp: t,
			awsapprunner: i,
			awsapps: t,
			elasticbeanstalk: [2, {
				"af-south-1": t,
				"ap-east-1": t,
				"ap-northeast-1": t,
				"ap-northeast-2": t,
				"ap-northeast-3": t,
				"ap-south-1": t,
				"ap-southeast-1": t,
				"ap-southeast-2": t,
				"ap-southeast-3": t,
				"ap-southeast-5": t,
				"ap-southeast-7": t,
				"ca-central-1": t,
				"eu-central-1": t,
				"eu-north-1": t,
				"eu-south-1": t,
				"eu-south-2": t,
				"eu-west-1": t,
				"eu-west-2": t,
				"eu-west-3": t,
				"il-central-1": t,
				"me-central-1": t,
				"me-south-1": t,
				"sa-east-1": t,
				"us-east-1": t,
				"us-east-2": t,
				"us-gov-east-1": t,
				"us-gov-west-1": t,
				"us-west-1": t,
				"us-west-2": t
			}],
			awsglobalaccelerator: t,
			siiites: t,
			appspacehosted: t,
			appspaceusercontent: t,
			"on-aptible": t,
			myasustor: t,
			"balena-devices": t,
			boutir: t,
			bplaced: t,
			cafjs: t,
			"canva-apps": t,
			"canva-hosted-embed": t,
			canvacode: t,
			"rice-labs": t,
			"cdn77-storage": t,
			br: t,
			cn: t,
			de: t,
			eu: t,
			jpn: t,
			mex: t,
			ru: t,
			sa: t,
			uk: t,
			us: t,
			za: t,
			"clever-cloud": [0, { services: i }],
			abrdns: t,
			dnsabr: t,
			"ip-ddns": t,
			jdevcloud: t,
			wpdevcloud: t,
			"cf-ipfs": t,
			"cloudflare-ipfs": t,
			trycloudflare: t,
			co: t,
			devinapps: i,
			builtwithdark: t,
			datadetect: [0, {
				demo: t,
				instance: t
			}],
			dattolocal: t,
			dattorelay: t,
			dattoweb: t,
			mydatto: t,
			digitaloceanspaces: i,
			discordsays: t,
			discordsez: t,
			drayddns: t,
			dreamhosters: t,
			durumis: t,
			blogdns: t,
			cechire: t,
			dnsalias: t,
			dnsdojo: t,
			doesntexist: t,
			dontexist: t,
			doomdns: t,
			"dyn-o-saur": t,
			dynalias: t,
			"dyndns-at-home": t,
			"dyndns-at-work": t,
			"dyndns-blog": t,
			"dyndns-free": t,
			"dyndns-home": t,
			"dyndns-ip": t,
			"dyndns-mail": t,
			"dyndns-office": t,
			"dyndns-pics": t,
			"dyndns-remote": t,
			"dyndns-server": t,
			"dyndns-web": t,
			"dyndns-wiki": t,
			"dyndns-work": t,
			"est-a-la-maison": t,
			"est-a-la-masion": t,
			"est-le-patron": t,
			"est-mon-blogueur": t,
			"from-ak": t,
			"from-al": t,
			"from-ar": t,
			"from-ca": t,
			"from-ct": t,
			"from-dc": t,
			"from-de": t,
			"from-fl": t,
			"from-ga": t,
			"from-hi": t,
			"from-ia": t,
			"from-id": t,
			"from-il": t,
			"from-in": t,
			"from-ks": t,
			"from-ky": t,
			"from-ma": t,
			"from-md": t,
			"from-mi": t,
			"from-mn": t,
			"from-mo": t,
			"from-ms": t,
			"from-mt": t,
			"from-nc": t,
			"from-nd": t,
			"from-ne": t,
			"from-nh": t,
			"from-nj": t,
			"from-nm": t,
			"from-nv": t,
			"from-oh": t,
			"from-ok": t,
			"from-or": t,
			"from-pa": t,
			"from-pr": t,
			"from-ri": t,
			"from-sc": t,
			"from-sd": t,
			"from-tn": t,
			"from-tx": t,
			"from-ut": t,
			"from-va": t,
			"from-vt": t,
			"from-wa": t,
			"from-wi": t,
			"from-wv": t,
			"from-wy": t,
			getmyip: t,
			gotdns: t,
			"hobby-site": t,
			homelinux: t,
			homeunix: t,
			iamallama: t,
			"is-a-anarchist": t,
			"is-a-blogger": t,
			"is-a-bookkeeper": t,
			"is-a-bulls-fan": t,
			"is-a-caterer": t,
			"is-a-chef": t,
			"is-a-conservative": t,
			"is-a-cpa": t,
			"is-a-cubicle-slave": t,
			"is-a-democrat": t,
			"is-a-designer": t,
			"is-a-doctor": t,
			"is-a-financialadvisor": t,
			"is-a-geek": t,
			"is-a-green": t,
			"is-a-guru": t,
			"is-a-hard-worker": t,
			"is-a-hunter": t,
			"is-a-landscaper": t,
			"is-a-lawyer": t,
			"is-a-liberal": t,
			"is-a-libertarian": t,
			"is-a-llama": t,
			"is-a-musician": t,
			"is-a-nascarfan": t,
			"is-a-nurse": t,
			"is-a-painter": t,
			"is-a-personaltrainer": t,
			"is-a-photographer": t,
			"is-a-player": t,
			"is-a-republican": t,
			"is-a-rockstar": t,
			"is-a-socialist": t,
			"is-a-student": t,
			"is-a-teacher": t,
			"is-a-techie": t,
			"is-a-therapist": t,
			"is-an-accountant": t,
			"is-an-actor": t,
			"is-an-actress": t,
			"is-an-anarchist": t,
			"is-an-artist": t,
			"is-an-engineer": t,
			"is-an-entertainer": t,
			"is-certified": t,
			"is-gone": t,
			"is-into-anime": t,
			"is-into-cars": t,
			"is-into-cartoons": t,
			"is-into-games": t,
			"is-leet": t,
			"is-not-certified": t,
			"is-slick": t,
			"is-uberleet": t,
			"is-with-theband": t,
			"isa-geek": t,
			"isa-hockeynut": t,
			issmarterthanyou: t,
			"likes-pie": t,
			likescandy: t,
			"neat-url": t,
			"saves-the-whales": t,
			selfip: t,
			"sells-for-less": t,
			"sells-for-u": t,
			servebbs: t,
			"simple-url": t,
			"space-to-rent": t,
			"teaches-yoga": t,
			writesthisblog: t,
			"1cooldns": t,
			bumbleshrimp: t,
			ddnsfree: t,
			ddnsgeek: t,
			ddnsguru: t,
			dynuddns: t,
			dynuhosting: t,
			giize: t,
			gleeze: t,
			kozow: t,
			loseyourip: t,
			ooguy: t,
			pivohosting: t,
			theworkpc: t,
			wiredbladehosting: t,
			emergentagent: [0, { preview: t }],
			mytuleap: t,
			"tuleap-partners": t,
			encoreapi: t,
			evennode: [0, {
				"eu-1": t,
				"eu-2": t,
				"eu-3": t,
				"eu-4": t,
				"us-1": t,
				"us-2": t,
				"us-3": t,
				"us-4": t
			}],
			onfabrica: t,
			"fastly-edge": t,
			"fastly-terrarium": t,
			"fastvps-server": t,
			mydobiss: t,
			firebaseapp: t,
			fldrv: t,
			framercanvas: t,
			"freebox-os": t,
			freeboxos: t,
			freemyip: t,
			aliases121: t,
			gentapps: t,
			gentlentapis: t,
			githubusercontent: t,
			"0emm": i,
			appspot: [2, { r: i }],
			blogspot: t,
			codespot: t,
			googleapis: t,
			googlecode: t,
			pagespeedmobilizer: t,
			withgoogle: t,
			withyoutube: t,
			grayjayleagues: t,
			hatenablog: t,
			hatenadiary: t,
			"hercules-app": t,
			"hercules-dev": t,
			herokuapp: t,
			gr: t,
			smushcdn: t,
			wphostedmail: t,
			wpmucdn: t,
			pixolino: t,
			"apps-1and1": t,
			"live-website": t,
			"webspace-host": t,
			dopaas: t,
			"hosted-by-previder": ve,
			hosteur: [0, {
				"rag-cloud": t,
				"rag-cloud-ch": t
			}],
			"ik-server": [0, {
				jcloud: t,
				"jcloud-ver-jpc": t
			}],
			jelastic: [0, { demo: t }],
			massivegrid: ve,
			wafaicloud: [0, {
				jed: t,
				ryd: t
			}],
			"eu1-plenit": t,
			"la1-plenit": t,
			"us1-plenit": t,
			webadorsite: t,
			"on-forge": t,
			"on-vapor": t,
			lpusercontent: t,
			linode: [0, {
				members: t,
				nodebalancer: i
			}],
			linodeobjects: i,
			linodeusercontent: [0, { ip: t }],
			localtonet: t,
			lovableproject: t,
			barsycenter: t,
			barsyonline: t,
			lutrausercontent: i,
			magicpatternsapp: t,
			modelscape: t,
			mwcloudnonprod: t,
			polyspace: t,
			miniserver: t,
			atmeta: t,
			fbsbx: _e,
			meteorapp: ye,
			routingthecloud: t,
			"same-app": t,
			"same-preview": t,
			mydbserver: t,
			mochausercontent: t,
			hostedpi: t,
			"mythic-beasts": [0, {
				caracal: t,
				customer: t,
				fentiger: t,
				lynx: t,
				ocelot: t,
				oncilla: t,
				onza: t,
				sphinx: t,
				vs: t,
				x: t,
				yali: t
			}],
			nospamproxy: [0, { cloud: [2, { o365: t }] }],
			"4u": t,
			nfshost: t,
			"3utilities": t,
			blogsyte: t,
			ciscofreak: t,
			damnserver: t,
			ddnsking: t,
			ditchyourip: t,
			dnsiskinky: t,
			dynns: t,
			geekgalaxy: t,
			"health-carereform": t,
			homesecuritymac: t,
			homesecuritypc: t,
			myactivedirectory: t,
			mysecuritycamera: t,
			myvnc: t,
			"net-freaks": t,
			onthewifi: t,
			point2this: t,
			quicksytes: t,
			securitytactics: t,
			servebeer: t,
			servecounterstrike: t,
			serveexchange: t,
			serveftp: t,
			servegame: t,
			servehalflife: t,
			servehttp: t,
			servehumour: t,
			serveirc: t,
			servemp3: t,
			servep2p: t,
			servepics: t,
			servequake: t,
			servesarcasm: t,
			stufftoread: t,
			unusualperson: t,
			workisboring: t,
			myiphost: t,
			observableusercontent: [0, { static: t }],
			simplesite: t,
			oaiusercontent: i,
			orsites: t,
			operaunite: t,
			"customer-oci": [0, {
				"*": t,
				oci: i,
				ocp: i,
				ocs: i
			}],
			oraclecloudapps: i,
			oraclegovcloudapps: i,
			"authgear-staging": t,
			authgearapps: t,
			outsystemscloud: t,
			ownprovider: t,
			pgfog: t,
			pagexl: t,
			gotpantheon: t,
			paywhirl: i,
			forgeblocks: t,
			upsunapp: t,
			"postman-echo": t,
			prgmr: [0, { xen: t }],
			"project-study": [0, { dev: t }],
			pythonanywhere: ye,
			qa2: t,
			"alpha-myqnapcloud": t,
			"dev-myqnapcloud": t,
			mycloudnas: t,
			mynascloud: t,
			myqnapcloud: t,
			qualifioapp: t,
			ladesk: t,
			qualyhqpartner: i,
			qualyhqportal: i,
			qbuser: t,
			quipelements: i,
			rackmaze: t,
			"readthedocs-hosted": t,
			rhcloud: t,
			onrender: t,
			render: be,
			"subsc-pay": t,
			"180r": t,
			dojin: t,
			sakuratan: t,
			sakuraweb: t,
			x0: t,
			code: [0, {
				builder: i,
				"dev-builder": i,
				"stg-builder": i
			}],
			salesforce: [0, { platform: [0, { "code-builder-stg": [0, { test: [0, { "001": i }] }] }] }],
			logoip: t,
			scrysec: t,
			"firewall-gateway": t,
			myshopblocks: t,
			myshopify: t,
			shopitsite: t,
			"1kapp": t,
			appchizi: t,
			applinzi: t,
			sinaapp: t,
			vipsinaapp: t,
			streamlitapp: t,
			"try-snowplow": t,
			"playstation-cloud": t,
			myspreadshop: t,
			"w-corp-staticblitz": t,
			"w-credentialless-staticblitz": t,
			"w-staticblitz": t,
			"stackhero-network": t,
			stdlib: [0, { api: t }],
			strapiapp: [2, { media: t }],
			"streak-link": t,
			streaklinks: t,
			streakusercontent: t,
			"temp-dns": t,
			dsmynas: t,
			familyds: t,
			mytabit: t,
			taveusercontent: t,
			"tb-hosting": xe,
			reservd: t,
			thingdustdata: t,
			"townnews-staging": t,
			typeform: [0, { pro: t }],
			hk: t,
			it: t,
			"deus-canvas": t,
			vultrobjects: i,
			wafflecell: t,
			hotelwithflight: t,
			"reserve-online": t,
			cprapid: t,
			pleskns: t,
			remotewd: t,
			wiardweb: [0, { pages: t }],
			"drive-platform": t,
			"base44-sandbox": t,
			wixsite: t,
			wixstudio: t,
			messwithdns: t,
			"woltlab-demo": t,
			wpenginepowered: [2, { js: t }],
			xnbay: [2, {
				u2: t,
				"u2-local": t
			}],
			xtooldevice: t,
			yolasite: t
		}],
		coop: e,
		cr: [1, {
			ac: e,
			co: e,
			ed: e,
			fi: e,
			go: e,
			or: e,
			sa: e
		}],
		cu: [1, {
			com: e,
			edu: e,
			gob: e,
			inf: e,
			nat: e,
			net: e,
			org: e
		}],
		cv: [1, {
			com: e,
			edu: e,
			id: e,
			int: e,
			net: e,
			nome: e,
			org: e,
			publ: e
		}],
		cw: Se,
		cx: [1, {
			gov: e,
			cloudns: t,
			ath: t,
			info: t,
			assessments: t,
			calculators: t,
			funnels: t,
			paynow: t,
			quizzes: t,
			researched: t,
			tests: t
		}],
		cy: [1, {
			ac: e,
			biz: e,
			com: [1, { scaleforce: Ce }],
			ekloges: e,
			gov: e,
			ltd: e,
			mil: e,
			net: e,
			org: e,
			press: e,
			pro: e,
			tm: e
		}],
		cz: [1, {
			gov: e,
			contentproxy9: [0, { rsc: t }],
			realm: t,
			e4: t,
			co: t,
			metacentrum: [0, {
				cloud: i,
				custom: t
			}],
			muni: [0, { cloud: [0, {
				flt: t,
				usr: t
			}] }]
		}],
		de: [1, {
			bplaced: t,
			square7: t,
			"bwcloud-os-instance": i,
			com: t,
			cosidns: we,
			dnsupdater: t,
			"dynamisches-dns": t,
			"internet-dns": t,
			"l-o-g-i-n": t,
			ddnss: [2, {
				dyn: t,
				dyndns: t
			}],
			"dyn-ip24": t,
			dyndns1: t,
			"home-webserver": [2, { dyn: t }],
			"myhome-server": t,
			dnshome: t,
			fuettertdasnetz: t,
			isteingeek: t,
			istmein: t,
			lebtimnetz: t,
			leitungsen: t,
			traeumtgerade: t,
			frusky: i,
			goip: t,
			"xn--gnstigbestellen-zvb": t,
			günstigbestellen: t,
			"xn--gnstigliefern-wob": t,
			günstigliefern: t,
			"hs-heilbronn": [0, { it: [0, {
				pages: t,
				"pages-research": t
			}] }],
			"dyn-berlin": t,
			"in-berlin": t,
			"in-brb": t,
			"in-butter": t,
			"in-dsl": t,
			"in-vpn": t,
			iservschule: t,
			"mein-iserv": t,
			schuldock: t,
			schulplattform: t,
			schulserver: t,
			"test-iserv": t,
			keymachine: t,
			co: t,
			"git-repos": t,
			"lcube-server": t,
			"svn-repos": t,
			barsy: t,
			webspaceconfig: t,
			"123webseite": t,
			rub: t,
			"ruhr-uni-bochum": [2, { noc: [0, { io: t }] }],
			logoip: t,
			"firewall-gateway": t,
			"my-gateway": t,
			"my-router": t,
			spdns: t,
			my: t,
			speedpartner: [0, { customer: t }],
			myspreadshop: t,
			"taifun-dns": t,
			"12hp": t,
			"2ix": t,
			"4lima": t,
			"lima-city": t,
			"virtual-user": t,
			virtualuser: t,
			"community-pro": t,
			diskussionsbereich: t,
			xenonconnect: i
		}],
		dj: e,
		dk: [1, {
			biz: t,
			co: t,
			firm: t,
			reg: t,
			store: t,
			"123hjemmeside": t,
			myspreadshop: t
		}],
		dm: Ee,
		do: [1, {
			art: e,
			com: e,
			edu: e,
			gob: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			sld: e,
			web: e
		}],
		dz: [1, {
			art: e,
			asso: e,
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			pol: e,
			soc: e,
			tm: e
		}],
		ec: [1, {
			abg: e,
			adm: e,
			agron: e,
			arqt: e,
			art: e,
			bar: e,
			chef: e,
			com: e,
			cont: e,
			cpa: e,
			cue: e,
			dent: e,
			dgn: e,
			disco: e,
			doc: e,
			edu: e,
			eng: e,
			esm: e,
			fin: e,
			fot: e,
			gal: e,
			gob: e,
			gov: e,
			gye: e,
			ibr: e,
			info: e,
			k12: e,
			lat: e,
			loj: e,
			med: e,
			mil: e,
			mktg: e,
			mon: e,
			net: e,
			ntr: e,
			odont: e,
			org: e,
			pro: e,
			prof: e,
			psic: e,
			psiq: e,
			pub: e,
			rio: e,
			rrpp: e,
			sal: e,
			tech: e,
			tul: e,
			tur: e,
			uio: e,
			vet: e,
			xxx: e,
			base: t,
			official: t
		}],
		edu: [1, { rit: [0, { "git-pages": t }] }],
		ee: [1, {
			aip: e,
			com: e,
			edu: e,
			fie: e,
			gov: e,
			lib: e,
			med: e,
			org: e,
			pri: e,
			riik: e
		}],
		eg: [1, {
			ac: e,
			com: e,
			edu: e,
			eun: e,
			gov: e,
			info: e,
			me: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			sci: e,
			sport: e,
			tv: e
		}],
		er: v,
		es: [1, {
			com: e,
			edu: e,
			gob: e,
			nom: e,
			org: e,
			"123miweb": t,
			myspreadshop: t
		}],
		et: [1, {
			biz: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			name: e,
			net: e,
			org: e
		}],
		eu: [1, {
			amazonwebservices: [0, { on: [0, { "eusc-de-east-1": [0, { "cognito-idp": C }] }] }],
			cloudns: t,
			prvw: t,
			deuxfleurs: t,
			dogado: [0, { jelastic: t }],
			barsy: t,
			spdns: t,
			nxa: i,
			directwp: t,
			transurl: i
		}],
		fi: [1, {
			aland: e,
			dy: t,
			"xn--hkkinen-5wa": t,
			häkkinen: t,
			iki: t,
			cloudplatform: [0, { fi: t }],
			datacenter: [0, {
				demo: t,
				paas: t
			}],
			kapsi: t,
			"123kotisivu": t,
			myspreadshop: t
		}],
		fj: [1, {
			ac: e,
			biz: e,
			com: e,
			edu: e,
			gov: e,
			id: e,
			info: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			pro: e
		}],
		fk: v,
		fm: [1, {
			com: e,
			edu: e,
			net: e,
			org: e,
			radio: t,
			user: i
		}],
		fo: e,
		fr: [1, {
			asso: e,
			com: e,
			gouv: e,
			nom: e,
			prd: e,
			tm: e,
			avoues: e,
			cci: e,
			greta: e,
			"huissier-justice": e,
			"fbx-os": t,
			fbxos: t,
			"freebox-os": t,
			freeboxos: t,
			goupile: t,
			kdns: t,
			"123siteweb": t,
			"on-web": t,
			"chirurgiens-dentistes-en-france": t,
			dedibox: t,
			aeroport: t,
			avocat: t,
			chambagri: t,
			"chirurgiens-dentistes": t,
			"experts-comptables": t,
			medecin: t,
			notaires: t,
			pharmacien: t,
			port: t,
			veterinaire: t,
			myspreadshop: t,
			ynh: t
		}],
		ga: e,
		gb: e,
		gd: [1, {
			edu: e,
			gov: e
		}],
		ge: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			pvt: e,
			school: e
		}],
		gf: e,
		gg: [1, {
			co: e,
			net: e,
			org: e,
			ply: [0, {
				at: i,
				d6: t
			}],
			botdash: t,
			kaas: t,
			stackit: t,
			panel: [2, { daemon: t }]
		}],
		gh: [1, {
			biz: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e
		}],
		gi: [1, {
			com: e,
			edu: e,
			gov: e,
			ltd: e,
			mod: e,
			org: e
		}],
		gl: [1, {
			co: e,
			com: e,
			edu: e,
			net: e,
			org: e
		}],
		gm: e,
		gn: [1, {
			ac: e,
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e
		}],
		gov: e,
		gp: [1, {
			asso: e,
			com: e,
			edu: e,
			mobi: e,
			net: e,
			org: e
		}],
		gq: e,
		gr: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			barsy: t,
			simplesite: t
		}],
		gs: e,
		gt: [1, {
			com: e,
			edu: e,
			gob: e,
			ind: e,
			mil: e,
			net: e,
			org: e
		}],
		gu: [1, {
			com: e,
			edu: e,
			gov: e,
			guam: e,
			info: e,
			net: e,
			org: e,
			web: e
		}],
		gw: [1, { nx: t }],
		gy: Ee,
		hk: [1, {
			com: e,
			edu: e,
			gov: e,
			idv: e,
			net: e,
			org: e,
			"xn--ciqpn": e,
			个人: e,
			"xn--gmqw5a": e,
			個人: e,
			"xn--55qx5d": e,
			公司: e,
			"xn--mxtq1m": e,
			政府: e,
			"xn--lcvr32d": e,
			敎育: e,
			"xn--wcvs22d": e,
			教育: e,
			"xn--gmq050i": e,
			箇人: e,
			"xn--uc0atv": e,
			組織: e,
			"xn--uc0ay4a": e,
			組织: e,
			"xn--od0alg": e,
			網絡: e,
			"xn--zf0avx": e,
			網络: e,
			"xn--mk0axi": e,
			组織: e,
			"xn--tn0ag": e,
			组织: e,
			"xn--od0aq3b": e,
			网絡: e,
			"xn--io0a7i": e,
			网络: e,
			inc: t,
			ltd: t
		}],
		hm: e,
		hn: [1, {
			com: e,
			edu: e,
			gob: e,
			mil: e,
			net: e,
			org: e
		}],
		hr: [1, {
			com: e,
			from: e,
			iz: e,
			name: e,
			brendly: _
		}],
		ht: [1, {
			adult: e,
			art: e,
			asso: e,
			com: e,
			coop: e,
			edu: e,
			firm: e,
			gouv: e,
			info: e,
			med: e,
			net: e,
			org: e,
			perso: e,
			pol: e,
			pro: e,
			rel: e,
			shop: e,
			rt: t
		}],
		hu: [1, {
			2e3: e,
			agrar: e,
			bolt: e,
			casino: e,
			city: e,
			co: e,
			erotica: e,
			erotika: e,
			film: e,
			forum: e,
			games: e,
			hotel: e,
			info: e,
			ingatlan: e,
			jogasz: e,
			konyvelo: e,
			lakas: e,
			media: e,
			news: e,
			org: e,
			priv: e,
			reklam: e,
			sex: e,
			shop: e,
			sport: e,
			suli: e,
			szex: e,
			tm: e,
			tozsde: e,
			utazas: e,
			video: e
		}],
		id: [1, {
			ac: e,
			biz: e,
			co: e,
			desa: e,
			go: e,
			kop: e,
			mil: e,
			my: e,
			net: e,
			or: e,
			ponpes: e,
			sch: e,
			web: e,
			"xn--9tfky": e,
			ᬩᬮᬶ: e,
			e: t,
			zone: t
		}],
		ie: [1, {
			gov: e,
			myspreadshop: t
		}],
		il: [1, {
			ac: e,
			co: [1, {
				ravpage: t,
				mytabit: t,
				tabitorder: t
			}],
			gov: e,
			idf: e,
			k12: e,
			muni: e,
			net: e,
			org: e
		}],
		"xn--4dbrk0ce": [1, {
			"xn--4dbgdty6c": e,
			"xn--5dbhl8d": e,
			"xn--8dbq2a": e,
			"xn--hebda8b": e
		}],
		ישראל: [1, {
			אקדמיה: e,
			ישוב: e,
			צהל: e,
			ממשל: e
		}],
		im: [1, {
			ac: e,
			co: [1, {
				ltd: e,
				plc: e
			}],
			com: e,
			net: e,
			org: e,
			tt: e,
			tv: e
		}],
		in: [1, {
			"5g": e,
			"6g": e,
			ac: e,
			ai: e,
			am: e,
			bank: e,
			bihar: e,
			biz: e,
			business: e,
			ca: e,
			cn: e,
			co: e,
			com: e,
			coop: e,
			cs: e,
			delhi: e,
			dr: e,
			edu: e,
			er: e,
			fin: e,
			firm: e,
			gen: e,
			gov: e,
			gujarat: e,
			ind: e,
			info: e,
			int: e,
			internet: e,
			io: e,
			me: e,
			mil: e,
			net: e,
			nic: e,
			org: e,
			pg: e,
			post: e,
			pro: e,
			res: e,
			travel: e,
			tv: e,
			uk: e,
			up: e,
			us: e,
			cloudns: t,
			barsy: t,
			web: t,
			indevs: t,
			supabase: t
		}],
		info: [1, {
			cloudns: t,
			"dynamic-dns": t,
			"barrel-of-knowledge": t,
			"barrell-of-knowledge": t,
			dyndns: t,
			"for-our": t,
			"groks-the": t,
			"groks-this": t,
			"here-for-more": t,
			knowsitall: t,
			selfip: t,
			webhop: t,
			barsy: t,
			mayfirst: t,
			mittwald: t,
			mittwaldserver: t,
			typo3server: t,
			dvrcam: t,
			ilovecollege: t,
			"no-ip": t,
			forumz: t,
			nsupdate: t,
			dnsupdate: t,
			"v-info": t
		}],
		int: [1, { eu: e }],
		io: [1, {
			2038: t,
			co: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			nom: e,
			org: e,
			"on-acorn": i,
			myaddr: t,
			apigee: t,
			"b-data": t,
			beagleboard: t,
			bitbucket: t,
			bluebite: t,
			boxfuse: t,
			brave: a,
			browsersafetymark: t,
			bubble: w,
			bubbleapps: t,
			bigv: [0, { uk0: t }],
			cleverapps: t,
			cloudbeesusercontent: t,
			dappnode: [0, { dyndns: t }],
			darklang: t,
			definima: t,
			dedyn: t,
			icp0: T,
			icp1: T,
			qzz: t,
			"fh-muenster": t,
			gitbook: t,
			github: t,
			gitlab: t,
			lolipop: t,
			"hasura-app": t,
			hostyhosting: t,
			hypernode: t,
			moonscale: i,
			beebyte: ve,
			beebyteapp: [0, { sekd1: t }],
			jele: t,
			keenetic: t,
			kiloapps: t,
			webthings: t,
			loginline: t,
			barsy: t,
			azurecontainer: i,
			ngrok: [2, {
				ap: t,
				au: t,
				eu: t,
				in: t,
				jp: t,
				sa: t,
				us: t
			}],
			nodeart: [0, { stage: t }],
			pantheonsite: t,
			forgerock: [0, { id: t }],
			pstmn: [2, { mock: t }],
			protonet: t,
			qcx: [2, { sys: i }],
			qoto: t,
			vaporcloud: t,
			myrdbx: t,
			"rb-hosting": xe,
			"on-k3s": i,
			"on-rio": i,
			readthedocs: t,
			resindevice: t,
			resinstaging: [0, { devices: t }],
			hzc: t,
			sandcats: t,
			scrypted: [0, { client: t }],
			"mo-siemens": t,
			lair: _e,
			stolos: i,
			musician: t,
			utwente: t,
			edugit: t,
			telebit: t,
			thingdust: [0, {
				dev: Ae,
				disrec: Ae,
				prod: je,
				testing: Ae
			}],
			tickets: t,
			webflow: t,
			webflowtest: t,
			"drive-platform": t,
			editorx: t,
			wixstudio: t,
			basicserver: t,
			virtualserver: t
		}],
		iq: r,
		ir: [1, {
			ac: e,
			co: e,
			gov: e,
			id: e,
			net: e,
			org: e,
			sch: e,
			"xn--mgba3a4f16a": e,
			ایران: e,
			"xn--mgba3a4fra": e,
			ايران: e,
			arvanedge: t,
			vistablog: t
		}],
		is: e,
		it: [1, {
			edu: e,
			gov: e,
			abr: e,
			abruzzo: e,
			"aosta-valley": e,
			aostavalley: e,
			bas: e,
			basilicata: e,
			cal: e,
			calabria: e,
			cam: e,
			campania: e,
			"emilia-romagna": e,
			emiliaromagna: e,
			emr: e,
			"friuli-v-giulia": e,
			"friuli-ve-giulia": e,
			"friuli-vegiulia": e,
			"friuli-venezia-giulia": e,
			"friuli-veneziagiulia": e,
			"friuli-vgiulia": e,
			"friuliv-giulia": e,
			"friulive-giulia": e,
			friulivegiulia: e,
			"friulivenezia-giulia": e,
			friuliveneziagiulia: e,
			friulivgiulia: e,
			fvg: e,
			laz: e,
			lazio: e,
			lig: e,
			liguria: e,
			lom: e,
			lombardia: e,
			lombardy: e,
			lucania: e,
			mar: e,
			marche: e,
			mol: e,
			molise: e,
			piedmont: e,
			piemonte: e,
			pmn: e,
			pug: e,
			puglia: e,
			sar: e,
			sardegna: e,
			sardinia: e,
			sic: e,
			sicilia: e,
			sicily: e,
			taa: e,
			tos: e,
			toscana: e,
			"trentin-sud-tirol": e,
			"xn--trentin-sd-tirol-rzb": e,
			"trentin-süd-tirol": e,
			"trentin-sudtirol": e,
			"xn--trentin-sdtirol-7vb": e,
			"trentin-südtirol": e,
			"trentin-sued-tirol": e,
			"trentin-suedtirol": e,
			trentino: e,
			"trentino-a-adige": e,
			"trentino-aadige": e,
			"trentino-alto-adige": e,
			"trentino-altoadige": e,
			"trentino-s-tirol": e,
			"trentino-stirol": e,
			"trentino-sud-tirol": e,
			"xn--trentino-sd-tirol-c3b": e,
			"trentino-süd-tirol": e,
			"trentino-sudtirol": e,
			"xn--trentino-sdtirol-szb": e,
			"trentino-südtirol": e,
			"trentino-sued-tirol": e,
			"trentino-suedtirol": e,
			"trentinoa-adige": e,
			trentinoaadige: e,
			"trentinoalto-adige": e,
			trentinoaltoadige: e,
			"trentinos-tirol": e,
			trentinostirol: e,
			"trentinosud-tirol": e,
			"xn--trentinosd-tirol-rzb": e,
			"trentinosüd-tirol": e,
			trentinosudtirol: e,
			"xn--trentinosdtirol-7vb": e,
			trentinosüdtirol: e,
			"trentinosued-tirol": e,
			trentinosuedtirol: e,
			"trentinsud-tirol": e,
			"xn--trentinsd-tirol-6vb": e,
			"trentinsüd-tirol": e,
			trentinsudtirol: e,
			"xn--trentinsdtirol-nsb": e,
			trentinsüdtirol: e,
			"trentinsued-tirol": e,
			trentinsuedtirol: e,
			tuscany: e,
			umb: e,
			umbria: e,
			"val-d-aosta": e,
			"val-daosta": e,
			"vald-aosta": e,
			valdaosta: e,
			"valle-aosta": e,
			"valle-d-aosta": e,
			"valle-daosta": e,
			valleaosta: e,
			"valled-aosta": e,
			valledaosta: e,
			"vallee-aoste": e,
			"xn--valle-aoste-ebb": e,
			"vallée-aoste": e,
			"vallee-d-aoste": e,
			"xn--valle-d-aoste-ehb": e,
			"vallée-d-aoste": e,
			valleeaoste: e,
			"xn--valleaoste-e7a": e,
			valléeaoste: e,
			valleedaoste: e,
			"xn--valledaoste-ebb": e,
			valléedaoste: e,
			vao: e,
			vda: e,
			ven: e,
			veneto: e,
			ag: e,
			agrigento: e,
			al: e,
			alessandria: e,
			"alto-adige": e,
			altoadige: e,
			an: e,
			ancona: e,
			"andria-barletta-trani": e,
			"andria-trani-barletta": e,
			andriabarlettatrani: e,
			andriatranibarletta: e,
			ao: e,
			aosta: e,
			aoste: e,
			ap: e,
			aq: e,
			aquila: e,
			ar: e,
			arezzo: e,
			"ascoli-piceno": e,
			ascolipiceno: e,
			asti: e,
			at: e,
			av: e,
			avellino: e,
			ba: e,
			balsan: e,
			"balsan-sudtirol": e,
			"xn--balsan-sdtirol-nsb": e,
			"balsan-südtirol": e,
			"balsan-suedtirol": e,
			bari: e,
			"barletta-trani-andria": e,
			barlettatraniandria: e,
			belluno: e,
			benevento: e,
			bergamo: e,
			bg: e,
			bi: e,
			biella: e,
			bl: e,
			bn: e,
			bo: e,
			bologna: e,
			bolzano: e,
			"bolzano-altoadige": e,
			bozen: e,
			"bozen-sudtirol": e,
			"xn--bozen-sdtirol-2ob": e,
			"bozen-südtirol": e,
			"bozen-suedtirol": e,
			br: e,
			brescia: e,
			brindisi: e,
			bs: e,
			bt: e,
			bulsan: e,
			"bulsan-sudtirol": e,
			"xn--bulsan-sdtirol-nsb": e,
			"bulsan-südtirol": e,
			"bulsan-suedtirol": e,
			bz: e,
			ca: e,
			cagliari: e,
			caltanissetta: e,
			"campidano-medio": e,
			campidanomedio: e,
			campobasso: e,
			"carbonia-iglesias": e,
			carboniaiglesias: e,
			"carrara-massa": e,
			carraramassa: e,
			caserta: e,
			catania: e,
			catanzaro: e,
			cb: e,
			ce: e,
			"cesena-forli": e,
			"xn--cesena-forl-mcb": e,
			"cesena-forlì": e,
			cesenaforli: e,
			"xn--cesenaforl-i8a": e,
			cesenaforlì: e,
			ch: e,
			chieti: e,
			ci: e,
			cl: e,
			cn: e,
			co: e,
			como: e,
			cosenza: e,
			cr: e,
			cremona: e,
			crotone: e,
			cs: e,
			ct: e,
			cuneo: e,
			cz: e,
			"dell-ogliastra": e,
			dellogliastra: e,
			en: e,
			enna: e,
			fc: e,
			fe: e,
			fermo: e,
			ferrara: e,
			fg: e,
			fi: e,
			firenze: e,
			florence: e,
			fm: e,
			foggia: e,
			"forli-cesena": e,
			"xn--forl-cesena-fcb": e,
			"forlì-cesena": e,
			forlicesena: e,
			"xn--forlcesena-c8a": e,
			forlìcesena: e,
			fr: e,
			frosinone: e,
			ge: e,
			genoa: e,
			genova: e,
			go: e,
			gorizia: e,
			gr: e,
			grosseto: e,
			"iglesias-carbonia": e,
			iglesiascarbonia: e,
			im: e,
			imperia: e,
			is: e,
			isernia: e,
			kr: e,
			"la-spezia": e,
			laquila: e,
			laspezia: e,
			latina: e,
			lc: e,
			le: e,
			lecce: e,
			lecco: e,
			li: e,
			livorno: e,
			lo: e,
			lodi: e,
			lt: e,
			lu: e,
			lucca: e,
			macerata: e,
			mantova: e,
			"massa-carrara": e,
			massacarrara: e,
			matera: e,
			mb: e,
			mc: e,
			me: e,
			"medio-campidano": e,
			mediocampidano: e,
			messina: e,
			mi: e,
			milan: e,
			milano: e,
			mn: e,
			mo: e,
			modena: e,
			monza: e,
			"monza-brianza": e,
			"monza-e-della-brianza": e,
			monzabrianza: e,
			monzaebrianza: e,
			monzaedellabrianza: e,
			ms: e,
			mt: e,
			na: e,
			naples: e,
			napoli: e,
			no: e,
			novara: e,
			nu: e,
			nuoro: e,
			og: e,
			ogliastra: e,
			"olbia-tempio": e,
			olbiatempio: e,
			or: e,
			oristano: e,
			ot: e,
			pa: e,
			padova: e,
			padua: e,
			palermo: e,
			parma: e,
			pavia: e,
			pc: e,
			pd: e,
			pe: e,
			perugia: e,
			"pesaro-urbino": e,
			pesarourbino: e,
			pescara: e,
			pg: e,
			pi: e,
			piacenza: e,
			pisa: e,
			pistoia: e,
			pn: e,
			po: e,
			pordenone: e,
			potenza: e,
			pr: e,
			prato: e,
			pt: e,
			pu: e,
			pv: e,
			pz: e,
			ra: e,
			ragusa: e,
			ravenna: e,
			rc: e,
			re: e,
			"reggio-calabria": e,
			"reggio-emilia": e,
			reggiocalabria: e,
			reggioemilia: e,
			rg: e,
			ri: e,
			rieti: e,
			rimini: e,
			rm: e,
			rn: e,
			ro: e,
			roma: e,
			rome: e,
			rovigo: e,
			sa: e,
			salerno: e,
			sassari: e,
			savona: e,
			si: e,
			siena: e,
			siracusa: e,
			so: e,
			sondrio: e,
			sp: e,
			sr: e,
			ss: e,
			"xn--sdtirol-n2a": e,
			südtirol: e,
			suedtirol: e,
			sv: e,
			ta: e,
			taranto: e,
			te: e,
			"tempio-olbia": e,
			tempioolbia: e,
			teramo: e,
			terni: e,
			tn: e,
			to: e,
			torino: e,
			tp: e,
			tr: e,
			"trani-andria-barletta": e,
			"trani-barletta-andria": e,
			traniandriabarletta: e,
			tranibarlettaandria: e,
			trapani: e,
			trento: e,
			treviso: e,
			trieste: e,
			ts: e,
			turin: e,
			tv: e,
			ud: e,
			udine: e,
			"urbino-pesaro": e,
			urbinopesaro: e,
			va: e,
			varese: e,
			vb: e,
			vc: e,
			ve: e,
			venezia: e,
			venice: e,
			verbania: e,
			vercelli: e,
			verona: e,
			vi: e,
			"vibo-valentia": e,
			vibovalentia: e,
			vicenza: e,
			viterbo: e,
			vr: e,
			vs: e,
			vt: e,
			vv: e,
			ibxos: t,
			iliadboxos: t,
			neen: [0, { jc: t }],
			"123homepage": t,
			"16-b": t,
			"32-b": t,
			"64-b": t,
			myspreadshop: t,
			syncloud: t
		}],
		je: [1, {
			co: e,
			net: e,
			org: e,
			of: t
		}],
		jm: v,
		jo: [1, {
			agri: e,
			ai: e,
			com: e,
			edu: e,
			eng: e,
			fm: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			per: e,
			phd: e,
			sch: e,
			tv: e
		}],
		jobs: e,
		jp: [1, {
			ac: e,
			ad: e,
			co: e,
			ed: e,
			go: e,
			gr: e,
			lg: e,
			ne: [1, {
				aseinet: Oe,
				gehirn: t,
				ivory: t,
				"mail-box": t,
				mints: t,
				mokuren: t,
				opal: t,
				sakura: t,
				sumomo: t,
				topaz: t
			}],
			or: e,
			aichi: [1, {
				aisai: e,
				ama: e,
				anjo: e,
				asuke: e,
				chiryu: e,
				chita: e,
				fuso: e,
				gamagori: e,
				handa: e,
				hazu: e,
				hekinan: e,
				higashiura: e,
				ichinomiya: e,
				inazawa: e,
				inuyama: e,
				isshiki: e,
				iwakura: e,
				kanie: e,
				kariya: e,
				kasugai: e,
				kira: e,
				kiyosu: e,
				komaki: e,
				konan: e,
				kota: e,
				mihama: e,
				miyoshi: e,
				nishio: e,
				nisshin: e,
				obu: e,
				oguchi: e,
				oharu: e,
				okazaki: e,
				owariasahi: e,
				seto: e,
				shikatsu: e,
				shinshiro: e,
				shitara: e,
				tahara: e,
				takahama: e,
				tobishima: e,
				toei: e,
				togo: e,
				tokai: e,
				tokoname: e,
				toyoake: e,
				toyohashi: e,
				toyokawa: e,
				toyone: e,
				toyota: e,
				tsushima: e,
				yatomi: e
			}],
			akita: [1, {
				akita: e,
				daisen: e,
				fujisato: e,
				gojome: e,
				hachirogata: e,
				happou: e,
				higashinaruse: e,
				honjo: e,
				honjyo: e,
				ikawa: e,
				kamikoani: e,
				kamioka: e,
				katagami: e,
				kazuno: e,
				kitaakita: e,
				kosaka: e,
				kyowa: e,
				misato: e,
				mitane: e,
				moriyoshi: e,
				nikaho: e,
				noshiro: e,
				odate: e,
				oga: e,
				ogata: e,
				semboku: e,
				yokote: e,
				yurihonjo: e
			}],
			aomori: [1, {
				aomori: e,
				gonohe: e,
				hachinohe: e,
				hashikami: e,
				hiranai: e,
				hirosaki: e,
				itayanagi: e,
				kuroishi: e,
				misawa: e,
				mutsu: e,
				nakadomari: e,
				noheji: e,
				oirase: e,
				owani: e,
				rokunohe: e,
				sannohe: e,
				shichinohe: e,
				shingo: e,
				takko: e,
				towada: e,
				tsugaru: e,
				tsuruta: e
			}],
			chiba: [1, {
				abiko: e,
				asahi: e,
				chonan: e,
				chosei: e,
				choshi: e,
				chuo: e,
				funabashi: e,
				futtsu: e,
				hanamigawa: e,
				ichihara: e,
				ichikawa: e,
				ichinomiya: e,
				inzai: e,
				isumi: e,
				kamagaya: e,
				kamogawa: e,
				kashiwa: e,
				katori: e,
				katsuura: e,
				kimitsu: e,
				kisarazu: e,
				kozaki: e,
				kujukuri: e,
				kyonan: e,
				matsudo: e,
				midori: e,
				mihama: e,
				minamiboso: e,
				mobara: e,
				mutsuzawa: e,
				nagara: e,
				nagareyama: e,
				narashino: e,
				narita: e,
				noda: e,
				oamishirasato: e,
				omigawa: e,
				onjuku: e,
				otaki: e,
				sakae: e,
				sakura: e,
				shimofusa: e,
				shirako: e,
				shiroi: e,
				shisui: e,
				sodegaura: e,
				sosa: e,
				tako: e,
				tateyama: e,
				togane: e,
				tohnosho: e,
				tomisato: e,
				urayasu: e,
				yachimata: e,
				yachiyo: e,
				yokaichiba: e,
				yokoshibahikari: e,
				yotsukaido: e
			}],
			ehime: [1, {
				ainan: e,
				honai: e,
				ikata: e,
				imabari: e,
				iyo: e,
				kamijima: e,
				kihoku: e,
				kumakogen: e,
				masaki: e,
				matsuno: e,
				matsuyama: e,
				namikata: e,
				niihama: e,
				ozu: e,
				saijo: e,
				seiyo: e,
				shikokuchuo: e,
				tobe: e,
				toon: e,
				uchiko: e,
				uwajima: e,
				yawatahama: e
			}],
			fukui: [1, {
				echizen: e,
				eiheiji: e,
				fukui: e,
				ikeda: e,
				katsuyama: e,
				mihama: e,
				minamiechizen: e,
				obama: e,
				ohi: e,
				ono: e,
				sabae: e,
				sakai: e,
				takahama: e,
				tsuruga: e,
				wakasa: e
			}],
			fukuoka: [1, {
				ashiya: e,
				buzen: e,
				chikugo: e,
				chikuho: e,
				chikujo: e,
				chikushino: e,
				chikuzen: e,
				chuo: e,
				dazaifu: e,
				fukuchi: e,
				hakata: e,
				higashi: e,
				hirokawa: e,
				hisayama: e,
				iizuka: e,
				inatsuki: e,
				kaho: e,
				kasuga: e,
				kasuya: e,
				kawara: e,
				keisen: e,
				koga: e,
				kurate: e,
				kurogi: e,
				kurume: e,
				minami: e,
				miyako: e,
				miyama: e,
				miyawaka: e,
				mizumaki: e,
				munakata: e,
				nakagawa: e,
				nakama: e,
				nishi: e,
				nogata: e,
				ogori: e,
				okagaki: e,
				okawa: e,
				oki: e,
				omuta: e,
				onga: e,
				onojo: e,
				oto: e,
				saigawa: e,
				sasaguri: e,
				shingu: e,
				shinyoshitomi: e,
				shonai: e,
				soeda: e,
				sue: e,
				tachiarai: e,
				tagawa: e,
				takata: e,
				toho: e,
				toyotsu: e,
				tsuiki: e,
				ukiha: e,
				umi: e,
				usui: e,
				yamada: e,
				yame: e,
				yanagawa: e,
				yukuhashi: e
			}],
			fukushima: [1, {
				aizubange: e,
				aizumisato: e,
				aizuwakamatsu: e,
				asakawa: e,
				bandai: e,
				date: e,
				fukushima: e,
				furudono: e,
				futaba: e,
				hanawa: e,
				higashi: e,
				hirata: e,
				hirono: e,
				iitate: e,
				inawashiro: e,
				ishikawa: e,
				iwaki: e,
				izumizaki: e,
				kagamiishi: e,
				kaneyama: e,
				kawamata: e,
				kitakata: e,
				kitashiobara: e,
				koori: e,
				koriyama: e,
				kunimi: e,
				miharu: e,
				mishima: e,
				namie: e,
				nango: e,
				nishiaizu: e,
				nishigo: e,
				okuma: e,
				omotego: e,
				ono: e,
				otama: e,
				samegawa: e,
				shimogo: e,
				shirakawa: e,
				showa: e,
				soma: e,
				sukagawa: e,
				taishin: e,
				tamakawa: e,
				tanagura: e,
				tenei: e,
				yabuki: e,
				yamato: e,
				yamatsuri: e,
				yanaizu: e,
				yugawa: e
			}],
			gifu: [1, {
				anpachi: e,
				ena: e,
				gifu: e,
				ginan: e,
				godo: e,
				gujo: e,
				hashima: e,
				hichiso: e,
				hida: e,
				higashishirakawa: e,
				ibigawa: e,
				ikeda: e,
				kakamigahara: e,
				kani: e,
				kasahara: e,
				kasamatsu: e,
				kawaue: e,
				kitagata: e,
				mino: e,
				minokamo: e,
				mitake: e,
				mizunami: e,
				motosu: e,
				nakatsugawa: e,
				ogaki: e,
				sakahogi: e,
				seki: e,
				sekigahara: e,
				shirakawa: e,
				tajimi: e,
				takayama: e,
				tarui: e,
				toki: e,
				tomika: e,
				wanouchi: e,
				yamagata: e,
				yaotsu: e,
				yoro: e
			}],
			gunma: [1, {
				annaka: e,
				chiyoda: e,
				fujioka: e,
				higashiagatsuma: e,
				isesaki: e,
				itakura: e,
				kanna: e,
				kanra: e,
				katashina: e,
				kawaba: e,
				kiryu: e,
				kusatsu: e,
				maebashi: e,
				meiwa: e,
				midori: e,
				minakami: e,
				naganohara: e,
				nakanojo: e,
				nanmoku: e,
				numata: e,
				oizumi: e,
				ora: e,
				ota: e,
				shibukawa: e,
				shimonita: e,
				shinto: e,
				showa: e,
				takasaki: e,
				takayama: e,
				tamamura: e,
				tatebayashi: e,
				tomioka: e,
				tsukiyono: e,
				tsumagoi: e,
				ueno: e,
				yoshioka: e
			}],
			hiroshima: [1, {
				asaminami: e,
				daiwa: e,
				etajima: e,
				fuchu: e,
				fukuyama: e,
				hatsukaichi: e,
				higashihiroshima: e,
				hongo: e,
				jinsekikogen: e,
				kaita: e,
				kui: e,
				kumano: e,
				kure: e,
				mihara: e,
				miyoshi: e,
				naka: e,
				onomichi: e,
				osakikamijima: e,
				otake: e,
				saka: e,
				sera: e,
				seranishi: e,
				shinichi: e,
				shobara: e,
				takehara: e
			}],
			hokkaido: [1, {
				abashiri: e,
				abira: e,
				aibetsu: e,
				akabira: e,
				akkeshi: e,
				asahikawa: e,
				ashibetsu: e,
				ashoro: e,
				assabu: e,
				atsuma: e,
				bibai: e,
				biei: e,
				bifuka: e,
				bihoro: e,
				biratori: e,
				chippubetsu: e,
				chitose: e,
				date: e,
				ebetsu: e,
				embetsu: e,
				eniwa: e,
				erimo: e,
				esan: e,
				esashi: e,
				fukagawa: e,
				fukushima: e,
				furano: e,
				furubira: e,
				haboro: e,
				hakodate: e,
				hamatonbetsu: e,
				hidaka: e,
				higashikagura: e,
				higashikawa: e,
				hiroo: e,
				hokuryu: e,
				hokuto: e,
				honbetsu: e,
				horokanai: e,
				horonobe: e,
				ikeda: e,
				imakane: e,
				ishikari: e,
				iwamizawa: e,
				iwanai: e,
				kamifurano: e,
				kamikawa: e,
				kamishihoro: e,
				kamisunagawa: e,
				kamoenai: e,
				kayabe: e,
				kembuchi: e,
				kikonai: e,
				kimobetsu: e,
				kitahiroshima: e,
				kitami: e,
				kiyosato: e,
				koshimizu: e,
				kunneppu: e,
				kuriyama: e,
				kuromatsunai: e,
				kushiro: e,
				kutchan: e,
				kyowa: e,
				mashike: e,
				matsumae: e,
				mikasa: e,
				minamifurano: e,
				mombetsu: e,
				moseushi: e,
				mukawa: e,
				muroran: e,
				naie: e,
				nakagawa: e,
				nakasatsunai: e,
				nakatombetsu: e,
				nanae: e,
				nanporo: e,
				nayoro: e,
				nemuro: e,
				niikappu: e,
				niki: e,
				nishiokoppe: e,
				noboribetsu: e,
				numata: e,
				obihiro: e,
				obira: e,
				oketo: e,
				okoppe: e,
				otaru: e,
				otobe: e,
				otofuke: e,
				otoineppu: e,
				oumu: e,
				ozora: e,
				pippu: e,
				rankoshi: e,
				rebun: e,
				rikubetsu: e,
				rishiri: e,
				rishirifuji: e,
				saroma: e,
				sarufutsu: e,
				shakotan: e,
				shari: e,
				shibecha: e,
				shibetsu: e,
				shikabe: e,
				shikaoi: e,
				shimamaki: e,
				shimizu: e,
				shimokawa: e,
				shinshinotsu: e,
				shintoku: e,
				shiranuka: e,
				shiraoi: e,
				shiriuchi: e,
				sobetsu: e,
				sunagawa: e,
				taiki: e,
				takasu: e,
				takikawa: e,
				takinoue: e,
				teshikaga: e,
				tobetsu: e,
				tohma: e,
				tomakomai: e,
				tomari: e,
				toya: e,
				toyako: e,
				toyotomi: e,
				toyoura: e,
				tsubetsu: e,
				tsukigata: e,
				urakawa: e,
				urausu: e,
				uryu: e,
				utashinai: e,
				wakkanai: e,
				wassamu: e,
				yakumo: e,
				yoichi: e
			}],
			hyogo: [1, {
				aioi: e,
				akashi: e,
				ako: e,
				amagasaki: e,
				aogaki: e,
				asago: e,
				ashiya: e,
				awaji: e,
				fukusaki: e,
				goshiki: e,
				harima: e,
				himeji: e,
				ichikawa: e,
				inagawa: e,
				itami: e,
				kakogawa: e,
				kamigori: e,
				kamikawa: e,
				kasai: e,
				kasuga: e,
				kawanishi: e,
				miki: e,
				minamiawaji: e,
				nishinomiya: e,
				nishiwaki: e,
				ono: e,
				sanda: e,
				sannan: e,
				sasayama: e,
				sayo: e,
				shingu: e,
				shinonsen: e,
				shiso: e,
				sumoto: e,
				taishi: e,
				taka: e,
				takarazuka: e,
				takasago: e,
				takino: e,
				tamba: e,
				tatsuno: e,
				toyooka: e,
				yabu: e,
				yashiro: e,
				yoka: e,
				yokawa: e
			}],
			ibaraki: [1, {
				ami: e,
				asahi: e,
				bando: e,
				chikusei: e,
				daigo: e,
				fujishiro: e,
				hitachi: e,
				hitachinaka: e,
				hitachiomiya: e,
				hitachiota: e,
				ibaraki: e,
				ina: e,
				inashiki: e,
				itako: e,
				iwama: e,
				joso: e,
				kamisu: e,
				kasama: e,
				kashima: e,
				kasumigaura: e,
				koga: e,
				miho: e,
				mito: e,
				moriya: e,
				naka: e,
				namegata: e,
				oarai: e,
				ogawa: e,
				omitama: e,
				ryugasaki: e,
				sakai: e,
				sakuragawa: e,
				shimodate: e,
				shimotsuma: e,
				shirosato: e,
				sowa: e,
				suifu: e,
				takahagi: e,
				tamatsukuri: e,
				tokai: e,
				tomobe: e,
				tone: e,
				toride: e,
				tsuchiura: e,
				tsukuba: e,
				uchihara: e,
				ushiku: e,
				yachiyo: e,
				yamagata: e,
				yawara: e,
				yuki: e
			}],
			ishikawa: [1, {
				anamizu: e,
				hakui: e,
				hakusan: e,
				kaga: e,
				kahoku: e,
				kanazawa: e,
				kawakita: e,
				komatsu: e,
				nakanoto: e,
				nanao: e,
				nomi: e,
				nonoichi: e,
				noto: e,
				shika: e,
				suzu: e,
				tsubata: e,
				tsurugi: e,
				uchinada: e,
				wajima: e
			}],
			iwate: [1, {
				fudai: e,
				fujisawa: e,
				hanamaki: e,
				hiraizumi: e,
				hirono: e,
				ichinohe: e,
				ichinoseki: e,
				iwaizumi: e,
				iwate: e,
				joboji: e,
				kamaishi: e,
				kanegasaki: e,
				karumai: e,
				kawai: e,
				kitakami: e,
				kuji: e,
				kunohe: e,
				kuzumaki: e,
				miyako: e,
				mizusawa: e,
				morioka: e,
				ninohe: e,
				noda: e,
				ofunato: e,
				oshu: e,
				otsuchi: e,
				rikuzentakata: e,
				shiwa: e,
				shizukuishi: e,
				sumita: e,
				tanohata: e,
				tono: e,
				yahaba: e,
				yamada: e
			}],
			kagawa: [1, {
				ayagawa: e,
				higashikagawa: e,
				kanonji: e,
				kotohira: e,
				manno: e,
				marugame: e,
				mitoyo: e,
				naoshima: e,
				sanuki: e,
				tadotsu: e,
				takamatsu: e,
				tonosho: e,
				uchinomi: e,
				utazu: e,
				zentsuji: e
			}],
			kagoshima: [1, {
				akune: e,
				amami: e,
				hioki: e,
				isa: e,
				isen: e,
				izumi: e,
				kagoshima: e,
				kanoya: e,
				kawanabe: e,
				kinko: e,
				kouyama: e,
				makurazaki: e,
				matsumoto: e,
				minamitane: e,
				nakatane: e,
				nishinoomote: e,
				satsumasendai: e,
				soo: e,
				tarumizu: e,
				yusui: e
			}],
			kanagawa: [1, {
				aikawa: e,
				atsugi: e,
				ayase: e,
				chigasaki: e,
				ebina: e,
				fujisawa: e,
				hadano: e,
				hakone: e,
				hiratsuka: e,
				isehara: e,
				kaisei: e,
				kamakura: e,
				kiyokawa: e,
				matsuda: e,
				minamiashigara: e,
				miura: e,
				nakai: e,
				ninomiya: e,
				odawara: e,
				oi: e,
				oiso: e,
				sagamihara: e,
				samukawa: e,
				tsukui: e,
				yamakita: e,
				yamato: e,
				yokosuka: e,
				yugawara: e,
				zama: e,
				zushi: e
			}],
			kochi: [1, {
				aki: e,
				geisei: e,
				hidaka: e,
				higashitsuno: e,
				ino: e,
				kagami: e,
				kami: e,
				kitagawa: e,
				kochi: e,
				mihara: e,
				motoyama: e,
				muroto: e,
				nahari: e,
				nakamura: e,
				nankoku: e,
				nishitosa: e,
				niyodogawa: e,
				ochi: e,
				okawa: e,
				otoyo: e,
				otsuki: e,
				sakawa: e,
				sukumo: e,
				susaki: e,
				tosa: e,
				tosashimizu: e,
				toyo: e,
				tsuno: e,
				umaji: e,
				yasuda: e,
				yusuhara: e
			}],
			kumamoto: [1, {
				amakusa: e,
				arao: e,
				aso: e,
				choyo: e,
				gyokuto: e,
				kamiamakusa: e,
				kikuchi: e,
				kumamoto: e,
				mashiki: e,
				mifune: e,
				minamata: e,
				minamioguni: e,
				nagasu: e,
				nishihara: e,
				oguni: e,
				ozu: e,
				sumoto: e,
				takamori: e,
				uki: e,
				uto: e,
				yamaga: e,
				yamato: e,
				yatsushiro: e
			}],
			kyoto: [1, {
				ayabe: e,
				fukuchiyama: e,
				higashiyama: e,
				ide: e,
				ine: e,
				joyo: e,
				kameoka: e,
				kamo: e,
				kita: e,
				kizu: e,
				kumiyama: e,
				kyotamba: e,
				kyotanabe: e,
				kyotango: e,
				maizuru: e,
				minami: e,
				minamiyamashiro: e,
				miyazu: e,
				muko: e,
				nagaokakyo: e,
				nakagyo: e,
				nantan: e,
				oyamazaki: e,
				sakyo: e,
				seika: e,
				tanabe: e,
				uji: e,
				ujitawara: e,
				wazuka: e,
				yamashina: e,
				yawata: e
			}],
			mie: [1, {
				asahi: e,
				inabe: e,
				ise: e,
				kameyama: e,
				kawagoe: e,
				kiho: e,
				kisosaki: e,
				kiwa: e,
				komono: e,
				kumano: e,
				kuwana: e,
				matsusaka: e,
				meiwa: e,
				mihama: e,
				minamiise: e,
				misugi: e,
				miyama: e,
				nabari: e,
				shima: e,
				suzuka: e,
				tado: e,
				taiki: e,
				taki: e,
				tamaki: e,
				toba: e,
				tsu: e,
				udono: e,
				ureshino: e,
				watarai: e,
				yokkaichi: e
			}],
			miyagi: [1, {
				furukawa: e,
				higashimatsushima: e,
				ishinomaki: e,
				iwanuma: e,
				kakuda: e,
				kami: e,
				kawasaki: e,
				marumori: e,
				matsushima: e,
				minamisanriku: e,
				misato: e,
				murata: e,
				natori: e,
				ogawara: e,
				ohira: e,
				onagawa: e,
				osaki: e,
				rifu: e,
				semine: e,
				shibata: e,
				shichikashuku: e,
				shikama: e,
				shiogama: e,
				shiroishi: e,
				tagajo: e,
				taiwa: e,
				tome: e,
				tomiya: e,
				wakuya: e,
				watari: e,
				yamamoto: e,
				zao: e
			}],
			miyazaki: [1, {
				aya: e,
				ebino: e,
				gokase: e,
				hyuga: e,
				kadogawa: e,
				kawaminami: e,
				kijo: e,
				kitagawa: e,
				kitakata: e,
				kitaura: e,
				kobayashi: e,
				kunitomi: e,
				kushima: e,
				mimata: e,
				miyakonojo: e,
				miyazaki: e,
				morotsuka: e,
				nichinan: e,
				nishimera: e,
				nobeoka: e,
				saito: e,
				shiiba: e,
				shintomi: e,
				takaharu: e,
				takanabe: e,
				takazaki: e,
				tsuno: e
			}],
			nagano: [1, {
				achi: e,
				agematsu: e,
				anan: e,
				aoki: e,
				asahi: e,
				azumino: e,
				chikuhoku: e,
				chikuma: e,
				chino: e,
				fujimi: e,
				hakuba: e,
				hara: e,
				hiraya: e,
				iida: e,
				iijima: e,
				iiyama: e,
				iizuna: e,
				ikeda: e,
				ikusaka: e,
				ina: e,
				karuizawa: e,
				kawakami: e,
				kiso: e,
				kisofukushima: e,
				kitaaiki: e,
				komagane: e,
				komoro: e,
				matsukawa: e,
				matsumoto: e,
				miasa: e,
				minamiaiki: e,
				minamimaki: e,
				minamiminowa: e,
				minowa: e,
				miyada: e,
				miyota: e,
				mochizuki: e,
				nagano: e,
				nagawa: e,
				nagiso: e,
				nakagawa: e,
				nakano: e,
				nozawaonsen: e,
				obuse: e,
				ogawa: e,
				okaya: e,
				omachi: e,
				omi: e,
				ookuwa: e,
				ooshika: e,
				otaki: e,
				otari: e,
				sakae: e,
				sakaki: e,
				saku: e,
				sakuho: e,
				shimosuwa: e,
				shinanomachi: e,
				shiojiri: e,
				suwa: e,
				suzaka: e,
				takagi: e,
				takamori: e,
				takayama: e,
				tateshina: e,
				tatsuno: e,
				togakushi: e,
				togura: e,
				tomi: e,
				ueda: e,
				wada: e,
				yamagata: e,
				yamanouchi: e,
				yasaka: e,
				yasuoka: e
			}],
			nagasaki: [1, {
				chijiwa: e,
				futsu: e,
				goto: e,
				hasami: e,
				hirado: e,
				iki: e,
				isahaya: e,
				kawatana: e,
				kuchinotsu: e,
				matsuura: e,
				nagasaki: e,
				obama: e,
				omura: e,
				oseto: e,
				saikai: e,
				sasebo: e,
				seihi: e,
				shimabara: e,
				shinkamigoto: e,
				togitsu: e,
				tsushima: e,
				unzen: e
			}],
			nara: [1, {
				ando: e,
				gose: e,
				heguri: e,
				higashiyoshino: e,
				ikaruga: e,
				ikoma: e,
				kamikitayama: e,
				kanmaki: e,
				kashiba: e,
				kashihara: e,
				katsuragi: e,
				kawai: e,
				kawakami: e,
				kawanishi: e,
				koryo: e,
				kurotaki: e,
				mitsue: e,
				miyake: e,
				nara: e,
				nosegawa: e,
				oji: e,
				ouda: e,
				oyodo: e,
				sakurai: e,
				sango: e,
				shimoichi: e,
				shimokitayama: e,
				shinjo: e,
				soni: e,
				takatori: e,
				tawaramoto: e,
				tenkawa: e,
				tenri: e,
				uda: e,
				yamatokoriyama: e,
				yamatotakada: e,
				yamazoe: e,
				yoshino: e
			}],
			niigata: [1, {
				aga: e,
				agano: e,
				gosen: e,
				itoigawa: e,
				izumozaki: e,
				joetsu: e,
				kamo: e,
				kariwa: e,
				kashiwazaki: e,
				minamiuonuma: e,
				mitsuke: e,
				muika: e,
				murakami: e,
				myoko: e,
				nagaoka: e,
				niigata: e,
				ojiya: e,
				omi: e,
				sado: e,
				sanjo: e,
				seiro: e,
				seirou: e,
				sekikawa: e,
				shibata: e,
				tagami: e,
				tainai: e,
				tochio: e,
				tokamachi: e,
				tsubame: e,
				tsunan: e,
				uonuma: e,
				yahiko: e,
				yoita: e,
				yuzawa: e
			}],
			oita: [1, {
				beppu: e,
				bungoono: e,
				bungotakada: e,
				hasama: e,
				hiji: e,
				himeshima: e,
				hita: e,
				kamitsue: e,
				kokonoe: e,
				kuju: e,
				kunisaki: e,
				kusu: e,
				oita: e,
				saiki: e,
				taketa: e,
				tsukumi: e,
				usa: e,
				usuki: e,
				yufu: e
			}],
			okayama: [1, {
				akaiwa: e,
				asakuchi: e,
				bizen: e,
				hayashima: e,
				ibara: e,
				kagamino: e,
				kasaoka: e,
				kibichuo: e,
				kumenan: e,
				kurashiki: e,
				maniwa: e,
				misaki: e,
				nagi: e,
				niimi: e,
				nishiawakura: e,
				okayama: e,
				satosho: e,
				setouchi: e,
				shinjo: e,
				shoo: e,
				soja: e,
				takahashi: e,
				tamano: e,
				tsuyama: e,
				wake: e,
				yakage: e
			}],
			okinawa: [1, {
				aguni: e,
				ginowan: e,
				ginoza: e,
				gushikami: e,
				haebaru: e,
				higashi: e,
				hirara: e,
				iheya: e,
				ishigaki: e,
				ishikawa: e,
				itoman: e,
				izena: e,
				kadena: e,
				kin: e,
				kitadaito: e,
				kitanakagusuku: e,
				kumejima: e,
				kunigami: e,
				minamidaito: e,
				motobu: e,
				nago: e,
				naha: e,
				nakagusuku: e,
				nakijin: e,
				nanjo: e,
				nishihara: e,
				ogimi: e,
				okinawa: e,
				onna: e,
				shimoji: e,
				taketomi: e,
				tarama: e,
				tokashiki: e,
				tomigusuku: e,
				tonaki: e,
				urasoe: e,
				uruma: e,
				yaese: e,
				yomitan: e,
				yonabaru: e,
				yonaguni: e,
				zamami: e
			}],
			osaka: [1, {
				abeno: e,
				chihayaakasaka: e,
				chuo: e,
				daito: e,
				fujiidera: e,
				habikino: e,
				hannan: e,
				higashiosaka: e,
				higashisumiyoshi: e,
				higashiyodogawa: e,
				hirakata: e,
				ibaraki: e,
				ikeda: e,
				izumi: e,
				izumiotsu: e,
				izumisano: e,
				kadoma: e,
				kaizuka: e,
				kanan: e,
				kashiwara: e,
				katano: e,
				kawachinagano: e,
				kishiwada: e,
				kita: e,
				kumatori: e,
				matsubara: e,
				minato: e,
				minoh: e,
				misaki: e,
				moriguchi: e,
				neyagawa: e,
				nishi: e,
				nose: e,
				osakasayama: e,
				sakai: e,
				sayama: e,
				sennan: e,
				settsu: e,
				shijonawate: e,
				shimamoto: e,
				suita: e,
				tadaoka: e,
				taishi: e,
				tajiri: e,
				takaishi: e,
				takatsuki: e,
				tondabayashi: e,
				toyonaka: e,
				toyono: e,
				yao: e
			}],
			saga: [1, {
				ariake: e,
				arita: e,
				fukudomi: e,
				genkai: e,
				hamatama: e,
				hizen: e,
				imari: e,
				kamimine: e,
				kanzaki: e,
				karatsu: e,
				kashima: e,
				kitagata: e,
				kitahata: e,
				kiyama: e,
				kouhoku: e,
				kyuragi: e,
				nishiarita: e,
				ogi: e,
				omachi: e,
				ouchi: e,
				saga: e,
				shiroishi: e,
				taku: e,
				tara: e,
				tosu: e,
				yoshinogari: e
			}],
			saitama: [1, {
				arakawa: e,
				asaka: e,
				chichibu: e,
				fujimi: e,
				fujimino: e,
				fukaya: e,
				hanno: e,
				hanyu: e,
				hasuda: e,
				hatogaya: e,
				hatoyama: e,
				hidaka: e,
				higashichichibu: e,
				higashimatsuyama: e,
				honjo: e,
				ina: e,
				iruma: e,
				iwatsuki: e,
				kamiizumi: e,
				kamikawa: e,
				kamisato: e,
				kasukabe: e,
				kawagoe: e,
				kawaguchi: e,
				kawajima: e,
				kazo: e,
				kitamoto: e,
				koshigaya: e,
				kounosu: e,
				kuki: e,
				kumagaya: e,
				matsubushi: e,
				minano: e,
				misato: e,
				miyashiro: e,
				miyoshi: e,
				moroyama: e,
				nagatoro: e,
				namegawa: e,
				niiza: e,
				ogano: e,
				ogawa: e,
				ogose: e,
				okegawa: e,
				omiya: e,
				otaki: e,
				ranzan: e,
				ryokami: e,
				saitama: e,
				sakado: e,
				satte: e,
				sayama: e,
				shiki: e,
				shiraoka: e,
				soka: e,
				sugito: e,
				toda: e,
				tokigawa: e,
				tokorozawa: e,
				tsurugashima: e,
				urawa: e,
				warabi: e,
				yashio: e,
				yokoze: e,
				yono: e,
				yorii: e,
				yoshida: e,
				yoshikawa: e,
				yoshimi: e
			}],
			shiga: [1, {
				aisho: e,
				gamo: e,
				higashiomi: e,
				hikone: e,
				koka: e,
				konan: e,
				kosei: e,
				koto: e,
				kusatsu: e,
				maibara: e,
				moriyama: e,
				nagahama: e,
				nishiazai: e,
				notogawa: e,
				omihachiman: e,
				otsu: e,
				ritto: e,
				ryuoh: e,
				takashima: e,
				takatsuki: e,
				torahime: e,
				toyosato: e,
				yasu: e
			}],
			shimane: [1, {
				akagi: e,
				ama: e,
				gotsu: e,
				hamada: e,
				higashiizumo: e,
				hikawa: e,
				hikimi: e,
				izumo: e,
				kakinoki: e,
				masuda: e,
				matsue: e,
				misato: e,
				nishinoshima: e,
				ohda: e,
				okinoshima: e,
				okuizumo: e,
				shimane: e,
				tamayu: e,
				tsuwano: e,
				unnan: e,
				yakumo: e,
				yasugi: e,
				yatsuka: e
			}],
			shizuoka: [1, {
				arai: e,
				atami: e,
				fuji: e,
				fujieda: e,
				fujikawa: e,
				fujinomiya: e,
				fukuroi: e,
				gotemba: e,
				haibara: e,
				hamamatsu: e,
				higashiizu: e,
				ito: e,
				iwata: e,
				izu: e,
				izunokuni: e,
				kakegawa: e,
				kannami: e,
				kawanehon: e,
				kawazu: e,
				kikugawa: e,
				kosai: e,
				makinohara: e,
				matsuzaki: e,
				minamiizu: e,
				mishima: e,
				morimachi: e,
				nishiizu: e,
				numazu: e,
				omaezaki: e,
				shimada: e,
				shimizu: e,
				shimoda: e,
				shizuoka: e,
				susono: e,
				yaizu: e,
				yoshida: e
			}],
			tochigi: [1, {
				ashikaga: e,
				bato: e,
				haga: e,
				ichikai: e,
				iwafune: e,
				kaminokawa: e,
				kanuma: e,
				karasuyama: e,
				kuroiso: e,
				mashiko: e,
				mibu: e,
				moka: e,
				motegi: e,
				nasu: e,
				nasushiobara: e,
				nikko: e,
				nishikata: e,
				nogi: e,
				ohira: e,
				ohtawara: e,
				oyama: e,
				sakura: e,
				sano: e,
				shimotsuke: e,
				shioya: e,
				takanezawa: e,
				tochigi: e,
				tsuga: e,
				ujiie: e,
				utsunomiya: e,
				yaita: e
			}],
			tokushima: [1, {
				aizumi: e,
				anan: e,
				ichiba: e,
				itano: e,
				kainan: e,
				komatsushima: e,
				matsushige: e,
				mima: e,
				minami: e,
				miyoshi: e,
				mugi: e,
				nakagawa: e,
				naruto: e,
				sanagochi: e,
				shishikui: e,
				tokushima: e,
				wajiki: e
			}],
			tokyo: [1, {
				adachi: e,
				akiruno: e,
				akishima: e,
				aogashima: e,
				arakawa: e,
				bunkyo: e,
				chiyoda: e,
				chofu: e,
				chuo: e,
				edogawa: e,
				fuchu: e,
				fussa: e,
				hachijo: e,
				hachioji: e,
				hamura: e,
				higashikurume: e,
				higashimurayama: e,
				higashiyamato: e,
				hino: e,
				hinode: e,
				hinohara: e,
				inagi: e,
				itabashi: e,
				katsushika: e,
				kita: e,
				kiyose: e,
				kodaira: e,
				koganei: e,
				kokubunji: e,
				komae: e,
				koto: e,
				kouzushima: e,
				kunitachi: e,
				machida: e,
				meguro: e,
				minato: e,
				mitaka: e,
				mizuho: e,
				musashimurayama: e,
				musashino: e,
				nakano: e,
				nerima: e,
				ogasawara: e,
				okutama: e,
				ome: e,
				oshima: e,
				ota: e,
				setagaya: e,
				shibuya: e,
				shinagawa: e,
				shinjuku: e,
				suginami: e,
				sumida: e,
				tachikawa: e,
				taito: e,
				tama: e,
				toshima: e
			}],
			tottori: [1, {
				chizu: e,
				hino: e,
				kawahara: e,
				koge: e,
				kotoura: e,
				misasa: e,
				nanbu: e,
				nichinan: e,
				sakaiminato: e,
				tottori: e,
				wakasa: e,
				yazu: e,
				yonago: e
			}],
			toyama: [1, {
				asahi: e,
				fuchu: e,
				fukumitsu: e,
				funahashi: e,
				himi: e,
				imizu: e,
				inami: e,
				johana: e,
				kamiichi: e,
				kurobe: e,
				nakaniikawa: e,
				namerikawa: e,
				nanto: e,
				nyuzen: e,
				oyabe: e,
				taira: e,
				takaoka: e,
				tateyama: e,
				toga: e,
				tonami: e,
				toyama: e,
				unazuki: e,
				uozu: e,
				yamada: e
			}],
			wakayama: [1, {
				arida: e,
				aridagawa: e,
				gobo: e,
				hashimoto: e,
				hidaka: e,
				hirogawa: e,
				inami: e,
				iwade: e,
				kainan: e,
				kamitonda: e,
				katsuragi: e,
				kimino: e,
				kinokawa: e,
				kitayama: e,
				koya: e,
				koza: e,
				kozagawa: e,
				kudoyama: e,
				kushimoto: e,
				mihama: e,
				misato: e,
				nachikatsuura: e,
				shingu: e,
				shirahama: e,
				taiji: e,
				tanabe: e,
				wakayama: e,
				yuasa: e,
				yura: e
			}],
			yamagata: [1, {
				asahi: e,
				funagata: e,
				higashine: e,
				iide: e,
				kahoku: e,
				kaminoyama: e,
				kaneyama: e,
				kawanishi: e,
				mamurogawa: e,
				mikawa: e,
				murayama: e,
				nagai: e,
				nakayama: e,
				nanyo: e,
				nishikawa: e,
				obanazawa: e,
				oe: e,
				oguni: e,
				ohkura: e,
				oishida: e,
				sagae: e,
				sakata: e,
				sakegawa: e,
				shinjo: e,
				shirataka: e,
				shonai: e,
				takahata: e,
				tendo: e,
				tozawa: e,
				tsuruoka: e,
				yamagata: e,
				yamanobe: e,
				yonezawa: e,
				yuza: e
			}],
			yamaguchi: [1, {
				abu: e,
				hagi: e,
				hikari: e,
				hofu: e,
				iwakuni: e,
				kudamatsu: e,
				mitou: e,
				nagato: e,
				oshima: e,
				shimonoseki: e,
				shunan: e,
				tabuse: e,
				tokuyama: e,
				toyota: e,
				ube: e,
				yuu: e
			}],
			yamanashi: [1, {
				chuo: e,
				doshi: e,
				fuefuki: e,
				fujikawa: e,
				fujikawaguchiko: e,
				fujiyoshida: e,
				hayakawa: e,
				hokuto: e,
				ichikawamisato: e,
				kai: e,
				kofu: e,
				koshu: e,
				kosuge: e,
				"minami-alps": e,
				minobu: e,
				nakamichi: e,
				nanbu: e,
				narusawa: e,
				nirasaki: e,
				nishikatsura: e,
				oshino: e,
				otsuki: e,
				showa: e,
				tabayama: e,
				tsuru: e,
				uenohara: e,
				yamanakako: e,
				yamanashi: e
			}],
			"xn--ehqz56n": e,
			三重: e,
			"xn--1lqs03n": e,
			京都: e,
			"xn--qqqt11m": e,
			佐賀: e,
			"xn--f6qx53a": e,
			兵庫: e,
			"xn--djrs72d6uy": e,
			北海道: e,
			"xn--mkru45i": e,
			千葉: e,
			"xn--0trq7p7nn": e,
			和歌山: e,
			"xn--5js045d": e,
			埼玉: e,
			"xn--kbrq7o": e,
			大分: e,
			"xn--pssu33l": e,
			大阪: e,
			"xn--ntsq17g": e,
			奈良: e,
			"xn--uisz3g": e,
			宮城: e,
			"xn--6btw5a": e,
			宮崎: e,
			"xn--1ctwo": e,
			富山: e,
			"xn--6orx2r": e,
			山口: e,
			"xn--rht61e": e,
			山形: e,
			"xn--rht27z": e,
			山梨: e,
			"xn--nit225k": e,
			岐阜: e,
			"xn--rht3d": e,
			岡山: e,
			"xn--djty4k": e,
			岩手: e,
			"xn--klty5x": e,
			島根: e,
			"xn--kltx9a": e,
			広島: e,
			"xn--kltp7d": e,
			徳島: e,
			"xn--c3s14m": e,
			愛媛: e,
			"xn--vgu402c": e,
			愛知: e,
			"xn--efvn9s": e,
			新潟: e,
			"xn--1lqs71d": e,
			東京: e,
			"xn--4pvxs": e,
			栃木: e,
			"xn--uuwu58a": e,
			沖縄: e,
			"xn--zbx025d": e,
			滋賀: e,
			"xn--8pvr4u": e,
			熊本: e,
			"xn--5rtp49c": e,
			石川: e,
			"xn--ntso0iqx3a": e,
			神奈川: e,
			"xn--elqq16h": e,
			福井: e,
			"xn--4it168d": e,
			福岡: e,
			"xn--klt787d": e,
			福島: e,
			"xn--rny31h": e,
			秋田: e,
			"xn--7t0a264c": e,
			群馬: e,
			"xn--uist22h": e,
			茨城: e,
			"xn--8ltr62k": e,
			長崎: e,
			"xn--2m4a15e": e,
			長野: e,
			"xn--32vp30h": e,
			青森: e,
			"xn--4it797k": e,
			静岡: e,
			"xn--5rtq34k": e,
			香川: e,
			"xn--k7yn95e": e,
			高知: e,
			"xn--tor131o": e,
			鳥取: e,
			"xn--d5qv7z876c": e,
			鹿児島: e,
			kawasaki: v,
			kitakyushu: v,
			kobe: v,
			nagoya: v,
			sapporo: v,
			sendai: v,
			yokohama: v,
			buyshop: t,
			fashionstore: t,
			handcrafted: t,
			kawaiishop: t,
			supersale: t,
			theshop: t,
			"0am": t,
			"0g0": t,
			"0j0": t,
			"0t0": t,
			mydns: t,
			pgw: t,
			wjg: t,
			usercontent: t,
			angry: t,
			babyblue: t,
			babymilk: t,
			backdrop: t,
			bambina: t,
			bitter: t,
			blush: t,
			boo: t,
			boy: t,
			boyfriend: t,
			but: t,
			candypop: t,
			capoo: t,
			catfood: t,
			cheap: t,
			chicappa: t,
			chillout: t,
			chips: t,
			chowder: t,
			chu: t,
			ciao: t,
			cocotte: t,
			coolblog: t,
			cranky: t,
			cutegirl: t,
			daa: t,
			deca: t,
			deci: t,
			digick: t,
			egoism: t,
			fakefur: t,
			fem: t,
			flier: t,
			floppy: t,
			fool: t,
			frenchkiss: t,
			girlfriend: t,
			girly: t,
			gloomy: t,
			gonna: t,
			greater: t,
			hacca: t,
			heavy: t,
			her: t,
			hiho: t,
			hippy: t,
			holy: t,
			hungry: t,
			icurus: t,
			itigo: t,
			jellybean: t,
			kikirara: t,
			kill: t,
			kilo: t,
			kuron: t,
			littlestar: t,
			lolipopmc: t,
			lolitapunk: t,
			lomo: t,
			lovepop: t,
			lovesick: t,
			main: t,
			mods: t,
			mond: t,
			mongolian: t,
			moo: t,
			namaste: t,
			nikita: t,
			nobushi: t,
			noor: t,
			oops: t,
			parallel: t,
			parasite: t,
			pecori: t,
			peewee: t,
			penne: t,
			pepper: t,
			perma: t,
			pigboat: t,
			pinoko: t,
			punyu: t,
			pupu: t,
			pussycat: t,
			pya: t,
			raindrop: t,
			readymade: t,
			sadist: t,
			schoolbus: t,
			secret: t,
			staba: t,
			stripper: t,
			sub: t,
			sunnyday: t,
			thick: t,
			tonkotsu: t,
			under: t,
			upper: t,
			velvet: t,
			verse: t,
			versus: t,
			vivian: t,
			watson: t,
			weblike: t,
			whitesnow: t,
			zombie: t,
			hateblo: t,
			hatenablog: t,
			hatenadiary: t,
			"2-d": t,
			bona: t,
			crap: t,
			daynight: t,
			eek: t,
			flop: t,
			halfmoon: t,
			jeez: t,
			matrix: t,
			mimoza: t,
			netgamers: t,
			nyanta: t,
			o0o0: t,
			rdy: t,
			rgr: t,
			rulez: t,
			sakurastorage: [0, {
				isk01: Me,
				isk02: Me
			}],
			saloon: t,
			sblo: t,
			skr: t,
			tank: t,
			"uh-oh": t,
			undo: t,
			webaccel: [0, {
				rs: t,
				user: t
			}],
			websozai: t,
			xii: t
		}],
		ke: [1, {
			ac: e,
			co: e,
			go: e,
			info: e,
			me: e,
			mobi: e,
			ne: e,
			or: e,
			sc: e
		}],
		kg: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			us: t,
			xx: t,
			ae: t
		}],
		kh: n,
		ki: Ne,
		km: [1, {
			ass: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			nom: e,
			org: e,
			prd: e,
			tm: e,
			asso: e,
			coop: e,
			gouv: e,
			medecin: e,
			notaires: e,
			pharmaciens: e,
			presse: e,
			veterinaire: e
		}],
		kn: [1, {
			edu: e,
			gov: e,
			net: e,
			org: e
		}],
		kp: [1, {
			com: e,
			edu: e,
			gov: e,
			org: e,
			rep: e,
			tra: e
		}],
		kr: [1, {
			ac: e,
			ai: e,
			co: e,
			es: e,
			go: e,
			hs: e,
			io: e,
			it: e,
			kg: e,
			me: e,
			mil: e,
			ms: e,
			ne: e,
			or: e,
			pe: e,
			re: e,
			sc: e,
			busan: e,
			chungbuk: e,
			chungnam: e,
			daegu: e,
			daejeon: e,
			gangwon: e,
			gwangju: e,
			gyeongbuk: e,
			gyeonggi: e,
			gyeongnam: e,
			incheon: e,
			jeju: e,
			jeonbuk: e,
			jeonnam: e,
			seoul: e,
			ulsan: e,
			c01: t,
			"eliv-api": t,
			"eliv-cdn": t,
			"eliv-dns": t,
			mmv: t,
			vki: t
		}],
		kw: [1, {
			com: e,
			edu: e,
			emb: e,
			gov: e,
			ind: e,
			net: e,
			org: e
		}],
		ky: Se,
		kz: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			jcloud: t
		}],
		la: [1, {
			com: e,
			edu: e,
			gov: e,
			info: e,
			int: e,
			net: e,
			org: e,
			per: e,
			bnr: t
		}],
		lb: n,
		lc: [1, {
			co: e,
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			oy: t
		}],
		li: e,
		lk: [1, {
			ac: e,
			assn: e,
			com: e,
			edu: e,
			gov: e,
			grp: e,
			hotel: e,
			int: e,
			ltd: e,
			net: e,
			ngo: e,
			org: e,
			sch: e,
			soc: e,
			web: e
		}],
		lr: n,
		ls: [1, {
			ac: e,
			biz: e,
			co: e,
			edu: e,
			gov: e,
			info: e,
			net: e,
			org: e,
			sc: e
		}],
		lt: c,
		lu: [1, { "123website": t }],
		lv: [1, {
			asn: e,
			com: e,
			conf: e,
			edu: e,
			gov: e,
			id: e,
			mil: e,
			net: e,
			org: e
		}],
		ly: [1, {
			com: e,
			edu: e,
			gov: e,
			id: e,
			med: e,
			net: e,
			org: e,
			plc: e,
			sch: e
		}],
		ma: [1, {
			ac: e,
			co: e,
			gov: e,
			net: e,
			org: e,
			press: e
		}],
		mc: [1, {
			asso: e,
			tm: e
		}],
		md: [1, { ir: t }],
		me: [1, {
			ac: e,
			co: e,
			edu: e,
			gov: e,
			its: e,
			net: e,
			org: e,
			priv: e,
			c66: t,
			craft: t,
			edgestack: t,
			mybox: t,
			filegear: t,
			"filegear-sg": t,
			lohmus: t,
			barsy: t,
			mcdir: t,
			brasilia: t,
			ddns: t,
			dnsfor: t,
			hopto: t,
			loginto: t,
			noip: t,
			webhop: t,
			soundcast: t,
			tcp4: t,
			vp4: t,
			diskstation: t,
			dscloud: t,
			i234: t,
			myds: t,
			synology: t,
			transip: xe,
			nohost: t
		}],
		mg: [1, {
			co: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			nom: e,
			org: e,
			prd: e
		}],
		mh: e,
		mil: e,
		mk: [1, {
			com: e,
			edu: e,
			gov: e,
			inf: e,
			name: e,
			net: e,
			org: e
		}],
		ml: [1, {
			ac: e,
			art: e,
			asso: e,
			com: e,
			edu: e,
			gouv: e,
			gov: e,
			info: e,
			inst: e,
			net: e,
			org: e,
			pr: e,
			presse: e
		}],
		mm: v,
		mn: [1, {
			edu: e,
			gov: e,
			org: e,
			nyc: t
		}],
		mo: n,
		mobi: [1, {
			barsy: t,
			dscloud: t
		}],
		mp: [1, { ju: t }],
		mq: e,
		mr: c,
		ms: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			minisite: t
		}],
		mt: Se,
		mu: [1, {
			ac: e,
			co: e,
			com: e,
			gov: e,
			net: e,
			or: e,
			org: e
		}],
		museum: e,
		mv: [1, {
			aero: e,
			biz: e,
			com: e,
			coop: e,
			edu: e,
			gov: e,
			info: e,
			int: e,
			mil: e,
			museum: e,
			name: e,
			net: e,
			org: e,
			pro: e
		}],
		mw: [1, {
			ac: e,
			biz: e,
			co: e,
			com: e,
			coop: e,
			edu: e,
			gov: e,
			int: e,
			net: e,
			org: e
		}],
		mx: [1, {
			com: e,
			edu: e,
			gob: e,
			net: e,
			org: e
		}],
		my: [1, {
			biz: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			name: e,
			net: e,
			org: e
		}],
		mz: [1, {
			ac: e,
			adv: e,
			co: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e
		}],
		na: [1, {
			alt: e,
			co: e,
			com: e,
			gov: e,
			net: e,
			org: e
		}],
		name: [1, {
			her: Ie,
			his: Ie,
			ispmanager: t,
			keenetic: t
		}],
		nc: [1, {
			asso: e,
			nom: e
		}],
		ne: e,
		net: [1, {
			adobeaemcloud: t,
			"adobeio-static": t,
			adobeioruntime: t,
			akadns: t,
			akamai: t,
			"akamai-staging": t,
			akamaiedge: t,
			"akamaiedge-staging": t,
			akamaihd: t,
			"akamaihd-staging": t,
			akamaiorigin: t,
			"akamaiorigin-staging": t,
			akamaized: t,
			"akamaized-staging": t,
			edgekey: t,
			"edgekey-staging": t,
			edgesuite: t,
			"edgesuite-staging": t,
			alwaysdata: t,
			myamaze: t,
			cloudfront: t,
			appudo: t,
			"atlassian-dev": [0, { prod: w }],
			myfritz: t,
			shopselect: t,
			blackbaudcdn: t,
			boomla: t,
			bplaced: t,
			square7: t,
			cdn77: [0, { r: t }],
			"cdn77-ssl": t,
			gb: t,
			hu: t,
			jp: t,
			se: t,
			uk: t,
			clickrising: t,
			"ddns-ip": t,
			"dns-cloud": t,
			"dns-dynamic": t,
			cloudaccess: t,
			cloudflare: [2, { cdn: t }],
			cloudflareanycast: w,
			cloudflarecn: w,
			cloudflareglobal: w,
			ctfcloud: t,
			"feste-ip": t,
			"knx-server": t,
			"static-access": t,
			cryptonomic: i,
			dattolocal: t,
			mydatto: t,
			debian: t,
			definima: t,
			deno: [2, { sandbox: t }],
			icp: i,
			de5: t,
			"at-band-camp": t,
			blogdns: t,
			"broke-it": t,
			buyshouses: t,
			dnsalias: t,
			dnsdojo: t,
			"does-it": t,
			dontexist: t,
			dynalias: t,
			dynathome: t,
			endofinternet: t,
			"from-az": t,
			"from-co": t,
			"from-la": t,
			"from-ny": t,
			"gets-it": t,
			"ham-radio-op": t,
			homeftp: t,
			homeip: t,
			homelinux: t,
			homeunix: t,
			"in-the-band": t,
			"is-a-chef": t,
			"is-a-geek": t,
			"isa-geek": t,
			"kicks-ass": t,
			"office-on-the": t,
			podzone: t,
			"scrapper-site": t,
			selfip: t,
			"sells-it": t,
			servebbs: t,
			serveftp: t,
			thruhere: t,
			webhop: t,
			casacam: t,
			dynu: t,
			dynuddns: t,
			mysynology: t,
			opik: t,
			spryt: t,
			dynv6: t,
			twmail: t,
			ru: t,
			channelsdvr: [2, { u: t }],
			fastly: [0, {
				freetls: t,
				map: t,
				prod: [0, {
					a: t,
					global: t
				}],
				ssl: [0, {
					a: t,
					b: t,
					global: t
				}]
			}],
			fastlylb: [2, { map: t }],
			"keyword-on": t,
			"live-on": t,
			"server-on": t,
			"cdn-edges": t,
			heteml: t,
			cloudfunctions: t,
			"grafana-dev": t,
			iobb: t,
			moonscale: t,
			"in-dsl": t,
			"in-vpn": t,
			oninferno: t,
			botdash: t,
			"apps-1and1": t,
			ipifony: t,
			cloudjiffy: [2, {
				"fra1-de": t,
				"west1-us": t
			}],
			elastx: [0, {
				"jls-sto1": t,
				"jls-sto2": t,
				"jls-sto3": t
			}],
			massivegrid: [0, { paas: [0, {
				"fr-1": t,
				"lon-1": t,
				"lon-2": t,
				"ny-1": t,
				"ny-2": t,
				"sg-1": t
			}] }],
			saveincloud: [0, {
				jelastic: t,
				"nordeste-idc": t
			}],
			scaleforce: Ce,
			kinghost: t,
			uni5: t,
			krellian: t,
			ggff: t,
			localto: i,
			barsy: t,
			luyani: t,
			memset: t,
			"azure-api": t,
			"azure-mobile": t,
			azureedge: t,
			azurefd: t,
			azurestaticapps: [2, {
				1: t,
				2: t,
				3: t,
				4: t,
				5: t,
				6: t,
				7: t,
				centralus: t,
				eastasia: t,
				eastus2: t,
				westeurope: t,
				westus2: t
			}],
			azurewebsites: t,
			cloudapp: t,
			trafficmanager: t,
			usgovcloudapi: Le,
			usgovcloudapp: t,
			usgovtrafficmanager: t,
			windows: Le,
			mynetname: [0, { sn: t }],
			routingthecloud: t,
			bounceme: t,
			ddns: t,
			"eating-organic": t,
			mydissent: t,
			myeffect: t,
			mymediapc: t,
			mypsx: t,
			mysecuritycamera: t,
			nhlfan: t,
			"no-ip": t,
			pgafan: t,
			privatizehealthinsurance: t,
			redirectme: t,
			serveblog: t,
			serveminecraft: t,
			sytes: t,
			dnsup: t,
			hicam: t,
			"now-dns": t,
			ownip: t,
			vpndns: t,
			cloudycluster: t,
			ovh: [0, {
				hosting: i,
				webpaas: i
			}],
			rackmaze: t,
			myradweb: t,
			in: t,
			"subsc-pay": t,
			squares: t,
			schokokeks: t,
			"firewall-gateway": t,
			seidat: t,
			senseering: t,
			siteleaf: t,
			mafelo: t,
			myspreadshop: t,
			"vps-host": [2, { jelastic: [0, {
				atl: t,
				njs: t,
				ric: t
			}] }],
			srcf: [0, {
				soc: t,
				user: t
			}],
			supabase: t,
			dsmynas: t,
			familyds: t,
			ts: [2, { c: i }],
			torproject: [2, { pages: t }],
			tunnelmole: t,
			vusercontent: t,
			"reserve-online": t,
			localcert: t,
			"community-pro": t,
			meinforum: t,
			yandexcloud: [2, {
				storage: t,
				website: t
			}],
			za: t,
			zabc: t
		}],
		nf: [1, {
			arts: e,
			com: e,
			firm: e,
			info: e,
			net: e,
			other: e,
			per: e,
			rec: e,
			store: e,
			web: e
		}],
		ng: [1, {
			com: e,
			edu: e,
			gov: e,
			i: e,
			mil: e,
			mobi: e,
			name: e,
			net: e,
			org: e,
			sch: e,
			biz: [2, {
				co: t,
				dl: t,
				go: t,
				lg: t,
				on: t
			}],
			col: t,
			firm: t,
			gen: t,
			ltd: t,
			ngo: t,
			plc: t
		}],
		ni: [1, {
			ac: e,
			biz: e,
			co: e,
			com: e,
			edu: e,
			gob: e,
			in: e,
			info: e,
			int: e,
			mil: e,
			net: e,
			nom: e,
			org: e,
			web: e
		}],
		nl: [1, {
			co: t,
			"hosting-cluster": t,
			gov: t,
			khplay: t,
			"123website": t,
			myspreadshop: t,
			transurl: i,
			cistron: t,
			demon: t
		}],
		no: [1, {
			fhs: e,
			folkebibl: e,
			fylkesbibl: e,
			idrett: e,
			museum: e,
			priv: e,
			vgs: e,
			dep: e,
			herad: e,
			kommune: e,
			mil: e,
			stat: e,
			aa: E,
			ah: E,
			bu: E,
			fm: E,
			hl: E,
			hm: E,
			"jan-mayen": E,
			mr: E,
			nl: E,
			nt: E,
			of: E,
			ol: E,
			oslo: E,
			rl: E,
			sf: E,
			st: E,
			svalbard: E,
			tm: E,
			tr: E,
			va: E,
			vf: E,
			akrehamn: e,
			"xn--krehamn-dxa": e,
			åkrehamn: e,
			algard: e,
			"xn--lgrd-poac": e,
			ålgård: e,
			arna: e,
			bronnoysund: e,
			"xn--brnnysund-m8ac": e,
			brønnøysund: e,
			brumunddal: e,
			bryne: e,
			drobak: e,
			"xn--drbak-wua": e,
			drøbak: e,
			egersund: e,
			fetsund: e,
			floro: e,
			"xn--flor-jra": e,
			florø: e,
			fredrikstad: e,
			hokksund: e,
			honefoss: e,
			"xn--hnefoss-q1a": e,
			hønefoss: e,
			jessheim: e,
			jorpeland: e,
			"xn--jrpeland-54a": e,
			jørpeland: e,
			kirkenes: e,
			kopervik: e,
			krokstadelva: e,
			langevag: e,
			"xn--langevg-jxa": e,
			langevåg: e,
			leirvik: e,
			mjondalen: e,
			"xn--mjndalen-64a": e,
			mjøndalen: e,
			"mo-i-rana": e,
			mosjoen: e,
			"xn--mosjen-eya": e,
			mosjøen: e,
			nesoddtangen: e,
			orkanger: e,
			osoyro: e,
			"xn--osyro-wua": e,
			osøyro: e,
			raholt: e,
			"xn--rholt-mra": e,
			råholt: e,
			sandnessjoen: e,
			"xn--sandnessjen-ogb": e,
			sandnessjøen: e,
			skedsmokorset: e,
			slattum: e,
			spjelkavik: e,
			stathelle: e,
			stavern: e,
			stjordalshalsen: e,
			"xn--stjrdalshalsen-sqb": e,
			stjørdalshalsen: e,
			tananger: e,
			tranby: e,
			vossevangen: e,
			aarborte: e,
			aejrie: e,
			afjord: e,
			"xn--fjord-lra": e,
			åfjord: e,
			agdenes: e,
			akershus: Re,
			aknoluokta: e,
			"xn--koluokta-7ya57h": e,
			ákŋoluokta: e,
			al: e,
			"xn--l-1fa": e,
			ål: e,
			alaheadju: e,
			"xn--laheadju-7ya": e,
			álaheadju: e,
			alesund: e,
			"xn--lesund-hua": e,
			ålesund: e,
			alstahaug: e,
			alta: e,
			"xn--lt-liac": e,
			áltá: e,
			alvdal: e,
			amli: e,
			"xn--mli-tla": e,
			åmli: e,
			amot: e,
			"xn--mot-tla": e,
			åmot: e,
			andasuolo: e,
			andebu: e,
			andoy: e,
			"xn--andy-ira": e,
			andøy: e,
			ardal: e,
			"xn--rdal-poa": e,
			årdal: e,
			aremark: e,
			arendal: e,
			"xn--s-1fa": e,
			ås: e,
			aseral: e,
			"xn--seral-lra": e,
			åseral: e,
			asker: e,
			askim: e,
			askoy: e,
			"xn--asky-ira": e,
			askøy: e,
			askvoll: e,
			asnes: e,
			"xn--snes-poa": e,
			åsnes: e,
			audnedaln: e,
			aukra: e,
			aure: e,
			aurland: e,
			"aurskog-holand": e,
			"xn--aurskog-hland-jnb": e,
			"aurskog-høland": e,
			austevoll: e,
			austrheim: e,
			averoy: e,
			"xn--avery-yua": e,
			averøy: e,
			badaddja: e,
			"xn--bdddj-mrabd": e,
			bådåddjå: e,
			"xn--brum-voa": e,
			bærum: e,
			bahcavuotna: e,
			"xn--bhcavuotna-s4a": e,
			báhcavuotna: e,
			bahccavuotna: e,
			"xn--bhccavuotna-k7a": e,
			báhccavuotna: e,
			baidar: e,
			"xn--bidr-5nac": e,
			báidár: e,
			bajddar: e,
			"xn--bjddar-pta": e,
			bájddar: e,
			balat: e,
			"xn--blt-elab": e,
			bálát: e,
			balestrand: e,
			ballangen: e,
			balsfjord: e,
			bamble: e,
			bardu: e,
			barum: e,
			batsfjord: e,
			"xn--btsfjord-9za": e,
			båtsfjord: e,
			bearalvahki: e,
			"xn--bearalvhki-y4a": e,
			bearalváhki: e,
			beardu: e,
			beiarn: e,
			berg: e,
			bergen: e,
			berlevag: e,
			"xn--berlevg-jxa": e,
			berlevåg: e,
			bievat: e,
			"xn--bievt-0qa": e,
			bievát: e,
			bindal: e,
			birkenes: e,
			bjerkreim: e,
			bjugn: e,
			bodo: e,
			"xn--bod-2na": e,
			bodø: e,
			bokn: e,
			bomlo: e,
			"xn--bmlo-gra": e,
			bømlo: e,
			bremanger: e,
			bronnoy: e,
			"xn--brnny-wuac": e,
			brønnøy: e,
			budejju: e,
			buskerud: Re,
			bygland: e,
			bykle: e,
			cahcesuolo: e,
			"xn--hcesuolo-7ya35b": e,
			čáhcesuolo: e,
			davvenjarga: e,
			"xn--davvenjrga-y4a": e,
			davvenjárga: e,
			davvesiida: e,
			deatnu: e,
			dielddanuorri: e,
			divtasvuodna: e,
			divttasvuotna: e,
			donna: e,
			"xn--dnna-gra": e,
			dønna: e,
			dovre: e,
			drammen: e,
			drangedal: e,
			dyroy: e,
			"xn--dyry-ira": e,
			dyrøy: e,
			eid: e,
			eidfjord: e,
			eidsberg: e,
			eidskog: e,
			eidsvoll: e,
			eigersund: e,
			elverum: e,
			enebakk: e,
			engerdal: e,
			etne: e,
			etnedal: e,
			evenassi: e,
			"xn--eveni-0qa01ga": e,
			evenášši: e,
			evenes: e,
			"evje-og-hornnes": e,
			farsund: e,
			fauske: e,
			fedje: e,
			fet: e,
			finnoy: e,
			"xn--finny-yua": e,
			finnøy: e,
			fitjar: e,
			fjaler: e,
			fjell: e,
			fla: e,
			"xn--fl-zia": e,
			flå: e,
			flakstad: e,
			flatanger: e,
			flekkefjord: e,
			flesberg: e,
			flora: e,
			folldal: e,
			forde: e,
			"xn--frde-gra": e,
			førde: e,
			forsand: e,
			fosnes: e,
			"xn--frna-woa": e,
			fræna: e,
			frana: e,
			frei: e,
			frogn: e,
			froland: e,
			frosta: e,
			froya: e,
			"xn--frya-hra": e,
			frøya: e,
			fuoisku: e,
			fuossko: e,
			fusa: e,
			fyresdal: e,
			gaivuotna: e,
			"xn--givuotna-8ya": e,
			gáivuotna: e,
			galsa: e,
			"xn--gls-elac": e,
			gálsá: e,
			gamvik: e,
			gangaviika: e,
			"xn--ggaviika-8ya47h": e,
			gáŋgaviika: e,
			gaular: e,
			gausdal: e,
			giehtavuoatna: e,
			gildeskal: e,
			"xn--gildeskl-g0a": e,
			gildeskål: e,
			giske: e,
			gjemnes: e,
			gjerdrum: e,
			gjerstad: e,
			gjesdal: e,
			gjovik: e,
			"xn--gjvik-wua": e,
			gjøvik: e,
			gloppen: e,
			gol: e,
			gran: e,
			grane: e,
			granvin: e,
			gratangen: e,
			grimstad: e,
			grong: e,
			grue: e,
			gulen: e,
			guovdageaidnu: e,
			ha: e,
			"xn--h-2fa": e,
			hå: e,
			habmer: e,
			"xn--hbmer-xqa": e,
			hábmer: e,
			hadsel: e,
			"xn--hgebostad-g3a": e,
			hægebostad: e,
			hagebostad: e,
			halden: e,
			halsa: e,
			hamar: e,
			hamaroy: e,
			hammarfeasta: e,
			"xn--hmmrfeasta-s4ac": e,
			hámmárfeasta: e,
			hammerfest: e,
			hapmir: e,
			"xn--hpmir-xqa": e,
			hápmir: e,
			haram: e,
			hareid: e,
			harstad: e,
			hasvik: e,
			hattfjelldal: e,
			haugesund: e,
			hedmark: [0, {
				os: e,
				valer: e,
				"xn--vler-qoa": e,
				våler: e
			}],
			hemne: e,
			hemnes: e,
			hemsedal: e,
			hitra: e,
			hjartdal: e,
			hjelmeland: e,
			hobol: e,
			"xn--hobl-ira": e,
			hobøl: e,
			hof: e,
			hol: e,
			hole: e,
			holmestrand: e,
			holtalen: e,
			"xn--holtlen-hxa": e,
			holtålen: e,
			hordaland: [0, { os: e }],
			hornindal: e,
			horten: e,
			hoyanger: e,
			"xn--hyanger-q1a": e,
			høyanger: e,
			hoylandet: e,
			"xn--hylandet-54a": e,
			høylandet: e,
			hurdal: e,
			hurum: e,
			hvaler: e,
			hyllestad: e,
			ibestad: e,
			inderoy: e,
			"xn--indery-fya": e,
			inderøy: e,
			iveland: e,
			ivgu: e,
			jevnaker: e,
			jolster: e,
			"xn--jlster-bya": e,
			jølster: e,
			jondal: e,
			kafjord: e,
			"xn--kfjord-iua": e,
			kåfjord: e,
			karasjohka: e,
			"xn--krjohka-hwab49j": e,
			kárášjohka: e,
			karasjok: e,
			karlsoy: e,
			karmoy: e,
			"xn--karmy-yua": e,
			karmøy: e,
			kautokeino: e,
			klabu: e,
			"xn--klbu-woa": e,
			klæbu: e,
			klepp: e,
			kongsberg: e,
			kongsvinger: e,
			kraanghke: e,
			"xn--kranghke-b0a": e,
			kråanghke: e,
			kragero: e,
			"xn--krager-gya": e,
			kragerø: e,
			kristiansand: e,
			kristiansund: e,
			krodsherad: e,
			"xn--krdsherad-m8a": e,
			krødsherad: e,
			"xn--kvfjord-nxa": e,
			kvæfjord: e,
			"xn--kvnangen-k0a": e,
			kvænangen: e,
			kvafjord: e,
			kvalsund: e,
			kvam: e,
			kvanangen: e,
			kvinesdal: e,
			kvinnherad: e,
			kviteseid: e,
			kvitsoy: e,
			"xn--kvitsy-fya": e,
			kvitsøy: e,
			laakesvuemie: e,
			"xn--lrdal-sra": e,
			lærdal: e,
			lahppi: e,
			"xn--lhppi-xqa": e,
			láhppi: e,
			lardal: e,
			larvik: e,
			lavagis: e,
			lavangen: e,
			leangaviika: e,
			"xn--leagaviika-52b": e,
			leaŋgaviika: e,
			lebesby: e,
			leikanger: e,
			leirfjord: e,
			leka: e,
			leksvik: e,
			lenvik: e,
			lerdal: e,
			lesja: e,
			levanger: e,
			lier: e,
			lierne: e,
			lillehammer: e,
			lillesand: e,
			lindas: e,
			"xn--linds-pra": e,
			lindås: e,
			lindesnes: e,
			loabat: e,
			"xn--loabt-0qa": e,
			loabát: e,
			lodingen: e,
			"xn--ldingen-q1a": e,
			lødingen: e,
			lom: e,
			loppa: e,
			lorenskog: e,
			"xn--lrenskog-54a": e,
			lørenskog: e,
			loten: e,
			"xn--lten-gra": e,
			løten: e,
			lund: e,
			lunner: e,
			luroy: e,
			"xn--lury-ira": e,
			lurøy: e,
			luster: e,
			lyngdal: e,
			lyngen: e,
			malatvuopmi: e,
			"xn--mlatvuopmi-s4a": e,
			málatvuopmi: e,
			malselv: e,
			"xn--mlselv-iua": e,
			målselv: e,
			malvik: e,
			mandal: e,
			marker: e,
			marnardal: e,
			masfjorden: e,
			masoy: e,
			"xn--msy-ula0h": e,
			måsøy: e,
			"matta-varjjat": e,
			"xn--mtta-vrjjat-k7af": e,
			"mátta-várjjat": e,
			meland: e,
			meldal: e,
			melhus: e,
			meloy: e,
			"xn--mely-ira": e,
			meløy: e,
			meraker: e,
			"xn--merker-kua": e,
			meråker: e,
			midsund: e,
			"midtre-gauldal": e,
			moareke: e,
			"xn--moreke-jua": e,
			moåreke: e,
			modalen: e,
			modum: e,
			molde: e,
			"more-og-romsdal": [0, {
				heroy: e,
				sande: e
			}],
			"xn--mre-og-romsdal-qqb": [0, {
				"xn--hery-ira": e,
				sande: e
			}],
			"møre-og-romsdal": [0, {
				herøy: e,
				sande: e
			}],
			moskenes: e,
			moss: e,
			muosat: e,
			"xn--muost-0qa": e,
			muosát: e,
			naamesjevuemie: e,
			"xn--nmesjevuemie-tcba": e,
			nååmesjevuemie: e,
			"xn--nry-yla5g": e,
			nærøy: e,
			namdalseid: e,
			namsos: e,
			namsskogan: e,
			nannestad: e,
			naroy: e,
			narviika: e,
			narvik: e,
			naustdal: e,
			navuotna: e,
			"xn--nvuotna-hwa": e,
			návuotna: e,
			"nedre-eiker": e,
			nesna: e,
			nesodden: e,
			nesseby: e,
			nesset: e,
			nissedal: e,
			nittedal: e,
			"nord-aurdal": e,
			"nord-fron": e,
			"nord-odal": e,
			norddal: e,
			nordkapp: e,
			nordland: [0, {
				bo: e,
				"xn--b-5ga": e,
				bø: e,
				heroy: e,
				"xn--hery-ira": e,
				herøy: e
			}],
			"nordre-land": e,
			nordreisa: e,
			"nore-og-uvdal": e,
			notodden: e,
			notteroy: e,
			"xn--nttery-byae": e,
			nøtterøy: e,
			odda: e,
			oksnes: e,
			"xn--ksnes-uua": e,
			øksnes: e,
			omasvuotna: e,
			oppdal: e,
			oppegard: e,
			"xn--oppegrd-ixa": e,
			oppegård: e,
			orkdal: e,
			orland: e,
			"xn--rland-uua": e,
			ørland: e,
			orskog: e,
			"xn--rskog-uua": e,
			ørskog: e,
			orsta: e,
			"xn--rsta-fra": e,
			ørsta: e,
			osen: e,
			osteroy: e,
			"xn--ostery-fya": e,
			osterøy: e,
			ostfold: [0, { valer: e }],
			"xn--stfold-9xa": [0, { "xn--vler-qoa": e }],
			østfold: [0, { våler: e }],
			"ostre-toten": e,
			"xn--stre-toten-zcb": e,
			"østre-toten": e,
			overhalla: e,
			"ovre-eiker": e,
			"xn--vre-eiker-k8a": e,
			"øvre-eiker": e,
			oyer: e,
			"xn--yer-zna": e,
			øyer: e,
			oygarden: e,
			"xn--ygarden-p1a": e,
			øygarden: e,
			"oystre-slidre": e,
			"xn--ystre-slidre-ujb": e,
			"øystre-slidre": e,
			porsanger: e,
			porsangu: e,
			"xn--porsgu-sta26f": e,
			porsáŋgu: e,
			porsgrunn: e,
			rade: e,
			"xn--rde-ula": e,
			råde: e,
			radoy: e,
			"xn--rady-ira": e,
			radøy: e,
			"xn--rlingen-mxa": e,
			rælingen: e,
			rahkkeravju: e,
			"xn--rhkkervju-01af": e,
			ráhkkerávju: e,
			raisa: e,
			"xn--risa-5na": e,
			ráisa: e,
			rakkestad: e,
			ralingen: e,
			rana: e,
			randaberg: e,
			rauma: e,
			rendalen: e,
			rennebu: e,
			rennesoy: e,
			"xn--rennesy-v1a": e,
			rennesøy: e,
			rindal: e,
			ringebu: e,
			ringerike: e,
			ringsaker: e,
			risor: e,
			"xn--risr-ira": e,
			risør: e,
			rissa: e,
			roan: e,
			rodoy: e,
			"xn--rdy-0nab": e,
			rødøy: e,
			rollag: e,
			romsa: e,
			romskog: e,
			"xn--rmskog-bya": e,
			rømskog: e,
			roros: e,
			"xn--rros-gra": e,
			røros: e,
			rost: e,
			"xn--rst-0na": e,
			røst: e,
			royken: e,
			"xn--ryken-vua": e,
			røyken: e,
			royrvik: e,
			"xn--ryrvik-bya": e,
			røyrvik: e,
			ruovat: e,
			rygge: e,
			salangen: e,
			salat: e,
			"xn--slat-5na": e,
			sálat: e,
			"xn--slt-elab": e,
			sálát: e,
			saltdal: e,
			samnanger: e,
			sandefjord: e,
			sandnes: e,
			sandoy: e,
			"xn--sandy-yua": e,
			sandøy: e,
			sarpsborg: e,
			sauda: e,
			sauherad: e,
			sel: e,
			selbu: e,
			selje: e,
			seljord: e,
			siellak: e,
			sigdal: e,
			siljan: e,
			sirdal: e,
			skanit: e,
			"xn--sknit-yqa": e,
			skánit: e,
			skanland: e,
			"xn--sknland-fxa": e,
			skånland: e,
			skaun: e,
			skedsmo: e,
			ski: e,
			skien: e,
			skierva: e,
			"xn--skierv-uta": e,
			skiervá: e,
			skiptvet: e,
			skjak: e,
			"xn--skjk-soa": e,
			skjåk: e,
			skjervoy: e,
			"xn--skjervy-v1a": e,
			skjervøy: e,
			skodje: e,
			smola: e,
			"xn--smla-hra": e,
			smøla: e,
			snaase: e,
			"xn--snase-nra": e,
			snåase: e,
			snasa: e,
			"xn--snsa-roa": e,
			snåsa: e,
			snillfjord: e,
			snoasa: e,
			sogndal: e,
			sogne: e,
			"xn--sgne-gra": e,
			søgne: e,
			sokndal: e,
			sola: e,
			solund: e,
			somna: e,
			"xn--smna-gra": e,
			sømna: e,
			"sondre-land": e,
			"xn--sndre-land-0cb": e,
			"søndre-land": e,
			songdalen: e,
			"sor-aurdal": e,
			"xn--sr-aurdal-l8a": e,
			"sør-aurdal": e,
			"sor-fron": e,
			"xn--sr-fron-q1a": e,
			"sør-fron": e,
			"sor-odal": e,
			"xn--sr-odal-q1a": e,
			"sør-odal": e,
			"sor-varanger": e,
			"xn--sr-varanger-ggb": e,
			"sør-varanger": e,
			sorfold: e,
			"xn--srfold-bya": e,
			sørfold: e,
			sorreisa: e,
			"xn--srreisa-q1a": e,
			sørreisa: e,
			sortland: e,
			sorum: e,
			"xn--srum-gra": e,
			sørum: e,
			spydeberg: e,
			stange: e,
			stavanger: e,
			steigen: e,
			steinkjer: e,
			stjordal: e,
			"xn--stjrdal-s1a": e,
			stjørdal: e,
			stokke: e,
			"stor-elvdal": e,
			stord: e,
			stordal: e,
			storfjord: e,
			strand: e,
			stranda: e,
			stryn: e,
			sula: e,
			suldal: e,
			sund: e,
			sunndal: e,
			surnadal: e,
			sveio: e,
			svelvik: e,
			sykkylven: e,
			tana: e,
			telemark: [0, {
				bo: e,
				"xn--b-5ga": e,
				bø: e
			}],
			time: e,
			tingvoll: e,
			tinn: e,
			tjeldsund: e,
			tjome: e,
			"xn--tjme-hra": e,
			tjøme: e,
			tokke: e,
			tolga: e,
			tonsberg: e,
			"xn--tnsberg-q1a": e,
			tønsberg: e,
			torsken: e,
			"xn--trna-woa": e,
			træna: e,
			trana: e,
			tranoy: e,
			"xn--trany-yua": e,
			tranøy: e,
			troandin: e,
			trogstad: e,
			"xn--trgstad-r1a": e,
			trøgstad: e,
			tromsa: e,
			tromso: e,
			"xn--troms-zua": e,
			tromsø: e,
			trondheim: e,
			trysil: e,
			tvedestrand: e,
			tydal: e,
			tynset: e,
			tysfjord: e,
			tysnes: e,
			"xn--tysvr-vra": e,
			tysvær: e,
			tysvar: e,
			ullensaker: e,
			ullensvang: e,
			ulvik: e,
			unjarga: e,
			"xn--unjrga-rta": e,
			unjárga: e,
			utsira: e,
			vaapste: e,
			vadso: e,
			"xn--vads-jra": e,
			vadsø: e,
			"xn--vry-yla5g": e,
			værøy: e,
			vaga: e,
			"xn--vg-yiab": e,
			vågå: e,
			vagan: e,
			"xn--vgan-qoa": e,
			vågan: e,
			vagsoy: e,
			"xn--vgsy-qoa0j": e,
			vågsøy: e,
			vaksdal: e,
			valle: e,
			vang: e,
			vanylven: e,
			vardo: e,
			"xn--vard-jra": e,
			vardø: e,
			varggat: e,
			"xn--vrggt-xqad": e,
			várggát: e,
			varoy: e,
			vefsn: e,
			vega: e,
			vegarshei: e,
			"xn--vegrshei-c0a": e,
			vegårshei: e,
			vennesla: e,
			verdal: e,
			verran: e,
			vestby: e,
			vestfold: [0, { sande: e }],
			vestnes: e,
			"vestre-slidre": e,
			"vestre-toten": e,
			vestvagoy: e,
			"xn--vestvgy-ixa6o": e,
			vestvågøy: e,
			vevelstad: e,
			vik: e,
			vikna: e,
			vindafjord: e,
			voagat: e,
			volda: e,
			voss: e,
			co: t,
			"123hjemmeside": t,
			myspreadshop: t
		}],
		np: v,
		nr: Ne,
		nu: [1, {
			merseine: t,
			mine: t,
			shacknet: t,
			enterprisecloud: t
		}],
		nz: [1, {
			ac: e,
			co: e,
			cri: e,
			geek: e,
			gen: e,
			govt: e,
			health: e,
			iwi: e,
			kiwi: e,
			maori: e,
			"xn--mori-qsa": e,
			māori: e,
			mil: e,
			net: e,
			org: e,
			parliament: e,
			school: e,
			cloudns: t
		}],
		om: [1, {
			co: e,
			com: e,
			edu: e,
			gov: e,
			med: e,
			museum: e,
			net: e,
			org: e,
			pro: e
		}],
		onion: e,
		org: [1, {
			altervista: t,
			pimienta: t,
			poivron: t,
			potager: t,
			sweetpepper: t,
			cdn77: [0, {
				c: t,
				rsc: t
			}],
			"cdn77-secure": [0, { origin: [0, { ssl: t }] }],
			ae: t,
			cloudns: t,
			"ip-dynamic": t,
			ddnss: t,
			dpdns: t,
			duckdns: t,
			tunk: t,
			blogdns: t,
			blogsite: t,
			boldlygoingnowhere: t,
			dnsalias: t,
			dnsdojo: t,
			doesntexist: t,
			dontexist: t,
			doomdns: t,
			dvrdns: t,
			dynalias: t,
			dyndns: [2, {
				go: t,
				home: t
			}],
			endofinternet: t,
			endoftheinternet: t,
			"from-me": t,
			"game-host": t,
			gotdns: t,
			"hobby-site": t,
			homedns: t,
			homeftp: t,
			homelinux: t,
			homeunix: t,
			"is-a-bruinsfan": t,
			"is-a-candidate": t,
			"is-a-celticsfan": t,
			"is-a-chef": t,
			"is-a-geek": t,
			"is-a-knight": t,
			"is-a-linux-user": t,
			"is-a-patsfan": t,
			"is-a-soxfan": t,
			"is-found": t,
			"is-lost": t,
			"is-saved": t,
			"is-very-bad": t,
			"is-very-evil": t,
			"is-very-good": t,
			"is-very-nice": t,
			"is-very-sweet": t,
			"isa-geek": t,
			"kicks-ass": t,
			misconfused: t,
			podzone: t,
			readmyblog: t,
			selfip: t,
			sellsyourhome: t,
			servebbs: t,
			serveftp: t,
			servegame: t,
			"stuff-4-sale": t,
			webhop: t,
			accesscam: t,
			camdvr: t,
			freeddns: t,
			mywire: t,
			roxa: t,
			webredirect: t,
			twmail: t,
			eu: [2, {
				al: t,
				asso: t,
				at: t,
				au: t,
				be: t,
				bg: t,
				ca: t,
				cd: t,
				ch: t,
				cn: t,
				cy: t,
				cz: t,
				de: t,
				dk: t,
				edu: t,
				ee: t,
				es: t,
				fi: t,
				fr: t,
				gr: t,
				hr: t,
				hu: t,
				ie: t,
				il: t,
				in: t,
				int: t,
				is: t,
				it: t,
				jp: t,
				kr: t,
				lt: t,
				lu: t,
				lv: t,
				me: t,
				mk: t,
				mt: t,
				my: t,
				net: t,
				ng: t,
				nl: t,
				no: t,
				nz: t,
				pl: t,
				pt: t,
				ro: t,
				ru: t,
				se: t,
				si: t,
				sk: t,
				tr: t,
				uk: t,
				us: t
			}],
			fedorainfracloud: t,
			fedorapeople: t,
			fedoraproject: [0, {
				cloud: t,
				os: be,
				stg: [0, { os: be }]
			}],
			freedesktop: t,
			hatenadiary: t,
			hepforge: t,
			"in-dsl": t,
			"in-vpn": t,
			js: t,
			barsy: t,
			mayfirst: t,
			routingthecloud: t,
			bmoattachments: t,
			"cable-modem": t,
			collegefan: t,
			couchpotatofries: t,
			hopto: t,
			mlbfan: t,
			myftp: t,
			mysecuritycamera: t,
			nflfan: t,
			"no-ip": t,
			"read-books": t,
			ufcfan: t,
			zapto: t,
			dynserv: t,
			"now-dns": t,
			"is-local": t,
			httpbin: t,
			pubtls: t,
			jpn: t,
			"my-firewall": t,
			myfirewall: t,
			spdns: t,
			"small-web": t,
			dsmynas: t,
			familyds: t,
			teckids: Me,
			tuxfamily: t,
			hk: t,
			us: t,
			toolforge: t,
			wmcloud: [2, { beta: t }],
			wmflabs: t,
			za: t
		}],
		pa: [1, {
			abo: e,
			ac: e,
			com: e,
			edu: e,
			gob: e,
			ing: e,
			med: e,
			net: e,
			nom: e,
			org: e,
			sld: e
		}],
		pe: [1, {
			com: e,
			edu: e,
			gob: e,
			mil: e,
			net: e,
			nom: e,
			org: e
		}],
		pf: [1, {
			com: e,
			edu: e,
			org: e
		}],
		pg: v,
		ph: [1, {
			com: e,
			edu: e,
			gov: e,
			i: e,
			mil: e,
			net: e,
			ngo: e,
			org: e,
			cloudns: t
		}],
		pk: [1, {
			ac: e,
			biz: e,
			com: e,
			edu: e,
			fam: e,
			gkp: e,
			gob: e,
			gog: e,
			gok: e,
			gop: e,
			gos: e,
			gov: e,
			net: e,
			org: e,
			web: e
		}],
		pl: [1, {
			com: e,
			net: e,
			org: e,
			agro: e,
			aid: e,
			atm: e,
			auto: e,
			biz: e,
			edu: e,
			gmina: e,
			gsm: e,
			info: e,
			mail: e,
			media: e,
			miasta: e,
			mil: e,
			nieruchomosci: e,
			nom: e,
			pc: e,
			powiat: e,
			priv: e,
			realestate: e,
			rel: e,
			sex: e,
			shop: e,
			sklep: e,
			sos: e,
			szkola: e,
			targi: e,
			tm: e,
			tourism: e,
			travel: e,
			turystyka: e,
			gov: [1, {
				ap: e,
				griw: e,
				ic: e,
				is: e,
				kmpsp: e,
				konsulat: e,
				kppsp: e,
				kwp: e,
				kwpsp: e,
				mup: e,
				mw: e,
				oia: e,
				oirm: e,
				oke: e,
				oow: e,
				oschr: e,
				oum: e,
				pa: e,
				pinb: e,
				piw: e,
				po: e,
				pr: e,
				psp: e,
				psse: e,
				pup: e,
				rzgw: e,
				sa: e,
				sdn: e,
				sko: e,
				so: e,
				sr: e,
				starostwo: e,
				ug: e,
				ugim: e,
				um: e,
				umig: e,
				upow: e,
				uppo: e,
				us: e,
				uw: e,
				uzs: e,
				wif: e,
				wiih: e,
				winb: e,
				wios: e,
				witd: e,
				wiw: e,
				wkz: e,
				wsa: e,
				wskr: e,
				wsse: e,
				wuoz: e,
				wzmiuw: e,
				zp: e,
				zpisdn: e
			}],
			augustow: e,
			"babia-gora": e,
			bedzin: e,
			beskidy: e,
			bialowieza: e,
			bialystok: e,
			bielawa: e,
			bieszczady: e,
			boleslawiec: e,
			bydgoszcz: e,
			bytom: e,
			cieszyn: e,
			czeladz: e,
			czest: e,
			dlugoleka: e,
			elblag: e,
			elk: e,
			glogow: e,
			gniezno: e,
			gorlice: e,
			grajewo: e,
			ilawa: e,
			jaworzno: e,
			"jelenia-gora": e,
			jgora: e,
			kalisz: e,
			karpacz: e,
			kartuzy: e,
			kaszuby: e,
			katowice: e,
			"kazimierz-dolny": e,
			kepno: e,
			ketrzyn: e,
			klodzko: e,
			kobierzyce: e,
			kolobrzeg: e,
			konin: e,
			konskowola: e,
			kutno: e,
			lapy: e,
			lebork: e,
			legnica: e,
			lezajsk: e,
			limanowa: e,
			lomza: e,
			lowicz: e,
			lubin: e,
			lukow: e,
			malbork: e,
			malopolska: e,
			mazowsze: e,
			mazury: e,
			mielec: e,
			mielno: e,
			mragowo: e,
			naklo: e,
			nowaruda: e,
			nysa: e,
			olawa: e,
			olecko: e,
			olkusz: e,
			olsztyn: e,
			opoczno: e,
			opole: e,
			ostroda: e,
			ostroleka: e,
			ostrowiec: e,
			ostrowwlkp: e,
			pila: e,
			pisz: e,
			podhale: e,
			podlasie: e,
			polkowice: e,
			pomorskie: e,
			pomorze: e,
			prochowice: e,
			pruszkow: e,
			przeworsk: e,
			pulawy: e,
			radom: e,
			"rawa-maz": e,
			rybnik: e,
			rzeszow: e,
			sanok: e,
			sejny: e,
			skoczow: e,
			slask: e,
			slupsk: e,
			sosnowiec: e,
			"stalowa-wola": e,
			starachowice: e,
			stargard: e,
			suwalki: e,
			swidnica: e,
			swiebodzin: e,
			swinoujscie: e,
			szczecin: e,
			szczytno: e,
			tarnobrzeg: e,
			tgory: e,
			turek: e,
			tychy: e,
			ustka: e,
			walbrzych: e,
			warmia: e,
			warszawa: e,
			waw: e,
			wegrow: e,
			wielun: e,
			wlocl: e,
			wloclawek: e,
			wodzislaw: e,
			wolomin: e,
			wroclaw: e,
			zachpomor: e,
			zagan: e,
			zarow: e,
			zgora: e,
			zgorzelec: e,
			art: t,
			gliwice: t,
			krakow: t,
			poznan: t,
			wroc: t,
			zakopane: t,
			beep: t,
			"ecommerce-shop": t,
			cfolks: t,
			dfirma: t,
			dkonto: t,
			you2: t,
			shoparena: t,
			homesklep: t,
			sdscloud: t,
			unicloud: t,
			lodz: t,
			pabianice: t,
			plock: t,
			sieradz: t,
			skierniewice: t,
			zgierz: t,
			krasnik: t,
			leczna: t,
			lubartow: t,
			lublin: t,
			poniatowa: t,
			swidnik: t,
			co: t,
			torun: t,
			simplesite: t,
			myspreadshop: t,
			gda: t,
			gdansk: t,
			gdynia: t,
			med: t,
			sopot: t,
			bielsko: t
		}],
		pm: [1, {
			own: t,
			name: t
		}],
		pn: [1, {
			co: e,
			edu: e,
			gov: e,
			net: e,
			org: e
		}],
		post: e,
		pr: [1, {
			biz: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			isla: e,
			name: e,
			net: e,
			org: e,
			pro: e,
			ac: e,
			est: e,
			prof: e
		}],
		pro: [1, {
			aaa: e,
			aca: e,
			acct: e,
			avocat: e,
			bar: e,
			cpa: e,
			eng: e,
			jur: e,
			law: e,
			med: e,
			recht: e,
			cloudns: t,
			keenetic: t,
			barsy: t,
			ngrok: t
		}],
		ps: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			plo: e,
			sec: e
		}],
		pt: [1, {
			com: e,
			edu: e,
			gov: e,
			int: e,
			net: e,
			nome: e,
			org: e,
			publ: e,
			"123paginaweb": t
		}],
		pw: [1, {
			gov: e,
			cloudns: t,
			x443: t
		}],
		py: [1, {
			com: e,
			coop: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e
		}],
		qa: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			sch: e
		}],
		re: [1, {
			asso: e,
			com: e,
			netlib: t,
			can: t
		}],
		ro: [1, {
			arts: e,
			com: e,
			firm: e,
			info: e,
			nom: e,
			nt: e,
			org: e,
			rec: e,
			store: e,
			tm: e,
			www: e,
			co: t,
			shop: t,
			barsy: t
		}],
		rs: [1, {
			ac: e,
			co: e,
			edu: e,
			gov: e,
			in: e,
			org: e,
			brendly: _,
			barsy: t,
			ox: t
		}],
		ru: [1, {
			ac: t,
			edu: t,
			gov: t,
			int: t,
			mil: t,
			eurodir: t,
			adygeya: t,
			bashkiria: t,
			bir: t,
			cbg: t,
			com: t,
			dagestan: t,
			grozny: t,
			kalmykia: t,
			kustanai: t,
			marine: t,
			mordovia: t,
			msk: t,
			mytis: t,
			nalchik: t,
			nov: t,
			pyatigorsk: t,
			spb: t,
			vladikavkaz: t,
			vladimir: t,
			na4u: t,
			mircloud: t,
			myjino: [2, {
				hosting: i,
				landing: i,
				spectrum: i,
				vps: i
			}],
			cldmail: [0, { hb: t }],
			mcdir: [2, { vps: t }],
			mcpre: t,
			net: t,
			org: t,
			pp: t,
			ras: t
		}],
		rw: [1, {
			ac: e,
			co: e,
			coop: e,
			gov: e,
			mil: e,
			net: e,
			org: e
		}],
		sa: [1, {
			com: e,
			edu: e,
			gov: e,
			med: e,
			net: e,
			org: e,
			pub: e,
			sch: e
		}],
		sb: n,
		sc: n,
		sd: [1, {
			com: e,
			edu: e,
			gov: e,
			info: e,
			med: e,
			net: e,
			org: e,
			tv: e
		}],
		se: [1, {
			a: e,
			ac: e,
			b: e,
			bd: e,
			brand: e,
			c: e,
			d: e,
			e,
			f: e,
			fh: e,
			fhsk: e,
			fhv: e,
			g: e,
			h: e,
			i: e,
			k: e,
			komforb: e,
			kommunalforbund: e,
			komvux: e,
			l: e,
			lanbib: e,
			m: e,
			n: e,
			naturbruksgymn: e,
			o: e,
			org: e,
			p: e,
			parti: e,
			pp: e,
			press: e,
			r: e,
			s: e,
			t: e,
			tm: e,
			u: e,
			w: e,
			x: e,
			y: e,
			z: e,
			com: t,
			iopsys: t,
			"123minsida": t,
			itcouldbewor: t,
			myspreadshop: t
		}],
		sg: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			enscaled: t
		}],
		sh: [1, {
			com: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			hashbang: t,
			botda: t,
			lovable: t,
			platform: [0, {
				ent: t,
				eu: t,
				us: t
			}],
			teleport: t,
			now: t
		}],
		si: [1, {
			f5: t,
			gitapp: t,
			gitpage: t
		}],
		sj: e,
		sk: [1, { org: e }],
		sl: n,
		sm: e,
		sn: [1, {
			art: e,
			com: e,
			edu: e,
			gouv: e,
			org: e,
			univ: e
		}],
		so: [1, {
			com: e,
			edu: e,
			gov: e,
			me: e,
			net: e,
			org: e,
			surveys: t
		}],
		sr: e,
		ss: [1, {
			biz: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			me: e,
			net: e,
			org: e,
			sch: e
		}],
		st: [1, {
			co: e,
			com: e,
			consulado: e,
			edu: e,
			embaixada: e,
			mil: e,
			net: e,
			org: e,
			principe: e,
			saotome: e,
			store: e,
			helioho: t,
			cn: i,
			kirara: t,
			noho: t
		}],
		su: [1, {
			abkhazia: t,
			adygeya: t,
			aktyubinsk: t,
			arkhangelsk: t,
			armenia: t,
			ashgabad: t,
			azerbaijan: t,
			balashov: t,
			bashkiria: t,
			bryansk: t,
			bukhara: t,
			chimkent: t,
			dagestan: t,
			"east-kazakhstan": t,
			exnet: t,
			georgia: t,
			grozny: t,
			ivanovo: t,
			jambyl: t,
			kalmykia: t,
			kaluga: t,
			karacol: t,
			karaganda: t,
			karelia: t,
			khakassia: t,
			krasnodar: t,
			kurgan: t,
			kustanai: t,
			lenug: t,
			mangyshlak: t,
			mordovia: t,
			msk: t,
			murmansk: t,
			nalchik: t,
			navoi: t,
			"north-kazakhstan": t,
			nov: t,
			obninsk: t,
			penza: t,
			pokrovsk: t,
			sochi: t,
			spb: t,
			tashkent: t,
			termez: t,
			togliatti: t,
			troitsk: t,
			tselinograd: t,
			tula: t,
			tuva: t,
			vladikavkaz: t,
			vladimir: t,
			vologda: t
		}],
		sv: [1, {
			com: e,
			edu: e,
			gob: e,
			org: e,
			red: e
		}],
		sx: c,
		sy: r,
		sz: [1, {
			ac: e,
			co: e,
			org: e
		}],
		tc: e,
		td: e,
		tel: e,
		tf: [1, { sch: t }],
		tg: e,
		th: [1, {
			ac: e,
			co: e,
			go: e,
			in: e,
			mi: e,
			net: e,
			or: e,
			online: t,
			shop: t
		}],
		tj: [1, {
			ac: e,
			biz: e,
			co: e,
			com: e,
			edu: e,
			go: e,
			gov: e,
			int: e,
			mil: e,
			name: e,
			net: e,
			nic: e,
			org: e,
			test: e,
			web: e
		}],
		tk: e,
		tl: c,
		tm: [1, {
			co: e,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			nom: e,
			org: e
		}],
		tn: [1, {
			com: e,
			ens: e,
			fin: e,
			gov: e,
			ind: e,
			info: e,
			intl: e,
			mincom: e,
			nat: e,
			net: e,
			org: e,
			perso: e,
			tourism: e,
			orangecloud: t
		}],
		to: [1, {
			611: t,
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			oya: t,
			x0: t,
			quickconnect: oe,
			vpnplus: t,
			nett: t
		}],
		tr: [1, {
			av: e,
			bbs: e,
			bel: e,
			biz: e,
			com: e,
			dr: e,
			edu: e,
			gen: e,
			gov: e,
			info: e,
			k12: e,
			kep: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			pol: e,
			tel: e,
			tsk: e,
			tv: e,
			web: e,
			nc: c
		}],
		tt: [1, {
			biz: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			mil: e,
			name: e,
			net: e,
			org: e,
			pro: e
		}],
		tv: [1, {
			"better-than": t,
			dyndns: t,
			"on-the-web": t,
			"worse-than": t,
			from: t,
			sakura: t
		}],
		tw: [1, {
			club: e,
			com: [1, { mymailer: t }],
			ebiz: e,
			edu: e,
			game: e,
			gov: e,
			idv: e,
			mil: e,
			net: e,
			org: e,
			url: t,
			mydns: t
		}],
		tz: [1, {
			ac: e,
			co: e,
			go: e,
			hotel: e,
			info: e,
			me: e,
			mil: e,
			mobi: e,
			ne: e,
			or: e,
			sc: e,
			tv: e
		}],
		ua: [1, {
			com: e,
			edu: e,
			gov: e,
			in: e,
			net: e,
			org: e,
			cherkassy: e,
			cherkasy: e,
			chernigov: e,
			chernihiv: e,
			chernivtsi: e,
			chernovtsy: e,
			ck: e,
			cn: e,
			cr: e,
			crimea: e,
			cv: e,
			dn: e,
			dnepropetrovsk: e,
			dnipropetrovsk: e,
			donetsk: e,
			dp: e,
			if: e,
			"ivano-frankivsk": e,
			kh: e,
			kharkiv: e,
			kharkov: e,
			kherson: e,
			khmelnitskiy: e,
			khmelnytskyi: e,
			kiev: e,
			kirovograd: e,
			km: e,
			kr: e,
			kropyvnytskyi: e,
			krym: e,
			ks: e,
			kv: e,
			kyiv: e,
			lg: e,
			lt: e,
			lugansk: e,
			luhansk: e,
			lutsk: e,
			lv: e,
			lviv: e,
			mk: e,
			mykolaiv: e,
			nikolaev: e,
			od: e,
			odesa: e,
			odessa: e,
			pl: e,
			poltava: e,
			rivne: e,
			rovno: e,
			rv: e,
			sb: e,
			sebastopol: e,
			sevastopol: e,
			sm: e,
			sumy: e,
			te: e,
			ternopil: e,
			uz: e,
			uzhgorod: e,
			uzhhorod: e,
			vinnica: e,
			vinnytsia: e,
			vn: e,
			volyn: e,
			yalta: e,
			zakarpattia: e,
			zaporizhzhe: e,
			zaporizhzhia: e,
			zhitomir: e,
			zhytomyr: e,
			zp: e,
			zt: e,
			cc: t,
			inf: t,
			ltd: t,
			cx: t,
			biz: t,
			co: t,
			pp: t,
			v: t
		}],
		ug: [1, {
			ac: e,
			co: e,
			com: e,
			edu: e,
			go: e,
			gov: e,
			mil: e,
			ne: e,
			or: e,
			org: e,
			sc: e,
			us: e
		}],
		uk: [1, {
			ac: e,
			co: [1, {
				bytemark: [0, {
					dh: t,
					vm: t
				}],
				layershift: Ce,
				barsy: t,
				barsyonline: t,
				retrosnub: je,
				"nh-serv": t,
				"no-ip": t,
				adimo: t,
				myspreadshop: t
			}],
			gov: [1, {
				api: t,
				campaign: t,
				service: t
			}],
			ltd: e,
			me: e,
			net: e,
			nhs: e,
			org: [1, {
				glug: t,
				lug: t,
				lugs: t,
				affinitylottery: t,
				raffleentry: t,
				weeklylottery: t
			}],
			plc: e,
			police: e,
			sch: v,
			conn: t,
			copro: t,
			hosp: t,
			"independent-commission": t,
			"independent-inquest": t,
			"independent-inquiry": t,
			"independent-panel": t,
			"independent-review": t,
			"public-inquiry": t,
			"royal-commission": t,
			pymnt: t,
			barsy: t,
			nimsite: t,
			oraclegovcloudapps: i
		}],
		us: [1, {
			dni: e,
			isa: e,
			nsn: e,
			ak: D,
			al: D,
			ar: D,
			as: D,
			az: D,
			ca: D,
			co: D,
			ct: D,
			dc: D,
			de: ze,
			fl: D,
			ga: D,
			gu: D,
			hi: Be,
			ia: D,
			id: D,
			il: D,
			in: D,
			ks: D,
			ky: D,
			la: D,
			ma: [1, {
				k12: [1, {
					chtr: e,
					paroch: e,
					pvt: e
				}],
				cc: e,
				lib: e
			}],
			md: D,
			me: D,
			mi: [1, {
				k12: e,
				cc: e,
				lib: e,
				"ann-arbor": e,
				cog: e,
				dst: e,
				eaton: e,
				gen: e,
				mus: e,
				tec: e,
				washtenaw: e
			}],
			mn: D,
			mo: D,
			ms: [1, {
				k12: e,
				cc: e
			}],
			mt: D,
			nc: D,
			nd: Be,
			ne: D,
			nh: D,
			nj: D,
			nm: D,
			nv: D,
			ny: D,
			oh: D,
			ok: D,
			or: D,
			pa: D,
			pr: D,
			ri: Be,
			sc: D,
			sd: Be,
			tn: D,
			tx: D,
			ut: D,
			va: D,
			vi: D,
			vt: D,
			wa: D,
			wi: D,
			wv: ze,
			wy: D,
			cloudns: t,
			"is-by": t,
			"land-4-sale": t,
			"stuff-4-sale": t,
			heliohost: t,
			enscaled: [0, { phx: t }],
			mircloud: t,
			"azure-api": t,
			azurewebsites: t,
			ngo: t,
			golffan: t,
			noip: t,
			pointto: t,
			freeddns: t,
			srv: [2, {
				gh: t,
				gl: t
			}],
			servername: t
		}],
		uy: [1, {
			com: e,
			edu: e,
			gub: e,
			mil: e,
			net: e,
			org: e,
			gv: t
		}],
		uz: [1, {
			co: e,
			com: e,
			net: e,
			org: e
		}],
		va: e,
		vc: [1, {
			com: e,
			edu: e,
			gov: e,
			mil: e,
			net: e,
			org: e,
			gv: [2, { d: t }],
			"0e": i,
			mydns: t
		}],
		ve: [1, {
			arts: e,
			bib: e,
			co: e,
			com: e,
			e12: e,
			edu: e,
			emprende: e,
			firm: e,
			gob: e,
			gov: e,
			ia: e,
			info: e,
			int: e,
			mil: e,
			net: e,
			nom: e,
			org: e,
			rar: e,
			rec: e,
			store: e,
			tec: e,
			web: e
		}],
		vg: [1, { edu: e }],
		vi: [1, {
			co: e,
			com: e,
			k12: e,
			net: e,
			org: e
		}],
		vn: [1, {
			ac: e,
			ai: e,
			biz: e,
			com: e,
			edu: e,
			gov: e,
			health: e,
			id: e,
			info: e,
			int: e,
			io: e,
			name: e,
			net: e,
			org: e,
			pro: e,
			angiang: e,
			bacgiang: e,
			backan: e,
			baclieu: e,
			bacninh: e,
			"baria-vungtau": e,
			bentre: e,
			binhdinh: e,
			binhduong: e,
			binhphuoc: e,
			binhthuan: e,
			camau: e,
			cantho: e,
			caobang: e,
			daklak: e,
			daknong: e,
			danang: e,
			dienbien: e,
			dongnai: e,
			dongthap: e,
			gialai: e,
			hagiang: e,
			haiduong: e,
			haiphong: e,
			hanam: e,
			hanoi: e,
			hatinh: e,
			haugiang: e,
			hoabinh: e,
			hue: e,
			hungyen: e,
			khanhhoa: e,
			kiengiang: e,
			kontum: e,
			laichau: e,
			lamdong: e,
			langson: e,
			laocai: e,
			longan: e,
			namdinh: e,
			nghean: e,
			ninhbinh: e,
			ninhthuan: e,
			phutho: e,
			phuyen: e,
			quangbinh: e,
			quangnam: e,
			quangngai: e,
			quangninh: e,
			quangtri: e,
			soctrang: e,
			sonla: e,
			tayninh: e,
			thaibinh: e,
			thainguyen: e,
			thanhhoa: e,
			thanhphohochiminh: e,
			thuathienhue: e,
			tiengiang: e,
			travinh: e,
			tuyenquang: e,
			vinhlong: e,
			vinhphuc: e,
			yenbai: e
		}],
		vu: Se,
		wf: [1, {
			biz: t,
			sch: t
		}],
		ws: [1, {
			com: e,
			edu: e,
			gov: e,
			net: e,
			org: e,
			advisor: i,
			cloud66: t,
			dyndns: t,
			mypets: t
		}],
		yt: [1, { org: t }],
		"xn--mgbaam7a8h": e,
		امارات: e,
		"xn--y9a3aq": e,
		հայ: e,
		"xn--54b7fta0cc": e,
		বাংলা: e,
		"xn--90ae": e,
		бг: e,
		"xn--mgbcpq6gpa1a": e,
		البحرين: e,
		"xn--90ais": e,
		бел: e,
		"xn--fiqs8s": e,
		中国: e,
		"xn--fiqz9s": e,
		中國: e,
		"xn--lgbbat1ad8j": e,
		الجزائر: e,
		"xn--wgbh1c": e,
		مصر: e,
		"xn--e1a4c": e,
		ею: e,
		"xn--qxa6a": e,
		ευ: e,
		"xn--mgbah1a3hjkrd": e,
		موريتانيا: e,
		"xn--node": e,
		გე: e,
		"xn--qxam": e,
		ελ: e,
		"xn--j6w193g": [1, {
			"xn--gmqw5a": e,
			"xn--55qx5d": e,
			"xn--mxtq1m": e,
			"xn--wcvs22d": e,
			"xn--uc0atv": e,
			"xn--od0alg": e
		}],
		香港: [1, {
			個人: e,
			公司: e,
			政府: e,
			教育: e,
			組織: e,
			網絡: e
		}],
		"xn--2scrj9c": e,
		ಭಾರತ: e,
		"xn--3hcrj9c": e,
		ଭାରତ: e,
		"xn--45br5cyl": e,
		ভাৰত: e,
		"xn--h2breg3eve": e,
		भारतम्: e,
		"xn--h2brj9c8c": e,
		भारोत: e,
		"xn--mgbgu82a": e,
		ڀارت: e,
		"xn--rvc1e0am3e": e,
		ഭാരതം: e,
		"xn--h2brj9c": e,
		भारत: e,
		"xn--mgbbh1a": e,
		بارت: e,
		"xn--mgbbh1a71e": e,
		بھارت: e,
		"xn--fpcrj9c3d": e,
		భారత్: e,
		"xn--gecrj9c": e,
		ભારત: e,
		"xn--s9brj9c": e,
		ਭਾਰਤ: e,
		"xn--45brj9c": e,
		ভারত: e,
		"xn--xkc2dl3a5ee0h": e,
		இந்தியா: e,
		"xn--mgba3a4f16a": e,
		ایران: e,
		"xn--mgba3a4fra": e,
		ايران: e,
		"xn--mgbtx2b": e,
		عراق: e,
		"xn--mgbayh7gpa": e,
		الاردن: e,
		"xn--3e0b707e": e,
		한국: e,
		"xn--80ao21a": e,
		қаз: e,
		"xn--q7ce6a": e,
		ລາວ: e,
		"xn--fzc2c9e2c": e,
		ලංකා: e,
		"xn--xkc2al3hye2a": e,
		இலங்கை: e,
		"xn--mgbc0a9azcg": e,
		المغرب: e,
		"xn--d1alf": e,
		мкд: e,
		"xn--l1acc": e,
		мон: e,
		"xn--mix891f": e,
		澳門: e,
		"xn--mix082f": e,
		澳门: e,
		"xn--mgbx4cd0ab": e,
		مليسيا: e,
		"xn--mgb9awbf": e,
		عمان: e,
		"xn--mgbai9azgqp6j": e,
		پاکستان: e,
		"xn--mgbai9a5eva00b": e,
		پاكستان: e,
		"xn--ygbi2ammx": e,
		فلسطين: e,
		"xn--90a3ac": [1, {
			"xn--80au": e,
			"xn--90azh": e,
			"xn--d1at": e,
			"xn--c1avg": e,
			"xn--o1ac": e,
			"xn--o1ach": e
		}],
		срб: [1, {
			ак: e,
			обр: e,
			од: e,
			орг: e,
			пр: e,
			упр: e
		}],
		"xn--p1ai": e,
		рф: e,
		"xn--wgbl6a": e,
		قطر: e,
		"xn--mgberp4a5d4ar": e,
		السعودية: e,
		"xn--mgberp4a5d4a87g": e,
		السعودیة: e,
		"xn--mgbqly7c0a67fbc": e,
		السعودیۃ: e,
		"xn--mgbqly7cvafr": e,
		السعوديه: e,
		"xn--mgbpl2fh": e,
		سودان: e,
		"xn--yfro4i67o": e,
		新加坡: e,
		"xn--clchc0ea0b2g2a9gcd": e,
		சிங்கப்பூர்: e,
		"xn--ogbpf8fl": e,
		سورية: e,
		"xn--mgbtf8fl": e,
		سوريا: e,
		"xn--o3cw4h": [1, {
			"xn--o3cyx2a": e,
			"xn--12co0c3b4eva": e,
			"xn--m3ch0j3a": e,
			"xn--h3cuzk1di": e,
			"xn--12c1fe0br": e,
			"xn--12cfi8ixb8l": e
		}],
		ไทย: [1, {
			ทหาร: e,
			ธุรกิจ: e,
			เน็ต: e,
			รัฐบาล: e,
			ศึกษา: e,
			องค์กร: e
		}],
		"xn--pgbs0dh": e,
		تونس: e,
		"xn--kpry57d": e,
		台灣: e,
		"xn--kprw13d": e,
		台湾: e,
		"xn--nnx388a": e,
		臺灣: e,
		"xn--j1amh": e,
		укр: e,
		"xn--mgb2ddes": e,
		اليمن: e,
		xxx: e,
		ye: r,
		za: [0, {
			ac: e,
			agric: e,
			alt: e,
			co: e,
			edu: e,
			gov: e,
			grondar: e,
			law: e,
			mil: e,
			net: e,
			ngo: e,
			nic: e,
			nis: e,
			nom: e,
			org: e,
			school: e,
			tm: e,
			web: e
		}],
		zm: [1, {
			ac: e,
			biz: e,
			co: e,
			com: e,
			edu: e,
			gov: e,
			info: e,
			mil: e,
			net: e,
			org: e,
			sch: e
		}],
		zw: [1, {
			ac: e,
			co: e,
			gov: e,
			mil: e,
			org: e
		}],
		aaa: e,
		aarp: e,
		abb: e,
		abbott: e,
		abbvie: e,
		abc: e,
		able: e,
		abogado: e,
		abudhabi: e,
		academy: [1, { official: t }],
		accenture: e,
		accountant: e,
		accountants: e,
		aco: e,
		actor: e,
		ads: e,
		adult: e,
		aeg: e,
		aetna: e,
		afl: e,
		africa: e,
		agakhan: e,
		agency: e,
		aig: e,
		airbus: e,
		airforce: e,
		airtel: e,
		akdn: e,
		alibaba: e,
		alipay: e,
		allfinanz: e,
		allstate: e,
		ally: e,
		alsace: e,
		alstom: e,
		amazon: e,
		americanexpress: e,
		americanfamily: e,
		amex: e,
		amfam: e,
		amica: e,
		amsterdam: e,
		analytics: e,
		android: e,
		anquan: e,
		anz: e,
		aol: e,
		apartments: e,
		app: [1, {
			adaptable: t,
			aiven: t,
			beget: i,
			brave: a,
			clerk: t,
			clerkstage: t,
			cloudflare: t,
			wnext: t,
			csb: [2, { preview: t }],
			convex: t,
			corespeed: t,
			deta: t,
			ondigitalocean: t,
			easypanel: t,
			encr: [2, { frontend: t }],
			evervault: o,
			expo: [2, {
				on: t,
				staging: [2, { on: t }]
			}],
			edgecompute: t,
			"on-fleek": t,
			flutterflow: t,
			sprites: t,
			e2b: t,
			framer: t,
			gadget: t,
			github: t,
			hosted: i,
			run: [0, {
				"*": t,
				mtls: i
			}],
			web: t,
			hackclub: t,
			hasura: t,
			onhercules: t,
			botdash: t,
			shiptoday: t,
			leapcell: t,
			loginline: t,
			lovable: t,
			luyani: t,
			magicpatterns: t,
			medusajs: t,
			messerli: t,
			miren: t,
			mocha: t,
			netlify: t,
			ngrok: t,
			"ngrok-free": t,
			developer: i,
			noop: t,
			northflank: i,
			upsun: i,
			railway: [0, { up: t }],
			replit: s,
			nyat: t,
			snowflake: [0, {
				"*": t,
				privatelink: i
			}],
			streamlit: t,
			spawnbase: t,
			telebit: t,
			typedream: t,
			vercel: t,
			wal: t,
			wasmer: t,
			bookonline: t,
			windsurf: t,
			base44: t,
			zeabur: t,
			zerops: i
		}],
		apple: [1, { int: [2, { cloud: [0, {
			"*": t,
			r: [0, {
				"*": t,
				"ap-north-1": i,
				"ap-south-1": i,
				"ap-south-2": i,
				"eu-central-1": i,
				"eu-north-1": i,
				"us-central-1": i,
				"us-central-2": i,
				"us-east-1": i,
				"us-east-2": i,
				"us-west-1": i,
				"us-west-2": i,
				"us-west-3": i
			}]
		}] }] }],
		aquarelle: e,
		arab: e,
		aramco: e,
		archi: e,
		army: e,
		art: e,
		arte: e,
		asda: e,
		associates: e,
		athleta: e,
		attorney: e,
		auction: e,
		audi: e,
		audible: e,
		audio: e,
		auspost: e,
		author: e,
		auto: e,
		autos: e,
		aws: [1, {
			on: [0, {
				"af-south-1": l,
				"ap-east-1": l,
				"ap-northeast-1": l,
				"ap-northeast-2": l,
				"ap-northeast-3": l,
				"ap-south-1": l,
				"ap-south-2": u,
				"ap-southeast-1": l,
				"ap-southeast-2": l,
				"ap-southeast-3": l,
				"ap-southeast-4": u,
				"ap-southeast-5": u,
				"ca-central-1": l,
				"ca-west-1": u,
				"eu-central-1": l,
				"eu-central-2": u,
				"eu-north-1": l,
				"eu-south-1": l,
				"eu-south-2": u,
				"eu-west-1": l,
				"eu-west-2": l,
				"eu-west-3": l,
				"il-central-1": u,
				"me-central-1": u,
				"me-south-1": l,
				"sa-east-1": l,
				"us-east-1": l,
				"us-east-2": l,
				"us-west-1": l,
				"us-west-2": l,
				"ap-southeast-7": d,
				"mx-central-1": d,
				"us-gov-east-1": f,
				"us-gov-west-1": f
			}],
			sagemaker: [0, {
				"ap-northeast-1": m,
				"ap-northeast-2": m,
				"ap-south-1": m,
				"ap-southeast-1": m,
				"ap-southeast-2": m,
				"ca-central-1": g,
				"eu-central-1": m,
				"eu-west-1": m,
				"eu-west-2": m,
				"us-east-1": g,
				"us-east-2": g,
				"us-west-2": g,
				"af-south-1": p,
				"ap-east-1": p,
				"ap-northeast-3": p,
				"ap-south-2": h,
				"ap-southeast-3": p,
				"ap-southeast-4": h,
				"ca-west-1": [0, {
					notebook: t,
					"notebook-fips": t
				}],
				"eu-central-2": p,
				"eu-north-1": p,
				"eu-south-1": p,
				"eu-south-2": p,
				"eu-west-3": p,
				"il-central-1": p,
				"me-central-1": p,
				"me-south-1": p,
				"sa-east-1": p,
				"us-gov-east-1": ee,
				"us-gov-west-1": ee,
				"us-west-1": [0, {
					notebook: t,
					"notebook-fips": t,
					studio: t
				}],
				experiments: i
			}],
			repost: [0, { private: i }]
		}],
		axa: e,
		azure: e,
		baby: e,
		baidu: e,
		banamex: e,
		band: e,
		bank: e,
		bar: e,
		barcelona: e,
		barclaycard: e,
		barclays: e,
		barefoot: e,
		bargains: e,
		baseball: e,
		basketball: [1, {
			aus: t,
			nz: t
		}],
		bauhaus: e,
		bayern: e,
		bbc: e,
		bbt: e,
		bbva: e,
		bcg: e,
		bcn: e,
		beats: e,
		beauty: e,
		beer: e,
		berlin: e,
		best: e,
		bestbuy: e,
		bet: e,
		bharti: e,
		bible: e,
		bid: e,
		bike: e,
		bing: e,
		bingo: e,
		bio: e,
		black: e,
		blackfriday: e,
		blockbuster: e,
		blog: e,
		bloomberg: e,
		blue: e,
		bms: e,
		bmw: e,
		bnpparibas: e,
		boats: e,
		boehringer: e,
		bofa: e,
		bom: e,
		bond: e,
		boo: e,
		book: e,
		booking: e,
		bosch: e,
		bostik: e,
		boston: e,
		bot: e,
		boutique: e,
		box: e,
		bradesco: e,
		bridgestone: e,
		broadway: e,
		broker: e,
		brother: e,
		brussels: e,
		build: [1, {
			shiptoday: t,
			v0: t,
			windsurf: t
		}],
		builders: [1, { cloudsite: t }],
		business: te,
		buy: e,
		buzz: e,
		bzh: e,
		cab: e,
		cafe: e,
		cal: e,
		call: e,
		calvinklein: e,
		cam: e,
		camera: e,
		camp: [1, { emf: [0, { at: t }] }],
		canon: e,
		capetown: e,
		capital: e,
		capitalone: e,
		car: e,
		caravan: e,
		cards: e,
		care: e,
		career: e,
		careers: e,
		cars: e,
		casa: [1, { nabu: [0, { ui: t }] }],
		case: [1, { sav: t }],
		cash: e,
		casino: e,
		catering: e,
		catholic: e,
		cba: e,
		cbn: e,
		cbre: e,
		center: e,
		ceo: e,
		cern: e,
		cfa: e,
		cfd: e,
		chanel: e,
		channel: e,
		charity: e,
		chase: e,
		chat: e,
		cheap: e,
		chintai: e,
		christmas: e,
		chrome: e,
		church: e,
		cipriani: e,
		circle: e,
		cisco: e,
		citadel: e,
		citi: e,
		citic: e,
		city: e,
		claims: e,
		cleaning: e,
		click: e,
		clinic: e,
		clinique: e,
		clothing: e,
		cloud: [1, {
			antagonist: t,
			begetcdn: i,
			convex: ne,
			elementor: t,
			emergent: t,
			encoway: [0, { eu: t }],
			statics: i,
			ravendb: t,
			axarnet: [0, { "es-1": t }],
			diadem: t,
			jelastic: [0, { vip: t }],
			jele: t,
			"jenv-aruba": [0, {
				aruba: [0, { eur: [0, { it1: t }] }],
				it1: t
			}],
			keliweb: [2, { cs: t }],
			oxa: [2, {
				tn: t,
				uk: t
			}],
			primetel: [2, { uk: t }],
			reclaim: [0, {
				ca: t,
				uk: t,
				us: t
			}],
			trendhosting: [0, {
				ch: t,
				de: t
			}],
			jote: t,
			jotelulu: t,
			kuleuven: t,
			laravel: t,
			linkyard: t,
			magentosite: i,
			matlab: t,
			observablehq: t,
			perspecta: t,
			vapor: t,
			"on-rancher": i,
			scw: [0, {
				baremetal: [0, {
					"fr-par-1": t,
					"fr-par-2": t,
					"nl-ams-1": t
				}],
				"fr-par": [0, {
					cockpit: t,
					ddl: t,
					dtwh: t,
					fnc: [2, { functions: t }],
					ifr: t,
					k8s: b,
					kafk: t,
					mgdb: t,
					rdb: t,
					s3: t,
					"s3-website": t,
					scbl: t,
					whm: t
				}],
				instances: [0, {
					priv: t,
					pub: t
				}],
				k8s: t,
				"nl-ams": [0, {
					cockpit: t,
					ddl: t,
					dtwh: t,
					ifr: t,
					k8s: b,
					kafk: t,
					mgdb: t,
					rdb: t,
					s3: t,
					"s3-website": t,
					scbl: t,
					whm: t
				}],
				"pl-waw": [0, {
					cockpit: t,
					ddl: t,
					dtwh: t,
					ifr: t,
					k8s: b,
					kafk: t,
					mgdb: t,
					rdb: t,
					s3: t,
					"s3-website": t,
					scbl: t
				}],
				scalebook: t,
				smartlabeling: t
			}],
			servebolt: t,
			onstackit: [0, { runs: t }],
			trafficplex: t,
			"unison-services": t,
			urown: t,
			voorloper: t,
			zap: t
		}],
		club: [1, {
			cloudns: t,
			jele: t,
			barsy: t
		}],
		clubmed: e,
		coach: e,
		codes: [1, { owo: i }],
		coffee: e,
		college: e,
		cologne: e,
		commbank: e,
		community: [1, {
			nog: t,
			ravendb: t,
			myforum: t
		}],
		company: [1, { mybox: t }],
		compare: e,
		computer: e,
		comsec: e,
		condos: e,
		construction: e,
		consulting: e,
		contact: e,
		contractors: e,
		cooking: e,
		cool: [1, {
			elementor: t,
			de: t
		}],
		corsica: e,
		country: e,
		coupon: e,
		coupons: e,
		courses: e,
		cpa: e,
		credit: e,
		creditcard: e,
		creditunion: e,
		cricket: e,
		crown: e,
		crs: e,
		cruise: e,
		cruises: e,
		cuisinella: e,
		cymru: e,
		cyou: e,
		dad: e,
		dance: e,
		data: e,
		date: e,
		dating: e,
		datsun: e,
		day: e,
		dclk: e,
		dds: e,
		deal: e,
		dealer: e,
		deals: e,
		degree: e,
		delivery: e,
		dell: e,
		deloitte: e,
		delta: e,
		democrat: e,
		dental: e,
		dentist: e,
		desi: e,
		design: [1, {
			graphic: t,
			bss: t
		}],
		dev: [1, {
			myaddr: t,
			panel: t,
			bearblog: t,
			brave: a,
			lcl: i,
			lclstage: i,
			stg: i,
			stgstage: i,
			pages: t,
			r2: t,
			workers: t,
			deno: t,
			"deno-staging": t,
			deta: t,
			lp: [2, {
				api: t,
				objects: t
			}],
			evervault: o,
			fly: t,
			githubpreview: t,
			gateway: i,
			grebedoc: t,
			botdash: t,
			inbrowser: i,
			"is-a-good": t,
			iserv: t,
			leapcell: t,
			runcontainers: t,
			localcert: [0, { user: i }],
			loginline: t,
			barsy: t,
			mediatech: t,
			"mocha-sandbox": t,
			modx: t,
			ngrok: t,
			"ngrok-free": t,
			"is-a-fullstack": t,
			"is-cool": t,
			"is-not-a": t,
			localplayer: t,
			xmit: t,
			"platter-app": t,
			replit: [2, {
				archer: t,
				bones: t,
				canary: t,
				global: t,
				hacker: t,
				id: t,
				janeway: t,
				kim: t,
				kira: t,
				kirk: t,
				odo: t,
				paris: t,
				picard: t,
				pike: t,
				prerelease: t,
				reed: t,
				riker: t,
				sisko: t,
				spock: t,
				staging: t,
				sulu: t,
				tarpit: t,
				teams: t,
				tucker: t,
				wesley: t,
				worf: t
			}],
			crm: [0, {
				aa: i,
				ab: i,
				ac: i,
				ad: i,
				ae: i,
				af: i,
				ci: i,
				d: i,
				pa: i,
				pb: i,
				pc: i,
				pd: i,
				pe: i,
				pf: i,
				w: i,
				wa: i,
				wb: i,
				wc: i,
				wd: i,
				we: i,
				wf: i
			}],
			erp: Te,
			vercel: t,
			webhare: i,
			hrsn: t,
			"is-a": t
		}],
		dhl: e,
		diamonds: e,
		diet: e,
		digital: [1, { cloudapps: [2, { london: t }] }],
		direct: [1, { libp2p: t }],
		directory: e,
		discount: e,
		discover: e,
		dish: e,
		diy: [1, {
			discourse: t,
			imagine: t
		}],
		dnp: e,
		docs: e,
		doctor: e,
		dog: e,
		domains: e,
		dot: e,
		download: e,
		drive: e,
		dtv: e,
		dubai: e,
		dupont: e,
		durban: e,
		dvag: e,
		dvr: e,
		earth: e,
		eat: e,
		eco: e,
		edeka: e,
		education: te,
		email: [1, {
			crisp: [0, { on: t }],
			intouch: t,
			tawk: De,
			tawkto: De
		}],
		emerck: e,
		energy: e,
		engineer: e,
		engineering: e,
		enterprises: e,
		epson: e,
		equipment: e,
		ericsson: e,
		erni: e,
		esq: e,
		estate: [1, { compute: i }],
		eurovision: e,
		eus: [1, { party: Oe }],
		events: [1, {
			koobin: t,
			co: t
		}],
		exchange: e,
		expert: e,
		exposed: e,
		express: e,
		extraspace: e,
		fage: e,
		fail: e,
		fairwinds: e,
		faith: e,
		family: e,
		fan: e,
		fans: e,
		farm: [1, { storj: t }],
		farmers: e,
		fashion: e,
		fast: e,
		fedex: e,
		feedback: e,
		ferrari: e,
		ferrero: e,
		fidelity: e,
		fido: e,
		film: e,
		final: e,
		finance: e,
		financial: te,
		fire: e,
		firestone: e,
		firmdale: e,
		fish: e,
		fishing: e,
		fit: e,
		fitness: e,
		flickr: e,
		flights: e,
		flir: e,
		florist: e,
		flowers: e,
		fly: e,
		foo: e,
		food: e,
		football: e,
		ford: e,
		forex: e,
		forsale: e,
		forum: e,
		foundation: e,
		fox: e,
		free: e,
		fresenius: e,
		frl: e,
		frogans: e,
		frontier: e,
		ftr: e,
		fujitsu: e,
		fun: ke,
		fund: e,
		furniture: e,
		futbol: e,
		fyi: e,
		gal: e,
		gallery: e,
		gallo: e,
		gallup: e,
		game: e,
		games: [1, {
			pley: t,
			sheezy: t
		}],
		gap: e,
		garden: e,
		gay: [1, { pages: t }],
		gbiz: e,
		gdn: [1, { cnpy: t }],
		gea: e,
		gent: e,
		genting: e,
		george: e,
		ggee: e,
		gift: e,
		gifts: e,
		gives: e,
		giving: e,
		glass: e,
		gle: e,
		global: [1, { appwrite: t }],
		globo: e,
		gmail: e,
		gmbh: e,
		gmo: e,
		gmx: e,
		godaddy: e,
		gold: e,
		goldpoint: e,
		golf: e,
		goodyear: e,
		goog: [1, {
			cloud: t,
			translate: t,
			usercontent: i
		}],
		google: e,
		gop: e,
		got: e,
		grainger: e,
		graphics: e,
		gratis: e,
		green: e,
		gripe: e,
		grocery: e,
		group: [1, { discourse: t }],
		gucci: e,
		guge: e,
		guide: e,
		guitars: e,
		guru: e,
		hair: e,
		hamburg: e,
		hangout: e,
		haus: e,
		hbo: e,
		hdfc: e,
		hdfcbank: e,
		health: [1, { hra: t }],
		healthcare: e,
		help: e,
		helsinki: e,
		here: e,
		hermes: e,
		hiphop: e,
		hisamitsu: e,
		hitachi: e,
		hiv: e,
		hkt: e,
		hockey: e,
		holdings: e,
		holiday: e,
		homedepot: e,
		homegoods: e,
		homes: e,
		homesense: e,
		honda: e,
		horse: e,
		hospital: e,
		host: [1, {
			cloudaccess: t,
			freesite: t,
			easypanel: t,
			emergent: t,
			fastvps: t,
			myfast: t,
			gadget: t,
			tempurl: t,
			wpmudev: t,
			iserv: t,
			jele: t,
			mircloud: t,
			bolt: t,
			wp2: t,
			half: t
		}],
		hosting: [1, { opencraft: t }],
		hot: e,
		hotel: e,
		hotels: e,
		hotmail: e,
		house: e,
		how: e,
		hsbc: e,
		hughes: e,
		hyatt: e,
		hyundai: e,
		ibm: e,
		icbc: e,
		ice: e,
		icu: e,
		ieee: e,
		ifm: e,
		ikano: e,
		imamat: e,
		imdb: e,
		immo: e,
		immobilien: e,
		inc: e,
		industries: e,
		infiniti: e,
		ing: e,
		ink: e,
		institute: e,
		insurance: e,
		insure: e,
		international: e,
		intuit: e,
		investments: e,
		ipiranga: e,
		irish: e,
		ismaili: e,
		ist: e,
		istanbul: e,
		itau: e,
		itv: e,
		jaguar: e,
		java: e,
		jcb: e,
		jeep: e,
		jetzt: e,
		jewelry: e,
		jio: e,
		jll: e,
		jmp: e,
		jnj: e,
		joburg: e,
		jot: e,
		joy: e,
		jpmorgan: e,
		jprs: e,
		juegos: e,
		juniper: e,
		kaufen: e,
		kddi: e,
		kerryhotels: e,
		kerryproperties: e,
		kfh: e,
		kia: e,
		kids: e,
		kim: e,
		kindle: e,
		kitchen: e,
		kiwi: e,
		koeln: e,
		komatsu: e,
		kosher: e,
		kpmg: e,
		kpn: e,
		krd: [1, {
			co: t,
			edu: t
		}],
		kred: e,
		kuokgroup: e,
		kyoto: e,
		lacaixa: e,
		lamborghini: e,
		lamer: e,
		land: e,
		landrover: e,
		lanxess: e,
		lasalle: e,
		lat: e,
		latino: e,
		latrobe: e,
		law: e,
		lawyer: e,
		lds: e,
		lease: e,
		leclerc: e,
		lefrak: e,
		legal: e,
		lego: e,
		lexus: e,
		lgbt: e,
		lidl: e,
		life: e,
		lifeinsurance: e,
		lifestyle: e,
		lighting: e,
		like: e,
		lilly: e,
		limited: e,
		limo: e,
		lincoln: e,
		link: [1, {
			myfritz: t,
			cyon: t,
			joinmc: t,
			dweb: i,
			inbrowser: i,
			keenetic: t,
			nftstorage: Pe,
			mypep: t,
			storacha: Pe,
			w3s: Pe
		}],
		live: [1, {
			aem: t,
			hlx: t,
			ewp: i
		}],
		living: e,
		llc: e,
		llp: e,
		loan: e,
		loans: e,
		locker: e,
		locus: e,
		lol: [1, { omg: t }],
		london: e,
		lotte: e,
		lotto: e,
		love: e,
		lpl: e,
		lplfinancial: e,
		ltd: e,
		ltda: e,
		lundbeck: e,
		luxe: e,
		luxury: e,
		madrid: e,
		maif: e,
		maison: e,
		makeup: e,
		man: e,
		management: e,
		mango: e,
		map: e,
		market: e,
		marketing: e,
		markets: e,
		marriott: e,
		marshalls: e,
		mattel: e,
		mba: e,
		mckinsey: e,
		med: e,
		media: Fe,
		meet: e,
		melbourne: e,
		meme: e,
		memorial: e,
		men: e,
		menu: [1, {
			barsy: t,
			barsyonline: t
		}],
		merck: e,
		merckmsd: e,
		miami: e,
		microsoft: e,
		mini: e,
		mint: e,
		mit: e,
		mitsubishi: e,
		mlb: e,
		mls: e,
		mma: e,
		mobile: e,
		moda: e,
		moe: e,
		moi: e,
		mom: e,
		monash: e,
		money: e,
		monster: e,
		mormon: e,
		mortgage: e,
		moscow: e,
		moto: e,
		motorcycles: e,
		mov: e,
		movie: e,
		msd: e,
		mtn: e,
		mtr: e,
		music: e,
		nab: e,
		nagoya: e,
		navy: e,
		nba: e,
		nec: e,
		netbank: e,
		netflix: e,
		network: [1, {
			aem: t,
			alces: i,
			appwrite: t,
			co: t,
			arvo: t,
			azimuth: t,
			tlon: t
		}],
		neustar: e,
		new: e,
		news: [1, { noticeable: t }],
		next: e,
		nextdirect: e,
		nexus: e,
		nfl: e,
		ngo: e,
		nhk: e,
		nico: e,
		nike: e,
		nikon: e,
		ninja: e,
		nissan: e,
		nissay: e,
		nokia: e,
		norton: e,
		now: e,
		nowruz: e,
		nowtv: e,
		nra: e,
		nrw: e,
		ntt: e,
		nyc: e,
		obi: e,
		observer: e,
		office: e,
		okinawa: e,
		olayan: e,
		olayangroup: e,
		ollo: e,
		omega: e,
		one: [1, {
			kin: i,
			service: t,
			website: t
		}],
		ong: e,
		onl: e,
		online: [1, {
			eero: t,
			"eero-stage": t,
			websitebuilder: t,
			leapcell: t,
			barsy: t
		}],
		ooo: e,
		open: e,
		oracle: e,
		orange: [1, { tech: t }],
		organic: e,
		origins: e,
		osaka: e,
		otsuka: e,
		ott: e,
		ovh: [1, { nerdpol: t }],
		page: [1, {
			aem: t,
			hlx: t,
			codeberg: t,
			deuxfleurs: t,
			mybox: t,
			heyflow: t,
			prvcy: t,
			rocky: t,
			statichost: t,
			pdns: t,
			plesk: t
		}],
		panasonic: e,
		paris: e,
		pars: e,
		partners: e,
		parts: e,
		party: e,
		pay: e,
		pccw: e,
		pet: e,
		pfizer: e,
		pharmacy: e,
		phd: e,
		philips: e,
		phone: e,
		photo: e,
		photography: e,
		photos: Fe,
		physio: e,
		pics: e,
		pictet: e,
		pictures: [1, { 1337: t }],
		pid: e,
		pin: e,
		ping: e,
		pink: e,
		pioneer: e,
		pizza: [1, { ngrok: t }],
		place: te,
		play: e,
		playstation: e,
		plumbing: e,
		plus: [1, { playit: [2, {
			at: i,
			with: t
		}] }],
		pnc: e,
		pohl: e,
		poker: e,
		politie: e,
		porn: e,
		praxi: e,
		press: e,
		prime: e,
		prod: e,
		productions: e,
		prof: e,
		progressive: e,
		promo: e,
		properties: e,
		property: e,
		protection: e,
		pru: e,
		prudential: e,
		pub: [1, {
			id: i,
			kin: i,
			barsy: t
		}],
		pwc: e,
		qpon: e,
		quebec: e,
		quest: e,
		racing: e,
		radio: e,
		read: e,
		realestate: e,
		realtor: e,
		realty: e,
		recipes: e,
		red: e,
		redumbrella: e,
		rehab: e,
		reise: e,
		reisen: e,
		reit: e,
		reliance: e,
		ren: e,
		rent: e,
		rentals: e,
		repair: e,
		report: e,
		republican: e,
		rest: e,
		restaurant: e,
		review: e,
		reviews: [1, { aem: t }],
		rexroth: e,
		rich: e,
		richardli: e,
		ricoh: e,
		ril: e,
		rio: e,
		rip: [1, { clan: t }],
		rocks: [1, {
			myddns: t,
			stackit: t,
			"lima-city": t,
			webspace: t
		}],
		rodeo: e,
		rogers: e,
		room: e,
		rsvp: e,
		rugby: e,
		ruhr: e,
		run: [1, {
			appwrite: i,
			canva: t,
			development: t,
			ravendb: t,
			liara: [2, { iran: t }],
			lovable: t,
			needle: t,
			build: i,
			code: i,
			database: i,
			migration: i,
			onporter: t,
			repl: t,
			stackit: t,
			val: Te,
			vercel: t,
			wix: t
		}],
		rwe: e,
		ryukyu: e,
		saarland: e,
		safe: e,
		safety: e,
		sakura: e,
		sale: e,
		salon: e,
		samsclub: e,
		samsung: e,
		sandvik: e,
		sandvikcoromant: e,
		sanofi: e,
		sap: e,
		sarl: e,
		sas: e,
		save: e,
		saxo: e,
		sbi: e,
		sbs: e,
		scb: e,
		schaeffler: e,
		schmidt: e,
		scholarships: e,
		school: e,
		schule: e,
		schwarz: e,
		science: e,
		scot: [1, {
			co: t,
			me: t,
			org: t,
			gov: [2, { service: t }]
		}],
		search: e,
		seat: e,
		secure: e,
		security: e,
		seek: e,
		select: e,
		sener: e,
		services: [1, { loginline: t }],
		seven: e,
		sew: e,
		sex: e,
		sexy: e,
		sfr: e,
		shangrila: e,
		sharp: e,
		shell: e,
		shia: e,
		shiksha: e,
		shoes: e,
		shop: [1, {
			base: t,
			hoplix: t,
			barsy: t,
			barsyonline: t,
			shopware: t
		}],
		shopping: e,
		shouji: e,
		show: ke,
		silk: e,
		sina: e,
		singles: e,
		site: [1, {
			square: t,
			canva: re,
			cloudera: i,
			convex: ne,
			cyon: t,
			caffeine: t,
			fastvps: t,
			figma: t,
			"figma-gov": t,
			preview: t,
			heyflow: t,
			jele: t,
			jouwweb: t,
			loginline: t,
			barsy: t,
			co: t,
			notion: t,
			omniwe: t,
			opensocial: t,
			madethis: t,
			support: t,
			platformsh: i,
			tst: i,
			byen: t,
			sol: t,
			srht: t,
			novecore: t,
			cpanel: t,
			wpsquared: t,
			sourcecraft: t
		}],
		ski: e,
		skin: e,
		sky: e,
		skype: e,
		sling: e,
		smart: e,
		smile: e,
		sncf: e,
		soccer: e,
		social: e,
		softbank: e,
		software: e,
		sohu: e,
		solar: e,
		solutions: e,
		song: e,
		sony: e,
		soy: e,
		spa: e,
		space: [1, {
			myfast: t,
			heiyu: t,
			hf: [2, { static: t }],
			"app-ionos": t,
			project: t,
			uber: t,
			xs4all: t
		}],
		sport: e,
		spot: e,
		srl: e,
		stada: e,
		staples: e,
		star: e,
		statebank: e,
		statefarm: e,
		stc: e,
		stcgroup: e,
		stockholm: e,
		storage: e,
		store: [1, {
			barsy: t,
			sellfy: t,
			shopware: t,
			storebase: t
		}],
		stream: e,
		studio: e,
		study: e,
		style: e,
		sucks: e,
		supplies: e,
		supply: e,
		support: [1, { barsy: t }],
		surf: e,
		surgery: e,
		suzuki: e,
		swatch: e,
		swiss: e,
		sydney: e,
		systems: [1, {
			knightpoint: t,
			miren: t
		}],
		tab: e,
		taipei: e,
		talk: e,
		taobao: e,
		target: e,
		tatamotors: e,
		tatar: e,
		tattoo: e,
		tax: e,
		taxi: e,
		tci: e,
		tdk: e,
		team: [1, {
			discourse: t,
			jelastic: t
		}],
		tech: [1, { cleverapps: t }],
		technology: te,
		temasek: e,
		tennis: e,
		teva: e,
		thd: e,
		theater: e,
		theatre: e,
		tiaa: e,
		tickets: e,
		tienda: e,
		tips: e,
		tires: e,
		tirol: e,
		tjmaxx: e,
		tjx: e,
		tkmaxx: e,
		tmall: e,
		today: [1, { prequalifyme: t }],
		tokyo: e,
		tools: [1, {
			addr: we,
			myaddr: t
		}],
		top: [1, {
			ntdll: t,
			wadl: i
		}],
		toray: e,
		toshiba: e,
		total: e,
		tours: e,
		town: e,
		toyota: e,
		toys: e,
		trade: e,
		trading: e,
		training: e,
		travel: e,
		travelers: e,
		travelersinsurance: e,
		trust: e,
		trv: e,
		tube: e,
		tui: e,
		tunes: e,
		tushu: e,
		tvs: e,
		ubank: e,
		ubs: e,
		unicom: e,
		university: e,
		uno: e,
		uol: e,
		ups: e,
		vacations: e,
		vana: e,
		vanguard: e,
		vegas: e,
		ventures: e,
		verisign: e,
		versicherung: e,
		vet: e,
		viajes: e,
		video: e,
		vig: e,
		viking: e,
		villas: e,
		vin: e,
		vip: [1, { hidns: t }],
		virgin: e,
		visa: e,
		vision: e,
		viva: e,
		vivo: e,
		vlaanderen: e,
		vodka: e,
		volvo: e,
		vote: e,
		voting: e,
		voto: e,
		voyage: e,
		wales: e,
		walmart: e,
		walter: e,
		wang: e,
		wanggou: e,
		watch: e,
		watches: e,
		weather: e,
		weatherchannel: e,
		webcam: e,
		weber: e,
		website: Fe,
		wed: e,
		wedding: e,
		weibo: e,
		weir: e,
		whoswho: e,
		wien: e,
		wiki: Fe,
		williamhill: e,
		win: e,
		windows: e,
		wine: e,
		winners: e,
		wme: e,
		woodside: e,
		work: [1, { "imagine-proxy": t }],
		works: e,
		world: e,
		wow: e,
		wtc: e,
		wtf: e,
		xbox: e,
		xerox: e,
		xihuan: e,
		xin: e,
		"xn--11b4c3d": e,
		कॉम: e,
		"xn--1ck2e1b": e,
		セール: e,
		"xn--1qqw23a": e,
		佛山: e,
		"xn--30rr7y": e,
		慈善: e,
		"xn--3bst00m": e,
		集团: e,
		"xn--3ds443g": e,
		在线: e,
		"xn--3pxu8k": e,
		点看: e,
		"xn--42c2d9a": e,
		คอม: e,
		"xn--45q11c": e,
		八卦: e,
		"xn--4gbrim": e,
		موقع: e,
		"xn--55qw42g": e,
		公益: e,
		"xn--55qx5d": e,
		公司: e,
		"xn--5su34j936bgsg": e,
		香格里拉: e,
		"xn--5tzm5g": e,
		网站: e,
		"xn--6frz82g": e,
		移动: e,
		"xn--6qq986b3xl": e,
		我爱你: e,
		"xn--80adxhks": e,
		москва: e,
		"xn--80aqecdr1a": e,
		католик: e,
		"xn--80asehdb": e,
		онлайн: e,
		"xn--80aswg": e,
		сайт: e,
		"xn--8y0a063a": e,
		联通: e,
		"xn--9dbq2a": e,
		קום: e,
		"xn--9et52u": e,
		时尚: e,
		"xn--9krt00a": e,
		微博: e,
		"xn--b4w605ferd": e,
		淡马锡: e,
		"xn--bck1b9a5dre4c": e,
		ファッション: e,
		"xn--c1avg": e,
		орг: e,
		"xn--c2br7g": e,
		नेट: e,
		"xn--cck2b3b": e,
		ストア: e,
		"xn--cckwcxetd": e,
		アマゾン: e,
		"xn--cg4bki": e,
		삼성: e,
		"xn--czr694b": e,
		商标: e,
		"xn--czrs0t": e,
		商店: e,
		"xn--czru2d": e,
		商城: e,
		"xn--d1acj3b": e,
		дети: e,
		"xn--eckvdtc9d": e,
		ポイント: e,
		"xn--efvy88h": e,
		新闻: e,
		"xn--fct429k": e,
		家電: e,
		"xn--fhbei": e,
		كوم: e,
		"xn--fiq228c5hs": e,
		中文网: e,
		"xn--fiq64b": e,
		中信: e,
		"xn--fjq720a": e,
		娱乐: e,
		"xn--flw351e": e,
		谷歌: e,
		"xn--fzys8d69uvgm": e,
		電訊盈科: e,
		"xn--g2xx48c": e,
		购物: e,
		"xn--gckr3f0f": e,
		クラウド: e,
		"xn--gk3at1e": e,
		通販: e,
		"xn--hxt814e": e,
		网店: e,
		"xn--i1b6b1a6a2e": e,
		संगठन: e,
		"xn--imr513n": e,
		餐厅: e,
		"xn--io0a7i": e,
		网络: e,
		"xn--j1aef": e,
		ком: e,
		"xn--jlq480n2rg": e,
		亚马逊: e,
		"xn--jvr189m": e,
		食品: e,
		"xn--kcrx77d1x4a": e,
		飞利浦: e,
		"xn--kput3i": e,
		手机: e,
		"xn--mgba3a3ejt": e,
		ارامكو: e,
		"xn--mgba7c0bbn0a": e,
		العليان: e,
		"xn--mgbab2bd": e,
		بازار: e,
		"xn--mgbca7dzdo": e,
		ابوظبي: e,
		"xn--mgbi4ecexp": e,
		كاثوليك: e,
		"xn--mgbt3dhd": e,
		همراه: e,
		"xn--mk1bu44c": e,
		닷컴: e,
		"xn--mxtq1m": e,
		政府: e,
		"xn--ngbc5azd": e,
		شبكة: e,
		"xn--ngbe9e0a": e,
		بيتك: e,
		"xn--ngbrx": e,
		عرب: e,
		"xn--nqv7f": e,
		机构: e,
		"xn--nqv7fs00ema": e,
		组织机构: e,
		"xn--nyqy26a": e,
		健康: e,
		"xn--otu796d": e,
		招聘: e,
		"xn--p1acf": [1, {
			"xn--90amc": t,
			"xn--j1aef": t,
			"xn--j1ael8b": t,
			"xn--h1ahn": t,
			"xn--j1adp": t,
			"xn--c1avg": t,
			"xn--80aaa0cvac": t,
			"xn--h1aliz": t,
			"xn--90a1af": t,
			"xn--41a": t
		}],
		рус: [1, {
			биз: t,
			ком: t,
			крым: t,
			мир: t,
			мск: t,
			орг: t,
			самара: t,
			сочи: t,
			спб: t,
			я: t
		}],
		"xn--pssy2u": e,
		大拿: e,
		"xn--q9jyb4c": e,
		みんな: e,
		"xn--qcka1pmc": e,
		グーグル: e,
		"xn--rhqv96g": e,
		世界: e,
		"xn--rovu88b": e,
		書籍: e,
		"xn--ses554g": e,
		网址: e,
		"xn--t60b56a": e,
		닷넷: e,
		"xn--tckwe": e,
		コム: e,
		"xn--tiq49xqyj": e,
		天主教: e,
		"xn--unup4y": e,
		游戏: e,
		"xn--vermgensberater-ctb": e,
		vermögensberater: e,
		"xn--vermgensberatung-pwb": e,
		vermögensberatung: e,
		"xn--vhquv": e,
		企业: e,
		"xn--vuq861b": e,
		信息: e,
		"xn--w4r85el8fhu5dnra": e,
		嘉里大酒店: e,
		"xn--w4rs40l": e,
		嘉里: e,
		"xn--xhq521b": e,
		广东: e,
		"xn--zfr164b": e,
		政务: e,
		xyz: [1, {
			caffeine: t,
			exe: t,
			botdash: t,
			telebit: i
		}],
		yachts: e,
		yahoo: e,
		yamaxun: e,
		yandex: e,
		yodobashi: e,
		yoga: e,
		yokohama: e,
		you: e,
		youtube: e,
		yun: e,
		zappos: e,
		zara: e,
		zero: e,
		zip: e,
		zone: [1, {
			stackit: t,
			lima: t,
			triton: i
		}],
		zuerich: e
	}];
})();
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts@7.0.27/node_modules/tldts/dist/es6/src/suffix-trie.js
function Ye(e, t, n, r) {
	let i = null, a = t;
	for (; a !== void 0 && ((a[0] & r) !== 0 && (i = {
		index: n + 1,
		isIcann: (a[0] & 1) != 0,
		isPrivate: (a[0] & 2) != 0
	}), n !== -1);) {
		let t = a[1];
		a = Object.prototype.hasOwnProperty.call(t, e[n]) ? t[e[n]] : t["*"], --n;
	}
	return i;
}
function Xe(e, t, n) {
	if (Ke(e, t, n)) return;
	let r = e.split("."), i = (t.allowPrivateDomains ? 2 : 0) | (t.allowIcannDomains ? 1 : 0), a = Ye(r, qe, r.length - 1, i);
	if (a !== null) {
		n.isIcann = a.isIcann, n.isPrivate = a.isPrivate, n.publicSuffix = r.slice(a.index + 1).join(".");
		return;
	}
	let o = Ye(r, Je, r.length - 1, i);
	if (o !== null) {
		n.isIcann = o.isIcann, n.isPrivate = o.isPrivate, n.publicSuffix = r.slice(o.index).join(".");
		return;
	}
	n.isIcann = !1, n.isPrivate = !1, n.publicSuffix = r[r.length - 1] ?? null;
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tldts@7.0.27/node_modules/tldts/dist/es6/index.js
var Ze = Ue();
function Qe(e, t = {}) {
	return We(Ze), Ge(e, 3, Xe, t, Ze).domain;
}
//#endregion
//#region ../../../../../node_modules/.pnpm/tough-cookie@6.0.1/node_modules/tough-cookie/dist/index.js
var $e = [
	"local",
	"example",
	"invalid",
	"localhost",
	"test"
], et = ["localhost", "invalid"], tt = {
	allowSpecialUseDomain: !1,
	ignoreError: !1
};
function nt(e, t = {}) {
	t = {
		...tt,
		...t
	};
	let n = e.split("."), r = n[n.length - 1], i = !!t.allowSpecialUseDomain, a = !!t.ignoreError;
	if (i && r !== void 0 && $e.includes(r)) {
		if (n.length > 1) return `${n[n.length - 2]}.${r}`;
		if (et.includes(r)) return r;
	}
	if (!a && r !== void 0 && $e.includes(r)) throw Error(`Cookie has domain set to the public suffix "${r}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`);
	let o = Qe(e, {
		allowIcannDomains: !0,
		allowPrivateDomains: !0
	});
	if (o) return o;
}
function rt(e, t) {
	let n = nt(e, { allowSpecialUseDomain: t });
	if (!n) return;
	if (n == e) return [e];
	e.slice(-1) == "." && (e = e.slice(0, -1));
	let r = e.slice(0, -(n.length + 1)).split(".").reverse(), i = n, a = [i];
	for (; r.length;) i = `${r.shift()}.${i}`, a.push(i);
	return a;
}
function it(e, t) {
	return e in t;
}
function at(e) {
	return e === "" || e instanceof String && e.toString() === "";
}
function ot(e) {
	return typeof e == "string" || e instanceof String;
}
Object.freeze({
	SILENT: "silent",
	STRICT: "strict",
	DISABLED: "unsafe-disabled"
});
var st = "\n\\[?(?:\n(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|\n(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|\n(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|\n(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|\n(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|\n(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|\n(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|\n(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))\n)(?:%[0-9a-zA-Z]{1,})?\\]?\n".replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim(), ct = RegExp(`^${st}$`);
function lt(e) {
	return new URL(`http://${e}`).hostname;
}
function ut(e) {
	if (e == null) return;
	let t = e.trim().replace(/^\./, "");
	return ct.test(t) ? (t.startsWith("[") || (t = "[" + t), t.endsWith("]") || (t += "]"), lt(t).slice(1, -1)) : /[^\u0001-\u007f]/.test(t) ? lt(t) : t.toLowerCase();
}
function dt(e) {
	return e.toUTCString();
}
function ft(e) {
	if (!e) return;
	let t = {
		foundTime: void 0,
		foundDayOfMonth: void 0,
		foundMonth: void 0,
		foundYear: void 0
	}, n = e.split(mt).filter((e) => e.length > 0);
	for (let e of n) {
		if (t.foundTime === void 0) {
			let [, n, r, i] = ht.exec(e) || [];
			if (n != null && r != null && i != null) {
				let e = parseInt(n, 10), a = parseInt(r, 10), o = parseInt(i, 10);
				if (!isNaN(e) && !isNaN(a) && !isNaN(o)) {
					t.foundTime = {
						hours: e,
						minutes: a,
						seconds: o
					};
					continue;
				}
			}
		}
		if (t.foundDayOfMonth === void 0 && gt.test(e)) {
			let n = parseInt(e, 10);
			if (!isNaN(n)) {
				t.foundDayOfMonth = n;
				continue;
			}
		}
		if (t.foundMonth === void 0 && _t.test(e)) {
			let n = pt.indexOf(e.substring(0, 3).toLowerCase());
			if (n >= 0 && n <= 11) {
				t.foundMonth = n;
				continue;
			}
		}
		if (t.foundYear === void 0 && vt.test(e)) {
			let n = parseInt(e, 10);
			if (!isNaN(n)) {
				t.foundYear = n;
				continue;
			}
		}
	}
	if (t.foundYear !== void 0 && t.foundYear >= 70 && t.foundYear <= 99 && (t.foundYear += 1900), t.foundYear !== void 0 && t.foundYear >= 0 && t.foundYear <= 69 && (t.foundYear += 2e3), t.foundDayOfMonth === void 0 || t.foundMonth === void 0 || t.foundYear === void 0 || t.foundTime === void 0 || t.foundDayOfMonth < 1 || t.foundDayOfMonth > 31 || t.foundYear < 1601 || t.foundTime.hours > 23 || t.foundTime.minutes > 59 || t.foundTime.seconds > 59) return;
	let r = new Date(Date.UTC(t.foundYear, t.foundMonth, t.foundDayOfMonth, t.foundTime.hours, t.foundTime.minutes, t.foundTime.seconds));
	if (!(r.getUTCFullYear() !== t.foundYear || r.getUTCMonth() !== t.foundMonth || r.getUTCDate() !== t.foundDayOfMonth)) return r;
}
var pt = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec"
], mt = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/, ht = /^(\d{1,2}):(\d{1,2}):(\d{1,2})(?:[\x00-\x2F\x3A-\xFF][\x00-\xFF]*)?$/, gt = /^[0-9]{1,2}(?:[\x00-\x2F\x3A-\xFF][\x00-\xFF]*)?$/, _t = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\x00-\xFF]*$/i, vt = /^[\x30-\x39]{2,4}(?:[\x00-\x2F\x3A-\xFF][\x00-\xFF]*)?$/, yt = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/, bt = /[\x20-\x3A\x3C-\x7E]+/, xt = /[\x00-\x1F]/, St = [
	"\n",
	"\r",
	"\0"
];
function Ct(e) {
	if (at(e)) return e;
	for (let t = 0; t < St.length; t++) {
		let n = St[t], r = n ? e.indexOf(n) : -1;
		r !== -1 && (e = e.slice(0, r));
	}
	return e;
}
function wt(e, t) {
	e = Ct(e);
	let n = e.indexOf("=");
	if (t) n === 0 && (e = e.substring(1), n = e.indexOf("="));
	else if (n <= 0) return;
	let r, i;
	if (n <= 0 ? (r = "", i = e.trim()) : (r = e.slice(0, n).trim(), i = e.slice(n + 1).trim()), xt.test(r) || xt.test(i)) return;
	let a = new Ot();
	return a.key = r, a.value = i, a;
}
function Tt(e, t) {
	if (at(e) || !ot(e)) return;
	e = e.trim();
	let n = e.indexOf(";"), r = wt(n === -1 ? e : e.slice(0, n), t?.loose ?? !1);
	if (!r) return;
	if (n === -1) return r;
	let i = e.slice(n + 1).trim();
	if (i.length === 0) return r;
	let a = i.split(";");
	for (; a.length;) {
		let e = (a.shift() ?? "").trim();
		if (e.length === 0) continue;
		let t = e.indexOf("="), n, i;
		switch (t === -1 ? (n = e, i = null) : (n = e.slice(0, t), i = e.slice(t + 1)), n = n.trim().toLowerCase(), i &&= i.trim(), n) {
			case "expires":
				if (i) {
					let e = ft(i);
					e && (r.expires = e);
				}
				break;
			case "max-age":
				if (i && /^-?[0-9]+$/.test(i)) {
					let e = parseInt(i, 10);
					r.setMaxAge(e);
				}
				break;
			case "domain":
				if (i) {
					let e = i.trim().replace(/^\./, "");
					e && (r.domain = e.toLowerCase());
				}
				break;
			case "path":
				r.path = i && i[0] === "/" ? i : null;
				break;
			case "secure":
				r.secure = !0;
				break;
			case "httponly":
				r.httpOnly = !0;
				break;
			case "samesite":
				switch (i ? i.toLowerCase() : "") {
					case "strict":
						r.sameSite = "strict";
						break;
					case "lax":
						r.sameSite = "lax";
						break;
					case "none":
						r.sameSite = "none";
						break;
					default:
						r.sameSite = void 0;
						break;
				}
				break;
			default:
				r.extensions = r.extensions || [], r.extensions.push(e);
				break;
		}
	}
	return r;
}
function Et(e) {
	if (!e || at(e)) return;
	let t;
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	else t = e;
	let n = new Ot();
	return Ot.serializableProperties.forEach((e) => {
		if (t && typeof t == "object" && it(e, t)) {
			let r = t[e];
			if (r === void 0 || it(e, O) && r === O[e]) return;
			switch (e) {
				case "key":
				case "value":
				case "sameSite":
					typeof r == "string" && (n[e] = r);
					break;
				case "expires":
				case "creation":
				case "lastAccessed":
					typeof r == "number" || typeof r == "string" || r instanceof Date ? n[e] = t[e] == "Infinity" ? "Infinity" : new Date(r) : r === null && (n[e] = null);
					break;
				case "maxAge":
					(typeof r == "number" || r === "Infinity" || r === "-Infinity") && (n[e] = r);
					break;
				case "domain":
				case "path":
					(typeof r == "string" || r === null) && (n[e] = r);
					break;
				case "secure":
				case "httpOnly":
					typeof r == "boolean" && (n[e] = r);
					break;
				case "extensions":
					Array.isArray(r) && r.every((e) => typeof e == "string") && (n[e] = r);
					break;
				case "hostOnly":
				case "pathIsDefault":
					(typeof r == "boolean" || r === null) && (n[e] = r);
					break;
			}
		}
	}), n;
}
var O = {
	key: "",
	value: "",
	expires: "Infinity",
	maxAge: null,
	domain: null,
	path: null,
	secure: !1,
	httpOnly: !1,
	extensions: null,
	hostOnly: null,
	pathIsDefault: null,
	creation: null,
	lastAccessed: null,
	sameSite: void 0
}, Dt = class e {
	constructor(t = {}) {
		this.key = t.key ?? O.key, this.value = t.value ?? O.value, this.expires = t.expires ?? O.expires, this.maxAge = t.maxAge ?? O.maxAge, this.domain = t.domain ?? O.domain, this.path = t.path ?? O.path, this.secure = t.secure ?? O.secure, this.httpOnly = t.httpOnly ?? O.httpOnly, this.extensions = t.extensions ?? O.extensions, this.creation = t.creation ?? O.creation, this.hostOnly = t.hostOnly ?? O.hostOnly, this.pathIsDefault = t.pathIsDefault ?? O.pathIsDefault, this.lastAccessed = t.lastAccessed ?? O.lastAccessed, this.sameSite = t.sameSite ?? O.sameSite, this.creation = t.creation ?? /* @__PURE__ */ new Date(), Object.defineProperty(this, "creationIndex", {
			configurable: !1,
			enumerable: !1,
			writable: !0,
			value: ++e.cookiesCreated
		}), this.creationIndex = e.cookiesCreated;
	}
	[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
		let e = Date.now(), t = this.hostOnly == null ? "?" : this.hostOnly.toString(), n = this.creation && this.creation !== "Infinity" ? `${String(e - this.creation.getTime())}ms` : "?", r = this.lastAccessed && this.lastAccessed !== "Infinity" ? `${String(e - this.lastAccessed.getTime())}ms` : "?";
		return `Cookie="${this.toString()}; hostOnly=${t}; aAge=${r}; cAge=${n}"`;
	}
	toJSON() {
		let t = {};
		for (let n of e.serializableProperties) {
			let e = this[n];
			if (e !== O[n]) switch (n) {
				case "key":
				case "value":
				case "sameSite":
					typeof e == "string" && (t[n] = e);
					break;
				case "expires":
				case "creation":
				case "lastAccessed":
					typeof e == "number" || typeof e == "string" || e instanceof Date ? t[n] = e == "Infinity" ? "Infinity" : new Date(e).toISOString() : e === null && (t[n] = null);
					break;
				case "maxAge":
					(typeof e == "number" || e === "Infinity" || e === "-Infinity") && (t[n] = e);
					break;
				case "domain":
				case "path":
					(typeof e == "string" || e === null) && (t[n] = e);
					break;
				case "secure":
				case "httpOnly":
					typeof e == "boolean" && (t[n] = e);
					break;
				case "extensions":
					Array.isArray(e) && (t[n] = e);
					break;
				case "hostOnly":
				case "pathIsDefault":
					(typeof e == "boolean" || e === null) && (t[n] = e);
					break;
			}
		}
		return t;
	}
	clone() {
		return Et(this.toJSON());
	}
	validate() {
		if (!this.value || !yt.test(this.value) || this.expires != "Infinity" && !(this.expires instanceof Date) && !ft(this.expires) || this.maxAge != null && this.maxAge !== "Infinity" && (this.maxAge === "-Infinity" || this.maxAge <= 0) || this.path != null && !bt.test(this.path)) return !1;
		let e = this.cdomain();
		return !(e && (e.match(/\.$/) || nt(e) == null));
	}
	setExpires(e) {
		e instanceof Date ? this.expires = e : this.expires = ft(e) || "Infinity";
	}
	setMaxAge(e) {
		e === Infinity ? this.maxAge = "Infinity" : e === -Infinity ? this.maxAge = "-Infinity" : this.maxAge = e;
	}
	cookieString() {
		let e = this.value || "";
		return this.key ? `${this.key}=${e}` : e;
	}
	toString() {
		let t = this.cookieString();
		return this.expires != "Infinity" && this.expires instanceof Date && (t += `; Expires=${dt(this.expires)}`), this.maxAge != null && this.maxAge != Infinity && (t += `; Max-Age=${String(this.maxAge)}`), this.domain && !this.hostOnly && (t += `; Domain=${this.domain}`), this.path && (t += `; Path=${this.path}`), this.secure && (t += "; Secure"), this.httpOnly && (t += "; HttpOnly"), this.sameSite && this.sameSite !== "none" && (this.sameSite.toLowerCase() === e.sameSiteCanonical.lax.toLowerCase() ? t += `; SameSite=${e.sameSiteCanonical.lax}` : this.sameSite.toLowerCase() === e.sameSiteCanonical.strict.toLowerCase() ? t += `; SameSite=${e.sameSiteCanonical.strict}` : t += `; SameSite=${this.sameSite}`), this.extensions && this.extensions.forEach((e) => {
			t += `; ${e}`;
		}), t;
	}
	TTL(e = Date.now()) {
		if (this.maxAge != null && typeof this.maxAge == "number") return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
		let t = this.expires;
		return t === "Infinity" ? Infinity : (t?.getTime() ?? e) - (e || Date.now());
	}
	expiryTime(e) {
		if (this.maxAge != null) {
			let t = e || this.lastAccessed || /* @__PURE__ */ new Date(), n = typeof this.maxAge == "number" ? this.maxAge : -Infinity, r = n <= 0 ? -Infinity : n * 1e3;
			return t === "Infinity" ? Infinity : t.getTime() + r;
		}
		return this.expires == "Infinity" ? Infinity : this.expires ? this.expires.getTime() : void 0;
	}
	expiryDate(e) {
		let t = this.expiryTime(e);
		return t == Infinity ? /* @__PURE__ */ new Date(2147483647e3) : t == -Infinity ? /* @__PURE__ */ new Date(0) : t == null ? void 0 : new Date(t);
	}
	isPersistent() {
		return this.maxAge != null || this.expires != "Infinity";
	}
	canonicalizedDomain() {
		return ut(this.domain);
	}
	cdomain() {
		return ut(this.domain);
	}
	static parse(e, t) {
		return Tt(e, t);
	}
	static fromJSON(e) {
		return Et(e);
	}
};
Dt.cookiesCreated = 0, Dt.sameSiteLevel = {
	strict: 3,
	lax: 2,
	none: 1
}, Dt.sameSiteCanonical = {
	strict: "Strict",
	lax: "Lax"
}, Dt.serializableProperties = [
	"key",
	"value",
	"expires",
	"maxAge",
	"domain",
	"path",
	"secure",
	"httpOnly",
	"extensions",
	"hostOnly",
	"pathIsDefault",
	"creation",
	"lastAccessed",
	"sameSite"
];
var Ot = Dt, kt = "__electron_cookie_jar__", At = () => {
	if (!(typeof localStorage > "u")) return localStorage;
}, jt = (e) => {
	let t = e.startsWith(".") ? e.slice(1) : e;
	return (t ? ut(t) : "") ?? t;
}, Mt = (e) => {
	if (e?.length) return e.startsWith("/") ? e : `/${e}`;
}, Nt = (e) => {
	if (!e || e[0] !== "/" || e === "/") return "/";
	let t = e.lastIndexOf("/");
	return t <= 0 ? "/" : e.slice(0, t);
}, Pt = (e, t) => e ? e === t ? !0 : !(!t.startsWith(e) || !e.endsWith("/") && t[e.length] !== "/") : !1, Ft = (e, t) => {
	let n = e.expires;
	return !n || n === "Infinity" ? !1 : n.getTime() <= t;
}, It = (e, t) => {
	let n = e.path ?? "/", r = t.path ?? "/";
	return n.length === r.length ? (e.creationIndex ?? 0) - (t.creationIndex ?? 0) : r.length - n.length;
};
function Lt() {
	let e = /* @__PURE__ */ new Map(), t = !1, n = 0, r = () => jt(window.location.hostname ?? ""), i = () => Mt(window.location.pathname || "/") ?? "/", a = () => window.location.protocol === "https:", o = (e) => {
		if (!e) return [""];
		try {
			let t = rt(e) ?? [], n = new Set(t);
			return n.has(e) ? Array.from(n) : (n.add(e), [e, ...t]);
		} catch (t) {
			return console.warn("[cookie] Failed to permute domain", t), [e];
		}
	}, s = (t) => {
		let n = e.get(t);
		return n || (n = /* @__PURE__ */ new Map(), e.set(t, n)), n;
	}, c = (e, t) => {
		let n = e.get(t);
		return n || (n = /* @__PURE__ */ new Map(), e.set(t, n)), n;
	}, l = () => {
		let t = {};
		return e.forEach((e, n) => {
			let r = {};
			e.forEach((e, t) => {
				if (e.size === 0) return;
				let n = {};
				e.forEach((e, t) => {
					!e.key || e.key.trim() === "" || e.key !== t || (n[t] = e.toJSON());
				}), Object.keys(n).length > 0 && (r[t] = n);
			}), Object.keys(r).length > 0 && (t[n] = r);
		}), t;
	}, u = (t) => {
		let n = !1, r = [];
		return e.forEach((e, i) => {
			let a = [];
			e.forEach((e, r) => {
				let o = [];
				e.forEach((e, n) => {
					let a = t({
						domain: i,
						path: r,
						key: n,
						cookie: e
					});
					a && a.remove && o.push(n);
				}), o.length > 0 && (n = !0, o.forEach((t) => {
					e.delete(t);
				})), e.size === 0 && a.push(r);
			}), a.length > 0 && (n = !0, a.forEach((t) => {
				e.delete(t);
			})), e.size === 0 && r.push(i);
		}), r.length > 0 && (n = !0, r.forEach((t) => {
			e.delete(t);
		})), n;
	}, d = () => {
		if (!t) return;
		let e = At();
		if (e) try {
			e.setItem(kt, JSON.stringify(l()));
		} catch (e) {
			console.error("[cookie] Failed to persist cookies", e);
		}
	}, f = (t, n, r) => {
		let i = e.get(t);
		if (!i) return !1;
		let a = i.get(n);
		return !a || !a.delete(r) ? !1 : (a.size === 0 && i.delete(n), i.size === 0 && e.delete(t), !0);
	}, p = () => {
		if (t) return;
		let e = At();
		if (!e) {
			t = !0;
			return;
		}
		try {
			let r = e.getItem(kt);
			if (!r) {
				t = !0;
				return;
			}
			let i = JSON.parse(r), a = (e, t, r, i) => {
				let a = Ot.fromJSON(i);
				if (!a) return;
				if (!a.key || a.key.trim() === "" || a.key !== r) {
					console.warn("[cookie] Skipping invalid cookie during restore:", {
						key: r,
						cookieKey: a.key
					});
					return;
				}
				let o = jt(a.domain ?? e), l = Mt(a.path) ?? t;
				a.domain = o, a.path = l, a.creationIndex == null ? (n += 1, a.creationIndex = n) : n = Math.max(n, a.creationIndex), c(s(o), l).set(r, a);
			}, o = (e, t, n) => {
				let r = Mt(t) ?? Nt(t);
				Object.entries(n).forEach(([t, n]) => {
					a(e, r, t, n);
				});
			}, l = (e, t) => {
				Object.entries(t).forEach(([t, n]) => {
					o(e, t, n);
				});
			};
			Object.entries(i).forEach(([e, t]) => {
				l(jt(e), t);
			});
		} catch (e) {
			console.error("[cookie] Failed to hydrate cookies from storage", e);
		} finally {
			t = !0;
			let e = m(Date.now()), n = h();
			(e || n) && d();
		}
	}, m = (t) => e.size === 0 ? !1 : u(({ cookie: e }) => Ft(e, t) ? { remove: !0 } : void 0), h = () => e.size === 0 ? !1 : u(({ cookie: e }) => !e.key || e.key.trim() === "" ? { remove: !0 } : void 0), g = () => {
		p();
		let e = Date.now(), t = r(), n = i(), s = a();
		m(e) && d();
		let c = new Set(o(t)), l = [], f = /* @__PURE__ */ new Set();
		return u(({ domain: e, path: r, cookie: i }) => {
			if (!i.key || i.key.trim() === "" || !c.has(e) || !Pt(r, n) || i.httpOnly || i.secure && !s || i.hostOnly && e !== t) return;
			let a = `${i.domain ?? e}::${i.path ?? r}::${i.key}`;
			f.has(a) || (f.add(a), l.push(i));
		}), l.sort(It), l;
	}, ee = (e) => {
		let t = r(), a = i();
		e.creation ||= /* @__PURE__ */ new Date(), e.creationIndex == null ? (n += 1, e.creationIndex = n) : n = Math.max(n, e.creationIndex), e.domain ? (e.domain = jt(e.domain), e.hostOnly = !1) : (e.domain = t, e.hostOnly = !0), e.path = Mt(e.path) ?? Nt(a);
	}, _ = (e) => {
		let t = e.domain ?? r(), n = e.path ?? i(), a = c(s(t), n), o = a.get(e.key);
		o?.creationIndex != null && (e.creationIndex = o.creationIndex), a.set(e.key, e);
	};
	return {
		ensureHydrated: p,
		toString: () => g().map((e) => `${e.key}=${e.value}`).join("; "),
		setFromRaw: (e) => {
			if (e.trim().length) {
				p();
				try {
					let t = Ot.parse(e, { loose: !0 });
					if (!t) return;
					if (!t.key.trim().length) {
						console.warn("[cookie] Skipping invalid cookie (empty key) from raw string:", e);
						return;
					}
					if (ee(t), Ft(t, Date.now())) {
						f(t.domain ?? r(), t.path ?? i(), t.key) && d();
						return;
					}
					_(t), d();
				} catch (e) {
					console.error("[cookie] Failed to parse cookie string", e);
				}
			}
		},
		remove: (t) => {
			if (!t) return;
			p();
			let n = !1;
			e.forEach((r, i) => {
				r.forEach((e, i) => {
					e.delete(t) && (n = !0), e.size === 0 && r.delete(i);
				}), r.size === 0 && e.delete(i);
			}), n && d();
		},
		size: () => {
			p();
			let t = 0;
			return e.forEach((e) => {
				e.forEach((e) => {
					t += e.size;
				});
			}), t;
		},
		list: () => {
			p(), m(Date.now()) && d();
			let e = [];
			return u(({ domain: t, path: n, cookie: r }) => {
				if (!r.key.trim().length) return;
				let i = r.expires, a = !i || i === "Infinity" ? void 0 : i.toUTCString(), o = r.creation instanceof Date ? r.creation.toISOString() : void 0, s = r.lastAccessed instanceof Date ? r.lastAccessed.toISOString() : void 0;
				e.push({
					key: r.key,
					value: r.value,
					domain: r.domain ?? t,
					path: r.path ?? n,
					expires: a,
					secure: !!r.secure,
					httpOnly: !!r.httpOnly,
					hostOnly: !!r.hostOnly,
					sameSite: r.sameSite,
					creation: o,
					lastAccessed: s
				});
			}), e;
		}
	};
}
//#endregion
//#region src/preload/cookie/cookie-inject.ts
var Rt = "__cookieBridge__", zt = "__cookieOverrideInjected__", Bt = Lt();
function Vt() {
	return Bt.toString();
}
function Ht(e) {
	Bt.setFromRaw(e);
}
function Ut(e) {
	Bt.remove(e);
}
function Wt() {
	try {
		return Vt();
	} catch (e) {
		return console.error("[cookie] Failed to read cookies", e), "";
	}
}
function Gt() {
	let e = Object.getOwnPropertyDescriptor(Document.prototype, "cookie"), t = Object.getOwnPropertyDescriptor(document, "cookie"), n = (e) => !e || typeof e.get != "function" ? !1 : e.get === Wt;
	return n(e) || n(t);
}
function Kt(e, t) {
	return Ae.replaceAll("__BRIDGE_NAME__", e).replaceAll("__FLAG_NAME__", t);
}
function qt(e) {
	try {
		e.exposeInMainWorld(Rt, {
			getCookieString() {
				return Vt();
			},
			setCookieString(e) {
				Ht(e);
			},
			removeCookie(e) {
				Ut(e);
			},
			hasCustomGetter() {
				return Gt();
			},
			listCookies() {
				return Bt.list();
			}
		});
	} catch (e) {
		console.error("[cookie] Failed to expose bridge", e);
	}
}
async function Jt(e) {
	let t = Kt(JSON.stringify(Rt), JSON.stringify(zt));
	try {
		await e.executeJavaScript(t, !0);
	} catch (e) {
		console.error("[cookie] Failed to inject main world override", e);
	}
}
//#endregion
//#region src/preload/cookie/index.ts
var Yt = (e, t) => {
	["http:", "https:"].includes(window?.location?.protocol) || (qt(e), Jt(t));
}, Xt = () => process.platform === "darwin", Zt = () => process.platform === "win32", Qt = () => process.arch === "arm64";
l(import.meta.dirname, "..", "renderer"), l(import.meta.dirname, "..", "..", "src", "renderer");
var $t = process.env.NODE_ENV === "development";
process.env.NODE_ENV, process.env.DEBUG;
var en = process.env.SYSTEMROOT, k = /* @__PURE__ */ w(((e) => {
	e.fromCallback = function(e) {
		return Object.defineProperty(function(...t) {
			if (typeof t[t.length - 1] == "function") e.apply(this, t);
			else return new Promise((n, r) => {
				t.push((e, t) => e == null ? n(t) : r(e)), e.apply(this, t);
			});
		}, "name", { value: e.name });
	}, e.fromPromise = function(e) {
		return Object.defineProperty(function(...t) {
			let n = t[t.length - 1];
			if (typeof n != "function") return e.apply(this, t);
			t.pop(), e.apply(this, t).then((e) => n(null, e), n);
		}, "name", { value: e.name });
	};
})), tn = /* @__PURE__ */ w(((e, t) => {
	var n = T("constants"), r = process.cwd, i = null, a = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		return i ||= r.call(process), i;
	};
	try {
		process.cwd();
	} catch {}
	if (typeof process.chdir == "function") {
		var o = process.chdir;
		process.chdir = function(e) {
			i = null, o.call(process, e);
		}, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, o);
	}
	t.exports = s;
	function s(e) {
		n.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = i(e.chmod), e.fchmod = i(e.fchmod), e.lchmod = i(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = o(e.chmodSync), e.fchmodSync = o(e.fchmodSync), e.lchmodSync = o(e.lchmodSync), e.stat = l(e.stat), e.fstat = l(e.fstat), e.lstat = l(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(e, t, n) {
			n && process.nextTick(n);
		}, e.lchmodSync = function() {}), e.chown && !e.lchown && (e.lchown = function(e, t, n, r) {
			r && process.nextTick(r);
		}, e.lchownSync = function() {}), a === "win32" && (e.rename = typeof e.rename == "function" ? (function(t) {
			function n(n, r, i) {
				var a = Date.now(), o = 0;
				t(n, r, function s(c) {
					if (c && (c.code === "EACCES" || c.code === "EPERM" || c.code === "EBUSY") && Date.now() - a < 6e4) {
						setTimeout(function() {
							e.stat(r, function(e, a) {
								e && e.code === "ENOENT" ? t(n, r, s) : i(c);
							});
						}, o), o < 100 && (o += 10);
						return;
					}
					i && i(c);
				});
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.rename) : e.rename), e.read = typeof e.read == "function" ? (function(t) {
			function n(n, r, i, a, o, s) {
				var c;
				if (s && typeof s == "function") {
					var l = 0;
					c = function(u, d, f) {
						if (u && u.code === "EAGAIN" && l < 10) return l++, t.call(e, n, r, i, a, o, c);
						s.apply(this, arguments);
					};
				}
				return t.call(e, n, r, i, a, o, c);
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.read) : e.read, e.readSync = typeof e.readSync == "function" ? (function(t) {
			return function(n, r, i, a, o) {
				for (var s = 0;;) try {
					return t.call(e, n, r, i, a, o);
				} catch (e) {
					if (e.code === "EAGAIN" && s < 10) {
						s++;
						continue;
					}
					throw e;
				}
			};
		})(e.readSync) : e.readSync;
		function t(e) {
			e.lchmod = function(t, r, i) {
				e.open(t, n.O_WRONLY | n.O_SYMLINK, r, function(t, n) {
					if (t) {
						i && i(t);
						return;
					}
					e.fchmod(n, r, function(t) {
						e.close(n, function(e) {
							i && i(t || e);
						});
					});
				});
			}, e.lchmodSync = function(t, r) {
				var i = e.openSync(t, n.O_WRONLY | n.O_SYMLINK, r), a = !0, o;
				try {
					o = e.fchmodSync(i, r), a = !1;
				} finally {
					if (a) try {
						e.closeSync(i);
					} catch {}
					else e.closeSync(i);
				}
				return o;
			};
		}
		function r(e) {
			n.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, r, i, a) {
				e.open(t, n.O_SYMLINK, function(t, n) {
					if (t) {
						a && a(t);
						return;
					}
					e.futimes(n, r, i, function(t) {
						e.close(n, function(e) {
							a && a(t || e);
						});
					});
				});
			}, e.lutimesSync = function(t, r, i) {
				var a = e.openSync(t, n.O_SYMLINK), o, s = !0;
				try {
					o = e.futimesSync(a, r, i), s = !1;
				} finally {
					if (s) try {
						e.closeSync(a);
					} catch {}
					else e.closeSync(a);
				}
				return o;
			}) : e.futimes && (e.lutimes = function(e, t, n, r) {
				r && process.nextTick(r);
			}, e.lutimesSync = function() {});
		}
		function i(t) {
			return t && function(n, r, i) {
				return t.call(e, n, r, function(e) {
					d(e) && (e = null), i && i.apply(this, arguments);
				});
			};
		}
		function o(t) {
			return t && function(n, r) {
				try {
					return t.call(e, n, r);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function s(t) {
			return t && function(n, r, i, a) {
				return t.call(e, n, r, i, function(e) {
					d(e) && (e = null), a && a.apply(this, arguments);
				});
			};
		}
		function c(t) {
			return t && function(n, r, i) {
				try {
					return t.call(e, n, r, i);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function l(t) {
			return t && function(n, r, i) {
				typeof r == "function" && (i = r, r = null);
				function a(e, t) {
					t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), i && i.apply(this, arguments);
				}
				return r ? t.call(e, n, r, a) : t.call(e, n, a);
			};
		}
		function u(t) {
			return t && function(n, r) {
				var i = r ? t.call(e, n, r) : t.call(e, n);
				return i && (i.uid < 0 && (i.uid += 4294967296), i.gid < 0 && (i.gid += 4294967296)), i;
			};
		}
		function d(e) {
			return !e || e.code === "ENOSYS" || (!process.getuid || process.getuid() !== 0) && (e.code === "EINVAL" || e.code === "EPERM");
		}
	}
})), nn = /* @__PURE__ */ w(((e, t) => {
	var n = T("stream").Stream;
	t.exports = r;
	function r(e) {
		return {
			ReadStream: t,
			WriteStream: r
		};
		function t(r, i) {
			if (!(this instanceof t)) return new t(r, i);
			n.call(this);
			var a = this;
			this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i ||= {};
			for (var o = Object.keys(i), s = 0, c = o.length; s < c; s++) {
				var l = o[s];
				this[l] = i[l];
			}
			if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if (typeof this.end != "number") throw TypeError("end must be a Number");
				if (this.start > this.end) throw Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					a._read();
				});
				return;
			}
			e.open(this.path, this.flags, this.mode, function(e, t) {
				if (e) {
					a.emit("error", e), a.readable = !1;
					return;
				}
				a.fd = t, a.emit("open", t), a._read();
			});
		}
		function r(t, i) {
			if (!(this instanceof r)) return new r(t, i);
			n.call(this), this.path = t, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i ||= {};
			for (var a = Object.keys(i), o = 0, s = a.length; o < s; o++) {
				var c = a[o];
				this[c] = i[c];
			}
			if (this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.start < 0) throw Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([
				this._open,
				this.path,
				this.flags,
				this.mode,
				void 0
			]), this.flush());
		}
	}
})), rn = /* @__PURE__ */ w(((e, t) => {
	t.exports = r;
	var n = Object.getPrototypeOf || function(e) {
		return e.__proto__;
	};
	function r(e) {
		if (typeof e != "object" || !e) return e;
		if (e instanceof Object) var t = { __proto__: n(e) };
		else var t = Object.create(null);
		return Object.getOwnPropertyNames(e).forEach(function(n) {
			Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
		}), t;
	}
})), an = /* @__PURE__ */ w(((e, t) => {
	var n = T("fs"), r = tn(), i = nn(), a = rn(), o = T("util"), s, c;
	/* istanbul ignore else - node 0.x polyfill */
	typeof Symbol == "function" && typeof Symbol.for == "function" ? (s = Symbol.for("graceful-fs.queue"), c = Symbol.for("graceful-fs.previous")) : (s = "___graceful-fs.queue", c = "___graceful-fs.previous");
	function l() {}
	function u(e, t) {
		Object.defineProperty(e, s, { get: function() {
			return t;
		} });
	}
	var d = l;
	o.debuglog ? d = o.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (d = function() {
		var e = o.format.apply(o, arguments);
		e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
	}), n[s] || (u(n, global[s] || []), n.close = (function(e) {
		function t(t, r) {
			return e.call(n, t, function(e) {
				e || h(), typeof r == "function" && r.apply(this, arguments);
			});
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.close), n.closeSync = (function(e) {
		function t(t) {
			e.apply(n, arguments), h();
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
		d(n[s]), T("assert").equal(n[s].length, 0);
	})), global[s] || u(global, n[s]), t.exports = f(a(n)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !n.__patched && (t.exports = f(n), n.__patched = !0);
	function f(e) {
		r(e), e.gracefulify = f, e.createReadStream = ie, e.createWriteStream = ae;
		var t = e.readFile;
		e.readFile = n;
		function n(e, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, n, r);
			function i(e, n, r, a) {
				return t(e, n, function(t) {
					t && (t.code === "EMFILE" || t.code === "ENFILE") ? p([
						i,
						[
							e,
							n,
							r
						],
						t,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var a = e.writeFile;
		e.writeFile = o;
		function o(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, o) {
				return a(e, t, n, function(a) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						a,
						o || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var s = e.appendFile;
		s && (e.appendFile = c);
		function c(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return s(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var l = e.copyFile;
		l && (e.copyFile = u);
		function u(e, t, n, r) {
			return typeof n == "function" && (r = n, n = 0), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return l(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var d = e.readdir;
		e.readdir = h;
		var m = /^v[0-5]\./;
		function h(e, t, n) {
			typeof t == "function" && (n = t, t = null);
			var r = m.test(process.version) ? function(e, t, n, r) {
				return d(e, i(e, t, n, r));
			} : function(e, t, n, r) {
				return d(e, t, i(e, t, n, r));
			};
			return r(e, t, n);
			function i(e, t, n, i) {
				return function(a, o) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						r,
						[
							e,
							t,
							n
						],
						a,
						i || Date.now(),
						Date.now()
					]) : (o && o.sort && o.sort(), typeof n == "function" && n.call(this, a, o));
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var g = i(e);
			y = g.ReadStream, b = g.WriteStream;
		}
		var ee = e.ReadStream;
		ee && (y.prototype = Object.create(ee.prototype), y.prototype.open = ne);
		var _ = e.WriteStream;
		_ && (b.prototype = Object.create(_.prototype), b.prototype.open = re), Object.defineProperty(e, "ReadStream", {
			get: function() {
				return y;
			},
			set: function(e) {
				y = e;
			},
			enumerable: !0,
			configurable: !0
		}), Object.defineProperty(e, "WriteStream", {
			get: function() {
				return b;
			},
			set: function(e) {
				b = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var v = y;
		Object.defineProperty(e, "FileReadStream", {
			get: function() {
				return v;
			},
			set: function(e) {
				v = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var te = b;
		Object.defineProperty(e, "FileWriteStream", {
			get: function() {
				return te;
			},
			set: function(e) {
				te = e;
			},
			enumerable: !0,
			configurable: !0
		});
		function y(e, t) {
			return this instanceof y ? (ee.apply(this, arguments), this) : y.apply(Object.create(y.prototype), arguments);
		}
		function ne() {
			var e = this;
			x(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n), e.read());
			});
		}
		function b(e, t) {
			return this instanceof b ? (_.apply(this, arguments), this) : b.apply(Object.create(b.prototype), arguments);
		}
		function re() {
			var e = this;
			x(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n));
			});
		}
		function ie(t, n) {
			return new e.ReadStream(t, n);
		}
		function ae(t, n) {
			return new e.WriteStream(t, n);
		}
		var oe = e.open;
		e.open = x;
		function x(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return oe(e, t, n, function(o, s) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		return e;
	}
	function p(e) {
		d("ENQUEUE", e[0].name, e[1]), n[s].push(e), g();
	}
	var m;
	function h() {
		for (var e = Date.now(), t = 0; t < n[s].length; ++t) n[s][t].length > 2 && (n[s][t][3] = e, n[s][t][4] = e);
		g();
	}
	function g() {
		if (clearTimeout(m), m = void 0, n[s].length !== 0) {
			var e = n[s].shift(), t = e[0], r = e[1], i = e[2], a = e[3], o = e[4];
			if (a === void 0) d("RETRY", t.name, r), t.apply(null, r);
			else if (Date.now() - a >= 6e4) {
				d("TIMEOUT", t.name, r);
				var c = r.pop();
				typeof c == "function" && c.call(null, i);
			} else {
				var l = Date.now() - o, u = Math.max(o - a, 1);
				l >= Math.min(u * 1.2, 100) ? (d("RETRY", t.name, r), t.apply(null, r.concat([a]))) : n[s].push(e);
			}
			m === void 0 && (m = setTimeout(g, 0));
		}
	}
})), A = /* @__PURE__ */ w(((e) => {
	var t = k().fromCallback, n = an(), r = (/* @__PURE__ */ "access.appendFile.chmod.chown.close.copyFile.cp.fchmod.fchown.fdatasync.fstat.fsync.ftruncate.futimes.glob.lchmod.lchown.lutimes.link.lstat.mkdir.mkdtemp.open.opendir.readdir.readFile.readlink.realpath.rename.rm.rmdir.stat.statfs.symlink.truncate.unlink.utimes.writeFile".split(".")).filter((e) => typeof n[e] == "function");
	Object.assign(e, n), r.forEach((r) => {
		e[r] = t(n[r]);
	}), e.exists = function(e, t) {
		return typeof t == "function" ? n.exists(e, t) : new Promise((t) => n.exists(e, t));
	}, e.read = function(e, t, r, i, a, o) {
		return typeof o == "function" ? n.read(e, t, r, i, a, o) : new Promise((o, s) => {
			n.read(e, t, r, i, a, (e, t, n) => {
				if (e) return s(e);
				o({
					bytesRead: t,
					buffer: n
				});
			});
		});
	}, e.write = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.write(e, t, ...r) : new Promise((i, a) => {
			n.write(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffer: n
				});
			});
		});
	}, e.readv = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.readv(e, t, ...r) : new Promise((i, a) => {
			n.readv(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesRead: t,
					buffers: n
				});
			});
		});
	}, e.writev = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.writev(e, t, ...r) : new Promise((i, a) => {
			n.writev(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffers: n
				});
			});
		});
	}, typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
})), on = /* @__PURE__ */ w(((e, t) => {
	var n = T("path");
	t.exports.checkPath = function(e) {
		if (process.platform === "win32" && /[<>:"|?*]/.test(e.replace(n.parse(e).root, ""))) {
			let t = /* @__PURE__ */ Error(`Path contains invalid characters: ${e}`);
			throw t.code = "EINVAL", t;
		}
	};
})), sn = /* @__PURE__ */ w(((e, t) => {
	var n = A(), { checkPath: r } = on(), i = (e) => typeof e == "number" ? e : {
		mode: 511,
		...e
	}.mode;
	t.exports.makeDir = async (e, t) => (r(e), n.mkdir(e, {
		mode: i(t),
		recursive: !0
	})), t.exports.makeDirSync = (e, t) => (r(e), n.mkdirSync(e, {
		mode: i(t),
		recursive: !0
	}));
})), cn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, { makeDir: r, makeDirSync: i } = sn(), a = n(r);
	t.exports = {
		mkdirs: a,
		mkdirsSync: i,
		mkdirp: a,
		mkdirpSync: i,
		ensureDir: a,
		ensureDirSync: i
	};
})), ln = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = A();
	function i(e) {
		return r.access(e).then(() => !0).catch(() => !1);
	}
	t.exports = {
		pathExists: n(i),
		pathExistsSync: r.existsSync
	};
})), un = /* @__PURE__ */ w(((e, t) => {
	var n = A(), r = k().fromPromise;
	async function i(e, t, r) {
		let i = await n.open(e, "r+"), a = null;
		try {
			await n.futimes(i, t, r);
		} finally {
			try {
				await n.close(i);
			} catch (e) {
				a = e;
			}
		}
		if (a) throw a;
	}
	function a(e, t, r) {
		let i = n.openSync(e, "r+");
		return n.futimesSync(i, t, r), n.closeSync(i);
	}
	t.exports = {
		utimesMillis: r(i),
		utimesMillisSync: a
	};
})), dn = /* @__PURE__ */ w(((e, t) => {
	var n = A(), r = T("path"), i = k().fromPromise;
	function a(e, t, r) {
		let i = r.dereference ? (e) => n.stat(e, { bigint: !0 }) : (e) => n.lstat(e, { bigint: !0 });
		return Promise.all([i(e), i(t).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		})]).then(([e, t]) => ({
			srcStat: e,
			destStat: t
		}));
	}
	function o(e, t, r) {
		let i, a = r.dereference ? (e) => n.statSync(e, { bigint: !0 }) : (e) => n.lstatSync(e, { bigint: !0 }), o = a(e);
		try {
			i = a(t);
		} catch (e) {
			if (e.code === "ENOENT") return {
				srcStat: o,
				destStat: null
			};
			throw e;
		}
		return {
			srcStat: o,
			destStat: i
		};
	}
	async function s(e, t, n, i) {
		let { srcStat: o, destStat: s } = await a(e, t, i);
		if (s) {
			if (d(o, s)) {
				let i = r.basename(e), a = r.basename(t);
				if (n === "move" && i !== a && i.toLowerCase() === a.toLowerCase()) return {
					srcStat: o,
					destStat: s,
					isChangingCase: !0
				};
				throw Error("Source and destination must not be the same.");
			}
			if (o.isDirectory() && !s.isDirectory()) throw Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
			if (!o.isDirectory() && s.isDirectory()) throw Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
		}
		if (o.isDirectory() && f(e, t)) throw Error(p(e, t, n));
		return {
			srcStat: o,
			destStat: s
		};
	}
	function c(e, t, n, i) {
		let { srcStat: a, destStat: s } = o(e, t, i);
		if (s) {
			if (d(a, s)) {
				let i = r.basename(e), o = r.basename(t);
				if (n === "move" && i !== o && i.toLowerCase() === o.toLowerCase()) return {
					srcStat: a,
					destStat: s,
					isChangingCase: !0
				};
				throw Error("Source and destination must not be the same.");
			}
			if (a.isDirectory() && !s.isDirectory()) throw Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
			if (!a.isDirectory() && s.isDirectory()) throw Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
		}
		if (a.isDirectory() && f(e, t)) throw Error(p(e, t, n));
		return {
			srcStat: a,
			destStat: s
		};
	}
	async function l(e, t, i, a) {
		let o = r.resolve(r.dirname(e)), s = r.resolve(r.dirname(i));
		if (s === o || s === r.parse(s).root) return;
		let c;
		try {
			c = await n.stat(s, { bigint: !0 });
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw e;
		}
		if (d(t, c)) throw Error(p(e, i, a));
		return l(e, t, s, a);
	}
	function u(e, t, i, a) {
		let o = r.resolve(r.dirname(e)), s = r.resolve(r.dirname(i));
		if (s === o || s === r.parse(s).root) return;
		let c;
		try {
			c = n.statSync(s, { bigint: !0 });
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw e;
		}
		if (d(t, c)) throw Error(p(e, i, a));
		return u(e, t, s, a);
	}
	function d(e, t) {
		return t.ino !== void 0 && t.dev !== void 0 && t.ino === e.ino && t.dev === e.dev;
	}
	function f(e, t) {
		let n = r.resolve(e).split(r.sep).filter((e) => e), i = r.resolve(t).split(r.sep).filter((e) => e);
		return n.every((e, t) => i[t] === e);
	}
	function p(e, t, n) {
		return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
	}
	t.exports = {
		checkPaths: i(s),
		checkPathsSync: c,
		checkParentPaths: i(l),
		checkParentPathsSync: u,
		isSrcSubdir: f,
		areIdentical: d
	};
})), fn = /* @__PURE__ */ w(((e, t) => {
	async function n(e, t) {
		let n = [];
		for await (let r of e) n.push(t(r).then(() => null, (e) => e ?? /* @__PURE__ */ Error("unknown error")));
		await Promise.all(n.map((e) => e.then((e) => {
			if (e !== null) throw e;
		})));
	}
	t.exports = { asyncIteratorConcurrentProcess: n };
})), pn = /* @__PURE__ */ w(((e, t) => {
	var n = A(), r = T("path"), { mkdirs: i } = cn(), { pathExists: a } = ln(), { utimesMillis: o } = un(), s = dn(), { asyncIteratorConcurrentProcess: c } = fn();
	async function l(e, t, n = {}) {
		typeof n == "function" && (n = { filter: n }), n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
		let { srcStat: o, destStat: c } = await s.checkPaths(e, t, "copy", n);
		if (await s.checkParentPaths(e, o, t, "copy"), !await u(e, t, n)) return;
		let l = r.dirname(t);
		await a(l) || await i(l), await d(c, e, t, n);
	}
	async function u(e, t, n) {
		return n.filter ? n.filter(e, t) : !0;
	}
	async function d(e, t, r, i) {
		let a = await (i.dereference ? n.stat : n.lstat)(t);
		if (a.isDirectory()) return g(a, e, t, r, i);
		if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return f(a, e, t, r, i);
		if (a.isSymbolicLink()) return ee(e, t, r, i);
		throw a.isSocket() ? Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? Error(`Cannot copy a FIFO pipe: ${t}`) : Error(`Unknown file: ${t}`);
	}
	async function f(e, t, r, i, a) {
		if (!t) return p(e, r, i, a);
		if (a.overwrite) return await n.unlink(i), p(e, r, i, a);
		if (a.errorOnExist) throw Error(`'${i}' already exists`);
	}
	async function p(e, t, r, i) {
		if (await n.copyFile(t, r), i.preserveTimestamps) {
			m(e.mode) && await h(r, e.mode);
			let i = await n.stat(t);
			await o(r, i.atime, i.mtime);
		}
		return n.chmod(r, e.mode);
	}
	function m(e) {
		return (e & 128) == 0;
	}
	function h(e, t) {
		return n.chmod(e, t | 128);
	}
	async function g(e, t, i, a, o) {
		t || await n.mkdir(a), await c(await n.opendir(i), async (e) => {
			let t = r.join(i, e.name), n = r.join(a, e.name);
			if (await u(t, n, o)) {
				let { destStat: e } = await s.checkPaths(t, n, "copy", o);
				await d(e, t, n, o);
			}
		}), t || await n.chmod(a, e.mode);
	}
	async function ee(e, t, i, a) {
		let o = await n.readlink(t);
		if (a.dereference && (o = r.resolve(process.cwd(), o)), !e) return n.symlink(o, i);
		let c = null;
		try {
			c = await n.readlink(i);
		} catch (e) {
			if (e.code === "EINVAL" || e.code === "UNKNOWN") return n.symlink(o, i);
			throw e;
		}
		if (a.dereference && (c = r.resolve(process.cwd(), c)), o !== c) {
			if (s.isSrcSubdir(o, c)) throw Error(`Cannot copy '${o}' to a subdirectory of itself, '${c}'.`);
			if (s.isSrcSubdir(c, o)) throw Error(`Cannot overwrite '${c}' with '${o}'.`);
		}
		return await n.unlink(i), n.symlink(o, i);
	}
	t.exports = l;
})), mn = /* @__PURE__ */ w(((e, t) => {
	var n = an(), r = T("path"), i = cn().mkdirsSync, a = un().utimesMillisSync, o = dn();
	function s(e, t, a) {
		typeof a == "function" && (a = { filter: a }), a ||= {}, a.clobber = "clobber" in a ? !!a.clobber : !0, a.overwrite = "overwrite" in a ? !!a.overwrite : a.clobber, a.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		let { srcStat: s, destStat: l } = o.checkPathsSync(e, t, "copy", a);
		if (o.checkParentPathsSync(e, s, t, "copy"), a.filter && !a.filter(e, t)) return;
		let u = r.dirname(t);
		return n.existsSync(u) || i(u), c(l, e, t, a);
	}
	function c(e, t, r, i) {
		let a = (i.dereference ? n.statSync : n.lstatSync)(t);
		if (a.isDirectory()) return ee(a, e, t, r, i);
		if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return l(a, e, t, r, i);
		if (a.isSymbolicLink()) return y(e, t, r, i);
		throw a.isSocket() ? Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? Error(`Cannot copy a FIFO pipe: ${t}`) : Error(`Unknown file: ${t}`);
	}
	function l(e, t, n, r, i) {
		return t ? u(e, n, r, i) : d(e, n, r, i);
	}
	function u(e, t, r, i) {
		if (i.overwrite) return n.unlinkSync(r), d(e, t, r, i);
		if (i.errorOnExist) throw Error(`'${r}' already exists`);
	}
	function d(e, t, r, i) {
		return n.copyFileSync(t, r), i.preserveTimestamps && f(e.mode, t, r), h(r, e.mode);
	}
	function f(e, t, n) {
		return p(e) && m(n, e), g(t, n);
	}
	function p(e) {
		return (e & 128) == 0;
	}
	function m(e, t) {
		return h(e, t | 128);
	}
	function h(e, t) {
		return n.chmodSync(e, t);
	}
	function g(e, t) {
		let r = n.statSync(e);
		return a(t, r.atime, r.mtime);
	}
	function ee(e, t, n, r, i) {
		return t ? v(n, r, i) : _(e.mode, n, r, i);
	}
	function _(e, t, r, i) {
		return n.mkdirSync(r), v(t, r, i), h(r, e);
	}
	function v(e, t, r) {
		let i = n.opendirSync(e);
		try {
			let n;
			for (; (n = i.readSync()) !== null;) te(n.name, e, t, r);
		} finally {
			i.closeSync();
		}
	}
	function te(e, t, n, i) {
		let a = r.join(t, e), s = r.join(n, e);
		if (i.filter && !i.filter(a, s)) return;
		let { destStat: l } = o.checkPathsSync(a, s, "copy", i);
		return c(l, a, s, i);
	}
	function y(e, t, i, a) {
		let s = n.readlinkSync(t);
		if (a.dereference && (s = r.resolve(process.cwd(), s)), e) {
			let e;
			try {
				e = n.readlinkSync(i);
			} catch (e) {
				if (e.code === "EINVAL" || e.code === "UNKNOWN") return n.symlinkSync(s, i);
				throw e;
			}
			if (a.dereference && (e = r.resolve(process.cwd(), e)), s !== e) {
				if (o.isSrcSubdir(s, e)) throw Error(`Cannot copy '${s}' to a subdirectory of itself, '${e}'.`);
				if (o.isSrcSubdir(e, s)) throw Error(`Cannot overwrite '${e}' with '${s}'.`);
			}
			return ne(s, i);
		} else return n.symlinkSync(s, i);
	}
	function ne(e, t) {
		return n.unlinkSync(t), n.symlinkSync(e, t);
	}
	t.exports = s;
})), hn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise;
	t.exports = {
		copy: n(pn()),
		copySync: mn()
	};
})), gn = /* @__PURE__ */ w(((e, t) => {
	var n = an(), r = k().fromCallback;
	function i(e, t) {
		n.rm(e, {
			recursive: !0,
			force: !0
		}, t);
	}
	function a(e) {
		n.rmSync(e, {
			recursive: !0,
			force: !0
		});
	}
	t.exports = {
		remove: r(i),
		removeSync: a
	};
})), _n = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = A(), i = T("path"), a = cn(), o = gn(), s = n(async function(e) {
		let t;
		try {
			t = await r.readdir(e);
		} catch {
			return a.mkdirs(e);
		}
		return Promise.all(t.map((t) => o.remove(i.join(e, t))));
	});
	function c(e) {
		let t;
		try {
			t = r.readdirSync(e);
		} catch {
			return a.mkdirsSync(e);
		}
		t.forEach((t) => {
			t = i.join(e, t), o.removeSync(t);
		});
	}
	t.exports = {
		emptyDirSync: c,
		emptydirSync: c,
		emptyDir: s,
		emptydir: s
	};
})), vn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = T("path"), i = A(), a = cn();
	async function o(e) {
		let t;
		try {
			t = await i.stat(e);
		} catch {}
		if (t && t.isFile()) return;
		let n = r.dirname(e), o = null;
		try {
			o = await i.stat(n);
		} catch (t) {
			if (t.code === "ENOENT") {
				await a.mkdirs(n), await i.writeFile(e, "");
				return;
			} else throw t;
		}
		o.isDirectory() ? await i.writeFile(e, "") : await i.readdir(n);
	}
	function s(e) {
		let t;
		try {
			t = i.statSync(e);
		} catch {}
		if (t && t.isFile()) return;
		let n = r.dirname(e);
		try {
			i.statSync(n).isDirectory() || i.readdirSync(n);
		} catch (e) {
			if (e && e.code === "ENOENT") a.mkdirsSync(n);
			else throw e;
		}
		i.writeFileSync(e, "");
	}
	t.exports = {
		createFile: n(o),
		createFileSync: s
	};
})), yn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = T("path"), i = A(), a = cn(), { pathExists: o } = ln(), { areIdentical: s } = dn();
	async function c(e, t) {
		let n;
		try {
			n = await i.lstat(t);
		} catch {}
		let c;
		try {
			c = await i.lstat(e);
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureLink"), e;
		}
		if (n && s(c, n)) return;
		let l = r.dirname(t);
		await o(l) || await a.mkdirs(l), await i.link(e, t);
	}
	function l(e, t) {
		let n;
		try {
			n = i.lstatSync(t);
		} catch {}
		try {
			let t = i.lstatSync(e);
			if (n && s(t, n)) return;
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureLink"), e;
		}
		let o = r.dirname(t);
		return i.existsSync(o) || a.mkdirsSync(o), i.linkSync(e, t);
	}
	t.exports = {
		createLink: n(c),
		createLinkSync: l
	};
})), bn = /* @__PURE__ */ w(((e, t) => {
	var n = T("path"), r = A(), { pathExists: i } = ln(), a = k().fromPromise;
	async function o(e, t) {
		if (n.isAbsolute(e)) {
			try {
				await r.lstat(e);
			} catch (e) {
				throw e.message = e.message.replace("lstat", "ensureSymlink"), e;
			}
			return {
				toCwd: e,
				toDst: e
			};
		}
		let a = n.dirname(t), o = n.join(a, e);
		if (await i(o)) return {
			toCwd: o,
			toDst: e
		};
		try {
			await r.lstat(e);
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureSymlink"), e;
		}
		return {
			toCwd: e,
			toDst: n.relative(a, e)
		};
	}
	function s(e, t) {
		if (n.isAbsolute(e)) {
			if (!r.existsSync(e)) throw Error("absolute srcpath does not exist");
			return {
				toCwd: e,
				toDst: e
			};
		}
		let i = n.dirname(t), a = n.join(i, e);
		if (r.existsSync(a)) return {
			toCwd: a,
			toDst: e
		};
		if (!r.existsSync(e)) throw Error("relative srcpath does not exist");
		return {
			toCwd: e,
			toDst: n.relative(i, e)
		};
	}
	t.exports = {
		symlinkPaths: a(o),
		symlinkPathsSync: s
	};
})), xn = /* @__PURE__ */ w(((e, t) => {
	var n = A(), r = k().fromPromise;
	async function i(e, t) {
		if (t) return t;
		let r;
		try {
			r = await n.lstat(e);
		} catch {
			return "file";
		}
		return r && r.isDirectory() ? "dir" : "file";
	}
	function a(e, t) {
		if (t) return t;
		let r;
		try {
			r = n.lstatSync(e);
		} catch {
			return "file";
		}
		return r && r.isDirectory() ? "dir" : "file";
	}
	t.exports = {
		symlinkType: r(i),
		symlinkTypeSync: a
	};
})), Sn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = T("path"), i = A(), { mkdirs: a, mkdirsSync: o } = cn(), { symlinkPaths: s, symlinkPathsSync: c } = bn(), { symlinkType: l, symlinkTypeSync: u } = xn(), { pathExists: d } = ln(), { areIdentical: f } = dn();
	async function p(e, t, n) {
		let o;
		try {
			o = await i.lstat(t);
		} catch {}
		if (o && o.isSymbolicLink()) {
			let n;
			if (r.isAbsolute(e)) n = await i.stat(e);
			else {
				let a = r.dirname(t), o = r.join(a, e);
				try {
					n = await i.stat(o);
				} catch {
					n = await i.stat(e);
				}
			}
			let a = await i.stat(t);
			if (f(n, a)) return;
		}
		let c = await s(e, t);
		e = c.toDst;
		let u = await l(c.toCwd, n), p = r.dirname(t);
		return await d(p) || await a(p), i.symlink(e, t, u);
	}
	function m(e, t, n) {
		let a;
		try {
			a = i.lstatSync(t);
		} catch {}
		if (a && a.isSymbolicLink()) {
			let n;
			if (r.isAbsolute(e)) n = i.statSync(e);
			else {
				let a = r.dirname(t), o = r.join(a, e);
				try {
					n = i.statSync(o);
				} catch {
					n = i.statSync(e);
				}
			}
			let a = i.statSync(t);
			if (f(n, a)) return;
		}
		let s = c(e, t);
		e = s.toDst, n = u(s.toCwd, n);
		let l = r.dirname(t);
		return i.existsSync(l) || o(l), i.symlinkSync(e, t, n);
	}
	t.exports = {
		createSymlink: n(p),
		createSymlinkSync: m
	};
})), Cn = /* @__PURE__ */ w(((e, t) => {
	var { createFile: n, createFileSync: r } = vn(), { createLink: i, createLinkSync: a } = yn(), { createSymlink: o, createSymlinkSync: s } = Sn();
	t.exports = {
		createFile: n,
		createFileSync: r,
		ensureFile: n,
		ensureFileSync: r,
		createLink: i,
		createLinkSync: a,
		ensureLink: i,
		ensureLinkSync: a,
		createSymlink: o,
		createSymlinkSync: s,
		ensureSymlink: o,
		ensureSymlinkSync: s
	};
})), wn = /* @__PURE__ */ w(((e, t) => {
	function n(e, { EOL: t = "\n", finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
		let a = n ? t : "";
		return JSON.stringify(e, r, i).replace(/\n/g, t) + a;
	}
	function r(e) {
		return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
	}
	t.exports = {
		stringify: n,
		stripBom: r
	};
})), Tn = /* @__PURE__ */ w(((e, t) => {
	var n;
	try {
		n = an();
	} catch {
		n = T("fs");
	}
	var r = k(), { stringify: i, stripBom: a } = wn();
	async function o(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let i = t.fs || n, o = "throws" in t ? t.throws : !0, s = await r.fromCallback(i.readFile)(e, t);
		s = a(s);
		let c;
		try {
			c = JSON.parse(s, t ? t.reviver : null);
		} catch (t) {
			if (o) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
		return c;
	}
	var s = r.fromPromise(o);
	function c(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let r = t.fs || n, i = "throws" in t ? t.throws : !0;
		try {
			let n = r.readFileSync(e, t);
			return n = a(n), JSON.parse(n, t.reviver);
		} catch (t) {
			if (i) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
	}
	async function l(e, t, a = {}) {
		let o = a.fs || n, s = i(t, a);
		await r.fromCallback(o.writeFile)(e, s, a);
	}
	var u = r.fromPromise(l);
	function d(e, t, r = {}) {
		let a = r.fs || n, o = i(t, r);
		return a.writeFileSync(e, o, r);
	}
	t.exports = {
		readFile: s,
		readFileSync: c,
		writeFile: u,
		writeFileSync: d
	};
})), En = /* @__PURE__ */ w(((e, t) => {
	var n = Tn();
	t.exports = {
		readJson: n.readFile,
		readJsonSync: n.readFileSync,
		writeJson: n.writeFile,
		writeJsonSync: n.writeFileSync
	};
})), Dn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = A(), i = T("path"), a = cn(), o = ln().pathExists;
	async function s(e, t, n = "utf-8") {
		let s = i.dirname(e);
		return await o(s) || await a.mkdirs(s), r.writeFile(e, t, n);
	}
	function c(e, ...t) {
		let n = i.dirname(e);
		r.existsSync(n) || a.mkdirsSync(n), r.writeFileSync(e, ...t);
	}
	t.exports = {
		outputFile: n(s),
		outputFileSync: c
	};
})), On = /* @__PURE__ */ w(((e, t) => {
	var { stringify: n } = wn(), { outputFile: r } = Dn();
	async function i(e, t, i = {}) {
		await r(e, n(t, i), i);
	}
	t.exports = i;
})), kn = /* @__PURE__ */ w(((e, t) => {
	var { stringify: n } = wn(), { outputFileSync: r } = Dn();
	function i(e, t, i) {
		r(e, n(t, i), i);
	}
	t.exports = i;
})), An = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise, r = En();
	r.outputJson = n(On()), r.outputJsonSync = kn(), r.outputJSON = r.outputJson, r.outputJSONSync = r.outputJsonSync, r.writeJSON = r.writeJson, r.writeJSONSync = r.writeJsonSync, r.readJSON = r.readJson, r.readJSONSync = r.readJsonSync, t.exports = r;
})), jn = /* @__PURE__ */ w(((e, t) => {
	var n = A(), r = T("path"), { copy: i } = hn(), { remove: a } = gn(), { mkdirp: o } = cn(), { pathExists: s } = ln(), c = dn();
	async function l(e, t, n = {}) {
		let i = n.overwrite || n.clobber || !1, { srcStat: a, isChangingCase: s = !1 } = await c.checkPaths(e, t, "move", n);
		await c.checkParentPaths(e, a, t, "move");
		let l = r.dirname(t);
		return r.parse(l).root !== l && await o(l), u(e, t, i, s);
	}
	async function u(e, t, r, i) {
		if (!i) {
			if (r) await a(t);
			else if (await s(t)) throw Error("dest already exists.");
		}
		try {
			await n.rename(e, t);
		} catch (n) {
			if (n.code !== "EXDEV") throw n;
			await d(e, t, r);
		}
	}
	async function d(e, t, n) {
		return await i(e, t, {
			overwrite: n,
			errorOnExist: !0,
			preserveTimestamps: !0
		}), a(e);
	}
	t.exports = l;
})), Mn = /* @__PURE__ */ w(((e, t) => {
	var n = an(), r = T("path"), i = hn().copySync, a = gn().removeSync, o = cn().mkdirpSync, s = dn();
	function c(e, t, n) {
		n ||= {};
		let i = n.overwrite || n.clobber || !1, { srcStat: a, isChangingCase: c = !1 } = s.checkPathsSync(e, t, "move", n);
		return s.checkParentPathsSync(e, a, t, "move"), l(t) || o(r.dirname(t)), u(e, t, i, c);
	}
	function l(e) {
		let t = r.dirname(e);
		return r.parse(t).root === t;
	}
	function u(e, t, r, i) {
		if (i) return d(e, t, r);
		if (r) return a(t), d(e, t, r);
		if (n.existsSync(t)) throw Error("dest already exists.");
		return d(e, t, r);
	}
	function d(e, t, r) {
		try {
			n.renameSync(e, t);
		} catch (n) {
			if (n.code !== "EXDEV") throw n;
			return f(e, t, r);
		}
	}
	function f(e, t, n) {
		return i(e, t, {
			overwrite: n,
			errorOnExist: !0,
			preserveTimestamps: !0
		}), a(e);
	}
	t.exports = c;
})), Nn = /* @__PURE__ */ w(((e, t) => {
	var n = k().fromPromise;
	t.exports = {
		move: n(jn()),
		moveSync: Mn()
	};
})), j = (/* @__PURE__ */ w(((e, t) => {
	t.exports = {
		...A(),
		...hn(),
		..._n(),
		...Cn(),
		...An(),
		...cn(),
		...Nn(),
		...Dn(),
		...ln(),
		...gn()
	};
})))(), Pn = class {
	exists(e) {
		if (!e || !re(e)) throw `file: "${e}" is not found.`;
		return !0;
	}
}, Fn = v(_), In = class extends Pn {
	async isInstalled() {
		let [e] = te().split(".");
		return Number(e) < 18 ? (0, j.existsSync)("/Library/Extensions/usbserial.kext") : !0;
	}
	async install(e) {
		console.log("install mac driver", e);
		try {
			let { stdout: t, stderr: n } = await Fn(`open "${e}" -W`);
			return console.info(t), n && console.error(n), !1;
		} catch (e) {
			return console.info(e.code, e.stdout, e.stderr), !1;
		}
	}
}, Ln = v(_), Rn = class extends Pn {
	async isInstalled() {
		let e = l(en, "System32/DriverStore/FileRepository");
		try {
			return (await le(e)).filter((e) => e.includes("ch341ser.")).length > 0 ? this.checkCh340Work() : !1;
		} catch (e) {
			return console.error("Error checking driver installation:", e), !1;
		}
	}
	async install(e) {
		console.log("install win driver", e);
		try {
			let { stdout: t, stderr: n } = await Ln(`"${e}"`);
			return console.info(0, t, n), !0;
		} catch (e) {
			return console.info(e.code || 1, e.stdout, e.stderr), !0;
		}
	}
	async checkCh340Work() {
		try {
			let { stdout: e } = await Ln("powershell -Command \"Get-WmiObject -Class Win32_PnPEntity | Where-Object { $_.Manufacturer -eq 'wch.cn' -and $_.ConfigManagerErrorCode -ne 0 } | ConvertTo-Json\""), t = JSON.parse(e || "[]");
			if (!Array.isArray(t) || t.length === 0) return !0;
			throw Error("driver is uncompatible.");
		} catch (e) {
			if (e.message === "driver is uncompatible.") throw e;
			return !0;
		}
	}
}, zn;
Xt() ? zn = new In() : Zt() && (zn = new Rn());
var Bn = {
	check() {
		if (zn) return zn.isInstalled();
		throw Error("adapter is empty");
	},
	async install(e) {
		try {
			return await zn.install(e);
		} catch (e) {
			throw Error(e.toString());
		}
	}
}, Vn = v(_), Hn = process.platform === "darwin" ? {
	check: () => Promise.resolve(!0),
	install: (e) => (console.log("install mac driver", e), Promise.resolve(!0))
} : process.platform === "win32" ? {
	check: () => {
		let e = l(en, "System32/DriverStore/FileRepository");
		return new Promise((t) => {
			if (!(C() === "win32" && he().startsWith("6.1"))) return t(!0);
			(0, j.readdir)(e, (n, r) => {
				if (n) return t(!1);
				let i = r.find((e) => e.toLowerCase().startsWith("gdusb2ser.inf_"));
				if (!i) return t(!1);
				(0, j.readdir)(l(e, i), (e, n) => {
					if (e) return t(!1);
					t(n.length >= 2);
				});
			});
		});
	},
	install: async (e) => {
		let t = `${e}/gd32/GD32-${process.arch === "x64" ? "x64" : "x86"}.exe`;
		console.log("install win driver", t);
		try {
			let { stdout: e, stderr: n } = await Vn(`"${t}"`);
			return console.info(0, e, n), !0;
		} catch (e) {
			return console.info(e.code || 1, e.stdout, e.stderr), !e.stderr;
		}
	}
} : {
	check() {
		return Promise.resolve(!0);
	},
	install(e) {
		return console.log("install gd32 driver", e), Promise.resolve(!0);
	}
}, Un = v(_), Wn = {
	ch340: Bn,
	gd32: Hn,
	rndis: process.platform === "darwin" ? {
		check: () => Promise.resolve(!0),
		install: (e) => (console.log("install rndis driver", e), Promise.resolve(!0))
	} : process.platform === "win32" ? {
		check: () => {
			let e = l(en, "System32/DriverStore/FileRepository");
			return new Promise((t) => {
				ie(e, (n, r) => {
					if (n) return t(!1);
					let i = r.find((e) => e.toLowerCase().startsWith("rndis.inf_"));
					if (!i) return t(!1);
					ie(l(e, i), (e, n) => {
						if (e) return t(!1);
						t(n.length >= 2);
					});
				});
			});
		},
		install: async (e) => {
			let t = `${e}/rndis/${`usb-driver-installer-${process.arch === "x64" ? "x64" : "x86"}.exe`}`;
			console.log("install win driver", t);
			try {
				let { stdout: e, stderr: n } = await Un(`"${t}"`);
				return console.info(0, e, n), !0;
			} catch (e) {
				return console.info(e.code || 1, e.stdout, e.stderr), !e.stderr;
			}
		}
	} : {
		check() {
			return Promise.resolve(!0);
		},
		install(e) {
			return console.log("install rndis driver", e), Promise.resolve(!0);
		}
	}
}, Gn = ".xcs", Kn = Object.defineProperty, qn = (e, t) => {
	for (var n in t) Kn(e, n, {
		get: t[n],
		enumerable: !0
	});
}, Jn = typeof process == "object" && process ? process : {
	stdout: null,
	stderr: null
}, Yn = (e) => !!e && typeof e == "object" && (e instanceof kr || e instanceof Ce || Xn(e) || Zn(e)), Xn = (e) => !!e && typeof e == "object" && e instanceof Se && typeof e.pipe == "function" && e.pipe !== Ce.Writable.prototype.pipe, Zn = (e) => !!e && typeof e == "object" && e instanceof Se && typeof e.write == "function" && typeof e.end == "function", Qn = Symbol("EOF"), $n = Symbol("maybeEmitEnd"), er = Symbol("emittedEnd"), tr = Symbol("emittingEnd"), nr = Symbol("emittedError"), rr = Symbol("closed"), ir = Symbol("read"), ar = Symbol("flush"), or = Symbol("flushChunk"), M = Symbol("encoding"), sr = Symbol("decoder"), N = Symbol("flowing"), cr = Symbol("paused"), lr = Symbol("resume"), P = Symbol("buffer"), F = Symbol("pipes"), I = Symbol("bufferLength"), ur = Symbol("bufferPush"), dr = Symbol("bufferShift"), L = Symbol("objectMode"), R = Symbol("destroyed"), fr = Symbol("error"), pr = Symbol("emitData"), mr = Symbol("emitEnd"), hr = Symbol("emitEnd2"), z = Symbol("async"), gr = Symbol("abort"), _r = Symbol("aborted"), vr = Symbol("signal"), yr = Symbol("dataListeners"), B = Symbol("discarded"), br = (e) => Promise.resolve().then(e), xr = (e) => e(), Sr = (e) => e === "end" || e === "finish" || e === "prefinish", Cr = (e) => e instanceof ArrayBuffer || !!e && typeof e == "object" && e.constructor && e.constructor.name === "ArrayBuffer" && e.byteLength >= 0, wr = (e) => !Buffer.isBuffer(e) && ArrayBuffer.isView(e), Tr = class {
	src;
	dest;
	opts;
	ondrain;
	constructor(e, t, n) {
		this.src = e, this.dest = t, this.opts = n, this.ondrain = () => e[lr](), this.dest.on("drain", this.ondrain);
	}
	unpipe() {
		this.dest.removeListener("drain", this.ondrain);
	}
	proxyErrors(e) {}
	end() {
		this.unpipe(), this.opts.end && this.dest.end();
	}
}, Er = class extends Tr {
	unpipe() {
		this.src.removeListener("error", this.proxyErrors), super.unpipe();
	}
	constructor(e, t, n) {
		super(e, t, n), this.proxyErrors = (e) => this.dest.emit("error", e), e.on("error", this.proxyErrors);
	}
}, Dr = (e) => !!e.objectMode, Or = (e) => !e.objectMode && !!e.encoding && e.encoding !== "buffer", kr = class extends Se {
	[N] = !1;
	[cr] = !1;
	[F] = [];
	[P] = [];
	[L];
	[M];
	[z];
	[sr];
	[Qn] = !1;
	[er] = !1;
	[tr] = !1;
	[rr] = !1;
	[nr] = null;
	[I] = 0;
	[R] = !1;
	[vr];
	[_r] = !1;
	[yr] = 0;
	[B] = !1;
	writable = !0;
	readable = !0;
	constructor(...e) {
		let t = e[0] || {};
		if (super(), t.objectMode && typeof t.encoding == "string") throw TypeError("Encoding and objectMode may not be used together");
		Dr(t) ? (this[L] = !0, this[M] = null) : Or(t) ? (this[M] = t.encoding, this[L] = !1) : (this[L] = !1, this[M] = null), this[z] = !!t.async, this[sr] = this[M] ? new we(this[M]) : null, t && t.debugExposeBuffer === !0 && Object.defineProperty(this, "buffer", { get: () => this[P] }), t && t.debugExposePipes === !0 && Object.defineProperty(this, "pipes", { get: () => this[F] });
		let { signal: n } = t;
		n && (this[vr] = n, n.aborted ? this[gr]() : n.addEventListener("abort", () => this[gr]()));
	}
	get bufferLength() {
		return this[I];
	}
	get encoding() {
		return this[M];
	}
	set encoding(e) {
		throw Error("Encoding must be set at instantiation time");
	}
	setEncoding(e) {
		throw Error("Encoding must be set at instantiation time");
	}
	get objectMode() {
		return this[L];
	}
	set objectMode(e) {
		throw Error("objectMode must be set at instantiation time");
	}
	get async() {
		return this[z];
	}
	set async(e) {
		this[z] = this[z] || !!e;
	}
	[gr]() {
		this[_r] = !0, this.emit("abort", this[vr]?.reason), this.destroy(this[vr]?.reason);
	}
	get aborted() {
		return this[_r];
	}
	set aborted(e) {}
	write(e, t, n) {
		if (this[_r]) return !1;
		if (this[Qn]) throw Error("write after end");
		if (this[R]) return this.emit("error", Object.assign(/* @__PURE__ */ Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" })), !0;
		typeof t == "function" && (n = t, t = "utf8"), t ||= "utf8";
		let r = this[z] ? br : xr;
		if (!this[L] && !Buffer.isBuffer(e)) {
			if (wr(e)) e = Buffer.from(e.buffer, e.byteOffset, e.byteLength);
			else if (Cr(e)) e = Buffer.from(e);
			else if (typeof e != "string") throw Error("Non-contiguous data written to non-objectMode stream");
		}
		return this[L] ? (this[N] && this[I] !== 0 && this[ar](!0), this[N] ? this.emit("data", e) : this[ur](e), this[I] !== 0 && this.emit("readable"), n && r(n), this[N]) : e.length ? (typeof e == "string" && !(t === this[M] && !this[sr]?.lastNeed) && (e = Buffer.from(e, t)), Buffer.isBuffer(e) && this[M] && (e = this[sr].write(e)), this[N] && this[I] !== 0 && this[ar](!0), this[N] ? this.emit("data", e) : this[ur](e), this[I] !== 0 && this.emit("readable"), n && r(n), this[N]) : (this[I] !== 0 && this.emit("readable"), n && r(n), this[N]);
	}
	read(e) {
		if (this[R]) return null;
		if (this[B] = !1, this[I] === 0 || e === 0 || e && e > this[I]) return this[$n](), null;
		this[L] && (e = null), this[P].length > 1 && !this[L] && (this[P] = [this[M] ? this[P].join("") : Buffer.concat(this[P], this[I])]);
		let t = this[ir](e || null, this[P][0]);
		return this[$n](), t;
	}
	[ir](e, t) {
		if (this[L]) this[dr]();
		else {
			let n = t;
			e === n.length || e === null ? this[dr]() : typeof n == "string" ? (this[P][0] = n.slice(e), t = n.slice(0, e), this[I] -= e) : (this[P][0] = n.subarray(e), t = n.subarray(0, e), this[I] -= e);
		}
		return this.emit("data", t), !this[P].length && !this[Qn] && this.emit("drain"), t;
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = "utf8"), e !== void 0 && this.write(e, t), n && this.once("end", n), this[Qn] = !0, this.writable = !1, (this[N] || !this[cr]) && this[$n](), this;
	}
	[lr]() {
		this[R] || (!this[yr] && !this[F].length && (this[B] = !0), this[cr] = !1, this[N] = !0, this.emit("resume"), this[P].length ? this[ar]() : this[Qn] ? this[$n]() : this.emit("drain"));
	}
	resume() {
		return this[lr]();
	}
	pause() {
		this[N] = !1, this[cr] = !0, this[B] = !1;
	}
	get destroyed() {
		return this[R];
	}
	get flowing() {
		return this[N];
	}
	get paused() {
		return this[cr];
	}
	[ur](e) {
		this[L] ? this[I] += 1 : this[I] += e.length, this[P].push(e);
	}
	[dr]() {
		return this[L] ? --this[I] : this[I] -= this[P][0].length, this[P].shift();
	}
	[ar](e = !1) {
		do		;
while (this[or](this[dr]()) && this[P].length);
		!e && !this[P].length && !this[Qn] && this.emit("drain");
	}
	[or](e) {
		return this.emit("data", e), this[N];
	}
	pipe(e, t) {
		if (this[R]) return e;
		this[B] = !1;
		let n = this[er];
		return t ||= {}, e === Jn.stdout || e === Jn.stderr ? t.end = !1 : t.end = t.end !== !1, t.proxyErrors = !!t.proxyErrors, n ? t.end && e.end() : (this[F].push(t.proxyErrors ? new Er(this, e, t) : new Tr(this, e, t)), this[z] ? br(() => this[lr]()) : this[lr]()), e;
	}
	unpipe(e) {
		let t = this[F].find((t) => t.dest === e);
		t && (this[F].length === 1 ? (this[N] && this[yr] === 0 && (this[N] = !1), this[F] = []) : this[F].splice(this[F].indexOf(t), 1), t.unpipe());
	}
	addListener(e, t) {
		return this.on(e, t);
	}
	on(e, t) {
		let n = super.on(e, t);
		if (e === "data") this[B] = !1, this[yr]++, !this[F].length && !this[N] && this[lr]();
		else if (e === "readable" && this[I] !== 0) super.emit("readable");
		else if (Sr(e) && this[er]) super.emit(e), this.removeAllListeners(e);
		else if (e === "error" && this[nr]) {
			let e = t;
			this[z] ? br(() => e.call(this, this[nr])) : e.call(this, this[nr]);
		}
		return n;
	}
	removeListener(e, t) {
		return this.off(e, t);
	}
	off(e, t) {
		let n = super.off(e, t);
		return e === "data" && (this[yr] = this.listeners("data").length, this[yr] === 0 && !this[B] && !this[F].length && (this[N] = !1)), n;
	}
	removeAllListeners(e) {
		let t = super.removeAllListeners(e);
		return (e === "data" || e === void 0) && (this[yr] = 0, !this[B] && !this[F].length && (this[N] = !1)), t;
	}
	get emittedEnd() {
		return this[er];
	}
	[$n]() {
		!this[tr] && !this[er] && !this[R] && this[P].length === 0 && this[Qn] && (this[tr] = !0, this.emit("end"), this.emit("prefinish"), this.emit("finish"), this[rr] && this.emit("close"), this[tr] = !1);
	}
	emit(e, ...t) {
		let n = t[0];
		if (e !== "error" && e !== "close" && e !== R && this[R]) return !1;
		if (e === "data") return !this[L] && !n ? !1 : this[z] ? (br(() => this[pr](n)), !0) : this[pr](n);
		if (e === "end") return this[mr]();
		if (e === "close") {
			if (this[rr] = !0, !this[er] && !this[R]) return !1;
			let e = super.emit("close");
			return this.removeAllListeners("close"), e;
		} else if (e === "error") {
			this[nr] = n, super.emit(fr, n);
			let e = !this[vr] || this.listeners("error").length ? super.emit("error", n) : !1;
			return this[$n](), e;
		} else if (e === "resume") {
			let e = super.emit("resume");
			return this[$n](), e;
		} else if (e === "finish" || e === "prefinish") {
			let t = super.emit(e);
			return this.removeAllListeners(e), t;
		}
		let r = super.emit(e, ...t);
		return this[$n](), r;
	}
	[pr](e) {
		for (let t of this[F]) t.dest.write(e) === !1 && this.pause();
		let t = this[B] ? !1 : super.emit("data", e);
		return this[$n](), t;
	}
	[mr]() {
		return this[er] ? !1 : (this[er] = !0, this.readable = !1, this[z] ? (br(() => this[hr]()), !0) : this[hr]());
	}
	[hr]() {
		if (this[sr]) {
			let e = this[sr].end();
			if (e) {
				for (let t of this[F]) t.dest.write(e);
				this[B] || super.emit("data", e);
			}
		}
		for (let e of this[F]) e.end();
		let e = super.emit("end");
		return this.removeAllListeners("end"), e;
	}
	async collect() {
		let e = Object.assign([], { dataLength: 0 });
		this[L] || (e.dataLength = 0);
		let t = this.promise();
		return this.on("data", (t) => {
			e.push(t), this[L] || (e.dataLength += t.length);
		}), await t, e;
	}
	async concat() {
		if (this[L]) throw Error("cannot concat in objectMode");
		let e = await this.collect();
		return this[M] ? e.join("") : Buffer.concat(e, e.dataLength);
	}
	async promise() {
		return new Promise((e, t) => {
			this.on(R, () => t(/* @__PURE__ */ Error("stream destroyed"))), this.on("error", (e) => t(e)), this.on("end", () => e());
		});
	}
	[Symbol.asyncIterator]() {
		this[B] = !1;
		let e = !1, t = async () => (this.pause(), e = !0, {
			value: void 0,
			done: !0
		});
		return {
			next: () => {
				if (e) return t();
				let n = this.read();
				if (n !== null) return Promise.resolve({
					done: !1,
					value: n
				});
				if (this[Qn]) return t();
				let r, i, a = (e) => {
					this.off("data", o), this.off("end", s), this.off(R, c), t(), i(e);
				}, o = (e) => {
					this.off("error", a), this.off("end", s), this.off(R, c), this.pause(), r({
						value: e,
						done: !!this[Qn]
					});
				}, s = () => {
					this.off("error", a), this.off("data", o), this.off(R, c), t(), r({
						done: !0,
						value: void 0
					});
				}, c = () => a(/* @__PURE__ */ Error("stream destroyed"));
				return new Promise((e, t) => {
					i = t, r = e, this.once(R, c), this.once("error", a), this.once("end", s), this.once("data", o);
				});
			},
			throw: t,
			return: t,
			[Symbol.asyncIterator]() {
				return this;
			},
			[Symbol.asyncDispose]: async () => {}
		};
	}
	[Symbol.iterator]() {
		this[B] = !1;
		let e = !1, t = () => (this.pause(), this.off(fr, t), this.off(R, t), this.off("end", t), e = !0, {
			done: !0,
			value: void 0
		});
		return this.once("end", t), this.once(fr, t), this.once(R, t), {
			next: () => {
				if (e) return t();
				let n = this.read();
				return n === null ? t() : {
					done: !1,
					value: n
				};
			},
			throw: t,
			return: t,
			[Symbol.iterator]() {
				return this;
			},
			[Symbol.dispose]: () => {}
		};
	}
	destroy(e) {
		if (this[R]) return e ? this.emit("error", e) : this.emit(R), this;
		this[R] = !0, this[B] = !0, this[P].length = 0, this[I] = 0;
		let t = this;
		return typeof t.close == "function" && !this[rr] && t.close(), e ? this.emit("error", e) : this.emit(R), this;
	}
	static get isStream() {
		return Yn;
	}
}, Ar = p.writev, jr = Symbol("_autoClose"), V = Symbol("_close"), Mr = Symbol("_ended"), H = Symbol("_fd"), Nr = Symbol("_finished"), Pr = Symbol("_flags"), Fr = Symbol("_flush"), Ir = Symbol("_handleChunk"), Lr = Symbol("_makeBuf"), Rr = Symbol("_mode"), zr = Symbol("_needDrain"), Br = Symbol("_onerror"), Vr = Symbol("_onopen"), Hr = Symbol("_onread"), Ur = Symbol("_onwrite"), Wr = Symbol("_open"), U = Symbol("_path"), Gr = Symbol("_pos"), W = Symbol("_queue"), Kr = Symbol("_read"), qr = Symbol("_readSize"), Jr = Symbol("_reading"), Yr = Symbol("_remain"), Xr = Symbol("_size"), Zr = Symbol("_write"), Qr = Symbol("_writing"), $r = Symbol("_defaultFlag"), ei = Symbol("_errored"), ti = class extends kr {
	[ei] = !1;
	[H];
	[U];
	[qr];
	[Jr] = !1;
	[Xr];
	[Yr];
	[jr];
	constructor(e, t) {
		if (t ||= {}, super(t), this.readable = !0, this.writable = !1, typeof e != "string") throw TypeError("path must be a string");
		this[ei] = !1, this[H] = typeof t.fd == "number" ? t.fd : void 0, this[U] = e, this[qr] = t.readSize || 16 * 1024 * 1024, this[Jr] = !1, this[Xr] = typeof t.size == "number" ? t.size : Infinity, this[Yr] = this[Xr], this[jr] = typeof t.autoClose == "boolean" ? t.autoClose : !0, typeof this[H] == "number" ? this[Kr]() : this[Wr]();
	}
	get fd() {
		return this[H];
	}
	get path() {
		return this[U];
	}
	write() {
		throw TypeError("this is a readable stream");
	}
	end() {
		throw TypeError("this is a readable stream");
	}
	[Wr]() {
		p.open(this[U], "r", (e, t) => this[Vr](e, t));
	}
	[Vr](e, t) {
		e ? this[Br](e) : (this[H] = t, this.emit("open", t), this[Kr]());
	}
	[Lr]() {
		return Buffer.allocUnsafe(Math.min(this[qr], this[Yr]));
	}
	[Kr]() {
		if (!this[Jr]) {
			this[Jr] = !0;
			let e = this[Lr]();
			if (e.length === 0) return process.nextTick(() => this[Hr](null, 0, e));
			p.read(this[H], e, 0, e.length, null, (e, t, n) => this[Hr](e, t, n));
		}
	}
	[Hr](e, t, n) {
		this[Jr] = !1, e ? this[Br](e) : this[Ir](t, n) && this[Kr]();
	}
	[V]() {
		if (this[jr] && typeof this[H] == "number") {
			let e = this[H];
			this[H] = void 0, p.close(e, (e) => e ? this.emit("error", e) : this.emit("close"));
		}
	}
	[Br](e) {
		this[Jr] = !0, this[V](), this.emit("error", e);
	}
	[Ir](e, t) {
		let n = !1;
		return this[Yr] -= e, e > 0 && (n = super.write(e < t.length ? t.subarray(0, e) : t)), (e === 0 || this[Yr] <= 0) && (n = !1, this[V](), super.end()), n;
	}
	emit(e, ...t) {
		switch (e) {
			case "prefinish":
			case "finish": return !1;
			case "drain": return typeof this[H] == "number" && this[Kr](), !1;
			case "error": return this[ei] ? !1 : (this[ei] = !0, super.emit(e, ...t));
			default: return super.emit(e, ...t);
		}
	}
}, ni = class extends ti {
	[Wr]() {
		let e = !0;
		try {
			this[Vr](null, p.openSync(this[U], "r")), e = !1;
		} finally {
			e && this[V]();
		}
	}
	[Kr]() {
		let e = !0;
		try {
			if (!this[Jr]) {
				this[Jr] = !0;
				do {
					let e = this[Lr](), t = e.length === 0 ? 0 : p.readSync(this[H], e, 0, e.length, null);
					if (!this[Ir](t, e)) break;
				} while (!0);
				this[Jr] = !1;
			}
			e = !1;
		} finally {
			e && this[V]();
		}
	}
	[V]() {
		if (this[jr] && typeof this[H] == "number") {
			let e = this[H];
			this[H] = void 0, p.closeSync(e), this.emit("close");
		}
	}
}, ri = class extends be {
	readable = !1;
	writable = !0;
	[ei] = !1;
	[Qr] = !1;
	[Mr] = !1;
	[W] = [];
	[zr] = !1;
	[U];
	[Rr];
	[jr];
	[H];
	[$r];
	[Pr];
	[Nr] = !1;
	[Gr];
	constructor(e, t) {
		t ||= {}, super(t), this[U] = e, this[H] = typeof t.fd == "number" ? t.fd : void 0, this[Rr] = t.mode === void 0 ? 438 : t.mode, this[Gr] = typeof t.start == "number" ? t.start : void 0, this[jr] = typeof t.autoClose == "boolean" ? t.autoClose : !0;
		let n = this[Gr] === void 0 ? "w" : "r+";
		this[$r] = t.flags === void 0, this[Pr] = t.flags === void 0 ? n : t.flags, this[H] === void 0 && this[Wr]();
	}
	emit(e, ...t) {
		if (e === "error") {
			if (this[ei]) return !1;
			this[ei] = !0;
		}
		return super.emit(e, ...t);
	}
	get fd() {
		return this[H];
	}
	get path() {
		return this[U];
	}
	[Br](e) {
		this[V](), this[Qr] = !0, this.emit("error", e);
	}
	[Wr]() {
		p.open(this[U], this[Pr], this[Rr], (e, t) => this[Vr](e, t));
	}
	[Vr](e, t) {
		this[$r] && this[Pr] === "r+" && e && e.code === "ENOENT" ? (this[Pr] = "w", this[Wr]()) : e ? this[Br](e) : (this[H] = t, this.emit("open", t), this[Qr] || this[Fr]());
	}
	end(e, t) {
		return e && this.write(e, t), this[Mr] = !0, !this[Qr] && !this[W].length && typeof this[H] == "number" && this[Ur](null, 0), this;
	}
	write(e, t) {
		return typeof e == "string" && (e = Buffer.from(e, t)), this[Mr] ? (this.emit("error", /* @__PURE__ */ Error("write() after end()")), !1) : this[H] === void 0 || this[Qr] || this[W].length ? (this[W].push(e), this[zr] = !0, !1) : (this[Qr] = !0, this[Zr](e), !0);
	}
	[Zr](e) {
		p.write(this[H], e, 0, e.length, this[Gr], (e, t) => this[Ur](e, t));
	}
	[Ur](e, t) {
		e ? this[Br](e) : (this[Gr] !== void 0 && typeof t == "number" && (this[Gr] += t), this[W].length ? this[Fr]() : (this[Qr] = !1, this[Mr] && !this[Nr] ? (this[Nr] = !0, this[V](), this.emit("finish")) : this[zr] && (this[zr] = !1, this.emit("drain"))));
	}
	[Fr]() {
		if (this[W].length === 0) this[Mr] && this[Ur](null, 0);
		else if (this[W].length === 1) this[Zr](this[W].pop());
		else {
			let e = this[W];
			this[W] = [], Ar(this[H], e, this[Gr], (e, t) => this[Ur](e, t));
		}
	}
	[V]() {
		if (this[jr] && typeof this[H] == "number") {
			let e = this[H];
			this[H] = void 0, p.close(e, (e) => e ? this.emit("error", e) : this.emit("close"));
		}
	}
}, ii = class extends ri {
	[Wr]() {
		let e;
		if (this[$r] && this[Pr] === "r+") try {
			e = p.openSync(this[U], this[Pr], this[Rr]);
		} catch (e) {
			if (e?.code === "ENOENT") return this[Pr] = "w", this[Wr]();
			throw e;
		}
		else e = p.openSync(this[U], this[Pr], this[Rr]);
		this[Vr](null, e);
	}
	[V]() {
		if (this[jr] && typeof this[H] == "number") {
			let e = this[H];
			this[H] = void 0, p.closeSync(e), this.emit("close");
		}
	}
	[Zr](e) {
		let t = !0;
		try {
			this[Ur](null, p.writeSync(this[H], e, 0, e.length, this[Gr])), t = !1;
		} finally {
			if (t) try {
				this[V]();
			} catch {}
		}
	}
}, ai = new Map([
	["C", "cwd"],
	["f", "file"],
	["z", "gzip"],
	["P", "preservePaths"],
	["U", "unlink"],
	["strip-components", "strip"],
	["stripComponents", "strip"],
	["keep-newer", "newer"],
	["keepNewer", "newer"],
	["keep-newer-files", "newer"],
	["keepNewerFiles", "newer"],
	["k", "keep"],
	["keep-existing", "keep"],
	["keepExisting", "keep"],
	["m", "noMtime"],
	["no-mtime", "noMtime"],
	["p", "preserveOwner"],
	["L", "follow"],
	["h", "follow"],
	["onentry", "onReadEntry"]
]), oi = (e) => !!e.sync && !!e.file, si = (e) => !e.sync && !!e.file, ci = (e) => !!e.sync && !e.file, li = (e) => !e.sync && !e.file, ui = (e) => !!e.file, di = (e) => ai.get(e) || e, fi = (e = {}) => {
	if (!e) return {};
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		let e = di(n);
		t[e] = r;
	}
	return t.chmod === void 0 && t.noChmod === !1 && (t.chmod = !0), delete t.noChmod, t;
}, pi = (e, t, n, r, i) => Object.assign((a = [], o, s) => {
	Array.isArray(a) && (o = a, a = {}), typeof o == "function" && (s = o, o = void 0), o = o ? Array.from(o) : [];
	let c = fi(a);
	if (i?.(c, o), oi(c)) {
		if (typeof s == "function") throw TypeError("callback not supported for sync tar functions");
		return e(c, o);
	} else if (si(c)) {
		let e = t(c, o);
		return s ? e.then(() => s(), s) : e;
	} else if (ci(c)) {
		if (typeof s == "function") throw TypeError("callback not supported for sync tar functions");
		return n(c, o);
	} else if (li(c)) {
		if (typeof s == "function") throw TypeError("callback only supported with file option");
		return r(c, o);
	}
	throw Error("impossible options??");
}, {
	syncFile: e,
	asyncFile: t,
	syncNoFile: n,
	asyncNoFile: r,
	validate: i
}), mi = De.constants || { ZLIB_VERNUM: 4736 }, G = Object.freeze(Object.assign(Object.create(null), {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_VERSION_ERROR: -6,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	DEFLATE: 1,
	INFLATE: 2,
	GZIP: 3,
	GUNZIP: 4,
	DEFLATERAW: 5,
	INFLATERAW: 6,
	UNZIP: 7,
	BROTLI_DECODE: 8,
	BROTLI_ENCODE: 9,
	Z_MIN_WINDOWBITS: 8,
	Z_MAX_WINDOWBITS: 15,
	Z_DEFAULT_WINDOWBITS: 15,
	Z_MIN_CHUNK: 64,
	Z_MAX_CHUNK: Infinity,
	Z_DEFAULT_CHUNK: 16384,
	Z_MIN_MEMLEVEL: 1,
	Z_MAX_MEMLEVEL: 9,
	Z_DEFAULT_MEMLEVEL: 8,
	Z_MIN_LEVEL: -1,
	Z_MAX_LEVEL: 9,
	Z_DEFAULT_LEVEL: -1,
	BROTLI_OPERATION_PROCESS: 0,
	BROTLI_OPERATION_FLUSH: 1,
	BROTLI_OPERATION_FINISH: 2,
	BROTLI_OPERATION_EMIT_METADATA: 3,
	BROTLI_MODE_GENERIC: 0,
	BROTLI_MODE_TEXT: 1,
	BROTLI_MODE_FONT: 2,
	BROTLI_DEFAULT_MODE: 0,
	BROTLI_MIN_QUALITY: 0,
	BROTLI_MAX_QUALITY: 11,
	BROTLI_DEFAULT_QUALITY: 11,
	BROTLI_MIN_WINDOW_BITS: 10,
	BROTLI_MAX_WINDOW_BITS: 24,
	BROTLI_LARGE_MAX_WINDOW_BITS: 30,
	BROTLI_DEFAULT_WINDOW: 22,
	BROTLI_MIN_INPUT_BLOCK_BITS: 16,
	BROTLI_MAX_INPUT_BLOCK_BITS: 24,
	BROTLI_PARAM_MODE: 0,
	BROTLI_PARAM_QUALITY: 1,
	BROTLI_PARAM_LGWIN: 2,
	BROTLI_PARAM_LGBLOCK: 3,
	BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
	BROTLI_PARAM_SIZE_HINT: 5,
	BROTLI_PARAM_LARGE_WINDOW: 6,
	BROTLI_PARAM_NPOSTFIX: 7,
	BROTLI_PARAM_NDIRECT: 8,
	BROTLI_DECODER_RESULT_ERROR: 0,
	BROTLI_DECODER_RESULT_SUCCESS: 1,
	BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
	BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
	BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
	BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
	BROTLI_DECODER_NO_ERROR: 0,
	BROTLI_DECODER_SUCCESS: 1,
	BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
	BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
	BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
	BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
	BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
	BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
	BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
	BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
	BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
	BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
	BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
	BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
	BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
	BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
	BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
	BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
	BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
	BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
	BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
	BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
	BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
	BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
	BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
	BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
	BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
	BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
	BROTLI_DECODER_ERROR_UNREACHABLE: -31
}, mi)), hi = Te.concat, gi = Object.getOwnPropertyDescriptor(Te, "concat"), _i = (e) => e, vi = gi?.writable === !0 || gi?.set !== void 0 ? (e) => {
	Te.concat = e ? _i : hi;
} : (e) => {}, yi = Symbol("_superWrite"), bi = class extends Error {
	code;
	errno;
	constructor(e, t) {
		super("zlib: " + e.message, { cause: e }), this.code = e.code, this.errno = e.errno, this.code ||= "ZLIB_ERROR", this.message = "zlib: " + e.message, Error.captureStackTrace(this, t ?? this.constructor);
	}
	get name() {
		return "ZlibError";
	}
}, xi = Symbol("flushFlag"), Si = class extends kr {
	#e = !1;
	#t = !1;
	#n;
	#r;
	#i;
	#a;
	#o;
	get sawError() {
		return this.#e;
	}
	get handle() {
		return this.#a;
	}
	get flushFlag() {
		return this.#n;
	}
	constructor(e, t) {
		if (!e || typeof e != "object") throw TypeError("invalid options for ZlibBase constructor");
		if (super(e), this.#n = e.flush ?? 0, this.#r = e.finishFlush ?? 0, this.#i = e.fullFlushFlag ?? 0, typeof Ee[t] != "function") throw TypeError("Compression method not supported: " + t);
		try {
			this.#a = new Ee[t](e);
		} catch (e) {
			throw new bi(e, this.constructor);
		}
		this.#o = (e) => {
			this.#e || (this.#e = !0, this.close(), this.emit("error", e));
		}, this.#a?.on("error", (e) => this.#o(new bi(e))), this.once("end", () => this.close);
	}
	close() {
		this.#a && (this.#a.close(), this.#a = void 0, this.emit("close"));
	}
	reset() {
		if (!this.#e) return m(this.#a, "zlib binding closed"), this.#a.reset?.();
	}
	flush(e) {
		this.ended || (typeof e != "number" && (e = this.#i), this.write(Object.assign(Te.alloc(0), { [xi]: e })));
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), e && (t ? this.write(e, t) : this.write(e)), this.flush(this.#r), this.#t = !0, super.end(n);
	}
	get ended() {
		return this.#t;
	}
	[yi](e) {
		return super.write(e);
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = "utf8"), typeof e == "string" && (e = Te.from(e, t)), this.#e) return;
		m(this.#a, "zlib binding closed");
		let r = this.#a._handle, i = r.close;
		r.close = () => {};
		let a = this.#a.close;
		this.#a.close = () => {}, vi(!0);
		let o;
		try {
			let t = typeof e[xi] == "number" ? e[xi] : this.#n;
			o = this.#a._processChunk(e, t), vi(!1);
		} catch (e) {
			vi(!1), this.#o(new bi(e, this.write));
		} finally {
			this.#a && (this.#a._handle = r, r.close = i, this.#a.close = a, this.#a.removeAllListeners("error"));
		}
		this.#a && this.#a.on("error", (e) => this.#o(new bi(e, this.write)));
		let s;
		if (o) if (Array.isArray(o) && o.length > 0) {
			let e = o[0];
			s = this[yi](Te.from(e));
			for (let e = 1; e < o.length; e++) s = this[yi](o[e]);
		} else s = this[yi](Te.from(o));
		return n && n(), s;
	}
}, Ci = class extends Si {
	#e;
	#t;
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || G.Z_NO_FLUSH, e.finishFlush = e.finishFlush || G.Z_FINISH, e.fullFlushFlag = G.Z_FULL_FLUSH, super(e, t), this.#e = e.level, this.#t = e.strategy;
	}
	params(e, t) {
		if (!this.sawError) {
			if (!this.handle) throw Error("cannot switch params when binding is closed");
			if (!this.handle.params) throw Error("not supported in this implementation");
			if (this.#e !== e || this.#t !== t) {
				this.flush(G.Z_SYNC_FLUSH), m(this.handle, "zlib binding closed");
				let n = this.handle.flush;
				this.handle.flush = (e, t) => {
					typeof e == "function" && (t = e, e = this.flushFlag), this.flush(e), t?.();
				};
				try {
					this.handle.params(e, t);
				} finally {
					this.handle.flush = n;
				}
				this.handle && (this.#e = e, this.#t = t);
			}
		}
	}
}, wi = class extends Ci {
	#e;
	constructor(e) {
		super(e, "Gzip"), this.#e = e && !!e.portable;
	}
	[yi](e) {
		return this.#e ? (this.#e = !1, e[9] = 255, super[yi](e)) : super[yi](e);
	}
}, Ti = class extends Ci {
	constructor(e) {
		super(e, "Unzip");
	}
}, Ei = class extends Si {
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || G.BROTLI_OPERATION_PROCESS, e.finishFlush = e.finishFlush || G.BROTLI_OPERATION_FINISH, e.fullFlushFlag = G.BROTLI_OPERATION_FLUSH, super(e, t);
	}
}, Di = class extends Ei {
	constructor(e) {
		super(e, "BrotliCompress");
	}
}, Oi = class extends Ei {
	constructor(e) {
		super(e, "BrotliDecompress");
	}
}, ki = class extends Si {
	constructor(e, t) {
		e ||= {}, e.flush = e.flush || G.ZSTD_e_continue, e.finishFlush = e.finishFlush || G.ZSTD_e_end, e.fullFlushFlag = G.ZSTD_e_flush, super(e, t);
	}
}, Ai = class extends ki {
	constructor(e) {
		super(e, "ZstdCompress");
	}
}, ji = class extends ki {
	constructor(e) {
		super(e, "ZstdDecompress");
	}
}, Mi = (e, t) => {
	if (Number.isSafeInteger(e)) e < 0 ? Pi(e, t) : Ni(e, t);
	else throw Error("cannot encode number outside of javascript safe integer range");
	return t;
}, Ni = (e, t) => {
	t[0] = 128;
	for (var n = t.length; n > 1; n--) t[n - 1] = e & 255, e = Math.floor(e / 256);
}, Pi = (e, t) => {
	t[0] = 255;
	var n = !1;
	e *= -1;
	for (var r = t.length; r > 1; r--) {
		var i = e & 255;
		e = Math.floor(e / 256), n ? t[r - 1] = Ri(i) : i === 0 ? t[r - 1] = 0 : (n = !0, t[r - 1] = zi(i));
	}
}, Fi = (e) => {
	let t = e[0], n = t === 128 ? Li(e.subarray(1, e.length)) : t === 255 ? Ii(e) : null;
	if (n === null) throw Error("invalid base256 encoding");
	if (!Number.isSafeInteger(n)) throw Error("parsed number outside of javascript safe integer range");
	return n;
}, Ii = (e) => {
	for (var t = e.length, n = 0, r = !1, i = t - 1; i > -1; i--) {
		var a = Number(e[i]), o;
		r ? o = Ri(a) : a === 0 ? o = a : (r = !0, o = zi(a)), o !== 0 && (n -= o * 256 ** (t - i - 1));
	}
	return n;
}, Li = (e) => {
	for (var t = e.length, n = 0, r = t - 1; r > -1; r--) {
		var i = Number(e[r]);
		i !== 0 && (n += i * 256 ** (t - r - 1));
	}
	return n;
}, Ri = (e) => (255 ^ e) & 255, zi = (e) => (255 ^ e) + 1 & 255;
qn({}, {
	code: () => Ui,
	isCode: () => Bi,
	isName: () => Vi,
	name: () => Hi
});
var Bi = (e) => Hi.has(e), Vi = (e) => Ui.has(e), Hi = new Map([
	["0", "File"],
	["", "OldFile"],
	["1", "Link"],
	["2", "SymbolicLink"],
	["3", "CharacterDevice"],
	["4", "BlockDevice"],
	["5", "Directory"],
	["6", "FIFO"],
	["7", "ContiguousFile"],
	["g", "GlobalExtendedHeader"],
	["x", "ExtendedHeader"],
	["A", "SolarisACL"],
	["D", "GNUDumpDir"],
	["I", "Inode"],
	["K", "NextFileHasLongLinkpath"],
	["L", "NextFileHasLongPath"],
	["M", "ContinuationFile"],
	["N", "OldGnuLongPath"],
	["S", "SparseFile"],
	["V", "TapeVolumeHeader"],
	["X", "OldExtendedHeader"]
]), Ui = new Map(Array.from(Hi).map((e) => [e[1], e[0]])), Wi = class {
	cksumValid = !1;
	needPax = !1;
	nullBlock = !1;
	block;
	path;
	mode;
	uid;
	gid;
	size;
	cksum;
	#e = "Unsupported";
	linkpath;
	uname;
	gname;
	devmaj = 0;
	devmin = 0;
	atime;
	ctime;
	mtime;
	charset;
	comment;
	constructor(e, t = 0, n, r) {
		Buffer.isBuffer(e) ? this.decode(e, t || 0, n, r) : e && this.#t(e);
	}
	decode(e, t, n, r) {
		if (t ||= 0, !e || !(e.length >= t + 512)) throw Error("need 512 bytes for header");
		this.path = n?.path ?? Ki(e, t, 100), this.mode = n?.mode ?? r?.mode ?? Yi(e, t + 100, 8), this.uid = n?.uid ?? r?.uid ?? Yi(e, t + 108, 8), this.gid = n?.gid ?? r?.gid ?? Yi(e, t + 116, 8), this.size = n?.size ?? r?.size ?? Yi(e, t + 124, 12), this.mtime = n?.mtime ?? r?.mtime ?? qi(e, t + 136, 12), this.cksum = Yi(e, t + 148, 12), r && this.#t(r, !0), n && this.#t(n);
		let i = Ki(e, t + 156, 1);
		if (Bi(i) && (this.#e = i || "0"), this.#e === "0" && this.path.slice(-1) === "/" && (this.#e = "5"), this.#e === "5" && (this.size = 0), this.linkpath = Ki(e, t + 157, 100), e.subarray(t + 257, t + 265).toString() === "ustar\x0000") if (this.uname = n?.uname ?? r?.uname ?? Ki(e, t + 265, 32), this.gname = n?.gname ?? r?.gname ?? Ki(e, t + 297, 32), this.devmaj = n?.devmaj ?? r?.devmaj ?? Yi(e, t + 329, 8) ?? 0, this.devmin = n?.devmin ?? r?.devmin ?? Yi(e, t + 337, 8) ?? 0, e[t + 475] !== 0) this.path = Ki(e, t + 345, 155) + "/" + this.path;
		else {
			let i = Ki(e, t + 345, 130);
			i && (this.path = i + "/" + this.path), this.atime = n?.atime ?? r?.atime ?? qi(e, t + 476, 12), this.ctime = n?.ctime ?? r?.ctime ?? qi(e, t + 488, 12);
		}
		let a = 256;
		for (let n = t; n < t + 148; n++) a += e[n];
		for (let n = t + 156; n < t + 512; n++) a += e[n];
		this.cksumValid = a === this.cksum, this.cksum === void 0 && a === 256 && (this.nullBlock = !0);
	}
	#t(e, t = !1) {
		Object.assign(this, Object.fromEntries(Object.entries(e).filter(([e, n]) => !(n == null || e === "path" && t || e === "linkpath" && t || e === "global"))));
	}
	encode(e, t = 0) {
		if (e ||= this.block = Buffer.alloc(512), this.#e === "Unsupported" && (this.#e = "0"), !(e.length >= t + 512)) throw Error("need 512 bytes for header");
		let n = this.ctime || this.atime ? 130 : 155, r = Gi(this.path || "", n), i = r[0], a = r[1];
		this.needPax = !!r[2], this.needPax = aa(e, t, 100, i) || this.needPax, this.needPax = $i(e, t + 100, 8, this.mode) || this.needPax, this.needPax = $i(e, t + 108, 8, this.uid) || this.needPax, this.needPax = $i(e, t + 116, 8, this.gid) || this.needPax, this.needPax = $i(e, t + 124, 12, this.size) || this.needPax, this.needPax = ra(e, t + 136, 12, this.mtime) || this.needPax, e[t + 156] = Number(this.#e.codePointAt(0)), this.needPax = aa(e, t + 157, 100, this.linkpath) || this.needPax, e.write("ustar\x0000", t + 257, 8), this.needPax = aa(e, t + 265, 32, this.uname) || this.needPax, this.needPax = aa(e, t + 297, 32, this.gname) || this.needPax, this.needPax = $i(e, t + 329, 8, this.devmaj) || this.needPax, this.needPax = $i(e, t + 337, 8, this.devmin) || this.needPax, this.needPax = aa(e, t + 345, n, a) || this.needPax, e[t + 475] === 0 ? (this.needPax = aa(e, t + 345, 130, a) || this.needPax, this.needPax = ra(e, t + 476, 12, this.atime) || this.needPax, this.needPax = ra(e, t + 488, 12, this.ctime) || this.needPax) : this.needPax = aa(e, t + 345, 155, a) || this.needPax;
		let o = 256;
		for (let n = t; n < t + 148; n++) o += e[n];
		for (let n = t + 156; n < t + 512; n++) o += e[n];
		return this.cksum = o, $i(e, t + 148, 8, this.cksum), this.cksumValid = !0, this.needPax;
	}
	get type() {
		return this.#e === "Unsupported" ? this.#e : Hi.get(this.#e);
	}
	get typeKey() {
		return this.#e;
	}
	set type(e) {
		let t = String(Ui.get(e));
		if (Bi(t) || t === "Unsupported") this.#e = t;
		else if (Bi(e)) this.#e = e;
		else throw TypeError("invalid entry type: " + e);
	}
}, Gi = (e, t) => {
	let n = e, r = "", i, a = d.parse(e).root || ".";
	if (Buffer.byteLength(n) < 100) i = [
		n,
		r,
		!1
	];
	else {
		r = d.dirname(n), n = d.basename(n);
		do
			Buffer.byteLength(n) <= 100 && Buffer.byteLength(r) <= t ? i = [
				n,
				r,
				!1
			] : Buffer.byteLength(n) > 100 && Buffer.byteLength(r) <= t ? i = [
				n.slice(0, 99),
				r,
				!0
			] : (n = d.join(d.basename(r), n), r = d.dirname(r));
		while (r !== a && i === void 0);
		i ||= [
			e.slice(0, 99),
			"",
			!0
		];
	}
	return i;
}, Ki = (e, t, n) => e.subarray(t, t + n).toString("utf8").replace(/\0.*/, ""), qi = (e, t, n) => Ji(Yi(e, t, n)), Ji = (e) => e === void 0 ? void 0 : /* @__PURE__ */ new Date(e * 1e3), Yi = (e, t, n) => Number(e[t]) & 128 ? Fi(e.subarray(t, t + n)) : Zi(e, t, n), Xi = (e) => isNaN(e) ? void 0 : e, Zi = (e, t, n) => Xi(parseInt(e.subarray(t, t + n).toString("utf8").replace(/\0.*$/, "").trim(), 8)), Qi = {
	12: 8589934591,
	8: 2097151
}, $i = (e, t, n, r) => r === void 0 ? !1 : r > Qi[n] || r < 0 ? (Mi(r, e.subarray(t, t + n)), !0) : (ea(e, t, n, r), !1), ea = (e, t, n, r) => e.write(ta(r, n), t, n, "ascii"), ta = (e, t) => na(Math.floor(e).toString(8), t), na = (e, t) => (e.length === t - 1 ? e : Array(t - e.length - 1).join("0") + e + " ") + "\0", ra = (e, t, n, r) => r === void 0 ? !1 : $i(e, t, n, r.getTime() / 1e3), ia = Array(156).join("\0"), aa = (e, t, n, r) => r === void 0 ? !1 : (e.write(r + ia, t, n, "utf8"), r.length !== Buffer.byteLength(r) || r.length > n), oa = class e {
	atime;
	mtime;
	ctime;
	charset;
	comment;
	gid;
	uid;
	gname;
	uname;
	linkpath;
	dev;
	ino;
	nlink;
	path;
	size;
	mode;
	global;
	constructor(e, t = !1) {
		this.atime = e.atime, this.charset = e.charset, this.comment = e.comment, this.ctime = e.ctime, this.dev = e.dev, this.gid = e.gid, this.global = t, this.gname = e.gname, this.ino = e.ino, this.linkpath = e.linkpath, this.mtime = e.mtime, this.nlink = e.nlink, this.path = e.path, this.size = e.size, this.uid = e.uid, this.uname = e.uname;
	}
	encode() {
		let e = this.encodeBody();
		if (e === "") return Buffer.allocUnsafe(0);
		let t = Buffer.byteLength(e), n = 512 * Math.ceil(1 + t / 512), r = Buffer.allocUnsafe(n);
		for (let e = 0; e < 512; e++) r[e] = 0;
		new Wi({
			path: ("PaxHeader/" + a(this.path ?? "")).slice(0, 99),
			mode: this.mode || 420,
			uid: this.uid,
			gid: this.gid,
			size: t,
			mtime: this.mtime,
			type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
			linkpath: "",
			uname: this.uname || "",
			gname: this.gname || "",
			devmaj: 0,
			devmin: 0,
			atime: this.atime,
			ctime: this.ctime
		}).encode(r), r.write(e, 512, t, "utf8");
		for (let e = t + 512; e < r.length; e++) r[e] = 0;
		return r;
	}
	encodeBody() {
		return this.encodeField("path") + this.encodeField("ctime") + this.encodeField("atime") + this.encodeField("dev") + this.encodeField("ino") + this.encodeField("nlink") + this.encodeField("charset") + this.encodeField("comment") + this.encodeField("gid") + this.encodeField("gname") + this.encodeField("linkpath") + this.encodeField("mtime") + this.encodeField("size") + this.encodeField("uid") + this.encodeField("uname");
	}
	encodeField(e) {
		if (this[e] === void 0) return "";
		let t = this[e], n = t instanceof Date ? t.getTime() / 1e3 : t, r = " " + (e === "dev" || e === "ino" || e === "nlink" ? "SCHILY." : "") + e + "=" + n + "\n", i = Buffer.byteLength(r), a = Math.floor(Math.log(i) / Math.log(10)) + 1;
		return i + a >= 10 ** a && (a += 1), a + i + r;
	}
	static parse(t, n, r = !1) {
		return new e(sa(ca(t), n), r);
	}
}, sa = (e, t) => t ? Object.assign({}, t, e) : e, ca = (e) => e.replace(/\n$/, "").split("\n").reduce(la, Object.create(null)), la = (e, t) => {
	let n = parseInt(t, 10);
	if (n !== Buffer.byteLength(t) + 1) return e;
	t = t.slice((n + " ").length);
	let r = t.split("="), i = r.shift();
	if (!i) return e;
	let a = i.replace(/^SCHILY\.(dev|ino|nlink)/, "$1"), o = r.join("=");
	return e[a] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(a) ? /* @__PURE__ */ new Date(Number(o) * 1e3) : /^[0-9]+$/.test(o) ? +o : o, e;
}, K = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32" ? (e) => e && e.replaceAll(/\\/g, "/") : (e) => e, ua = class extends kr {
	extended;
	globalExtended;
	header;
	startBlockSize;
	blockRemain;
	remain;
	type;
	meta = !1;
	ignore = !1;
	path;
	mode;
	uid;
	gid;
	uname;
	gname;
	size = 0;
	mtime;
	atime;
	ctime;
	linkpath;
	dev;
	ino;
	nlink;
	invalid = !1;
	absolute;
	unsupported = !1;
	constructor(e, t, n) {
		switch (super({}), this.pause(), this.extended = t, this.globalExtended = n, this.header = e, this.remain = e.size ?? 0, this.startBlockSize = 512 * Math.ceil(this.remain / 512), this.blockRemain = this.startBlockSize, this.type = e.type, this.type) {
			case "File":
			case "OldFile":
			case "Link":
			case "SymbolicLink":
			case "CharacterDevice":
			case "BlockDevice":
			case "Directory":
			case "FIFO":
			case "ContiguousFile":
			case "GNUDumpDir": break;
			case "NextFileHasLongLinkpath":
			case "NextFileHasLongPath":
			case "OldGnuLongPath":
			case "GlobalExtendedHeader":
			case "ExtendedHeader":
			case "OldExtendedHeader":
				this.meta = !0;
				break;
			default: this.ignore = !0;
		}
		if (!e.path) throw Error("no path provided for tar.ReadEntry");
		this.path = K(e.path), this.mode = e.mode, this.mode && (this.mode &= 4095), this.uid = e.uid, this.gid = e.gid, this.uname = e.uname, this.gname = e.gname, this.size = this.remain, this.mtime = e.mtime, this.atime = e.atime, this.ctime = e.ctime, this.linkpath = e.linkpath ? K(e.linkpath) : void 0, this.uname = e.uname, this.gname = e.gname, t && this.#e(t), n && this.#e(n, !0);
	}
	write(e) {
		let t = e.length;
		if (t > this.blockRemain) throw Error("writing more to entry than is appropriate");
		let n = this.remain, r = this.blockRemain;
		return this.remain = Math.max(0, n - t), this.blockRemain = Math.max(0, r - t), this.ignore ? !0 : n >= t ? super.write(e) : super.write(e.subarray(0, n));
	}
	#e(e, t = !1) {
		e.path &&= K(e.path), e.linkpath &&= K(e.linkpath), Object.assign(this, Object.fromEntries(Object.entries(e).filter(([e, n]) => !(n == null || e === "path" && t))));
	}
}, da = (e, t, n, r = {}) => {
	e.file && (r.file = e.file), e.cwd && (r.cwd = e.cwd), r.code = n instanceof Error && n.code || t, r.tarCode = t, !e.strict && r.recoverable !== !1 ? (n instanceof Error && (r = Object.assign(n, r), n = n.message), e.emit("warn", t, n, r)) : n instanceof Error ? e.emit("error", Object.assign(n, r)) : e.emit("error", Object.assign(/* @__PURE__ */ Error(`${t}: ${n}`), r));
}, fa = 1024 * 1024, pa = Buffer.from([31, 139]), ma = Buffer.from([
	40,
	181,
	47,
	253
]), ha = Math.max(pa.length, ma.length), q = Symbol("state"), ga = Symbol("writeEntry"), _a = Symbol("readEntry"), va = Symbol("nextEntry"), ya = Symbol("processEntry"), ba = Symbol("extendedHeader"), xa = Symbol("globalExtendedHeader"), Sa = Symbol("meta"), Ca = Symbol("emitMeta"), J = Symbol("buffer"), wa = Symbol("queue"), Ta = Symbol("ended"), Ea = Symbol("emittedEnd"), Da = Symbol("emit"), Y = Symbol("unzip"), Oa = Symbol("consumeChunk"), ka = Symbol("consumeChunkSub"), Aa = Symbol("consumeBody"), ja = Symbol("consumeMeta"), Ma = Symbol("consumeHeader"), Na = Symbol("consuming"), Pa = Symbol("bufferConcat"), Fa = Symbol("maybeEnd"), Ia = Symbol("writing"), La = Symbol("aborted"), Ra = Symbol("onDone"), za = Symbol("sawValidEntry"), Ba = Symbol("sawNullBlock"), Va = Symbol("sawEOF"), Ha = Symbol("closeStream"), Ua = () => !0, Wa = class extends xe {
	file;
	strict;
	maxMetaEntrySize;
	filter;
	brotli;
	zstd;
	writable = !0;
	readable = !1;
	[wa] = [];
	[J];
	[_a];
	[ga];
	[q] = "begin";
	[Sa] = "";
	[ba];
	[xa];
	[Ta] = !1;
	[Y];
	[La] = !1;
	[za];
	[Ba] = !1;
	[Va] = !1;
	[Ia] = !1;
	[Na] = !1;
	[Ea] = !1;
	constructor(e = {}) {
		super(), this.file = e.file || "", this.on(Ra, () => {
			(this[q] === "begin" || this[za] === !1) && this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
		}), e.ondone ? this.on(Ra, e.ondone) : this.on(Ra, () => {
			this.emit("prefinish"), this.emit("finish"), this.emit("end");
		}), this.strict = !!e.strict, this.maxMetaEntrySize = e.maxMetaEntrySize || fa, this.filter = typeof e.filter == "function" ? e.filter : Ua;
		let t = e.file && (e.file.endsWith(".tar.br") || e.file.endsWith(".tbr"));
		this.brotli = !(e.gzip || e.zstd) && e.brotli !== void 0 ? e.brotli : t ? void 0 : !1;
		let n = e.file && (e.file.endsWith(".tar.zst") || e.file.endsWith(".tzst"));
		this.zstd = !(e.gzip || e.brotli) && e.zstd !== void 0 ? e.zstd : n ? !0 : void 0, this.on("end", () => this[Ha]()), typeof e.onwarn == "function" && this.on("warn", e.onwarn), typeof e.onReadEntry == "function" && this.on("entry", e.onReadEntry);
	}
	warn(e, t, n = {}) {
		da(this, e, t, n);
	}
	[Ma](e, t) {
		this[za] === void 0 && (this[za] = !1);
		let n;
		try {
			n = new Wi(e, t, this[ba], this[xa]);
		} catch (e) {
			return this.warn("TAR_ENTRY_INVALID", e);
		}
		if (n.nullBlock) this[Ba] ? (this[Va] = !0, this[q] === "begin" && (this[q] = "header"), this[Da]("eof")) : (this[Ba] = !0, this[Da]("nullBlock"));
		else if (this[Ba] = !1, !n.cksumValid) this.warn("TAR_ENTRY_INVALID", "checksum failure", { header: n });
		else if (!n.path) this.warn("TAR_ENTRY_INVALID", "path is required", { header: n });
		else {
			let e = n.type;
			if (/^(Symbolic)?Link$/.test(e) && !n.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath required", { header: n });
			else if (!/^(Symbolic)?Link$/.test(e) && !/^(Global)?ExtendedHeader$/.test(e) && n.linkpath) this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header: n });
			else {
				let e = this[ga] = new ua(n, this[ba], this[xa]);
				this[za] || (e.remain ? e.on("end", () => {
					e.invalid || (this[za] = !0);
				}) : this[za] = !0), e.meta ? e.size > this.maxMetaEntrySize ? (e.ignore = !0, this[Da]("ignoredEntry", e), this[q] = "ignore", e.resume()) : e.size > 0 && (this[Sa] = "", e.on("data", (e) => this[Sa] += e), this[q] = "meta") : (this[ba] = void 0, e.ignore = e.ignore || !this.filter(e.path, e), e.ignore ? (this[Da]("ignoredEntry", e), this[q] = e.remain ? "ignore" : "header", e.resume()) : (e.remain ? this[q] = "body" : (this[q] = "header", e.end()), this[_a] ? this[wa].push(e) : (this[wa].push(e), this[va]())));
			}
		}
	}
	[Ha]() {
		queueMicrotask(() => this.emit("close"));
	}
	[ya](e) {
		let t = !0;
		if (!e) this[_a] = void 0, t = !1;
		else if (Array.isArray(e)) {
			let [t, ...n] = e;
			this.emit(t, ...n);
		} else this[_a] = e, this.emit("entry", e), e.emittedEnd || (e.on("end", () => this[va]()), t = !1);
		return t;
	}
	[va]() {
		do		;
while (this[ya](this[wa].shift()));
		if (this[wa].length === 0) {
			let e = this[_a];
			!e || e.flowing || e.size === e.remain ? this[Ia] || this.emit("drain") : e.once("drain", () => this.emit("drain"));
		}
	}
	[Aa](e, t) {
		let n = this[ga];
		if (!n) throw Error("attempt to consume body without entry??");
		let r = n.blockRemain ?? 0, i = r >= e.length && t === 0 ? e : e.subarray(t, t + r);
		return n.write(i), n.blockRemain || (this[q] = "header", this[ga] = void 0, n.end()), i.length;
	}
	[ja](e, t) {
		let n = this[ga], r = this[Aa](e, t);
		return !this[ga] && n && this[Ca](n), r;
	}
	[Da](e, t, n) {
		this[wa].length === 0 && !this[_a] ? this.emit(e, t, n) : this[wa].push([
			e,
			t,
			n
		]);
	}
	[Ca](e) {
		switch (this[Da]("meta", this[Sa]), e.type) {
			case "ExtendedHeader":
			case "OldExtendedHeader":
				this[ba] = oa.parse(this[Sa], this[ba], !1);
				break;
			case "GlobalExtendedHeader":
				this[xa] = oa.parse(this[Sa], this[xa], !0);
				break;
			case "NextFileHasLongPath":
			case "OldGnuLongPath": {
				let e = this[ba] ?? Object.create(null);
				this[ba] = e, e.path = this[Sa].replace(/\0.*/, "");
				break;
			}
			case "NextFileHasLongLinkpath": {
				let e = this[ba] || Object.create(null);
				this[ba] = e, e.linkpath = this[Sa].replace(/\0.*/, "");
				break;
			}
			default: throw Error("unknown meta: " + e.type);
		}
	}
	abort(e) {
		this[La] = !0, this.emit("abort", e), this.warn("TAR_ABORT", e, { recoverable: !1 });
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8")), this[La]) return n?.(), !1;
		if ((this[Y] === void 0 || this.brotli === void 0 && this[Y] === !1) && e) {
			if (this[J] && (e = Buffer.concat([this[J], e]), this[J] = void 0), e.length < ha) return this[J] = e, n?.(), !0;
			for (let t = 0; this[Y] === void 0 && t < pa.length; t++) e[t] !== pa[t] && (this[Y] = !1);
			let t = !1;
			if (this[Y] === !1 && this.zstd !== !1) {
				t = !0;
				for (let n = 0; n < ma.length; n++) if (e[n] !== ma[n]) {
					t = !1;
					break;
				}
			}
			let r = this.brotli === void 0 && !t;
			if (this[Y] === !1 && r) if (e.length < 512) if (this[Ta]) this.brotli = !0;
			else return this[J] = e, n?.(), !0;
			else try {
				new Wi(e.subarray(0, 512)), this.brotli = !1;
			} catch {
				this.brotli = !0;
			}
			if (this[Y] === void 0 || this[Y] === !1 && (this.brotli || t)) {
				let r = this[Ta];
				this[Ta] = !1, this[Y] = this[Y] === void 0 ? new Ti({}) : t ? new ji({}) : new Oi({}), this[Y].on("data", (e) => this[Oa](e)), this[Y].on("error", (e) => this.abort(e)), this[Y].on("end", () => {
					this[Ta] = !0, this[Oa]();
				}), this[Ia] = !0;
				let i = !!this[Y][r ? "end" : "write"](e);
				return this[Ia] = !1, n?.(), i;
			}
		}
		this[Ia] = !0, this[Y] ? this[Y].write(e) : this[Oa](e), this[Ia] = !1;
		let r = this[wa].length > 0 ? !1 : this[_a] ? this[_a].flowing : !0;
		return !r && this[wa].length === 0 && this[_a]?.once("drain", () => this.emit("drain")), n?.(), r;
	}
	[Pa](e) {
		e && !this[La] && (this[J] = this[J] ? Buffer.concat([this[J], e]) : e);
	}
	[Fa]() {
		if (this[Ta] && !this[Ea] && !this[La] && !this[Na]) {
			this[Ea] = !0;
			let e = this[ga];
			if (e && e.blockRemain) {
				let t = this[J] ? this[J].length : 0;
				this.warn("TAR_BAD_ARCHIVE", `Truncated input (needed ${e.blockRemain} more bytes, only ${t} available)`, { entry: e }), this[J] && e.write(this[J]), e.end();
			}
			this[Da](Ra);
		}
	}
	[Oa](e) {
		if (this[Na] && e) this[Pa](e);
		else if (!e && !this[J]) this[Fa]();
		else if (e) {
			if (this[Na] = !0, this[J]) {
				this[Pa](e);
				let t = this[J];
				this[J] = void 0, this[ka](t);
			} else this[ka](e);
			for (; this[J] && this[J]?.length >= 512 && !this[La] && !this[Va];) {
				let e = this[J];
				this[J] = void 0, this[ka](e);
			}
			this[Na] = !1;
		}
		(!this[J] || this[Ta]) && this[Fa]();
	}
	[ka](e) {
		let t = 0, n = e.length;
		for (; t + 512 <= n && !this[La] && !this[Va];) switch (this[q]) {
			case "begin":
			case "header":
				this[Ma](e, t), t += 512;
				break;
			case "ignore":
			case "body":
				t += this[Aa](e, t);
				break;
			case "meta":
				t += this[ja](e, t);
				break;
			default: throw Error("invalid state: " + this[q]);
		}
		t < n && (this[J] = this[J] ? Buffer.concat([e.subarray(t), this[J]]) : e.subarray(t));
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, t)), n && this.once("finish", n), this[La] || (this[Y] ? (e && this[Y].write(e), this[Y].end()) : (this[Ta] = !0, (this.brotli === void 0 || this.zstd === void 0) && (e ||= Buffer.alloc(0)), e && this.write(e), this[Fa]())), this;
	}
}, Ga = (e) => {
	let t = e.length - 1, n = -1;
	for (; t > -1 && e.charAt(t) === "/";) n = t, t--;
	return n === -1 ? e : e.slice(0, n);
}, Ka = (e) => {
	let t = e.onReadEntry;
	e.onReadEntry = t ? (e) => {
		t(e), e.resume();
	} : (e) => e.resume();
}, qa = (e, t) => {
	let n = new Map(t.map((e) => [Ga(e), !0])), r = e.filter, i = (e, t = "") => {
		let r = t || ee(e).root || ".", a;
		if (e === r) a = !1;
		else {
			let t = n.get(e);
			a = t === void 0 ? i(g(e), r) : t;
		}
		return n.set(e, a), a;
	};
	e.filter = r ? (e, t) => r(e, t) && i(Ga(e)) : (e) => i(Ga(e));
}, Ja = pi((e) => {
	let t = new Wa(e), n = e.file, r;
	try {
		r = y.openSync(n, "r");
		let i = y.fstatSync(r), a = e.maxReadSize || 16 * 1024 * 1024;
		if (i.size < a) {
			let e = Buffer.allocUnsafe(i.size), n = y.readSync(r, e, 0, i.size, 0);
			t.end(n === e.byteLength ? e : e.subarray(0, n));
		} else {
			let e = 0, n = Buffer.allocUnsafe(a);
			for (; e < i.size;) {
				let i = y.readSync(r, n, 0, a, e);
				if (i === 0) break;
				e += i, t.write(n.subarray(0, i));
			}
			t.end();
		}
	} finally {
		if (typeof r == "number") try {
			y.closeSync(r);
		} catch {}
	}
}, (e, t) => {
	let n = new Wa(e), r = e.maxReadSize || 16 * 1024 * 1024, i = e.file;
	return new Promise((e, t) => {
		n.on("error", t), n.on("end", e), y.stat(i, (e, a) => {
			if (e) t(e);
			else {
				let e = new ti(i, {
					readSize: r,
					size: a.size
				});
				e.on("error", t), e.pipe(n);
			}
		});
	});
}, (e) => new Wa(e), (e) => new Wa(e), (e, t) => {
	t?.length && qa(e, t), e.noResume || Ka(e);
}), Ya = (e, t, n) => (e &= 4095, n && (e = (e | 384) & -19), t && (e & 256 && (e |= 64), e & 32 && (e |= 8), e & 4 && (e |= 1)), e), { isAbsolute: Xa, parse: Za } = f, Qa = (e) => {
	let t = "", n = Za(e);
	for (; Xa(e) || n.root;) {
		let r = e.charAt(0) === "/" && e.slice(0, 4) !== "//?/" ? "/" : n.root;
		e = e.slice(r.length), t += r, n = Za(e);
	}
	return [t, e];
}, $a = [
	"|",
	"<",
	">",
	"?",
	":"
], eo = $a.map((e) => String.fromCodePoint(61440 + Number(e.codePointAt(0)))), to = new Map($a.map((e, t) => [e, eo[t]])), no = new Map(eo.map((e, t) => [e, $a[t]])), ro = (e) => $a.reduce((e, t) => e.split(t).join(to.get(t)), e), io = (e) => eo.reduce((e, t) => e.split(t).join(no.get(t)), e), ao = (e, t) => t ? (e = K(e).replace(/^\.(\/|$)/, ""), Ga(t) + "/" + e) : K(e), oo = 16 * 1024 * 1024, so = Symbol("process"), co = Symbol("file"), lo = Symbol("directory"), uo = Symbol("symlink"), fo = Symbol("hardlink"), po = Symbol("header"), mo = Symbol("read"), ho = Symbol("lstat"), go = Symbol("onlstat"), _o = Symbol("onread"), vo = Symbol("onreadlink"), yo = Symbol("openfile"), bo = Symbol("onopenfile"), xo = Symbol("close"), So = Symbol("mode"), Co = Symbol("awaitDrain"), wo = Symbol("ondrain"), To = Symbol("prefix"), Eo = class extends kr {
	path;
	portable;
	myuid = process.getuid && process.getuid() || 0;
	myuser = process.env.USER || "";
	maxReadSize;
	linkCache;
	statCache;
	preservePaths;
	cwd;
	strict;
	mtime;
	noPax;
	noMtime;
	prefix;
	fd;
	blockLen = 0;
	blockRemain = 0;
	buf;
	pos = 0;
	remain = 0;
	length = 0;
	offset = 0;
	win32;
	absolute;
	header;
	type;
	linkpath;
	stat;
	onWriteEntry;
	#e = !1;
	constructor(e, t = {}) {
		let n = fi(t);
		super(), this.path = K(e), this.portable = !!n.portable, this.maxReadSize = n.maxReadSize || oo, this.linkCache = n.linkCache || /* @__PURE__ */ new Map(), this.statCache = n.statCache || /* @__PURE__ */ new Map(), this.preservePaths = !!n.preservePaths, this.cwd = K(n.cwd || process.cwd()), this.strict = !!n.strict, this.noPax = !!n.noPax, this.noMtime = !!n.noMtime, this.mtime = n.mtime, this.prefix = n.prefix ? K(n.prefix) : void 0, this.onWriteEntry = n.onWriteEntry, typeof n.onwarn == "function" && this.on("warn", n.onwarn);
		let r = !1;
		if (!this.preservePaths) {
			let [e, t] = Qa(this.path);
			e && typeof t == "string" && (this.path = t, r = e);
		}
		this.win32 = !!n.win32 || process.platform === "win32", this.win32 && (this.path = io(this.path.replaceAll(/\\/g, "/")), e = e.replaceAll(/\\/g, "/")), this.absolute = K(n.absolute || h.resolve(this.cwd, e)), this.path === "" && (this.path = "./"), r && this.warn("TAR_ENTRY_INFO", `stripping ${r} from absolute path`, {
			entry: this,
			path: r + this.path
		});
		let i = this.statCache.get(this.absolute);
		i ? this[go](i) : this[ho]();
	}
	warn(e, t, n = {}) {
		return da(this, e, t, n);
	}
	emit(e, ...t) {
		return e === "error" && (this.#e = !0), super.emit(e, ...t);
	}
	[ho]() {
		p.lstat(this.absolute, (e, t) => {
			if (e) return this.emit("error", e);
			this[go](t);
		});
	}
	[go](e) {
		this.statCache.set(this.absolute, e), this.stat = e, e.isFile() || (e.size = 0), this.type = ko(e), this.emit("stat", e), this[so]();
	}
	[so]() {
		switch (this.type) {
			case "File": return this[co]();
			case "Directory": return this[lo]();
			case "SymbolicLink": return this[uo]();
			default: return this.end();
		}
	}
	[So](e) {
		return Ya(e, this.type === "Directory", this.portable);
	}
	[To](e) {
		return ao(e, this.prefix);
	}
	[po]() {
		if (!this.stat) throw Error("cannot write header before stat");
		this.type === "Directory" && this.portable && (this.noMtime = !0), this.onWriteEntry?.(this), this.header = new Wi({
			path: this[To](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[To](this.linkpath) : this.linkpath,
			mode: this[So](this.stat.mode),
			uid: this.portable ? void 0 : this.stat.uid,
			gid: this.portable ? void 0 : this.stat.gid,
			size: this.stat.size,
			mtime: this.noMtime ? void 0 : this.mtime || this.stat.mtime,
			type: this.type === "Unsupported" ? void 0 : this.type,
			uname: this.portable ? void 0 : this.stat.uid === this.myuid ? this.myuser : "",
			atime: this.portable ? void 0 : this.stat.atime,
			ctime: this.portable ? void 0 : this.stat.ctime
		}), this.header.encode() && !this.noPax && super.write(new oa({
			atime: this.portable ? void 0 : this.header.atime,
			ctime: this.portable ? void 0 : this.header.ctime,
			gid: this.portable ? void 0 : this.header.gid,
			mtime: this.noMtime ? void 0 : this.mtime || this.header.mtime,
			path: this[To](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[To](this.linkpath) : this.linkpath,
			size: this.header.size,
			uid: this.portable ? void 0 : this.header.uid,
			uname: this.portable ? void 0 : this.header.uname,
			dev: this.portable ? void 0 : this.stat.dev,
			ino: this.portable ? void 0 : this.stat.ino,
			nlink: this.portable ? void 0 : this.stat.nlink
		}).encode());
		let e = this.header?.block;
		if (!e) throw Error("failed to encode header");
		super.write(e);
	}
	[lo]() {
		if (!this.stat) throw Error("cannot create directory entry without stat");
		this.path.slice(-1) !== "/" && (this.path += "/"), this.stat.size = 0, this[po](), this.end();
	}
	[uo]() {
		p.readlink(this.absolute, (e, t) => {
			if (e) return this.emit("error", e);
			this[vo](t);
		});
	}
	[vo](e) {
		this.linkpath = K(e), this[po](), this.end();
	}
	[fo](e) {
		if (!this.stat) throw Error("cannot create link entry without stat");
		this.type = "Link", this.linkpath = K(h.relative(this.cwd, e)), this.stat.size = 0, this[po](), this.end();
	}
	[co]() {
		if (!this.stat) throw Error("cannot create file entry without stat");
		if (this.stat.nlink > 1) {
			let e = `${this.stat.dev}:${this.stat.ino}`, t = this.linkCache.get(e);
			if (t?.indexOf(this.cwd) === 0) return this[fo](t);
			this.linkCache.set(e, this.absolute);
		}
		if (this[po](), this.stat.size === 0) return this.end();
		this[yo]();
	}
	[yo]() {
		p.open(this.absolute, "r", (e, t) => {
			if (e) return this.emit("error", e);
			this[bo](t);
		});
	}
	[bo](e) {
		if (this.fd = e, this.#e) return this[xo]();
		if (!this.stat) throw Error("should stat before calling onopenfile");
		this.blockLen = 512 * Math.ceil(this.stat.size / 512), this.blockRemain = this.blockLen;
		let t = Math.min(this.blockLen, this.maxReadSize);
		this.buf = Buffer.allocUnsafe(t), this.offset = 0, this.pos = 0, this.remain = this.stat.size, this.length = this.buf.length, this[mo]();
	}
	[mo]() {
		let { fd: e, buf: t, offset: n, length: r, pos: i } = this;
		if (e === void 0 || t === void 0) throw Error("cannot read file without first opening");
		p.read(e, t, n, r, i, (e, t) => {
			if (e) return this[xo](() => this.emit("error", e));
			this[_o](t);
		});
	}
	[xo](e = () => {}) {
		this.fd !== void 0 && p.close(this.fd, e);
	}
	[_o](e) {
		if (e <= 0 && this.remain > 0) {
			let e = Object.assign(/* @__PURE__ */ Error("encountered unexpected EOF"), {
				path: this.absolute,
				syscall: "read",
				code: "EOF"
			});
			return this[xo](() => this.emit("error", e));
		}
		if (e > this.remain) {
			let e = Object.assign(/* @__PURE__ */ Error("did not encounter expected EOF"), {
				path: this.absolute,
				syscall: "read",
				code: "EOF"
			});
			return this[xo](() => this.emit("error", e));
		}
		if (!this.buf) throw Error("should have created buffer prior to reading");
		if (e === this.remain) for (let t = e; t < this.length && e < this.blockRemain; t++) this.buf[t + this.offset] = 0, e++, this.remain++;
		let t = this.offset === 0 && e === this.buf.length ? this.buf : this.buf.subarray(this.offset, this.offset + e);
		this.write(t) ? this[wo]() : this[Co](() => this[wo]());
	}
	[Co](e) {
		this.once("drain", e);
	}
	write(e, t, n) {
		if (typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8")), this.blockRemain < e.length) {
			let e = Object.assign(/* @__PURE__ */ Error("writing more data than expected"), { path: this.absolute });
			return this.emit("error", e);
		}
		return this.remain -= e.length, this.blockRemain -= e.length, this.pos += e.length, this.offset += e.length, super.write(e, null, n);
	}
	[wo]() {
		if (!this.remain) return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), this[xo]((e) => e ? this.emit("error", e) : this.end());
		if (!this.buf) throw Error("buffer lost somehow in ONDRAIN");
		this.offset >= this.length && (this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length)), this.offset = 0), this.length = this.buf.length - this.offset, this[mo]();
	}
}, Do = class extends Eo {
	sync = !0;
	[ho]() {
		this[go](p.lstatSync(this.absolute));
	}
	[uo]() {
		this[vo](p.readlinkSync(this.absolute));
	}
	[yo]() {
		this[bo](p.openSync(this.absolute, "r"));
	}
	[mo]() {
		let e = !0;
		try {
			let { fd: t, buf: n, offset: r, length: i, pos: a } = this;
			if (t === void 0 || n === void 0) throw Error("fd and buf must be set in READ method");
			let o = p.readSync(t, n, r, i, a);
			this[_o](o), e = !1;
		} finally {
			if (e) try {
				this[xo](() => {});
			} catch {}
		}
	}
	[Co](e) {
		e();
	}
	[xo](e = () => {}) {
		this.fd !== void 0 && p.closeSync(this.fd), e();
	}
}, Oo = class extends kr {
	blockLen = 0;
	blockRemain = 0;
	buf = 0;
	pos = 0;
	remain = 0;
	length = 0;
	preservePaths;
	portable;
	strict;
	noPax;
	noMtime;
	readEntry;
	type;
	prefix;
	path;
	mode;
	uid;
	gid;
	uname;
	gname;
	header;
	mtime;
	atime;
	ctime;
	linkpath;
	size;
	onWriteEntry;
	warn(e, t, n = {}) {
		return da(this, e, t, n);
	}
	constructor(e, t = {}) {
		let n = fi(t);
		super(), this.preservePaths = !!n.preservePaths, this.portable = !!n.portable, this.strict = !!n.strict, this.noPax = !!n.noPax, this.noMtime = !!n.noMtime, this.onWriteEntry = n.onWriteEntry, this.readEntry = e;
		let { type: r } = e;
		if (r === "Unsupported") throw Error("writing entry that should be ignored");
		this.type = r, this.type === "Directory" && this.portable && (this.noMtime = !0), this.prefix = n.prefix, this.path = K(e.path), this.mode = e.mode === void 0 ? void 0 : this[So](e.mode), this.uid = this.portable ? void 0 : e.uid, this.gid = this.portable ? void 0 : e.gid, this.uname = this.portable ? void 0 : e.uname, this.gname = this.portable ? void 0 : e.gname, this.size = e.size, this.mtime = this.noMtime ? void 0 : n.mtime || e.mtime, this.atime = this.portable ? void 0 : e.atime, this.ctime = this.portable ? void 0 : e.ctime, this.linkpath = e.linkpath === void 0 ? void 0 : K(e.linkpath), typeof n.onwarn == "function" && this.on("warn", n.onwarn);
		let i = !1;
		if (!this.preservePaths) {
			let [e, t] = Qa(this.path);
			e && typeof t == "string" && (this.path = t, i = e);
		}
		this.remain = e.size, this.blockRemain = e.startBlockSize, this.onWriteEntry?.(this), this.header = new Wi({
			path: this[To](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[To](this.linkpath) : this.linkpath,
			mode: this.mode,
			uid: this.portable ? void 0 : this.uid,
			gid: this.portable ? void 0 : this.gid,
			size: this.size,
			mtime: this.noMtime ? void 0 : this.mtime,
			type: this.type,
			uname: this.portable ? void 0 : this.uname,
			atime: this.portable ? void 0 : this.atime,
			ctime: this.portable ? void 0 : this.ctime
		}), i && this.warn("TAR_ENTRY_INFO", `stripping ${i} from absolute path`, {
			entry: this,
			path: i + this.path
		}), this.header.encode() && !this.noPax && super.write(new oa({
			atime: this.portable ? void 0 : this.atime,
			ctime: this.portable ? void 0 : this.ctime,
			gid: this.portable ? void 0 : this.gid,
			mtime: this.noMtime ? void 0 : this.mtime,
			path: this[To](this.path),
			linkpath: this.type === "Link" && this.linkpath !== void 0 ? this[To](this.linkpath) : this.linkpath,
			size: this.size,
			uid: this.portable ? void 0 : this.uid,
			uname: this.portable ? void 0 : this.uname,
			dev: this.portable ? void 0 : this.readEntry.dev,
			ino: this.portable ? void 0 : this.readEntry.ino,
			nlink: this.portable ? void 0 : this.readEntry.nlink
		}).encode());
		let a = this.header?.block;
		if (!a) throw Error("failed to encode header");
		super.write(a), e.pipe(this);
	}
	[To](e) {
		return ao(e, this.prefix);
	}
	[So](e) {
		return Ya(e, this.type === "Directory", this.portable);
	}
	write(e, t, n) {
		typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, typeof t == "string" ? t : "utf8"));
		let r = e.length;
		if (r > this.blockRemain) throw Error("writing more to entry than is appropriate");
		return this.blockRemain -= r, super.write(e, n);
	}
	end(e, t, n) {
		return this.blockRemain && super.write(Buffer.alloc(this.blockRemain)), typeof e == "function" && (n = e, t = void 0, e = void 0), typeof t == "function" && (n = t, t = void 0), typeof e == "string" && (e = Buffer.from(e, t ?? "utf8")), n && this.once("finish", n), e ? super.end(e, n) : super.end(n), this;
	}
}, ko = (e) => e.isFile() ? "File" : e.isDirectory() ? "Directory" : e.isSymbolicLink() ? "SymbolicLink" : "Unsupported", Ao = class e {
	tail;
	head;
	length = 0;
	static create(t = []) {
		return new e(t);
	}
	constructor(e = []) {
		for (let t of e) this.push(t);
	}
	*[Symbol.iterator]() {
		for (let e = this.head; e; e = e.next) yield e.value;
	}
	removeNode(e) {
		if (e.list !== this) throw Error("removing node which does not belong to this list");
		let t = e.next, n = e.prev;
		return t && (t.prev = n), n && (n.next = t), e === this.head && (this.head = t), e === this.tail && (this.tail = n), this.length--, e.next = void 0, e.prev = void 0, e.list = void 0, t;
	}
	unshiftNode(e) {
		if (e === this.head) return;
		e.list && e.list.removeNode(e);
		let t = this.head;
		e.list = this, e.next = t, t && (t.prev = e), this.head = e, this.tail ||= e, this.length++;
	}
	pushNode(e) {
		if (e === this.tail) return;
		e.list && e.list.removeNode(e);
		let t = this.tail;
		e.list = this, e.prev = t, t && (t.next = e), this.tail = e, this.head ||= e, this.length++;
	}
	push(...e) {
		for (let t = 0, n = e.length; t < n; t++) Mo(this, e[t]);
		return this.length;
	}
	unshift(...e) {
		for (var t = 0, n = e.length; t < n; t++) No(this, e[t]);
		return this.length;
	}
	pop() {
		if (!this.tail) return;
		let e = this.tail.value, t = this.tail;
		return this.tail = this.tail.prev, this.tail ? this.tail.next = void 0 : this.head = void 0, t.list = void 0, this.length--, e;
	}
	shift() {
		if (!this.head) return;
		let e = this.head.value, t = this.head;
		return this.head = this.head.next, this.head ? this.head.prev = void 0 : this.tail = void 0, t.list = void 0, this.length--, e;
	}
	forEach(e, t) {
		t ||= this;
		for (let n = this.head, r = 0; n; r++) e.call(t, n.value, r, this), n = n.next;
	}
	forEachReverse(e, t) {
		t ||= this;
		for (let n = this.tail, r = this.length - 1; n; r--) e.call(t, n.value, r, this), n = n.prev;
	}
	get(e) {
		let t = 0, n = this.head;
		for (; n && t < e; t++) n = n.next;
		if (t === e && n) return n.value;
	}
	getReverse(e) {
		let t = 0, n = this.tail;
		for (; n && t < e; t++) n = n.prev;
		if (t === e && n) return n.value;
	}
	map(t, n) {
		n ||= this;
		let r = new e();
		for (let e = this.head; e;) r.push(t.call(n, e.value, this)), e = e.next;
		return r;
	}
	mapReverse(t, n) {
		n ||= this;
		var r = new e();
		for (let e = this.tail; e;) r.push(t.call(n, e.value, this)), e = e.prev;
		return r;
	}
	reduce(e, t) {
		let n, r = this.head;
		if (arguments.length > 1) n = t;
		else if (this.head) r = this.head.next, n = this.head.value;
		else throw TypeError("Reduce of empty list with no initial value");
		for (var i = 0; r; i++) n = e(n, r.value, i), r = r.next;
		return n;
	}
	reduceReverse(e, t) {
		let n, r = this.tail;
		if (arguments.length > 1) n = t;
		else if (this.tail) r = this.tail.prev, n = this.tail.value;
		else throw TypeError("Reduce of empty list with no initial value");
		for (let t = this.length - 1; r; t--) n = e(n, r.value, t), r = r.prev;
		return n;
	}
	toArray() {
		let e = Array(this.length);
		for (let t = 0, n = this.head; n; t++) e[t] = n.value, n = n.next;
		return e;
	}
	toArrayReverse() {
		let e = Array(this.length);
		for (let t = 0, n = this.tail; n; t++) e[t] = n.value, n = n.prev;
		return e;
	}
	slice(t = 0, n = this.length) {
		n < 0 && (n += this.length), t < 0 && (t += this.length);
		let r = new e();
		if (n < t || n < 0) return r;
		t < 0 && (t = 0), n > this.length && (n = this.length);
		let i = this.head, a = 0;
		for (a = 0; i && a < t; a++) i = i.next;
		for (; i && a < n; a++, i = i.next) r.push(i.value);
		return r;
	}
	sliceReverse(t = 0, n = this.length) {
		n < 0 && (n += this.length), t < 0 && (t += this.length);
		let r = new e();
		if (n < t || n < 0) return r;
		t < 0 && (t = 0), n > this.length && (n = this.length);
		let i = this.length, a = this.tail;
		for (; a && i > n; i--) a = a.prev;
		for (; a && i > t; i--, a = a.prev) r.push(a.value);
		return r;
	}
	splice(e, t = 0, ...n) {
		e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
		let r = this.head;
		for (let t = 0; r && t < e; t++) r = r.next;
		let i = [];
		for (let e = 0; r && e < t; e++) i.push(r.value), r = this.removeNode(r);
		r ? r !== this.tail && (r = r.prev) : r = this.tail;
		for (let e of n) r = jo(this, r, e);
		return i;
	}
	reverse() {
		let e = this.head, t = this.tail;
		for (let t = e; t; t = t.prev) {
			let e = t.prev;
			t.prev = t.next, t.next = e;
		}
		return this.head = t, this.tail = e, this;
	}
};
function jo(e, t, n) {
	let r = new Po(n, t, t ? t.next : e.head, e);
	return r.next === void 0 && (e.tail = r), r.prev === void 0 && (e.head = r), e.length++, r;
}
function Mo(e, t) {
	e.tail = new Po(t, e.tail, void 0, e), e.head ||= e.tail, e.length++;
}
function No(e, t) {
	e.head = new Po(t, void 0, e.head, e), e.tail ||= e.head, e.length++;
}
var Po = class {
	list;
	next;
	prev;
	value;
	constructor(e, t, n, r) {
		this.list = r, this.value = e, t ? (t.next = this, this.prev = t) : this.prev = void 0, n ? (n.prev = this, this.next = n) : this.next = void 0;
	}
}, Fo = class {
	path;
	absolute;
	entry;
	stat;
	readdir;
	pending = !1;
	ignore = !1;
	piped = !1;
	constructor(e, t) {
		this.path = e || "./", this.absolute = t;
	}
}, Io = Buffer.alloc(1024), Lo = Symbol("onStat"), Ro = Symbol("ended"), X = Symbol("queue"), zo = Symbol("current"), Bo = Symbol("process"), Vo = Symbol("processing"), Ho = Symbol("processJob"), Z = Symbol("jobs"), Uo = Symbol("jobDone"), Wo = Symbol("addFSEntry"), Go = Symbol("addTarEntry"), Ko = Symbol("stat"), qo = Symbol("readdir"), Jo = Symbol("onreaddir"), Yo = Symbol("pipe"), Xo = Symbol("entry"), Zo = Symbol("entryOpt"), Qo = Symbol("writeEntryClass"), $o = Symbol("write"), es = Symbol("ondrain"), ts = class extends kr {
	sync = !1;
	opt;
	cwd;
	maxReadSize;
	preservePaths;
	strict;
	noPax;
	prefix;
	linkCache;
	statCache;
	file;
	portable;
	zip;
	readdirCache;
	noDirRecurse;
	follow;
	noMtime;
	mtime;
	filter;
	jobs;
	[Qo];
	onWriteEntry;
	[X];
	[Z] = 0;
	[Vo] = !1;
	[Ro] = !1;
	constructor(e = {}) {
		if (super(), this.opt = e, this.file = e.file || "", this.cwd = e.cwd || process.cwd(), this.maxReadSize = e.maxReadSize, this.preservePaths = !!e.preservePaths, this.strict = !!e.strict, this.noPax = !!e.noPax, this.prefix = K(e.prefix || ""), this.linkCache = e.linkCache || /* @__PURE__ */ new Map(), this.statCache = e.statCache || /* @__PURE__ */ new Map(), this.readdirCache = e.readdirCache || /* @__PURE__ */ new Map(), this.onWriteEntry = e.onWriteEntry, this[Qo] = Eo, typeof e.onwarn == "function" && this.on("warn", e.onwarn), this.portable = !!e.portable, e.gzip || e.brotli || e.zstd) {
			if ((e.gzip ? 1 : 0) + (e.brotli ? 1 : 0) + (e.zstd ? 1 : 0) > 1) throw TypeError("gzip, brotli, zstd are mutually exclusive");
			if (e.gzip && (typeof e.gzip != "object" && (e.gzip = {}), this.portable && (e.gzip.portable = !0), this.zip = new wi(e.gzip)), e.brotli && (typeof e.brotli != "object" && (e.brotli = {}), this.zip = new Di(e.brotli)), e.zstd && (typeof e.zstd != "object" && (e.zstd = {}), this.zip = new Ai(e.zstd)), !this.zip) throw Error("impossible");
			let t = this.zip;
			t.on("data", (e) => super.write(e)), t.on("end", () => super.end()), t.on("drain", () => this[es]()), this.on("resume", () => t.resume());
		} else this.on("drain", this[es]);
		this.noDirRecurse = !!e.noDirRecurse, this.follow = !!e.follow, this.noMtime = !!e.noMtime, e.mtime && (this.mtime = e.mtime), this.filter = typeof e.filter == "function" ? e.filter : () => !0, this[X] = new Ao(), this[Z] = 0, this.jobs = Number(e.jobs) || 4, this[Vo] = !1, this[Ro] = !1;
	}
	[$o](e) {
		return super.write(e);
	}
	add(e) {
		return this.write(e), this;
	}
	end(e, t, n) {
		return typeof e == "function" && (n = e, e = void 0), typeof t == "function" && (n = t, t = void 0), e && this.add(e), this[Ro] = !0, this[Bo](), n && n(), this;
	}
	write(e) {
		if (this[Ro]) throw Error("write after end");
		return e instanceof ua ? this[Go](e) : this[Wo](e), this.flowing;
	}
	[Go](e) {
		let t = K(h.resolve(this.cwd, e.path));
		if (!this.filter(e.path, e)) e.resume();
		else {
			let n = new Fo(e.path, t);
			n.entry = new Oo(e, this[Zo](n)), n.entry.on("end", () => this[Uo](n)), this[Z] += 1, this[X].push(n);
		}
		this[Bo]();
	}
	[Wo](e) {
		let t = K(h.resolve(this.cwd, e));
		this[X].push(new Fo(e, t)), this[Bo]();
	}
	[Ko](e) {
		e.pending = !0, this[Z] += 1, p[this.follow ? "stat" : "lstat"](e.absolute, (t, n) => {
			e.pending = !1, --this[Z], t ? this.emit("error", t) : this[Lo](e, n);
		});
	}
	[Lo](e, t) {
		this.statCache.set(e.absolute, t), e.stat = t, this.filter(e.path, t) ? t.isFile() && t.nlink > 1 && e === this[zo] && !this.linkCache.get(`${t.dev}:${t.ino}`) && !this.sync && this[Ho](e) : e.ignore = !0, this[Bo]();
	}
	[qo](e) {
		e.pending = !0, this[Z] += 1, p.readdir(e.absolute, (t, n) => {
			if (e.pending = !1, --this[Z], t) return this.emit("error", t);
			this[Jo](e, n);
		});
	}
	[Jo](e, t) {
		this.readdirCache.set(e.absolute, t), e.readdir = t, this[Bo]();
	}
	[Bo]() {
		if (!this[Vo]) {
			this[Vo] = !0;
			for (let e = this[X].head; e && this[Z] < this.jobs; e = e.next) if (this[Ho](e.value), e.value.ignore) {
				let t = e.next;
				this[X].removeNode(e), e.next = t;
			}
			this[Vo] = !1, this[Ro] && this[X].length === 0 && this[Z] === 0 && (this.zip ? this.zip.end(Io) : (super.write(Io), super.end()));
		}
	}
	get [zo]() {
		return this[X] && this[X].head && this[X].head.value;
	}
	[Uo](e) {
		this[X].shift(), --this[Z], this[Bo]();
	}
	[Ho](e) {
		if (!e.pending) {
			if (e.entry) {
				e === this[zo] && !e.piped && this[Yo](e);
				return;
			}
			if (!e.stat) {
				let t = this.statCache.get(e.absolute);
				t ? this[Lo](e, t) : this[Ko](e);
			}
			if (e.stat && !e.ignore) {
				if (!this.noDirRecurse && e.stat.isDirectory() && !e.readdir) {
					let t = this.readdirCache.get(e.absolute);
					if (t ? this[Jo](e, t) : this[qo](e), !e.readdir) return;
				}
				if (e.entry = this[Xo](e), !e.entry) {
					e.ignore = !0;
					return;
				}
				e === this[zo] && !e.piped && this[Yo](e);
			}
		}
	}
	[Zo](e) {
		return {
			onwarn: (e, t, n) => this.warn(e, t, n),
			noPax: this.noPax,
			cwd: this.cwd,
			absolute: e.absolute,
			preservePaths: this.preservePaths,
			maxReadSize: this.maxReadSize,
			strict: this.strict,
			portable: this.portable,
			linkCache: this.linkCache,
			statCache: this.statCache,
			noMtime: this.noMtime,
			mtime: this.mtime,
			prefix: this.prefix,
			onWriteEntry: this.onWriteEntry
		};
	}
	[Xo](e) {
		this[Z] += 1;
		try {
			return new this[Qo](e.path, this[Zo](e)).on("end", () => this[Uo](e)).on("error", (e) => this.emit("error", e));
		} catch (e) {
			this.emit("error", e);
		}
	}
	[es]() {
		this[zo] && this[zo].entry && this[zo].entry.resume();
	}
	[Yo](e) {
		e.piped = !0, e.readdir && e.readdir.forEach((t) => {
			let n = e.path, r = n === "./" ? "" : n.replace(/\/*$/, "/");
			this[Wo](r + t);
		});
		let t = e.entry, n = this.zip;
		if (!t) throw Error("cannot pipe without source");
		n ? t.on("data", (e) => {
			n.write(e) || t.pause();
		}) : t.on("data", (e) => {
			super.write(e) || t.pause();
		});
	}
	pause() {
		return this.zip && this.zip.pause(), super.pause();
	}
	warn(e, t, n = {}) {
		da(this, e, t, n);
	}
}, ns = class extends ts {
	sync = !0;
	constructor(e) {
		super(e), this[Qo] = Do;
	}
	pause() {}
	resume() {}
	[Ko](e) {
		let t = this.follow ? "statSync" : "lstatSync";
		this[Lo](e, p[t](e.absolute));
	}
	[qo](e) {
		this[Jo](e, p.readdirSync(e.absolute));
	}
	[Yo](e) {
		let t = e.entry, n = this.zip;
		if (e.readdir && e.readdir.forEach((t) => {
			let n = e.path, r = n === "./" ? "" : n.replace(/\/*$/, "/");
			this[Wo](r + t);
		}), !t) throw Error("Cannot pipe without source");
		n ? t.on("data", (e) => {
			n.write(e);
		}) : t.on("data", (e) => {
			super[$o](e);
		});
	}
}, rs = (e, t) => {
	let n = new ns(e), r = new ii(e.file, { mode: e.mode || 438 });
	n.pipe(r), as(n, t);
}, is = (e, t) => {
	let n = new ts(e), r = new ri(e.file, { mode: e.mode || 438 });
	n.pipe(r);
	let i = new Promise((e, t) => {
		r.on("error", t), r.on("close", e), n.on("error", t);
	});
	return os(n, t).catch((e) => n.emit("error", e)), i;
}, as = (e, t) => {
	t.forEach((t) => {
		t.charAt(0) === "@" ? Ja({
			file: i.resolve(e.cwd, t.slice(1)),
			sync: !0,
			noResume: !0,
			onReadEntry: (t) => e.add(t)
		}) : e.add(t);
	}), e.end();
}, os = async (e, t) => {
	for (let n of t) n.charAt(0) === "@" ? await Ja({
		file: i.resolve(String(e.cwd), n.slice(1)),
		noResume: !0,
		onReadEntry: (t) => {
			e.add(t);
		}
	}) : e.add(n);
	e.end();
};
pi(rs, is, (e, t) => {
	let n = new ns(e);
	return as(n, t), n;
}, (e, t) => {
	let n = new ts(e);
	return os(n, t).catch((e) => n.emit("error", e)), n;
}, (e, t) => {
	if (!t?.length) throw TypeError("no paths specified to add to archive");
});
var ss = (process.env.__FAKE_PLATFORM__ || process.platform) === "win32", { O_CREAT: cs, O_NOFOLLOW: ls, O_TRUNC: us, O_WRONLY: ds } = p.constants, fs = Number(process.env.__FAKE_FS_O_FILENAME__) || p.constants.UV_FS_O_FILEMAP || 0, ps = ss && !!fs, ms = 512 * 1024, hs = fs | us | cs | ds, gs = !ss && typeof ls == "number" ? ls | us | cs | ds : null, _s = gs === null ? ps ? (e) => e < ms ? hs : "w" : () => "w" : () => gs, vs = (e, t, n) => {
	try {
		return y.lchownSync(e, t, n);
	} catch (e) {
		if (e?.code !== "ENOENT") throw e;
	}
}, ys = (e, t, n, r) => {
	y.lchown(e, t, n, (e) => {
		r(e && e?.code !== "ENOENT" ? e : null);
	});
}, bs = (e, t, n, r, a) => {
	t.isDirectory() ? xs(i.resolve(e, t.name), n, r, (o) => {
		if (o) return a(o);
		ys(i.resolve(e, t.name), n, r, a);
	}) : ys(i.resolve(e, t.name), n, r, a);
}, xs = (e, t, n, r) => {
	y.readdir(e, { withFileTypes: !0 }, (i, a) => {
		if (i) {
			if (i.code === "ENOENT") return r();
			if (i.code !== "ENOTDIR" && i.code !== "ENOTSUP") return r(i);
		}
		if (i || !a.length) return ys(e, t, n, r);
		let o = a.length, s = null, c = (i) => {
			if (!s) {
				if (i) return r(s = i);
				if (--o === 0) return ys(e, t, n, r);
			}
		};
		for (let r of a) bs(e, r, t, n, c);
	});
}, Ss = (e, t, n, r) => {
	t.isDirectory() && Cs(i.resolve(e, t.name), n, r), vs(i.resolve(e, t.name), n, r);
}, Cs = (e, t, n) => {
	let r;
	try {
		r = y.readdirSync(e, { withFileTypes: !0 });
	} catch (r) {
		let i = r;
		if (i?.code === "ENOENT") return;
		if (i?.code === "ENOTDIR" || i?.code === "ENOTSUP") return vs(e, t, n);
		throw i;
	}
	for (let i of r) Ss(e, i, t, n);
	return vs(e, t, n);
}, ws = class extends Error {
	path;
	code;
	syscall = "chdir";
	constructor(e, t) {
		super(`${t}: Cannot cd into '${e}'`), this.path = e, this.code = t;
	}
	get name() {
		return "CwdError";
	}
}, Ts = class extends Error {
	path;
	symlink;
	syscall = "symlink";
	code = "TAR_SYMLINK_ERROR";
	constructor(e, t) {
		super("TAR_SYMLINK_ERROR: Cannot extract through symbolic link"), this.symlink = e, this.path = t;
	}
	get name() {
		return "SymlinkError";
	}
}, Es = (e, t) => {
	y.stat(e, (n, r) => {
		(n || !r.isDirectory()) && (n = new ws(e, n?.code || "ENOTDIR")), t(n);
	});
}, Ds = (e, t, n) => {
	e = K(e);
	let r = t.umask ?? 18, a = t.mode | 448, o = (a & r) !== 0, s = t.uid, c = t.gid, l = typeof s == "number" && typeof c == "number" && (s !== t.processUid || c !== t.processGid), u = t.preserve, d = t.unlink, f = K(t.cwd), p = (t, r) => {
		t ? n(t) : r && l ? xs(r, s, c, (e) => p(e)) : o ? y.chmod(e, a, n) : n();
	};
	if (e === f) return Es(e, p);
	if (u) return oe.mkdir(e, {
		mode: a,
		recursive: !0
	}).then((e) => p(null, e ?? void 0), p);
	Os(f, K(i.relative(f, e)).split("/"), a, d, f, void 0, p);
}, Os = (e, t, n, r, a, o, s) => {
	if (t.length === 0) return s(null, o);
	let c = t.shift(), l = K(i.resolve(e + "/" + c));
	y.mkdir(l, n, ks(l, t, n, r, a, o, s));
}, ks = (e, t, n, r, i, a, o) => (s) => {
	s ? y.lstat(e, (c, l) => {
		if (c) c.path = c.path && K(c.path), o(c);
		else if (l.isDirectory()) Os(e, t, n, r, i, a, o);
		else if (r) y.unlink(e, (s) => {
			if (s) return o(s);
			y.mkdir(e, n, ks(e, t, n, r, i, a, o));
		});
		else {
			if (l.isSymbolicLink()) return o(new Ts(e, e + "/" + t.join("/")));
			o(s);
		}
	}) : (a ||= e, Os(e, t, n, r, i, a, o));
}, As = (e) => {
	let t = !1, n;
	try {
		t = y.statSync(e).isDirectory();
	} catch (e) {
		n = e?.code;
	} finally {
		if (!t) throw new ws(e, n ?? "ENOTDIR");
	}
}, js = (e, t) => {
	e = K(e);
	let n = t.umask ?? 18, r = t.mode | 448, a = (r & n) !== 0, o = t.uid, s = t.gid, c = typeof o == "number" && typeof s == "number" && (o !== t.processUid || s !== t.processGid), l = t.preserve, u = t.unlink, d = K(t.cwd), f = (t) => {
		t && c && Cs(t, o, s), a && y.chmodSync(e, r);
	};
	if (e === d) return As(d), f();
	if (l) return f(y.mkdirSync(e, {
		mode: r,
		recursive: !0
	}) ?? void 0);
	let p = K(i.relative(d, e)).split("/"), m;
	for (let e = p.shift(), t = d; e && (t += "/" + e); e = p.shift()) {
		t = K(i.resolve(t));
		try {
			y.mkdirSync(t, r), m ||= t;
		} catch {
			let e = y.lstatSync(t);
			if (e.isDirectory()) continue;
			if (u) {
				y.unlinkSync(t), y.mkdirSync(t, r), m ||= t;
				continue;
			} else if (e.isSymbolicLink()) return new Ts(t, t + "/" + p.join("/"));
		}
	}
	return f(m);
}, Ms = Object.create(null), Ns = 1e4, Ps = /* @__PURE__ */ new Set(), Fs = (e) => {
	Ps.has(e) ? Ps.delete(e) : Ms[e] = e.normalize("NFD").toLocaleLowerCase("en").toLocaleUpperCase("en"), Ps.add(e);
	let t = Ms[e], n = Ps.size - Ns;
	if (n > Ns / 10) {
		for (let e of Ps) if (Ps.delete(e), delete Ms[e], --n <= 0) break;
	}
	return t;
}, Is = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32", Ls = (e) => e.split("/").slice(0, -1).reduce((e, t) => {
	let n = e.at(-1);
	return n !== void 0 && (t = l(n, t)), e.push(t || "/"), e;
}, []), Rs = class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Set();
	reserve(e, t) {
		e = Is ? ["win32 parallelization disabled"] : e.map((e) => Ga(l(Fs(e))));
		let n = new Set(e.map((e) => Ls(e)).reduce((e, t) => e.concat(t)));
		this.#t.set(t, {
			dirs: n,
			paths: e
		});
		for (let n of e) {
			let e = this.#e.get(n);
			e ? e.push(t) : this.#e.set(n, [t]);
		}
		for (let e of n) {
			let n = this.#e.get(e);
			if (!n) this.#e.set(e, [new Set([t])]);
			else {
				let e = n.at(-1);
				e instanceof Set ? e.add(t) : n.push(new Set([t]));
			}
		}
		return this.#i(t);
	}
	#r(e) {
		let t = this.#t.get(e);
		if (!t) throw Error("function does not have any path reservations");
		return {
			paths: t.paths.map((e) => this.#e.get(e)),
			dirs: [...t.dirs].map((e) => this.#e.get(e))
		};
	}
	check(e) {
		let { paths: t, dirs: n } = this.#r(e);
		return t.every((t) => t && t[0] === e) && n.every((t) => t && t[0] instanceof Set && t[0].has(e));
	}
	#i(e) {
		return this.#n.has(e) || !this.check(e) ? !1 : (this.#n.add(e), e(() => this.#a(e)), !0);
	}
	#a(e) {
		if (!this.#n.has(e)) return !1;
		let t = this.#t.get(e);
		if (!t) throw Error("invalid reservation");
		let { paths: n, dirs: r } = t, i = /* @__PURE__ */ new Set();
		for (let t of n) {
			let n = this.#e.get(t);
			if (!n || n?.[0] !== e) continue;
			let r = n[1];
			if (!r) {
				this.#e.delete(t);
				continue;
			}
			if (n.shift(), typeof r == "function") i.add(r);
			else for (let e of r) i.add(e);
		}
		for (let t of r) {
			let n = this.#e.get(t), r = n?.[0];
			if (!(!n || !(r instanceof Set))) if (r.size === 1 && n.length === 1) {
				this.#e.delete(t);
				continue;
			} else if (r.size === 1) {
				n.shift();
				let e = n[0];
				typeof e == "function" && i.add(e);
			} else r.delete(e);
		}
		return this.#n.delete(e), i.forEach((e) => this.#i(e)), !0;
	}
}, zs = () => process.umask(), Bs = Symbol("onEntry"), Vs = Symbol("checkFs"), Hs = Symbol("checkFs2"), Us = Symbol("isReusable"), Q = Symbol("makeFs"), Ws = Symbol("file"), Gs = Symbol("directory"), Ks = Symbol("link"), qs = Symbol("symlink"), Js = Symbol("hardlink"), Ys = Symbol("ensureNoSymlink"), Xs = Symbol("unsupported"), Zs = Symbol("checkPath"), Qs = Symbol("stripAbsolutePath"), $s = Symbol("mkdir"), $ = Symbol("onError"), ec = Symbol("pending"), tc = Symbol("pend"), nc = Symbol("unpend"), rc = Symbol("ended"), ic = Symbol("maybeClose"), ac = Symbol("skip"), oc = Symbol("doChown"), sc = Symbol("uid"), cc = Symbol("gid"), lc = Symbol("checkedCwd"), uc = (process.env.TESTING_TAR_FAKE_PLATFORM || process.platform) === "win32", dc = 1024, fc = (e, t) => {
	if (!uc) return y.unlink(e, t);
	let n = e + ".DELETE." + _e(16).toString("hex");
	y.rename(e, n, (e) => {
		if (e) return t(e);
		y.unlink(n, t);
	});
}, pc = (e) => {
	if (!uc) return y.unlinkSync(e);
	let t = e + ".DELETE." + _e(16).toString("hex");
	y.renameSync(e, t), y.unlinkSync(t);
}, mc = (e, t, n) => e !== void 0 && e === e >>> 0 ? e : t !== void 0 && t === t >>> 0 ? t : n, hc = class extends Wa {
	[rc] = !1;
	[lc] = !1;
	[ec] = 0;
	reservations = new Rs();
	transform;
	writable = !0;
	readable = !1;
	uid;
	gid;
	setOwner;
	preserveOwner;
	processGid;
	processUid;
	maxDepth;
	forceChown;
	win32;
	newer;
	keep;
	noMtime;
	preservePaths;
	unlink;
	cwd;
	strip;
	processUmask;
	umask;
	dmode;
	fmode;
	chmod;
	constructor(e = {}) {
		if (e.ondone = () => {
			this[rc] = !0, this[ic]();
		}, super(e), this.transform = e.transform, this.chmod = !!e.chmod, typeof e.uid == "number" || typeof e.gid == "number") {
			if (typeof e.uid != "number" || typeof e.gid != "number") throw TypeError("cannot set owner without number uid and gid");
			if (e.preserveOwner) throw TypeError("cannot preserve owner in archive and also set owner explicitly");
			this.uid = e.uid, this.gid = e.gid, this.setOwner = !0;
		} else this.uid = void 0, this.gid = void 0, this.setOwner = !1;
		this.preserveOwner = e.preserveOwner === void 0 && typeof e.uid != "number" ? !!(process.getuid && process.getuid() === 0) : !!e.preserveOwner, this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : void 0, this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : void 0, this.maxDepth = typeof e.maxDepth == "number" ? e.maxDepth : dc, this.forceChown = e.forceChown === !0, this.win32 = !!e.win32 || uc, this.newer = !!e.newer, this.keep = !!e.keep, this.noMtime = !!e.noMtime, this.preservePaths = !!e.preservePaths, this.unlink = !!e.unlink, this.cwd = K(i.resolve(e.cwd || process.cwd())), this.strip = Number(e.strip) || 0, this.processUmask = this.chmod ? typeof e.processUmask == "number" ? e.processUmask : zs() : 0, this.umask = typeof e.umask == "number" ? e.umask : this.processUmask, this.dmode = e.dmode || 511 & ~this.umask, this.fmode = e.fmode || 438 & ~this.umask, this.on("entry", (e) => this[Bs](e));
	}
	warn(e, t, n = {}) {
		return (e === "TAR_BAD_ARCHIVE" || e === "TAR_ABORT") && (n.recoverable = !1), super.warn(e, t, n);
	}
	[ic]() {
		this[rc] && this[ec] === 0 && (this.emit("prefinish"), this.emit("finish"), this.emit("end"));
	}
	[Qs](e, t) {
		let n = e[t], { type: r } = e;
		if (!n || this.preservePaths) return !0;
		let [a, o] = Qa(n), s = o.replaceAll(/\\/g, "/").split("/");
		if (s.includes("..") || uc && /^[a-z]:\.\.$/i.test(s[0] ?? "")) {
			if (t === "path" || r === "Link") return this.warn("TAR_ENTRY_ERROR", `${t} contains '..'`, {
				entry: e,
				[t]: n
			}), !1;
			let a = i.posix.dirname(e.path), o = i.posix.normalize(i.posix.join(a, s.join("/")));
			if (o.startsWith("../") || o === "..") return this.warn("TAR_ENTRY_ERROR", `${t} escapes extraction directory`, {
				entry: e,
				[t]: n
			}), !1;
		}
		return a && (e[t] = String(o), this.warn("TAR_ENTRY_INFO", `stripping ${a} from absolute ${t}`, {
			entry: e,
			[t]: n
		})), !0;
	}
	[Zs](e) {
		let t = K(e.path), n = t.split("/");
		if (this.strip) {
			if (n.length < this.strip) return !1;
			if (e.type === "Link") {
				let t = K(String(e.linkpath)).split("/");
				if (t.length >= this.strip) e.linkpath = t.slice(this.strip).join("/");
				else return !1;
			}
			n.splice(0, this.strip), e.path = n.join("/");
		}
		if (isFinite(this.maxDepth) && n.length > this.maxDepth) return this.warn("TAR_ENTRY_ERROR", "path excessively deep", {
			entry: e,
			path: t,
			depth: n.length,
			maxDepth: this.maxDepth
		}), !1;
		if (!this[Qs](e, "path") || !this[Qs](e, "linkpath")) return !1;
		if (e.absolute = i.isAbsolute(e.path) ? K(i.resolve(e.path)) : K(i.resolve(this.cwd, e.path)), !this.preservePaths && typeof e.absolute == "string" && e.absolute.indexOf(this.cwd + "/") !== 0 && e.absolute !== this.cwd) return this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
			entry: e,
			path: K(e.path),
			resolvedPath: e.absolute,
			cwd: this.cwd
		}), !1;
		if (e.absolute === this.cwd && e.type !== "Directory" && e.type !== "GNUDumpDir") return !1;
		if (this.win32) {
			let { root: t } = i.win32.parse(String(e.absolute));
			e.absolute = t + ro(String(e.absolute).slice(t.length));
			let { root: n } = i.win32.parse(e.path);
			e.path = n + ro(e.path.slice(n.length));
		}
		return !0;
	}
	[Bs](e) {
		if (!this[Zs](e)) return e.resume();
		switch (Oe.equal(typeof e.absolute, "string"), e.type) {
			case "Directory":
			case "GNUDumpDir": e.mode && (e.mode |= 448);
			case "File":
			case "OldFile":
			case "ContiguousFile":
			case "Link":
			case "SymbolicLink": return this[Vs](e);
			default: return this[Xs](e);
		}
	}
	[$](e, t) {
		e.name === "CwdError" ? this.emit("error", e) : (this.warn("TAR_ENTRY_ERROR", e, { entry: t }), this[nc](), t.resume());
	}
	[$s](e, t, n) {
		Ds(K(e), {
			uid: this.uid,
			gid: this.gid,
			processUid: this.processUid,
			processGid: this.processGid,
			umask: this.processUmask,
			preserve: this.preservePaths,
			unlink: this.unlink,
			cwd: this.cwd,
			mode: t
		}, n);
	}
	[oc](e) {
		return this.forceChown || this.preserveOwner && (typeof e.uid == "number" && e.uid !== this.processUid || typeof e.gid == "number" && e.gid !== this.processGid) || typeof this.uid == "number" && this.uid !== this.processUid || typeof this.gid == "number" && this.gid !== this.processGid;
	}
	[sc](e) {
		return mc(this.uid, e.uid, this.processUid);
	}
	[cc](e) {
		return mc(this.gid, e.gid, this.processGid);
	}
	[Ws](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.fmode, r = new ri(String(e.absolute), {
			flags: _s(e.size),
			mode: n,
			autoClose: !1
		});
		r.on("error", (n) => {
			r.fd && y.close(r.fd, () => {}), r.write = () => !0, this[$](n, e), t();
		});
		let i = 1, a = (n) => {
			if (n) {
				r.fd && y.close(r.fd, () => {}), this[$](n, e), t();
				return;
			}
			--i === 0 && r.fd !== void 0 && y.close(r.fd, (n) => {
				n ? this[$](n, e) : this[nc](), t();
			});
		};
		r.on("finish", () => {
			let t = String(e.absolute), n = r.fd;
			if (typeof n == "number" && e.mtime && !this.noMtime) {
				i++;
				let r = e.atime || /* @__PURE__ */ new Date(), o = e.mtime;
				y.futimes(n, r, o, (e) => e ? y.utimes(t, r, o, (t) => a(t && e)) : a());
			}
			if (typeof n == "number" && this[oc](e)) {
				i++;
				let r = this[sc](e), o = this[cc](e);
				typeof r == "number" && typeof o == "number" && y.fchown(n, r, o, (e) => e ? y.chown(t, r, o, (t) => a(t && e)) : a());
			}
			a();
		});
		let o = this.transform && this.transform(e) || e;
		o !== e && (o.on("error", (n) => {
			this[$](n, e), t();
		}), e.pipe(o)), o.pipe(r);
	}
	[Gs](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.dmode;
		this[$s](String(e.absolute), n, (n) => {
			if (n) {
				this[$](n, e), t();
				return;
			}
			let r = 1, i = () => {
				--r === 0 && (t(), this[nc](), e.resume());
			};
			e.mtime && !this.noMtime && (r++, y.utimes(String(e.absolute), e.atime || /* @__PURE__ */ new Date(), e.mtime, i)), this[oc](e) && (r++, y.chown(String(e.absolute), Number(this[sc](e)), Number(this[cc](e)), i)), i();
		});
	}
	[Xs](e) {
		e.unsupported = !0, this.warn("TAR_ENTRY_UNSUPPORTED", `unsupported entry type: ${e.type}`, { entry: e }), e.resume();
	}
	[qs](e, t) {
		let n = K(i.relative(this.cwd, i.resolve(i.dirname(String(e.absolute)), String(e.linkpath)))).split("/");
		this[Ys](e, this.cwd, n, () => this[Ks](e, String(e.linkpath), "symlink", t), (n) => {
			this[$](n, e), t();
		});
	}
	[Js](e, t) {
		let n = K(i.resolve(this.cwd, String(e.linkpath))), r = K(String(e.linkpath)).split("/");
		this[Ys](e, this.cwd, r, () => this[Ks](e, n, "link", t), (n) => {
			this[$](n, e), t();
		});
	}
	[Ys](e, t, n, r, a) {
		let o = n.shift();
		if (this.preservePaths || o === void 0) return r();
		let s = i.resolve(t, o);
		y.lstat(s, (t, o) => {
			if (t) return r();
			if (o?.isSymbolicLink()) return a(new Ts(s, i.resolve(s, n.join("/"))));
			this[Ys](e, s, n, r, a);
		});
	}
	[tc]() {
		this[ec]++;
	}
	[nc]() {
		this[ec]--, this[ic]();
	}
	[ac](e) {
		this[nc](), e.resume();
	}
	[Us](e, t) {
		return e.type === "File" && !this.unlink && t.isFile() && t.nlink <= 1 && !uc;
	}
	[Vs](e) {
		this[tc]();
		let t = [e.path];
		e.linkpath && t.push(e.linkpath), this.reservations.reserve(t, (t) => this[Hs](e, t));
	}
	[Hs](e, t) {
		let n = (e) => {
			t(e);
		}, r = () => {
			this[$s](this.cwd, this.dmode, (t) => {
				if (t) {
					this[$](t, e), n();
					return;
				}
				this[lc] = !0, a();
			});
		}, a = () => {
			if (e.absolute !== this.cwd) {
				let t = K(i.dirname(String(e.absolute)));
				if (t !== this.cwd) return this[$s](t, this.dmode, (t) => {
					if (t) {
						this[$](t, e), n();
						return;
					}
					o();
				});
			}
			o();
		}, o = () => {
			y.lstat(String(e.absolute), (t, r) => {
				if (r && (this.keep || this.newer && r.mtime > (e.mtime ?? r.mtime))) {
					this[ac](e), n();
					return;
				}
				if (t || this[Us](e, r)) return this[Q](null, e, n);
				if (r.isDirectory()) {
					if (e.type === "Directory") {
						let t = this.chmod && e.mode && (r.mode & 4095) !== e.mode, i = (t) => this[Q](t ?? null, e, n);
						return t ? y.chmod(String(e.absolute), Number(e.mode), i) : i();
					}
					if (e.absolute !== this.cwd) return y.rmdir(String(e.absolute), (t) => this[Q](t ?? null, e, n));
				}
				if (e.absolute === this.cwd) return this[Q](null, e, n);
				fc(String(e.absolute), (t) => this[Q](t ?? null, e, n));
			});
		};
		this[lc] ? a() : r();
	}
	[Q](e, t, n) {
		if (e) {
			this[$](e, t), n();
			return;
		}
		switch (t.type) {
			case "File":
			case "OldFile":
			case "ContiguousFile": return this[Ws](t, n);
			case "Link": return this[Js](t, n);
			case "SymbolicLink": return this[qs](t, n);
			case "Directory":
			case "GNUDumpDir": return this[Gs](t, n);
		}
	}
	[Ks](e, t, n, r) {
		y[n](t, String(e.absolute), (t) => {
			t ? this[$](t, e) : (this[nc](), e.resume()), r();
		});
	}
}, gc = (e) => {
	try {
		return [null, e()];
	} catch (e) {
		return [e, null];
	}
}, _c = class extends hc {
	sync = !0;
	[Q](e, t) {
		return super[Q](e, t, () => {});
	}
	[Vs](e) {
		if (!this[lc]) {
			let t = this[$s](this.cwd, this.dmode);
			if (t) return this[$](t, e);
			this[lc] = !0;
		}
		if (e.absolute !== this.cwd) {
			let t = K(i.dirname(String(e.absolute)));
			if (t !== this.cwd) {
				let n = this[$s](t, this.dmode);
				if (n) return this[$](n, e);
			}
		}
		let [t, n] = gc(() => y.lstatSync(String(e.absolute)));
		if (n && (this.keep || this.newer && n.mtime > (e.mtime ?? n.mtime))) return this[ac](e);
		if (t || this[Us](e, n)) return this[Q](null, e);
		if (n.isDirectory()) {
			if (e.type === "Directory") {
				let [t] = this.chmod && e.mode && (n.mode & 4095) !== e.mode ? gc(() => {
					y.chmodSync(String(e.absolute), Number(e.mode));
				}) : [];
				return this[Q](t, e);
			}
			let [t] = gc(() => y.rmdirSync(String(e.absolute)));
			this[Q](t, e);
		}
		let [r] = e.absolute === this.cwd ? [] : gc(() => pc(String(e.absolute)));
		this[Q](r, e);
	}
	[Ws](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.fmode, r = (n) => {
			let r;
			try {
				y.closeSync(i);
			} catch (e) {
				r = e;
			}
			(n || r) && this[$](n || r, e), t();
		}, i;
		try {
			i = y.openSync(String(e.absolute), _s(e.size), n);
		} catch (e) {
			return r(e);
		}
		let a = this.transform && this.transform(e) || e;
		a !== e && (a.on("error", (t) => this[$](t, e)), e.pipe(a)), a.on("data", (e) => {
			try {
				y.writeSync(i, e, 0, e.length);
			} catch (e) {
				r(e);
			}
		}), a.on("end", () => {
			let t = null;
			if (e.mtime && !this.noMtime) {
				let n = e.atime || /* @__PURE__ */ new Date(), r = e.mtime;
				try {
					y.futimesSync(i, n, r);
				} catch (i) {
					try {
						y.utimesSync(String(e.absolute), n, r);
					} catch {
						t = i;
					}
				}
			}
			if (this[oc](e)) {
				let n = this[sc](e), r = this[cc](e);
				try {
					y.fchownSync(i, Number(n), Number(r));
				} catch (i) {
					try {
						y.chownSync(String(e.absolute), Number(n), Number(r));
					} catch {
						t ||= i;
					}
				}
			}
			r(t);
		});
	}
	[Gs](e, t) {
		let n = typeof e.mode == "number" ? e.mode & 4095 : this.dmode, r = this[$s](String(e.absolute), n);
		if (r) {
			this[$](r, e), t();
			return;
		}
		if (e.mtime && !this.noMtime) try {
			y.utimesSync(String(e.absolute), e.atime || /* @__PURE__ */ new Date(), e.mtime);
		} catch {}
		if (this[oc](e)) try {
			y.chownSync(String(e.absolute), Number(this[sc](e)), Number(this[cc](e)));
		} catch {}
		t(), e.resume();
	}
	[$s](e, t) {
		try {
			return js(K(e), {
				uid: this.uid,
				gid: this.gid,
				processUid: this.processUid,
				processGid: this.processGid,
				umask: this.processUmask,
				preserve: this.preservePaths,
				unlink: this.unlink,
				cwd: this.cwd,
				mode: t
			});
		} catch (e) {
			return e;
		}
	}
	[Ys](e, t, n, r, a) {
		if (this.preservePaths || n.length === 0) return r();
		let o = t;
		for (let e of n) {
			o = i.resolve(o, e);
			let [s, c] = gc(() => y.lstatSync(o));
			if (s) return r();
			if (c.isSymbolicLink()) return a(new Ts(o, i.resolve(t, n.join("/"))));
		}
		r();
	}
	[Ks](e, t, n, r) {
		let i = `${n}Sync`;
		try {
			y[i](t, String(e.absolute)), r(), e.resume();
		} catch (t) {
			return this[$](t, e);
		}
	}
}, vc = pi((e) => {
	let t = new _c(e), n = e.file, r = y.statSync(n);
	new ni(n, {
		readSize: e.maxReadSize || 16 * 1024 * 1024,
		size: r.size
	}).pipe(t);
}, (e, t) => {
	let n = new hc(e), r = e.maxReadSize || 16 * 1024 * 1024, i = e.file;
	return new Promise((e, t) => {
		n.on("error", t), n.on("close", e), y.stat(i, (e, a) => {
			if (e) t(e);
			else {
				let e = new ti(i, {
					readSize: r,
					size: a.size
				});
				e.on("error", t), e.pipe(n);
			}
		});
	});
}, (e) => new _c(e), (e) => new hc(e), (e, t) => {
	t?.length && qa(e, t);
}), yc = (e, t) => {
	let n = new ns(e), r = !0, i, a;
	try {
		try {
			i = y.openSync(e.file, "r+");
		} catch (t) {
			if (t?.code === "ENOENT") i = y.openSync(e.file, "w+");
			else throw t;
		}
		let o = y.fstatSync(i), s = Buffer.alloc(512);
		t: for (a = 0; a < o.size; a += 512) {
			for (let e = 0, t = 0; e < 512; e += t) {
				if (t = y.readSync(i, s, e, s.length - e, a + e), a === 0 && s[0] === 31 && s[1] === 139) throw Error("cannot append to compressed archives");
				if (!t) break t;
			}
			let t = new Wi(s);
			if (!t.cksumValid) break;
			let n = 512 * Math.ceil((t.size || 0) / 512);
			if (a + n + 512 > o.size) break;
			a += n, e.mtimeCache && t.mtime && e.mtimeCache.set(String(t.path), t.mtime);
		}
		r = !1, bc(e, n, a, i, t);
	} finally {
		if (r) try {
			y.closeSync(i);
		} catch {}
	}
}, bc = (e, t, n, r, i) => {
	let a = new ii(e.file, {
		fd: r,
		start: n
	});
	t.pipe(a), Sc(t, i);
}, xc = (e, t) => {
	t = Array.from(t);
	let n = new ts(e), r = (t, n, r) => {
		let i = (e, n) => {
			e ? y.close(t, (t) => r(e)) : r(null, n);
		}, a = 0;
		if (n === 0) return i(null, 0);
		let o = 0, s = Buffer.alloc(512), c = (r, l) => {
			if (r || l === void 0) return i(r);
			if (o += l, o < 512 && l) return y.read(t, s, o, s.length - o, a + o, c);
			if (a === 0 && s[0] === 31 && s[1] === 139) return i(/* @__PURE__ */ Error("cannot append to compressed archives"));
			if (o < 512) return i(null, a);
			let u = new Wi(s);
			if (!u.cksumValid) return i(null, a);
			let d = 512 * Math.ceil((u.size ?? 0) / 512);
			if (a + d + 512 > n || (a += d + 512, a >= n)) return i(null, a);
			e.mtimeCache && u.mtime && e.mtimeCache.set(String(u.path), u.mtime), o = 0, y.read(t, s, 0, 512, a, c);
		};
		y.read(t, s, 0, 512, a, c);
	};
	return new Promise((i, a) => {
		n.on("error", a);
		let o = "r+", s = (c, l) => {
			if (c && c.code === "ENOENT" && o === "r+") return o = "w+", y.open(e.file, o, s);
			if (c || !l) return a(c);
			y.fstat(l, (o, s) => {
				if (o) return y.close(l, () => a(o));
				r(l, s.size, (r, o) => {
					if (r) return a(r);
					let s = new ri(e.file, {
						fd: l,
						start: o
					});
					n.pipe(s), s.on("error", a), s.on("close", i), Cc(n, t);
				});
			});
		};
		y.open(e.file, o, s);
	});
}, Sc = (e, t) => {
	t.forEach((t) => {
		t.charAt(0) === "@" ? Ja({
			file: i.resolve(e.cwd, t.slice(1)),
			sync: !0,
			noResume: !0,
			onReadEntry: (t) => e.add(t)
		}) : e.add(t);
	}), e.end();
}, Cc = async (e, t) => {
	for (let n of t) n.charAt(0) === "@" ? await Ja({
		file: i.resolve(String(e.cwd), n.slice(1)),
		noResume: !0,
		onReadEntry: (t) => e.add(t)
	}) : e.add(n);
	e.end();
}, wc = pi(yc, xc, () => {
	throw TypeError("file is required");
}, () => {
	throw TypeError("file is required");
}, (e, t) => {
	if (!ui(e)) throw TypeError("file is required");
	if (e.gzip || e.brotli || e.zstd || e.file.endsWith(".br") || e.file.endsWith(".tbr")) throw TypeError("cannot append to compressed archives");
	if (!t?.length) throw TypeError("no paths specified to add/replace");
});
pi(wc.syncFile, wc.asyncFile, wc.syncNoFile, wc.asyncNoFile, (e, t = []) => {
	wc.validate?.(e, t), Tc(e);
});
var Tc = (e) => {
	let t = e.filter;
	e.mtimeCache ||= /* @__PURE__ */ new Map(), e.filter = t ? (n, r) => t(n, r) && !((e.mtimeCache?.get(n) ?? r.mtime ?? 0) > (r.mtime ?? 0)) : (t, n) => !((e.mtimeCache?.get(t) ?? n.mtime ?? 0) > (n.mtime ?? 0));
}, Ec = { getLogPath() {
	return n.sendSync("get-log-path");
} }, Dc = /^(?:[a-zA-Z]:[\\/]|\\\\)/;
function Oc(e) {
	return ke(e, { windows: Dc.test(e) }).href;
}
//#endregion
//#region src/preload/fs-api.ts
var kc = {
	name: "XCS Project",
	extensions: ["xcs"]
}, Ac = {
	name: "Project Archive",
	extensions: ["xs"]
}, jc = `untitled${Gn}`, Mc = /* @__PURE__ */ new Map(), Nc = 0, Pc = !1;
function Fc() {
	Pc || (Pc = !0, globalThis.addEventListener?.("beforeunload", () => {
		for (let e of Mc.values()) {
			try {
				e.stream.destroy();
			} catch {}
			try {
				ae(e.tempPath);
			} catch {}
		}
		Mc.clear();
	}));
}
function Ic(e) {
	let t = Mc.get(e);
	if (!t) throw Error(`write stream handle not found: ${e}`);
	if (t.asyncError) throw t.asyncError;
	return t;
}
async function Lc(e) {
	try {
		e.stream.destroy();
	} catch {}
	try {
		await pe(e.tempPath);
	} catch {}
}
function Rc(e) {
	let t = e?.defaultPath ?? jc, n = s(t).toLowerCase();
	return Array.isArray(e?.filters) && e.filters.length > 0 ? {
		defaultPath: t,
		...e
	} : n === ".xs" ? {
		defaultPath: t,
		filters: [Ac],
		...e
	} : {
		filters: [kc],
		defaultPath: t,
		...e
	};
}
var zc = {
	_root: null,
	get root() {
		if (this._root === null) try {
			this._root = n.sendSync("get-app-path", { name: "userData" }) ?? process.cwd();
		} catch (e) {
			console.error("Failed to get userData path:", e), this._root = process.cwd();
		}
		return this._root;
	},
	_buildPath(e) {
		return e = typeof e == "string" ? e.split("?")[0] ?? e : e, c(e) || e.startsWith(this.root) ? e : this.root ? l(this.root, e) : e;
	},
	_handleError(e, t, n) {
		let r = `${e} failed for ${t}: ${n instanceof Error ? n.message : String(n)}`;
		throw console.error(r), Error(r);
	},
	getAppPath(e) {
		try {
			return n.sendSync("get-app-path", { name: e }) ?? process.cwd();
		} catch (t) {
			return console.error(`Failed to get app path for ${e}:`, t), process.cwd();
		}
	},
	setVerboseLogging(e) {
		n.invoke("fs-set-verbose-logging", e);
	},
	buildFilePath(e) {
		return this._buildPath(e);
	},
	async exists(e) {
		try {
			return await x(this._buildPath(e)), !0;
		} catch {
			return !1;
		}
	},
	async getSize(e) {
		try {
			return (await fe(this._buildPath(e))).size;
		} catch (t) {
			this._handleError("Get size", e, t);
		}
	},
	async statFile(e) {
		try {
			let t = this._buildPath(e);
			if (!await this.exists(e)) return {
				size: 0,
				name: a(e),
				exists: !1
			};
			let n = await fe(t);
			return {
				size: n.size,
				name: a(e),
				mtime: n.mtime.getTime(),
				type: s(e).slice(1),
				exists: !0
			};
		} catch (t) {
			this._handleError("Stat file", e, t);
		}
	},
	async readText(e, t, r) {
		try {
			let i = this._buildPath(e);
			return r || await this.getSize(e) > 10 * 1024 * 1024 ? await n.invoke("fs-read-text-stream", {
				filePath: i,
				encoding: t || "utf-8"
			}) : await ce(i, { encoding: t || "utf-8" });
		} catch (t) {
			this._handleError("Read text", e, t);
		}
	},
	read2Str(e, t = "utf8") {
		return ce(e, t);
	},
	async readJSON(e) {
		try {
			let t = await this.readText(e);
			return t ? JSON.parse(t) : null;
		} catch (t) {
			this._handleError("Read JSON", e, t);
		}
	},
	async readLargeJSON(e, t) {
		try {
			return await n.invoke("fs-read-json-file", {
				filePath: this._buildPath(e),
				reviveMaps: t?.reviveMaps ?? !0
			});
		} catch (t) {
			this._handleError("Read large JSON", e, t);
		}
	},
	async readArrayBuffer(e) {
		try {
			let t = await ce(this._buildPath(e)), n = t.buffer;
			if (n instanceof ArrayBuffer) return n.slice(t.byteOffset, t.byteOffset + t.byteLength);
			{
				let e = new ArrayBuffer(t.byteLength), r = new Uint8Array(e), i = new Uint8Array(n, t.byteOffset, t.byteLength);
				return r.set(i), e;
			}
		} catch (t) {
			this._handleError("Read ArrayBuffer", e, t);
		}
	},
	async read2Buffer(e) {
		try {
			let t = await ce(this._buildPath(e));
			return new Uint8Array(t);
		} catch (t) {
			this._handleError("Read buffer", e, t);
		}
	},
	async readStream(e) {
		try {
			let t = ne(this._buildPath(e));
			return new ReadableStream({
				start(e) {
					t.on("data", (t) => {
						typeof t == "string" ? e.enqueue(new Uint8Array(Buffer.from(t))) : e.enqueue(new Uint8Array(t));
					}), t.on("end", () => e.close()), t.on("error", (t) => e.error(t));
				},
				cancel() {
					t.destroy();
				}
			});
		} catch (t) {
			this._handleError("Read stream", e, t);
		}
	},
	async readAsURL(e, t = !1) {
		return `${Oc(this._buildPath(e))}${t ? `?t=${Date.now()}` : ""}`;
	},
	pathToFileURL(e) {
		return Oc(c(e) || f.isAbsolute(e) ? e : this._buildPath(e));
	},
	async openWriteStream(e, t = {}) {
		let n = e;
		(!n || !this.exists(n) || !u(n)?.dir || t?.saveAs) && (n = await this.saveDialog(t?.save));
		let r = this._buildPath(n), i = o(r);
		/^[A-Za-z]:\\?$/.test(i) || await S(i, { recursive: !0 }), Fc();
		let a = `ws-${++Nc}-${Date.now()}`, s = `${r}.${a}.tmp`, c = b(s), l = {
			targetPath: r,
			tempPath: s,
			stream: c
		};
		return c.on("error", (e) => {
			l.asyncError = e;
		}), Mc.set(a, l), {
			handle: a,
			path: r
		};
	},
	async writeChunk(e, t) {
		let n = Ic(e), r = Buffer.from(t.buffer, t.byteOffset, t.byteLength);
		await new Promise((e, t) => {
			n.stream.write(r, (n) => n ? t(n) : e());
		});
	},
	async closeWriteStream(e) {
		let t = Ic(e);
		Mc.delete(e);
		try {
			if (await new Promise((e, n) => {
				t.stream.once("error", n), t.stream.once("finish", () => e()), t.stream.end();
			}), t.asyncError) throw t.asyncError;
			return await ue(t.tempPath, t.targetPath), t.targetPath;
		} catch (e) {
			throw await Lc(t), e;
		}
	},
	async abortWriteStream(e) {
		let t = Mc.get(e);
		t && (Mc.delete(e), await Lc(t));
	},
	async save(e, t, n = {}) {
		try {
			return (!e || !this.exists(e) || !u(e)?.dir || n?.saveAs) && (e = await this.saveDialog(n?.save)), await this.write({
				name: e,
				data: t,
				options: {
					...n,
					overwrite: !0
				}
			}), e;
		} catch (e) {
			return Promise.reject(e);
		}
	},
	async writeData(e, t, n = { overwrite: !0 }) {
		return this.write({
			name: e,
			data: t,
			options: n
		});
	},
	async write({ name: e, data: t, options: n = { overwrite: !0 }, size: r }) {
		if (!e) throw Error("write file: name is required");
		try {
			let i = this._buildPath(e), a = o(i);
			if (/^[A-Za-z]:\\?$/.test(a) ? console.debug("=> fs-api", `Skip creating root drive directory: ${a}`) : await S(a, { recursive: !0 }), !n.overwrite && await this.exists(e)) throw Error(`File ${e} already exists and overwrite option is false`);
			return await this._writeByType(i, t, r), { name: e };
		} catch (t) {
			if (t instanceof Error && "code" in t && (t.code === "EACCES" || t.code === "EPERM")) {
				let t = /* @__PURE__ */ Error(`Permission denied: ${e}`);
				throw t.code = "PERMISSION_DENIED", t;
			}
			this._handleError("Write", e, t);
		}
	},
	async _writeByType(e, t, n) {
		if (typeof t == "string") await me(e, t);
		else if (t instanceof Uint8Array || t instanceof ArrayBuffer) await me(e, (t instanceof ArrayBuffer, Buffer.from(t)));
		else if ("data" in t && t.data instanceof Uint8ClampedArray) await this._saveImageData(e, t.data, n);
		else if (t instanceof Uint8ClampedArray) await this._saveImageData(e, t, n);
		else if (t instanceof ImageData) await this._saveImageData(e, t.data, [t.width, t.height]);
		else if (t instanceof Blob) {
			let n = await t.arrayBuffer();
			await me(e, Buffer.from(n));
		} else throw console.error("Unsupported data type", t), Error("Unsupported data type");
	},
	async writeText(e, t, n) {
		try {
			let r = this._buildPath(e);
			(0, j.ensureFileSync)(r), await me(r, t, { encoding: n || "utf8" });
		} catch (t) {
			this._handleError("Write text", e, t);
		}
	},
	async writeJSON(e, t) {
		await this.writeText(e, JSON.stringify(t, null, 2));
	},
	async wrapFileContent(e, t, r, i) {
		try {
			let a = this._buildPath(r);
			await n.invoke("fs-wrap-file-content", {
				headString: e,
				tailString: t,
				filePath: a,
				encoding: i || "utf-8"
			});
		} catch (e) {
			this._handleError("Wrap file content", r, e);
		}
	},
	async copy(e, t) {
		try {
			let n = this._buildPath(e), r = this._buildPath(t);
			if (!await this.exists(e)) throw Error(`Source file ${e} does not exist`);
			await S(o(r), { recursive: !0 }), await se(n, r);
		} catch (n) {
			this._handleError("Copy", `${e} -> ${t}`, n);
		}
	},
	async copyDir(e, t) {
		try {
			let n = this._buildPath(e), r = this._buildPath(t);
			if (!await this.exists(e)) throw Error(`Source directory ${e} does not exist`);
			(0, j.ensureDirSync)(r), (0, j.copySync)(n, r);
		} catch (n) {
			this._handleError("Copy directory", `${e} -> ${t}`, n);
		}
	},
	async move(e, t) {
		try {
			let n = this._buildPath(e), r = this._buildPath(t);
			await S(o(r), { recursive: !0 }), await ue(n, r);
		} catch (n) {
			this._handleError("Move", `${e} -> ${t}`, n);
		}
	},
	async delete(e) {
		try {
			let t = this._buildPath(e);
			await this.exists(e) && await pe(t);
		} catch (t) {
			this._handleError("Delete", e, t);
		}
	},
	async ensureDir(e) {
		try {
			await S(this._buildPath(e), { recursive: !0 });
		} catch (t) {
			this._handleError("Ensure directory", e, t);
		}
	},
	async readDir(e) {
		try {
			return await le(this._buildPath(e));
		} catch (t) {
			this._handleError("Read directory", e, t);
		}
	},
	async deleteDir(e) {
		try {
			await de(this._buildPath(e), {
				recursive: !0,
				force: !0
			});
		} catch (t) {
			this._handleError("Delete directory", e, t);
		}
	},
	async clearDirectory(e, t) {
		let n = this._buildPath(e), { fileTypes: r, includeDirs: i = !0 } = t || {};
		try {
			if (!await this.exists(e)) {
				await S(n, { recursive: !0 });
				return;
			}
			let t = await le(n, { withFileTypes: !0 });
			await Promise.all(t.map(async (e) => {
				let t = l(n, e.name);
				e.isDirectory() ? i && await de(t, {
					recursive: !0,
					force: !0
				}) : (!r || r.some((t) => e.name.toLowerCase().endsWith(`.${t.toLowerCase()}`))) && await pe(t);
			}));
		} catch (t) {
			this._handleError("Clear directory", e, t);
		}
	},
	async calculateMD5(e) {
		try {
			let t = await ce(this._buildPath(e));
			return ge("md5").update(t).digest("hex");
		} catch (t) {
			this._handleError("Calculate MD5", e, t);
		}
	},
	async transformFileByLine(e) {
		let { sourcePath: t, targetPath: n, transformer: r, encoding: i = "utf-8", onProgress: a } = e, s = this._buildPath(t), c = this._buildPath(n), l = null, d = null, f = null;
		try {
			if (!await this.exists(t)) throw Error(`sourcePath not exists: ${t}`);
			let e = o(c);
			e !== u(e).root && await S(e, { recursive: !0 }), l = ne(s, { encoding: i }), d = b(c, { encoding: i }), f = ve({
				input: l,
				crlfDelay: Infinity
			});
			let n = 0;
			for await (let e of f) try {
				let t = await r.transformLine(e);
				if (t === void 0) continue;
				d.write(`${t}\n`), n++, a && n % 100 == 0 && a(n);
			} catch (e) {
				throw Error(`Transform file by line transform line error: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
			}
			return a && a(n), d && await new Promise((e, t) => {
				d.end(() => e()), d.on("error", t);
			}), { processedLines: n };
		} catch (e) {
			this._handleError("Transform file by line", `${t} -> ${n}`, e);
		} finally {
			try {
				f && f.close(), l && !l.destroyed && l.destroy(), d && !d.destroyed && d.destroy();
			} catch (e) {
				this._handleError("Transform file by line cleanup", `${t} -> ${n}`, e);
			}
		}
	},
	async download({ name: e, url: t, onProgress: r }) {
		try {
			let i = (e, t) => {
				r?.(t);
			};
			n.on("download-progress", i);
			try {
				let r = await n.invoke("fs-download-file", {
					url: t,
					path: this._buildPath(e)
				});
				return i(null, 100), r;
			} finally {
				n.off("download-progress", i);
			}
		} catch (n) {
			this._handleError("Download", `${t} -> ${e}`, n);
		}
	},
	async createTarFile(e, t, r) {
		return n.invoke("fs-create-tar-file", {
			sourcePath: e,
			sourceDir: this._buildPath(t),
			tarFilePath: this._buildPath(r)
		});
	},
	async zipDir(e, t, r) {
		return n.invoke("fs-zip-dir", {
			inputDir: this._buildPath(e),
			outputFile: this._buildPath(t),
			level: r
		});
	},
	async zipFiles(e, t, r = !1) {
		let i = await n.invoke("fs-zip-files", { files: e.map((e) => ({
			name: e.name || a(e.path),
			path: this._buildPath(e.path)
		})) });
		return t && await me(r ? t : this._buildPath(t), i), new Uint8Array(i);
	},
	async zipEntries(e, t) {
		let r = e.map((e) => "path" in e ? {
			name: e.name,
			path: this._buildPath(e.path)
		} : {
			name: e.name,
			data: e.data
		}), i = await n.invoke("fs-zip-entries", {
			entries: r,
			level: t
		});
		return new Uint8Array(i);
	},
	async zipEntriesToFile(e, t, r) {
		let i = e.map((e) => "path" in e ? {
			name: e.name,
			path: this._buildPath(e.path)
		} : {
			name: e.name,
			data: e.data
		});
		return n.invoke("fs-zip-entries-to-file", {
			entries: i,
			outputFile: this._buildPath(t),
			level: r
		});
	},
	async zipFilesToDir(e, t) {
		return n.invoke("fs-zip-files-to-dir", {
			files: e.map((e) => this._buildPath(e)),
			outputFile: this._buildPath(t)
		});
	},
	async unzipFile(e, t) {
		return n.invoke("fs-unzip-file", {
			input: this._buildPath(e),
			output: t ? this._buildPath(t) : void 0
		});
	},
	async _saveImageData(e, t, n) {
		if (!n || n.length !== 2) throw Error("Image size [width, height] is required for saving image data");
		let [r, i] = n, a = r * i * 4;
		if (t.length !== a) throw Error(`Image data length (${t.length}) does not match expected size (${a}) for ${r}x${i} RGBA image`);
		try {
			typeof globalThis < "u" && "OffscreenCanvas" in globalThis ? await this._saveImageWithCanvas(e, t, r, i) : await this._saveImageViaIPC(e, t, r, i);
		} catch (n) {
			console.error("Failed to save image using Canvas API, falling back to IPC:", n), await this._saveImageViaIPC(e, t, r, i);
		}
	},
	async _saveImageWithCanvas(e, t, n, r) {
		try {
			let i = new OffscreenCanvas(n, r), a = i.getContext("2d");
			if (!a) throw Error("Failed to get canvas 2d context");
			let o = new ImageData(t, n, r);
			a.putImageData(o, 0, 0);
			let s = await (await i.convertToBlob({ type: "image/png" })).arrayBuffer();
			await me(e, Buffer.from(s));
		} catch (e) {
			throw Error(`Canvas API save failed: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
		}
	},
	async _saveImageViaIPC(e, t, r, i) {
		try {
			await n.invoke("fs-save-image", {
				filePath: e,
				imageData: Array.from(t),
				width: r,
				height: i
			});
		} catch (e) {
			throw Error(`IPC image save failed: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
		}
	},
	resourcesPath: () => $t ? l(import.meta.dirname, "../../resources") : process.resourcesPath,
	join: l,
	path: {
		basename: a,
		extname: s,
		join: l,
		dirname: o
	},
	openDialog(e) {
		return new Promise((t, r) => {
			n.invoke("fs-open-file-dialog", e).then((e) => {
				let { canceled: n, filePaths: i } = e;
				return n ? r("CANCEL") : t(i[0]);
			});
		});
	},
	saveDialog(e, t) {
		return new Promise((r, i) => {
			let o = Rc(e);
			n.invoke("fs-open-save-dialog", o).then((e) => {
				if (console.log(e), e.canceled) return i("CANCEL");
				let { filePath: n } = e;
				if (t) {
					let e = t(a(n));
					if (e) return i(e);
				}
				return r(n);
			});
		});
	},
	unzipGzToDir(e, t) {
		let n = this._buildPath(e), r = this._buildPath(t);
		if (!re(n)) throw Error(`input file not exists. ${n}`);
		return (0, j.pathExistsSync)(r) ? (0, j.emptyDirSync)(r) : (0, j.ensureDirSync)(r), new Promise((e, t) => {
			ne(n).pipe(ye()).pipe(vc({ cwd: r })).on("finish", () => {
				console.log("解压完成"), e(!0);
			}).on("error", (e) => {
				console.error("解压出错: ", e), t(e);
			});
		});
	},
	unzipTarToDir(e, t) {
		let n = this._buildPath(e), r = this._buildPath(t);
		if (!re(n)) throw Error(`input file not exists. ${n}`);
		return (0, j.pathExistsSync)(r) ? (0, j.emptyDirSync)(r) : (0, j.ensureDirSync)(r), new Promise((e, t) => {
			ne(n).pipe(vc({ cwd: r })).on("finish", () => {
				console.log("解压完成"), e(!0);
			}).on("error", (e) => {
				console.error("解压出错: ", e), t(e);
			});
		});
	},
	async saveLargeFile(e) {
		let { opts: t, check: r, src: i } = e, o = this._buildPath(i), s = Rc(t), { filePath: c, canceled: l } = await n.invoke("fs-open-save-dialog", s);
		if (l) throw "CANCEL";
		let u = r?.(a(c));
		if (u) throw u;
		let d = ne(o), f = b(c);
		d.pipe(f);
	},
	async getLogPath() {
		return Ec.getLogPath();
	},
	async openDirectory(e) {
		return e = this._buildPath(e), n.invoke("fs-open-directory", e);
	},
	async rename(e, t) {
		return e = this._buildPath(e), n.invoke("fs-rename", {
			oldPath: e,
			newName: t
		});
	},
	async getDiskInfo(e = "/") {
		return n.invoke("fs-get-disk-info", { path: e });
	},
	async createAppendWriter(e) {
		let t = this._buildPath(e), n = o(t);
		/^[A-Za-z]:\\?$/.test(n) || await S(n, { recursive: !0 });
		let r = b(t, { flags: "w" }), i = 0, a = !1;
		return {
			write: (e) => new Promise((t, n) => {
				if (a) {
					n(/* @__PURE__ */ Error("Writer is closed"));
					return;
				}
				let o = e instanceof ArrayBuffer ? Buffer.from(e) : Buffer.from(e.buffer, e.byteOffset, e.byteLength);
				r.write(o, (e) => {
					e ? n(e) : (i += o.length, t());
				}) || r.once("drain", () => {});
			}),
			close: () => new Promise((e, t) => {
				if (a) {
					e();
					return;
				}
				a = !0, r.end((n) => {
					n ? t(n) : e();
				});
			}),
			getSize: () => i
		};
	}
}, Bc = {
	defaultSorting: async () => n.invoke("process-manager:defaultSorting"),
	onProcessData: (e) => n.on("process-manager:data", (t, n) => e(n)),
	removeProcessDataListener: (e) => {
		n.removeListener("process-manager:data", e);
	},
	onSharedWorkersData: (e) => n.on("process-manager:shared-workers", (t, n) => e(n)),
	removeSharedWorkersDataListener: (e) => {
		n.removeListener("process-manager:shared-workers", e);
	},
	openDevTools: (e) => {
		n.send("process-manager:open-dev-tools", e);
	},
	killProcess: (e) => {
		n.send("process-manager:kill-process", e);
	},
	openProcessManager: () => {
		n.invoke("process-manager:open-process-manager");
	}
}, Vc = {
	syncExtConfigFromRemote: (e) => n.invoke("sync-ext-config-from-remote", e),
	syncExtsFromRemote: (e) => n.invoke("sync-exts-from-remote", e),
	syncExtFromRemote: (e, t) => n.invoke("sync-ext-from-remote", e, t),
	addExtToTemp: (e) => n.invoke("add-ext-to-temp", e),
	getExtDownloadStatus: () => n.invoke("get-ext-download-status"),
	cancelDownload: (e) => n.send(`cancel-download-${e}`),
	syncModelsFromRemote: (e) => n.invoke("sync-models-from-remote", e),
	syncModelFromRemote: (e, t, r) => n.invoke("sync-model-from-remote", e, t, r),
	transformModelInfo: (e) => n.invoke("transform-model-info", e),
	checkModelUpdate: (e, t, r) => n.invoke("check-model-update", e, t, r),
	checkModelIsNeedUpdate: (e) => n.invoke("check-model-is-need-update", e),
	downloadModelFiles: (e, t, r, i) => n.invoke("download-model-files", e, t, r, i),
	syncLangsFromRemote: (e) => n.invoke("sync-langs-from-remote", e)
}, Hc = {
	list: () => n.invoke("serial-list"),
	mockDeviceMessage: (e, t) => {
		n.send("serial-mock-device-message", e, t);
	},
	getConnectedPortsInfo: () => n.invoke("serial-get-connected-ports-info"),
	connect: (e) => n.invoke("serial-connect", e),
	execCmd: (e, t) => n.invoke("serial-exec-cmd", e, t),
	getState: (e) => n.invoke("serial-get-state", e),
	isUploading: (e) => n.invoke("serial-is-uploading", e),
	on(e, t) {
		let r = `serial-${e}`;
		return console.debug("=> serial add event listener", r), n.removeAllListeners(r), n.on(r, t), () => {
			n.off(r, t);
		};
	},
	onCloseBroadcast: (e) => {
		let t = "serial-close-broadcast", r = (t, n) => {
			e(n);
		};
		return n.on(t, r), console.debug("=> serial add broadcast listener", t), () => {
			n.off(t, r);
		};
	},
	uploadFile: async (e, t) => {
		let { onProgress: r, onCancel: i, onBootLoaderVersionMismatch: a, ...o } = t;
		o.filePath &&= zc.buildFilePath(o.filePath);
		let s = (t, n, i) => {
			n === e && r?.(i);
		};
		i && i(Hc.cancelUploadFile.bind(null, e));
		let c = (t, n, r) => {
			n === e && a?.(r);
		};
		try {
			return n.on("serial-upload-file-progress", s), n.once("serial-upload-file-boot-loader-version-mismatch", c), await n.invoke("serial-upload-file", e, o);
		} catch (t) {
			throw t instanceof Error ? t : Error("upload file error, targetId: " + e, { cause: t });
		} finally {
			n.off("serial-upload-file-progress", s), n.off("serial-upload-file-boot-loader-version-mismatch", c);
		}
	},
	cancelUploadFile: (e) => {
		n.send("serial-upload-file-cancel", e);
	},
	stopReadGcodeFile: (e) => n.send("serial-upload-file-cancel", e),
	updateFirmware: async (e) => {
		let { port: t, url: n, useF0f7: r, onUploadProgress: i, onDownloadProgress: o, firmwarePath: s, ...c } = e;
		console.log("=> update firmware options", e);
		let l = s;
		if (n) {
			let e = a(n);
			l = await zc.download({
				url: n,
				name: e,
				onProgress: (e) => {
					o?.(e);
				}
			});
		}
		let u = r ? "f0f7" : "esptool";
		return Hc.uploadFile(t, {
			...c,
			protocolType: u,
			filePath: l,
			onProgress: i
		});
	},
	closePort: (e) => n.invoke("serial-close-port", e),
	unsubscribe: (e, t) => Promise.resolve(),
	setTargetStatus: (e, t) => (console.log("=> set target status", e, t), n.invoke("set-target-status", e, t))
}, Uc = {
	electron: !0,
	platform: process.platform,
	windowName: process.argv.find((e) => e.startsWith("--window-name="))?.split("=")[1] ?? "unknown",
	viewId: process.argv.find((e) => e.startsWith("--view-id="))?.split("=")[1] ?? "unknown",
	version: n.sendSync("get-app-version"),
	pid: process.pid,
	appSessionId: n.sendSync("get-app-session-id")
}, Wc = {
	decodeBgcFile: (e) => n.invoke("fs-decode-bgc-file", { filePath: e }),
	decodeBgcLine: (e) => n.invoke("fs-decode-bgc-line", { lineBase64: e }),
	onTabVisibilityChange: (e) => (n.on("tab-visibility-changed", e), () => {
		n.removeListener("tab-visibility-changed", e);
	}),
	onWindowStateChange: (e) => {
		let t = [
			"maximize",
			"unmaximize",
			"enter-full-screen",
			"leave-full-screen"
		];
		return t.forEach((t) => {
			n.on(t, (n) => e(n, t));
		}), () => {
			t.forEach((t) => {
				n.removeListener(t, e);
			});
		};
	},
	processManager: Bc,
	discover: {
		startDiscover: async (e, t) => await n.invoke("startDiscover", t),
		stopDiscover: async () => await n.invoke("stopDiscover"),
		getLocalIpList: async () => await n.invoke("discover:getLocalIpList"),
		discoverUnicast: async (e) => {
			console.log("[preload] discoverUnicast called with payload:", e);
			let t = await n.invoke("startUnicastDiscover", e);
			if (console.log("[preload] discoverUnicast result:", t), t instanceof Error) throw console.error("[preload] discoverUnicast returned Error:", t), t;
			return console.log(`[preload] discoverUnicast returning ${t ? `1 device: ${JSON.stringify(t, null, 2)}` : "no device"}`), t;
		},
		on: n.on.bind(n),
		off: n.off.bind(n),
		onBroadcast: (e) => {
			let t = "device:discover-broadcast", r = (t, n) => {
				e(n);
			};
			return n.on(t, r), console.debug("=> discover add broadcast listener", t), () => {
				n.off(t, r);
			};
		}
	},
	systemScan: {
		start: async (e) => await n.invoke("startSystemScan", e),
		openLocalNetworkPermissionSetting: async () => await n.invoke("openLocalNetworkPermissionSetting"),
		on: n.on.bind(n),
		off: n.off.bind(n)
	},
	usbDetect: {
		start: async () => Promise.resolve(),
		stop: async () => Promise.resolve(),
		on: (e, t) => {
			n.on(e, t);
		},
		off: (e, t) => {
			n.off(e, t);
		}
	},
	fs: zc,
	clickInspect: { sendRequest: (e) => {
		n.send("CLICK_INSPECT_REQUEST", e);
	} },
	serial: Hc,
	driver: Wn,
	isMac: Xt(),
	isArm: Qt(),
	mainWindowLoaded: () => {
		n.send("MAIN_WINDOW_LOADED");
	},
	i18n: { updateLanguage: (e) => {
		!e || Object.keys(e).length === 0 || n.send("change-language", e);
	} },
	resManager: Vc,
	aibotMessage: (e) => {
		n.send("aibot-message", e);
	},
	aibot: { onMessage: (e) => {
		let t = "message", r = (t, n) => {
			try {
				e(typeof structuredClone == "function" ? structuredClone(n) : n);
			} catch {
				e(n);
			}
		};
		return n.on(t, r), () => {
			n.off(t, r);
		};
	} },
	aiBotTesterMessage: (e) => {
		n.send("tester-message", e);
	},
	aiBotTester: { onMessage: (e) => {
		let t = "tester-response", r = (t, n) => {
			try {
				e(typeof structuredClone == "function" ? structuredClone(n) : n);
			} catch {
				e(n);
			}
		};
		return n.on(t, r), () => {
			n.off(t, r);
		};
	} },
	onExternalCall: (e) => {
		let t = (t, n) => e(n);
		return n.on("is-external-call", t), () => {
			n.removeListener("is-external-call", t);
		};
	}
};
//#endregion
//#region src/preload/worker.ts
function Gc() {
	n.on("worker-connect", (e, t) => {
		let n = e.ports[0];
		document.readyState === "complete" ? window.postMessage({
			type: "electron:worker-connect",
			portId: t.portId
		}, "*", [n]) : window.addEventListener("load", () => {
			window.postMessage({
				type: "electron:worker-connect",
				portId: t.portId
			}, "*", [n]);
		});
	});
}
//#endregion
//#region ../../../../../node_modules/.pnpm/@sentry+electron@6.11.0/node_modules/@sentry/electron/esm/preload/index.js
var Kc;
(function(e) {
	e[e.Classic = 1] = "Classic", e[e.Protocol = 2] = "Protocol", e[e.Both = 3] = "Both";
})(Kc ||= {});
var qc;
if ((function(e) {
	e.RENDERER_START = "sentry-electron.renderer-start", e.SCOPE = "sentry-electron.scope", e.ENVELOPE = "sentry-electron.envelope", e.STATUS = "sentry-electron.status", e.STRUCTURED_LOG = "sentry-electron.structured-log";
})(qc ||= {}), window.__SENTRY_IPC__) console.log("Sentry Electron preload has already been run");
else {
	let e = {
		sendRendererStart: () => n.send(qc.RENDERER_START),
		sendScope: (e) => n.send(qc.SCOPE, e),
		sendEnvelope: (e) => n.send(qc.ENVELOPE, e),
		sendStatus: (e) => n.send(qc.STATUS, e),
		sendStructuredLog: (e) => n.send(qc.STRUCTURED_LOG, e)
	};
	if (window.__SENTRY_IPC__ = e, t) try {
		t.exposeInMainWorld("__SENTRY_IPC__", e);
	} catch {}
}
//#endregion
//#region src/preload/index.ts
var Jc = { closeAllConnections: () => n.invoke("net-debug:close-all-connections") };
if (process.contextIsolated) try {
	Yt(t, r), t.exposeInMainWorld("__electronAPI__", {
		appInfo: Uc,
		...Wc
	}), t.exposeInMainWorld("__netDebug__", Jc);
} catch (e) {
	console.error(e);
}
else window.__electronAPI__ = {
	appInfo: Uc,
	...Wc
}, window.__netDebug__ = Jc;
Gc();
//#endregion
