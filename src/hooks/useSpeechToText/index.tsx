/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

const useSpeechToText = (options: any) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [historyTexts, setHistoryTexts] = useState<string[]>([""]);

  const recongnitionRef = useRef<any>(null);
  const isMannualStop = useRef<any>(false);
  const isNoSpeechDetected = useRef<any>(false);
  const inActivityTimer = useRef<any>(null);

  function handleWenbSpeech() {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web speech API is not supported!");
      return;
    }

    recongnitionRef.current = new (window as any).webkitSpeechRecognition();
    const recognition = recongnitionRef.current;
    recognition.interimResults = options.interimResuts || true;
    recognition.lang = options.lang || "en-US";
    recognition.continuous = options.continuous || false;

    if ("webSpeechGrammarList" in window) {
      const grammar =
        "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : | ;";

      const speechRecongnitionList = new (window as any).webSpeechGrammarList();
      speechRecongnitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecongnitionList;
    }

    // recognition.onaudiostart = () => {
    //   console.log("Audio capturing started", new Date());
    // };

    // recognition.onaudioend = () => {
    //   console.log("Audio capturing ended", new Date());
    // };

    // recognition.onnomatch = () => {
    //   console.error("Speech not recognized", new Date());
    // };

    // recognition.onsoundend = (event: any) => {
    //   console.log("Sound has stopped being received", event, new Date());
    // };

    // recognition.onsoundstart = () => {
    //   console.log("Some sound is being received", new Date());
    // };

    // recognition.onspeechend = () => {
    //   console.log("Speech has stopped being detected", new Date());
    // };

    // recognition.onspeechstart = () => {
    //   console.log("Speech has been detected", new Date());
    // };

    recognition.onresult = (event: any) => {
      // console.log("EVENT", event);
      let liveTranscript: string = "";

      // Reset the inactivity timer whenever a new result is received
      if (inActivityTimer.current) {
        clearTimeout(inActivityTimer.current);
      }

      for (let i = 0; i < event.results.length; i++) {
        liveTranscript += event.results[i][0].transcript;
      }

      // console.log("event Results Array", event.results);

      // if (event.results[event.results.length - 1].isFinal) {
      //   // console.log(
      //   //   "**************************LAST ELEMENTS VALUE IS IS FINAL VALUE IS TRUE**************************************"
      //   // );
      //   // console.log("isMannualStop", isMannualStop.current);
      //   if (!isMannualStop.current) {
      //     setHistoryTexts((preValue) => [...preValue, liveTranscript]);
      //     recognition.stop();
      //   }
      // }

      setTranscript(liveTranscript);

      // inActivityTimer.current = setTimeout(() => {
      //   console.log(
      //     "XXXXXXXXXXXXXXXXXXXXXXXX RESTARTING DUE TO  INACIVITY XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      //   );
      //   console.log(
      //     "ISM  ANNUAL STOP in NEW RESET LOGIC",
      //     isMannualStop.current
      //   );

      //   console.log("liveTranscript", liveTranscript.trim());
      //   if (!isMannualStop.current) {
      //     setHistoryTexts((preValue) => [...preValue, liveTranscript.trim()]);
      //     console.log("STOP", new Date());
      //     recognition.stop();
      //   }
      // }, 2000);
    };

    recognition.onerror = (event: any) => {
      console.error("error", event.error);
      if (event.error == "no-speech") {
        isNoSpeechDetected.current = true;
        recognition.stop();
      }
    };

    recognition.onend = () => {
      console.log("ON END WORKS!...  ", new Date(), isMannualStop.current);
      setIsListening(false);
      // restart logic
      // if (!isMannualStop.current) {
      //   // Cheeck no speech detected

      //   if (isNoSpeechDetected.current) {
      //     setIsListening(false);
      //   } else {
      //     console.log("RESTART", new Date());
      //     recognition.start();
      //     setIsListening(true);
      //   }
      // } else {
      //   console.log("ELSE works");
      //   setIsListening(false);
      // }
    };
  }

  useEffect(() => {
    handleWenbSpeech();
    return () => {
      recongnitionRef.current.stop();
    };
  }, [options.continuous, options.interimResuts, options.lang]);

  const startListening = () => {
    console.log("start listening works!");
    if (recongnitionRef.current && !isListening) {
      recongnitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recongnitionRef.current && isListening) {
      console.log("stop Listening works");
      recongnitionRef.current.stop();
      setIsListening(false);
      isMannualStop.current = true;
    }
  };

  return {
    startListening,
    stopListening,
    isListening,
    transcript,
    historyTexts,
  };
};

export default useSpeechToText;
