import { useParams } from 'react-router-dom';
import { allTrips } from '../../constants';

const TripDetails = () => {
  const { id } = useParams();
  const trip = allTrips.find((t) => t.id === Number(id));

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div>
      <h1>{trip.name}</h1>
      <img src={trip.imageUrls[0]} alt={trip.name} />
      <p>Travel Style: {trip.travelStyle}</p>
      <p>Estimated Price: {trip.estimatedPrice}</p>
    </div>
  );
};

export default TripDetails;
