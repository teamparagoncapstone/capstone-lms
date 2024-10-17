"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { Mic, StopCircle, Play } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ComprehensionList from "./comprehensionList";

interface VoiceExercise {
  id: string;
  voice: string;
  voiceImage: string;
  grade: string;
}

interface ScoreResponse {
  accuracy_score: number;
  pronunciation_score: number;
  fluency_score: number;
  speed_score: number;
  final_score: number;
  grade: string;
  phonemes: string[];
}

interface VoiceExercisesListProps {
  moduleTitle: string;
}

const VoiceExercisesList = ({ moduleTitle }: VoiceExercisesListProps) => {
  const [voiceExercises, setVoiceExercises] = useState<VoiceExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<VoiceExercise | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchVoiceExercises = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/voice-exercises?moduleTitle=${encodeURIComponent(
            moduleTitle
          )}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = (await response.json()) as VoiceExercise[];
        setVoiceExercises(data);
        if (data.length > 0) {
          setCurrentExercise(data[0]);
        }
      } catch (error) {
        console.error("Error fetching voice exercises:", error);
      }
    };

    fetchVoiceExercises();
  }, [moduleTitle]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = handleStopRecording;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    const blob = new Blob(recordedChunks.current, { type: "audio/webm" });

    if (blob.size === 0) {
      console.error("No audio recorded.");
      setError("No audio recorded. Please try again.");
      return;
    }

    audioUrlRef.current = URL.createObjectURL(blob);
    recordedChunks.current = [];
    setIsRecording(false);

    const formData = new FormData();
    formData.append("audio_blob", blob, "recorded_audio.webm");
    formData.append("expected_text", currentExercise?.voice || "");
    formData.append("voice_image", currentExercise?.voiceImage || "");
    formData.append("voice_exercises_id", currentExercise?.id || "");
    formData.append("student_id", session?.user?.studentId || "");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/voice-exercises-history",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error processing audio.");
      setScores(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error sending audio to server:", error);
      setError("Error processing audio. Please try again.");
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      startRecording();
    }
  };

  const resetExercise = () => {
    setIsRecording(false);
    recordedChunks.current = [];
    audioUrlRef.current = null;
    setScores(null);
    setError(null);
    setCurrentExercise(voiceExercises.length > 0 ? voiceExercises[0] : null);
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: 'url("/images/voice_bg.jpg")' }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-red-700 drop-shadow-lg">
        Voice Exercises
      </h1>
      {currentExercise && (
        <div className="mt-8">
          <label
            htmlFor="expectedText"
            className="block mb-2 text-lg font-semibold"
          >
            Say This:
          </label>
          {currentExercise.voiceImage && (
            <Image
              src={currentExercise.voiceImage}
              alt="Voice Exercise Illustration"
              className="mt-4 w-68 h-48 object-contain m-4"
            />
          )}
          <div
            id="expectedText"
            className="border p-4 rounded-lg bg-white flex items-center justify-center text-xl font-bold"
          >
            {currentExercise.voice}
          </div>

          <div className="mt-4 flex flex-col items-center space-y-4">
            <div className="mt-4 flex flex-col md:flex-row justify-between w-full">
              <div className="flex flex-col items-start mb-4 md:mb-0">
                <button
                  onClick={handleRecordingToggle}
                  className="flex items-center justify-center w-full md:w-48 h-12 rounded-lg bg-blue-400 hover:bg-blue-600 transition duration-200 md:mr-4"
                  aria-label={
                    isRecording ? "Stop Recording" : "Start Recording"
                  }
                >
                  {isRecording ? (
                    <StopCircle className="text-3xl text-white" />
                  ) : (
                    <Mic className="text-3xl text-white" />
                  )}
                  <span className="ml-2 text-white text-lg">
                    {isRecording ? "Stop" : "Start"}
                  </span>
                </button>
                <div className="text-center text-sm">
                  {isRecording ? "Recording..." : "Click to Start Recording"}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <button
                  onClick={resetExercise}
                  className="flex items-center justify-center w-full md:w-48 h-12 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition duration-200"
                  aria-label="Reset Exercise"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={handlePlay}
                className={`relative flex items-center justify-center w-48 h-12 rounded-lg bg-green-400 hover:bg-green-600 transition duration-200`}
                aria-label="Play Recorded Audio"
                disabled={!audioUrlRef.current}
              >
                <Play
                  className={`text-3xl text-white ${
                    isPlaying ? "animate-bounce" : ""
                  }`}
                />
                <span className="text-white ml-2 text-lg">Play Voice</span>
                {isPlaying && (
                  <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping" />
                )}
              </button>
              <audio ref={audioRef} src={audioUrlRef.current || ""} />
            </div>
          </div>

          {/* Display Error */}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      {/* Display Scores Button */}
      {scores && (
        <button
          onClick={() => setIsDialogOpen(true)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md p-2 transition duration-200"
          aria-label="View Scores"
        >
          View Scores
        </button>
      )}

      {/* Dialog for Scores */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="hidden" aria-label="Open Scores Dialog" />
        </DialogTrigger>
        <DialogContent className="bg-blue-200">
          <div className="rounded-lg bg-gradient-to-r from-pink-300 to-purple-500 shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-4xl font-bold text-black">
                🎉 Scores
              </DialogTitle>
              <DialogDescription className="text-lg text-black">
                Here are your scores for the exercise!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-black">
              {scores && (
                <div className="space-y-3">
                  <p className="text-xl">
                    Accuracy:{" "}
                    <span className="font-bold">
                      {scores.accuracy_score.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xl">
                    Pronunciation:{" "}
                    <span className="font-bold">
                      {scores.pronunciation_score.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xl">
                    Fluency:{" "}
                    <span className="font-bold">
                      {scores.fluency_score.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xl">
                    Speed:{" "}
                    <span className="font-bold">
                      {scores.speed_score.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xl">
                    Final Score:{" "}
                    <span className="font-bold">
                      {scores.final_score.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xl">
                    Grade: <span className="font-bold">{scores.grade}</span>
                  </p>
                  {scores.phonemes &&
                    Array.isArray(scores.phonemes) &&
                    scores.phonemes.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-lg">Phonemes:</h3>
                        {scores.phonemes.map((phoneme, index) => (
                          <div
                            key={index}
                            className="text-md bg-white text-blue-500 p-2 rounded-md shadow-sm"
                          >
                            Word {index + 1}: {phoneme}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            <DialogFooter>
              <ComprehensionList voice={currentExercise?.voice || ""} />
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-yellow-400 hover:bg-yellow-500  font-bold rounded-md p-2 mt-4 transition duration-200"
              >
                Close
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceExercisesList;
