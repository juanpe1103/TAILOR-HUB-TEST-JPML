'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import RestaurantCard from '@/components/RestaurantCard';
import Spinner from '@/components/Spinner';
import { useData } from '@/lib/store';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
    const {
        restaurants,
        loading,
        fetchRestaurants,
        selectedRestaurantId,
        setSelectedRestaurantId,
    } = useData();

    useEffect(() => {
        fetchRestaurants().catch((e) => {
            alert(e.message || "Error cargando restaurantes");
        });
    }, [fetchRestaurants]);

    useEffect(() => {
        if (!selectedRestaurantId || loading) return;
        const el = cardRefs.current[selectedRestaurantId];
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [selectedRestaurantId, loading]);

    // refs de cada card (para centrarla en la lista)
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const registerRef = (id: number) => (el: HTMLDivElement | null) => {
        cardRefs.current[id] = el;
    };
    
    const listRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="grid gap-6 md:grid-cols-[1.2fr,1fr] h-[calc(100vh-64px)]">
            {/* MAPA */}
            <section className="relative rounded-2xl overflow-hidden border border-card-border shadow-card isolate z-0">
                <Map
                    className="absolute inset-0 z-0"
                    markers={restaurants.map(r => ({ id: r.id, lat: r.lat, lng: r.lng, name: r.name }))}
                    dark
                    onMarkerSelect={(id) => setSelectedRestaurantId(id)}
                />
            </section>

            {/* LISTA */}
            <aside className="flex flex-col min-h-0">
                <div
                    ref={listRef}
                    className="flex-1 pr-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-4">
                            {restaurants.map((r) => (
                                <div key={r.id} ref={registerRef(r.id)}>
                                    <RestaurantCard r={r} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}