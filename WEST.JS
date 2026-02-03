// ==UserScript==
// @name         sheet filler by ida
// @namespace    http://tampermonkey.net/
// @version      14.3
// @description  Made by a unkown fiber one G
// @author       idris adeleke
// @match        https://intranet.fob.ng/crm/type/163/details/*
// @match        https://intranet.fob.ng/page/onboarding_applications/installation/type/188/details/*
// @match        https://intranet.fob.ng/crm/type/163/list/category/0/*
// @match        https://intranet.fob.ng/page/onboarding_applications/installation/type/188/list/*
// @match        https://intranet.fob.ng/page/onboarding_applications/installation/*
// @match        https://intranet.fob.ng/crm/type/*/details/*
// @match        https://intranet.fob.ng/page/onboarding_applications/relocation/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        window.close
// @require      https://cdn.jsdelivr.net/npm/jsrsasign@10.8.6/lib/jsrsasign-all-min.js
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
	'use strict';
	// Unique ID for this script instance/tab
	let SESSION_ID;
	try {
		SESSION_ID = sessionStorage.getItem('ULTRA_SESSION_ID');
		if (!SESSION_ID) {
			SESSION_ID = Math.random().toString(36).substring(2, 8).toUpperCase();
			sessionStorage.setItem('ULTRA_SESSION_ID', SESSION_ID);
		}
	} catch (e) {
		SESSION_ID = Math.random().toString(36).substring(2, 8).toUpperCase();
	}
	window.SESSION_ID = SESSION_ID;

	// ========== SERVICE ACCOUNT CREDENTIALS ==========
	const SERVICE_ACCOUNT = {
		"type": "service_account",
		"project_id": "ethical-456512",
		"private_key_id": "bb41df7d435b03e28671517dd8821336cb3ddcf4",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+3AdauNihasEZ\nHHLUt63Pgv9RP1tz84bkTS+gWiQnzC5iyIIQmhEXOhSW11DKKIFPXHqYfYZKZC3a\nUomRMjg24JtT9VA2tAaeyuDYHlrElmG9/+zwNtZMMMpEm3hSs2Cu5x7ENd3UP9t2\n6iOtU13iPujDwC/IQAB1bOr6N4pbgixXq7VTLalj34wpyZWRTM+G1fwU+wBbyGdP\nypzcY/9SUy9Uhg++vP3NnaQTzuhf0LYDsE9U4c7h9E4HSNQSZLozISbX2J435KTz\nlg6EQBtW7VWPBl5vImyGdDuCsibrlj/hkvCBghEiPnapL1s6SGnEZFh4z9yjKhNn\ncSHNA5UxAgMBAAECggEAB3V/ZxUCyFos9j+FoFkWVp4KvuDgQNmTW8BFfHmRYKnK\n5UrrRF1VDiiTrep3ypLHLPQTCXscYLNmFFp17GH/Tuu7vk3/xseF27ZXj7Kt/vFW\nnA+Qsbme6ebdPM2rp+XBQUygh/AH/ZfKSq0vXEJ+EI2/WIkeBPA1ZGFvlHxPsLBG\nJAyMTmZ0QQw0AHmnZHIL1PS//LNbT/X+yn9r7rLy4q7hdzbwhp+jVOf+TvFP3mvq\nPygSpkWsxRA4vHecKGboTFjy086+xyAtou72FxbpvSSNGg81jeD7IUbngKEn5L9Q\nhVJWQrr5YDJCdRC1HyNtv8sQ64MaKgesVLN5AwkuDQKBgQDlDCHPxveiFEuUMB/O\nyXQNrI4g51KnOHUXduXjG8/Dh09LRWovtQfLuWF1Uh90Jtoc0UnefRQxLByiBHgl\np41vA6/WupWEC5+evtrEEELPnkweF7SMrxE4JZdxpaVVcLi4u64cMR4ZIsFBbC+X\n+E1oHPaoGG6brqxjQo1NqnX99QKBgQDVUYRQWcjdzlIFWdNeklQ4HqOd9pM7chsw\nac0rSOY8Lf2BDD6ou83wIb746g26EKeR998tHdYoXmk4jGnRrIcDS4EWd4LDOnEt\nLQAno9c7Rg6DivqZvmocPUbCQ4jBZcE9a5/BPdngJIHqUT9pt4SgISM0OrIyUu+l\ndj6wIG9YzQKBgQC6SXG+gb6qLgOCVNmp36Lp9CvsivdoVby2BtfWLKqABq7xM1W3\n026xvOaM+uvmFitTQMzpjaU8kPoAs83cIjgf0EnVRQ+Rw7pg7C0VRXxxS/fwiaso\nuMIyfjB8GBMuOG2kodBr0W7/VosDYLAc07BxOw1JjgV3zUsbt+chAcDReQKBgQCt\nzot2RJGLWA4wWe4EwkloqF472KpB50kL+0i2GeGt6vMAcI+lP9Ad9gD6IwooLmW6\nYzIuOn9ByRsGfjHCK0aegqidO6cJltacLmxP4AkAPKaau2RQXHtsoujCY/BLU7NN\nbiFufAzHujc4ShbW9jZTmmxqo+CJbFXihSOysdrHiQKBgAYScMQNHq3SrucmUSHz\nXvci0RSF7s8o5fZMR3oseMyZhuOt0EkWmu9t3dwwoqdpu13KIl4JAHKiD0ijl/A2\nTF4ffUe8mHXH/38CNVg1tNqSue8tocP+tF6E1Q3sYxi4j9+gTbbOyZy1Ao3IKcEo\nRl0TjgI3HonPHyvlKBOLDvRx\n-----END PRIVATE KEY-----\n",
		"client_email": "sheets-access@ethical-456512.iam.gserviceaccount.com",
		"client_id": "108403817676871259513",
		"token_uri": "https://oauth2.googleapis.com/token"
	};

	// ========== CONFIGURATION ==========
	const CONFIG = {
		SPREADSHEET_ID: '1PhfkshRwLv0lG7ZjGcarIvoMmu9EFi4O6V7uAWWbz6Y',
		AUTO_EXTRACT_DELAY: 500,
		TURBO_MODE: false,
		MAX_SCAN_TIME: 20000,
		CACHE_EXPIRY: 600000, // 10 minutes cache for sheets data
		SERVICE_ID_COLUMNS: {
			SUPPORT: 'C',     // Column C for Support tickets
			INSTALLATION: 'K'  // Column K for Installation tickets
		},
		// Performance settings
		MAX_BATCH_SIZE: 5,
		NETWORK_THROTTLE: 2000,
		USE_CACHE_AGGRESSIVELY: true,
		DISABLE_VISUAL_LOGGER: false,
		DISABLE_AUDIO_KEEPALIVE: false,
		SIMPLE_DOM_SCAN: false
	};

	// ========== PERFORMANCE PROFILES ==========
	const PERFORMANCE_PROFILES = {
		'LOW_POWER': {
			MAX_BATCH_SIZE: 2,
			NETWORK_THROTTLE: 3000,
			DISABLE_VISUAL_LOGGER: true,
			SIMPLE_DOM_SCAN: true
		},
		'BALANCED': {
			MAX_BATCH_SIZE: 5,
			NETWORK_THROTTLE: 1500,
			DISABLE_VISUAL_LOGGER: false,
			SIMPLE_DOM_SCAN: false
		},
		'HIGH_PERFORMANCE': {
			MAX_BATCH_SIZE: 10,
			NETWORK_THROTTLE: 500,
			DISABLE_VISUAL_LOGGER: false,
			SIMPLE_DOM_SCAN: false,
			TURBO_MODE: true
		}
	};

	function detectPerformanceProfile() {
		// Simple heuristic based on logical cores
		if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return 'LOW_POWER';
		if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) return 'HIGH_PERFORMANCE';
		return 'BALANCED';
	}

	// Apply profile
	const userProfile = detectPerformanceProfile();
	Object.assign(CONFIG, PERFORMANCE_PROFILES[userProfile]);

	// ========== SHEET MAPPING CONFIG ==========
	const DEFAULT_SHEET_MAPPING = {
		SUPPORT: {
			serviceIdColumn: 'B',
 writeColumns: {
	 ticketId: 'C',
 created: 'D',
 escalated: 'E',
 resolved: 'F',
 mttr: 'G',
 slaMet: 'H'
 }
		},
 INSTALLATION: {
	 serviceIdColumn: 'J',
 writeColumns: {
	 created: 'K',
 escalated: 'L',
 resolved: 'M',
 mttr: 'N',
 slaMet: 'O'
 }
 },
 RELOCATION: {
	 serviceIdColumn: 'Q',
 writeColumns: {
	 created: 'R',
 sdEscalated: 'S',
 ismEscalated: 'T',
 mttr: 'U'
 }
 }
	};

	// Load custom mapping or use default
	// FORCE: Always use the code-defined mapping to ensure edits take effect immediately
	let SHEET_MAPPING = DEFAULT_SHEET_MAPPING;
	// Update storage to match current code configuration
	GM_setValue('ULTRA_SHEET_MAPPING', SHEET_MAPPING);

	function saveSheetMapping() {
		GM_setValue('ULTRA_SHEET_MAPPING', SHEET_MAPPING);
	}

	// ========== KEEP ALIVE MANAGER ==========
	class KeepAliveManager {
		static init() {
			if (this.initialized) return;
			this.initialized = true;

			if (CONFIG.DISABLE_AUDIO_KEEPALIVE) return;

			VisualLogger.info('🛡️ Initializing Background Persistence Protocols...');

			// 1. Web Worker Heartbeat (Bypasses main thread throttling)
			try {
				const blob = new Blob([`
				self.onmessage = function(e) {
					if (e.data === 'start') {
						setInterval(() => {
							self.postMessage('tick');
						}, 1000);
					}
				};
				`], { type: 'text/javascript' });

				this.worker = new Worker(window.URL.createObjectURL(blob));
				this.worker.onmessage = () => {
					// This forces the main thread to wake up to handle the message
					this.lastTick = Date.now();
				};
				this.worker.postMessage('start');
				VisualLogger.success('✅ Worker Heartbeat Active');
			} catch (e) {
				VisualLogger.warn('⚠️ Worker Heartbeat Failed: ' + e.message);
			}

			// 2. Audio Context Keep-Alive (Prevents tab suspension in some browsers)
			try {
				const AudioContext = window.AudioContext || window.webkitAudioContext;
				if (AudioContext) {
					const ctx = new AudioContext();
					const osc = ctx.createOscillator();
					const gain = ctx.createGain();
					osc.connect(gain);
					gain.connect(ctx.destination);
					osc.frequency.value = 100;
					gain.gain.value = 0.0001; // Inaudible but active
					osc.start();
					// Loop a tiny noise every 30s to ensure context stays active
					setInterval(() => {
						if (ctx.state === 'suspended') ctx.resume();
						const g = ctx.createGain();
						g.gain.value = 0.0001;
						g.connect(ctx.destination);
						const o = ctx.createOscillator();
						o.connect(g);
						o.start();
						o.stop(ctx.currentTime + 0.1);
					}, 30000);
					VisualLogger.success('✅ Audio Keep-Alive Active');
				}
			} catch (e) {}

			// 3. Title Flasher (Visual + Activity)
			setInterval(() => {
				if (document.hidden) {
					const state = StateManager.getState();
					const status = state.active ? (state.isPaused ? '⏸' : '▶') : '⏹';
					const q = state.queue.length;
					document.title = `${status} [${q}] ${new Date().toLocaleTimeString()}`;
				}
			}, 1000);
		}
	}

	// ========== PERFORMANCE MONITORING ==========
	class PerformanceMonitor {
		constructor() {
			this.metrics = {
				startTime: Date.now(),
 apiCalls: 0,
 domScans: 0,
 memoryUsage: [],
 networkLatency: []
			};
		}

		logMetric(type, value) {
			this.metrics[type] = (this.metrics[type] || 0) + 1;

			// Auto-throttle if performance is poor
			if (type === 'apiCalls' && this.metrics.apiCalls > 50) {
				CONFIG.NETWORK_THROTTLE = Math.min(5000, CONFIG.NETWORK_THROTTLE * 1.5);
			}
		}
	}

	function checkConnectionQuality() {
		return new Promise((resolve) => {
			const testImage = new Image();
			const startTime = Date.now();

			testImage.onload = () => {
				const latency = Date.now() - startTime;
				let quality = 'GOOD';

				if (latency > 3000) quality = 'POOR';
				else if (latency > 1000) quality = 'SLOW';

				resolve({ quality, latency });
			};

			testImage.onerror = () => resolve({ quality: 'POOR', latency: 9999 });
			testImage.src = 'https://www.google.com/favicon.ico?' + Date.now();
		});
	}

	function checkSystemResources() {
		const warnings = [];
		// Check memory
		if (performance.memory) {
			const usedMB = performance.memory.usedJSHeapSize / 1024 / 1024;
			if (usedMB > 500) warnings.push(`High memory usage: ${Math.round(usedMB)}MB`);
		}
		return warnings;
	}

	class AdaptiveProcessor {
		constructor() {
			this.currentMode = 'BALANCED';
		}

		async adjustSettings() {
			const conn = await checkConnectionQuality();

			switch(conn.quality) {
				case 'POOR':
					this.currentMode = 'CONSERVATIVE';
					CONFIG.NETWORK_THROTTLE = 3000;
					CONFIG.MAX_BATCH_SIZE = 2;
					CONFIG.TURBO_MODE = false;
					break;

				case 'SLOW':
					this.currentMode = 'BALANCED';
					CONFIG.NETWORK_THROTTLE = 1500;
					CONFIG.MAX_BATCH_SIZE = 3;
					CONFIG.TURBO_MODE = false;
					break;

				case 'GOOD':
					this.currentMode = 'FAST';
					CONFIG.NETWORK_THROTTLE = 500;
					CONFIG.MAX_BATCH_SIZE = 10;
					CONFIG.TURBO_MODE = true;
					break;
			}
		}
	}

	// ========== SOUND MANAGER ==========
	class SoundManager {
		static getContext() {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			if (!this._ctx) {
				this._ctx = new AudioContext();
			}
			if (this._ctx.state === 'suspended') {
				this._ctx.resume();
			}
			return this._ctx;
		}

		static playSuccess() {
			try {
				const ctx = this.getContext();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.type = 'sine';
				osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
				osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
				osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
				gain.gain.setValueAtTime(0.05, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
				osc.start();
				osc.stop(ctx.currentTime + 0.4);
			} catch (e) {}
		}

		static playError() {
			try {
				const ctx = this.getContext();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.type = 'sawtooth';
				osc.frequency.setValueAtTime(220, ctx.currentTime);
				osc.frequency.setValueAtTime(165, ctx.currentTime + 0.2);
				gain.gain.setValueAtTime(0.05, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
				osc.start();
				osc.stop(ctx.currentTime + 0.5);
			} catch (e) {}
		}

		static playAttention() {
			try {
				const ctx = this.getContext();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.type = 'triangle';

				const now = ctx.currentTime;
				osc.frequency.setValueAtTime(440, now);
				gain.gain.setValueAtTime(0.1, now);
				gain.gain.linearRampToValueAtTime(0, now + 0.15);

				osc.frequency.setValueAtTime(554.37, now + 0.2); // C#5
				gain.gain.setValueAtTime(0.1, now + 0.2);
				gain.gain.linearRampToValueAtTime(0, now + 0.35);

				osc.start(now);
				osc.stop(now + 0.4);
			} catch (e) {}
		}
	}

	// ========== HISTORY MANAGER ==========
	class HistoryManager {
		static getHistory() {
			return GM_getValue('EXTRACTION_HISTORY', []);
		}

		static addEntry(id, status, sheet, type = '', row = '') {
			const history = this.getHistory();
			const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			const date = new Date().toLocaleDateString();
			history.unshift({
				id,
				status,
				sheet,
				type,
				row,
				time,
				date,
				timestamp: Date.now()
			});
			if (history.length > 10) history.pop();
			GM_setValue('EXTRACTION_HISTORY', history);
		}

		static getStats() {
			const history = this.getHistory();
			const stats = {
				total: history.length,
				success: history.filter(h => h.status === 'Success').length,
 failed: history.filter(h => h.status !== 'Success').length,
 recent: history.slice(0, 5)
			};
			return stats;
		}
	}

	// ========== STYLES ==========
	GM_addStyle(`
	/* MAIN DIALOG */
	.ultra-dialog {
		position: fixed; top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(15, 23, 42, 0.95); z-index: 2147483647;
		display: flex; align-items: center; justify-content: center;
		padding: 20px;
		backdrop-filter: blur(10px);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		animation: fadeIn 0.3s ease-out;
		pointer-events: auto;
	}
	@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

	.ultra-card {
		background: linear-gradient(145deg, #1e293b, #0f172a);
		padding: 35px; border-radius: 20px;
		max-width: 550px; width: 90%;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		max-height: 90vh;
		overflow-y: auto;
		animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
	}
	@keyframes slideUp {
		from { transform: translateY(30px) scale(0.95); opacity: 0; }
		to { transform: translateY(0) scale(1); opacity: 1; }
	}

	/* TITLE BAR */
	.ultra-title {
		display: flex; align-items: center; gap: 12px;
		margin-bottom: 25px; padding-bottom: 15px;
		border-bottom: 2px solid rgba(56, 189, 248, 0.3);
		cursor: grab;
	}
	.ultra-title-icon {
		font-size: 32px; color: #38bdf8;
	}
	.ultra-title-text {
		flex: 1;
	}
	.ultra-title-main {
		color: #f8fafc; font-size: 24px; font-weight: 800;
		letter-spacing: -0.5px; margin: 0;
	}
	.ultra-title-sub {
		color: #94a3b8; font-size: 13px; margin: 4px 0 0;
		font-weight: 500;
	}

	/* INPUT AREA */
	.ultra-input-container {
		margin-bottom: 25px;
	}
	.ultra-input-label {
		display: block; color: #cbd5e1; font-size: 13px;
		font-weight: 600; margin-bottom: 8px; text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.ultra-input {
		width: 100%; padding: 18px 20px; background: rgba(30, 41, 59, 0.7);
		border: 2px solid #334155; border-radius: 12px;
		color: #f1f5f9; font-size: 16px; font-family: 'JetBrains Mono', monospace;
		transition: all 0.3s ease; resize: vertical; min-height: 100px;
		box-sizing: border-box;
	}
	.ultra-input:focus {
		outline: none; border-color: #38bdf8;
		box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
		background: rgba(30, 41, 59, 0.9);
	}
	.ultra-input::placeholder {
		color: #64748b; font-style: italic;
	}

	/* BATCH QUEUE DISPLAY */
	.ultra-queue {
		background: rgba(30, 41, 59, 0.7); border-radius: 12px;
		margin-bottom: 20px; overflow: hidden;
	}
	.ultra-queue-header {
		display: flex; justify-content: space-between; align-items: center;
		padding: 12px 16px; background: rgba(15, 23, 42, 0.8);
		border-bottom: 1px solid #334155;
	}
	.ultra-queue-title {
		display: flex; align-items: center; gap: 8px;
		color: #cbd5e1; font-size: 13px; font-weight: 600;
	}
	.ultra-queue-badge {
		background: #38bdf8; color: #0f172a; padding: 2px 10px;
		border-radius: 12px; font-size: 12px; font-weight: 800;
	}
	.ultra-queue-controls {
		display: flex; gap: 8px;
	}
	.ultra-queue-control {
		background: transparent; border: 1px solid #475569;
		color: #94a3b8; padding: 4px 10px; border-radius: 6px;
		font-size: 11px; cursor: pointer; transition: all 0.2s;
	}
	.ultra-queue-control:hover {
		background: #475569; color: #f1f5f9;
	}
	.ultra-queue-items {
		max-height: 150px; overflow-y: auto;
		padding: 8px 0;
	}
	.ultra-queue-item {
		display: flex; justify-content: space-between; align-items: center;
		padding: 8px 16px; font-size: 13px; border-bottom: 1px solid rgba(51, 65, 85, 0.3);
		color: #cbd5e1;
	}
	.ultra-queue-item:last-child { border-bottom: none; }
	.ultra-queue-row { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
	.ultra-queue-status {
		font-size: 11px; padding: 2px 8px; border-radius: 10px;
		background: #334155; color: #94a3b8;
	}

	/* BUTTONS */
	.ultra-buttons {
		display: flex; gap: 12px; margin-top: 25px;
	}
	.ultra-btn {
		flex: 1; padding: 16px; border: none; border-radius: 12px;
		font-size: 15px; font-weight: 700; cursor: pointer;
		transition: all 0.3s; display: flex; align-items: center;
		justify-content: center; gap: 10px;
	}
	.ultra-btn-primary {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
	}
	.ultra-btn-primary:hover {
		transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
	}
	.ultra-btn-danger {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: white;
	}
	.ultra-btn-danger:hover {
		transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
	}
	.ultra-btn-secondary {
		background: #475569; color: #f1f5f9;
	}
	.ultra-btn-secondary:hover {
		background: #64748b; transform: translateY(-2px);
	}

	/* TOGGLE SWITCH */
	.ultra-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
	.ultra-toggle-input { display: none; }
	.ultra-toggle-slider { width: 40px; height: 20px; background: #475569; border-radius: 20px; position: relative; transition: 0.3s; }
	.ultra-toggle-slider::before { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: 0.3s; }
	.ultra-toggle-input:checked + .ultra-toggle-slider { background: #3b82f6; }
	.ultra-toggle-input:checked + .ultra-toggle-slider::before { transform: translateX(20px); }
	.ultra-toggle-label { color: #cbd5e1; font-size: 13px; font-weight: 600; }

	/* HISTORY PANEL */
	.ultra-history {
		margin-top: 20px; background: rgba(30, 41, 59, 0.7);
		border-radius: 12px; overflow: hidden;
	}
	.ultra-history-header {
		padding: 12px 16px; background: rgba(15, 23, 42, 0.8);
		border-bottom: 1px solid #334155; color: #cbd5e1;
		font-size: 13px; font-weight: 600; display: flex;
		align-items: center; gap: 8px;
	}
	.ultra-history-items {
		max-height: 180px; overflow-y: auto; padding: 8px 0;
	}
	.ultra-history-item {
		display: flex; justify-content: space-between; align-items: center;
		padding: 10px 16px; border-bottom: 1px solid rgba(51, 65, 85, 0.3);
		font-size: 13px;
	}
	.ultra-history-item:last-child { border-bottom: none; }
	.ultra-history-info { display: flex; flex-direction: column; gap: 2px; }
	.ultra-history-id { color: #f1f5f9; font-weight: 600; font-family: 'JetBrains Mono'; }
	.ultra-history-meta { color: #94a3b8; font-size: 11px; }
	.ultra-history-status {
		font-size: 11px; padding: 4px 10px; border-radius: 10px;
		font-weight: 700; min-width: 70px; text-align: center;
		color: #fff;
	}
	.ultra-history-success { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
	.ultra-history-fail { background: rgba(239, 68, 68, 0.2); color: #f87171; }

	/* LOADING OVERLAY */
	.ultra-loading {
		position: fixed; top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(15, 23, 42, 0.95); z-index: 1000000;
		display: flex; flex-direction: column; align-items: center;
		justify-content: center; backdrop-filter: blur(10px);
	}
	.ultra-loading-spinner {
		width: 60px; height: 60px; border: 4px solid #334155;
		border-top: 4px solid #3b82f6; border-radius: 50%;
		animation: spin 1s linear infinite; margin-bottom: 20px;
	}
	@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
	.ultra-loading-text {
		color: #f1f5f9; font-size: 18px; font-weight: 600;
		margin-bottom: 10px;
	}
	.ultra-loading-details {
		color: #94a3b8; font-size: 14px; max-width: 80%;
		text-align: center; line-height: 1.5;
	}

	/* TOAST NOTIFICATION */
	.ultra-toast {
		position: fixed; bottom: 30px; right: 30px;
		background: linear-gradient(135deg, #1e293b, #0f172a);
		color: #f1f5f9; padding: 16px 20px; border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		border: 1px solid #334155; z-index: 1000001;
		min-width: 300px; max-width: 400px;
		animation: slideInRight 0.3s ease-out;
		display: flex; align-items: center; gap: 12px;
	}
	@keyframes slideInRight {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	.ultra-toast-icon {
		font-size: 24px; flex-shrink: 0;
	}
	.ultra-toast-success .ultra-toast-icon { color: #4ade80; }
	.ultra-toast-error .ultra-toast-icon { color: #f87171; }
	.ultra-toast-warning .ultra-toast-icon { color: #fbbf24; }
	.ultra-toast-info .ultra-toast-icon { color: #38bdf8; }
	.ultra-toast-content { flex: 1; }
	.ultra-toast-title {
		font-weight: 700; font-size: 14px; margin-bottom: 4px;
	}
	.ultra-toast-message {
		font-size: 13px; color: #cbd5e1; line-height: 1.4;
	}

	/* FLOATING ACTION BUTTON */
	#promptFAB {
	position: fixed; bottom: 30px; right: 30px; z-index: 2147483647;
	}
	.ultra-fab {
		width: 70px; height: 70px; background: linear-gradient(135deg, #f59e0b, #d97706);
		border-radius: 50%; display: flex; align-items: center;
		justify-content: center; font-size: 32px; color: white;
		cursor: pointer; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
		border: 3px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s; animation: pulse 2s infinite;
	}
	.ultra-fab:hover {
		transform: scale(1.1) rotate(10deg); box-shadow: 0 12px 30px rgba(245, 158, 11, 0.6);
	}
	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
	.ultra-history-partial { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

	/* MTTR Results Styling */
	.mttr-result-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid rgba(51, 65, 85, 0.3);
	}
	.mttr-result-item:last-child {
		border-bottom: none;
	}
	.mttr-result-label {
		color: #94a3b8;
	}
	.mttr-result-value {
		color: #f1f5f9;
		font-weight: 600;
	}

	/* Context Menu */
	#fabContextMenu {
	animation: fadeIn 0.2s ease-out;
	}

	/* MTTR Mode Buttons */
	.mttr-mode-btn.selected {
		border-color: #38bdf8 !important;
		color: #fff !important;
		background: rgba(56, 189, 248, 0.1);
	}

	.mttr-type-btn.selected {
		border-color: #38bdf8 !important;
		color: #fff !important;
		background: rgba(56, 189, 248, 0.1);
	}
	`);

	// ========== VISUAL LOGGER ==========
	class VisualLogger {
		static monitor = new PerformanceMonitor();

		static init() {
			if (document.getElementById('ultraLogger')) return;

			const div = document.createElement('div');
			div.id = 'ultraLogger';
			div.innerHTML = `
			<div class="logger-header">
			<span>📡 ULTRA TERMINAL v2.0</span>
			<div class="logger-controls">
			<span id="loggerMinimize" title="Minimize">_</span>
			<span id="loggerClear" title="Clear">🗑️</span>
			<span id="loggerClose" title="Close">×</span>
			</div>
			</div>
			<div class="logger-content" id="loggerContent"></div>
			`;
			document.body.appendChild(div);

			this.makeDraggable(div);

			document.getElementById('loggerMinimize').onclick = () => {
				const content = document.getElementById('loggerContent');
				content.style.display = content.style.display === 'none' ? 'block' : 'none';
			};
			document.getElementById('loggerClear').onclick = () => {
				document.getElementById('loggerContent').innerHTML = '';
			};
			document.getElementById('loggerClose').onclick = () => {
				div.style.display = 'none';
			};

			this.log('🚀 ULTRA Terminal Initialized', 'info');
		}

		static makeDraggable(element) {
			const header = element.querySelector('.logger-header');
			let isDragging = false;
			let dragOffset = { x: 0, y: 0 };

			header.addEventListener('mousedown', (e) => {
				if (e.target.closest('.logger-controls')) return;

				isDragging = true;
				const rect = element.getBoundingClientRect();
				dragOffset = {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				};
				e.preventDefault();
			});

			document.addEventListener('mousemove', (e) => {
				if (!isDragging) return;

				element.style.left = `${e.clientX - dragOffset.x}px`;
				element.style.top = `${e.clientY - dragOffset.y}px`;
				element.style.right = 'auto';
				element.style.bottom = 'auto';
			});

			document.addEventListener('mouseup', () => {
				isDragging = false;
			});
		}

		static log(message, type = 'info') {
			if (CONFIG.DISABLE_VISUAL_LOGGER && type !== 'error') return;

			console.log(`[${type.toUpperCase()}] ${message}`);

			const content = document.getElementById('loggerContent');
			if (!content) return;

			const entry = document.createElement('div');
			entry.className = `log-entry ${type}`;
			const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
			const timestamp = new Date().getTime();
			entry.dataset.timestamp = timestamp;
			entry.innerHTML = `
			<span class="log-time">${time}</span>
			<span class="log-type" style="color: ${this.getTypeColor(type)}; font-weight: 600; margin-right: 8px;">${type.toUpperCase()}</span>
			<span class="log-msg">${message}</span>
			`;

			content.appendChild(entry);
			content.scrollTop = content.scrollHeight;

			// Clean old entries
			const entries = content.querySelectorAll('.log-entry');
			if (entries.length > 200) {
				entries[0].remove();
			}
		}

		static getTypeColor(type) {
			const colors = {
				info: '#94a3b8',
				success: '#4ade80',
				error: '#f87171',
				warn: '#fbbf24',
				debug: '#c084fc'
			};
			return colors[type] || colors.info;
		}

		static info(msg) { this.log(msg, 'info'); }
		static success(msg) { this.log(`✅ ${msg}`, 'success'); }
		static error(msg) { this.log(`❌ ${msg}`, 'error'); }
		static warn(msg) { this.log(`⚠️ ${msg}`, 'warn'); }
		static debug(msg) { this.log(`🔍 ${msg}`, 'debug'); }
	}

	// ========== TOAST MANAGER ==========
	class ToastManager {
		static show(message, type = 'info', duration = 4000) {
			const id = 'ultraToast-' + Date.now();
			const toast = document.createElement('div');
			toast.id = id;
			toast.className = `ultra-toast ultra-toast-${type}`;

			const icons = {
				success: '✅',
				error: '❌',
				warning: '⚠️',
				info: 'ℹ️'
			};

			toast.innerHTML = `
			<div class="ultra-toast-icon">${icons[type] || icons.info}</div>
			<div class="ultra-toast-content">
			<div class="ultra-toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
			<div class="ultra-toast-message">${message}</div>
			</div>
			`;

			document.body.appendChild(toast);

			// Remove any existing toasts
			const existingToasts = document.querySelectorAll('.ultra-toast');
			if (existingToasts.length > 3) {
				existingToasts[0].remove();
			}

			setTimeout(() => {
				const t = document.getElementById(id);
				if (t) {
					t.style.opacity = '0';
					t.style.transform = 'translateX(100%)';
					setTimeout(() => t.remove(), 300);
				}
			}, duration);

			return id;
		}
	}

	// ========== LOADING MANAGER ==========
	class LoadingManager {
		static show(message = 'Processing...', details = '') {
			this.hide();
			const overlay = document.createElement('div');
			overlay.id = 'ultraLoading';
			overlay.className = 'ultra-loading';
			overlay.innerHTML = `
			<div class="ultra-loading-spinner"></div>
			<div class="ultra-loading-text">${message}</div>
			${details ? `<div class="ultra-loading-details">${details}</div>` : ''}
			`;
			document.body.appendChild(overlay);
		}

		static hide() {
			const overlay = document.getElementById('ultraLoading');
			if (overlay) overlay.remove();
		}

		static update(message, details = '') {
			const overlay = document.getElementById('ultraLoading');
			if (overlay) {
				const text = overlay.querySelector('.ultra-loading-text');
				const detailsEl = overlay.querySelector('.ultra-loading-details');
				if (text) text.textContent = message;
				if (detailsEl) detailsEl.innerHTML = details;
			}
		}
	}

	// ========== STATE MANAGER ==========
	class StateManager {
		static getState() {
			const defaults = {
				active: false,
				sheetName: null,
				mode: 'ROW',
				ticketType: null,
				queue: [],
				currentRow: null,
				currentId: null,
				isPaused: false,
				turboMode: false,
				lastProcessed: null,
				lastUpdated: 0,
				stats: { // Ensure stats object and its properties always exist
					processed: 0,
					success: 0,
					failed: 0,
					startTime: Date.now()
				}
			};

			const stored = GM_getValue('ULTRA_STATE', {});
			// Deep merge to ensure nested objects like 'stats' are handled correctly
			const mergedState = {
				...defaults,
				...stored,
				queue: Array.isArray(stored.queue) ? stored.queue : [],
 stats: { ...defaults.stats, ...(stored.stats || {}) }
			};
			CONFIG.TURBO_MODE = mergedState.turboMode; // Sync config
			return mergedState;
		}

		static setState(state) {
			GM_setValue('ULTRA_STATE', {
				...state,
				lastUpdated: Date.now()
			});
		}

		static enable(sheetName) {
			const state = this.getState();
			state.active = true;
			state.sheetName = sheetName;
			state.mode = 'ROW'; // Force ROW mode
			state.ticketType = null;
			state.queue = [];
			state.currentRow = null;
			state.currentId = null;
			state.isPaused = false;
			state.turboMode = false;
			this.setState(state);
			VisualLogger.success(`Prompt Mode Enabled - Sheet: ${sheetName}`);
			ToastManager.show(`Prompt Mode enabled for sheet: ${sheetName}`, 'success');
		}

		static disable() {
			const state = this.getState();
			state.active = false;
			state.sheetName = null;
			state.queue = [];
			this.setState(state);
			VisualLogger.info('Prompt Mode Disabled');
			ToastManager.show('Prompt Mode disabled', 'info');
		}

		static isActive() {
			const state = this.getState();
			return state.active === true;
		}

		static addToQueue(rows) {
			const state = this.getState();
			const newRows = rows.filter(row => !state.queue.includes(row));
			state.queue.push(...newRows);
			this.setState(state);
			return newRows.length;
		}

		static getNextFromQueue() {
			const state = this.getState();
			if (state.queue.length === 0) return null;
			const next = state.queue.shift();
			state.currentRow = next;
			this.setState(state);
			return next;
		}

		static clearQueue() {
			const state = this.getState();
			state.queue = [];
			state.currentRow = null;
			this.setState(state);
		}

		static updateStats(success) {
			const state = this.getState();
			if (success) {
				state.stats.success++;
			} else {
				state.stats.failed++;
			}
			state.stats.processed++;
			this.setState(state);
		}

		static getStats() {
			const state = this.getState();
			const stats = state.stats;
			const successRate = stats.processed > 0 ? Math.round((stats.success / stats.processed) * 100) : 0;
			const avgTime = stats.processed > 0 ? Math.round((Date.now() - stats.startTime) / stats.processed) : 0;

			return {
				...stats,
 successRate,
 avgTime,
 queueLength: state.queue.length
			};
		}
	}

	// ========== API REQUEST MANAGER (THROTTLER) ==========
	class APIRequestManager {
		constructor() {
			// Google's default quota is 100 requests per 100 seconds per user.
			// Let's be safe and aim for 1 request every 1.2 seconds.
			this.delay = CONFIG.NETWORK_THROTTLE || 1200;
			this.queue = [];
			this.isProcessing = false;
		}

		// requestFn should be a function that returns a Promise (like GM_xmlhttpRequest wrapped in a Promise)
		add(requestFn) {
			return new Promise((resolve, reject) => {
				this.queue.push({ requestFn, resolve, reject });
				if (typeof VisualLogger !== 'undefined' && VisualLogger.debug) VisualLogger.debug(`📥 API request queued. Queue size: ${this.queue.length}`);
				if (!this.isProcessing) {
					this.processQueue();
				}
			});
		}

		async processQueue() {
			if (this.isProcessing) return;
			this.isProcessing = true;

			while (this.queue.length > 0) {
				const { requestFn, resolve, reject } = this.queue.shift();
				// Respect Turbo mode, but with a minimum delay to prevent instant failure
				const currentDelay = CONFIG.TURBO_MODE ? Math.min(400, this.delay) : this.delay;

				try {
					await new Promise(res => setTimeout(res, currentDelay));
					if (typeof VisualLogger !== 'undefined' && VisualLogger.debug) VisualLogger.debug(`📤 Processing API request. Queue left: ${this.queue.length}`);
					const result = await requestFn();
					resolve(result);
				} catch (error) {
					reject(error);
				} finally {
					if (VisualLogger.monitor) {
						VisualLogger.monitor.logMetric('apiCalls', 1);
					}
				}
			}
			this.isProcessing = false;
		}
	}

	// Global instance
	const apiManager = new APIRequestManager();

	function escapeSheetName(name) {
		// Double any single quotes inside the name (rare, but correct escaping)
		const escaped = name.replace(/'/g, "''");
		// Wrap in single quotes
		return `'${escaped}'`;
	}

	// ========== GOOGLE SHEETS CLIENT ==========
	class GoogleSheetsClient {
		constructor() {
			this.accessToken = null;
			this.tokenExpiry = 0;
			this.sheetsCache = null;
			this.cacheTime = 0;
		}

		base64urlEncode(str) {
			const base64 = btoa(
				typeof str === 'string'
				? str
				: JSON.stringify(str)
			);
			return base64
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
		}

		hexToBytes(hex) {
			const bytes = [];
			for (let i = 0; i < hex.length; i += 2) {
				bytes.push(parseInt(hex.substr(i, 2), 16));
			}
			return String.fromCharCode.apply(null, bytes);
		}

		async getAccessToken() {
			if (this.accessToken && Date.now() < this.tokenExpiry) {
				return this.accessToken;
			}

			// Check persistent cache to avoid re-auth on every page load
			const cached = GM_getValue('GOOGLE_AUTH_TOKEN', null);
			if (cached && Date.now() < cached.expiry) {
				this.accessToken = cached.token;
				this.tokenExpiry = cached.expiry;
				return this.accessToken;
			}

			VisualLogger.info('🔑 Authenticating with Google...');

			try {
				const header = {
					"alg": "RS256",
 "typ": "JWT",
 "kid": SERVICE_ACCOUNT.private_key_id
				};

				const now = Math.floor(Date.now() / 1000);
				const claim = {
					"iss": SERVICE_ACCOUNT.client_email,
 "scope": "https://www.googleapis.com/auth/spreadsheets",
 "aud": SERVICE_ACCOUNT.token_uri,
 "exp": now + 3600,
 "iat": now
				};

				const headerB64 = this.base64urlEncode(JSON.stringify(header));
				const claimB64 = this.base64urlEncode(JSON.stringify(claim));
				const unsigned = `${headerB64}.${claimB64}`;

				const key = KEYUTIL.getKey(SERVICE_ACCOUNT.private_key);
				const sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
				sig.init(key);
				sig.updateString(unsigned);
				const sigHex = sig.sign();
				const sigB64 = this.base64urlEncode(this.hexToBytes(sigHex));

				const jwt = `${unsigned}.${sigB64}`;

				const tokenResponse = await this.exchangeJWT(jwt);

				this.accessToken = tokenResponse.access_token;
				this.tokenExpiry = Date.now() + (tokenResponse.expires_in * 1000) - 60000;

				// Persist token
				GM_setValue('GOOGLE_AUTH_TOKEN', {
					token: this.accessToken,
					expiry: this.tokenExpiry
				});

				VisualLogger.success('✅ Google API Token obtained');
				return this.accessToken;

			} catch (error) {
				VisualLogger.error(`❌ Token generation failed: ${error.message}`);
				throw new Error(`Authentication failed: ${error.message}`);
			}
		}

		exchangeJWT(jwt) {
			// This is for authentication and should happen immediately, bypassing the queue.
			const requestFn = () => new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'POST',
					url: SERVICE_ACCOUNT.token_uri,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
					onload: (response) => {
						try {
							if (response.status === 200) {
								resolve(JSON.parse(response.responseText));
							} else {
								reject(new Error(`HTTP ${response.status}: ${response.responseText}`));
							}
						} catch (e) {
							reject(e);
						}
					},
					onerror: (error) => reject(new Error(`Network error: ${error}`))
				});
			});
			return requestFn();
		}

		async apiRequest(url, options = {}) {
			const token = await this.getAccessToken();

			const requestFn = () => new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: options.method || 'GET',
					url: url,
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
						...options.headers
					},
					data: options.data ? JSON.stringify(options.data) : undefined,
								  onload: (response) => {
									  try {
										  if (response.status >= 200 && response.status < 300) {
											  const data = response.responseText ? JSON.parse(response.responseText) : {};
											  resolve(data);
										  } else {
											  const error = response.responseText ? JSON.parse(response.responseText) : {};
											  reject(new Error(error.error?.message || `HTTP ${response.status}`));
										  }
									  } catch (e) {
										  reject(e);
									  }
								  },
								  onerror: (error) => reject(new Error(`Request failed: ${error}`))
				});
			});
			return apiManager.add(requestFn);
		}

		async getSheets() {
			if (this.sheetsCache && Date.now() - this.cacheTime < 60000) {
				return this.sheetsCache;
			}

			const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}`;
			const data = await this.apiRequest(url);
			this.sheetsCache = data.sheets || [];
			this.cacheTime = Date.now();
			return this.sheetsCache;
		}

		async getServiceIdFromRow(sheetName, rowNumber, preferredType = 'SUPPORT') {
			try {
				VisualLogger.debug(`📊 Reading Service ID from Row ${rowNumber} [${preferredType}]...`);

				// STRICT MAPPING ENFORCEMENT
				// We only look at the column defined for the requested ticket type.
				// No fallbacks to other columns to prevent ID mismatch.

				const mapping = SHEET_MAPPING[preferredType];
				if (!mapping) {
					throw new Error(`Configuration error: No mapping for ${preferredType}`);
				}

				const targetCol = mapping.serviceIdColumn;
				const rangeStr = `${escapeSheetName(sheetName)}!${targetCol}${rowNumber}`;
				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(rangeStr)}`;

				const data = await this.apiRequest(url);
				const value = data.values?.[0]?.[0];

				if (value && value.trim()) {
					const serviceId = value.trim();

					// Advanced Check: Ignore purely alphabetic values (headers, status text, etc.)
					// A valid ID must contain at least one digit (e.g., "12345" or "FOB123")
					if (/\d/.test(serviceId)) {
						VisualLogger.success(`✅ Found Service ID in ${preferredType} column (${targetCol}): ${serviceId}`);
						return {
							serviceId,
 ticketType: preferredType,
 rowNumber,
 column: targetCol,
 rawValue: value
						};
					} else {
						VisualLogger.warn(`⚠️ Ignored non-numeric value "${serviceId}" in ${preferredType} column (${targetCol})`);
					}
				}

				VisualLogger.warn(`⚠️ No valid Service ID found in ${preferredType} column (${targetCol}) at Row ${rowNumber}`);
				return null;

			} catch (error) {
				VisualLogger.error(`❌ Error reading row ${rowNumber}: ${error.message}`);
				throw error;
			}
		}

		async writeToSheet(sheetName, rowNumber, updates, ticketType = 'SUPPORT') {
			let lastError;
			// Retry logic: Try up to 3 times
			for (let attempt = 1; attempt <= 3; attempt++) {
				try {
					VisualLogger.debug(`✍️ Writing to sheet: ${sheetName}, Row ${rowNumber} (Attempt ${attempt})`);

					const mapping = SHEET_MAPPING[ticketType];
					if (!mapping) {
						throw new Error(`No mapping for ticket type: ${ticketType}`);
					}

					// Prepare batch updates
					const batchUpdates = updates.map(update => ({
						range: `${escapeSheetName(sheetName)}!${update.col}${rowNumber}`,
						values: [[update.val]]
					}));

					const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchUpdate`;

					const result = await this.apiRequest(url, {
						method: 'POST',
						data: {
							valueInputOption: 'USER_ENTERED',
							data: batchUpdates
						}
					});

					VisualLogger.success(`✅ Data written successfully to Row ${rowNumber}`);
					return result;

				} catch (error) {
					lastError = error;
					VisualLogger.warn(`⚠️ Write attempt ${attempt} failed: ${error.message}`);
					// Wait before retrying (1s, 2s, 3s)
					await new Promise(resolve => setTimeout(resolve, (CONFIG.TURBO_MODE ? 100 : 1000) * attempt));
				}
			}

			VisualLogger.error(`❌ All write attempts failed for Row ${rowNumber}`);
			throw lastError;
		}

		async findRowsByServiceIds(sheetName, serviceIds) {
			try {
				VisualLogger.info(`🔍 Resolving ${serviceIds.length} Service IDs to rows...`);

				const supportCol = SHEET_MAPPING.SUPPORT.serviceIdColumn;
				const installCol = SHEET_MAPPING.INSTALLATION.serviceIdColumn;
				const relocationCol = SHEET_MAPPING.RELOCATION.serviceIdColumn;

				// Fetch all columns entirely to search
				const supportRange = `${escapeSheetName(sheetName)}!${supportCol}:${supportCol}`;
				const installRange = `${escapeSheetName(sheetName)}!${installCol}:${installCol}`;
				const relocationRange = `${escapeSheetName(sheetName)}!${relocationCol}:${relocationCol}`;

				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchGet` +
				`?ranges=${encodeURIComponent(supportRange)}` +
				`&ranges=${encodeURIComponent(installRange)}` +
				`&ranges=${encodeURIComponent(relocationRange)}`;

				const data = await this.apiRequest(url);
				const supportValues = data.valueRanges[0]?.values || [];
				const installValues = data.valueRanges[1]?.values || [];
				const relocationValues = data.valueRanges[2]?.values || [];

				const foundRows = new Set();
				const notFoundIds = [];

				// Helper for normalization (remove non-alphanumeric, lowercase)
				const normalize = (val) => val ? val.toString().toLowerCase().replace(/[^a-z0-9]/g, '') : '';

				for (const id of serviceIds) {
					const cleanId = normalize(id);
					if (!cleanId) continue;

					let found = false;

					// Helper to search a column array
					const searchColumn = (values) => {
						for (let i = 0; i < values.length; i++) {
							const cellVal = normalize(values[i]?.[0]);
							if (cellVal === cleanId) {
								return i + 1; // Row index is 1-based
							}
							// Robust fallback: check if cell contains ID (if ID is long enough)
							if (cleanId.length > 4 && cellVal.includes(cleanId)) {
								return i + 1;
							}
						}
						return null;
					};

					const supportRow = searchColumn(supportValues);
					if (supportRow) {
						foundRows.add(supportRow);
						found = true;
					} else {
						const installRow = searchColumn(installValues);
						if (installRow) {
							foundRows.add(installRow);
							found = true;
						} else {
							const relocationRow = searchColumn(relocationValues);
							if (relocationRow) {
								foundRows.add(relocationRow);
								found = true;
							}
						}
					}

					if (!found) {
						notFoundIds.push(id);
					}
				}

				return {
					rows: Array.from(foundRows).sort((a, b) => a - b),
 notFoundIds
				};

			} catch (error) {
				VisualLogger.error(`❌ Error resolving IDs: ${error.message}`);
				throw error;
			}
		}
	}

	// ========== ENHANCED SHEETS WRITER WITH RETRY AND VERIFICATION ==========
	class EnhancedSheetsWriter {
		constructor() {
			this.maxRetries = 5;
			this.retryDelay = 1000;
			this.writeHistory = new Map();
		}

		async writeWithVerification(sheetName, rowNumber, updates, ticketType, serviceId) {
			let lastError = null;
			let verificationPassed = false;
			let actualResult = null;

			// Generate a unique write ID for tracking
			const writeId = `${sheetName}_${rowNumber}_${Date.now()}`;

			VisualLogger.info(`🖊️ Starting verified write (ID: ${writeId}) for Row ${rowNumber}`);

			// Get appropriate verification column
			const verificationCol = SHEET_MAPPING[ticketType]?.verificationColumn || 'Z';

			// Retry loop with exponential backoff
			for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
				try {
					VisualLogger.debug(`📝 Write attempt ${attempt}/${this.maxRetries} for Row ${rowNumber}`);

					const mapping = SHEET_MAPPING[ticketType];
					if (!mapping) {
						throw new Error(`Invalid ticket type: ${ticketType}`);
					}

					// Safety Check: Prevent overwriting Service ID column
					/*
					 *					if (mapping.serviceIdColumn) {
					 *						const unsafe = updates.find(u => u.col === mapping.serviceIdColumn);
					 *						if (unsafe) {
					 *							// VisualLogger.error(`🚨 BLOCKED attempt to overwrite Service ID in column ${mapping.serviceIdColumn}`);
					 *							// updates = updates.filter(u => u.col !== mapping.serviceIdColumn);
					 *							VisualLogger.info(`ℹ️ Updating Service ID in column ${mapping.serviceIdColumn}`);
				}
				}
				*/

					// Prepare batch updates - ensure all columns exist
					const batchUpdates = updates.filter(update => update.val && update.val.trim()).map(update => ({
						range: `${escapeSheetName(sheetName)}!${update.col}${rowNumber}`,
						values: [[update.val]]
					}));

					// Skip if no valid updates
					if (batchUpdates.length === 0) {
						VisualLogger.warn(`⚠️ No valid updates to write for Row ${rowNumber}`);
						return { success: true, message: "No updates to write" };
					}

					// Also write a verification marker to confirm the write happened
					batchUpdates.push({
						range: `${escapeSheetName(sheetName)}!${verificationCol}${rowNumber}`,
						values: [[`VERIFIED_${writeId}`]]
					});

					const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchUpdate`;

					const result = await this.apiRequest(url, {
						method: 'POST',
						data: {
							valueInputOption: 'USER_ENTERED',
							data: batchUpdates
						}
					});

					VisualLogger.success(`✅ Write attempt ${attempt} successful for Row ${rowNumber}`);

					// Verify the write was actually saved
					verificationPassed = await this.verifyWrite(sheetName, rowNumber, verificationCol, writeId);

					if (verificationPassed) {
						actualResult = result;

						// Clear verification marker after successful verification (non-blocking)
						setTimeout(async () => {
							try {
								await this.apiRequest(url, {
									method: 'POST',
									data: {
										valueInputOption: 'USER_ENTERED',
										data: [{
											range: `${escapeSheetName(sheetName)}!${verificationCol}${rowNumber}`,
											values: [[""]]
										}]
									}
								});
							} catch (clearError) {
								VisualLogger.warn(`Could not clear verification marker: ${clearError.message}`);
							}
						}, 1000);

						break;
					} else {
						VisualLogger.warn(`⚠️ Write verification failed on attempt ${attempt}`);
						throw new Error('Write verification failed');
					}

				} catch (error) {
					lastError = error;
					VisualLogger.warn(`❌ Write attempt ${attempt} failed for Row ${rowNumber}: ${error.message}`);

					if (attempt < this.maxRetries) {
						// Use exponential backoff with jitter to prevent thundering herd issues
						const baseDelay = this.retryDelay * Math.pow(2, attempt - 1);
						const jitter = baseDelay * 0.3 * Math.random();
						const actualDelay = (CONFIG.TURBO_MODE ? (400 * Math.pow(2, attempt - 1)) : baseDelay) + jitter;
						VisualLogger.info(`⏳ Retrying in ${Math.round(actualDelay)}ms... (Attempt ${attempt + 1}/${this.maxRetries})`);
						await this.sleep(actualDelay);
					}
				}
			}

			if (!verificationPassed) {
				VisualLogger.error(`❌ All write attempts failed for Row ${rowNumber}`);
				throw lastError || new Error(`All write attempts failed for Row ${rowNumber}`);
			}

			// Log successful write
			this.writeHistory.set(writeId, {
				timestamp: Date.now(),
								  sheetName,
								  rowNumber,
								  updatesCount: updates.length,
								  ticketType,
								  serviceId
			});

			// Clean old history entries
			this.cleanupHistory();

			return actualResult;
		}

		async verifyWrite(sheetName, rowNumber, column, expectedValue) {
			try {
				// Wait a moment for Google Sheets to process
				await this.sleep(CONFIG.TURBO_MODE ? 100 : 400);

				// Read back the value
				const rangeStr = `${escapeSheetName(sheetName)}!${column}${rowNumber}`;
				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(rangeStr)}`;

				const response = await this.apiRequest(url);
				const actualValue = response.values?.[0]?.[0] || '';

				const isVerified = actualValue.includes(expectedValue);

				VisualLogger.debug(`🔍 Verification: Expected "${expectedValue}", Got "${actualValue}" - ${isVerified ? 'PASS' : 'FAIL'}`);

				return isVerified;

			} catch (error) {
				VisualLogger.error(`❌ Verification error: ${error.message}`);
				return false;
			}
		}

		async apiRequest(url, options = {}) {
			const client = new GoogleSheetsClient();
			return await client.apiRequest(url, options);
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		cleanupHistory() {
			const oneHour = 3600000;
			const now = Date.now();

			for (const [id, entry] of this.writeHistory.entries()) {
				if (now - entry.timestamp > oneHour) {
					this.writeHistory.delete(id);
				}
			}
		}
	}

	// ========== ADVANCED TICKET SEARCHER ==========
	class AdvancedTicketSearcher {
		constructor() {
			this.listUrls = {
				SUPPORT: 'https://intranet.fob.ng/crm/type/163/list/category/0/',
 INSTALLATION: 'https://intranet.fob.ng/page/onboarding_applications/installation/type/188/list/category/0/',
 RELOCATION: 'https://intranet.fob.ng/page/onboarding_applications/relocation/type/XXX/list/'
			};
			this.currentSearch = null;
		}

		async searchForServiceId(serviceId, ticketType, rowNumber) {
			VisualLogger.info(`🔍 Starting search for Service ID: ${serviceId} (Row ${rowNumber}, ${ticketType})`);

			// Store search context
			this.currentSearch = {
				serviceId,
 ticketType,
 rowNumber,
 status: 'searching',
 startTime: Date.now(),
 sheetName: StateManager.getState().sheetName // Save sheet name for recovery
			};

			GM_setValue('CURRENT_SEARCH', this.currentSearch);

			// Navigate to appropriate list page
			const listUrl = this.listUrls[ticketType];
			if (!listUrl) {
				throw new Error(`No list URL for ticket type: ${ticketType}`);
			}

			VisualLogger.info(`📍 Navigating to list: ${listUrl}`);
			window.location.href = listUrl;
		}

		async handleListPage() {
			const search = GM_getValue('CURRENT_SEARCH');
			if (!search || search.status !== 'searching') return false;

			VisualLogger.info(`🎯 On list page, searching: ${search.serviceId}`);

			// Wait for page to fully load
			await this.waitForPageLoad();

			// Update search state
			search.status = 'on_list_page';
			GM_setValue('CURRENT_SEARCH', search);

			// Perform the search
			return await this.performAdvancedSearch(search.serviceId);
		}

		async performAdvancedSearch(serviceId) {
			VisualLogger.info('🔍 Performing advanced search...');

			// Method 1: Try using search box
			let found = await this.useSmartSearchBox(serviceId);

			if (!found) {
				// Method 2: Try URL parameter search
				found = await this.useUrlSearch(serviceId);
			}

			if (!found) {
				// Method 3: Direct page scan
				found = await this.scanPageForServiceId(serviceId);
			}

			if (found) {
				VisualLogger.success('✅ Search successful, ticket found');
				return true;
			} else {
				VisualLogger.error('❌ Search failed, ticket not found');
				this.showSearchError(serviceId);
				return false;
			}
		}

		async useSmartSearchBox(serviceId) {
			VisualLogger.info('🔍 Looking for search box...');

			// Try multiple possible selectors for search box
			const searchSelectors = [
				'input[name="FIND"]',
 '#CRM_TICKET_LIST_V12_search',
 '.main-ui-filter-search-input',
 '.ui-search-input input',
 'input[type="search"]',
 '.crm-filter-search-input',
 '.search-input',
 'input[placeholder*="Search"]',
 'input[placeholder*="search"]'
			];

			const searchBox = await this.waitForAnyElement(searchSelectors, 8000);
			if (!searchBox) {
				VisualLogger.warn('❌ No search box found on page');
				return false;
			}

			VisualLogger.success('✅ Found search box');

			// Clear any existing filters
			await this.clearExistingFilters();

			// Set the search value
			VisualLogger.info(`⌨️ Setting search value: ${serviceId}`);
			searchBox.focus();
			searchBox.value = serviceId;
			searchBox.dispatchEvent(new Event('input', { bubbles: true }));
			searchBox.dispatchEvent(new Event('change', { bubbles: true }));

			// Trigger search
			await this.triggerSearchAction(searchBox);

			// Wait for results
			await this.waitForSearchResults();

			// Double check: If 0 items found, try clicking search button again
			const items = document.querySelectorAll('.main-grid-row, .crm-kanban-item, [class*="item-"]');
			if (items.length === 0) {
				VisualLogger.info('⚠️ No items found, retrying search click...');
				const searchButtons = [
					'button[type="submit"]',
 '.main-ui-filter-search-button',
 '.ui-btn-search'
				];
				for (const selector of searchButtons) {
					const button = document.querySelector(selector);
					if (button && button.offsetParent !== null) {
						button.click();
						await this.sleep(1500);
						break;
					}
				}
			}

			// Find and open the highest ticket
			return await this.findAndOpenHighestTicket();
		}

		async clearExistingFilters() {
			const clearButtons = [
				'.main-ui-filter-field-delete',
 '.ui-filter-field-delete',
 '.filter-reset',
 '.clear-filter'
			];

			for (const selector of clearButtons) {
				const buttons = document.querySelectorAll(selector);
				for (const btn of buttons) {
					if (btn.offsetParent !== null) {
						btn.click();
						await this.sleep(CONFIG.TURBO_MODE ? 50 : 300);
					}
				}
			}
		}

		async triggerSearchAction(searchBox) {
			VisualLogger.info('🔍 Triggering search...');

			// Try pressing Enter
			searchBox.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true
			}));

			await this.sleep(CONFIG.TURBO_MODE ? 50 : 500);

			// Look for search button and click it
			const searchButtons = [
				'button[type="submit"]',
 '.main-ui-filter-search-button',
 '.ui-btn-search',
 '.search-button',
 'button[class*="search"]',
 'button[class*="Search"]'
			];

			for (const selector of searchButtons) {
				const button = document.querySelector(selector);
				if (button && button.offsetParent !== null) {
					button.click();
					await this.sleep(CONFIG.TURBO_MODE ? 50 : 300);
					break;
				}
			}
		}

		async waitForSearchResults(timeout = 15000) {
			VisualLogger.info('⏳ Waiting for search results...');

			// Give Bitrix time to register the Enter key and start the request
			await this.sleep(CONFIG.TURBO_MODE ? 500 : 2000);

			// 1. Wait for loader to appear/disappear (Grid Loader)
			const isLoaderVisible = () => document.querySelector('.main-grid-loader, .crm-kanban-loader, .grid-loader, .ui-grid-loader, .main-ui-loader') !== null;

			// Wait briefly for loader to appear
			for(let i=0; i<20; i++) {
				if(isLoaderVisible()) break;
				await this.sleep(100);
			}

			// Wait for loader to disappear
			const loaderStart = Date.now();
			while(isLoaderVisible() && (Date.now() - loaderStart < timeout)) {
				await this.sleep(200);
			}

			const startTime = Date.now();
			let lastCount = -1;
			let stableCount = 0;

			while (Date.now() - startTime < timeout) {
				const items = document.querySelectorAll('.main-grid-row, .crm-kanban-item, [class*="item-"]');
				const currentCount = items.length;

				if (currentCount === lastCount) {
					stableCount++;
				} else {
					stableCount = 0;
				}

				lastCount = currentCount;

				// Require stability for 1.5 seconds (3 * 500ms)
				if (stableCount >= 3) {
					break;
				}

				await this.sleep(500);
			}

			VisualLogger.info(`📊 Found ${lastCount} items after search`);
		}

		async findAndOpenHighestTicket() {
			VisualLogger.info('🔍 Finding highest ticket...');

			// Scroll to load all content
			await this.performOptimizedScroll();

			// Find all ticket links
			const ticketLinks = this.getAllTicketLinks();

			if (ticketLinks.length === 0) {
				VisualLogger.warn('❌ No ticket links found on page');
				return false;
			}

			// Find the highest ticket number
			const potentialTickets = [];

			for (const link of ticketLinks) {
				const match = link.href.match(/details\/(\d+)/);
				if (match) {
					potentialTickets.push({
						id: parseInt(match[1]),
										  href: link.href,
										  linkElement: link
					});
				}
			}

			if (potentialTickets.length === 0) {
				VisualLogger.warn('❌ No valid ticket IDs found in links');
				return false;
			}

			// Sort by ID, descending (highest first)
			potentialTickets.sort((a, b) => b.id - a.id);

			const highestTicket = potentialTickets[0];

			if (highestTicket) {
				VisualLogger.success(`✅ Found highest ticket: #${highestTicket.id}. Total found: ${potentialTickets.length}`);

				// Update search state
				const search = GM_getValue('CURRENT_SEARCH');
				if (search) {
					search.foundTicketId = highestTicket.id;
					search.status = 'found_ticket';
					// Store the sorted list of potential tickets for fallback
					search.potentialTickets = potentialTickets.map(p => ({ id: p.id, href: p.href }));
					GM_setValue('CURRENT_SEARCH', search);
				}

				// Open the ticket
				highestTicket.linkElement.click();
				return true;
			}

			return false;
		}

		getAllTicketLinks() {
			// Get links from main content area only
			const mainContainers = [
				'.main-grid-container',
 '.crm-kanban-items',
 '.main-ui-content',
 '.crm-entity-list',
 '#workarea-content'
			];

			let container = document.body;
			for (const selector of mainContainers) {
				const el = document.querySelector(selector);
				if (el) {
					container = el;
					break;
				}
			}

			return Array.from(container.querySelectorAll('a[href*="/details/"]')).filter(link => {
				// Filter out navigation and sidebar links
				const text = link.textContent || '';
				return text.length < 100 && !text.includes('http') && link.offsetParent !== null;
			});
		}

		async performOptimizedScroll() {
			VisualLogger.info('📜 Optimizing view for search...');

			// Scroll to top first
			window.scrollTo(0, 0);
			await this.sleep(CONFIG.TURBO_MODE ? 50 : 500);

			// Look for "Load More" buttons
			const loadMoreButtons = [
				'[data-role="load-more"]',
 '.crm-entity-stream-loadMore',
 '.ui-btn-wait',
 '.crm-entity-stream-moreButton',
 '.load-more',
 '.show-more'
			];

			for (let i = 0; i < 2; i++) { // Reduced iterations for speed
				for (const selector of loadMoreButtons) {
					const buttons = document.querySelectorAll(selector);
					for (const btn of buttons) {
						if (btn.offsetParent !== null && !btn.disabled) {
							btn.click();
							await this.sleep(CONFIG.TURBO_MODE ? 50 : 300);
						}
					}
				}

				// Scroll down a bit
				window.scrollBy(0, 800);
				await this.sleep(CONFIG.TURBO_MODE ? 50 : 300);
			}
		}

		async useUrlSearch(serviceId) {
			VisualLogger.info('🔍 Trying URL parameter search...');

			const currentUrl = window.location.href;
			const separator = currentUrl.includes('?') ? '&' : '?';
			const searchUrl = `${currentUrl}${separator}FIND=${encodeURIComponent(serviceId)}`;

			VisualLogger.info(`📍 Navigating to: ${searchUrl}`);
			window.location.href = searchUrl;

			// Wait for reload
			await this.waitForPageLoad();
			// Extra wait for grid to render after page load
			await this.sleep(CONFIG.TURBO_MODE ? 2000 : 5000);

			return await this.findAndOpenHighestTicket();
		}

		async scanPageForServiceId(serviceId) {
			VisualLogger.info(`🔍 Scanning page for: ${serviceId}`);

			const normalizedId = serviceId.toLowerCase();
			const elements = document.querySelectorAll('td, div, span, a');

			for (const element of elements) {
				const text = (element.textContent || '').toLowerCase();
				if (text.includes(normalizedId)) {
					VisualLogger.success(`✅ Found Service ID in element text`);

					// Find nearby link
					const link = element.closest('a') || element.querySelector('a');
					if (link && link.href && link.href.includes('/details/')) {
						VisualLogger.info(`🔗 Found ticket link`);

						const search = GM_getValue('CURRENT_SEARCH');
						if (search) {
							const match = link.href.match(/details\/(\d+)/);
							if (match) search.foundTicketId = match[1];
							search.status = 'found_ticket';
							GM_setValue('CURRENT_SEARCH', search);
						}

						link.click();
						return true;
					}
				}
			}

			return false;
		}

		showSearchError(serviceId) {
			const message = `No tickets found for Service ID: ${serviceId}`;
			VisualLogger.error(`❌ ${message}`);

			ToastManager.show(message, 'error', 6000);

			// Update search state to failed so we can record it
			const search = GM_getValue('CURRENT_SEARCH');
			if (search) {
				search.status = 'failed';
				GM_setValue('CURRENT_SEARCH', search);
			}
		}

		async waitForAnyElement(selectors, timeout = 10000) {
			return new Promise(resolve => {
				// 1. Immediate check
				for (const selector of selectors) {
					const element = document.querySelector(selector);
					if (element && element.offsetParent !== null) {
						resolve(element);
						return;
					}
				}

				// 2. MutationObserver for efficiency (Advanced)
				const observer = new MutationObserver((mutations, obs) => {
					for (const selector of selectors) {
						const element = document.querySelector(selector);
						if (element && element.offsetParent !== null) {
							obs.disconnect();
							resolve(element);
							return;
						}
					}
				});

				observer.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true
				});

				// 3. Timeout fallback
				setTimeout(() => {
					observer.disconnect();
					resolve(null);
				}, timeout);
			});
		}

		async waitForPageLoad() {
			return new Promise(resolve => {
				if (document.readyState === 'complete') {
					resolve();
					return;
				}

				const onLoad = () => {
					window.removeEventListener('load', onLoad);
					resolve();
				};

				window.addEventListener('load', onLoad);

				// Fallback timeout
				setTimeout(() => {
					window.removeEventListener('load', onLoad);
					VisualLogger.warn('⚠️ Page load timeout, continuing');
					resolve();
				}, 8000);
			});
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}

	// ========== SMART DATE PARSER ==========
	class SmartDateParser {
		constructor() {
			this.now = new Date();
			this.currentYear = this.now.getFullYear();
			this.monthMap = {
				'january': 0, 'february': 1, 'march': 2, 'april': 3,
 'may': 4, 'june': 5, 'july': 6, 'august': 7,
 'september': 8, 'october': 9, 'november': 10, 'december': 11,
 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
			};
		}

		parseTime(timeStr) {
			if (!timeStr) return null;
			timeStr = timeStr.toLowerCase().trim();

			// 1. Try 24-hour format first (HH:MM or HH:MM:SS) - Advanced 24h support
			const match24 = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
			if (match24) {
				return {
					hour: parseInt(match24[1]),
 minute: parseInt(match24[2]),
 second: match24[3] ? parseInt(match24[3]) : 0
				};
			}

			// 2. Try 12-hour format with AM/PM
			const patterns = [
				/(\d{1,2}):(\d{2})\s*([ap]m)/,
 /(\d{1,2}):(\d{2}):(\d{2})\s*([ap]m)/,
 /(\d{1,2})\.(\d{2})\s*([ap]m)/,
 /(\d{1,2})\s*([ap]m)/
			];
			for (const pattern of patterns) {
				const match = timeStr.match(pattern);
				if (match) {
					let hour = parseInt(match[1]);
					const minute = match[2] ? parseInt(match[2]) : 0;
					const second = match[3] && !isNaN(parseInt(match[3])) ? parseInt(match[3]) : 0;
					const meridiem = match[match.length - 1]; // Last capturing group is am/pm
					if (meridiem === 'pm' && hour < 12) hour += 12;
					if (meridiem === 'am' && hour === 12) hour = 0;
					return { hour, minute, second };
				}
			}
			return null;
		}

		parseDateHeader(headerText) {
			if (!headerText) return null;
			headerText = headerText.toLowerCase().trim();
			if (headerText === 'today' || headerText.includes('today')) {
				return new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
			}
			if (headerText === 'yesterday' || headerText.includes('yesterday')) {
				const yesterday = new Date(this.now);
				yesterday.setDate(yesterday.getDate() - 1);
				return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
			}
			const match = headerText.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i);
			if (match) {
				let monthName = match[1].toLowerCase();
				const shortMap = {'jan': 'january', 'feb': 'february', 'mar': 'march', 'apr': 'april', 'jun': 'june', 'jul': 'july', 'aug': 'august', 'sep': 'september', 'oct': 'october', 'nov': 'november', 'dec': 'december'};
				if (shortMap[monthName]) monthName = shortMap[monthName];
				const day = parseInt(match[2]);
				const month = this.monthMap[monthName];
				if (month !== undefined) {
					const date = new Date(this.currentYear, month, day);
					if (date > this.now) date.setFullYear(this.currentYear - 1);
					return date;
				}
			}
			return null;
		}

		combineDateAndTime(dateObj, timeObj) {
			if (!dateObj || !timeObj) return null;
			const result = new Date(dateObj);
			result.setHours(timeObj.hour, timeObj.minute, timeObj.second);
			return result;
		}
	}

	// ========== ADVANCED TIMELINE EXTRACTOR ==========
	class AdvancedTimelineExtractor {
		constructor() {
			this.parser = new SmartDateParser();
			this.scanResults = {
				dateHeaders: [],
 activities: [],
 events: { creation: null, escalation: null, resolution: null, final: null, sdEscalated: null, ismEscalated: null, completion: null },
 allEvents: { creation: [], escalation: [], resolution: [], final: [], sdEscalated: [], ismEscalated: [], completion: [] },
 rawData: []
			};
		}

		detectTicketType() {
			if (window.location.href.includes('/relocation/')) return 'RELOCATION';
			if (window.location.href.includes('/type/188/')) return 'INSTALLATION';
			if (window.location.href.includes('/type/163/')) return 'SUPPORT';

			const text = document.body.textContent.toLowerCase();
			if (text.includes('relocation')) return 'RELOCATION';
			if (text.includes('installation') || text.includes('onboarding')) {
				return 'INSTALLATION';
			}
			return 'SUPPORT';
		}

		extractTicketId() {
			const urlMatch = window.location.href.match(/details\/(\d+)/);
			if (urlMatch) return urlMatch[1];

			const patterns = [
				/Installation ID:\s*(\d+)/i,
 /Ticket ID:\s*(\d+)/i,
 /Installation\s*#?\s*(\d+)/i,
 /Ticket\s*#?\s*(\d+)/i,
 /\b\d{6,}\b/
			];

			for (const pattern of patterns) {
				const match = document.body.textContent.match(pattern);
				if (match && match[1]) return match[1];
			}
			return 'UNKNOWN';
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		async loadAllContent() {
			VisualLogger.info('📜 Loading timeline content (Smart Scan)...');
			const startTime = Date.now();
			let lastScrollHeight = 0;
			let stableCount = 0;

			// Optimization: Stop if we see the creation event (usually at the start of history)
			const hasCreationEvent = () => {
				const text = document.body.innerText;
				return /Created on|Ticket #\d+ created|New ticket/i.test(text);
			};

			while (Date.now() - startTime < CONFIG.MAX_SCAN_TIME) {
				// 1. Try to find and click load buttons
				const buttons = document.querySelectorAll('[data-role="load-more"], .crm-entity-stream-loadMore, .ui-btn-wait, .crm-entity-stream-moreButton');
				let clicked = false;

				for (const btn of buttons) {
					if (btn.offsetParent !== null && !btn.disabled) {
						try {
							btn.click();
							clicked = true;
							VisualLogger.debug('🖱️ Clicked "Load More"');
							await this.sleep(CONFIG.TURBO_MODE ? 20 : 100);
						} catch(e) {}
					}
				}

				// 2. Fast Scroll Logic
				window.scrollTo(0, document.body.scrollHeight);
				await this.sleep(CONFIG.TURBO_MODE ? 50 : 100);

				// Smart Exit: If we found the creation event, we likely have everything
				if (hasCreationEvent() && stableCount > 0) {
					VisualLogger.debug('📜 Creation event found, stopping scan early.');
					break;
				}

				// 3. Check stability
				const currentHeight = document.body.scrollHeight;

				if (currentHeight > lastScrollHeight || clicked) {
					lastScrollHeight = currentHeight;
					stableCount = 0;
					VisualLogger.debug('📜 Content loaded...');
				} else {
					stableCount++;
				}

				// If height hasn't changed for 2 iterations, assume done
				if (stableCount >= (CONFIG.TURBO_MODE ? 1 : 2)) {
					break;
				}
			}

			VisualLogger.success('✅ Timeline scan complete');
			window.scrollTo(0, 0);
			await this.sleep(CONFIG.TURBO_MODE ? 20 : 200);
		}

		formatDateTime(date) {
			if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
			const pad = (n) => n.toString().padStart(2, '0');
			// Format: M/D/YYYY H:mm:ss (e.g. 1/26/2026 11:17:00)
			return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
		}

		formatDuration(diffMs) {
			if (diffMs === null || diffMs === undefined || isNaN(diffMs)) return '';

			if (diffMs < 0) diffMs = 0;

			let totalSeconds = Math.trunc(diffMs / 1000);

			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;
			return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}

		scanAllContent() {
			VisualLogger.info('🔍 Scanning content structure...');
			this.scanResults = {
				dateHeaders: [],
 activities: [],
 events: { creation: null, escalation: null, resolution: null, final: null, sdEscalated: null, ismEscalated: null, completion: null },
 allEvents: { creation: [], escalation: [], resolution: [], final: [], sdEscalated: [], ismEscalated: [], completion: [] },
 rawData: []
			};

			let rootElement = document.body;
			if (CONFIG.SIMPLE_DOM_SCAN) {
				// Try to narrow down scope
				const timeline = document.querySelector('.crm-entity-stream, .main-grid') ||
				document.querySelector('[data-role="timeline"]');
				if (timeline) rootElement = timeline;
			}

			const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null, false);
			let node;
			while (node = walker.nextNode()) {
				const text = node.textContent.trim();
				if (!text) continue;

				const isDateHeader = /^(today|yesterday)$/i.test(text) ||
				/^(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}$/i.test(text) ||
				/^\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)$/i.test(text);

				if (isDateHeader) {
					const element = node.parentElement;
					if (element && element.offsetParent !== null) {
						const rect = element.getBoundingClientRect();
						this.scanResults.dateHeaders.push({
							text: text,
							yPosition: rect.top + window.scrollY
						});
					}
				}
			}
			this.scanResults.dateHeaders.sort((a, b) => a.yPosition - b.yPosition);

			const processedElements = new Set();
			const allDivs = rootElement.getElementsByTagName('div');
			const commentPattern = /======\s*support comment start::\s*(\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2})======/i;

			for (let i = 0; i < allDivs.length; i++) {
				const div = allDivs[i];
				const text = div.textContent || "";
				const lowerText = text.toLowerCase();
				if (text.length < 500 && text.length > 5 && (
					lowerText.includes('am') || lowerText.includes('pm') ||
					lowerText.includes('pipeline') || lowerText.includes('stage') ||
					lowerText.includes('created') || lowerText.includes('escalate') ||
					lowerText.includes('resolved') || lowerText.includes('service delivery') ||
					lowerText.includes('ism') || lowerText.includes('cnp') ||
					commentPattern.test(text)
				)) {
					const rect = div.getBoundingClientRect();
					if (rect.height > 0 && !processedElements.has(div)) {
						let exactDate = null;
						const commentMatch = text.match(commentPattern);
						if (commentMatch) {
							try {
								const [dStr, tStr] = commentMatch[1].split(/\s+/);
								const [day, month, year] = dStr.split('-').map(Number);
								const [hour, minute, second] = tStr.split(':').map(Number);
								exactDate = new Date(year, month - 1, day, hour, minute, second);
							} catch(e) {}
						}

						this.scanResults.activities.push({
							text: text,
							yPosition: rect.top + window.scrollY,
							element: div,
							exactDate: exactDate
						});
						processedElements.add(div);
					}
				}
			}
			this.scanResults.activities.sort((a, b) => a.yPosition - b.yPosition);

			this.scanResults.rawData = this.scanResults.activities.map(activity => {
				if (activity.exactDate) {
					return {
						activity: activity.text,
						exactDate: activity.exactDate,
						yPosition: activity.yPosition,
						time: null,
						dateHeader: null
					};
				}

				let nearestDate = null;
				let minDist = Infinity;
				for (const header of this.scanResults.dateHeaders) {
					if (header.yPosition < activity.yPosition) {
						const dist = activity.yPosition - header.yPosition;
						if (dist < minDist) {
							minDist = dist;
							nearestDate = header;
						}
					}
				}

				// Updated regex to support both 12h (AM/PM) and 24h formats
				const timeMatch = activity.text.match(/(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)/i);
				return {
					activity: activity.text,
					time: timeMatch ? timeMatch[1] : null,
					dateHeader: nearestDate ? nearestDate.text : null,
					yPosition: activity.yPosition
				};
			});
		}

		collectEvents(patterns, slot, exclusionRegex = null) {
			const found = [];
			for (const item of this.scanResults.rawData) {
				let match = false;
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						match = true;
						break;
					}
				}

				if (match && exclusionRegex && exclusionRegex.test(item.activity)) {
					match = false;
				}

				if (match) {
					if (item.exactDate) {
						found.push(item.exactDate);
						continue;
					}

					let time = item.time;
					if (!time) {
						const tm = item.activity.match(/(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)/i);
						if (tm) time = tm[1];
					}

					if (time && item.dateHeader) {
						const dateObj = this.parser.parseDateHeader(item.dateHeader);
						const timeObj = this.parser.parseTime(time);
						if (dateObj && timeObj) {
							found.push(this.parser.combineDateAndTime(dateObj, timeObj));
						}
					}
				}
			}
			// Sort descending (Newest first)
			found.sort((a, b) => b - a);

			if (found.length > 0) {
				// Merge with existing if any (e.g. from sidebar)
				this.scanResults.allEvents[slot] = [...this.scanResults.allEvents[slot], ...found].sort((a, b) => b - a);

				// Set main event to newest if not set
				if (!this.scanResults.events[slot]) {
					this.scanResults.events[slot] = this.scanResults.allEvents[slot][0];
				}
			}
		}

		fixEventOrder(startSlot, endSlot) {
			const startEvent = this.scanResults.events[startSlot];
			const endEvent = this.scanResults.events[endSlot];

			if (startEvent && endEvent && startEvent > endEvent) {
				// Invalid: Start > End. Try to find a start <= end
				const validStart = this.scanResults.allEvents[startSlot].find(d => d <= endEvent);
				if (validStart) {
					this.scanResults.events[startSlot] = validStart;
					VisualLogger.info(`🔄 Fixed order: Used earlier ${startSlot}`);
				}
				// Note: We prioritize keeping the End event (Resolution) as it's usually the anchor
			}
		}

		findRelocationEvents() {
			VisualLogger.info('🔍 Finding Relocation events...');

			// Find creation event
			this.findCreationEvent();

			// Find Onboarding to SD escalation (Look for "Onboarding - Send to SD")
			this.findRelocationSDEscalation();

			// Find SD to ISM escalation (Look for "SD - Escalation Received" or similar)
			this.findRelocationISMEscalation();

			// Find completion/final event
			this.findRelocationCompletion();
		}

		findRelocationSDEscalation() {
			const patterns = [
				/Pipeline changed.*On-?Boarding.*Send to SD/i,
 /Pipeline changed.*Onboarding.*Send to SD/i,
 /Stage changed.*Onboarding.*Send to SD/i,
 /Onboarding - Send to SD/i,
 /OB - Send to SD/i,
 /SD - Escalation Received/i,
 /Service Delivery.*Escalation Received/i,
 /Escalate to Service Delivery/i,
 /Escalate to SD/i,
 /Pipeline changed.*Service Delivery/i,
 /Stage changed.*Service Delivery/i
			];
			this.collectEvents(patterns, 'sdEscalated');

			// Fallback: If no specific SD escalation found, look for ANY SD mention
			if (!this.scanResults.events.sdEscalated) {
				VisualLogger.warn('⚠️ No specific SD escalation found, searching for any SD reference');
				this.collectEvents([/SD/i], 'sdEscalated', /ISM/i);
			}

			if (this.scanResults.events.sdEscalated) {
				VisualLogger.success(`✅ Found SD escalation`);
			}
		}

		findRelocationISMEscalation() {
			const patterns = [
				/Pipeline changed.*SD.*ISM/i,
 /Pipeline changed.*Service Delivery.*ISM/i,
 /Stage changed.*SD.*ISM/i,
 /SD.*ISM/i,
 /Service Delivery.*ISM/i,
 /ISM recieved/i,
 /ISM received/i,
 /ISM escalation/i,
 /Escalate to ISM/i,
 /Pipeline changed.*ISM/i,
 /Stage changed.*ISM/i
			];
			this.collectEvents(patterns, 'ismEscalated');

			// Fallback: If no ISM escalation found, look for any ISM mention
			if (!this.scanResults.events.ismEscalated) {
				VisualLogger.warn('⚠️ No specific ISM escalation found, searching for any ISM reference');
				this.collectEvents([/ISM/i], 'ismEscalated');
			}

			if (this.scanResults.events.ismEscalated) {
				VisualLogger.success(`✅ Found ISM escalation`);
			}
		}

		findRelocationCompletion() {
			const patterns = [
				/Pipeline changed.*ISM.*Finish/i,
 /Pipeline changed.*Finish/i,
 /Stage changed.*Finish/i,
 /Workflow.*COMPLETED/i,
 /Onboarding - Closure/i,
 /OB - Done by Contractor/i,
 /Resolved/i,
 /Closed/i,
 /Job Completed/i,
 /Work Done/i,
 /Relocation Done/i
			];
			this.collectEvents(patterns, 'completion');
		}

		findInstallationEvents() {
			VisualLogger.info('🔍 Finding Installation events...');

			// 1. OB -> SD (Escalation)
			const obSdPatterns = [
				/Pipeline changed.*On-?Boarding.*Service Delivery/i,
 /Stage changed.*On-?Boarding.*Service Delivery/i,
 /On-?Boarding.*Service Delivery/i,
 /Escalate to Service Delivery/i,
 /Send to SD/i,
 /OB.*SD/i
			];
			this.collectEvents(obSdPatterns, 'escalation');

			// 2. SD -> CNP (Resolution)
			const sdCnpPatterns = [
				/Pipeline changed.*Service Delivery.*CNP/i,
 /Stage changed.*Service Delivery.*CNP/i,
 /Service Delivery.*CNP/i,
 /Escalate to CNP/i,
 /SD.*CNP/i
			];
			this.collectEvents(sdCnpPatterns, 'resolution');
		}

		findTimelineEvents(forcedType) {
			const type = forcedType || this.detectTicketType();
			VisualLogger.info(`🔍 Finding events for ${type}...`);

			this.findCreationEvent();

			if (type === 'INSTALLATION') {
				// FIX: Unify event finding to match SUPPORT, which is working correctly.
				this.findEscalationEvent();
				this.findResolutionEvent();
				this.findFinalEvent();
			} else if (type === 'RELOCATION') {
				// FIX: Unify event finding to match SUPPORT.
				this.findEscalationEvent();
				this.findResolutionEvent();
				this.findFinalEvent();
			} else {
				// SUPPORT
				this.findEscalationEvent();
				this.findResolutionEvent();
				this.findFinalEvent();
			}
		}

		findCreationEvent() {
			const sidebarText = document.body.innerText;
			const createdMatch = sidebarText.match(/Created on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s+(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]m)/i);
			if (createdMatch) {
				const dateObj = new Date(createdMatch[1]);
				const timeObj = this.parser.parseTime(createdMatch[2]);
				if (!isNaN(dateObj) && timeObj) {
					const dt = this.parser.combineDateAndTime(dateObj, timeObj);
					this.scanResults.allEvents.creation.push(dt);
					this.scanResults.events.creation = dt;
				}
			}

			const patterns = [/(?:created|new|submitted)/i];
			this.collectEvents(patterns, 'creation');

			// Fallback: If no creation found, use the oldest activity found in the timeline
			if (!this.scanResults.events.creation && this.scanResults.rawData.length > 0) {
				// Assuming timeline is Newest (Top) to Oldest (Bottom) or vice versa.
				// We look for the item with the highest Y position (bottom of list) as likely oldest
				for (let i = this.scanResults.rawData.length - 1; i >= 0; i--) {
					const item = this.scanResults.rawData[i];
					let dt = null;
					if (item.exactDate) {
						dt = item.exactDate;
					} else if (item.time && item.dateHeader) {
						const d = this.parser.parseDateHeader(item.dateHeader);
						const t = this.parser.parseTime(item.time);
						if (d && t) dt = this.parser.combineDateAndTime(d, t);
					}
					if (dt) {
						this.scanResults.events.creation = dt;
						this.scanResults.allEvents.creation.push(dt);
						VisualLogger.info('⚠️ Using oldest timeline activity as fallback Creation Date');
						break;
					}
				}
			}
		}

		findEscalationEvent() {
			const patterns = [
				/Pipeline changed.*ISM.*Escalate to Service Delivery/i,
 /Pipeline changed.*Escalate.*Service Delivery/i,
 /Stage changed.*Escalate.*Service Delivery/i,
 /Escalate.*Service Delivery/i,
 /Pipeline changed.*ISM.*Escalate to Service Delivery.*Area Cordinator/i,
 /Pipeline changed.*ISM.*Escalate to Service Delivery.*Area Coordinator/i,
 /Pipeline changed.*ISM-Escalate to Service Delivery.*Service Delivery.*Area Cordinator/i,
 /Pipeline changed.*ISM-Escalate to Service Delivery.*Service Delivery.*Area Coordinator/i,
 /Pipeline changed.*CNP.*CNP-Escalation Received.*Service Delivery.*Area Cordinator/i,
 /Pipeline changed.*Service Delivery.*Escalate/i,
 /Stage changed.*ISM-Escalate to Service Delivery/i,
 /ISM.*Escalate to Service Delivery/i,
 /Escalate.*Area Cordinator/i,
 /Escalate.*Area Coordinator/i,
 /Service Delivery.*Area Cordinator/i,
 /Escalate.*SD/i,
 /SD.*Escalate/i,
 /Escalate.*Service/i,
 /Service.*Escalate/i,
 /Escalate.*Delivery/i,
 /Delivery.*Escalate/i,
 /Escalate.*Cordinator/i,
 /Cordinator.*Escalate/i
			];
			this.collectEvents(patterns, 'escalation');
		}

		findResolutionEvent() {
			const patterns = [
				/Pipeline changed.*Service Delivery.*Resolved/i,
 /Pipeline changed.*Service Delivery.*ISM/i,
 /Service Delivery.*Resolved/i,
 /Pipeline changed.*Service Delivery.*FST-Resolved.*ISM.*FST Resolved/i,
 /Pipeline changed.*Service DeliveryFST-Resolved.*ISM-FST Resolved/i,
 /Pipeline changed.*FST-Resolved.*ISM-FST Resolved/i,
 /Service Delivery.*FST-Resolved.*ISM/i
			];
			this.collectEvents(patterns, 'resolution');
		}

		findFinalEvent() {
			const patterns = [
				/CSC-Resolved/i,
 /Stage changed.*Resolved/i,
 /Pipeline changed.*Resolved/i
			];
			this.collectEvents(patterns, 'final');
		}

		prepareRowData(forcedType, rowNumber) {
			this.scanAllContent();
			const ticketType = forcedType || this.detectTicketType();
			this.findTimelineEvents(ticketType);

			const ticketId = this.extractTicketId();
			const events = this.scanResults.events;

			const creation = this.formatDateTime(events.creation);
			const escalation = this.formatDateTime(events.escalation);
			const resolution = this.formatDateTime(events.resolution || events.final);
			const sdEscalated = this.formatDateTime(events.sdEscalated);
			const ismEscalated = this.formatDateTime(events.ismEscalated);
			const completion = this.formatDateTime(events.completion);

			// Fix Order Logic
			this.fixEventOrder('escalation', 'resolution');
			this.fixEventOrder('escalation', 'final');

			// Calculate MTTR (HH:MM:SS)
			// FIX: Unify MTTR calculation for all types based on the working SUPPORT logic.
			let mttr = '0:00:00'; // Default to zero if calculation fails but column exists
			const endEvent = events.resolution || events.final || events.completion;
			const startEvent = events.escalation || events.creation;
			if (endEvent && startEvent) {
				mttr = this.formatDuration(endEvent - startEvent);
			}

			const updates = [];

			if (ticketType === 'SUPPORT') {
				const mapping = SHEET_MAPPING.SUPPORT;

				if (mapping.writeColumns.ticketId) updates.push({ col: mapping.writeColumns.ticketId, val: ticketId });
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				if (mapping.writeColumns.escalated) updates.push({ col: mapping.writeColumns.escalated, val: escalation });
				if (mapping.writeColumns.resolved) updates.push({ col: mapping.writeColumns.resolved, val: resolution });
				if (mapping.writeColumns.mttr) updates.push({ col: mapping.writeColumns.mttr, val: mttr || '' });
				if (mapping.writeColumns.slaMet && rowNumber) updates.push({ col: mapping.writeColumns.slaMet, val: `=IF(${mapping.writeColumns.mttr}${rowNumber}<=2,"YES","NO")` });

			} else if (ticketType === 'INSTALLATION') {
				const mapping = SHEET_MAPPING.INSTALLATION;
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				if (mapping.writeColumns.escalated) updates.push({ col: mapping.writeColumns.escalated, val: escalation });
				if (mapping.writeColumns.resolved) updates.push({ col: mapping.writeColumns.resolved, val: resolution });
				if (mapping.writeColumns.mttr) updates.push({ col: mapping.writeColumns.mttr, val: mttr || '' });
				if (mapping.writeColumns.slaMet && rowNumber) updates.push({ col: mapping.writeColumns.slaMet, val: `=IF(${mapping.writeColumns.mttr}${rowNumber}<=5,"YES","NO")` });

			} else if (ticketType === 'RELOCATION') {
				const mapping = SHEET_MAPPING.RELOCATION;
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				// FIX: Write the standard escalation/resolution events to the relocation columns.
				if (mapping.writeColumns.sdEscalated) updates.push({ col: mapping.writeColumns.sdEscalated, val: escalation });
				if (mapping.writeColumns.ismEscalated) updates.push({ col: mapping.writeColumns.ismEscalated, val: resolution });
				if (mapping.writeColumns.mttr) updates.push({ col: mapping.writeColumns.mttr, val: mttr || '' });
			}

			return {
				ticketId,
				ticketType,
				events,
				updates
			};
		}
	}

	// ========== ENHANCED EXTRACTION VALIDATOR ==========
	class ExtractionValidator {
		validateExtraction(extractionResult) {
			const errors = [];
			const warnings = [];

			// Required fields check
			if (!extractionResult.ticketId || extractionResult.ticketId === 'UNKNOWN') {
				errors.push('Missing or invalid Ticket ID');
			}

			if (!extractionResult.events.creation) {
				errors.push('Missing creation date/time');
			}

			if (extractionResult.ticketType === 'RELOCATION') {
				// Relocation specific validation
				if (!extractionResult.events.sdEscalated) {
					warnings.push('Missing SD escalation date/time for Relocation');
				}
				if (!extractionResult.events.ismEscalated) {
					warnings.push('Missing ISM escalation date/time for Relocation');
				}
			} else if (extractionResult.ticketType === 'SUPPORT') {
				if (!extractionResult.events.escalation) {
					warnings.push('Missing escalation date/time - will use creation time');
				}
				if (!extractionResult.events.resolution && !extractionResult.events.final) {
					warnings.push('Missing resolution date/time');
				}
			} else if (extractionResult.ticketType === 'INSTALLATION') {
				if (!extractionResult.events.escalation) {
					warnings.push('Missing escalation date/time for Installation');
				}
				if (!extractionResult.events.resolution && !extractionResult.events.final) {
					warnings.push('Missing resolution date/time for Installation');
				}
			}

			// Data quality checks
			extractionResult.updates.forEach(update => {
				if (update.val && update.val.length > 1000) {
					warnings.push(`Very long value in column ${update.col}`);
				}
			});

			return {
				isValid: errors.length === 0,
				isComplete: errors.length === 0 && warnings.length <= 1,
				errors,
				warnings,
				score: this.calculateQualityScore(extractionResult)
			};
		}

		calculateQualityScore(extraction) {
			let score = 100;

			// Deduct points for missing data
			if (!extraction.ticketId || extraction.ticketId === 'UNKNOWN') score -= 40;
			if (!extraction.events.creation) score -= 30;
			if (!extraction.events.escalation) score -= 15;
			if (!extraction.events.resolution && !extraction.events.final) score -= 15;

			// Bonus for complete data
			if (extraction.ticketId && extraction.ticketId !== 'UNKNOWN' &&
				extraction.events.creation &&
				extraction.events.escalation &&
				(extraction.events.resolution || extraction.events.final)) {
				score += 20;
				}

				return Math.max(0, Math.min(100, score));
		}
	}

	// ========== MTTR CALCULATION ENGINE ==========
