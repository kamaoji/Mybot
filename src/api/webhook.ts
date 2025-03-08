// api/webhook.ts

import { 
  Bot, 
  Context,
  SessionFlavor,
  session,
  webhookCallback
} from 'grammy';
import { Menu } from '@grammyjs/menu';

// Type definitions
interface SessionData {
  score: number;
}

type MyContext = Context & SessionFlavor<SessionData>;

// Constants - Use process.env for server-side code
const BOT_TOKEN ='abcd';
const GAME_URL =  'hurl of your game';

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

// Create menu
const gameMenu = new Menu<MyContext>('game-menu')
  .game('🎮 Play Goal2Earn') // Use game() instead of text()
  .row()
  .url('👨‍💻 Developer', 't.me/ProRasel')
  .url('⭐ Rate Game', 't.me/YourGameChannel');

// Use menu middleware
bot.use(gameMenu);

// Command handlers
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🎯 Welcome to Goal2Earn!

⚽ Test your shooting skills and score goals!
🎮 Click the button below to start playing
🏆 Compete with friends and top the leaderboard

Made with ❤️ by @ProRasel
`;

  await ctx.reply(welcomeMessage, {
    reply_markup: gameMenu,
    parse_mode: 'HTML',
  });
});

// Handle game callback
bot.on('callback_query:data', async (ctx) => {
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
});

bot.command('help', async (ctx) => {
  const helpMessage = `
ℹ️ Game Instructions:

1. Click the 'Play Game' button to start
2. Hold and drag the ball to aim
3. Release to shoot towards the goal
4. Score as many goals as you can!

⚡ Energy system:
- Each shot uses energy
- Energy refills over time

🎯 Tips:
- Time your shots with the moving goal
- Watch your energy level
- Practice makes perfect!

Need help? Contact @ProRasel
`;

  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

bot.command('about', async (ctx) => {
  const aboutMessage = `
🎮 Goal2Earn Game v1.0

A fun and interactive football shooting game where you can:
• Score goals
• Compete with friends
• Track your high scores

👨‍💻 Developer: @ProRasel
📧 Contact: azamanrsl@gmail.com

Your current high score: ${ctx.session.score}
`;

  await ctx.reply(aboutMessage, { parse_mode: 'HTML' });
});

// Error handler
bot.catch((err) => {
  console.error(`Error while handling update ${err.ctx.update.update_id}:`, err.error);
});

// Export config for Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export webhook handler instead of starting the bot
export default webhookCallback(bot, 'http');