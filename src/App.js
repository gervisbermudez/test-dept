import { useEffect, useState } from "react";
import Card from "./components/Card";
import { storage } from "./utils";

const launches_api_url = "https://api.spacexdata.com/v3/launches";
const rockets_api_url = "https://api.spacexdata.com/v3/rockets";

const favorites_launches = storage.get("favorites_launches") || [];

function App() {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState([]);
  const [launchesList, setLaunchesList] = useState([]);

  const [favorites, setFavorites] = useState(favorites_launches);

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
            is_favorite: favorites.includes(launch.flight_number),
          },
        };
      });
      console.log({ mergedLaunches, favorites });
      setLaunchesList(mergedLaunches);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launches, rockets, favorites]);

  const addFavoriteLaunche = (flight_number) => {
    console.log("addFavoriteLaunche", flight_number);
    setFavorites([...favorites, flight_number]);
    storage.set("favorites_launches", [...favorites, flight_number]);
  };

  const removeFavoriteLaunche = (flight_number) => {
    const index = favorites.indexOf(flight_number);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    setFavorites([...favorites]);
    storage.set("favorites_launches", [...favorites]);
  };

  return (
    <div className="App">
      <header>
        <div className="d-flex p-3 bd-highlight justify-content-center">
          SpaceX
        </div>
      </header>
      <div className="container">
        {!launchesList.length ? (
          <div className="d-flex p-3 bd-highlight justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {launchesList.map((launch) => {
              return (
                <div
                  className="col"
                  key={launch.launch_date_utc + launch.flight_number}
                >
                  <Card
                    flight_number={launch.flight_number}
                    {...launch.rocket}
                    onClickSetFavorite={() => {
                      addFavoriteLaunche(launch.flight_number);
                    }}
                    onClickRemoveFavorite={() => {
                      removeFavoriteLaunche(launch.flight_number);
                    }}
                  />
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
