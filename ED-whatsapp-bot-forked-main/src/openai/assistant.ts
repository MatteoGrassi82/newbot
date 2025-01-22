// import the required dependencies
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

require("dotenv").config();
const OpenAI = require("openai");
// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai_assistant_id = process.env.OPENAI_ASSISTANT_ID;
const openai = new OpenAI({
    apiKey: secretKey,
});
import { ConversationHistory } from './types';
const conversationHistory: ConversationHistory = new Map();

async function getGPTResponse({ clientMessage, sender, trainingPrompt }: { clientMessage: string, sender: string, trainingPrompt?: string }): Promise<string> {
    try {
        // Create a thread

        // Check if a thread ID exists in local storage
        let threadId = localStorage.getItem(`${sender}_threadId`);
        let xxxx = localStorage.getItem(`${sender}_threadId`);
        console.log("=====>,======thread=================>", xxxx);
        // console.log("=====>,=========sender sender==============>", sender);
        // If threadId is not found in local storage, create a new thread
        if (!threadId) {
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
            // Save the thread ID to local storage
            localStorage.setItem(`${sender}_threadId`, threadId);
        }
        // Pass in the user question into the existing thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: clientMessage,
        });
        // Use runs to wait for the assistant response and then retrieve it
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: openai_assistant_id,
        });

        let actualRun = await openai.beta.threads.runs.retrieve(
            threadId,
            run.id,
        );

        // Polling mechanism to see if actualRun is completed
        // This should be made more robust.
        while (
            actualRun.status === "queued" ||
            actualRun.status === "in_progress" ||
            actualRun.status === "requires_action"
        ) {
            // keep polling until the run is completed
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            actualRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
        }
        // Get the last assistant message from the messages array
        const messages = await openai.beta.threads.messages.list(threadId);

        // Find the last message for the current run
        const lastMessageForRun = messages.data
            .filter(
                (message: any) =>
                    message.run_id === run.id && message.role === "assistant",
            )
            .pop();

        // If an assistant message is found, console.log() it
        if (lastMessageForRun) {
            const messageValue = lastMessageForRun.content[0] as {
                text: { value: string };
            };

            const answer = messageValue?.text?.value;
            // console.log("======>", answer)
            // conversationHistory.set(sender, [...messages, { role: 'assistant', content: answer }]);
            return answer
        }
        else {
            return ""
        }

    } catch (error) {
        console.error('Error with ChatGPT: ', error);
        return 'The servers are currently experiencing high demand. Please try again in a few minutes.' + error;
    }
}

export default {
    getGPTResponse,
    // sendGPTResponse,
    // conversationHistory,
};

