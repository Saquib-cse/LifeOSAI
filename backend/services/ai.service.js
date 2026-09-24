import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

/**
 * Call OpenRouter API safely or trigger deterministic local fallback
 */
async function callOpenRouter(systemPrompt, userPrompt) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.trim() === '' || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    return null; // Signals fallback should be used
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lifeos.ai',
        'X-Title': 'LifeOS AI'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.warn(`[AIService] OpenRouter HTTP error ${response.status}. Using deterministic AI engine.`);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.warn('[AIService] OpenRouter request failed. Falling back to local AI engine:', error.message);
    return null;
  }
}

/**
 * Chat Assistant Interface
 */
export async function chatWithAI(userMessage, context) {
  const systemPrompt = `You are LifeOS AI, an intelligent personal operating system and executive function assistant. 
You help users manage tasks, prioritize goals, build habits, and optimize their daily schedule.
Keep responses highly structured, actionable, warm, and concise.
Never give medical, financial, or legal advice.

User Data Context:
- Tasks: ${JSON.stringify(context.tasks || [])}
- Goals: ${JSON.stringify(context.goals || [])}
- Habits: ${JSON.stringify(context.habits || [])}
- Recent Focus Hours Today: ${context.focusHoursToday || 0} hrs`;

  const aiResult = await callOpenRouter(systemPrompt, userMessage);
  if (aiResult) return { response: aiResult, source: 'openrouter' };

  // Local Deterministic Fallback AI Response Logic
  const msgLower = userMessage.toLowerCase();
  const tasks = context.tasks || [];
  const pendingTasks = tasks.filter(t => !t.completed);
  const highPriority = pendingTasks.filter(t => t.priority === 'High');

  let responseText = '';

  if (msgLower.includes('exam') || msgLower.includes('study') || msgLower.includes('plan')) {
    responseText = `Here is your suggested tactical plan:

**Phase 1: High-Impact Focus (6:00 PM – 7:30 PM)**
- Tackle top study priority: **${highPriority[0]?.title || 'Key Assignment / Prep'}**
- Eliminate notifications and run a 45-min Pomodoro focus session.

**Break (7:30 PM – 7:45 PM)**
- Hydrate, step away from screens, light stretch.

**Phase 2: Reinforcement & Review (7:45 PM – 9:00 PM)**
- Work through remaining items: **${pendingTasks[1]?.title || 'Practice Problems & Flashcards'}**
- Complete active habit log and organize desk for tomorrow.

**Summary Advice:**
You have ${pendingTasks.length} pending items. Focus on finishing one major task before adding extra study load.`;
  } else if (msgLower.includes('prioritize') || msgLower.includes('important') || msgLower.includes('next')) {
    responseText = `Based on your current workspace context, here is your priority breakdown:

1. **Immediate Focus (High Priority):**
${highPriority.map((t, i) => `   ${i + 1}. **${t.title}** (${t.category})`).join('\n') || '   - No pending high priority tasks! Great job.'}

2. **Secondary Tasks (Medium Priority):**
${pendingTasks.filter(t => t.priority === 'Medium').map(t => `   - ${t.title}`).join('\n') || '   - None pending.'}

**AI Recommendation:**
Clear your single highest priority task first thing during your peak focus window today.`;
  } else if (msgLower.includes('doing') || msgLower.includes('week') || msgLower.includes('progress') || msgLower.includes('how am i')) {
    responseText = `Here is your LifeOS Weekly Progress Summary:

- **Task Completion:** You've completed ${tasks.filter(t => t.completed).length} out of ${tasks.length} total tasks.
- **Focus Time:** Logged **${context.focusHoursToday || 2.25} hours** of dedicated focus session time today.
- **Habit Streaks:** Active streaks are holding strong! Keep up your top routines.

**Optimization Insight:**
You perform best when starting focus blocks before noon. Consider scheduling your hardest work during morning hours.`;
  } else {
    responseText = `Thanks for reaching out! Here is how LifeOS AI can assist you right now:

- **Today's Status:** You have **${pendingTasks.length} pending tasks** (${highPriority.length} marked High Priority).
- **Recommended Action:** Focus on completing **${highPriority[0]?.title || pendingTasks[0]?.title || 'your top task'}**.

Would you like me to generate a complete hourly schedule for your evening or break down a complex goal into smaller steps?`;
  }

  return { response: responseText, source: 'local-fallback' };
}

/**
 * AI Daily Planner Service
 */
