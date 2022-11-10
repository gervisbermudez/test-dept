/* eslint-disable jsx-a11y/anchor-is-valid */
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

  const [showFavorites, setShowFavorites] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState({});

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

  let filteredLaunchesList = [...launchesList];

  if (searchTerm.length) {
    filteredLaunchesList = filteredLaunchesList.filter((launch) => {
      return launch.mission_name.indexOf(searchTerm) !== -1;
    });
  }

  console.log({ filteredLaunchesList });
  return (
    <div className="App">
      {showModal ? (
        <>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </button>
          {JSON.stringify(selectedLaunch)}
          {Object.keys(selectedLaunch).map((e) => {
            return (
              <div key={selectedLaunch.flight_number}>
                {e}:
                {typeof selectedLaunch[e] === "string"
                  ? selectedLaunch[e]
                  : JSON.stringify(selectedLaunch[e])}{" "}
                <br />
              </div>
            );
          })}
        </>
      ) : (
        <>
          <header>
            <div className="d-flex p-3 bd-highlight justify-content-center">
              SpaceX
            </div>
          </header>
          <div className="container">
            <div className="row">
              <div className="col">Launches</div>
              <div>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="addon-wrapping"
                    value={searchTerm}
                    onChange={({ target }) => {
                      target.value
                        ? setSearchTerm(target.value)
                        : setSearchTerm("");
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <nav className="nav">
                <a
                  onClick={() => setShowFavorites(false)}
                  className={`nav-link ${!showFavorites ? "active" : ""}`}
                >
                  All
                </a>
                <a
                  className={`nav-link ${showFavorites ? "active" : ""}`}
                  onClick={() => setShowFavorites(true)}
                >
                  favourites
                </a>
              </nav>
            </div>

            {showFavorites ? (
              <div>
                {!filteredLaunchesList.length ? (
                  <div className="d-flex p-3 bd-highlight justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filteredLaunchesList
                      .filter((launch) => {
                        return launch.rocket.is_favorite;
                      })
                      .map((launch) => {
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
            ) : (
              <div>
                {!filteredLaunchesList.length ? (
                  <div className="d-flex p-3 bd-highlight justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filteredLaunchesList.map((launch) => {
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
                            onClickShowDetails={() => {
                              setSelectedLaunch(launch);
                              setShowModal(true);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