// ========== MTTR CALCULATION ENGINE (FIXED) ==========
class MTTRMasterEngine {
    constructor() {
        // ⚠️ CONFIRM THIS ID IS CORRECT FOR MAINLAND WEST
        this.spreadsheetId = '1PhfkshRwLv0lG7ZjGcarIvoMmu9EFi4O6V7uAWWbz6Y'; 
        this.client = new GoogleSheetsClient(); 

        // MAPPING CONFIGURATION 
        this.AVERAGE_SHEET_MAP = {
            "Area 1N Ikeja Opebi Allen": { SUPPORT: "C", INSTALLATION: "D", RELOCATION: "E" },
            "Area 1S Ikeja GRA Ogba": { SUPPORT: "G", INSTALLATION: "H", RELOCATION: "I" },
            "Area 2N Ojodu": { SUPPORT: "K", INSTALLATION: "L", RELOCATION: "M" },
            "Area 3N Anthony Illupeju": { SUPPORT: "O", INSTALLATION: "P", RELOCATION: "Q" },
            "Area 3W Illupeju Ajao": { SUPPORT: "S", INSTALLATION: "T", RELOCATION: "U" },
            "Area 5 Festac": { SUPPORT: "W", INSTALLATION: "X", RELOCATION: "Y" },
        };

        this.SOURCE_CONFIG = {
            SUPPORT: { col_idx: 7, col_letter: "G" },
            INSTALLATION: { col_idx: 14, col_letter: "N" },
            RELOCATION: { col_idx: 21, col_letter: "U" },
        };

        this.availableSheets = Object.keys(this.AVERAGE_SHEET_MAP);

        this.processingStats = {
            totalProcessed: 0,
            successful: 0,
            failed: 0,
            startTime: null,
            currentOperation: null
        };
    }

