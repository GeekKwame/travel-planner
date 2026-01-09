import { Header } from "../../../components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "@/lib/utils";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { getUser } from "~/lib/auth";
import { useNavigate, useLoaderData } from "react-router";
import type { TripFormData } from "~/index";

interface Country {
    name: string;
    coordinates: [number, number];
    value: string;
    openStreetMap: string;
}

interface CreateTripResponse {
    id?: string;
    error?: string;
}

export const clientLoader = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag,latlng,maps');

        if (!response.ok) {
            console.error('Failed to fetch countries:', response.statusText);
            // Return a default country list if API fails
            return [{
                name: "🇺🇸 United States",
                coordinates: [37.09024, -95.712891],
                value: "United States",
                openStreetMap: "https://www.openstreetmap.org/relation/148838"
            }];
        }

        const data = await response.json();

        return data.map((country: any) => ({
            name: country.flag + " " + country.name.common,
            coordinates: country.latlng || [0, 0],
            value: country.name.common,
            openStreetMap: country.maps?.openStreetMap || "",
        }));
    } catch (error) {
        console.error('Error loading countries:', error);
        // Return fallback data
        return [{
            name: "🇺🇸 United States",
            coordinates: [37.09024, -95.712891],
            value: "United States",
            openStreetMap: "https://www.openstreetmap.org/relation/148838"
        }];
    }
}

// Export loader for SSR compatibility
export const loader = clientLoader;

const CreateTrip = () => {
    const loaderData = useLoaderData<typeof clientLoader>();
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true);

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType
        ) {
            setError('Please provide values for all fields');
            setLoading(false)
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError('Duration must be between 1 and 10 days');
            setLoading(false)
            return;
        }

        let user;
        try {
            user = await getUser();
            if (!user) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }
        } catch (e) {
            console.error('Error fetching user', e);
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        const isAdminFlow = window.location.pathname.startsWith('/admin');

        try {
            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.id
                })
            })

            const result: CreateTripResponse = await response.json();

            if (result?.id) {
                if (isAdminFlow) {
                    navigate(`/admin/trip/${result.id}`); // Redirect to admin trip details
                } else {
                    navigate(`/travel/${result.id}`); // Redirect to public travel details
                }
            }
            else {
                console.error('Failed to generate a trip');
                setError(result.error || 'Failed to generate trip');
            }
        } catch (e) {
            console.error('Error generating trip', e);
            setError('Error generating trip');
        } finally {
            setLoading(false)
        }
    };

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({ ...formData, [key]: value })
    }
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }))

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]

    const isPublicView = !window.location.pathname.startsWith('/admin');

    return (
        <main className={cn("flex flex-col gap-10 pb-20 wrapper", { "pt-32": isPublicView })}>
            <Header title="Design Your AI Trip" description="Fill in your preferences and let our AI curate the perfect itinerary for you." />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange('country', e.value)
                                }
                            }}
                            allowFiltering
                            filtering={(e: any) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries.filter((country) => country.name.toLowerCase().includes(query)).map(((country) => ({
                                        text: country.name,
                                        value: country.value
                                    })))
                                )
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) => handleChange('duration', Number(e.target.value))}
                        />
                    </div>

                    {selectItems.map((key: keyof TripFormData) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item: string) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: 'text', value: 'value' }}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(key, e.value)
                                    }
                                }}
                                allowFiltering
                                filtering={(e: any) => {
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item: string) => item.toLowerCase().includes(query))
                                            .map((item: string) => ({
                                                text: item,
                                                value: item,
                                            })))
                                }}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {error && (
                        <div className="error">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
                    <footer className="px-6 w-full">
                        <ButtonComponent type="submit"
                            className="bg-primary-600 text-white !h-12 !w-full rounded-md hover:bg-primary-700 transition-colors" disabled={loading}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", { 'animate-spin': loading })} />
                                <span className="font-semibold text-lg text-white">
                                    {loading ? 'Generating...' : 'Generate Trip'}
                                </span>
                            </div>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    )
}

export default CreateTrip
