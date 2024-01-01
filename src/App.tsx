import { useCallback, useEffect, useState } from "react";
import Data from "./types/data";
import firebaseConfig from "./util/firebase-config";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import determineStressLevel from "./util/stress-converter";
import InstallPWA from "./install-button";

function App() {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [dataState, setDataState] = useState<Data>({
    gsr: 0,
    heartRate: 0,
    bodyTemp: 0,
  });

  const getData = useCallback(() => {
    const gsr = ref(database, "/gsr");
    const heartRate = ref(database, "/heartRate");
    const bodyTemp = ref(database, "/temp");

    onValue(gsr, (snapshot) => {
      const data = snapshot.val();
      setDataState((prevState) => {
        return { ...prevState, gsr: data };
      });
    });
    onValue(heartRate, (snapshot) => {
      const data = snapshot.val();
      setDataState((prevState) => {
        return { ...prevState, heartRate: data };
      });
    });
    onValue(bodyTemp, (snapshot) => {
      const data = snapshot.val();
      setDataState((prevState) => {
        return { ...prevState, bodyTemp: data };
      });
    });
  }, [database]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className="position-absolute"
      style={{
        maxWidth: "500px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <section className="container rounded-2 border border-dark p-5">
        <h2 className="mb-4 border-bottom border-black">
          Stress Monitoring System Feedback
        </h2>
        <div>
          <i>Project of Group 7</i>
        </div>
        <section
          style={{ fontSize: "1.2rem" }}
          className="mt-4 d-flex flex-column gap-3"
        >
          <div>
            GSR: <b>{dataState.gsr}</b>
          </div>
          <div>
            Heart Rate: <b>{dataState.heartRate}</b>
          </div>
          <div>
            Body Temperature: <b>{dataState.bodyTemp}</b>
          </div>
          <div>
            Stress Level:{" "}
            <b>
              {determineStressLevel(
                dataState.gsr!,
                dataState.heartRate!,
                dataState.bodyTemp!
              )}
            </b>
          </div>
        </section>
      </section>
      <section className="mt-2" style={{ textAlign: "right" }}>
        <InstallPWA />
      </section>
    </main>
  );
}

export default App;
