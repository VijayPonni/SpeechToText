import { useState } from "react";
import "./App.css";
import useSpeechToText from "./hooks/useSpeechToText";
import { LANGUAGES_LIST } from "./constants/contants";

function App() {
  const [textInput, setTextInput] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("");

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    historyTexts,
  } = useSpeechToText({ continuous: true, lang: selectedLang });

  // console.log("HISTORY TEXT", historyTexts);

  const previousText = historyTexts
    .filter((element, index) => historyTexts.indexOf(element) === index)
    .reduce((prevValue, cum) => prevValue + " " + cum, "");

  const startStopListening = () =>
    isListening ? stopVoiceInput() : startListening();

  const stopVoiceInput = () => {
    setTextInput(
      (preValue) =>
        previousText +
        preValue +
        (transcript.length ? (preValue.length ? " " : "") + transcript : "")
    );
    stopListening();
  };

  const handletextInputValue = () => {
    return isListening
      ? textInput +
          (transcript.length ? (textInput.length ? " " : "") + transcript : "")
      : textInput;
    // return isListening
    //   ? textInput +
    //       (transcript.length
    //         ? previousText + (textInput.length ? " " : "") + transcript
    //         : "")
    //   : textInput;
  };

  return (
    <>
      <div>
        <button
          className={`text-yellow-300 ${
            isListening ? "bg-red-500" : "bg-green-500"
          } px-5 mb-5`}
          onClick={() => {
            startStopListening();
          }}
        >
          {isListening ? "Stop Listening" : "Speak"}
        </button>
        <br />
        <select
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
        </select>

        <textarea
          className="border-2 border-green-800 w-full h-98"
          name=""
          id=""
          style={{ height: "200px" }}
          value={
            isListening
              ? textInput +
                (transcript.length
                  ? (textInput.length ? " " : "") + transcript
                  : "")
              : textInput
          }
          // value={handletextInputValue()}
          disabled={isListening}
          onChange={(event) => {
            console.log("event", event);
            setTextInput(event.target.value);
          }}
        ></textarea>
      </div>
    </>
  );
}

export default App;
