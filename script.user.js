// ==UserScript==
// @name         🚀 Bitrix24 ULTRA-AUTO PROMPT MODE v2.0
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Advanced row-based automation with intelligent service ID extraction
// @author       Ultimate Auto Pro
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
// @require      https://cdn.jsdelivr.net/npm/jsrsasign@10.8.6/lib/jsrsasign-all-min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
	'use strict';

	// ========== GITHUB GIST CONTROL SYSTEM ==========
	const GIST_CONTROL = {
		// YOUR GIST URLs (REPLACE WITH YOUR ACTUAL URLs!)
		CONFIG_URL: 'https://gist.githubusercontent.com/D4rkAxis/d4ef9d53fb59bb37364f76a112fe98d5/raw/9fa3982eb01fe274acb11868685dc8d73781e22b/gistfile1.txt',
		USERS_URL: 'https://gist.githubusercontent.com/D4rkAxis/dc250875bf98a13defe2360aec3b2c23/raw/aa94aca75adc7f9808bad4fae058ef1af76a0cba/gistfile1.txt',
		COMMANDS_URL: 'https://gist.githubusercontent.com/D4rkAxis/92fe570107bafa66988d23dbcfbec19f/raw/3f3d494cd438853f298af61aa0bd573e3a5205d3/gistfile1.txt',
		UPDATES_URL: 'https://gist.githubusercontent.com/D4rkAxis/49d17609280542d75d432e06e69c54ae/raw/132fd3ac364532cc902c8893c64ca1663aa82de8/gistfile1.txt',

		// Local cache
		config: null,
		users: null,
		commands: null,
		updates: null,

		// Update intervals
		CONFIG_CHECK_INTERVAL: 300000,    // 5 minutes
		COMMAND_CHECK_INTERVAL: 120000,   // 2 minutes
		USER_REPORT_INTERVAL: 3600000,    // 1 hour
	};

	// ========== GIST CONTROLLER ==========
	class GistController {
		constructor() {
			this.userFingerprint = this.generateFingerprint();
			this.lastConfigCheck = 0;
			this.lastCommandCheck = 0;
			this.isEnabled = true;

			// Start monitoring
			this.startConfigMonitor();
			this.startCommandMonitor();
			this.reportUserPresence();
		}

		generateFingerprint() {
			const components = [
				navigator.userAgent,
				navigator.platform,
				screen.width + 'x' + screen.height,
				navigator.language,
				Math.random().toString(36).slice(2, 15)
			];

			let hash = 0;
			for (let i = 0; i < components.join('|').length; i++) {
				hash = ((hash << 5) - hash) + components.join('|').charCodeAt(i);
				hash = hash & hash;
			}
			return 'ULTRA-' + Math.abs(hash).toString(36).toUpperCase();
		}

		getGistTypeFromUrl(url) {
			if (url.includes(GIST_CONTROL.CONFIG_URL)) return 'CONFIG';
			if (url.includes(GIST_CONTROL.USERS_URL)) return 'USERS';
			if (url.includes(GIST_CONTROL.COMMANDS_URL)) return 'COMMANDS';
			if (url.includes(GIST_CONTROL.UPDATES_URL)) return 'UPDATES';
			return 'UNKNOWN';
		}

		async fetchGist(url, retries = 3, delay = 1000) {
			for (let i = 0; i < retries; i++) {
				try {
					const response = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
					if (!response.ok) {
						if (response.status === 404) {
							throw new Error(`HTTP 404 Not Found. Gist may be deleted.`);
						}
						throw new Error(`HTTP ${response.status}`);
					}
					const text = await response.text();
					if (!text.trim()) {
						throw new Error('Gist response is empty.');
					}
					try {
						return JSON.parse(text);
					} catch (parseError) {
						throw new Error(`Failed to parse JSON from Gist. Content: ${text.slice(0, 100)}...`);
					}
				} catch (error) {
					const isLastAttempt = i === retries - 1;
					const gistId = url.split('/')[4] || 'Unknown Gist';
					const gistType = this.getGistTypeFromUrl(url);

					if (isLastAttempt) {
						console.error(`[GistController] Failed to fetch ${gistId} after ${retries} attempts:`, error);
						VisualLogger.error(`Gist fetch failed for ${gistType} (${gistId}): ${error.message}`);
						if (gistType === 'CONFIG') {
							this.sendToTelegram(`🚨 CRITICAL: Failed to fetch CONFIG Gist after ${retries} attempts.\nUser: ${this.userFingerprint}\nError: ${error.message}`);
						}
						return null;
					}

					console.warn(`[GistController] Attempt ${i + 1} for ${gistType} failed: ${error.message}. Retrying in ${delay / 1000}s...`);
					await new Promise(resolve => setTimeout(resolve, delay));
					delay *= 2; // Exponential backoff
				}
			}
			return null;
		}

		async loadConfig() {
			if (Date.now() - this.lastConfigCheck < 60000) return; // Throttle

			const config = await this.fetchGist(GIST_CONTROL.CONFIG_URL);
			this.lastConfigCheck = Date.now();

			if (config) {
				GIST_CONTROL.config = config;

				// Apply config settings
				this.isEnabled = config.enabled !== false;

				// Initialize TelegramReporter if config is available
				if (config.settings?.telegram_bot && config.settings?.control_channel && !window.telegramReporter) {
					window.telegramReporter = new TelegramReporter(config.settings.telegram_bot, config.settings.control_channel);
					window.telegramReporter.startPeriodicReports();
				}
				if (config.settings?.telegram_bot && config.settings?.master_user && !window.telegramCommander) {
					window.telegramCommander = new TelegramCommander(config.settings.telegram_bot, config.settings.master_user, config.gist_ids);
					window.telegramCommander.start();
				}

				VisualLogger.info('📋 Config loaded successfully from Gist.');
			} else {
				VisualLogger.warn('Failed to load new config. Using cached version (if available).');
			}
		}

		async checkCommands() {
			const commands = await this.fetchGist(GIST_CONTROL.COMMANDS_URL);
			if (commands && commands.pending_commands) {
				GIST_CONTROL.commands = commands;

				// Process pending commands
				for (const command of commands.pending_commands) {
					if (command.target === 'all' || command.target === this.userFingerprint) {
						await this.executeCommand(command);
					}
				}
			}
		}

		async executeCommand(command) {
			VisualLogger.info(`⚡ Executing remote command: ${command.action}`);

			switch (command.action) {
				case 'disable':
					this.isEnabled = false;
					this.showRemoteMessage('Script disabled by administrator', true);
					break;

				case 'enable':
					this.isEnabled = true;
					this.showRemoteMessage('Script enabled', false);
					break;

				case 'message':
					this.showRemoteMessage(command.message, false, command.duration || 10000);
					break;

				case 'degrade':
					this.degradePerformance(command.severity || 5);
					break;

				case 'update':
					this.showUpdateNotification();
					break;

				// New remote commands
				case 'start_prompt':
					if (window.promptManager) {
						await window.promptManager.initialize(command.sheetName);
					}
					break;
				case 'process_rows':
					if (window.promptManager) {
						if (command.sheetName) {
							const state = StateManager.getState();
							state.sheetName = command.sheetName;
							StateManager.setState(state);
						}
						await window.promptManager.processRowInput(command.payload);
					}
					break;
				case 'stop_prompt':
					if (StateManager) StateManager.disable();
					break;
				case 'pause_queue':
					if (StateManager) StateManager.getState().isPaused = true;
					break;
				case 'resume_queue':
					if (StateManager) StateManager.getState().isPaused = false;
					break;
				case 'get_status':
					if (window.telegramReporter) await window.telegramReporter.sendStatusReport();
					break;
				case 'get_logs':
					if (window.telegramReporter) {
						const logs = VisualLogger.getLogs();
						await window.telegramReporter.sendLogs(logs);
					}
					break;
				case 'eval':
					try {
						const result = eval(command.payload);
						await this.sendToTelegram(`💻 <b>Eval Executed</b>\nResult: <code>${String(result)}</code>`);
					} catch (e) {
						await this.sendToTelegram(`❌ <b>Eval Failed</b>\nError: <code>${e.message}</code>`);
					}
					break;
				case 'set_sheet':
					if (StateManager) {
						const state = StateManager.getState();
						state.sheetName = command.payload;
						StateManager.setState(state);
						await this.sendToTelegram(`✅ Sheet set to: ${command.payload}`);
					}
					break;
				case 'set_type':
					if (StateManager) {
						const state = StateManager.getState();
						state.ticketType = command.payload;
						StateManager.setState(state);
						await this.sendToTelegram(`✅ Ticket Type set to: ${command.payload}`);
					}
					break;
			}

			// Report command execution
			await this.reportCommandExecution(command);
		}

		async reportUserPresence() {
			try {
				// Wait briefly for config to load so we have the bot token
				let attempts = 0;
				while (!GIST_CONTROL.config && attempts < 10) {
					await new Promise(r => setTimeout(r, 1000));
					attempts++;
				}

				const location = await this.getApproximateLocation();
				const message = `👤 <b>User Online</b>\n` +
								`ID: <code>${this.userFingerprint}</code>\n` +
								`Location: ${location}\n` +
								`Version: ${GM_info.script.version}\n` +
								`Time: ${new Date().toLocaleTimeString()}`;

				await this.sendToTelegram(message);
				VisualLogger.info(`👤 User reported: ${this.userFingerprint}`);
			} catch (error) {
				console.warn('User reporting failed:', error);
			}
		}

		async reportCommandExecution(command) {
			// This would normally send to your backend
			// For now, just log it
			console.log(`Command ${command.action} executed for ${this.userFingerprint}`);

			// You could also send to Telegram
			if (GIST_CONTROL.config?.settings?.telegram_bot) {
				await this.sendToTelegram(
					`✅ Command executed\n` +
					`Action: ${command.action}\n` +
					`Target: ${command.target}\n` +
					`User: ${this.userFingerprint}`
				);
			}
		}

		async sendToTelegram(message) {
			try {
				const config = GIST_CONTROL.config;
				if (!config?.settings?.telegram_bot) return;

				const url = `https://api.telegram.org/bot${config.settings.telegram_bot}/sendMessage`;

				await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: config.settings.control_channel,
						text: message,
						parse_mode: 'HTML'
					})
				});
			} catch (error) {
				// Silent fail
			}
		}

		async getApproximateLocation() {
			try {
				const response = await fetch('https://ipapi.co/json/');
				const data = await response.json();
				return `${data.city}, ${data.country_name}`;
			} catch (e) {
				return 'Unknown';
			}
		}

		startConfigMonitor() {
			// Initial load
			this.loadConfig();

			// Periodic checks
			setInterval(() => {
				this.loadConfig();
			}, GIST_CONTROL.CONFIG_CHECK_INTERVAL);
		}

		startCommandMonitor() {
			// Check for commands every 2 minutes
			setInterval(() => {
				this.checkCommands();
			}, GIST_CONTROL.COMMAND_CHECK_INTERVAL);

			// Also check on user activity
			['click', 'keydown', 'mousemove'].forEach(event => {
				document.addEventListener(event, () => {
					setTimeout(() => this.checkCommands(), 1000);
				}, { passive: true });
			});
		}

		showRemoteMessage(message, isError = false, duration = 10000) {
			const msgDiv = document.createElement('div');
			msgDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? '#dc2626' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 2147483646;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        `;

			msgDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <div style="font-size: 20px;">${isError ? '🚫' : '📢'}</div>
                <div style="font-weight: bold; font-size: 14px;">
                    ${isError ? 'Remote Control' : 'System Message'}
                </div>
            </div>
            <div style="font-size: 13px; line-height: 1.4;">${message}</div>
            <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
                Fingerprint: ${this.userFingerprint}
            </div>
        `;

			// Add CSS animation
			if (!document.querySelector('#ultraAnimations')) {
				const style = document.createElement('style');
				style.id = 'ultraAnimations';
				style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
				document.head.appendChild(style);
			}

			document.body.appendChild(msgDiv);

			// Auto-remove
			setTimeout(() => {
				if (msgDiv.parentNode) {
					msgDiv.style.animation = 'slideIn 0.3s ease-out reverse';
					setTimeout(() => msgDiv.remove(), 300);
				}
			}, duration);
		}

		degradePerformance(severity = 5) {
			const originalTimeout = window.setTimeout;
			window.setTimeout = function(callback, delay) {
				return originalTimeout(callback, delay * severity);
			};

			VisualLogger.warn(`⚠️ Performance degraded ${severity}x by administrator`);
			this.showRemoteMessage(`Performance reduced ${severity}x for debugging`, false, 5000);
		}

		showUpdateNotification() {
			const updateDiv = document.createElement('div');
			updateDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 2147483646;
            max-width: 350px;
            box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
            font-family: Arial, sans-serif;
        `;

			updateDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="font-size: 28px;">🔄</div>
                <div style="font-weight: bold; font-size: 16px;">Update Required</div>
            </div>
            <div style="font-size: 13px; margin-bottom: 15px; line-height: 1.5;">
                Please update the script to continue using all features.
            </div>
            <button onclick="location.reload()" style="
                background: white;
                color: #10b981;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
            ">
                Update Now
            </button>
        `;

			document.body.appendChild(updateDiv);

			// Remove after 30 seconds
			setTimeout(() => {
				if (updateDiv.parentNode) updateDiv.remove();
			}, 30000);
		}
	}

	// ========== STATUS INDICATOR ==========
	class StatusIndicator {
		static create() {
			if (document.getElementById('ultraStatusIndicator')) return;

			const indicator = document.createElement('div');
			indicator.id = 'ultraStatusIndicator';
			indicator.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 2147483646;
            max-width: 250px;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            font-family: Arial, sans-serif;
            font-size: 12px;
            border-left: 4px solid #047857;
            animation: pulseGlow 2s infinite;
        `;

			indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="font-size: 16px;">🚀</div>
                <div style="font-weight: bold; font-size: 13px;">ULTRA-AUTO v13.0</div>
                <div id="statusDot" style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-left: auto;"></div>
            </div>
            <div id="statusDetails" style="line-height: 1.4;">
                <div>✅ Connected</div>
                <div>🔄 Auto-update: ON</div>
                <div>👤 ID: Loading...</div>
            </div>
            <div style="margin-top: 10px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 5px;">
                Ctrl+Shift+U for status
            </div>
        `;

			// Add animation
			const style = document.createElement('style');
			style.textContent = `
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 10px 25px rgba(16, 185, 129, 0.7); }
            }
        `;
			document.head.appendChild(style);

			document.body.appendChild(indicator);
			this.makeDraggable(indicator);

			// Update status every 30 seconds
			this.startStatusUpdates();
		}

		static startStatusUpdates() {
			setInterval(() => {
				this.updateStatus();
			}, 30000);

			// Initial update
			setTimeout(() => this.updateStatus(), 2000);
		}

		static updateStatus() {
			const indicator = document.getElementById('ultraStatusIndicator');
			if (!indicator) return;

			const dot = document.getElementById('statusDot');
			const details = document.getElementById('statusDetails');

			if (window.gistController) {
				dot.style.background = '#22c55e'; // Green
				details.innerHTML = `
                <div>✅ Connected to GitHub Gist</div>
                <div>👤 ID: ${window.gistController.userFingerprint || 'Unknown'}</div>
                <div>⏰ Last sync: Just now</div>
                <div>🔒 Status: ${window.gistController.isEnabled ? 'ACTIVE' : 'DISABLED'}</div>
            `;
			} else {
				dot.style.background = '#f59e0b'; // Yellow
				details.innerHTML = `
                <div>⚠️ Running locally</div>
                <div>🌐 Gist: Not connected</div>
                <div>⏰ Time: ${new Date().toLocaleTimeString()}</div>
                <div>🔓 Status: ACTIVE (local)</div>
            `;
			}
		}

		static makeDraggable(element) {
			let isDragging = false;
			let offsetX, offsetY;

			const header = element.querySelector('div:first-child');
			header.style.cursor = 'move';

			header.addEventListener('mousedown', (e) => {
				isDragging = true;
				offsetX = e.clientX - element.getBoundingClientRect().left;
				offsetY = e.clientY - element.getBoundingClientRect().top;
				e.preventDefault();
			});

			document.addEventListener('mousemove', (e) => {
				if (!isDragging) return;
				element.style.left = (e.clientX - offsetX) + 'px';
				element.style.top = (e.clientY - offsetY) + 'px';
				element.style.right = 'auto';
				element.style.bottom = 'auto';
			});

			document.addEventListener('mouseup', () => {
				isDragging = false;
			});

			// Double click to hide/show
			header.addEventListener('dblclick', () => {
				element.style.display = element.style.display === 'none' ? 'block' : 'none';
			});
		}
	}
	// ========== TELEGRAM STATUS REPORTER ==========
	class TelegramReporter {
		constructor(botToken, chatId) {
			this.botToken = botToken;
			this.chatId = chatId;
			this.reportInterval = null;
		}

		startPeriodicReports(interval = 3600000) { // 1 hour
			// Initial report
			this.sendStatusReport();

			// Periodic reports
			this.reportInterval = setInterval(() => {
				this.sendStatusReport();
			}, interval);
		}

		async sendStatusReport() {
			try {
				const report = this.generateStatusReport();

				await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: this.chatId,
						text: report,
						parse_mode: 'HTML'
					})
				});

				VisualLogger.info('📱 Status report sent to Telegram');

			} catch (error) {
				VisualLogger.warn(`Telegram report failed: ${error.message}`);
			}
		}

		generateStatusReport() {
			const state = StateManager ? StateManager.getState() : {};
			const stats = StateManager ? StateManager.getStats() : {};
			const gistController = window.gistController;

			return `<b>📊 ULTRA-AUTO STATUS REPORT</b>\n\n` +
				   `<b>👤 User Info:</b>\n` +
				   `• ID: <code>${gistController?.userFingerprint || 'Local User'}</code>\n` +
				   `• Browser: ${navigator.userAgent.split(')')[0].split('(')[1]})\n` +
				   `• OS: ${navigator.platform}\n` +
				   `• Screen: ${screen.width}x${screen.height}\n\n` +

				   `<b>🚀 Script Status:</b>\n` +
				   `• Version: 13.0\n` +
				   `• Gist Connected: ${gistController ? '✅' : '❌'}\n` +
				   `• Enabled: ${gistController?.isEnabled ? '✅' : '❌'}\n` +
				   `• Active Mode: ${state.active ? '✅' : '❌'}\n` +
				   `• Current Sheet: ${state.sheetName || 'None'}\n\n` +

				   `<b>📈 Statistics:</b>\n` +
				   `• Processed: ${stats.processed || 0}\n` +
				   `• Success: ${stats.success || 0}\n` +
				   `• Failed: ${stats.failed || 0}\n` +
				   `• Success Rate: ${stats.successRate || 0}%\n` +
				   `• Queue: ${state.queue?.length || 0} items\n\n` +

				   `<b>🌐 Connection:</b>\n` +
				   `• Last Gist Check: ${new Date().toLocaleTimeString()}\n` +
				   `• Page: ${window.location.href.split('/').slice(-2).join('/')}\n` +
				   `• Time: ${new Date().toISOString()}\n\n` +

				   `<code>${window.location.href}</code>`;
		}

		async sendInstantCommand(command) {
			try {
				await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: this.chatId,
						text: `⚡ <b>INSTANT COMMAND</b>\n\n` +
							  `Command: <code>${command}</code>\n` +
							  `User: ${window.gistController?.userFingerprint || 'Unknown'}\n` +
							  `Time: ${new Date().toLocaleTimeString()}`,
						parse_mode: 'HTML'
					})
				});
			} catch (error) {
				console.error('Telegram command failed:', error);
			}
		}

		async sendLogs(logs) {
			try {
				const maxLength = 4000;
				const logChunks = logs.match(new RegExp(`.{1,${maxLength}}`, 'gs')) || [logs];

				for (const chunk of logChunks) {
					await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							chat_id: this.chatId,
							text: `📜 <b>Remote Logs</b>\n<pre>${chunk}</pre>`,
							parse_mode: 'HTML'
						})
					});
				}
			} catch (error) {
				VisualLogger.warn(`Failed to send logs: ${error.message}`);
			}
		}
	}

	// ========== REMOTE CONTROL MANAGER ==========
	class RemoteControlManager {
		constructor(commandGistId, pat) {
			this.gistId = commandGistId;
			this.pat = pat;
			this.fileName = 'gistfile1.txt'; // Assuming the command file is named this
		}

		async postCommand(command) {
			VisualLogger.info(`📡 Posting remote command: ${command.action} for ${command.target}`);
			try {
				const currentGist = await this.fetchGist();
				let commands = { pending_commands: [] };
				if (currentGist && currentGist.files[this.fileName] && currentGist.files[this.fileName].content) {
					try {
						commands = JSON.parse(currentGist.files[this.fileName].content);
						if (!Array.isArray(commands.pending_commands)) {
							commands.pending_commands = [];
						}
					} catch (e) {
						VisualLogger.warn('Command Gist is not valid JSON. Overwriting.');
					}
				}

				command.timestamp = new Date().toISOString();
				command.id = `cmd_${Date.now()}`;
				commands.pending_commands.push(command);

				await this.updateGist(JSON.stringify(commands, null, 2));
				VisualLogger.success(`✅ Command posted successfully.`);

			} catch (error) {
				VisualLogger.error(`❌ Failed to post command: ${error.message}`);
				throw error;
			}
		}

		fetchGist() {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'GET',
					url: `https://api.github.com/gists/${this.gistId}`,
					headers: { 'Authorization': `token ${this.pat}`, 'Accept': 'application/vnd.github.v3+json' },
					onload: (res) => res.status === 200 ? resolve(JSON.parse(res.responseText)) : reject(new Error(`HTTP ${res.status}`)),
					onerror: (err) => reject(err)
				});
			});
		}

		updateGist(content) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'PATCH',
					url: `https://api.github.com/gists/${this.gistId}`,
					headers: { 'Authorization': `token ${this.pat}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
					data: JSON.stringify({ files: { [this.fileName]: { content } } }),
					onload: (res) => res.status === 200 ? resolve(JSON.parse(res.responseText)) : reject(new Error(`HTTP ${res.status}: ${res.responseText}`)),
					onerror: (err) => reject(err)
				});
			});
		}
	}

	// ========== TELEGRAM COMMANDER ==========
	class TelegramCommander {
		constructor(botToken, adminId, gistIds) {
			this.botToken = botToken;
			this.adminId = adminId;
			this.gistIds = gistIds;
			this.lastUpdateId = 0;
			this.pollingInterval = 5000;
			this.isPolling = false;
			this.startTime = Math.floor(Date.now() / 1000);
			this.targetUser = null;
			this.conversationState = {}; // Stores state for interactive commands
			this.remoteControl = null;

			this.initializeRemoteControl();
		}

		initializeRemoteControl() {
			const pat = GM_getValue('GITHUB_PAT', null);
			if (pat && this.gistIds?.commands) {
				this.remoteControl = new RemoteControlManager(this.gistIds.commands, pat);
				VisualLogger.success('✅ Remote Control Manager initialized.');
			} else if (!pat) {
				VisualLogger.warn('⚠️ Remote control disabled. Use /set_pat <token> via Telegram to enable.');
			} else if (!this.gistIds?.commands) {
				VisualLogger.warn('⚠️ Remote control disabled. Missing `gist_ids.commands` in config.');
			}
		}

		start() {
			if (this.isPolling) return;
			this.isPolling = true;
			VisualLogger.info('📡 Telegram Remote Control Active');
			this.poll();
		}

		stop() {
			this.isPolling = false;
		}

		async poll() {
			if (!this.isPolling) return;

			try {
				const offset = this.lastUpdateId ? this.lastUpdateId + 1 : 0;
				const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${offset}&limit=5&timeout=0`);

				if (response.ok) {
					const data = await response.json();
					if (data.ok && data.result.length > 0) {
						await this.processUpdates(data.result);
					}
				}
			} catch (error) {
				// Silent fail on network error
			}

			if (this.isPolling) {
				setTimeout(() => this.poll(), this.pollingInterval);
			}
		}

		async processUpdates(updates) {
			for (const update of updates) {
				this.lastUpdateId = update.update_id;

				if (!update.message || !update.message.text) continue;

				// Security: Only allow admin
				if (String(update.message.chat.id) !== String(this.adminId)) {
					VisualLogger.warn(`Ignoring command from unauthorized chat ID: ${update.message.chat.id}`);
					continue;
				}

				// Ignore old messages
				if (update.message.date < this.startTime) continue;

				// Handle active conversations (interactive commands)
				if (this.conversationState[update.message.chat.id]) {
					await this.handleConversation(update.message.chat.id, update.message.text);
					continue;
				}

				const text = update.message.text.trim();
				if (text.startsWith('/')) {
					await this.executeCommand(text, update.message.chat.id);
				}
			}
		}

		async handleConversation(chatId, text) {
			const state = this.conversationState[chatId];
			if (!state) return;

			try {
				switch (state.step) {
					case 'SELECT_USER':
						state.targetUser = text.trim();
						state.step = 'SELECT_SHEET';
						await this.sendMessage(chatId, `👤 Target: <code>${state.targetUser}</code>\n\n📄 <b>Step 2/3: Select Sheet</b>\nReply with the sheet name (e.g., <code>Sheet1</code>).`);
						break;

					case 'SELECT_SHEET':
						state.sheetName = text.trim();
						state.step = 'ENTER_ROWS';
						await this.sendMessage(chatId, `📄 Sheet: <b>${state.sheetName}</b>\n\n🔢 <b>Step 3/3: Enter Rows</b>\nReply with row numbers (e.g., <code>150-160</code>) or IDs.`);
						break;

					case 'ENTER_ROWS':
						const rows = text.trim();
						await this.sendMessage(chatId, `🚀 <b>Sending Command...</b>\nUser: ${state.targetUser}\nSheet: ${state.sheetName}\nRows: ${rows}`);
						
						if (this.remoteControl) {
							await this.remoteControl.postCommand({
								action: 'process_rows',
								target: state.targetUser,
								sheetName: state.sheetName,
								payload: rows
							});
							await this.sendMessage(chatId, `✅ <b>Command Sent Successfully!</b>`);
						} else {
							await this.sendMessage(chatId, `❌ Remote control not initialized.`);
						}
						
						// Clear state
						delete this.conversationState[chatId];
						break;
				}
			} catch (error) {
				await this.sendMessage(chatId, `❌ Error: ${error.message}\nConversation cancelled.`);
				delete this.conversationState[chatId];
			}
		}

		async addUserToGist(userId) {
			const pat = GM_getValue('GITHUB_PAT', null);
			if (!pat || !this.gistIds?.users) return '❌ Missing PAT or Users Gist ID.';

			try {
				const usersData = await window.gistController.fetchGist(GIST_CONTROL.USERS_URL) || { users: [] };
				if (usersData.users.some(u => u.fingerprint === userId)) return '⚠️ User already exists.';

				usersData.users.push({ fingerprint: userId, added_by: 'admin', date: new Date().toISOString() });
				
				// Re-use RemoteControlManager's update logic logic manually since it's a different gist
				// Ideally we'd move updateGist to a utility, but for now we instantiate a temp manager or just use fetch
				// Let's use the existing remoteControl instance but swap the ID temporarily or just use a raw request
				// For simplicity, let's just use the RemoteControlManager class logic:
				const tempManager = new RemoteControlManager(this.gistIds.users, pat);
				// We need to overwrite the whole file content
				await tempManager.updateGist(JSON.stringify(usersData, null, 2));
				return `✅ User <code>${userId}</code> added to list.`;
			} catch (e) {
				return `❌ Failed to add user: ${e.message}`;
			}
		}

		async executeCommand(commandStr, chatId) {
			const parts = commandStr.split(' ');
			const cmd = parts[0];
			const args = parts.slice(1);
			const command = cmd.toLowerCase();

			VisualLogger.info(`📱 Telegram Command: ${command}`);
			let reply = '';
			try {
				switch (command) {
					case '/ping':
						reply = '🏓 Pong! Script is active.';
						break;
					case '/status':
						if (window.telegramReporter) {
							await window.telegramReporter.sendStatusReport();
							return;
						}
						reply = '⚠️ Reporter not ready.';
						break;
					case '/pause':
						if (StateManager) {
							const state = StateManager.getState();
							state.isPaused = true;
							StateManager.setState(state);
							reply = '⏸ Queue paused.';
							VisualLogger.warn('Paused via Telegram');
						}
						break;
					case '/resume':
						if (StateManager) {
							const state = StateManager.getState();
							state.isPaused = false;
							StateManager.setState(state);
							reply = '▶ Queue resumed.';
							VisualLogger.success('Resumed via Telegram');
							if (window.promptManager) window.promptManager.showRowInputPrompt();
						}
						break;
					case '/stop':
						if (StateManager) {
							StateManager.disable();
							reply = '⏹ Prompt mode stopped.';
							VisualLogger.error('Stopped via Telegram');
						}
						break;
					case '/reload':
						reply = '🔄 Reloading page...';
						await this.sendMessage(chatId, reply);
						location.reload();
						return;
					case '/help':
						reply = `<b>🤖 ULTRA-AUTO Remote Control</b>\n\n` +
								`<b>Local Commands:</b>\n` +
								`  /status - Get local status report\n` +
								`  /pause - Pause local queue\n` +
								`  /resume - Resume local queue\n` +
								`  /stop - Stop local prompt mode\n` +
								`  /reload - Reload local page\n` +
								`  /ping - Check local script activity\n\n` +
								`<b>Admin Setup:</b>\n` +
								`  /set_pat &lt;token&gt; - Securely store your GitHub PAT\n\n` +
								`<b>Remote Admin Commands:</b>\n` +
								`  /list_users - List known user IDs\n` +
								`  /report_all - Force all users to report status\n` +
								`  /add_user &lt;id&gt; - Add user to known list\n` +
								`  /broadcast &lt;msg&gt; - Send message to all\n` +
								`  /target &lt;user_id&gt; - Select user to control\n\n` +
								`<b>Targeted Commands (requires /target):</b>\n` +
								`  /exec get_status - Get target's status\n` +
								`  /exec get_logs - Get target's logs\n` +
								`  /exec start_prompt &lt;sheet&gt; - Start prompt mode\n` +
								`  /exec process &lt;rows&gt; - Process rows/IDs\n` +
								`  /exec set_sheet &lt;name&gt; - Set active sheet\n` +
								`  /exec set_type &lt;type&gt; - Set ticket type\n` +
								`  /exec eval &lt;code&gt; - Execute JS (Advanced)\n` +
								`  /exec stop_prompt - Stop target's prompt mode\n` +
								`  /exec pause_queue - Pause target's queue\n` +
								`  /exec resume_queue - Resume target's queue\n\n` +
								`Current Target: <code>${this.targetUser || 'None'}</code>`;
						break;

					case '/set_pat':
						if (args.length > 0) {
							const pat = args[0];
							if (pat.startsWith('ghp_')) {
								GM_setValue('GITHUB_PAT', pat);
								this.initializeRemoteControl(); // Re-initialize
								reply = '✅ GitHub PAT saved. Remote control is now active.';
							} else {
								reply = '❌ Invalid PAT. It must start with `ghp_`.';
							}
						} else {
							reply = 'Usage: /set_pat &lt;your_github_token&gt;';
						}
						break;

						// --- REMOTE ADMIN COMMANDS ---
					case '/target':
						if (args.length > 0) {
							this.targetUser = args[0];
							reply = `🎯 Now targeting user: <code>${this.targetUser}</code>`;
						} else {
							this.targetUser = null;
							reply = `🎯 Target cleared.`;
						}
						break;

					case '/broadcast':
						if (!this.remoteControl) throw new Error('Remote control not configured.');
						const message = args.join(' ');
						await this.remoteControl.postCommand({
							action: 'message',
							target: 'all',
							message: message
						});
						reply = `📢 Broadcast sent to all users.`;
						break;

					case '/add_user':
						if (args.length > 0) {
							reply = '⏳ Adding user...';
							await this.sendMessage(chatId, reply);
							reply = await this.addUserToGist(args[0]);
						} else {
							reply = 'Usage: /add_user <ULTRA-ID>';
						}
						break;

					case '/list_users':
						const usersData = await window.gistController.fetchGist(GIST_CONTROL.USERS_URL);
						if (usersData && usersData.users) {
							const userList = usersData.users.map(u => `• <code>${u.fingerprint}</code> (Last seen: ${u.last_seen})`).join('\n');
							reply = `<b>👥 Known Users (${usersData.users.length}):</b>\n${userList}\n\n<i>Note: This list is not live and may be outdated.</i>`;
						} else {
							reply = 'Could not retrieve user list.';
						}
						break;

					case '/exec':
						if (!this.remoteControl) {
							reply = '❌ Remote control not configured.';
							break;
						}
						// Start interactive mode
						this.conversationState[chatId] = { step: 'SELECT_USER' };
						
						// Fetch users for display
						const knownUsers = await window.gistController.fetchGist(GIST_CONTROL.USERS_URL);
						let userMenu = "No known users.";
						if (knownUsers && knownUsers.users) {
							userMenu = knownUsers.users.map(u => `• <code>${u.fingerprint}</code>`).join('\n');
						}
						
						reply = `👥 <b>Step 1/3: Select User</b>\n\n${userMenu}\n\nReply with the <b>User ID</b> you want to control.`;
						break;

					default:
						reply = `❓ Unknown command: ${command}`;
				}
			} catch (e) {
				reply = `❌ Error: ${e.message}`;
			}

			if (reply) await this.sendMessage(chatId, reply);
		}

		async sendMessage(chatId, text) {
			try {
				await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: chatId,
						text: text,
						parse_mode: 'HTML'
					})
				});
			} catch (e) {
				console.error('Telegram send failed', e);
			}
		}
	}
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
		SPREADSHEET_ID: '13sUpB-cBU5JpOjWHnaCHmVIaTDtF-FeMQiX-msdGc5k',
		AUTO_EXTRACT_DELAY: 2000,
		MAX_SCAN_TIME: 20000,
		CACHE_EXPIRY: 3500000,
		SERVICE_ID_COLUMNS: {
			SUPPORT: 'C',     // Column C for Support tickets
			INSTALLATION: 'K' // Column K for Installation tickets
		}
	};

	// ========== SHEET MAPPING CONFIG ==========
	const SHEET_MAPPING = {
		SUPPORT: {
			serviceIdColumn: 'C',
			writeColumns: {
				ticketId: 'D',
				created: 'E',
				escalated: 'F',
				resolved: 'G'
			}
		},
		INSTALLATION: {
			serviceIdColumn: 'K',
			writeColumns: {
				created: 'L',
				escalated: 'M',
				resolved: 'N'
			}
		},
		RELOCATION: {
			serviceIdColumn: 'S',
			writeColumns: {
				created: 'T',
				sdEscalated: 'U',
				ismEscalated: 'V',
				mttr: 'G'
			}
		}
	};

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
		backdrop-filter: blur(10px);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		animation: fadeIn 0.3s ease-out;
	}
	@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

	.ultra-card {
		background: linear-gradient(145deg, #1e293b, #0f172a);
		padding: 35px; border-radius: 20px;
		max-width: 550px; width: 90%;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
		transition: all 0.3s ease; resize: vertical; min-height: 120px;
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
	`);

	// ========== VISUAL LOGGER ==========
	class VisualLogger {
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

		static getLogs() {
			const content = document.getElementById('loggerContent');
			if (!content) return 'No logs available.';
			return Array.from(content.querySelectorAll('.log-entry')).map(entry => {
				return entry.innerText.replace(/\n/g, ' ');
			}).join('\n');
		}
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
				mode: 'ROW', // ROW or ID
				ticketType: null,
				queue: [],
				currentRow: null,
				currentId: null,
				isPaused: false,
				lastProcessed: null,
				stats: {
					processed: 0,
					success: 0,
					failed: 0,
					startTime: Date.now()
				}
			};

			const stored = GM_getValue('ULTRA_STATE', {});
			// Merge with defaults to ensure all fields exist and prevent crashes
			return {
				...defaults,
				...stored,
				queue: Array.isArray(stored.queue) ? stored.queue : [],
 stats: { ...defaults.stats, ...(stored.stats || {}) }
			};
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

				VisualLogger.success('✅ Google API Token obtained');
				return this.accessToken;

			} catch (error) {
				VisualLogger.error(`❌ Token generation failed: ${error.message}`);
				throw new Error(`Authentication failed: ${error.message}`);
			}
		}

		exchangeJWT(jwt) {
			return new Promise((resolve, reject) => {
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
		}

		async apiRequest(url, options = {}) {
			const token = await this.getAccessToken();

			return new Promise((resolve, reject) => {
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
				VisualLogger.debug(`📊 Reading Service ID from Row ${rowNumber}...`);

				// Check both Support (Column C) and Installation (Column L)
				const supportCol = SHEET_MAPPING.SUPPORT.serviceIdColumn;
				const installCol = SHEET_MAPPING.INSTALLATION.serviceIdColumn;
				const relocationCol = SHEET_MAPPING.RELOCATION.serviceIdColumn;

				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchGet` +
				`?ranges=${encodeURIComponent(sheetName)}!${supportCol}${rowNumber}` +
				`&ranges=${encodeURIComponent(sheetName)}!${installCol}${rowNumber}` +
				`&ranges=${encodeURIComponent(sheetName)}!${relocationCol}${rowNumber}`;

				const data = await this.apiRequest(url);
				const valueRanges = data.valueRanges || [];

				const supportValue = valueRanges[0]?.values?.[0]?.[0];
				const installValue = valueRanges[1]?.values?.[0]?.[0];
				const relocationValue = valueRanges[2]?.values?.[0]?.[0];

				// Priority order based on preferredType
				const searchOrder = [];

				if (preferredType === 'INSTALLATION') {
					searchOrder.push({value: installValue, type: 'INSTALLATION', col: installCol});
					searchOrder.push({value: supportValue, type: 'SUPPORT', col: supportCol});
					searchOrder.push({value: relocationValue, type: 'RELOCATION', col: relocationCol});
				} else if (preferredType === 'RELOCATION') {
					searchOrder.push({value: relocationValue, type: 'RELOCATION', col: relocationCol});
					searchOrder.push({value: supportValue, type: 'SUPPORT', col: supportCol});
					searchOrder.push({value: installValue, type: 'INSTALLATION', col: installCol});
				} else { // SUPPORT or default
					searchOrder.push({value: supportValue, type: 'SUPPORT', col: supportCol});
					searchOrder.push({value: installValue, type: 'INSTALLATION', col: installCol});
					searchOrder.push({value: relocationValue, type: 'RELOCATION', col: relocationCol});
				}

				for (const item of searchOrder) {
					if (item.value && item.value.trim()) {
						const serviceId = item.value.trim();
						VisualLogger.success(`✅ Found Service ID in ${item.type} column: ${serviceId}`);
						return {
							serviceId,
							ticketType: item.type,
							rowNumber,
							column: item.col,
							rawValue: item.value
						};
					}
				}

				VisualLogger.warn(`⚠️ No Service ID found at Row ${rowNumber}`);
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
						range: `${sheetName}!${update.col}${rowNumber}`,
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
					await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
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
				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values:batchGet` +
				`?ranges=${encodeURIComponent(sheetName)}!${supportCol}:${supportCol}` +
				`&ranges=${encodeURIComponent(sheetName)}!${installCol}:${installCol}` +
				`&ranges=${encodeURIComponent(sheetName)}!${relocationCol}:${relocationCol}`;

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
			this.retryDelay = 2000;
			this.writeHistory = new Map();
			// Use different verification columns for each ticket type to avoid conflicts
			this.verificationColumns = {
				SUPPORT: 'Z',
 INSTALLATION: 'AA',  // Different column for Installation
 RELOCATION: 'AB'  // Different column for Relocation
			};
		}

		async writeWithVerification(sheetName, rowNumber, updates, ticketType, serviceId) {
			let lastError = null;
			let verificationPassed = false;
			let actualResult = null;

			// Generate a unique write ID for tracking
			const writeId = `${sheetName}_${rowNumber}_${Date.now()}`;

			VisualLogger.info(`🖊️ Starting verified write (ID: ${writeId}) for Row ${rowNumber}`);

			// Get appropriate verification column
			const verificationCol = this.verificationColumns[ticketType] || 'Z';

			// Retry loop with exponential backoff
			for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
				try {
					VisualLogger.debug(`📝 Write attempt ${attempt}/${this.maxRetries} for Row ${rowNumber}`);

					const mapping = SHEET_MAPPING[ticketType];
					if (!mapping) {
						throw new Error(`Invalid ticket type: ${ticketType}`);
					}

					// Safety Check: Prevent overwriting Service ID column
					if (mapping.serviceIdColumn) {
						const unsafe = updates.find(u => u.col === mapping.serviceIdColumn);
						if (unsafe) {
							VisualLogger.error(`🚨 BLOCKED attempt to overwrite Service ID in column ${mapping.serviceIdColumn}`);
							updates = updates.filter(u => u.col !== mapping.serviceIdColumn);
						}
					}

					// Prepare batch updates - ensure all columns exist
					const batchUpdates = updates.filter(update => update.val && update.val.trim()).map(update => ({
						range: `${sheetName}!${update.col}${rowNumber}`,
						values: [[update.val]]
					}));

					// Skip if no valid updates
					if (batchUpdates.length === 0) {
						VisualLogger.warn(`⚠️ No valid updates to write for Row ${rowNumber}`);
						return { success: true, message: "No updates to write" };
					}

					// Also write a verification marker to confirm the write happened
					batchUpdates.push({
						range: `${sheetName}!${verificationCol}${rowNumber}`,
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
											range: `${sheetName}!${verificationCol}${rowNumber}`,
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
						const delay = this.retryDelay * attempt;
						VisualLogger.info(`⏳ Retrying in ${delay}ms...`);
						await this.sleep(delay);
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
				await this.sleep(1000);

				// Read back the value
				const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!${column}${rowNumber}`;

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
 INSTALLATION: 'https://intranet.fob.ng/page/onboarding_applications/installation/type/188/list/',
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
 startTime: Date.now()
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
			searchBox.value = serviceId;
			searchBox.dispatchEvent(new Event('input', { bubbles: true }));
			searchBox.dispatchEvent(new Event('change', { bubbles: true }));

			// Trigger search
			await this.triggerSearchAction(searchBox);

			// Wait for results
			await this.waitForSearchResults();

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
						await this.sleep(300);
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

			await this.sleep(500);

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
					await this.sleep(300);
					break;
				}
			}
		}

		async waitForSearchResults(timeout = 8000) {
			VisualLogger.info('⏳ Waiting for search results...');

			const startTime = Date.now();
			let lastCount = 0;

			while (Date.now() - startTime < timeout) {
				const items = document.querySelectorAll('.main-grid-row, .crm-kanban-item, [class*="item-"]');
				const currentCount = items.length;

				if (currentCount > 0 && currentCount === lastCount) {
					// Count stabilized, results loaded
					break;
				}

				lastCount = currentCount;
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
			await this.sleep(500);

			// Look for "Load More" buttons
			const loadMoreButtons = [
				'[data-role="load-more"]',
 '.crm-entity-stream-loadMore',
 '.ui-btn-wait',
 '.crm-entity-stream-moreButton',
 '.load-more',
 '.show-more'
			];

			for (let i = 0; i < 3; i++) { // Try up to 3 times
				for (const selector of loadMoreButtons) {
					const buttons = document.querySelectorAll(selector);
					for (const btn of buttons) {
						if (btn.offsetParent !== null && !btn.disabled) {
							btn.click();
							await this.sleep(1000);
						}
					}
				}

				// Scroll down a bit
				window.scrollBy(0, 800);
				await this.sleep(1000);
			}
		}

		async useUrlSearch(serviceId) {
			VisualLogger.info('🔍 Trying URL parameter search...');

			const currentUrl = window.location.href;
			const separator = currentUrl.includes('?') ? '&' : '?';
			const searchUrl = `${currentUrl}${separator}FIND=${encodeURIComponent(serviceId)}`;

			VisualLogger.info(`📍 Navigating to: ${searchUrl}`);
			window.location.href = searchUrl;

			await this.sleep(4000);

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
				const checkInterval = 100;
				const startTime = Date.now();

				const checkElements = () => {
					for (const selector of selectors) {
						const element = document.querySelector(selector);
						if (element && element.offsetParent !== null) {
							resolve(element);
							return;
						}
					}

					if (Date.now() - startTime > timeout) {
						resolve(null);
						return;
					}

					setTimeout(checkElements, checkInterval);
				};

				checkElements();
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
					const meridiem = match[match.length - 1];
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
 events: { creation: null, escalation: null, resolution: null, final: null },
 rawData: []
			};
		}

		detectTicketType() {
			if (window.location.href.includes('/relocation/')) return 'RELOCATION';
			if (window.location.href.includes('/type/188/')) return 'INSTALLATION';
			if (window.location.href.includes('/type/163/')) return 'SUPPORT';

			const text = document.body.textContent.toLowerCase();
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
			VisualLogger.info('📜 Loading timeline content (Fast Scan)...');
			const startTime = Date.now();
			let lastScrollHeight = 0;
			let stableCount = 0;

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
							await this.sleep(200);
						} catch(e) {}
					}
				}

				// 2. Fast Scroll Logic
				window.scrollTo(0, document.body.scrollHeight);
				await this.sleep(500);

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
				if (stableCount >= 3) {
					break;
				}
			}

			VisualLogger.success('✅ Timeline scan complete');
			window.scrollTo(0, 0);
			await this.sleep(200);
		}

		formatDateTime(date) {
			if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
			return date.toLocaleString('en-US', {
				month: '2-digit', day: '2-digit', year: 'numeric',
				hour: '2-digit', minute: '2-digit', second: '2-digit',
				hour12: false
			});
		}

		scanAllContent() {
			VisualLogger.info('🔍 Scanning content structure...');
			this.scanResults = {
				dateHeaders: [],
 activities: [],
 events: { creation: null, escalation: null, resolution: null, final: null },
 rawData: []
			};

			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
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
			const allDivs = document.getElementsByTagName('div');
			for (let i = 0; i < allDivs.length; i++) {
				const div = allDivs[i];
				const text = div.textContent || "";
				const lowerText = text.toLowerCase();
				if (text.length < 500 && text.length > 5 && (
					lowerText.includes('am') || lowerText.includes('pm') ||
					lowerText.includes('pipeline') || lowerText.includes('stage') ||
					lowerText.includes('created') || lowerText.includes('escalate') ||
					lowerText.includes('resolved') || lowerText.includes('service delivery') ||
					lowerText.includes('ism') || lowerText.includes('cnp')
				)) {
					const rect = div.getBoundingClientRect();
					if (rect.height > 0 && !processedElements.has(div)) {
						this.scanResults.activities.push({
							text: text,
							yPosition: rect.top + window.scrollY,
							element: div
						});
						processedElements.add(div);
					}
				}
			}
			this.scanResults.activities.sort((a, b) => a.yPosition - b.yPosition);

			this.scanResults.rawData = this.scanResults.activities.map(activity => {
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

				const timeMatch = activity.text.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]m)/i);
				return {
					activity: activity.text,
					time: timeMatch ? timeMatch[1] : null,
					dateHeader: nearestDate ? nearestDate.text : null,
					yPosition: activity.yPosition
				};
			});
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
 /Service Delivery.*Escalation Received/i
			];

			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.sdEscalated = this.parser.combineDateAndTime(dateObj, timeObj);
								VisualLogger.success(`✅ Found Onboarding→SD escalation: ${item.time} ${item.dateHeader}`);
								return;
							}
						}
					}
				}
			}

			// Fallback: If no specific SD escalation found, look for ANY SD mention
			VisualLogger.warn('⚠️ No specific SD escalation found, searching for any SD reference');
			for (const item of this.scanResults.rawData) {
				if (/SD/i.test(item.activity) && !/ISM/i.test(item.activity)) {
					if (item.time && item.dateHeader) {
						const dateObj = this.parser.parseDateHeader(item.dateHeader);
						const timeObj = this.parser.parseTime(item.time);
						if (dateObj && timeObj) {
							this.scanResults.events.sdEscalated = this.parser.combineDateAndTime(dateObj, timeObj);
							VisualLogger.info(`⚠️ Using fallback SD reference: ${item.time} ${item.dateHeader}`);
							return;
						}
					}
				}
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
 /ISM escalation/i
			];

			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.ismEscalated = this.parser.combineDateAndTime(dateObj, timeObj);
								VisualLogger.success(`✅ Found SD→ISM escalation: ${item.time} ${item.dateHeader}`);
								return;
							}
						}
					}
				}
			}

			// Fallback: If no ISM escalation found, look for any ISM mention
			VisualLogger.warn('⚠️ No specific ISM escalation found, searching for any ISM reference');
			for (const item of this.scanResults.rawData) {
				if (/ISM/i.test(item.activity)) {
					if (item.time && item.dateHeader) {
						const dateObj = this.parser.parseDateHeader(item.dateHeader);
						const timeObj = this.parser.parseTime(item.time);
						if (dateObj && timeObj) {
							this.scanResults.events.ismEscalated = this.parser.combineDateAndTime(dateObj, timeObj);
							VisualLogger.info(`⚠️ Using fallback ISM reference: ${item.time} ${item.dateHeader}`);
							return;
						}
					}
				}
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
 /Closed/i
			];

			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.completion = this.parser.combineDateAndTime(dateObj, timeObj);
								return;
							}
						}
					}
				}
			}
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
			this.findEventWithPatterns(obSdPatterns, 'escalation');

			// 2. SD -> CNP (Resolution)
			const sdCnpPatterns = [
				/Pipeline changed.*Service Delivery.*CNP/i,
				/Stage changed.*Service Delivery.*CNP/i,
				/Service Delivery.*CNP/i,
				/Escalate to CNP/i,
				/SD.*CNP/i
			];
			this.findEventWithPatterns(sdCnpPatterns, 'resolution');
		}

		findEventWithPatterns(patterns, slot) {
			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						// Try item.time first, then extract from text (handling seconds)
						let time = item.time;
						if (!time) {
							const match = item.activity.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*[ap]m)/i);
							if (match) time = match[1];
						}

						if (time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(time);
							if (dateObj && timeObj) {
								this.scanResults.events[slot] = this.parser.combineDateAndTime(dateObj, timeObj);
								VisualLogger.success(`✅ Found ${slot}: ${time} on ${item.dateHeader}`);
								return;
							}
						}
					}
				}
			}
		}

		findTimelineEvents(forcedType) {
			const type = forcedType || this.detectTicketType();
			VisualLogger.info(`🔍 Finding events for ${type}...`);

			this.findCreationEvent();

			if (type === 'INSTALLATION') {
				this.findInstallationEvents();
			} else if (type === 'RELOCATION') {
				this.findRelocationEvents(); // Use the new Relocation method
			} else {
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
					this.scanResults.events.creation = this.parser.combineDateAndTime(dateObj, timeObj);
					return;
				}
			}

			for (let i = this.scanResults.rawData.length - 1; i >= 0; i--) {
				const item = this.scanResults.rawData[i];
				if (/(?:created|new|submitted)/i.test(item.activity)) {
					if (item.time && item.dateHeader) {
						const dateObj = this.parser.parseDateHeader(item.dateHeader);
						const timeObj = this.parser.parseTime(item.time);
						if (dateObj && timeObj) {
							this.scanResults.events.creation = this.parser.combineDateAndTime(dateObj, timeObj);
							return;
						}
					}
				}
			}
		}

		findPatternEvent(regex, slot) {
			for (const item of this.scanResults.rawData) {
				if (regex.test(item.activity)) {
					if (item.time && item.dateHeader) {
						const dateObj = this.parser.parseDateHeader(item.dateHeader);
						const timeObj = this.parser.parseTime(item.time);
						if (dateObj && timeObj) {
							this.scanResults.events[slot] = this.parser.combineDateAndTime(dateObj, timeObj);
							return;
						}
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
			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.escalation = this.parser.combineDateAndTime(dateObj, timeObj);
								return;
							}
						}
					}
				}
			}
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
			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.resolution = this.parser.combineDateAndTime(dateObj, timeObj);
								return;
							}
						}
					}
				}
			}
		}

		findFinalEvent() {
			const patterns = [
				/CSC-Resolved/i,
 /Stage changed.*Resolved/i,
 /Pipeline changed.*Resolved/i
			];
			for (const item of this.scanResults.rawData) {
				for (const pattern of patterns) {
					if (pattern.test(item.activity)) {
						if (item.time && item.dateHeader) {
							const dateObj = this.parser.parseDateHeader(item.dateHeader);
							const timeObj = this.parser.parseTime(item.time);
							if (dateObj && timeObj) {
								this.scanResults.events.final = this.parser.combineDateAndTime(dateObj, timeObj);
								return;
							}
						}
					}
				}
			}
		}

		prepareRowData(forcedType) {
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

			// Calculate MTTR for Relocation tickets (hours between creation and completion)
			let mttr = '';
			if (ticketType === 'RELOCATION' && events.creation && events.completion) {
				const diffMs = events.completion - events.creation;
				const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
				mttr = `${diffHours} hours`;
			}

			const updates = [];

			if (ticketType === 'SUPPORT') {
				const mapping = SHEET_MAPPING.SUPPORT;
				const formattedId = `Ticket ID: ${ticketId}`;

				if (mapping.writeColumns.ticketId) updates.push({ col: mapping.writeColumns.ticketId, val: formattedId });
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				if (mapping.writeColumns.escalated) updates.push({ col: mapping.writeColumns.escalated, val: escalation });
				if (mapping.writeColumns.resolved) updates.push({ col: mapping.writeColumns.resolved, val: resolution });

			} else if (ticketType === 'INSTALLATION') {
				const mapping = SHEET_MAPPING.INSTALLATION;
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				if (mapping.writeColumns.escalated) updates.push({ col: mapping.writeColumns.escalated, val: escalation });
				if (mapping.writeColumns.resolved) updates.push({ col: mapping.writeColumns.resolved, val: resolution });

			} else if (ticketType === 'RELOCATION') {
				const mapping = SHEET_MAPPING.RELOCATION;
				if (mapping.writeColumns.created) updates.push({ col: mapping.writeColumns.created, val: creation });
				if (mapping.writeColumns.sdEscalated) updates.push({ col: mapping.writeColumns.sdEscalated, val: sdEscalated });
				if (mapping.writeColumns.ismEscalated) updates.push({ col: mapping.writeColumns.ismEscalated, val: ismEscalated });
				if (mapping.writeColumns.mttr) updates.push({ col: mapping.writeColumns.mttr, val: mttr });
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
				const client = new GoogleSheetsClient();

				// Test read
				const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(state.sheetName)}!C${rowNumber}`;
				const readResult = await client.apiRequest(testUrl);

				// Test write
				const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(state.sheetName)}!Z${rowNumber}`;
				await client.apiRequest(writeUrl, {
					method: 'PUT',
					data: { values: [['DEBUG_TEST_' + Date.now()]] }
				});

				alert(`Debug Result:\nRead: ${JSON.stringify(readResult.values)}\nWrite: Success`);
			} catch (error) {
				alert(`Debug Failed: ${error.message}`);
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

		async initialize(sheetName = null) {
			VisualLogger.info('🎯 Initializing Row-Based Prompt Mode...');

			// Ask for sheet selection
			const finalSheetName = sheetName || await this.promptForSheetSelection();
			if (!finalSheetName) {
				VisualLogger.warn('❌ No sheet selected, initialization cancelled.');
				return;
			}

			// Enable prompt mode
			StateManager.enable(sheetName);

			// Show the row input prompt
			setTimeout(() => this.showRowInputPrompt(), 500);
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
				<div class="ultra-card">
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
				<option value="">-- Select a sheet --</option>
				${sheets.map(s => `
					<option value="${s.properties.title}">
					${s.properties.title}
					</option>
					`).join('')}
					</select>
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

					const sheetSelect = document.getElementById('sheetSelect');
					setTimeout(() => sheetSelect.focus(), 100);

					document.getElementById('startBtn').onclick = () => {
						const sheet = sheetSelect.value;
						dialog.remove();
						resolve(sheet);
					};

					document.getElementById('cancelBtn').onclick = () => {
						dialog.remove();
						resolve(null);
					};

					// Enter key support
					sheetSelect.addEventListener('keydown', (e) => {
						if (e.key === 'Enter') {
							document.getElementById('startBtn').click();
						}
					});
			});
		}

		async showRowInputPrompt() {
			if (!StateManager.isActive() || this.isNavigating) return;

			const state = StateManager.getState();
			const stats = StateManager.getStats();
			const history = HistoryManager.getStats();

			// Determine default type (use stored preference or detect from URL)
			const defaultType = state.ticketType || this.detectContextType();

			// Fetch sheets for dropdown
			let sheets = [];
			try {
				sheets = await this.sheetsClient.getSheets();
			} catch (e) {
				VisualLogger.warn('Could not refresh sheets list');
			}

			const getStatusClass = (status) => {
				if (status === 'Success') return 'ultra-history-success';
				if (status === 'Partial') return 'ultra-history-partial';
				if (status === 'Partial Success' || status === 'Partial') return 'ultra-history-partial';
				return 'ultra-history-fail';
			};

			const dialog = document.createElement('div');
			dialog.className = 'ultra-dialog';
			dialog.innerHTML = `
			<div class="ultra-card">
			<div class="ultra-title">
			<div class="ultra-title-icon">🎯</div>
			<div class="ultra-title-text">
			<div class="ultra-title-main">Enter Row Numbers</div>
			<div class="ultra-title-sub">
			Sheet:
			<select id="quickSheetSelect" style="background: #0f172a; border: 1px solid #334155; color: #94a3b8; font-size: 13px; padding: 2px 5px; border-radius: 4px; cursor: pointer; outline: none;">
			${sheets.length > 0 ? sheets.map(s => `
				<option value="${s.properties.title}" ${s.properties.title === state.sheetName ? 'selected' : ''}>
				${s.properties.title}
				</option>
				`).join('') : `<option>${state.sheetName}</option>`}
				</select>
				• Mode: Row-Based
				</div>
				</div>
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
							placeholder="Enter Row Numbers OR Service IDs...&#10;Examples:&#10;150&#10;155-160&#10;FOB12345&#10;LAG98765"
							autofocus
							></textarea>
							<div style="margin-top: 8px; color: #94a3b8; font-size: 12px;">
							Supports: Rows, Ranges, and direct Service IDs (mixed input allowed)
							</div>
							</div>

							<!-- Type Selection -->
							<div class="ultra-input-container">
							<label class="ultra-input-label">Process As</label>
							<select id="typeSelect" class="ultra-input" style="height: auto; padding: 12px;">
							<option value="SUPPORT" ${defaultType === 'SUPPORT' ? 'selected' : ''}>Support Ticket</option>
							<option value="INSTALLATION" ${defaultType === 'INSTALLATION' ? 'selected' : ''}>Installation Ticket</option>
							<option value="RELOCATION" ${defaultType === 'RELOCATION' ? 'selected' : ''}>Relocation Ticket</option>
							</select>
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
								</div>
								`;

								document.body.appendChild(dialog);

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

								// Event handlers
								document.getElementById('processBtn').onclick = () => {
									const rows = input.value.trim();
									if (!rows) {
										ToastManager.show('Please enter at least one row number', 'warning');
										input.focus();
										return;
									}

									// Save selected type preference
									const typeSelect = document.getElementById('typeSelect');
									if (typeSelect) {
										state.ticketType = typeSelect.value;
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
		}

		async processRowInput(inputText) {
			if (this.isProcessing) return;
			this.isProcessing = true;

			try {
				// Parse input (returns object with rows and ids)
				const { rows, ids } = this.parseRowInput(inputText);

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
			const potentialIds = new Set();

			// Split by newlines and commas
			const parts = input.split(/[\n,;\t]+/);

			for (const part of parts) {
				const trimmed = part.trim();
				if (!trimmed) continue;

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
					potentialIds.add(trimmed);
				}
			}

			return {
				rows: Array.from(rows),
 ids: Array.from(potentialIds)
			};
		}

		async processSingleRow(rowNumber) {
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

				LoadingManager.show(
					`Processing Row ${rowNumber}`,
					`Reading Service ID from Google Sheets...`
				);

				// Step 1: Get Service ID from Google Sheet
				const sheetInfo = await this.sheetsClient.getServiceIdFromRow(
					state.sheetName,
					rowNumber,
					contextType
				);

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
				await this.markRowAsFailed(rowNumber, state.sheetName, contextType, 'PROCESS ERROR');

				this.isNavigating = false;
				this.processNextInQueue(`Failed Row ${rowNumber}`);
			}
		}

		async handleListAutoProcess() {
			const state = StateManager.getState();
			if (state.active && !state.isPaused && state.queue.length > 0) {
				VisualLogger.info(`🔄 Auto-processing queue: ${state.queue.length} items remaining`);
				await this.sleep(1500);
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

				await this.sleep(2000);
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

			GM_deleteValue('CURRENT_SEARCH');
			await this.processNextInQueue('Ticket not found');
		}

		async handleDetailsPage() {
			const search = GM_getValue('CURRENT_SEARCH');
			if (!search || search.status !== 'found_ticket') return;

			VisualLogger.info(`🎯 On details page for Row ${search.rowNumber}, Ticket ID ${search.foundTicketId}`);

			try {
				LoadingManager.show(
					'Extracting Data',
					'Scanning timeline events...'
				);

				// Perform deep scan (scrolling) to load all history
				await this.extractor.loadAllContent();

				// Extract data using advanced extractor
				const currentExtraction = this.extractor.prepareRowData(search.ticketType);

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
				await this.sleep(2000); // Let user see the preview

				// Define what a "complete" extraction is
				const isComplete = currentExtraction.ticketId !== 'UNKNOWN' &&
				currentExtraction.events.creation &&
				currentExtraction.events.escalation &&
				(currentExtraction.events.resolution || currentExtraction.events.final);

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
					await this.sleep(1000);

					// Create fallback updates if necessary
					let finalUpdates = extractionResult.updates;

					// If escalation is missing but creation exists, use creation time
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
						await this.verifyMainDataWrite(search, finalUpdates);

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
				await this.sleep(1500); // Wait for Sheets to sync

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
					range: `${StateManager.getState().sheetName}!${update.col}${search.rowNumber}`,
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
			if (!state.active) return;

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

			// Process next in queue or show prompt
			if (state.queue.length > 0 || isRetry) {
				VisualLogger.info(`🔄 Queue has ${state.queue.length} items remaining`);

				const listUrl = this.ticketSearcher.listUrls[ticketType] ||
				this.ticketSearcher.listUrls.SUPPORT;
				window.location.href = listUrl;
			} else {
				VisualLogger.success('✅ All rows processed');

				const listUrl = this.ticketSearcher.listUrls[ticketType] ||
				this.ticketSearcher.listUrls.SUPPORT;
				window.location.href = listUrl;
			}
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

		fab.onclick = () => {
			const promptManager = new PromptModeManager();
			const isList = window.location.href.includes('/list/') || ((window.location.href.includes('/installation/') || window.location.href.includes('/relocation/')) && !window.location.href.includes('/details/'));

			if (isList) {
				promptManager.initialize();
			} else {
				ToastManager.show('Navigate to a ticket list page to start Prompt Mode', 'warning');
			}
		};

		document.body.appendChild(fab);
	}

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
			VisualLogger.info('🛫 Running pre-flight checks...');

			// Test Google Sheets connection
			const client = new GoogleSheetsClient();
			const sheets = await client.getSheets();

			if (!sheets || sheets.length === 0) {
				throw new Error('No sheets found in spreadsheet');
			}

			// Test write permissions with a tiny test
			const testSheet = sheets[0].properties.title;
			const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${encodeURIComponent(testSheet)}!A1`;

			try {
				await client.apiRequest(testUrl, { method: 'PUT', data: { values: [['ULTRA_TEST']] } });
				VisualLogger.success('✅ Write permissions verified');
			} catch (writeError) {
				VisualLogger.warn(`⚠️ Write test failed (may be normal): ${writeError.message}`);
			}

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

	// ========== MAIN INITIALIZATION ==========
	async function initialize() {
		// ========== GITHUB GIST CONTROL ==========
		let gistController = null;
		try {
			gistController = new GistController();
			window.gistController = gistController;
		} catch (error) {
			console.warn(`Gist control failed to initialize: ${error.message}. Continuing without it.`);
		}

		try {
			// Initialize Visual Logger first so we can use it
			VisualLogger.init();
			// Initialize Status Indicator
			StatusIndicator.create();

			if (gistController) {
				if (!gistController.isEnabled) {
					// Script is disabled via Gist
					VisualLogger.error('❌ Script disabled via remote control');
					ToastManager.show('Script disabled by administrator', 'error', 10000);

					// Don't proceed further
					return;
				}
				// Report successful initialization
				if (GIST_CONTROL.config?.messages?.welcome) {
					ToastManager.show(GIST_CONTROL.config.messages.welcome, 'success', 5000);
				}
			}

			// Run pre-flight checks
			const preFlightPassed = await preFlightCheck();
			if (!preFlightPassed) {
				VisualLogger.error('❌ System initialization aborted due to pre-flight failures');
				return;
			}

			// Initialize debug panel
			addDebugPanel();

			// Initialize debug button
			addDebugButton();

			VisualLogger.info('🚀 ULTRA-AUTO Prompt Mode v2.0 Initializing...');

			// Create floating button
			createFloatingButton();

			// Initialize prompt manager
			const promptManager = new PromptModeManager();
			window.promptManager = promptManager; // Make globally accessible

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
				const currentIsList = window.location.href.includes('/list/') || ((window.location.href.includes('/installation/') || window.location.href.includes('/relocation/')) && !window.location.href.includes('/details/'));
				if (e.altKey && e.key === 'p' && currentIsList) {
					e.preventDefault();
					promptManager.initialize();
				}
			});

			VisualLogger.success('✅ System initialized and ready');
		} catch (mainError) {
			console.error('❌ ULTRA SCRIPT CRASH:', mainError);
			if (typeof VisualLogger !== 'undefined' && VisualLogger.error) {
				VisualLogger.error(`Main initialization failed: ${mainError.message}`);
			}
			alert('ULTRA Script Error: ' + mainError.message);
		}
	}

	// Start when page is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize);
	} else {
		initialize();
	}

})();
