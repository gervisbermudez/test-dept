import { useEffect, useState } from "react";
import Card from "./components/Card";

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
      <header>
        <div className="d-flex p-3 bd-highlight justify-content-center">
          SpaceX
        </div>
      </header>
      <div className="container">
        {!launchesList.length ? (
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="row">
            {launchesList.map((launch) => {
              return (
                <div className="col" key={launch.rocket_id}>
                  <Card {...launch.rocket} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
