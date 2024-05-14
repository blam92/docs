export interface Friend {
    id: number;
    name: string;
    image: string;
    available: boolean;
}

export const friends: Friend[] = [
    { id: 1, name: 'Santi', image: '/nico.png', available: true },
    { id: 2, name: 'Lopi', image: '/nico.png', available: false },
    { id: 3, name: 'Nico', image: '/nico.png', available: true },
    { id: 4, name: 'Juane', image: '/nico.png', available: false },
    { id: 5, name: 'Phillip', image: '/nico.png', available: true },
    { id: 6, name: 'Kevo', image: '/nico.png', available: false },
];
  