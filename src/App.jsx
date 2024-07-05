import SummaryAI from './Components/InputForm';

const App = () => {
  const sampleData = {
    importantQuestions: [
      {
        question: "What is the main topic of the document?",
        answer: "The document primarily discusses climate change and its impact on global ecosystems."
      },
      {
        question: "What are the key findings mentioned?",
        answer: "The key findings include rising global temperatures, melting polar ice caps, and increasing frequency of extreme weather events."
      }
    ],
    summary: "This document provides an overview of climate change, its causes, and its effects on the environment. It emphasizes the urgent need for global action to mitigate the impacts of climate change.",
    notes: [
      "Greenhouse gas emissions are the primary driver of climate change",
      "The Paris Agreement aims to limit global temperature increase to well below 2°C",
      "Renewable energy adoption is crucial for reducing carbon emissions"
    ],
    additionalInfo: "For more information on climate change and its impacts, visit the IPCC (Intergovernmental Panel on Climate Change) website."
  };

  return (
    <div className="App">
      <SummaryAI sampleData={sampleData} />
    </div>
  );
};

export default App;