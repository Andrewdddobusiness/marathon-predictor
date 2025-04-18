import { predictMarathonTime } from "./actions/predict";
import { use } from "react";

export default function HomePage() {
  const prediction = use(predictMarathonTime());

  return (
    <main>
      <h1>Pace AI</h1>
      <p>{prediction}</p>
    </main>
  );
}
