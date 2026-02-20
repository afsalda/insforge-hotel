import { useState } from 'react';
import { Waves, Mountain, Palmtree, Gem, Building, UtensilsCrossed, Tent, Castle, Flame, TreePine, Sailboat, Home as HomeIcon } from 'lucide-react';

const CATEGORIES = [
    { id: 'cabins', label: 'Cabins', icon: <HomeIcon size={24} /> },
    { id: 'pools', label: 'Amazing pools', icon: <Waves size={24} /> },
    { id: 'beachfront', label: 'Beachfront', icon: <Palmtree size={24} /> },
    { id: 'islands', label: 'Islands', icon: <Sailboat size={24} /> },
    { id: 'luxe', label: 'Luxe', icon: <Gem size={24} /> },
    { id: 'trending', label: 'Trending', icon: <Flame size={24} /> },
    { id: 'treehouses', label: 'Treehouses', icon: <TreePine size={24} /> },
    { id: 'camping', label: 'Camping', icon: <Tent size={24} /> },
    { id: 'castle', label: 'Castles', icon: <Castle size={24} /> },
    { id: 'mountains', label: 'Mountains', icon: <Mountain size={24} /> },
    { id: 'city', label: 'City stays', icon: <Building size={24} /> },
    { id: 'breakfast', label: 'Breakfast', icon: <UtensilsCrossed size={24} /> },
];

export default function Categories({ active, onChange }) {
    return (
        <div className="categories-bar">
            {CATEGORIES.map(cat => (
                <div
                    key={cat.id}
                    className={`category-item ${active === cat.id ? 'active' : ''}`}
                    onClick={() => onChange(cat.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={cat.label}
                >
                    {cat.icon}
                    <span>{cat.label}</span>
                </div>
            ))}
        </div>
    );
}