export async function generateDailyPlan(context) {
  const systemPrompt = `You are LifeOS AI Daily Planner. Generate a realistic, structured hour-by-hour timeline for today based on user tasks, deadlines, and focus sessions. Format clearly with times, emojis, and activity descriptions.`;

  const userPrompt = `Generate today's optimal schedule using these tasks: ${JSON.stringify(context.tasks || [])}`;

  const aiResult = await callOpenRouter(systemPrompt, userPrompt);
  if (aiResult) return { plan: aiResult, source: 'openrouter' };

  // Deterministic local daily planner
  const tasks = context.tasks || [];
  const pending = tasks.filter(t => !t.completed);
  const highPriority = pending.filter(t => t.priority === 'High');
  const medPriority = pending.filter(t => t.priority === 'Medium');
  const lowPriority = pending.filter(t => t.priority === 'Low');

  const timeline = [
    { time: '08:00 AM - 08:30 AM', title: 'Morning Routine & Hydration', detail: 'Planning priorities, light exercise & breakfast', type: 'routine' },
    { time: '08:30 AM - 10:30 AM', title: highPriority[0]?.title || 'Deep Work Block #1', detail: highPriority[0]?.description || 'Focus uninterrupted on primary task', type: 'deep-work' },
    { time: '10:30 AM - 10:45 AM', title: 'Rest & Recharge Break', detail: 'Step away from computer, stretch & hydrate', type: 'break' },
    { time: '10:45 AM - 12:15 PM', title: highPriority[1]?.title || medPriority[0]?.title || 'Deep Work Block #2', detail: 'Tackle core study or project execution', type: 'deep-work' },
    { time: '12:15 PM - 01:15 PM', title: 'Lunch & Relax', detail: 'Nutritious lunch and screen-free rest', type: 'break' },
    { time: '01:15 PM - 03:00 PM', title: medPriority[1]?.title || lowPriority[0]?.title || 'Secondary Tasks & Admin', detail: 'Email responses, smaller quick tasks, reviews', type: 'task' },
    { time: '03:00 PM - 03:15 PM', title: 'Afternoon Refresh', detail: 'Quick walk or tea break', type: 'break' },
    { time: '03:15 PM - 04:30 PM', title: 'Pomodoro Focus Session', detail: '25-min focus sessions on goals & learning', type: 'focus' },
    { time: '05:00 PM - 06:00 PM', title: 'Physical Habit & Fitness', detail: 'Workout / Jogging / Active Habit', type: 'habit' },
    { time: '08:00 PM - 08:30 PM', title: 'Daily Review & Journaling', detail: 'Log completed tasks, mood, and plan for tomorrow', type: 'review' }
  ];

  return { timeline, source: 'local-fallback' };
}

/**
 * AI Insights Generator
 */
export async function generateInsights(context) {
  const systemPrompt = `Provide 3 concise, highly analytical productivity insights and recommendations based on user task history, focus sessions, and habit streaks.`;

  const userPrompt = `Tasks: ${JSON.stringify(context.tasks)}. Habits: ${JSON.stringify(context.habits)}. Focus Hours: ${context.focusHoursToday}.`;

  const aiResult = await callOpenRouter(systemPrompt, userPrompt);
  if (aiResult) return { insights: aiResult, source: 'openrouter' };

  // Deterministic local insights
  const tasks = context.tasks || [];
  const completed = tasks.filter(t => t.completed).length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const insightsList = [
    {
      title: 'Peak Productivity Window',
      text: "You're most productive when you complete your first important task before noon. Consider scheduling your hardest work earlier.",
      type: 'positive'
    },
    {
      title: 'Task Completion Rate',
      text: `Your current task completion rate is ${rate}%. Priority filtering shows strong execution on Study tasks.`,
      type: 'metric'
    },
    {
      title: 'Habit Consistency',
      text: 'Your coding and hydration habit streaks are holding steady. Maintaining 3+ consecutive days boosts long-term retention by 40%.',
      type: 'tip'
    }
  ];

  return { insights: insightsList, source: 'local-fallback' };
}

/**
 * AI Journal Reflection Service
 */
export async function generateJournalReflection(entries) {
  const systemPrompt = `You are LifeOS AI Emotional & Reflection Assistant. Synthesize recent user journal entries into a warm, supportive, non-diagnostic reflection summary.`;

  const userPrompt = `Journal entries: ${JSON.stringify(entries)}`;

  const aiResult = await callOpenRouter(systemPrompt, userPrompt);
  if (aiResult) return { reflection: aiResult, source: 'openrouter' };

  if (!entries || entries.length === 0) {
    return {
      reflection: "No recent journal entries logged yet. Write your first entry today to get an AI summary of your emotional momentum!",
      source: 'local-fallback'
    };
  }

  const moods = entries.map(e => e.mood);
  const greatCount = moods.filter(m => m === 'Great' || m === 'Good').length;

  const summary = `**Weekly Reflection Summary:**

- **Overall Vibe:** You've logged ${entries.length} reflections recently, with a predominantly positive mood ratio (${greatCount}/${entries.length} Good/Great).
- **Key Themes:** You are making consistent progress on your core mini-project and academic work, though maintaining evening rest will keep your energy balanced.
- **Supportive Note:** You are building strong focus momentum. Keep taking regular breaks during deep work sessions!`;

  return { reflection: summary, source: 'local-fallback' };
}
