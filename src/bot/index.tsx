import { 
  Bot, 
  Context,
  SessionFlavor,
  session,
  ErrorHandler,
} from 'grammy';
import { Menu } from '@grammyjs/menu';

// Type definitions
interface SessionData {
  score: number;
}

type MyContext = Context & SessionFlavor<SessionData>;

// Constants
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN || '';
const GAME_URL = import.meta.env.VITE_GAME_URL || '';

// Create bot instance
const bot = new Bot<MyContext>(BOT_TOKEN);

// Initialize session middleware
bot.use(
  session({
    initial: (): SessionData => ({
      score: 0,
    }),
  })
);

// Create the menu with the 'Play Game' button
const gameMenu = new Menu<MyContext>('game-menu')
  .text('🎮 Play GrowTree2Earn', async (ctx) => {
    try {
      await ctx.answerCallbackQuery({
        url: GAME_URL, // Directs to the game
      });
    } catch (error) {
      console.error('Error launching game:', error);
      await ctx.answerCallbackQuery({
        text: '❌ Failed to launch the game. Please try again.',
        show_alert: true,
      });
    }
  })
  .row()
  .url('👨‍💻 Developer', 't.me/ProRasel');

// Use the menu middleware
bot.use(gameMenu);

// Command handlers
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🌳 Welcome to GrowTree2Earn!

🌱 Tap to grow your tree and earn rewards!
🎮 Click the button below to start playing
🏆 Compete with friends and see who grows the tallest forest!

Made with ❤️ by @ProRasel
`;

  await ctx.reply(welcomeMessage, {
    reply_markup: gameMenu,
    parse_mode: 'HTML',
  });
});

// Handle game callback queries safely
bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.game_short_name) {
    try {
      await ctx.answerCallbackQuery({
        url: GAME_URL,
      });
    } catch (error) {
      console.error('Error launching game:', error);
      await ctx.answerCallbackQuery({
        text: '❌ Failed to launch game. Please try again.',
        show_alert: true,
      });
    }
  }
});

bot.command('help', async (ctx) => {
  const helpMessage = `
ℹ️ Game Instructions:

1. Click the 'Play Game' button to start
2. Tap the tree to grow it
3. More taps grow the tree faster and earn rewards
4. Keep playing to unlock new trees!

⚡ Energy system:
- Each tap uses energy
- Energy refills every 30 seconds

🎯 Tips:
- Time your taps to maximize energy usage
- Grow multiple trees for higher rewards

Need help? Contact @ProRasel
`;

  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

bot.command('about', async (ctx) => {
  const aboutMessage = `
🎮 GrowTree2Earn v1.0

A relaxing and rewarding tree-growing game where you:
• Tap to grow trees and earn rewards
• Compete with friends on the leaderboard
• Track your progress and unlock more trees

👨‍💻 Developer: @ProRasel
📧 Contact: azamanrsl@gmail.com

Your current high score: ${ctx.session.score}
`;

  await ctx.reply(aboutMessage, { parse_mode: 'HTML' });
});

// Error handler
const errorHandler: ErrorHandler<MyContext> = (err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`, err.error);
};

bot.catch(errorHandler);

// Start the bot
if (BOT_TOKEN) {
  bot.start({
    onStart: (botInfo) => {
      console.log(`Bot @${botInfo.username} is up and running!`);
    },
  });
} else {
  console.error('BOT_TOKEN is not set in environment variables');
}

export default bot;
