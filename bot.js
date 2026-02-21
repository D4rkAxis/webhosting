import sqlite3
import asyncio
from telethon import TelegramClient, events
from telethon.errors import FloodWaitError

# --- CONFIGURATION ---
API_ID = 28328622          
API_HASH = 'b259ae2fcffdb3e11133d94b56915110'      
BOT_TOKEN = '8553271238:AAFInIJGF0d8jQv25hYP0dgEeV-wyjtyir0' 
SOURCE_BOT_ID = 8553271238  

# Use the exact integer ID (Notice: NO QUOTES around the number)
DESTINATION_CHANNEL = -1003889415595

# --- DATABASE SETUP ---
db = sqlite3.connect("subscribers.db")
cursor = db.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY)")
db.commit()

# Initialize Clients
bot_client = TelegramClient('bot_session', API_ID, API_HASH)
user_client = TelegramClient('user_session', API_ID, API_HASH)

# Automatic Handling
bot_client.flood_sleep_threshold = 24 * 60 * 60 

@bot_client.on(events.NewMessage(pattern='/start'))
async def start_handler(event):
    user_id = event.sender_id
    cursor.execute("INSERT OR IGNORE INTO users (id) VALUES (?)", (user_id,))
    db.commit()
    await event.reply("🚀 **Connected!** Signals will be sent to the channel for maximum speed.")
    print(f"👤 New subscriber: {user_id}")

@user_client.on(events.NewMessage(from_users=SOURCE_BOT_ID))
async def bridge_handler(event):
    print(f"📦 Signal received! Forwarding to Channel ID: {DESTINATION_CHANNEL}...")
    
    try:
        # Broadcasts directly to the Channel ID
        await bot_client.send_message(DESTINATION_CHANNEL, event.message)
        print(f"✅ Successfully broadcasted to {DESTINATION_CHANNEL}")
        
    except FloodWaitError as e:
        print(f"⚠️ Telegram Rate Limit! Waiting {e.seconds} seconds...")
        await asyncio.sleep(e.seconds)
    except Exception as e:
        print(f"❌ Error during broadcast: {e}")

async def main():
    await bot_client.start(bot_token=BOT_TOKEN)
    await user_client.start() 
    
    print("------------------------------------------")
    print(f"🔥 MASTER BRIDGE IS LIVE")
    print(f"Target Channel ID: {DESTINATION_CHANNEL}")
    print("------------------------------------------")
    
    await asyncio.gather(
        bot_client.run_until_disconnected(),
        user_client.run_until_disconnected()
    )

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopping bridge...")

