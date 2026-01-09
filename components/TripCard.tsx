import {Link, useLocation} from "react-router";
import {ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";
import {cn, getFirstWord} from "@/lib/utils";
import type { DashboardTrip, TripCardProps } from '~/index';

// Support both old format (trip object) and new format (individual props)
const TripCard = (props: { trip: DashboardTrip } | TripCardProps) => {
    const path = useLocation();
    
    // Handle both prop formats
    let id: string;
    let name: string;
    let location: string;
    let imageUrl: string;
    let tags: string[];
    let price: string;

    if ('trip' in props) {
        // Old format with trip object
        const trip = props.trip;
        id = trip.id.toString();
        name = trip.name;
        location = trip.itinerary?.[0]?.location || 'Unknown Location';
        imageUrl = trip.imageUrls?.[0] || '/assets/images/sample.jpeg';
        tags = trip.tags || [];
        price = trip.estimatedPrice;
    } else {
        // New format with individual props
        id = props.id;
        name = props.name;
        location = props.location;
        imageUrl = props.imageUrl;
        tags = props.tags || [];
        price = props.price;
    }

    return (
        <Link to={path.pathname === '/' || path.pathname.startsWith('/travel') ? `/travel/${id}` : `/trips/${id}`} className="trip-card">
            <img src={imageUrl} alt={name} />

            <article>
                <h2>{name}</h2>
                <figure>
                    <img
                        src="/assets/icons/location-mark.svg"
                        alt="location" className="size-4"
                    />
                    <figcaption>{location}</figcaption>
                </figure>
            </article>

            <div className="mt-5 pl-[18px] pr-3.5 pb-5">
                <ChipListComponent id="travel-chip">
                    <ChipsDirective>
                        {tags?.map((tag, index) => (
                            <ChipDirective
                                key={index}
                                text={getFirstWord(tag)}
                                cssClass={cn(index===1
                                ? '!bg-pink-50 !text-pink-500'
                                : '!bg-success-50 !text-success-700')}
                            />
                        ))}
                    </ChipsDirective>
                </ChipListComponent>
            </div>

            <article className="tripCard-pill">{price}</article>
        </Link>
    )
}
export default TripCard
