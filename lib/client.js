window.__ModuleLoader__.load({
	id: "dsh-voice-input",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region \0dsh-css:D:\Desktop\dsh-plugins\voice-input\src\client\panel.module.css.mjs
		const css = ".fAG8gq_vmicBtn{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;font-size:15px;transition:background .15s,color .15s;display:inline-flex}.fAG8gq_vmicBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.fAG8gq_vmicBtnOn{background:var(--dsw-alias-state-error-primary);color:#fff;animation:1.2s ease-in-out infinite fAG8gq_vmicPulse}@keyframes fAG8gq_vmicPulse{0%,to{box-shadow:0 0 #e5484d80}50%{box-shadow:0 0 0 6px #e5484d00}}.fAG8gq_vmicPill{z-index:70;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-overlay);max-width:min(520px,100vw - 40px);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv2);pointer-events:none;border-radius:12px;padding:10px 16px;font-size:14px;position:fixed;bottom:150px;left:50%;transform:translate(-50%)}.fAG8gq_vmicErr{color:var(--dsw-alias-state-error-primary)}";
		const tagId = "dsh-voice-input/panel.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-voice-input";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var panel_module_css_default = {
			"vmicErr": "fAG8gq_vmicErr",
			"vmicPulse": "fAG8gq_vmicPulse",
			"vmicBtn": "fAG8gq_vmicBtn",
			"vmicPill": "fAG8gq_vmicPill",
			"vmicBtnOn": "fAG8gq_vmicBtnOn"
		};
		//#endregion
		//#region src/client/index.ts
		/** Required client services. */
		const inject = ["slots"];
		const subs = /* @__PURE__ */ new Set();
		const store = {
			listening: false,
			text: "",
			error: "",
			patch(p) {
				Object.assign(store, p);
				subs.forEach((f) => f());
			},
			subscribe(f) {
				subs.add(f);
				return () => subs.delete(f);
			}
		};
		function useStore() {
			const [, force] = react.useState(0);
			react.useEffect(() => store.subscribe(() => force((x) => x + 1)), []);
			return store;
		}
		let recognition = null;
		let latestDraft = "";
		let accumulated = "";
		let shouldStop = false;
		function startListening(inputActions) {
			const w = window;
			const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
			if (SR === void 0) {
				store.patch({
					error: "此浏览器不支持语音识别，请用 Chrome/Edge",
					listening: false
				});
				return;
			}
			const rec = new SR();
			rec.lang = "zh-CN";
			rec.interimResults = true;
			rec.continuous = true;
			shouldStop = false;
			accumulated = "";
			rec.onresult = (event) => {
				let interim = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const r = event.results[i];
					if (r === void 0) continue;
					const first = r[0];
					if (first === void 0) continue;
					if (r.isFinal) accumulated += first.transcript;
					else interim += first.transcript;
				}
				store.patch({ text: accumulated + interim });
			};
			rec.onerror = (event) => {
				const err = event.error ?? "识别出错";
				if (err === "no-speech" || err === "aborted") return;
				shouldStop = true;
				store.patch({
					listening: false,
					text: "",
					error: err
				});
				recognition = null;
			};
			rec.onend = () => {
				if (shouldStop) {
					store.patch({
						listening: false,
						text: "",
						error: ""
					});
					if (accumulated) {
						const draft = latestDraft;
						inputActions?.setDraft?.(draft ? `${draft} ${accumulated}` : accumulated);
					}
					recognition = null;
				} else try {
					rec.start();
				} catch {}
			};
			recognition = rec;
			store.patch({
				listening: true,
				text: "",
				error: ""
			});
			rec.start();
		}
		function MicButton(props) {
			const s = useStore();
			latestDraft = props.input?.draft ?? "";
			const listening = s.listening;
			return react.createElement("button", {
				type: "button",
				className: `${panel_module_css_default.vmicBtn}${listening ? ` ${panel_module_css_default.vmicBtnOn}` : ""}`,
				title: listening ? "停止" : "语音输入",
				"aria-label": "语音输入",
				onClick: () => {
					if (listening) {
						shouldStop = true;
						if (recognition) try {
							recognition.stop();
						} catch {
							store.patch({
								listening: false,
								text: "",
								error: ""
							});
						}
						else store.patch({
							listening: false,
							text: "",
							error: ""
						});
					} else startListening(props.inputActions);
				}
			}, "🎤");
		}
		function LivePill() {
			const s = useStore();
			if (!s.listening && !s.error) return null;
			return react.createElement("div", { className: panel_module_css_default.vmicPill }, s.error ? react.createElement("span", { className: panel_module_css_default.vmicErr }, s.error) : s.text || "正在聆听…（点 🎤 停止）");
		}
		/** Mount the mic button into the composer tool row and the live transcript pill. */
		function apply(ctx) {
			ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
				name: "conversation.input.left",
				id: "voice-input",
				order: 100,
				label: "语音输入"
			}, (props) => react.createElement(MicButton, props)));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "voice-input-pill",
				order: 100,
				label: "语音输入"
			}, () => react.createElement(LivePill, null)));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map