    async authenticate() {
        try {
            await this.client.getAccessToken();
            VisualLogger.success('✅ MTTR Engine: Authenticated');
            return true;
        } catch (error) {
            VisualLogger.error(`❌ MTTR Engine Auth Failed: ${error.message}`);
            return false;
        }
    }

    // --- FIX 1: Helper Method Added Inside Class ---
    escapeSheetName(sheetName) {
        if (!sheetName) return "";
        const name = String(sheetName);
        // Fix: Handle single quotes inside name and always wrap in quotes for safety
        const escaped = name.replace(/'/g, "''");
        return `'${escaped}'`;
    }

    parseDuration(timeStr) {
        if (!timeStr || /no ticket/i.test(String(timeStr)) || String(timeStr).trim() === "") return null;
        try {
            const parts = String(timeStr).trim().split(':');
            if (parts.length === 3) {
                const [h, m, s] = parts.map(Number);
                return h + (m / 60) + (s / 3600);
            } else if (parts.length === 2) {
                const [h, m] = parts.map(Number);
                return h + (m / 60);
            } else {
                // FIX: Ensure NaN is not returned. If a value cannot be converted to a number,
                // treat it as invalid by returning null so it's skipped.
                const num = Number(timeStr);
                return isNaN(num) ? null : num;
            }
        } catch {
            return null;
        }
    }

    isDateHeader(cellValue) {
        if (!cellValue) return false;
        const text = String(cellValue).trim().toLowerCase();
        return (
            ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].some(day => text.includes(day)) &&
            ["2024", "2025", "2026"].some(year => text.includes(year))
        ) || /^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(text);
    }

