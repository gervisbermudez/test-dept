import { useEffect, useState } from "react";

const launches_api_url = "https://api.spacexdata.com/v3/launches";
const rockets_api_url = "https://api.spacexdata.com/v3/rockets";

function App() {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState([]);
  const [launchesList, setLaunchesList] = useState([]);

  useEffect(() => {
    //fetching data
    fetch(launches_api_url)
      .then((response) => response.json())
      .then((response) => {
        setLaunches(response);
        console.log({ response_launches: response });
      });

    //fetching data
    fetch(rockets_api_url)
      .then((response) => response.json())
      .then((response) => {
        setRockets(response);
        console.log({ response_rockets: response });
      });
  }, []);

  useEffect(() => {
    if (launches.length && rockets.length) {
      //do merge here
      let tempRockets = {};
      rockets.forEach((rocket) => {
        tempRockets[rocket.rocket_id] = rocket;
      });
      let mergedLaunches = launches.map((launch) => {
        return {
          ...launch,
          rocket: {
            ...launch.rocket,
            ...tempRockets[launch.rocket.rocket_id],
          },
        };
      });
      console.log({ mergedLaunches });
      setLaunchesList(mergedLaunches);
    }
  }, [launches, rockets]);

  return (
    <div className="App">
      <header>Hola</header>
      <div className="container">{JSON.stringify(launchesList)}</div>
    </div>
  );
}

export default App;
