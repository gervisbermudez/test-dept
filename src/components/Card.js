import React from "react";

export default function Card({
  rocket_name,
  description,
  first_flight,
  flickr_images,
}) {
  const cardImageUrl = flickr_images.length
    ? flickr_images[0]
    : "/img/default.jpg";
  return (
    <div classn="card" style={{ width: "18rem" }}>
      <img src={cardImageUrl} className="card-img-top" alt={rocket_name} />
      <div className="card-body">
        <h5 className="card-title">{rocket_name}</h5>
        <p className="card-text">{description}</p>
        <span>{first_flight}</span>
      </div>
    </div>
  );
}
