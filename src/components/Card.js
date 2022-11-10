import React from "react";

export default function Card({
  rocket_name,
  description,
  first_flight,
  flickr_images,
  is_favorite,
  flight_number,
  onClickSetFavorite,
  onClickRemoveFavorite,
}) {
  const cardImageUrl = flickr_images.length
    ? flickr_images[0]
    : "/img/default.jpg";

  return (
    <div className="card m-1" style={{ width: "18rem" }}>
      <img src={cardImageUrl} className="card-img-top" alt={rocket_name} />
      <div className="card-body">
        <h5 className="card-title">{rocket_name}</h5>
        <p className="card-text  text-truncate">{description}</p>
        <span>{first_flight}</span>
        {!is_favorite ? (
          <i className="bi bi-star" onClick={onClickSetFavorite}></i>
        ) : (
          <i
            className="bi bi-star-fill"
            onClick={() => {
              onClickRemoveFavorite(flight_number);
            }}
          ></i>
        )}
      </div>
    </div>
  );
}
