import OpenAI from 'openai';


const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!, 
});

export async function GET(req: Request) {
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o', // Model you're using
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    });
    console.log("completion",completion);
    
    const message = completion.choices[0].message.content;

    return new Response(JSON.stringify({ success: true, message }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Error fetching message' }), { status: 500 });
  }
}
