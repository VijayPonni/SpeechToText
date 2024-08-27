import "./App.css";
import "regenerator-runtime/runtime";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";

function App() {
  const [textInput, setTextInput] = useState<string>("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSpeak = () => {
    console.log("handleSpeak works", listening);
    return listening
      ? SpeechRecognition.stopListening()
      : SpeechRecognition.startListening({ continuous: true });
  };

  useEffect(() => {
    console.log("listening from HOOK", listening);
  }, [listening]);

  return (
    <>
      <div>
        <button
          className={`text-yellow-300 px-5 mb-5 ${
            listening ? "bg-red-500" : "bg-green-500"
          }`}
          onClick={() => handleSpeak()}
        >
          {listening ? "Stop speaking" : "Speak"}
        </button>
        <br />
        {/* <select
          name=""
          id=""
          value={selectedLang}
          onChange={(event) => setSelectedLang(event.target.value)}
        >
          {LANGUAGES_LIST.map((language) => {
            return (
              <option key={language.name} value={language.code}>
                {language.name}
              </option>
            );
          })}
        </select> */}

        <textarea
          className="border-2 border-green-800 w-full h-98"
          name=""
          id=""
          style={{ height: "200px" }}
          value={transcript}
          disabled={listening}
          onChange={(event) => {
            setTextInput(event.target.value);
          }}
        ></textarea>
      </div>
    </>
  );
}

export default App;