    async processSheet(sheetName, category, specificDate = null) {
        this.processingStats.currentOperation = `Processing ${sheetName} [${category}]`;
        VisualLogger.info(`\n${'='.repeat(60)}`);
        VisualLogger.info(`📡 PROCESSING: "${sheetName}"`);
        VisualLogger.info(`🔧 CATEGORY:   ${category}`);

        try {
            if (!this.AVERAGE_SHEET_MAP[sheetName]) {
                throw new Error("Area not found in mapping");
            }

            // FIX: Resolve exact sheet name from API to handle spaces/casing
            const sheets = await this.client.getSheets();
            const matchedSheet = sheets.find(s => s.properties.title.trim() === sheetName.trim());
            
            if (!matchedSheet) {
                throw new Error(`Sheet '${sheetName}' not found in spreadsheet`);
            }
            
            const actualSheetName = matchedSheet.properties.title;
            const targetCol = this.AVERAGE_SHEET_MAP[sheetName][category];
            const readCfg = this.SOURCE_CONFIG[category];
            
            if (!readCfg) throw new Error(`Invalid category: ${category}`);
            const readIdx = readCfg.col_idx;

            // Use actual name for API call
            const safeName = this.escapeSheetName(actualSheetName); 
            const rangeStr = `${safeName}!A1:Z10000`;
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(rangeStr)}`;
            
            const response = await this.client.apiRequest(url);
            
            if (response.error) {
                throw new Error(response.error.message);
            }

            const allData = response.values || [];

            if (allData.length === 0) {
                throw new Error("Sheet is empty");
            }

            let latestDate = null;
            let durations = [];
            let foundSpecificDate = false;
            let lastInvalidValue = null; // For improved error reporting

            VisualLogger.info("   Scanning for date block...");

            for (let i = allData.length - 1; i >= 0; i--) {
                const row = allData[i];
                if (row.length < 1) continue;

                // FIX: Date is in Column A (index 0) per user instruction
                const dateCell = (row[0] || "").trim();

                if (this.isDateHeader(dateCell)) {
                    if (specificDate) {
                        if (dateCell === specificDate) {
                            latestDate = dateCell;
                            foundSpecificDate = true;
                            VisualLogger.info(`   → Found specific date: ${latestDate}`);
                        } else if (foundSpecificDate) {
                            break;
                        }
                    } else {
                        if (!latestDate) {
                            latestDate = dateCell;
                            VisualLogger.info(`   → Found latest date: ${latestDate}`);
                        } else if (dateCell !== latestDate && durations.length > 0) {
                            break;
                        }
                    }
                }

                const targetDate = specificDate || latestDate;
                if (targetDate && dateCell === targetDate) {
                    if (row.length >= readIdx) {
                        const rawValue = row[readIdx - 1];
                        const val = this.parseDuration(rawValue);
                        if (val !== null) {
                            durations.push(val);
                        } else if (rawValue && String(rawValue).trim() !== "") {
                            lastInvalidValue = String(rawValue).trim();
                        }
                    }
                }
            }

            if (!latestDate || (specificDate && !foundSpecificDate)) {
                throw new Error(`Date block not found: ${specificDate || 'Latest'}`);
            }

            let avgFormatted;
            if (durations.length === 0) {
                let errorMsg = "No valid durations found";
                if (lastInvalidValue) {
                    errorMsg += ` (found text like: "${lastInvalidValue.substring(0, 30)}...")`;
                }
                VisualLogger.warn(`   ❌ ${errorMsg} in column ${readCfg.col_letter} for ${latestDate}`);
                avgFormatted = "NILL";
                VisualLogger.info(`   📊 Writing "NILL" as no valid tickets were found.`);
            } else {
                const avgVal = durations.reduce((a, b) => a + b, 0) / durations.length;
                avgFormatted = avgVal.toFixed(2);
                VisualLogger.success(`   ✅ Found ${durations.length} valid tickets`);
                VisualLogger.info(`   📊 Average MTTR: ${avgFormatted} hours`);
            }

            await this.updateAverageSheet(latestDate, avgFormatted, targetCol);

            this.processingStats.successful++;
            this.processingStats.totalProcessed++;

            return {
                success: true,
                sheet: sheetName,
                category: category,
                date: latestDate,
                count: durations.length,
                average: avgFormatted
            };

        } catch (error) {
            VisualLogger.error(`   💥 Error: ${error.message}`);
            this.processingStats.failed++;
            this.processingStats.totalProcessed++;
            return { success: false, sheet: sheetName, category: category, error: error.message };
        } finally {
            this.processingStats.currentOperation = null;
        }
    }

    async updateAverageSheet(date, value, columnLetter) {
        const averageSheetName = "AVERAGE";
        // --- FIX 3: Use internal escape method here too ---
        const escapedAverage = this.escapeSheetName(averageSheetName);

        const rangeRead = `${escapedAverage}!B:B`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(rangeRead)}`;
        const response = await this.client.apiRequest(url);
        const dates = response.values || [];

        let rowNum = -1;
        const flatDates = dates.map(r => r[0] || "");
        rowNum = flatDates.indexOf(date);

        if (rowNum === -1) {
            VisualLogger.info("   📅 New date → appending at bottom");
            rowNum = flatDates.length;
            const dateRange = `${escapedAverage}!B${rowNum + 1}`;
            await this.client.apiRequest(
                `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(dateRange)}?valueInputOption=USER_ENTERED`,
                { method: 'PUT', data: { values: [[date]] } }
            );
        } else {
            VisualLogger.info(`   → Date exists at row ${rowNum + 1}`);
        }

        const valRange = `${escapedAverage}!${columnLetter}${rowNum + 1}`;
        await this.client.apiRequest(
            `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${encodeURIComponent(valRange)}?valueInputOption=USER_ENTERED`,
            { method: 'PUT', data: { values: [[value]] } }
        );

        VisualLogger.success(`   💾 SAVED ${value} to ${columnLetter}${rowNum + 1}`);
    }

    async processMultipleSheets(sheetNames, category, specificDate = null) {
        this.processingStats.startTime = Date.now();
        this.processingStats.successful = 0;
        this.processingStats.failed = 0;
        this.processingStats.totalProcessed = 0;

        const results = [];

        for (const sheetName of sheetNames) {
            try {
                const result = await this.processSheet(sheetName, category, specificDate);
                results.push(result);
                if (sheetNames.indexOf(sheetName) < sheetNames.length - 1) {
                    await this.sleep(500);
                }
            } catch (error) {
                results.push({ success: false, sheet: sheetName, category: category, error: error.message });
                this.processingStats.failed++;
                this.processingStats.totalProcessed++;
            }
        }
        return results;
    }

