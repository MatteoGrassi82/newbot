import dotenv from 'dotenv';
require("dotenv").config();
import OpenAI from "openai";
// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});
import ffmpeg from 'fluent-ffmpeg';

const fs = require('fs');

if (process.env.FFMPEG_PATH) ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
dotenv.config();

async function createFile(path: string): Promise<File> {
  const data = await fs.readFile(path);

  // Extract file name from the path
  const fileName = decodeURIComponent(path.split('/').pop() || 'unknown');

  // Extract file extension and determine MIME type
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    // Add more mappings as needed
  };
  const fileType = mimeTypes[fileExtension] || 'application/octet-stream';

  const metadata = {
    type: fileType,
  };

  return new File([data], fileName, metadata);
}
async function sendAudioForTranscription(file_path: string) {

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(`${file_path}`),
    model: "whisper-1",
  });

  console.log(transcription.text);
  return transcription.text;
}
// async function sendAudioForTranscription_origin(file_path: string) {
//   try {
//     const audioStream = fs.createReadStream(file_path);
//     const response = await openai.createTranscription(audioStream, 'whisper-1');
//     const transcribed = response.data.text;

//     return transcribed;
//   } catch (error) {
//     console.error('Error transcribing the audio:', error);
//     return null;
//   }
// }
async function convertAudioToMp3(inputPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .inputOption(
        '-headers', 'Authorization: Basic ' + process.env.AUTH_HEADER
      )
      .format('mp3')
      .on('error', (err: Error) => {
        console.log('Error in Converstion:', err);
        reject(err);
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .save(outputPath);
  });
}

export default {
  sendAudioForTranscription,
  convertAudioToMp3,
};