    getProcessingStats() {
        const elapsedTime = Date.now() - (this.processingStats.startTime || Date.now());
        const successRate = this.processingStats.totalProcessed > 0
        ? Math.round((this.processingStats.successful / this.processingStats.totalProcessed) * 100)
        : 0;

        return {
            ...this.processingStats,
            elapsedTime,
            successRate,
            isProcessing: this.processingStats.currentOperation !== null
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

	// ========== MTTR INTERFACE MANAGER ==========
	class MTTRInterfaceManager {
		constructor() {
			this.mttrEngine = null;
			this.isProcessing = false;
			this.currentSession = null;
			this.sessionHistory = [];
		}

		async initialize() {
			try {
				VisualLogger.info('🚀 Initializing MTTR MASTER Engine...');

				this.mttrEngine = new MTTRMasterEngine();

				// Authenticate
				LoadingManager.show('Initializing MTTR MASTER', 'Connecting to Google Sheets...');
				const authSuccess = await this.mttrEngine.authenticate();

				if (!authSuccess) {
					LoadingManager.hide();
					ToastManager.show('Failed to authenticate MTTR Engine', 'error');
					return false;
				}

				LoadingManager.hide();
				VisualLogger.success('✅ MTTR MASTER Engine initialized successfully');
				return true;

			} catch (error) {
				LoadingManager.hide();
				VisualLogger.error(`❌ Failed to initialize MTTR Engine: ${error.message}`);
				ToastManager.show(`MTTR Initialization failed: ${error.message}`, 'error');
				return false;
			}
		}

		showMainInterface() {
			// Remove existing dialogs
			const existingDialogs = document.querySelectorAll('.ultra-dialog, .mttr-dialog');
			existingDialogs.forEach(dialog => dialog.remove());

			const dialog = document.createElement('div');
			dialog.className = 'ultra-dialog mttr-dialog';
			dialog.innerHTML = `
			<div class="ultra-card">
			<div style="position: absolute; top: 8px; left: 12px; font-size: 8px; color: rgba(255, 255, 255, 0.1);">MTTR MASTER v9.3</div>

			<!-- TITLE BAR -->
			<div class="ultra-title">
			<div class="ultra-title-icon">📊</div>
			<div class="ultra-title-text">
			<div class="ultra-title-main">MTTR MASTER v9.3</div>
			<div class="ultra-title-sub">Advanced MTTR Calculation & Processing</div>
			</div>
			</div>

			<!-- PROGRESS INDICATOR -->
			<div id="mttrProgress" style="display: none; margin-bottom: 20px;">
			<div style="background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 15px;">
			<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
			<span id="mttrOperation" style="color: #cbd5e1; font-size: 13px;">Processing...</span>
			<span id="mttrProgressPercent" style="color: #38bdf8; font-weight: 600;">0%</span>
			</div>
			<div style="height: 6px; background: #334155; border-radius: 3px; overflow: hidden;">
			<div id="mttrProgressBar" style="height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); width: 0%; transition: width 0.3s;"></div>
			</div>
			<div id="mttrProgressDetails" style="margin-top: 8px; color: #94a3b8; font-size: 12px;"></div>
			</div>
			</div>

			<!-- MODE SELECTION -->
			<div class="ultra-input-container">
			<label class="ultra-input-label">Processing Mode</label>
			<div style="display: flex; gap: 8px; margin-bottom: 15px;">
			<button id="mttrModeLatest" class="ultra-btn ultra-btn-primary" style="flex: 1; padding: 12px; font-size: 14px;">
			📅 Process Latest Date
			</button>
			<button id="mttrModeManual" class="ultra-btn ultra-btn-secondary" style="flex: 1; padding: 12px; font-size: 14px;">
			✏️ Manual Date Entry
			</button>
			</div>
			</div>

			<!-- SHEET SELECTION -->
			<div class="ultra-input-container">
			<label class="ultra-input-label">Select Sheets to Process</label>
			<div id="mttrSheetList" style="max-height: 200px; overflow-y: auto; background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 10px;">
			${this.mttrEngine.availableSheets.map((sheet, index) => `
				<div style="display: flex; align-items: center; padding: 8px; border-bottom: 1px solid rgba(51, 65, 85, 0.3);">
				<input type="checkbox" id="sheet_${index}" class="mttr-sheet-checkbox" style="margin-right: 10px;">
				<label for="sheet_${index}" style="color: #cbd5e1; cursor: pointer; flex: 1;">${sheet}</label>
				<span class="mttr-sheet-badge" data-sheet="${sheet}" style="font-size: 11px; padding: 2px 8px; background: #334155; border-radius: 10px; color: #94a3b8;">Auto-detect</span>
				</div>
				`).join('')}
				</div>
				<div style="margin-top: 10px; display: flex; gap: 8px;">
				<button id="mttrSelectAll" class="ultra-queue-control" style="flex: 1;">Select All</button>
				<button id="mttrSelectNone" class="ultra-queue-control" style="flex: 1;">Select None</button>
				<button id="mttrSmartSelect" class="ultra-queue-control" style="flex: 1;">Smart Select</button>
				</div>
				</div>

				<!-- CATEGORY SELECTION -->
				<div class="ultra-input-container">
				<label class="ultra-input-label">Categories to Process</label>
				<div style="display: flex; gap: 5px;">
				<button class="ultra-queue-control mttr-category-btn selected" data-category="SUPPORT" style="flex:1; padding: 10px; border-color: #38bdf8; color: #fff;">SUPPORT</button>
				<button class="ultra-queue-control mttr-category-btn selected" data-category="INSTALLATION" style="flex:1; padding: 10px; border-color: #38bdf8; color: #fff;">INSTALLATION</button>
				<button class="ultra-queue-control mttr-category-btn selected" data-category="RELOCATION" style="flex:1; padding: 10px; border-color: #38bdf8; color: #fff;">RELOCATION</button>
				</div>
				</div>

				<!-- MANUAL DATE INPUT (Initially Hidden) -->
				<div id="mttrManualDateContainer" class="ultra-input-container" style="display: none;">
				<label class="ultra-input-label">Enter Date to Process</label>
				<input type="text" id="mttrManualDateInput" class="ultra-input" placeholder="e.g., Monday, January 12, 2026" style="height: auto;">
				<div style="margin-top: 5px; color: #94a3b8; font-size: 12px;">
				Paste exact date string from the sheet. Example formats:<br>
				• Monday, January 12, 2026<br>
				• Tuesday, February 3, 2026<br>
				• Wednesday, March 18, 2026
				</div>
				</div>

				<!-- PROCESSING OPTIONS -->
				<div class="ultra-input-container">
				<label class="ultra-input-label">Processing Options</label>
				<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
				<label class="ultra-toggle">
				<input type="checkbox" id="mttrEnableRetry" class="ultra-toggle-input" checked>
				<div class="ultra-toggle-slider"></div>
				<span class="ultra-toggle-label">Auto-Retry Failed Operations</span>
				</label>
				</div>
				<div style="display: flex; align-items: center; gap: 10px;">
				<label class="ultra-toggle">
				<input type="checkbox" id="mttrDetailedLogs" class="ultra-toggle-input" checked>
				<div class="ultra-toggle-slider"></div>
				<span class="ultra-toggle-label">Detailed Progress Logging</span>
				</label>
				</div>
				</div>

				<!-- RESULTS PREVIEW -->
				<div id="mttrResultsPreview" style="display: none; margin-top: 20px;">
				<div style="background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 15px;">
				<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
				<div style="font-size: 24px;">📈</div>
				<div>
				<div style="font-weight: bold; color: #f1f5f9;">Processing Results</div>
				<div id="mttrResultsSummary" style="color: #94a3b8; font-size: 12px;">Ready to process</div>
				</div>
				</div>
				<div id="mttrResultsDetails" style="max-height: 200px; overflow-y: auto;"></div>
				</div>
				</div>

				<!-- ACTION BUTTONS -->
				<div class="ultra-buttons">
				<button id="mttrStartProcessing" class="ultra-btn ultra-btn-primary" style="flex: 2;">
				🚀 Start MTTR Processing
				</button>
				<button id="mttrCloseDialog" class="ultra-btn ultra-btn-secondary">
				❌ Close
				</button>
				</div>

				<!-- STATS & INFO -->
				<div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #334155; color: #94a3b8; font-size: 12px; line-height: 1.5;">
				<div style="display: flex; justify-content: space-between;">
				<span>Engine Status: <span id="mttrEngineStatus" style="color: #4ade80;">Ready</span></span>
				<span>Session: <span id="mttrSessionId">${Math.random().toString(36).substr(2, 6).toUpperCase()}</span></span>
				</div>
				<div style="text-align: center; margin-top: 10px; font-weight: 500;">
				MTTR MASTER v9.3 • Advanced Edition • Made by Idris Adeleke
				</div>
				</div>
				</div>
				`;

				document.body.appendChild(dialog);
				this.makeDialogDraggable(dialog);

				// Initialize session
				this.currentSession = {
					id: document.getElementById('mttrSessionId').textContent,
 startTime: Date.now(),
 selectedSheets: [],
 selectedCategories: ['SUPPORT', 'INSTALLATION', 'RELOCATION'],
 mode: 'latest',
 options: {
	 autoRetry: true,
	 detailedLogs: true
 }
				};

				// Set up event handlers
				this.setupMTTREventHandlers(dialog);

				// Update sheet badges with auto-detected categories
				this.updateSheetBadges();

				return dialog;
		}

		setupMTTREventHandlers(dialog) {
			const self = this;

			// Mode selection
			document.getElementById('mttrModeLatest').onclick = () => {
				self.setMode('latest');
			};

			document.getElementById('mttrModeManual').onclick = () => {
				self.setMode('manual');
			};

			// Sheet selection
			document.getElementById('mttrSelectAll').onclick = () => {
				dialog.querySelectorAll('.mttr-sheet-checkbox').forEach(cb => cb.checked = true);
				self.updateSelectedSheets();
			};

			document.getElementById('mttrSelectNone').onclick = () => {
				dialog.querySelectorAll('.mttr-sheet-checkbox').forEach(cb => cb.checked = false);
				self.updateSelectedSheets();
			};

			document.getElementById('mttrSmartSelect').onclick = () => {
				self.smartSelectSheets();
			};

			// Category selection
			dialog.querySelectorAll('.mttr-category-btn').forEach(btn => {
				btn.onclick = function() {
					const category = this.dataset.category;
					const isSelected = this.classList.contains('selected');

					if (isSelected) {
						this.classList.remove('selected');
						this.style.borderColor = '#475569';
						this.style.color = '#94a3b8';
						const index = self.currentSession.selectedCategories.indexOf(category);
						if (index > -1) {
							self.currentSession.selectedCategories.splice(index, 1);
						}
					} else {
						this.classList.add('selected');
						this.style.borderColor = '#38bdf8';
						this.style.color = '#fff';
						self.currentSession.selectedCategories.push(category);
					}

					self.updateSheetBadges();
				};
			});

			// Options
			document.getElementById('mttrEnableRetry').onchange = function() {
				self.currentSession.options.autoRetry = this.checked;
			};

			document.getElementById('mttrDetailedLogs').onchange = function() {
				self.currentSession.options.detailedLogs = this.checked;
			};

			// Start processing
			document.getElementById('mttrStartProcessing').onclick = async () => {
				await self.startProcessing();
			};

			// Close dialog
			document.getElementById('mttrCloseDialog').onclick = () => {
				if (self.isProcessing) {
					if (!confirm('Processing is in progress. Are you sure you want to close?')) {
						return;
					}
				}
				dialog.remove();
			};

			// Update selected sheets when checkboxes change
			dialog.querySelectorAll('.mttr-sheet-checkbox').forEach(cb => {
				cb.onchange = () => self.updateSelectedSheets();
			});

			// Manual date input focus
			const manualInput = document.getElementById('mttrManualDateInput');
			if (manualInput) {
				manualInput.addEventListener('focus', () => {
					manualInput.style.background = 'rgba(30, 41, 59, 0.9)';
				});

				manualInput.addEventListener('blur', () => {
					manualInput.style.background = 'rgba(30, 41, 59, 0.7)';
				});
			}
		}

		setMode(mode) {
			this.currentSession.mode = mode;

			const latestBtn = document.getElementById('mttrModeLatest');
			const manualBtn = document.getElementById('mttrModeManual');
			const manualContainer = document.getElementById('mttrManualDateContainer');

			if (mode === 'latest') {
				latestBtn.className = 'ultra-btn ultra-btn-primary';
				manualBtn.className = 'ultra-btn ultra-btn-secondary';
				manualContainer.style.display = 'none';
			} else {
				latestBtn.className = 'ultra-btn ultra-btn-secondary';
				manualBtn.className = 'ultra-btn ultra-btn-primary';
				manualContainer.style.display = 'block';

				// Focus the manual date input
				setTimeout(() => {
					const input = document.getElementById('mttrManualDateInput');
					if (input) input.focus();
				}, 100);
			}
		}

		updateSelectedSheets() {
			const checkboxes = document.querySelectorAll('.mttr-sheet-checkbox:checked');
			this.currentSession.selectedSheets = Array.from(checkboxes).map(cb => {
				const label = document.querySelector(`label[for="${cb.id}"]`);
				return label ? label.textContent.trim() : '';
			}).filter(name => name);

			// Update UI
			const summary = document.getElementById('mttrResultsSummary');
			if (summary) {
				summary.textContent = `Ready to process ${this.currentSession.selectedSheets.length} sheet(s)`;
			}
		}

		updateSheetBadges() {
			const badges = document.querySelectorAll('.mttr-sheet-badge');
			badges.forEach(badge => {
				const sheetName = badge.dataset.sheet;
				const categories = this.detectSheetCategories(sheetName);

				if (categories.length === 0) {
					badge.textContent = 'No categories';
					badge.style.background = '#7f1d1d';
					badge.style.color = '#fca5a5';
				} else {
					badge.textContent = categories.join(', ');
					badge.style.background = '#065f46';
					badge.style.color = '#6ee7b7';
				}
			});
		}

		detectSheetCategories(sheetName) {
			const upperSheet = sheetName.toUpperCase();
			const detected = [];

			// Check sheet name for category hints
			if (upperSheet.includes('SUPPORT')) detected.push('SUPPORT');
			if (upperSheet.includes('INSTALLATION')) detected.push('INSTALLATION');
			if (upperSheet.includes('RELOCATION')) detected.push('RELOCATION');

			// If no explicit category, check area sheets
			if (detected.length === 0) {
				if (upperSheet.includes('AREA') || upperSheet.includes('ME')) {
					return ['SUPPORT', 'INSTALLATION', 'RELOCATION'];
				}
			}

			return detected;
		}

		smartSelectSheets() {
			const checkboxes = document.querySelectorAll('.mttr-sheet-checkbox');

			checkboxes.forEach(cb => {
				const label = document.querySelector(`label[for="${cb.id}"]`);
				const sheetName = label ? label.textContent.trim() : '';

				// Smart logic: Select sheets that match current categories
				const sheetCategories = this.detectSheetCategories(sheetName);
				const hasMatchingCategory = sheetCategories.some(cat =>
				this.currentSession.selectedCategories.includes(cat)
				);

				cb.checked = hasMatchingCategory;
			});

			this.updateSelectedSheets();
			ToastManager.show('Smart selection applied', 'success');
		}

		async startProcessing() {
			if (this.isProcessing) {
				ToastManager.show('Processing already in progress', 'warning');
				return;
			}

			// Validate inputs
			if (this.currentSession.selectedSheets.length === 0) {
				ToastManager.show('Please select at least one sheet', 'warning');
				return;
			}

			if (this.currentSession.selectedCategories.length === 0) {
				ToastManager.show('Please select at least one category', 'warning');
				return;
			}

			if (this.currentSession.mode === 'manual') {
				const manualDate = document.getElementById('mttrManualDateInput').value.trim();
				if (!manualDate) {
					ToastManager.show('Please enter a date for manual mode', 'warning');
					return;
				}
				this.currentSession.manualDate = manualDate;
			}

			this.isProcessing = true;

			// Show progress indicator
			document.getElementById('mttrProgress').style.display = 'block';
			document.getElementById('mttrResultsPreview').style.display = 'block';
			document.getElementById('mttrStartProcessing').disabled = true;
			document.getElementById('mttrStartProcessing').innerHTML = '⏳ Processing...';

			// Disable inputs during processing
			document.querySelectorAll('input, button, select').forEach(el => {
				if (el.id !== 'mttrCloseDialog') {
					el.disabled = true;
				}
			});

			// Initialize results display
			const resultsContainer = document.getElementById('mttrResultsDetails');
			resultsContainer.innerHTML = `
			<div style="color: #94a3b8; text-align: center; padding: 20px;">
			<div style="font-size: 32px; margin-bottom: 10px;">📊</div>
			<div>Starting MTTR calculation...</div>
			</div>
			`;

			try {
				const totalOperations = this.currentSession.selectedSheets.length * this.currentSession.selectedCategories.length;
				let completedOperations = 0;
				const allResults = [];

				// Process each sheet and category combination
				for (const sheetName of this.currentSession.selectedSheets) {
					for (const category of this.currentSession.selectedCategories) {
						// Update progress
						completedOperations++;
						const progressPercent = Math.round((completedOperations / totalOperations) * 100);

						this.updateProgress({
							percent: progressPercent,
							operation: `Processing ${sheetName} [${category}]`,
							details: `${completedOperations} of ${totalOperations} operations`
						});

						// Process the sheet
						const result = await this.processSingleSheet(sheetName, category);
						allResults.push(result);

						// Update results display
						this.updateResultsDisplay(allResults);

						// Small delay between operations
						if (completedOperations < totalOperations) {
							await this.sleep(300);
						}
					}
				}

				// Complete processing
				this.isProcessing = false;

				// Show final results
				this.updateProgress({
					percent: 100,
					operation: 'Processing Complete',
					details: `${allResults.filter(r => r.success).length} successful, ${allResults.filter(r => !r.success).length} failed`
				});

				document.getElementById('mttrStartProcessing').innerHTML = '✅ Processing Complete';

				// Play success sound
				SoundManager.playSuccess();

				// Show summary toast
				const successful = allResults.filter(r => r.success).length;
				const total = allResults.length;
				const successRate = Math.round((successful / total) * 100);

				ToastManager.show(`MTTR Processing Complete: ${successful}/${total} successful (${successRate}%)`, 'success', 8000);

				// Save to session history
				this.saveToHistory(allResults);

				// Re-enable inputs after 2 seconds
				setTimeout(() => {
					document.querySelectorAll('input, button, select').forEach(el => {
						el.disabled = false;
					});
					document.getElementById('mttrStartProcessing').disabled = false;
					document.getElementById('mttrStartProcessing').innerHTML = '🔄 Process Again';
				}, 2000);

			} catch (error) {
				this.isProcessing = false;

				VisualLogger.error(`❌ MTTR Processing failed: ${error.message}`);
				ToastManager.show(`Processing failed: ${error.message}`, 'error');

				// Re-enable inputs
				document.querySelectorAll('input, button, select').forEach(el => {
					el.disabled = false;
				});
				document.getElementById('mttrStartProcessing').disabled = false;
				document.getElementById('mttrStartProcessing').innerHTML = '🚀 Start MTTR Processing';

				SoundManager.playError();
			}
		}

		async processSingleSheet(sheetName, category) {
			try {
				const specificDate = this.currentSession.mode === 'manual' ? this.currentSession.manualDate : null;

				const result = await this.mttrEngine.processSheet(sheetName, category, specificDate);

				if (result.success) {
					VisualLogger.success(`✅ MTTR: ${sheetName} [${category}] processed successfully`);
				} else {
					VisualLogger.warn(`⚠️ MTTR: ${sheetName} [${category}] processing failed: ${result.message || result.error}`);
				}

				return result;

			} catch (error) {
				VisualLogger.error(`❌ MTTR: Error processing ${sheetName} [${category}]: ${error.message}`);
				return {
					success: false,
					sheet: sheetName,
					category: category,
					error: error.message
				};
			}
		}

		updateProgress({ percent, operation, details }) {
			const progressBar = document.getElementById('mttrProgressBar');
			const progressPercent = document.getElementById('mttrProgressPercent');
			const operationElement = document.getElementById('mttrOperation');
			const detailsElement = document.getElementById('mttrProgressDetails');

			if (progressBar) progressBar.style.width = `${percent}%`;
			if (progressPercent) progressPercent.textContent = `${percent}%`;
			if (operationElement) operationElement.textContent = operation;
			if (detailsElement) detailsElement.textContent = details;

			// Update engine status
			const engineStatus = document.getElementById('mttrEngineStatus');
			if (engineStatus) {
				if (percent === 100) {
					engineStatus.textContent = 'Complete';
					engineStatus.style.color = '#4ade80';
				} else {
					engineStatus.textContent = 'Processing';
					engineStatus.style.color = '#fbbf24';
				}
			}
		}

		updateResultsDisplay(results) {
			const container = document.getElementById('mttrResultsDetails');
			const summary = document.getElementById('mttrResultsSummary');

			if (!container || !summary) return;

			const successful = results.filter(r => r.success).length;
			const total = results.length;
			const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

			summary.textContent = `${successful}/${total} successful (${successRate}%)`;

			// Build results HTML
			let html = '';

			results.forEach((result, index) => {
				const isSuccess = result.success;
				const icon = isSuccess ? '✅' : '❌';
				const color = isSuccess ? '#4ade80' : '#f87171';

				html += `
				<div style="padding: 10px; border-bottom: 1px solid rgba(51, 65, 85, 0.3); ${index === results.length - 1 ? 'border-bottom: none;' : ''}">
				<div style="display: flex; align-items: center; gap: 10px;">
				<span style="font-size: 18px; color: ${color};">${icon}</span>
				<div style="flex: 1;">
				<div style="color: #f1f5f9; font-weight: 600;">${result.sheet} [${result.category}]</div>
				<div style="color: #94a3b8; font-size: 12px;">
				${result.date ? `Date: ${result.date} • ` : ''}
				${result.count !== undefined ? `Tickets: ${result.count} • ` : ''}
				${result.average ? `MTTR: ${result.average}` : ''}
				${result.error ? `Error: ${result.error}` : ''}
				</div>
				</div>
				</div>
				</div>
				`;
			});

			if (html === '') {
				html = '<div style="color: #94a3b8; text-align: center; padding: 20px;">No results yet</div>';
			}

			container.innerHTML = html;
			container.scrollTop = container.scrollHeight;
		}

		saveToHistory(results) {
			const sessionResult = {
				id: this.currentSession.id,
				timestamp: Date.now(),
 mode: this.currentSession.mode,
 manualDate: this.currentSession.manualDate,
 results: results,
 stats: this.mttrEngine.getProcessingStats()
			};

			this.sessionHistory.unshift(sessionResult);

			// Keep only last 10 sessions
			if (this.sessionHistory.length > 10) {
				this.sessionHistory.pop();
			}

			// Save to storage
			GM_setValue('MTTR_SESSION_HISTORY', this.sessionHistory);
		}

		makeDialogDraggable(dialogElement) {
			const titleBar = dialogElement.querySelector('.ultra-title');
			if (!titleBar) return;

			let isDragging = false;
			let startX, startY, initialLeft, initialTop;

			const startDrag = (e) => {
				// Only start drag on title text area
				const titleText = titleBar.querySelector('.ultra-title-text');
				if (!titleText.contains(e.target) && !e.target.classList.contains('ultra-title-icon')) {
					return;
				}

				isDragging = true;
				const rect = dialogElement.getBoundingClientRect();
				startX = e.clientX;
				startY = e.clientY;
				initialLeft = rect.left;
				initialTop = rect.top;

				dialogElement.style.cursor = 'grabbing';
				document.body.style.userSelect = 'none';

				e.preventDefault();
			};

			const doDrag = (e) => {
				if (!isDragging) return;

				const dx = e.clientX - startX;
				const dy = e.clientY - startY;

				dialogElement.style.left = `${initialLeft + dx}px`;
				dialogElement.style.top = `${initialTop + dy}px`;
				dialogElement.style.right = 'auto';
				dialogElement.style.bottom = 'auto';

				e.preventDefault();
			};

			const stopDrag = () => {
				if (!isDragging) return;
				isDragging = false;
				dialogElement.style.cursor = '';
				document.body.style.userSelect = '';
			};

			titleBar.addEventListener('mousedown', startDrag);
			document.addEventListener('mousemove', doDrag);
			document.addEventListener('mouseup', stopDrag);
			document.addEventListener('mouseleave', stopDrag);
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}

	// ========== INTEGRATION WITH EXISTING SCRIPT ==========

	// Add to your main initialization function
	async function initializeMTTRSystem() {
		try {
			if (typeof MTTRInterfaceManager === 'undefined') {
				console.error('❌ MTTRInterfaceManager class is missing');
				return;
			}

			// Create global MTTR manager instance
			window.MTTRManager = new MTTRInterfaceManager();

			// Initialize on demand or automatically
			const autoInitMTTR = GM_getValue('AUTO_INIT_MTTR', true);
			if (autoInitMTTR) {
				VisualLogger.info('🔄 Auto-initializing MTTR MASTER system...');
				const initialized = await window.MTTRManager.initialize();
				if (initialized) {
					VisualLogger.success('✅ MTTR MASTER system ready');
				}
			}
		} catch (e) {
			console.error('❌ Error in initializeMTTRSystem:', e);
			VisualLogger.error(`MTTR Init Error: ${e.message}`);
		}
	}

	function showMTTRChoiceDialog() {
		const dialog = document.createElement('div');
		dialog.className = 'ultra-dialog';
		dialog.innerHTML = `
		<div class="ultra-card" style="max-width: 400px;">
		<div class="ultra-title">
		<div class="ultra-title-icon">⚡</div>
		<div class="ultra-title-text">
		<div class="ultra-title-main">Choose Action</div>
		<div class="ultra-title-sub">Select what you want to do</div>
		</div>
		</div>

		<div style="display: flex; flex-direction: column; gap: 12px; margin: 20px 0;">
		<button id="choicePromptMode" class="ultra-btn ultra-btn-primary" style="justify-content: flex-start; text-align: left; padding: 16px;">
		<span style="font-size: 20px; margin-right: 12px;">🎯</span>
		<div>
		<div style="font-weight: bold;">Prompt Mode</div>
		<div style="font-size: 12px; opacity: 0.8;">Extract ticket data to sheets</div>
		</div>
		</button>

		<button id="choiceMTTRMode" class="ultra-btn" style="justify-content: flex-start; text-align: left; padding: 16px; background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
		<span style="font-size: 20px; margin-right: 12px;">📊</span>
		<div>
		<div style="font-weight: bold;">MTTR MASTER</div>
		<div style="font-size: 12px; opacity: 0.8;">Calculate MTTR averages from sheets</div>
		</div>
		</button>

		<button id="choiceDebugMode" class="ultra-btn ultra-btn-secondary" style="justify-content: flex-start; text-align: left; padding: 16px;">
		<span style="font-size: 20px; margin-right: 12px;">🔧</span>
		<div>
		<div style="font-weight: bold;">Debug Tools</div>
		<div style="font-size: 12px; opacity: 0.8;">Advanced debugging and testing</div>
		</div>
		</button>
		</div>

		<div class="ultra-buttons">
		<button id="choiceCancel" class="ultra-btn ultra-btn-secondary" style="flex: 1;">Cancel</button>
		</div>
		</div>
		`;

		document.body.appendChild(dialog);

		// Event handlers
		document.getElementById('choicePromptMode').onclick = () => {
			dialog.remove();
			const promptManager = window.promptManager || new PromptModeManager();
			promptManager.initialize();
		};

		document.getElementById('choiceMTTRMode').onclick = async () => {
			dialog.remove();
			await launchMTTRMaster();
		};

		document.getElementById('choiceDebugMode').onclick = () => {
			dialog.remove();
			// Show debug panel
			const debugPanel = document.getElementById('ultraDebugPanel');
			if (debugPanel) {
				debugPanel.style.display = debugPanel.style.display === 'block' ? 'none' : 'block';
			}
		};

		document.getElementById('choiceCancel').onclick = () => {
			dialog.remove();
		};
	}

	async function launchMTTRMaster() {
		try {
			// Initialize MTTR manager if not already done
			if (!window.MTTRManager) {
				window.MTTRManager = new MTTRInterfaceManager();
			}

			// Ensure engine is initialized
			const initialized = await window.MTTRManager.initialize();
			if (!initialized) {
				ToastManager.show('Failed to initialize MTTR Engine', 'error');
				return;
			}

			// Show main interface
			window.MTTRManager.showMainInterface();

		} catch (error) {
			VisualLogger.error(`❌ Failed to launch MTTR MASTER: ${error.message}`);
			ToastManager.show(`MTTR launch failed: ${error.message}`, 'error');
		}
	}

	function showEnhancedFABMenu() {
		const existingMenu = document.getElementById('fabContextMenu');
		if (existingMenu) existingMenu.remove();

		const menu = document.createElement('div');
		menu.id = 'fabContextMenu';
		menu.style.cssText = `
		position: fixed;
		bottom: 110px;
		right: 30px;
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 8px;
		padding: 8px 0;
		z-index: 2147483647;
		min-width: 250px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.5);
		animation: fadeIn 0.2s ease-out;
		`;

		const options = [
			{
				icon: '🎯',
				label: 'Prompt Mode',
				subtitle: 'Extract ticket data',
				shortcut: 'Alt+P',
				action: () => {
					const promptManager = window.promptManager || new PromptModeManager();
					promptManager.initialize();
					menu.remove();
				}
			},
			{
				icon: '📊',
				label: 'MTTR MASTER',
				subtitle: 'Calculate averages',
				shortcut: 'Alt+M',
				action: async () => {
					await launchMTTRMaster();
					menu.remove();
				}
			},
			{
				icon: '🔄',
				label: 'Force Recovery',
				subtitle: 'Fix stuck processing',
				action: () => {
					window.promptManager.isNavigating = false;
					GM_deleteValue('CURRENT_SEARCH');
					ToastManager.show('Navigation state reset', 'success');
					setTimeout(() => window.promptManager.processNextInQueue('Manual recovery'), 1000);
					menu.remove();
				}
			},
			{ type: 'divider' },
			{
				icon: '🔧',
				label: 'Debug Tools',
				subtitle: 'Advanced debugging',
				action: () => {
					const debugPanel = document.getElementById('ultraDebugPanel');
					if (debugPanel) {
						debugPanel.style.display = debugPanel.style.display === 'block' ? 'none' : 'block';
					}
					menu.remove();
				}
			},
			{
				icon: '📜',
				label: 'View History',
				subtitle: 'Previous sessions',
				action: () => {
					showMTTRHistory();
					menu.remove();
				}
			},
			{
				icon: '⚙️',
				label: 'Settings',
				subtitle: 'Configure MTTR',
				action: () => {
					showMTTRSettings();
					menu.remove();
				}
			}
		];

		options.forEach(option => {
			if (option.type === 'divider') {
				const divider = document.createElement('div');
				divider.style.cssText = 'height: 1px; background: #334155; margin: 8px 0;';
				menu.appendChild(divider);
				return;
			}

			const item = document.createElement('div');
			item.style.cssText = `
			padding: 10px 16px;
			color: #cbd5e1;
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 12px;
			transition: background 0.2s;
			`;
			item.innerHTML = `
			<span style="font-size: 18px; width: 24px;">${option.icon}</span>
			<div style="flex: 1;">
			<div style="font-weight: 500;">${option.label}</div>
			<div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${option.subtitle}</div>
			</div>
			${option.shortcut ? `<span style="font-size: 10px; color: #64748b; background: rgba(100, 116, 139, 0.2); padding: 2px 6px; border-radius: 4px;">${option.shortcut}</span>` : ''}
			`;

			item.onmouseenter = () => {
				item.style.background = '#334155';
			};
			item.onmouseleave = () => {
				item.style.background = 'transparent';
			};
			item.onclick = option.action;

			menu.appendChild(item);
		});

		document.body.appendChild(menu);

		// Close menu when clicking outside
		setTimeout(() => {
			const closeHandler = (e) => {
				if (!menu.contains(e.target) && !document.getElementById('promptFAB').contains(e.target)) {
					menu.remove();
					document.removeEventListener('click', closeHandler);
				}
			};
			document.addEventListener('click', closeHandler);
		}, 10);
	}

	function showMTTRHistory() {
		const history = GM_getValue('MTTR_SESSION_HISTORY', []);

		const dialog = document.createElement('div');
		dialog.className = 'ultra-dialog';
		dialog.innerHTML = `
		<div class="ultra-card" style="max-width: 600px;">
		<div class="ultra-title">
		<div class="ultra-title-icon">📜</div>
		<div class="ultra-title-text">
		<div class="ultra-title-main">MTTR Processing History</div>
		<div class="ultra-title-sub">Previous calculation sessions</div>
		</div>
		</div>

		<div style="max-height: 400px; overflow-y: auto; margin: 20px 0;">
		${history.length > 0 ? history.map(session => `
			<div style="background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 15px; margin-bottom: 10px;">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
			<div style="color: #f1f5f9; font-weight: 600;">Session ${session.id}</div>
			<div style="color: #94a3b8; font-size: 12px;">${new Date(session.timestamp).toLocaleString()}</div>
			</div>
			<div style="color: #cbd5e1; font-size: 13px; margin-bottom: 8px;">
			Mode: ${session.mode} ${session.manualDate ? `• Date: ${session.manualDate}` : ''}
			</div>
			<div style="display: flex; gap: 10px; font-size: 12px;">
			<span style="color: #4ade80;">✅ ${session.results.filter(r => r.success).length} successful</span>
			<span style="color: #f87171;">❌ ${session.results.filter(r => !r.success).length} failed</span>
			<span style="color: #94a3b8;">Total: ${session.results.length}</span>
			</div>
			</div>
			`).join('') : `
			<div style="text-align: center; padding: 40px; color: #94a3b8;">
			<div style="font-size: 48px; margin-bottom: 20px;">📊</div>
			<div>No MTTR processing history yet</div>
			<div style="font-size: 12px; margin-top: 10px;">Process some sheets to see history here</div>
			</div>
			`}
			</div>

			<div class="ultra-buttons">
			<button id="historyClose" class="ultra-btn ultra-btn-secondary" style="flex: 1;">Close</button>
			${history.length > 0 ? `
				<button id="historyClear" class="ultra-btn ultra-btn-danger" style="flex: 1;">Clear History</button>
				` : ''}
				</div>
				</div>
				`;

				document.body.appendChild(dialog);

				document.getElementById('historyClose').onclick = () => dialog.remove();

				if (history.length > 0) {
					document.getElementById('historyClear').onclick = () => {
						if (confirm('Are you sure you want to clear all MTTR history?')) {
							GM_deleteValue('MTTR_SESSION_HISTORY');
							dialog.remove();
							ToastManager.show('MTTR history cleared', 'success');
						}
					};
				}
	}

	function showMTTRSettings() {
		const settings = {
			autoInit: GM_getValue('AUTO_INIT_MTTR', true),
 defaultMode: GM_getValue('MTTR_DEFAULT_MODE', 'latest'),
	 defaultCategories: GM_getValue('MTTR_DEFAULT_CATEGORIES', ['SUPPORT', 'INSTALLATION', 'RELOCATION']),
		 enableSounds: GM_getValue('MTTR_ENABLE_SOUNDS', true)
		};

		const dialog = document.createElement('div');
		dialog.className = 'ultra-dialog';
		dialog.innerHTML = `
		<div class="ultra-card" style="max-width: 500px;">
		<div class="ultra-title">
		<div class="ultra-title-icon">⚙️</div>
		<div class="ultra-title-text">
		<div class="ultra-title-main">MTTR MASTER Settings</div>
		<div class="ultra-title-sub">Configure MTTR calculation behavior</div>
		</div>
		</div>

		<div style="margin: 20px 0;">
		<div style="margin-bottom: 20px;">
		<label class="ultra-toggle" style="justify-content: space-between;">
		<div>
		<div style="font-weight: 500; color: #cbd5e1;">Auto-initialize on page load</div>
		<div style="font-size: 12px; color: #94a3b8;">Initialize MTTR engine automatically</div>
		</div>
		<div>
		<input type="checkbox" id="settingAutoInit" class="ultra-toggle-input" ${settings.autoInit ? 'checked' : ''}>
		<div class="ultra-toggle-slider"></div>
		</div>
		</label>
		</div>

		<div style="margin-bottom: 20px;">
		<label class="ultra-toggle" style="justify-content: space-between;">
		<div>
		<div style="font-weight: 500; color: #cbd5e1;">Enable sound notifications</div>
		<div style="font-size: 12px; color: #94a3b8;">Play sounds for success/errors</div>
		</div>
		<div>
		<input type="checkbox" id="settingEnableSounds" class="ultra-toggle-input" ${settings.enableSounds ? 'checked' : ''}>
		<div class="ultra-toggle-slider"></div>
		</div>
		</label>
		</div>

		<div style="margin-bottom: 20px;">
		<div style="font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Default Mode</div>
		<div style="display: flex; gap: 8px;">
		<button class="ultra-queue-control ${settings.defaultMode === 'latest' ? 'selected' : ''}" data-mode="latest" style="flex: 1;">Latest Date</button>
		<button class="ultra-queue-control ${settings.defaultMode === 'manual' ? 'selected' : ''}" data-mode="manual" style="flex: 1;">Manual Date</button>
		</div>
		</div>

		<div>
		<div style="font-weight: 500; color: #cbd5e1; margin-bottom: 8px;">Default Categories</div>
		<div style="display: flex; gap: 5px;">
		<button class="ultra-queue-control mttr-setting-category ${settings.defaultCategories.includes('SUPPORT') ? 'selected' : ''}" data-category="SUPPORT" style="flex:1;">SUPPORT</button>
		<button class="ultra-queue-control mttr-setting-category ${settings.defaultCategories.includes('INSTALLATION') ? 'selected' : ''}" data-category="INSTALLATION" style="flex:1;">INSTALLATION</button>
		<button class="ultra-queue-control mttr-setting-category ${settings.defaultCategories.includes('RELOCATION') ? 'selected' : ''}" data-category="RELOCATION" style="flex:1;">RELOCATION</button>
		</div>
		</div>
		</div>

		<div class="ultra-buttons">
		<button id="settingsSave" class="ultra-btn ultra-btn-primary" style="flex: 2;">💾 Save Settings</button>
		<button id="settingsCancel" class="ultra-btn ultra-btn-secondary">Cancel</button>
		</div>
		</div>
		`;

		document.body.appendChild(dialog);

		// Mode selection
		dialog.querySelectorAll('[data-mode]').forEach(btn => {
			btn.onclick = function() {
				dialog.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('selected'));
				this.classList.add('selected');
			};
		});

		// Category selection
		dialog.querySelectorAll('.mttr-setting-category').forEach(btn => {
			btn.onclick = function() {
				this.classList.toggle('selected');
			};
		});

		document.getElementById('settingsSave').onclick = () => {
			const autoInit = document.getElementById('settingAutoInit').checked;
			const enableSounds = document.getElementById('settingEnableSounds').checked;
			const defaultMode = dialog.querySelector('[data-mode].selected').dataset.mode;
			const selectedCategories = Array.from(dialog.querySelectorAll('.mttr-setting-category.selected'))
			.map(btn => btn.dataset.category);

			GM_setValue('AUTO_INIT_MTTR', autoInit);
			GM_setValue('MTTR_ENABLE_SOUNDS', enableSounds);
			GM_setValue('MTTR_DEFAULT_MODE', defaultMode);
			GM_setValue('MTTR_DEFAULT_CATEGORIES', selectedCategories);

			dialog.remove();
			ToastManager.show('MTTR settings saved successfully', 'success');
		};

		document.getElementById('settingsCancel').onclick = () => {
			dialog.remove();
		};
	}

	// ========== KEYBOARD SHORTCUTS ==========
	function addMTTRKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Alt+M for MTTR MASTER
			if (e.altKey && e.key === 'm') {
				e.preventDefault();
				launchMTTRMaster();
			}

			// Alt+Shift+M for MTTR History
			if (e.altKey && e.shiftKey && e.key === 'M') {
				e.preventDefault();
				showMTTRHistory();
			}

			// Alt+, for MTTR Settings
			if (e.altKey && e.key === ',') {
				e.preventDefault();
				showMTTRSettings();
			}
		});
	}

	// ========== STYLES FOR MTTR INTERFACE ==========
	function addMTTRStyles() {
		const styles = `
		/* MTTR Specific Styles */
		.mttr-dialog .ultra-card {
			max-width: 700px;
		}

		.mttr-sheet-badge {
			transition: all 0.3s ease;
			font-family: 'JetBrains Mono', monospace;
		}

		.mttr-category-btn.selected {
			border-color: #38bdf8 !important;
			color: #fff !important;
			background: rgba(56, 189, 248, 0.15);
		}

		.mttr-setting-category.selected {
			border-color: #8b5cf6 !important;
			color: #fff !important;
			background: rgba(139, 92, 246, 0.15);
		}

		/* Progress Bar Animation */
		@keyframes progressPulse {
			0% { opacity: 1; }
			50% { opacity: 0.7; }
			100% { opacity: 1; }
		}

		#mttrProgressBar {
		animation: progressPulse 2s infinite;
		}

		/* Results Animation */
		@keyframes slideInUp {
			from {
				opacity: 0;
				transform: translateY(10px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		#mttrResultsDetails > div {
		animation: slideInUp 0.3s ease-out;
		}

		/* MTTR Status Colors */
		.mttr-status-ready { color: #4ade80; }
		.mttr-status-processing { color: #fbbf24; }
		.mttr-status-error { color: #f87171; }
		.mttr-status-complete { color: #8b5cf6; }

		/* Enhanced FAB */
		.ultra-fab {
			position: relative;
		}

		.ultra-fab::after {
			content: '';
			position: absolute;
			top: -2px;
			right: -2px;
			width: 12px;
			height: 12px;
			background: linear-gradient(135deg, #8b5cf6, #7c3aed);
			border-radius: 50%;
			border: 2px solid #0f172a;
			animation: pulse 2s infinite;
		}

		/* Context Menu Animations */
		@keyframes fadeIn {
			from { opacity: 0; transform: translateY(5px); }
			to { opacity: 1; transform: translateY(0); }
		}

		#fabContextMenu {
		animation: fadeIn 0.2s ease-out;
		}
		`;

		GM_addStyle(styles);
	}

	// ========== PROMPT MODE MANAGER ==========
	class PromptModeManager {
		constructor() {
			this.sheetsClient = new GoogleSheetsClient();
			this.ticketSearcher = new AdvancedTicketSearcher();
			this.extractor = new AdvancedTimelineExtractor();
			this.isProcessing = false;
			this.isNavigating = false;
		}

		async debugRowWrite(rowNumber) {
			try {
				const state = StateManager.getState();
				const writer = new EnhancedSheetsWriter();

				VisualLogger.info(`🔧 Debugging Row ${rowNumber}...`);

				// Test write using the Enhanced Writer
				const updates = [{ col: 'Z', val: 'DEBUG_TEST_' + Date.now() }];
				await writer.writeWithVerification(
					state.sheetName,
					rowNumber,
					updates,
					'SUPPORT',
					'DEBUG_TEST'
				);

				VisualLogger.success(`✍️ Write Test Success for Row ${rowNumber}`);
				ToastManager.show('Debug Write Successful', 'success');
			} catch (error) {
				VisualLogger.error(`❌ Debug Failed: ${error.message}`);
				ToastManager.show(`Debug Failed: ${error.message}`, 'error');
			}
		}

		async markRowAsFailed(rowNumber, sheetName, ticketType, reason) {
			try {
				VisualLogger.warn(`✍️ Marking Row ${rowNumber} as failed: ${reason}`);

				// Find a column to write the error message to
				const mapping = SHEET_MAPPING[ticketType];
				// Use ticketId column for Support, or created column for Installation (as fallback)
				const targetCol = mapping.writeColumns.ticketId || mapping.writeColumns.created;

				if (targetCol) {
					await this.sheetsClient.writeToSheet(
						sheetName,
						rowNumber,
						[{ col: targetCol, val: reason }],
						ticketType
					);
				}
			} catch (e) {
				VisualLogger.error(`Failed to mark row as failed: ${e.message}`);
			}
		}

		detectContextType() {
			if (window.location.href.includes('/installation/') || window.location.href.includes('/type/188/')) {
				return 'INSTALLATION';
			}
			if (window.location.href.includes('/relocation/')) {
				return 'RELOCATION';
			}
			return 'SUPPORT';
		}

		escapeHtml(text) {
			if (!text) return '';
			return String(text)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
		}

		closeDetailsPanel() {
			VisualLogger.info('🔒 Attempting to close details panel...');

			// Method 1: Try your specific XPath first
			const sidePanelIcon = document.querySelector('.side-panel-labels > .side-panel-label > .side-panel-label-icon-box');
			if (sidePanelIcon) {
				// Try to find parent elements that might contain close functionality
				const panelLabel = sidePanelIcon.closest('.side-panel-label');
				if (panelLabel) {
					panelLabel.click();
					VisualLogger.success('✅ Clicked side panel label');
					return true;
				}
				sidePanelIcon.click();
				VisualLogger.success('✅ Clicked side panel icon');
				return true;
			}

			// Method 2: Look for common close buttons
			const closeButtons = [
				'.side-panel-close',
				'.side-panel__close',
				'.ui-sidepanel-close',
				'.crm-entity-stream-container-close',
				'[data-role="side-panel-close"]',
				'.main-ui-side-panel-close',
				'button[title*="Close"]',
				'button[aria-label*="Close"]'
			];

			for (const selector of closeButtons) {
				const btn = document.querySelector(selector);
				if (btn && btn.offsetParent !== null) {
					btn.click();
					VisualLogger.success(`✅ Clicked close button: ${selector}`);
					return true;
				}
			}

			// Method 3: Try to find any close/X button near the panel
			const allButtons = document.querySelectorAll('button');
			for (const btn of allButtons) {
				const text = (btn.textContent || '').toLowerCase();
				const title = (btn.getAttribute('title') || '').toLowerCase();
				if (text.includes('close') || title.includes('close') ||
					text === 'x' || title === 'x' ||
					text.includes('cancel') || title.includes('cancel')) {
					btn.click();
				VisualLogger.success('✅ Clicked generic close button');
				return true;
					}
			}

			VisualLogger.warn('⚠️ No close button found');
			return false;
		}

		async smartSearchOnCurrentPage(serviceId) {
			VisualLogger.info(`🔍 Smart search for: ${serviceId}`);

			try {
				// First, ensure we're on a list page (not details)
				if (window.location.href.includes('/details/')) {
					VisualLogger.error('❌ Cannot search on details page');
					return false;
				}

				// Wait for any existing loaders
				await this.sleep(1000);

				// Clear any existing filters
				await this.clearAllFilters();

				// Find search input
				const searchBox = this.findSearchBox();
				if (!searchBox) {
					VisualLogger.error('❌ No search box found');
					return false;
				}

				// Set search value
				searchBox.value = serviceId;
				searchBox.dispatchEvent(new Event('input', { bubbles: true }));
				searchBox.dispatchEvent(new Event('change', { bubbles: true }));

				// Trigger search
				this.triggerSearch(searchBox);

				// Wait for results
				const found = await this.waitForSearchResults(serviceId);

				if (found) {
					VisualLogger.success(`✅ Found ticket for ${serviceId}`);
					return true;
				}

				return false;

			} catch (error) {
				VisualLogger.error(`❌ Smart search error: ${error.message}`);
				return false;
			}
		}

		async clearAllFilters() {
			const clearButtons = document.querySelectorAll('[class*="clear"], [class*="reset"], [data-role="clear"]');
			for (const btn of clearButtons) {
				if (btn.offsetParent !== null) {
					btn.click();
					await this.sleep(100);
				}
			}
		}

		findSearchBox() {
			const searchSelectors = [
				'input[name="FIND"]',
				'input[placeholder*="Search"]',
				'input[placeholder*="search"]',
				'.main-ui-filter-search-input',
				'.ui-search-input input',
				'input[type="search"]',
				'#search',
				'.search-input'
			];

			for (const selector of searchSelectors) {
				const element = document.querySelector(selector);
				if (element && element.offsetParent !== null) {
					return element;
				}
			}
			return null;
		}

		triggerSearch(searchBox) {
			// Press Enter
			searchBox.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true
			}));

			// Also look for search button
			const searchButtons = [
				'button[type="submit"]',
				'.main-ui-filter-search-button',
				'.ui-btn-search',
				'.search-button'
			];

			for (const selector of searchButtons) {
				const btn = document.querySelector(selector);
				if (btn && btn.offsetParent !== null) {
					btn.click();
					break;
				}
			}
		}

		async waitForSearchResults(serviceId, timeout = 10000) {
			const startTime = Date.now();

			while (Date.now() - startTime < timeout) {
				// Check for loader
				const loader = document.querySelector('.main-grid-loader, .crm-kanban-loader, .grid-loader');
				if (loader && loader.offsetParent !== null) {
					await this.sleep(500);
					continue;
				}

				// Look for ticket containing service ID
				const elements = document.querySelectorAll('td, div, span, a');
				for (const element of elements) {
					const text = element.textContent || '';
					if (text.includes(serviceId)) {
						// Find the ticket link
						const link = element.closest('a') || element.querySelector('a');
						if (link && link.href && link.href.includes('/details/')) {
							// Update search state
							const search = GM_getValue('CURRENT_SEARCH');
							if (search) {
								const match = link.href.match(/details\/(\d+)/);
								if (match) {
									search.foundTicketId = match[1];
									search.status = 'found_ticket';
									GM_setValue('CURRENT_SEARCH', search);
								}
							}

							// Click the link
							link.click();
							return true;
						}
					}
				}

				await this.sleep(500);
			}

			return false;
		}

		makeDialogDraggable(dialogElement) {
			const titleBar = dialogElement.querySelector('.ultra-title');
			if (!titleBar) return;

			let isDragging = false;
			let startX, startY, initialLeft, initialTop;

			const startDrag = (e) => {
				// DON'T start drag if clicking on select elements, inputs, buttons, or other interactive elements
				if (e.target.closest('select, input, button, textarea, .ultra-queue-controls, .ultra-toggle')) {
					return;
				}

				// Only start drag if clicking on the title text area specifically
				const titleText = titleBar.querySelector('.ultra-title-text');
				if (!titleText.contains(e.target) && !e.target.classList.contains('ultra-title-icon')) {
					return;
				}

				isDragging = true;
				const rect = dialogElement.getBoundingClientRect();
				startX = e.clientX;
				startY = e.clientY;
				initialLeft = rect.left;
				initialTop = rect.top;

				dialogElement.style.cursor = 'grabbing';
				document.body.style.userSelect = 'none';

				e.preventDefault();
				e.stopPropagation();
			};

			const doDrag = (e) => {
				if (!isDragging) return;

				const dx = e.clientX - startX;
				const dy = e.clientY - startY;

				dialogElement.style.left = `${initialLeft + dx}px`;
				dialogElement.style.top = `${initialTop + dy}px`;
				dialogElement.style.right = 'auto';
				dialogElement.style.bottom = 'auto';

				e.preventDefault();
			};

			const stopDrag = () => {
				if (!isDragging) return;
				isDragging = false;
				dialogElement.style.cursor = '';
				document.body.style.userSelect = '';
			};

			titleBar.addEventListener('mousedown', startDrag);
			document.addEventListener('mousemove', doDrag);
			document.addEventListener('mouseup', stopDrag);
			document.addEventListener('mouseleave', stopDrag);
		}

		async initialize() {
			// Reset states to ensure clean start
			this.isNavigating = false;
			this.isProcessing = false;

			VisualLogger.info('🎯 Initializing Row-Based Prompt Mode...');

			// Ask for sheet selection
			const selection = await this.promptForSheetSelection();
			if (!selection) {
				VisualLogger.warn('❌ No sheet selected');
				return;
			}

			const sheetName = selection.sheet;
			const initialType = selection.type;

			// Enable prompt mode
			StateManager.enable(sheetName);

			// Set initial type
			const state = StateManager.getState();
			state.ticketType = initialType;
			StateManager.setState(state);

			// Small delay to ensure DOM is clean
			await this.sleep(100);

			// Show the row input prompt
			await this.showRowInputPrompt();
		}

		async promptForSheetSelection() {
			let sheets = [];
			try {
				sheets = await this.sheetsClient.getSheets();
			} catch (error) {
				VisualLogger.error(`❌ Could not load sheets: ${error.message}`);
				ToastManager.show(`Failed to load sheets: ${error.message}`, 'error');
				return null;
			}

			return new Promise(resolve => {
				const dialog = document.createElement('div');
				dialog.className = 'ultra-dialog';
				dialog.innerHTML = `
				<div class="ultra-card" style="max-width: 550px; width: 90%;">
				<div style="position: absolute; top: 8px; left: 12px; font-size: 8px; color: rgba(255, 255, 255, 0.1);">fob interns proj by idris adeleke</div>
				<div class="ultra-title">
				<div class="ultra-title-icon">📋</div>
				<div class="ultra-title-text">
				<div class="ultra-title-main">Select Target Sheet</div>
				<div class="ultra-title-sub">Choose which Google Sheet to extract data to</div>
				</div>
				</div>

				<div class="ultra-input-container">
				<label class="ultra-input-label">Available Sheets</label>
				<select id="sheetSelect" class="ultra-input" style="height: auto; padding: 12px;">
				${sheets.map(s => `
					<option value="${this.escapeHtml(s.properties.title)}">
					${this.escapeHtml(s.properties.title)}
					</option>
					`).join('')}
					</select>
					</div>

					<div class="ultra-input-container">
					<label class="ultra-input-label">Default Type</label>
					<div style="display: flex; gap: 5px;">
					<button class="ultra-queue-control type-btn selected" data-type="SUPPORT" style="flex:1; padding: 8px; border-color: #38bdf8; color: #fff;">SUPPORT</button>
					<button class="ultra-queue-control type-btn" data-type="INSTALLATION" style="flex:1; padding: 8px;">INSTALL</button>
					<button class="ultra-queue-control type-btn" data-type="RELOCATION" style="flex:1; padding: 8px;">RELOC</button>
					<button class="ultra-queue-control mttr-type-btn" data-type="FAULT" style="flex:1; padding: 10px;">FAULT</button>
					</div>
					</div>

					<div class="ultra-buttons">
					<button id="startBtn" class="ultra-btn ultra-btn-primary">
					🚀 Start Prompt Mode
					</button>
					<button id="cancelBtn" class="ultra-btn ultra-btn-secondary">
					❌ Cancel
					</button>
					</div>
					</div>
					`;

					document.body.appendChild(dialog);

					let selectedType = 'SUPPORT';
					const sheetSelect = document.getElementById('sheetSelect');
					setTimeout(() => sheetSelect.focus(), 100);

					// Type button handlers
					dialog.querySelectorAll('.type-btn').forEach(btn => {
						btn.onclick = () => {
							dialog.querySelectorAll('.type-btn').forEach(b => {
								b.style.borderColor = '#475569';
								b.style.color = '#94a3b8';
							});
							btn.style.borderColor = '#38bdf8';
							btn.style.color = '#fff';
							selectedType = btn.dataset.type;
						};
					});

					document.getElementById('startBtn').onclick = () => {
						const sheet = sheetSelect.value;
						if (!sheet) {
							ToastManager.show('Please select a sheet first', 'warning');
							return;
						}
						dialog.remove();
						resolve({ sheet, type: selectedType });
					};

					document.getElementById('cancelBtn').onclick = () => {
						dialog.remove();
						resolve(null);
					};

					// Enter key support
					sheetSelect.addEventListener('keydown', (e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							document.getElementById('startBtn').click();
						}
					});

					this.makeDialogDraggable(dialog);
			});
		}

		async showRowInputPrompt() {
			if (!StateManager.isActive() || this.isNavigating) return;
			try {

				const state = StateManager.getState();
				const stats = StateManager.getStats();
				const history = HistoryManager.getStats();

				// Remove existing dialogs
				const existing = document.querySelectorAll('.ultra-dialog');
				existing.forEach(el => el.remove());

				// Show loading while fetching sheets to prevent "nothing shows"
				LoadingManager.show('Loading Prompt Mode...');

				// Determine default type (use stored preference or detect from URL)
				let currentType = state.ticketType || this.detectContextType();

				// Fetch sheets for dropdown
				let sheets = [];
				try {
					sheets = await this.sheetsClient.getSheets();
				} catch (e) {
					VisualLogger.warn('Could not refresh sheets list');
				}

				LoadingManager.hide();

				const getStatusClass = (status) => {
					if (status === 'Success') return 'ultra-history-success';
					if (status === 'Partial') return 'ultra-history-partial';
					if (status === 'Partial Success' || status === 'Partial') return 'ultra-history-partial';
					return 'ultra-history-fail';
				};

				// Turbo Mode Checkbox State
				const turboChecked = state.turboMode ? 'checked' : '';

				const dialog = document.createElement('div');
				dialog.className = 'ultra-dialog';
				dialog.innerHTML = `
				<div class="ultra-card" style="max-width: 550px; width: 90%;">
				<div style="position: absolute; top: 8px; left: 12px; font-size: 8px; color: rgba(255, 255, 255, 0.1);">fob interns proj by idris adeleke</div>
				<div class="ultra-title">
				<div class="ultra-title-icon">🎯</div>
				<div class="ultra-title-text">
				<div class="ultra-title-main">Enter Row Numbers</div>
				<div class="ultra-title-sub">
				Mode: Row-Based
				</div>
				</div>
				</div>

				<!-- Sheet Selection (Moved out of title to prevent drag issues) -->
				<div class="ultra-input-container">
				<label class="ultra-input-label">Target Sheet</label>
				<select id="quickSheetSelect" class="ultra-input" style="height: auto; padding: 12px;">
				${sheets.length > 0 ? sheets.map(s => `
					<option value="${this.escapeHtml(s.properties.title)}" ${s.properties.title === state.sheetName ? 'selected' : ''}>
					${this.escapeHtml(s.properties.title)}
					</option>
					`).join('') : `<option>${this.escapeHtml(state.sheetName)}</option>`}
					</select>
					</div>

					<!-- Queue Display -->
					${state.queue.length > 0 ? `
						<div class="ultra-queue">
						<div class="ultra-queue-header">
						<div class="ultra-queue-title">
						📚 Processing Queue
						<span class="ultra-queue-badge">${state.queue.length}</span>
						</div>
						<div class="ultra-queue-controls">
						<button class="ultra-queue-control" id="pauseBtn">
						${state.isPaused ? '▶ Resume' : '⏸ Pause'}
						</button>
						<button class="ultra-queue-control" id="skipBtn">⏭ Skip</button>
						<button class="ultra-queue-control" id="clearBtn">🗑 Clear</button>
						</div>
						</div>
						<div class="ultra-queue-items">
						${state.queue.slice(0, 5).map(row => `
							<div class="ultra-queue-item">
							<span class="ultra-queue-row">Row ${row}</span>
							<span class="ultra-queue-status">Pending</span>
							</div>
							`).join('')}
							${state.queue.length > 5 ? `
								<div class="ultra-queue-item" style="color: #94a3b8; font-style: italic;">
								... and ${state.queue.length - 5} more rows
								</div>
								` : ''}
								</div>
								</div>
								` : ''}

								<!-- Main Input -->
								<div class="ultra-input-container">
								<label class="ultra-input-label">Row Numbers to Process</label>
								<textarea
								id="rowInput"
								class="ultra-input"
								placeholder="Enter Row Numbers OR Service IDs...&#10;Examples:&#10;150&#10;155-160&#10;FOB12345"
								autofocus
								></textarea>
								<div style="margin-top: 8px; color: #94a3b8; font-size: 12px;">
								Supports: Rows, Ranges, and direct Service IDs (mixed input allowed)
								</div>
								</div>

								<!-- Type Selection -->
								<div class="ultra-input-container">
								<label class="ultra-input-label">Process As: <span id="typeLabel" style="color: #38bdf8;">${currentType}</span></label>
								<div style="display: flex; gap: 5px;">
								<button class="ultra-queue-control type-btn ${currentType === 'SUPPORT' ? 'selected' : ''}" data-type="SUPPORT" style="flex:1; padding: 10px; ${currentType === 'SUPPORT' ? 'border-color: #38bdf8; color: #fff;' : ''}">SUPPORT</button>
								<button class="ultra-queue-control type-btn ${currentType === 'INSTALLATION' ? 'selected' : ''}" data-type="INSTALLATION" style="flex:1; padding: 10px; ${currentType === 'INSTALLATION' ? 'border-color: #38bdf8; color: #fff;' : ''}">INSTALLATION</button>
								<button class="ultra-queue-control type-btn ${currentType === 'RELOCATION' ? 'selected' : ''}" data-type="RELOCATION" style="flex:1; padding: 10px; ${currentType === 'RELOCATION' ? 'border-color: #38bdf8; color: #fff;' : ''}">RELOCATION</button>
								</div>
								</div>

								<!-- Turbo Mode Toggle -->
								<div class="ultra-input-container" style="margin-bottom: 15px;">
								<label class="ultra-toggle">
								<input type="checkbox" id="turboToggle" class="ultra-toggle-input" ${turboChecked}>
								<div class="ultra-toggle-slider"></div>
								<span class="ultra-toggle-label">⚡ Turbo Mode (Faster Processing)</span>
								</label>
								</div>

								<!-- Recent History -->
								<div class="ultra-history">
								<div class="ultra-history-header">
								📜 Recent History
								<span style="margin-left: auto; font-size: 11px; color: #64748b;">
								Success: ${history.success} / Total: ${history.total}
								</span>
								</div>
								<div class="ultra-history-items">
								${history.recent.length > 0 ? history.recent.map(item => `
									<div class="ultra-history-item">
									<div class="ultra-history-info">
									<div class="ultra-history-id">Row ${item.row || item.id}</div>
									<div class="ultra-history-meta">
									${item.sheet} • ${item.time} • ${item.type || ''}
									</div>
									</div>
									<div class="ultra-history-status ${getStatusClass(item.status)}">
									${item.status}
									</div>
									</div>
									`).join('') : `
									<div style="padding: 20px; text-align: center; color: #64748b; font-size: 13px;">
									No recent extractions
									</div>
									`}
									</div>
									</div>

									<!-- Action Buttons -->
									<div class="ultra-buttons">
									<button id="processBtn" class="ultra-btn ultra-btn-primary">
									🔍 Process Rows
									</button>
									<button id="stopBtn" class="ultra-btn ultra-btn-danger">
									⏹ Stop Mode
									</button>
									</div>

									<!-- Stats Footer -->
									<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #334155; text-align: center; color: #94a3b8; font-size: 12px;">
									Processed: ${stats.processed} • Success: ${stats.successRate}% • Queue: ${stats.queueLength}
									</div>

									<!-- Attribution Footer -->
									<div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 11px; font-weight: 500;">
									FOB INTERN PROJ <br> Made by Idris Adeleke
									</div>
									</div>
									`;

									document.body.appendChild(dialog);

									this.makeDialogDraggable(dialog);

									// Focus the input
									const input = document.getElementById('rowInput');
									setTimeout(() => input.focus(), 100);

									// Sheet change handler
									const quickSelect = document.getElementById('quickSheetSelect');
									if (quickSelect) {
										quickSelect.onchange = (e) => {
											const newSheet = e.target.value;
											state.sheetName = newSheet;
											StateManager.setState(state);
											VisualLogger.info(`Sheet switched to: ${newSheet}`);
											ToastManager.show(`Active sheet: ${newSheet}`, 'info');
										};
									}

									// Type button handlers
									dialog.querySelectorAll('.type-btn').forEach(btn => {
										btn.onclick = () => {
											dialog.querySelectorAll('.type-btn').forEach(b => {
												b.style.borderColor = '#475569';
												b.style.color = '#94a3b8';
											});
											btn.style.borderColor = '#38bdf8';
											btn.style.color = '#fff';
											currentType = btn.dataset.type;
											document.getElementById('typeLabel').textContent = currentType;
											state.ticketType = currentType;
											StateManager.setState(state);
										};
									});

									// Event handlers
									document.getElementById('processBtn').onclick = () => {
										const rows = input.value.trim();
										if (!rows) {
											ToastManager.show('Please enter at least one row number', 'warning');
											input.focus();
											return;
										}

										// Save Turbo Mode
										const turboToggle = document.getElementById('turboToggle');
										if (turboToggle) {
											state.turboMode = turboToggle.checked;
											StateManager.setState(state);
										}

										dialog.remove();
										this.processRowInput(rows);
									};

									document.getElementById('stopBtn').onclick = () => {
										dialog.remove();
										StateManager.disable();
										ToastManager.show('Prompt Mode stopped', 'info');
									};

									// Queue controls
									if (state.queue.length > 0) {
										document.getElementById('pauseBtn').onclick = () => {
											state.isPaused = !state.isPaused;
											StateManager.setState(state);
											dialog.remove();
											this.showRowInputPrompt();
										};

										document.getElementById('skipBtn').onclick = () => {
											const skipped = StateManager.getNextFromQueue();
											if (skipped) {
												ToastManager.show(`Skipped Row ${skipped}`, 'info');
											}
											dialog.remove();
											this.showRowInputPrompt();
										};

										document.getElementById('clearBtn').onclick = () => {
											if (confirm('Are you sure you want to clear the entire queue?')) {
												StateManager.clearQueue();
												ToastManager.show('Queue cleared', 'info');
												dialog.remove();
												this.showRowInputPrompt();
											}
										};
									}

									// Keyboard shortcuts
									input.addEventListener('keydown', (e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											document.getElementById('processBtn').click();
										}
									});
			} catch (e) {
				LoadingManager.hide();
				VisualLogger.error(`❌ Error showing prompt: ${e.message}`);
				ToastManager.show('Error showing prompt UI', 'error');
			}
		}

		async processRowInput(inputText) {
			if (this.isProcessing) return;
			this.isProcessing = true;

			try {
				// Parse input (returns object with rows and ids)
				const { rows, ids, mapping } = this.parseRowInput(inputText);

				if (mapping) {
					const currentMap = GM_getValue('ULTRA_PREDEFINED_IDS', {});
					GM_setValue('ULTRA_PREDEFINED_IDS', { ...currentMap, ...mapping });
				}

				if (rows.length === 0 && ids.length === 0) {
					ToastManager.show('No valid input found', 'warning');
					this.showRowInputPrompt();
					return;
				}

				// Resolve Service IDs if any
				if (ids.length > 0) {
					LoadingManager.show('Resolving Service IDs', `Looking up ${ids.length} IDs in sheet...`);
					const resolution = await this.sheetsClient.findRowsByServiceIds(
						StateManager.getState().sheetName,
																					ids
					);

					if (resolution.notFoundIds.length > 0) {
						VisualLogger.warn(`Could not find rows for: ${resolution.notFoundIds.join(', ')}`);
						ToastManager.show(`Could not find ${resolution.notFoundIds.length} IDs`, 'warning');
					}

					// Add resolved rows to the list
					resolution.rows.forEach(r => rows.push(r));
					LoadingManager.hide();
				}

				// Deduplicate and sort
				const uniqueRows = Array.from(new Set(rows)).sort((a, b) => a - b);

				if (uniqueRows.length === 0) {
					ToastManager.show('No valid rows found', 'warning');
					this.showRowInputPrompt();
					return;
				}

				VisualLogger.info(`📋 Processing ${uniqueRows.length} row(s)`);

				// Check if we're in batch mode
				if (uniqueRows.length > 1) {
					// Add to queue and process first
					const added = StateManager.addToQueue(uniqueRows);
					ToastManager.show(`Added ${added} rows to queue`, 'success');

					// Process first row
					const firstRow = uniqueRows[0];
					await this.processSingleRow(firstRow);
				} else {
					// Single row processing
					await this.processSingleRow(uniqueRows[0]);
				}

			} catch (error) {
				VisualLogger.error(`❌ Error processing row input: ${error.message}`);
				ToastManager.show(`Error: ${error.message}`, 'error');
				this.showRowInputPrompt();
			} finally {
				this.isProcessing = false;
			}
		}

		parseRowInput(input) {
			const rows = new Set();
			const potentialIds = [];
			const mapping = {};
			let startLine = null;

			// Check for "THEN LINE <number>" or "/ <number>" pattern
			let startLineMatch = input.match(/(?:then|start|from|at)\s+(?:line|row)\s+(\d+)/i);
			if (!startLineMatch) {
				startLineMatch = input.match(/[\/\\]\s*(\d+)\s*$/);
			}

			if (startLineMatch) {
				startLine = parseInt(startLineMatch[1]);
				// Remove the instruction from input
				input = input.replace(startLineMatch[0], '');
			}

			// Split by newlines and commas
			const parts = input.split(/[\n,;\t]+/);

			for (const part of parts) {
				const trimmed = part.trim();
				if (!trimmed) continue;

				// If startLine is active, treat everything as an item to map
				if (startLine !== null) {
					potentialIds.push(trimmed);
					continue;
				}

				// Check for range (e.g., 150-160)
				const rangeMatch = trimmed.match(/^(\d+)(?:\s*-\s*|\s+to\s+)(\d+)$/i);
				if (rangeMatch) {
					let start = parseInt(rangeMatch[1]);
					let end = parseInt(rangeMatch[2]);

					// Handle reverse range
					if (start > end) [start, end] = [end, start];

					if (start && end) {
						for (let i = start; i <= end; i++) {
							rows.add(i);
						}
					}
					continue;
				}

				// Single number check
				const numMatch = trimmed.match(/^(\d+)$/);
				if (numMatch) {
					const row = parseInt(numMatch[1]);
					if (row > 0) {
						rows.add(row);
					}
				} else {
					// Not a number, assume it's a Service ID
					if (trimmed.length >= 3) {
						potentialIds.push(trimmed);
					}
				}
			}

			// If startLine is provided, map collected IDs to rows sequentially
			if (startLine !== null && potentialIds.length > 0) {
				potentialIds.forEach((id, index) => {
					const row = startLine + index;
					rows.add(row);
					mapping[row] = id;
				});
				VisualLogger.info(`Mapped ${potentialIds.length} IDs to rows starting at ${startLine}`);
				return {
					rows: Array.from(rows),
 ids: [], // IDs are converted to rows, so no need to look them up
 mapping: mapping
				};
			}

			return {
				rows: Array.from(rows),
 ids: Array.from(new Set(potentialIds))
			};
		}

		async processSingleRow(rowNumber) {
			// EMERGENCY RECOVERY: Force reset if stuck
			if (this.isNavigating && Date.now() - (this.lastNavigationTime || 0) > 30000) {
				VisualLogger.warn('⚠️ Force resetting stuck navigation flag');
				this.isNavigating = false;
				GM_deleteValue('CURRENT_SEARCH');
			}

			if (this.isNavigating) return;

			const state = StateManager.getState();
			const contextType = state.ticketType || this.detectContextType();

			try {
				// EMERGENCY CHECK: Ensure we're not already processing this row
				if (state.currentRow === rowNumber && Date.now() - state.lastProcessed < 10000) {
					VisualLogger.warn(`⚠️ Row ${rowNumber} was recently processed, skipping`);
					this.processNextInQueue('Row recently processed');
					return;
				}

				// Update state to track current processing
				state.currentRow = rowNumber;
				state.lastProcessed = Date.now();
				StateManager.setState(state);

				// Check for predefined ID (from direct input)
				const predefinedIds = GM_getValue('ULTRA_PREDEFINED_IDS', {});
				let sheetInfo = null;

				if (predefinedIds[rowNumber]) {
					VisualLogger.info(`📌 Using Predefined Service ID for Row ${rowNumber}: ${predefinedIds[rowNumber]}`);
					sheetInfo = {
						serviceId: predefinedIds[rowNumber],
						ticketType: contextType,
						rowNumber: rowNumber,
						column: 'PREDEFINED',
						rawValue: predefinedIds[rowNumber]
					};
				} else {
					LoadingManager.show(
						`Processing Row ${rowNumber}`,
						 `Reading Service ID from Google Sheets...`
					);
					// Step 1: Get Service ID from Google Sheet
					sheetInfo = await this.sheetsClient.getServiceIdFromRow(
						state.sheetName,
						rowNumber,
						contextType
					);
				}

				if (!sheetInfo) {
					LoadingManager.hide();
					ToastManager.show(`No Service ID found at Row ${rowNumber}`, 'warning');
					HistoryManager.addEntry(`Row ${rowNumber}`, 'No Service ID', state.sheetName, 'ERROR');
					StateManager.updateStats(false);

					// Write failure to sheet so it's not skipped
					await this.markRowAsFailed(rowNumber, state.sheetName, contextType, 'NO SERVICE ID');

					// Process next in queue if any
					this.processNextInQueue(`Skipped Row ${rowNumber} (Empty)`);
					return;
				}

				let { serviceId, ticketType } = sheetInfo;

				// Override ticketType if user explicitly selected one
				if (state.ticketType) {
					VisualLogger.info(`⚠️ Using selected type: ${state.ticketType}`);
					ticketType = state.ticketType;
				}

				// Copy Service ID to clipboard as requested
				GM_setClipboard(serviceId);

				LoadingManager.update(
					`Searching for Service ID`,
					`${serviceId} • ${ticketType} • Row ${rowNumber}`
				);

				// Step 2: Search for ticket in CRM
				if (window.location.href.includes('/details/')) {
					// Try to close the side panel instead of refreshing
					const closed = this.closeDetailsPanel();
					if (closed) {
						// Wait a moment for panel to close
						await this.sleep(500);

						// Now try to search without refreshing
						const searched = await this.smartSearchOnCurrentPage(serviceId);
						if (searched) {
							return; // Navigation will happen
						}
					}
				}

				this.lastNavigationTime = Date.now();
				this.isNavigating = true;
				await this.ticketSearcher.searchForServiceId(
					serviceId,
					ticketType,
					rowNumber
				);

				// Navigation will happen, extraction will be handled on details page

			} catch (error) {
				LoadingManager.hide();
				VisualLogger.error(`❌ Error processing Row ${rowNumber}: ${error.message}`);
				ToastManager.show(`Error processing Row ${rowNumber}: ${error.message}`, 'error');
				HistoryManager.addEntry(`Row ${rowNumber}`, 'Error', state.sheetName, 'ERROR');

				StateManager.updateStats(false);

				// Write failure to sheet
				await this.markRowAsFailed(rowNumber, state.sheetName, contextType, `ERROR: ${error.message}`);

				this.isNavigating = false;
				this.processNextInQueue(`Failed Row ${rowNumber}`);
			}
		}

		async handleListAutoProcess() {
			const state = StateManager.getState();
			if (state.active && !state.isPaused && state.queue.length > 0) {
				VisualLogger.info(`🔄 Auto-processing queue: ${state.queue.length} items remaining`);
				await this.sleep(CONFIG.TURBO_MODE ? 100 : 1500);
				await this.processNextInQueue('Continuing queue');
				return true;
			}
			return false;
		}

		async processNextInQueue(reason = 'Completed', useRecovery = true) {
			const nextRow = StateManager.getNextFromQueue();

			if (nextRow) {
				VisualLogger.info(`🔄 ${reason}. Next: Row ${nextRow}`);
				ToastManager.show(`Next: Row ${nextRow}`, 'info', 2000);

				await this.sleep(CONFIG.TURBO_MODE ? 100 : 500);
				if (useRecovery) {
					await this.processSingleRowWithRecovery(nextRow);
				} else {
					await this.processSingleRow(nextRow);
				}
			} else {
				VisualLogger.success('✅ Queue completed!');
				ToastManager.show('All rows processed successfully!', 'success');

				// Show completion report
				this.showCompletionReport();

				this.showRowInputPrompt();
			}
		}

		async processSingleRowWithRecovery(rowNumber) {
			const recoveryKey = `RECOVERY_${StateManager.getState().sheetName}_${rowNumber}`;
			const recoveryData = GM_getValue(recoveryKey, null);

			// Check if this row was previously attempted
			if (recoveryData && recoveryData.timestamp > Date.now() - 3600000) {
				VisualLogger.warn(`🔄 Recovery mode for Row ${rowNumber} - previous attempt at ${new Date(recoveryData.timestamp).toLocaleTimeString()}`);

				if (recoveryData.attempts >= 3) {
					VisualLogger.error(`❌ Row ${rowNumber} has failed 3+ times, skipping`);
					ToastManager.show(`Row ${rowNumber} failed multiple times, skipping`, 'error');

					await this.markRowAsFailed(
						rowNumber,
						StateManager.getState().sheetName,
											   recoveryData.ticketType || 'SUPPORT',
								'MULTIPLE_FAILURES'
					);

					this.processNextInQueue('Skipping failed row');
					GM_deleteValue(recoveryKey);
					return;
				}
			}

			try {
				await this.processSingleRow(rowNumber);
			} catch (error) {
				// Store recovery data
				const state = StateManager.getState();
				GM_setValue(recoveryKey, {
					timestamp: Date.now(),
							attempts: recoveryData ? recoveryData.attempts + 1 : 1,
							sheetName: state.sheetName,
							ticketType: state.ticketType,
							lastError: error.message
				});

				throw error;
			}

			// Clear recovery data on success
			GM_deleteValue(recoveryKey);
		}

		async showCompletionReport() {
			const stats = StateManager.getStats();
			const history = HistoryManager.getStats();

			const report = `
			<div style="text-align: left; padding: 10px;">
			<div style="font-weight: bold; margin-bottom: 10px;">📊 Processing Report</div>
			<div>Total Processed: ${stats.processed}</div>
			<div>Success Rate: ${stats.successRate}%</div>
			<div>Average Time: ${stats.avgTime}ms per row</div>
			<div>Recent Success: ${history.success}/${history.total}</div>
			</div>
			`;

			ToastManager.show(report, 'success', 8000);
		}

		async handleSearchFailure(search) {
			VisualLogger.warn(`⚠️ Handling search failure for Row ${search.rowNumber}`);

			// Write "TICKET NOT FOUND" to sheet
			await this.markRowAsFailed(
				search.rowNumber,
				StateManager.getState().sheetName,
									   search.ticketType,
							  'TICKET NOT FOUND'
			);

			HistoryManager.addEntry(search.serviceId, 'Not Found', StateManager.getState().sheetName, search.ticketType, search.rowNumber);
			StateManager.updateStats(false);

			// CRITICAL FIX: Clear search state BEFORE processing next
			GM_deleteValue('CURRENT_SEARCH');

			// Reset navigation flag to allow next processing
			this.isNavigating = false;

			// Add delay before next attempt
			await this.sleep(1000);

			// Process next in queue with fresh state
			await this.processNextInQueue(`Skipped Row ${search.rowNumber} (Ticket Not Found)`);
		}

		async handleDetailsPage() {
			const search = GM_getValue('CURRENT_SEARCH');
			if (!search || search.status !== 'found_ticket') return;

			// AUTO-HEAL: Restore state if lost during navigation
			const state = StateManager.getState();
			if (!state.active || !state.sheetName) {
				VisualLogger.warn('⚠️ State lost during navigation, restoring from search context...');
				state.active = true;
				if (search.sheetName) state.sheetName = search.sheetName;
				StateManager.setState(state);
				ToastManager.show('Session state restored', 'info');
			}

			VisualLogger.info(`🎯 On details page for Row ${search.rowNumber}, Ticket ID ${search.foundTicketId}`);

			try {
				LoadingManager.show(
					'Extracting Data',
					'Scanning timeline events...'
				);

				// Perform deep scan (scrolling) to load all history
				await this.extractor.loadAllContent();

				// Extract data using advanced extractor
				const currentExtraction = this.extractor.prepareRowData(search.ticketType, search.rowNumber);

				// --- SHOW VISUAL FEEDBACK BEFORE WRITING ---
				const getIcon = (val) => val && val !== 'UNKNOWN' && val !== '' ? '✅' : '❌';
				const validationHtml = `
				<div style="text-align: left; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 10px; min-width: 250px;">
				<div style="margin-bottom: 8px; font-size: 13px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Extraction Preview</div>
				<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
				<span style="color:#cbd5e1">Ticket ID:</span>
				<span>${getIcon(currentExtraction.ticketId)} ${currentExtraction.ticketId || 'Unknown'}</span>
				</div>
				<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
				<span style="color:#cbd5e1">Created:</span>
				<span>${getIcon(currentExtraction.events.creation)} ${currentExtraction.events.creation ? 'Found' : 'Missing'}</span>
				</div>
				<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
				<span style="color:#cbd5e1">Escalated:</span>
				<span>${getIcon(currentExtraction.events.escalation)} ${currentExtraction.events.escalation ? 'Found' : 'Missing'}</span>
				</div>
				<div style="display:flex; justify-content:space-between; margin-bottom:8px;">
				<span style="color:#cbd5e1">Resolved:</span>
				<span>${getIcon(currentExtraction.events.resolution || currentExtraction.events.final)} ${currentExtraction.events.resolution || currentExtraction.events.final ? 'Found' : 'Missing'}</span>
				</div>
				<div style="color: #94a3b8; font-size: 11px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;">
				Row: ${search.rowNumber} • Type: ${search.ticketType}
				</div>
				</div>
				`;

				LoadingManager.update('Extraction Complete', validationHtml);
				await this.sleep(CONFIG.TURBO_MODE ? 50 : 200); // Reduced delay for speed

				// Define what a "complete" extraction is
				let isComplete;
				if (search.ticketType === 'RELOCATION') {
					isComplete = currentExtraction.ticketId !== 'UNKNOWN' &&
					currentExtraction.events.creation &&
					currentExtraction.events.sdEscalated &&
					currentExtraction.events.ismEscalated;
				} else { // SUPPORT and INSTALLATION
					isComplete = currentExtraction.ticketId !== 'UNKNOWN' &&
					currentExtraction.events.creation;

					// Relaxed check: If we have resolution, we don't strictly need escalation for "completeness" to proceed
					isComplete = isComplete &&
					(currentExtraction.events.resolution || currentExtraction.events.final);
				}

				// --- REFINED FALLBACK LOGIC ---
				if (isComplete || search.triedSecondTicket) {
					// EITHER:
					// 1. The data is complete (on the first or second try).
					// 2. We've already tried the second ticket and it was also incomplete.

					let finalData = currentExtraction;
					if (!isComplete && search.triedSecondTicket) {
						// This was the second attempt and it failed, so use the data from the first attempt.
						VisualLogger.warn('⚠️ Second attempt also incomplete. Reverting to data from the first (highest ID) ticket.');
						finalData = search.firstAttemptData;
					} else if (isComplete) {
						VisualLogger.success('✅ Extraction complete.');
					}

					await this.finalizeExtraction(search, finalData);

				} else {
					// This was the FIRST attempt, and it was incomplete. Let's try the second ticket.
					const potentialTickets = search.potentialTickets || [];
					const secondTicket = potentialTickets.length > 1 ? potentialTickets[1] : null;

					if (!secondTicket) {
						// No second ticket to try, so we must use what we have.
						VisualLogger.warn('⚠️ Incomplete data, but no other tickets to try. Processing as is.');
						await this.finalizeExtraction(search, currentExtraction);
						return;
					}

					VisualLogger.warn(`Incomplete data from Ticket ID ${search.foundTicketId}. Trying second-highest ticket: #${secondTicket.id}`);
					ToastManager.show(`Incomplete data. Retrying with ticket #${secondTicket.id}`, 'info');

					search.firstAttemptData = currentExtraction; // Store the first attempt's data
					search.triedSecondTicket = true; // Mark that we are now trying the second ticket
					GM_setValue('CURRENT_SEARCH', search);

					// Navigate to the second ticket's URL by reloading the list page and letting the searcher handle it.
					await this.returnToListForNext(search.ticketType, true);

					// Navigate to the second ticket's URL
					window.location.href = secondTicket.href;
				}

			} catch (error) {
				LoadingManager.hide();
				VisualLogger.error(`❌ Extraction failed: ${error.message}`);
				SoundManager.playError();
				ToastManager.show(`Extraction failed: ${error.message}`, 'error');

				HistoryManager.addEntry(
					search.serviceId || 'Unknown',
					'Failed',
					StateManager.getState().sheetName,
										'ERROR',
							search.rowNumber
				);
				StateManager.updateStats(false);

				// Write failure to sheet
				await this.markRowAsFailed(search.rowNumber, StateManager.getState().sheetName, search.ticketType, 'EXTRACTION FAILED');

				GM_deleteValue('CURRENT_SEARCH');
				await this.returnToListForNext(search?.ticketType);
			}
		}

		async finalizeExtraction(search, extractionResult) {
			const validator = new ExtractionValidator();
			const validation = validator.validateExtraction(extractionResult);

			// Log validation results
			if (validation.errors.length > 0) {
				VisualLogger.error(`❌ Extraction validation failed: ${validation.errors.join(', ')}`);
			}
			if (validation.warnings.length > 0) {
				VisualLogger.warn(`⚠️ Extraction warnings: ${validation.warnings.join(', ')}`);
			}

			// Prepare enhanced loading message with validation info
			const validationHtml = `
			<div style="text-align: left; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 10px 0;">
			<div style="margin-bottom: 8px; font-size: 13px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
			Extraction Quality: <strong>${validation.score}%</strong>
			</div>
			${validation.errors.length > 0 ? `
				<div style="color: #f87171; font-size: 12px; margin-bottom: 5px;">
				❌ Errors: ${validation.errors.join(', ')}
				</div>
				` : ''}
				${validation.warnings.length > 0 ? `
					<div style="color: #fbbf24; font-size: 12px; margin-bottom: 5px;">
					⚠️ Warnings: ${validation.warnings.join(', ')}
					</div>
					` : ''}
					<div style="color: #94a3b8; font-size: 11px; margin-top: 8px;">
					Row: ${search.rowNumber} • Type: ${search.ticketType}
					</div>
					</div>
					`;

					LoadingManager.update(
						'Validating and Writing Data',
						validationHtml
					);

					// Wait a moment for user to see validation
					await this.sleep(CONFIG.TURBO_MODE ? 50 : 200);

					// Create fallback updates if necessary
					let finalUpdates = extractionResult.updates;

					// FORCE WRITE SERVICE ID (User Request)
					if (search.serviceId) {
						const mapping = SHEET_MAPPING[search.ticketType];
						if (mapping && mapping.serviceIdColumn) {
							// Remove any existing update for this column to avoid duplicates
							finalUpdates = finalUpdates.filter(u => u.col !== mapping.serviceIdColumn);
							// Add the service ID
							finalUpdates.push({
								col: mapping.serviceIdColumn,
								val: search.serviceId
							});
						}
					}

					// Fallback for missing key dates, aware of ticket type
					if (search.ticketType === 'RELOCATION') {
						// If sdEscalated is missing, use creation time
						if (!extractionResult.events.sdEscalated && extractionResult.events.creation) {
							VisualLogger.info('⚠️ Using creation time as fallback for sdEscalated');
							const mapping = SHEET_MAPPING.RELOCATION;
							if (mapping && mapping.writeColumns.sdEscalated) {
								finalUpdates.push({
									col: mapping.writeColumns.sdEscalated,
									val: this.extractor.formatDateTime(extractionResult.events.creation)
								});
							}
						}
					} else { // SUPPORT and INSTALLATION
						// If escalation is missing, use creation time
						if (!extractionResult.events.escalation && extractionResult.events.creation) {
							VisualLogger.info('⚠️ Using creation time as fallback for escalation');
							const mapping = SHEET_MAPPING[search.ticketType];
							if (mapping && mapping.writeColumns.escalated) {
								finalUpdates.push({
									col: mapping.writeColumns.escalated,
									val: this.extractor.formatDateTime(extractionResult.events.creation)
								});
							}
						}
					}

					// Ensure at least one update exists
					if (finalUpdates.length === 0) {
						VisualLogger.warn('⚠️ No updates generated, creating minimal update');
						const mapping = SHEET_MAPPING[search.ticketType];
						if (mapping) {
							const fallbackCol = mapping.writeColumns.ticketId || mapping.writeColumns.created || 'A';
							finalUpdates = [{
								col: fallbackCol,
								val: `EXTRACTED_${search.serviceId}_${new Date().toISOString().slice(0, 10)}`
							}];
						}
					}

					try {
						// Use enhanced writer with verification
						const writer = new EnhancedSheetsWriter();

						LoadingManager.update(
							'Writing to Google Sheet',
							`Row ${search.rowNumber} • Verifying write...`
						);

						const result = await writer.writeWithVerification(
							StateManager.getState().sheetName,
																		  search.rowNumber,
														finalUpdates,
														search.ticketType,
														search.serviceId
						);

						// Verify the main data was written
						// await this.verifyMainDataWrite(search, finalUpdates);

						LoadingManager.hide();

						// Determine final status
						let finalStatus = 'Partial';
						let finalMessage = '';
						let finalSound = 'attention';

						if (validation.isValid && validation.score >= 80) {
							finalStatus = 'Success';
							finalMessage = `Successfully extracted data for Row ${search.rowNumber}`;
							finalSound = 'success';
						} else if (validation.isComplete) {
							finalStatus = 'Partial Success';
							finalMessage = `Partially extracted data for Row ${search.rowNumber}`;
							finalSound = 'attention';
						} else {
							finalStatus = 'Partial';
							finalMessage = `Limited data extracted for Row ${search.rowNumber}`;
							finalSound = 'attention';
						}

						// Play appropriate sound
						if (finalSound === 'success') {
							SoundManager.playSuccess();
						} else {
							SoundManager.playAttention();
						}

						ToastManager.show(finalMessage, finalStatus === 'Success' ? 'success' : 'warning', 6000);

						// Record in history
						HistoryManager.addEntry(
							search.serviceId,
							finalStatus,
							StateManager.getState().sheetName,
												search.ticketType,
							  search.rowNumber
						);

						// Update stats
						StateManager.updateStats(finalStatus === 'Success');

						// Store detailed write log
						this.storeWriteLog(search, extractionResult, finalUpdates, validation.score, finalStatus);

					} catch (writeError) {
						LoadingManager.hide();

						VisualLogger.error(`❌ CRITICAL: Write failed completely: ${writeError.message}`);
						SoundManager.playError();
						ToastManager.show(`CRITICAL: Failed to write Row ${search.rowNumber} to sheet`, 'error', 8000);

						HistoryManager.addEntry(
							search.serviceId,
							'Write Failed',
							StateManager.getState().sheetName,
												search.ticketType,
							  search.rowNumber
						);

						StateManager.updateStats(false);

						// Emergency fallback: Try one more time with simple write
						await this.emergencyWriteFallback(search, finalUpdates);
					}

					// Clear search state
					GM_deleteValue('CURRENT_SEARCH');

					// Return to list for next item
					await this.returnToListForNext(search.ticketType);
		}

		async verifyMainDataWrite(search, updates) {
			try {
				// Verify at least one main column was written
				const mapping = SHEET_MAPPING[search.ticketType];
				if (!mapping) return true;

				// Check the ticket ID or created column as primary verification
				const primaryCol = mapping.writeColumns.ticketId || mapping.writeColumns.created;
				if (!primaryCol) return true;

				const client = new GoogleSheetsClient();
				await this.sleep(CONFIG.TURBO_MODE ? 300 : 1500); // Wait for Sheets to sync

				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(StateManager.getState().sheetName)}!${primaryCol}${search.rowNumber}`;
				const response = await client.apiRequest(url);

				const writtenValue = response.values?.[0]?.[0] || '';
				const expectedUpdate = updates.find(u => u.col === primaryCol);

				if (expectedUpdate && writtenValue && writtenValue.includes(expectedUpdate.val.substring(0, 20))) {
					VisualLogger.success(`✅ Main data verified in column ${primaryCol}`);
					return true;
				} else {
					VisualLogger.warn(`⚠️ Could not fully verify main data write. Written: "${writtenValue.substring(0, 50)}..."`);
					return false;
				}

			} catch (error) {
				VisualLogger.warn(`⚠️ Verification check failed: ${error.message}`);
				return true; // Don't fail overall if verification fails
			}
		}

		async emergencyWriteFallback(search, updates) {
			try {
				VisualLogger.info('🚨 Attempting emergency write fallback...');

				// Use basic API call without verification
				const client = new GoogleSheetsClient();
				const batchUpdates = updates.slice(0, 1).map(update => ({ // Only first update
					range: `${escapeSheetName(StateManager.getState().sheetName)}!${update.col}${search.rowNumber}`,
																		values: [[`EMERGENCY_${search.serviceId}_${new Date().toISOString()}`]]
				}));

				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchUpdate`;

				await client.apiRequest(url, {
					method: 'POST',
					data: {
						valueInputOption: 'RAW',
						data: batchUpdates
					}
				});

				VisualLogger.info('⚠️ Emergency write completed');

			} catch (error) {
				VisualLogger.error(`🚨 Emergency write also failed: ${error.message}`);
			}
		}

		storeWriteLog(search, extraction, updates, score, status) {
			const logEntry = {
				timestamp: Date.now(),
 search,
 extractionSummary: {
	 ticketId: extraction.ticketId,
	 hasCreation: !!extraction.events.creation,
	 hasEscalation: !!extraction.events.escalation,
	 hasResolution: !!(extraction.events.resolution || extraction.events.final)
 },
 updates: updates.map(u => ({ col: u.col, val: u.val.substring(0, 50) })),
 score,
 status,
 sheetName: StateManager.getState().sheetName
			};

			const logs = GM_getValue('WRITE_LOGS', []);
			logs.unshift(logEntry);
			if (logs.length > 50) logs.pop();
			GM_setValue('WRITE_LOGS', logs);
		}

		async returnToListForNext(ticketType = 'SUPPORT', isRetry = false) {
			const state = StateManager.getState();
			if (!state.active) {
				VisualLogger.info('🛑 Sequence stopped (State Inactive)');
				ToastManager.show('Prompt Mode sequence stopped', 'info');
				return;
			}

			// Check if paused
			if (state.isPaused) {
				VisualLogger.warn('⏸ Processing paused by user');
				ToastManager.show('Processing paused', 'warning');

				// Return to list and show prompt
				const listUrl = this.ticketSearcher.listUrls[ticketType] ||
				this.ticketSearcher.listUrls.SUPPORT;
				window.location.href = listUrl;
				return;
			}

			// CRITICAL FIX: Reset navigation flag
			this.isNavigating = false;

			// Clear any stuck search state
			GM_deleteValue('CURRENT_SEARCH');

			// Add stability delay
			await this.sleep(1500);

			// Process next in queue with clean state
			await this.processNextInQueue('Continuing sequence');
		}

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	}

	// ========== FLOATING ACTION BUTTON ==========
	function createFloatingButton() {
		if (document.getElementById('promptFAB')) return;

		const fab = document.createElement('div');
		fab.id = 'promptFAB';
		fab.innerHTML = `
		<div class="ultra-fab" title="Start Prompt Mode (Alt+P)">
		🎯
		</div>
		`;

		fab.onclick = (e) => {
			// Check if it's a right-click or long press
			if (e.button === 2 || e.ctrlKey) {
				e.preventDefault();
				showEnhancedFABMenu();
				return;
			}

			// Regular click - show choice dialog
			showMTTRChoiceDialog();
		};

		// Add right-click context menu
		fab.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			showEnhancedFABMenu();
		});

		document.body.appendChild(fab);
	}

	// Simple MTTR test function
	async function testMTTR() {
		try {
			console.log('Testing MTTR...');

			if (!window.MTTRManager) {
				console.log('Creating MTTR Manager...');
				window.MTTRManager = new MTTRInterfaceManager();
			}

			const initialized = await window.MTTRManager.initialize();
			if (initialized) {
				console.log('MTTR initialized, showing interface...');
				window.MTTRManager.showMainInterface();
			} else {
				console.error('MTTR initialization failed');
				ToastManager.show('MTTR initialization failed', 'error');
			}
		} catch (error) {
			console.error('MTTR Error:', error);
			ToastManager.show(`MTTR Error: ${error.message}`, 'error');
		}
	}

	// Add keyboard shortcut for testing
	document.addEventListener('keydown', (e) => {
		if (e.altKey && e.key === 't') { // Alt+T for test
			e.preventDefault();
			testMTTR();
		}
	});

	// Add a debug button to your UI
	function addDebugButton() {
		const debugBtn = document.createElement('button');
		debugBtn.textContent = '🔧';
		debugBtn.title = 'Debug Tools';
		debugBtn.style.cssText = `
		position: fixed;
		bottom: 180px;
		right: 30px;
		z-index: 2147483647;
		background: #10b981;
		color: white;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		cursor: pointer;
		font-size: 20px;
		display: none;
		`;

		debugBtn.onclick = () => {
			const row = prompt('Enter row number to debug:');
			if (row) {
				const promptManager = new PromptModeManager();
				promptManager.debugRowWrite(parseInt(row));
			}
		};

		document.body.appendChild(debugBtn);

		// Show only when on list pages
		if (window.location.href.includes('/list/')) {
			debugBtn.style.display = 'block';
		}
	}

	// ========== INITIALIZE WITH PRE-FLIGHT CHECK ==========
	async function preFlightCheck() {
		try {
			// Optimization: Skip if already passed in this session
			if (sessionStorage.getItem('PREFLIGHT_PASSED')) return true;

			// Optimization: Skip if we are actively processing a queue (assume it works)
			const state = StateManager.getState();
			if (state.active && state.queue.length > 0) return true;

			VisualLogger.info('🛫 Running pre-flight checks...');

			// Test Google Sheets connection
			const client = new GoogleSheetsClient();
			const sheets = await client.getSheets();

			if (!sheets || sheets.length === 0) {
				throw new Error('No sheets found in spreadsheet');
			}

			// Test write permissions with a tiny test
			const testSheet = sheets[0].properties.title;
			const rangeStr = `${quotedSheetName(testSheet)}!A1`;
			const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(rangeStr)}`;

			try {
				await client.apiRequest(testUrl, { method: 'PUT', data: { values: [['ULTRA_TEST']] } });
				VisualLogger.success('✅ Write permissions verified');
			} catch (writeError) {
				VisualLogger.warn(`⚠️ Write test failed (may be normal): ${writeError.message}`);
			}

			sessionStorage.setItem('PREFLIGHT_PASSED', 'true');
			return true;
		} catch (error) {
			VisualLogger.error(`❌ Pre-flight check failed: ${error.message}`);
			ToastManager.show(`Pre-flight check failed: ${error.message}`, 'error', 10000);
			return false;
		}
	}

	// ========== ADD THIS DEBUG PANEL FOR TROUBLESHOOTING ==========
	function addDebugPanel() {
		const panel = document.createElement('div');
		panel.id = 'ultraDebugPanel';
		panel.style.cssText = `
		position: fixed;
		bottom: 120px;
		right: 30px;
		background: #1e293b;
		border: 1px solid #334155;
		border-radius: 8px;
		padding: 15px;
		z-index: 2147483646;
		color: white;
		font-size: 12px;
		max-width: 300px;
		display: none;
		box-shadow: 0 4px 20px rgba(0,0,0,0.5);
		`;

		const toggleBtn = document.createElement('button');
		toggleBtn.textContent = '🐛';
		toggleBtn.title = 'Debug Panel';
		toggleBtn.style.cssText = `
		position: fixed;
		bottom: 120px;
		right: 30px;
		z-index: 2147483647;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		cursor: pointer;
		font-size: 20px;
		`;

		toggleBtn.onclick = () => {
			panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
		};

		document.body.appendChild(toggleBtn);
		document.body.appendChild(panel);

		// Update debug info every 5 seconds
		setInterval(() => {
			const state = StateManager.getState();
			const search = GM_getValue('CURRENT_SEARCH', null);

			panel.innerHTML = `
			<div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #475569; padding-bottom: 5px;">
			🐛 Debug Panel
			</div>
			<div><strong>State:</strong> ${state.active ? 'ACTIVE' : 'INACTIVE'}</div>
			<div><strong>Sheet:</strong> ${state.sheetName || 'None'}</div>
			<div><strong>Queue:</strong> ${state.queue.length} items</div>
			<div><strong>Current Row:</strong> ${state.currentRow || 'None'}</div>
			<div><strong>Paused:</strong> ${state.isPaused}</div>
			${search ? `
				<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #475569;">
				<strong>Current Search:</strong>
				<div>ID: ${search.serviceId}</div>
				<div>Row: ${search.rowNumber}</div>
				<div>Status: ${search.status}</div>
				</div>
				` : ''}
				<button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
				🔄 Reload
				</button>
				`;
		}, 5000);
	}

	// ========== SESSION MANAGEMENT ==========
	function getBrowserId() {
		try {
			let bid = localStorage.getItem('ULTRA_BROWSER_ID');
			if (!bid) {
				bid = Math.random().toString(36).substring(2, 6).toUpperCase();
				localStorage.setItem('ULTRA_BROWSER_ID', bid);
			}
			return bid;
		} catch (e) {
			return 'NO_STORAGE';
		}
	}

	function manageSessions() {
		const SESSIONS_KEY = 'SESSIONS_LIST';
		const STALE_THRESHOLD = 60 * 1000; // 1 minute

		// Read, update, and write
		let sessions = GM_getValue(SESSIONS_KEY, {});

		// Remove stale sessions
		const now = Date.now();
		for (const id in sessions) {
			if (now - sessions[id].lastSeen > STALE_THRESHOLD) {
				delete sessions[id];
			}
		}

		const metadata = GM_getValue('ULTRA_SESSION_METADATA', {});
		const sessionName = metadata[window.SESSION_ID]?.name;

		// Update current session's heartbeat
		sessions[window.SESSION_ID] = {
			lastSeen: now,
			url: window.location.href,
			ip: 'Unknown',
			uptime: 0,
			memory: window.performance && window.performance.memory ? Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024) : 0,
 browserId: getBrowserId(),
 title: document.title,
 name: sessionName
		};
		GM_setValue(SESSIONS_KEY, sessions);
	}

	// ========== MAIN INITIALIZATION ==========
	async function initialize() {
		try {
			// ========== GLOBAL ERROR HANDLING ==========
			window.addEventListener('error', function(event) {
				const errorMsg = `Unhandled Error: ${event.message} in ${event.filename} at line ${event.lineno}`;
				if (typeof VisualLogger !== 'undefined' && VisualLogger.error) {
					VisualLogger.error(errorMsg);
				}
			});
			window.addEventListener('unhandledrejection', function(event) {
				const errorMsg = `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`;
				if (typeof VisualLogger !== 'undefined' && VisualLogger.error) {
					VisualLogger.error(errorMsg);
				}
			});

			// Start Keep-Alive immediately
			KeepAliveManager.init();

			// Initialize Visual Logger early for error reporting
			VisualLogger.init();

			// Run pre-flight checks
			const preFlightPassed = await preFlightCheck();
			if (!preFlightPassed) {
				VisualLogger.error('❌ System initialization aborted due to pre-flight failures');
				return;
			}

			// Initialize debug panel
			addDebugPanel();

			// Start session heartbeat
			manageSessions();
			setInterval(manageSessions, 30000); // Update every 30 seconds

			// Initialize debug button
			addDebugButton();

			VisualLogger.info('🚀 ULTRA-AUTO Prompt Mode v2.0 Initializing...');

			// Initialize MTTR System
			try {
				if (typeof initializeMTTRSystem === 'function') await initializeMTTRSystem();
			} catch (mttrError) {
				VisualLogger.warn('⚠️ MTTR System init skipped: ' + mttrError.message);
			}

			// Create floating button
			createFloatingButton();

			// Initialize prompt manager
			const promptManager = new PromptModeManager();
			window.promptManager = promptManager;

			// Initialize Adaptive Processor
			const adaptiveProcessor = new AdaptiveProcessor();
			adaptiveProcessor.adjustSettings();

			const isList = window.location.href.includes('/list/') || ((window.location.href.includes('/installation/') || window.location.href.includes('/relocation/')) && !window.location.href.includes('/details/'));

			// Check current page type and handle accordingly
			if (isList) {
				VisualLogger.info('📋 On list page');

				// Check for active searches
				let search = GM_getValue('CURRENT_SEARCH');
				const ticketSearcher = new AdvancedTicketSearcher();

				// If we are retrying, we need to re-initiate the search for the second-highest ticket
				if (search && search.triedSecondTicket) {
					VisualLogger.info('Retrying search for second-highest ticket...');
					await ticketSearcher.performAdvancedSearch(search.serviceId);
					return;
				}
				const navigated = await ticketSearcher.handleListPage();

				// Check if search failed
				search = GM_getValue('CURRENT_SEARCH');
				if (search && search.status === 'failed') {
					await promptManager.handleSearchFailure(search);
					return;
				}

				// If prompt mode is active and not navigating, show prompt
				if (StateManager.isActive() && !navigated) {
					const autoProcessed = await promptManager.handleListAutoProcess();
					if (!autoProcessed) {
						setTimeout(() => {
							promptManager.showRowInputPrompt();
						}, 2000);
					}
				}

			} else if (window.location.href.includes('/details/')) {
				VisualLogger.info('🎯 On details page');

				// Handle extraction
				await promptManager.handleDetailsPage();
			}

			// Test API connection
			try {
				const client = new GoogleSheetsClient();
				await client.getSheets();
				VisualLogger.success('✅ Google Sheets API connection successful');
			} catch (error) {
				VisualLogger.error(`❌ API connection failed: ${error.message}`);
			}

			// Keyboard shortcut (Alt+P to start prompt mode)
			document.addEventListener('keydown', (e) => {
				const currentIsList = window.location.href.includes('/list/') ||
				((window.location.href.includes('/installation/') ||
				window.location.href.includes('/relocation/')) &&
				!window.location.href.includes('/details/'));

				if (e.altKey && e.key === 'p' && currentIsList) {
					e.preventDefault();
					if (window.promptManager) {
						window.promptManager.initialize();
					}
				}
			});

			// Add MTTR keyboard shortcuts
			addMTTRKeyboardShortcuts();
			addMTTRStyles();

			// Quick check of MTTR system availability
			if (typeof window.MTTRManager !== 'undefined') {
				// VisualLogger.debug('MTTR Manager available');
			} else {
				// Just a debug log, not an error for the user
				console.debug('MTTR Manager not globally exposed yet');
			}

			VisualLogger.success('✅ System initialized and ready');
		} catch (e) {
			console.error('❌ ULTRA SCRIPT CRASH:', e);
			alert('ULTRA Script Error: ' + e.message);
		}
	}

	// Start when page is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize);
	} else {
		initialize();
	}

})();
